document.addEventListener('DOMContentLoaded', async () => {
    const localSiteData = window.siteData;
    const remoteConfig = window.siteDataRemote;

    const isCompleteSiteData = (data) => {
        return Boolean(data?.menu && Array.isArray(data.menu.categories));
    };

    const extractRemoteSiteData = (payload) => {
        if (isCompleteSiteData(payload)) {
            return payload;
        }

        if (isCompleteSiteData(payload?.data)) {
            return payload.data;
        }

        if (isCompleteSiteData(payload?.siteData)) {
            return payload.siteData;
        }

        return null;
    };

    const fetchRemoteSiteData = async () => {
        if (!remoteConfig?.enabled || !remoteConfig.url) {
            return null;
        }

        const controller = new AbortController();
        const timeoutMs = Number(remoteConfig.timeoutMs) || 8000;
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(remoteConfig.url, {
                method: 'GET',
                cache: 'no-store',
                signal: controller.signal
            });

            if (!response.ok) {
                return null;
            }

            const payload = await response.json();
            return extractRemoteSiteData(payload);
        } catch (error) {
            return null;
        } finally {
            clearTimeout(timer);
        }
    };

    const siteData = (await fetchRemoteSiteData()) || localSiteData;

    if (!siteData) {
        return;
    }

    const applySeo = () => {
        const seo = siteData.seo;
        if (!seo) {
            return;
        }

        if (seo.title) {
            document.title = seo.title;
        }

        const setMetaContent = (id, value) => {
            const element = document.getElementById(id);
            if (element && value) {
                element.setAttribute('content', value);
            }
        };

        setMetaContent('meta-description', seo.description);
        setMetaContent('meta-keywords', seo.keywords);
        setMetaContent('meta-og-title', seo.ogTitle);
        setMetaContent('meta-og-description', seo.ogDescription);
        setMetaContent('meta-og-image', seo.ogImage);
    };

    const applyBrand = () => {
        const brand = siteData.brand;
        if (!brand) {
            return;
        }

        const brandName = document.getElementById('brand-name');
        const logoImage = document.getElementById('logo-image');
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const aboutTitle = document.getElementById('about-title');
        const aboutContent = document.getElementById('about-content');

        if (brandName && brand.name) {
            brandName.textContent = brand.name;
        }

        if (logoImage) {
            if (brand.logoImage) {
                logoImage.setAttribute('src', brand.logoImage);
            }
            if (brand.logoAlt) {
                logoImage.setAttribute('alt', brand.logoAlt);
            }
        }

        if (heroTitle && brand.heroTitle) {
            heroTitle.textContent = brand.heroTitle;
        }

        if (heroSubtitle && brand.heroSubtitle) {
            heroSubtitle.textContent = brand.heroSubtitle;
        }

        if (aboutTitle && brand.aboutTitle) {
            aboutTitle.textContent = brand.aboutTitle;
        }

        if (aboutContent && Array.isArray(brand.aboutParagraphs)) {
            aboutContent.innerHTML = '';
            brand.aboutParagraphs.forEach((paragraphText) => {
                const paragraph = document.createElement('p');
                paragraph.textContent = paragraphText;
                aboutContent.appendChild(paragraph);
            });
        }
    };

    const renderMenuAndDetails = () => {
        const menu = siteData.menu;
        if (!menu) {
            return;
        }

        const menuTitle = document.getElementById('menu-title');
        const menuNotice = document.getElementById('menu-notice');
        const menuTip = document.getElementById('category-tip');
        const categoryGrid = document.getElementById('category-grid');
        const categoryPanels = document.getElementById('category-panels');
        const categoryTitle = document.getElementById('category-title');

        if (menuTitle && menu.title) {
            menuTitle.textContent = menu.title;
        }

        if (menuNotice && menu.noticeHtml) {
            menuNotice.innerHTML = menu.noticeHtml;
        }

        if (menuTip && menu.tip) {
            menuTip.textContent = menu.tip;
        }

        if (!categoryGrid || !categoryPanels || !Array.isArray(menu.categories)) {
            return;
        }

        categoryGrid.innerHTML = '';
        categoryPanels.innerHTML = '';

        menu.categories.forEach((category) => {
            const card = document.createElement('div');
            card.className = 'product-card category-card';
            card.setAttribute('data-aos', 'fade-up');
            card.dataset.category = category.id;
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `查看${category.name}更多品項`);
            card.innerHTML = `
                <img src="${category.coverImage}" alt="${category.coverAlt || category.name}">
                <h3>${category.name}</h3>
                <p>${category.summary || ''}</p>
            `;
            categoryGrid.appendChild(card);

            const panel = document.createElement('div');
            panel.className = 'category-panel';
            panel.dataset.category = category.id;

            const detailGrid = document.createElement('div');
            detailGrid.className = 'detail-grid';

            if (Array.isArray(category.items)) {
                category.items.forEach((item) => {
                    const detailCard = document.createElement('div');
                    detailCard.className = 'detail-card';
                    detailCard.innerHTML = `
                        <img src="${item.image}" alt="${item.alt || item.name}">
                        <h3>${item.name}</h3>
                        <p>${item.description || ''}</p>
                        <span class="detail-price">${item.price || ''}</span>
                    `;
                    detailGrid.appendChild(detailCard);
                });
            }

            panel.appendChild(detailGrid);
            categoryPanels.appendChild(panel);
        });

        const cards = document.querySelectorAll('.category-card');
        const panels = document.querySelectorAll('.category-panel');
        const firstCategoryId = menu.categories[0]?.id;
        const defaultCategory = menu.defaultCategory || firstCategoryId;

        const activateCategory = (categoryId) => {
            cards.forEach((card) => {
                const isActive = card.dataset.category === categoryId;
                card.classList.toggle('active', isActive);
                card.setAttribute('aria-pressed', String(isActive));
            });

            panels.forEach((panel) => {
                panel.classList.toggle('active', panel.dataset.category === categoryId);
            });

            const activeCategory = menu.categories.find((category) => category.id === categoryId);
            if (categoryTitle && activeCategory) {
                categoryTitle.textContent = `更多品項｜${activeCategory.name}`;
            }
        };

        cards.forEach((card) => {
            card.addEventListener('click', () => {
                activateCategory(card.dataset.category);
                document.getElementById('catalog-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });

            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    activateCategory(card.dataset.category);
                    document.getElementById('catalog-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        if (defaultCategory) {
            activateCategory(defaultCategory);
        }
    };

    const renderTrust = () => {
        const trust = siteData.trust;
        if (!trust) {
            return;
        }

        const trustTitle = document.getElementById('trust-title');
        const trustIntro = document.getElementById('trust-intro');
        const trustGrid = document.getElementById('trust-grid');

        if (trustTitle && trust.title) {
            trustTitle.textContent = trust.title;
        }

        if (trustIntro && trust.intro) {
            trustIntro.textContent = trust.intro;
        }

        if (!trustGrid || !Array.isArray(trust.items)) {
            return;
        }

        trustGrid.innerHTML = '';
        trust.items.forEach((item) => {
            const card = document.createElement('article');
            card.className = 'trust-card';
            card.innerHTML = `
                <h3>${item.title}</h3>
                <p>${item.content}</p>
            `;
            trustGrid.appendChild(card);
        });
    };

    const renderOrder = () => {
        const order = siteData.order;
        if (!order) {
            return;
        }

        const orderTitle = document.getElementById('order-title');
        const orderIntro = document.getElementById('order-intro');
        const orderSteps = document.getElementById('order-steps');
        const contactLinks = document.getElementById('contact-links');

        if (orderTitle && order.title) {
            orderTitle.textContent = order.title;
        }

        if (orderIntro && order.intro) {
            orderIntro.textContent = order.intro;
        }

        if (orderSteps && Array.isArray(order.steps)) {
            orderSteps.innerHTML = '';
            order.steps.forEach((step) => {
                const stepElement = document.createElement('p');
                stepElement.textContent = `👉 ${step}`;
                orderSteps.appendChild(stepElement);
            });
        }

        if (contactLinks && Array.isArray(order.contacts)) {
            contactLinks.innerHTML = '';
            order.contacts.forEach((contact) => {
                const link = document.createElement('a');
                link.className = 'btn';
                link.href = contact.url || '#';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.textContent = contact.label;
                contactLinks.appendChild(link);
            });
        }
    };

    const applyFooter = () => {
        const footerText = document.getElementById('footer-text');
        if (footerText && siteData.footerText) {
            footerText.textContent = siteData.footerText;
        }
    };

    const setupLightbox = () => {
        const detailImages = document.querySelectorAll('.detail-card img');
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxClose = document.getElementById('lightbox-close');

        const openLightbox = (imageElement) => {
            if (!lightbox || !lightboxImage || !lightboxCaption) {
                return;
            }

            lightboxImage.src = imageElement.src;
            lightboxImage.alt = imageElement.alt;
            lightboxCaption.textContent = imageElement.alt;
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
        };

        const closeLightbox = () => {
            if (!lightbox || !lightboxImage || !lightboxCaption) {
                return;
            }

            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            lightboxImage.src = '';
            lightboxImage.alt = '';
            lightboxCaption.textContent = '';
        };

        detailImages.forEach((image) => {
            image.setAttribute('tabindex', '0');
            image.setAttribute('role', 'button');
            image.setAttribute('aria-label', `放大查看 ${image.alt}`);

            image.addEventListener('click', () => {
                openLightbox(image);
            });

            image.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openLightbox(image);
                }
            });
        });

        lightboxClose?.addEventListener('click', closeLightbox);

        lightbox?.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && lightbox?.classList.contains('open')) {
                closeLightbox();
            }
        });
    };

    applySeo();
    applyBrand();
    renderMenuAndDetails();
    renderTrust();
    renderOrder();
    applyFooter();
    setupLightbox();
});
