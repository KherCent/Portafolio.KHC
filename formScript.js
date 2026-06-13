// ============================================
// SISTEMA DE RETENCIÓN DE USUARIOS
// ============================================

let hasInteracted = false;
let hasSubmitted = false;
let exitIntentShown = false;
let pageLoadTime = Date.now();
const MIN_TIME_BEFORE_SHOW = 30000; // 30 segundos mínimo

// Crear modal de retención
function createExitModal() {
    if (document.getElementById('exitIntentModal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'exitIntentModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border: 2px solid #00f3ff;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 0 50px rgba(0,243,255,0.3);
            transform: scale(0.8);
            transition: transform 0.3s ease;
        ">
            <div style="font-size: 60px; margin-bottom: 20px;">👋</div>
            <h2 style="color: #00f3ff; margin-bottom: 15px; font-size: 1.8rem;">
                ¡Espera! No te vayas todavía...
            </h2>
            <p style="color: #ccc; margin-bottom: 25px; font-size: 1.1rem; line-height: 1.6;">
                Parece que estás a punto de irte. ¿Ya conociste mi trabajo?<br>
                <strong style="color: #fff;">¡Contáctame y conversemos!</strong>
            </p>
            
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button id="stayAndContact" style="
                    background: linear-gradient(135deg, #00f3ff, #00b4d8);
                    border: none;
                    color: #000;
                    padding: 15px 30px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    border-radius: 50px;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                ">
                    📩 ¡Contáctame Ahora!
                </button>
                
                <a href="Developer_CV_J.kevin_herrera_centellas.pdf" download style="
                    background: transparent;
                    border: 2px solid #00f3ff;
                    color: #00f3ff;
                    padding: 15px 30px;
                    font-size: 1rem;
                    font-weight: 600;
                    border-radius: 50px;
                    cursor: pointer;
                    text-decoration: none;
                    display: block;
                    transition: all 0.2s;
                ">
                    📄 Descargar mi CV
                </a>
                
                <button id="dismissExit" style="
                    background: transparent;
                    border: none;
                    color: #666;
                    padding: 10px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    text-decoration: underline;
                ">
                    Ya lo haré después
                </button>
            </div>
            
            <p style="color: #444; font-size: 0.8rem; margin-top: 20px;">
                Tiempo en página: <span id="timeOnPage">0</span> segundos
            </p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animación de entrada
    setTimeout(() => {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('div').style.transform = 'scale(1)';
        }, 50);
    }, 10);
    
    // Botón: Contáctame
    document.getElementById('stayAndContact').addEventListener('click', () => {
        closeExitModal();
        document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            document.getElementById('name').focus();
        }, 800);
    });
    
    // Botón: Descartar
    document.getElementById('dismissExit').addEventListener('click', closeExitModal);
    
    // Cerrar al hacer click fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeExitModal();
    });
    
    // Actualizar tiempo en página
    const timeSpan = document.getElementById('timeOnPage');
    const timeOnPage = setInterval(() => {
        if (timeSpan) {
            const seconds = Math.floor((Date.now() - pageLoadTime) / 1000);
            timeSpan.textContent = seconds;
        }
    }, 1000);
    
    modal.timeInterval = timeOnPage;
}

function closeExitModal() {
    const modal = document.getElementById('exitIntentModal');
    if (modal) {
        modal.style.opacity = '0';
        if (modal.timeInterval) clearInterval(modal.timeInterval);
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
    exitIntentShown = true;
}

function showExitIntent() {
    // No mostrar si ya se mostró, si ya envió, o si no ha pasado tiempo mínimo
    if (exitIntentShown || hasSubmitted) return;
    if ((Date.now() - pageLoadTime) < MIN_TIME_BEFORE_SHOW) return;
    
    createExitModal();
}

// Detectar intención de salida
function setupExitDetection() {
    // 1. Mouse sale por arriba de la ventana
    document.addEventListener('mouseout', (e) => {
        if (e.clientY <= 0 && hasInteracted) {
            showExitIntent();
        }
    });
    
    // 2. Antes de abandonar la página
    window.addEventListener('beforeunload', (e) => {
        if (hasInteracted && !hasSubmitted) {
            showExitIntent();
            // Mostrar confirmación del navegador
            e.preventDefault();
            e.returnValue = '¿Seguro que quieres salir?';
        }
    });
    
    // 3. Detectar cuando el usuario cambia de pestaña
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && hasInteracted && !hasSubmitted) {
            showExitIntent();
        }
    });
    
    // 4. Detectar Alt+F4 o cierre de ventana (menos confiable)
    window.addEventListener('blur', () => {
        if (hasInteracted && !hasSubmitted) {
            showExitIntent();
        }
    });
}

// Detectar interacción del usuario en cualquier parte
function setupInteractionDetection() {
    const events = ['mousemove', 'scroll', 'keypress', 'click', 'touchstart'];
    events.forEach(event => {
        document.addEventListener(event, () => {
            hasInteracted = true;
        }, { once: true });
    });
}

// Iniciar detección
setupInteractionDetection();
setupExitDetection();

// ============================================
// FORMULARIO DE CONTACTO
// ============================================

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
        hasSubmitted = true; // Marcar como enviado para no mostrar popup
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
