<script>
  import banner1 from "$lib/images/2.1 (2).png?w=900&format=avif";
  import banner2 from "$lib/images/1 (2).png?w=900&format=avif";


    let visibilityMap = new Map();
    import { inView } from '$lib/actions/inView.js'; // Adjust path if needed

    // Use a Map to track the visibility state of each item by its ID

    // --- Animation Customization ---
    const duration = 'duration-800'; // Or your preferred duration
    const easing = 'ease-out';       // Or your preferred easing
    const translateX = '-translate-x-8'; // Adjust distance from right
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
</script>

<div class="flex justify-center items-center txs-mb-100">
    <div class="md:flex !md:txs-px-0 md:flex-row flex-col md:justify-between justify-center items-center txs-w-360 !md:txs-w-1138">
        <div class="!md:txs-w-554 w-full txs-h-182 !md:txs-h-280 relative group overflow-hidden bg-primary cursor-pointer txs-rounded-45">
            <img static="3ac779006dea1c0067ca67ceb536254a" class="!md:txs-w-554 w-full txs-h-182 !md:txs-h-280  {visibilityMap.get(2)?'':'blur-xs'} transition-all group-hover:opacity-90 group-hover:blur-xs txs-rounded-45 duration-600 transform group-hover:scale-105 absolute" src={banner1} alt="تجهیزات درمانی">
            <div class="transition-all duration-200 {duration} {easing}
                          {visibilityMap.get(2)
                            ? 'opacity-100 translate-x-0 translate-y-0'
                            : `opacity-0 ${translateX} ${translateY}`
                          }"
                  use:inView={inViewOptions}
                  on:enterView={() => setVisible(2,2)}>
              <h2 class="!md:txs-fs-45 txs-fs-25 txs-w-106 !md:txs-w-160 font-bold absolute text-white text-left txs-left-30 txs-top-75 !md:txs-top-103 !md:txs-left-68">
                تجهیزات درمانــــی
              </h2>
              <h3 class="!md:txs-fs-20 txs-fs-10 txs-w-68 !md:txs-w-135 font-[200] tracking-[0.2em] text-left leading-[1.2] absolute text-white !md:txs-left-68 txs-left-30 txs-top-55 !md:txs-top-63">
                Medical Equipment
              </h3>
            </div>
          </div>
        <div class="!md:txs-w-554 w-full txs-h-182 txs-mt-30 !md:txs-mt-0 !md:txs-h-280 relative group overflow-hidden bg-primary cursor-pointer txs-rounded-45">
            <img static="ba85366c2de2524547c26c80f9cd6067" class="!md:txs-w-554 w-full txs-h-182 !md:txs-h-280  {visibilityMap.get(2)?'':'blur-xs'} transition-all group-hover:opacity-90 group-hover:blur-xs txs-rounded-45 duration-600 transform group-hover:scale-105 absolute" src={banner2} alt="تجهیزات خانگــــی">
            <div class="transition-all duration-200 {duration} {easing}
                          {visibilityMap.get(2)
                            ? 'opacity-100 translate-x-0 translate-y-0'
                            : `opacity-0 ${translateX} ${translateY}`
                          }"
                  use:inView={inViewOptions}
                  on:enterView={() => setVisible(2,2)}>
              <h2 class="!md:txs-fs-45 txs-fs-25 txs-w-106 !md:txs-w-160 font-bold absolute text-white text-left txs-left-30 txs-top-75 !md:txs-top-103 !md:txs-left-68">
                    تجهیزات خانگــــی
              </h2>
              <h3 class="!md:txs-fs-20 txs-fs-10 txs-w-68 !md:txs-w-135 font-[200] tracking-[0.2em] text-left leading-[1.2] absolute text-white !md:txs-left-68 txs-left-30 txs-top-55 !md:txs-top-63">
                    Homecare Equipment
              </h3>
            </div>
          </div>
    </div>
</div>