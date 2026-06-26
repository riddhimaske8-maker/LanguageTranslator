const form = document.getElementById('translator-form');
const textInput = document.getElementById('text-input');
const languageSelect = document.getElementById('target');
const resultSection = document.getElementById('result');
const translatedText = document.getElementById('translated-text');
const outputTextarea = document.getElementById('output');
const errorSection = document.getElementById('error');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  resultSection.classList.add('hidden');
  errorSection.classList.add('hidden');

  const text = textInput.value.trim();
  const targetLanguage = languageSelect.value;

  if (!text || !targetLanguage) {
    errorSection.textContent = 'Please enter text and select a target language.';
    errorSection.classList.remove('hidden');
    return;
  }

  try {
    const response = await fetch('/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target: targetLanguage,
        format: 'text'
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || 'Translation request failed.');
    }

    translatedText.textContent = payload.translated_text;
    outputTextarea.value = payload.translated_text;
    resultSection.classList.remove('hidden');
  } catch (error) {
    errorSection.textContent = error.message;
    errorSection.classList.remove('hidden');
  }
});

function copyText() {
  let text = document.getElementById('output');
  text.select();
  navigator.clipboard.writeText(text.value)
    .then(() => {
      alert('Copied successfully!');
    })
    .catch(() => {
      alert('Unable to copy. Please try again.');
    });
}

function speaktext() {
  let text = document.getElementById('output').value;
  if (!text) {
    alert('No text available to speak.');
    return;
  }

  let speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'en';
  window.speechSynthesis.speak(speech);
}

function darkmode() {
  document.body.classList.toggle('dark-mode');
}

function cleartext() {
  document.getElementById('text-input').value = '';
  document.getElementById('target').selectedIndex = 0;
  document.getElementById('output').value = '';
  document.getElementById('translated-text').textContent = '';
  document.getElementById('result').classList.add('hidden');
  document.getElementById('error').classList.add('hidden');
}

function swap() {
  const input = document.getElementById('text-input');
  const output = document.getElementById('output');
  const translated = document.getElementById('translated-text');

  const temp = input.value;
  input.value = output.value;
  output.value = temp;
  translated.textContent = output.value;
}
