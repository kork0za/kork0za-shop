# Korkoza Shop

![Korkoza Shop](https://i.imgur.com/z78hs7o.png)

Welcome to the official merchandise store of your favorite blogger and streamer – Korkóza! Here you will find unique and stylish items that will make you a part of our incredible community.

## Links
- **Website:** [Korkoza Shop](https://kork0za-shop.netlify.app/)
- **Social Media:** [YouTube](https://www.youtube.com/@kork0za), [Twitch](https://twitch.tv/kork0za), [Twitter](https://x.com/kork0za)

## Description
This repository contains the HTML, CSS, and JavaScript code for the Korkoza Shop website. It features two main tabs: **Shop** and **Delivery Information**.

### Shop
Browse through a collection of merchandise including stickers and more.

### Delivery Information
Learn about our delivery options, including shipping via Nova Poshta within Ukraine and internationally. Payment can be made via bank transfer (PrivatBank or monobank).

## Technologies Used
- HTML
- CSS
- JavaScript
- jQuery

## How to Use
Simply clone this repository and open `index.html` in your web browser to explore the Korkoza Shop.

© 2024 Korkóza | Created with ❤️ by [MEGATREX4](https://megatrex4.netlify.app/)

----

<br><br><br><br><br>

## Shopping Cart JavaScript Example

This project demonstrates a simple shopping cart implementation using JavaScript and jQuery. It includes functionality for adding items to the cart, updating quantities, displaying the cart contents, and handling checkout via a webhook to Discord.

### Features

- **Add to Cart:** Users can add items to the shopping cart from a list of products.
- **Cart Management:** The shopping cart maintains item quantities and updates dynamically.
- **Visual Feedback:** An animation effect shows items being added to the cart.
- **Checkout:** Supports checkout functionality where users can submit their order details.
- **Webhook Integration:** Utilizes a Discord webhook to notify of new orders.

### How It Works

1. **Initialization:**
   - The script initializes by loading items from a `items.json` file and populating the webpage with product details and an "Add to Cart" button for each item.

2. **Adding Items to Cart:**
   - Clicking "Add to Cart" updates the cart display, showing the added item's image, title, price, and quantity. An animation effect moves the item image towards the cart icon for visual feedback.

3. **Cart Management:**
   - The cart maintains items in `localStorage` to persist across page reloads. Quantity adjustments (increase/decrease) update the cart immediately.

4. **Checkout:**
   - Clicking "Checkout" opens a modal with a form for entering user details (name, phone, post office, communication method, and promo code). Upon submission, the order details are sent via a Discord webhook.

5. **Webhook Integration:**
   - The webhook sends a notification to a Discord channel with the order details formatted in an embed.

### Technologies Used

- **JavaScript:** Core scripting language for functionality.
- **jQuery:** Simplifies DOM manipulation and event handling.
- **HTML/CSS:** Structure and styling of the webpage.
- **JSON:** Data format for storing product details and managing cart items.
- **Discord Webhooks:** Integration for order notifications.

### Usage

To use this project:

1. Clone the repository.
2. Serve the files using a local server or open `index.html` in a web browser.
3. Interact with the shopping cart by adding items and proceeding to checkout.

### License

This project is licensed - see the [LICENSE](./LICENSE) file for details.
