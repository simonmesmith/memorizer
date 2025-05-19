document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('input-text');
    const startBtn = document.getElementById('start-btn');
    const entryPage = document.getElementById('entry-page');
    const memorizePage = document.getElementById('memorize-page');
    const slider = document.getElementById('slider');
    const sliderValue = document.getElementById('slider-value');
    const memoText = document.getElementById('memorization-text');
    const backBtn = document.getElementById('back-btn');
    const revealBtn = document.getElementById('reveal-btn');

    let originalText = '';

    inputText.addEventListener('input', () => {
        startBtn.disabled = inputText.value.trim().length === 0;
    });

    startBtn.addEventListener('click', () => {
        originalText = inputText.value;
        entryPage.classList.add('d-none');
        memorizePage.classList.remove('d-none');
        slider.value = 0;
        sliderValue.textContent = '0%';
        updateDisplay();
    });

    slider.addEventListener('input', updateDisplay);

    function updateDisplay() {
        sliderValue.textContent = slider.value + '%';
        const tokens = originalText.split(/(\s+)/);
        const wordIndices = [];
        for (let i = 0; i < tokens.length; i++) {
            if (!/^\s+$/.test(tokens[i])) wordIndices.push(i);
        }
        const hideCount = Math.round(wordIndices.length * slider.value / 100);
        const indicesToHide = new Set();
        while (indicesToHide.size < hideCount) {
            const rand = wordIndices[Math.floor(Math.random() * wordIndices.length)];
            indicesToHide.add(rand);
        }
        memoText.innerHTML = '';
        tokens.forEach((tok, i) => {
            if (/^\s+$/.test(tok)) {
                memoText.append(document.createTextNode(tok));
            } else if (indicesToHide.has(i)) {
                const span = document.createElement('span');
                span.textContent = '_____';
                span.dataset.word = tok;
                span.className = 'blank';
                span.addEventListener('click', revealWord);
                memoText.append(span);
            } else {
                memoText.append(document.createTextNode(tok));
            }
        });
    }

    function revealWord(e) {
        const span = e.target;
        if (!span.classList.contains('revealed')) {
            span.textContent = span.dataset.word;
            span.classList.add('revealed');
        }
    }

    revealBtn.addEventListener('click', () => {
        memoText.querySelectorAll('.blank').forEach(span => {
            span.click();
        });
    });

    backBtn.addEventListener('click', () => {
        memorizePage.classList.add('d-none');
        entryPage.classList.remove('d-none');
        inputText.value = '';
        startBtn.disabled = true;
        memoText.innerHTML = '';
        originalText = '';
    });
});
