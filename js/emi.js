document.addEventListener('DOMContentLoaded', function() {
    const emiForm = document.getElementById('emiCalculator');
    const resultDiv = document.getElementById('emiResult');
    const loanAmountInput = document.getElementById('loanAmount');
    const interestRateInput = document.getElementById('interestRate');
    const loanTermInput = document.getElementById('loanTerm');
    
    // Format currency input
    loanAmountInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value) {
            value = parseInt(value).toLocaleString();
        }
        e.target.value = value;
    });
    
    // Real-time calculation
    [loanAmountInput, interestRateInput, loanTermInput].forEach(input => {
        input.addEventListener('input', calculateEMI);
    });
    
    function calculateEMI() {
        const principal = parseInt(loanAmountInput.value.replace(/\D/g, '')) || 0;
        const annualRate = parseFloat(interestRateInput.value) || 0;
        const months = parseInt(loanTermInput.value) || 0;
        
        if (principal > 0 && annualRate > 0 && months > 0) {
            const monthlyRate = annualRate / 12 / 100;
            const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                       (Math.pow(1 + monthlyRate, months) - 1);
            const totalPayment = emi * months;
            const totalInterest = totalPayment - principal;
            
            document.getElementById('emiPreview').innerHTML = `
                <p><strong>Monthly EMI:</strong> ₹${emi.toFixed(2)}</p>
                <p><strong>Total Interest:</strong> ₹${totalInterest.toFixed(2)}</p>
                <p><strong>Total Payment:</strong> ₹${totalPayment.toFixed(2)}</p>
            `;
        }
    }
    
    emiForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const principal = parseInt(loanAmountInput.value.replace(/\D/g, '')) || 0;
        const annualRate = parseFloat(interestRateInput.value) || 0;
        const months = parseInt(loanTermInput.value) || 0;
        
        if (principal === 0 || annualRate === 0 || months === 0) {
            resultDiv.innerHTML = '<p class="error">Please enter valid values in all fields</p>';
            return;
        }
        
        const monthlyRate = annualRate / 12 / 100;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
        const totalPayment = emi * months;
        const totalInterest = totalPayment - principal;
        
        // Generate amortization schedule (first 12 months)
        let scheduleHTML = '<h4>Amortization Schedule (First 12 Months):</h4><table>';
        scheduleHTML += '<tr><th>Month</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>';
        
        let balance = principal;
        for (let i = 1; i <= Math.min(12, months); i++) {
            const interest = balance * monthlyRate;
            const principalPaid = emi - interest;
            balance -= principalPaid;
            
            scheduleHTML += `<tr>
                <td>${i}</td>
                <td>₹${emi.toFixed(2)}</td>
                <td>₹${principalPaid.toFixed(2)}</td>
                <td>₹${interest.toFixed(2)}</td>
                <td>₹${balance.toFixed(2)}</td>
            </tr>`;
        }
        scheduleHTML += '</table>';
        
        resultDiv.innerHTML = `
            <div class="result-value">₹${emi.toFixed(2)}</div>
            <p><strong>Monthly EMI Payment</strong></p>
            <div class="result-breakdown">
                <p>• Loan Amount: ₹${principal.toLocaleString()}</p>
                <p>• Total Interest: ₹${totalInterest.toFixed(2)}</p>
                <p>• Total Payment: ₹${totalPayment.toFixed(2)}</p>
                <p>• Interest Rate: ${annualRate}% per annum</p>
                <p>• Loan Term: ${months} months (${(months/12).toFixed(1)} years)</p>
            </div>
            ${scheduleHTML}
        `;
    });
});
