const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const chatMessages = document.getElementById("chat-messages");

const API_URL = 'https://chatbot-llama-saude-ihov.onrender.com/chat';

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
    let botReplies = data.replies;

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    botReplies.forEach((reply) => {
      const formattedReply = processMarkdown(reply);
      addMessageToChat("bot", formattedReply);
    });

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

  if (sender === "bot") {
    messageElement.innerHTML = text;
  } else {
    messageElement.textContent = text; // Usuário continua seguro
  }

  chatMessages.appendChild(messageElement);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function processMarkdown(text) {
    let processedText = text;

    const linkRegex = /(https?:\/\/[^\s\n]+)/g;
    processedText = processedText.replace(linkRegex, (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    const boldRegex = /\*\*(.*?)\*\*/g;
    processedText = processedText.replace(boldRegex, '<strong>$1</strong>');
    
    const italicRegex = /\*(.*?)\*/g;
    processedText = processedText.replace(italicRegex, '<em>$1</em>');

    processedText = processedText.replace(/\n/g, '<br>');

    return processedText;
}



