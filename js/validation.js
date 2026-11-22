const orderForm = document.querySelector('.order-form');

if (orderForm) {
  const nameInput = orderForm.querySelector('#order-name');
  const emailInput = orderForm.querySelector('#order-email');
  const phoneInput = orderForm.querySelector('#order-phone');
  const productSelect = orderForm.querySelector('#order-product');
  const nameError = orderForm.querySelector('#order-name-error');
  const emailError = orderForm.querySelector('#order-email-error');
  const phoneError = orderForm.querySelector('#order-phone-error');
  const formMessage = orderForm.querySelector('.form-message');
  const agreeInput = orderForm.querySelector('#order-agree');
  const agreeError = orderForm.querySelector('#order-agree-error');
  const submitButton = orderForm.querySelector('[data-submit-button]');
  const orderSummary = document.querySelector('[data-order-summary]');
  const orderSummaryList = document.querySelector('[data-order-summary-list]');
  const orderSummaryTotal = document.querySelector('[data-order-summary-total]');

  // Доработка: список пластинок строится из data.js
  products.forEach((product) => {
    const option = document.createElement('option');
    option.value = String(product.id);
    option.textContent = product.title;
    option.disabled = !product.isAvailable;
    productSelect.append(option);
  });

  function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorElement.id);
  }

  function clearError(input, errorElement) {
    errorElement.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  function validateName() {
    const value = nameInput.value.trim();

    if (value.length < 2) {
      showError(nameInput, nameError, 'Введите имя не короче 2 символов.');
      return false;
    }

    clearError(nameInput, nameError);
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
      showError(emailInput, emailError, 'Введите корректный e-mail.');
      return false;
    }

    clearError(emailInput, emailError);
    return true;
  }

  function validatePhone() {
    const digits = phoneInput.value.replace(/\D/g, '');

    if (digits.length !== 11 || !['7', '8'].includes(digits[0])) {
      showError(phoneInput, phoneError, 'Введите номер из 11 цифр, начиная с +7 или 8.');
      return false;
    }

    clearError(phoneInput, phoneError);
    return true;
  }

  function validateAgree() {
    if (!agreeInput.checked) {
      showError(agreeInput, agreeError, 'Нужно согласие на обработку персональных данных.');
      return false;
    }

    clearError(agreeInput, agreeError);
    return true;
  }

  function getOrderTotal() {
    const subtotal = getCartTotal();
    return subtotal - getPromoDiscount(subtotal);
  }

  function renderOrderSummary() {
    const items = getCartItems();
    orderSummary.hidden = items.length === 0;
    orderSummaryList.textContent = '';

    items.forEach(({ product, quantity }) => {
      const price = calculateFinalPrice(product.price, product.discountPercent);
      const li = document.createElement('li');
      li.textContent = `${product.title} × ${quantity} — ${formatPrice(price * quantity)}`;
      orderSummaryList.append(li);
    });

    const promoText = appliedPromo ? ` (с промокодом ${appliedPromo})` : '';
    orderSummaryTotal.textContent = `${formatPrice(getOrderTotal())}${promoText}`;
  }

  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isAgreeValid = validateAgree();

    if (!(isNameValid && isEmailValid && isPhoneValid && isAgreeValid)) {
      formMessage.textContent = 'Проверьте поля формы.';
      return;
    }

    const requestData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      items: getCartItems().map(({ product, quantity }) => ({ id: product.id, title: product.title, quantity })),
      promo: appliedPromo,
      total: getOrderTotal()
    };

    console.log('Данные заявки:', requestData);

    submitButton.disabled = true;
    submitButton.textContent = 'Отправляем…';
    formMessage.textContent = '';

    setTimeout(() => {
      const orderNumber = String(Date.now()).slice(-6);
      formMessage.textContent = `Заявка №${orderNumber} принята. Мы свяжемся с вами в течение дня.`;

      orderForm.reset();
      clearCart();
      clearPromo();
      renderOrderSummary();

      submitButton.disabled = false;
      submitButton.textContent = 'Отправить заявку';
    }, 1500);
  });

  nameInput.addEventListener('input', validateName);
  emailInput.addEventListener('input', validateEmail);
  phoneInput.addEventListener('input', validatePhone);
  agreeInput.addEventListener('change', validateAgree);
  renderOrderSummary();
}