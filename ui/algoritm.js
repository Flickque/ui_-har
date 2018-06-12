let repository = {
    array0: [],
    array1: [],
    array2: [],
    array3: [],
    array4: [],
    array5: [],
    array6: [],
    array7: [],
    array8: [],
    array9: []
}

const imageSize = 9;
//FIXME уменьшить толщину пера, подключить доп картинки,уменьшить размер канвы
//FIXME показать захару примеры async await,функциональщины - фильтр мап и обход массива, let сказать чтобы юзал везде и в циклах обяз

/**
 * инициализация всех массивов с картинками
 */
function initAllArrays() {

    //let обязательно должно быть внутри for иначе будет замыкание
    for (let i = 0; i <= imageSize; i++) {
        // Загружаем файл изображения
        let img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0, img.width, img.height);
            console.log("async" + i);
            // FIXME вся проблема тут,код асинхронный - сначала прогоняются все картинки и ток потом вызывается колбек для последней
            repository['array' + i] = saveImageToPixelsArray();

            console.log("img/" + i + ".png")
          //  console.log(repository.array0.length);
           // console.log("Array ",i);
          //  console.log(repository['array' + i]);
            erase();
        };
        img.src = "img/" + i + ".png";
    }


}

/**
 * сохраняем картинку в массив микселей
 */
function saveImageToPixelsArray() {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;
    let pixelsArray = [];
    // iterate over all pixels
    console.log("saveImageToPixelsArray " + data.length)
    for (let i = 0, n = data.length; i < n; i += 1) {
        pixelsArray[i] = data[i];
        //if (pixelsArray[i] != 0) console.log(pixelsArray[i]) // КОДЫ разные все - нетолько альфа но и рбг
    }
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
    for (let i = 0; i+4 <= userArray.length; i++) {
        countj = 0;
        for (let j = i; j <= i+4; j++) {
           if (userArray[j] != targetArray[j]) countj++;
        }
        if (countj == 4)
            count++;
        //FIXME возможно считать не так ,каждый пиксель - 4 элемента, вот походу надо по 4 сравнивать и если из них хоть 1 несовпадает то пиксель не равен
    }
    return count;
}

/**
 * рассчет потенциала
 * @param userArray
 */
function calculateFuckingShit(userArray) {
    // массив потенциалов
    let pArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i <= imageSize; i++) {
        let r = compare(userArray, repository['array' + i]);
        console.log("r " + r  + " " + i);
        // FIXME хз как тут с точностю
        pArray[i] = pArray[i] + 1000000 / (1 + r * r);
        console.log("pArray[i] " + pArray[i]);
    }

    //FIXME пересмотреть
    let max = 0;
    let maxNO = 0;
    for (let i = 0; i <= imageSize; i++) {
        if (pArray[i] > max) {
            max = pArray[i];
            maxNO = i;
        }
    }
    console.log(maxNO);
}

function calculate() {
    console.log("test");
 //   console.log(saveImageToPixelsArray());
    calculateFuckingShit(saveImageToPixelsArray());

}