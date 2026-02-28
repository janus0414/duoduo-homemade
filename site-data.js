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
        'pineapple',
        '胭脂鳳梨乾',
        'images/P02.jpg',
        '胭脂鳳梨乾',
        '塗上新鮮火龍果醬，呈現漸層花色，豐富口感與視覺享受。',
        [
            buildItem('胭脂鳳梨乾・經典款', 'images/P02.jpg', '胭脂鳳梨乾經典款', '火龍果醬渲染出粉嫩花色，香氣酸甜平衡。', '單片 NT$ 30'),
            buildItem('胭脂鳳梨乾・繽紛款', 'images/P06.jpg', '胭脂鳳梨乾繽紛款', '色彩更飽滿，適合送禮或派對擺盤。', '單片 NT$ 35'),
            buildItem('胭脂鳳梨乾・禮盒款', 'images/P07.jpg', '胭脂鳳梨乾禮盒款', '多片組合包裝，分享與自用都很剛好。', '禮盒 NT$ 420')
        ]
    ),
    buildCategory(
        'apple',
        '甜甜圈蘋果乾',
        'images/P04.jpg',
        '甜甜圈蘋果乾',
        '去皮去籽淡淡的蘋果味。',
        [
            buildItem('甜甜圈蘋果乾・原味', 'images/P04.jpg', '甜甜圈蘋果乾原味', '保留蘋果自然香甜，口感清爽不膩口。', '單片 NT$ 20'),
            buildItem('甜甜圈蘋果乾・薄脆款', 'images/P08.jpg', '甜甜圈蘋果乾薄脆款', '較薄切片，酥脆輕盈，適合下午茶。', '單片 NT$ 22'),
            buildItem('甜甜圈蘋果乾・分享包', 'images/P09.jpg', '甜甜圈蘋果乾分享包', '家庭分享尺寸，適合聚會與伴手禮。', '分享包 NT$ 280')
        ]
    ),
    buildCategory(
        'floral',
        '鳳語花時',
        'images/P05.jpg',
        '鳳語花時',
        '鳳梨乾與永生花、棉花結合，展現了一種酸甜永恆的質感。',
        [
            buildItem('鳳語花時・經典束', 'images/P05.jpg', '鳳語花時經典束', '鳳梨乾與永生花搭配，帶有儀式感與故事性。', '1束 NT$ 1720'),
            buildItem('鳳語花時・暖色系', 'images/S01.jpg', '鳳語花時暖色系', '柔和暖色調設計，適合節慶與紀念日。', '1束 NT$ 1880'),
            buildItem('鳳語花時・粉紫系', 'images/S02.jpg', '鳳語花時粉紫系', '浪漫粉紫配色，作為禮物更具心意。', '1束 NT$ 1980')
        ]
    )
];

window.siteDataRemote = {
    enabled: false,
    url: '',
    timeoutMs: 8000
};

window.siteData = {
    seo: {
        title: '多多手作烘培 | 手作果乾與花禮',
        description: '多多手作烘培提供手作果乾與鳳梨花禮，清楚標價、接單製作，歡迎聯繫訂購。',
        keywords: '多多手作烘培,果乾,鳳梨乾,蘋果乾,鳳梨花禮,手作甜點,聯繫訂購',
        ogTitle: '多多手作烘培｜手作果乾與花禮',
        ogDescription: '查看最新品項、價格與照片，歡迎透過 Line 或 Instagram 聯繫訂購。',
        ogImage: 'images/Main.jpg'
    },
    brand: {
        name: '多多手作烘培',
        logoImage: 'images/Logo.jpg',
        logoAlt: '多多手作烘培',
        heroTitle: '用純粹的食材，烘焙真實的溫暖',
        heroSubtitle: '每一份甜點，都是專屬您的等待',
        aboutTitle: '關於多多',
        aboutParagraphs: [
            '曾經我是護理師和醫美師，守護大家的健康和美麗。現在，我用雙手在麵粉、奶油和雞蛋裡揉製幸福，沉醉在甜點的世界裡。',
            '烘焙對我來說不只是興趣，更是療癒身心的小魔法，每一口甜點都藏著我的用心與溫暖！',
            '我喜歡把甜點變得有趣又驚喜，想讓你一吃就笑出來！希望我的手作點心能為你的生活加點糖，添些笑容，看到大家開心地吃著，就是我最幸福的時刻！'
        ]
    },
    menu: {
        title: '甜點目錄',
        noticeHtml: '※ 所有甜點皆為<b>聯絡後接單製作</b>，以確保最高品質與新鮮度 ※',
        tip: '點擊下方分類可查看更多品項與照片',
        defaultCategory: 'pineapple',
        categories: CATEGORIES
    },
    trust: {
        title: '安心資訊',
        intro: '以下資訊可直接在這份資料檔更新，網站會同步顯示。',
        items: [
            { title: '保存方式', content: '果乾請置於陰涼乾燥處，開封後建議冷藏保存並盡早食用。' },
            { title: '最佳賞味期限', content: '未開封建議 30 天內食用完畢，實際日期依包裝標示為準。' },
            { title: '過敏原提醒', content: '本工作室有使用水果、堅果及乳製品製程，對特定食材過敏者請先告知。' }
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
            { label: 'Line 聯繫訂購', url: '#' },
            { label: 'Instagram 聯繫訂購', url: '#' }
        ]
    },
    footerText: '© 2026 多多手作烘培 Duoduo Bakery. All Rights Reserved.'
};
