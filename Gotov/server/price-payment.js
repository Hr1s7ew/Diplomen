const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51QtvkrFVPhunSiwWBySTsuFLUlkby6Q7HVaHLurJHjSy4tT1ekgKVKPOcbVt9JtobCpm2ANVWPgFm2UUZW0xNZrv001csGRZzj');
const axios = require('axios');
require('dotenv').config();
const fetch = require('node-fetch');

const app = express();
const port = 1234;

app.use(express.json());
app.use(cors());

let reservedTimes = {};

// Резервация + изпращане на имейли
app.post('/reserve', async (req, res) => {
    const { email, name, date, time, sessionType, sessionSize, paymentMethod, price, discountMessage } = req.body;

    // Проверяваме дали има резервирани часове за тази дата
    if (!reservedTimes[date]) {
        reservedTimes[date] = [];
    }

    // Проверяваме дали избраният час вече е резервиран
    if (reservedTimes[date].includes(time)) {
        return res.status(400).send({ message: 'Часът е вече резервиран!' });
    }

    // Добавяме новата резервация
    reservedTimes[date].push(time);

    // Подготвяме съобщението за имейла на клиента
    const message = {
        sender: { email: 'dimitarhristev20b@gmail.com' },
        to: [{ email: email }],
        subject: 'Вашата резервация',
        htmlContent: `
            <html>
                <body>
                    <h1>Резервацията Ви е успешна!</h1>
                    <p><strong>Име:</strong> ${name}</p>
                    <p><strong>Дата:</strong> ${date}</p>
                    <p><strong>Час:</strong> ${time}</p>
                    <p><strong>Тип фотосесия:</strong> ${sessionType}</p>
                    <p><strong>Вид на сесията:</strong> ${sessionSize}</p>
                    <p><strong>Начин на плащане:</strong> ${paymentMethod === 'card' ? 'С карта' : 'Наложен платеж'}</p>
                    <p><strong>Цена:</strong> ${price} лв</p>
                    ${discountMessage ? `<p><strong>Отстъпка:</strong> ${discountMessage}</p>` : ''}
                </body>
            </html>`
    };

    // Подготвяме съобщението за имейла на администратора
    const adminMessage = {
        sender: { email: 'dimitarhristev20b@gmail.com' },
        to: [{ email: 'dimitarhristev20b@gmail.com' }],
        subject: '❗ Нова резервация ❗',
        htmlContent: `
            <html>
                <body>
                    <h1>Нова резервация!</h1>
                    <p><strong>Име на клиента:</strong> ${name}</p>
                    <p><strong>Имейл на клиента:</strong> ${email}</p>
                    <p><strong>Дата:</strong> ${date}</p>
                    <p><strong>Час:</strong> ${time}</p>
                    <p><strong>Тип фотосесия:</strong> ${sessionType}</p>
                    <p><strong>Вид на сесията:</strong> ${sessionSize}</p>
                    <p><strong>Начин на плащане:</strong> ${paymentMethod === 'card' ? 'С карта' : 'Наложен платеж'}</p>
                    <p><strong>Цена:</strong> ${price} лв</p>
                    ${discountMessage ? `<p><strong>Отстъпка:</strong> ${discountMessage}</p>` : ''}
                    <hr>
                    <p>📌 Тази резервация беше направена през сайта.</p>
                </body>
            </html>`
    };

    try {
        // Изпращаме имейлите
        await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            message,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': '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'
                }
            }
        );

        await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            adminMessage,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': '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'
                }
            }
        );

        res.status(200).json({ message: 'Резервацията е успешна, имейлите са изпратени!' });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Грешка при изпращане на имейл', error: error.response ? error.response.data : error.message });
    }
});

// GET endpoint за получаване на резервираните часове
app.get('/get-reserved-times', (req, res) => {
    res.status(200).json(reservedTimes);
});


// Създаване на Stripe PaymentIntent
app.post('/create-payment-intent', async (req, res) => {
    const { price } = req.body;
    console.log("Получена стойност за price:", price); // Лог за стойността на price

    try {
        if (!price || isNaN(price)) {
            console.log("Невалидна стойност за price");
            return res.status(400).send({
                message: 'Цената е задължителна и трябва да бъде числова.',
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: price * 100, // Преобразуване на цената в стотинки
            currency: 'BGN',
            metadata: { integration_check: 'accept_a_payment' },
        });

        console.log('PaymentIntent успешно създаден:', paymentIntent); // Лог на успешното създаване на PaymentIntent
        
        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Грешка при създаване на PaymentIntent:', error); // Лог на грешката
        res.status(500).send({
            message: 'Грешка при създаване на PaymentIntent',
            error: error.message,
        });
    }
});

// Верификация на hCaptcha
app.post('/verify-hcaptcha', async (req, res) => {
    const { hcaptchaResponse } = req.body;

    try {
        const response = await fetch('https://api.hcaptcha.com/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: 'ES_5746b88b07cc466e858d75a94899b68b',
                response: hcaptchaResponse,
            }),
        });

        const data = await response.json();

        if (data.success) {
            res.status(200).json({ message: 'hCaptcha validation successful' });
        } else {
            res.status(400).json({ message: 'hCaptcha validation failed', data });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

const apiKey = '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';

app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    console.log('Получена заявка за абонамент:', req.body);

    // Валидация на имейл адрес
    if (!email || !validateEmail(email)) {
        return res.status(400).json({ message: 'Невалиден имейл адрес' });
    }

    const userMessage = `Този потребител се е абонирал с имейл: ${email}`;
    const userConfirmationMessage = 'Вие успяхте да се абонирате успешно! Следете страницата ни за повече промоции.';

    // Съобщение за администратора
    const adminMessage = {
        sender: { email: "dimitarhristev20b@gmail.com" },
        to: [{ email: "dimitarhristev20b@gmail.com" }],
        subject: "Нов абонамент",
        htmlContent: `
            <html>
                <body>
                    <h1>Нов абонамент</h1>
                    <p>${userMessage}</p>
                </body>
            </html>`
    };

    // Съобщение за потвърждение към потребителя
    const userMessageForUser = {
        sender: { email: "dimitarhristev20b@gmail.com" },
        to: [{ email: email }],
        subject: "Успешен абонамент",
        htmlContent: `
            <html>
                <body>
                    <h1>Успешно се абонирахте!</h1>
                    <p>${userConfirmationMessage}</p>
                </body>
            </html>`
    };

    try {
        // Изпращане на имейл на администратора
        const adminResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': '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'
            },
            body: JSON.stringify(adminMessage)
        });

        // Изпращане на имейл на потребителя
        const userResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': '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'
            },
            body: JSON.stringify(userMessageForUser)
        });

        // Проверка дали имейлите са изпратени успешно
        if (adminResponse.ok && userResponse.ok) {
            res.status(200).json({ message: 'Успешно се абонирахте!' });
        } else {
            const errorData = await adminResponse.json();
            res.status(500).json({ message: `Грешка при изпращането на имейла: ${errorData.message}` });
        }
    } catch (error) {
        console.error('Грешка при изпращането на имейла:', error);
        res.status(500).json({ message: 'Грешка при изпращането на заявката.' });
    }
});

// Валидация на имейл
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

app.listen(port, () => {
    console.log(`Сървърът работи на порт ${port}`);
});
