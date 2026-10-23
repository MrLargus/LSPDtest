if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => window.scrollTo(0, 0));
window.addEventListener('pageshow', () => window.scrollTo(0, 0));

const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

document.addEventListener('DOMContentLoaded', () => {
  initStamp();

  const doctorInputs = document.querySelectorAll('.doctor-input');
  const savedDoctor = localStorage.getItem('doctorName') || '';

  doctorInputs.forEach(input => {
    input.value = savedDoctor;

    input.addEventListener('input', (e) => {
      const val = e.target.value;
      localStorage.setItem('doctorName', val);
      doctorInputs.forEach(otherInput => {
        if (otherInput !== input) {
          otherInput.value = val;
        }
      });
    });
  });

  // Закрытие модалок по клику на фон
  ['specialModal', 'normalModal'].forEach(id => {
    const modal = document.getElementById(id);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(id);
      });
    }
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal('specialModal');
    closeModal('normalModal');
  }
});

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}

// ===== СТАНДАРТНЫЙ ТЕСТ =====
function openNormalModal() {
  document.getElementById('normalModal').style.display = 'flex';
}

function startNormalTest(department) {
  closeModal('normalModal');
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('certWrapper').style.display = 'none';
  document.getElementById('normalTestWrapper').style.display = 'block';

  const titles = {
    lspd: 'Психологический тест — LSPD',
    advocate: 'Психологический тест — Адвокатура',
    ems: 'Психологический тест — EMS',
    gov: 'Психологический тест — GOV'
  };
  const h1 = document.querySelector('#normalTestWrapper h1');
  if (h1) h1.textContent = titles[department] || 'Психологический тест';

  buildQuiz('normal', department);
  window.scrollTo(0, 0);
}

// ===== УГЛУБЛЁННЫЙ ТЕСТ =====
function openSpecialModal() {
  document.getElementById('specialModal').style.display = 'flex';
}

function startSpecialTest(department) {
  closeModal('specialModal');
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('certWrapper').style.display = 'none';
  document.getElementById('specialTestWrapper').style.display = 'block';

  const titles = {
    lspd: 'Углублённый психологический тест — LSPD',
    advocate: 'Углублённый психологический тест — Адвокатура',
    ems: 'Углублённый психологический тест — EMS',
    gov: 'Углублённый психологический тест — GOV'
  };
  const h1 = document.querySelector('#specialTestWrapper h1');
  if (h1) h1.textContent = titles[department] || 'Углублённый психологический тест';

  buildQuiz('special', department);
  window.scrollTo(0, 0);
}

// ===== ВОЗВРАТ В МЕНЮ =====
function goToMenu() {
  document.getElementById('normalTestWrapper').style.display = 'none';
  document.getElementById('specialTestWrapper').style.display = 'none';
  document.getElementById('startScreen').style.display = 'block';
  document.getElementById('certWrapper').style.display = 'none';

  const h1n = document.querySelector('#normalTestWrapper h1');
  if (h1n) h1n.textContent = 'Психологический тест';
  const h1s = document.querySelector('#specialTestWrapper h1');
  if (h1s) h1s.textContent = 'Углублённый психологический тест';

  window.scrollTo(0, 0);
}