<script>
    // icons.js - Keep your original structure
    // Removed the old isVisible and onMount logic

    let visibilityMap = new Map();
    import { inView } from '$lib/actions/inView.js'; // Adjust path if needed

    // Use a Map to track the visibility state of each item by its ID

    // --- Animation Customization ---
    const duration = 'duration-800'; // Or your preferred duration
    const easing = 'ease-out';       // Or your preferred easing
    const translateX = 'translate-x-8'; // Adjust distance from right
    const translateY = 'translate-y-8'; // Adjust distance from bottom

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
        },timeOut*100)
    }
    // --- Data (Your original data) ---
    const iconsData = [
        {
            id: "support",
            timeOut:0,
            text: "پشتیبانی آنلاین",
            subtext: "هرروز و هر ساعت",
        },
        {
            id: "price",
            timeOut:1,
            text: "بسته بندی",
            subtext: "بسته های اختصاصی",
        },
        {
            id: "delivery",
            timeOut:2,
            text: "پرداخت آنلاین",
            subtext: "درگاه پرداخت آنلاین",
        },
        {
            id: "authenticity",
            timeOut:3,
            text: "ارسال سریع",
            subtext: "ارسال بین 5 تا 7 روز کاری",
        }
    ];
    
    
</script>

<!-- YOUR ORIGINAL HTML STRUCTURE AND CLASSES -->
 <div class="w-full flex justify-center txs-mt-30 !md:txs-mt-0 relative">
    <div class="flex !md:txs-w-1124 txs-w-360 justify-between txs-px-11 !md:txs-py-70 txs-pb-25">
        <div class="absolute txs-top-65 z-10">
            <svg class="txs-h-73 txs-w-1221 md:block hidden" viewBox="0 0 1221 73" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1219 71C1187.33 38.3333 1090 -19.4 954 11C784 49 761 79 642 41C523 3 408 1 337 26C266 51 100 75 2 11" stroke="#23003E" stroke-opacity="0.05" stroke-width="3" stroke-linecap="round" stroke-dasharray="10 10"/>
                </svg>
                
         </div>
        {#each iconsData as iconItem}
            <div
                class="flex flex-col items-center group justify-between
                       transition-all {duration} {easing}
                       {visibilityMap.get(iconItem.id)
                           ? 'opacity-100 translate-x-0 translate-y-0'
                           : `opacity-0 ${translateX} ${translateY}` 
                       }"
                use:inView={inViewOptions}
                on:enterView={() => setVisible(iconItem.id,iconItem.timeOut)}
            >
                <!-- Group for hover effects -->
                 
                <div class="z-20 flex md:flex-row flex-col items-center justify-between !md:txs-mb-56">
                    <!-- YOUR ORIGINAL SVG {#if} BLOCKS -->
                    {#if iconItem.id==="authenticity"}
                    
                    <svg class="md:hidden block !md:txs-h-44 txs-h-22" width="44" height="36" viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M29.3333 1.5H1.83333V25.3333H29.3333V1.5Z" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M29.3333 10.6667H36.6667L42.1667 16.1667V25.3334H29.3333V10.6667Z" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M10.0833 34.5C12.6146 34.5 14.6667 32.448 14.6667 29.9166C14.6667 27.3853 12.6146 25.3333 10.0833 25.3333C7.55203 25.3333 5.5 27.3853 5.5 29.9166C5.5 32.448 7.55203 34.5 10.0833 34.5Z" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M33.9167 34.5C36.448 34.5 38.5 32.448 38.5 29.9166C38.5 27.3853 36.448 25.3333 33.9167 25.3333C31.3854 25.3333 29.3333 27.3853 29.3333 29.9166C29.3333 32.448 31.3854 34.5 33.9167 34.5Z" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    {/if}
                    {#if iconItem.id==="delivery"}
                    <svg class="md:hidden block !md:txs-h-44 txs-h-22" width="44" height="34" viewBox="0 0 44 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M38.6667 2.33331H5.66667C3.64162 2.33331 2 3.97494 2 5.99998V28C2 30.025 3.64162 31.6666 5.66667 31.6666H38.6667C40.6917 31.6666 42.3333 30.025 42.3333 28V5.99998C42.3333 3.97494 40.6917 2.33331 38.6667 2.33331Z" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M2 13.3333H42.3333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        
                    {/if}
                    {#if iconItem.id==="price"}
                    <svg class="md:hidden block !md:txs-h-44 txs-h-22" width="41" height="31" viewBox="0 0 41 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M35 11V29.3333H5.66663V11M20.3333 29.3333V1.83331M2 1.83331H38.6667V11H2V1.83331Z" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    {/if}
                    {#if iconItem.id==="support"}
                    <svg class="md:hidden block !md:txs-h-44 txs-h-22" width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M31.1667 38.5V34.8333C31.1667 32.8884 30.3941 31.0232 29.0188 29.6479C27.6436 28.2726 25.7783 27.5 23.8334 27.5H9.16671C7.22179 27.5 5.35652 28.2726 3.98126 29.6479C2.60599 31.0232 1.83337 32.8884 1.83337 34.8333V38.5" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M16.5 20.1667C20.55 20.1667 23.8333 16.8834 23.8333 12.8333C23.8333 8.78325 20.55 5.5 16.5 5.5C12.4499 5.5 9.16663 8.78325 9.16663 12.8333C9.16663 16.8834 12.4499 20.1667 16.5 20.1667Z" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M42.1666 38.5V34.8333C42.1654 33.2085 41.6246 31.6301 40.6291 30.3459C39.6336 29.0617 38.2399 28.1446 36.6666 27.7383" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M29.3334 5.73834C30.9108 6.14223 32.3089 7.05963 33.3074 8.34591C34.3058 9.63219 34.8478 11.2142 34.8478 12.8425C34.8478 14.4708 34.3058 16.0528 33.3074 17.3391C32.3089 18.6254 30.9108 19.5428 29.3334 19.9467" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    {/if}
                    <div class="md:txs-ml-10 txs-ml-0">
                        <p editabletext="9a19b33227943ebb4e0a73b730d058cb" class="!md:txs-fs-16 txs-my-10 !md:txs-my-0 md:text-left text-center txs-fs-8 font-semibold text-[#46466D] transition duration-300 easeout">
                            {iconItem.text}
                        </p>
                        <p editabletext="5aff59bb0da7fa572c3aacba4719dba5" class=" !md:txs-fs-14 md:text-left text-center txs-fs-8 font-regular text-[#46466D] transition duration-300 easeout">
                            {iconItem.subtext}
                        </p>
                    </div>
                    {#if iconItem.id==="authenticity"}
                    
                        <svg class="md:block hidden !md:txs-mr-22" width="44" height="36" viewBox="0 0 44 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M29.3333 1.5H1.83333V25.3333H29.3333V1.5Z" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M29.3333 10.6667H36.6667L42.1667 16.1667V25.3334H29.3333V10.6667Z" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M10.0833 34.5C12.6146 34.5 14.6667 32.448 14.6667 29.9166C14.6667 27.3853 12.6146 25.3333 10.0833 25.3333C7.55203 25.3333 5.5 27.3853 5.5 29.9166C5.5 32.448 7.55203 34.5 10.0833 34.5Z" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M33.9167 34.5C36.448 34.5 38.5 32.448 38.5 29.9166C38.5 27.3853 36.448 25.3333 33.9167 25.3333C31.3854 25.3333 29.3333 27.3853 29.3333 29.9166C29.3333 32.448 31.3854 34.5 33.9167 34.5Z" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                    {/if}
                    {#if iconItem.id==="delivery"}
                    <svg class="md:block hidden !md:txs-mr-22" width="44" height="34" viewBox="0 0 44 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M38.6667 2.33331H5.66667C3.64162 2.33331 2 3.97494 2 5.99998V28C2 30.025 3.64162 31.6666 5.66667 31.6666H38.6667C40.6917 31.6666 42.3333 30.025 42.3333 28V5.99998C42.3333 3.97494 40.6917 2.33331 38.6667 2.33331Z" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M2 13.3333H42.3333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        
                    {/if}
                    {#if iconItem.id==="price"}
                    <svg class="md:block hidden !md:txs-mr-22" width="41" height="31" viewBox="0 0 41 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M35 11V29.3333H5.66663V11M20.3333 29.3333V1.83331M2 1.83331H38.6667V11H2V1.83331Z" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    {/if}
                    {#if iconItem.id==="support"}
                    <svg class="md:block hidden !md:txs-mr-22" width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M31.1667 38.5V34.8333C31.1667 32.8884 30.3941 31.0232 29.0188 29.6479C27.6436 28.2726 25.7783 27.5 23.8334 27.5H9.16671C7.22179 27.5 5.35652 28.2726 3.98126 29.6479C2.60599 31.0232 1.83337 32.8884 1.83337 34.8333V38.5" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M16.5 20.1667C20.55 20.1667 23.8333 16.8834 23.8333 12.8333C23.8333 8.78325 20.55 5.5 16.5 5.5C12.4499 5.5 9.16663 8.78325 9.16663 12.8333C9.16663 16.8834 12.4499 20.1667 16.5 20.1667Z" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M42.1666 38.5V34.8333C42.1654 33.2085 41.6246 31.6301 40.6291 30.3459C39.6336 29.0617 38.2399 28.1446 36.6666 27.7383" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        <path class="group-hover:stroke-[#46466D] stroke-[#46466D]" d="M29.3334 5.73834C30.9108 6.14223 32.3089 7.05963 33.3074 8.34591C34.3058 9.63219 34.8478 11.2142 34.8478 12.8425C34.8478 14.4708 34.3058 16.0528 33.3074 17.3391C32.3089 18.6254 30.9108 19.5428 29.3334 19.9467" stroke="#46466D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    {/if}
                    
                </div>
                
            </div>
        {/each}
    </div>
 </div>
