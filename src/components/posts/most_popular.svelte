<script> 
 
    import browser, { action } from "webextension-polyfill";

    import { isdragging } from '/src/stores/main.js';
    import PopularPost from "./popular_post.svelte";

 
    export var posts = [];
    $:console.log(posts)
    let startX = 0;
    let startScrollLeft = 0;
    let lastScrollLeft = 0;
    let speed = 0;
    let rafId = null;
    var scollable = undefined;
    
    var ismoved = false;

    function handleMouseDown(event) {
        startX = event.clientX;
        startScrollLeft = scollable.scrollLeft;
        document.getSelection().removeAllRanges();
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp); 
    }

    function handleMouseMove(event) {
        const dx = event.clientX - startX;
        document.body.classList.add("isdragging");
    
        isdragging.set(true);
        scollable.scrollLeft = startScrollLeft - dx;
        ismoved = true;
        // Рассчитываем скорость перемещения мыши
        speed = dx - lastScrollLeft;
        lastScrollLeft = dx;
    }

    function handleMouseUp() {
   
        document.body.classList.remove("isdragging");
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        isdragging.set(false);
       
        if (!rafId && ismoved) {
            rafId = requestAnimationFrame(scrollWithSpeed);
            ismoved =false;
        }
    }

    function scrollWithSpeed() {
        if($isdragging){
            rafId = undefined;
            speed = 0;
            return;
        };
        const speedFactor = Math.min(Math.abs(speed), 5);
        scollable.scrollLeft -= speed * speedFactor;

        // Останавливаем скроллирование, когда скорость падает до нуля
        if (Math.abs(speed) > 1) {
            speed *= 0.95;
            rafId = requestAnimationFrame(scrollWithSpeed);
        } else {
            rafId = null;
        }
    }
    
</script>



<div class="spt-relative spt-flex spt-flex-col spt-shrink-0    spt-pr-[25px] spt-pl-[25px]   "  on:mousedown={handleMouseDown} >
    <p class="spt-text-[32px] spt-font-bold">Популярные</p>
    <div class="spt-w-full  spt-h-full spt-absolute spt-top-0 spt-left-0  spt-rounded-[15px]"  />
    <div
        bind:this={scollable}
 
        class="spt-inline-flex spt-overflow-hidden spt-space-x-[25px] spt-w-full spt-grow spt-pr-[15px] spt-pl-[15px] spt-pt-[25px] spt-pb-[25px]"
    >
        {#each posts as post}
            {#if post.account != undefined}
                <PopularPost
                    {post}
                />
            {/if}
        {/each}  
    </div>
</div>
