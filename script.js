// --- Product Data ---
const products = [
    {
        id: 1,
        name: "Titan Edge Classic",
        price: 12500,
        category: "Classic",
        image: "images/titan.png",
        description: "The slimmest watch in the universe. Features a silver dial with a premium brown leather strap for timeless elegance."
    },
    {
        id: 2,
        name: "Casio G-Shock Mudmaster",
        price: 18500,
        category: "Diver",
        image: "images/casio.png",
        description: "Built to withstand the toughest environments. Mud-resistant structure with carbon core guard technology."
    },
    {
        id: 3,
        name: "Rolex Submariner 'Hulk'",
        price: 1550000,
        category: "Diver",
        image: "images/rolex.png",
        description: "The quintessential divers' watch. Features a stunning green cerachrom bezel and matching sunburst dial."
    },
    {
        id: 4,
        name: "Seiko Presage Cocktail Time",
        price: 45000,
        category: "Vintage",
        image: "images/seiko.png",
        description: "Inspired by classic cocktail bars. Boasts a mesmerizing sunburst dial, gold case, and automatic movement."
    },
    {
        id: 5,
        name: "Apple Watch Series 9",
        price: 41900,
        category: "Smart",
        image: "images/apple.png",
        description: "The ultimate device for a healthy life. Advanced health tracking, double tap gesture, and a sleek black band."
    },
    {
        id: 6,
        name: "Fossil Grant Chronograph",
        price: 11995,
        category: "Classic",
        image: "images/fossil.png",
        description: "Classic styling meets modern functionality. Features Roman numerals, a blue dial, and a stainless steel mesh band."
    }
];

// --- Formatter ---
const formatINR = (amount) => {
    return '₹' + amount.toLocaleString('en-IN');
};

// --- State Management ---
let cart = [];
let currentUser = null; 
let currentProduct = null;
let currentModalQty = 1;
let currentCategory = "All";

// --- DOM Elements ---
// Views
const views = ['home-view', 'login-view', 'profile-view', 'checkout-view', 'confirmation-view'];

// Grid & Containers
const productGrid = document.getElementById('product-grid');
const cartItemsContainer = document.getElementById('cart-items-container');
const emptyCartMessage = document.getElementById('empty-cart-message');
const checkoutItemsContainer = document.getElementById('checkout-items');
const categoryTabs = document.querySelectorAll('.tab-btn');

// Nav
const navLogo = document.getElementById('nav-logo');
const userIconBtn = document.getElementById('user-icon-btn');
const cartIconBtn = document.getElementById('cart-icon-btn');
const cartBadge = document.getElementById('cart-badge');

// Cart Drawer
const cartDrawer = document.getElementById('cart-drawer');
const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartSubtotalPrice = document.getElementById('cart-subtotal-price');
const proceedCheckoutBtn = document.getElementById('proceed-checkout-btn');

// Modal
const productModal = document.getElementById('product-modal');
const productModalOverlay = document.getElementById('product-modal-overlay');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalCategory = document.getElementById('modal-category');
const modalDescription = document.getElementById('modal-description');
const modalQty = document.getElementById('modal-qty');
const modalQtyMinus = document.getElementById('modal-qty-minus');
const modalQtyPlus = document.getElementById('modal-qty-plus');
const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');

// Login Form
const loginForm = document.getElementById('login-form');

// Profile
const logoutBtn = document.getElementById('logout-btn');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const btnSettingPersonal = document.getElementById('btn-setting-personal');
const btnSettingPayment = document.getElementById('btn-setting-payment');
const btnSettingShipping = document.getElementById('btn-setting-shipping');

// Settings Modal
const settingsModal = document.getElementById('settings-modal');
const settingsModalOverlay = document.getElementById('settings-modal-overlay');
const closeSettingsModalBtn = document.getElementById('close-settings-modal-btn');
const settingsModalTitle = document.getElementById('settings-modal-title');
const settingsPersonalContent = document.getElementById('settings-personal-content');
const settingsPaymentContent = document.getElementById('settings-payment-content');
const settingsShippingContent = document.getElementById('settings-shipping-content');
const personalInfoForm = document.getElementById('personal-info-form');
const personalNameInput = document.getElementById('personal-name-input');
const personalEmailInput = document.getElementById('personal-email-input');

// Checkout Form
const backToHomeBtn = document.getElementById('back-to-home-btn');
const checkoutForm = document.getElementById('checkout-form');
const checkoutTotalPrice = document.getElementById('checkout-total-price');

// Confirmation
const continueShoppingBtn = document.getElementById('continue-shopping-btn');
const orderIdDisplay = document.getElementById('order-id-display');

// Toast
const toastContainer = document.getElementById('toast-container');


// --- Initialization ---
function init() {
    renderProducts();
    updateCartUI();
    setupEventListeners();
}

// --- Render Functions ---
function renderProducts() {
    productGrid.innerHTML = '';
    
    let filteredProducts = products;
    if (currentCategory !== "All") {
        filteredProducts = products.filter(p => p.category === currentCategory);
    }

    filteredProducts.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img-wrapper" onclick="openProductModal(${product.id})">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title" onclick="openProductModal(${product.id})">${product.name}</h3>
                <div class="product-price">${formatINR(product.price)}</div>
                <button class="btn btn-outline btn-block" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(card);
        
        // Trigger animation
        setTimeout(() => {
            card.classList.add('loaded');
        }, index * 50);
    });
}

window.filterProducts = function(category) {
    currentCategory = category;
    
    // Update active tab UI
    categoryTabs.forEach(tab => {
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    renderProducts();
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.remove('hidden');
    } else {
        cartBadge.classList.add('hidden');
    }

    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        emptyCartMessage.classList.remove('hidden');
        proceedCheckoutBtn.disabled = true;
        proceedCheckoutBtn.style.opacity = '0.5';
        proceedCheckoutBtn.style.cursor = 'not-allowed';
    } else {
        emptyCartMessage.classList.add('hidden');
        proceedCheckoutBtn.disabled = false;
        proceedCheckoutBtn.style.opacity = '1';
        proceedCheckoutBtn.style.cursor = 'pointer';

        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            subtotal += product.price * item.quantity;

            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${product.name}</div>
                    <div class="cart-item-price">${formatINR(product.price)}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-selector" style="transform: scale(0.85); transform-origin: left center;">
                            <button class="btn-icon" onclick="updateCartQuantity(${item.productId}, -1)"><span class="material-symbols-outlined">remove</span></button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="btn-icon" onclick="updateCartQuantity(${item.productId}, 1)"><span class="material-symbols-outlined">add</span></button>
                        </div>
                        <button class="btn-danger btn-icon" onclick="removeFromCart(${item.productId})" title="Remove item">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });
    }

    cartSubtotalPrice.textContent = formatINR(subtotal);
    checkoutTotalPrice.textContent = formatINR(subtotal);
}

// --- Cart Logic ---
window.addToCart = function(productId, quantity = 1) {
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }
    
    updateCartUI();
    const product = products.find(p => p.id === productId);
    showToast(`Added ${quantity}x ${product.name} to cart.`);
}

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.productId !== productId);
    updateCartUI();
}

window.updateCartQuantity = function(productId, change) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// --- Modal Logic ---
window.openProductModal = function(productId) {
    currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;

    modalImg.src = currentProduct.image;
    modalTitle.textContent = currentProduct.name;
    modalCategory.textContent = currentProduct.category;
    modalPrice.textContent = formatINR(currentProduct.price);
    modalDescription.textContent = currentProduct.description;
    
    currentModalQty = 1;
    modalQty.textContent = currentModalQty;

    productModal.classList.remove('hidden');
    productModalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    productModal.classList.add('hidden');
    productModalOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}

// --- Settings Modal Logic ---
function openSettingsModal(type) {
    settingsPersonalContent.classList.add('hidden');
    settingsPaymentContent.classList.add('hidden');
    settingsShippingContent.classList.add('hidden');

    if (type === 'personal') {
        settingsModalTitle.textContent = 'Personal Information';
        settingsPersonalContent.classList.remove('hidden');
        if (currentUser) {
            personalNameInput.value = currentUser.name.charAt(0).toUpperCase() + currentUser.name.slice(1);
            personalEmailInput.value = currentUser.email;
        }
    } else if (type === 'payment') {
        settingsModalTitle.textContent = 'Payment Methods';
        settingsPaymentContent.classList.remove('hidden');
    } else if (type === 'shipping') {
        settingsModalTitle.textContent = 'Shipping Addresses';
        settingsShippingContent.classList.remove('hidden');
    }

    settingsModal.classList.remove('hidden');
    settingsModalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeSettingsModal() {
    settingsModal.classList.add('hidden');
    settingsModalOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}

// --- View Switching ---
window.switchView = function(viewId) {
    views.forEach(id => {
        const view = document.getElementById(id);
        if (id === viewId) {
            view.classList.remove('hidden');
            setTimeout(() => view.classList.add('active'), 10); 
        } else {
            view.classList.remove('active');
            view.classList.add('hidden');
        }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCheckout() {
    checkoutItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const el = document.createElement('div');
        el.className = 'checkout-item';
        el.innerHTML = `
            <span class="checkout-item-name">${item.quantity}x ${product.name}</span>
            <span class="checkout-item-price">${formatINR(product.price * item.quantity)}</span>
        `;
        checkoutItemsContainer.appendChild(el);
    });
}

// --- Toast Notification ---
window.showToast = function(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span class="material-symbols-outlined icon-glow">info</span>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    navLogo.addEventListener('click', () => switchView('home-view'));

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            filterProducts(e.target.dataset.category);
        });
    });

    userIconBtn.addEventListener('click', () => {
        if (currentUser) {
            switchView('profile-view');
        } else {
            switchView('login-view');
        }
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        currentUser = {
            name: email.split('@')[0],
            email: email
        };
        profileName.textContent = currentUser.name.charAt(0).toUpperCase() + currentUser.name.slice(1);
        profileEmail.textContent = currentUser.email;
        
        loginForm.reset();
        showToast(`Welcome back, ${currentUser.name}!`);
        switchView('profile-view');
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        showToast('Successfully logged out.');
        switchView('home-view');
    });

    cartIconBtn.addEventListener('click', () => {
        cartDrawer.classList.remove('hidden');
        cartDrawerOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });

    closeCartBtn.addEventListener('click', () => {
        cartDrawer.classList.add('hidden');
        cartDrawerOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    });

    cartDrawerOverlay.addEventListener('click', () => closeCartBtn.click());

    closeModalBtn.addEventListener('click', closeProductModal);
    productModalOverlay.addEventListener('click', closeProductModal);
    
    modalQtyMinus.addEventListener('click', () => {
        if (currentModalQty > 1) {
            currentModalQty--;
            modalQty.textContent = currentModalQty;
        }
    });

    modalQtyPlus.addEventListener('click', () => {
        currentModalQty++;
        modalQty.textContent = currentModalQty;
    });

    modalAddToCartBtn.addEventListener('click', () => {
        if (currentProduct) {
            addToCart(currentProduct.id, currentModalQty);
            closeProductModal();
        }
    });

    // Settings Listeners
    btnSettingPersonal.addEventListener('click', () => openSettingsModal('personal'));
    btnSettingPayment.addEventListener('click', () => openSettingsModal('payment'));
    btnSettingShipping.addEventListener('click', () => openSettingsModal('shipping'));

    closeSettingsModalBtn.addEventListener('click', closeSettingsModal);
    settingsModalOverlay.addEventListener('click', closeSettingsModal);

    personalInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = personalNameInput.value;
        const newEmail = personalEmailInput.value;
        
        if (currentUser) {
            currentUser.name = newName;
            currentUser.email = newEmail;
            profileName.textContent = newName;
            profileEmail.textContent = newEmail;
        }
        
        showToast('Personal information updated successfully!');
        closeSettingsModal();
    });

    proceedCheckoutBtn.addEventListener('click', () => {
        closeCartBtn.click();
        renderCheckout();
        switchView('checkout-view');
    });

    backToHomeBtn.addEventListener('click', () => switchView('home-view'));

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = checkoutForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Processing...';
        btn.disabled = true;

        setTimeout(() => {
            cart = [];
            updateCartUI();
            
            const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            orderIdDisplay.textContent = orderId;
            
            btn.textContent = originalText;
            btn.disabled = false;
            checkoutForm.reset();
            
            switchView('confirmation-view');
        }, 2000);
    });

    continueShoppingBtn.addEventListener('click', () => switchView('home-view'));
}

// Run app
document.addEventListener('DOMContentLoaded', init);
