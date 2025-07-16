<script>
  import Header from "$lib/Header.svelte";
  import Footer from "$lib/Footer.svelte";
  import hesabi from "$lib/images/1.png?w=1000&format=png";

  import "./app.css"; // Assuming app.css is in the parent directory of this file
  import "../app.css"; // Assuming app.css is two levels up

  import { goto } from "$app/navigation";
  import { onMount } from 'svelte'; // <-- Import onMount
  import { toast, Toaster } from 'svelte-french-toast'; // <-- Import toast and Toaster

  // Reactive variables for form inputs
  let email = '';
  let password = '';
  let firstName = '';
  let lastName = '';

  // Reactive variables for validation error messages
  let emailError = '';
  let passwordError = '';
  let firstNameError = '';
  let lastNameError = '';

  // The base URL for your WordPress site.
  const API_BASE_URL = '';
  const REST_API_NAMESPACE = 'sveltewp'; // Assuming your REST API namespace is 'sveltewp'

  // --- 1) onMount send request to this url and if already logged in, redirect ---
  onMount(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/wp-json/${REST_API_NAMESPACE}/is-logged-in`, {
        method: 'GET',
        credentials: 'include' // Crucial for sending WordPress authentication cookies
      });

      const data = await response.json();

      if (response.ok && data.is_logged_in) {
        // User is logged in, redirect them
        const userFirstName = data.first_name ? data.first_name : 'کاربر';
        toast.success(`خوش آمدید، ${userFirstName}! شما از قبل وارد شده‌اید. در حال انتقال...`);
        console.log('User is already logged in, redirecting from signup:', data);
        window.location.href = `${API_BASE_URL}/my-account`; // Using window.location.href as requested
      } else {
        console.log('User is not logged in, signup page is accessible:', data);
        // No toast here, as the user is expected to sign up
      }
    } catch (error) {
      console.error('Error checking login status on mount (signup page):', error);
      // Optional: If you want to notify user of network issues even on initial load
      // toast.error('خطا در بررسی وضعیت ورود.');
    }
  });


  async function handleSignup(event) {
    event.preventDefault(); // Prevent default form submission or link behavior

    // --- 2) Add input validation ---
    // Reset errors before new validation
    emailError = '';
    passwordError = '';
    firstNameError = '';
    lastNameError = '';

    let isValid = true;

    if (!firstName.trim()) {
      firstNameError = 'نام نمی‌تواند خالی باشد.';
      toast.error(firstNameError);
      isValid = false;
    }
    if (!lastName.trim()) {
      lastNameError = 'نام خانوادگی نمی‌تواند خالی باشد.';
      toast.error(lastNameError);
      isValid = false;
    }
    if (!email.trim()) {
      emailError = 'ایمیل نمی‌تواند خالی باشد.';
      toast.error(emailError);
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { // Basic email format validation
        emailError = 'فرمت ایمیل نامعتبر است.';
        toast.error(emailError);
        isValid = false;
    }

    if (!password.trim()) {
      passwordError = 'رمز عبور نمی‌تواند خالی باشد.';
      toast.error(passwordError);
      isValid = false;
    } else if (password.length < 6) { // Example: minimum password length
        passwordError = 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
        toast.error(passwordError);
        isValid = false;
    }

    if (!isValid) {
      return; // Stop function execution if validation fails
    }

    // --- 3) Add toast. Use svelte-french-toast library ---
    // Show a loading toast while the signup request is pending
    const loadingToastId = toast.loading('در حال ثبت نام...');

    try {
      const response = await fetch(`${API_BASE_URL}/wp-json/${REST_API_NAMESPACE}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          // Use the email value for both 'username' and 'email' API parameters
          username: email,
          email: email,
          password: password,
          first_name: firstName,
          last_name: lastName
        }),
        credentials: 'include' // IMPORTANT: 'include' is crucial for sending and receiving cookies
      });

      const data = await response.json();

      if (response.ok) {
        // Signup successful
        toast.success(data.message || 'ثبت نام با موفقیت انجام شد!', { id: loadingToastId });
        console.log('Signup successful:', data);

        // Redirect to /my-account on success using window.location.href
        window.location.href = `${API_BASE_URL}/my-account`;

      } else {
        // Signup failed
        const errorMessage = data.message || (data.data && data.data.message) || 'خطا در ثبت نام.';
        toast.error(errorMessage, { id: loadingToastId });
        console.error('Signup failed:', data);
      }
    } catch (error) {
      console.error('Network or other error during signup:', error);
      toast.error('خطای شبکه یا سرور. لطفا دوباره تلاش کنید.', { id: loadingToastId });
    }
  }
</script>

<div class="relative overflow-x-hidden bg-white" dir="rtl" page-id="signup">
  <!-- Toaster component: This is where your toasts will be rendered -->
  <Toaster position="top-center" reverseOrder={false} />

  <div class="txs-h-704 bg-[#f1efff] !md:txs-px-100">

    <div class="w-full flex justify-between items-center txs-px-40 txs-h-504 bg-white txs-rounded-45">
      <!-- Adjusted `txs-h-368` (from 400) as one input is removed, adjust if needed -->
      <div class="!md:txs-w-700 w-full txs-h-368 flex flex-col">
        <div class="flex">
          <!-- Link to Login page -->
          <button on:click={()=>{goto('/login')}}  class="cursor-pointer flex items-center text-[#46466D]/30 border border-[#46466D]/30 hover:text-white hover:bg-[#46466D]/30 transition-all duration-300 justify-center rounded-full txs-w-108 txs-h-43 txs-ml-20">ورود</button>
          <!-- Active Signup tab -->
          <div class="flex pointer-events-none items-center justify-center text-white bg-secondary rounded-full txs-w-108 txs-h-43">عضویت</div>
        </div>

        <!-- First Name Input -->
        <input
          class="!md:txs-w-554 w-full txs-h-65 txs-mt-20 txs-rounded-20 txs-px-20 bg-[#F8F8F8] text-primary"
          placeholder="نام"
          type="text"
          name="first_name"
          id="signup-first-name"
          bind:value={firstName}
          on:input={() => firstNameError = ''}
        >
        {#if firstNameError}
          <p class="text-red-500 text-xs txs-mt-5" style="color: #FF6C2B;">{firstNameError}</p>
        {/if}

        <!-- Last Name Input -->
        <input
          class="!md:txs-w-554 txs-h-65 txs-mt-20 txs-rounded-20 txs-px-20 bg-[#F8F8F8] text-primary"
          placeholder="نام خانوادگی"
          type="text"
          name="last_name"
          id="signup-last-name"
          bind:value={lastName}
          on:input={() => lastNameError = ''}
        >
        {#if lastNameError}
          <p class="text-red-500 text-xs txs-mt-5" style="color: #FF6C2B;">{lastNameError}</p>
        {/if}

        <!-- Email Input (now also implicitly serving as username) -->
        <input
          class="!md:txs-w-554 txs-h-65 txs-mt-20 txs-rounded-20 txs-px-20 bg-[#F8F8F8] text-primary"
          placeholder="ایمیل"
          type="email"
          name="email"
          id="signup-email"
          bind:value={email}
          on:input={() => emailError = ''}
        >
        {#if emailError}
          <p class="text-red-500 text-xs txs-mt-5" style="color: #FF6C2B;">{emailError}</p>
        {/if}

        <!-- Password Input -->
        <input
          class="!md:txs-w-554 txs-h-65 txs-mt-20 txs-rounded-20 txs-px-20 bg-[#F8F8F8] text-primary"
          placeholder="رمز عبور"
          type="password"
          name="password"
          id="signup-password"
          bind:value={password}
          on:input={() => passwordError = ''}
        >
        {#if passwordError}
          <p class="text-red-500 text-xs txs-mt-5" style="color: #FF6C2B;">{passwordError}</p>
        {/if}

        <div class="flex txs-mt-20"> <!-- Adjusted margin-top for button group -->
          <!-- Signup Button -->
          <a
            href="#"
            class="flex items-center border border-[#FF6C2B] text-[#FF6C2B] transition-all duration-300 justify-center hover:text-white hover:bg-secondary rounded-full txs-w-108 txs-h-43 txs-ml-20"
            on:click={handleSignup}
          >ثبت نام</a>
        </div>
        <!-- Removed {#if signupMessage} block as toasts replace it -->
      </div>
      <img class="txs-w-527 txs-h-448 md:block hidden" src={hesabi} alt="ثبت نام">
    </div>
  </div>
</div>