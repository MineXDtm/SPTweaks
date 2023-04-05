<script lang="typescript">
    export let left = 0;
    export let selected = false;
</script>

<div class="tw-h-full tw-w-[472px] tw-flex tw-items-center tw-justify-center tw-absolute tw-transition-all" style="left: {left+"px"};">
    <div class=" tw-h-[249px] tw-w-full tw-rounded-[15px]  {selected? "tw-scale-150 tw-bg-red-100":"tw-scale-100 tw-bg-white"}">
            
    </div>
</div>