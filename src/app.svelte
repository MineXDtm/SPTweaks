<script>
    import browser from "webextension-polyfill";
    document.title = "СП Домашняя Страница";
    window.location.hash = "home";
</script>

<div id="app" class="spt-w-screen spt-h-screen spt-absolute spt-pr-[10%] spt-pl-[10%] spt-pt-[30px] spt-pb-[30px]" style="background: conic-gradient(from 0deg at 50% 110.73%, #E6E6E6 -60deg, #FFFFFF 86.25deg, #E6E6E6 300deg, #FFFFFF 446.25deg);">
    <div id="main" class=" spt-flex spt-w-full spt-h-full spt-flex-col">
        <header class="spt-flex spt-h-[70px] spt-items-center">
            <img draggable="false" src={browser.runtime.getURL("src/assets/icons/logo_dynamic.png")} alt="logo">
        </header>
        <div id="content" class="spt-flex spt-flex-col spt-flex-grow spt-pl-[100px] spt-pr-[100px] spt-pb-[50px] spt-pt-[50px]  " >
            <p class="spt-text-[36px] spt-h-auto spt-font-bold">Добро Пожаловать, Andreu333XD!</p>
            <div class="spt-flex spt-flex-grow">
                <div id="left" class="spt-flex spt-grow">

                </div>
                <div id="right" class="spt-w-[500px]">

                </div>
            </div>
        </div>
    </div>
</div>