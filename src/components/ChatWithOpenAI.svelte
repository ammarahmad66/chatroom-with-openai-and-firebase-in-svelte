<script>
  import { onMount } from "svelte";
  import { getOpenAIResponse } from "../utils/openai";
  import FaFlag from "svelte-icons/fa/FaFlag.svelte";
  import { db } from "../utils/firebase";
  import { collection, addDoc } from "firebase/firestore";
  import { toasts } from "svelte-toasts";

  export let logout;

  let messageArray = [];
  let message = "";

  async function sendMessage() {
    if (message.trim() === "") return;
    const response = await getOpenAIResponse(message);
    messageArray = [
      ...messageArray,
      {
        sender: { message: message, user: "user" },
        assistant: { message: response, user: "bot" },
        saving: false,
      },
    ];
    console.log(messageArray);
    message = "";
  }

  async function saveMessage(index) {
    const chat = messageArray[index];
    messageArray[index].saving = true; // Mark chat as saving
    try {
      await addDoc(collection(db, "openaichats"), {
        sender: chat.sender.message,
        assistant: chat.assistant.message,
        sentAt: Date.now(),
      });
      chat.saving = true; // Mark chat as saved
      toasts.success("Chat saved successfully");
    } catch (error) {
      console.error("Error saving chat:", error);
      console.log(error.message);
      chat.saving = false; // Mark chat as not saved
      toasts.error("Error saving chat");
    }
  }

  $: {
    console.log(messageArray);
  }
</script>

<main>
  <div class="header">
    <div class="logo">Chatroom</div>
    <button on:click={logout}>Logout</button>
  </div>
  <div class="messages">
    {#each messageArray as chat, index}
      <div class="message my-message">
        <div class="text">
          {chat.sender.message}
        </div>
      </div>
      <div class="message other-message">
        <div class="text">
          {chat.assistant.message}
        </div>
        <button
          class="avatar"
          on:click={() => {
            if (!chat.saving) {
              saveMessage(index);
            }
          }}
          disabled={chat.saving}
        >
          <FaFlag style="color: {chat.saving ? 'green' : 'inherit'}" />
        </button>
      </div>
    {/each}
  </div>
  <div class="form">
    <input type="text" bind:value={message} />
    <button on:click={sendMessage}>
      <i class="fa fa-paper-plane" />
    </button>
  </div>
</main>

<style>
  main {
    height: 100%;
  }
  .header {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10px;
    border-bottom: 1px solid #ddd;
  }
  .header .logo {
    font-size: 15px;
    font-weight: 600;
    color: #111;
  }
  .header button {
    background: transparent;
    padding: 5px 10px;
    border: 1px solid #ddd;
    color: #555;
    font-size: 15px;
    cursor: pointer;
  }
  .form {
    display: flex;
    width: 100%;
    height: 40px;
    border-top: 1px solid #ddd;
  }
  .form input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    color: #111;
    padding: 10px;
  }
  .form button {
    padding: 10px;
    font-size: 20px;
    color: #555;
    background: transparent;
    outline: none;
    border: none;
    cursor: pointer;
  }
  .messages {
    width: 100%;
    height: calc(100% - 90px);
    padding: 10px;
    overflow-y: auto;
  }
  .messages::-webkit-scrollbar {
    width: 4px;
    background: #555;
  }
  .messages::-webkit-scrollbar-thumb {
    background: #888;
    width: 4px;
  }
  .messages .message {
    display: flex;
    margin: 10px 0px;
  }
  .messages .my-message {
    justify-content: flex-end;
  }
  .messages .message .avatar {
    width: 30px;
    height: 30px;
    margin-right: 8px;
    padding-left: 5px;
    cursor: pointer;
  }
  .messages .message .text {
    padding: 10px;
    background: #f0f4f7;
    color: #555;
    font-size: 13px;
    font-weight: 600;
    max-width: fit-content;
    flex: 1;
    border-radius: 5px;
  }
  .messages .message .avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .messages .my-message .text {
    background: #555;
    color: #fff;
  }
</style>
