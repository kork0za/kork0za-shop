const fetch = require("node-fetch");

exports.handler = async (event) => {
  const webhookUrl = process.env.DISCORD;

  // CORS headers for React app
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (!webhookUrl) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "DISCORD_WEBHOOK is not set" }),
    };
  }

  if (event.httpMethod === "POST") {
    try {
      const orderData = JSON.parse(event.body);
      
      // Format the order for Discord
      const cartItems = orderData.cart.map(item => {
        const price = item.discount ? item.discountPrice : item.price;
        return `• ${item.title} x ${item.quantity} - ${(price * item.quantity).toFixed(2)} грн`;
      }).join('\n');

      const discordMessage = {
        embeds: [{
          title: "🛒 Нове замовлення Kork0za Merch",
          color: 0x5865F2,
          fields: [
            {
              name: "👤 Замовник",
              value: orderData.name,
              inline: true
            },
            {
              name: "📞 Телефон",
              value: orderData.phone,
              inline: true
            },
            {
              name: "🏙️ Місто",
              value: orderData.city,
              inline: true
            },
            {
              name: "🚚 Доставка",
              value: orderData.deliveryMethod === 'nova-poshta' ? 'Нова Пошта' : 'УкрПошта',
              inline: true
            },
            {
              name: "📍 Адреса/Відділення",
              value: orderData.deliveryMethod === 'nova-poshta' ? orderData.postOffice : orderData.address,
              inline: true
            },
            {
              name: "📱 Контакт",
              value: orderData.contact,
              inline: true
            },
            {
              name: "🛍️ Товари",
              value: cartItems,
              inline: false
            },
            {
              name: "💰 Загальна сума",
              value: `${orderData.totalPrice.toFixed(2)} грн`,
              inline: true
            }
          ],
          timestamp: orderData.timestamp
        }]
      };

      if (orderData.promocode) {
        discordMessage.embeds[0].fields.push({
          name: "🎫 Промокод",
          value: orderData.promocode,
          inline: true
        });
      }

      if (orderData.comment) {
        discordMessage.embeds[0].fields.push({
          name: "💬 Коментар",
          value: orderData.comment,
          inline: false
        });
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discordMessage),
      });

      if (!response.ok) {
        throw new Error(`Discord webhook error: ${response.statusText}`);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Order successfully sent to Discord" }),
      };
    } catch (error) {
      console.error("Error processing order:", error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
};
