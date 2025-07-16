<script>
    export let cards = [];
    export let data;
    export let fields;
    export let sort;
    export let repeater;
    export let category;
    function preventImageDrag(event) {
      event.preventDefault();
    }
  
  </script>
  
  <!-- <div 
  {repeater}
  {data}
  {fields}
  limit="15"
  {sort}
  {category} -->
  <div
  class="flex justify-center bg-[#F8F8F8]  txs-mb-100">
    <div class="md:flex grid grid-cols-2 !md:txs-w-1138 txs-w-360 overflow-hidden items-center">
        {#each cards.data as card}
          <div class="txs-ml-16 relative !md:txs-ml-28 !md:txs-w-262 txs-w-141 txs-h-291 !md:txs-h-455 flex-shrink-0">
            <div
              class="group bg-[#F8F8F8] !md:txs-px-25 txs-px-0 transition duration-300 !md:txs-pt-0 txs-pt-12 easeout hover:-translate-y-4 txs-rounded-45 flex flex-col txs-h-191 !md:txs-h-455 items-center w-full"
              style="border-color: rgba(8, 8, 8, 0.1)!important;"
            >
              <div class="!md:txs-w-262 txs-w-170 txs-p-18 w-full txs-h-116 !md:txs-h-222">
                <img static="c03094935c47b2a3a4059ba4ca7c6b75"
                  class="!md:txs-w-262 txs-w-170 txs-rounded-23 w-full txs-h-116 !md:txs-h-222 object-cover"
                  src={card.image}
                  alt={card.title}
                  on:dragstart={preventImageDrag}
                />
              </div>
              <div class="card-body w-full !md:txs-pt-30 txs-pt-15">
                
                <p editabletext="122900f8497525c23f487e8475d72e72"
                  class="card-titl cursor-pointer txs-h-64 text-right group-hover:text-secondary transition-color duration-300 text-primary txs-fs-8 !md:txs-fs-16 font-semibold txs-py-10"
                >
                  <a editablelink="5c68a95249f6176da07df8952cfc758b" href={card.permalink} class="">{card.name}</a>
                </p>
                <p editabletext="1a4c423a0a082fa4a00166b24263960b"
                class="card-titl text-right txs-fs-8 !md:txs-fs-14 font-regular"
              >
                {card.excerpt ? card.excerpt : ""}
              </p>
              <button class="rounded-full border cursor-pointer border-[#FF6C2B] hover:bg-secondary transition-all duration-300 hover:text-white txs-w-50 txs-fs-10 text-secondary txs-h-19">
                پزشکی
              </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
  </div>