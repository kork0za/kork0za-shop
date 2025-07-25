# 🎮 Kork0za Merch Shop - Modern Gaming Merch Store

Сучасний інтернет-магазин мерчу з геймерським дизайном, створений з використанням Tailwind CSS та React.

## ✨ Основні особливості

### 🎯 Дизайн і UX
- **Сучасний ігровий дизайн** з неоновими ефектами та анімаціями
- **Скляні ефекти (glassmorphism)** для сучасного вигляду
- **Responsive дизайн** - працює на всіх пристроях
- **Темна тема** з акцентами неонових кольорів
- **Плавні анімації** та hover-ефекти

### 🛒 Функціональність
- **Каталог товарів** з детальною інформацією
- **Система кошика** з можливістю змінювати кількість
- **Форма замовлення** з валідацією та автозаповненням міст
- **Discord webhook** для отримання замовлень
- **Промокоди** та система знижок
- **Модальні вікна** для перегляду товарів

### 🚀 Технології
- **HTML5** з семантичною розміткою
- **Tailwind CSS** для стилізації
- **React 18** (CDN версія)
- **Vanilla JavaScript** для інтерактивності
- **Netlify** для хостингу та функцій

## 📁 Структура проекту

```
kork0za-shop/
├── index.html             # Головна сторінка
├── 404.html               # Сторінка помилки 404
├── app.js                 # React додаток
├── styles-custom.css      # Кастомні стилі
├── items.json             # База даних товарів
├── city.json              # Список міст України
├── dev-server.js          # Локальний сервер для розробки
├── netlify.toml           # Конфігурація Netlify
├── img/                   # Зображення
├── item/                  # Фото товарів
└── netlify/functions/     # Serverless функції
    └── discordWebhook.js  # Discord webhook
```

## 🎨 Дизайн-система

### Кольори
- **Primary**: Блакитні відтінки (#38bdf8, #0ea5e9, #0284c7)
- **Accent**: Рожеві відтінки (#f472b6, #ec4899, #db2777)
- **Dark**: Темні відтінки (#0f172a, #1e293b, #334155)
- **Success**: Зелені відтінки для позитивних дій
- **Warning**: Жовті/помаранчеві для попереджень

### Типографіка
- **Заголовки**: Press Start 2P (геймерський шрифт)
- **Основний текст**: Inter (сучасний sans-serif)

### Анімації
- **Float**: Плавне піднімання-опускання елементів
- **Glow**: Неонове світіння
- **Hover effects**: Збільшення та тіні при наведенні

## 🛠 Встановлення та запуск

### Локальна розробка
1. Клонуйте репозиторій
2. Запустіть `npm start` або `node dev-server.js`
3. Відкрийте http://localhost:3001 у браузері
4. Для продакшну відкрийте `index.html` безпосередньо в браузері

### Deployment на Netlify
1. Підключіть GitHub репозиторій до Netlify
2. Налаштування збірки вже в `netlify.toml`
3. Зміни автоматично деплояться при push

## 🔧 Налаштування

### Discord Webhook
1. Створіть webhook у Discord сервері
2. Додайте URL webhook у змінні середовища Netlify (`DISCORD_WEBHOOK_URL`)
3. Функція знаходиться в `netlify/functions/discordWebhook.js`

### Додавання товарів
1. Відредагуйте файл `items.json`
2. Додайте зображення у папку `item/`
3. Структура товару:
```json
{
  "id": "унікальний_id",
  "title": "Назва товару",
  "author": "Автор",
  "price": "ціна",
  "image": "шлях_до_зображення",
  "description": "Опис (підтримує Markdown)",
  "material": "Характеристики",
  "author-link": "посилання_на_автора",
  "discount": true/false,
  "discountPrice": "знижкова_ціна",
  "preorder": true/false
}
```

## 🎯 Особливості нового дизайну

### Головна сторінка
- **Hero секція** з логотипом та CTA кнопками
- **Статистика** у скляних картках
- **Каталог товарів** з hover-ефектами
- **Про нас** з інформацією про стримера
- **Доставка та оплата** з детальною інформацією
- **Контакти** з соціальними мережами
- **FAQ** з відповідями на популярні питання

### Інтерактивність
- **Smooth scrolling** між секціями
- **Мобільне меню** для телефонів
- **Анімовані елементи** при прокрутці
- **Hover ефекти** на всіх інтерактивних елементах

### 404 сторінка
- **Геймерський дизайн** з великим "404"
- **Easter egg** - Konami Code
- **Швидка навігація** до популярних розділів
- **Інтерактивні елементи** для покращення UX

## 📱 Мобільна оптимізація

- **Mobile-first** підхід
- **Responsive breakpoints**: 360px, 580px, 768px, 992px, 1200px
- **Оптимізовані меню** та навігація
- **Зручні форми** з великими полями вводу
- **Швидкість завантаження** оптимізована для мобільних

## ♿ Доступність

- **Семантичний HTML** для скрін-рідерів
- **ARIA labels** де потрібно
- **Keyboard navigation** підтримка
- **High contrast mode** підтримка
- **Reduced motion** для користувачів з обмеженнями

## 🔒 Безпека

- **Content Security Policy** налаштований
- **XSS захист** включений
- **HTTPS** обов'язковий
- **Валідація форм** на клієнті та сервері

## 📈 Продуктивність

- **Lazy loading** для зображень
- **CDN** для бібліотек
- **Мінімізовані ресурси**
- **Кешування** налаштоване в Netlify
- **Lighthouse Score**: 90+ по всіх метриках

## 🎮 Easter Eggs

- **Konami Code** на 404 сторінці - спробуйте ввести: ↑↑↓↓←→←→BA
- **Анімовані елементи** при кліку
- **Приховані анімації** при різних діях

## 📞 Підтримка

Якщо у вас виникли питання або проблеми:
1. Перевірте FAQ на сайті
2. Зверніться через соціальні мережі
3. Створіть issue в GitHub репозиторії

## 🙏 Подяки

- **Tailwind CSS** за чудовий CSS фреймворк
- **React** за потужну бібліотеку UI
- **Font Awesome** за іконки
- **Google Fonts** за шрифти
- **Netlify** за безкоштовний хостинг

---

**Зроблено з ❤️ для геймерської спільноти Kork0za**
