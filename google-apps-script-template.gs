function doGet() {
  const payload = buildSiteData_();
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, data: payload }))
    .setMimeType(ContentService.MimeType.JSON);
}

function buildSiteData_() {
  const siteMap = readKeyValueSheet_('site');
  const aboutParagraphs = readSingleColumnSheet_('about', 'text');
  const categories = readTableSheet_('categories');
  const products = readTableSheet_('products');
  const trustItems = readTableSheet_('trust');
  const orderSteps = readTableSheet_('order_steps');
  const contacts = readTableSheet_('contacts');

  const categoryList = categories
    .sort(sortByNumber_('sort'))
    .map((category) => {
      const categoryProducts = products
        .filter((product) => product.categoryId === category.id)
        .sort(sortByNumber_('sort'))
        .map((product) => ({
          name: text_(product.name),
          image: text_(product.image),
          alt: text_(product.alt || product.name),
          description: text_(product.description),
          price: text_(product.price)
        }));

      return {
        id: text_(category.id),
        name: text_(category.name),
        coverImage: text_(category.coverImage),
        coverAlt: text_(category.coverAlt || category.name),
        summary: text_(category.summary),
        items: categoryProducts
      };
    });

  const trustList = trustItems
    .sort(sortByNumber_('sort'))
    .map((item) => ({
      title: text_(item.title),
      content: text_(item.content)
    }));

  const stepList = orderSteps
    .sort(sortByNumber_('sort'))
    .map((step) => text_(step.step))
    .filter(Boolean);

  const contactList = contacts
    .sort(sortByNumber_('sort'))
    .map((contact) => ({
      label: text_(contact.label),
      url: text_(contact.url)
    }));

  const defaultCategory = text_(siteMap['menu.defaultCategory']) || (categoryList[0] ? categoryList[0].id : '');

  return {
    seo: {
      title: text_(siteMap['seo.title']),
      description: text_(siteMap['seo.description']),
      keywords: text_(siteMap['seo.keywords']),
      ogTitle: text_(siteMap['seo.ogTitle']),
      ogDescription: text_(siteMap['seo.ogDescription']),
      ogImage: text_(siteMap['seo.ogImage'])
    },
    brand: {
      name: text_(siteMap['brand.name']),
      logoImage: text_(siteMap['brand.logoImage']),
      logoAlt: text_(siteMap['brand.logoAlt']),
      heroTitle: text_(siteMap['brand.heroTitle']),
      heroSubtitle: text_(siteMap['brand.heroSubtitle']),
      heroTagline: text_(siteMap['brand.heroTagline']),
      heroImage: text_(siteMap['brand.heroImage']),
      aboutTitle: text_(siteMap['brand.aboutTitle']),
      aboutParagraphs: aboutParagraphs
    },
    menu: {
      title: text_(siteMap['menu.title']),
      noticeHtml: text_(siteMap['menu.noticeHtml']),
      tip: text_(siteMap['menu.tip']),
      defaultCategory: defaultCategory,
      categories: categoryList
    },
    trust: {
      title: text_(siteMap['trust.title']),
      intro: text_(siteMap['trust.intro']),
      items: trustList
    },
    order: {
      title: text_(siteMap['order.title']),
      intro: text_(siteMap['order.intro']),
      steps: stepList,
      contacts: contactList
    },
    footerText: text_(siteMap['footer.text']),
    floatingBtn: {
      label: text_(siteMap['floatingBtn.label']),
      url: text_(siteMap['floatingBtn.url'])
    }
  };
}

function readKeyValueSheet_(sheetName) {
  const rows = readRows_(sheetName);
  const output = {};

  rows.forEach((row) => {
    const key = text_(row.key);
    if (!key) {
      return;
    }
    output[key] = text_(row.value);
  });

  return output;
}

function readSingleColumnSheet_(sheetName, columnName) {
  return readRows_(sheetName)
    .map((row) => text_(row[columnName]))
    .filter(Boolean);
}

function readTableSheet_(sheetName) {
  return readRows_(sheetName);
}

function readRows_(sheetName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    return [];
  }

  const values = sheet.getDataRange().getValues();
  if (!values || values.length < 2) {
    return [];
  }

  const headers = values[0].map((header) => text_(header));
  return values.slice(1).map((row) => {
    const item = {};
    headers.forEach((header, index) => {
      item[header] = row[index];
    });
    return item;
  });
}

function sortByNumber_(field) {
  return (a, b) => Number(a[field] || 0) - Number(b[field] || 0);
}

function text_(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).trim();
}
