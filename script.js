const imageUpload = document.getElementById('image-upload');
const textInput = document.getElementById('text-input');
const fontSizeControl = document.getElementById('font-size');
const letterSpacingControl = document.getElementById('letter-spacing');
const lineHeightControl = document.getElementById('line-height');
const canvas = document.getElementById('image-canvas');
const downloadBtn = document.getElementById('download-btn');
const ctx = canvas.getContext('2d');

let uploadedImage = null;

// 이미지 파일 업로드 처리
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            uploadedImage = img;
            canvas.width = img.width;
            canvas.height = img.height;
            drawCanvas();
            downloadBtn.disabled = false;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// 설정 변경 시 캔버스 다시 그리기
textInput.addEventListener('input', drawCanvas);
fontSizeControl.addEventListener('input', () => {
    document.getElementById('font-size-value').textContent = `${fontSizeControl.value}px`;
    drawCanvas();
});
letterSpacingControl.addEventListener('input', () => {
    document.getElementById('letter-spacing-value').textContent = `${letterSpacingControl.value}px`;
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
    const letterSpacing = letterSpacingControl.value;
    const lineHeight = lineHeightControl.value;

    ctx.font = `${fontSize}px Arial`; // 폰트 스타일 설정
    ctx.fillStyle = 'white'; // 텍스트 색상
    ctx.textAlign = 'center'; // 가로 정렬
    ctx.textBaseline = 'middle'; // 세로 정렬

    // 텍스트 중앙 위치 계산
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const lines = text.split('\n'); // 줄바꿈 처리

    lines.forEach((line, index) => {
        const yPos = centerY + (index - (lines.length - 1) / 2) * fontSize * lineHeight;
        
        // 자간 적용 (캔버스 API에 자간 기능이 없어 직접 구현해야 함)
        // 여기서는 예시로 간단히 구현하므로, 복잡한 자간 처리는 라이브러리를 사용하거나 별도의 로직이 필요
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const xPos = centerX + (i - (line.length - 1) / 2) * (ctx.measureText(char).width + parseFloat(letterSpacing));
            ctx.fillText(char, xPos, yPos);
        }
    });
}

// 다운로드 버튼 기능
downloadBtn.addEventListener('click', () => {
    if (!uploadedImage) {
        alert('먼저 이미지를 업로드해주세요.');
        return;
    }

    const imageURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'edited_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
