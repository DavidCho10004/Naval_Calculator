document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('adjustForm');
    const resultSection = document.getElementById('results');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const jsonData = {};
        for (const [key, value] of formData.entries()) {
            jsonData[key] = parseFloat(value);
        }

        // Calculate trim and heel
        const trim = (jsonData.fwd_draft - jsonData.aft_draft) * 100; // Convert to cm
        const heel = (jsonData.mid_s_draft - jsonData.mid_p_draft) * 100; // Convert to cm

        // Display calculated trim and heel
        document.getElementById('calculatedTrim').textContent = trim.toFixed(1);
        document.getElementById('calculatedHeel').textContent = heel.toFixed(1);

        // Calculate weights for trim and heel adjustment
        const weightTrim = -(trim * jsonData.mtc) / (jsonData.position - jsonData.lcf);
        const weightHeel = -(heel / 100) * jsonData.displacement * jsonData.gm / (jsonData.position_center * jsonData.breadth);
        const totalWeight = weightTrim + weightHeel;

        // Calculate expected drafts
        const averageDraft = (jsonData.fwd_draft + jsonData.aft_draft) / 2;
        const expectedDraft = averageDraft + weightTrim / jsonData.tpc / 100;

        // Display results
        document.getElementById('weightTrimResult').textContent = weightTrim.toFixed(2);
        document.getElementById('weightHeelResult').textContent = weightHeel.toFixed(2);
        document.getElementById('totalWeightResult').textContent = totalWeight.toFixed(2);
        
        // Display expected drafts
        document.getElementById('exp_fwd_draft').value = expectedDraft.toFixed(2);
        document.getElementById('exp_aft_draft').value = expectedDraft.toFixed(2);

        resultSection.style.display = 'block';
    });

    // Real-time input validation (unchanged)
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
