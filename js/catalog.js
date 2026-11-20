// ===== Элементы страницы =====
const productsContainer = document.querySelector('[data-products-container]');
const searchInput = document.querySelector('#catalog-search');
const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#sort-select');
const catalogCount = document.querySelector('.catalog-count');
const catalogEmpty = document.querySelector('.catalog-empty');

if (!productsContainer) {
  console.warn('Контейнер товаров не найден. Проверьте data-products-container.');
}

// ===== Состояние каталога =====
const catalogState = {
  query: '',
  category: 'all',
  sort: 'default'
};

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

function getProductTitles(products) {
  return products.map((product) => product.title);
}

function getAvailableProducts(products) {
  return products.filter((product) => product.isAvailable);
}

function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === '') {
    return products;
  }

  return products.filter((product) => {
    return product.title.toLowerCase().includes(normalizedQuery);
  });
}

function filterProductsByCategory(products, category) {
  if (category === 'all') {
    return products;
  }

  return products.filter((product) => product.category === category);
}

function findProductById(products, id) {
  return products.find((product) => product.id === id);
}

function calculateTotalPrice(products) {
  return products.reduce((sum, product) => sum + product.price, 0);
}

function countAvailableProducts(products) {
  return getAvailableProducts(products).length;
}

function calculateAveragePrice(products) {
  if (products.length === 0) {
    return 0;
  }

  return Math.round(calculateTotalPrice(products) / products.length);
}

function sortProducts(products, sortType) {
  const productsCopy = [...products];

  const getFinal = (product) => calculateFinalPrice(product.price, product.discountPercent);

  if (sortType === 'price-asc') {
    return productsCopy.sort((a, b) => getFinal(a) - getFinal(b));
    }

  if (sortType === 'price-desc') {
    return productsCopy.sort((a, b) => getFinal(b) - getFinal(a));
  }

  if (sortType === 'title-asc') {
    return productsCopy.sort((a, b) => a.title.localeCompare(b.title));
  }

  return productsCopy;
}

function getPreparedProducts(products, state) {
  let result = searchProducts(products, state.query);
  result = filterProductsByCategory(result, state.category);
  result = sortProducts(result, state.sort);
  return result;
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.classList.add('product-card');

  if (product.discountPercent > 0) {
    card.classList.add('product-card--discount');

    const badge = document.createElement('span');
    badge.classList.add('product-card__badge');
    badge.textContent = `−${product.discountPercent}%`;
    card.append(badge);
  }

  const image = document.createElement('img');
  image.classList.add('product-card__image');
  image.src = product.image;
  image.alt = `Обложка пластинки ${product.title}`;
  image.width = 600;
  image.height = 600;
  image.loading = 'lazy';

  const title = document.createElement('h3');
  title.classList.add('product-card__title');
  title.textContent = product.title;

  const description = document.createElement('p');
  description.classList.add('product-card__description');
  description.textContent = `${product.year} · ${product.description}`;

  const price = document.createElement('p');
  price.classList.add('product-card__price');
  price.textContent = formatPrice(calculateFinalPrice(product.price, product.discountPercent));

  const status = document.createElement('p');
  status.classList.add('product-card__status');
  status.textContent = getProductStatus(product);

  const button = document.createElement('button');
  button.classList.add('button', 'button--primary', 'product-card__button');
  button.type = 'button';
  button.textContent = 'В корзину';
  button.dataset.action = 'add-to-cart';
  button.dataset.productId = String(product.id);

  if (!product.isAvailable) {
    button.disabled = true;
    button.textContent = 'Нет в наличии';
  }

  card.append(image, title, description, price, status, button);
  return card;
}

function renderProducts(productsToRender) {
  productsContainer.textContent = '';

  if (catalogCount) {
    catalogCount.textContent = `Найдено пластинок: ${productsToRender.length}`;
  }

  if (catalogEmpty) {
    catalogEmpty.hidden = productsToRender.length > 0;
  }

  productsToRender.forEach((product) => {
    productsContainer.append(createProductCard(product));
  });
}

function updateCatalog() {
  const preparedProducts = getPreparedProducts(products, catalogState);
  renderProducts(preparedProducts);
}

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    catalogState.query = event.target.value;
    updateCatalog();
  });
}

if (categoryFilter) {
  categoryFilter.addEventListener('change', (event) => {
    catalogState.category = event.target.value;
    updateCatalog();
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', (event) => {
    catalogState.sort = event.target.value;
    updateCatalog();
  });
}

if (productsContainer) {
  updateCatalog();
}

if (productsContainer) {
  productsContainer.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="add-to-cart"]');

    if (!button) {
      return;
    }

    const productId = Number(button.dataset.productId);
    const selectedProduct = findProductById(products, productId);

    if (!selectedProduct) {
      console.warn('Товар не найден:', productId);
      return;
    }

    console.log(`Товар добавлен в корзину: ${selectedProduct.title}`);
  });
}