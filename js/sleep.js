// Sleep Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const bedtimeForm = document.getElementById('bedtimeCalculator');
    const wakeTimeInput = document.getElementById('wakeTime');
    const useCurrentTimeBtn = document.getElementById('useCurrentTime');
    const sleepDurationRadios = document.querySelectorAll('input[name="sleepDuration"]');
    const customDurationContainer = document.getElementById('customDurationContainer');
    const customSleepSlider = document.getElementById('customSleepHours');
    const customSleepValueSpan = document.getElementById('customSleepValue');
    const fallAsleepSlider = document.getElementById('fallAsleepTime');
    const fallAsleepValueSpan = document.getElementById('fallAsleepValue');
    const sleepFactorsCheckboxes = document.querySelectorAll('input[name="sleepFactors"]');
    const resetBedtimeBtn = document.getElementById('resetBedtime');
    const bedtimeResults = document.getElementById('bedtimeResults');
    const sleepTimeline = document.getElementById('sleepTimeline');
    const bedtimeMarker = document.getElementById('bedtimeMarker');
    const waketimeMarker = document.getElementById('waketimeMarker');
    const timelineDuration = document.getElementById('timelineDuration');
    const fallAsleepPhase = document.getElementById('fallAsleepPhase');
    const sleepCyclesVisual = document.getElementById('sleepCyclesVisual');
    const recommendationsGrid = document.getElementById('recommendationsGrid');
    
    // Wake Time Calculator Elements
    const bedtimeInput = document.getElementById('bedtimeInput');
    const cycleButtons = document.querySelectorAll('.cycle-btn');
    const calculateWaketimeBtn = document.getElementById('calculateWaketime');
    const waketimeResultDiv = document.getElementById('waketimeResult');
    const waketimeResultValueSpan = document.getElementById('waketimeResultValue');
    const totalSleepHoursSpan = document.getElementById('totalSleepHours');
    const sleepCyclesCountSpan = document.getElementById('sleepCyclesCount');
    
    // Sleep Quality Assessment Elements
    const assessSleepQualityBtn = document.getElementById('assessSleepQuality');
    const sleepHoursRadios = document.querySelectorAll('input[name="sleepHours"]');
    const consistencyRadios = document.querySelectorAll('input[name="consistency"]');
    const energyRadios = document.querySelectorAll('input[name="energy"]');
    const qualityResultDiv = document.getElementById('qualityResult');
    
    // Variables
    let currentSleepCycles = 5; // Default: 5 cycles (7.5 hours)
    let currentCycleBtn = document.querySelector('.cycle-btn.active');
    
    // Initialize calculator
    initCalculator();
    
    // Initialize Calculator
    function initCalculator() {
        // Set up event listeners
        setupEventListeners();
        
        // Load saved data if exists
        loadSavedData();
        
        // Initialize sliders
        updateCustomSleepValue();
        updateFallAsleepValue();
        
        // Calculate initial bedtime
        calculateBedtime();
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // Bedtime Form submission
        bedtimeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateBedtime();
            saveData();
        });
        
        // Use current time button
        useCurrentTimeBtn.addEventListener('click', setCurrentTime);
        
        // Sleep duration radio buttons
        sleepDurationRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'custom') {
                    customDurationContainer.classList.remove('hidden');
                } else {
                    customDurationContainer.classList.add('hidden');
                }
                calculateBedtime();
            });
        });
        
        // Custom sleep duration slider
        customSleepSlider.addEventListener('input', function() {
            updateCustomSleepValue();
            calculateBedtime();
        });
        
        // Fall asleep time slider
        fallAsleepSlider.addEventListener('input', function() {
            updateFallAsleepValue();
            calculateBedtime();
        });
        
        // Sleep factors checkboxes
        sleepFactorsCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', calculateBedtime);
        });
        
        // Reset button
        resetBedtimeBtn.addEventListener('click', resetBedtimeCalculator);
        
        // Wake time calculator
        cycleButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                cycleButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentCycleBtn = this;
                
                // Update cycles
                currentSleepCycles = parseInt(this.getAttribute('data-cycles'));
                calculateWaketime();
            });
        });
        
        calculateWaketimeBtn.addEventListener('click', calculateWaketime);
        
        // Sleep quality assessment
        assessSleepQualityBtn.addEventListener('click', assessSleepQuality);
    }
    
    // Set current time in wake time input
    function setCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        wakeTimeInput.value = `${hours}:${minutes}`;
        calculateBedtime();
    }
    
    // Update custom sleep value display
    function updateCustomSleepValue() {
        const value = parseFloat(customSleepSlider.value);
        customSleepValueSpan.textContent = `${value} hours`;
    }
    
    // Update fall asleep value display
    function updateFallAsleepValue() {
        const value = parseInt(fallAsleepSlider.value);
        fallAsleepValueSpan.textContent = `${value} minutes`;
    }
    
    // Calculate bedtime
    function calculateBedtime() {
        // Get wake time
        const wakeTime = wakeTimeInput.value;
        if (!wakeTime) {
            showError('Please enter a wake-up time');
            return;
        }
        
        // Get sleep duration
        let sleepDuration;
        const selectedDuration = document.querySelector('input[name="sleepDuration"]:checked').value;
        
        if (selectedDuration === 'short') {
            sleepDuration = 6; // 4 cycles
        } else if (selectedDuration === 'recommended') {
            sleepDuration = 7.5; // 5 cycles
        } else if (selectedDuration === 'long') {
            sleepDuration = 9; // 6 cycles
        } else {
            sleepDuration = parseFloat(customSleepSlider.value);
        }
        
        // Get fall asleep time in hours
        const fallAsleepTime = parseInt(fallAsleepSlider.value) / 60;
        
        // Calculate bedtime
        const wakeDate = new Date(`2000-01-01T${wakeTime}`);
        const bedtime = new Date(wakeDate.getTime() - (sleepDuration * 60 * 60 * 1000) - (fallAsleepTime * 60 * 60 * 1000));
        
        // Format times
        const bedtimeFormatted = formatTime(bedtime);
        const wakeTimeFormatted = formatTime(wakeDate);
        
        // Calculate cycles
        const cycles = Math.round(sleepDuration / 1.5);
        
        // Get sleep factors
        const factors = getSleepFactors();
        
        // Update UI
        updateBedtimeResults(bedtimeFormatted, wakeTimeFormatted, sleepDuration, cycles, factors);
        updateTimeline(bedtimeFormatted, wakeTimeFormatted, sleepDuration, fallAsleepTime);
        updateRecommendations(wakeTime, sleepDuration, cycles);
    }
    
    // Calculate wake time
    function calculateWaketime() {
        const bedtime = bedtimeInput.value;
        if (!bedtime) {
            showError('Please enter a bedtime');
            return;
        }
        
        // Calculate sleep duration based on cycles
        const sleepDuration = currentSleepCycles * 1.5; // 1.5 hours per cycle
        const fallAsleepTime = 0.25; // 15 minutes to fall asleep
        
        // Calculate wake time
        const bedtimeDate = new Date(`2000-01-01T${bedtime}`);
        const wakeDate = new Date(bedtimeDate.getTime() + (sleepDuration * 60 * 60 * 1000) + (fallAsleepTime * 60 * 60 * 1000));
        
        // Format times
        const wakeTimeFormatted = formatTime(wakeDate);
        
        // Update UI
        waketimeResultValueSpan.textContent = wakeTimeFormatted;
        totalSleepHoursSpan.textContent = sleepDuration.toFixed(1);
        sleepCyclesCountSpan.textContent = currentSleepCycles;
        
        waketimeResultDiv.classList.remove('hidden');
    }
    
    // Assess sleep quality
    function assessSleepQuality() {
        // Get ratings
        const sleepHoursRating = getSelectedRating(sleepHoursRadios);
        const consistencyRating = getSelectedRating(consistencyRadios);
        const energyRating = getSelectedRating(energyRadios);
        
        if (!sleepHoursRating || !consistencyRating || !energyRating) {
            showError('Please answer all questions');
            return;
        }
        
        // Calculate score
        const ratings = {
            'poor': 1,
            'fair': 2,
            'good': 3,
            'excellent': 4
        };
        
        const totalScore = ratings[sleepHoursRating] + ratings[consistencyRating] + ratings[energyRating];
        const maxScore = 12;
        const percentage = (totalScore / maxScore) * 100;
        
        // Determine quality level
        let qualityLevel, qualityColor, recommendations;
        
        if (percentage >= 75) {
            qualityLevel = 'Excellent';
            qualityColor = '#10b981';
            recommendations = [
                'Maintain your excellent sleep habits',
                'Continue with your consistent schedule',
                'Keep up your relaxation routine'
            ];
        } else if (percentage >= 50) {
            qualityLevel = 'Good';
            qualityColor = '#f59e0b';
            recommendations = [
                'Work on more consistent sleep timing',
                'Improve your bedtime routine',
                'Reduce screen time before bed'
            ];
        } else if (percentage >= 25) {
            qualityLevel = 'Fair';
            qualityColor = '#ef4444';
            recommendations = [
                'Establish a consistent sleep schedule',
                'Create a relaxing bedtime routine',
                'Improve your sleep environment',
                'Consider reducing caffeine intake'
            ];
        } else {
            qualityLevel = 'Poor';
            qualityColor = '#dc2626';
            recommendations = [
                'Consult a healthcare professional',
                'Establish strict sleep schedule',
                'Create optimal sleep environment',
                'Practice relaxation techniques',
                'Consider keeping a sleep diary'
            ];
        }
        
        // Update UI
        qualityResultDiv.innerHTML = `
            <div class="quality-score" style="border-left-color: ${qualityColor}">
                <div class="score-header">
                    <h4>Your Sleep Quality: ${qualityLevel}</h4>
                    <div class="score-value" style="color: ${qualityColor}">${Math.round(percentage)}%</div>
                </div>
                <div class="score-breakdown">
                    <div class="breakdown-item">
                        <span>Sleep Duration:</span>
                        <span class="rating-badge rating-${sleepHoursRating}">${sleepHoursRating}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Consistency:</span>
                        <span class="rating-badge rating-${consistencyRating}">${consistencyRating}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Morning Energy:</span>
                        <span class="rating-badge rating-${energyRating}">${energyRating}</span>
                    </div>
                </div>
                <div class="recommendations">
                    <h5>Recommendations:</h5>
                    <ul>
                        ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
                <div class="quality-note">
                    <small>This assessment is for informational purposes only. Consult a healthcare professional for medical advice.</small>
                </div>
            </div>
        `;
        
        // Add CSS for rating badges
        const style = document.createElement('style');
        style.textContent = `
            .rating-badge {
                padding: 0.25rem 0.5rem;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
            }
            .rating-poor {
                background: #fee2e2;
                color: #991b1b;
            }
            .rating-fair {
                background: #fef3c7;
                color: #92400e;
            }
            .rating-good {
                background: #d1fae5;
                color: #065f46;
            }
            .rating-excellent {
                background: #dbeafe;
                color: #1e40af;
            }
        `;
        if (!document.querySelector('#rating-badges-style')) {
            style.id = 'rating-badges-style';
            document.head.appendChild(style);
        }
        
        qualityResultDiv.classList.remove('hidden');
    }
    
    // Get selected rating from radio buttons
    function getSelectedRating(radioButtons) {
        for (const radio of radioButtons) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return null;
    }
    
    // Get sleep factors
    function getSleepFactors() {
        const factors = [];
        sleepFactorsCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                factors.push(checkbox.value);
            }
        });
        return factors;
    }
    
    // Update bedtime results
    function updateBedtimeResults(bedtime, waketime, duration, cycles, factors) {
        // Calculate adjustments based on factors
        let adjustment = 0;
        let factorMessages = [];
        
        if (factors.includes('caffeine')) {
            adjustment += 15;
            factorMessages.push('Caffeine after 2 PM may delay sleep onset');
        }
        if (factors.includes('alcohol')) {
            adjustment += 30;
            factorMessages.push('Alcohol before bed disrupts sleep quality');
        }
        if (factors.includes('screen')) {
            adjustment += 20;
            factorMessages.push('Screen use before bed suppresses melatonin');
        }
        if (factors.includes('stress')) {
            adjustment += 25;
            factorMessages.push('High stress increases time to fall asleep');
        }
        if (factors.includes('exercise')) {
            adjustment -= 10; // Exercise helps fall asleep faster
            factorMessages.push('Evening exercise can help sleep quality');
        }
        
        // Apply adjustment to bedtime
        const adjustedBedtime = adjustTime(bedtime, -adjustment);
        
        // Update results display
        bedtimeResults.innerHTML = `
            <div class="sleep-schedule-result">
                <div class="schedule-main">
                    <div class="schedule-item bedtime">
                        <span class="schedule-label">Go to bed at:</span>
                        <span class="schedule-value">${adjustedBedtime}</span>
                        ${adjustment > 0 ? `<span class="schedule-adjustment">(+${adjustment} min for sleep factors)</span>` : ''}
                    </div>
                    <div class="schedule-divider">→</div>
                    <div class="schedule-item waketime">
                        <span class="schedule-label">Wake up at:</span>
                        <span class="schedule-value">${waketime}</span>
                    </div>
                </div>
                
                <div class="schedule-details">
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Total Sleep:</span>
                            <span class="detail-value">${duration.toFixed(1)} hours</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Sleep Cycles:</span>
                            <span class="detail-value">${cycles} cycles</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Time to Fall Asleep:</span>
                            <span class="detail-value">${parseInt(fallAsleepSlider.value)} minutes</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Sleep Quality Factors:</span>
                            <span class="detail-value">${factors.length} selected</span>
                        </div>
                    </div>
                    
                    ${factorMessages.length > 0 ? `
                        <div class="factor-messages">
                            <h4>Sleep Factor Notes:</h4>
                            <ul>
                                ${factorMessages.map(msg => `<li>${msg}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Show timeline
        sleepTimeline.classList.remove('hidden');
    }
    
    // Update timeline visualization
    function updateTimeline(bedtime, waketime, duration, fallAsleepTime) {
        bedtimeMarker.textContent = bedtime;
        waketimeMarker.textContent = waketime;
        timelineDuration.textContent = `${duration.toFixed(1)} hours total`;
        
        // Calculate percentages for timeline
        const totalMinutes = duration * 60;
        const fallAsleepMinutes = fallAsleepTime * 60;
        const sleepMinutes = totalMinutes - fallAsleepMinutes;
        
        const fallAsleepPercent = (fallAsleepMinutes / totalMinutes) * 100;
        const sleepPercent = (sleepMinutes / totalMinutes) * 100;
        
        // Update visual elements
        fallAsleepPhase.style.width = `${fallAsleepPercent}%`;
        
        // Calculate cycles for visual
        const cycles = Math.round(duration / 1.5);
        const cycleWidth = 100 / cycles;
        
        // Create cycle pattern (if supported)
        if (sleepCyclesVisual) {
            sleepCyclesVisual.style.background = `repeating-linear-gradient(
                90deg,
                #4f46e5,
                #4f46e5 ${cycleWidth * 0.7}%,
                #4338ca ${cycleWidth * 0.7}%,
                #4338ca ${cycleWidth}%
            )`;
            sleepCyclesVisual.style.left = `${fallAsleepPercent}%`;
            sleepCyclesVisual.style.width = `${sleepPercent}%`;
        }
    }
    
    // Update recommendations
    function updateRecommendations(wakeTime, preferredDuration, preferredCycles) {
        const wakeDate = new Date(`2000-01-01T${wakeTime}`);
        
        const recommendations = [
            { cycles: 5, label: 'Optimal', class: 'optimal', duration: 7.5 },
            { cycles: 4, label: 'Minimum', class: 'minimum', duration: 6 },
            { cycles: 6, label: 'Extended', class: 'alternative', duration: 9 },
            { cycles: 7, label: 'Recovery', class: 'alternative', duration: 10.5 }
        ];
        
        let recommendationsHTML = '';
        
        recommendations.forEach(rec => {
            const bedtime = new Date(wakeDate.getTime() - (rec.duration * 60 * 60 * 1000) - (15 * 60 * 1000));
            const bedtimeFormatted = formatTime(bedtime);
            
            recommendationsHTML += `
                <div class="recommendation-card ${rec.class}">
                    <div class="recommendation-time">${bedtimeFormatted}</div>
                    <div class="recommendation-label">${rec.label}</div>
                    <div class="recommendation-details">
                        ${rec.cycles} cycles<br>
                        ${rec.duration} hours
                    </div>
                </div>
            `;
        });
        
        recommendationsGrid.innerHTML = recommendationsHTML;
        
        // Show recommendations container
        document.getElementById('bedtimeRecommendations').classList.remove('hidden');
    }
    
    // Format time to 12-hour format
    function formatTime(date) {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12
        
        return `${hours}:${minutes} ${ampm}`;
    }
    
    // Adjust time by minutes
    function adjustTime(timeString, minutes) {
        const [time, period] = timeString.split(' ');
        let [hours, minutesPart] = time.split(':').map(Number);
        
        // Convert to 24-hour format
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        // Create date object and adjust
        const date = new Date(2000, 0, 1, hours, minutesPart);
        date.setMinutes(date.getMinutes() + minutes);
        
        // Format back to 12-hour
        return formatTime(date);
    }
    
    // Reset bedtime calculator
    function resetBedtimeCalculator() {
        // Reset form values
        wakeTimeInput.value = '07:00';
        
        sleepDurationRadios.forEach(radio => {
            radio.checked = radio.value === 'recommended';
        });
        
        customDurationContainer.classList.add('hidden');
        customSleepSlider.value = '7.5';
        updateCustomSleepValue();
        
        fallAsleepSlider.value = '15';
        updateFallAsleepValue();
        
        sleepFactorsCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear results
        bedtimeResults.innerHTML = `
            <div class="result-placeholder">
                <div class="placeholder-icon">🌙</div>
                <p>Enter your wake-up time and click "Calculate Bedtime" to see your optimal sleep schedule</p>
            </div>
        `;
        
        sleepTimeline.classList.add('hidden');
        document.getElementById('bedtimeRecommendations').classList.add('hidden');
        
        // Clear saved data
        localStorage.removeItem('sleepCalculatorData');
    }
    
    // Save data to localStorage
    function saveData() {
        const data = {
            wakeTime: wakeTimeInput.value,
            sleepDuration: document.querySelector('input[name="sleepDuration"]:checked').value,
            customSleepHours: customSleepSlider.value,
            fallAsleepTime: fallAsleepSlider.value,
            sleepFactors: getSleepFactors()
        };
        
        localStorage.setItem('sleepCalculatorData', JSON.stringify(data));
    }
    
    // Load saved data from localStorage
    function loadSavedData() {
        const savedData = localStorage.getItem('sleepCalculatorData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                if (data.wakeTime) wakeTimeInput.value = data.wakeTime;
                
                if (data.sleepDuration) {
                    document.querySelector(`input[name="sleepDuration"][value="${data.sleepDuration}"]`).checked = true;
                    if (data.sleepDuration === 'custom') {
                        customDurationContainer.classList.remove('hidden');
                    }
                }
                
                if (data.customSleepHours) {
                    customSleepSlider.value = data.customSleepHours;
                    updateCustomSleepValue();
                }
                
                if (data.fallAsleepTime) {
                    fallAsleepSlider.value = data.fallAsleepTime;
                    updateFallAsleepValue();
                }
                
                if (data.sleepFactors && Array.isArray(data.sleepFactors)) {
                    sleepFactorsCheckboxes.forEach(checkbox => {
                        checkbox.checked = data.sleepFactors.includes(checkbox.value);
                    });
                }
                
                // Recalculate
                setTimeout(() => calculateBedtime(), 100);
                
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }
    
    // Show error message
    function showError(message) {
        bedtimeResults.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <p>${message}</p>
            </div>
        `;
        
        sleepTimeline.classList.add('hidden');
        document.getElementById('bedtimeRecommendations').classList.add('hidden');
    }
});
