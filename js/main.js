if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => window.scrollTo(0, 0));
window.addEventListener('pageshow', () => window.scrollTo(0, 0));

const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

document.addEventListener('DOMContentLoaded', () => {
  initStamp();

  const doctorInput = document.getElementById('doctorName');
  doctorInput.value = localStorage.getItem('doctorName') || '';
  doctorInput.addEventListener('input', () => {
    localStorage.setItem('doctorName', doctorInput.value);
  });
});

function startTest(type) {
  document.getElementById('startScreen').style.display = 'none';
  
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
  window.scrollTo(0, 0);
}
