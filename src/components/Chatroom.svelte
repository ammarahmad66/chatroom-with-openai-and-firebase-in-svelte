<script>
  import { db } from "../utils/firebase";
  import { collectionData } from "rxfire/firestore";
  import { startWith } from "rxjs/operators";
  import { collection, orderBy, query, addDoc } from "firebase/firestore";

  export let googleUser;
  export let logout;

  let message = "";

  const q = query(collection(db, "chats"), orderBy("sentAt"));
  const chats = collectionData(q, "id").pipe(startWith([]));
  //console.log(chats);

  async function sendMessage() {
    if (message.trim() === "") return;
    await addDoc(collection(db, "chats"), {
      message: message,
      sentAt: Date.now(),
      avatar: googleUser.photoURL,
      uid: googleUser.uid,
    });
    // db.collection("chats").add({
    //   message: message,
    //   sentAt: Date.now(),
    //   avatar: user.photoURL,
    //   uid: user.uid,
    // });
    message = "";
  }
</script>

<main>
  <div class="header">
    <div class="logo">Chatroom</div>
    <button on:click={logout}>Logout</button>
  </div>
  <div class="messages">
    {#each $chats as chat}
      {#if googleUser.uid === chat.uid}
        <div class="message my-message">
          <div class="text">
            {chat.message}
          </div>
        </div>
      {:else}
        <div class="message other-message">
          <div class="avatar">
            <img src={chat.avatar} alt="icon" />
          </div>
          <div class="text">
            {chat.message}
          </div>
        </div>
      {/if}
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
