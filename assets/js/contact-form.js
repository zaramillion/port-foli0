document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  // API URL - will be updated based on environment
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://tayong-portfolio-api.onrender.com'; // This will be your Render API URL

  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Show loading state
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;

      // Clear previous status messages
      if (formStatus) {
        formStatus.textContent = '';
        formStatus.className = '';
      }

      // Get form data
      const formData = {
        name: contactForm.querySelector('#name').value,
        email: contactForm.querySelector('#email').value,
        message: contactForm.querySelector('#message').value
      };

      try {
        // Send form data to backend
        const response = await fetch(`${API_URL}/api/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        // Display success or error message
        if (response.ok && result.success) {
          if (formStatus) {
            formStatus.textContent = result.message;
            formStatus.className = 'success-message';
          }
          // Reset form on success
          contactForm.reset();
        } else {
          if (formStatus) {
            formStatus.textContent = result.message || 'Something went wrong. Please try again.';
            formStatus.className = 'error-message';
          }
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        if (formStatus) {
          formStatus.textContent = 'Failed to connect to the server. Please try again later.';
          formStatus.className = 'error-message';
        }
      } finally {
        // Restore button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
      }
    });
  }
});
