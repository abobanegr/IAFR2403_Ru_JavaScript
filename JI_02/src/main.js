import { getRandomActivity } from './activity.js';

/**
 * Обновляет текст активности на странице.
 * @async
 * @returns {Promise<void>}
 */
async function updateActivity() {
    const activityElement = document.getElementById('activity');
    const activity = await getRandomActivity();
    activityElement.textContent = activity;

    // Запланировать обновление через 60 секунд
    setTimeout(updateActivity, 60000);
}

// Запускаем обновление при загрузке страницы
updateActivity();