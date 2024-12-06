document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('modal');
  
    var modalTitle = document.getElementById('modal-title');
    var modalDescription = document.getElementById('modal-description');
    var modalMoreDescription = document.getElementById('modal-more-description');
    var modalImage = document.getElementById('modal-image');
    var modalGender = document.getElementById('modal-gender');
    var modalAge = document.getElementById('modal-age');
    var modalNote = document.getElementById('modal-note');
    var closeBtn = document.getElementsByClassName('close')[0];
    var photos = document.getElementsByClassName('photo');
    const likedPetsList = document.getElementById("likedPetsList");

    // Получаем информацию о текущем пользователе
    const currentUserEmail = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).email : null;
    let isAuthenticated = false;
    if (localStorage.getItem('isAuthenticated') === 'true') {
        isAuthenticated = true;
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } 
    document.querySelectorAll('.heart-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkboxId = this.id;
            const isChecked = this.checked;
            const userKey = isAuthenticated ? currentUser.email : 'guest';

            if (isChecked) {
                localStorage.setItem(userKey + '-' + checkboxId, 'true');
            } else {
                localStorage.removeItem(userKey + '-' + checkboxId);
            }

            if (isAuthenticated) {
                updateLikedPetsDisplay(currentUser.email);
            }
        });
    });
    function updateLikedPetsDisplay(email) {
        console.log("aaa")
        likedPetsList.innerHTML = "";
        const photos = document.getElementsByClassName('photo');
    
        // Создаем массив для хранения лайкнутых питомцев
        const likedPets = [];
    
        // Показ лайкнутых питомцев из localStorage для авторизованного пользователя
        for (let i = 0; i < photos.length; i++) {
            const checkbox = photos[i].querySelector('.heart-checkbox');
            const checkboxId = checkbox.id;
    
            if (localStorage.getItem(email + '-' + checkboxId) === 'true') {
                const petName = photos[i].querySelector('h2').textContent;
                const petItem = document.createElement('li');
                petItem.textContent = petName;
                likedPetsList.appendChild(petItem);
                // Добавляем petName в массив лайкнутых питомцев
                likedPets.push(petName);
            }
        }
    
        // Сохраняем массив likedPets в localStorage с ключом имени текущего пользователя
        localStorage.setItem(`${email}-likedPets`, JSON.stringify(likedPets));
       
    }

    function updateCheckboxes(userType) {
        const photos = document.getElementsByClassName('photo');
        
        for (let i = 0; i < photos.length; i++) {
            const checkbox = photos[i].querySelector('.heart-checkbox');
            const checkboxId = checkbox.id;

            checkbox.checked = (localStorage.getItem(userType + '-' + checkboxId) === 'true');
        }
    }

    // Восстановление состояния чекбоксов из localStorage
    for (var i = 0; i < photos.length; i++) {
        var checkbox = photos[i].querySelector('.heart-checkbox');
        var checkboxId = checkbox.id;

        // Устанавливаем состояние чекбокса из localStorage
        if (currentUserEmail) {
            if (localStorage.getItem(currentUserEmail + '-' + checkboxId) === 'true') {
                checkbox.checked = true; // Устанавливаем состояние для авторизованного пользователя
            }
        } else {
            if (localStorage.getItem(checkboxId) === 'true') {
                checkbox.checked = true; // Устанавливаем состояние для неавторизованного пользователя
            }
        }

        // Обработчик изменения состояния чекбокса
        checkbox.addEventListener('change', function() {
            if (currentUserEmail) {
                localStorage.setItem(currentUserEmail + '-' + this.id, this.checked); // Сохраняем состояние для авторизованного пользователя
            } else {
                localStorage.setItem(this.id, this.checked); // Сохраняем состояние для неавторизованного пользователя
            }
        });

        // Открытие модального окна по клику на карточку
        photos[i].addEventListener('click', function(event) {
            // Проверяем, был ли клик на чекбоксе
            if (event.target.type !== 'checkbox' && event.target.tagName !== 'LABEL') {
                modal.style.display = 'block';
                modalTitle.innerHTML = this.querySelector('h2').innerHTML;
                modalDescription.innerHTML = this.querySelector('p').innerHTML;
                modalMoreDescription.innerHTML = this.dataset.description;
                modalGender.innerHTML = "Пол: " + this.dataset.gender;
                modalAge.innerHTML = "Возраст: " + this.dataset.age;
                modalNote.style.color = this.dataset.noteColor;
                modalImage.src = this.querySelector('img').src;
            }
        });
    }

    // Закрытие модального окна
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});

// Функция для поиска
document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementById('search-input');
    var photos = document.getElementsByClassName('photo');

    searchInput.addEventListener('input', function () {
        var searchValue = searchInput.value.toLowerCase();

        for (var i = 0; i < photos.length; i++) {
            var petName = photos[i].getElementsByTagName('h2')[0].textContent.toLowerCase();

            if (petName.includes(searchValue)) {
                photos[i].style.display = 'block';  // Показываем карточку, если имя совпадает
            } else {
                photos[i].style.display = 'none';  // Скрываем карточку, если имя не совпадает
            }
        }
    });
});

// Функция для фильтрации и поиска
document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementById('search-input');
    var filterSelect = document.getElementById('filter-select');
    var photos = document.getElementsByClassName('photo');

    function filterAndSearch() {
        var searchValue = searchInput.value.toLowerCase();
        var filterValue = filterSelect.value;

        for (var i = 0; i < photos.length; i++) {
            var petName = photos[i].getElementsByTagName('h2')[0].textContent.toLowerCase();
            var petType = photos[i].getAttribute('data-type');
            var petAge = photos[i].getAttribute('data-age1');

            // Проверка фильтра
            var isFilterMatch = 
                (filterValue === 'all') ||
                (filterValue === 'cats' && petType === 'cat') ||
                (filterValue === 'dogs' && petType === 'dog') ||
                (filterValue === 'younger' && petAge === 'younger') ||
                (filterValue === 'older' && petAge === 'older');

            // Проверка поиска
            var isSearchMatch = petName.includes(searchValue);

            // Показываем только те карточки, которые совпадают и с фильтром, и с поиском
            if (isFilterMatch && isSearchMatch) {
                photos[i].style.display = 'block';
            } else {
                photos[i].style.display = 'none';
            }
        }
    }

    searchInput.addEventListener('input', filterAndSearch);
    filterSelect.addEventListener('change', filterAndSearch);
});