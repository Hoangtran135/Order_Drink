// Global state
let currentUser = null;
let products = [];
let cart = [];
let orders = [];
let favorites = [];
let notifications = [];
let currentPage = 'home';

// DOM elements
const pages = {
    home: document.getElementById('home-page'),
    products: document.getElementById('products-page'),
    productDetail: document.getElementById('product-detail-page'),
    cart: document.getElementById('cart-page'),
    checkout: document.getElementById('checkout-page'),
    orders: document.getElementById('orders-page'),
    favorites: document.getElementById('favorites-page'),
    notifications: document.getElementById('notifications-page'),
    login: document.getElementById('login-page'),
    register: document.getElementById('register-page'),
    admin: document.getElementById('admin-page'),
    profile: document.getElementById('profile-page'),
    about: document.getElementById('about-page')
};

const modals = {
    login: document.getElementById('login-modal'),
    register: document.getElementById('register-modal')
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    loadProducts();
    checkAuthStatus();
});

// Initialize app
async function initializeApp() {
    showLoading();
    try {
        console.log('Initializing app...');
        
        // Initialize pages object
        const pageElements = initializePages();
        Object.assign(pages, pageElements);
        
        await checkAuthStatus();
        await loadProducts();
        await loadCart();
        await loadOrders();
        await loadFavorites();
        await loadNotifications();
        
        // Load featured products for home page
        if (currentPage === 'home') {
            // Wait a bit for DOM to be ready
            setTimeout(async () => {
                await loadFeaturedProducts();
            }, 100);
        }
        
        console.log('App initialized successfully');
        debugAppState();
        
        // Fix button issues
        fixButtonIssues();
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Lỗi khởi tạo ứng dụng', 'error');
    } finally {
        hideLoading();
    }
}







// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Close mobile menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                nav.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
    }

    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) {
                navigateToPage(page);
            }
        });
    });
    
    // Dropdown items
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            if (page) {
                navigateToPage(page);
            }
        });
    });

    // Auth buttons - handle both page navigation and modal
    document.querySelectorAll('[data-page="login"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (btn.id === 'login-btn') {
                showModal('login');
            } else {
                navigateToPage('login');
            }
        });
    });

    document.querySelectorAll('[data-page="register"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (btn.id === 'register-btn') {
                showModal('register');
            } else {
                navigateToPage('register');
            }
        });
    });

    document.getElementById('logout-btn').addEventListener('click', logout);

    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            hideModal(modal.id);
        });
    });

    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal.id);
            }
        });
    });

    // Forms
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('login-page-form').addEventListener('submit', handleLoginPage);
    document.getElementById('register-page-form').addEventListener('submit', handleRegisterPage);
    document.getElementById('checkout-form').addEventListener('submit', handleCheckout);

    // Modal switching
    document.getElementById('switch-to-register').addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('login-modal');
        showModal('register-modal');
    });

    document.getElementById('switch-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        hideModal('register-modal');
        showModal('login-modal');
    });

    // Search functionality
    document.getElementById('search-btn').addEventListener('click', handleSearch);
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Real-time search
    document.getElementById('search-input').addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
            searchProducts(query);
        } else if (query.length === 0) {
            loadProductsPage();
        }
    });

    // Back to products
    document.getElementById('back-to-products').addEventListener('click', () => {
        navigateToPage('products');
    });

    // Profile link - handled by navigation system

    // Dropdown menu links
    document.querySelectorAll('.dropdown-menu a[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            if (page) {
                navigateToPage(page);
            }
        });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.dataset.category;
            filterProducts(category);
            
            // Update active button
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Hero section buttons
    document.querySelectorAll('.hero button[data-page]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const page = btn.dataset.page;
            if (page) {
                navigateToPage(page);
            }
        });
    });

    // Form validation
    setupFormValidation();
}

// Navigation with smooth transitions
function navigateToPage(pageName) {
    console.log('Navigating to page:', pageName, 'Current page:', currentPage);
    
    // Prevent navigation if already on the same page
    if (currentPage === pageName) {
        console.log('Already on page:', pageName);
        return;
    }
    
    // Validate page exists
    if (!pages[pageName]) {
        console.error('Page not found:', pageName, 'Available pages:', Object.keys(pages));
        showNotification(`Trang ${pageName} không tồn tại`, 'error');
        return;
    }
    
    // Show loading state
    showPageLoading();
    
    // Add transition class to current page
    const currentPageElement = pages[currentPage];
    if (currentPageElement) {
        currentPageElement.classList.add('page-exit');
    }
    
    // Wait for exit animation then switch pages
    setTimeout(() => {
        try {
            // Hide all pages first
    Object.values(pages).forEach(page => {
                if (page) {
                    page.classList.remove('active', 'page-enter', 'page-exit');
                    page.style.display = 'none';
                }
    });

    // Show selected page
    if (pages[pageName]) {
                pages[pageName].style.display = 'block';
        pages[pageName].classList.add('active');
        currentPage = pageName;
        
                // Update navigation active states
                updateNavigationActiveState(pageName);
                
                // Load page-specific content with fresh data
                loadPageContent(pageName);
                
                // Add enter animation after a short delay
                setTimeout(() => {
                    pages[pageName].classList.add('page-enter');
                }, 50);
                
                console.log('Successfully navigated to:', pageName);
            } else {
                console.error('Page element not found:', pageName);
                showNotification(`Lỗi chuyển đến trang ${pageName}`, 'error');
            }
        } catch (error) {
            console.error('Error during navigation:', error);
            showNotification('Lỗi chuyển trang', 'error');
        } finally {
            // Hide loading state
            hidePageLoading();
        }
    }, 200);
}

// Update navigation active states
function updateNavigationActiveState(pageName) {
    try {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page link
        const activeLink = document.querySelector(`[data-page="${pageName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            console.log('Updated active nav link for:', pageName);
        } else {
            console.warn('No nav link found for page:', pageName);
        }
    } catch (error) {
        console.error('Error updating navigation state:', error);
    }
}

// Load page content with fresh data
async function loadPageContent(pageName) {
    console.log('Loading page content for:', pageName);
    
    try {
        switch (pageName) {
            case 'home':
                console.log('Loading home page content...');
                await loadFeaturedProducts();
                break;
            case 'products':
                console.log('Loading products page content...');
                await loadProductsPage();
                break;
            case 'cart':
                console.log('Loading cart page content...');
                await loadCartPage();
                break;
            case 'orders':
                console.log('Loading orders page content...');
                await loadOrdersPage();
                break;
            case 'favorites':
                console.log('Loading favorites page content...');
                await loadFavoritesPage();
                break;
            case 'notifications':
                console.log('Loading notifications page content...');
                await loadNotificationsPage();
                break;
            case 'admin':
                console.log('Loading admin page content...');
                await loadAdminPage();
                break;
            case 'productDetail':
                console.log('Product detail page content loaded by viewProductDetails');
                break;
            case 'profile':
                console.log('Loading profile page content...');
                loadProfilePage();
                break;
            case 'about':
                console.log('About page - no data loading needed');
                break;
            default:
                console.warn('Unknown page:', pageName);
                break;
        }
        console.log('Page content loaded successfully for:', pageName);
    } catch (error) {
        console.error(`Error loading ${pageName} page:`, error);
        showNotification(`Lỗi tải trang ${pageName}`, 'error');
    }
}

// Show page loading state
function showPageLoading() {
    const loadingOverlay = document.getElementById('page-loading');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hide');
        loadingOverlay.classList.add('show');
        loadingOverlay.style.display = 'flex';
        console.log('Page loading shown');
    } else {
        console.error('Page loading overlay not found');
    }
}

// Hide page loading state
function hidePageLoading() {
    const loadingOverlay = document.getElementById('page-loading');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('show');
        loadingOverlay.classList.add('hide');
        
        // Delay hiding to allow transition
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 300);
        
        console.log('Page loading hidden');
    } else {
        console.error('Page loading overlay not found');
    }
}



// Initialize pages object
function initializePages() {
    const pageElements = {
        home: document.getElementById('home-page'),
        products: document.getElementById('products-page'),
        productDetail: document.getElementById('product-detail-page'),
        cart: document.getElementById('cart-page'),
        checkout: document.getElementById('checkout-page'),
        orders: document.getElementById('orders-page'),
        favorites: document.getElementById('favorites-page'),
        notifications: document.getElementById('notifications-page'),
        login: document.getElementById('login-page'),
        register: document.getElementById('register-page'),
        admin: document.getElementById('admin-page'),
        profile: document.getElementById('profile-page'),
        about: document.getElementById('about-page')
    };
    
    return pageElements;
}

// Check DOM elements
function checkDOMElements() {
    const featuredContainer = document.getElementById('featured-products');
    const productsContainer = document.getElementById('products-grid');
    
    console.log('DOM Elements Check:');
    console.log('Featured products container:', !!featuredContainer);
    console.log('Products grid container:', !!productsContainer);
    
    if (featuredContainer) {
        console.log('Featured container children:', featuredContainer.children.length);
    }
    
    if (productsContainer) {
        console.log('Products container children:', productsContainer.children.length);
    }
}


// Force reload products with fresh data
async function forceReloadProducts() {
    console.log('Force reloading products...');
    try {
        const response = await apiCall('/api/products');
        products = response || [];
        console.log('Products reloaded:', products.length);
        
        // Reload current page
        if (currentPage === 'home') {
            await loadFeaturedProducts();
        } else if (currentPage === 'products') {
            await loadProductsPage();
        }
        
        showNotification('Sản phẩm đã được tải lại', 'success');
    } catch (error) {
        console.error('Force reload failed:', error);
        showNotification('Lỗi tải lại sản phẩm', 'error');
    }
}








// Force show all product cards
function forceShowProductCards() {
    console.log('Force showing all product cards...');
    
    const allCards = document.querySelectorAll('.product-card');
    console.log('Found cards:', allCards.length);
    
    allCards.forEach((card, index) => {
        // Force visibility
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.visibility = 'visible';
        card.style.zIndex = '1';
        
        // Remove any problematic classes
        card.classList.remove('fade-out', 'hidden', 'invisible');
        
        console.log(`Fixed card ${index}:`, {
            display: card.style.display,
            opacity: card.style.opacity,
            visibility: card.style.visibility,
            zIndex: card.style.zIndex
        });
    });
    
    showNotification(`Đã sửa ${allCards.length} sản phẩm`, 'success');
}



// Debug product cards visibility
function debugProductCards() {
    console.log('=== Product Cards Debug ===');
    
    const featuredContainer = document.getElementById('featured-products');
    const productsContainer = document.getElementById('products-grid');
    
    if (featuredContainer) {
        const featuredCards = featuredContainer.querySelectorAll('.product-card');
        console.log('Featured products container:', {
            exists: !!featuredContainer,
            cardCount: featuredCards.length,
            innerHTML: featuredContainer.innerHTML.substring(0, 200) + '...'
        });
        
        featuredCards.forEach((card, index) => {
            const computedStyle = window.getComputedStyle(card);
            console.log(`Featured card ${index}:`, {
                display: computedStyle.display,
                opacity: computedStyle.opacity,
                visibility: computedStyle.visibility,
                zIndex: computedStyle.zIndex,
                classes: card.className
            });
        });
    }
    
    if (productsContainer) {
        const productCards = productsContainer.querySelectorAll('.product-card');
        console.log('Products container:', {
            exists: !!productsContainer,
            cardCount: productCards.length,
            innerHTML: productsContainer.innerHTML.substring(0, 200) + '...'
        });
        
        productCards.forEach((card, index) => {
            const computedStyle = window.getComputedStyle(card);
            console.log(`Product card ${index}:`, {
                display: computedStyle.display,
                opacity: computedStyle.opacity,
                visibility: computedStyle.visibility,
                zIndex: computedStyle.zIndex,
                classes: card.className
            });
        });
    }
}

// Profile functions
function editProfile() {
    // Hide profile info and show edit form
    document.querySelector('.profile-info').style.display = 'none';
    document.querySelector('.profile-actions').style.display = 'none';
    document.getElementById('edit-profile-form').style.display = 'block';
    
    // Fill form with current user data
    if (currentUser) {
        document.getElementById('edit-name').value = currentUser.fullName || '';
        document.getElementById('edit-email').value = currentUser.email || '';
        document.getElementById('edit-phone').value = currentUser.phone || '';
        document.getElementById('edit-address').value = currentUser.address || '';
    }
}

function changePassword() {
    // Hide profile info and show password form
    document.querySelector('.profile-info').style.display = 'none';
    document.querySelector('.profile-actions').style.display = 'none';
    document.getElementById('change-password-form').style.display = 'block';
}

function cancelEditProfile() {
    // Show profile info and hide edit form
    document.querySelector('.profile-info').style.display = 'flex';
    document.querySelector('.profile-actions').style.display = 'flex';
    document.getElementById('edit-profile-form').style.display = 'none';
}

function cancelChangePassword() {
    // Show profile info and hide password form
    document.querySelector('.profile-info').style.display = 'flex';
    document.querySelector('.profile-actions').style.display = 'flex';
    document.getElementById('change-password-form').style.display = 'none';
}

function loadProfilePage() {
    console.log('Loading profile page...');
    
    // Update profile information if user is logged in
    if (currentUser) {
        document.getElementById('profile-name').textContent = currentUser.fullName || 'Tên người dùng';
        document.getElementById('profile-email').textContent = currentUser.email || 'Email người dùng';
        document.getElementById('profile-phone').textContent = currentUser.phone || 'Số điện thoại';
    } else {
        document.getElementById('profile-name').textContent = 'Chưa đăng nhập';
        document.getElementById('profile-email').textContent = 'Vui lòng đăng nhập để xem thông tin';
        document.getElementById('profile-phone').textContent = '';
    }
    
    // Setup form event listeners
    setupProfileFormListeners();
}

function setupProfileFormListeners() {
    // Profile edit form
    const profileEditForm = document.getElementById('profile-edit-form');
    if (profileEditForm) {
        profileEditForm.addEventListener('submit', handleProfileEdit);
    }
    
    // Password change form
    const passwordChangeForm = document.getElementById('password-change-form');
    if (passwordChangeForm) {
        passwordChangeForm.addEventListener('submit', handlePasswordChange);
    }
}

async function handleProfileEdit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const profileData = {
        fullName: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address')
    };
    
    try {
        const response = await apiCall('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
        
        if (response.success) {
            // Update current user data
            currentUser = { ...currentUser, ...profileData };
            
            // Update profile display
            document.getElementById('profile-name').textContent = profileData.fullName;
            document.getElementById('profile-email').textContent = profileData.email;
            document.getElementById('profile-phone').textContent = profileData.phone;
            
            // Hide form and show profile info
            cancelEditProfile();
            
            showNotification('Cập nhật thông tin thành công!', 'success');
        } else {
            showNotification('Cập nhật thông tin thất bại: ' + response.message, 'error');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Lỗi cập nhật thông tin', 'error');
    }
}

async function handlePasswordChange(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const passwordData = {
        currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword'),
        confirmPassword: formData.get('confirmPassword')
    };
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        showNotification('Mật khẩu mới và xác nhận mật khẩu không khớp', 'error');
        return;
    }
    
    // Validate password strength
    if (passwordData.newPassword.length < 6) {
        showNotification('Mật khẩu mới phải có ít nhất 6 ký tự', 'error');
        return;
    }
    
    try {
        const response = await apiCall('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify(passwordData)
        });
        
        if (response.success) {
            // Hide form and show profile info
            cancelChangePassword();
            
            // Clear form
            e.target.reset();
            
            showNotification('Đổi mật khẩu thành công!', 'success');
        } else {
            showNotification('Đổi mật khẩu thất bại: ' + response.message, 'error');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showNotification('Lỗi đổi mật khẩu', 'error');
    }
}

// API calls
async function apiCall(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(`/api${endpoint}`, { ...defaultOptions, ...options });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API call failed');
    }
    
    return response.json();
}

// Auth functions
async function checkAuthStatus() {
    try {
        const result = await apiCall('/auth/me');
        if (result.isAuthenticated) {
            currentUser = result.user;
            updateAuthUI(true);
        } else {
            currentUser = null;
            updateAuthUI(false);
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        currentUser = null;
        updateAuthUI(false);
    }
}



async function logout() {
    try {
        await apiCall('/auth/logout', { method: 'POST' });
        currentUser = null;
        cart = [];
        updateAuthUI(false);
        showNotification('Đăng xuất thành công!', 'success');
        navigateToPage('home');
    } catch (error) {
        showNotification('Lỗi khi đăng xuất', 'error');
    }
}

// Product functions
async function loadProducts() {
    try {
        products = await apiCall('/products');
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Lỗi tải sản phẩm', 'error');
    }
}

async function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) {
        console.error('Featured products container not found!');
        checkDOMElements();
        return;
    }
    
    try {
        // Show loading state
        container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
        
        // Fetch fresh products data
        let freshProducts;
        try {
            const response = await apiCall('/api/products');
            freshProducts = response || products;
        } catch (apiError) {
            console.warn('API call failed, using cached products:', apiError);
            freshProducts = products;
            
            // If no cached products, create some mock data
            if (!freshProducts || freshProducts.length === 0) {
                freshProducts = [
                    { id: 1, name: 'Cà phê đen', description: 'Cà phê đen truyền thống', price: 25000, available: true },
                    { id: 2, name: 'Cà phê sữa', description: 'Cà phê sữa đặc biệt', price: 30000, available: true },
                    { id: 3, name: 'Trà sữa trân châu', description: 'Trà sữa với trân châu đen', price: 35000, available: true }
                ];
            }
        }
        
        if (freshProducts.length === 0) {
            container.innerHTML = '<p class="text-center">Không có sản phẩm nào</p>';
            return;
        }
        
        // Show first 6 products as featured
        const featuredProducts = freshProducts.slice(0, 6);
        container.innerHTML = '';
        
        if (!featuredProducts || featuredProducts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>Không có sản phẩm nổi bật</p>
                    <button class="btn btn-primary" onclick="navigateToPage('products')">Xem tất cả sản phẩm</button>
                </div>
            `;
            return;
        }
        
        console.log('Loading featured products:', featuredProducts.length);
        console.log('Featured products:', featuredProducts);
        
        featuredProducts.forEach((product, index) => {
            try {
                const productCard = createProductCard(product);
                if (!productCard) {
                    console.error('Empty product card for product:', product);
                    return;
                }
                
                const cardElement = document.createElement('div');
                cardElement.innerHTML = productCard;
                const card = cardElement.firstElementChild;
                
                if (card) {
                    card.style.animationDelay = `${index * 0.1}s`;
                    card.classList.add('fade-in-up');
                    container.appendChild(card);
                    
                    // Add event listeners to the new card
                    addProductCardEventListeners(card);
                } else {
                    console.error('Failed to create featured card for product:', product);
                }
            } catch (cardError) {
                console.error('Error creating featured card for product:', product, cardError);
            }
        });
    } catch (error) {
        console.error('Error loading featured products:', error);
        container.innerHTML = `
            <div class="error-state">
                <p>Lỗi tải sản phẩm: ${error.message}</p>
                <button class="btn btn-secondary" onclick="loadFeaturedProducts()">Thử lại</button>
            </div>
        `;
        showNotification('Lỗi tải sản phẩm nổi bật', 'error');
    }
}

async function loadProductsPage() {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    try {
        // Show loading state
        container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
        
        // Fetch fresh products data
        let freshProducts;
        try {
            const response = await apiCall('/api/products');
            freshProducts = response || products;
        } catch (apiError) {
            console.warn('API call failed, using cached products:', apiError);
            freshProducts = products;
            
            // If no cached products, create some mock data
            if (!freshProducts || freshProducts.length === 0) {
                freshProducts = [
                    { id: 1, name: 'Cà phê đen', description: 'Cà phê đen truyền thống', price: 25000, available: true },
                    { id: 2, name: 'Cà phê sữa', description: 'Cà phê sữa đặc biệt', price: 30000, available: true },
                    { id: 3, name: 'Trà sữa trân châu', description: 'Trà sữa với trân châu đen', price: 35000, available: true }
                ];
            }
        }
        
        if (freshProducts.length === 0) {
            container.innerHTML = '<p class="text-center">Không có sản phẩm nào</p>';
            return;
        }
        
        // Clear and populate with fresh data
        container.innerHTML = '';
        
        console.log('Loading products:', freshProducts.length);
        console.log('Fresh products:', freshProducts);
        debugAppState();
        
        freshProducts.forEach((product, index) => {
            try {
                const productCard = createProductCard(product);
                if (!productCard) {
                    console.error('Empty product card for product:', product);
                    return;
                }
                
                const cardElement = document.createElement('div');
                cardElement.innerHTML = productCard;
                const card = cardElement.firstElementChild;
                
                if (card) {
                    card.style.animationDelay = `${index * 0.05}s`;
                    card.classList.add('fade-in-up');
                    container.appendChild(card);
                    
                    // Add event listeners to the new card
                    addProductCardEventListeners(card);
                } else {
                    console.error('Failed to create card for product:', product);
                }
            } catch (cardError) {
                console.error('Error creating card for product:', product, cardError);
            }
        });
    } catch (error) {
        console.error('Error loading products page:', error);
        container.innerHTML = `
            <div class="error-state">
                <p>Lỗi tải sản phẩm: ${error.message}</p>
                <button class="btn btn-secondary" onclick="loadProductsPage()">Thử lại</button>
            </div>
        `;
        showNotification('Lỗi tải trang sản phẩm', 'error');
    }
}

function createProductCard(product) {
    // Validate product data
    if (!product || !product.id || !product.name) {
        console.error('Invalid product data:', product);
        return '';
    }
    
    try {
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <i class="fas fa-coffee"></i>
                    <button class="favorite-btn" data-product-id="${product.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                    <h3 class="product-name">${product.name || 'Sản phẩm'}</h3>
                    <p class="product-description">${product.description || 'Mô tả sản phẩm'}</p>
                    <div class="product-price">${formatPrice(product.price || 0)} VNĐ</div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-add-cart" data-product-id="${product.id}" ${!product.available ? 'disabled' : ''}>
                        ${product.available ? 'Thêm vào giỏ' : 'Hết hàng'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error creating product card:', error, product);
        return '';
    }
}

// Add event listeners to product cards
function addProductCardEventListeners(card) {
    if (!card) {
        console.error('Card element is null');
        return;
    }
    
    try {
        // Add to cart button
        const addToCartBtn = card.querySelector('.btn-add-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(addToCartBtn.dataset.productId);
                if (productId && !isNaN(productId)) {
                    addToCart(productId);
                } else {
                    console.error('Invalid product ID for add to cart:', addToCartBtn.dataset.productId);
                }
            });
        }
        
        // Favorite button
        const favoriteBtn = card.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(favoriteBtn.dataset.productId);
                if (productId && !isNaN(productId)) {
                    toggleFavorite(productId);
                } else {
                    console.error('Invalid product ID for favorite:', favoriteBtn.dataset.productId);
                }
            });
        }
        
        // Card click to view details
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on buttons
            if (e.target.closest('button')) return;
            
            const productId = parseInt(card.dataset.productId);
            if (productId && !isNaN(productId)) {
                viewProductDetails(productId);
            } else {
                console.error('Invalid product ID for view details:', card.dataset.productId);
            }
        });
    } catch (error) {
        console.error('Error adding event listeners to card:', error);
    }
}

// View product details
function viewProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        navigateToPage('productDetail');
        loadProductDetail(product);
    }
}

// Load product detail page
function loadProductDetail(product) {
    const container = document.getElementById('product-detail-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <i class="fas fa-coffee"></i>
            </div>
            <div class="product-detail-info">
                <h1>${product.name}</h1>
                <p class="product-detail-description">${product.description}</p>
                <div class="product-detail-price">${formatPrice(product.price)} VNĐ</div>
                <div class="product-detail-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})" ${!product.available ? 'disabled' : ''}>
                        ${product.available ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </button>
                    <button class="btn btn-secondary" onclick="toggleFavorite(${product.id})">
                        <i class="fas fa-heart"></i> Yêu thích
                    </button>
                </div>
            </div>
        </div>
    `;
}

function filterProducts(category) {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const container = document.getElementById('product-detail');
    if (!container) return;
    
    container.innerHTML = `
        <div class="product-detail-image">
            <i class="fas fa-coffee"></i>
        </div>
        <div class="product-detail-info">
            <h1>${product.name}</h1>
            <div class="product-detail-price">${formatPrice(product.price)} VNĐ</div>
            <p class="product-detail-description">${product.description}</p>
            <div class="quantity-selector">
                <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                <input type="number" class="quantity-input" id="product-quantity" value="1" min="1">
                <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
            </div>
            <button class="btn btn-primary btn-large" onclick="addToCartFromDetail(${product.id})" ${!product.available ? 'disabled' : ''}>
                ${product.available ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
            </button>
        </div>
    `;
    
    navigateToPage('productDetail');
}

function changeQuantity(delta) {
    const input = document.getElementById('product-quantity');
    const newValue = parseInt(input.value) + delta;
    if (newValue >= 1) {
        input.value = newValue;
    }
}

async function addToCart(productId, quantity = 1) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để thêm vào giỏ hàng', 'error');
        showModal('login');
        return;
    }
    
    try {
        await apiCall('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
        
        await loadCart();
        updateCartCount();
        showNotification('Đã thêm vào giỏ hàng!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function addToCartFromDetail(productId) {
    const quantity = parseInt(document.getElementById('product-quantity').value);
    await addToCart(productId, quantity);
}

// Cart functions
async function loadCart() {
    if (!currentUser) {
        cart = [];
        return;
    }
    
    try {
        cart = await apiCall('/cart');
    } catch (error) {
        console.error('Error loading cart:', error);
        cart = [];
    }
}

function loadCartPage() {
    const container = document.getElementById('cart-content');
    const actions = document.getElementById('cart-actions');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p>Giỏ hàng trống</p>';
        actions.style.display = 'none';
        return;
    }
    
    container.innerHTML = cart.map(item => createCartItem(item)).join('');
    actions.style.display = 'block';
    updateCartTotal();
}

function createCartItem(item) {
    return `
        <div class="cart-item">
            <div class="cart-item-image">
                <i class="fas fa-coffee"></i>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.product.name}</div>
                <div class="cart-item-price">${formatPrice(item.product.price)} VNĐ</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateCartQuantity(${item.productId}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${item.productId}, ${item.quantity + 1})">+</button>
                <button class="btn btn-outline" onclick="removeFromCart(${item.productId})">Xóa</button>
            </div>
        </div>
    `;
}

async function updateCartQuantity(productId, quantity) {
    if (!currentUser) return;
    
    try {
        if (quantity <= 0) {
            await apiCall(`/cart/remove/${productId}`, { method: 'DELETE' });
        } else {
            await apiCall('/cart/update', {
                method: 'PUT',
                body: JSON.stringify({ productId, quantity })
            });
        }
        
        await loadCart();
        loadCartPage();
        updateCartCount();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function removeFromCart(productId) {
    if (!currentUser) return;
    
    try {
        await apiCall(`/cart/remove/${productId}`, { method: 'DELETE' });
        await loadCart();
        loadCartPage();
        updateCartCount();
        showNotification('Đã xóa khỏi giỏ hàng', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = formatPrice(total);
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Checkout functions
function loadCheckoutPage() {
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    
    if (!orderItems || !orderTotal) return;
    
    orderItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.product.name} x${item.quantity}</span>
            <span>${formatPrice(item.product.price * item.quantity)} VNĐ</span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    orderTotal.textContent = formatPrice(total);
}

async function handleCheckout(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để đặt hàng', 'error');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Giỏ hàng trống', 'error');
        return;
    }
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        showLoading();
        const result = await apiCall('/orders', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        showNotification('Đặt hàng thành công!', 'success');
        await loadCart();
        await loadOrders();
        updateCartCount();
        navigateToPage('orders');
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Orders functions
async function loadOrders() {
    if (!currentUser) {
        orders = [];
        return;
    }
    
    try {
        orders = await apiCall('/orders');
    } catch (error) {
        console.error('Error loading orders:', error);
        orders = [];
    }
}

function loadOrdersPage() {
    const container = document.getElementById('orders-list');
    if (!container) return;
    
    if (orders.length === 0) {
        container.innerHTML = '<p>Bạn chưa có đơn hàng nào</p>';
        return;
    }
    
    container.innerHTML = orders.map(order => createOrderCard(order)).join('');
}

function createOrderCard(order) {
    const statusClass = order.status;
    const statusText = {
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        preparing: 'Đang chuẩn bị',
        ready: 'Sẵn sàng',
        delivered: 'Đã giao',
        cancelled: 'Đã hủy'
    };
    
    return `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">Đơn hàng #${order.id}</div>
                <div class="order-status ${statusClass}">${statusText[order.status]}</div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item-detail">
                        <span>${item.product?.name || 'Sản phẩm không tồn tại'} x${item.quantity}</span>
                        <span>${formatPrice((item.product?.price || 0) * item.quantity)} VNĐ</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total-amount">
                Tổng cộng: ${formatPrice(order.totalAmount)} VNĐ
            </div>
            <div style="margin-top: 1rem; color: #666; font-size: 0.9rem;">
                Ngày đặt: ${new Date(order.createdAt).toLocaleDateString('vi-VN')}
            </div>
        </div>
    `;
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Search functionality
function handleSearch() {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        searchProducts(query);
        navigateToPage('products');
    }
}

function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Thử tìm kiếm với từ khóa khác</p>
            </div>
        `;
    } else {
        container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    }
}

// Form validation
function setupFormValidation() {
    // Login form validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const inputs = loginForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
    }

    // Register form validation
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const inputs = registerForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });

        // Password confirmation
        const passwordInput = document.getElementById('register-password');
        const confirmPasswordInput = document.getElementById('register-confirm-password');
        
        if (passwordInput && confirmPasswordInput) {
            confirmPasswordInput.addEventListener('blur', () => {
                if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
                    showFieldError(confirmPasswordInput, 'Mật khẩu không khớp');
                }
            });
        }
    }
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    clearFieldError(field);

    // Required field validation
    if (field.required && !value) {
        errorMessage = 'Trường này là bắt buộc';
        isValid = false;
    }

    // Specific field validations
    if (value && isValid) {
        switch (fieldName) {
            case 'username':
                if (value.length < 3) {
                    errorMessage = 'Tên đăng nhập phải có ít nhất 3 ký tự';
                    isValid = false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Email không hợp lệ';
                    isValid = false;
                }
                break;
            case 'password':
                if (value.length < 6) {
                    errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự';
                    isValid = false;
                }
                break;
            case 'phone':
                const phoneRegex = /^[0-9]{10,11}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                    errorMessage = 'Số điện thoại không hợp lệ';
                    isValid = false;
                }
                break;
        }
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;

    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// Enhanced login with validation
async function handleLogin(e) {
    e.preventDefault();
    
    if (!validateForm('login-form')) {
        showNotification('Vui lòng kiểm tra lại thông tin', 'error');
        return;
    }

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        showLoading();
        const result = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        currentUser = result.user;
        updateAuthUI(true);
        hideModal('login-modal');
        showNotification('Đăng nhập thành công!', 'success');
        e.target.reset();
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Enhanced register with validation
async function handleRegister(e) {
    e.preventDefault();
    
    if (!validateForm('register-form')) {
        showNotification('Vui lòng kiểm tra lại thông tin', 'error');
        return;
    }

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Check password confirmation
    if (data.password !== data.confirmPassword) {
        showNotification('Mật khẩu không khớp', 'error');
        return;
    }
    
    try {
        showLoading();
        const result = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        currentUser = result.user;
        updateAuthUI(true);
        hideModal('register-modal');
        showNotification('Đăng ký thành công!', 'success');
        e.target.reset();
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Handle login page form
async function handleLoginPage(e) {
    e.preventDefault();
    
    if (!validateForm('login-page-form')) {
        showNotification('Vui lòng kiểm tra lại thông tin', 'error');
        return;
    }

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        showLoading();
        const result = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        currentUser = result.user;
        updateAuthUI(true);
        showNotification('Đăng nhập thành công!', 'success');
        e.target.reset();
        navigateToPage('home');
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Handle register page form
async function handleRegisterPage(e) {
    e.preventDefault();
    
    if (!validateForm('register-page-form')) {
        showNotification('Vui lòng kiểm tra lại thông tin', 'error');
        return;
    }

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Check password confirmation
    if (data.password !== data.confirmPassword) {
        showNotification('Mật khẩu không khớp', 'error');
        return;
    }
    
    try {
        showLoading();
        const result = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        currentUser = result.user;
        updateAuthUI(true);
        showNotification('Đăng ký thành công!', 'success');
        e.target.reset();
        navigateToPage('home');
    } catch (error) {
        showNotification(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Global event delegation for dynamic buttons
document.addEventListener('click', (e) => {
    // Checkout button
    if (e.target.id === 'checkout-btn') {
        if (!currentUser) {
            showNotification('Vui lòng đăng nhập để thanh toán', 'error');
            showModal('login');
            return;
        }
        
        if (cart.length === 0) {
            showNotification('Giỏ hàng trống', 'error');
            return;
        }
        
        loadCheckoutPage();
        navigateToPage('checkout');
    }
    
    // Add to cart buttons
    if (e.target.classList.contains('btn-add-cart')) {
        e.preventDefault();
        const productId = parseInt(e.target.dataset.productId);
        if (productId) {
            addToCart(productId);
        }
    }
    
    // Add to favorites buttons
    if (e.target.classList.contains('btn-add-favorite')) {
        e.preventDefault();
        const productId = parseInt(e.target.dataset.productId);
        if (productId) {
            addToFavorites(productId);
        }
    }
    
    // Remove from favorites buttons
    if (e.target.classList.contains('btn-remove-favorite')) {
        e.preventDefault();
        const productId = parseInt(e.target.dataset.productId);
        if (productId) {
            removeFromFavorites(productId);
        }
    }
    
    // Product card clicks
    if (e.target.closest('.product-card')) {
        const productCard = e.target.closest('.product-card');
        const productId = parseInt(productCard.dataset.productId);
        if (productId && !e.target.closest('button')) {
            showProductDetail(productId);
        }
    }
    
    // Navigation links with data-page
    if (e.target.matches('[data-page]')) {
        e.preventDefault();
        const page = e.target.dataset.page;
        if (page) {
            navigateToPage(page);
        }
    }
    
    // Terms link
    if (e.target.classList.contains('terms-link')) {
        e.preventDefault();
        showNotification('Điều khoản sử dụng đang được cập nhật', 'info');
    }
    
    // Back to home links
    if (e.target.textContent.includes('Quay lại trang chủ')) {
        e.preventDefault();
        navigateToPage('home');
    }
});

// Favorites functions
async function loadFavorites() {
    if (!currentUser) {
        favorites = [];
        return;
    }
    
    try {
        favorites = await apiCall('/favorites');
    } catch (error) {
        console.error('Error loading favorites:', error);
        favorites = [];
    }
}

function loadFavoritesPage() {
    const container = document.getElementById('favorites-content');
    if (!container) return;
    
    if (favorites.length === 0) {
        container.innerHTML = '<p>Bạn chưa có sản phẩm yêu thích nào</p>';
        return;
    }
    
    container.innerHTML = favorites.map(fav => createFavoriteCard(fav)).join('');
}

function createFavoriteCard(favorite) {
    const product = favorite.product;
    if (!product) return '';
    
    return `
        <div class="favorite-card">
            <div class="favorite-image">
                <i class="fas fa-coffee"></i>
            </div>
            <div class="favorite-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="favorite-price">${formatPrice(product.price)} VNĐ</div>
                <div class="favorite-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">
                        Thêm vào giỏ
                    </button>
                    <button class="btn btn-outline" onclick="removeFromFavorites(${product.id})">
                        <i class="fas fa-heart-broken"></i> Bỏ yêu thích
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function addToFavorites(productId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để thêm vào yêu thích', 'error');
        return;
    }
    
    try {
        await apiCall('/favorites/add', {
            method: 'POST',
            body: JSON.stringify({ productId })
        });
        
        await loadFavorites();
        showNotification('Đã thêm vào danh sách yêu thích!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function removeFromFavorites(productId) {
    if (!currentUser) return;
    
    try {
        await apiCall(`/favorites/remove/${productId}`, { method: 'DELETE' });
        await loadFavorites();
        loadFavoritesPage();
        showNotification('Đã xóa khỏi danh sách yêu thích', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Toggle favorite status
async function toggleFavorite(productId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để thêm vào yêu thích', 'error');
        showModal('login');
        return;
    }
    
    try {
        const result = await apiCall('/favorites/toggle', {
            method: 'POST',
            body: JSON.stringify({ productId })
        });
        
        await loadFavorites();
        updateFavoriteButton(productId, result.isFavorite);
        showNotification(result.isFavorite ? 'Đã thêm vào yêu thích!' : 'Đã xóa khỏi yêu thích!', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Update favorite button appearance
function updateFavoriteButton(productId, isFavorite) {
    const buttons = document.querySelectorAll(`[data-product-id="${productId}"].favorite-btn`);
    buttons.forEach(btn => {
        if (isFavorite) {
            btn.classList.add('favorited');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('favorited');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
}

// Notifications functions
async function loadNotifications() {
    if (!currentUser) {
        notifications = [];
        return;
    }
    
    try {
        const result = await apiCall('/notifications');
        notifications = result.notifications || [];
        updateNotificationCount(result.unreadCount || 0);
    } catch (error) {
        console.error('Error loading notifications:', error);
        notifications = [];
    }
}

function loadNotificationsPage() {
    const container = document.getElementById('notifications-content');
    if (!container) return;
    
    if (notifications.length === 0) {
        container.innerHTML = '<p>Bạn chưa có thông báo nào</p>';
        return;
    }
    
    container.innerHTML = notifications.map(notif => createNotificationCard(notif)).join('');
}

function createNotificationCard(notification) {
    const timeAgo = getTimeAgo(notification.createdAt);
    
    return `
        <div class="notification-card ${notification.isRead ? 'read' : 'unread'}">
            <div class="notification-icon">
                <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <h4>${notification.title}</h4>
                <p>${notification.message}</p>
                <div class="notification-time">${timeAgo}</div>
            </div>
            <div class="notification-actions">
                ${!notification.isRead ? `
                    <button class="btn btn-sm" onclick="markNotificationRead(${notification.id})">
                        Đánh dấu đã đọc
                    </button>
                ` : ''}
                <button class="btn btn-sm btn-outline" onclick="deleteNotification(${notification.id})">
                    Xóa
                </button>
            </div>
        </div>
    `;
}

function getNotificationIcon(type) {
    const icons = {
        'info': 'info-circle',
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'error': 'times-circle'
    };
    return icons[type] || 'bell';
}

function getTimeAgo(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return `${days} ngày trước`;
}

async function markNotificationRead(notificationId) {
    try {
        await apiCall(`/notifications/${notificationId}/read`, { method: 'PUT' });
        await loadNotifications();
        loadNotificationsPage();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function deleteNotification(notificationId) {
    try {
        await apiCall(`/notifications/${notificationId}`, { method: 'DELETE' });
        await loadNotifications();
        loadNotificationsPage();
        showNotification('Đã xóa thông báo', 'success');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

function updateNotificationCount(count) {
    const countElement = document.querySelector('.notification-count');
    if (countElement) {
        countElement.textContent = count;
        countElement.style.display = count > 0 ? 'inline' : 'none';
    }
}

// Admin functions
function loadAdminPage() {
    const container = document.getElementById('admin-dashboard');
    if (!container) return;
    
    if (!currentUser || currentUser.username !== 'admin') {
        container.innerHTML = '<p>Bạn không có quyền truy cập trang quản trị</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="admin-stats">
            <div class="stat-card">
                <h3>Tổng đơn hàng</h3>
                <div class="stat-value" id="total-orders">-</div>
            </div>
            <div class="stat-card">
                <h3>Tổng doanh thu</h3>
                <div class="stat-value" id="total-revenue">-</div>
            </div>
            <div class="stat-card">
                <h3>Tổng người dùng</h3>
                <div class="stat-value" id="total-users">-</div>
            </div>
            <div class="stat-card">
                <h3>Tổng sản phẩm</h3>
                <div class="stat-value" id="total-products">-</div>
            </div>
        </div>
        <div class="admin-actions">
            <button class="btn btn-primary" onclick="loadAdminOrders()">Quản lý đơn hàng</button>
            <button class="btn btn-primary" onclick="loadAdminProducts()">Quản lý sản phẩm</button>
            <button class="btn btn-primary" onclick="loadAdminUsers()">Quản lý người dùng</button>
        </div>
    `;
    
    loadAdminStats();
}

async function loadAdminStats() {
    try {
        const stats = await apiCall('/admin/analytics');
        
        document.getElementById('total-orders').textContent = stats.totalOrders;
        document.getElementById('total-revenue').textContent = formatPrice(stats.totalRevenue);
        document.getElementById('total-users').textContent = stats.totalUsers;
        document.getElementById('total-products').textContent = stats.totalProducts;
    } catch (error) {
        console.error('Error loading admin stats:', error);
    }
}

// Update navigation to handle new pages
function updateAuthUI(isAuthenticated) {
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const profileLink = document.getElementById('profile-link');
    const ordersLink = document.getElementById('orders-link');
    const favoritesLink = document.getElementById('favorites-link');
    const notificationsLink = document.getElementById('notifications-link');
    const adminLink = document.getElementById('admin-link');
    
    if (isAuthenticated) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        if (profileLink) profileLink.style.display = 'block';
        ordersLink.style.display = 'block';
        favoritesLink.style.display = 'block';
        notificationsLink.style.display = 'block';
        
        // Show admin link only for admin users
        if (currentUser && currentUser.username === 'admin') {
            adminLink.style.display = 'block';
        }
        
        document.getElementById('user-display-name').textContent = currentUser.fullName;
    } else {
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
        if (profileLink) profileLink.style.display = 'none';
        ordersLink.style.display = 'none';
        favoritesLink.style.display = 'none';
        notificationsLink.style.display = 'none';
        adminLink.style.display = 'none';
    }
}

// Fix button issues
function fixButtonIssues() {
    console.log('Fixing button issues...');
    
    // Fix navigation links
    document.querySelectorAll('[data-page]').forEach(element => {
        // Remove existing event listeners
        element.removeEventListener('click', handleNavigationClick);
        // Add new event listener
        element.addEventListener('click', handleNavigationClick);
    });
    
    // Fix profile buttons
    const editProfileBtn = document.querySelector('button[onclick="editProfile()"]');
    if (editProfileBtn) {
        editProfileBtn.removeEventListener('click', editProfile);
        editProfileBtn.addEventListener('click', editProfile);
    }
    
    const changePasswordBtn = document.querySelector('button[onclick="changePassword()"]');
    if (changePasswordBtn) {
        changePasswordBtn.removeEventListener('click', changePassword);
        changePasswordBtn.addEventListener('click', changePassword);
    }
    
    const cancelEditBtn = document.querySelector('button[onclick="cancelEditProfile()"]');
    if (cancelEditBtn) {
        cancelEditBtn.removeEventListener('click', cancelEditProfile);
        cancelEditBtn.addEventListener('click', cancelEditProfile);
    }
    
    const cancelPasswordBtn = document.querySelector('button[onclick="cancelChangePassword()"]');
    if (cancelPasswordBtn) {
        cancelPasswordBtn.removeEventListener('click', cancelChangePassword);
        cancelPasswordBtn.addEventListener('click', cancelChangePassword);
    }
    
    console.log('Button issues fixed');
}

// Handle navigation clicks
function handleNavigationClick(e) {
    e.preventDefault();
    const page = e.target.dataset.page || e.target.closest('[data-page]')?.dataset.page;
    if (page) {
        console.log('Navigating to:', page);
        navigateToPage(page);
    }
}

// Debug function to test buttons
function testButtons() {
    console.log('=== Testing Buttons ===');
    
    // Test navigation buttons
    const navLinks = document.querySelectorAll('[data-page]');
    console.log('Navigation links found:', navLinks.length);
    navLinks.forEach(link => {
        console.log('Nav link:', link.dataset.page, 'onclick:', !!link.onclick);
    });
    
    // Test profile buttons
    const editBtn = document.querySelector('button[onclick="editProfile()"]');
    const changeBtn = document.querySelector('button[onclick="changePassword()"]');
    const cancelEditBtn = document.querySelector('button[onclick="cancelEditProfile()"]');
    const cancelPasswordBtn = document.querySelector('button[onclick="cancelChangePassword()"]');
    
    console.log('Edit profile button:', !!editBtn);
    console.log('Change password button:', !!changeBtn);
    console.log('Cancel edit button:', !!cancelEditBtn);
    console.log('Cancel password button:', !!cancelPasswordBtn);
    
    // Test if functions exist
    console.log('editProfile function:', typeof editProfile);
    console.log('changePassword function:', typeof changePassword);
    console.log('cancelEditProfile function:', typeof cancelEditProfile);
    console.log('cancelChangePassword function:', typeof cancelChangePassword);
    
    // Test navigation function
    console.log('navigateToPage function:', typeof navigateToPage);
}

// Force fix all buttons
function forceFixButtons() {
    console.log('Force fixing all buttons...');
    
    // Force fix navigation
    document.querySelectorAll('[data-page]').forEach(element => {
        element.onclick = function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            if (page) {
                console.log('Force navigating to:', page);
                navigateToPage(page);
            }
        };
    });
    
    // Force fix profile buttons
    const editBtn = document.querySelector('button[onclick="editProfile()"]');
    if (editBtn) {
        editBtn.onclick = editProfile;
    }
    
    const changeBtn = document.querySelector('button[onclick="changePassword()"]');
    if (changeBtn) {
        changeBtn.onclick = changePassword;
    }
    
    const cancelEditBtn = document.querySelector('button[onclick="cancelEditProfile()"]');
    if (cancelEditBtn) {
        cancelEditBtn.onclick = cancelEditProfile;
    }
    
    const cancelPasswordBtn = document.querySelector('button[onclick="cancelChangePassword()"]');
    if (cancelPasswordBtn) {
        cancelPasswordBtn.onclick = cancelChangePassword;
    }
    
    console.log('All buttons force fixed');
    showNotification('Đã sửa tất cả buttons', 'success');
}

// Test profile navigation
function testProfileNavigation() {
    console.log('=== Testing Profile Navigation ===');
    
    // Test profile link in dropdown
    const profileLink = document.getElementById('profile-link');
    console.log('Profile link found:', !!profileLink);
    if (profileLink) {
        console.log('Profile link display:', profileLink.style.display);
        console.log('Profile link data-page:', profileLink.dataset.page);
    }
    
    // Test profile link in user info
    const userProfileLink = document.querySelector('a[data-page="profile"]');
    console.log('User profile link found:', !!userProfileLink);
    if (userProfileLink) {
        console.log('User profile link data-page:', userProfileLink.dataset.page);
    }
    
    // Test profile page
    const profilePage = document.getElementById('profile-page');
    console.log('Profile page found:', !!profilePage);
    
    // Test navigation function
    console.log('navigateToPage function:', typeof navigateToPage);
    
    // Test profile functions
    console.log('loadProfilePage function:', typeof loadProfilePage);
    console.log('editProfile function:', typeof editProfile);
    console.log('changePassword function:', typeof changePassword);
}

// Force fix profile navigation
function forceFixProfileNavigation() {
    console.log('Force fixing profile navigation...');
    
    // Fix profile link in dropdown
    const profileLink = document.getElementById('profile-link');
    if (profileLink) {
        profileLink.onclick = function(e) {
            e.preventDefault();
            console.log('Profile link clicked - navigating to profile');
            navigateToPage('profile');
        };
        console.log('Fixed profile link in dropdown');
    }
    
    // Fix profile link in user info
    const userProfileLink = document.querySelector('a[data-page="profile"]');
    if (userProfileLink) {
        userProfileLink.onclick = function(e) {
            e.preventDefault();
            console.log('User profile link clicked - navigating to profile');
            navigateToPage('profile');
        };
        console.log('Fixed user profile link');
    }
    
    // Test navigation
    console.log('Testing profile navigation...');
    try {
        navigateToPage('profile');
        console.log('Profile navigation test successful');
        showNotification('Đã sửa profile navigation', 'success');
    } catch (error) {
        console.error('Profile navigation test failed:', error);
        showNotification('Lỗi profile navigation: ' + error.message, 'error');
    }
}

// Debug function to check app state
function debugAppState() {
    console.log('Current page:', currentPage);
    console.log('Products count:', products.length);
    console.log('Cart count:', cart.length);
    console.log('Current user:', currentUser);
    console.log('Available pages:', Object.keys(pages));
}

// Test navigation function
function testNavigation(pageName) {
    console.log('Testing navigation to:', pageName);
    console.log('Current page:', currentPage);
    console.log('Pages object:', pages);
    console.log('Target page exists:', !!pages[pageName]);
    
    if (pages[pageName]) {
        navigateToPage(pageName);
    } else {
        console.error('Page not found:', pageName);
        showNotification(`Trang ${pageName} không tồn tại`, 'error');
    }
}

// Force show page without animation
function forceShowPage(pageName) {
    console.log('Force showing page:', pageName);
    
    if (!pages[pageName]) {
        console.error('Page not found:', pageName);
        return;
    }
    
    // Hide all pages
    Object.values(pages).forEach(page => {
        if (page) {
            page.classList.remove('active', 'page-enter', 'page-exit');
            page.style.display = 'none';
        }
    });
    
    // Show target page
    pages[pageName].style.display = 'block';
    pages[pageName].classList.add('active');
    currentPage = pageName;
    
    // Update navigation
    updateNavigationActiveState(pageName);
    
    // Load content
    loadPageContent(pageName);
}

// Debug page visibility
function debugPageVisibility() {
    console.log('=== Page Visibility Debug ===');
    console.log('Current page:', currentPage);
    
    Object.keys(pages).forEach(pageName => {
        const page = pages[pageName];
        if (page) {
            const computedStyle = window.getComputedStyle(page);
            console.log(`${pageName}:`, {
                display: computedStyle.display,
                opacity: computedStyle.opacity,
                visibility: computedStyle.visibility,
                classes: page.className,
                isActive: page.classList.contains('active')
            });
        } else {
            console.log(`${pageName}: NOT FOUND`);
        }
    });
}

// Debug product cards visibility
function debugProductCards() {
    console.log('=== Product Cards Debug ===');
    
    const featuredContainer = document.getElementById('featured-products');
    const productsContainer = document.getElementById('products-grid');
    
    if (featuredContainer) {
        const featuredCards = featuredContainer.querySelectorAll('.product-card');
        console.log('Featured products container:', {
            exists: !!featuredContainer,
            cardCount: featuredCards.length,
            innerHTML: featuredContainer.innerHTML.substring(0, 200) + '...'
        });
        
        featuredCards.forEach((card, index) => {
            const computedStyle = window.getComputedStyle(card);
            console.log(`Featured card ${index}:`, {
                display: computedStyle.display,
                opacity: computedStyle.opacity,
                visibility: computedStyle.visibility,
                zIndex: computedStyle.zIndex,
                classes: card.className
            });
        });
    }
    
    if (productsContainer) {
        const productCards = productsContainer.querySelectorAll('.product-card');
        console.log('Products container:', {
            exists: !!productsContainer,
            cardCount: productCards.length,
            innerHTML: productsContainer.innerHTML.substring(0, 200) + '...'
        });
        
        productCards.forEach((card, index) => {
            const computedStyle = window.getComputedStyle(card);
            console.log(`Product card ${index}:`, {
                display: computedStyle.display,
                opacity: computedStyle.opacity,
                visibility: computedStyle.visibility,
                zIndex: computedStyle.zIndex,
                classes: card.className
            });
        });
    }
}
