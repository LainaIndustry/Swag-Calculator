// EMI Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const emiForm = document.getElementById('emiCalculator');
    const loanAmountInput = document.getElementById('loanAmount');
    const loanAmountSlider = document.getElementById('loanAmountSlider');
    const interestRateInput = document.getElementById('interestRate');
    const interestRateSlider = document.getElementById('interestRateSlider');
    const loanTermInput = document.getElementById('loanTerm');
    const loanTermSlider = document.getElementById('loanTermSlider');
    const loanTypeSelect = document.getElementById('loanType');
    const resetBtn = document.getElementById('resetBtn');
    const emiResults = document.getElementById('emiResults');
    const quickStats = document.getElementById('quickStats');
    const monthlyEMISpan = document.getElementById('monthlyEMI');
    const totalInterestSpan = document.getElementById('totalInterest');
    const totalPaymentSpan = document.getElementById('totalPayment');
    const amortizationBody = document.getElementById('amortizationBody');
    const showFullScheduleBtn = document.getElementById('showFullSchedule');
    const downloadScheduleBtn = document.getElementById('downloadSchedule');
    const comparisonGrid = document.getElementById('comparisonGrid');
    const addComparisonBtn = document.getElementById('addComparison');
    
    // Chart Variables
    let emiChart = null;
    
    // Initialize with default values
    initCalculator();
    
    // Initialize Calculator
    function initCalculator() {
        // Set up event listeners
        setupEventListeners();
        
        // Load saved data if exists
        loadSavedData();
        
        // Calculate initial EMI
        calculateEMI();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Form submission
        emiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateEMI();
            saveData();
        });
        
        // Real-time calculation on input change
        loanAmountInput.addEventListener('input', function() {
            const value = parseCurrency(this.value);
            loanAmountSlider.value = value || 0;
            calculateEMI();
        });
        
        loanAmountSlider.addEventListener('input', function() {
            loanAmountInput.value = formatCurrency(this.value);
            calculateEMI();
        });
        
        interestRateInput.addEventListener('input', function() {
            interestRateSlider.value = this.value || 0;
            calculateEMI();
        });
        
        interestRateSlider.addEventListener('input', function() {
            interestRateInput.value = this.value;
            calculateEMI();
        });
        
        loanTermInput.addEventListener('input', function() {
            loanTermSlider.value = this.value || 0;
            calculateEMI();
        });
        
        loanTermSlider.addEventListener('input', function() {
            loanTermInput.value = this.value;
            calculateEMI();
        });
        
        // Tenure toggle buttons
        document.querySelectorAll('.tenure-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const unit = this.getAttribute('data-unit');
                document.querySelectorAll('.tenure-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Update slider max values based on unit
                if (unit === 'months') {
                    loanTermSlider.max = 360;
                    loanTermSlider.value = Math.min(loanTermSlider.value * 12, 360);
                    loanTermInput.value = loanTermSlider.value;
                } else {
                    loanTermSlider.max = 30;
                    loanTermSlider.value = Math.min(loanTermSlider.value / 12, 30);
                    loanTermInput.value = loanTermSlider.value;
                }
                calculateEMI();
            });
        });
        
        // Reset button
        resetBtn.addEventListener('click', resetCalculator);
        
        // Show full schedule
        showFullScheduleBtn.addEventListener('click', showFullAmortizationSchedule);
        
        // Download schedule
        downloadScheduleBtn.addEventListener('click', downloadAmortizationSchedule);
        
        // Add comparison
        addComparisonBtn.addEventListener('click', addComparisonScenario);
    }
    
    // Format currency with commas
    function formatCurrency(amount) {
        if (!amount) return '0';
        return parseInt(amount).toLocaleString('en-IN');
    }
    
    // Parse currency from formatted string
    function parseCurrency(formattedAmount) {
        if (!formattedAmount) return 0;
        return parseInt(formattedAmount.replace(/,/g, ''));
    }
    
    // Calculate EMI
    function calculateEMI() {
        const principal = parseCurrency(loanAmountInput.value);
        const annualRate = parseFloat(interestRateInput.value);
        const tenure = parseInt(loanTermInput.value);
        const isMonths = document.querySelector('.tenure-btn[data-unit="months"]').classList.contains('active');
        
        // Validate inputs
        if (!principal || !annualRate || !tenure || principal <= 0 || annualRate <= 0 || tenure <= 0) {
            showError('Please enter valid loan details');
            return;
        }
        
        // Convert tenure to months if in years
        const months = isMonths ? tenure : tenure * 12;
        
        // Calculate EMI
        const monthlyRate = annualRate / 12 / 100;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
        
        // Calculate totals
        const totalPayment = emi * months;
        const totalInterest = totalPayment - principal;
        
        // Update UI
        updateResults(emi, totalInterest, totalPayment, principal);
        updateAmortizationSchedule(principal, monthlyRate, emi, months);
        updateChart(principal, totalInterest);
        updateComparisonGrid();
    }
    
    // Update results display
    function updateResults(emi, totalInterest, totalPayment, principal) {
        // Update quick stats
        monthlyEMISpan.textContent = '₹' + emi.toFixed(0).toLocaleString('en-IN');
        totalInterestSpan.textContent = '₹' + totalInterest.toFixed(0).toLocaleString('en-IN');
        totalPaymentSpan.textContent = '₹' + totalPayment.toFixed(0).toLocaleString('en-IN');
        
        // Show quick stats
        quickStats.classList.remove('hidden');
        
        // Update detailed results
        const loanType = loanTypeSelect.options[loanTypeSelect.selectedIndex].text;
        const tenureUnit = document.querySelector('.tenure-btn.active').getAttribute('data-unit');
        const tenureValue = loanTermInput.value;
        const interestType = document.querySelector('input[name="interestType"]:checked').value;
        
        emiResults.innerHTML = `
            <div class="detailed-results">
                <h3>Loan Summary</h3>
                <div class="result-details">
                    <div class="detail-item">
                        <span class="detail-label">Loan Type:</span>
                        <span class="detail-value">${loanType}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Loan Amount:</span>
                        <span class="detail-value">₹${formatCurrency(principal)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Interest Rate:</span>
                        <span class="detail-value">${interestRateInput.value}% ${interestType === 'fixed' ? 'Fixed' : 'Floating'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Tenure:</span>
                        <span class="detail-value">${tenureValue} ${tenureUnit}</span>
                    </div>
                    <div class="detail-item highlight">
                        <span class="detail-label">Monthly EMI:</span>
                        <span class="detail-value">₹${emi.toFixed(0).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Total Interest:</span>
                        <span class="detail-value">₹${totalInterest.toFixed(0).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Total Payment:</span>
                        <span class="detail-value">₹${totalPayment.toFixed(0).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Interest to Principal Ratio:</span>
                        <span class="detail-value">${((totalInterest / principal) * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Update amortization schedule
    function updateAmortizationSchedule(principal, monthlyRate, emi, months) {
        let scheduleHTML = '';
        let balance = principal;
        let totalPrincipal = 0;
        let totalInterest = 0;
        
        // Generate schedule for first 12 months or all months
        const displayMonths = Math.min(12, months);
        
        for (let i = 1; i <= displayMonths; i++) {
            const interest = balance * monthlyRate;
            const principalPaid = emi - interest;
            balance -= principalPaid;
            totalPrincipal += principalPaid;
            totalInterest += interest;
            
            scheduleHTML += `
                <tr>
                    <td>${i}</td>
                    <td>₹${emi.toFixed(0).toLocaleString('en-IN')}</td>
                    <td>₹${principalPaid.toFixed(0).toLocaleString('en-IN')}</td>
                    <td>₹${interest.toFixed(0).toLocaleString('en-IN')}</td>
                    <td>₹${balance.toFixed(0).toLocaleString('en-IN')}</td>
                </tr>
            `;
        }
        
        amortizationBody.innerHTML = scheduleHTML;
        
        // Update button text
        showFullScheduleBtn.textContent = months > 12 ? 'Show Full Schedule (' + months + ' months)' : 'Full Schedule';
    }
    
    // Show full amortization schedule in modal
    function showFullAmortizationSchedule() {
        const principal = parseCurrency(loanAmountInput.value);
        const annualRate = parseFloat(interestRateInput.value);
        const tenure = parseInt(loanTermInput.value);
        const isMonths = document.querySelector('.tenure-btn[data-unit="months"]').classList.contains('active');
        const months = isMonths ? tenure : tenure * 12;
        const monthlyRate = annualRate / 12 / 100;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
        
        let scheduleHTML = '';
        let balance = principal;
        
        for (let i = 1; i <= months; i++) {
            const interest = balance * monthlyRate;
            const principalPaid = emi - interest;
            balance -= principalPaid;
            
            // Add year markers
            if (i === 1 || i % 12 === 1) {
                const year = Math.ceil(i / 12);
                scheduleHTML += `
                    <tr class="year-marker">
                        <td colspan="5"><strong>Year ${year}</strong></td>
                    </tr>
                `;
            }
            
            scheduleHTML += `
                <tr>
                    <td>${i}</td>
                    <td>₹${emi.toFixed(0).toLocaleString('en-IN')}</td>
                    <td>₹${principalPaid.toFixed(0).toLocaleString('en-IN')}</td>
                    <td>₹${interest.toFixed(0).toLocaleString('en-IN')}</td>
                    <td>₹${balance.toFixed(0).toLocaleString('en-IN')}</td>
                </tr>
            `;
        }
        
        // Create modal
        const modalHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Full Amortization Schedule</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="schedule-summary">
                            <p><strong>Total Months:</strong> ${months} | <strong>Monthly EMI:</strong> ₹${emi.toFixed(0).toLocaleString('en-IN')}</p>
                        </div>
                        <div class="table-container">
                            <table class="full-schedule-table">
                                <thead>
                                    <tr>
                                        <th>Month</th>
                                        <th>EMI</th>
                                        <th>Principal</th>
                                        <th>Interest</th>
                                        <th>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${scheduleHTML}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="printSchedule" class="btn-secondary">Print Schedule</button>
                        <button id="exportSchedule" class="btn-primary">Export as CSV</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add modal event listeners
        const modal = document.querySelector('.modal-overlay');
        const closeBtn = modal.querySelector('.modal-close');
        const printBtn = modal.querySelector('#printSchedule');
        const exportBtn = modal.querySelector('#exportSchedule');
        
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        printBtn.addEventListener('click', () => window.print());
        exportBtn.addEventListener('click', () => downloadAmortizationSchedule());
        
        // Add CSS for modal
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                padding: 20px;
            }
            .modal-content {
                background: white;
                border-radius: 12px;
                max-width: 900px;
                width: 100%;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
            }
            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .modal-header h3 {
                margin: 0;
                color: var(--dark-color);
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--gray-color);
            }
            .modal-body {
                padding: 1.5rem;
                overflow-y: auto;
                flex: 1;
            }
            .modal-footer {
                padding: 1.5rem;
                border-top: 1px solid #e5e7eb;
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }
            .full-schedule-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 0.9rem;
            }
            .full-schedule-table th {
                background: #f8fafc;
                padding: 0.75rem;
                text-align: left;
                border-bottom: 2px solid #e5e7eb;
                position: sticky;
                top: 0;
            }
            .full-schedule-table td {
                padding: 0.5rem 0.75rem;
                border-bottom: 1px solid #e5e7eb;
            }
            .year-marker {
                background: #f0f9ff;
                font-weight: bold;
            }
            .year-marker td {
                padding: 0.75rem;
            }
        `;
        document.head.appendChild(modalStyle);
    }
    
    // Download amortization schedule as CSV
    function downloadAmortizationSchedule() {
        const principal = parseCurrency(loanAmountInput.value);
        const annualRate = parseFloat(interestRateInput.value);
        const tenure = parseInt(loanTermInput.value);
        const isMonths = document.querySelector('.tenure-btn[data-unit="months"]').classList.contains('active');
        const months = isMonths ? tenure : tenure * 12;
        const monthlyRate = annualRate / 12 / 100;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
        
        let csvContent = "Month,EMI,Principal,Interest,Balance\n";
        let balance = principal;
        
        for (let i = 1; i <= months; i++) {
            const interest = balance * monthlyRate;
            const principalPaid = emi - interest;
            balance -= principalPaid;
            
            csvContent += `${i},${emi.toFixed(2)},${principalPaid.toFixed(2)},${interest.toFixed(2)},${balance.toFixed(2)}\n`;
        }
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `emi-schedule-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    
    // Update chart
    function updateChart(principal, totalInterest) {
        const ctx = document.getElementById('emiChart').getContext('2d');
        
        // Destroy existing chart
        if (emiChart) {
            emiChart.destroy();
        }
        
        // Create new chart
        emiChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Principal Amount', 'Total Interest'],
                datasets: [{
                    data: [principal, totalInterest],
                    backgroundColor: [
                        '#4f46e5',
                        '#10b981'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ₹${value.toLocaleString('en-IN')} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Update comparison grid
    function updateComparisonGrid() {
        const principal = parseCurrency(loanAmountInput.value);
        const annualRate = parseFloat(interestRateInput.value);
        const tenure = parseInt(loanTermInput.value);
        const isMonths = document.querySelector('.tenure-btn[data-unit="months"]').classList.contains('active');
        const months = isMonths ? tenure : tenure * 12;
        const monthlyRate = annualRate / 12 / 100;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
        const totalPayment = emi * months;
        const totalInterest = totalPayment - principal;
        
        // Clear existing comparisons
        comparisonGrid.innerHTML = '';
        
        // Add current scenario
        addComparisonCard('Current', principal, annualRate, tenure, emi, totalInterest, totalPayment, '#4f46e5');
        
        // Add comparison scenarios
        // Scenario 1: Lower interest rate
        if (annualRate > 6) {
            const lowerRate = annualRate - 1;
            const lowerEMI = calculateEMIForRate(principal, lowerRate, months);
            const lowerTotal = lowerEMI * months;
            const lowerInterest = lowerTotal - principal;
            addComparisonCard('Lower Rate (-1%)', principal, lowerRate, tenure, lowerEMI, lowerInterest, lowerTotal, '#10b981');
        }
        
        // Scenario 2: Shorter tenure
        if (tenure > 5) {
            const shorterTenure = Math.max(5, Math.floor(tenure * 0.7));
            const shorterEMI = calculateEMIForTenure(principal, annualRate, shorterTenure, isMonths);
            const shorterMonths = isMonths ? shorterTenure : shorterTenure * 12;
            const shorterTotal = shorterEMI * shorterMonths;
            const shorterInterest = shorterTotal - principal;
            addComparisonCard('Shorter Tenure', principal, annualRate, shorterTenure, shorterEMI, shorterInterest, shorterTotal, '#f59e0b');
        }
        
        // Scenario 3: Higher down payment (lower principal)
        if (principal > 1000000) {
            const lowerPrincipal = principal * 0.8;
            const lowerPrincipalEMI = calculateEMIForPrincipal(lowerPrincipal, annualRate, months);
            const lowerPrincipalTotal = lowerPrincipalEMI * months;
            const lowerPrincipalInterest = lowerPrincipalTotal - lowerPrincipal;
            addComparisonCard('Higher Down Payment', lowerPrincipal, annualRate, tenure, lowerPrincipalEMI, lowerPrincipalInterest, lowerPrincipalTotal, '#ef4444');
        }
    }
    
    // Add comparison card
    function addComparisonCard(title, principal, rate, tenure, emi, interest, total, color) {
        const card = document.createElement('div');
        card.className = 'comparison-card';
        card.style.borderLeft = `4px solid ${color}`;
        
        card.innerHTML = `
            <h4>${title}</h4>
            <div class="comparison-details">
                <div class="comparison-item">
                    <span>Loan:</span>
                    <strong>₹${principal.toLocaleString('en-IN')}</strong>
                </div>
                <div class="comparison-item">
                    <span>Rate:</span>
                    <strong>${rate.toFixed(2)}%</strong>
                </div>
                <div class="comparison-item">
                    <span>Tenure:</span>
                    <strong>${tenure} ${document.querySelector('.tenure-btn.active').getAttribute('data-unit')}</strong>
                </div>
                <div class="comparison-item highlight">
                    <span>Monthly EMI:</span>
                    <strong>₹${emi.toFixed(0).toLocaleString('en-IN')}</strong>
                </div>
                <div class="comparison-item">
                    <span>Total Interest:</span>
                    <strong>₹${interest.toFixed(0).toLocaleString('en-IN')}</strong>
                </div>
                <div class="comparison-item">
                    <span>Total Payment:</span>
                    <strong>₹${total.toFixed(0).toLocaleString('en-IN')}</strong>
                </div>
            </div>
        `;
        
        comparisonGrid.appendChild(card);
    }
    
    // Add comparison scenario
    function addComparisonScenario() {
        const principal = parseCurrency(loanAmountInput.value);
        const annualRate = parseFloat(interestRateInput.value);
        const tenure = parseInt(loanTermInput.value);
        const isMonths = document.querySelector('.tenure-btn[data-unit="months"]').classList.contains('active');
        const months = isMonths ? tenure : tenure * 12;
        
        // Create custom scenario with random adjustments
        const scenarios = [
            { name: 'Rate +0.5%', rateChange: 0.5, tenureChange: 0, principalChange: 0 },
            { name: 'Rate -0.5%', rateChange: -0.5, tenureChange: 0, principalChange: 0 },
            { name: 'Tenure +5', rateChange: 0, tenureChange: 5, principalChange: 0 },
            { name: 'Tenure -5', rateChange: 0, tenureChange: -5, principalChange: 0 },
            { name: 'Principal +10%', rateChange: 0, tenureChange: 0, principalChange: 0.1 },
            { name: 'Principal -10%', rateChange: 0, tenureChange: 0, principalChange: -0.1 }
        ];
        
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const newRate = annualRate + randomScenario.rateChange;
        const newTenure = Math.max(1, tenure + randomScenario.tenureChange);
        const newPrincipal = Math.max(10000, principal * (1 + randomScenario.principalChange));
        const newMonths = isMonths ? newTenure : newTenure * 12;
        
        const monthlyRate = newRate / 12 / 100;
        const emi = newPrincipal * monthlyRate * Math.pow(1 + monthlyRate, newMonths) / 
                   (Math.pow(1 + monthlyRate, newMonths) - 1);
        const totalPayment = emi * newMonths;
        const totalInterest = totalPayment - newPrincipal;
        
        addComparisonCard(`Custom: ${randomScenario.name}`, newPrincipal, newRate, newTenure, emi, totalInterest, totalPayment, '#8b5cf6');
    }
    
    // Helper calculation functions
    function calculateEMIForRate(principal, rate, months) {
        const monthlyRate = rate / 12 / 100;
        return principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
               (Math.pow(1 + monthlyRate, months) - 1);
    }
    
    function calculateEMIForTenure(principal, rate, tenure, isMonths) {
        const months = isMonths ? tenure : tenure * 12;
        const monthlyRate = rate / 12 / 100;
        return principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
               (Math.pow(1 + monthlyRate, months) - 1);
    }
    
    function calculateEMIForPrincipal(principal, rate, months) {
        const monthlyRate = rate / 12 / 100;
        return principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
               (Math.pow(1 + monthlyRate, months) - 1);
    }
    
    // Reset calculator
    function resetCalculator() {
        loanAmountInput.value = '25,00,000';
        loanAmountSlider.value = 2500000;
        interestRateInput.value = '8.5';
        interestRateSlider.value = 8.5;
        loanTermInput.value = '20';
        loanTermSlider.value = 20;
        loanTypeSelect.value = 'home';
        document.querySelector('input[name="interestType"][value="fixed"]').checked = true;
        
        // Reset to years
        document.querySelectorAll('.tenure-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.tenure-btn[data-unit="years"]').classList.add('active');
        
        // Clear results
        emiResults.innerHTML = `
            <div class="result-placeholder">
                <div class="placeholder-icon">💰</div>
                <p>Enter loan details and click "Calculate EMI" to see results</p>
            </div>
        `;
        
        quickStats.classList.add('hidden');
        amortizationBody.innerHTML = `
            <tr class="placeholder-row">
                <td colspan="5">Calculate to see payment schedule</td>
            </tr>
        `;
        
        comparisonGrid.innerHTML = '';
        
        // Destroy chart
        if (emiChart) {
            emiChart.destroy();
            emiChart = null;
        }
        
        // Clear saved data
        localStorage.removeItem('emiCalculatorData');
    }
    
    // Save data to localStorage
    function saveData() {
        const data = {
            loanAmount: loanAmountInput.value,
            interestRate: interestRateInput.value,
            loanTerm: loanTermInput.value,
            loanType: loanTypeSelect.value,
            interestType: document.querySelector('input[name="interestType"]:checked').value,
            tenureUnit: document.querySelector('.tenure-btn.active').getAttribute('data-unit')
        };
        localStorage.setItem('emiCalculatorData', JSON.stringify(data));
    }
    
    // Load saved data from localStorage
    function loadSavedData() {
        const savedData = localStorage.getItem('emiCalculatorData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                loanAmountInput.value = data.loanAmount || '25,00,000';
                loanAmountSlider.value = parseCurrency(data.loanAmount) || 2500000;
                interestRateInput.value = data.interestRate || '8.5';
                interestRateSlider.value = parseFloat(data.interestRate) || 8.5;
                loanTermInput.value = data.loanTerm || '20';
                loanTermSlider.value = parseInt(data.loanTerm) || 20;
                loanTypeSelect.value = data.loanType || 'home';
                
                if (data.interestType) {
                    document.querySelector(`input[name="interestType"][value="${data.interestType}"]`).checked = true;
                }
                
                if (data.tenureUnit) {
                    document.querySelectorAll('.tenure-btn').forEach(b => b.classList.remove('active'));
                    document.querySelector(`.tenure-btn[data-unit="${data.tenureUnit}"]`).classList.add('active');
                }
                
                // Recalculate
                setTimeout(() => calculateEMI(), 100);
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }
    
    // Show error message
    function showError(message) {
        emiResults.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <p>${message}</p>
            </div>
        `;
        
        // Add error styles
        const style = document.createElement('style');
        style.textContent = `
            .error-message {
                text-align: center;
                padding: 2rem;
                color: #dc2626;
            }
            .error-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 3000);
    }
});
