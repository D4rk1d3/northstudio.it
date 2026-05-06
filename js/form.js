/**
 * Contact Form
 * Gestisce il form di contatto
 */

const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    // Validazione base
    if (!data.name || !data.email || !data.subject || !data.message) {
      showFeedback('Compila tutti i campi', 'error');
      return;
    }

    // Disabilita il bottone durante l'invio
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Invio in corso...';

    try {
      // Invia i dati via email (usa un servizio come Formspree, EmailJS, o il tuo backend)
      // Per ora, mostriamo un messaggio di successo
      
      // Simulazione di invio (in produzione, usa un vero servizio)
      await new Promise(resolve => setTimeout(resolve, 1000));

      showFeedback('Messaggio inviato con successo! Ti contatterò presto.', 'success');
      contactForm.reset();
    } catch (error) {
      showFeedback('Errore nell\'invio del messaggio. Riprova.', 'error');
      console.error('Form error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });

  function showFeedback(message, type) {
    if (formFeedback) {
      formFeedback.textContent = message;
      formFeedback.className = `form-feedback ${type}`;
      formFeedback.style.display = 'block';

      // Nascondi il messaggio dopo 5 secondi
      setTimeout(() => {
        formFeedback.style.display = 'none';
      }, 5000);
    }
  }
}
