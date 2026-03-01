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

    const loadingOverlay = document.getElementById('loading-overlay');
    const errorOverlay = document.getElementById('error-overlay');

    const remoteSiteData = await fetchRemoteSiteData();

    const siteData = remoteSiteData || localSiteData;

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

        // og:image 必須是絕對路徑，FB 爬蟲才能正確抓取
        if (seo.ogImage) {
            const ogImageEl = document.getElementById('meta-og-image');
            if (ogImageEl) {
                const absoluteImageUrl = seo.ogImage.startsWith('http')
                    ? seo.ogImage
                    : new URL(seo.ogImage, window.location.href).href;
                ogImageEl.setAttribute('content', absoluteImageUrl);
            }
        }

        // 同步更新 og:url
        const ogUrlEl = document.getElementById('meta-og-url');
        if (ogUrlEl) {
            ogUrlEl.setAttribute('content', window.location.href.split('#')[0]);
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
            card.setAttribute('aria-label', `查看${category.name}更多品項`);
            card.innerHTML = `
                <button class="share-icon-btn" type="button" aria-label="分享${category.name}" data-share-name="${category.name}" data-share-id="${category.id}">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
                </button>
                <div class="share-menu" data-share-menu="${category.id}"></div>
                <img src="${category.coverImage}" alt="${category.coverAlt || category.name}" loading="lazy">
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
                    const itemIndex = category.items.indexOf(item);
                    const itemShareId = `${category.id}-item-${itemIndex}`;
                    detailCard.innerHTML = `
                        <button class="share-icon-btn" type="button" aria-label="分享${item.name}" data-share-name="${item.name}" data-share-id="${itemShareId}">
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg>
                        </button>
                        <div class="share-menu" data-share-menu="${itemShareId}"></div>
                        <img src="${item.image}" alt="${item.alt || item.name}" loading="lazy">
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

        const populateMenu = (menu, shareId, shareName) => {
            const shareLink = buildShareUrl(shareId);
            const encodedUrl = encodeURIComponent(shareLink);
            const encodedText = encodeURIComponent(`${shareName} — 多多手作烘培`);

            menu.innerHTML = `
                <button class="share-menu-item" data-action="line" aria-label="分享到 Line">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
                </button>
                <button class="share-menu-item" data-action="fb" aria-label="分享到 Facebook">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
                <button class="share-menu-item" data-action="copy" aria-label="複製連結">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                </button>
            `;

            menu.querySelectorAll('.share-menu-item').forEach((item) => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = item.dataset.action;

                    if (action === 'line') {
                        const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedText}`;
                        window.open(lineUrl, 'line-share', 'width=580,height=500,scrollbars=yes');
                    } else if (action === 'fb') {
                        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                        window.open(fbUrl, 'fb-share', 'width=580,height=400,scrollbars=yes');
                    } else if (action === 'copy') {
                        navigator.clipboard.writeText(shareLink).then(() => {
                            showToast();
                        }).catch(() => {
                            // fallback for older browsers
                            const textarea = document.createElement('textarea');
                            textarea.value = shareLink;
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                            showToast();
                        });
                    }

                    menu.classList.remove('open');
                });
            });
        };

        // 初始化所有分享按鈕
        document.querySelectorAll('.share-icon-btn').forEach((btn) => {
            const shareId = btn.dataset.shareId;
            const shareName = btn.dataset.shareName;
            const menu = btn.parentElement.querySelector(`.share-menu[data-share-menu="${shareId}"]`);

            if (menu && !menu.dataset.initialized) {
                populateMenu(menu, shareId, shareName);
                menu.dataset.initialized = 'true';
            }

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                // 關閉其他已開啟的選單
                document.querySelectorAll('.share-menu.open').forEach((m) => {
                    if (m !== menu) m.classList.remove('open');
                });

                menu?.classList.toggle('open');
            });
        });

        // 點擊其他地方關閉選單
        document.addEventListener('click', () => {
            document.querySelectorAll('.share-menu.open').forEach((m) => {
                m.classList.remove('open');
            });
        });
    };

    applySeo();
    applyBrand();
    renderMenuAndDetails();
    renderTrust();
    renderOrder();
    applyFooter();
    applyFloatingBtn();
    setupLightbox();
    setupShareSystem();

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

    // 返回頂部按鈕
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
