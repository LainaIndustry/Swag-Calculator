document.addEventListener('DOMContentLoaded', function() {
    const ageForm = document.getElementById('ageCalculator');
    const resultDiv = document.getElementById('ageResult');
    
    ageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const birthDate = new Date(document.getElementById('birthDate').value);
        const today = new Date();
        
        if (birthDate > today) {
            resultDiv.innerHTML = '<p class="error">Birth date cannot be in the future!</p>';
            return;
        }
        
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();
        
        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        
        if (months < 0) {
            years--;
            months += 12;
        }
        
        // Calculate total days
        const timeDiff = today.getTime() - birthDate.getTime();
        const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));
        const totalMonths = years * 12 + months;
        
        resultDiv.innerHTML = `
            <div class="result-value">${years} years, ${months} months, ${days} days</div>
            <div class="result-breakdown">
                <p><strong>Total Breakdown:</strong></p>
                <p>• ${totalDays.toLocaleString()} days</p>
                <p>• ${totalMonths.toLocaleString()} months</p>
                <p>• ${(totalDays/7).toFixed(0)} weeks</p>
                <p>• ${(totalDays/365.25).toFixed(1)} years</p>
            </div>
            <p class="next-birthday">Next birthday in: ${calculateNextBirthday(birthDate)} days</p>
        `;
    });
    
    function calculateNextBirthday(birthDate) {
        const today = new Date();
        const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        
        if (nextBirthday < today) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
        }
        
        const diffTime = nextBirthday.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
});
