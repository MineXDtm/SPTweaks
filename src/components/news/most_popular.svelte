<svelte:options accessors />

<script lang="typescript">
    import browser from "webextension-polyfill";
    import PopularPost from "./popular_post.svelte";
    import { element } from "svelte/internal";
    var width = 434;
    var margin = 15;
    var max_size = width*5 +margin*5;
    var limit = max_size -width*2;
    var all_x = [0,0,0,0,0]
    var sideslided = "left"
    var selected = 2

    for (let index = 0; index < all_x.length; index++) {
        const element = all_x[index];
        all_x[index] += ((width+margin) * index)
    }
    all_x= [...all_x];
    var isSliding = false;
    function choosen(choosen_index){
        if(isSliding || choosen_index == selected)return;
   
        if(all_x[choosen_index] > max_size/2){
            sideslided = "right";
            selected +=1;
            if(selected >  4){
                selected = 0;
            }
            for (let index = 0; index < all_x.length; index++) {
               
                if ( all_x[index] == 0){
                    all_x[index] =  ((width+margin)*4)
                }
                else{
                    all_x[index] -= (width+margin)
                }
                
            }
        }
        else{
            sideslided = "left";
            selected -=1;
            if(selected <  0){
                selected = 4;
            }
            for (let index = 0; index < all_x.length; index++) {
                
                if ( all_x[index] > limit){
                    all_x[index] -=  ((width+margin)*4)
                }
                else{
                    all_x[index] += (width+margin)
                }
                
            }
        }
      
        all_x= [...all_x];
        isSliding = true;
        setTimeout(()=>{
            isSliding = false
        },600)
    }
</script>

<div class="spt-w-full  ">
    <p class="spt-text-[32px] spt-font-bold spt-text-white spt-m-2 spt-mb-[18px]">
        Самые Популярные
    </p>
    <div class="spt-h-[444px] spt-w-full spt-max-w-full spt-flex spt-grow-0  spt-justify-center spt-items-center spt-overflow-hidden " >
        <div class="spt-h-full spt-resize  spt-inline-flex spt-relative" style="width:{max_size+"px"}; min-width:{max_size+"px"}; ">
           <PopularPost left={all_x[0]} {limit} {sideslided} onclick={()=>{choosen(0)}} selected={selected==0} image={browser.runtime.getURL("src/assets/test_shit/test2.png")}/>
           <PopularPost left={all_x[1]} {limit} {sideslided} onclick={()=>{choosen(1)}} selected={selected==1} image={browser.runtime.getURL("src/assets/test_shit/test1.png")}/>
           <PopularPost left={all_x[2]} {limit} {sideslided} onclick={()=>{choosen(2)}} selected={selected==2} image={browser.runtime.getURL("src/assets/test_shit/test3.png")}/>
           <PopularPost left={all_x[3]} {limit} {sideslided} onclick={()=>{choosen(3)}} selected={selected==3} image={browser.runtime.getURL("src/assets/test_shit/test2.png")}/>
           <PopularPost left={all_x[4]} {limit} {sideslided} onclick={()=>{choosen(4)}} selected={selected==4} image={''}/>
        </div>
    
    </div>
    
</div>