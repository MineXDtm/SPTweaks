<script>
    import browser from "webextension-polyfill";
</script>
<div class="spt-flex-col spt-space-y-[6px]">
    <div class="vote_button_main spt-bg-[#4D4DB1] spt-cursor-pointer ">
        <img alt="test" draggable="false" class="spt-select-none spt-h-[12px] spt-opacity-[0.45]" src="{browser.runtime.getURL("src/assets/icons/upvote_icon.svg")}" />
        <p class="spt-text-white spt-text-[14px] spt-w-full spt-text-center spt-font-semibold spt-select-none">999</p>
    </div>
    <div  class="vote_button_main spt-bg-[#3D3D3D] spt-cursor-pointer ">
        <img alt="test" draggable="false" class="spt-select-none spt-h-[12px] spt-opacity-[0.45]" src="{browser.runtime.getURL("src/assets/icons/downvote_icon.svg")}" />
        <p class="spt-text-white spt-text-[14px] spt-w-full spt-font-semibold  spt-text-center spt-select-none">7</p>
    </div>
</div>