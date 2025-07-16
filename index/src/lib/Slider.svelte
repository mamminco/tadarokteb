<script>
	export let images = [];
	images = [...images, ...images, ...images]
	import { onMount, onDestroy } from "svelte";
	import { calculateCssVariable } from "./calculateSize";
	import {  ChevronLeft,ChevronRight } from "lucide-svelte"; // Import Copy icon
	import { inView } from '$lib/actions/inView.js';
	let scrollBeh=''
	let carousel;
	let currentSlide = -1;
	let slides = [];
	let startX = 0;
	let imgSc = 731;
	let padding = 0.1;
	let isDragging = false;
	let intervalSeconds = 4;
	let intervalId;
	let loading;
	let carouselVisible = false;
	const containerDuration = 'duration-800';
	const containerEasing = 'ease-out';
	const containerTranslateX = 'translate-x-0';
	const containerTranslateY = 'translate-y-8';
	const containerInViewOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px", unobserveOnEnter: true };
	const handleCarouselEnter = () => { carouselVisible = true; };

	let canvas;
	onMount(() => {
		loading = true;
		updateSlides();
		canvas=calculateCssVariable('--tx-canvas-size')
		if (canvas==='420'){
			imgSc=407
		}
		goToSlide()
		intervalId = setInterval(() => {
			if (slides.length > 0) {
				goToSlide();
			}
		}, intervalSeconds * 1000);

		loading = false;
		return () => clearInterval(intervalId);
	});
	onDestroy(() => {
		clearInterval(intervalId);
	});

	function updateSlides() {
		if (!carousel) return;
		slides = Array.from(carousel.querySelectorAll(".carousel-item"));
	}
	function cloneSlide(){
		const firstSlideClone = slides[0].cloneNode(true);
		carousel.appendChild(firstSlideClone);
		slides.push(firstSlideClone);
		slides.shift();
	}

	function handleDrag(event) {
    if(event.touches && event.touches.length > 0){
      clientX=event.touches[0].clientX
    }
    else if(!(event.type.startsWith('touch'))){
      clientX =
			event.clientX
    }
				if (event.type === "mousedown" || event.type === "touchstart") {
			startX = clientX;
			isDragging = true;
	  carousel.classList.add("cursor-grabbing");
			return;
		}
		if (!isDragging) return;


		if (event.type === "mouseup" || event.type === "touchend" || event.type === 'mouseleave') {
			const deltaX = clientX - startX;
      console.log(deltaX)

			if (deltaX < 0) {
				goToSlide(false);
			}
			if (deltaX > 0) {
				goToSlide();
			}
			startX = clientX;
			isDragging = false;
			carousel.classList.remove("cursor-grabbing");
		}

	}

	function goToSlide(next = true) {
		if (slides.length === 0) {
			return;
		}
		cloneSlide()
		let cssVariableValue = calculateCssVariable("--tx");
		if (next) {
			currentSlide += 1;
			carousel.scrollLeft = cssVariableValue * (imgSc+padding) * -currentSlide;
		} else {
			if (currentSlide > 0) {
				currentSlide -= 1;
			}
			carousel.scrollLeft = cssVariableValue * (imgSc+padding) * -currentSlide;
		}
		scrollBeh='scroll-smooth'
	}
	let clientX;
	function startDrag(event) {
		clearInterval(intervalId);
		
      clientX =
			event.clientX
		startX = clientX;
		isDragging = true;
		carousel.style.cursor = "grabbing";
	}

	function drag(event) {
		if (!isDragging) return;
	}

	function endDrag(event) {
		if (!isDragging) return;
		isDragging = false;
		carousel.style.cursor = "grab";
		
      clientX =
			event.clientX
		const deltaX = clientX - startX;
		if (deltaX < 0) {
			goToSlide(false);
		} else if (deltaX > 0) {
			goToSlide();
		}
		intervalId = setInterval(() => {
			goToSlide();
		}, intervalSeconds * 1000);
	}

	function preventImageDrag(event) {
			event.preventDefault();
	}
</script>

<div class="relative !md:txs-h-370 txs-h-258">
	<div class="flex absolute bottom-0 !md:txs-right-100 txs-right-170  justify-between !md:txs-w-60 txs-w-52 items-center" style="z-index:1000">
		<button
			aria-label="share product"
			class="flex justify-center items-center hover:bg-[#46466D] hover:text-white border txs-rounded-9 cursor-pointer hover:border-[#46466D]/1 border-[#46466D]/50 !md:txs-w-28 txs-w-24 txs-h-24 !md:txs-h-25 txs-fs-12 font-extrabold text-primary transition duration-300 ease-in-out"
			on:click={() => {
				currentSlide += 1;
				let cssVariableValue = calculateCssVariable("--tx"); // trim() to
				carousel.scrollLeft = -currentSlide * cssVariableValue * imgSc;
			}}
		>
			<ChevronRight class="!md:txs-w-14 txs-w-11" />
		</button>
		<button
			aria-label="share product"
			class="flex justify-center items-center hover:bg-[#46466D] hover:text-white border txs-rounded-9 cursor-pointer hover:border-[#46466D]/1 border-[#46466D]/50 !md:txs-w-28 txs-w-24 txs-h-24 !md:txs-h-25 txs-fs-12 font-extrabold text-primary transition duration-300 ease-in-out"
			on:click={() => {
				if (currentSlide>0){
				currentSlide -= 1;
				let cssVariableValue = calculateCssVariable("--tx"); // trim() to
				carousel.scrollLeft = -currentSlide * cssVariableValue * imgSc;
				}
			}}
		>
			<ChevronLeft class="!md:txs-w-14 txs-w-11" />
		</button>
	</div>
	<div
	slider="mainBanner"
	class="flex w-full !md:txs-h-370 txs-h-258 relative overflow-hidden !md:txs-mt-50 !md:txs-pr-70 txs-pr-0 {scrollBeh}
		   transition-all {containerDuration} {containerEasing}
		   {carouselVisible
			   ? 'opacity-100 translate-x-0 translate-y-0'
			   : `opacity-0 ${containerTranslateX} ${containerTranslateY}`
		   }"
	bind:this={carousel}
	use:inView={containerInViewOptions}
	on:enterView={handleCarouselEnter}
	on:touchstart={handleDrag}
	on:touchmove={handleDrag}
	on:touchend={handleDrag}
	on:mousedown={handleDrag}
	on:mousemove={handleDrag}
	on:mouseup={handleDrag}
	on:mouseleave={handleDrag}
	on:dragstart={preventImageDrag}

>
	{#each images as slide, i}
	{#if canvas!='420'}
<div class={currentSlide!=i?' opacity-30 pointer-events-none transition-all duration-800':' transition-all duration-800'}>
<div
			slide={`slide-${i}`}
			
			class="
			relative
			flex items-center w-full !md:txs-h-378 txs-h-248 carousel-item !md:txs-w-695 !md:txs-pr-21 !md:txs-ml-41 txs-pr-0 shrink-0"
			
		>
		<div class="absolute right-0 !md:txs-right-73 top-0">
			<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="-0.5" y="0.5" width="49" height="49" rx="24.5" transform="matrix(-1 0 0 1 49 0)" stroke="#FF6C2B" stroke-opacity="0.5"/>
			<path d="M16.848 32.336H23.44C23.9947 30.0747 24.272 27.9627 24.272 26C24.272 20.6667 21.8827 18 17.104 18V21.2C19.152 21.2 20.176 22.416 20.176 24.848V26.192H16.848V32.336ZM26.576 32.336H33.168C33.7227 30.0747 34 27.9627 34 26C34 20.6667 31.6107 18 26.832 18V21.2C28.88 21.2 29.904 22.416 29.904 24.848V26.192H26.576V32.336Z" fill="#FF6C2B"/>
			</svg>

		</div>
		<div class="absolute left-0 !md:txs-left-73 bottom-0">
			<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="-0.5" width="49" height="49" rx="24.5" transform="matrix(1 0 0 -1 0 49)" stroke="#FF6C2B" stroke-opacity="0.5"/>
<path d="M33.152 17.664H26.56C26.0053 19.9253 25.728 22.0373 25.728 24C25.728 29.3333 28.1173 32 32.896 32V28.8C30.848 28.8 29.824 27.584 29.824 25.152V23.808H33.152V17.664ZM23.424 17.664H16.832C16.2773 19.9253 16 22.0373 16 24C16 29.3333 18.3893 32 23.168 32V28.8C21.12 28.8 20.096 27.584 20.096 25.152V23.808H23.424V17.664Z" fill="#FF6C2B"/>
</svg>


		</div>
		<div class="!md:txs-h-329 txs-h-229 !md:txs-px-109 !md:txs-py-52 bg-[#F8F8F8] !md:txs-rounded-45">
		<div class="flex justify-start items-center">
			<img src={slide.img} alt="نظر {slide.name}">
			<div class="txs-pr-15">
				<div class="txs-fs-16 font-semibold text-primary">
				{slide.name}
				</div>
				<div class="txs-fs-14 font-regular text-primary">
					{slide.role}
				</div>
			</div>

		</div>
		<div class="txs-fs-16 font-semibold txs-mt-18 text-primary">
		"فروشگاه داروخانه بهترین داروها و محصولات بهداشتی بدون نسخه من است. آنها طیف گسترده ای دارند و وب سایت آنها سفارش آنلاین را آسان می کند. تنها پیشرفتی که من پیشنهاد می کنم گسترش بخش زیبایی و مراقبت از پوست آنها است."
		</div>
		</div>
	</div>
		
		
		</div>
	{:else}
<div
			slide={`slide-${i}`}
			
			class="
			relative
			flex items-center txs-px-40 w-full !md:txs-h-378 txs-h-248 carousel-item !md:txs-w-695 !md:txs-pr-21 !md:txs-ml-41 shrink-0"
			
		>
		<div class="absolute right-4 !md:txs-right-73 top-0">
			<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect x="-0.5" y="0.5" width="49" height="49" rx="24.5" transform="matrix(-1 0 0 1 49 0)" stroke="#FF6C2B" stroke-opacity="0.5"/>
			<path d="M16.848 32.336H23.44C23.9947 30.0747 24.272 27.9627 24.272 26C24.272 20.6667 21.8827 18 17.104 18V21.2C19.152 21.2 20.176 22.416 20.176 24.848V26.192H16.848V32.336ZM26.576 32.336H33.168C33.7227 30.0747 34 27.9627 34 26C34 20.6667 31.6107 18 26.832 18V21.2C28.88 21.2 29.904 22.416 29.904 24.848V26.192H26.576V32.336Z" fill="#FF6C2B"/>
			</svg>

		</div>
		<div class="absolute left-4 !md:txs-left-73 bottom-20">
			<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="-0.5" width="49" height="49" rx="24.5" transform="matrix(1 0 0 -1 0 49)" stroke="#FF6C2B" stroke-opacity="0.5"/>
<path d="M33.152 17.664H26.56C26.0053 19.9253 25.728 22.0373 25.728 24C25.728 29.3333 28.1173 32 32.896 32V28.8C30.848 28.8 29.824 27.584 29.824 25.152V23.808H33.152V17.664ZM23.424 17.664H16.832C16.2773 19.9253 16 22.0373 16 24C16 29.3333 18.3893 32 23.168 32V28.8C21.12 28.8 20.096 27.584 20.096 25.152V23.808H23.424V17.664Z" fill="#FF6C2B"/>
</svg>


		</div>
		<div class="!md:txs-h-329 txs-h-229 !md:txs-px-109 !md:txs-py-52 bg-[#F8F8F8] !md:txs-rounded-45">
		<div class="flex justify-start items-center">
			<img src={slide.img} alt="نظر {slide.name}">
			<div class="txs-pr-15">
				<div class="txs-fs-16 font-semibold text-primary">
				{slide.name}
				</div>
				<div class="txs-fs-14 font-regular text-primary">
					{slide.role}
				</div>
			</div>

		</div>
		<div class="txs-fs-13 font-semibold txs-mt-18 text-primary">
		"فروشگاه داروخانه بهترین داروها و محصولات بهداشتی بدون نسخه من است. آنها طیف گسترده ای دارند و وب سایت آنها سفارش آنلاین را آسان می کند. تنها پیشرفتی که من پیشنهاد می کنم گسترش بخش زیبایی و مراقبت از پوست آنها است."
		</div>
		</div>
	</div>
		
	{/if}
		
	{/each}
</div>
</div>
