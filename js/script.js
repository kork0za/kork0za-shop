$(document).ready(function() {
  let cart = [];
  loadCartFromLocalStorage();

  function updateCart() {
    $('#cart-items').empty();
    let totalPrice = 0;
    cart.forEach(item => {
      $('#cart-items').append(`
                <li class="cart-item">
                    <div style="background-image: url(${item.image});" class="cart-item-img"></div>
                    <div class="cart-item-info">${item.title} - ${item.price} грн 
                    <button class="decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase" data-id="${item.id}">+</button>
                </div></li>`);
      totalPrice += item.price * item.quantity;
    });
    $('#total-price').text(`Загальна сума: ${totalPrice} грн`);
    saveCartToLocalStorage();
  }

  function addItemToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    updateCart();
    saveCartToLocalStorage();
  }

  function animateImageToCart(imageSrc) {
    const cartButton = $('#view-cart');
    const flyingImage = $('<img class="flying-image" src="' + imageSrc + '">');
    $('#animation-container').append(flyingImage);

    const imageOffset = flyingImage.offset();
    const cartOffset = cartButton.offset();

    const deltaX = cartOffset.left - imageOffset.left;
    const deltaY = cartOffset.top - imageOffset.top;

    flyingImage.css({
      transform: `translate(${deltaX}px, ${deltaY}px)`,
      opacity: 0
    });

    flyingImage.on('transitionend', function() {
      $(this).remove();
    });
  }

  function attachEventListeners() {
    $('.addtocart').off('click').on('click', function() {
      const id = $(this).data('id');
      const title = $(this).data('title');
      const price = parseFloat($(this).data('price'));
      const image = $(this).siblings('.item_img').attr('src');
      const item = { id, title, price, image };
      addItemToCart(item);
      animateImageToCart(image);
    });

    $(document).on('click', '.increase', function() {
      const id = $(this).data('id');
      const item = cart.find(cartItem => cartItem.id === id);
      if (item) {
        item.quantity++;
      }
      updateCart();
    });

    $(document).on('click', '.decrease', function() {
      const id = $(this).data('id');
      const item = cart.find(cartItem => cartItem.id === id);
      if (item) {
        item.quantity--;
        if (item.quantity === 0) {
          cart = cart.filter(cartItem => cartItem.id !== id);
        }
      }
      updateCart();
      saveCartToLocalStorage();
    });

    $(document).on('click', '.item_img', function() {
      const id = $(this).data('id');
      const title = $(this).data('title');
      const description = $(this).data('description');
      const material = $(this).data('material');
      const price = $(this).data('price');
      const image = $(this).attr('src');
      
      $('#modal-title').text(title);
      $('#modal-description').text(`Description: ${description}`);
      $('#modal-material').text(`Material: ${material}`);
      $('#modal-price').text(`Price: ${price} грн`);
      $('#modal-image').attr('src', image);
      
      $('#item-modal').show();
    });

    $('.close').click(function() {
      $(this).closest('.modal').hide();
    });
  }

  function loadItemsFromJson() {
    if ($('#animation-container').children().length === 0) { // Check if items are already loaded
      $.getJSON("items.json", function(data) {
        data.forEach(function(item) {
          $('#animation-container').append(`
                    <div class="item" id="${item.id}">
                        <img class="item_img" src="${item.image}" alt="${item.id}" data-id="${item.id}" data-title="${item.title}" data-description="${item.description}" data-material="${item.material}" data-price="${item.price}">
                        <p class="title">${item.title}</p>
                        <p class="author">${item.author}</p>
                        <p class="price">${item.price} грн</p>
                        <button class="addtocart" data-id="${item.id}" data-title="${item.title}" data-price="${item.price}">Додати до кошика</button>
                    </div>
                `);
        });
        attachEventListeners();
      });
    }
  }

  function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCart();
    }
  }

  loadItemsFromJson();

  $('#view-cart').click(function() {
    $('#cart-modal').show();
  });

  $('.close').click(function() {
    $(this).closest('.modal').hide();
  });

  $('#checkout').click(function() {
    if (cart.length === 0) {
      alert('Ваш кошик порожній. Будь ласка, додайте товари, щоб перейти до оформлення замовлення.');
      return;
    }
    $('#checkout-modal').show();
  });

  $('#order-form').submit(async function(event) {
    event.preventDefault();

    const firstName = $('#name').val();
    const lastName = $('#surname').val();
    const phone = $('#phone').val();
    const postOffice = $('#post-office').val();
    const communicationMethod = $('#communication-method').val();
    const promocode = $('#promocode').val();

    let itemsText = '';
    cart.forEach((item, index) => {
      itemsText += `${item.title} x${item.quantity}`;
      if (index < cart.length - 1) {
        itemsText += ', ';
      }
    });

    const webhookBody = {
      content: '@everyone',
      embeds: [{
        title: 'Нове замовлення',
        description: `**Ім'я:** ${firstName} ${lastName}\n**Телефон:** ${phone}\n**Відділення Нової Пошти:** ${postOffice}\n**Контакт:** ${communicationMethod}\n**Замовили:** ${itemsText}\n**Промокод:** ${promocode}`,
        color: 16777215,
        timestamp: new Date().toISOString()
      }]
    };

    const webhookUrl = 'https://discord.com/api/webhooks/1262144981687074939/5oXvsZsPYl5IgPjPm8UTFoctdf-zzN9Thr7Eb42n_kzutZF8cfLLniJ0Qgoto81_3MsH';

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      window.location.href = 'index.html';

      cart = [];
      updateCart();
      $('#checkout-modal').hide();
    } catch (error) {
      console.error('Error sending order:', error);
      alert('Failed to submit order. Please try again later.');
    }
  });
});