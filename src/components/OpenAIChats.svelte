<script>
  import { db } from "../utils/firebase";
  import { writable } from "svelte/store";
  import { onMount } from "svelte";
  import { collectionData } from "rxfire/firestore";
  import { startWith } from "rxjs/operators";
  import {
    collection,
    orderBy,
    query,
    doc,
    deleteDoc,
    where,
    getDocs,
  } from "firebase/firestore";
  import { toasts } from "svelte-toasts";

  export let hideOpenAIChats;
  let searchQuery = "";
  let filteredMessages = [];
  let messageArrayStore = writable([]);

  async function loadInitialData() {
    const q = query(collection(db, "openaichats"), orderBy("sentAt", "desc"));
    const querySnapshot = await getDocs(q);
    const initialData = querySnapshot.docs.map((doc) => doc.data());
    messageArrayStore.set(initialData);
  }

  async function deleteMessage(sentAt) {
    const chatsCollection = collection(db, "openaichats");
    const q = query(chatsCollection, where("sentAt", "==", sentAt));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      //console.log("Chat deleted successfully");
    });
    console.log("Chat deleted successfully");
    toasts.success("Chat deleted successfully");
    loadInitialData();
  }

  async function searchMessages() {
    if (searchQuery.length === 0) {
      console.log("Search query is empty");
      loadInitialData();
    }

    const q = query(
      collection(db, "openaichats"),
      where("sender", "==", searchQuery)
    );
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    const q1 = query(
      collection(db, "openaichats"),
      where("assistant", "==", searchQuery)
    );
    const querySnapshot2 = await getDocs(q1);
    const results = querySnapshot.docs.map((doc) => doc.data());
    const results2 = querySnapshot2.docs.map((doc) => doc.data());
    // Update the store based on search results
    messageArrayStore.set(!querySnapshot.empty ? results : results2);
  }

  onMount(async () => {
    // Load initial data when the component mounts
    await loadInitialData();
  });

  $: {
    console.log(messageArrayStore);
  }
</script>

<main>
  <div class="header">
    <div class="logo">Chats With OpenAI</div>
    <button on:click={hideOpenAIChats}>Back</button>
  </div>
  <div class="search-container">
    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Enter a search query"
      class="search-input"
    />
    <button
      class="search-button"
      disabled={searchQuery.length === 0 ? true : false}
      on:click={() => searchMessages()}>Search</button
    >
  </div>
  <table class="table">
    <tr class="heading">
      <td>Sender</td>
      <td>Receiver</td>
      <td>Sent At</td>
      <td>Action</td>
    </tr>
    {#each $messageArrayStore as chat}
      <tr class="data">
        <td>{chat.sender}</td>
        <td>{chat.assistant}</td>
        <td>{new Date(chat.sentAt)}</td>
        <td>
          <button on:click={() => deleteMessage(chat.sentAt)}>Delete</button>
        </td>
      </tr>
    {/each}
  </table>
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
  .table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ddd;
    padding: 10px;
  }
  td,
  th {
    border: 1px solid #ddd;
    padding: 10px;
  }
  .table button {
    background: #cd2b38;
    padding: 5px 10px;
    border: 1px solid #ddd;
    color: white;
    font-size: 15px;
    cursor: pointer;
    border-radius: 10px;
  }
  .search-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }
  .search-container input {
    border: 1px solid #ddd;
    padding: 5px 10px;
    font-size: 15px;
  }
  .search-container button {
    margin-left: 5px;
    background: #dbd6d6;
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 10px;
    color: black;
    font-size: 15px;
    cursor: pointer;
  }
</style>
