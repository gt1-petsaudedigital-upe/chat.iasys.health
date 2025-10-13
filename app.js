const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const chatMessages = document.getElementById("chat-messages");

const API_URL = "https://chat-iasys.up.railway.app/chat";

const sessionId = crypto.randomUUID();

messageForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  addMessageToChat("user", userMessage);

  messageInput.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        sessionId: sessionId,
      }),
    });

    const data = await response.json();
    const botReply = data.reply;

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    addMessageToChat("bot", botReply);
  } catch (error) {
    console.error("Falha ao se comunicar com o chatbot:", error);
    addMessageToChat(
      "bot",
      "Desculpe, não consegui me conectar ao servidor. Tente novamente mais tarde."
    );
  }
});

function addMessageToChat(sender, text) {
  const messageElement = document.createElement("div");
  messageElement.classList.add(
    "message",
    sender === "user" ? "user-message" : "bot-message"
  );
  messageElement.textContent = text;
  chatMessages.appendChild(messageElement);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}
