# 多多手作烘培 — 網站維護指南

> 本指南讓你能用 **Google 試算表（手機 App）** 編輯網站文字與價格，
> 搭配 **Cloudinary** 上傳照片並取得圖片網址，完全不需要碰程式碼。

---

## 目錄

1. [系統架構總覽](#1-系統架構總覽)
2. [Cloudinary 圖片管理](#2-cloudinary-圖片管理)
3. [Google 試算表設定（共 7 個頁籤）](#3-google-試算表設定共-7-個頁籤)
4. [Google Apps Script 部署](#4-google-apps-script-部署)
5. [網站端連線設定](#5-網站端連線設定)
6. [日常維護流程（手機操作）](#6-日常維護流程手機操作)
7. [檔案架構說明](#7-檔案架構說明)
8. [常見問題 FAQ](#8-常見問題-faq)

---

## 1) 系統架構總覽

```
┌─────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  Cloudinary  │───▶│  Google 試算表     │───▶│  Google Apps      │
│  (圖片儲存)   │    │  (文字 + 圖片網址)  │    │  Script (API)     │
└─────────────┘    └──────────────────┘    └──────────────────┘
                                                    │
                                                    ▼ JSON
                                          ┌──────────────────┐
                                          │   網站前端         │
                                          │   index.html      │
                                          │   + script.js     │
                                          └──────────────────┘
```

**資料流向：**
1. 你在手機用 Cloudinary App 上傳照片 → 取得圖片網址
2. 打開 Google 試算表 App → 貼上網址、修改文字或價格
3. 網站自動從 Google Apps Script 取得最新資料並顯示
4. 若遠端讀取失敗，自動回退到本機 `site-data.js` 備份資料

---

## 2) Cloudinary 圖片管理

### 2-1) 註冊帳號
1. 前往 [https://cloudinary.com](https://cloudinary.com) 註冊免費帳號
2. 免費方案提供 25GB 儲存空間，足夠使用

### 2-2) 手機上傳照片
1. 下載 **Cloudinary** App（iOS / Android 都有）
2. 登入後點擊上傳（Upload）
3. 從相簿選擇照片
4. 上傳完畢後，點擊該圖片 → 複製「URL」

### 2-3) 取得圖片網址
Cloudinary 圖片網址格式如下：
```
https://res.cloudinary.com/你的雲端名稱/image/upload/v1234567890/檔名.jpg
```

**建議：**
- 建立資料夾分類，例如 `duoduo/pineapple/`、`duoduo/apple/`
- 檔名用英文，避免中文亂碼
- 上傳後的網址直接貼到 Google 試算表對應的 `image` 或 `coverImage` 欄位

### 2-4) 圖片尺寸建議

| 用途 | 建議尺寸 | 對應欄位 |
|---|---|---|
| Hero 首頁大圖 | 1920 × 1080 px | `brand.heroImage` |
| Logo 品牌圖示 | 200 × 200 px | `brand.logoImage` |
| 分類封面圖 | 800 × 600 px | categories → `coverImage` |
| 產品照片 | 800 × 600 px | products → `image` |
| OG 社群分享圖 | 1200 × 630 px | `seo.ogImage` |

---

## 3) Google 試算表設定（共 7 個頁籤）

> **重要：** 頁籤名稱和欄位標題（第一列）必須與以下完全一致，大小寫敏感。

### 頁籤 ① `site`（全站設定，key-value 格式）

| key | value |
|---|---|
| `seo.title` | 多多手作烘培 \| 手作果乾與花禮 |
| `seo.description` | 多多手作烘培提供手作果乾與鳳梨花禮，清楚標價、接單製作，歡迎聯繫訂購。 |
| `seo.keywords` | 多多手作烘培,果乾,鳳梨乾,蘋果乾,鳳梨花禮,手作甜點,聯繫訂購 |
| `seo.ogTitle` | 多多手作烘培｜手作果乾與花禮 |
| `seo.ogDescription` | 查看最新品項、價格與照片，歡迎透過 Line 或 Instagram 聯繫訂購。 |
| `seo.ogImage` | https://res.cloudinary.com/.../Main.jpg |
| `brand.name` | 多多手作烘培 |
| `brand.logoImage` | https://res.cloudinary.com/.../Logo.jpg |
| `brand.logoAlt` | 多多手作烘培 |
| `brand.heroTitle` | 用純粹的食材，烘焙真實的溫暖 |
| `brand.heroSubtitle` | 每一份甜點，都是專屬您的等待 |
| `brand.heroTagline` | — Handmade with love — |
| `brand.heroImage` | https://res.cloudinary.com/.../Main.jpg |
| `brand.aboutTitle` | 關於多多 |
| `menu.title` | 作品集 |
| `menu.noticeHtml` | ※ 所有甜點皆為\<b\>聯絡後接單製作\</b\>，以確保最高品質與新鮮度 ※ |
| `menu.tip` | 點擊下方分類可查看更多品項與照片 |
| `menu.defaultCategory` | pineapple |
| `trust.title` | 安心資訊 |
| `trust.intro` | 以下資訊可直接在這份資料檔更新，網站會同步顯示。 |
| `order.title` | 如何訂購 |
| `order.intro` | 為了給您最好的品質，所有甜點請提前至少 3 個工作天預約。 |
| `footer.text` | © 2026 多多手作烘培 Duoduo Bakery. All Rights Reserved. |
| `floatingBtn.label` | 💬 Line 預約 |
| `floatingBtn.url` | https://line.me/ti/p/你的LineID |

> **共 24 列。** A 欄填 key、B 欄填 value，第一列標題為 `key` 和 `value`。

### 頁籤 ② `about`（品牌故事，一列一段）

| text |
|---|
| 曾經我是護理師和醫美師，守護大家的健康和美麗。現在，我用雙手在麵粉、奶油和雞蛋裡揉製幸福，沉醉在甜點的世界裡。 |
| 烘焙對我來說不只是興趣，更是療癒身心的小魔法，每一口甜點都藏著我的用心與溫暖！ |
| 我喜歡把甜點變得有趣又驚喜，想讓你一吃就笑出來！希望我的手作點心能為你的生活加點糖，添些笑容，看到大家開心地吃著，就是我最幸福的時刻！ |

> 每一列就是網站上的一個段落，想加段落就新增一列。

### 頁籤 ③ `categories`（產品分類）

| id | name | coverImage | coverAlt | summary | sort |
|---|---|---|---|---|---|
| pineapple | 胭脂鳳梨乾 | https://res.cloudinary.com/.../P02.jpg | 胭脂鳳梨乾 | 塗上新鮮火龍果醬，呈現漸層花色，豐富口感與視覺享受。 | 1 |
| apple | 甜甜圈蘋果乾 | https://res.cloudinary.com/.../P04.jpg | 甜甜圈蘋果乾 | 去皮去籽淡淡的蘋果味。 | 2 |
| floral | 鳳語花時 | https://res.cloudinary.com/.../P05.jpg | 鳳語花時 | 鳳梨乾與永生花、棉花結合，展現了一種酸甜永恆的質感。 | 3 |

> - `id` 是英文代號（不要改），對應 products 的 `categoryId`
> - `sort` 數字越小排越前面
> - 要新增分類就加一列，取一個新的英文 id

### 頁籤 ④ `products`（產品細項）

| categoryId | name | image | alt | description | price | sort |
|---|---|---|---|---|---|---|
| pineapple | 胭脂鳳梨乾・經典款 | https://res.cloudinary.com/.../P02.jpg | 胭脂鳳梨乾經典款 | 火龍果醬渲染出粉嫩花色，香氣酸甜平衡。 | 單片 NT$ 30 | 1 |
| pineapple | 胭脂鳳梨乾・繽紛款 | https://res.cloudinary.com/.../P06.jpg | 胭脂鳳梨乾繽紛款 | 色彩更飽滿，適合送禮或派對擺盤。 | 單片 NT$ 35 | 2 |
| pineapple | 胭脂鳳梨乾・禮盒款 | https://res.cloudinary.com/.../P07.jpg | 胭脂鳳梨乾禮盒款 | 多片組合包裝，分享與自用都很剛好。 | 禮盒 NT$ 420 | 3 |
| apple | 甜甜圈蘋果乾・原味 | https://res.cloudinary.com/.../P04.jpg | 甜甜圈蘋果乾原味 | 保留蘋果自然香甜，口感清爽不膩口。 | 單片 NT$ 20 | 1 |
| floral | 鳳語花時・經典束 | https://res.cloudinary.com/.../P05.jpg | 鳳語花時經典束 | 鳳梨乾與永生花搭配，帶有儀式感與故事性。 | 1束 NT$ 1720 | 1 |

> - `categoryId` 必須對應 categories 表的 `id` 欄位
> - 新增產品就加一列，填好對應的 categoryId
> - 價格格式自由，例如 `單片 NT$ 30` 或 `NT$30`

### 頁籤 ⑤ `trust`（安心資訊）

| title | content | sort |
|---|---|---|
| 保存方式 | 果乾請置於陰涼乾燥處，開封後建議冷藏保存並盡早食用。 | 1 |
| 最佳賞味期限 | 未開封建議 30 天內食用完畢，實際日期依包裝標示為準。 | 2 |
| 過敏原提醒 | 本工作室有使用水果、堅果及乳製品製程，對特定食材過敏者請先告知。 | 3 |

### 頁籤 ⑥ `order_steps`（訂購步驟）

| step | sort |
|---|---|
| Step 1：瀏覽上方目錄選擇喜歡的品項。 | 1 |
| Step 2：透過下方管道聯繫訂購，確認檔期與細節。 | 2 |
| Step 3：完成付款後，即為您安排製作。 | 3 |

### 頁籤 ⑦ `contacts`（聯絡管道）

| label | url | sort |
|---|---|---|
| Line 聯繫訂購 | https://line.me/ti/p/你的LineID | 1 |
| Instagram 聯繫訂購 | https://www.instagram.com/你的IG帳號 | 2 |

---

## 4) Google Apps Script 部署

### 4-1) 建立 Script
1. 打開你的 Google 試算表
2. 點選上方選單 **「擴充功能」→「Apps Script」**
3. 刪除預設的 `function myFunction() {}`
4. 將 `google-apps-script-template.gs` 的全部內容貼上
5. 按 **Ctrl+S** 儲存，專案名稱隨意（例如「多多網站 API」）

### 4-2) 部署為 Web App
1. 點選右上角 **「部署」→「新增部署作業」**
2. 類型選 **「網路應用程式」**
3. 設定：
   - 說明：`v1`（或任意版本號）
   - 執行身分：**我自己**
   - 誰可以存取：**所有人**
4. 點「部署」→ 授權帳戶存取權限
5. 複製顯示的 **Web App URL**（形如 `https://script.google.com/macros/s/xxx/exec`）

### 4-3) 更新部署
每次修改 Apps Script 程式碼後，需要重新部署：
1. 「部署」→「管理部署作業」
2. 點編輯（鉛筆圖示）→ 版本選「新版本」→ 部署

> **注意：** 修改試算表內容不需要重新部署，只有修改 Apps Script 程式碼才需要。

---

## 5) 網站端連線設定

編輯 `site-data.js` 檔案頂部的遠端設定：

```javascript
window.siteDataRemote = {
    enabled: true,          // true = 啟用遠端讀取
    url: '你的 Web App URL', // 貼上步驟 4 取得的 URL
    timeoutMs: 8000         // 逾時毫秒數（建議 8000）
};
```

設定完成後，網站會：
1. **優先** 從 Google 試算表讀取最新資料
2. 若讀取失敗（無網路、逾時等），**自動回退** 到 `site-data.js` 中的本機備份資料

---

## 6) 日常維護流程（手機操作）

### 改文字 / 價格
1. 手機打開 **Google 試算表** App
2. 找到要改的頁籤（如 `products`）
3. 直接修改欄位內容 → 自動儲存
4. 重新整理網站即可看到更新

### 換照片
1. 手機打開 **Cloudinary** App
2. 上傳新照片 → 複製圖片 URL
3. 打開 Google 試算表 → 貼到對應的 `image` 或 `coverImage` 欄位
4. 重新整理網站

### 新增產品
1. 在 `products` 頁籤最下方新增一列
2. 填入 `categoryId`（對應 categories 的 id）、品名、圖片網址、描述、價格、排序
3. 儲存即生效

### 新增分類
1. 先在 `categories` 頁籤新增一列，設定英文 `id`（如 `cake`）
2. 再到 `products` 頁籤新增該分類的產品，`categoryId` 填 `cake`
3. 儲存即生效

---

## 7) 檔案架構說明

```
duoduo-homemade/
├── index.html                        ← 網頁結構（純 HTML 骨架，不含內容文字）
├── style.css                         ← 所有視覺樣式（顏色、字型、排版、動畫、RWD）
├── script.js                         ← 所有行為邏輯（資料綁定、互動、Lightbox、分享）
├── site-data.js                      ← 本機備份資料 + 遠端設定（Google Sheet URL）
├── google-apps-script-template.gs    ← Google Apps Script 原始碼（貼到試算表用）
├── MOBILE_CONTENT_SETUP.md           ← 本說明文件
└── images/                           ← 本機圖片（上線後改用 Cloudinary 網址）
```

### 各檔案職責

| 檔案 | 職責 | 何時需修改 |
|---|---|---|
| `index.html` | HTML 骨架結構 | 幾乎不需要修改 |
| `style.css` | 所有 CSS 樣式 | 想調整顏色或字型時 |
| `script.js` | 資料綁定 + 互動功能 | 幾乎不需要修改 |
| `site-data.js` | 遠端設定 + 備份資料 | 初次設定 Google Sheet URL 時 |
| `google-apps-script-template.gs` | 試算表 → JSON API | 初次部署時貼到 Apps Script |

### 資料驅動的欄位對照

| 網站區塊 | 資料來源（Google Sheet 頁籤） |
|---|---|
| 瀏覽器標題 / SEO | `site` → seo.* |
| 社群分享卡片 | `site` → seo.og* |
| 品牌名稱 / Logo | `site` → brand.* |
| 首頁大圖 / 標語 | `site` → brand.heroTitle / heroSubtitle / heroTagline / heroImage |
| 品牌故事 | `about` |
| 作品集分類 | `categories` |
| 產品細項 / 價格 | `products` |
| 安心資訊 | `trust` |
| 訂購步驟 | `order_steps` |
| 聯絡連結 | `contacts` |
| 懸浮 Line 按鈕 | `site` → floatingBtn.* |
| 頁尾版權 | `site` → footer.text |

---

## 8) 常見問題 FAQ

### Q: 改了試算表，網站沒更新？
**A:** 重新整理頁面（手機下拉刷新）。瀏覽器有時會快取，可嘗試「強制重新整理」或清除快取。

### Q: 新增的分類或產品沒出現？
**A:** 檢查：
1. `categoryId` 是否和 `categories` 的 `id` 完全一致（英文大小寫敏感）
2. `sort` 欄位是否填了數字
3. 欄位標題（第一列）是否拼寫正確

### Q: 圖片沒顯示？
**A:** 確認 Cloudinary 網址是否正確、可公開存取。在手機瀏覽器直接貼上網址，看能否顯示圖片。

### Q: 網站顯示「載入失敗」？
**A:** 可能是 Google Apps Script URL 失效或網路問題：
1. 確認 `site-data.js` 中的 URL 正確
2. 確認 Apps Script 部署的存取權限是「所有人」
3. 網路恢復後重新整理即可（網站會自動回退到本機備份資料）

### Q: 要改 Apps Script 嗎？
**A:** 正常情況下不需要。只有新增欄位或改變資料結構時才需修改並重新部署。

### Q: 懸浮的 Line 按鈕沒出現？
**A:** 確認試算表 `site` 頁籤有填 `floatingBtn.label` 和 `floatingBtn.url` 兩列，且 url 是有效的 Line 連結。

### Q: 我可以有多少空間上傳或製作我的網站？
**A:** 本網站系統由三個部分組成，各有不同的空間限制：

| 服務 | 用途 | 免費空間 |
|---|---|---|
| **GitHub** | 存放網站程式碼（HTML / CSS / JS） | 建議每個 Repository 不超過 1 GB，單一檔案不超過 100 MB |
| **Cloudinary** | 存放產品照片與圖片 | 免費方案提供 **25 GB** 儲存空間 |
| **Google 試算表** | 存放文字內容與圖片網址 | 包含在 Google 帳號的 **15 GB** 免費儲存空間內（試算表本身幾乎不佔空間） |

**實際使用建議：**
- 網站程式碼本身非常小，GitHub 空間對本站來說幾乎不會用完。
- 圖片是最耗空間的部分。Cloudinary 免費 25 GB 可存放數千張高品質產品照，一般手作烘培網站使用多年也不會超出。
- 上傳圖片前可先適當壓縮（建議每張不超過 2 MB），以加快網站載入速度。
