// Импортиране на нужните модули от Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// ====================
// Firebase инициализация
// ====================
const firebaseConfig = {
    apiKey: "AIzaSyD9BvRWog1WCMeUBFVM8pDH5_jeMQEMBYs",
    authDomain: "diplomen-login.firebaseapp.com",
    projectId: "diplomen-login",
    storageBucket: "diplomen-login.appspot.com",
    messagingSenderId: "191233218898",
    appId: "1:191233218898:web:f112530a881033cdda428b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Променлива за състоянието на логването
let isUserLoggedIn = false;

// Проследяване на логването чрез Firebase
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("✅ Потребителят е логнат:", user.email);
        isUserLoggedIn = true;
    } else {
        console.log("❌ Няма логнат потребител");
        isUserLoggedIn = false;
    }
});

// ====================
// Код за календара и резервиране на часове
// ====================
document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const today = new Date().toISOString().split('T')[0];

    // Забрана за избор на минали дати
    dateInput.setAttribute('min', today);

    // Обновяване на опциите за часове при избор на дата
    dateInput.addEventListener('change', () => {
        updateAvailableTimes(dateInput.value);
    });

    // Ако датата по подразбиране е днес – обновяваме опциите за часове
    if (dateInput.value === today) {
        updateAvailableTimes(today);
    }
});

// Функция за обновяване на наличните часове
// Функция за обновяване на наличните часове
async function updateAvailableTimes(selectedDate) {
    const timeSelect = document.getElementById('time');
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date();

    try {
        const response = await fetch('/get-reserved-times', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const reservedTimes = await response.json();
        const availableTimes = ['9:00', '11:00', '13:00', '15:00', '17:00'];

        // Преобразуване на текущото време в минути
        const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

        const filteredTimes = availableTimes.filter(time => {
            const [hour, minute] = time.split(':').map(Number);
            const timeInMinutes = hour * 60 + minute;

            // Ако избраната дата е днес и часът е вече минал
            if (selectedDate === today && timeInMinutes <= currentMinutes) {
                return false; // Премахваме миналите часове
            }

            // Проверка дали часът вече е резервиран
            if (reservedTimes[selectedDate]?.includes(time)) {
                return false;
            }

            return true;
        });

        // Обновяване на опциите за часове в <select>
        timeSelect.innerHTML = filteredTimes
            .map(time => `<option value="${time}">${time}</option>`)
            .join('');

        // Ако няма налични часове, показваме съобщение
        if (filteredTimes.length === 0) {
            showToast('Няма налични часове за избраната дата!', 'error');
            timeSelect.innerHTML = '<option value="">Няма свободни часове</option>';
        }
    } catch (error) {
        console.error('Грешка при обновяване на часовете:', error);
    }
}


function showToast(message, type) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    toastMessage.textContent = message;

    if (type === 'error') {
        toast.style.backgroundColor = 'red'; // Червен фон за грешки
    } else if (type === 'success') {
        toast.style.backgroundColor = 'green'; // Зелен фон за успех
    }

    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000); // Скрива съобщението след 3 секунди
}

const stripe = Stripe('pk_test_51QtvkrFVPhunSiwWWsdUzRpY7UELxJ2gkUoSCUztlkJNVB457G0OOrCgDcfOclrsc17V7oXRZJOE3YCOLp7A8fdB00GAf5PtAS');
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#stripe-card-element');

// ====================
// Обработка на формата за резервация
// ====================
document.getElementById('paymentMethod').addEventListener('change', (event) => {
    const paymentMethod = event.target.value;
    const stripeCardElement = document.getElementById('stripe-card-element');
    
    if (paymentMethod === 'card') {
        stripeCardElement.style.display = 'block'; // Показваме картовите елементи
        cardElement.mount('#stripe-card-element');
    } else {
        stripeCardElement.style.display = 'none'; // Скриваме картовите елементи
    }
});

// Функция за актуализиране на цената и текста в бутона
let price = 0;

function updateButton() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const sessionType = document.getElementById('sessionType').value;
    const sessionSize = document.getElementById('sessionSize').value;
    
    if (sessionType === 'Семейни') {
        price = sessionSize === 'Мини' ? 400 : 550;
    } else if (sessionType === 'Детска радост') {
        price = sessionSize === 'Мини' ? 250 : 450;
    }

    // Прилагане на отстъпка, ако потребителят е логнат
    if (isUserLoggedIn) {
        price *= 0.9;
    }

    // Ако е избрано плащане с карта, актуализираме текста на бутона
    if (paymentMethod === 'card') {
        document.getElementById('submitButton').textContent = `Плати с карта: ${price} лв`;
    } else {
        // За наложен платеж
        document.getElementById('submitButton').textContent = `Изпрати резервацията`;
    }
}

// Извикваме updateButton всеки път, когато потребителят избира начин на плащане или опции за сесия
document.getElementById('paymentMethod').addEventListener('change', updateButton);
document.getElementById('sessionType').addEventListener('change', updateButton);
document.getElementById('sessionSize').addEventListener('change', updateButton);

// Инициализиране на бутона при зареждане на страницата
updateButton();



document.addEventListener('DOMContentLoaded', () => {
    // Добавяне на event listener за промяна на метода на плащане
    const paymentMethodSelect = document.getElementById('paymentMethod');
    paymentMethodSelect.addEventListener('change', (event) => {
        const paymentMethod = event.target.value;
        const stripeCardElement = document.getElementById('stripe-card-element');
        
        if (paymentMethod === 'card') {
            stripeCardElement.style.display = 'block'; // Показваме картовите данни
            cardElement.mount('#stripe-card-element'); // Монтираме елемента на страницата
            console.log("Картовият елемент е монтиран.");
        } else {
            stripeCardElement.style.display = 'none'; // Скриваме картовия елемент
            console.log("Картовият елемент е скрит.");
        }
    });
});

// ====================
// Обработка на формата за резервация
// ====================
document.getElementById('submitButton').addEventListener('click', async function (e) {
    e.preventDefault();

    const paymentMethod = document.getElementById('paymentMethod').value; // 'cash' или 'card'
    const hcaptchaResponse = hcaptcha.getResponse();

    if (!hcaptchaResponse) {
        showToast('Моля, потвърдете, че не сте робот.', 'error');
        return;
    }

    // Извличане на данни от формата
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const email = document.getElementById('email').value;
    const sessionType = document.getElementById('sessionType').value;
    const sessionSize = document.getElementById('sessionSize').value;

    let price = 0;
    let discountMessage = '';

    if (sessionType === 'Семейни') {
        price = sessionSize === 'Мини' ? 400 : 550;
    } else if (sessionType === 'Детска радост') {
        price = sessionSize === 'Мини' ? 250 : 450;
    }

    if (isUserLoggedIn) {
        price *= 0.9;
        discountMessage = 'Приложена е 10% отстъпка.';
    }

    const reservationData = {
        email,
        name,
        date,
        time,
        sessionType,
        sessionSize,
        paymentMethod,
        price,
        discountMessage,
    };

    if (paymentMethod === 'cash') {
        const response = await fetch('/reserve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservationData),
        });
    
        if (response.ok) {
            console.log('Резервацията е успешна!');
            showToast('Резервацията е успешна!', 'success');
            document.getElementById('reservationForm').reset();
            hcaptcha.reset();

        } else {
            console.error('Грешка при резервацията');
            showToast('Неуспешна резервация.', 'error');
        }
    } else if (paymentMethod === 'card') {
        // Първо плащане с карта
        const paymentSuccess = await handlePayment(price, reservationData, hcaptchaResponse);
    
        if (paymentSuccess) {
            // Ако плащането е минало успешно, правиш резервацията
            const response = await fetch('/reserve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservationData),
            });
    
            if (response.ok) {
                console.log('Резервацията е успешна!');
                showToast('Резервацията е успешна!', 'success');
                document.getElementById('reservationForm').reset();
                hcaptcha.reset();
                
            } else {
                console.error('Грешка при резервацията');
                showToast('Неуспешна резервация.', 'error');
                document.getElementById('reservationForm').reset();
                hcaptcha.reset();
                cardElement.clear();
            }
        } else {
            console.error('Плащането не бе успешно, резервацията няма да бъде направена.');
            
            // Проверка за конкретните грешки
            switch (result?.error?.code) {
                case 'insufficient_funds':
                    showToast('Недостатъчна наличност по картата.', 'error');
                    break;
                case 'card_declined':
                    showToast('Картата е отказана. Опитайте с друга карта.', 'error');
                    break;
                case 'authentication_required':
                    showToast('Необходимо е 3D Secure потвърждение.', 'error');
                    break;
                case 'expired_card':
                    showToast('Картата е изтекла. Моля, използвайте друга карта.', 'error');
                    break;
                default:
                    showToast('Грешка при плащането, резервацията не е направена.', 'error');
                    break;
            }
    
            document.getElementById('reservationForm').reset();
            hcaptcha.reset();
            cardElement.clear();
    
            //location.reload();
        }
    }
});

// Плащане с карта с обработка на 3D Secure
async function handlePayment(price, reservationData, hcaptchaResponse) {
    try {
        const paymentButton = document.getElementById('submitButton');
        paymentButton.disabled = true; // Изключи бутона при стартиране

        const cardElementValidation = cardElement._complete;
        if (!cardElementValidation) {
            showToast('Моля, попълнете валидни данни за картата.', 'error');
            paymentButton.disabled = false;
            return false;
        }

        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price }),
        });

        if (!response.ok) {
            showToast('Грешка при създаване на плащането.', 'error');
            paymentButton.disabled = false;
            return false;
        }

        const { clientSecret } = await response.json();
        if (!clientSecret) {
            showToast('Грешка при създаване на плащането.', 'error');
            paymentButton.disabled = false;
            return false;
        }

        let result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
            },
        });

        if (result.error) {
            showToast(result.error.message, 'error');
            paymentButton.disabled = false;
            return false;
        }

        if (result.paymentIntent.status === 'requires_action' || result.paymentIntent.status === 'requires_source_action') {
            result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                },
            });

            if (result.error) {
                showToast(result.error.message, 'error');
                paymentButton.disabled = false;
                return false;
            }
        }

        if (result.paymentIntent.status === 'succeeded') {
            showToast('Плащането е успешно!', 'success');
            cardElement.clear();
            document.getElementById('stripe-card-element').style.display = 'none';
            paymentButton.disabled = false;
            return true;
        }

    } catch (error) {
        console.error('Грешка при обработка на плащането:', error);
        showToast('Грешка при обработка на плащането.', 'error');
        paymentButton.disabled = false;
        return false;
    }
}
