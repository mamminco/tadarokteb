<!-- src/routes/+layout.svelte -->
<script>
	let inputValue = "";
	let inputElement;
	import { onMount } from "svelte";
	import {
		Search,
		ShoppingCart,
		LogIn,
		Menu,
		ChevronDown,
		ChevronLeft,
		Dot,
		X,
	} from "lucide-svelte";
	onMount(async () => {
    itemsInCart = await fetch("https://persiancup.ir/wp-json/sveltewp/cart");
    // itemsInCart=[{"key":"ebc82ddcaa790d66bba665311ead3045","product_id":14018,"variation_id":0,"quantity":1,"name":"\u067e\u0648\u062f\u0631 \u0642\u0647\u0648\u0647 \u0641\u0648\u0631\u06cc \u0627\u0645\u0631\u06cc\u06a9\u0627\u0646\u0648 \u06a9\u0644\u0633 \u0645\u06cc\u062a","price":"<span class=\"woocommerce-Price-amount amount\"><bdi>238,000 <span class=\"woocommerce-Price-currencySymbol\">\u062a\u0648\u0645\u0627\u0646<\/span><\/bdi><\/span>","price_raw":238000,"line_subtotal":"<span class=\"woocommerce-Price-amount amount\"><bdi>238,000 <span class=\"woocommerce-Price-currencySymbol\">\u062a\u0648\u0645\u0627\u0646<\/span><\/bdi><\/span>","line_total":"<span class=\"woocommerce-Price-amount amount\"><bdi>238,000 <span class=\"woocommerce-Price-currencySymbol\">\u062a\u0648\u0645\u0627\u0646<\/span><\/bdi><\/span>","variation_data":"","image":"https:\/\/persiancup.ir\/wp-content\/uploads\/2025\/03\/Americano-Class-Mate-1-150x150.webp","permalink":"https:\/\/persiancup.ir\/product\/nstant-coffee-powder-class-mate-americano\/","line_total_raw":238000}]
    const jsonData = await itemsInCart.json();
    console.log(jsonData);
    itemsQuantity = sumQuantities(jsonData);
    console.log(itemsInCart);
    console.log(itemsQuantity);
  });
	import { fly } from "svelte/transition"; // Import fly transition
	function sumQuantities(dataArray) {
		let totalQuantity = 0;

		if (!Array.isArray(dataArray)) {
			return 0; // Handle case where input is not an array
		}

		for (const item of dataArray) {
			if (
				typeof item === "object" &&
				item !== null &&
				"quantity" in item
			) {
				const quantityValue = item.quantity;
				if (typeof quantityValue === "number") {
					totalQuantity += quantityValue;
				}
				// You could add an else here to handle cases where quantity is not a number if needed
			}
		}
		return totalQuantity;
	}
	let itemsInCart;
	let itemsQuantity;
	let isCartPopupOpen = false; // Control the cart popup visibility

	function showItemsInCartPopup() {
		isCartPopupOpen = !isCartPopupOpen; // Toggle the popup
	}
	function performSearch() {
		if (inputValue.trim()) {
			const trimmedSearchValue = inputValue.trim();
			const encodedSearchValue = encodeURIComponent(trimmedSearchValue);
			const url =
				`https://tadarokteb.ir/?s=${encodedSearchValue}&post_type=product`;

			window.location.href = url;
		}
	}

	function handleKeyDown(event) {
		if (event.key === "Enter") {
			performSearch(); // Call the shared search function
			event.preventDefault();
		}
	}
	function calculateTotalPrice(dataArray) {
	let totalPrice = 0;

	if (!Array.isArray(dataArray)) {
		return 0; // Handle case where input is not an array
	}
	
	for (const item of dataArray) {
		if (typeof item === 'object' && item !== null && 'line_total_raw' in item) {
		const lineTotalRawValue = item.line_total_raw;
		if (typeof lineTotalRawValue === 'number') {
			totalPrice += lineTotalRawValue;
		}
		// You could add an else here to handle cases where line_total_raw is not a number if needed
		}
	}
	return totalPrice;
	}
	onMount(async () => {
		// itemsInCart = await fetch("/wp-json/sveltewp/cart");
		itemsInCart=[{"key":"ebc82ddcaa790d66bba665311ead3045","product_id":14018,"variation_id":0,"quantity":1,"name":"\u067e\u0648\u062f\u0631 \u0642\u0647\u0648\u0647 \u0641\u0648\u0631\u06cc \u0627\u0645\u0631\u06cc\u06a9\u0627\u0646\u0648 \u06a9\u0644\u0633 \u0645\u06cc\u062a","price":"<span class=\"woocommerce-Price-amount amount\"><bdi>238,000 <span class=\"woocommerce-Price-currencySymbol\">\u062a\u0648\u0645\u0627\u0646<\/span><\/bdi><\/span>","price_raw":238000,"line_subtotal":"<span class=\"woocommerce-Price-amount amount\"><bdi>238,000 <span class=\"woocommerce-Price-currencySymbol\">\u062a\u0648\u0645\u0627\u0646<\/span><\/bdi><\/span>","line_total":"<span class=\"woocommerce-Price-amount amount\"><bdi>238,000 <span class=\"woocommerce-Price-currencySymbol\">\u062a\u0648\u0645\u0627\u0646<\/span><\/bdi><\/span>","variation_data":"","image":"https:\/\/tadarokteb.ir\/wp-content\/uploads\/2025\/03\/Americano-Class-Mate-1-150x150.webp","permalink":"https:\/\/tadarokteb.ir\/product\/nstant-coffee-powder-class-mate-americano\/","line_total_raw":238000}]
		itemsQuantity=sumQuantities(itemsInCart);
	});
	let visibilityMap = new Map();
    import { inView } from '$lib/actions/inView.js'; // Adjust path if needed

    // Use a Map to track the visibility state of each item by its ID

    // --- Animation Customization ---
    const duration = 'duration-500'; // Or your preferred duration
    const easing = 'ease-out';       // Or your preferred easing
    const translateX = 'translate-x-5'; // Adjust distance from right
    const translateY = 'translate-y-5'; // Adjust distance from bottom

    // --- IntersectionObserver Options ---
    const inViewOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
        unobserveOnEnter: true
    };
    const setVisible = (id,timeOut) => {
        setTimeout(()=>{
        if (!visibilityMap.has(id) || !visibilityMap.get(id)) {
           visibilityMap.set(id, true);
           visibilityMap = visibilityMap; // Trigger reactivity
        }
        },timeOut*50)
    }
	let navbarLinks;
	let loading=true;
	onMount(async()=>{
		//https://tadarokteb.ir/wp-json/sveltewp/header-menu
		try {
      const response = await fetch(
        "https://tadarokteb.ir/wp-json/sveltewp/header-menu",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json" // Good practice to include
          },
          credentials: "include"
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      navbarLinks = jsonData;
      navbarLinks = [...navbarLinks,{
			href: "#",
			icon: "search",
		},
		{
			href: "#",
			icon: "cart",
		},

		{
			text: "ورود/عضویت",
			href: "https://tadarokteb.ir/my-account/",
			icon: "login",
		}]
    } catch (e) {
      console.error("Failed to fetch posts:", e);
    } finally {
      loading = false;
    }
	})

	let hoveredLink = null;
	let hoveredSubgroup = null;
	let mobileMenuOpen = false;
	let openDetails = []; // Array to track open <details> elements
	let widt='w-0 opacity-0';
	let widt2='w-auto';
	function openSearch(){
		widt='txs-w-140 txs-pr-40 opacity-100';
		widt2='txs-w-150';
		inputElement.focus()
	}
	function closeSearch(){
		widt='w-0 opacity-0';
		widt2='w-auto'
	}
	function handleMouseOver(link) {
		if (link.subgroups) {
			hoveredLink = link;
		}
	}

	function handleMouseLeave() {
		hoveredLink = null;
		hoveredSubgroup = null;
	}

	function handleSubgroupMouseOver(subgroup) {
		if (subgroup.subgroups) {
			hoveredSubgroup = subgroup;
		}
	}

	function handleSubgroupMouseLeave() {
		hoveredSubgroup = null;
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
		if (!mobileMenuOpen) {
			openDetails = []; // Clear openDetails when menu closes
		}
	}

	function closeMobileMenu() {
		if (mobileMenuOpen) {
			mobileMenuOpen = false;
			openDetails = []; // Clear openDetails
		}
	}

	function toggleDetails(index) {
		if (openDetails.includes(index)) {
			openDetails = openDetails.filter((i) => i !== index);
		} else {
			openDetails = [...openDetails, index];
		}
	}
	//Overload for subgroups
	function toggleSubDetails(parentIndex, index) {
		const key = `${parentIndex}-${index}`;
		if (openDetails.includes(key)) {
			openDetails = openDetails.filter((i) => i !== key);
		} else {
			openDetails = [...openDetails, key];
		}
	}
	let dokText="ورود/عضویت"
	let doklink="/login"
	let loading2=true;
	let myPostData;
	onMount(async () => {
    try {
      const response = await fetch(
        "https://tadarokteb.ir/wp-json/sveltewp/is-logged-in",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json" // Good practice to include
          },
          credentials: "include"
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      myPostData = jsonData.is_logged_in;
      if (myPostData) {
        if (jsonData.first_name) {
			if (jsonData.first_name.length<7){
          	dokText = jsonData.first_name + ' ' + "عزیز  ";
			}
			else{
          	dokText = "حساب کاربری";
			}
		  doklink="/my-account"
        } else {
          dokText = "حساب کاربری";
		  doklink="/my-account"
        }
      }
    } catch (e) {
      console.error("Failed to fetch posts:", e);
    } finally {
      loading2 = false;
    }
  });
</script>

<!-- Wrap the main content  -->
<div class="bg-[#f1efff] !md:txs-h-132 txs-h-70">
	<div
		class="!md:txs-pt-61 txs-pt-11 z-90 txs-h-39 bg-[#f1efff] flex justify-between w-full !md:txs-px-150 txs-px-30 items-center relative"
	>
    <div class="hidden md:block txs-w-1137 txs-h-1 bg-[#46466D]/10 absolute txs-top-102"></div>
		<!-- Mobile Menu Button -->
		<button
			aria-label="toggle mobile menu"
			on:click={toggleMobileMenu}
			class="md:hidden txs-w-26 txs-h-26 text-surface font-medium justify-center flex items-center bg-[#F2F2F2] txs-rounded-50"
		>
			{#if mobileMenuOpen}
				<X class="txs-w-12 txs-pl-10 text-black" />
			{:else}
				<Menu class="md:txs-w-12 txs-w-20 text-black" />
			{/if}
		</button>

		<div class="txs-w-666 flex items-center">
			<a editablelink="d02d607a9d416e49c1119b5be82fb5c4" href="/" class="text-primary hidden md:block font-extrabold txs-fs-20">
				Tadarok
			</a>
			<!-- Desktop Navbar -->
			<div
				class="items-center justify-around md:flex hidden txs-w-651 relative"
			>
				{#each navbarLinks as link, parentIndex}
				
					<div class="
					transition-all txs-pr-30 {duration} {easing}
                   {visibilityMap.get(link)
                       ? 'opacity-100 translate-x-0 translate-y-0'
                       : `opacity-0 ${translateX} ${translateY}` 
                   }"
            use:inView={inViewOptions}
            on:enterView={() => setVisible(link,parentIndex)}
					>
						{#if link.subgroups?.length>0}
						<div
							class="shop-menu-container"
							on:mouseover={() => handleMouseOver(link)}
							on:mouseleave={handleMouseLeave}
						>
							<a
								href={link.href}
								class="font-regular hover:font-semibold txs-fs-16 text-primary transition-colors duration-300 hover:text-primary flex items-center gap-1"
							>
								{link.text}
								<ChevronDown class="txs-w-15 txs-h-15" />
							</a>
							{#if hoveredLink === link}
								<div
									class="absolute txs-px-10 txs-w-190 txs-rounded-25 txs-pl-40 txs-h-328  top-full right-[-10px] bg-[#F6F6F6] py-2 z-10" style="border-radius:  0 calc(25*var(--tx)) calc(25*var(--tx)) 0 ;"
								>
									{#each link.subgroups as subgroup, index}
										{#if subgroup.subgroups?.length>0}
											<div
												class="group"
												on:mouseover={() =>
													handleSubgroupMouseOver(
														subgroup,
													)}
												on:mouseleave={handleSubgroupMouseLeave}
											>
												<a
													href={subgroup.href}
													class="block txs-rounded-12 txs-py-2 txs-h-30 bg-[#F6F6F6] {hoveredSubgroup === subgroup?"bg-secondary text-white":""} hover:text-white  px-4 txs-py-20 text-primary hover:bg-secondary font-regular hover:font-semibold txs-fs-16 whitespace-nowrap flex items-center justify-between"
												>
												<div class="flex items-center">
													
													{subgroup.text}
												</div>
													<ChevronLeft
														class="txs-w-15 txs-h-15 text-primary group-hover:text-white"
													/>
												</a>
												{#if hoveredSubgroup === subgroup}
													<div
													class="absolute  txs-h-328 flex items-start justify-start overflow-y-auto txs-w-400 top-0 right-full bg-white  py-2 z-20" style="margin-right: calc(-10*var(--tx)); border-radius:  calc(25*var(--tx)) 0 0 calc(25*var(--tx)) ;"
													>
														<div class="txs-rounded-50 columns-2 txs-pt-10"
													>
													{#each subgroup.subgroups as subSubgroup}
															<a
																href={subSubgroup.href}
																class="block text-center px-4 txs-py-10 text-primary hover:text-primary font-regular hover:font-semibold txs-fs-16 whitespace-nowrap flex items-center "
																>
																<Dot
														class="txs-w-15 txs-h-15 text-primary"
													/>
																{subSubgroup.text}
																</a
															>
														{/each}
													</div>
													</div>
													{:else}
													<div
													class="absolute txs-rounded-25 txs-h-328 flex flex-col items-start justify-start overflow-y-auto txs-w-400 top-0 right-full bg-white  py-2 z-10" style="margin-right: calc(-10*var(--tx));border-radius:  calc(25*var(--tx)) 0 0 calc(25*var(--tx)) ;"
													>
														<div class="txs-rounded-50"
													>
													
													</div>
													</div>
												{/if}
											</div>
										{:else}
											<a
												href={subgroup.href}
												class="block px-4 txs-py-10 text-primary hover:text-primary font-regular hover:font-semibold txs-fs-16 whitespace-nowrap flex items-center justify-between"
												>{subgroup.text}</a
											>
										{/if}
									{/each}
								</div>
							{/if}
						</div>
					{:else if !link.icon}
						<a
							href={link.href}
							class="font-regular hover:font-semibold txs-fs-16 text-primary transition-colors duration-300 hover:text-primary"
						>
							{link.text}
						</a>
					{/if}
					</div>
				{/each}
			</div>
		</div>
		<!-- Icons -->
		 
		<div class="w-max flex justify-between items-center">
			{#each navbarLinks as link}
			
				{#if link.icon === "search"}
				
				<div class="relative txs-w-267 !md:txs-h-39 txs-ml-10">
					<div class=" items-center hidden md:flex left-0 absolute txs-w-267 z-10 transition-width duration-300 ease-in-out">
						<input
							type="text"
							bind:this={inputElement}
							bind:value={inputValue}
							on:blur={closeSearch}
							on:keydown={handleKeyDown}
							placeholder="جست و جو"
							class=" bg-[#f1efff] txs-fs-16 !md:txs-h-39 border-1 border-[#46466D]/30 txs-pr-20 txs-py-4 w-full txs-rounded-150 focus:outline-none focus:ring-0 focus:ring-opacity-0 text-right"
						/>
						<button
							aria-label="جستجو"
							on:click={openSearch}
							class="txs-w-26 txs-left-5 absolute txs-h-26 z-20 !md:txs-h-32 !md:txs-h-32 text-surface font-medium justify-center flex items-center txs-rounded-50"
						>
							<Search class="txs-w-20 text-primary" />
						</button>
					 </div>
					 
						<button
							aria-label="جستجو"
							on:click={openSearch}
							class="txs-w-26 hidden md:flex txs-h-26 z-20 !md:txs-h-32 !md:txs-h-32 text-surface font-medium justify-center flex items-center bg-[#F2F2F2] txs-rounded-50"
						>
							<Search class="txs-w-12 text-black" />
						</button>
				</div>
				
				{:else if link.icon === "login"}
					<a
						aria-label="ورود"
						href={doklink}
						class="txs-w-26 hidden md:flex bg-primary text-white txs-h-26 !md:txs-w-32 !md:txs-h-39 !md:txs-w-144 justify-center flex items-center bg-[#F2F2F2] txs-rounded-50"
					>
						<span
							class="txs-fs-16 txs-ml-4 hidden md:block text-white font-regular"
						>
							{dokText}
						</span>
						<svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.646446 4.85355C0.451184 4.65829 0.451184 4.34171 0.646446 4.14645L3.82843 0.964466C4.02369 0.769204 4.34027 0.769204 4.53553 0.964466C4.7308 1.15973 4.7308 1.47631 4.53553 1.67157L1.70711 4.5L4.53553 7.32843C4.7308 7.52369 4.7308 7.84027 4.53553 8.03553C4.34027 8.2308 4.02369 8.2308 3.82843 8.03553L0.646446 4.85355ZM16 5H1V4H16V5Z" fill="white"/>
                        </svg>
					</a>
				{:else if link.icon === "cart"}
          <div class="relative txs-mx-10 z-[999] cursor-pointer">
            <button
              aria-label="سبد خرید"
              on:click={() => (window.location = "https://tadarokteb.ir/cart/")}
              class="z-[999] txs-w-26 txs-h-26 cursor-pointer !md:txs-h-32 !md:txs-h-32 text-surface font-medium justify-center flex items-center bg-[#F2F2F2] txs-rounded-50 relative"
            >
              <ShoppingCart class="z-[999] txs-w-12 text-black" />
              {#if itemsQuantity > 0}
                <span
                  class="z-[999] absolute xygfhs -top-1 -right-1 bg-primary text-white rounded-full px-[6px] text-[10px] font-bold"
                  >{itemsQuantity}</span
                >
              {/if}
		  
            </button>
			</div>
				{/if}
				
			{/each}
		</div>

		<!-- Mobile Menu (Hidden on desktop) -->
		{#if mobileMenuOpen}
		<div class="txs-h-2000 w-full bg-[black]/65 fixed z-40"></div>
			<div
				in:fly={{ x: 500, duration: 300 }}
				out:fly={{ x: 500, duration: 300 }}
				class="md:hidden fixed top-0 right-0 h-screen w-3/4 bg-white shadow-lg z-50 overflow-y-auto"
				on:click|stopPropagation
				on:keydown|stopPropagation
			>
			<div class="absolute flex items-center justif-center p-4">
				<a editablelink="19171eff48fe671374c533d148f8b523" href="/">
					<img static="8cb75e9c2b046f5b8f582ae17bf93b54"
						loading="lazy"
						src="https://tadarokteb.ir/wp-content/uploads/2025/05/A4.jpg"
						alt="لوگو تدارک"
						class="txs-w-96 !md:txs-mr-0 !md:txs-w-131"
					/>
				</a>
			</div>
				<!-- close button -->
				<div class="flex items-center justify-end  pl-4 pt-4">
					<button
						aria-label="close mobile menu"
						on:click|stopPropagation={closeMobileMenu}
					>
						<X
							class="txs-w-18 txs-h-18 text-gray-700 hover:text-black"
						/>
					</button>
				</div>

				<!-- Mobile Menu Links -->
				<div class="p-4  txs-pt-40">
					{#each navbarLinks as link, parentIndex}
						{#if link.subgroups?.length>0}
							<details
								class="mb-2 border-b border-gray-200"
								open={openDetails.includes(parentIndex)}
								on:toggle={() => toggleDetails(parentIndex)}
							>
								<summary
									class="py-2 cursor-pointer text-primary font-regular hover:font-semibold flex justify-between items-center txs-fs-16"
								>
									{link.text}
									{#if openDetails.includes(parentIndex)}
										<ChevronDown class="txs-w-14 txs-h-14" />
									{:else}
										<ChevronLeft class="txs-w-14 txs-h-14" />
									{/if}
								</summary>
								<div class="pl-4">
									{#each link.subgroups as subgroup, index}
										{#if subgroup.subgroups}
											<details
												class="mb-2"
												open={openDetails.includes(
													`${parentIndex}-${index}`,
												)}
												on:toggle={() =>
													toggleSubDetails(
														parentIndex,
														index,
													)}
											>
												<summary
													class="py-2 cursor-pointer text-primary flex justify-between items-center txs-fs-10"
												>
													{subgroup.text}
													{#if openDetails.includes(`${parentIndex}-${index}`)}
														<ChevronDown
															class="txs-w-12 txs-h-12"
														/>
													{:else}
														<ChevronLeft
															class="txs-w-12 txs-h-12"
														/>
													{/if}
												</summary>
												<div class="pl-4">
													{#each subgroup.subgroups as subSubgroup}
														<a
															href={subSubgroup.href}
															class="block py-2 text-primary txs-fs-9 txs-pr-10"
															on:click={closeMobileMenu}
															>{subSubgroup.text}</a
														>
													{/each}
												</div>
											</details>
										{:else}
											<a
												href={subgroup.href}
												class="block py-2 text-primary txs-fs-10"
												on:click={closeMobileMenu}
												>{subgroup.text}</a
											>
										{/if}
									{/each}
								</div>
							</details>
						{:else if !link.icon}
							<a
								href={link.href}
								class="block py-2 text-primary font-regular hover:font-semibold border-b border-gray-200 txs-fs-16"
								on:click={closeMobileMenu}>{link.text}</a
							>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<div class="click-outside-catcher" on:click|self={closeMobileMenu}></div>
</div>

<style>
	/* Click-outside catcher for the whole page, needed for mobile menu closing. */
	.click-outside-catcher {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1; /* Place it behind everything else */
	}
	/* Basic styles for the cart popup */
	/* .cart-popup {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 10px;
		background-color: white;
		border: 1px solid #e2e8f0;
		border-radius: 0.375rem;
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
		padding: 1rem;
		width: 300px;
		z-index: 20;
		direction: rtl;
	}

	.cart-popup-item {
		padding: 0.5rem 0;
		border-bottom: 1px solid #e2e8f0;
	}

	.cart-popup-item:last-child {
		border-bottom: none;
	} */
	 /* Entire scrollbar */
::-webkit-scrollbar {
  width: 6px; /* Made it smaller */
}

/* Scrollbar track */
::-webkit-scrollbar-track {
  background: #f0f0f0;
  padding: 2px; /* Adds padding around the track */
  border-radius: 3px; /* Adjust radius to match the smaller size */
}

/* Scrollbar thumb */
::-webkit-scrollbar-thumb {
  background: #020202;
  border-radius: 3px; /* Adjust radius to match the smaller size */
  /* No direct padding for the thumb, but the track padding provides visual space */
}

/* Scrollbar thumb on hover */
::-webkit-scrollbar-thumb:hover {
  background: #ff6633;
}
</style>