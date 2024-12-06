ymaps.ready(function () {
    // Координаты адреса в Минске (улица Шаранговича, 25)
    var minskLocation = [52.138930, 26.068436];

    // Создание карты
    var map = new ymaps.Map("map", {
        center: minskLocation, // Центр карты
        zoom: 16 // Масштаб карты
    });

    // Создание метки на карте
    var placemark = new ymaps.Placemark(minskLocation, {
        hintContent: 'улица Д.М. Минеева, 9', // Текст при наведении на метку
        balloonContent: 'улица Д.М. Минеева, 9' // Текст при клике на метку
    });

    // Добавление метки на карту
    map.geoObjects.add(placemark);
});