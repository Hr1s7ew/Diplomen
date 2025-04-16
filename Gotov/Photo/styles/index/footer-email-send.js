/*document.getElementById('emailForm').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const email = document.getElementById('email').value;
        alert(`Имейлът "${email}" е въведен успешно!`);
    }
});*/
document.getElementById('emailForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email-subscription-send').value;

    // Проверка дали имейлът е въведен
    if (!email) {
        showToast('Моля, въведете имейл адрес!', 'error');
        return;
    }

    // Проверка за валиден имейл
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showToast('Моля, въведете валиден имейл адрес!', 'error');
        return;
    }

    try {
        const response = await fetch('https://diplomen-production.up.railway.app/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const responseText = await response.text();
        console.log('Отговор от сървъра:', responseText);
        
        // Проверка дали сървърът върне валиден JSON
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Грешка при парсирането на JSON:', e);
            showToast('Грешка при обработката на отговора от сървъра.', 'error');
            return;
        }

        if (response.ok) {
            showToast('Успешно се абонирахте!', 'success');
            document.getElementById('email-subscription-send').value = '';
        } else {
            showToast(`Грешка: ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('Грешка при изпращането на заявката:', error);
        showToast('Грешка при изпращането на заявката.', 'error');
    }
});


// Функция за показване на toast notification
function showToast(message, type) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;
    toast.style.backgroundColor = (type === 'success') ? 'green' : 'red';
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000); // Скрива съобщението след 3 секунди
}
