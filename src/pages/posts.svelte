<svelte:options accessors={true}/>
<script>
    import { writable } from 'svelte/store';

    import browser from "webextension-polyfill";
    document.title = "СП Посты";
    import {getbuffer, setbuffer ,http_spworlds} from "/src/stores/main.js"

    import MostPopular from "../components/posts/most_popular.svelte";
    import NewsSubcategory from "../components/posts/news_subcategory.svelte";
    import { onMount } from "svelte";
    import SearchBar from "../components/actions/search_bar.svelte";


    export var page_title = writable("Посты");
    export var save_properties = {};

    var popular_posts = [];
    var new_posts = [];
 
    onMount(async () => {
      
        var buffer_popular = await $getbuffer("popular_posts");
        var buffer_new = await $getbuffer("new_posts");

        if (buffer_popular == undefined) {
            var request_popular_posts = await $http_spworlds(
                "https://spworlds.ru/api/sp/posts?sort=popular&source=all&p=1"
            );
            if (request_popular_posts == undefined) return;
            popular_posts = request_popular_posts;
            $setbuffer("popular_posts", request_popular_posts);
        } else {
            popular_posts = buffer_popular;
        }
        if (buffer_new == undefined) {
            var request_new_posts = await $http_spworlds(
                "https://spworlds.ru/api/sp/posts?sort=new&source=all&p=1"
            );
            if (request_new_posts == undefined) return;

            new_posts = request_new_posts;
            $setbuffer("new_posts", request_new_posts);
        } else {
            new_posts = buffer_new;
        }
    });
</script>
<div  class="spt-w-full spt-flex spt-space-y-[50px] spt-flex-col spt-pl-[80px] spt-pr-[80px] spt-pb-[10px] spt-pt-[10px]  spt-rounded-[15px]">
    <div  class="spt-w-full spt-h-[50px] spt-shrink-0 spt-flex spt-flex-row spt-pr-[25px] spt-pl-[25px] spt-space-x-[15px] ">
        <SearchBar/>
    </div>
    <MostPopular posts={popular_posts}/>
    <NewsSubcategory posts={new_posts} name="Новые"/>
</div>