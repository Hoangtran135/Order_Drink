// Global state
let currentUser = null;
let products = [];
let cart = [];
let orders = [];
let currentPage = 'home';

// DOM elements
const pages = {
    home: document.getElementById('home-page'),
    products: document.getElementById('products-page'),
    productDetail: document.getElementById('product-detail-page'),
    cart: document.getElementById('cart-page'),
    checkout: document.getElementById('checkout-page'),
    orders: document.getElementById('orders-page'),
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
        await checkAuthStatus();
        await loadProducts();
        await loadCart();
        await loadOrders();
    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Lỗi khởi tạo ứng dụng', 'error');
    } finally {
        hideLoading();
    }
}

// Setup event listeners
function setupEventListeners() {
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

    // Auth buttons
    document.getElementById('login-btn').addEventListener('click', () => showModal('login'));
    document.getElementById('register-btn').addEventListener('click', () => showModal('register'));
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
    document.getElementById('checkout-form').addEventListener('submit', handleCheckout);

    // Back to products
    document.getElementById('back-to-products').addEventListener('click', () => {
        navigateToPage('products');
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
}

// Navigation
function navigateToPage(pageName) {
    // Hide all pages
    Object.values(pages).forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    if (pages[pageName]) {
        pages[pageName].classList.add('active');
        currentPage = pageName;
        
        // Load page-specific content
        switch (pageName) {
            case 'home':
                loadFeaturedProducts();
                break;
            case 'products':
                loadProductsPage();
                break;
            case 'cart':
                loadCartPage();
                break;
            case 'orders':
                loadOrdersPage();
                break;
        }
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

function updateAuthUI(isAuthenticated) {
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const ordersLink = document.getElementById('orders-link');
    
    if (isAuthenticated) {
        authButtons.style.display = 'none';
        userInfo.style.display = 'flex';
        ordersLink.style.display = 'block';
        document.getElementById('user-name').textContent = currentUser.fullName;
    } else {
        authButtons.style.display = 'flex';
        userInfo.style.display = 'none';
        ordersLink.style.display = 'none';
    }
}

async function handleLogin(e) {
    e.preventDefault();
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

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
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

function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    const featuredProducts = products.slice(0, 6);
    container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

function loadProductsPage() {
    const container = document.getElementById('products-grid');
    if (!container) return;
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    return `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <div class="product-image">
                <i class="fas fa-coffee"></i>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatPrice(product.price)} VNĐ</div>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${product.id})" ${!product.available ? 'disabled' : ''}>
                        ${product.available ? 'Thêm vào giỏ' : 'Hết hàng'}
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

// Override checkout button click
document.addEventListener('click', (e) => {
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
});
