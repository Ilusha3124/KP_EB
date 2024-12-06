const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Используем CORS и body-parser для работы с POST-запросами
app.use(cors());
app.use(bodyParser.json());

// Подключение к базе данных (создаст файл, если он не существует)
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    return console.error('Ошибка подключения к базе данных:', err.message);
  }
  console.log('Подключено к SQLite базе данных.');
});

// Создаем таблицу пользователей, если её нет
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
)`, (err) => {
  if (err) {
    console.error("Ошибка при создании таблицы:", err.message);
  } else {
    console.log("Таблица 'users' успешно создана или уже существует.");
    
    // Автоматически добавляем трех пользователей, если таблица пуста
    db.get(`SELECT COUNT(*) AS count FROM users`, (err, row) => {
      if (err) {
        console.error("Ошибка при проверке количества пользователей:", err.message);
      } else if (row.count === 0) {
        const users = [
          { name: 'Пользователь 1', email: 'u1@ex.com', password: 'password1' },
          { name: 'Пользователь 2', email: 'u2@ex.com', password: 'password2' },
          { name: 'Пользователь 3', email: 'u3@ex.com', password: 'password3' }
        ];

        const insertQuery = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        users.forEach(user => {
          db.run(insertQuery, [user.name, user.email, user.password], function(err) {
            if (err) {
              console.error('Ошибка при добавлении пользователя:', err.message);
            } else {
              console.log(`Пользователь добавлен: ${user.name}`);
            }
          });
        });
      }
    });
  }
});

// Обработчик маршрута для входа
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Проверка, что email и пароль не пустые
  if (!email || !password) {
    return res.status(400).json({ error: 'Необходимо ввести email и пароль' });
  }

  const query = `SELECT name FROM users WHERE email = ? AND password = ?`;

  db.get(query, [email, password], (err, row) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err.message);
      return res.status(500).json({ error: 'Ошибка сервера' });
    } else if (row) {
      res.status(200).json({ message: 'Успешный вход', user: row.name });
    } else {
      res.status(401).json({ error: 'Неверный логин или пароль' });
    }
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
