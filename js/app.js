/* ==============================
   DENTALAI — Core Application
   ============================== */
const DentalAI = (() => {
  'use strict';

  // ---------- State ----------
  const state = {
    currentPage: 'landing',
    onboardingStep: 1,
    consentCheck1: false,
    consentCheck2: false,
    consentOtp: '',
    emergencyDetected: false,
  };

  // ---------- Sample Data ----------
  const todayAppts = [
    { time: '08:00', patient: 'Grace Wanjiku', treatment: 'Cleaning', status: 'confirmed' },
    { time: '09:30', patient: 'James Omondi', treatment: 'Filling', status: 'confirmed' },
    { time: '11:00', patient: 'Sarah Nyambura', treatment: 'Extraction', status: 'pending' },
    { time: '13:30', patient: 'Peter Kiplagat', treatment: 'Consultation', status: 'confirmed' },
    { time: '15:00', patient: 'Faith Njeri', treatment: 'Whitening', status: 'completed' },
  ];

  const patients = [
    { name: 'Grace Wanjiku', age: 32, phone: '+254 712 345 678', lastVisit: '12 Mar 2026', visits: 8, id: 1 },
    { name: 'James Omondi', age: 45, phone: '+254 723 456 789', lastVisit: '10 Mar 2026', visits: 3, id: 2 },
    { name: 'Sarah Nyambura', age: 28, phone: '+254 734 567 890', lastVisit: '08 Mar 2026', visits: 12, id: 3 },
    { name: 'Peter Kiplagat', age: 54, phone: '+254 745 678 901', lastVisit: '05 Mar 2026', visits: 6, id: 4 },
    { name: 'Faith Njeri', age: 35, phone: '+254 756 789 012', lastVisit: '01 Mar 2026', visits: 15, id: 5 },
    { name: 'David Mwangi', age: 41, phone: '+254 767 890 123', lastVisit: '28 Feb 2026', visits: 2, id: 6 },
    { name: 'Mary Akinyi', age: 29, phone: '+254 778 901 234', lastVisit: '25 Feb 2026', visits: 5, id: 7 },
    { name: 'John Kamau', age: 38, phone: '+254 789 012 345', lastVisit: '20 Feb 2026', visits: 9, id: 8 },
  ];

  let invoices = [
    { id: 'INV-001', patient: 'Grace Wanjiku', treatment: 'Cleaning', amount: 'KES 2,500', method: 'M-Pesa', status: 'paid', date: '12 Mar 2026' },
    { id: 'INV-002', patient: 'James Omondi', treatment: 'Filling', amount: 'KES 4,000', method: 'Cash', status: 'paid', date: '10 Mar 2026' },
    { id: 'INV-003', patient: 'Sarah Nyambura', treatment: 'Extraction', amount: 'KES 6,000', method: 'M-Pesa', status: 'pending', date: '08 Mar 2026' },
    { id: 'INV-004', patient: 'Peter Kiplagat', treatment: 'Consultation', amount: 'KES 1,500', method: 'Cash', status: 'paid', date: '05 Mar 2026' },
    { id: 'INV-005', patient: 'Faith Njeri', treatment: 'Whitening', amount: 'KES 8,000', method: 'M-Pesa', status: 'overdue', date: '01 Mar 2026' },
    { id: 'INV-006', patient: 'David Mwangi', treatment: 'Cleaning', amount: 'KES 2,500', method: 'M-Pesa', status: 'pending', date: '28 Feb 2026' },
  ];

  // Messages data (contact form, chat, SMS)
  let messages = [
    { id: 1, name: 'Margaret Chebet', email: 'margaret@email.com', phone: '+254 712 111 222', message: 'I would like to book a cleaning appointment for next Tuesday morning. Please let me know available slots.', date: '24 Mar 2026', source: 'Contact Form', status: 'new', reply: null },
    { id: 2, name: 'Kevin Ochieng', email: 'kevin@email.com', phone: '+254 723 333 444', message: 'Hi, I have a toothache that has been bothering me for 3 days. Can I get an emergency appointment today?', date: '23 Mar 2026', source: 'Chat', status: 'read', reply: 'Dear Kevin, we have an emergency slot available at 2:00 PM today. Please come in. - Dr. Kamau' },
    { id: 3, name: 'Susan Wairimu', phone: '+254 734 555 666', message: 'Reminder confirmed. Will attend my 10AM appointment tomorrow.', date: '22 Mar 2026', source: 'SMS', status: 'read', reply: null },
    { id: 4, name: 'Patrick Muthui', email: 'patrick@email.com', phone: '+254 745 777 888', message: 'I need to reschedule my appointment from Friday to Monday next week. Is that possible?', date: '21 Mar 2026', source: 'Contact Form', status: 'new', reply: null },
    { id: 5, name: 'Jane Wanjeri', phone: '+254 756 999 000', message: 'How much does a teeth whitening procedure cost?', date: '20 Mar 2026', source: 'Chat', status: 'read', reply: 'Hi Jane, our whitening procedure is KES 8,000. We offer a 10% discount for first-time patients. - Dr. Kamau' },
  ];

  let notificationCount = messages.filter(m => m.status === 'new').length + 3; // 3 existing + new messages

  // ---------- Emergency Keywords ----------
  const EMERGENCY_KEYWORDS = [
    'uncontrolled bleeding', 'severe swelling', 'airway', "can't breathe",
    'cannot breathe', 'lockjaw', 'fever and swelling', 'unconscious', 'seizure'
  ];

  // ---------- Router ----------
  function navigate(page, params = {}) {
    state.currentPage = page;
    render();
    window.scrollTo(0, 0);
  }

  // ---------- Render ----------
  function render() {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = '';
    app.className = 'fade-in';

    switch (state.currentPage) {
      // Public pages
      case 'landing': app.appendChild(renderLanding()); break;
      case 'login': app.appendChild(renderAuth('login')); break;
      case 'register': app.appendChild(renderAuth('register')); break;
      case 'onboarding': app.appendChild(renderOnboarding()); break;
      case 'contact': app.appendChild(renderPublicLayout('contact')); break;
      case 'book-appointment': app.appendChild(renderPublicLayout('book-appointment')); break;
      case 'chat': app.appendChild(renderPublicLayout('chat')); break;
      case 'privacy': app.appendChild(renderLegal('privacy')); break;
      case 'terms': app.appendChild(renderLegal('terms')); break;
      // Dashboard pages
      case 'dashboard': app.appendChild(renderDashboardLayout('dashboard')); break;
      case 'appointments': app.appendChild(renderDashboardLayout('appointments')); break;
      case 'patients': app.appendChild(renderDashboardLayout('patients')); break;
      case 'billing': app.appendChild(renderDashboardLayout('billing')); break;
      case 'campaigns': app.appendChild(renderDashboardLayout('campaigns')); break;
      case 'messages': app.appendChild(renderDashboardLayout('messages')); break;
      case 'ai-assistant': app.appendChild(renderDashboardLayout('ai-assistant')); break;
      case 'settings': app.appendChild(renderDashboardLayout('settings')); break;
      default: app.appendChild(renderLanding());
    }
  }

  // ============================================================
  // PUBLIC LAYOUT (header/footer for public pages)
  // ============================================================

  function renderPublicLayout(page) {
    const wrapper = ce('div');
    wrapper.innerHTML = `
      <nav class="landing-nav">
        <div class="nav-logo"><span>Dental</span>AI</div>
        <div class="nav-links">
          <a href="#" onclick="DentalAI.navigate('landing')">Home</a>
          <a href="#" onclick="DentalAI.navigate('contact')">Contact</a>
          <a href="#" onclick="DentalAI.navigate('chat')">Chat with Clinic</a>
          <a href="#" onclick="DentalAI.navigate('login')">Login</a>
          <button class="btn btn-primary" onclick="DentalAI.navigate('register')">Get Started</button>
        </div>
      </nav>
    `;

    const content = ce('div');
    let innerHTML = '';

    if (page === 'contact') {
      innerHTML = `
        <div style="max-width:700px;margin:60px auto;padding:0 24px">
          <h1 style="font-size:36px;font-weight:800;margin-bottom:8px">Contact Us</h1>
          <p style="color:var(--gray-500);margin-bottom:32px">Have a question or need to reach the clinic? Send us a message and we'll get back to you within 24 hours.</p>
          <div class="card" style="padding:32px">
            <div class="form-group"><label>Full Name</label><input type="text" id="contactName" placeholder="Your full name" /></div>
            <div class="form-group"><label>Email Address</label><input type="email" id="contactEmail" placeholder="your@email.com" /></div>
            <div class="form-group"><label>Phone Number</label><input type="tel" id="contactPhone" placeholder="+254 7XX XXX XXX" /></div>
            <div class="form-group"><label>Message</label><textarea id="contactMsg" placeholder="How can we help you?" rows="4"></textarea></div>
            <button class="btn btn-primary" onclick="DentalAI.submitContact()"><i class="fas fa-paper-plane"></i> Send Message</button>
            <div id="contactSuccess" style="display:none;margin-top:16px;padding:16px;background:var(--green-100);border-radius:8px;color:#166534">
              <i class="fas fa-check-circle"></i> Your message has been sent. We'll respond within 24 hours.
            </div>
          </div>
        </div>
      `;
    } else if (page === 'book-appointment') {
      innerHTML = `
        <div style="max-width:600px;margin:60px auto;padding:0 24px">
          <h1 style="font-size:36px;font-weight:800;margin-bottom:8px">Book an Appointment</h1>
          <p style="color:var(--gray-500);margin-bottom:32px">Fill in the form below and we'll confirm your appointment.</p>
          <div class="card" style="padding:32px">
            <div class="form-group"><label>Full Name</label><input type="text" id="bookName" placeholder="Your full name" /></div>
            <div class="form-group"><label>Phone Number</label><input type="tel" id="bookPhone" placeholder="+254 7XX XXX XXX" /></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div class="form-group"><label>Preferred Date</label><input type="date" id="bookDate" /></div>
              <div class="form-group"><label>Preferred Time</label><input type="time" id="bookTime" /></div>
            </div>
            <div class="form-group"><label>Treatment</label>
              <select id="bookTreatment"><option>Cleaning</option><option>Extraction</option><option>Filling</option><option>Whitening</option><option>Consultation</option><option>Check-up</option></select>
            </div>
            <button class="btn btn-primary" onclick="DentalAI.submitBooking()"><i class="fas fa-calendar-check"></i> Request Appointment</button>
            <div id="bookSuccess" style="display:none;margin-top:16px;padding:16px;background:var(--green-100);border-radius:8px;color:#166534">
              <i class="fas fa-check-circle"></i> Appointment request submitted! We'll confirm your slot shortly.
            </div>
          </div>
        </div>
      `;
    } else if (page === 'chat') {
      innerHTML = `
        <div style="max-width:600px;margin:60px auto;padding:0 24px">
          <h1 style="font-size:36px;font-weight:800;margin-bottom:8px">Chat with the Clinic</h1>
          <p style="color:var(--gray-500);margin-bottom:32px">Send a message to Nairobi Dental Care. A staff member will respond during clinic hours.</p>
          <div class="card" style="padding:32px">
            <div class="form-group"><label>Your Name</label><input type="text" id="chatName" placeholder="Your full name" /></div>
            <div class="form-group"><label>Phone Number</label><input type="tel" id="chatPhone" placeholder="+254 7XX XXX XXX" /></div>
            <div class="form-group"><label>Your Message</label><textarea id="chatMsg" placeholder="Type your message here..." rows="4"></textarea></div>
            <button class="btn btn-primary" onclick="DentalAI.submitChat()"><i class="fas fa-comment"></i> Send Message</button>
            <div id="chatSuccess" style="display:none;margin-top:16px;padding:16px;background:var(--green-100);border-radius:8px;color:#166534">
              <i class="fas fa-check-circle"></i> Your message has been sent. The clinic will respond within 24 hours.
            </div>
          </div>
        </div>
      `;
    }

    content.innerHTML = innerHTML;
    wrapper.appendChild(content);

    // Footer
    const footer = ce('footer', 'landing-footer');
    footer.innerHTML = `
      <div class="footer-links">
        <a href="#" onclick="DentalAI.navigate('landing')">Home</a>
        <a href="#" onclick="DentalAI.navigate('contact')">Contact Us</a>
        <a href="#" onclick="DentalAI.navigate('chat')">Chat with Clinic</a>
        <a href="#" onclick="DentalAI.navigate('book-appointment')">Book Appointment</a>
        <a href="#" onclick="DentalAI.navigate('privacy')">Privacy Policy</a>
        <a href="#" onclick="DentalAI.navigate('terms')">Terms & Conditions</a>
      </div>
      <p>© 2026 DentalAI. Built in Kenya.</p>
    `;
    wrapper.appendChild(footer);

    return wrapper;
  }

  // ============================================================
  // LANDING PAGE
  // ============================================================

  function renderLanding() {
    const page = ce('div', 'landing-page');

    const nav = ce('nav', 'landing-nav');
    nav.innerHTML = `
      <div class="nav-logo"><span>Dental</span>AI</div>
      <div class="nav-links" id="navLinks">
        <a href="#" data-nav="features">Features</a>
        <a href="#" data-nav="pricing">Pricing</a>
        <a href="#" onclick="DentalAI.navigate('login')">Login</a>
        <button class="btn btn-primary" onclick="DentalAI.navigate('register')">Get Started</button>
      </div>
      <button class="mobile-menu-btn" style="display:none" onclick="document.getElementById('navLinks').classList.toggle('mobile-open')">
        <i class="fas fa-bars"></i>
      </button>
    `;
    page.appendChild(nav);

    const hero = ce('div', 'hero');
    hero.innerHTML = `
      <div class="hero-content">
        <h1>The Smartest Way to Run Your Dental Clinic</h1>
        <p>Appointments, patients, billing, and AI — all in one place. Built for Kenya.</p>
        <div class="hero-buttons">
          <button class="btn btn-primary btn-lg" onclick="DentalAI.navigate('register')">Start Free Trial</button>
          <button class="btn btn-outline btn-lg"><i class="fas fa-play"></i> Watch Demo</button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-visual-inner">
          <i class="fas fa-tooth"></i>
          <p>Clinic Management Dashboard Preview</p>
        </div>
      </div>
    `;
    page.appendChild(hero);

    const featuresSection = ce('div', 'section', 'features');
    featuresSection.innerHTML = `
      <div class="section-label">Features</div>
      <h2 class="section-title">Everything you need to run your clinic</h2>
      <p class="section-sub">Manage appointments, patients, billing, and more with one integrated platform.</p>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon"><i class="fas fa-calendar-check"></i></div>
          <h3>Appointment Booking</h3>
          <p>Schedule, reschedule, and manage appointments with a simple calendar interface.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="fas fa-notes-medical"></i></div>
          <h3>Patient Records</h3>
          <p>Store complete dental histories, treatment notes, and medical alerts securely.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="fas fa-mobile-alt"></i></div>
          <h3>M-Pesa Billing</h3>
          <p>Accept payments via M-Pesa, generate invoices, and track revenue effortlessly.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="fas fa-sms"></i></div>
          <h3>SMS Reminders</h3>
          <p>Send automated appointment reminders and follow-ups to reduce no-shows.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="fas fa-robot"></i></div>
          <h3>AI Assistant</h3>
          <p>Get AI-powered insights, draft SMS messages, and analyze clinic performance.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i class="fas fa-comments"></i></div>
          <h3>Patient Communication</h3>
          <p>Contact forms, live chat, and two-way SMS to keep in touch with your patients.</p>
        </div>
      </div>
    `;
    page.appendChild(featuresSection);

    const pricingSection = ce('div', 'section', 'pricing');
    pricingSection.innerHTML = `
      <div class="section-label">Pricing</div>
      <h2 class="section-title">Simple, transparent pricing</h2>
      <p class="section-sub">Choose the plan that fits your clinic. No hidden fees. Cancel anytime.</p>
      <div class="pricing-grid">
        <div class="pricing-card">
          <h3>Starter</h3>
          <div class="pricing-price">KES 2,500 <span>/mo</span></div>
          <p class="pricing-desc">Perfect for solo practitioners</p>
          <ul class="pricing-features">
            <li><i class="fas fa-check"></i> Up to 1 dental chair</li>
            <li><i class="fas fa-check"></i> Up to 200 patients</li>
            <li><i class="fas fa-check"></i> M-Pesa billing</li>
            <li><i class="fas fa-check"></i> SMS reminders</li>
            <li><i class="fas fa-check"></i> Basic analytics</li>
          </ul>
          <button class="btn btn-outline" style="width:100%" onclick="DentalAI.navigate('register')">Get Started</button>
        </div>
        <div class="pricing-card featured">
          <div class="pricing-badge">Most Popular</div>
          <h3>Growth</h3>
          <div class="pricing-price">KES 5,000 <span>/mo</span></div>
          <p class="pricing-desc">Ideal for growing clinics</p>
          <ul class="pricing-features">
            <li><i class="fas fa-check"></i> Up to 5 dental chairs</li>
            <li><i class="fas fa-check"></i> Unlimited patients</li>
            <li><i class="fas fa-check"></i> M-Pesa billing</li>
            <li><i class="fas fa-check"></i> SMS + Email reminders</li>
            <li><i class="fas fa-check"></i> AI Assistant access</li>
            <li><i class="fas fa-check"></i> Patient communication tools</li>
          </ul>
          <button class="btn btn-primary" style="width:100%" onclick="DentalAI.navigate('register')">Get Started</button>
        </div>
        <div class="pricing-card">
          <h3>Enterprise</h3>
          <div class="pricing-price">Custom</div>
          <p class="pricing-desc">For large practices & chains</p>
          <ul class="pricing-features">
            <li><i class="fas fa-check"></i> Unlimited chairs</li>
            <li><i class="fas fa-check"></i> Unlimited patients</li>
            <li><i class="fas fa-check"></i> All billing integrations</li>
            <li><i class="fas fa-check"></i> Dedicated account manager</li>
            <li><i class="fas fa-check"></i> Priority support</li>
            <li><i class="fas fa-check"></i> Custom integrations</li>
          </ul>
          <button class="btn btn-outline" style="width:100%">Contact Sales</button>
        </div>
      </div>
    `;
    page.appendChild(pricingSection);

    // Footer with patient links
    const footer = ce('footer', 'landing-footer');
    footer.innerHTML = `
      <div class="footer-links">
        <a href="#" onclick="DentalAI.navigate('contact')">Contact Us</a>
        <a href="#" onclick="DentalAI.navigate('chat')">Chat with Clinic</a>
        <a href="#" onclick="DentalAI.navigate('book-appointment')">Book Appointment</a>
        <a href="#" onclick="DentalAI.navigate('privacy')">Privacy Policy</a>
        <a href="#" onclick="DentalAI.navigate('terms')">Terms & Conditions</a>
      </div>
      <p>© 2026 DentalAI. Built in Kenya.</p>
    `;
    page.appendChild(footer);

    return page;
  }

  // ============================================================
  // AUTH PAGES
  // ============================================================

  function renderAuth(type) {
    const page = ce('div', 'auth-page');
    const card = ce('div', 'auth-card');

    if (type === 'login') {
      card.innerHTML = `
        <h2>Welcome back</h2>
        <p class="auth-sub">Sign in to your DentalAI account</p>
        <div class="form-group">
          <label>Email address</label>
          <input type="email" placeholder="you@clinic.co.ke" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" />
        </div>
        <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="DentalAI.navigate('dashboard')">
          Sign In
        </button>
        <div class="auth-footer">
          Don't have an account? <a href="#" onclick="DentalAI.navigate('register')">Register</a>
        </div>
      `;
    } else {
      card.innerHTML = `
        <h2>Create your account</h2>
        <p class="auth-sub">Start your free trial — no credit card required</p>
        <div class="form-group">
          <label>Clinic Name</label>
          <input type="text" placeholder="e.g. Nairobi Dental Care" />
        </div>
        <div class="form-group">
          <label>Doctor's Full Name</label>
          <input type="text" placeholder="Dr. John Kamau" />
        </div>
        <div class="form-group">
          <label>Email address</label>
          <input type="email" placeholder="john@clinic.co.ke" />
        </div>
        <div class="form-group">
          <label>Phone number</label>
          <input type="tel" placeholder="+254 7XX XXX XXX" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" placeholder="Create a strong password" />
        </div>
        <p style="font-size:12px;color:var(--gray-400);margin-bottom:16px;line-height:1.5">
          By creating an account, you agree to our <a href="#" onclick="DentalAI.navigate('terms')" style="color:var(--primary-blue)">Terms</a> and <a href="#" onclick="DentalAI.navigate('privacy')" style="color:var(--primary-blue)">Privacy Policy</a>.
        </p>
        <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="DentalAI.navigate('onboarding')">
          Create Account
        </button>
        <div class="auth-footer">
          Already have an account? <a href="#" onclick="DentalAI.navigate('login')">Sign in</a>
        </div>
      `;
    }

    page.appendChild(card);
    return page;
  }

  // ============================================================
  // ONBOARDING WIZARD
  // ============================================================

  function renderOnboarding() {
    const page = ce('div', 'onboarding-page');
    const card = ce('div', 'onboarding-card');

    const totalSteps = 3;
    const step = state.onboardingStep || 1;

    const progressHTML = `
      <div class="progress-bar">
        <div class="progress-step ${step > 1 ? 'completed' : step === 1 ? 'active' : ''}">${step > 1 ? '<i class="fas fa-check"></i>' : '1'}</div>
        <div class="progress-line ${step > 1 ? 'completed' : ''}"></div>
        <div class="progress-step ${step > 2 ? 'completed' : step === 2 ? 'active' : ''}">${step > 2 ? '<i class="fas fa-check"></i>' : '2'}</div>
        <div class="progress-line ${step > 2 ? 'completed' : ''}"></div>
        <div class="progress-step ${step > 3 ? 'completed' : step === 3 ? 'active' : ''}">${step > 3 ? '<i class="fas fa-check"></i>' : '3'}</div>
      </div>
    `;

    let stepHTML = '';

    if (step === 1) {
      stepHTML = `
        <div class="onboarding-step">
          <h3>Tell us about your clinic</h3>
          <p class="step-sub">Help us set up your clinic profile</p>
          <div class="form-group">
            <label>Clinic Address</label>
            <input type="text" placeholder="e.g. Moi Avenue, Nairobi" id="onboard-address" />
          </div>
          <div class="form-group">
            <label>County</label>
            <select id="onboard-county">
              <option>Nairobi</option>
              <option>Mombasa</option>
              <option>Kisumu</option>
              <option>Nakuru</option>
              <option>Eldoret</option>
              <option>Thika</option>
              <option>Machakos</option>
            </select>
          </div>
          <div class="form-group">
            <label>Number of Dental Chairs</label>
            <input type="number" min="1" max="20" value="2" id="onboard-chairs" />
          </div>
          <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:16px" onclick="DentalAI.nextOnboardingStep()">
            Continue <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      `;
    } else if (step === 2) {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      let daysHTML = '';
      days.forEach((d, i) => {
        const checked = i < 6 ? 'checked' : '';
        daysHTML += `
          <label class="checkbox-label">
            <input type="checkbox" ${checked} />
            <span class="check-box"><i class="fas fa-check"></i></span>
            ${d}
          </label>
        `;
      });
      stepHTML = `
        <div class="onboarding-step">
          <h3>Set your working hours</h3>
          <p class="step-sub">When is your clinic open?</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
            <div class="form-group">
              <label>Opening Time</label>
              <input type="time" value="08:00" id="onboard-open" />
            </div>
            <div class="form-group">
              <label>Closing Time</label>
              <input type="time" value="17:00" id="onboard-close" />
            </div>
          </div>
          <label style="display:block;font-size:14px;font-weight:600;margin-bottom:10px">Working Days</label>
          <div class="checkbox-grid">${daysHTML}</div>
          <button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:24px" onclick="DentalAI.nextOnboardingStep()">
            Continue <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      `;
    } else if (step === 3) {
      stepHTML = `
        <div class="onboarding-step success-screen">
          <div class="success-icon"><i class="fas fa-check"></i></div>
          <h3>You're all set!</h3>
          <p>Welcome to DentalAI! Your clinic is ready. Start managing appointments, patients, and more.</p>
          <button class="btn btn-primary btn-lg" onclick="DentalAI.navigate('dashboard')">
            <i class="fas fa-rocket"></i> Go to Dashboard
          </button>
        </div>
      `;
    }

    card.innerHTML = progressHTML + stepHTML;
    page.appendChild(card);
    return page;
  }

  // ============================================================
  // DASHBOARD LAYOUT
  // ============================================================

  function renderDashboardLayout(activePage) {
    const page = ce('div', 'dashboard-page');

    const sidebarItems = [
      { page: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
      { page: 'appointments', icon: 'fa-calendar-check', label: 'Appointments' },
      { page: 'patients', icon: 'fa-users', label: 'Patients' },
      { page: 'billing', icon: 'fa-coins', label: 'Billing' },
      { page: 'campaigns', icon: 'fa-megaphone', label: 'Campaigns' },
      { page: 'messages', icon: 'fa-inbox', label: 'Messages' },
      { page: 'ai-assistant', icon: 'fa-robot', label: 'AI Assistant' },
      { page: 'settings', icon: 'fa-cog', label: 'Settings' },
    ];

    const sidebar = ce('div', 'sidebar');
    let sidebarHTML = `<div class="sidebar-logo"><span>D</span>entalAI</div><nav class="sidebar-nav">`;
    sidebarItems.forEach(item => {
      const active = item.page === activePage ? 'active' : '';
      sidebarHTML += `<a href="#" class="${active}" onclick="DentalAI.navigate('${item.page}')">
        <i class="fas ${item.icon}"></i><span>${item.label}</span>
      </a>`;
    });
    sidebarHTML += `</nav>`;
    sidebar.innerHTML = sidebarHTML;
    page.appendChild(sidebar);

    const main = ce('div', 'main-content');
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const pageTitles = {
      dashboard: 'Dashboard', appointments: 'Appointments', patients: 'Patients',
      billing: 'Billing', campaigns: 'Campaigns', messages: 'Messages',
      'ai-assistant': 'AI Assistant', settings: 'Settings'
    };

    const topBar = ce('div', 'top-bar');
    topBar.innerHTML = `
      <div class="top-bar-left">
        <h2>${pageTitles[activePage] || 'Dashboard'}</h2>
      </div>
      <div class="top-bar-right">
        <span class="top-bar-date">${dateStr}</span>
        <div style="position:relative">
          <button class="notification-bell" onclick="this.nextElementSibling.classList.toggle('show')">
            <i class="fas fa-bell"></i>
            <span class="notification-badge">${notificationCount}</span>
          </button>
          <div class="notifications-panel">
            <div class="notif-item"><div class="notif-title">New appointment booked</div><div class="notif-time">2 min ago</div></div>
            <div class="notif-item"><div class="notif-title">M-Pesa payment received</div><div class="notif-time">15 min ago</div></div>
            <div class="notif-item"><div class="notif-title">SMS reminder sent</div><div class="notif-time">1 hour ago</div></div>
            ${messages.filter(m => m.status === 'new').slice(0, 2).map(m => `
              <div class="notif-item"><div class="notif-title">New message from ${m.name}</div><div class="notif-time">via ${m.source}</div></div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    main.appendChild(topBar);

    const content = ce('div', 'page-content');

    switch (activePage) {
      case 'dashboard': content.appendChild(renderDashboardHome()); break;
      case 'appointments': content.appendChild(renderAppointments()); break;
      case 'patients': content.appendChild(renderPatients()); break;
      case 'billing': content.appendChild(renderBilling()); break;
      case 'campaigns': content.appendChild(renderCampaigns()); break;
      case 'messages': content.appendChild(renderMessages()); break;
      case 'ai-assistant': content.appendChild(renderAIAssistant()); break;
      case 'settings': content.appendChild(renderSettings()); break;
    }

    main.appendChild(content);
    page.appendChild(main);
    return page;
  }

  // ============================================================
  // DASHBOARD HOME
  // ============================================================

  function renderDashboardHome() {
    const wrapper = ce('div');
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const newMsgCount = messages.filter(m => m.status === 'new').length;

    wrapper.innerHTML = `
      <div class="greeting">${greeting}, Dr. Kamau 👋</div>
      <div class="greeting-date">${new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background:#DBEAFE;color:var(--primary-blue)"><i class="fas fa-calendar-check"></i></div>
          <div class="stat-value">8</div>
          <div class="stat-label">Today's Appointments</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#DCFCE7;color:var(--green-500)"><i class="fas fa-users"></i></div>
          <div class="stat-value">143</div>
          <div class="stat-label">Total Patients</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#FEF9C3;color:#CA8A04"><i class="fas fa-coins"></i></div>
          <div class="stat-value">KES 48,200</div>
          <div class="stat-label">Revenue This Month</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#FEE2E2;color:var(--red-500)"><i class="fas fa-envelope"></i></div>
          <div class="stat-value">${newMsgCount}</div>
          <div class="stat-label">New Messages</div>
        </div>
      </div>

      <div class="dashboard-two-col">
        <div class="card">
          <div class="card-header">
            <h3>Today's Appointments</h3>
            <button class="btn btn-sm btn-primary" onclick="DentalAI.navigate('appointments')">View All</button>
          </div>
          <div class="card-body">
            <table class="table">
              <thead><tr><th>Time</th><th>Patient</th><th>Treatment</th><th>Status</th></tr></thead>
              <tbody>
                ${todayAppts.map(a => {
                  const badgeClass = a.status === 'confirmed' ? 'badge-green' : a.status === 'pending' ? 'badge-yellow' : 'badge-blue';
                  return `<tr><td>${a.time}</td><td style="font-weight:600">${a.patient}</td><td>${a.treatment}</td><td><span class="badge ${badgeClass}">${a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span></td></tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h3>Recent Messages</h3></div>
          <div class="card-body">
            ${messages.slice(0, 4).map(m => `
              <div class="patient-list-item" style="cursor:pointer" onclick="DentalAI.navigate('messages')">
                <span class="patient-name">${m.name} <span style="font-size:11px;color:var(--gray-400)">· ${m.source}</span></span>
                <span class="patient-date" style="${m.status === 'new' ? 'color:var(--primary-blue);font-weight:600' : ''}">${m.status === 'new' ? 'New' : 'Read'}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    return wrapper;
  }

  // ============================================================
  // APPOINTMENTS PAGE
  // ============================================================

  function renderAppointments() {
    const wrapper = ce('div');
    wrapper.innerHTML = `
      <div class="flex-between mb-24">
        <div class="calendar-nav">
          <button><i class="fas fa-chevron-left"></i></button>
          <span class="month-label">March 2026</span>
          <button><i class="fas fa-chevron-right"></i></button>
        </div>
        <button class="btn btn-primary" onclick="DentalAI.showModal('appointment')">
          <i class="fas fa-plus"></i> New Appointment
        </button>
      </div>

      <div class="calendar-grid">
        ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<div class="calendar-day-header">${d}</div>`).join('')}
        ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31].map(d => `
          <div class="calendar-day ${d === 12 || d === 8 || d === 5 ? 'has-appointment' : ''}">
            <div class="day-number">${d}</div>
            ${d === 12 ? '<span class="day-dot"></span>' : ''}
            ${d === 8 ? '<span class="day-dot"></span>' : ''}
            ${d === 5 ? '<span class="day-dot"></span>' : ''}
          </div>
        `).join('')}
      </div>

      <div class="card appointments-list">
        <div class="card-header">
          <h3>All Appointments</h3>
          <div class="gap-12" style="display:flex">
            <span class="badge badge-green">Confirmed</span>
            <span class="badge badge-yellow">Pending</span>
            <span class="badge badge-red">Cancelled</span>
          </div>
        </div>
        <div class="card-body">
          <table class="table">
            <thead><tr><th>Time</th><th>Patient</th><th>Treatment</th><th>Status</th></tr></thead>
            <tbody>
              ${todayAppts.map(a => {
                const badgeClass = a.status === 'confirmed' ? 'badge-green' : a.status === 'pending' ? 'badge-yellow' : 'badge-red';
                return `<tr><td>${a.time}</td><td style="font-weight:600">${a.patient}</td><td>${a.treatment}</td><td><span class="badge ${badgeClass}">${a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span></td></tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    return wrapper;
  }

  // ============================================================
  // PATIENTS PAGE
  // ============================================================

  function renderPatients() {
    const wrapper = ce('div');
    wrapper.innerHTML = `
      <div class="flex-between mb-24">
        <div class="search-bar" style="margin-bottom:0">
          <input type="text" class="search-input" placeholder="Search patients..." id="patientSearch" oninput="DentalAI.filterPatients(this.value)" />
        </div>
        <button class="btn btn-primary" onclick="DentalAI.showModal('patient')"><i class="fas fa-plus"></i> Add Patient</button>
      </div>
      <div class="card">
        <div class="card-body">
          <table class="table" id="patientsTable">
            <thead><tr><th>Name</th><th>Age</th><th>Phone</th><th>Last Visit</th><th>Total Visits</th></tr></thead>
            <tbody>
              ${patients.map(p => `
                <tr style="cursor:pointer" onclick="DentalAI.showPatientProfile(${p.id})">
                  <td style="font-weight:600">${p.name}</td>
                  <td>${p.age}</td>
                  <td>${p.phone}</td>
                  <td>${p.lastVisit}</td>
                  <td>${p.visits}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
    return wrapper;
  }

  // ============================================================
  // BILLING PAGE with SMS simulation
  // ============================================================

  let billingToast = null;

  function renderBilling() {
    const wrapper = ce('div');
    const totalCollected = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + parseInt(i.amount.replace(/[^0-9]/g, '')), 0);
    const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + parseInt(i.amount.replace(/[^0-9]/g, '')), 0);
    const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, i) => sum + parseInt(i.amount.replace(/[^0-9]/g, '')), 0);

    wrapper.innerHTML = `
      <div class="billing-summary">
        <div class="billing-summary-card">
          <div class="bs-label">Total Collected</div>
          <div class="bs-value" style="color:var(--green-500)">KES ${totalCollected.toLocaleString()}</div>
        </div>
        <div class="billing-summary-card">
          <div class="bs-label">Pending</div>
          <div class="bs-value" style="color:var(--yellow-500)">KES ${totalPending.toLocaleString()}</div>
        </div>
        <div class="billing-summary-card">
          <div class="bs-label">Overdue</div>
          <div class="bs-value" style="color:var(--red-500)">KES ${totalOverdue.toLocaleString()}</div>
        </div>
      </div>

      <div class="flex-between mb-24">
        <h3 style="font-size:16px;font-weight:700">Invoices</h3>
        <button class="btn btn-primary" onclick="DentalAI.showModal('invoice')"><i class="fas fa-plus"></i> New Invoice</button>
      </div>

      <div class="card">
        <div class="card-body">
          <table class="table">
            <thead><tr><th>Invoice #</th><th>Patient</th><th>Treatment</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              ${invoices.map(inv => {
                const badgeClass = inv.status === 'paid' ? 'badge-green' : inv.status === 'pending' ? 'badge-yellow' : 'badge-red';
                const mpesaBadge = inv.method === 'M-Pesa' ? '<span class="mpesa-badge"><i class="fas fa-mobile-alt"></i> M-Pesa</span>' : 'Cash';
                let actionBtn = '';
                if (inv.status === 'pending' || inv.status === 'overdue') {
                  actionBtn = `<button class="btn btn-sm btn-primary" onclick="DentalAI.markAsPaid('${inv.id}')">Mark Paid</button>`;
                } else if (inv.status === 'paid') {
                  actionBtn = `<button class="btn btn-sm btn-outline" onclick="DentalAI.sendReceipt('${inv.id}')"><i class="fas fa-receipt"></i> Send Receipt</button>`;
                }
                return `<tr>
                  <td style="font-weight:600">${inv.id}</td>
                  <td>${inv.patient}</td>
                  <td>${inv.treatment}</td>
                  <td style="font-weight:600">${inv.amount}</td>
                  <td>${mpesaBadge}</td>
                  <td><span class="badge ${badgeClass}">${inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</span></td>
                  <td>${inv.date}</td>
                  <td>${actionBtn}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div id="billingToast" style="display:none"></div>
    `;
    return wrapper;
  }

  function markAsPaid(invoiceId) {
    const inv = invoices.find(i => i.id === invoiceId);
    if (inv) {
      inv.status = 'paid';
      showToast(`✅ Payment received from ${inv.patient}. SMS confirmation sent via M-Pesa.`);
      renderBillingPage();
    }
  }

  function sendReceipt(invoiceId) {
    const inv = invoices.find(i => i.id === invoiceId);
    if (inv) {
      showToast(`📱 Receipt for ${inv.id} (${inv.amount}) sent to ${inv.patient}'s phone.`);
    }
  }

  function showToast(msg) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:var(--deep-blue);color:white;padding:16px 24px;border-radius:12px;font-size:14px;z-index:9999;box-shadow:var(--shadow-xl);animation:fadeIn 0.3s ease';
    toast.innerHTML = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3500);
  }

  function renderBillingPage() {
    const content = document.querySelector('.page-content');
    if (content) {
      content.innerHTML = '';
      content.appendChild(renderBilling());
    }
  }

  // ============================================================
  // MESSAGES / INBOX PAGE
  // ============================================================

  function renderMessages() {
    const wrapper = ce('div');
    const newCount = messages.filter(m => m.status === 'new').length;

    wrapper.innerHTML = `
      <div class="flex-between mb-24">
        <div>
          <h3 style="font-size:18px;font-weight:700">Inbox</h3>
          <p style="font-size:14px;color:var(--gray-500)">${messages.length} total · ${newCount} unread</p>
        </div>
        <div class="gap-12" style="display:flex">
          <span class="badge badge-blue">Contact Form</span>
          <span class="badge badge-green">Chat</span>
          <span class="badge badge-yellow">SMS</span>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <table class="table" id="messagesTable">
            <thead><tr><th>Date</th><th>Patient</th><th>Source</th><th>Message</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              ${messages.map(m => {
                const sourceBadge = m.source === 'Contact Form' ? 'badge-blue' : m.source === 'Chat' ? 'badge-green' : 'badge-yellow';
                return `<tr>
                  <td style="font-size:13px">${m.date}</td>
                  <td style="font-weight:600">${m.name}<br><span style="font-size:12px;color:var(--gray-400)">${m.phone}</span></td>
                  <td><span class="badge ${sourceBadge}">${m.source}</span></td>
                  <td style="max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m.message}</td>
                  <td><span class="badge ${m.status === 'new' ? 'badge-yellow' : 'badge-green'}">${m.status === 'new' ? 'New' : 'Read'}</span></td>
                  <td>
                    <button class="btn btn-sm btn-primary" onclick="DentalAI.viewMessage(${m.id})" style="margin-right:4px"><i class="fas fa-eye"></i></button>
                    ${!m.reply ? `<button class="btn btn-sm btn-outline" onclick="DentalAI.replyToMessage(${m.id})"><i class="fas fa-reply"></i></button>` : `<span style="font-size:12px;color:var(--green-500)"><i class="fas fa-check"></i> Replied</span>`}
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div id="messageModalContainer"></div>
    `;
    return wrapper;
  }

  function viewMessage(id) {
    const m = messages.find(msg => msg.id === id);
    if (!m) return;
    if (m.status === 'new') {
      m.status = 'read';
      notificationCount = messages.filter(msg => msg.status === 'new').length + 3;
    }
    const container = document.getElementById('messageModalContainer') || document.body;
    const overlay = ce('div', 'modal-overlay');
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `
      <div class="modal" style="max-width:550px">
        <h3>Message from ${m.name}</h3>
        <div style="margin-bottom:20px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
            <div><span style="font-size:13px;color:var(--gray-500)">Phone</span><div style="font-weight:600">${m.phone}</div></div>
            <div><span style="font-size:13px;color:var(--gray-500)">Source</span><div><span class="badge ${m.source === 'Contact Form' ? 'badge-blue' : m.source === 'Chat' ? 'badge-green' : 'badge-yellow'}">${m.source}</span></div></div>
            ${m.email ? `<div style="grid-column:span 2"><span style="font-size:13px;color:var(--gray-500)">Email</span><div>${m.email}</div></div>` : ''}
            <div style="grid-column:span 2"><span style="font-size:13px;color:var(--gray-500)">Date</span><div>${m.date}</div></div>
          </div>
          <div style="background:var(--gray-50);padding:16px;border-radius:8px;border-left:3px solid var(--primary-blue)">
            <div style="font-size:13px;color:var(--gray-500);margin-bottom:8px">Message:</div>
            ${m.message}
          </div>
          ${m.reply ? `
            <div style="background:#EFF6FF;padding:16px;border-radius:8px;border-left:3px solid var(--green-500);margin-top:12px">
              <div style="font-size:13px;color:var(--gray-500);margin-bottom:8px">Your Reply:</div>
              ${m.reply}
            </div>
          ` : ''}
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Close</button>
          ${!m.reply ? `<button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove();DentalAI.replyToMessage(${m.id})"><i class="fas fa-reply"></i> Reply</button>` : ''}
        </div>
      </div>
    `;
    container.appendChild(overlay);
  }

  function replyToMessage(id) {
    const m = messages.find(msg => msg.id === id);
    if (!m) return;
    const overlay = ce('div', 'modal-overlay');
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `
      <div class="modal">
        <h3>Reply to ${m.name}</h3>
        <div style="background:var(--gray-50);padding:12px;border-radius:8px;margin-bottom:16px;font-size:14px">
          <strong>Original message:</strong><br>${m.message}
        </div>
        <div class="form-group">
          <label>Your Reply</label>
          <textarea id="replyText" rows="4" placeholder="Type your reply..." style="width:100%;padding:12px;border:1.5px solid var(--gray-200);border-radius:8px;font-size:14px"></textarea>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="DentalAI.sendReply(${id})"><i class="fas fa-paper-plane"></i> Send Reply</button>
        </div>
      </div>
    `;
    document.getElementById('messageModalContainer').appendChild(overlay);
  }

  function sendReply(id) {
    const textarea = document.getElementById('replyText');
    if (!textarea || !textarea.value.trim()) return;
    const m = messages.find(msg => msg.id === id);
    if (m) {
      m.reply = textarea.value.trim();
      m.status = 'read';
      notificationCount = messages.filter(msg => msg.status === 'new').length + 3;
    }
    // Close all overlays
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
    showToast(`✅ Reply sent to ${m.name}`);
    navigate('messages');
  }

  // ============================================================
  // CONTACT / CHAT / BOOKING SUBMISSIONS
  // ============================================================

  function submitContact() {
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const phone = document.getElementById('contactPhone');
    const msg = document.getElementById('contactMsg');
    if (!name || !name.value.trim() || !msg || !msg.value.trim()) return;

    messages.unshift({
      id: messages.length + 1,
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim() || 'N/A',
      message: msg.value.trim(),
      date: new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }),
      source: 'Contact Form',
      status: 'new',
      reply: null
    });
    notificationCount = messages.filter(m => m.status === 'new').length + 3;
    document.getElementById('contactSuccess').style.display = 'block';
    name.value = ''; email.value = ''; phone.value = ''; msg.value = '';
    showToast('📨 Message sent! Check your inbox in the dashboard.');
  }

  function submitBooking() {
    const name = document.getElementById('bookName');
    const phone = document.getElementById('bookPhone');
    const date = document.getElementById('bookDate');
    const time = document.getElementById('bookTime');
    const treatment = document.getElementById('bookTreatment');
    if (!name || !name.value.trim() || !phone || !phone.value.trim()) return;

    const msg = `Appointment request: ${treatment ? treatment.value : 'Check-up'} on ${date ? date.value : 'TBC'} at ${time ? time.value : 'TBC'}`;
    messages.unshift({
      id: messages.length + 1,
      name: name.value.trim(),
      phone: phone.value.trim(),
      message: msg,
      date: new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }),
      source: 'Contact Form',
      status: 'new',
      reply: null
    });
    notificationCount = messages.filter(m => m.status === 'new').length + 3;
    document.getElementById('bookSuccess').style.display = 'block';
    name.value = ''; phone.value = ''; if(date) date.value = ''; if(time) time.value = '';
    showToast('📅 Appointment requested! Check Messages in dashboard.');
  }

  function submitChat() {
    const name = document.getElementById('chatName');
    const phone = document.getElementById('chatPhone');
    const msg = document.getElementById('chatMsg');
    if (!name || !name.value.trim() || !msg || !msg.value.trim()) return;

    messages.unshift({
      id: messages.length + 1,
      name: name.value.trim(),
      phone: phone.value.trim() || 'N/A',
      message: msg.value.trim(),
      date: new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }),
      source: 'Chat',
      status: 'new',
      reply: null
    });
    notificationCount = messages.filter(m => m.status === 'new').length + 3;
    document.getElementById('chatSuccess').style.display = 'block';
    name.value = ''; phone.value = ''; msg.value = '';
    showToast('💬 Message sent! The clinic will respond within 24 hours.');
  }

  // ============================================================
  // AI ASSISTANT PAGE
  // ============================================================

  let aiMessages = [
    { role: 'ai', text: "Hi Dr. Kamau! I'm your DentalAI assistant. I can help you draft SMS reminders, analyze appointment gaps, suggest follow-ups, and answer clinic management questions." },
  ];
  let showConsentGate = true;

  function renderAIAssistant() {
    if (state.emergencyDetected) {
      return renderEmergencyAlert();
    }

    const wrapper = ce('div', 'ai-page');
    const conv = ce('div', 'ai-conversations');
    conv.innerHTML = `
      <h4>Conversations</h4>
      <div class="ai-conv-item active">Today's Chat<div class="conv-date">March 2026</div></div>
      <div class="ai-conv-item">Cancellation Analysis<div class="conv-date">Feb 2026</div></div>
      <div class="ai-conv-item">Patient Follow-ups<div class="conv-date">Jan 2026</div></div>
    `;
    wrapper.appendChild(conv);

    const chat = ce('div', 'ai-chat');
    const messagesDiv = ce('div', 'ai-chat-messages');

    aiMessages.forEach(msg => {
      const el = ce('div', `ai-message ${msg.role}`);
      const avatar = msg.role === 'ai'
        ? '<div class="msg-avatar"><i class="fas fa-robot"></i></div>'
        : '<div class="msg-avatar"><i class="fas fa-user-md"></i></div>';
      el.innerHTML = `${avatar}<div class="msg-bubble">${msg.text}</div>`;
      messagesDiv.appendChild(el);
    });

    chat.appendChild(messagesDiv);

    const footer = ce('div', 'ai-footer');
    footer.innerHTML = `⚠️ DentalAI is a Clinical Decision Support Tool only. It does not provide medical diagnoses or prescriptions. All clinical decisions remain the sole responsibility of the licensed dental practitioner. In case of emergency (uncontrolled bleeding, airway swelling, lockjaw), call 0800 720 571 (Kenya Emergency) immediately.`;
    chat.appendChild(footer);

    const inputArea = ce('div', 'ai-input-area');
    inputArea.innerHTML = `
      <input type="text" placeholder="Type your message..." id="aiInput" />
      <button class="btn btn-primary" onclick="DentalAI.sendAIMessage()"><i class="fas fa-paper-plane"></i></button>
    `;
    chat.appendChild(inputArea);
    wrapper.appendChild(chat);

    const aiContainer = ce('div');
    aiContainer.appendChild(wrapper);

    const suggestions = ce('div', '', 'ai-suggestions');
    suggestions.style.cssText = 'padding:16px 24px;border-top:1px solid var(--gray-200);background:var(--gray-50)';
    suggestions.innerHTML = `
      <div style="font-size:13px;color:var(--gray-500);margin-bottom:8px">Try asking:</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${[
          'Draft an SMS reminder for tomorrow\'s appointments',
          'Which days had the most cancellations this month?',
          'Suggest a follow-up for patients who haven\'t visited in 6 months'
        ].map(q => `
          <button style="padding:8px 14px;background:var(--white);border:1px solid var(--gray-200);border-radius:20px;font-size:13px;cursor:pointer;transition:all 0.2s"
            onclick="DentalAI.sendQuickQuery('${q.replace(/'/g, "\\'")}')"
            onmouseover="this.style.borderColor='var(--primary-blue)'"
            onmouseout="this.style.borderColor='var(--gray-200)'"
          >${q}</button>
        `).join('')}
      </div>
    `;
    aiContainer.appendChild(suggestions);

    if (showConsentGate) {
      const overlay = renderConsentGate();
      aiContainer.appendChild(overlay);
    }

    return aiContainer;
  }

  // ============================================================
  // CONSENT GATE
  // ============================================================

  function renderConsentGate() {
    const overlay = ce('div', 'consent-overlay');
    overlay.id = 'consentOverlay';
    overlay.innerHTML = `
      <div class="consent-modal">
        <h3>Consent Required</h3>
        <p class="consent-summary">
          To use the DentalAI assistant, we need your consent. DentalAI will process health data you enter for scheduling, triage support, and billing purposes. Your data is stored securely in Kenya in compliance with the Data Protection Act (2019).
        </p>
        <div class="consent-checkbox-group">
          <label class="consent-checkbox" id="consent1" onclick="DentalAI.toggleConsent(1)">
            <input type="checkbox" />
            <span class="consent-box"><i class="fas fa-check"></i></span>
            <span class="consent-text">I consent to DentalAI processing my health data for the purpose of scheduling, triage support, and billing, as outlined in the Privacy Policy.</span>
          </label>
          <label class="consent-checkbox" id="consent2" onclick="DentalAI.toggleConsent(2)">
            <input type="checkbox" />
            <span class="consent-box"><i class="fas fa-check"></i></span>
            <span class="consent-text">I understand this AI is not a licensed dentist and does not provide diagnoses or prescriptions.</span>
          </label>
        </div>
        <div class="otp-field">
          <label>Enter the 6-digit code sent to your phone to verify your identity and confirm consent.</label>
          <input type="text" class="otp-input" maxlength="6" placeholder="000000" id="otpInput" oninput="DentalAI.checkConsent()" />
        </div>
        <button class="btn btn-primary" style="width:100%;justify-content:center" id="confirmConsentBtn" disabled onclick="DentalAI.confirmConsent()">
          <i class="fas fa-shield-alt"></i> Confirm & Continue
        </button>
      </div>
    `;
    return overlay;
  }

  // ============================================================
  // EMERGENCY ALERT
  // ============================================================

  function renderEmergencyAlert() {
    const overlay = ce('div', 'emergency-overlay');
    overlay.innerHTML = `
      <div class="emergency-modal">
        <div class="emergency-icon">🚨</div>
        <h2>This sounds like a dental emergency.</h2>
        <p>Please do not wait. Call emergency services immediately.</p>
        <div class="emergency-number">📞 0800 720 571</div>
        <p style="font-size:14px;color:var(--gray-500)">Your clinic has been notified.</p>
        <div style="display:flex;gap:12px;justify-content:center;margin-top:20px;flex-wrap:wrap">
          <button class="btn btn-danger btn-lg" onclick="window.open('tel:0800720571')">
            <i class="fas fa-phone-alt"></i> Call 0800 720 571
          </button>
          <button class="btn btn-outline" onclick="DentalAI.resetEmergency()">
            <i class="fas fa-undo"></i> Reset Session
          </button>
        </div>
      </div>
    `;
    return overlay;
  }

  // ============================================================
  // CAMPAIGNS PAGE
  // ============================================================

  function renderCampaigns() {
    const wrapper = ce('div');
    wrapper.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3>SMS Campaigns</h3>
          <button class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> New Campaign</button>
        </div>
        <div class="card-body" style="padding:32px;text-align:center;color:var(--gray-500)">
          <i class="fas fa-megaphone" style="font-size:48px;color:var(--gray-300);margin-bottom:16px"></i>
          <p style="font-size:16px;font-weight:600;color:var(--gray-600);margin-bottom:8px">No campaigns yet</p>
          <p>Create your first SMS campaign to reach your patients.</p>
        </div>
      </div>
    `;
    return wrapper;
  }

  // ============================================================
  // SETTINGS PAGE with SMS Settings
  // ============================================================

  function renderSettings() {
    const wrapper = ce('div');
    wrapper.innerHTML = `
      <div class="card" style="margin-bottom:24px">
        <div class="card-header"><h3>Clinic Profile</h3></div>
        <div class="card-body" style="padding:24px">
          <div class="form-group"><label>Clinic Name</label><input type="text" value="Nairobi Dental Care" /></div>
          <div class="form-group"><label>Email</label><input type="email" value="info@nairobidental.co.ke" /></div>
          <div class="form-group"><label>Phone</label><input type="tel" value="+254 700 123 456" /></div>
          <button class="btn btn-primary" onclick="DentalAI.showToast('✅ Clinic profile updated')">Save Changes</button>
        </div>
      </div>
      <div class="card" style="margin-bottom:24px">
        <div class="card-header"><h3>M-Pesa Integration</h3></div>
        <div class="card-body" style="padding:24px">
          <div class="form-group"><label>M-Pesa Business Number</label><input type="text" value="247XXX" /></div>
          <div class="form-group"><label>M-Pesa Paybill/Till</label><input type="text" value="123456" /></div>
          <button class="btn btn-primary" onclick="DentalAI.showToast('✅ M-Pesa settings updated')">Update</button>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3>SMS Settings</h3></div>
        <div class="card-body" style="padding:24px">
          <div class="form-group"><label>SMS Sender ID</label><input type="text" value="DentalAI" id="smsSenderId" /></div>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
            <label class="checkbox-label" style="border:none;padding:0">
              <input type="checkbox" checked id="smsAutoReply" />
              <span class="check-box"><i class="fas fa-check"></i></span>
              Enable auto-reply confirmations
            </label>
          </div>
          <button class="btn btn-primary" onclick="DentalAI.showToast('✅ SMS settings saved')">Save SMS Settings</button>
        </div>
      </div>
    `;
    return wrapper;
  }

  // ============================================================
  // LEGAL PAGES
  // ============================================================

  function renderLegal(type) {
    const page = ce('div', 'legal-page');

    if (type === 'privacy') {
      page.innerHTML = `
        <h1>DentalAI Patient Privacy Policy</h1>
        <p class="legal-date">Effective Date: 1 January 2026</p>
        <h2>1. Who We Are</h2>
        <p>DentalAI is operated by [Company Name], a data processor registered with the Office of the Data Protection Commissioner (ODPC) of Kenya under Registration No. [ODPC-REG-XXXXX], pursuant to the Data Protection Act, No. 24 of 2019.</p>
        <h2>2. Data We Collect</h2>
        <p>We collect: full name, date of birth, gender, phone number, email address, dental history, symptom descriptions, appointment records, billing information, and device/usage metadata.</p>
        <h2>3. Lawful Basis for Processing</h2>
        <p>We process your sensitive personal data — including health data — solely on the basis of your explicit, documented, and freely given consent, as required under Section 32 of the Data Protection Act (2019). Consent is obtained via dual-checkbox confirmation and OTP verification prior to any AI interaction. You may withdraw consent at any time by contacting privacy@dentalai.co.ke.</p>
        <h2>4. Data Localization</h2>
        <p>All patient health data collected through DentalAI is stored exclusively on servers physically located within the Republic of Kenya. No health data is transferred outside Kenya's borders without prior written authorization from the ODPC and explicit patient consent, in strict compliance with Section 48 of the Data Protection Act (2019) and the Digital Health Act (2023).</p>
        <h2>5. Patient Rights</h2>
        <p>Under the Data Protection Act (2019), you have the right to:</p>
        <ul>
          <li><strong>(a) Access:</strong> Request a copy of all personal data we hold about you.</li>
          <li><strong>(b) Rectification:</strong> Require correction of any inaccurate or incomplete data.</li>
          <li><strong>(c) Erasure:</strong> Request deletion of your data where there is no lawful basis for continued processing.</li>
          <li><strong>(d) Objection to Automated Decision-Making:</strong> Under Section 35 of the DPA (2019), you have the right to object to any decision made solely by automated means, including AI-generated triage suggestions, that significantly affects you.</li>
        </ul>
        <p>To exercise any right, email: privacy@dentalai.co.ke</p>
        <h2>6. Data Retention & Disposal</h2>
        <p>Patient health records are retained for a minimum of five (5) years following the last patient interaction. Upon expiry, data is permanently deleted using NIST 800-88-compliant erasure protocols.</p>
      `;
    } else {
      page.innerHTML = `
        <h1>DentalAI Clinic Services Agreement</h1>
        <p class="legal-date">Effective Date: 1 January 2026</p>
        <h2>CLAUSE 4 — NATURE OF SERVICE & MEDICAL LIABILITY INDEMNIFICATION</h2>
        <p><strong>4.1</strong> DentalAI is a Clinical Decision Support Tool (CDST). It is not a registered medical practitioner, dentist, or specialist under the Medical Practitioners and Dentists Act (Cap. 253) of Kenya.</p>
        <p><strong>4.2</strong> All outputs generated by DentalAI are informational aids only. They do not constitute a medical diagnosis, clinical opinion, or prescription as defined under Kenyan law.</p>
        <p><strong>4.3</strong> The Clinic retains sole, absolute, and non-delegable clinical and legal liability for all diagnostic, treatment, and prescribing decisions.</p>
        <p><strong>4.4</strong> The Clinic shall indemnify and hold harmless DentalAI from any claim arising from reliance on DentalAI outputs as a substitute for professional clinical judgment.</p>
        <h2>CLAUSE 7 — DATA PROCESSING AGREEMENT</h2>
        <p><strong>7.1</strong> The Clinic is the Data Controller. DentalAI is the Data Processor, processing data solely on the documented instructions of the Clinic.</p>
        <p><strong>7.2</strong> DentalAI shall implement appropriate technical and organisational measures including end-to-end encryption, role-based access controls, and regular penetration testing.</p>
        <p><strong>7.3</strong> DentalAI shall notify the Clinic within 72 hours of becoming aware of any personal data breach, in compliance with Section 43 of the Data Protection Act (2019).</p>
        <h2>CLAUSE 9 — SYSTEM DOWNTIME & EMERGENCY MEDICAL DISCLAIMER</h2>
        <p><strong>9.1</strong> DentalAI does not guarantee uninterrupted availability. Maintenance windows will be communicated 48 hours in advance.</p>
        <p><strong>9.2</strong> DentalAI must not be used as the primary tool for life-threatening maxillo-facial emergencies including Ludwig's angina, uncontrolled post-extraction haemorrhage, or airway compromise.</p>
        <p><strong>9.3</strong> DentalAI accepts no liability for harm arising from use in emergency clinical scenarios.</p>
      `;
    }

    return page;
  }

  // ============================================================
  // PATIENT PROFILE
  // ============================================================

  function renderPatientProfile(patientId) {
    const p = patients.find(pa => pa.id === patientId);
    if (!p) return;

    const wrapper = ce('div');
    wrapper.innerHTML = `
      <div style="margin-bottom:24px">
        <button class="btn btn-outline btn-sm" onclick="DentalAI.navigate('patients')"><i class="fas fa-arrow-left"></i> Back to Patients</button>
      </div>
      <div class="patient-profile">
        <div class="profile-header">
          <div class="profile-avatar">${p.name.charAt(0)}</div>
          <div>
            <h3 style="font-size:22px;font-weight:700">${p.name}</h3>
            <p style="color:var(--gray-500)">${p.age} years · ${p.phone}</p>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:32px">
          <div><span style="font-size:13px;color:var(--gray-500)">Total Visits</span><div style="font-size:22px;font-weight:700">${p.visits}</div></div>
          <div><span style="font-size:13px;color:var(--gray-500)">Last Visit</span><div style="font-size:22px;font-weight:700">${p.lastVisit}</div></div>
          <div><span style="font-size:13px;color:var(--gray-500)">Status</span><div><span class="badge badge-green">Active</span></div></div>
        </div>
        <h4 style="font-size:16px;font-weight:700;margin-bottom:16px">Appointment History</h4>
        <table class="table">
          <thead><tr><th>Date</th><th>Treatment</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td>12 Mar 2026</td><td>Cleaning</td><td>Routine cleaning completed. No issues.</td></tr>
            <tr><td>05 Jan 2026</td><td>Check-up</td><td>Mild plaque buildup. Advised regular flossing.</td></tr>
            <tr><td>18 Nov 2025</td><td>Filling</td><td>Composite filling on tooth #14.</td></tr>
          </tbody>
        </table>
      </div>
    `;
    return wrapper;
  }

  // ============================================================
  // MODALS
  // ============================================================

  function showModal(type) {
    const overlay = ce('div', 'modal-overlay');
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    const modal = ce('div', 'modal');

    if (type === 'appointment') {
      modal.innerHTML = `
        <h3>New Appointment</h3>
        <div class="form-group"><label>Patient Name</label><input type="text" placeholder="Full name" /></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="form-group"><label>Date</label><input type="date" /></div>
          <div class="form-group"><label>Time</label><input type="time" /></div>
        </div>
        <div class="form-group">
          <label>Treatment Type</label>
          <select><option>Cleaning</option><option>Extraction</option><option>Filling</option><option>Whitening</option><option>Consultation</option></select>
        </div>
        <div class="form-group"><label>Notes</label><textarea placeholder="Optional notes..."></textarea></div>
        <div class="modal-actions">
          <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Schedule</button>
        </div>
      `;
    } else if (type === 'patient') {
      modal.innerHTML = `
        <h3>Add Patient</h3>
        <div class="form-group"><label>Full Name</label><input type="text" placeholder="Full name" /></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="form-group"><label>Date of Birth</label><input type="date" /></div>
          <div class="form-group"><label>Gender</label><select><option>Male</option><option>Female</option></select></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="form-group"><label>Phone</label><input type="tel" placeholder="+254 7XX XXX XXX" /></div>
          <div class="form-group"><label>Email</label><input type="email" placeholder="patient@email.com" /></div>
        </div>
        <div class="form-group"><label>Medical Alerts</label><textarea placeholder="Allergies, conditions, etc."></textarea></div>
        <div class="modal-actions">
          <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Add Patient</button>
        </div>
      `;
    } else if (type === 'invoice') {
      modal.innerHTML = `
        <h3>New Invoice</h3>
        <div class="form-group"><label>Patient Name</label><input type="text" placeholder="Full name" /></div>
        <div class="form-group"><label>Treatment</label><input type="text" placeholder="e.g. Cleaning" /></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="form-group"><label>Amount (KES)</label><input type="number" placeholder="2500" /></div>
          <div class="form-group"><label>Payment Method</label><select><option>M-Pesa</option><option>Cash</option></select></div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">Generate Invoice</button>
        </div>
      `;
    }

    overlay.appendChild(modal);
    document.getElementById('app').appendChild(overlay);
  }

  // ============================================================
  // AI FUNCTIONS
  // ============================================================

  function sendAIMessage() {
    const input = document.getElementById('aiInput');
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';

    const lowerText = text.toLowerCase();
    const hasEmergency = EMERGENCY_KEYWORDS.some(kw => lowerText.includes(kw.toLowerCase()));

    if (hasEmergency) {
      state.emergencyDetected = true;
      render();
      return;
    }

    aiMessages.push({ role: 'user', text });
    const response = generateAIResponse(text);
    aiMessages.push({ role: 'ai', text: response });
    navigate('ai-assistant');
  }

  function sendQuickQuery(query) {
    const lowerText = query.toLowerCase();
    const hasEmergency = EMERGENCY_KEYWORDS.some(kw => lowerText.includes(kw.toLowerCase()));

    if (hasEmergency) {
      state.emergencyDetected = true;
      render();
      return;
    }

    aiMessages.push({ role: 'user', text: query });
    const response = generateAIResponse(query);
    aiMessages.push({ role: 'ai', text: response });
    navigate('ai-assistant');
  }

  function generateAIResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('sms reminder') || q.includes('draft an sms')) {
      return `📱 <strong>Draft SMS Reminder</strong><br><br>
Dear Patient,<br><br>
This is a friendly reminder from Nairobi Dental Care that you have an appointment scheduled for tomorrow, [DATE] at [TIME].<br><br>
Please arrive 10 minutes early. To reschedule or confirm, reply to this message or call us at +254 700 123 456.<br><br>
— Nairobi Dental Care 🦷`;
    }

    if (q.includes('cancellation') || q.includes('most cancellations')) {
      return `📊 <strong>Cancellation Analysis — March 2026</strong><br><br>
• <strong>Mondays</strong> had the most cancellations (4)<br>
• <strong>Fridays</strong> follow closely with 3 cancellations<br>
• <strong>Wednesday</strong> had the fewest cancellations (1)<br><br>
💡 <strong>Recommendation:</strong> Send double reminders (SMS + call) for Monday and Friday appointments.`;
    }

    if (q.includes('follow-up') || q.includes("haven't visited")) {
      return `📨 <strong>Follow-up Draft</strong><br><br>
Hi [Patient Name],<br><br>
It's been a while since your last visit! Regular check-ups can prevent up to 80% of dental issues.<br><br>
📅 Book now and receive 10% off your next cleaning.<br>
Call us at +254 700 123 456<br><br>
— Dr. Kamau & The Nairobi Dental Care Team 🦷`;
    }

    return `Thank you for your query. Based on your clinic data, I'd recommend reviewing your appointment schedule and patient records in the dashboard for detailed insights. Need help with SMS drafts, cancellation analysis, or follow-up suggestions?`;
  }

  // ============================================================
  // CONSENT FUNCTIONS
  // ============================================================

  function toggleConsent(num) {
    const el = document.getElementById(`consent${num}`);
    if (!el) return;
    el.classList.toggle('checked');
    const checkbox = el.querySelector('input');
    checkbox.checked = !checkbox.checked;
    if (num === 1) state.consentCheck1 = checkbox.checked;
    if (num === 2) state.consentCheck2 = checkbox.checked;
    checkConsent();
  }

  function checkConsent() {
    const btn = document.getElementById('confirmConsentBtn');
    const otp = document.getElementById('otpInput');
    if (!btn || !otp) return;
    state.consentOtp = otp.value;
    btn.disabled = !(state.consentCheck1 && state.consentCheck2 && otp.value.length === 6);
  }

  function confirmConsent() {
    const overlay = document.getElementById('consentOverlay');
    if (overlay) overlay.remove();
    showConsentGate = false;
  }

  function resetEmergency() {
    state.emergencyDetected = false;
    aiMessages = [
      { role: 'ai', text: "Hi Dr. Kamau! I'm your DentalAI assistant. I can help you draft SMS reminders, analyze appointment gaps, suggest follow-ups, and answer clinic management questions." },
    ];
    showConsentGate = true;
    navigate('ai-assistant');
  }

  // ============================================================
  // MISC UTILITY FUNCTIONS
  // ============================================================

  function nextOnboardingStep() {
    if (state.onboardingStep < 3) {
      state.onboardingStep++;
      render();
    }
  }

  function filterPatients(value) {
    const table = document.getElementById('patientsTable');
    if (!table) return;
    const rows = table.querySelectorAll('tbody tr');
    const q = value.toLowerCase();
    rows.forEach(row => {
      const name = row.querySelector('td')?.textContent.toLowerCase() || '';
      row.style.display = q === '' || name.includes(q) ? '' : 'none';
    });
  }

  function showPatientProfile(id) {
    const sidebarItems = [
      { page: 'patients', icon: 'fa-users', label: 'Patients' },
      { page: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
      { page: 'appointments', icon: 'fa-calendar-check', label: 'Appointments' },
      { page: 'billing', icon: 'fa-coins', label: 'Billing' },
      { page: 'campaigns', icon: 'fa-megaphone', label: 'Campaigns' },
      { page: 'messages', icon: 'fa-inbox', label: 'Messages' },
      { page: 'ai-assistant', icon: 'fa-robot', label: 'AI Assistant' },
      { page: 'settings', icon: 'fa-cog', label: 'Settings' },
    ];

    const app = document.getElementById('app');
    app.innerHTML = '';
    app.className = 'fade-in';

    const page = ce('div', 'dashboard-page');
    let sidebarHTML = `<div class="sidebar"><div class="sidebar-logo"><span>D</span>entalAI</div><nav class="sidebar-nav">`;
    sidebarItems.forEach(item => {
      sidebarHTML += `<a href="#" onclick="DentalAI.navigate('${item.page}')">
        <i class="fas ${item.icon}"></i><span>${item.label}</span>
      </a>`;
    });
    sidebarHTML += `</nav></div>`;
    page.innerHTML = sidebarHTML;

    const main = ce('div', 'main-content');
    const topBar = ce('div', 'top-bar');
    topBar.innerHTML = `
      <div class="top-bar-left"><h2>Patient Profile</h2></div>
      <div class="top-bar-right">
        <span class="top-bar-date">${new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <div style="position:relative">
          <button class="notification-bell"><i class="fas fa-bell"></i><span class="notification-badge">${notificationCount}</span></button>
        </div>
      </div>
    `;
    main.appendChild(topBar);
    const content = ce('div', 'page-content');
    content.appendChild(renderPatientProfile(id));
    main.appendChild(content);
    page.appendChild(main);
    app.appendChild(page);
  }

  // ============================================================
  // HELPERS
  // ============================================================

  function ce(tag, className, id) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (id) el.id = id;
    return el;
  }

  // ============================================================
  // INIT
  // ============================================================

  function init() {
    render();
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[data-nav]');
      if (anchor) {
        e.preventDefault();
        const target = anchor.dataset.nav;
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Public API
  return {
    navigate,
    nextOnboardingStep,
    showModal,
    showToast,
    sendAIMessage,
    sendQuickQuery,
    toggleConsent,
    checkConsent,
    confirmConsent,
    resetEmergency,
    filterPatients,
    showPatientProfile,
    submitContact,
    submitBooking,
    submitChat,
    viewMessage,
    replyToMessage,
    sendReply,
    markAsPaid,
    sendReceipt,
    init,
  };

})();

document.addEventListener('DOMContentLoaded', () => DentalAI.init());