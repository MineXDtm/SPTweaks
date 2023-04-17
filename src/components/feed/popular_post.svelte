<script lang="typescript">
    export let left = 0;
    export let limit = 0;
    export let selected = false;
    export let image = "";
</script>

<div class="spt-h-[357px] spt-w-[434px] spt-flex spt-items-center spt-justify-center spt-absolute {left == 0? '' : 'spt-transition-all spt-duration-500'}" style="left: {left+"px"};">
    <div class=" spt-absolute spt-transition-all spt-duration-300 spt-rounded-[15px] spt-shadow-md {selected? "spt-z-10 spt-w-[651px]  spt-h-full" : "spt-w-full spt-h-[253px] spt-z-0  "}" style="background: conic-gradient(from 224.85deg at 75.71% 23.9%, #E7E7E7 -106.88deg, #EABDFF 31.88deg, #FFB0F2 153.75deg, #E7E7E7 253.13deg, #EABDFF 391.87deg);">
           <img class="spt-w-full spt-h-full spt-rounded-[15px] spt-object-cover spt-shadow-md" draggable="false" src={image}>  
    </div>
</div>  