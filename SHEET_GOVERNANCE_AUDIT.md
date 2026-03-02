# Google Sheet 文案治理稽核報告（2026-03-02）

## 稽核結論
- 目前資料流已是「遠端 Google Sheet 優先、`site-data` 本機備援」。
- 主內容（`seo/brand/menu/trust/order/footer/floatingBtn`）可由遠端資料驅動。
- 仍有系統文案與首屏 SEO 分散在前端，尚未完全單一真源。

## 已由 Sheet 管理
- Apps Script 組裝資料： [google-apps-script-template.gs](google-apps-script-template.gs#L1-L104)
- 前端抓取與套用： [script.js](script.js#L89-L151)、[script.js](script.js#L151-L644)
- 本機備援資料： [site-data.js](site-data.js#L63-L120)

## 未完全由 Sheet 管理（散落點）
- 首屏 SEO 與 OG： [index.html](index.html#L6-L17)
- 導覽/載入/錯誤/Lightbox 固定文案： [index.html](index.html#L33-L41)、[index.html](index.html#L88-L116)
- 分享與提示詞硬編碼： [script.js](script.js#L253-L255)、[script.js](script.js#L505)、[script.js](script.js#L560-L569)

## 主要風險
- 品牌詞在多處不一致（「多多手作」與「多多手作烘培」並存）。
- 文件示例、備援資料、遠端資料可能長期漂移。
- 遠端失敗時可能回退舊文案，造成使用者看到不同版本。

## 決策（已確認）
- 範圍：全部文案（含錯誤訊息、系統字串、ARIA）納入 Sheet。
- 備援策略：採「最小備援」，遠端資料作為唯一真源。

## 落地計畫（DRAFT）
1. 在 `site` 頁籤新增 `ui.* / nav.* / lightbox.* / share.* / error.* / loading.*` keys。  
2. 擴充 Apps Script 回傳 `ui`、`nav` 區塊（相容既有結構）。  
3. 前端將 [index.html](index.html#L33-L41) 與 [index.html](index.html#L88-L116) 固定文案改為動態套值。  
4. 移除 [script.js](script.js#L560-L569) 等硬編碼字串，改讀字典。  
5. 將 [site-data.js](site-data.js#L63-L120) 收斂為最小必要備援。  
6. 同步更新維護文件： [MOBILE_CONTENT_SETUP.md](MOBILE_CONTENT_SETUP.md#L88-L110)

## 驗證方式
- 正常網路、慢網、斷網三情境都要顯示同一版品牌與文案。
- 比對遠端快照與首屏顯示，確認沒有舊字樣殘留。
- 強制遠端失敗時，只用最小備援且文字仍一致。
