<script>
    import { onMount } from "svelte";
    import { ChevronLeft, ChevronRight } from "lucide-svelte";
    import { calculateCssVariable } from "./calculateSize";

    export let cards = [];
    export let data;
    export let sale = "false";
    export let mojood = "false";
    export let fields;
    export let sort;
    export let repeater;
    export let category;

    let carousel;
    let isPause = false;
    let animationDuration = 300;
    let isDragging = false;
    let startX;
    let peekAmount = 0;
    let cardsPerView = 4;
    let intervalSeconds = 3;
    let curCard = 0;
    let intervalId;
    let prevScroll;
    let imgSc = 260;
    let canvas;
    let clientX;

    onMount(() => {
        canvas = calculateCssVariable("--tx-canvas-size");
        if (canvas === "420") {
            imgSc = imgSc / 2;
        }
        let cssVariableValue = calculateCssVariable("--tx");
        intervalId = setInterval(() => {
            if (!isPause) {
                if (curCard >= 3) {
                    curCard = 0;
                    carousel.scrollLeft = -curCard * cssVariableValue * imgSc;
                } else {
                    curCard += 1;
                    carousel.scrollLeft = -curCard * cssVariableValue * imgSc;
                }
            }
        }, intervalSeconds * 2000);

        const resizeObserver = new ResizeObserver(() => {
            updateCardWidths();
            applyPeek();
        });
        resizeObserver.observe(carousel);

        return () => resizeObserver.disconnect();
    });

    $: updateCardWidths = () => {
        if (!carousel) return;
        const width = carousel.offsetWidth;
        cardsPerView = width < 640 ? 1 : width < 768 ? 2 : 4;
    };

    $: applyPeek = () => {
        if (carousel) {
            carousel.style.paddingRight = `${carousel.offsetWidth * peekAmount}px`;
        }
    };

    function handleDrag(event) {
        if (event.type === "mousemove" || event.type === "touchstart") {
            isPause = true;
            isDragging = true;
        }
        if (event.type === "mouseleave") {
            isPause = false;
            return;
        }

        if (event.touches && event.touches.length > 0) {
            clientX = event.touches[0].clientX;
        } else if (!event.type.startsWith("touch")) {
            clientX = event.clientX;
        }
        if (event.type === "mousedown" || event.type === "touchstart") {
            startX = clientX;
            carousel.classList.add("cursor-grabbing");
            return;
        }

        if (!isDragging) return;

        if (event.type === "mouseup" || event.type === "touchend") {
            const deltaX = clientX - startX;

            let cssVariableValue = calculateCssVariable("--tx");

            if (deltaX > 0) {
                curCard += 1;
                carousel.scrollLeft = -curCard * cssVariableValue * imgSc;
            }
            if (deltaX < 0) {
                curCard -= 1;
                carousel.scrollLeft = -curCard * cssVariableValue * imgSc;
            }
            startX = clientX;
            isDragging = false;
            carousel.classList.remove("cursor-grabbing");
        }
    }

    function preventImageDrag(event) {
      event.preventDefault();
    }

    function isSpecial(card) {
      if (wpPriceToNumber(card.sale_price) === 0) {
        return false;
      } else if (wpPriceToNumber(card.regular_price) > wpPriceToNumber(card.sale_price)) {
        return true;
      }
      return false;
    }

    function wpPriceToNumber(p) {
      return Number(String(p).replace(/[^0-9]/g, ""));
    }

    function priceToLocale(p) {
      return wpPriceToNumber(p).toLocaleString("en-US") + " تومان";
    }
  </script>

<div class="flex relative justify-center !md:txs-h-390 txs-h-240 txs-mb-60">
    <div class="flex h-min md:hidden absolute md:!top-0 bottom-0 !md:txs-right-100 txs-left-30  justify-between !md:txs-w-60 txs-w-52 items-center" style="z-index:1000">
		<button
			aria-label="share product"
			class="flex justify-center shadow-md items-center hover:bg-[#070707] hover:text-white border txs-rounded-90 cursor-pointer hover:border-[#FF6633]/1 border-[#000000]/10 !md:txs-w-28 txs-w-20 txs-h-20 bg-white !md:txs-h-25 txs-fs-12 font-extrabold text-secondary transition duration-300 ease-in-out"
      on:click={() => {
				if(curCard>0){
				curCard -= 1;
				let cssVariableValue = calculateCssVariable("--tx");
				carousel.scrollLeft = -curCard * cssVariableValue * imgSc;}
			}}
		>
			<ChevronRight class="!md:txs-w-14 txs-w-11" />
		</button>
		<button
			aria-label="share product"
			class="flex justify-center shadow-md items-center hover:bg-[#070707] hover:text-white border txs-rounded-90 cursor-pointer hover:border-[#FF6633]/1 border-[#000000]/10 !md:txs-w-28 txs-w-20 txs-h-20 bg-white !md:txs-h-25 txs-fs-12 font-extrabold text-secondary transition duration-300 ease-in-out"
			on:click={() => {
				if(curCard<cards.data.length){
				curCard += 1;
				let cssVariableValue = calculateCssVariable("--tx");
				carousel.scrollLeft = -curCard * cssVariableValue * imgSc;}
			}}
		>
			<ChevronLeft class="!md:txs-w-14 txs-w-11" />
		</button>
	</div>
        <div class="flex txs-w-1138 !md:txs-h-390 overflow-hidden items-center"
        role="group"
        aria-label="{sort} Products"
        bind:this={carousel}
        on:touchstart|passive={handleDrag}
        on:touchmove|passive={handleDrag}
        on:touchend={handleDrag}
        on:mousedown={handleDrag}
        on:mousemove={handleDrag}
        on:mouseup={handleDrag}
        on:mouseleave={handleDrag}
        style="user-select: none;"
        style:scroll-behavior="smooth"
        {repeater}
        {data}
        {fields}
        limit="15"
        {sort}
        {category}
        {sale}
        {mojood}
    >
        {#each cards.data as card,i}
          <div class="{i===cards.data.length-1?'txs-ml-0 !md:txs-ml-0':'txs-ml-16 !md:txs-ml-28'} relative  !md:txs-w-262 txs-w-141 txs-h-191 !md:txs-h-390 flex-shrink-0">
            <div
              class="group bg-[#F8F8F8] txs-px-25 transition duration-300 !md:txs-pt-0 txs-pt-12 easeout hover:-translate-y-0.5 txs-rounded-45 flex flex-col txs-h-191 !md:txs-h-386 items-center w-full"
              style="border-color: rgba(8, 8, 8, 0.1)!important;"
            >
              <div class="!md:txs-w-226 !md:txs-p-18 w-full txs-h-83 !md:txs-h-222">
                <img static="c4b45838fe8ebc7fe3da306b54e34b24"
                  class="!md:txs-w-226 w-full txs-h-83 !md:txs-h-222 object-cover"
                  src={card.image}
                  alt={card.name}
                  on:dragstart={preventImageDrag}
                />
              </div>
              <div class="card-body w-full">

                <p editabletext="12d22e900461d43cb08811dfe1dca77a"
                  class="card-titl !md:txs-pt-20 cursor-pointer text-right group-hover:text-secondary transition-color duration-300 text-primary txs-fs-8 !md:txs-fs-16 font-semibold txs-py-10"
                >
                  <a editablelink="bb21e08d55dfa487f9733ae9a9797e63" href={card.permalink} class="">{card.name}</a>
                </p>
                <p editabletext="9e14502519d5f8bf4e7c86ac3959d7cc"
                class="card-titl text-right txs-mb-11 txs-fs-8 !md:txs-fs-14 font-regular truncate"
              >
                {card.brand ? card.brand : ""}
              </p>
                {#if isSpecial(card)}
                  <div class="txs-w-56 flex items-center justify-center txs-rounded-6 text-white text-center txs-fs-8 font-extrabold txs-h-22 bg-primary absolute txs-top-21 txs-right-18">
                    تخفیف ویژه
                  </div>
                  <div>
                    <div class="relative flex justify-center inline-block w-full">
                      <p editabletext="85019e066eb389d8dcd0a4b78b90ad0a" class="text-center txs-fs-8 !md:txs-fs-13 font-semibold txs-pb-5 text-gray-600 yekan">{priceToLocale(card.regular_price)}</p>
                      <div class="absolute inset-y-0 txs-right-22 txs-w-69 !md:txs-right-65 !md:txs-w-139 txs-bottom-10 m-auto txs-h-1 bg-primary"></div>
                    </div>
                    <p editabletext="e58dc815e42483b313a3fedb95c17a13"
                      class="text-center txs-fs-8 !md:txs-fs-15 font-extrabold txs-pb-5 yekan"
                    >
                      {priceToLocale(card.sale_price)}
                    </p>
                  </div>
                {:else}
                  <p editabletext="326c7670da70452b3d6bd890504d6c1a"
                    class="text-left text-primary txs-fs-8 !md:txs-fs-15 font-extrabold txs-pb-5 yekan"
                  >
                    {card.regular_price == null ||
                    isNaN(wpPriceToNumber(card.regular_price)) ||
                    wpPriceToNumber(card.regular_price) == 0
                      ? "تماس بگیرید."
                      : priceToLocale(card.regular_price)}
                  </p>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
  </div>