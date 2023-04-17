<script>
    import browser from "webextension-polyfill";
    import MostPopular from "./components/feed/most_popular.svelte";
    document.title = "СП Домашняя Страница";
    window.location.hash = "home";
</script>

<div id="app" class="spt-w-screen spt-h-screen spt-absolute spt-pr-[10%] spt-pl-[10%] spt-pt-[30px] spt-pb-[30px]" style="background: conic-gradient(from 0deg at 50% 110.73%, #E6E6E6 -60deg, #FFFFFF 86.25deg, #E6E6E6 300deg, #FFFFFF 446.25deg);">
    <div id="main" class=" spt-flex spt-w-full spt-h-full spt-flex-col">
        <header class="spt-flex spt-h-[70px] spt-items-center">
            <img draggable="false" width="200" height="50" src={browser.runtime.getURL("src/assets/icons/SPTweaks_full_name.svg")} alt="logo" class="spt-mr-[10px]">
      
        </header>
        <div id="content" class="spt-flex spt-flex-col spt-flex-grow spt-pl-[25px] spt-pr-[25px] spt-pb-[10px] spt-pt-[10px]  " >
             <MostPopular/>
        </div>
    </div>
</div>