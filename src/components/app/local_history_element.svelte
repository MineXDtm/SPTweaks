
<script>
    import { currect_page, set_currect_page,local_history} from "/src/stores/categories.js";
    export var page_title = "абеме";
    export var url = "posts";
    var currect = false;
    $: currect = $currect_page.url == url

    
</script>
<div on:click={()=>{if(currect)return; set_currect_page(url)}} class="spt-h-[64px] {currect? '' :'spt-cursor-pointer' } spt-w-fit spt-flex spt-items-center spt-space-x-[10px]">
    <div class="spt-rounded-xl spt-bg-[#BABABA] {currect? '' :' spt-opacity-[0.45]' } spt-w-[10px] spt-h-[10px]"/>

        <p class="spt-select-none spt-text-[20px] spt-font-bold">{page_title}</p>
    
</div>