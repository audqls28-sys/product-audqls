const lottoContainer = document.getElementById('lotto-container');
const generateBtn = document.getElementById('generate-btn');

const generateNumbers = () => {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
};

const displayNumbers = (numbers) => {
    lottoContainer.innerHTML = '';
    for (const number of numbers) {
        const circle = document.createElement('div');
        circle.classList.add('lotto-number');
        circle.textContent = number;
        lottoContainer.appendChild(circle);
    }
};

generateBtn.addEventListener('click', () => {
    const numbers = generateNumbers();
    displayNumbers(numbers);
});

displayNumbers(generateNumbers());
