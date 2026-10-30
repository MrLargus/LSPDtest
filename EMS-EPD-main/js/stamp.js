const STAMP_SRC = 'assets/stamp.svg';
let stampPos = null;

function initStamp() {
  const certImg = document.getElementById('certImage');
  if (!certImg) return;

  if (!isMobile) {
    certImg.addEventListener('click', (e) => {
      const rect = certImg.getBoundingClientRect();
      const xPercent = (e.clientX - rect.left) / rect.width;
      const yPercent = (e.clientY - rect.top) / rect.height;
      setStamp(xPercent, yPercent);
    });
  }
}

function setStamp(xPercent, yPercent) {
  stampPos = { xPercent, yPercent };
  const certImg = document.getElementById('certImage');

  if (certImg) {
    let img = certImg.querySelector('.stamp-img');
    if (!img) {
      img = document.createElement('img');
      img.className = 'stamp-img';
      img.src = STAMP_SRC;
      img.alt = 'Печать';
      certImg.appendChild(img);
    }
    img.style.left = (xPercent * 100) + '%';
    img.style.top = (yPercent * 100) + '%';
  }
}

function renderStampInImage() {
  if (isMobile) return;
  const certImg = document.getElementById('certImage');
  if (!certImg || !stampPos) return;

  let img = certImg.querySelector('.stamp-img');
  if (!img) {
    img = document.createElement('img');
    img.className = 'stamp-img';
    img.src = STAMP_SRC;
    img.alt = 'Печать';
    certImg.appendChild(img);
  }
  img.style.left = (stampPos.xPercent * 100) + '%';
  img.style.top = (stampPos.yPercent * 100) + '%';
}

function clearStamp() {
  stampPos = null;
  const certImg = document.getElementById('certImage');
  if (certImg) {
    const img = certImg.querySelector('.stamp-img');
    if (img) img.remove();
  }
}