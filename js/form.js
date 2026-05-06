/**
 * FORM.JS
 * Contact form functionality
 * Handles form submission and validation
 * Saves leads to Supabase with device info
 */

function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('.btn-submit');
  const feedback = form.querySelector('.form-feedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Basic validation
    if (!data.name || !data.email || !data.message) {
      showFeedback('Please fill in all required fields', 'error');
      return;
    }

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      // Get device info
      const ipAddress = await getVisitorIP();
      const deviceInfo = deviceDetector.getDeviceInfo();

      // Prepare lead data with device info
      const leadData = {
        nome: data.name,
        email: data.email,
        servizio: data.service || 'Non specificato',
        messaggio: data.message,
        ip_address: ipAddress,
        device_brand: deviceInfo.brand,
        device_model: deviceInfo.model,
        browser: deviceDetector.getBrowser(),
        os: deviceDetector.getOS()
      };

      // Save to Supabase
      const success = await supabase.insertLead(leadData);

      if (success) {
        showFeedback('Message sent successfully!', 'success');
        form.reset();
      } else {
        showFeedback('Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Form error:', error);
      showFeedback('An error occurred. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send';
    }
  });

  function showFeedback(message, type) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = 'form-feedback ' + type;
    setTimeout(() => {
      feedback.className = 'form-feedback';
    }, 5000);
  }


// Initialize form when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}
