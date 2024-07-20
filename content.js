// Function to make an element draggable
const queryGemini = async (userQuery) => {
  // Simulate an API call with a default response
  const finalQuery = "Give in short and precise response :" + userQuery;
  try {
    const res = await fetch('https://proxy-server-geminiai.vercel.app/api/getresult', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: finalQuery }), // data to send
    });

    const data = await res.json();
    return data.output;
    console.log(data.output);
  } catch (error) {
    console.error('Error:', error);
  }
}


function makeElementDraggable(el) {
  el.onmousedown = function (e) {
    if (e.target.id === 'content-input' || e.target.id === 'content-send') {
      return;
    }
    e.preventDefault();
    let offsetX = e.clientX - el.getBoundingClientRect().left;
    let offsetY = e.clientY - el.getBoundingClientRect().top;

    document.onmousemove = function (e) {
      e.preventDefault();
      el.style.left = (e.clientX - offsetX) + "px";
      el.style.top = (e.clientY - offsetY) + "px";
    };

    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}

// Create the chat UI container
const chatContainer = document.createElement('div');
chatContainer.id = 'chat-container';
chatContainer.style.position = 'fixed';
chatContainer.style.bottom = '20px';
chatContainer.style.right = '20px';
chatContainer.style.width = '300px';
chatContainer.style.height = '400px';
chatContainer.style.backgroundColor = '#ffffff';
chatContainer.style.border = '1px solid #e0e0e0';
chatContainer.style.borderRadius = '10px';
chatContainer.style.zIndex = '10000';
chatContainer.style.overflow = 'hidden';
chatContainer.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
chatContainer.style.cursor = 'move';
chatContainer.style.display = 'none'; // Start hidden, shown later based on URL

chatContainer.innerHTML = `
    <div class="chat-header" style="background-color: #128C7E; color: #ffffff; padding: 10px; border-radius: 10px 10px 0 0; display: flex; align-items: center; justify-content: space-between;">
        <div class="avatar" style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; margin-right: 10px;">
            <img src="https://img.freepik.com/free-photo/3d-delivery-robot-working_23-2151150169.jpg" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="flex-grow: 1;">
            <h2 style="margin: 0; font-size: 16px;">RoboAI-Chat LLM</h2>
            <p style="margin: 0; font-size: 12px;">Assistant</p>
        </div>
        <button class="close-btn" style="background: none; border: none; color: #ffffff; font-size: 20px; cursor: pointer;">&times;</button>
    </div>
    <div class="messages" style="height: calc(100% - 130px); padding: 10px; overflow-y: auto; background-color: #f0f0f0;">
        <div class="messages-content" id="content-response"></div>
    </div>
    <div class="message-box" style="border-top: 1px solid #e0e0e0; display: flex; align-items: center; padding: 10px;">
        <input type="text" class="message-input" id="content-input" placeholder="Ask your Questions !" style="flex-grow: 1; padding: 10px; border: 1px solid #e0e0e0; border-radius: 20px; outline: none; margin-right: 10px;">
        <button class="message-submit" id="content-send" style="background-color: #128C7E; color: #ffffff; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer;">SEND</button>
    </div>
`;



// Make the chat container draggable
makeElementDraggable(chatContainer);

// Append container to body
document.body.appendChild(chatContainer);


// Handle user query
document.getElementById('content-send').addEventListener('click', async function () {
  const inputField = document.getElementById('content-input');
  const query = inputField.value.trim();
  if (query) {
    // Display user message
    displayMessage(query, 'user');

    // Send query to Gemini API
    const response = await queryGemini(query);
    console.log('Response from Gemini API:', response);

    // Display Gemini API response
    displayMessage(response, 'gemini');

    // Clear input field
    inputField.value = '';
  }
});
// Optional: Handle Enter key to send message
document.getElementById('content-input').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    document.getElementById('content-send').click();
  }
});

// Handle close button to hide the chat container
document.querySelector('.close-btn').addEventListener('click', function () {
  chatContainer.style.display = 'none';
})

// Function to check if the current page is a YouTube watch page
function checkPage() {
  if (window.location.href.includes('https://www.youtube.com/watch?v=')) {
    chatContainer.style.display = 'block';
  } else {
    chatContainer.style.display = 'none';
  }
}

// Initial check
checkPage();

// Observe changes to the URL
const observer = new MutationObserver(checkPage);
observer.observe(document.body, { childList: true, subtree: true });

//Function to display Gemini API response
// function displayMessage(message, sender) {
//   const messagesContent = document.getElementById('content-response');
//   const messageElement = document.createElement('div');
//   messageElement.style.padding = '10px';
//   messageElement.style.margin = '5px 0';
//   messageElement.style.borderRadius = '10px';
//   messageElement.style.maxWidth = '70%';
//   messageElement.style.wordBreak = 'break-word';

//   if (sender === 'user') {
//     messageElement.style.backgroundColor = '#dcf8c6';
//     messageElement.style.alignSelf = 'flex-end';
//     messageElement.style.marginLeft = "30%"
//     messageElement.style.color = 'black';
//   } else if (sender === 'gemini') {
//     messageElement.style.backgroundColor = '#ffffff';
//     messageElement.style.alignSelf = 'flex-start';
//     // messageElement.style.marginLeft = "30%"
//     messageElement.style.color = 'black';
//   }

//   messageElement.textContent = message;
//   messagesContent.appendChild(messageElement);
//   messagesContent.scrollTop = messagesContent.scrollHeight;
// }


const MAX_MESSAGES = 100;

function displayMessage(message, sender) {
  const messagesContent = document.getElementById('content-response');
  const messageElement = document.createElement('div');
  messageElement.style.padding = '10px';
  messageElement.style.margin = '5px 0';
  messageElement.style.borderRadius = '10px';
  messageElement.style.maxWidth = '70%';
  messageElement.style.wordBreak = 'break-word';

  if (sender === 'user') {
    messageElement.style.backgroundColor = '#dcf8c6';
    messageElement.style.alignSelf = 'flex-end';
    messageElement.style.marginLeft = '30%';
    messageElement.style.color = 'black';
  } else if (sender === 'gemini') {
    messageElement.style.backgroundColor = '#ffffff';
    messageElement.style.alignSelf = 'flex-start';
    messageElement.style.color = 'black';
  }

  messageElement.textContent = message;
  messagesContent.appendChild(messageElement);
  messagesContent.scrollTop = messagesContent.scrollHeight;

  saveMessageToLocalStorage(message, sender);
}

function saveMessageToLocalStorage(message, sender) {
  const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
  const newMessage = { message, sender };

  savedMessages.push(newMessage);

  if (savedMessages.length > MAX_MESSAGES) {
    savedMessages.shift(); // Remove the oldest message to keep the total count at MAX_MESSAGES
  }

  localStorage.setItem('chatMessages', JSON.stringify(savedMessages));
}

function loadMessagesFromLocalStorage() {
  const savedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
  savedMessages.forEach(({ message, sender }) => displayMessage(message, sender));
}

loadMessagesFromLocalStorage();