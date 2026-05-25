/* ==============================
   DentalAI — Runtime Configuration
   Reads from Vite env (VITE_*) with fallbacks
   ============================== */
const DentalAIConfig = (() => {
  // Vite exposes VITE_* vars via import.meta.env
  // Fallbacks work when running without Vite (e.g., direct file open)
  const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

  function get(key, fallback) {
    return env[`VITE_${key}`] || fallback;
  }

  return {
    APP_NAME: get('APP_NAME', 'DentalAI'),
    APP_URL: get('APP_URL', 'http://localhost:8080'),
    SUPPORT_EMAIL: get('SUPPORT_EMAIL', 'privacy@dentalai.co.ke'),
    CLINIC_NAME: get('CLINIC_NAME', 'Nairobi Dental Care'),
    CLINIC_PHONE: get('CLINIC_PHONE', '+254 700 123 456'),
    EMERGENCY_PHONE: get('EMERGENCY_PHONE', '0800 720 571'),
    SMS_SENDER_ID: get('SMS_SENDER_ID', 'DentalAI'),
    AFRICASTALKING_USERNAME: get('AFRICASTALKING_USERNAME', 'sandbox'),
    AFRICASTALKING_API_KEY: get('AFRICASTALKING_API_KEY', ''),
    MPESA_CONSUMER_KEY: get('MPESA_CONSUMER_KEY', ''),
    MPESA_CONSUMER_SECRET: get('MPESA_CONSUMER_SECRET', ''),
    MPESA_SHORTCODE: get('MPESA_SHORTCODE', '174379'),
    ENABLE_AI_ASSISTANT: get('ENABLE_AI_ASSISTANT', 'true') === 'true',
    ENABLE_WHATSAPP: get('ENABLE_WHATSAPP_CAMPAIGNS', 'true') === 'true',
    ENABLE_MPESA: get('ENABLE_MPESA', 'true') === 'true',
  };
})();
