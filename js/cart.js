// ===== Общие функции цены (нужны каталогу и корзине) =====
function formatPrice(price) {
  return `${price.toLocaleString('ru-RU')} руб.`;
}

function calculateDiscount(price, discountPercent) {
  return price * discountPercent / 100;
}

function calculateFinalPrice(price, discountPercent) {
  const discountValue = calculateDiscount(price, discountPercent);
  return price - discountValue;
}

// ===== Корзина: хранение в localStorage =====
const CART_STORAGE_KEY = 'heartbeat-cart';

function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    return Array.isArray(savedCart) ? savedCart : [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

let cart = loadCart();

// ===== Изменение корзины =====
function addToCart(productId) {
  const cartItem = cart.find((item) => item.id === productId);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart(cart);
  updateCartCounter();
}

function changeQuantity(productId, delta) {
  const cartItem = cart.find((item) => item.id === productId);

  if (!cartItem) {
    return;
  }

  cartItem.quantity += delta;

  if (cartItem.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart(cart);
  updateCartCounter();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartCounter();
}

function clearCart() {
  cart = [];
  saveCart(cart);
  updateCartCounter();
}

// ===== Расчёты =====
function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Соединяем записи корзины { id, quantity } с товарами из data.js
function getCartItems() {
  return cart
    .map((item) => ({
      product: products.find((product) => product.id === item.id),
      quantity: item.quantity
    }))
    .filter((item) => item.product);
}

function getCartTotal() {
  return getCartItems().reduce((sum, item) => {
    const price = calculateFinalPrice(item.product.price, item.product.discountPercent);
    return sum + price * item.quantity;
  }, 0);
}

// ===== Промокод =====
const PROMO_STORAGE_KEY = 'heartbeat-promo';
const PROMO_CODES = {
  HEARTBEAT10: 10,
  VINYL15: 15
};

let appliedPromo = localStorage.getItem(PROMO_STORAGE_KEY) || '';

if (!Object.hasOwn(PROMO_CODES, appliedPromo)) {
  appliedPromo = '';
}

function applyPromo(code) {
  const normalizedCode = code.trim().toUpperCase();

  if (!Object.hasOwn(PROMO_CODES, normalizedCode)) {
    return false;
  }

  appliedPromo = normalizedCode;
  localStorage.setItem(PROMO_STORAGE_KEY, appliedPromo);
  return true;
}

function getPromoDiscount(subtotal) {
  const percent = PROMO_CODES[appliedPromo] || 0;
  return Math.round(subtotal * percent / 100);
}

function clearPromo() {
  appliedPromo = '';
  localStorage.removeItem(PROMO_STORAGE_KEY);
}

// ===== Счётчик в шапке =====
function updateCartCounter() {
  const counter = document.querySelector('.cart-counter');

  if (!counter) {
    return;
  }

  const count = getCartCount();
  counter.textContent = String(count);
  counter.hidden = count === 0;
}

updateCartCounter();

// ===== Страница корзины =====
const cartList = document.querySelector('[data-cart-list]');

if (cartList) {
  const cartBlock = document.querySelector('[data-cart]');
  const cartEmpty = document.querySelector('.cart-empty');
  const cartCountElement = document.querySelector('[data-cart-count]');
  const cartTotalElement = document.querySelector('[data-cart-total]');
  const clearButton = document.querySelector('[data-cart-clear]');
  const subtotalElement = document.querySelector('[data-cart-subtotal]');
  const promoRow = document.querySelector('[data-cart-promo-row]');
  const promoCodeElement = document.querySelector('[data-cart-promo-code]');
  const discountElement = document.querySelector('[data-cart-discount]');
  const promoForm = document.querySelector('[data-promo-form]');
  const promoInput = document.querySelector('#promo-input');
  const promoMessage = document.querySelector('.promo-form__message');

  function createCartItem(item) {
    const { product, quantity } = item;
    const unitPrice = calculateFinalPrice(product.price, product.discountPercent);

    const li = document.createElement('li');
    li.classList.add('cart-item');

    const image = document.createElement('img');
    image.classList.add('cart-item__image');
    image.src = product.image;
    image.alt = '';
    image.width = 72;
    image.height = 72;

    const title = document.createElement('h2');
    title.classList.add('cart-item__title');
    title.textContent = product.title;

    const controls = document.createElement('div');
    controls.classList.add('cart-item__controls');

    const minus = document.createElement('button');
    minus.classList.add('cart-item__qty-button');
    minus.type = 'button';
    minus.textContent = '−';
    minus.dataset.action = 'decrease';
    minus.dataset.productId = String(product.id);
    minus.setAttribute('aria-label', `Уменьшить количество: ${product.title}`);

    const quantityElement = document.createElement('span');
    quantityElement.classList.add('cart-item__quantity');
    quantityElement.textContent = String(quantity);

    const plus = document.createElement('button');
    plus.classList.add('cart-item__qty-button');
    plus.type = 'button';
    plus.textContent = '+';
    plus.dataset.action = 'increase';
    plus.dataset.productId = String(product.id);
    plus.setAttribute('aria-label', `Увеличить количество: ${product.title}`);

    const sum = document.createElement('span');
    sum.classList.add('cart-item__sum');
    sum.textContent = formatPrice(unitPrice * quantity);

    const remove = document.createElement('button');
    remove.classList.add('cart-item__remove');
    remove.type = 'button';
    remove.textContent = 'Удалить';
    remove.dataset.action = 'remove';
    remove.dataset.productId = String(product.id);
    remove.setAttribute('aria-label', `Удалить из корзины: ${product.title}`);

    controls.append(minus, quantityElement, plus, sum, remove);
    li.append(image, title, controls);
    return li;
  }

  function renderCart() {
    const items = getCartItems();

    cartList.textContent = '';
    items.forEach((item) => cartList.append(createCartItem(item)));

    cartEmpty.hidden = items.length > 0;
    cartBlock.hidden = items.length === 0;

    cartCountElement.textContent = String(getCartCount());
    const subtotal = getCartTotal();
    const discount = getPromoDiscount(subtotal);

    subtotalElement.textContent = formatPrice(subtotal);
    promoRow.hidden = discount === 0;
    promoCodeElement.textContent = appliedPromo;
    discountElement.textContent = `−${formatPrice(discount)}`;
    cartTotalElement.textContent = formatPrice(subtotal - discount);
  }

  cartList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');

    if (!button) {
      return;
    }

    const productId = Number(button.dataset.productId);

    if (button.dataset.action === 'increase') {
      changeQuantity(productId, 1);
    }

    if (button.dataset.action === 'decrease') {
      changeQuantity(productId, -1);
    }

    if (button.dataset.action === 'remove') {
      removeFromCart(productId);
    }

    renderCart();
  });

  clearButton.addEventListener('click', () => {
    clearCart();
    renderCart();
  });

  promoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (applyPromo(promoInput.value)) {
        promoMessage.textContent = `Промокод ${appliedPromo} применён: скидка ${PROMO_CODES[appliedPromo]}%.`;
        promoInput.value = '';
    } else {
        promoMessage.textContent = 'Такого промокода нет.';
    }

    renderCart();
  });

  renderCart();
}