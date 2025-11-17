const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby2b6VbyeKFRI9JNLPAI75ryjXP2WaT5crwDZCRwEtLBkmdTX05CXy9bADDACRjSSwobA/exec'; // Replace with your deployed GAS URL
let currentStep = 1;

function updateProgress() {
  const progress = (currentStep / 3) * 100;
  document.getElementById('progressBar').style.width = progress + '%';
}

function nextStep(step) {
  if (!validateStep(step)) return;
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.querySelector(`[data-step="${step + 1}"]`).classList.add('active');
  currentStep++;
  updateProgress();
}

function prevStep(step) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.querySelector(`[data-step="${step - 1}"]`).classList.add('active');
  currentStep--;
  updateProgress();
}

function validateStep(step) {
  const fields = document.querySelectorAll(`[data-step="${step}"] [required]`);
  for (let field of fields) {
    if (!field.value.trim()) {
      field.classList.add('is-invalid');
      return false;
    }
    field.classList.remove('is-invalid');
  }
  return true;
}

function setSegmentKey() {
  const mattersMost = document.getElementById('mattersMost').value;
  const segmentMap = {
    'Lower fees': 'fee-conscious',
    'Stability': 'compliance-risk',
    'Growth support': 'growth-focused'
  };
  document.getElementById('segmentKey').value = segmentMap[mattersMost] || 'general';
}

function generateReviewSummary() {
  const formData = new FormData(document.getElementById('quizForm'));
  let summary = '<ul class="list-unstyled">';
  for (let [key, value] of formData.entries()) {
    if (value) summary += `<li><strong>${key}:</strong> ${value}</li>`;
  }
  summary += '</ul>';
  document.getElementById('reviewSummary').innerHTML = summary;
}

document.getElementById('quizForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  generateReviewSummary(); // If on step 3
  if (currentStep !== 3) return;

  const formData = new FormData(e.target);
  const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal') || createLoadingModal()); // Optional: Add loading modal in HTML if desired
  // loadingModal.show();

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      bootstrap.Modal.getInstance(document.getElementById('successModal')).show();
      document.getElementById('quizForm').reset();
      currentStep = 1;
      updateProgress();
    } else {
      alert('Oops! Something went wrong. Please try again.');
    }
  } catch (error) {
    alert('Network error. Please check your connection.');
  }
  // loadingModal.hide();
});

// GA Tracking (optional)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID'); // Replace
