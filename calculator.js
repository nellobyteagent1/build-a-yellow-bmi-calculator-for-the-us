(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  let unit = 'imperial';

  // Unit toggle
  $$('.unit-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      unit = btn.dataset.unit;
      $$('.unit-toggle button').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      $('#fields-imperial').style.display = unit === 'imperial' ? 'flex' : 'none';
      $('#fields-metric').style.display = unit === 'metric' ? 'flex' : 'none';

      // Hide result on unit switch
      $('#result').classList.remove('visible');
    });
  });

  // Calculate
  function calculate() {
    // Clear errors
    $$('.input-wrap').forEach(w => w.classList.remove('error'));

    let heightM, weightKg;

    if (unit === 'imperial') {
      const feet = parseFloat($('#feet').value);
      const inches = parseFloat($('#inches').value) || 0;
      const lbs = parseFloat($('#lbs').value);

      let hasError = false;
      if (!feet || feet < 1) { $('#feet').closest('.input-wrap').classList.add('error'); hasError = true; }
      if (!lbs || lbs < 1) { $('#lbs').closest('.input-wrap').classList.add('error'); hasError = true; }
      if (hasError) return;

      const totalInches = feet * 12 + inches;
      heightM = totalInches * 0.0254;
      weightKg = lbs * 0.453592;
    } else {
      const cm = parseFloat($('#cm').value);
      const kg = parseFloat($('#kg').value);

      let hasError = false;
      if (!cm || cm < 50) { $('#cm').closest('.input-wrap').classList.add('error'); hasError = true; }
      if (!kg || kg < 1) { $('#kg').closest('.input-wrap').classList.add('error'); hasError = true; }
      if (hasError) return;

      heightM = cm / 100;
      weightKg = kg;
    }

    const bmi = weightKg / (heightM * heightM);
    showResult(bmi);
  }

  function showResult(bmi) {
    const rounded = Math.round(bmi * 10) / 10;
    $('#bmi-value').textContent = rounded.toFixed(1);

    // Category
    let cat, cls;
    if (bmi < 18.5) { cat = 'Underweight'; cls = 'underweight'; }
    else if (bmi < 25) { cat = 'Normal weight'; cls = 'normal'; }
    else if (bmi < 30) { cat = 'Overweight'; cls = 'overweight'; }
    else { cat = 'Obese'; cls = 'obese'; }

    const catEl = $('#category');
    catEl.className = 'category category-' + cls;
    $('#category-text').textContent = cat;

    // Scale marker position (15–40 range mapped to 0–100%)
    const pct = Math.max(0, Math.min(100, ((bmi - 15) / 25) * 100));
    $('#scale-marker').style.left = pct + '%';

    // Reveal
    $('#result').classList.add('visible');
  }

  $('#calculate').addEventListener('click', calculate);

  // Allow Enter key to trigger calculation
  $$('input[type="number"]').forEach(inp => {
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') calculate();
    });
  });
})();
