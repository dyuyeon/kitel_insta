const textInput = document.getElementById('text-input');
const fontSizeControl = document.getElementById('font-size');
const lineHeightControl = document.getElementById('line-height');
const canvas = document.getElementById('image-canvas');
const downloadBtn = document.getElementById('download-btn');
const ctx = canvas.getContext('2d');
let text_one_line = '';
let filename = '키텔인스타표지';

let uploadedImage = null;
const img = new Image();
img.onload = () => {
    uploadedImage = img;
    canvas.width = img.width;
    canvas.height = img.height;
    drawCanvas();
    downloadBtn.disabled = false;
};
img.src = 'null_front_page.png'

// 설정 변경 시 캔버스 다시 그리기
textInput.addEventListener('input', drawCanvas);
fontSizeControl.addEventListener('input', () => {
    document.getElementById('font-size-value').textContent = `${fontSizeControl.value}px`;
    drawCanvas();
});
lineHeightControl.addEventListener('input', () => {
    document.getElementById('line-height-value').textContent = lineHeightControl.value;
    drawCanvas();
});

// 캔버스에 이미지와 텍스트 그리기
function drawCanvas() {
    if (!uploadedImage) return;

    // 1. 기존 이미지 그리기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

    // 2. 텍스트 그리기
    const text = textInput.value;
    if (!text) return;

    const fontSize = fontSizeControl.value;
    const lineHeight = lineHeightControl.value;

    ctx.font = `${fontSize}px Electrical Safety Bold`; // 폰트 스타일 설정
    ctx.fillStyle = 'white'; // 텍스트 색상
    ctx.textAlign = 'center'; // 가로 정렬
    ctx.textBaseline = 'middle'; // 세로 정렬

    // 텍스트 중앙 위치 계산
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + 100;

    const lines = text.split('\n'); // 줄바꿈 처리

    text_one_line = '';
    lines.forEach((line, index) => {
        const yPos = centerY + (index - (lines.length - 1) / 2) * fontSize * lineHeight;
        ctx.fillText(line, centerX, yPos);
        text_one_line = text_one_line + ' ' + line;
    });

    filename = `키텔인스타표지_${text_one_line}.png`;
}

// 폰트가 로드되면 캔버스 그리기 함수를 호출
document.fonts.ready.then(() => {
    drawCanvas();
});

// 다운로드 버튼 기능
downloadBtn.addEventListener('click', () => {
    if (!uploadedImage) {
        alert('먼저 이미지를 업로드해주세요.');
        return;
    }

    const imageURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
