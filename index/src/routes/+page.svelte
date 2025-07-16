<script>
  import Header from "$lib/Header.svelte";
  import Slider from "$lib/Slider.svelte";
  import Features from "$lib/Features.svelte";
  import Banners from "$lib/Banners.svelte";
  import Banner from "$lib/Banner.svelte";
  import Footer from "$lib/Footer.svelte";
  import Banner2 from "$lib/Banner2.svelte";
  import Address from "$lib/Address.svelte";
  import Heading from "$lib/Heading.svelte";
  import QuadProducts from "$lib/QuadProducts.svelte";
  import QuadPosts from "$lib/QuadPosts.svelte";
  import "./app.css";
  import "../app.css";
  import tadarok from "$lib/images/2.png?w=1900&format=avif";
  import tadarok2 from "$lib/images/Group 100.png?w=1900&format=avif";


  let slides=[{
    name:'پزشک نمونه',
    role:'پزشک داروخانه',
    comment:'"فروشگاه داروخانه بهترین داروها و محصولات بهداشتی بدون نسخه من است. آنها طیف گسترده ای دارند و وب سایت آنها سفارش آنلاین را آسان می کند. تنها پیشرفتی که من پیشنهاد می کنم گسترش بخش زیبایی و مراقبت از پوست آنها است."',
    img:'https://tadarokteb.ir/wp-content/uploads/2025/05/image-16.png'
  },
  {
    name:'پزشک نمونه',
    role:'پزشک داروخانه',
    comment:'"فروشگاه داروخانه بهترین داروها و محصولات بهداشتی بدون نسخه من است. آنها طیف گسترده ای دارند و وب سایت آنها سفارش آنلاین را آسان می کند. تنها پیشرفتی که من پیشنهاد می کنم گسترش بخش زیبایی و مراقبت از پوست آنها است."',
    img:'https://tadarokteb.ir/wp-content/uploads/2025/05/image-16.png'
  },
  {
    name:'پزشک نمونه',
    role:'پزشک داروخانه',
    comment:'"فروشگاه داروخانه بهترین داروها و محصولات بهداشتی بدون نسخه من است. آنها طیف گسترده ای دارند و وب سایت آنها سفارش آنلاین را آسان می کند. تنها پیشرفتی که من پیشنهاد می کنم گسترش بخش زیبایی و مراقبت از پوست آنها است."',
    img:'https://tadarokteb.ir/wp-content/uploads/2025/05/image-16.png'
  }
]

  let myPostData={
    title:'sp_posts',
    data:[]
  }

  let myProductData={
    title:'special_products',
    data:[]
  }
  let myProductData2={
    title:'off_products',
    data:[]
  }
  let myProductData3={
    title:'darmani_products',
    data:[]
  }
  let myProductData4={
    title:'khanegi_products',
    data:[]
  }
  let myProductData5={
    title:'best_products',
    data:[]
  }
</script>

<div class="relative overflow-x-hidden bg-white" dir="rtl" page-id="home">
  <Header />
  <div class="w-full relative txs-h-540 !md:txs-h-632">
    <img static="3746d1c74d661fc30918287e8ce82bd1" src={tadarok} alt="" class="hidden md:block w-full object-cover txs-h-540 !md:txs-h-632" />
    <img static="f73b196ba8f5c33c0485b7cf155a4c1f" src={tadarok2} alt="" class="block md:hidden w-full object-cover w-full" />
    <div
      class="absolute !md:justify-start !md:txs-pl-10 justify-end txs-pl-10 !md:pr-txs-51 flex !md:txs-pr-51 items-center font-regular !md:txs-fs-12 txs-fs-9 !md:txs-top-196 txs-top-295 !md:txs-right-725 txs-right-44 !md:txs-w-166 txs-w-123 txs-h-21 bg-white txs-rounded-150 text-primary !md:txs-h-34"
    >
      <p>بیش از 200 نوع محصول</p>
    </div>
    <div
      class="absolute txs-top-284 txs-right-51 !md:txs-top-180 !md:txs-right-733 bg-secondary txs-rounded-150 txs-h-25 txs-w-25 !md:txs-h-39 !md:txs-w-39 flex items-center justify-center"
    >
      <svg
        class="txs-h-14 txs-w-8 !md:txs-h-21 !md:txs-w-18"
        viewBox="0 0 14 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.05 9.03467L3.5 6.98133V5.13333H2.8C2.61435 5.13333 2.4363 5.05607 2.30503 4.91854C2.17375 4.78102 2.1 4.59449 2.1 4.4V0.733333C2.1 0.538841 2.17375 0.352315 2.30503 0.214788C2.4363 0.0772617 2.61435 0 2.8 0H11.2C11.3857 0 11.5637 0.0772617 11.695 0.214788C11.8263 0.352315 11.9 0.538841 11.9 0.733333V4.4C11.9 4.59449 11.8263 4.78102 11.695 4.91854C11.5637 5.05607 11.3857 5.13333 11.2 5.13333H10.5V6.98133L12.95 9.03467C13.2774 9.3093 13.5418 9.65748 13.7235 10.0535C13.9052 10.4495 13.9997 10.8833 14 11.3227V19.8C14 20.3835 13.7788 20.9431 13.3849 21.3556C12.9911 21.7682 12.457 22 11.9 22H2.1C1.54305 22 1.0089 21.7682 0.615076 21.3556C0.22125 20.9431 0 20.3835 0 19.8V11.3227C0.00026226 10.8833 0.0947533 10.4495 0.276492 10.0535C0.458232 9.65748 0.722577 9.3093 1.05 9.03467ZM10.5 1.46667H9.1V2.56667H7.7V1.46667H6.3V2.56667H4.9V1.46667H3.5V3.66667H10.5V1.46667ZM4.9 5.13333V6.6H9.1V5.13333H4.9ZM12.075 10.1787L9.555 8.06667H4.445L1.925 10.1787C1.76129 10.316 1.62912 10.4901 1.53825 10.6881C1.44738 10.8861 1.40013 11.103 1.4 11.3227V12.4667H12.6V11.3227C12.5999 11.103 12.5526 10.8861 12.4618 10.6881C12.3709 10.4901 12.2387 10.316 12.075 10.1787ZM1.4 13.9333V17.6H12.6V13.9333H1.4ZM2.1 20.5333H11.9C12.0857 20.5333 12.2637 20.4561 12.395 20.3185C12.5263 20.181 12.6 19.9945 12.6 19.8V19.0667H1.4V19.8C1.4 19.9945 1.47375 20.181 1.60503 20.3185C1.7363 20.4561 1.91435 20.5333 2.1 20.5333Z"
          fill="white"
        />
        <path d="M3 15H11V17H3V15Z" fill="white" />
      </svg>
    </div>
    <div
      class="absolute !md:justify-start !md:txs-pl-10 justify-end txs-pl-10 !md:pr-txs-51 flex !md:txs-pr-51 items-center font-regular !md:txs-fs-12 txs-fs-9 !md:txs-top-419 txs-top-413 !md:txs-right-1013 txs-left-44 !md:txs-w-199 txs-w-144 txs-h-21 bg-white txs-rounded-150 text-primary !md:txs-h-34"
    >
      <p>بهترین کیفیت،بهترین خدمات</p>
    </div>
    <div
      class="absolute !md:txs-right-1018 txs-top-403 txs-right-236 bg-secondary txs-rounded-150 txs-h-25 txs-w-25 !md:txs-h-39 !md:txs-w-39 flex items-center justify-center"
    >
      <svg
        class="txs-h-14 txs-w-8 !md:txs-h-21 !md:txs-w-18"
        viewBox="0 0 21 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 9L8 15L19 2"
          stroke="white"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    </div>
    <h1 class="font-extrabold !md:txs-fs-48 txs-fs-30 !md:txs-w-398 txs-w-249 text-primary absolute !md:txs-top-230 txs-top-75 !md:txs-right-210 txs-right-85">شرکـت تدارک طب مـیـــــــلاد گــسـتــــــر</h1>
    <h2 class="font-regular txs-fs-10 !md:txs-fs-20 txs-py-10 !md:txs-py-7 txs-w-90 !md:txs-w-171 bg-secondary text-white absolute !md:txs-top-145 txs-top-28 text-center txs-rounded-150 txs-right-165 !md:txs-right-210">تجهیزات پزشکی</h2>
    <p editabletext="763e8b8185e223d135c29457d757b0a5" class="hidden md:block txs-fs-16 !md:txs-fs-16 txs-w-398 text-[#46466D]/50 txs-top-393 absolute txs-right-210">
      شرکت شرکت سهامی خاص تدارک طب میلاد گستر یک شرکت تجهیزات پزشکی با فعالیت توزیع کننده و مدیریت مسعود کرباسی در شهر مشهد می‌باشد.
    </p>
    <a href="https://tadarokteb.ir/about-us/" class="font-regular hover:bg-primary transition-color duration-300 cursor-pointer hover:text-white text-[#46466D]/50 !md:txs-fs-16 txs-fs-10 txs-py-7 border-[#46466D]/50 border-1 border txs-w-90 !md:txs-w-94 bg-surface absolute !md:txs-top-475 txs-top-180 txs-right-165 text-center txs-rounded-150 !md:txs-right-210">درباره ما</a>
    <div class="txs-top-272 absolute txs-right-752">
      <svg class="txs-h-268 txs-w-165" viewBox="0 0 165 268" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M127.208 1C153.223 36.5725 91 341.5 160.209 183.047C188.314 118.702 39.0556 263.459 1 266" stroke="#46466D" stroke-opacity="0.1" stroke-width="3" stroke-dasharray="10 10"/>
        </svg>
    </div>
    <div class="txs-top-139 absolute txs-left-145">
      <svg class="txs-h-295 txs-w-132 md:block hidden" viewBox="0 0 132 295" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M130.941 292.679C89.9382 276.525 -20.4989 -14.4321 5.72511 156.476C16.3743 225.879 65.1212 23.749 95.9233 1.2563" stroke="#46466D" stroke-opacity="0.1" stroke-width="3" stroke-dasharray="10 10"/>
        </svg>
    </div>
  </div>
  <Features />
  <Banners />
  <Heading link="https://tadarokteb.ir/shop/" text="محصولات ویژه" subText="جدیدترین و بروز ترین محصولات" />
  <QuadProducts
  cards={myProductData}
  repeater="special_products"
  data="products"
  sort="popularity"
  limit="4"
  sale="true"
  mojood="true"
  fields='["image", "regular_price", "sale_price", "brand", "name", "permalink"]'
/>
  <Heading link="https://tadarokteb.ir/shop/" text="جدید ترین محصولات" subText="محصولات درمانی با به صرفه ترین قیمت" />
  <QuadProducts
  cards={myProductData}
  repeater="off_products"
  data="products"
  sort="popularity"
  limit="4"
  sale="true"
  mojood="true"
  fields='["image", "regular_price", "sale_price", "brand", "name", "permalink"]'
/>
  <Banner />
  <Heading text="محصولات درمانی" subText="مورد نیاز هر داروخانه" />
  <QuadProducts
  cards={myProductData}
  repeater="darmani_products"
  data="products"
  sort="popularity"
  limit="4"
  sale="true"
  mojood="true"
  fields='["image", "regular_price", "sale_price", "brand", "name", "permalink"]'
/>
  <Heading text="محصولات خانگی" subText="برای مراقبت از دلبندانتان" />
  <QuadProducts
  cards={myProductData}
  repeater="khanegi_products"
  data="products"
  sort="popularity"
  limit="4"
  sale="true"
  mojood="true"
  fields='["image", "regular_price", "sale_price", "brand", "name", "permalink"]'
/>
  <Heading showHead="false" text="چرا تدارک طب؟" subText="با ما بیشتر آشنا شوید" />
  <Address />
  <Heading text="بهترین محصولات" subText="با بیشترین نمره" />
  <QuadProducts
  cards={myProductData}
  repeater="best_products"
  data="products"
  sort="popularity"
  limit="4"
  sale="true"
  mojood="true"
  fields='["image", "regular_price", "sale_price", "brand", "name", "permalink"]'
/>
  <Banner2 />


  <Heading text="مقالات" subText="انواع مطالب خواندنی" />
  <QuadPosts
  cards={myPostData}
  repeater="sp_posts"
  data="posts"
  sort="popularity"
  limit="4"
  fields='["image", "name", "permalink"]'
/>
  <div class="!md:txs-mb-100 txs-mb-40">
    <Heading showHead="false" text="انتقادات و پیشنهادات" subText="نظرات شما عزیزان" />
    <Slider images={slides} />
  </div>
<Footer />
</div>

