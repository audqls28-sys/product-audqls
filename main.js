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

// --- 동물상 테스트 (Teachable Machine) ---
const URL = "https://teachablemachine.withgoogle.com/models/yi_5N4KWK/";
let model, labelContainer, maxPredictions;

const imageUpload = document.getElementById('image-upload');
const uploadBtn = document.getElementById('upload-btn');
const uploadArea = document.getElementById('upload-area');
const faceImage = document.getElementById('face-image');
const resultContainer = document.getElementById('result-container');
const loading = document.getElementById('loading');

// 모델 로드
async function initModel() {
    if (model) return;
    loading.classList.remove('hidden');
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById("label-container");
    loading.classList.add('hidden');
}

// 사진 선택 클릭 이벤트
uploadBtn.addEventListener('click', () => imageUpload.click());
uploadArea.addEventListener('click', () => imageUpload.click());

// 드래그 앤 드롭 방지
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = 'rgba(0,0,0,0.1)';
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.backgroundColor = '';
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = '';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleImage(files[0]);
    }
});

// 파일 업로드 이벤트
imageUpload.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleImage(e.target.files[0]);
    }
});

async function handleImage(file) {
    const reader = new FileReader();
    reader.onload = async (event) => {
        faceImage.src = event.target.result;
        resultContainer.classList.remove('hidden');
        await initModel();
        predict();
    };
    reader.readAsDataURL(file);
}

async function predict() {
    const prediction = await model.predict(faceImage);
    labelContainer.innerHTML = '';
    
    // 확률 순으로 정렬
    prediction.sort((a, b) => b.probability - a.probability);

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className;
        const prob = (prediction[i].probability * 100).toFixed(0);
        
        const resultWrapper = document.createElement('div');
        resultWrapper.classList.add('result-bar-wrapper');
        
        resultWrapper.innerHTML = `
            <div class="result-label">${classPrediction}</div>
            <div class="bar-container">
                <div class="bar" style="width: ${prob}%"></div>
            </div>
            <div class="percent">${prob}%</div>
        `;
        labelContainer.appendChild(resultWrapper);
    }
}

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
