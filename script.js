document.addEventListener('DOMContentLoaded', async () => {
    const newAlbumsContainer = document.getElementById('new-albums-container');
    const oldAlbumsContainer = document.getElementById('old-albums-container');
    const albumForm = document.getElementById('album-form');

    // Функция для парсинга даты из строки
    function parseReleaseDate(dateString) {
        const [day, month, year] = dateString.split('-').map(Number);
        const fullYear = year < 100 ? 2000 + year : year; // Обработка короткого формата года
        return new Date(fullYear, month - 1, day);
    }

    // Функция для формирования HTML альбома
    function createAlbumHTML(album) {
        return `
            <div class="ikonka-nazvanie-artist-tip-kogda">
                <div class="ssylka-na-al-bom">
                    <img alt="${album.title}" class="foto" src="${album.coverImage}" />
                </div>
                <div class="nazvanie-artist-tip-kogda">
                    <div class="nazvanie-artist">
                        <p class="nazvanie-novoe">${album.title}</p>
                        <p class="artist">${album.artist}</p>
                    </div>
                    <div class="tip-kogda">
                        <p class="tip">${album.type}</p>
                        <p class="kogda">${album.releaseDate}</p>
                    </div>
                </div>
            </div>
            <div class="knopka-play">
                <div class="ellipse-1"></div>
                <img alt="" class="vector-pljej" src="images/assets_3f5c7f67-5405-428e-a06c-51db55f1a619.svg" />
            </div>
        `;
    }

    // Функция для загрузки альбомов с сервера
    async function loadAlbums() {
        try {
            const response = await fetch(`http://localhost:3000/albums?_=${Date.now()}`);
            if (!response.ok) throw new Error('Не удалось загрузить данные');
            const albums = await response.json();

            console.log('Загруженные альбомы:', albums);

            const albumsWithParsedDates = albums.map(album => ({
                ...album,
                releaseDateParsed: parseReleaseDate(album.releaseDate),
            }));

            // Сортируем по дате выхода
            albumsWithParsedDates.sort((a, b) => b.releaseDateParsed - a.releaseDateParsed);

            console.log('Альбомы после сортировки:', albumsWithParsedDates);

            // Очищаем контейнеры
            newAlbumsContainer.innerHTML = '';
            oldAlbumsContainer.innerHTML = '';

            // Добавляем новый альбом (самый последний по дате)
            if (albumsWithParsedDates.length > 0) {
                console.log('Добавляю в new:', albumsWithParsedDates[0]);
                newAlbumsContainer.innerHTML = createAlbumHTML(albumsWithParsedDates[0]);
            }

            // Добавляем старый альбом (второй по дате)
            if (albumsWithParsedDates.length > 1) {
                console.log('Добавляю в old:', albumsWithParsedDates[1]);
                oldAlbumsContainer.innerHTML = createAlbumHTML(albumsWithParsedDates[1]);
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    }

    // Обработчик формы для добавления нового альбома
    albumForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const artist = document.getElementById('artist').value;
        const coverImage = document.getElementById('coverImage').value;
        const releaseDate = document.getElementById('releaseDate').value;
        const type = document.getElementById('type').value;

        try {
            const response = await fetch('http://localhost:3000/albums', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, artist, coverImage, releaseDate, type }),
            });

            if (!response.ok) throw new Error('Не удалось добавить альбом');

            const result = await response.json();
            console.log(result.message);

            // Обновляем список альбомов
            await loadAlbums();

            // Очищаем форму
            albumForm.reset();
        } catch (error) {
            console.error('Ошибка при добавлении альбома:', error);
        }
    });

    // Загрузка альбомов при загрузке страницы
    await loadAlbums();
});
