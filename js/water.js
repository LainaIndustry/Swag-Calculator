document.addEventListener('DOMContentLoaded', function() {
    const waterForm = document.getElementById('waterCalculator');
    const resultDiv = document.getElementById('waterResult');
    
    // Activity level descriptions
    const activityLevels = {
        sedentary: 'Little or no exercise (office job)',
        light: 'Light exercise 1-3 days/week',
        moderate: 'Moderate exercise 3-5 days/week',
        active: 'Hard exercise 6-7 days/week',
        veryActive: 'Very hard exercise & physical job'
    };
    
    // Climate descriptions
    const climates = {
        moderate: 'Temperate climate',
        hot: 'Hot/dry climate',
        veryHot: 'Very hot/humid climate'
    };
    
    waterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const weight = parseFloat(document.getElementById('weight').value);
        const activity = document.getElementById('activity').value;
        const climate = document.getElementById('climate').value;
        const isPregnant = document.getElementById('pregnant').checked;
        const isBreastfeeding = document.getElementById('breastfeeding').checked;
        
        if (!weight || weight <= 0) {
            resultDiv.innerHTML = '<p class="error">Please enter a valid weight</p>';
            return;
        }
        
        // Calculate base water needs (30-35 ml per kg)
        let waterMl = weight * 35;
        
        // Adjust for activity level
        const activityMultipliers = {
            sedentary: 1.0,
            light: 1.2,
            moderate: 1.4,
            active: 1.6,
            veryActive: 1.8
        };
        waterMl *= activityMultipliers[activity];
        
        // Adjust for climate
        const climateMultipliers = {
            moderate: 1.0,
            hot: 1.2,
            veryHot: 1.5
        };
        waterMl *= climateMultipliers[climate];
        
        // Adjust for pregnancy/breastfeeding
        if (isPregnant) waterMl += 300;
        if (isBreastfeeding) waterMl += 700;
        
        const waterLiters = waterMl / 1000;
        const glasses = Math.ceil(waterMl / 250);
        const bottles = Math.ceil(waterMl / 500);
        
        // Create hydration schedule
        const schedule = generateHydrationSchedule(glasses);
        
        resultDiv.innerHTML = `
            <div class="result-value">${waterLiters.toFixed(2)} L</div>
            <p><strong>Daily Water Intake Recommendation</strong></p>
            <div class="result-breakdown">
                <p>• ${waterMl.toFixed(0)} ml per day</p>
                <p>• ${glasses} glasses (250ml each)</p>
                <p>• ${bottles} bottles (500ml each)</p>
                <p>• Activity Level: ${activityLevels[activity]}</p>
                <p>• Climate: ${climates[climate]}</p>
                ${isPregnant ? '<p>• Additional for pregnancy: +300ml</p>' : ''}
                ${isBreastfeeding ? '<p>• Additional for breastfeeding: +700ml</p>' : ''}
            </div>
            <h4>Recommended Hydration Schedule:</h4>
            <div class="schedule">
                ${schedule}
            </div>
            <div class="water-tips">
                <h4>💧 Tips for Better Hydration:</h4>
                <ul>
                    <li>Start your day with 1-2 glasses of water</li>
                    <li>Keep a water bottle with you throughout the day</li>
                    <li>Drink water before meals</li>
                    <li>Monitor your urine color (pale yellow is ideal)</li>
                    <li>Eat water-rich foods (fruits, vegetables)</li>
                </ul>
            </div>
        `;
    });
    
    function generateHydrationSchedule(totalGlasses) {
        const times = [
            'Morning (7-8 AM)',
            'Breakfast (9 AM)',
            'Mid-Morning (11 AM)',
            'Lunch (1 PM)',
            'Afternoon (3 PM)',
            'Evening (5 PM)',
            'Dinner (7 PM)',
            'Before Bed (9 PM)'
        ];
        
        let scheduleHTML = '';
        let glassesPerTime = Math.ceil(totalGlasses / times.length);
        
        times.forEach((time, index) => {
            if (index < totalGlasses) {
                scheduleHTML += `
                    <div class="schedule-item">
                        <span class="time">${time}</span>
                        <span class="water-amount">1 glass (250ml)</span>
                    </div>
                `;
            }
        });
        
        return scheduleHTML;
    }
});
