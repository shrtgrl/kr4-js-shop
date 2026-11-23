// ===== Страница товара по id из адреса =====
const productPage = document.querySelector('[data-product-page]');

if (productPage) {
  const notFound = document.querySelector('.product-not-found');
  const breadcrumb = document.querySelector('[data-product-breadcrumb]');

  const params = new URLSearchParams(window.location.search);
  const productId = params.has('id') ? Number(params.get('id')) : products[0].id;
  const product = findProductById(products, productId);

  if (!product) {
    notFound.hidden = false;
    breadcrumb.textContent = 'Не найдено';
    document.title = 'Пластинка не найдена — HeartBeat';
  } else {
    const finalPrice = calculateFinalPrice(product.price, product.discountPercent);

    document.title = `${product.title} — HeartBeat`;
    breadcrumb.textContent = product.title;

    const image = productPage.querySelector('[data-product-image]');
    image.src = product.image;
    image.alt = `Обложка пластинки ${product.title}`;

    productPage.querySelector('[data-product-title]').textContent = product.title;
    productPage.querySelector('[data-product-description]').textContent = product.description;
    productPage.querySelector('[data-product-price]').textContent = formatPrice(finalPrice);
    productPage.querySelector('[data-product-status]').textContent = getProductStatus(product);

    const specs = [
      ['Жанр', CATEGORY_LABELS[product.category]],
      ['Год', String(product.year)],
      ['Цена', formatPrice(product.price)],
      ['Скидка', product.discountPercent > 0 ? `${product.discountPercent}%` : 'нет'],
      ['Цена со скидкой', formatPrice(finalPrice)],
      ['Рейтинг', `${product.rating} из 5`],
      ['Наличие', getProductStatus(product)]
    ];

    const specsBody = productPage.querySelector('[data-product-specs]');

    specs.forEach(([name, value]) => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('th');
      const valueCell = document.createElement('td');

      nameCell.scope = 'row';
      nameCell.textContent = name;
      valueCell.textContent = value;

      row.append(nameCell, valueCell);
      specsBody.append(row);
    });

    const addButton = productPage.querySelector('[data-product-add]');

    if (!product.isAvailable) {
      addButton.disabled = true;
      addButton.textContent = 'Нет в наличии';
    }

    addButton.addEventListener('click', () => {
      addToCart(product.id);
      addButton.textContent = 'Добавлено ✓';
      setTimeout(() => {
        addButton.textContent = 'В корзину';
      }, 1200);
    });

    productPage.hidden = false;
  }
}