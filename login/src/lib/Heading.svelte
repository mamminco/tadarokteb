<script>
    export let text;
    export let subText;
    export let link="#";
    export let spaceFt="txs-top-165";
    export let main=false;
    export let showHead="true";
    let isVisible = false;
    import { inView } from '$lib/actions/inView.js';
    const duration = 'duration-700';
    const easing = 'ease-out';
    const translateX = 'translate-x-8';
    const translateY = 'translate-y-0';
    const inViewOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px", unobserveOnEnter: true };
    const setVisible = () => { isVisible = true; };
</script>

<div
    class="flex justify-between items-center relative txs-h-41 !md:txs-h-60 w-full
           transition-all {duration} {easing}
           {isVisible
               ? 'opacity-100 translate-x-0 translate-y-0'
               : `opacity-0 ${translateX} ${translateY}`
           }"
    use:inView={inViewOptions}
    on:enterView={setVisible}
>
    <div class="flex justify-between txs-h-41 items-center w-full txs-mr-30 !md:txs-mr-151">
        <div class="flex justify-start txs-h-41 items-center flex-col relative {main?"txs-w-207 !md:txs-w-260":"txs-w-107 !md:txs-w-240"}">
            <div class="bg-secondary txs-w-15 txs-h-7 txs-top-6 txs-rounded-150 absolute right-0">
            </div>
            {#if main}
            <h1 class="txs-fs-10 !md:txs-fs-16 font-semibold text-primary text-center txs-pr-20">{text}</h1>
            {:else}
            <p editabletext="27e34c0c0cf85a88067d9040b829cd52" class="txs-fs-10 !md:txs-fs-16 w-full font-semibold text-primary text-center txs-pr-20">{text}</p>
            {/if}
            <p editabletext="37a5e6e6196c681a9a5a4555652dfed8" class="txs-fs-8 !md:txs-fs-14 font-regular text-primary text-center">
                {subText}
            </p>
        </div>
        {#if showHead!="false"}
        <a editablelink="126fe02e43e141f510101eb4279687fe" aria-label="مشاهده بیشتر" href={link} class="group hover:border-[#FF6C2B] !md:txs-ml-151 txs-left-30 !md:txs-top-0 !md:txs-left-0 transition easiin duration-300 btn txs-fs-8 !md:txs-fs-10 !md:txs-h-39 !md:txs-w-46 txs-w-35 txs-h-22 hover:bg-secondary text-[#FF6633] border border-1 border-[black]/30 shadow-none font-extrabold txs-rounded-150 hover:bg-[#FF6C2B]/80 hover:text-white !md:block absolute left-0
        transition-all duration-700 {easing}
           {isVisible
               ? 'opacity-100 translate-x-0 translate-y-0'
               : `opacity-0 -${translateX} -${translateY}`
           }"
    use:inView={inViewOptions}
    on:enterView={setVisible}
        
        >
        <svg class="!md:txs-w-19 !md:txs-h-16 txs-w-10" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect class="fill-[black]/60 group-hover:fill-white" width="18" height="0" transform="translate(1 8)" fill="white"/>
            <path class="fill-[black]/60 group-hover:fill-white" d="M0.292893 8.70711C-0.0976318 8.31658 -0.0976318 7.68342 0.292893 7.29289L6.65685 0.928932C7.04738 0.538408 7.68054 0.538408 8.07107 0.928932C8.46159 1.31946 8.46159 1.95262 8.07107 2.34315L2.41421 8L8.07107 13.6569C8.46159 14.0474 8.46159 14.6805 8.07107 15.0711C7.68054 15.4616 7.04738 15.4616 6.65685 15.0711L0.292893 8.70711ZM19 8V9H0.999999V8V7H19V8Z" fill="white"/>
            </svg>
            
    </a>
        {/if}
    </div>
</div>