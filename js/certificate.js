function generateCertificate() {
  document.getElementById('certWrapper').style.display = 'block';
  document.getElementById('genBtn').style.display = 'none';

  const rpRow = document.getElementById('rpRow');
  const certImg = document.getElementById('certImage');

    if (isMobile) {
    const imgBtn = document.getElementById('imgBtn');
    if (imgBtn) imgBtn.style.display = 'none';
    if (rpRow) rpRow.style.display = 'none';
    
    // Принудительно показываем справку на телефоне
    if (certImg) {
      certImg.classList.add('visible');
      certImg.style.display = 'block';
    }
  } else {
    if (rpRow) rpRow.style.display = 'grid';
    if (certImg) certImg.classList.add('visible');
  }

  setTimeout(() => {
    const target = document.getElementById('certWrapper');
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth', block: 'start'
      });
    }
  }, 50);
}

function copyCertificate() {
  const patient = document.getElementById('ciPatient').textContent;
  const state = document.getElementById('ciState').textContent;
  const verdict = document.getElementById('ciVerdict').textContent;
  const doctor = document.getElementById('ciDoctor').textContent;
  const date = document.getElementById('ciDate').textContent;

  const fullText =
    `📄 СПРАВКА О ПСИХИЧЕСКОМ СОСТОЯНИИ\n` +
    `Emergency Medical Service\n` +
    `─────────────────────\n` +
    `Справка на имя: ${patient}.\n` +
    `Психическое состояние: ${state}.\n` +
    `${verdict}\n` +
    `${date}.\n` +
    `─────────────────────\n` +
    `Подпись врача: ${doctor}`;

  copyText(fullText, '✅ Скопировано! Вставь в Discord.');
}

function copyRoleplay() {
  if (!currentResult) return;
  const { patient, doctor, rule } = currentResult;

  const stateMap = {
    'положительное': 'положительное. К службе допущен полностью',
    'удовлетворительное': 'удовлетворительное, допуск с наставником, с повторной проверкой через 2 дня',
    'среднее': 'среднее. Только патруль без дальнейшего повышения',
    'критическое': 'критическое. Допуск к работе запрещен'
  };

  const stateText = stateMap[rule.certState] || rule.certState;
  const text = `/me Выдала справку человеку напротив с надписью "Выдана справка (${patient}). Психическое состояние ${stateText}. Подпись врача: ${doctor}"`;

  copyText(text, '✅ Отыгровка скопирована!');
}

function copyDo() {
  if (!currentResult) return;
  const { patient } = currentResult;
  const text = `/do Справка на руках (${patient})`;
  copyText(text, '✅ /do скопировано!');
}

function copyCertificateAsImage() {
  if (isMobile) return;
  const copyStatus = document.getElementById('copyStatus');

  if (typeof html2canvas === 'undefined') {
    copyStatus.textContent = '⏳ Загружаем модуль для картинки...';
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.onload = () => {
      copyStatus.textContent = '';
      copyCertificateAsImage();
    };
    script.onerror = () => {
      copyStatus.textContent = '';
      alert('Не удалось загрузить модуль. Проверь соединение с интернетом.');
    };
    document.head.appendChild(script);
    return;
  }

  const certImg = document.getElementById('certImage');
  if (!certImg) return;

  // Временно скрываем подсказку для печати, чтобы она не попала на картинку
  certImg.classList.add('rendering');

  html2canvas(certImg, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false
  }).then(canvas => {
    certImg.classList.remove('rendering'); // Возвращаем подсказку обратно
    
    canvas.toBlob(blob => {
      if (navigator.clipboard && window.ClipboardItem) {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          .then(() => {
            copyStatus.textContent = '✅ Картинка скопирована! Вставь в Discord (Ctrl+V).';
            setTimeout(() => copyStatus.textContent = '', 4000);
          })
          .catch(() => downloadCanvas(canvas));
      } else {
        downloadCanvas(canvas);
      }
    }, 'image/png');
  }).catch(err => {
    certImg.classList.remove('rendering');
    alert('Не удалось создать картинку: ' + err.message);
  });
}

function downloadCanvas(canvas) {
  const link = document.createElement('a');
  link.download = 'справка_психическое_состояние.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
  const copyStatus = document.getElementById('copyStatus');
  copyStatus.textContent = '💾 Картинка скачана файлом (буфер недоступен).';
  setTimeout(() => copyStatus.textContent = '', 4000);
}
