// Dynamic year
document.getElementById('year').textContent = new Date().getFullYear();

// Secure external links
document.querySelectorAll('a[target="_blank"]').forEach(a => {
  if (!a.rel.includes('noopener')) a.rel += ' noopener';
});

// Email obfuscation — ROT13
// The data-obf attribute holds the ROT13-encoded address; decoded only on click.
function rot13(s) {
  return s.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}
document.querySelectorAll('[data-obf]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = 'mailto:' + rot13(el.dataset.obf);
  });
});

// Password modal — SHA-256 via SubtleCrypto
// Passwords are stored as SHA-256 hex digests. The comparison XORs every
// character so there is no early exit at the JS level (best-effort; not
// cryptographically constant-time in the strict sense).
//
// NOTE: This is light-touch protection. Anyone who reads the JS source can
// extract the hash and brute-force short passwords offline. It is designed
// to gate casual visitors, not to be a real security barrier.
async function sha256hex(msg) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const SCHOLAR_HASH  = 'd871d3c0f9866c2e9e909ae64d8be1792d2b73a3a220790e0bea97167dca3cf7';
const LBB_HASH      = '0f931295530178f732c28f47d0eea5d342f57a66ba9ddf8cd2872a3af4f9c8e1';

const overlay   = document.getElementById('modal-overlay');
const modalInput = document.getElementById('modal-input');
const errMsg    = document.getElementById('modal-error');
const succMsg   = document.getElementById('modal-success');

let modalConfig = null;

function openModal(config) {
  modalConfig = config;
  modalInput.value = '';
  errMsg.hidden = true;
  succMsg.hidden = true;
  overlay.hidden = false;
  modalInput.focus();
}

function closeModal() {
  overlay.hidden = true;
  modalConfig = null;
}

document.getElementById('modal-cancel').addEventListener('click', closeModal);

overlay.addEventListener('click', e => {
  if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !overlay.hidden) closeModal();
});

document.getElementById('modal-submit').addEventListener('click', async () => {
  if (!modalConfig) return;
  const entered = await sha256hex(modalInput.value);
  if (safeEqual(entered, modalConfig.hash)) {
    errMsg.hidden = true;
    modalConfig.onSuccess(succMsg);
  } else {
    errMsg.hidden = false;
    modalInput.value = '';
    modalInput.focus();
  }
});

modalInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('modal-submit').click();
});

// Scholar pill
document.querySelectorAll('[data-protected="scholar"]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    openModal({
      hash: SCHOLAR_HASH,
      onSuccess: msg => {
        msg.textContent = 'Google Scholar page coming soon.';
        msg.hidden = false;
      }
    });
  });
});

// LBB project link
document.querySelectorAll('[data-protected="lbb"]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    openModal({
      hash: LBB_HASH,
      onSuccess: () => {
        window.open('/documents/SP_Thesis_LBB.pdf', '_blank', 'noopener');
        closeModal();
      }
    });
  });
});
