const { sendContactFormEmail } = require('../services/email.service');

const EMAIL_TIMEOUT_MS = 12000;

async function sendContactEmail(payload) {
  const emailPromise = sendContactFormEmail(payload);
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => resolve({ sent: false, reason: 'Email request timed out' }), EMAIL_TIMEOUT_MS);
  });

  return Promise.race([emailPromise, timeoutPromise]);
}

module.exports = { sendContactEmail };