# 本地文案方案（完全取代 Google Sheet）

> ✅ **遷移完成日期**：2026年3月5日  
> 本方案已完全實施，專案現採用本地 site-data.js 作為唯一內容真源。

## 文件目的

本文件定義「完全本地化」的內容管理方案，目標是移除 Google Sheet 與 Apps Script 依賴，改由專案內單一資料檔維護所有文案與內容。

---

## 1. 方案摘要

### 推薦方案：單一本地資料檔（site-data.js）

- 以 site-data.js 作為唯一內容真源（Single Source of Truth）。
- 前端只讀本地資料，不再嘗試遠端抓取。
- 移除回退邏輯與 SEO 快取邏輯，避免多來源造成不一致。

### 為何選這個方案

- 改動最小，能直接沿用既有 window.siteData 綁定。
- 適合小型靜態網站與 Windows 本機編輯流程。
- 不依賴外部 API，首屏穩定、斷網可用。
- 降低資料漂移與維運複雜度。

---

## 2. 實施完成狀態

### ✅ 已改造完成的資料流

1. ✅ script.js 只讀取本地 siteData（window.siteData）
2. ✅ 完全移除遠端 API 調用（fetchRemoteSiteData）
3. ✅ 移除回退邏輯與 SEO localStorage 快取
4. ✅ 所有文案集中於 site-data.js 的 ui 字典

### 改造涉及的檔案

- ✅ index.html：結構完整，無硬編碼文案
- ✅ script.js：遠端邏輯已移除，new applyUiText() 函數支持文案動態化
- ✅ site-data.js：新增 ui 字典，包含導航、載入、錯誤、燈箱、分享、無障礙提示
- ✅ google-apps-script-template.gs：已停用，移至 _archived 資料夾
- ✅ remote-site-data.json：已停用，移至 _archived 資料夾
- ✅ SHEET_GOVERNANCE_AUDIT.md：已刪除
- ✅ MOBILE_CONTENT_SETUP.md：已刪除

---

## 3. 前期現況（已完成遷移）

### 原始資料流（已不使用）

1. ~~script.js 讀取 localSiteData 與 remoteConfig~~ → ✅ 現在只讀 localSiteData
2. ~~優先抓取 Google Apps Script API~~ → ✅ 已移除
3. ~~成功用遠端資料，失敗回退到本地 siteData~~ → ✅ 已移除回退邏輯
4. ~~SEO 有 localStorage 快取機制~~ → ✅ 已移除快取

### 原始耦合檔案（已解耦）

- ~~google-apps-script-template.gs：遠端 API 組裝~~ → 已停用
- ~~MOBILE_CONTENT_SETUP.md：Sheet 維護流程~~ → 已刪除

---

## 2. 現況與耦合點

### 目標狀態

- 內容來源只有 site-data.js。
- script.js 不含 fetchRemoteSiteData、remote fallback、SEO 快取分支。
- 文件改為本地維護 SOP。
- 不再依賴 google-apps-script-template.gs。

### 文案全集中（新增目標）

- 所有可見文案、系統提示、互動提示與 ARIA 文字，集中於 site-data.js 的單一字典區塊（例如 `ui.*`）。
- index.html 與 script.js 不再硬編碼文案，只保留結構與渲染邏輯。
- 同一文案只維護一次，避免「資料來源雖本地化，但字串仍分散」的問題。

---

## 4. ✅ 遷移計畫執行完成（2026-03-05）

### ✅ Step 1：凍結內容基準

- ✅ site-data.js 已包含完整的 seo / brand / menu / trust / order / footerText / floatingBtn 欄位

### ✅ Step 2：移除遠端設定

- ✅ site-data.js 中 window.siteDataRemote 區塊已刪除
- ✅ window.siteData 現為唯一資料來源

### ✅ Step 3：簡化 script.js 資料流程

- ✅ remoteConfig、extractRemoteSiteData、fetchRemoteSiteData 已移除
- ✅ remoteSiteData || localSiteData 分支已移除
- ✅ 直接使用 localSiteData（即 window.siteData）

### ✅ Step 4：移除 SEO 快取分支

- ✅ SEO_CACHE_KEY、readCachedSeo、persistSeoCache 已刪除
- ✅ 首屏套用 cachedSeo 的路徑已移除
- ✅ applySeo 直接套用 siteData.seo

### ✅ Step 5：保留必要防呆

- ✅ 資料完整性檢查保留，錯誤遮罩提示保留

### ✅ Step 6：檔案去留

- ✅ 保留：index.html / style.css / script.js / site-data.js / images / LOCAL_CONTENT_PLAN.md
- ✅ 已移至 _archived：google-apps-script-template.gs
- ✅ 已移至 _archived：remote-site-data.json
- ✅ 已刪除：MOBILE_CONTENT_SETUP.md
- ✅ 已刪除：SHEET_GOVERNANCE_AUDIT.md

### ✅ Step 7：文件已更新

- ✅ MOBILE_CONTENT_SETUP.md 已刪除（待改寫為本地編輯指南）
- ✅ LOCAL_CONTENT_PLAN.md 已更新標記完成狀態

### ✅ Step 8：本地端文案全集中

- ✅ site-data.js 新增 `ui` 字典，包含：
  - `ui.nav.*`（導覽列：品牌故事、作品集、安心資訊、訂購方式）
  - `ui.loading.*`（載入提示）
  - `ui.error.*`（錯誤標題與訊息）
  - `ui.lightbox.*`（上一張、下一張、關閉）
  - `ui.share.*`（Line、Facebook、複製連結、已複製）
  - `ui.a11y.*`（無障礙提示與 aria-label）
- ✅ index.html 導航項目動態化（js 取值）
- ✅ script.js 新增 applyUiText() 函數更新文案
- ✅ 文案集中管理，無散落重複定義

---

## 5. 風險與緩解

### 風險 1：多人同改 site-data.js 造成衝突

- 緩解：採 PR + Code Review；分區塊編輯規範（seo/brand/menu 分段）

### 風險 2：內容格式錯誤導致前端顯示異常

- 緩解：建立欄位檢查清單（必要欄位、URL、陣列長度）

### 風險 3：部署時漏檔或舊檔殘留

- 緩解：建立固定發佈清單與版本號紀錄

### 風險 4：內容更新速度依賴工程流程

- 緩解：提供「最小可編輯流程」文件，降低修改門檻

### 風險 5：文案 key 命名不一致，造成維護困難

- 緩解：制定 key 命名規範（`ui.區塊.用途`），並在文件附上固定欄位清單

---

## 6. ✅ 驗證清單（已完成遷移）

### ✅ 基本驗證

- ✅ 斷網重整後，網站內容可完整顯示（本地資料源）
- ✅ 首屏 title / meta 與 site-data.js 一致
- ✅ 品牌名、分類、價格、聯絡連結在桌機與手機一致

### ✅ 行為驗證

- ✅ 分類切換、Lightbox、分享按鈕、浮動 LINE 按鈕正常
- ✅ Console 無遠端 fetch 相關錯誤（已移除遠端調用）
- ✅ 未見任何外部 API 依賴

### ✅ 一致性驗證

- ✅ 不再出現「index.html 舊字樣 / 遠端新字樣 / 本地備援另一版」三方漂移
- ✅ 不再出現「site-data.js 一版、index.html/script.js 各自硬編碼一版」的本地散落
- ✅ 單一真源原則確立

### ✅ 文案集中驗證

- ✅ 全站可見文字與提示文字在 site-data.js 統一查源
- ✅ index.html 無硬編碼中文文案（除必要 fallback 外）
- ✅ script.js 無固定中文文案（除錯誤 fallback 外）
- ✅ ARIA 與按鈕提示完全由 siteData.ui 驅動
- ✅ 統一修改 site-data.js 即可更新全站文案

### ✅ 專案結構驗證

- ✅ 保留：index.html, style.css, script.js, site-data.js, images/, LOCAL_CONTENT_PLAN.md
- ✅ 歸檔：_archived/ 目錄（google-apps-script-template.gs, remote-site-data.json）
- ✅ 已刪除：MOBILE_CONTENT_SETUP.md, SHEET_GOVERNANCE_AUDIT.md

---

## 7. ✅ 執行完成

本方案已成功實施。專案現採用「本地單一真源」的內容管理方式：

✅ **移除外部依賴**  
- 不再依賴 Google Sheet、Apps Script、遠端 API
- 首屏穩定、斷網可用

✅ **文案統一管理**  
- 所有文案集中於 site-data.js（含新增 ui 字典）
- 修改一處即可更新全站顯示  

✅ **維護成本最低**  
- 無需複雜的框架或工具鏈
- 直接編輯 site-data.js 即可上線

✅ **簽核完成**  
- 2026-03-05 遷移確認無誤
- 所有步驟已實施並驗證通過

---

## 附錄：日後編輯指南

### 快速編輯步驟

1. 打開 [site-data.js](site-data.js)
2. 在對應欄位修改值（seo、brand、menu、trust、order、ui 等）
3. 儲存檔案
4. 刷新網頁即可看到變更

### 常見編輯位置

| 需求 | 位置 | 欄位 |
|------|------|------|
| 更改導覽文字 | ui.nav | about / menu / trust / order |
| 更改品牌資訊 | brand | name / heroTitle / activeImage |
| 更改產品列表 | menu.categories | 新增/編輯 items |
| 改灯箱文案 | ui.lightbox | prev / next / close |
| 改分享按鈕文案 | ui.share | facebook / line / copy |

### 回滾方法

若需恢復先前版本，請參考 git commit history：
```bash
git log --oneline site-data.js
git checkout <commit-hash> site-data.js
```
