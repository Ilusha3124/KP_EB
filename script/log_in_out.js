document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("authModal");
    const logIcon = document.getElementById("log");
    const closeAuthBtn = document.getElementsByClassName("custom-close-btn-auth")[0];
    const authForm = document.getElementById("authForm");
    const userStatus = document.getElementById("userStatus");
    const userModal = document.getElementById("userModal");
    const userNameDisplay = document.getElementById("userName");
    const userEmailDisplay = document.getElementById("userEmail");
    const likedPetsList = document.getElementById("likedPetsList");

    let isAuthenticated = false;
    let currentUser = {};

    if (localStorage.getItem('isAuthenticated') === 'true') {
        isAuthenticated = true;
        currentUser = JSON.parse(localStorage.getItem('currentUser'));

        userStatus.style.display = "inline";
        userStatus.textContent = currentUser.name;
        userStatus.style.marginRight = "150px";

        userNameDisplay.textContent = `Имя пользователя: ${currentUser.name}`;
        userEmailDisplay.textContent = `Email: ${currentUser.email}`;
        

    } 
    logIcon.onclick = function() {
        if (isAuthenticated) {
            currentUser = JSON.parse(localStorage.getItem('currentUser'));
            likedPetsList.innerHTML = ""; // Очищаем список перед добавлением новых элементов
            const likedPets = JSON.parse(localStorage.getItem(`${currentUser.email}-likedPets`)) || [];
            console.log(`Загруженные likedPets для ${currentUser.email}:`, likedPets);
            likedPets.forEach(petName => {
                const petItem = document.createElement('li');
                petItem.textContent = petName;
                likedPetsList.appendChild(petItem);
            });
            userModal.style.display = "block";
        } else {
            modal.style.display = "block";
        }
    };

    closeAuthBtn.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        } else if (event.target === userModal) {
            userModal.style.display = "none";
        }
    };

    authForm.onsubmit = async function(event) {
        event.preventDefault();
    
        const login = document.getElementById("authEmail").value;
        const password = document.getElementById("authPassword").value;
    
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: login, password: password })
            });
    
            const result = await response.json();
    
            if (response.ok) {
                isAuthenticated = true;
                currentUser = { name: result.user, email: login };
    
                // Сохранение данных о пользователе в localStorage
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
                // Перезагрузка страницы после успешного входа
                location.reload();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка, попробуйте снова.');
        }
    };

    document.getElementById('logoutButton').addEventListener('click', function() {
        isAuthenticated = false;
        userStatus.style.display = "none";
        userModal.style.display = "none";
        likedPetsList.innerHTML = "";

        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUser');
        location.reload();
    });

    const closeUserModalBtn = userModal.getElementsByClassName("custom-close-btn-user")[0];
    closeUserModalBtn.onclick = function() {
        userModal.style.display = "none";
    };
});
