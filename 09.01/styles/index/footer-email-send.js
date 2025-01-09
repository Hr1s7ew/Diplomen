/*document.getElementById('emailForm').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const email = document.getElementById('email').value;
        alert(`Имейлът "${email}" е въведен успешно!`);
    }
});*/

document.getElementById('emailForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email-subscription-send').value;

    console.log(email);

    const message = {
        sender: { email: "dimitarhristev20b@gmail.com" },
        to: [{ email: email }],
        subject: "Тема на съобщението",
        htmlContent: "<html><body><h1>Вашето съобщение беше изпратено!</h1><p>Това е пример за съобщение, което ще бъде изпратено от Brevo API.</p></body></html>"
    };

        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': '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'  // Вашият API ключ от Brevo
            },
            body: JSON.stringify(message)
        });
        location.reload();
    });

    