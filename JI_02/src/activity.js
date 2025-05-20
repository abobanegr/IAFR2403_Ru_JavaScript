/**
 * Получает случайное слово с API
 * @returns {Promise<string>} - Случайное слово или сообщение об ошибке
 */
export async function getRandomActivity() {
    try {
        const response = await fetch('https://random-word-api.herokuapp.com/word');
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json(); // API возвращает массив слов, например ["example"]
        return data[0]; // возвращаем первое слово
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        return "К сожалению, произошла ошибка";
    }
}