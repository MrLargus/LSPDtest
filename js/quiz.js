const form = document.getElementById('quiz');
const resultEl = document.getElementById('result');
const patientInput = document.getElementById('patientName');
const doctorInput = document.getElementById('doctorName');

let currentResult = null;
let currentTestType = 'normal';

function buildQuiz(testType) {
  form.innerHTML = '';
  currentTestType = testType;
  
  const questionsToUse = testType === 'normal' ? normalQuestions : specialQuestions;
  if (questionsToUse.length === 0) return;

  let currentBlock = null;
  questionsToUse.forEach((q, qi) => {
    if (q.block && q.block !== currentBlock) {
      currentBlock = q.block;
      const blockTitle = document.createElement('div');
      blockTitle.className = 'block-title';
      blockTitle.textContent = q.block;
      form.appendChild(blockTitle);
    }
    const div = document.createElement('div');
    div.className = 'question';
    let html = `<h3>${qi + 1}. ${q.text}</h3>`;
    q.answers.forEach((a, ai) => {
      html += `<label class="answer"><input type="checkbox" name="q${qi}" value="${ai}"> <span>${a}</span></label>`;
    });
    div.innerHTML = html;
    form.appendChild(div);
  });
}

function checkAnswers(testType) {
  resultEl.style.opacity = '1';

  const patient = capitalizeName(patientInput.value);
  const doctor = capitalizeName(doctorInput.value);

  if (!patient || !doctor) {
    alert('Пожалуйста, заполните имя пациента и имя врача перед проверкой.');
    return;
  }

  patientInput.value = patient;
  doctorInput.value = doctor;
  localStorage.setItem('doctorName', doctor);

  const questionsToUse = testType === 'normal' ? normalQuestions : specialQuestions;
  let mainScore = 0;
  let situationScore = 0;

  questionsToUse.forEach((q, qi) => {
    const checked = [...document.querySelectorAll(`input[name="q${qi}"]:checked`)]
      .map(cb => parseInt(cb.value)).sort((a, b) => a - b);
    const correct = [...q.correct].sort((a, b) => a - b);
    const isRight = checked.length === correct.length &&
      checked.every((v, i) => v === correct[i]);
    if (isRight) {
      if (qi < SITUATIONS_START) mainScore += 1;
      else situationScore += 1;
    }
  });

  const maxPossible = Math.min(questionsToUse.length, MAX_SCORE);
  const total = Math.min(mainScore + situationScore, maxPossible);
  
  const rule = colorRules.find(r => total >= r.from && total <= r.to)
    || colorRules[colorRules.length - 1];

  resultEl.innerHTML = `
    <div class="score">${rule.emoji} Результат: ${total} из ${maxPossible}</div>
    <div class="label">${rule.label}</div>
    <div class="recommendation">${rule.recommendation}</div>
  `;
  resultEl.style.background = rule.bg;
  resultEl.style.color = rule.color;

  resultEl.classList.remove('flash');
  void resultEl.offsetWidth;
  resultEl.classList.add('flash');
  setTimeout(() => resultEl.classList.remove('flash'), 200);

  const today = new Date().toLocaleDateString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  currentResult = { patient, doctor, rule };

  
      const ciPatient = document.getElementById('ciPatient');
  const ciDoctor  = document.getElementById('ciDoctor');
  const ciDate    = document.getElementById('ciDate');
  const ciState   = document.getElementById('ciState');
  const ciVerdict = document.getElementById('ciVerdict');

  if (ciPatient) ciPatient.textContent = patient;
  if (ciDoctor)  ciDoctor.textContent  = doctor;
  if (ciDate)    ciDate.textContent    = `Дата осмотра: ${today}`;
  if (ciState) {
    ciState.textContent = rule.certState;
    ciState.style.color = rule.imgStateColor;
  }
  if (ciVerdict) ciVerdict.textContent = rule.certVerdict;

  renderStampInImage();
  

  document.getElementById('certWrapper').style.display = 'none';
  document.getElementById('genBtn').style.display = 'block';
  document.getElementById('copyStatus').textContent = '';
}

function resetQuiz() {
  document.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false);
  resultEl.innerHTML = '';
  resultEl.style.background = '';
  resultEl.style.color = '';
  resultEl.style.opacity = '1';

  document.getElementById('certWrapper').style.display = 'none';
  document.getElementById('genBtn').style.display = 'none';
  document.getElementById('copyStatus').textContent = '';

  const rpRow = document.getElementById('rpRow');
  if (rpRow) rpRow.style.display = 'none';

  const certImg = document.getElementById('certImage');
  if (certImg) certImg.classList.remove('visible');

  currentResult = null;
  clearStamp();
  patientInput.value = '';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
