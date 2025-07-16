<script>
  import Header from "$lib/Header.svelte";
  import Footer from "$lib/Footer.svelte";
  import hesabi from "$lib/images/1.png?w=1000&format=png";

  import "./app.css";
  import "../app.css";
  import tadarok from "$lib/images/2.png?w=1900&format=avif";
  import tadarok2 from "$lib/images/Group 100.png?w=1900&format=avif";
  import { goto } from "$app/navigation";
  import { onMount } from 'svelte'; // <-- Import onMount
  import { toast, Toaster } from 'svelte-french-toast'; // <-- Import toast and Toaster

  // Reactive variables for form inputs
  let username = '';
  let password = '';

  // Reactive variables for validation error messages
  let usernameError = '';
  let passwordError = '';

  // The base URL for your WordPress site, typically where the REST API lives.
  const API_BASE_URL = '';
  // Assuming your REST API namespace is 'sveltewp' as per the login endpoint
  const REST_API_NAMESPACE = 'sveltewp';

  // --- 1) onMount send request to this url and if already logged in, redirect ---
  onMount(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/wp-json/${REST_API_NAMESPACE}/is-logged-in`, {
        method: 'GET', // Although not strictly required for GET, it's good practice
        credentials: 'include' // Crucial for sending WordPress authentication cookies
      });

      const data = await response.json();

      if (response.ok && data.is_logged_in) {
        // User is logged in, redirect them
        const firstName = data.first_name ? data.first_name : 'کاربر';
        toast.success(`خوش آمدید، ${firstName}! در حال انتقال به صفحه حساب کاربری...`);
        console.log('User is already logged in, redirecting:', data);
        window.location = "http://localhost/n/my-account";
      } else {
        console.log('User is not logged in or status check failed:', data);
        // No toast here, as the user is expected to log in
      }
    } catch (error) {
      console.error('Error checking login status on mount:', error);
      // Optional: If you want to notify user of network issues even on initial load
      // toast.error('خطا در بررسی وضعیت ورود.');
    }
  });


  async function handleLogin(event) {
    event.preventDefault(); // Prevent default form submission or link behavior

    // --- 2) Add input validation ---
    // Reset errors before new validation
    usernameError = '';
    passwordError = '';

    let isValid = true;

    if (!username.trim()) {
      usernameError = 'نام کاربری یا ایمیل نمی‌تواند خالی باشد.';
      toast.error(usernameError); // Show toast for validation error
      isValid = false;
    }

    if (!password.trim()) {
      passwordError = 'رمز عبور نمی‌تواند خالی باشد.';
      toast.error(passwordError); // Show toast for validation error
      isValid = false;
    }

    if (!isValid) {
      return; // Stop function execution if validation fails
    }

    // --- 3) Add toast. Use svelte-french-toast library ---
    // Show a loading toast while the login request is pending
    const loadingToastId = toast.loading('در حال ورود...');

    try {
      const response = await fetch(`${API_BASE_URL}/wp-json/${REST_API_NAMESPACE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          password: password,
          remember: true // You might want a checkbox for this in the UI
        }),
        credentials: 'include' // IMPORTANT: 'include' is crucial for sending and receiving cookies
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        toast.success(data.message || 'ورود با موفقیت انجام شد!', { id: loadingToastId });
        console.log('Login successful:', data);
        // Redirect to a protected route after successful login
        window.location = "/my-account";
      } else {
        // Login failed
        const errorMessage = data.message || data.data?.message || 'خطا در ورود.';
        toast.error(errorMessage, { id: loadingToastId });
        console.error('Login failed:', data);
      }
    } catch (error) {
      console.error('Network or other error during login:', error);
      toast.error('خطای شبکه یا سرور. لطفا دوباره تلاش کنید.', { id: loadingToastId });
    }
  }
</script>

<div class="relative overflow-x-hidden bg-white" dir="rtl" page-id="login">
  <!-- Toaster component: This is where your toasts will be rendered -->
  <Toaster position="top-center" reverseOrder={false} />

  <div class="txs-h-704  bg-[#f1efff] !md:txs-px-100">

    <div class="w-full flex md:flex-row flex-col justify-between items-center txs-px-40 txs-h-504 bg-white txs-rounded-45">
      <div class="!md:txs-w-700 w-full txs-h-368 flex flex-col">
        <div class="flex !md:txs-pt-0 txs-pt-75">
          <div class="flex pointer-events-none items-center justify-center text-white bg-secondary rounded-full txs-w-108 txs-h-43 txs-ml-20">ورود</div>
          <button on:click={()=>{goto('/signup')}} class="cursor-pointer flex items-center text-[#46466D]/30 border border-[#46466D]/30 hover:text-white hover:bg-[#46466D]/30 transition-all duration-300 justify-center  rounded-full txs-w-108 txs-h-43">عضویت</button>
        </div>
        <!-- Email/Username Input -->
        <input
          class="!md:txs-w-554 w-full txs-h-65 txs-mt-20 txs-rounded-20 txs-px-20 bg-[#F8F8F8] text-primary"
          placeholder="نام کاربری یا ایمیل"
          type="text"
          name="username"
          id="login-username"
          bind:value={username}
          on:input={() => usernameError = ''} 
        >
        {#if usernameError}
          <p class="text-red-500 text-xs txs-mt-5" style="color: #FF6C2B;">{usernameError}</p>
        {/if}

        <!-- Password Input (changed type to password for security) -->
        <input
          class="!md:txs-w-554 txs-h-65 txs-mt-20 txs-rounded-20 txs-px-20 bg-[#F8F8F8] text-primary"
          placeholder="رمز عبور"
          type="password"
          name="password"
          id="login-password"
          bind:value={password}
          on:input={() => passwordError = ''}
        >
        {#if passwordError}
          <p class="text-red-500 text-xs txs-mt-5" style="color: #FF6C2B;">{passwordError}</p>
        {/if}

        <div class="flex txs-mt-72">
          <!-- Login Button -->
          <a
            href="#"
            class="flex items-center border border-[#FF6C2B] text-[#FF6C2B] transition-all duration-300 justify-center hover:text-white hover:bg-secondary rounded-full txs-w-108 txs-h-43 txs-ml-20"
            on:click={handleLogin}
          >ورود</a>
        </div>
        <!-- Removed {#if loginMessage} block as toasts replace it -->
      </div>
      <img class="txs-w-527 txs-h-448 md:block hidden" src={hesabi} alt="">
    </div>
  </div>
</div>