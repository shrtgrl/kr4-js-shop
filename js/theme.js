// ===== Тёмная тема =====
const THEME_STORAGE_KEY = 'heartbeat-theme';

function getInitialTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;

  const toggle = document.querySelector('.theme-toggle');

  if (toggle) {
    const isDark = theme === 'dark';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.querySelector('span').textContent = isDark ? '☀' : '☾';
  }
}

// 1. Сразу, ещё до отрисовки страницы
applyTheme(getInitialTheme());

// 2. Когда HTML загружен — подключаем кнопку
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.theme-toggle');

  applyTheme(document.documentElement.dataset.theme);

  if (!toggle) {
    return;
  }

  toggle.addEventListener('click', () => {
    const newTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  });
});