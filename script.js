/**
 * Portofolio Lisia Zahwa Alifa — Bento Grid Edition
 * Interactive Behaviors: Live WIB Clock, Bento Modals, Heatmap, Shortcuts, Web Audio, Interactive Atmosphere Canvas
 */

document.addEventListener('DOMContentLoaded', () => {

  // ================= 0. INTERACTIVE NEURAL CONSTELLATION CANVAS =================
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 25 : 55;
    let mouse = { x: -1000, y: -1000, radius: 140 };

    function resizeCanvas() {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 2 + 1.2;
        this.baseAlpha = Math.random() * 0.4 + 0.3;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.2;
          this.y -= (dy / dist) * force * 2.2;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(35, 35, 35, ${this.baseAlpha})`;
        ctx.fill();
      }
    }

    function initParticles() {
      resizeCanvas();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby nodes
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 125;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(40, 40, 40, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }

    initParticles();
    animate();
  }


  // ================= BACKGROUND STYLE SWITCHER =================
  const bgToggleBtn = document.getElementById('btn-toggle-bg');
  const bgSwitchLabel = document.getElementById('bg-switch-label');
  const bgStyles = [
    { id: 'neural', name: 'NEURAL MESH', bodyClass: '' },
    { id: 'waves', name: 'FLUID 3D WAVES', bodyClass: 'bg-style-waves' },
    { id: 'minimal', name: 'MINIMAL STUDIO', bodyClass: 'bg-style-minimal' }
  ];
  let currentBgIndex = 0;

  if (bgToggleBtn && bgSwitchLabel) {
    bgToggleBtn.addEventListener('click', () => {
      currentBgIndex = (currentBgIndex + 1) % bgStyles.length;
      const current = bgStyles[currentBgIndex];

      document.body.classList.remove('bg-style-waves', 'bg-style-minimal');
      if (current.bodyClass) {
        document.body.classList.add(current.bodyClass);
      }

      bgSwitchLabel.textContent = current.name;
      playBlip(720);
      showToast(`Background: ${current.name}`);
    });
  }


  // ================= 1. LIVE WIB CLOCK =================
  const clockElement = document.getElementById('clock-display');
  
  function updateWibClock() {
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const timeFormatter = new Intl.DateTimeFormat('en-GB', options);
      const timeStr = timeFormatter.format(now);
      if (clockElement) {
        clockElement.textContent = `${timeStr} WIB`;
      }
    } catch (e) {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      if (clockElement) {
        clockElement.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} WIB`;
      }
    }
  }

  updateWibClock();
  setInterval(updateWibClock, 1000);


  // ================= 2. GITHUB 12-MONTH HEATMAP =================
  const heatmapContainer = document.getElementById('heatmap-container');
  if (heatmapContainer) {
    const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    const mockContributions = [34, 48, 62, 55, 78, 99, 84, 122, 105, 93, 114, 88];

    months.forEach((month, idx) => {
      const count = mockContributions[idx];
      let level = 1;
      if (count > 95) level = 4;
      else if (count > 70) level = 3;
      else if (count > 45) level = 2;
      else if (count > 25) level = 1;

      const cell = document.createElement('div');
      cell.className = `heat-cell heat-${level}`;
      cell.setAttribute('title', `${month}: ${count} kontribusi di GitHub (jdkkiee)`);
      cell.setAttribute('role', 'button');
      cell.setAttribute('aria-label', `${month}: ${count} kontribusi`);

      cell.addEventListener('click', () => {
        playBlip();
        showToast(`${month}: ${count} kontribusi GitHub`);
      });

      heatmapContainer.appendChild(cell);
    });
  }


  // ================= 3. MODAL & DRAWER SYSTEM =================
  const backdrop = document.getElementById('modal-backdrop');
  let activeModal = null;

  function openModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (!targetModal) return;

    if (activeModal && activeModal !== targetModal) {
      activeModal.classList.remove('active');
    }

    playBlip();
    targetModal.classList.add('active');
    backdrop.classList.add('active');
    activeModal = targetModal;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (activeModal) {
      playBlip(320);
      activeModal.classList.remove('active');
      activeModal = null;
    }
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Trigger bindings
  const modalTriggers = [
    { triggerId: 'card-projects', modalId: 'modal-projects' },
    { triggerId: 'card-achievements', modalId: 'modal-achievements' },
    { triggerId: 'card-experience', modalId: 'modal-experience' },
    { triggerId: 'card-blog', modalId: 'modal-blog' },
    { triggerId: 'btn-email-contact', modalId: 'modal-contact' },
    { triggerId: 'btn-open-resume', modalId: 'modal-resume' },
    { triggerId: 'btn-shortcuts', modalId: 'modal-shortcuts' },
  ];

  modalTriggers.forEach(({ triggerId, modalId }) => {
    const el = document.getElementById(triggerId);
    if (el) {
      el.addEventListener('click', () => openModal(modalId));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(modalId);
        }
      });
    }
  });

  // Close buttons inside modals
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Backdrop click closes modal
  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
  }


  // ================= 4. PROJECT FILTERING =================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playBlip();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      projectItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });


  // ================= 5. KEYBOARD SHORTCUTS =================
  document.addEventListener('keydown', (e) => {
    const activeTagName = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTagName === 'input' || activeTagName === 'textarea') {
      if (e.key === 'Escape') {
        document.activeElement.blur();
      }
      return;
    }

    if (e.key === 'Escape') {
      closeModal();
      return;
    }

    if (e.key === '1') {
      openModal('modal-projects');
    } else if (e.key === '2') {
      openModal('modal-achievements');
    } else if (e.key === '3') {
      openModal('modal-experience');
    } else if (e.key === '4') {
      openModal('modal-blog');
    } else if (e.key === 'c' || e.key === 'C') {
      openModal('modal-contact');
    } else if (e.key === 'r' || e.key === 'R') {
      openModal('modal-resume');
    } else if (e.key === 'g' || e.key === 'G') {
      playBlip();
      showToast('Membuka GitHub jdkkiee...');
      window.open('https://github.com/jdkkiee', '_blank');
    } else if (e.key === 'l' || e.key === 'L') {
      playBlip();
      showToast('Membuka profil LinkedIn...');
      window.open('https://www.linkedin.com/in/lisia-zahwa-alifa-9136a0386', '_blank');
    } else if (e.key === '?' || (e.key === '/' && (e.metaKey || e.ctrlKey))) {
      e.preventDefault();
      if (activeModal && activeModal.id === 'modal-shortcuts') {
        closeModal();
      } else {
        openModal('modal-shortcuts');
      }
    }
  });


  // ================= 6. CONTACT FORM HANDLING =================
  window.handleFormSubmit = function() {
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const msgInput = document.getElementById('form-message');
    const feedback = document.getElementById('form-feedback');

    if (!nameInput.value || !emailInput.value || !msgInput.value) return;

    playBlip(750);
    feedback.style.color = '#2563eb';
    feedback.textContent = 'Mengirim pesan...';

    setTimeout(() => {
      playBlip(880);
      feedback.style.color = '#15803d';
      feedback.textContent = '✓ Terima kasih! Pesan Anda telah terkirim kepada Lisia.';
      showToast('Pesan berhasil terkirim!');
      
      nameInput.value = '';
      emailInput.value = '';
      msgInput.value = '';

      setTimeout(() => {
        feedback.textContent = '';
      }, 4000);
    }, 700);
  };


  // ================= 7. TOAST NOTIFICATION HELPER =================
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('active');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('active');
    }, 2400);
  }

  // Handle click on handle 'A.K.A LISIA'
  const navAka = document.getElementById('nav-aka');
  if (navAka) {
    navAka.addEventListener('click', () => {
      playBlip();
      navigator.clipboard?.writeText('https://github.com/jdkkiee');
      showToast('Copied Lisia\'s GitHub URL (github.com/jdkkiee) to clipboard!');
    });
  }


  // ================= 8. TACTILE AUDIO SYNTHESIZER =================
  let audioCtx = null;

  function playBlip(freq = 600) {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.045);
    } catch (e) {
      // Audio context silently fails gracefully
    }
  }

  

});

<script>
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
</script>
