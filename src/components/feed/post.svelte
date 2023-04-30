<svelte:options accessors={true} />
<script>
    export var main;
    export var test = false;
</script>
<div bind:this={main} class="spt-w-full spt-h-full spt-overflow-hidden spt-relative  spt-flex spt-justify-center spt-items-center">
    <div
        class="spt-absolute spt-select-none spt-grow-0 spt-shrink-0 spt-w-full spt-h-full  "
        style="background: conic-gradient(from 224.85deg at 75.71% 23.9%, #E7E7E7 -106.88deg, #EABDFF 31.88deg, #FFB0F2 153.75deg, #E7E7E7 253.13deg, #EABDFF 391.87deg);"
    />
    <div
    
        class="spt-absolute spt-select-none  spt-grow-0 spt-shrink-0 spt-w-full spt-h-full spt-backdrop-filter spt-backdrop-blur-[45px]   spt-bg-black/[0.15]"
    />
    <p class="spt-absolute spt-pointer-events-none   spt-select-none spt-w-[440px] spt-h-[390px] {test? 'spt-text-red-300' : 'spt-text-black'} spt-text-[18px] spt-font-semibold spt-flex spt-items-center spt-justify-center">
        Приглашаю вас на долгожданное торжество в честь открытия нового проекта Дом Искусств х ТФ Искусств!
        - Вечер чтения и музыки
        - Выставка артов
        =Ждём вас уже в эту пятницу, 24 марта, в 19:00!=
        =МЕСТО: СПАВН ПО КОВРИКАМ (Там где музей артов и Дом Искусств)=
        Заходите в дискорд, чтобы поучавствовать в ивенте!
        - https://discord.gg/czG3pJK8
    </p>
</div>