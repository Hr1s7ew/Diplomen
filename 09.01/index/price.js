const reservedTimes = {}; // Обект за съхранение на резервираните часове

document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const today = new Date().toISOString().split('T')[0];

    // Забрани избор на предишни дати
    dateInput.setAttribute('min', today);

    // Обнови опциите за часове при избор на дата
    dateInput.addEventListener('change', () => {
        updateAvailableTimes(dateInput.value);
    });

    // Премахване на изтекли часове при стартиране, ако е избрана днешната дата
    if (dateInput.value === today) {
        updateAvailableTimes(today);
    }
});

function updateAvailableTimes(selectedDate) {
    const timeSelect = document.getElementById('time');
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date();

    // Всички налични часове
    const availableTimes = ['9:00', '11:00', '13:00', '15:00', '17:00'];

    // Преобразуване на текущото време в минути за лесно сравнение
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    // Филтриране на часовете
    const filteredTimes = availableTimes.filter(time => {
        const [hour, minute] = time.split(':').map(Number);
        const timeInMinutes = hour * 60 + minute;

        // За текущата дата премахваме изтеклите часове
        if (selectedDate === today && timeInMinutes <= currentMinutes) {
            return false;
        }

        // Премахваме вече резервираните часове
        if (reservedTimes[selectedDate]?.includes(time)) {
            return false;
        }

        return true;
    });

    // Обновяване на опциите за часове
    timeSelect.innerHTML = filteredTimes
        .map(time => `<option value="${time}">${time}</option>`)
        .join('');

    // Показване на съобщение, ако няма налични часове
    if (filteredTimes.length === 0) {
        showToast('Няма налични часове за избраната дата!', true);
        timeSelect.innerHTML = '<option value="">Няма свободни часове</option>';
    }
}

function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.backgroundColor = isError ? '#ff4d4d' : '#4CAF50'; // Червено за грешки, зелено за успех
    toast.className = 'show';

    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 4000); // Изчезва след 4 секунди
}

document.getElementById('reservationForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const email = document.getElementById('email').value;
    const sessionType = document.getElementById('sessionType').value;

    if (!reservedTimes[date]) {
        reservedTimes[date] = [];
    }
    reservedTimes[date].push(time);

    const message = {
        sender: { email: "dimitarhristev20b@gmail.com" },
        to: [{ email: email }],
        subject: "Вашата резервация",
        htmlContent: `
            <html>
                <body>
                    <h1>Резервацията Ви е успешна!</h1>
                    <p><strong>Име:</strong> ${name}</p>
                    <p><strong>Дата:</strong> ${date}</p>
                    <p><strong>Час:</strong> ${time}</p>
                    <p><strong>Тип фотосесия:</strong> ${sessionType}</p>
                </body>
            </html>`
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': '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'
            },
            body: JSON.stringify(message)
        });

        if (response.ok) {
            showToast('Резервацията Ви е успешна!', false);
            updateAvailableTimes(date);
            document.getElementById('reservationForm').reset();
        } else {
            const errorData = await response.json();
            showToast(`Грешка: ${errorData.message}`, true);
        }
    } catch (error) {
        console.error('Грешка:', error);
        showToast('Грешка при изпращането на резервацията.', true);
    }
});