let repository = {}
//массив для хранения соответсвия картинки и числа на ней(если все картинки расположить по порядку)
let numbers = []

const commonPath = "alph/";
//ДЛЯ ЦИФР
//const picturePAth = ["Arial/", "Century Gothic/", "Courier New Cyr/", "Goudy Old Style/", "Times New Roman/","custom1/","custom2/","custom3/","custom4/","custom5/"];
//const picturePAth = ["custom1/","custom2/","custom3/","custom4/","custom5/"];

//ДЛЯ БУКВ

const picturePAth = ["custom1/","custom2/","custom3/","custom4/","custom5/","custom6/","custom7/","custom8/","custom9/","custom10/","mini1/","mini2/","mini3/","mini4/","mini5/"];

let imageCount;
const imageCountInFolder = 3;
const bpm = ".BMP";

//FIXME уменьшить толщину пера, подключить доп картинки,уменьшить размер канвы
//FIXME показать захару примеры async await,функциональщины - фильтр мап и обход массива, let сказать чтобы юзал везде и в циклах обяз

/**
 * инициализация всех массивов с картинками
 */
function initAllArrays() {
    imageCount = picturePAth.length * imageCountInFolder;
    let imageIndex = 0;
    console.log("Разрешение выборки = ", imageCount);
    for (let i = 0; i <= picturePAth.length - 1; i++) {
        for (let j = 1; j <= imageCountInFolder; j++) {
            let localImageIndex = imageIndex; //чтоб не было замыкания и успешно передалось в колбек
            numbers[localImageIndex] = j
            // Загружаем файл изображения
            let img = new Image();
            img.onload = function () {
                ctx.drawImage(img, 0, 0, img.width, img.height);
                //  console.log("async" + localImageIndex);
                // FIXME вся проблема тут,код асинхронный - сначала прогоняются все картинки и ток потом вызывается колбек для последней
                repository['array' + localImageIndex] = saveImageToPixelsArray(true);
                //    console.log(commonPath + picturePAth[i] + j + bpm)
                //  console.log(repository.array0.length);
                // console.log("Array ",i);
                //   console.log(repository['array' + i]);
                erase();
            };
            img.src = commonPath + picturePAth[i] + j + bpm;
            imageIndex++; //FIXME полюбас будет замыкание хз как разобратся с этим
        }
    }
}

/**
 * сохраняем картинку в массив микселей
 */
function saveImageToPixelsArray(reverse) {

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    let pixelsArray = [];

    if (reverse) {
        console.log("true");
        // iterate over all pixels
        // console.log("saveImageToPixelsArray " + data.length)
        for (let i = 0, n = data.length; i < n; i += 1) {
            pixelsArray[i] = data[i];
            if (pixelsArray[i] != 255  && pixelsArray[i] != 0) {
                //console.log(pixelsArray[i])
                pixelsArray[i] = 0
            }
            //if (pixelsArray[i] != 0) console.log(pixelsArray[i]) // КОДЫ разные все - нетолько альфа но и рбг
        }

    }
    else {
        // iterate over all pixels
        // console.log("saveImageToPixelsArray " + data.length)
        for (let i = 0, n = data.length; i < n; i += 1) {
            pixelsArray[i] = data[i];
            if (pixelsArray[i] != 255  && pixelsArray[i] != 0) {
                //console.log(pixelsArray[i])
                pixelsArray[i] = 0
            }
            //if (pixelsArray[i] != 0) console.log(pixelsArray[i]) // КОДЫ разные все - нетолько альфа но и рбг
        }
        for (let i = 0, n = pixelsArray.length; i < n; i += 4) {
            if (pixelsArray[i] == 0 && pixelsArray[i + 1] == 0 && pixelsArray[i + 2] == 0 && pixelsArray[i + 3] == 0) {
                pixelsArray[i] = 255;
                pixelsArray[i + 1] = 255;
                pixelsArray[i + 2] = 255;
                pixelsArray[i + 3] = 255;
            }
        }
        
    }
    //console.log(pixelsArray)
    return pixelsArray;
}


/**
 * рассчитываем расстояние по Хэммингу
 * @param userArray - пользовательский рисунок
 * @param targetArray - эталонный
 * @returns {number}
 */
function compare(userArray, targetArray) {
    let count = 0;
    let countj = 0;
    for (let i = 0; i + 4 <= userArray.length; i++) {
        countj = 0;
        for (let j = i; j <= i + 4; j++) {
            if (userArray[j] != targetArray[j]) countj++;
        }
        if (countj == 4)
            count++;
        //FIXME возможно считать не так ,каждый пиксель - 4 элемента, вот походу надо по 4 сравнивать и если из них хоть 1 несовпадает то пиксель не равен
    }
    //console.log(count)
    return count;
}

/**
 * рассчет потенциала
 * @param userArray
 */
function calculateFuckingShit(userArray) {

    // массив потенциалов
    let pArray = [];

    for (let i = 0; i <= 9; i++) {
        pArray[i] = 0;
    }

    for (let i = 0; i <= imageCount - 1; i++) {
        let digit = numbers[i];
        let r = compare(userArray, repository['array' + i]);
        // console.log("r " + r  + " " + i);
        if (r == 0) {
            let  temp = 1000000 / (1 + r * r)
            if (pArray[digit] < temp) pArray[digit] = temp

            //pArray[digit] = pArray[digit] + 1000000 / (1 + r * r);
             // console.log("pArray[digit] " + pArray[digit]);
        }
        else {
            let  temp = 1000000 / (1 + r * r)
            if (pArray[digit] < temp) pArray[digit] = temp

            //pArray[digit] = pArray[digit] + 1000000 / (r * r);
            // console.log("pArray[digit] " + pArray[digit]);
        }
    }

    //console.log(pArray);

    /*
        // Сортирую массив по убыванию, чтобы взять три максимальных значения
        pArray.sort(function(a, b){
            return b - a;
        });
       // console.log(pArray);
        console.log("MAX NUMBER: ", maxNO, " MAX RATE: ", max, " SECOND MAX NUMBER: ", maxNO2,
        " SECOND MAX RATE: ", max2, " THIRD MAX NUMBER: ", maxNO3, " THIRD MAX RATE: ", max3);
    */
    let max = 0;
    let maxNO = 0;
    let maxNO2 = 0;
    let max2 = 0;
    let maxNO3 = 0;
    let max3 = 0;

    for (let i = 0; i < pArray.length; i++) {
        if (pArray[i] > max) {
            max = pArray[i];
            maxNO = i
        }
    }
    for (let i = 0; i < pArray.length; i++) {
        if (pArray[i] > max2 && pArray[i] < max) {
            max2 = pArray[i];
            maxNO2 = i
        }
    }
    for (let i = 0; i < pArray.length; i++) {
        if (pArray[i] > max3 && pArray[i] < max && pArray[i] < max2) {
            max3 = pArray[i];
            maxNO3 = i
        }
    }
    let char = '';
    if (maxNO==1)
        char = 'П';
    else if (maxNO==2)
            char = 'З'
        else if (maxNO==3)
                char = 'И';
    document.getElementById('number').value = char;
    console.log("NUMBER: ", maxNO, "RATE: ", max);
    console.log("SECOND MAX NUMBER: ", maxNO2, " SECOND MAX RATE: ", max2, " THIRD MAX NUMBER: ", maxNO3, " THIRD MAX RATE: ", max3);
}

function calculate() {
    // console.log("test");
    // console.log(saveImageToPixelsArray(false));
    calculateFuckingShit(saveImageToPixelsArray(false));

}