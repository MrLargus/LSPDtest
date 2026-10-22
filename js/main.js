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
});

function startTest(type) {
  document.getElementById('startScreen').style.display = 'none';
  
  // Скрываем справку при входе в тест
  document.getElementById('certWrapper').style.display = 'none';

  if (type === 'normal') {
    document.getElementById('normalTestWrapper').style.display = 'block';
    buildQuiz('normal');
  } else if (type === 'special') {
    document.getElementById('specialTestWrapper').style.display = 'block';
    buildQuiz('special');
  }
  
  window.scrollTo(0, 0);
}

function goToMenu() {
  document.getElementById('normalTestWrapper').style.display = 'none';
  document.getElementById('specialTestWrapper').style.display = 'none';
  document.getElementById('startScreen').style.display = 'block';
  
  // Скрываем справку при выходе в меню
  document.getElementById('certWrapper').style.display = 'none';
  
  window.scrollTo(0, 0);
}