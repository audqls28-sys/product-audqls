const lottoContainer = document.getElementById('lotto-container');
const generateBtn = document.getElementById('generate-btn');
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const themeText = document.getElementById('theme-text');

// 로또 번호 생성 함수
const generateNumbers = () => {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
};

// 번호 표시 함수
const displayNumbers = (numbers) => {
    lottoContainer.innerHTML = '';
    for (const number of numbers) {
        const circle = document.createElement('div');
        circle.classList.add('lotto-number');
        circle.textContent = number;
        lottoContainer.appendChild(circle);
    }
};

// 테마 변경 함수
const switchTheme = (e) => {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeText.textContent = '다크 모드';
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeText.textContent = '라이트 모드';
        localStorage.setItem('theme', 'light');
    }    
};

// 이벤트 리스너
generateBtn.addEventListener('click', () => {
    const numbers = generateNumbers();
    displayNumbers(numbers);
});

toggleSwitch.addEventListener('change', switchTheme, false);

// 초기화
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
        themeText.textContent = '다크 모드';
    }
}

displayNumbers(generateNumbers());
