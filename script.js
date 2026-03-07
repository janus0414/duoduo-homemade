document.addEventListener('DOMContentLoaded', () => {
    const localSiteData = window.siteData;

    const setMetaContent = (id, value) => {
        const element = document.getElementById(id);
        if (element && value) {
            element.setAttribute('content', value);
        }
    };

    // 模板字符串插值工具：用於動態設置 aria-label、title 等帶變數的文案
    const interpolateTemplate = (template, context) => {
        if (!template) return '';
        return template.replace(/\$\{(\w+)\}/g, (match, key) => context[key] || '');
    };

    const applySeoSnapshot = (seo) => {
        if (!seo) {
            return;
        }

        if (seo.title) {
            document.title = seo.title;
        }

        setMetaContent('meta-description', seo.description);
        setMetaContent('meta-keywords', seo.keywords);
        setMetaContent('meta-og-title', seo.ogTitle);
        setMetaContent('meta-og-description', seo.ogDescription);

        if (seo.ogImage) {
            const ogImageEl = document.getElementById('meta-og-image');
            if (ogImageEl) {
                const absoluteImageUrl = seo.ogImage.startsWith('http')
                    ? seo.ogImage
                    : new URL(seo.ogImage, window.location.href).href;
                ogImageEl.setAttribute('content', absoluteImageUrl);
            }
        }

        const ogUrlEl = document.getElementById('meta-og-url');
        if (ogUrlEl) {
            ogUrlEl.setAttribute('content', window.location.href.split('#')[0]);
        }

        // 設定 og:site_name
        if (seo.siteName) {
            const siteNameEl = document.querySelector('meta[property="og:site_name"]');
            if (siteNameEl) {
                siteNameEl.setAttribute('content', seo.siteName);
            }
        }

        // 設定 og:locale
        if (seo.locale) {
            const localeEl = document.querySelector('meta[property="og:locale"]');
            if (localeEl) {
                localeEl.setAttribute('content', seo.locale);
            }
        }
    };



    const isCompleteSiteData = (data) => {
        return Boolean(data?.menu && Array.isArray(data.menu.categories));
    };



    const loadingOverlay = document.getElementById('loading-overlay');
    const errorOverlay = document.getElementById('error-overlay');

    const siteData = localSiteData;

    if (!siteData) {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        if (errorOverlay) errorOverlay.style.display = 'flex';
        return;
    }

    if (loadingOverlay) {
        loadingOverlay.classList.add('fade-out');
        setTimeout(() => { loadingOverlay.style.display = 'none'; }, 400);
    }

    const applySeo = () => {
        const seo = siteData.seo;
        if (!seo) {
            return;
        }

        applySeoSnapshot(seo);
    };

    const applyUiText = () => {
        const ui = siteData.ui;
        if (!ui) {
            return;
        }

        // 更新導航項目
        if (ui.nav) {
            const navLinks = document.querySelectorAll('#main-nav a');
            if (navLinks[0] && ui.nav.about) navLinks[0].textContent = ui.nav.about;
            if (navLinks[1] && ui.nav.menu) navLinks[1].textContent = ui.nav.menu;
            if (navLinks[2] && ui.nav.trust) navLinks[2].textContent = ui.nav.trust;
            if (navLinks[3] && ui.nav.order) navLinks[3].textContent = ui.nav.order;
        }

        // 更新漢堡菜單標籤
        if (ui.a11y?.hamburger) {
            const hamburger = document.getElementById('hamburger');
            if (hamburger) {
                hamburger.setAttribute('aria-label', ui.a11y.hamburger);
            }
        }

        // 更新載入頁面提示文案（如需要）
        const loadingText = document.querySelector('#loading-overlay p');
        if (loadingText && ui.loading?.general) {
            loadingText.textContent = ui.loading.general;
        }

        // 更新錯誤頁面文案
        const errorOverlayText = document.getElementById('error-overlay');
        if (errorOverlayText && ui.error) {
            const errorParagraphs = errorOverlayText.querySelectorAll('p');
            if (errorParagraphs[0] && ui.error.title) {
                errorParagraphs[0].textContent = '⚠️ ' + ui.error.title;
            }
            if (errorParagraphs[1] && ui.error.message) {
                errorParagraphs[1].textContent = ui.error.message;
            }
        }

        // 更新複製提示
        const copyToast = document.getElementById('copy-toast');
        if (copyToast && ui.share?.copied) {
            copyToast.textContent = '✅ ' + ui.share.copied;
        }
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

        const heroTagline = document.getElementById('hero-tagline');
        if (heroTagline && brand.heroTagline) {
            heroTagline.textContent = brand.heroTagline;
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

        // Hero 背景圖（支援從 Google Sheet / Cloudinary 更換）
        if (brand.heroImage) {
            const hero = document.getElementById('hero');
            if (hero) {
                hero.style.backgroundImage = `linear-gradient(to bottom, rgba(92,74,61,0.3) 0%, rgba(92,74,61,0.55) 50%, rgba(92,74,61,0.7) 100%), url('${brand.heroImage}')`;
            }
        }
    };

    let activateCategory = null;

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

        menu.categories.forEach((category, catIndex) => {
            const card = document.createElement('div');
            card.className = 'product-card category-card';
            const aosTypes = ['fade-up', 'fade-right', 'fade-left'];
            card.setAttribute('data-aos', aosTypes[catIndex % aosTypes.length]);
            card.setAttribute('data-aos-delay', String(catIndex * 100));
            card.dataset.category = category.id;
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            const expandLabel = interpolateTemplate(
                siteData.ui?.a11y?.expandCategory || '查看 ${name} 更多品項',
                { name: category.name }
            );
            card.setAttribute('aria-label', expandLabel);
            card.innerHTML = `
                <button class="share-icon-btn" type="button" aria-label="分享${category.name}" data-share-name="${category.name}" data-share-id="${category.id}">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
                </button>
                <img src="${category.coverImage}" alt="${category.coverAlt || category.name}" loading="lazy">
                <h3>${category.name}</h3>
                <p>${category.summary || ''}</p>
            `;
            categoryGrid.appendChild(card);

            // 動態設置分類卡片分享按鈕的 aria-label
            const categoryShareBtn = card.querySelector('.share-icon-btn');
            if (categoryShareBtn) {
                const categoryShareLabel = interpolateTemplate(
                    siteData.ui?.a11y?.shareCategory || '分享 ${name}',
                    { name: category.name }
                );
                categoryShareBtn.setAttribute('aria-label', categoryShareLabel);
            }

            const panel = document.createElement('div');
            panel.className = 'category-panel';
            panel.dataset.category = category.id;

            const detailGrid = document.createElement('div');
            detailGrid.className = 'detail-grid';

            if (Array.isArray(category.items)) {
                category.items.forEach((item) => {
                    const detailCard = document.createElement('div');
                    detailCard.className = 'detail-card';
                    const itemIndex = category.items.indexOf(item);
                    const itemShareId = `${category.id}-item-${itemIndex}`;
                    detailCard.id = itemShareId;
                    detailCard.innerHTML = `
                        <button class="share-icon-btn" type="button" aria-label="分享${item.name}" data-share-name="${item.name}" data-share-id="${itemShareId}">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
                        </button>
                        <img src="${item.image}" alt="${item.alt || item.name}" loading="lazy">
                        <h3>${item.name}</h3>
                        <p>${item.description || ''}</p>
                        <span class="detail-price">${item.price || ''}</span>
                    `;
                    detailGrid.appendChild(detailCard);

                    // 動態設置商品卡片分享按鈕的 aria-label
                    const itemShareBtn = detailCard.querySelector('.share-icon-btn');
                    if (itemShareBtn) {
                        const itemShareLabel = interpolateTemplate(
                            siteData.ui?.a11y?.shareItem || '分享 ${name}',
                            { name: item.name }
                        );
                        itemShareBtn.setAttribute('aria-label', itemShareLabel);
                    }
                });
            }

            panel.appendChild(detailGrid);
            categoryPanels.appendChild(panel);
        });

        const cards = document.querySelectorAll('.category-card');
        const panels = document.querySelectorAll('.category-panel');
        const firstCategoryId = menu.categories[0]?.id;
        const defaultCategory = menu.defaultCategory || firstCategoryId;

        activateCategory = (categoryId) => {
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
                categoryTitle.textContent = `${activeCategory.name}`;
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

        // 為所有動態產生的圖片加上 loaded 事件（Skeleton 動畫用）
        document.querySelectorAll('.product-card img, .detail-card img').forEach((img) => {
            img.addEventListener('load', () => img.classList.add('loaded'));
            if (img.complete) img.classList.add('loaded');
        });
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
        trust.items.forEach((item, index) => {
            const card = document.createElement('article');
            card.className = 'trust-card';
            const aosTypes = ['fade-up', 'fade-right', 'fade-left'];
            card.setAttribute('data-aos', aosTypes[index % aosTypes.length]);
            card.setAttribute('data-aos-delay', String(index * 100));
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

    const applyFloatingBtn = () => {
        const btn = document.getElementById('floating-line-btn');
        if (!btn) return;
        const fb = siteData.floatingBtn;
        if (fb && fb.url && fb.label) {
            btn.href = fb.url;
            btn.textContent = fb.label;
            btn.target = '_blank';
            btn.rel = 'noopener noreferrer';
            btn.style.display = '';
        }
    };

    const setupLightbox = () => {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');

        // 更新燈箱按鈕的 aria-labels
        const ui = siteData.ui;
        if (ui?.lightbox) {
            if (lightboxPrev && ui.lightbox.prev) {
                lightboxPrev.setAttribute('aria-label', ui.lightbox.prev);
            }
            if (lightboxNext && ui.lightbox.next) {
                lightboxNext.setAttribute('aria-label', ui.lightbox.next);
            }
            if (lightboxClose && ui.lightbox.close) {
                lightboxClose.setAttribute('aria-label', ui.lightbox.close);
            }
        }

        let imageList = [];
        let currentIndex = -1;

        const getActiveImages = () => {
            const activePanel = document.querySelector('.category-panel.active');
            if (activePanel) {
                return Array.from(activePanel.querySelectorAll('.detail-card img'));
            }
            return Array.from(document.querySelectorAll('.detail-card img'));
        };

        const showImage = (index) => {
            if (index < 0 || index >= imageList.length) return;
            currentIndex = index;
            const img = imageList[currentIndex];
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxCaption.textContent = img.alt;
            if (lightboxPrev) lightboxPrev.style.display = currentIndex > 0 ? 'flex' : 'none';
            if (lightboxNext) lightboxNext.style.display = currentIndex < imageList.length - 1 ? 'flex' : 'none';
        };

        const openLightbox = (imageElement) => {
            if (!lightbox || !lightboxImage || !lightboxCaption) {
                return;
            }

            imageList = getActiveImages();
            currentIndex = imageList.indexOf(imageElement);
            showImage(currentIndex);
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.classList.add('lightbox-open');
        };

        const closeLightbox = () => {
            if (!lightbox || !lightboxImage || !lightboxCaption) {
                return;
            }

            lightbox.classList.remove('open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('lightbox-open');
            lightboxImage.src = '';
            lightboxImage.alt = '';
            lightboxCaption.textContent = '';
            currentIndex = -1;
            imageList = [];
        };

        const detailImages = document.querySelectorAll('.detail-card img');
        detailImages.forEach((image) => {
            image.setAttribute('tabindex', '0');
            image.setAttribute('role', 'button');
            const viewImageLabel = interpolateTemplate(
                siteData.ui?.a11y?.viewImage || '放大查看 ${alt}',
                { alt: image.alt }
            );
            image.setAttribute('aria-label', viewImageLabel);

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

        lightboxPrev?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentIndex > 0) showImage(currentIndex - 1);
        });

        lightboxNext?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentIndex < imageList.length - 1) showImage(currentIndex + 1);
        });

        lightbox?.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (!lightbox?.classList.contains('open')) return;
            if (event.key === 'Escape') closeLightbox();
            if (event.key === 'ArrowLeft' && currentIndex > 0) showImage(currentIndex - 1);
            if (event.key === 'ArrowRight' && currentIndex < imageList.length - 1) showImage(currentIndex + 1);
        });
    };

    const setupShareSystem = () => {
        const baseUrl = window.location.href.split('#')[0];
        const copyToast = document.getElementById('copy-toast');

        const showToast = () => {
            if (!copyToast) return;
            copyToast.classList.add('show');
            setTimeout(() => copyToast.classList.remove('show'), 2000);
        };

        const buildShareUrl = (shareId) => `${baseUrl}#${shareId}`;

        // 一鍵複製連結
        document.querySelectorAll('.share-icon-btn').forEach((btn) => {
            const shareId = btn.dataset.shareId;
            const shareLink = buildShareUrl(shareId);

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                navigator.clipboard.writeText(shareLink).then(() => {
                    showToast();
                }).catch(() => {
                    const textarea = document.createElement('textarea');
                    textarea.value = shareLink;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    showToast();
                });
            });
        });
    };


    applySeo();
    applyUiText();
    applyBrand();
    renderMenuAndDetails();
    renderTrust();
    renderOrder();
    applyFooter();
    applyFloatingBtn();
    setupLightbox();
    setupShareSystem();

    const handleShareableUrl = () => {
        const hash = window.location.hash.slice(1);
        if (!hash) return;

        const categories = siteData.menu?.categories || [];
        const itemMatch = hash.match(/^(.+)-item-(\d+)$/);

        if (itemMatch) {
            const catId = itemMatch[1];
            if (activateCategory) activateCategory(catId);
            document.getElementById('menu')?.scrollIntoView({ behavior: 'instant' });
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    const targetCard = document.getElementById(hash);
                    targetCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            });
            return;
        }

        const isCategory = categories.some((c) => c.id === hash);
        if (isCategory) {
            if (activateCategory) activateCategory(hash);
            document.getElementById('menu')?.scrollIntoView({ behavior: 'instant' });
        }
    };

    handleShareableUrl();

    // 漢堡選單
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('main-nav');
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
        });

        mainNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 導覽列滾動高亮
    const navLinks = document.querySelectorAll('#main-nav a');
    const sections = document.querySelectorAll('section[id]');
    if (navLinks.length && sections.length) {
        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            rootMargin: '-20% 0px -60% 0px'
        });

        sections.forEach((section) => observer.observe(section));
    }

    // 所有動態內容渲染完畢後初始化 AOS 滾動動畫
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true });
    }
});
