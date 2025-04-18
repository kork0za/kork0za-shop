//script.js
$(document).ready(function() {
  let cart = [];
  loadCartFromLocalStorage();

  let cityData = [];

  function loadCityData() {
    $.getJSON("city.json", function(data) {
      cityData = data;
      console.log(cityData); // Check if data is loaded correctly
    });
  }
  

$(document).ready(function() {
  loadCityData();
});

// Initialize autocomplete for the city input field
$('#city').autocomplete({
  source: function(request, response) {
    // Filter cityData to match the user's input
    const matches = cityData.filter(city => 
      city.toLowerCase().includes(request.term.toLowerCase())
    );
    response(matches);
  }
});


  function updateCart() {
    $('#cart-items').empty();
    let totalPrice = 0;
    let promoCode = $('#promocode').val().trim(); // Get the promo code input value

    cart.forEach(item => {
        $('#cart-items').append(`
            <li class="cart-item">
                <div style="background-image: url(${item.image});" class="cart-item-img"></div>
                <div class="cart-item-info">${item.title} - ${item.price} грн 
                    <button class="decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase" data-id="${item.id}">+</button>
                </div>
            </li>`);
        totalPrice += item.price * item.quantity;
    });

    // Apply promo code discount if applicable
    if (promoCode === 'korkoza20' && isPromoCodeValid()) {
        let discount = 0.20;
        const discountedPrice = totalPrice - (totalPrice * discount);
        $('#total-price').text(`Загальна сума: ${discountedPrice.toFixed(2)} грн`);
    } else {
        $('#total-price').text(`Загальна сума: ${totalPrice.toFixed(2)} грн`);
    }
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


  function updateCheckoutModalTotalPrice() {
    let totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const promocode = $('#promocode').val().trim();
    
    // Apply promo code discount if applicable
    if (promocode === 'korkoza20' && isPromoCodeValid()) {
        totalPrice -= totalPrice * 0.20;
    }
    
    $('#total-price-modal').text(`${totalPrice.toFixed(2)} грн`);
    updateCart();
  }

  


  function handlePromoCode() {
    const enteredCode = $('#promocode').val().trim();
    if (enteredCode === 'korkoza20' && isPromoCodeValid()) {
        updateCart();
        updateCheckoutModalTotalPrice();
    } else {
        $('#total-price').text(`Загальна сума: ${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)} грн`);
        $('#total-price-modal').text(`${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)} грн`);
        updateCart();
    }
  }

  $('#promocode').on('input', handlePromoCode);

  function isPromoCodeValid() {
    const now = new Date();
    const endDate = new Date('2024-08-04T23:59:00'); // Set the promo code expiration date
    return now <= endDate;
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
      updateCart();
    });
  


    $('.modal-addtocart').click(function() {
      const id = $(this).data('id');
      const title = $(this).data('title');
      const image = $('#modal-image').attr('src');
      const description = $(this).data('description');
      const author = $(this).data('author');
      const quantity = parseInt($('#modal-quantity').val());
    
      // ✅ Забираємо окремо ці значення
      const discount = $(this).data('discount') === true || $(this).data('discount') === 'true';
      const discountPrice = parseFloat($(this).data('discount-price'));
      const price = parseFloat($(this).data('price'));
    
      // ✅ Формуємо правильну ціну
      const finalPrice = discount ? discountPrice : price;
    
      const item = {
        id,
        title,
        image,
        description,
        author,
        preorder: $(this).data('preorder') === true || $(this).data('preorder') === 'true',
        discount,
        discountPrice,
        price: finalPrice, // ось тут вже правильна ціна
        quantity: quantity || 1
      };
    
      addItemToCart(item);
      $('#item-modal').hide();
      animateImageToCart(image);
    });    

    // Function to update cart when increasing quantity
    $(document).on('click', '.increase', function() {
      const id = $(this).data('id');
      const item = cart.find(cartItem => cartItem.id === id);
      if (item) {
        item.quantity++;
        updateCart();
      }
    });

  // Function to update cart when decreasing quantity
  $(document).on('click', '.decrease', function() {
    const id = $(this).data('id');
    const item = cart.find(cartItem => cartItem.id === id);
    if (item) {
      item.quantity--;
      if (item.quantity === 0) {
        cart = cart.filter(cartItem => cartItem.id !== id);
      }
      updateCart();
    }
  });

  $(document).on('click', '.item_img', function() {
    const id = $(this).data('id');
    const title = $(this).data('title');
    const description = $(this).data('description');
    const material = $(this).data('material');
    const price = $(this).data('price');
    const image = $(this).attr('src');
    const author = $(this).data('author'); // Get the author data
    const authorLink = $(this).data('author-link'); // Get the author link data
    
    $('#modal-title').text(title);
    $('#modal-header').text(`Опис`);
    $('#modal-author').text(`${author}`); // Set the author text
    const converter = new showdown.Converter();
    $('#modal-description').html(converter.makeHtml(description));
    $('#modal-material').text(`${material}`);
    $('#modal-price').text(`Ціна: ${price} грн`);
    $('#modal-image').attr('src', image);
  
    // Set data attributes for the Add to cart button
    $('.modal-addtocart').data('id', id);
    $('.modal-addtocart').data('title', title);
    $('.modal-addtocart').data('author', author); // Set author data
    $('.modal-addtocart').data('price', price);
    $('.modal-addtocart').data('description', description);
  
    // Set the href attribute for the author link
    $('#modal-author-link').attr('href', authorLink);
  
    $('#item-modal').css('display', 'flex');
    updateCart();
  });
  

  $('.close').click(function() {
    $(this).closest('.modal').css('display', 'none');
  });
}

function loadItemsFromJson() {
  if ($('#animation-container').children().length === 0) { // Check if items are already loaded
    $.getJSON("items.json", function(data) {
      data.forEach(function(item) {
        $('#animation-container').append(`
          <div class="item" id="${item.id}">
            <img class="item_img" src="${item.image}" alt="${item.id}" data-id="${item.id}" data-title="${item.title}" data-description="${item.description}" data-material="${item.material}" data-price="${item.price}" data-author="${item.author}" data-author-link="${item['author-link']}"> <!-- Added data-author-link attribute -->
            <p class="title">${item.title}</p>
            <p class="author">${item.author}</p>
            <p class="price">
            ${item.discount ? `<span class="old-price">${item.price} грн</span> <span class="new-price">${item.discountPrice} грн</span>` : `${item.price} грн`}
            </p>
            ${item.preorder ? `<span class="preorder-label">Предзамовлення</span>` : ''}
            <button class="addtocart"
                data-id="${item.id}"
                data-title="${item.title}"
                data-price="${item.price}"
                data-discount="${item.discount}"
                data-discount-price="${item.discountPrice}"
                data-preorder="${item.preorder}"
                data-author="${item.author}">
              Додати до кошика
            </button>
          </div>
        `);
      });
      attachEventListeners();
      updateCart();
    });
  }
}

function generateUUID() {
  // Simple UUID generator function
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
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
    $('#cart-modal').css('display', 'flex');
    updateCart();
  });

  $('.close').click(function() {
    $(this).closest('.modal').hide();
    updateCart();
  });

  $('#checkout').click(function() {
    if (cart.length === 0) {
      alert('Ваш кошик порожній. Будь ласка, додайте товари, щоб перейти до оформлення замовлення.');
      return;
    }
    $('#checkout-modal').css('display', 'flex');
    updateCart();
    updateCheckoutModalTotalPrice();
  });


  function showOrderConfirmation() {
    $('#checkout-modal').css('display', 'none');
    $('#order-confirmation-modal').css('display', 'flex');
    $('#cart-modal').css('display', 'none');
    updateCart();
  }



// Open modal and disable background scroll
$('.modal').on('show', function() {
  $('body').addClass('modal-open');
  $(this).css('display', 'flex'); // Show modal in flex mode for centering
});

// Close modal and re-enable background scroll
$('.close').click(function() {
  $(this).closest('.modal').hide();
  $('body').removeClass('modal-open');
});

// Example to trigger opening a modal with class 'modal'
$('#view-cart').click(function() {
  $('#cart-modal').trigger('show');
});

// Close any modal on background click
$('.modal').click(function(e) {
  if (e.target === this) { // Only close if clicking outside content
    $(this).hide();
    $('body').removeClass('modal-open');
  }
});




$('#order-form').submit(async function(event) {
  event.preventDefault();

  const firstName = $('#name').val().trim();
  const lastName = $('#surname').val().trim();
  const phone = $('#phone').val().trim();
  const city = $('#city').val().trim();
  const deliveryMethod = $('#delivery-method').val();
  const address = deliveryMethod === 'ukrposhta' ? $('#address').val().trim() : '';
  const postOffice = deliveryMethod === 'nova-poshta' ? $('#post-office').val().trim() : '';
  const communicationMethod = $('#messenger').val().trim();
  const contact = $('#contact').val().trim();
  const comment = $('#comment').val().trim();
  const promocode = $('#promocode').val().trim();

  if (!firstName || !lastName || !phone || (!postOffice && !address) || !communicationMethod) {
    alert('Please fill out all required fields.');
    return;
  }

  let itemsText = '';
  cart.forEach((item, index) => {
    itemsText += `${item.title} x${item.quantity}`;
    if (index < cart.length - 1) {
      itemsText += ', ';
    }
  });

  let totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  if (promocode === 'korkoza20') {
    totalPrice -= totalPrice * 0.20;
  }

  const UUID = generateUUID();

  const webhookBody = {
    username: "Order Bot",
    embeds: [{
      title: 'New Order',
      description: `**Ім'я:** ${firstName} ${lastName}
        **Телефон:** ${phone}
        **Місто:** ${city}
        **Адреса/Офіс:** ${address || postOffice}
        **Метод доставки:** ${deliveryMethod}
        **Метод зв'язку:** ${communicationMethod}
        **Тег контакту:** ${contact}
        **Коментар:** ${comment}
        **Товари:** ${itemsText}
        **Промокод:** ${promocode}
        **Загальна ціна:** ${totalPrice.toFixed(2)} UAH`,
      color: 16777215,
      footer: {
        text: UUID,
        icon_url: "https://i.imgur.com/fKL31aD.jpg",
      },
      timestamp: new Date().toISOString(),
    }],
  };

  try {
    const response = await fetch('/.netlify/functions/discordWebhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    alert('Order submitted successfully!');
    cart = [];
    updateCart();
  } catch (error) {
    console.error('Error sending order:', error);
    alert('Failed to submit order. Please try again later.');
  }
});

handlePromoCode();

});