window.onload = function () {
    let c = {'СТ.АР':'64', 'ШК.АР':'1728', 'АР':'1'};
    let val = document.getElementById('val'); 
    let currency1 = document.getElementById('cur1'); 
    let currency2 = document.getElementById('cur2'); 
    let result = document.getElementsByClassName('convert_result')[0]; 
    
    result.innerHTML = '0';


    function summ() { // Делаем функцию
        let z = 0;
        if(currency1.value === currency2.value){ 
            result.innerText = val.value; 
            if(val.value === ''){
                result.innerText = '0';
            }
        } else {
            if(currency1.value != 'RUB'){ 
                z = val.value*c[currency1.value]; 
                result.innerHTML = Math.ceil((z/c[currency2.value])*100)/100; 
            } else { // Если не равны
                result.innerHTML = Math.ceil((val.value*c[currency2.value])*100)/100; 
            }
        }
    }
    val.oninput = function () { 
        summ();
    };
    currency1.onchange = function () { 
        summ();
    };
    currency2.onchange = function () { 
        summ();
    }
}

