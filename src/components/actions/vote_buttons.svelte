<script>
    import browser from "webextension-polyfill";
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
 
    import { isdragging } from '/src/stores/main.js';
    
    function downvote(){
        if(!can_vote)return;
        if(vote == -1){
            vote =0;
            downvotes -= 1;
            reset_animation();
        }
        else{
            if(vote == 1){
                upvotes -=1;
              
            }
            vote=-1;
            downvotes += 1;
            animatedownvote();
        }
      
    }
    function upvote(){
        if(!can_vote)return;
        if(vote == 1){
            vote =0;
            upvotes -= 1;
            reset_animation();
        }
        else{
            if(vote == -1){
                downvotes -=1;
            }
            vote=1;
            upvotes += 1;
            animateupvote();
        }
     
    }
    
    export var vote = 0;
    export var downvotes = 7;
    export var upvotes = 25;
    export var can_vote = false;

    var reset_upvote_c = -1;
    var reset_downvote_c = -1;

    function reset_animation(){
        clearTimeout(reset_upvote_c);
        clearTimeout(reset_downvote_c);
        y_upvote.set(0, { duration: 0 });
        y_downvote.set(0, { duration: 0 });
    }


    const scale_upvote = tweened(1, {
        duration: 500,
        easing: cubicOut,
    });
    const y_upvote = tweened(0, {
        duration: 300,
        easing: cubicOut,
    });
    function animateupvote() {
        reset_animation();
        y_upvote.set(-150);

        reset_upvote_c = setTimeout(()=>{ scale_upvote.set(0, { duration: 0 });  y_upvote.set(0, { duration: 0 });  scale_upvote.set(1);},1000);
    }
    
    const scale_downvote = tweened(1, {
        duration: 500,
        easing: cubicOut,
    });
    const y_downvote = tweened(0, {
        duration: 300,
        easing: cubicOut,
    });
    function animatedownvote() {
        reset_animation();
        y_downvote.set(150);
        reset_downvote_c = setTimeout(()=>{  scale_downvote.set(0, { duration: 0 }); y_downvote.set(0, { duration: 0 }); scale_downvote.set(1);},1000);
    }
    isdragging.subscribe(value => {
        setTimeout(
            ()=>{can_vote = !$isdragging},100
        )

    });

</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="spt-opacity-40 spt-h-fit {$isdragging? '':'hover:spt-opacity-100'}  spt-transition-opacity spt-flex-col  spt-bg-black/[0.45] spt-rounded-[15px] spt-pr-[5px] spt-pb-[5px] spt-pt-[5px] spt-pl-[5px]">

    <div on:click={upvote} class="spt-group spt-rounded-t-[10px]  spt-w-[78px] spt-h-[28px]  spt-pl-[9px] spt-pr-[9px] spt-flex spt-justify-center spt-items-center spt-space-x-[7px] spt-transition-colors {vote == 1? 'spt-bg-white': 'spt-bg-black/60 hover:spt-bg-[#878787]/60 '} spt-cursor-pointer ">
        
        <svg   class="spt-h-[12px] spt-w-[18px] spt-shrink-0   spt-transition-transform spt-duration-300 spt-ease-in-out group-hover:spt-scale-150" width="156" height="104" viewBox="0 0 156 104" fill="none">
            <path transform="translate(0, {$y_upvote}) scale({$scale_upvote})"  fill-rule="evenodd" clip-rule="evenodd" d="M63.173 6.7951C71.7484 -2.26503 85.9635 -2.26503 94.5389 6.7951L150.712 66.1437C158.904 74.7985 158.904 88.5501 150.712 97.2049C142.137 106.265 127.922 106.265 119.346 97.2049L78.8559 54.4258L38.3657 97.2049C29.7903 106.265 15.5752 106.265 6.99977 97.2049C-1.19198 88.5501 -1.19198 74.7985 6.99977 66.1437L63.173 6.7951Z" fill="{vote == 1? '#2C2C2C': '#D9D9D9'}" opacity="{vote == 1? 1: 0.45}"/>
        </svg>
        <p class="{vote == 1? 'spt-text-black': 'spt-text-white'}  spt-text-[14px] spt-w-full  spt-text-center spt-font-semibold spt-select-none">{upvotes}</p>
    </div>
    <div on:click={downvote}   class="spt-group spt-rounded-b-[10px]  spt-w-[78px] spt-h-[28px]  spt-pl-[9px] spt-pr-[9px] spt-flex spt-justify-center spt-items-center spt-space-x-[7px] spt-transition-colors {vote == -1? 'spt-bg-white': 'spt-bg-black/60 hover:spt-bg-[#878787]/60'}  spt-cursor-pointer ">
            
        <svg   class="spt-h-[12px] spt-w-[18px] spt-shrink-0   spt-transition-transform spt-duration-300 spt-ease-in-out group-hover:spt-scale-150" width="156" height="104" viewBox="0 0 156 104" fill="none">
            <path transform="translate(0, {$y_downvote}) scale({$scale_downvote})" fill-rule="evenodd" clip-rule="evenodd" d="M93.683 97.2049C85.1076 106.265 70.8924 106.265 62.317 97.2049L6.14381 37.8563C-2.04793 29.2015 -2.04793 15.4499 6.14381 6.7951C14.7192 -2.26503 28.9343 -2.26503 37.5097 6.7951L78 49.5742L118.49 6.79511C127.066 -2.26502 141.281 -2.26502 149.856 6.79511C158.048 15.4499 158.048 29.2015 149.856 37.8564L93.683 97.2049Z" fill="{vote == -1? '#2C2C2C': '#D9D9D9'}" opacity="{vote == -1? 1: 0.45}"/>
        </svg>
        <p class="{vote == -1? 'spt-text-black': 'spt-text-white'} spt-text-[14px] spt-w-full spt-font-semibold  spt-text-center spt-select-none">{downvotes}</p>
    </div>
</div>