# 手機維護網站設定（Google 試算表 + 圖片網址）

## 1) 你會得到什麼
- 手機可直接改文字、價格、品項
- 手機上傳照片後，把網址貼進試算表即可
- 網站前端會優先讀遠端 JSON，失敗時自動改讀本機 `site-data.js`

## 2) 先建 Google 試算表（工作表名稱固定）
請建立以下工作表與欄位：

### `site`
| key | value |
|---|---|
| seo.title | 多多手作烘培 | 
| seo.description | ... |
| seo.keywords | ... |
| seo.ogTitle | ... |
| seo.ogDescription | ... |
| seo.ogImage | https://... |
| brand.name | 多多手作烘培 |
| brand.logoImage | https://... |
| brand.logoAlt | 多多手作烘培 |
| brand.heroTitle | ... |
| brand.heroSubtitle | ... |
| brand.aboutTitle | 關於多多 |
| menu.title | 甜點目錄 |
| menu.noticeHtml | ※ 所有甜點皆為<b>聯絡後接單製作</b>... |
| menu.tip | 點擊下方分類可查看更多品項與照片 |
| menu.defaultCategory | pineapple |
| trust.title | 安心資訊 |
| trust.intro | ... |
| order.title | 如何訂購 |
| order.intro | ... |
| footer.text | © 2026 多多手作烘培... |

### `about`
| text |
|---|
| 第一段品牌故事 |
| 第二段品牌故事 |
| 第三段品牌故事 |

### `categories`
| id | name | coverImage | coverAlt | summary | sort |
|---|---|---|---|---|---|
| pineapple | 胭脂鳳梨乾 | https://... | 胭脂鳳梨乾 | ... | 1 |
| apple | 甜甜圈蘋果乾 | https://... | 甜甜圈蘋果乾 | ... | 2 |

### `products`
| categoryId | name | image | alt | description | price | sort |
|---|---|---|---|---|---|---|
| pineapple | 胭脂鳳梨乾・經典款 | https://... | 胭脂鳳梨乾經典款 | ... | 單片 NT$ 30 | 1 |
| pineapple | 胭脂鳳梨乾・繽紛款 | https://... | 胭脂鳳梨乾繽紛款 | ... | 單片 NT$ 35 | 2 |

### `trust`
| title | content | sort |
|---|---|---|
| 保存方式 | ... | 1 |
| 最佳賞味期限 | ... | 2 |

### `order_steps`
| step | sort |
|---|---|
| Step 1：... | 1 |
| Step 2：... | 2 |

### `contacts`
| label | url | sort |
|---|---|---|
| Line 聯繫訂購 | https://... | 1 |
| Instagram 聯繫訂購 | https://... | 2 |

## 3) 建立 Apps Script API
1. 在試算表點「擴充功能 > Apps Script」
2. 貼上 `google-apps-script-template.gs` 內容
3. 部署為 Web App（任何知道連結的人可存取）
4. 取得 Web App URL

## 4) 在網站啟用遠端來源
編輯 `site-data.js`：

```js
window.siteDataRemote = {
  enabled: true,
  url: '你的 Apps Script Web App URL',
  timeoutMs: 8000
};
```

## 5) 手機日常操作
1. 在手機開 Google 試算表 App
2. 修改文字或價格
3. 上傳照片到你使用的圖床（例如 Cloudinary），貼網址到 `image`/`coverImage`
4. 存檔後重新整理網站

## 6) 重要提醒
- 欄位名稱請保持一致
- `categoryId` 要對應 `categories.id`
- `sort` 請填數字
- 若遠端讀取異常，網站會自動回退到本機 `site-data.js`
