<svelte:options accessors />

<script lang="typescript">
    import PopularPost from "./popular_post.svelte";
    var margin = 15;
    var max_size = 472*5 +margin*5;
    var all_x = [0,0,0,0,0]

    for (let index = 0; index < all_x.length; index++) {
        const element = all_x[index];
        all_x[index] += ((472+margin) * index)
    }
    all_x= [...all_x]
    function next(){
            
        for (let index = 0; index < all_x.length; index++) {
      
            if ( all_x[index] > max_size-472){
                all_x[index] -=  ((472+margin)*4)
            }
            else{
                all_x[index] += (472+margin)
            }
            
        }
        all_x= [...all_x]
    }
</script>

<div class="tw-w-full tw-max-w-[992px]">
    <p class="tw-text-[24px] tw-font-bold tw-text-white tw-m-2 tw-mb-[18px]">
        Самые Популярные
    </p>
    <div class="tw-h-[333px] tw-w-full tw-max-w-full tw-flex tw-grow-0  tw-justify-center tw-items-center tw-overflow-hidden " >
        <div on:click={next} class="tw-h-full tw-resize  tw-inline-flex tw-relative" style="width:{max_size+"px"}; min-width:{max_size+"px"}; ">
           <PopularPost left={all_x[0]}/>
           <PopularPost left={all_x[1]}/>
           <PopularPost left={all_x[2]}/>
           <PopularPost left={all_x[3]}/>
           <PopularPost left={all_x[4]}/>
        </div>
    
    </div>
    
</div>