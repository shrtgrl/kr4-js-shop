const products = [
  { id: 1, title: 'Tyler, The Creator — IGOR', category: 'hiphop', year: 2019, price: 5900, discountPercent: 0, rating: 4.9, isAvailable: true, image: 'images/covers/igor.webp', description: 'Концептуальный альбом о разбитом сердце, премия «Грэмми» за лучший рэп-альбом.' },
  { id: 2, title: 'Nirvana — Nevermind', category: 'rock', year: 1991, price: 4500, discountPercent: 10, rating: 4.8, isAvailable: true, image: 'images/covers/nevermind.webp', description: 'Альбом с «Smells Like Teen Spirit», который вывел гранж в мейнстрим.' },
  { id: 3, title: 'Childish Gambino — Camp', category: 'hiphop', year: 2011, price: 4900, discountPercent: 0, rating: 4.5, isAvailable: false, image: 'images/covers/camp.webp', description: 'Дебютный студийный альбом Дональда Гловера с оркестровыми аранжировками.' },
  { id: 4, title: 'Kanye West — Graduation', category: 'hiphop', year: 2007, price: 5200, discountPercent: 15, rating: 4.8, isAvailable: true, image: 'images/covers/graduation.webp', description: 'Стадионный хип-хоп с «Stronger» и «Good Life».' },
  { id: 5, title: 'Montell Fish — Her Love Still Haunts Me Like a Ghost', category: 'rnb', year: 2022, price: 4200, discountPercent: 0, rating: 4.6, isAvailable: true, image: 'images/covers/her-love.webp', description: 'Мини-альбом из семи треков: тихий, призрачный R&B о потере.' },
  { id: 6, title: 'Frank Ocean — Blonde', category: 'rnb', year: 2016, price: 6900, discountPercent: 0, rating: 4.9, isAvailable: true, image: 'images/covers/blonde.webp', description: 'Минималистичный R&B-альбом с «Nikes», «Ivy» и «Self Control».' },
  { id: 7, title: 'Tyler, The Creator — Call Me If You Get Lost: The Estate Sale', category: 'hiphop', year: 2023, price: 6200, discountPercent: 10, rating: 4.8, isAvailable: true, image: 'images/covers/estate-sale.webp', description: 'Расширенное издание альбома 2021 года с новыми треками, голубой винил.' },
  { id: 8, title: 'Kanye West — Bully', category: 'hiphop', year: 2026, price: 6500, discountPercent: 0, rating: 4.3, isAvailable: false, image: 'images/covers/bully.webp', description: 'Двенадцатый студийный альбом Канье, вышедший после нескольких переносов.' },
  { id: 9, title: 'The Beatles — Abbey Road', category: 'rock', year: 1969, price: 4800, discountPercent: 20, rating: 4.9, isAvailable: true, image: 'images/covers/abbey-road.webp', description: 'Последний записанный альбом группы с «Come Together» и «Here Comes the Sun».' },
  { id: 10, title: 'Kendrick Lamar — DAMN.', category: 'hiphop', year: 2017, price: 5600, discountPercent: 0, rating: 4.8, isAvailable: true, image: 'images/covers/damn.webp', description: 'Альбом, получивший Пулитцеровскую премию в области музыки.' },
  { id: 11, title: 'Lana Del Rey — Born to Die', category: 'pop', year: 2012, price: 5400, discountPercent: 0, rating: 4.7, isAvailable: true, image: 'images/covers/born-to-die.webp', description: 'Дебютный альбом с «Video Games» и «Summertime Sadness», красный винил.' }
];

const CATEGORY_LABELS = {
  hiphop: 'Хип-хоп',
  rock: 'Рок',
  rnb: 'R&B',
  pop: 'Поп'
};

// Фото для главного экрана: при каждой загрузке показывается случайное
const HERO_IMAGES = [
  { src: 'images/hero/hero-1.webp', alt: 'Стеллаж с виниловыми пластинками в музыкальном магазине' },
  { src: 'images/hero/hero-2.webp', alt: 'Пластинки и конверты, разложенные на покрывале' },
  { src: 'images/hero/hero-3.webp', alt: 'Покупатель выбирает пластинку в магазине' },
  { src: 'images/hero/hero-4.webp', alt: 'Стена с обложками альбомов' },
  { src: 'images/hero/hero-5.webp', alt: 'Полка с новинками винила в магазине' }
];
