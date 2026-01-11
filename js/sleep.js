document.addEventListener('DOMContentLoaded', function() {
    const sleepForm = document.getElementById('sleepCalculator');
    const resultDiv = document.getElementById('sleepResult');
    
    // Display current time
    function updateCurrentTime() {
        const now = new Date();
        document.getElementById('currentTime').textContent = 
            now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000);
    
    sleepForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const wakeTime = document.getElementById('wakeTime').value;
        const bedtime = document.getElementById('bedtime').value;
        const sleepQuality = document.getElementById('sleepQuality').value;
        const sleepIssues = Array.from(document.querySelectorAll('input[name="sleepIssues"]:checked'))
                               .map(cb => cb.value);
        
        if (!wakeTime || !bedtime) {
            resultDiv.innerHTML = '<p class="error">Please enter both wake time and bedtime</p>';
            return;
        }
        
        // Calculate sleep duration
        const wakeDate = new Date(`2000-01-01T${wakeTime}`);
        let bedDate = new Date(`2000-01-01T${bedtime}`);
        
        // If bedtime is before wake time, add a day
        if (bedDate <= wakeDate) {
            bedDate = new Date(bedDate.getTime() + 24 * 60 * 60 * 1000);
        }
        
        let sleepHours = (bedDate - wakeDate) / (1000 * 60 * 60);
        if (sleepHours > 24) sleepHours -= 24;
        
        // Adjust sleep quality
        const qualityMultiplier = parseFloat(sleepQuality) / 10;
        const effectiveSleepHours = sleepHours * qualityMultiplier;
        
        // Calculate sleep cycles (assuming 90-minute cycles)
        const sleepCycles = Math.round(sleepHours * 60 / 90);
        const effectiveCycles = Math.round(effectiveSleepHours * 60 / 90);
        
        // Determine sleep recommendation
        let recommendation = '';
        let rating = '';
        
        if (effectiveSleepHours >= 7 && effectiveSleepHours <= 9) {
            recommendation = 'Great! You\'re getting optimal sleep.';
            rating = 'Excellent';
        } else if (effectiveSleepHours >= 6 && effectiveSleepHours < 7) {
            recommendation = 'You\'re getting adequate sleep but could use a bit more.';
            rating = 'Good';
        } else if (effectiveSleepHours < 6) {
            recommendation = 'You may be sleep deprived. Consider improving your sleep duration and quality.';
            rating = 'Needs Improvement';
        } else if (effectiveSleepHours > 9) {
            recommendation = 'You may be oversleeping, which can also affect health.';
            rating = 'Too Much Sleep';
        }
        
        // Generate bedtime suggestions
        const suggestions = generateSleepSuggestions(wakeTime, sleepIssues);
        
        resultDiv.innerHTML = `
            <div class="result-value">${sleepHours.toFixed(1)} hours</div>
            <p><strong>Sleep Duration</strong></p>
            <div class="result-breakdown">
                <p>• Effective Sleep: ${effectiveSleepHours.toFixed(1)} hours</p>
                <p>• Sleep Quality: ${(qualityMultiplier * 100).toFixed(0)}%</p>
                <p>• Sleep Cycles: ${sleepCycles} cycles (${effectiveCycles} effective)</p>
                <p>• Sleep Rating: <strong>${rating}</strong></p>
                <p>• Bedtime: ${bedtime}</p>
                <p>• Wake Time: ${wakeTime}</p>
            </div>
            <div class="sleep-recommendation">
                <h4>📝 Recommendation:</h4>
                <p>${recommendation}</p>
            </div>
            <div class="sleep-suggestions">
                <h4>💤 Suggested Bedtimes for Better Sleep:</h4>
                ${suggestions}
            </div>
            ${sleepIssues.length > 0 ? `
                <div class="sleep-issues">
                    <h4>⚠️ Addressing Your Sleep Issues:</h4>
                    <ul>
                        ${sleepIssues.map(issue => `<li>${getSleepIssueAdvice(issue)}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
    });
    
    function generateSleepSuggestions(wakeTime, issues) {
        const wakeDate = new Date(`2000-01-01T${wakeTime}`);
        const suggestions = [];
        
        // Calculate optimal bedtimes for complete sleep cycles
        for (let cycles = 5; cycles <= 6; cycles++) {
            const bedtime = new Date(wakeDate.getTime() - (cycles * 90 + 15) * 60 * 1000);
            const bedtimeStr = bedtime.toTimeString().substring(0, 5);
            suggestions.push(`
                <div class="bedtime-suggestion">
                    <strong>${bedtimeStr}</strong> - For ${cycles} complete sleep cycles
                </div>
            `);
        }
        
        return suggestions.join('');
    }
    
    function getSleepIssueAdvice(issue) {
        const advice = {
            insomnia: 'Try relaxation techniques before bed and maintain a consistent sleep schedule.',
            snoring: 'Consider sleeping on your side and avoid alcohol before bedtime.',
            apnea: 'Consult a healthcare provider for proper diagnosis and treatment options.',
            restless: 'Regular exercise and avoiding caffeine can help reduce restless legs.',
            waking: 'Keep your bedroom dark and cool, and avoid screens before bed.'
        };
        return advice[issue] || 'Practice good sleep hygiene habits.';
    }
    
    // Disclaimer functionality
    document.querySelector('.disclaimer-toggle').addEventListener('click', function() {
        document.querySelector('.medical-disclaimer').classList.toggle('hidden');
    });
});
