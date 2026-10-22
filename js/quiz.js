let currentResult = null;
let currentTestType = 'normal';

function buildQuiz(testType) {
  currentTestType = testType;
  const isNormal = testType === 'normal';
  
  const form = document.getElementById(isNormal ? 'quiz' : 'specialQuiz');
  form.innerHTML = '';
  
  const questionsToUse = isNormal ? normalQuestions : specialQuestions;
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
  const isNormal = testType === 'normal';
  const patientInput = document.getElementById(isNormal ? 'patientName' : 'specialPatientName');
  const doctorInput = document.getElementById(isNormal ? 'doctorName' : 'specialDoctorName');
  const resultEl = document.getElementById(isNormal ? 'result' : 'specialResult');
  
  // Определяем, в какой именно форме искать ответы
  const formId = isNormal ? 'quiz' : 'specialQuiz';
  const formContainer = document.getElementById(formId);

  resultEl.style.opacity = '1';

  const patient = capitalizeName(patientInput.value);
  const doctor = capitalizeName(doctorInput.value);

  if (!patient || !doctor) {
    alert('Пожалуйста, заполните имя пациента и имя врача перед проверкой.');
    return;
  }

  patientInput.value = patient;
  doctorInput.value = doctor;
  if (isNormal) localStorage.setItem('doctorName', doctor);

  const questionsToUse = isNormal ? normalQuestions : specialQuestions;
  let mainScore = 0;
  let bonusScore = 0;

  // Считаем баллы
  questionsToUse.forEach((q, qi) => {
    // Ищем ответы ТОЛЬКО внутри текущей формы
    const checked = [...formContainer.querySelectorAll(`input[name="q${qi}"]:checked`)]
      .map(cb => parseInt(cb.value)).sort((a, b) => a - b);
      
    const correct = [...q.correct].sort((a, b) => a - b);
    const isRight = checked.length === correct.length &&
      checked.every((v, i) => v === correct[i]);
      
    if (isRight) {
      // Если вопрос из блока "ДОПОЛНИТЕЛЬНЫЙ ТЕСТ", добавляем в бонусы
      if (q.block && q.block.includes("ДОПОЛНИТЕЛЬНЫЙ ТЕСТ")) {
        bonusScore += 1;
      } else {
        mainScore += 1;
      }
    }
  });

  // Считаем максимально возможный балл за основные вопросы (без доп. блока)
  const baseQuestionsCount = questionsToUse.filter(q => !q.block || !q.block.includes("ДОПОЛНИТЕЛЬНЫЙ ТЕСТ")).length;
  
  // Итоговый балл не может превышать максимум основных вопросов
  const total = Math.min(mainScore + bonusScore, baseQuestionsCount);
  
  // Считаем процент от основных вопросов
  const percent = (total / baseQuestionsCount) * 100;
  
  let rule;
  if (percent < 45) rule = colorRules[0];
  else if (percent < 70) rule = colorRules[1];
  else if (percent < 90) rule = colorRules[2];
  else rule = colorRules[3];

  resultEl.innerHTML = `
    <div class="score">${rule.emoji} Результат: ${total} из ${baseQuestionsCount}</div>
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

  currentResult = { patient, doctor, rule, testType };

  document.getElementById('ciPatient').textContent = patient;
  document.getElementById('ciDoctor').textContent = doctor;
  document.getElementById('ciDate').textContent = `Дата осмотра: ${today}`;
  
  const ciState = document.getElementById('ciState');
  ciState.textContent = rule.certState;
  ciState.style.color = rule.imgStateColor;
  document.getElementById('ciVerdict').textContent = rule.certVerdict;

  renderStampInImage();

  document.getElementById('certWrapper').style.display = 'none';
  document.getElementById(isNormal ? 'genBtn' : 'specialGenBtn').style.display = 'block';
}
function resetQuiz() {
  document.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false);
  
  ['result', 'specialResult'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = '';
      el.style.background = '';
      el.style.color = '';
      el.style.opacity = '1';
    }
  });

  document.getElementById('certWrapper').style.display = 'none';
  document.getElementById('genBtn').style.display = 'none';
  document.getElementById('specialGenBtn').style.display = 'none';
  document.getElementById('copyStatus').textContent = '';

  const rpRow = document.getElementById('rpRow');
  if (rpRow) rpRow.style.display = 'none';

  const certImg = document.getElementById('certImage');
  if (certImg) certImg.classList.remove('visible');

  currentResult = null;
  clearStamp();
  
  const p1 = document.getElementById('patientName');
  const p2 = document.getElementById('specialPatientName');
  if (p1) p1.value = '';
  if (p2) p2.value = '';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}
