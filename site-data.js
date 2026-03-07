const buildItem = (name, image, alt, description, price) => ({
    name,
    image,
    alt,
    description,
    price
});

const buildCategory = (id, name, coverImage, coverAlt, summary, items) => ({
    id,
    name,
    coverImage,
    coverAlt,
    summary,
    items
});

const CATEGORIES = [
    buildCategory(
        'C1',
        '鳳梨果乾系列',
        'https://res.cloudinary.com/dztmtyiuh/image/upload/f_auto/v1772716999/IMG_4086_h6ymgi.heic',
        '鳳梨果乾系列',
        '新鮮鳳梨切片、不加糖，手作的自然誠意。',
        [
            buildItem('經典太陽花・單片包裝', 'https://res.cloudinary.com/dztmtyiuh/image/upload/f_auto/v1772717009/IMG_8859_uhl6e4.heic', '經典太陽花・單片包裝', '客製包裝，送禮自用相宜。', '單片 NT$ 20'),
            buildItem('經典太陽花・120公克', 'https://res.cloudinary.com/dztmtyiuh/image/upload/f_auto/v1772716803/IMG_4669_hr0zoo.heic', '經典太陽花・120公克', '追劇首選，親友分享。', '包裝 NT$ 190'),
            buildItem('胭脂鳳梨乾・單片包裝', 'https://res.cloudinary.com/dztmtyiuh/image/upload/v1772336230/P03_iykco1.jpg', '胭脂鳳梨乾・單片包裝', '天然火龍果染色，色彩繽紛。', '單片 NT$ 30')
            
        ]
    ),
    buildCategory(
        'C2',
        '永生花系列',
        'https://res.cloudinary.com/dztmtyiuh/image/upload/v1772336262/P07_gus88j.jpg',
        '永生花系列',
        '鳳梨果乾與永生花、棉花結合，展現了一種酸甜永恆的質感。',
        [
            buildItem('夏日序曲・創意禮束', 'https://res.cloudinary.com/dztmtyiuh/image/upload/v1772336262/P07_gus88j.jpg', '夏日序曲・創意禮束', '限量客製商品，交期私訊。', '聯繫報價'),
            buildItem('鳳語花時・創意禮束', 'https://res.cloudinary.com/dztmtyiuh/image/upload/v1772336261/P12_hcs3bb.jpg', '鳳語花時・創意禮束', '限量客製商品，交期私訊。', '聯繫報價'),
            buildItem('琥珀情書・創意禮束', 'https://res.cloudinary.com/dztmtyiuh/image/upload/v1772336263/P13_onpnkr.jpg', '琥珀情書・創意禮束', '限量客製商品，交期私訊。', '聯繫報價'),
            buildItem('陽光的消息・創意禮束', 'https://res.cloudinary.com/dztmtyiuh/image/upload/v1772336259/P10_qnpnwq.jpg', '陽光的消息・創意禮束', '限量客製商品，交期私訊。', '聯繫報價'),
            buildItem('花綻果香・創意禮束', 'https://res.cloudinary.com/dztmtyiuh/image/upload/v1772336259/P08_lvlmpm.jpg', '花綻果香・創意禮束', '限量客製商品，交期私訊。', '聯繫報價')
        ]
    ),
    buildCategory(
        'C3',
        '其他果乾系列',
        'https://res.cloudinary.com/dztmtyiuh/image/upload/f_auto/v1772716940/IMG_8846_qs6gao.heic',
        '其他果乾系列',
        '我們不只有鳳梨，火龍果跟芒果也大受好評。',
        [
            buildItem('香甜火龍果乾・單片包裝', 'https://res.cloudinary.com/dztmtyiuh/image/upload/f_auto/v1772716960/IMG_9119_vcirb1.heic', '香甜火龍果乾・單片包裝', '保留火龍果自然香甜，口感清爽不膩口。', '單片 NT$ 40'),
            buildItem('香甜火龍果乾・120公克', 'https://res.cloudinary.com/dztmtyiuh/image/upload/f_auto/v1772716988/IMG_4274_hqwctc.heic', '香甜火龍果乾・120公克', '上班、下午茶，隨時享用。', '包裝 NT$ 300'),
            buildItem('歲月蕉香・120公克', 'https://res.cloudinary.com/dztmtyiuh/image/upload/v1772336278/P22_agvgsz.jpg', '歲月蕉香・120公克', '在忙碌的日常裡，給自己一點甜甜的蕉傲。', '包裝 NT$ 300'),
            buildItem('多多好芒・120公克', 'https://res.cloudinary.com/dztmtyiuh/image/upload/v1772716789/IMG_CE55000D-3CE7-429B-9FA2-15BF51F19578_kjg5ll.jpg', '多多好芒・120公克', '心裡不忙，嘴裡好芒。', '包裝 NT$ 300')
        ]
    ),
    buildCategory(
        'C4',
        '糕點系列',
        'https://res.cloudinary.com/dztmtyiuh/image/upload/f_auto/v1772716792/IMG_4240_k9jssi.heic',
        '糕點系列',
        '不只是烘焙，更是對生活的告白。',
        [
            buildItem('瑪德蓮・單片包裝', 'https://res.cloudinary.com/dztmtyiuh/image/upload/f_auto/v1772716997/IMG_3967_j830gx.heic', '瑪德蓮・單片包裝', '拾起一片貝殼，品嚐一段午茶的溫柔。', '單片 NT$ 40')
        ]
    ),
        buildCategory(
        'C5',
        '手工餅乾系列',
        'https://res.cloudinary.com/dztmtyiuh/image/upload/f_auto/v1772717001/IMG_8304_vindtc.heic',
        '手工餅乾系列',
        '不完美的形狀，最完美的真心。',
        [
            buildItem('杏仁船餅乾', 'https://res.cloudinary.com/dztmtyiuh/image/upload/f_auto/v1772716981/IMG_0156_wulybh.heic', '杏仁船餅乾', '薄脆如羽，香濃如炬，每一口都是堅果的純粹。', '單片 NT$ 40'),
            buildItem('壓模餅乾', 'https://res.cloudinary.com/dztmtyiuh/image/upload/f_auto/v1772716985/IMG_2807_wvgwzf.heic', '壓模餅乾', '模具客制，口味客制。', '單片 NT$ 15~20'),
            buildItem('綜合果乾雪Q餅・11片包裝', 'https://res.cloudinary.com/dztmtyiuh/image/upload/f_auto/v1772716786/IMG_9151_r14mxr.heic', '綜合果乾雪Q餅・11片包裝', '口感層層堆疊，酸甜恰到好處。', '包裝 NT$ 250')
        ]
    ),
            buildCategory(
        'C6',
        '創意禮盒',
        'https://res.cloudinary.com/dztmtyiuh/image/upload/v1772335986/S01_li5tdo.jpg',
        '創意禮盒',
        '預算交給你，驚喜交給我：多多手作，為你客製唯一的感動。',
        [
            buildItem('創意禮盒', 'https://res.cloudinary.com/dztmtyiuh/image/upload/f_auto/v1772716939/IMG_8831_vtglia.heic', '創意禮盒', '你的心意，由我客製：一份專屬於他的驚喜。', '聯繫報價'),
            buildItem('創意禮盒', 'https://res.cloudinary.com/dztmtyiuh/image/upload/f_auto/v1772335986/S01_li5tdo.jpg', '創意禮盒', '預算隨你選，驚喜多多點。', '聯繫報價'),
            buildItem('創意禮盒', 'https://res.cloudinary.com/dztmtyiuh/image/upload/f_auto/v1772716947/IMG_8829_ut0c3g.heic', '創意禮盒', '把你想說的話，裝進這一份量身定制的溫暖裡。', '聯繫報價')
        ]
    )
];

window.siteData = {
    seo: {
        title: '多多手作 | 手作果乾與花禮',
        description: '多多手作提供手作果乾與鳳梨花禮，清楚標價、接單製作，歡迎聯繫訂購。',
        keywords: '多多手作,果乾,鳳梨乾,蘋果乾,鳳梨花禮,手作甜點,聯繫訂購',
        ogTitle: '多多手作｜手作果乾與花禮',
        ogDescription: '查看最新品項、價格與照片，歡迎透過 Line 或 Instagram 聯繫訂購。',
        ogImage: 'https://res.cloudinary.com/dztmtyiuh/image/upload/v1772335986/Main_cz7xuz.jpg',
        siteName: '多多手作',
        locale: 'zh_TW'
    },
    brand: {
        name: '多多手作',
        logoImage: 'https://res.cloudinary.com/dztmtyiuh/image/upload/v1772720284/Gemini_Generated_Image_vmgtclvmgtclvmgt_ju6xia.png',
        logoAlt: '多多手作',
        heroTitle: '用純粹的食材，烘焙真實的溫暖',
        heroSubtitle: '每一份甜點，都是專屬您的等待',
        heroTagline: '— Handmade with love —',
        heroImage: 'https://res.cloudinary.com/dztmtyiuh/image/upload/v1772335986/Main_cz7xuz.jpg',
        aboutTitle: '關於多多',
        aboutParagraphs: [
            '曾經我是護理師與醫美諮詢師，守護大家的健康和美麗。現在，我用雙手在麵粉、奶油和雞蛋裡揉製幸福，沉醉在甜點的世界裡。',
            '烘焙對我來說不只是興趣，更是療癒身心的小魔法，每一口甜點都藏著我的用心與溫暖！',
            '我喜歡把甜點變得有趣又驚喜，想讓你一吃就笑出來！希望我的手作點心能為你的生活加點糖，添些笑容，看到大家開心地吃著，就是我最幸福的時刻！'
        ]
    },
    menu: {
        title: '作品集',
        noticeHtml: '※ 全品項<b>接單製作</b>，自家手工確保最高品質與新鮮度 ※',
        tip: '點擊下方分類可查看更多品項與照片',
        defaultCategory: 'C1',
        categories: CATEGORIES
    },
    trust: {
        title: '安心資訊',
        intro: '以下資訊可直接在這份資料檔更新，網站會同步顯示。',
        items: [
            { title: '保存方式', content: '果乾請置於陰涼乾燥處，開封後建議冷藏保存並盡早食用。' },
            { title: '最佳賞味期限', content: '未開封建議 30 天內食用完畢，實際日期依包裝標示為準。' },
            { title: '過敏原提醒', content: '本工作室有使用水果、堅果及乳製品製程，對特定食材過敏者請先告知。' },
            { title: '季節限定', content: '果乾製作以當季新鮮水果為主，請依實際供應情況選購。' }
        ]
    },
    order: {
        title: '如何訂購',
        intro: '為了給您最好的品質，所有甜點請提前至少 3 個工作天預約。',
        steps: [
            'Step 1：瀏覽上方目錄選擇喜歡的品項。',
            'Step 2：透過下方管道聯繫訂購，確認檔期與細節。',
            'Step 3：完成付款後，即為您安排製作。'
        ],
        contacts: [
            { label: 'Line 聯繫訂購', url: 'https://line.me/ti/p/lraBka5XiD' },
            { label: 'Instagram 聯繫訂購', url: 'https://www.instagram.com/P730730' }
        ]
    },
    footerText: '© 2026 多多手作 Duoduo Homemade. All Rights Reserved.',
    floatingBtn: {
        label: 'Line',
        url: 'https://line.me/ti/p/lraBka5XiD'
    },
    ui: {
        nav: { 
            about: '品牌故事', 
            menu: '作品集', 
            trust: '安心資訊', 
            order: '訂購方式'
        },
        loading: { 
            general: '載入中...',
            image: '圖片載入中…'
        },
        error: { 
            title: '哎呀！出錯了',
            message: '無法載入頁面內容，請檢查網路連線或重新整理頁面。'
        },
        lightbox: { 
            prev: '上一張',
            next: '下一張',
            close: '關閉'
        },
        share: { 
            copied: '連結已複製！可貼上分享到 LINE 或 Facebook'
        },
        a11y: { 
            hamburger: '開啟選單',
            expandCategory: '查看 ${name} 更多品項',
            shareCategory: '分享 ${name}',
            shareItem: '分享 ${name}',
            viewImage: '放大查看 ${alt}',
            copyToClip: '複製連結到剪貼簿'
        }
    }
};
