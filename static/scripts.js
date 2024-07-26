document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('adjustForm');
    const resultSection = document.getElementById('results');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

        // 폼 데이터 수집
        const displacement = parseFloat(document.getElementById('displacement').value);
        const breadth = parseFloat(document.getElementById('breadth').value);
        const tpc = parseFloat(document.getElementById('tpc').value);
        const gm = parseFloat(document.getElementById('gm').value);
        const mtc = parseFloat(document.getElementById('mtc').value);
        const lcf = parseFloat(document.getElementById('lcf').value);
        const fwdDraft = parseFloat(document.getElementById('fwd_draft').value);
        const midPDraft = parseFloat(document.getElementById('mid_p_draft').value);
        const midSDraft = parseFloat(document.getElementById('mid_s_draft').value);
        const aftDraft = parseFloat(document.getElementById('aft_draft').value);
        const position = parseFloat(document.getElementById('position').value);
        const positionCenter = parseFloat(document.getElementById('position_center').value);

        // 트림과 힐 계산
        const trim = (fwdDraft - aftDraft) * 100; // cm로 변환
        const heel = (midSDraft - midPDraft) * 100; // cm로 변환

        // 계산된 트림과 힐 표시
        document.getElementById('calculatedTrim').textContent = trim.toFixed(1);
        document.getElementById('calculatedHeel').textContent = heel.toFixed(1);

        // 트림과 힐 조정을 위한 무게 계산
        const weightTrim = -(trim * mtc) / (position - lcf);
        const weightHeel = -(heel / 100) * displacement * gm / (positionCenter * breadth);
        const totalWeight = weightTrim + weightHeel;

        // 예상 흘수 계산
        const averageDraft = (fwdDraft + aftDraft) / 2;
        const expectedDraft = averageDraft + weightTrim / tpc / 100;

        // 결과 표시
        document.getElementById('weightTrimResult').textContent = weightTrim.toFixed(2);
        document.getElementById('weightHeelResult').textContent = weightHeel.toFixed(2);
        document.getElementById('totalWeightResult').textContent = totalWeight.toFixed(2);

        // 예상 흘수 표시
        document.getElementById('exp_fwd_draft').value = expectedDraft.toFixed(2);
        document.getElementById('exp_aft_draft').value = expectedDraft.toFixed(2);

        resultSection.style.display = 'block';
    });

    // 실시간 입력 유효성 검사
    const inputs = form.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0 && this.id !== 'position_center') {
                this.setCustomValidity('Negative values are not allowed / 음수는 입력할 수 없습니다.');
            } else {
                this.setCustomValidity('');
            }
        });
    });
});
