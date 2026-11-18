// GrowthPilot website interactions: mobile navigation, scroll reveal and contact form.
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const isOpen = navigation.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    navigation.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navigation.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  document.querySelectorAll('.year').forEach(node => {
    node.textContent = new Date().getFullYear();
  });

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const subject = encodeURIComponent('Website enquiry from ' + data.get('name'));
      const body = encodeURIComponent(
        'Name: ' + data.get('name') + '\\n' +
        'Email: ' + data.get('email') + '\\n' +
        'Service: ' + data.get('service') + '\\n\\n' +
        'Project details:\\n' + data.get('message')
      );
      const status = form.querySelector('.form-status');
      if (status) status.textContent = 'Your email app should open with the enquiry prepared. Replace the demo email address in contact.html with your real business email.';
      window.location.href = 'mailto:hello@growthpilot.example?subject=' + subject + '&body=' + body;
    });
  }
});
