// Inicia a conexão com o servidor via Socket.IO
const socket = io();

// Seleciona o elemento que exibe o número total de usuários conectados
const clientsTotal = document.getElementById("client-total");

// seleciona os elementos do DOM usados no chat
// o metodo document.getElementById consulta o html e busca as informações contidas pelos parâmetros passadas pelo usuario e salva em uma variável para uma requisição futura onde ele ira usar para a exibiçao em tela
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

// Quando o formulário de mensagem for enviado (submit), evita o comportamento padrão e chama a função sendMessage
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

// Recebe do servidor o total de usuários conectados e atualiza o texto no elemento da interface
socket.on("clients-total", (data) => {
  clientsTotal.innerText = `usuários online: ${data}`;
});

/*
 * Envia a mensagem digitada:
 * - Verifica se o campo de mensagem não está vazio
 * - Cria um objeto com nome, mensagem e data/hora atual
 * - Envia esse objeto ao servidor via WebSocket
 * - Adiciona a mensagem na interface do usuário como sendo do próprio usuário
 * - Limpa o campo de entrada de mensagem
 */
function sendMessage() {
  if (messageInput.value === "") return;
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };
  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
}

// Quando uma nova mensagem do chat for recebida do servidor, adiciona à interface como mensagem de outro usuário
socket.on("chat-message", (data) => {
  addMessageToUI(false, data);
});

/*
 * Adiciona uma mensagem na interface do chat:
 * - Remove feedbacks de digitação anteriores
 * - Cria o HTML com a mensagem, nome do autor e tempo relativo (usando moment.js)
 * - Adiciona à lista de mensagens
 * - Faz scroll automático até o final do container
 */
function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
      <p class="message">
         ${data.message}
         <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
      </p>
    </li>
        `;

  messageContainer.innerHTML += element;
  scrollToBottom();
}

// Faz o scroll automático do container de mensagens até o fim
function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

/*
 * Envia ao servidor um feedback indicando que o usuário está digitando:
 * - Quando o campo de mensagem ganha foco
 * - Quando uma tecla é pressionada no campo
 */
messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} esta digitando...`,
  });
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} esta digitando...`,
  });
});

// Envia feedback vazio quando o campo perde o foco (parou de digitar)
messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

/*
 * Exibe o feedback de digitação recebido do servidor:
 * - Remove feedbacks anteriores
 * - Adiciona novo feedback à interface
 */
socket.on("feedback", (data) => {
  clearFeedback();
  const element = `
        <li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
  `;
  messageContainer.innerHTML += element;
});

// Remove todos os elementos de feedback de digitação da interface
function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}

// Esse script cria uma interface de chat interativa com:

//     Atualização em tempo real do número de usuários online,

//     Envio e exibição de mensagens,

//     Feedback de digitação de outros usuários.
