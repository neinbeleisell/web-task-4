const express = require('express');
const cors = require('cors'); // Импортируем библиотеку CORS
const bodyParser = require('body-parser'); // Для обработки POST-запросов
const app = express();

// Настройка порта
const PORT = 3000;

// Включаем CORS и Body Parser
app.use(cors());
app.use(bodyParser.json()); // Для обработки JSON-данных

// Пример данных альбомов
let albums = [
    {
        title: 'Out Loud',
        artist: 'Cage The Elephant',
        coverImage: 'images/assets_8f889cf6-4292-4352-8795-dc157b03f7c4.png',
        releaseDate: '01-12-2024',
        type: 'Сингл',
    },
    {
        title: 'GLOOM DIVISION',
        artist: 'I DONT KNOW HOW BUT THEY FOUND ME',
        coverImage: 'images/assets_f2ea3344-a64f-4c9a-856a-17ed38862d4b.png',
        releaseDate: '23-10-2024',
        type: 'Альбом',
    },
];

// Обработчик для получения данных
app.get('/albums', (req, res) => {
    res.json(albums);
});

// Обработчик для добавления нового альбома
app.post('/albums', (req, res) => {
    const newAlbum = req.body;

    // Проверяем наличие всех необходимых полей
    if (!newAlbum.title || !newAlbum.artist || !newAlbum.coverImage || !newAlbum.releaseDate || !newAlbum.type) {
        return res.status(400).json({ error: 'Все поля должны быть заполнены' });
    }

    albums.push(newAlbum); // Добавляем новый альбом в массив
    res.status(201).json({ message: 'Альбом успешно добавлен!', newAlbum });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
