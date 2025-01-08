const fetch = require("node-fetch");

exports.handler = async (event) => {
  const webhookUrl = process.env.DISCORD;

  if (!webhookUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "DISCORD_WEBHOOK is not set" }),
    };
  }

  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body);

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Discord webhook error: ${response.statusText}`);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Order successfully sent to Discord" }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
};
