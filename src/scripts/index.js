import { utils } from './utils.js';
import { OpenAI } from './fetch.js';


/**
 * Represents a chat conversation (a collection of messages)
 */
class Chat {
  constructor() {
    this.id = crypto.randomUUID();
    this.messages = [];
    this.title = 'A Chat'; // The title of the chat
  }

  /**
   * Add a new message to the chat
   * @param {string} user - The username of the message sender
   * @param {string} content - The content of the message
   */
  createMessage(user, content) {
    this.messages.push({ user, content });

    // @todo move Update DOM to here
    // Create message component
    const messageUI = createMessageComponent(user, content);
    // Add message to page (in .chat__history)
    document.querySelector('.chat__history').appendChild(messageUI);
  }

  /**
   * Get the chat messages
   * @returns {Array} - The array of chat messages
   */
  getMessages() {
    return this.messages;
  }
}

/**
 * Represents a collection of chats
 */
class Chats {
  constructor() {
    this.data = new Map();
  }

  /**
   * Create a new chat
   */
  createChat(title) {
    const id = crypto.randomUUID();
    this.data.set(id, new Chat());

    // Add chat to DOM
    // Add chatOption to page (in .chats) with event listener
    const chatOption = createChatOptionComponent(title);
    document.querySelector('.chats__options').appendChild(chatOption);
    chatOption.addEventListener('click', () => {
      // Set the new chat as the current chat when it's clicked
      appState.setCurrentChat(id);
    });

    return id;
  }

  /**
   * Get a chat conversation by its ID
   * @param {string} id - The ID of the chat
   * @returns {Chat} - The chat object
   */
  getChat(id) {
    return this.data.get(id);
  }

  /**
   * Convert the Chats to JSON
   */
  toJSON() {
    return utils.mapToObject(this.data);
  }
}

/**
 * Represents current state of the app.
 */
class AppState {
  constructor() {
    if (AppState.instance) {
      return AppState.instance;
    }

    this.userName = 'User';
    this.chats = new Chats(); // empty collection of chats

    // Add initial chat to chat data
    const currentChatId = this.chats.createChat('A Test Chat');
    this.currentChatId = currentChatId; // Set the current chat by id

    // Add initial message to initial chat
    const currentChat = this.chats.getChat(currentChatId);
    currentChat.createMessage('ChatGPT', 'Hello! How can I help you today?');

    AppState.instance = this;
  }

  /**
   * Get the current chat's id
   * @returns 
   */
  getCurrentChat() {
    return this.currentChatId;
  }

  /**
   * Sets the current chat by ID and updates the DOM
   * @param {*} chatId 
   */
  setCurrentChat(chatId) {
    // Set the current chat by id
    this.currentChatId = chatId;

    // @todo update ui to show current chat
    const chat = this.chats.getChat(chatId);
    this.clearChatHistory();
    this.populateChatHistoryDOM(); // populates with current chat's history
  }

  /**
   * Get the user's name
   * @returns 
   */
  getUserName() {
    return this.userName;
  }

  /**
   * Clears the .chat_history in the DOM of messages
   */
  clearChatHistory() {
    const chatHistory = document.querySelector('.chat__history');
    chatHistory.innerHTML = '';
  }

  /**
   * Populates the .chat_history in the DOM with messages from the current chat
   * @param {*} chat 
   */
  populateChatHistoryDOM() {
    const chatHistory = document.querySelector('.chat__history');
    const currentChat = this.chats.getChat(this.currentChatId);
    currentChat.getMessages().forEach((message) => {
      const messageUI = createMessageComponent(message.user, message.content);
      chatHistory.appendChild(messageUI);
    });
  }

  clearChatOptions() {
    const chatOptions = document.querySelector('.chats__options');
    chatOptions.innerHTML = '';
  }

  /**
   * Populates the .chats in the DOM with chat options
   */
  populateChatOptionsDOM() {
    for (let [chatId, chat] of this.chats.data) {
      const container = document.querySelector('.chats__options');
      // Add chatOption to page (in .chats) with event listener
      const chatOption = createChatOptionComponent(chat.title);
      container.appendChild(chatOption);
      chatOption.addEventListener('click', () => {
        // Set the new chat as the current chat
        // alert(chatId); // @todo remove
        this.setCurrentChat(chatId);
      });
    }
  }

  /**
   * Clears the chat history and chat options. Then populates all chat data in the DOM.
   * Basically a complete resyncing of the DOM from the latest chat data.
   * @returns 
   */
  clearAndPopulateChat() {
    this.clearChatHistory();
    this.clearChatOptions();
    this.populateChatHistoryDOM();
    this.populateChatOptionsDOM();
  }

  /**
   * Convert the AppState to JSON
   */
  toJSON() {
    return {
      userName: this.userName,
      chats: this.chats.toJSON(), // @todo implement
      currentChatId: this.currentChatId
    };
  }

  /**
   * Overwrite the AppState with JSON data
   * @param {*} json 
   */
  overwrite(json) {
    // Clear old data without reinitalizing
    this.chats.data = new Map(); // clear chats

    // Write new data
    // @todo implement this part
    this.userName = json.userName;
    this.chats.data = utils.objectToMap(json.chats);
    this.currentChatId = json.currentChatId;

    // resync the DOM
    this.clearAndPopulateChat();
  }

  // /**
  //  * Save the AppState offline (local storage)
  //  */
  // saveOffline() {
  //   const key = 'appState';
  //   localStorage.setItem(key, JSON.stringify(this.toJSON()));
  // }

  // /**
  //  * Load the AppState that's saved offline (local storage)
  //  */
  // loadOfflineSave() {
  //   const key = 'appState';
  //   this.overwrite(JSON.parse(localStorage.getItem(key)));
  // }

}



// @todo move to separate function that gets called in Chat.createMessage
function createMessageComponent(user, content) {
  const messageUI = document.createElement('div');
  messageUI.classList.add('chat__message');
  messageUI.classList.add('message');

  const messageUser = document.createElement('div');
  messageUser.classList.add('message__username');
  messageUser.innerText = user;
  messageUI.appendChild(messageUser);

  const messageContent = document.createElement('div');
  messageContent.classList.add('message__content');
  messageContent.innerText = content;
  messageUI.appendChild(messageContent);

  return messageUI;
}

/**
   * Create a new .chats__option component
   */
function createChatOptionComponent(title) {
  const chatOption = document.createElement('div');
  chatOption.classList.add('chats__option');
  chatOption.innerText = title;
  return chatOption;
}

// Usage
const appState = new AppState();
const openai = new OpenAI();

const newMessageForm = document.querySelector('.newMessageForm');

// Submit a message in the current chat
newMessageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  // Get new message from form
  const newMessage = e.target.elements['newMessage'].value.trim();

  // Basic Validation: Do nothing with an empty message
  if (!newMessage || newMessage === '') {
    return;
  }

  // @todo implement AppState, Chat, and Chats classes and methods below
  try {
    // Get current chat from chats (may be null if no chat exists yet)
    let currentChatId = appState.getCurrentChat(); // @todo create UIData class

    if (currentChatId === null) {
      // Create a new chat if none exists
      const chatId = appState.chats.createChat();
      // Set the new chat as the current chat
      appState.setCurrentChat(chatId);
      currentChatId = chatId;
    }

    const currentChat = appState.chats.getChat(currentChatId); // @todo create Chats class

    // Get user's name
    const username = appState.getUserName();

    // Add new message to chat history. Also adds it to DOM.
    currentChat.createMessage(username, newMessage);

    // clear the input field in newMessageForm
    e.target.elements['newMessage'].value = '';

    // Add response to chat history
    const response = await openai.fetchChatbotReply(newMessage);
    // console.log(response);
    currentChat.createMessage('ChatGPT', response); //@todo put ChatGPT username in appState
  } catch (err) {
    alert('Something went wrong. Please try again.');
  }
});

const newChatForm = document.querySelector('.newChatForm');

// Create and start a new chat
newChatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Title for Chat Option
  const defaultChatTitle = 'A Chat'; // @todo move (to Chat as static field?)

  const chatId = appState.chats.createChat(defaultChatTitle);
});