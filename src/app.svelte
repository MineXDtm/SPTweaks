<script>
    import browser from "webextension-polyfill";
    import {getbuffer, setbuffer,http_spworlds } from "/src/stores/main.js";
    import {  currect_page,set_currect_page,local_history} from "/src/stores/categories.js";
    import LocalHistoryElement from "./components/app/local_history_element.svelte";
    import { each } from "svelte/internal";

 
    export var http_spworlds_= (url)=>{};
    export var setbuffer_ = (buffer_name,value)=>{};
    export var getbuffer_ = (buffer_name)=>{};
    getbuffer.set(getbuffer_);
    setbuffer.set(setbuffer_);
    http_spworlds.set(http_spworlds_);
    

   
    var content = null;
    var page_title = null;
 
    currect_page.subscribe(async value=>{
        if(value != null){
          
            content = value.module;
            content.page_title.subscribe(newtitle=>{
                page_title = newtitle;
            });
        }
        else{
            content = null;
        }
    
    })

    function handleHashChange() {
        const pageName = location.hash.slice(1);
      
        if($currect_page != null  && $currect_page.url == pageName)return;
        if(pageName == ""){
            window.location.hash = "posts";
            return;
        }
        set_currect_page(pageName);
    }
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

</script>

<div id="app" class="spt-w-screen spt-h-screen spt-absolute spt-pr-[50px] spt-pl-[50px] spt-pt-[25px] spt-pb-[25px]" style="background: conic-gradient(from 0deg at 50% 110.73%, #000000 -60deg, #050423 86.25deg, #000000 300deg, #050423 446.25deg);">
    <div id="main" class=" spt-flex spt-w-full spt-h-full spt-flex-col spt-space-y-[10px]  spt-items-center">
        <header class="spt-flex  spt-w-full spt-shrink-0 spt-grow-0 spt-h-[84px] spt-items-center spt-space-x-[10px]">
            <img draggable="false" width="200" height="50" src={browser.runtime.getURL("src/assets/logo/SPTweaks_full_name_white.svg")} alt="logo" class="spt-mr-[10px]">
            {#each $local_history as data}
                <LocalHistoryElement page_title={data.page_title} url={data.url}/>
            {/each}
            {#if content != null}
                <LocalHistoryElement {page_title} url={$currect_page.url}/>
            {/if}
        </header>
        <div id="content" class="spt-w-full spt-grow spt-overflow-y-auto spt-flex spt-justify-center " >
            
            
        </div>
        
    </div>
</div>
