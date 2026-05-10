// Configuración de EmailJS
emailjs.init("6U-AS6Yrud9VYmS_U");

const form = document.getElementById('contactForm');
const submitButton = document.getElementById('submitButton');
const formResponse = document.getElementById('formResponse');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    if (!name || !email || !message) {
        showResponse('Por favor, completa los campos requeridos.', 'text-danger');
        return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Enviando...';

    // Envío real con EmailJS (Configurado para Kevin Herrera)
    try {
        await emailjs.send("service_r62jxo7", "template_qpbx9rk", {
            name: name,             // Coincide con {{name}} en tu plantilla
            from_email: email,      // Puedes agregarlo a tu plantilla como {{from_email}}
            phone_number: phone,    // Puedes agregarlo a tu plantilla como {{phone_number}}
            message: message,       // Coincide con {{message}} en tu plantilla
        });

        showResponse('¡Gracias! Tu mensaje ha sido enviado con éxito.', 'text-success');
        form.reset();
    } catch (error) {
        console.error('Error EmailJS:', error);
        showResponse('Hubo un error al enviar el mensaje. Inténtalo de nuevo.', 'text-danger');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fa fa-paper-plane me-2"></i>Enviar Mensaje';
    }
});

function showResponse(text, className) {
    formResponse.innerHTML = `<p class="${className} animated fadeIn">${text}</p>`;
    setTimeout(() => {
        formResponse.innerHTML = '';
    }, 5000);
}
