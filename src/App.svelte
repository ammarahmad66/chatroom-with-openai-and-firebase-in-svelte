<script>
  import { auth, googleProvider } from "./utils/firebase";
  import { signInWithPopup, signOut } from "firebase/auth";
  import { authState } from "rxfire/auth";
  import Chatroom from "./components/Chatroom.svelte";
  import ChatWithOpenAi from "./components/ChatWithOpenAi.svelte";
  import OpenAiChats from "./components/OpenAIChats.svelte";
  import { ToastContainer, FlatToast } from "svelte-toasts";

  let googleUser;
  let openAIUser;
  let openAIChats;

  const unsubscribe = authState(auth).subscribe((u) => {
    googleUser = u;
  });

  async function loginWithOpenAI() {
    openAIUser = true;
  }

  function login() {
    signInWithPopup(auth, googleProvider);
  }

  function logout() {
    if (googleUser) {
      signOut(auth);
    } else if (openAIUser) {
      openAIUser = false;
    }
  }
  function showOpenAIChats() {
    openAIChats = true;
  }

  function hideOpenAIChats() {
    openAIChats = false;
  }
</script>

<main>
  {#if googleUser}
    <Chatroom {googleUser} {logout} />
  {:else if openAIUser}
    <ChatWithOpenAi {openAIUser} {logout} />
  {:else if openAIChats}
    <OpenAiChats {openAIChats} {hideOpenAIChats} />
  {:else}
    <div class="login-form">
      <div class="login">
        <button on:click={login}>
          <i class="fa fa-google" />
          Login with Google
        </button>
        <button on:click={loginWithOpenAI}> Login with OpenAI </button>
        <button class="openAI" on:click={showOpenAIChats}
          >Show OpenAI Chats</button
        >
      </div>
    </div>
  {/if}
  <ToastContainer placement="bottom-right" let:data>
    <FlatToast {data} />
    <!-- Provider template for your toasts -->
  </ToastContainer>
</main>

<style>
  main {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    max-width: 700px;
    max-height: 700px;
    background: #fff;
    border: 1px solid #eee;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);
  }
  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .login-form button {
    padding: 10px;
    background: #fff;
    color: #111;
    font-size: 16px;
    cursor: pointer;
    outline: none;
    border: 1px solid #bbb;
  }
  .login-form .login {
    gap: 10px;
  }
  .login-form button i.fa {
    padding-right: 10px;
    border-radius: 1px solid #ddd;
    color: #555;
  }
</style>
