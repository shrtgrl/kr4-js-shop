// Бургер-меню: показать/скрыть навигацию на мобильных экранах.
const navToggle = document.querySelector('.nav-toggle');
const navList = document.querySelector('#site-nav-list');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
  });
}

// Сворачиваемый фильтр каталога на мобильных экранах.
const filtersToggle = document.querySelector('.catalog-filters__toggle');
const filtersForm = document.querySelector('#filters-form');

if (filtersToggle && filtersForm) {
  filtersToggle.addEventListener('click', () => {
    const isOpen = filtersForm.classList.toggle('is-open');
    filtersToggle.setAttribute('aria-expanded', isOpen);
    filtersToggle.textContent = isOpen ? 'Скрыть фильтры' : 'Показать фильтры';
  });
}

// Минимальная логика модального окна: открыть по кнопке «Заказать» и закрыть.
const orderDialog = document.querySelector('#order-dialog');

if (orderDialog) {
  const productInput = document.querySelector('#dialog-product');
  const closeButton = document.querySelector('#close-order-dialog');
  const orderButtons = document.querySelectorAll('.product-card__button');

  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      productInput.value = button.dataset.product;
      orderDialog.showModal();
    });
  });

  closeButton.addEventListener('click', () => {
    orderDialog.close();
  });
}

// ===== ПЗ 15: проверка подключения JavaScript =====
console.log('Файл main.js подключён');
console.log(products);
console.table(products);

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

function getProductStatus(product) {
  if (product.isAvailable) {
    return 'В наличии';
  }
  return 'Нет в наличии';
}

function createProductSummary(product) {
  const finalPrice = calculateFinalPrice(product.price, product.discountPercent);
  const status = getProductStatus(product);
  return `${product.title}: ${formatPrice(finalPrice)} Статус: ${status}.`;
}

const messageElement = document.querySelector('.js-message');
const productOutputElement = document.querySelector('.product-output');

function getProductTitles(products) {
  return products.map((product) => product.title);
}

console.log(getProductTitles(products));

function getAvailableProducts(products) {
  return products.filter((product) => product.isAvailable);
}

console.table(getAvailableProducts(products));

function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === '') {
    return products;
  }

  return products.filter((product) => {
    return product.title.toLowerCase().includes(normalizedQuery);
  });
}

console.table(searchProducts(products, '  KANYE ')); 

function filterProductsByCategory(products, category) {
  if (category === 'all') {
    return products;
  }

  return products.filter((product) => product.category === category);
}

console.table(filterProductsByCategory(products, 'rnb')); 

function sortProductsByPrice(products, direction = 'asc') {
  const productsCopy = [...products];

  if (direction === 'desc') {
    return productsCopy.sort((a, b) => b.price - a.price);
  }

  return productsCopy.sort((a, b) => a.price - b.price);
}

console.table(sortProductsByPrice(products, 'asc'));
console.table(sortProductsByPrice(products, 'desc'));

function findProductById(products, id) {
  return products.find((product) => product.id === id);
}

const selectedProduct = findProductById(products, 6);

if (selectedProduct) {
  console.log(`Найден товар: ${selectedProduct.title}`); 
} else {
  console.log('Товар не найден');
}

function calculateTotalPrice(products) {
  return products.reduce((sum, product) => sum + product.price, 0);
}

console.log(calculateTotalPrice(products)); 

function countAvailableProducts(products) {
  return getAvailableProducts(products).length;
}

console.log(countAvailableProducts(products)); 

function calculateAveragePrice(products) {
  if (products.length === 0) {
    return 0;
  }

  return Math.round(calculateTotalPrice(products) / products.length);
}

console.log(calculateAveragePrice(products)); 

function getPreparedProducts(products, query, category, sortDirection) {
  let result = searchProducts(products, query);
  result = filterProductsByCategory(result, category);
  result = sortProductsByPrice(result, sortDirection);
  return result;
}

console.table(getPreparedProducts(products, 'tyler', 'hiphop', 'desc'));

if (messageElement) {
  messageElement.textContent = 'Массив товаров и функции обработки данных подключены.';
}

if (productOutputElement) {
  productOutputElement.textContent = [
    `Всего товаров: ${products.length}`,
    `Товаров в наличии: ${countAvailableProducts(products)}`,
    `Средняя цена: ${formatPrice(calculateAveragePrice(products))}`,
    `Результатов поиска "kanye": ${searchProducts(products, 'kanye').length}`
  ].join('\n');
}

// const unsafeExample = '<img src=x onerror=alert(1)>';
// productOutputElement.innerHTML = unsafeExample;   // выполнит код: выскочит alert
// productOutputElement.textContent = unsafeExample; // покажет строку как текст
