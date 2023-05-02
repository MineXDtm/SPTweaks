<svelte:options accessors={true} />
<script>
    export var main;
    export var next = false;
    export var content = "абема";
    export var minecraftuuid = "";
    export var nickname = "test";
</script>
<div bind:this={main} class="spt-w-full spt-h-full spt-overflow-hidden spt-relative  spt-flex spt-justify-center spt-items-center">
    <div
        class="spt-absolute spt-select-none spt-grow-0 spt-shrink-0 spt-w-[120%] spt-h-[120%] spt-blur-[45px] "
        style="background: conic-gradient(from 224.85deg at 75.71% 23.9%, #E7E7E7 -106.88deg, #EABDFF 31.88deg, #FFB0F2 153.75deg, #E7E7E7 253.13deg, #EABDFF 391.87deg);"
    />
    <div
    
        class="spt-absolute spt-select-none  spt-grow-0 spt-shrink-0 spt-w-full spt-h-full   spt-bg-black/[0.15]"
    />
    <p class="spt-absolute spt-pointer-events-none   spt-select-none spt-w-[440px] spt-h-[390px] spt-text-black spt-transition-opacity spt-duration-200 {next? 'spt-opacity-25' : 'spt-opacity-100'} spt-text-[18px] spt-font-semibold spt-flex spt-items-center spt-justify-center">
        {content}
    </p>
    <div class="spt-absolute spt-w-full spt-h-full spt-flex spt-flex-row spt-space-x-[10px] spt-pr-[15px] spt-pl-[15px] spt-pb-[15px] spt-pt-[15px]  ">
        <div class="spt-flex-grow spt-flex spt-flex-row spt-space-x-[10px] spt-h-[45px]">
            <div class="spt-bg-black spt-rounded-[15px] spt-w-fit  spt-h-full spt-space-x-[15px] spt-pr-[15px] spt-pl-[15px] spt-flex spt-items-center">
                <img
                draggable="false"
                class="spt-rounded-[12px] spt-select-none"
                src="https://visage.surgeplay.com/face/80/{minecraftuuid}.png"
                height="30"
                width="30"
                />
                <p class="spt-text-[14px] spt-font-bold">{nickname}</p>
            </div>
            <div class="spt-max-w-[460px] spt-flex spt-flex-row spt-items-center spt-w-fit spt-h-full spt-rounded-[15px] spt-bg-black spt-space-x-[15px] spt-pt-[10px] spt-pb-[10px]  spt-pr-[25px] spt-pl-[25px]">
                <div class="spt-flex-grow spt-h-full spt-overflow-hidden">
                    <p class="spt-text-[16px] spt-font-semibold ">{content}</p>
                </div>
                <svg class="" width="17" height="17" viewBox="0 0 17 18" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5 2.52158C5 1.61599 6.10754 1.17677 6.7282 1.83621L12.355 7.81464C12.7174 8.19969 12.7174 8.80031 12.355 9.18536L6.7282 15.1638C6.10754 15.8232 5 15.384 5 14.4784V2.52158Z" fill="white"/>
                </svg>
            </div>
           
        </div>
        <div class="spt-bg-black spt-rounded-[15px] spt-h-fit spt-h-fit spt-space-x-[15px] spt-pr-[10px] spt-pl-[10px] spt-pt-[15px] spt-pb-[15px] spt-flex spt-items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="15" viewBox="0 0 9 15" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.5 13.4784C8.5 14.384 7.39246 14.8232 6.7718 14.1638L1.14505 8.18536C0.782649 7.80031 0.78265 7.19968 1.14505 6.81463L6.7718 0.836213C7.39246 0.176765 8.5 0.615992 8.5 1.52158L8.5 13.4784Z" fill="white"/>
            </svg>
        </div>
    </div>
</div>