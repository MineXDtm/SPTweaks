<script>
    import browser from "webextension-polyfill";
    import MostPopular from "./components/news/most_popular.svelte";
    import NewsSubcategory from "./components/news/news_subcategory.svelte";
    import { onMount } from 'svelte';

    var popular_posts = [];
    var new_posts = [];

    export var http_spworlds= (url)=>{};
    export var setbuffer= (buffer_name,value)=>{};
    export var getbuffer= (buffer_name)=>{};

    document.title = "СП Новости";
    window.location.hash = "news";

    onMount(async ()=>{
        return;
        var buffer_popular = await getbuffer("popular_posts");
        var buffer_new = await getbuffer("new_posts");
        
        if(buffer_popular == undefined){
            var request_popular_posts = await http_spworlds('https://spworlds.ru/api/sp/posts?sort=popular&source=all&p=1');
            if(request_popular_posts == undefined)return;
            popular_posts = request_popular_posts;
            setbuffer("popular_posts",request_popular_posts);
        }
        else{popular_posts= buffer_popular}
        if(buffer_new == undefined){
            var request_new_posts = await http_spworlds('https://spworlds.ru/api/sp/posts?sort=new&source=all&p=1')
            if(request_new_posts == undefined)return;
        
            new_posts = request_new_posts;
            setbuffer("new_posts",request_new_posts);
        }
        else{new_posts= buffer_new}
        


    })
    
</script>

<div id="app" class="spt-w-screen spt-h-screen spt-absolute spt-pr-[50px] spt-pl-[50px] spt-pt-[30px] spt-pb-[30px]" style="background: conic-gradient(from 0deg at 50% 110.73%, #000000 -60deg, #050423 86.25deg, #000000 300deg, #050423 446.25deg);">
    <div id="main" class=" spt-flex spt-w-full spt-h-full spt-flex-col spt-space-y-[20px]  spt-items-center">
        <header class="spt-flex spt-w-full spt-grow-0 spt-h-[70px] spt-items-center">
            <img draggable="false" width="200" height="50" src={browser.runtime.getURL("src/assets/logo/SPTweaks_full_name_white.svg")} alt="logo" class="spt-mr-[10px]">
      
        </header>
        <div id="content" class="spt-w-full spt-flex spt-space-y-[50px] spt-flex-col spt-overflow-y-auto spt-flex-grow spt-pl-[80px] spt-pr-[80px] spt-pb-[10px] spt-pt-[10px]  spt-rounded-[15px]" >
             
            <MostPopular posts={popular_posts}/>
            <div class="spt-w-full spt-h-[50px] spt-shrink-0 spt-flex spt-flex-row ">
                <input placeholder="Поиск в последних постах..." class="spt-w-[400px] spt-h-full spt-bg-white/10 spt-flex spt-items-center spt-rounded-[15px] spt-pr-[25px] spt-pl-[25px] spt-pt-[5px] spt-pb-[5px] placeholder:spt-text-white/25 focus:spt-outline-none" />
                   
             </div>
            <NewsSubcategory posts={new_posts} name="Новые"/>
        </div>
        <div class="spt-flex spt-space-x-2">
            <p class="spt-text-[16px] spt-text-white/20">
                для навигации
            </p>
        </div>
    </div>
</div>
