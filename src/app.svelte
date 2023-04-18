<script>
    import browser from "webextension-polyfill";
    import MostPopular from "./components/news/most_popular.svelte";
    document.title = "СП Новости";
    window.location.hash = "news";
</script>

<div id="app" class="spt-w-screen spt-h-screen spt-absolute spt-pr-[50px] spt-pl-[50px] spt-pt-[30px] spt-pb-[30px]" style="background: conic-gradient(from 0deg at 50% 110.73%, #000000 -60deg, #050423 86.25deg, #000000 300deg, #050423 446.25deg);">
    <div id="main" class=" spt-flex spt-w-full spt-h-full spt-flex-col spt-space-y-[20px]">
        <header class="spt-flex spt-h-[70px] spt-items-center">
            <img draggable="false" width="200" height="50" src={browser.runtime.getURL("src/assets/logo/SPTweaks_full_name_white.svg")} alt="logo" class="spt-mr-[10px]">
      
        </header>
        <div id="content" class="spt-flex spt-flex-col spt-flex-grow spt-pl-[80px] spt-pr-[80px] spt-pb-[10px] spt-pt-[10px]  " >
             <MostPopular/>
        </div>
    </div>
</div>