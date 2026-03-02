# 本地文案方案（完全取代 Google Sheet）

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

## 2. 現況與耦合點

### 當前資料流（尚未改造）

1. script.js 讀取 localSiteData 與 remoteConfig。
2. 優先抓取 Google Apps Script API。
3. 成功用遠端資料，失敗回退到本地 siteData。
4. SEO 有 localStorage 快取機制。

### 主要耦合檔案

- index.html：資料檔與主腳本載入入口
- script.js：遠端抓取、回退、SEO 快取、DOM 套用
- site-data.js：本機資料與遠端設定
- google-apps-script-template.gs：遠端 API 組裝
- MOBILE_CONTENT_SETUP.md：目前偏向 Sheet 維護流程

---

## 3. 遷移目標

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

## 4. 逐步遷移計畫（實作順序）

### Step 1：凍結內容基準

- 以 remote-site-data.json 最新內容同步覆蓋 site-data.js 的對應欄位。
- 確認 seo / brand / menu / trust / order / footerText / floatingBtn 欄位完整。

### Step 2：移除遠端設定

- 刪除 site-data.js 中 window.siteDataRemote 區塊。
- 保留 window.siteData 區塊作為唯一資料來源。

### Step 3：簡化 script.js 資料流程

- 移除 remoteConfig、extractRemoteSiteData、fetchRemoteSiteData。
- 移除 remoteSiteData || localSiteData 分支。
- 改為直接使用 localSiteData。

### Step 4：移除 SEO 快取分支

- 刪除 SEO_CACHE_KEY、readCachedSeo、persistSeoCache。
- 移除首屏套用 cachedSeo 的路徑。
- 保留 applySeo，直接套用 siteData.seo。

### Step 5：保留必要防呆

- 保留資料完整性檢查（例如 menu.categories 是否存在）。
- 若本地資料異常，維持現有錯誤遮罩提示。

### Step 6：檔案去留

- 保留：index.html / style.css / script.js / site-data.js / images
- 移除：google-apps-script-template.gs（遷移完成後）
- remote-site-data.json 可作備份快照（或移除）

### Step 7：文件更新

- 重寫 MOBILE_CONTENT_SETUP.md：

  - 移除 Google Sheet、Apps Script、遠端 URL 設定章節
  - 改為「site-data.js 編輯指南」
  - 增加欄位規範、提交流程、回滾流程

### Step 8：本地端文案全集中

- 在 site-data.js 新增 `ui` 字典區塊，建議至少包含：

  - `ui.nav.*`（導覽列文字）
  - `ui.loading.*`（載入提示）
  - `ui.error.*`（錯誤提示與按鈕）
  - `ui.lightbox.*`（上一張/下一張/關閉等）
  - `ui.share.*`（分享選單文案）
  - `ui.a11y.*`（aria-label 與無障礙提示）
- 將 index.html 與 script.js 既有硬編碼文案逐步替換為 `siteData.ui` 套值。
- 保留最小 fallback（避免缺字時畫面空白），並在 Console 警示缺漏 key。
- 完成後執行全域搜尋，確認重點文案不再散落於 HTML/JS。

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

## 6. 驗證清單（遷移完成後）

### 基本驗證

- 斷網重整後，網站內容仍可完整顯示。
- 首屏 title / meta 與 site-data.js 一致。
- 品牌名、分類、價格、聯絡連結在桌機與手機一致。

### 行為驗證

- 分類切換、Lightbox、分享按鈕、浮動 LINE 按鈕正常。
- Console 無遠端 fetch 相關錯誤。

### 一致性驗證

- 不再出現「index.html 舊字樣 / 遠端新字樣 / 本地備援另一版」三方漂移。
- 不再出現「site-data.js 一版、index.html/script.js 又各自硬編碼一版」的本地散落情況。

### 文案集中驗證

- 全站可見文字與提示文字可在 site-data.js 一次查到來源。
- index.html 僅保留必要 fallback，script.js 不再出現固定中文文案（除錯誤 fallback 外）。
- ARIA 與按鈕提示在桌機/手機顯示一致，且可由 site-data.js 統一調整。

---

## 7. 執行結論

本方案可在不引入新框架的前提下，快速把內容治理改為「本地單一真源」。
對目前專案而言，這是成本最低、穩定性最高、可維護性最佳的替代路徑。
