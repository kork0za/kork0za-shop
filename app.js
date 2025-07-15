// Modern React App for Kork0za Shop with Tailwind CSS
const { useState, useEffect, useRef } = React;
const { createRoot } = ReactDOM;

// Main App Component
const App = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(true);

  // Load items on component mount
  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('items.json');
        const data = await response.json();
        setItems(data);
        
        // Render products in the main HTML section
        renderProductsGrid(data);
      } catch (error) {
        console.error('Error loading items:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  // Update cart count in navigation
  useEffect(() => {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCount.textContent = totalItems;
      cartCount.className = totalItems > 0 
        ? 'absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-bounce-slow'
        : 'absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center';
    }
  }, [cart]);

  // Render products in the main HTML grid
  const renderProductsGrid = (products) => {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = products.map(item => `
      <div class="group glass-effect rounded-2xl p-6 border border-primary-500/30 hover:border-primary-400/60 transition-all duration-300 hover-glow transform hover:-translate-y-2" data-item-id="${item.id}">
        <div class="relative overflow-hidden rounded-xl mb-6 bg-gradient-to-br from-dark-800 to-dark-700">
          <img src="${item.image}" alt="${item.title}" class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110">
          ${item.discount ? `
            <div class="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
              <i class="fas fa-fire mr-1"></i>
              -${Math.round((1 - item.discountPrice / item.price) * 100)}%
            </div>
          ` : ''}
          ${item.preorder ? `
            <div class="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              <i class="fas fa-clock mr-1"></i>
              Передзамовлення
            </div>
          ` : ''}
        </div>
        
        <div class="space-y-4">
          <div>
            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors duration-200">${item.title}</h3>
            <p class="text-accent-400 text-sm font-medium">${item.author}</p>
          </div>
          
          <p class="text-gray-300 text-sm line-clamp-3 leading-relaxed">${item.description.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
          
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              ${item.discount ? `
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold text-green-400">${item.discountPrice} грн</span>
                  <span class="text-lg text-gray-500 line-through">${item.price} грн</span>
                </div>
              ` : `
                <span class="text-2xl font-bold text-primary-400">${item.price} грн</span>
              `}
              <p class="text-xs text-gray-400">${item.material}</p>
            </div>
            
            <div class="flex space-x-2">
              <button class="view-item-btn bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover-glow" data-item-id="${item.id}">
                <i class="fas fa-eye mr-1"></i>
                <span class="hidden sm:inline">Деталі</span>
              </button>
              <button class="add-to-cart-btn bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg transition-all duration-300 hover-glow" data-item-id="${item.id}">
                <i class="fas fa-cart-plus mr-1"></i>
                <span class="hidden sm:inline">Купити</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    // Add event listeners to buttons
    grid.querySelectorAll('.view-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.closest('button').dataset.itemId;
        const item = products.find(p => p.id === itemId);
        if (item) {
          navigate('item', item);
        }
      });
    });

    grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const itemId = e.target.closest('button').dataset.itemId;
        const item = products.find(p => p.id === itemId);
        if (item) {
          addToCart(item);
          // Visual feedback
          const button = e.target.closest('button');
          const originalContent = button.innerHTML;
          button.innerHTML = '<i class="fas fa-check mr-1"></i>Додано!';
          button.classList.add('bg-green-500');
          setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove('bg-green-500');
          }, 1500);
        }
      });
    });
  };

  // Cart functions
  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.discount ? item.discountPrice : item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  // Setup cart button listener and routing
  useEffect(() => {
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => setShowCart(true));
    }

    // Handle routing based on URL
    const handleRouting = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      
      if (path.includes('404') || path.includes('not-found')) {
        setCurrentPage('404');
      } else if (params.get('item')) {
        const itemId = params.get('item');
        const item = items.find(i => i.id === itemId);
        if (item) {
          setSelectedItem(item);
          setCurrentPage('item');
        } else {
          setCurrentPage('404');
        }
      } else {
        setCurrentPage('home');
      }
    };

    handleRouting();
    window.addEventListener('popstate', handleRouting);
    
    return () => {
      window.removeEventListener('popstate', handleRouting);
    };
  }, [items]);

  // Router function
  const navigate = (page, item = null) => {
    if (page === 'item' && item) {
      window.history.pushState(null, '', `?item=${item.id}`);
      setSelectedItem(item);
      setCurrentPage('item');
    } else if (page === '404') {
      window.history.pushState(null, '', '/404');
      setCurrentPage('404');
    } else {
      window.history.pushState(null, '', '/');
      setCurrentPage('home');
      setSelectedItem(null);
    }
    setShowCart(false);
    setShowCheckout(false);
  };

  // Page components
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'item':
        return selectedItem ? React.createElement(ItemPage, {
          item: selectedItem,
          onBack: () => navigate('home'),
          addToCart
        }) : null;
      case '404':
        return React.createElement(NotFoundPage, { onHome: () => navigate('home') });
      default:
        return null;
    }
  };

  return React.createElement('div', { className: 'app-container' },
    // Modals
    selectedItem && React.createElement(ItemModal, {
      item: selectedItem,
      onClose: () => setSelectedItem(null),
      addToCart
    }),
    showCart && React.createElement(CartModal, {
      cart,
      onClose: () => setShowCart(false),
      onCheckout: () => {
        setShowCart(false);
        setShowCheckout(true);
      },
      removeFromCart,
      updateQuantity,
      getTotalPrice
    }),
    showCheckout && React.createElement(CheckoutModal, {
      cart,
      onClose: () => setShowCheckout(false),
      onOrderSubmit: () => {
        setShowCheckout(false);
        setShowOrderConfirmation(true);
        setCart([]);
      }
    }),
    showOrderConfirmation && React.createElement(OrderConfirmationModal, {
      onClose: () => setShowOrderConfirmation(false)
    }),
    
    // Page content
    renderCurrentPage()
  );
};

// Item Modal Component
const ItemModal = ({ item, onClose, addToCart }) => {
  const converter = new showdown.Converter();
  const [selectedImage, setSelectedImage] = useState(item.image);

  const handleAddToCart = () => {
    addToCart(item);
    // Show success animation
    const button = document.querySelector('.add-to-cart-modal');
    if (button) {
      const originalContent = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check mr-2"></i>Додано до кошика!';
      button.classList.add('bg-green-500');
      setTimeout(() => {
        button.innerHTML = originalContent;
        button.classList.remove('bg-green-500');
      }, 2000);
    }
  };

  return React.createElement('div', {
    className: 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4',
    onClick: (e) => e.target === e.currentTarget && onClose()
  },
    React.createElement('div', {
      className: 'glass-effect border border-primary-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide'
    },
      React.createElement('div', { className: 'sticky top-0 glass-effect p-4 border-b border-primary-500/30 flex justify-between items-center z-10' },
        React.createElement('h2', { className: 'text-2xl font-bold text-white' }, item.title),
        React.createElement('button', {
          onClick: onClose,
          className: 'text-gray-400 hover:text-white text-2xl transition-colors duration-200'
        }, '×')
      ),
      
      React.createElement('div', { className: 'p-6' },
        React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-8' },
          // Image section
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', { className: 'relative overflow-hidden rounded-xl bg-gradient-to-br from-dark-800 to-dark-700' },
              React.createElement('img', {
                src: selectedImage,
                alt: item.title,
                className: 'w-full h-96 object-cover'
              }),
              item.discount && React.createElement('div', {
                className: 'absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full font-semibold animate-pulse'
              },
                React.createElement('i', { className: 'fas fa-fire mr-2' }),
                `-${Math.round((1 - item.discountPrice / item.price) * 100)}%`
              ),
              item.preorder && React.createElement('div', {
                className: 'absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-2 rounded-full font-semibold'
              },
                React.createElement('i', { className: 'fas fa-clock mr-2' }),
                'Передзамовлення'
              )
            )
          ),
          
          // Info section
          React.createElement('div', { className: 'space-y-6' },
            React.createElement('div', null,
              React.createElement('h1', { className: 'text-3xl font-bold text-white mb-2' }, item.title),
              React.createElement('p', { className: 'text-accent-400 text-lg' }, item.author),
              item['author-link'] && React.createElement('a', {
                href: item['author-link'],
                target: '_blank',
                className: 'text-primary-400 hover:text-primary-300 text-sm inline-flex items-center mt-2'
              },
                React.createElement('i', { className: 'fab fa-twitter mr-2' }),
                'Автор в соцмережах'
              )
            ),
            
            React.createElement('div', { className: 'flex items-center space-x-4' },
              item.discount ? React.createElement('div', { className: 'flex items-center space-x-2' },
                React.createElement('span', { className: 'text-3xl font-bold text-green-400' }, `${item.discountPrice} грн`),
                React.createElement('span', { className: 'text-xl text-gray-500 line-through' }, `${item.price} грн`)
              ) : React.createElement('span', { className: 'text-3xl font-bold text-primary-400' }, `${item.price} грн`)
            ),
            
            React.createElement('div', { className: 'bg-dark-800/50 rounded-lg p-4 border border-primary-500/20' },
              React.createElement('h3', { className: 'text-lg font-semibold text-white mb-2' }, 'Характеристики:'),
              React.createElement('p', { className: 'text-gray-300' }, item.material)
            ),
            
            React.createElement('div', null,
              React.createElement('h3', { className: 'text-lg font-semibold text-white mb-3' }, 'Опис товару:'),
              React.createElement('div', {
                className: 'text-gray-300 leading-relaxed prose prose-invert max-w-none',
                dangerouslySetInnerHTML: { __html: converter.makeHtml(item.description) }
              })
            ),
            
            React.createElement('button', {
              onClick: handleAddToCart,
              className: 'add-to-cart-modal w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover-glow'
            },
              React.createElement('i', { className: 'fas fa-cart-plus mr-2' }),
              'Додати до кошика'
            )
          )
        )
      )
    )
  );
};

// Cart Modal Component
const CartModal = ({ cart, onClose, onCheckout, removeFromCart, updateQuantity, getTotalPrice }) => {
  if (cart.length === 0) {
    return React.createElement('div', {
      className: 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4',
      onClick: (e) => e.target === e.currentTarget && onClose()
    },
      React.createElement('div', { className: 'glass-effect border border-primary-500/30 rounded-2xl p-8 max-w-md w-full text-center' },
        React.createElement('div', { className: 'text-6xl text-gray-400 mb-4' }, '🛒'),
        React.createElement('h2', { className: 'text-2xl font-bold text-white mb-4' }, 'Кошик порожній'),
        React.createElement('p', { className: 'text-gray-300 mb-6' }, 'Додайте товари до кошика, щоб продовжити покупки'),
        React.createElement('button', {
          onClick: onClose,
          className: 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white px-6 py-3 rounded-lg transition-all duration-300 hover-glow'
        }, 'Продовжити покупки')
      )
    );
  }

  return React.createElement('div', {
    className: 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4',
    onClick: (e) => e.target === e.currentTarget && onClose()
  },
    React.createElement('div', { className: 'glass-effect border border-primary-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col' },
      React.createElement('div', { className: 'p-6 border-b border-primary-500/30 flex justify-between items-center' },
        React.createElement('h2', { className: 'text-2xl font-bold text-white flex items-center' },
          React.createElement('i', { className: 'fas fa-shopping-cart mr-3 text-primary-400' }),
          'Кошик'
        ),
        React.createElement('button', {
          onClick: onClose,
          className: 'text-gray-400 hover:text-white text-2xl transition-colors duration-200'
        }, '×')
      ),
      
      React.createElement('div', { className: 'flex-1 overflow-y-auto p-6 space-y-4' },
        ...cart.map(item =>
          React.createElement('div', {
            key: item.id,
            className: 'flex items-center space-x-4 bg-dark-800/30 rounded-lg p-4 border border-primary-500/20'
          },
            React.createElement('img', {
              src: item.image,
              alt: item.title,
              className: 'w-16 h-16 object-cover rounded-lg'
            }),
            React.createElement('div', { className: 'flex-1 min-w-0' },
              React.createElement('h3', { className: 'font-semibold text-white truncate' }, item.title),
              React.createElement('p', { className: 'text-sm text-gray-400' }, item.author),
              React.createElement('p', { className: 'text-primary-400 font-bold' },
                `${item.discount ? item.discountPrice : item.price} грн`
              )
            ),
            React.createElement('div', { className: 'flex items-center space-x-2' },
              React.createElement('button', {
                onClick: () => updateQuantity(item.id, item.quantity - 1),
                className: 'w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white rounded-full flex items-center justify-center transition-colors duration-200'
              }, '-'),
              React.createElement('span', { className: 'w-8 text-center text-white font-semibold' }, item.quantity),
              React.createElement('button', {
                onClick: () => updateQuantity(item.id, item.quantity + 1),
                className: 'w-8 h-8 bg-primary-600 hover:bg-primary-500 text-white rounded-full flex items-center justify-center transition-colors duration-200'
              }, '+')
            ),
            React.createElement('button', {
              onClick: () => removeFromCart(item.id),
              className: 'text-red-400 hover:text-red-300 transition-colors duration-200'
            }, React.createElement('i', { className: 'fas fa-trash' }))
          )
        )
      ),
      
      React.createElement('div', { className: 'p-6 border-t border-primary-500/30' },
        React.createElement('div', { className: 'flex justify-between items-center mb-4' },
          React.createElement('span', { className: 'text-xl font-bold text-white' }, 'Загалом:'),
          React.createElement('span', { className: 'text-2xl font-bold text-primary-400' }, `${getTotalPrice().toFixed(2)} грн`)
        ),
        React.createElement('button', {
          onClick: onCheckout,
          className: 'w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover-glow'
        },
          React.createElement('i', { className: 'fas fa-credit-card mr-2' }),
          'Оформити замовлення'
        )
      )
    )
  );
};

// Checkout Modal Component  
const CheckoutModal = ({ cart, onClose, onOrderSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '+380 ',
    city: '',
    deliveryMethod: 'nova-poshta',
    address: '',
    postOffice: '',
    messenger: '',
    contact: '',
    comment: '',
    promocode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  useEffect(() => {
    fetch('city.json')
      .then(response => response.json())
      .then(data => setCities(data))
      .catch(error => console.error('Error loading cities:', error));
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'city') {
      if (value.length > 0) {
        const filtered = cities.filter(city => 
          city.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 10);
        setFilteredCities(filtered);
        setShowCitySuggestions(true);
      } else {
        setShowCitySuggestions(false);
      }
    }
  };

  const handleCitySelect = (city) => {
    setFormData(prev => ({ ...prev, city }));
    setShowCitySuggestions(false);
  };

  const formatPhoneNumber = (value) => {
    let rawValue = value.replace(/\D/g, '');
    
    if (rawValue.length <= 3) {
      return '+380 ';
    }

    rawValue = rawValue.substring(3);
    let formattedValue = '+380 ';
    
    if (rawValue.length > 0) {
      formattedValue += '(' + rawValue.substring(0, Math.min(2, rawValue.length));
    }
    if (rawValue.length >= 2) {
      formattedValue += ') ' + rawValue.substring(2, Math.min(5, rawValue.length));
    }
    if (rawValue.length >= 5) {
      formattedValue += '-' + rawValue.substring(5, Math.min(7, rawValue.length));
    }
    if (rawValue.length >= 7) {
      formattedValue += '-' + rawValue.substring(7, Math.min(9, rawValue.length));
    }
    
    return formattedValue;
  };

  const calculateTotal = () => {
    let total = cart.reduce((sum, item) => {
      const price = item.discount ? item.discountPrice : item.price;
      return sum + (price * item.quantity);
    }, 0);
    if (formData.promocode === 'korkoza20') {
      return total * 0.8;
    }
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.surname || !formData.phone || !formData.city || !formData.messenger || !formData.contact) {
      alert('Будь ласка, заповніть всі обов\'язкові поля.');
      return;
    }

    if (formData.deliveryMethod === 'nova-poshta' && !formData.postOffice) {
      alert('Будь ласка, вкажіть відділення Нової Пошти.');
      return;
    }

    if (formData.deliveryMethod === 'ukrposhta' && !formData.address) {
      alert('Будь ласка, вкажіть адресу для УкрПошти.');
      return;
    }

    setIsSubmitting(true);

    try {
      const totalPrice = calculateTotal();
      const timestamp = new Date().toISOString();

      const orderData = {
        name: `${formData.name} ${formData.surname}`,
        phone: formData.phone,
        city: formData.city,
        deliveryMethod: formData.deliveryMethod,
        address: formData.address,
        postOffice: formData.postOffice,
        contact: formData.contact,
        comment: formData.comment,
        promocode: formData.promocode,
        cart: cart,
        totalPrice: totalPrice,
        timestamp: timestamp
      };

      const response = await fetch('/.netlify/functions/discordWebhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      onOrderSubmit();
    } catch (error) {
      console.error('Error sending order:', error);
      alert('Не вдалося відправити замовлення. Спробуйте ще раз пізніше.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return React.createElement('div', {
    className: 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4',
    onClick: (e) => e.target === e.currentTarget && onClose()
  },
    React.createElement('div', { className: 'glass-effect border border-primary-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide' },
      React.createElement('div', { className: 'sticky top-0 glass-effect p-6 border-b border-primary-500/30 flex justify-between items-center z-10' },
        React.createElement('h2', { className: 'text-2xl font-bold text-white flex items-center' },
          React.createElement('i', { className: 'fas fa-credit-card mr-3 text-primary-400' }),
          'Оформлення замовлення'
        ),
        React.createElement('button', {
          onClick: onClose,
          className: 'text-gray-400 hover:text-white text-2xl transition-colors duration-200'
        }, '×')
      ),
      
      React.createElement('form', { onSubmit: handleSubmit, className: 'p-6 space-y-6' },
        // Personal Information
        React.createElement('div', { className: 'bg-dark-800/30 rounded-lg p-6 border border-primary-500/20' },
          React.createElement('h3', { className: 'text-lg font-semibold text-white mb-4 flex items-center' },
            React.createElement('i', { className: 'fas fa-user mr-2 text-primary-400' }),
            'Особисті дані'
          ),
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' },
                'Ім\'я *'
              ),
              React.createElement('input', {
                type: 'text',
                value: formData.name,
                onChange: (e) => handleInputChange('name', e.target.value),
                className: 'w-full bg-dark-700 border border-primary-500/30 rounded-lg px-4 py-3 text-white focus:border-primary-400 focus:outline-none transition-colors duration-200',
                required: true,
                placeholder: 'Введіть ваше ім\'я'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' },
                'Прізвище *'
              ),
              React.createElement('input', {
                type: 'text',
                value: formData.surname,
                onChange: (e) => handleInputChange('surname', e.target.value),
                className: 'w-full bg-dark-700 border border-primary-500/30 rounded-lg px-4 py-3 text-white focus:border-primary-400 focus:outline-none transition-colors duration-200',
                required: true,
                placeholder: 'Введіть ваше прізвище'
              })
            )
          ),
          React.createElement('div', null,
            React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' },
              'Номер телефону *'
            ),
            React.createElement('input', {
              type: 'tel',
              value: formData.phone,
              onChange: (e) => handleInputChange('phone', formatPhoneNumber(e.target.value)),
              className: 'w-full bg-dark-700 border border-primary-500/30 rounded-lg px-4 py-3 text-white focus:border-primary-400 focus:outline-none transition-colors duration-200',
              placeholder: '+380 (XX) XXX-XX-XX',
              maxLength: 19,
              required: true
            })
          )
        ),

        // Delivery Information
        React.createElement('div', { className: 'bg-dark-800/30 rounded-lg p-6 border border-primary-500/20' },
          React.createElement('h3', { className: 'text-lg font-semibold text-white mb-4 flex items-center' },
            React.createElement('i', { className: 'fas fa-shipping-fast mr-2 text-primary-400' }),
            'Доставка'
          ),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', { className: 'relative' },
              React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' },
                'Місто/населений пункт *'
              ),
              React.createElement('input', {
                type: 'text',
                value: formData.city,
                onChange: (e) => handleInputChange('city', e.target.value),
                onFocus: () => formData.city && setShowCitySuggestions(true),
                onBlur: () => setTimeout(() => setShowCitySuggestions(false), 150),
                className: 'w-full bg-dark-700 border border-primary-500/30 rounded-lg px-4 py-3 text-white focus:border-primary-400 focus:outline-none transition-colors duration-200',
                required: true,
                placeholder: 'Почніть вводити назву міста'
              }),
              showCitySuggestions && filteredCities.length > 0 && React.createElement('div', {
                className: 'absolute top-full left-0 right-0 bg-dark-700 border border-primary-500/30 rounded-lg mt-1 max-h-48 overflow-y-auto z-10 shadow-lg'
              },
                ...filteredCities.map(city =>
                  React.createElement('div', {
                    key: city,
                    onClick: () => handleCitySelect(city),
                    className: 'px-4 py-2 text-white hover:bg-primary-500/20 cursor-pointer transition-colors duration-200'
                  }, city)
                )
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' },
                'Спосіб доставки *'
              ),
              React.createElement('select', {
                value: formData.deliveryMethod,
                onChange: (e) => handleInputChange('deliveryMethod', e.target.value),
                className: 'w-full bg-dark-700 border border-primary-500/30 rounded-lg px-4 py-3 text-white focus:border-primary-400 focus:outline-none transition-colors duration-200',
                required: true
              },
                React.createElement('option', { value: 'nova-poshta' }, 'Нова Пошта'),
                React.createElement('option', { value: 'ukrposhta' }, 'УкрПошта')
              )
            ),
            formData.deliveryMethod === 'ukrposhta' ? React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' },
                'Адреса (УкрПошта) *'
              ),
              React.createElement('input', {
                type: 'text',
                value: formData.address,
                onChange: (e) => handleInputChange('address', e.target.value),
                className: 'w-full bg-dark-700 border border-primary-500/30 rounded-lg px-4 py-3 text-white focus:border-primary-400 focus:outline-none transition-colors duration-200',
                required: formData.deliveryMethod === 'ukrposhta',
                placeholder: 'Введіть повну адресу'
              })
            ) : React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' },
                'Відділення Нової Пошти *'
              ),
              React.createElement('input', {
                type: 'text',
                value: formData.postOffice,
                onChange: (e) => handleInputChange('postOffice', e.target.value),
                className: 'w-full bg-dark-700 border border-primary-500/30 rounded-lg px-4 py-3 text-white focus:border-primary-400 focus:outline-none transition-colors duration-200',
                required: formData.deliveryMethod === 'nova-poshta',
                placeholder: 'Номер відділення або адреса'
              })
            )
          )
        ),

        // Contact Information
        React.createElement('div', { className: 'bg-dark-800/30 rounded-lg p-6 border border-primary-500/20' },
          React.createElement('h3', { className: 'text-lg font-semibold text-white mb-4 flex items-center' },
            React.createElement('i', { className: 'fas fa-comments mr-2 text-primary-400' }),
            'Зв\'язок'
          ),
          React.createElement('div', { className: 'bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-4' },
            React.createElement('p', { className: 'text-yellow-300 text-sm flex items-center' },
              React.createElement('i', { className: 'fas fa-info-circle mr-2' }),
              'Увага! Обговорення оплати буде проходити у месенджері який ви оберете!'
            )
          ),
          React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' },
                'Месенджер *'
              ),
              React.createElement('select', {
                value: formData.messenger,
                onChange: (e) => handleInputChange('messenger', e.target.value),
                className: 'w-full bg-dark-700 border border-primary-500/30 rounded-lg px-4 py-3 text-white focus:border-primary-400 focus:outline-none transition-colors duration-200',
                required: true
              },
                React.createElement('option', { value: '', disabled: true }, 'Оберіть месенджер'),
                React.createElement('option', { value: 'Twitter' }, 'X (формально Twitter)'),
                React.createElement('option', { value: 'Viber' }, 'Viber'),
                React.createElement('option', { value: 'Telegram' }, 'Telegram'),
                React.createElement('option', { value: 'Instagram' }, 'Instagram'),
                React.createElement('option', { value: 'Discord' }, 'Discord')
              )
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' },
                'Тег в месенджері *'
              ),
              React.createElement('input', {
                type: 'text',
                value: formData.contact,
                onChange: (e) => handleInputChange('contact', e.target.value),
                className: 'w-full bg-dark-700 border border-primary-500/30 rounded-lg px-4 py-3 text-white focus:border-primary-400 focus:outline-none transition-colors duration-200',
                required: true,
                placeholder: '@username або номер'
              })
            )
          )
        ),

        // Additional Information
        React.createElement('div', { className: 'bg-dark-800/30 rounded-lg p-6 border border-primary-500/20' },
          React.createElement('h3', { className: 'text-lg font-semibold text-white mb-4 flex items-center' },
            React.createElement('i', { className: 'fas fa-edit mr-2 text-primary-400' }),
            'Додаткова інформація'
          ),
          React.createElement('div', { className: 'space-y-4' },
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' },
                'Коментар до замовлення'
              ),
              React.createElement('textarea', {
                rows: 3,
                value: formData.comment,
                onChange: (e) => handleInputChange('comment', e.target.value),
                className: 'w-full bg-dark-700 border border-primary-500/30 rounded-lg px-4 py-3 text-white focus:border-primary-400 focus:outline-none transition-colors duration-200 resize-none',
                placeholder: 'Ваші побажання або уточнення'
              })
            ),
            React.createElement('div', null,
              React.createElement('label', { className: 'block text-sm font-medium text-gray-300 mb-2' },
                'Промокод'
              ),
              React.createElement('input', {
                type: 'text',
                value: formData.promocode,
                onChange: (e) => handleInputChange('promocode', e.target.value),
                className: 'w-full bg-dark-700 border border-primary-500/30 rounded-lg px-4 py-3 text-white focus:border-primary-400 focus:outline-none transition-colors duration-200',
                placeholder: 'Введіть промокод (за наявності)'
              })
            )
          )
        ),

        // Order Summary
        React.createElement('div', { className: 'bg-dark-800/30 rounded-lg p-6 border border-primary-500/20' },
          React.createElement('h3', { className: 'text-lg font-semibold text-white mb-4 flex items-center' },
            React.createElement('i', { className: 'fas fa-receipt mr-2 text-primary-400' }),
            'Підсумок замовлення'
          ),
          React.createElement('div', { className: 'space-y-3' },
            ...cart.map(item =>
              React.createElement('div', {
                key: item.id,
                className: 'flex justify-between items-center text-sm'
              },
                React.createElement('span', { className: 'text-gray-300' },
                  `${item.title} × ${item.quantity}`
                ),
                React.createElement('span', { className: 'text-white font-semibold' },
                  `${((item.discount ? item.discountPrice : item.price) * item.quantity).toFixed(2)} грн`
                )
              )
            )
          ),
          formData.promocode === 'korkoza20' && React.createElement('div', { className: 'mt-4 pt-4 border-t border-primary-500/30' },
            React.createElement('div', { className: 'flex justify-between items-center text-green-400' },
              React.createElement('span', null, 'Знижка (20%):'),
              React.createElement('span', null, `-${(cart.reduce((sum, item) => sum + ((item.discount ? item.discountPrice : item.price) * item.quantity), 0) * 0.2).toFixed(2)} грн`)
            )
          ),
          React.createElement('div', { className: 'mt-4 pt-4 border-t border-primary-500/30 flex justify-between items-center' },
            React.createElement('span', { className: 'text-xl font-bold text-white' }, 'Загалом:'),
            React.createElement('span', { className: 'text-2xl font-bold text-primary-400' }, `${calculateTotal().toFixed(2)} грн`)
          )
        ),

        // Submit Button
        React.createElement('div', { className: 'flex space-x-4' },
          React.createElement('button', {
            type: 'button',
            onClick: onClose,
            className: 'flex-1 bg-gray-600 hover:bg-gray-500 text-white py-4 rounded-xl font-semibold transition-all duration-300'
          }, 'Скасувати'),
          React.createElement('button', {
            type: 'submit',
            disabled: isSubmitting,
            className: 'flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 disabled:opacity-50 text-white py-4 rounded-xl font-semibold transition-all duration-300 hover-glow'
          },
            isSubmitting ? React.createElement('div', { className: 'flex items-center justify-center' },
              React.createElement('i', { className: 'fas fa-spinner fa-spin mr-2' }),
              'Відправляємо...'
            ) : React.createElement('div', { className: 'flex items-center justify-center' },
              React.createElement('i', { className: 'fas fa-check mr-2' }),
              'Оформити замовлення'
            )
          )
        )
      )
    )
  );
};

// Order Confirmation Modal Component
const OrderConfirmationModal = ({ onClose }) => {
  return React.createElement('div', {
    className: 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4',
    onClick: (e) => e.target === e.currentTarget && onClose()
  },
    React.createElement('div', { className: 'glass-effect border border-green-500/30 rounded-2xl p-8 max-w-md w-full text-center' },
      React.createElement('div', { className: 'text-6xl text-green-400 mb-6 animate-bounce' }, '✅'),
      React.createElement('h2', { className: 'text-2xl font-bold text-white mb-4' }, 'Замовлення прийнято!'),
      React.createElement('p', { className: 'text-gray-300 mb-6 leading-relaxed' },
        'Дякуємо за ваше замовлення! Ми зв\'яжемося з вами найближчим часом для підтвердження та обробки вашого замовлення.'
      ),
      React.createElement('p', { className: 'text-sm text-gray-400 mb-6' },
        'Очікуйте дзвінка або повідомлення від нашого менеджера протягом 24 годин.'
      ),
      React.createElement('button', {
        onClick: onClose,
        className: 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover-glow'
      }, 'Чудово!')
    )
  );
};

// 404 Not Found Page Component
const NotFoundPage = ({ onHome }) => {
  return React.createElement('div', { className: 'fixed inset-0 bg-dark-900 flex items-center justify-center z-50' },
    React.createElement('div', { className: 'text-center max-w-2xl mx-auto px-4' },
      React.createElement('div', { className: 'text-8xl font-game text-primary-400 mb-8 animate-pulse' }, '404'),
      React.createElement('h1', { className: 'text-4xl font-bold text-white mb-4' }, 'Сторінка не знайдена'),
      React.createElement('p', { className: 'text-xl text-gray-300 mb-8' },
        'На жаль, сторінка яку ви шукаєте не існує або була переміщена.'
      ),
      React.createElement('div', { className: 'space-y-4' },
        React.createElement('div', { className: 'text-6xl mb-6 animate-float' }, '🎮'),
        React.createElement('button', {
          onClick: onHome,
          className: 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover-glow'
        },
          React.createElement('i', { className: 'fas fa-home mr-2' }),
          'Повернутися на головну'
        )
      )
    )
  );
};

// Individual Item Page Component
const ItemPage = ({ item, onBack, addToCart }) => {
  const converter = new showdown.Converter();
  const [selectedImage, setSelectedImage] = useState(item.image);

  const handleAddToCart = () => {
    addToCart(item);
    const button = document.querySelector('.add-to-cart-page');
    if (button) {
      const originalContent = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check mr-2"></i>Додано!';
      button.classList.add('bg-green-500');
      setTimeout(() => {
        button.innerHTML = originalContent;
        button.classList.remove('bg-green-500');
      }, 2000);
    }
  };

  return React.createElement('div', { className: 'fixed inset-0 bg-dark-900 pt-16 overflow-y-auto z-40' },
    React.createElement('div', { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' },
      React.createElement('button', {
        onClick: onBack,
        className: 'mb-8 flex items-center text-primary-400 hover:text-primary-300 transition-colors duration-200'
      },
        React.createElement('i', { className: 'fas fa-arrow-left mr-2' }),
        'Назад до каталогу'
      ),
      
      React.createElement('div', { className: 'grid grid-cols-1 lg:grid-cols-2 gap-12' },
        // Image section
        React.createElement('div', null,
          React.createElement('div', { className: 'relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-800 to-dark-700 mb-6' },
            React.createElement('img', {
              src: selectedImage,
              alt: item.title,
              className: 'w-full h-96 lg:h-[500px] object-cover'
            }),
            item.discount && React.createElement('div', {
              className: 'absolute top-6 left-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-semibold animate-pulse'
            },
              React.createElement('i', { className: 'fas fa-fire mr-2' }),
              `-${Math.round((1 - item.discountPrice / item.price) * 100)}%`
            ),
            item.preorder && React.createElement('div', {
              className: 'absolute top-6 right-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-semibold'
            },
              React.createElement('i', { className: 'fas fa-clock mr-2' }),
              'Передзамовлення'
            )
          )
        ),
        
        // Info section
        React.createElement('div', { className: 'space-y-8' },
          React.createElement('div', null,
            React.createElement('h1', { className: 'text-4xl font-bold text-white mb-4' }, item.title),
            React.createElement('p', { className: 'text-accent-400 text-xl mb-2' }, item.author),
            item['author-link'] && React.createElement('a', {
              href: item['author-link'],
              target: '_blank',
              className: 'text-primary-400 hover:text-primary-300 inline-flex items-center'
            },
              React.createElement('i', { className: 'fab fa-twitter mr-2' }),
              'Автор в соцмережах'
            )
          ),
          
          React.createElement('div', { className: 'flex items-center space-x-6' },
            item.discount ? React.createElement('div', { className: 'flex items-center space-x-3' },
              React.createElement('span', { className: 'text-4xl font-bold text-green-400' }, `${item.discountPrice} грн`),
              React.createElement('span', { className: 'text-2xl text-gray-500 line-through' }, `${item.price} грн`)
            ) : React.createElement('span', { className: 'text-4xl font-bold text-primary-400' }, `${item.price} грн`)
          ),
          
          React.createElement('div', { className: 'bg-dark-800/50 rounded-xl p-6 border border-primary-500/20' },
            React.createElement('h3', { className: 'text-xl font-semibold text-white mb-3 flex items-center' },
              React.createElement('i', { className: 'fas fa-info-circle mr-2 text-primary-400' }),
              'Характеристики:'
            ),
            React.createElement('p', { className: 'text-gray-300' }, item.material)
          ),
          
          React.createElement('div', null,
            React.createElement('h3', { className: 'text-xl font-semibold text-white mb-4 flex items-center' },
              React.createElement('i', { className: 'fas fa-file-alt mr-2 text-primary-400' }),
              'Опис товару:'
            ),
            React.createElement('div', {
              className: 'text-gray-300 leading-relaxed prose prose-invert max-w-none',
              dangerouslySetInnerHTML: { __html: converter.makeHtml(item.description) }
            })
          ),
          
          React.createElement('button', {
            onClick: handleAddToCart,
            className: 'add-to-cart-page w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white py-6 px-8 rounded-xl font-semibold text-xl transition-all duration-300 hover-glow'
          },
            React.createElement('i', { className: 'fas fa-cart-plus mr-3' }),
            'Додати до кошика'
          )
        )
      )
    )
  );
};

// Initialize React App
document.addEventListener('DOMContentLoaded', () => {
  const root = createRoot(document.getElementById('react-root'));
  root.render(React.createElement(App));
});
