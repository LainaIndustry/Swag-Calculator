// Exam Calculator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cgpaForm = document.getElementById('cgpaCalculator');
    const subjectsContainer = document.getElementById('subjectsContainer');
    const addSubjectBtn = document.getElementById('addSubject');
    const gradingSystemSelect = document.getElementById('gradingSystem');
    const customScaleContainer = document.getElementById('customScaleContainer');
    const customScaleInput = document.getElementById('customScale');
    const resetCgpaBtn = document.getElementById('resetCgpa');
    const cgpaResults = document.getElementById('cgpaResults');
    const cgpaMetrics = document.getElementById('cgpaMetrics');
    const cgpaValueSpan = document.getElementById('cgpaValue');
    const percentageValueSpan = document.getElementById('percentageValue');
    const overallGradeSpan = document.getElementById('overallGrade');
    const resultTotalCreditsSpan = document.getElementById('resultTotalCredits');
    const resultTotalSubjectsSpan = document.getElementById('resultTotalSubjects');
    const totalGradePointsSpan = document.getElementById('totalGradePoints');
    const subjectsResultsBody = document.getElementById('subjectsResultsBody');
    const bestSubjectSpan = document.getElementById('bestSubject');
    const weakSubjectSpan = document.getElementById('weakSubject');
    const passRateSpan = document.getElementById('passRate');
    const honorsCountSpan = document.getElementById('honorsCount');
    const totalSubjectsSpan = document.getElementById('totalSubjects');
    const totalCreditsSpan = document.getElementById('totalCredits');
    const averageMarksSpan = document.getElementById('averageMarks');
    
    // Percentage Calculator Elements
    const calculatePercentageBtn = document.getElementById('calculatePercentage');
    const obtainedMarksInput = document.getElementById('obtainedMarks');
    const totalMarksInput = document.getElementById('totalMarks');
    const percentageResultDiv = document.getElementById('percentageResult');
    const percentageResultValueSpan = document.getElementById('percentageResultValue');
    const calcObtainedSpan = document.getElementById('calcObtained');
    const calcTotalSpan = document.getElementById('calcTotal');
    const calcResultSpan = document.getElementById('calcResult');
    
    // Conversion Elements
    const convertCgpaBtn = document.getElementById('convertCgpa');
    const cgpaToConvertInput = document.getElementById('cgpaToConvert');
    const conversionScaleSelect = document.getElementById('conversionScale');
    const conversionResultDiv = document.getElementById('conversionResult');
    const convertedPercentageSpan = document.getElementById('convertedPercentage');
    const convertPercentageBtn = document.getElementById('convertPercentage');
    const percentageToConvertInput = document.getElementById('percentageToConvert');
    const percentageConversionResultDiv = document.getElementById('percentageConversionResult');
    const convertedCgpaSpan = document.getElementById('convertedCgpa');
    
    // Chart Variables
    let performanceChart = null;
    let subjectIdCounter = 2; // Starting from 3 since we have 2 default subjects
    
    // Grading Systems
    const gradingSystems = {
        '10': { // 10-point scale (India)
            name: '10-point Scale',
            maxPoints: 10,
            grades: [
                { min: 91, max: 100, grade: 'O', points: 10, description: 'Outstanding' },
                { min: 81, max: 90, grade: 'A+', points: 9, description: 'Excellent' },
                { min: 71, max: 80, grade: 'A', points: 8, description: 'Very Good' },
                { min: 61, max: 70, grade: 'B+', points: 7, description: 'Good' },
                { min: 51, max: 60, grade: 'B', points: 6, description: 'Above Average' },
                { min: 40, max: 50, grade: 'C', points: 5, description: 'Average' },
                { min: 35, max: 39, grade: 'P', points: 4, description: 'Pass' },
                { min: 0, max: 34, grade: 'F', points: 0, description: 'Fail' }
            ]
        },
        '4': { // 4-point scale (USA)
            name: '4-point Scale',
            maxPoints: 4,
            grades: [
                { min: 93, max: 100, grade: 'A', points: 4.0, description: 'Excellent' },
                { min: 90, max: 92, grade: 'A-', points: 3.7, description: 'Excellent' },
                { min: 87, max: 89, grade: 'B+', points: 3.3, description: 'Good' },
                { min: 83, max: 86, grade: 'B', points: 3.0, description: 'Good' },
                { min: 80, max: 82, grade: 'B-', points: 2.7, description: 'Good' },
                { min: 77, max: 79, grade: 'C+', points: 2.3, description: 'Satisfactory' },
                { min: 73, max: 76, grade: 'C', points: 2.0, description: 'Satisfactory' },
                { min: 70, max: 72, grade: 'C-', points: 1.7, description: 'Satisfactory' },
                { min: 67, max: 69, grade: 'D+', points: 1.3, description: 'Passing' },
                { min: 60, max: 66, grade: 'D', points: 1.0, description: 'Passing' },
                { min: 0, max: 59, grade: 'F', points: 0.0, description: 'Fail' }
            ]
        },
        '5': { // 5-point scale
            name: '5-point Scale',
            maxPoints: 5,
            grades: [
                { min: 90, max: 100, grade: 'A', points: 5, description: 'Excellent' },
                { min: 80, max: 89, grade: 'B', points: 4, description: 'Good' },
                { min: 70, max: 79, grade: 'C', points: 3, description: 'Satisfactory' },
                { min: 60, max: 69, grade: 'D', points: 2, description: 'Pass' },
                { min: 50, max: 59, grade: 'E', points: 1, description: 'Marginal' },
                { min: 0, max: 49, grade: 'F', points: 0, description: 'Fail' }
            ]
        },
        '7': { // 7-point scale
            name: '7-point Scale',
            maxPoints: 7,
            grades: [
                { min: 85, max: 100, grade: 'A', points: 7, description: 'Outstanding' },
                { min: 75, max: 84, grade: 'B', points: 6, description: 'Excellent' },
                { min: 65, max: 74, grade: 'C', points: 5, description: 'Good' },
                { min: 55, max: 64, grade: 'D', points: 4, description: 'Satisfactory' },
                { min: 45, max: 54, grade: 'E', points: 3, description: 'Adequate' },
                { min: 35, max: 44, grade: 'F', points: 2, description: 'Marginal' },
                { min: 0, max: 34, grade: 'G', points: 1, description: 'Fail' }
            ]
        }
    };
    
    // Initialize calculator
    initCalculator();
    
    // Initialize Calculator
    function initCalculator() {
        // Set up event listeners
        setupEventListeners();
        
        // Load saved data if exists
        loadSavedData();
        
        // Calculate initial CGPA
        updateSubjectSummary();
        calculateCGPA();
        
        // Initialize default subjects
        updateSubjectGradeDisplay(1);
        updateSubjectGradeDisplay(2);
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // CGPA Form submission
        cgpaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateCGPA();
            saveData();
        });
        
        // Add subject button
        addSubjectBtn.addEventListener('click', addSubject);
        
        // Grading system change
        gradingSystemSelect.addEventListener('change', function() {
            if (this.value === 'custom') {
                customScaleContainer.classList.remove('hidden');
            } else {
                customScaleContainer.classList.add('hidden');
            }
            updateAllSubjectGrades();
            calculateCGPA();
        });
        
        // Custom scale input
        customScaleInput.addEventListener('input', function() {
            updateAllSubjectGrades();
            calculateCGPA();
        });
        
        // Real-time updates on subject input
        subjectsContainer.addEventListener('input', function(e) {
            if (e.target.classList.contains('subject-marks') || 
                e.target.classList.contains('subject-credit')) {
                const subjectId = e.target.closest('.subject-row').getAttribute('data-id');
                updateSubjectGradeDisplay(subjectId);
                updateSubjectSummary();
                calculateCGPA();
            }
        });
        
        // Reset button
        resetCgpaBtn.addEventListener('click', resetCalculator);
        
        // Percentage calculator
        calculatePercentageBtn.addEventListener('click', calculatePercentage);
        
        // Conversion calculators
        convertCgpaBtn.addEventListener('click', convertCgpaToPercentage);
        convertPercentageBtn.addEventListener('click', convertPercentageToCgpa);
        
        // Real-time conversion on input
        cgpaToConvertInput.addEventListener('input', function() {
            if (this.value) {
                convertCgpaToPercentage();
            }
        });
        
        percentageToConvertInput.addEventListener('input', function() {
            if (this.value) {
                convertPercentageToCgpa();
            }
        });
        
        conversionScaleSelect.addEventListener('change', function() {
            if (cgpaToConvertInput.value) {
                convertCgpaToPercentage();
            }
        });
    }
    
    // Add new subject
    function addSubject() {
        subjectIdCounter++;
        const subjectId = subjectIdCounter;
        
        const subjectRow = document.createElement('div');
        subjectRow.className = 'subject-row';
        subjectRow.setAttribute('data-id', subjectId);
        
        subjectRow.innerHTML = `
            <div class="subject-inputs">
                <input type="text" class="subject-name" placeholder="Subject ${subjectId}" required>
                <input type="number" class="subject-marks" placeholder="Marks" min="0" max="100" value="75" required>
                <input type="number" class="subject-credit" placeholder="Credits" min="0.5" max="10" step="0.5" value="3" required>
                <button type="button" class="btn-remove-subject" data-id="${subjectId}">×</button>
            </div>
            <div class="subject-grade-display">
                <span class="grade-label">Grade:</span>
                <span class="grade-value">-</span>
                <span class="points-label">Points:</span>
                <span class="points-value">-</span>
            </div>
        `;
        
        subjectsContainer.appendChild(subjectRow);
        
        // Add remove event listener
        const removeBtn = subjectRow.querySelector('.btn-remove-subject');
        removeBtn.addEventListener('click', function() {
            removeSubject(subjectId);
        });
        
        // Update subject summary
        updateSubjectSummary();
        
        // Update grade display for new subject
        updateSubjectGradeDisplay(subjectId);
        
        // Recalculate CGPA
        calculateCGPA();
    }
    
    // Remove subject
    function removeSubject(subjectId) {
        const subjectRow = document.querySelector(`.subject-row[data-id="${subjectId}"]`);
        if (subjectRow) {
            subjectRow.remove();
            updateSubjectSummary();
            calculateCGPA();
        }
    }
    
    // Update all subject grades
    function updateAllSubjectGrades() {
        document.querySelectorAll('.subject-row').forEach(row => {
            const subjectId = row.getAttribute('data-id');
            updateSubjectGradeDisplay(subjectId);
        });
    }
    
    // Update subject grade display
    function updateSubjectGradeDisplay(subjectId) {
        const subjectRow = document.querySelector(`.subject-row[data-id="${subjectId}"]`);
        if (!subjectRow) return;
        
        const marksInput = subjectRow.querySelector('.subject-marks');
        const marks = parseFloat(marksInput.value) || 0;
        
        const gradeValue = subjectRow.querySelector('.grade-value');
        const pointsValue = subjectRow.querySelector('.points-value');
        
        const gradingSystem = getCurrentGradingSystem();
        const gradeInfo = calculateGrade(marks, gradingSystem);
        
        gradeValue.textContent = gradeInfo.grade;
        pointsValue.textContent = gradeInfo.points.toFixed(1);
        
        // Update color based on grade
        if (gradeInfo.points >= gradingSystem.maxPoints * 0.8) {
            gradeValue.style.color = '#10b981'; // Green for good grades
            pointsValue.style.color = '#10b981';
        } else if (gradeInfo.points >= gradingSystem.maxPoints * 0.6) {
            gradeValue.style.color = '#f59e0b'; // Yellow for average
            pointsValue.style.color = '#f59e0b';
        } else if (gradeInfo.points > 0) {
            gradeValue.style.color = '#ef4444'; // Red for poor
            pointsValue.style.color = '#ef4444';
        } else {
            gradeValue.style.color = '#6b7280'; // Gray for fail
            pointsValue.style.color = '#6b7280';
        }
    }
    
    // Calculate grade for marks
    function calculateGrade(marks, gradingSystem) {
        if (gradingSystem === 'custom') {
            const maxPoints = parseFloat(customScaleInput.value) || 10;
            const points = (marks / 100) * maxPoints;
            const grade = getGradeLetter(points, maxPoints);
            return { grade, points, description: '' };
        }
        
        const system = gradingSystems[gradingSystem];
        if (!system) return { grade: '-', points: 0, description: '' };
        
        for (const gradeInfo of system.grades) {
            if (marks >= gradeInfo.min && marks <= gradeInfo.max) {
                return {
                    grade: gradeInfo.grade,
                    points: gradeInfo.points,
                    description: gradeInfo.description
                };
            }
        }
        
        return { grade: 'F', points: 0, description: 'Fail' };
    }
    
    // Get grade letter for custom scale
    function getGradeLetter(points, maxPoints) {
        const percentage = (points / maxPoints) * 100;
        
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B+';
        if (percentage >= 60) return 'B';
        if (percentage >= 50) return 'C';
        if (percentage >= 40) return 'D';
        if (percentage >= 35) return 'P';
        return 'F';
    }
    
    // Get current grading system
    function getCurrentGradingSystem() {
        return gradingSystemSelect.value;
    }
    
    // Update subject summary
    function updateSubjectSummary() {
        const subjectRows = document.querySelectorAll('.subject-row');
        const totalSubjects = subjectRows.length;
        
        let totalCredits = 0;
        let totalMarks = 0;
        let validSubjects = 0;
        
        subjectRows.forEach(row => {
            const marks = parseFloat(row.querySelector('.subject-marks').value) || 0;
            const credits = parseFloat(row.querySelector('.subject-credit').value) || 0;
            
            if (marks > 0 && credits > 0) {
                totalCredits += credits;
                totalMarks += marks;
                validSubjects++;
            }
        });
        
        const averageMarks = validSubjects > 0 ? (totalMarks / validSubjects) : 0;
        
        totalSubjectsSpan.textContent = totalSubjects;
        totalCreditsSpan.textContent = totalCredits.toFixed(1);
        averageMarksSpan.textContent = averageMarks.toFixed(1) + '%';
    }
    
    // Calculate CGPA
    function calculateCGPA() {
        const subjectRows = document.querySelectorAll('.subject-row');
        if (subjectRows.length === 0) {
            showNoSubjectsError();
            return;
        }
        
        let totalCredits = 0;
        let totalGradePoints = 0;
        let totalSubjects = 0;
        let passedSubjects = 0;
        let honorsSubjects = 0;
        
        const gradingSystem = getCurrentGradingSystem();
        const subjectData = [];
        
        // Calculate for each subject
        subjectRows.forEach(row => {
            const name = row.querySelector('.subject-name').value || `Subject ${row.getAttribute('data-id')}`;
            const marks = parseFloat(row.querySelector('.subject-marks').value) || 0;
            const credits = parseFloat(row.querySelector('.subject-credit').value) || 0;
            
            if (marks > 0 && credits > 0) {
                const gradeInfo = calculateGrade(marks, gradingSystem);
                
                totalCredits += credits;
                totalGradePoints += gradeInfo.points * credits;
                totalSubjects++;
                
                if (gradeInfo.points > 0) {
                    passedSubjects++;
                }
                
                if (gradeInfo.points >= (gradingSystem === 'custom' ? 
                    (parseFloat(customScaleInput.value) || 10) * 0.8 : 
                    gradingSystems[gradingSystem]?.maxPoints * 0.8 || 8)) {
                    honorsSubjects++;
                }
                
                subjectData.push({
                    name,
                    marks,
                    credits,
                    grade: gradeInfo.grade,
                    points: gradeInfo.points,
                    passed: gradeInfo.points > 0,
                    honors: gradeInfo.points >= (gradingSystem === 'custom' ? 
                        (parseFloat(customScaleInput.value) || 10) * 0.8 : 
                        gradingSystems[gradingSystem]?.maxPoints * 0.8 || 8)
                });
            }
        });
        
        if (totalSubjects === 0 || totalCredits === 0) {
            showNoValidSubjectsError();
            return;
        }
        
        // Calculate CGPA
        const cgpa = totalGradePoints / totalCredits;
        const percentage = cgpa * (gradingSystem === 'custom' ? 
            (100 / (parseFloat(customScaleInput.value) || 10)) : 
            (gradingSystem === '10' ? 9.5 : gradingSystem === '4' ? 25 : 20));
        
        // Update UI
        updateResults(cgpa, percentage, totalCredits, totalSubjects, totalGradePoints);
        updateSubjectsTable(subjectData);
        updatePerformanceSummary(subjectData, passedSubjects, honorsSubjects, totalSubjects);
        updateChart(subjectData);
        
        // Show results
        cgpaMetrics.classList.remove('hidden');
    }
    
    // Update results display
    function updateResults(cgpa, percentage, totalCredits, totalSubjects, totalGradePoints) {
        cgpaValueSpan.textContent = cgpa.toFixed(2);
        percentageValueSpan.textContent = percentage.toFixed(2) + '%';
        
        // Determine overall grade
        const gradingSystem = getCurrentGradingSystem();
        const overallGrade = calculateGrade((percentage / (gradingSystem === 'custom' ? 
            (100 / (parseFloat(customScaleInput.value) || 10)) : 
            (gradingSystem === '10' ? 9.5 : gradingSystem === '4' ? 25 : 20))) * 100, gradingSystem);
        overallGradeSpan.textContent = overallGrade.grade;
        
        resultTotalCreditsSpan.textContent = totalCredits.toFixed(1);
        resultTotalSubjectsSpan.textContent = totalSubjects;
        totalGradePointsSpan.textContent = totalGradePoints.toFixed(1);
        
        // Update CGPA color based on performance
        if (cgpa >= (gradingSystem === 'custom' ? 
            (parseFloat(customScaleInput.value) || 10) * 0.8 : 
            gradingSystems[gradingSystem]?.maxPoints * 0.8 || 8)) {
            cgpaValueSpan.style.color = '#10b981'; // Green for excellent
        } else if (cgpa >= (gradingSystem === 'custom' ? 
            (parseFloat(customScaleInput.value) || 10) * 0.6 : 
            gradingSystems[gradingSystem]?.maxPoints * 0.6 || 6)) {
            cgpaValueSpan.style.color = '#f59e0b'; // Yellow for good
        } else if (cgpa > 0) {
            cgpaValueSpan.style.color = '#ef4444'; // Red for poor
        } else {
            cgpaValueSpan.style.color = '#6b7280'; // Gray for fail
        }
    }
    
    // Update subjects table
    function updateSubjectsTable(subjectData) {
        let tableHTML = '';
        
        subjectData.forEach(subject => {
            const statusClass = subject.passed ? 
                (subject.honors ? 'status-honors' : 'status-pass') : 
                'status-fail';
            const statusText = subject.passed ? 
                (subject.honors ? 'Honors' : 'Pass') : 
                'Fail';
            
            tableHTML += `
                <tr>
                    <td>${subject.name}</td>
                    <td>${subject.marks}%</td>
                    <td>${subject.credits}</td>
                    <td><strong>${subject.grade}</strong></td>
                    <td>${subject.points.toFixed(1)}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                </tr>
            `;
        });
        
        subjectsResultsBody.innerHTML = tableHTML;
        
        // Add CSS for status badges
        const style = document.createElement('style');
        style.textContent = `
            .status-badge {
                padding: 0.25rem 0.5rem;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .status-honors {
                background: #d1fae5;
                color: #065f46;
            }
            .status-pass {
                background: #dbeafe;
                color: #1e40af;
            }
            .status-fail {
                background: #fee2e2;
                color: #991b1b;
            }
        `;
        if (!document.querySelector('#status-badges-style')) {
            style.id = 'status-badges-style';
            document.head.appendChild(style);
        }
    }
    
    // Update performance summary
    function updatePerformanceSummary(subjectData, passedSubjects, honorsSubjects, totalSubjects) {
        if (subjectData.length === 0) {
            bestSubjectSpan.textContent = '-';
            weakSubjectSpan.textContent = '-';
            passRateSpan.textContent = '-';
            honorsCountSpan.textContent = '-';
            return;
        }
        
        // Find best and weak subjects
        const bestSubject = subjectData.reduce((best, current) => 
            current.points > best.points ? current : best
        );
        const weakSubject = subjectData.filter(s => s.passed).reduce((weakest, current) => 
            current.points < weakest.points ? current : weakest, 
            { points: Infinity, name: '-' }
        );
        
        bestSubjectSpan.textContent = bestSubject.name;
        weakSubjectSpan.textContent = weakSubject.points !== Infinity ? weakSubject.name : '-';
        passRateSpan.textContent = `${((passedSubjects / totalSubjects) * 100).toFixed(0)}%`;
        honorsCountSpan.textContent = `${honorsSubjects} subject${honorsSubjects !== 1 ? 's' : ''}`;
    }
    
    // Update performance chart
    function updateChart(subjectData) {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        // Destroy existing chart
        if (performanceChart) {
            performanceChart.destroy();
        }
        
        // Prepare data
        const labels = subjectData.map(s => s.name);
        const marks = subjectData.map(s => s.marks);
        const points = subjectData.map(s => s.points * 10); // Scale for visibility
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0.3)');
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0.1)');
        
        // Create new chart
        performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Marks (%)',
                        data: marks,
                        backgroundColor: gradient,
                        borderColor: '#4f46e5',
                        borderWidth: 2,
                        borderRadius: 6,
                        order: 2
                    },
                    {
                        label: 'Grade Points',
                        data: points,
                        type: 'line',
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0.3,
                        fill: true,
                        order: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.datasetIndex === 0) {
                                    label += context.parsed.y + '%';
                                } else {
                                    label += (context.parsed.y / 10).toFixed(1) + ' points';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Calculate percentage
    function calculatePercentage() {
        const obtained = parseFloat(obtainedMarksInput.value);
        const total = parseFloat(totalMarksInput.value);
        
        if (isNaN(obtained) || isNaN(total) || total <= 0) {
            showPercentageError('Please enter valid numbers for both fields');
            return;
        }
        
        if (obtained > total) {
            showPercentageError('Obtained marks cannot be greater than total marks');
            return;
        }
        
        const percentage = (obtained / total) * 100;
        
        // Update UI
        percentageResultValueSpan.textContent = percentage.toFixed(2) + '%';
        calcObtainedSpan.textContent = obtained;
        calcTotalSpan.textContent = total;
        calcResultSpan.textContent = percentage.toFixed(2);
        
        // Show result
        percentageResultDiv.classList.remove('hidden');
        
        // Update color based on percentage
        if (percentage >= 80) {
            percentageResultValueSpan.style.color = '#10b981';
        } else if (percentage >= 60) {
            percentageResultValueSpan.style.color = '#f59e0b';
        } else if (percentage >= 40) {
            percentageResultValueSpan.style.color = '#ef4444';
        } else {
            percentageResultValueSpan.style.color = '#991b1b';
        }
    }
    
    // Convert CGPA to percentage
    function convertCgpaToPercentage() {
        const cgpa = parseFloat(cgpaToConvertInput.value);
        const scale = parseFloat(conversionScaleSelect.value);
        
        if (isNaN(cgpa) || cgpa < 0) {
            showConversionError('Please enter a valid CGPA');
            return;
        }
        
        const percentage = cgpa * scale;
        
        // Update UI
        convertedPercentageSpan.textContent = percentage.toFixed(2);
        conversionResultDiv.classList.remove('hidden');
    }
    
    // Convert percentage to CGPA
    function convertPercentageToCgpa() {
        const percentage = parseFloat(percentageToConvertInput.value);
        
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
            showConversionError('Please enter a valid percentage (0-100)');
            return;
        }
        
        const cgpa = percentage / 9.5; // Using standard conversion
        
        // Update UI
        convertedCgpaSpan.textContent = cgpa.toFixed(2);
        percentageConversionResultDiv.classList.remove('hidden');
    }
    
    // Reset calculator
    function resetCalculator() {
        // Clear all subjects except first two
        const subjectRows = document.querySelectorAll('.subject-row');
        subjectRows.forEach((row, index) => {
            if (index >= 2) {
                row.remove();
            }
        });
        
        // Reset first two subjects
        const subject1 = document.querySelector('.subject-row[data-id="1"]');
        if (subject1) {
            subject1.querySelector('.subject-name').value = 'Mathematics';
            subject1.querySelector('.subject-marks').value = '85';
            subject1.querySelector('.subject-credit').value = '4';
        }
        
        const subject2 = document.querySelector('.subject-row[data-id="2"]');
        if (subject2) {
            subject2.querySelector('.subject-name').value = 'Physics';
            subject2.querySelector('.subject-marks').value = '78';
            subject2.querySelector('.subject-credit').value = '3';
        }
        
        // Reset grading system
        gradingSystemSelect.value = '10';
        customScaleContainer.classList.add('hidden');
        customScaleInput.value = '10';
        
        // Reset subject counter
        subjectIdCounter = 2;
        
        // Clear results
        cgpaResults.innerHTML = `
            <div class="result-placeholder">
                <div class="placeholder-icon">🎓</div>
                <p>Add subjects and click "Calculate CGPA" to see results</p>
            </div>
        `;
        
        cgpaMetrics.classList.add('hidden');
        subjectsResultsBody.innerHTML = `
            <tr class="placeholder-row">
                <td colspan="6">Add subjects to see detailed analysis</td>
            </tr>
        `;
        
        // Reset summary
        updateSubjectSummary();
        
        // Update grade displays
        updateSubjectGradeDisplay(1);
        updateSubjectGradeDisplay(2);
        
        // Destroy chart
        if (performanceChart) {
            performanceChart.destroy();
            performanceChart = null;
        }
        
        // Clear saved data
        localStorage.removeItem('examCalculatorData');
    }
    
    // Save data to localStorage
    function saveData() {
        const subjects = [];
        document.querySelectorAll('.subject-row').forEach(row => {
            subjects.push({
                name: row.querySelector('.subject-name').value,
                marks: row.querySelector('.subject-marks').value,
                credit: row.querySelector('.subject-credit').value
            });
        });
        
        const data = {
            subjects,
            gradingSystem: gradingSystemSelect.value,
            customScale: customScaleInput.value
        };
        
        localStorage.setItem('examCalculatorData', JSON.stringify(data));
    }
    
    // Load saved data from localStorage
    function loadSavedData() {
        const savedData = localStorage.getItem('examCalculatorData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                // Clear existing subjects except first two
                const existingSubjects = document.querySelectorAll('.subject-row');
                existingSubjects.forEach((row, index) => {
                    if (index >= 2) {
                        row.remove();
                    }
                });
                
                // Load subjects
                if (data.subjects && data.subjects.length > 0) {
                    // Update first two subjects
                    if (data.subjects[0]) {
                        const subject1 = document.querySelector('.subject-row[data-id="1"]');
                        if (subject1) {
                            subject1.querySelector('.subject-name').value = data.subjects[0].name || 'Mathematics';
                            subject1.querySelector('.subject-marks').value = data.subjects[0].marks || '85';
                            subject1.querySelector('.subject-credit').value = data.subjects[0].credit || '4';
                        }
                    }
                    
                    if (data.subjects[1]) {
                        const subject2 = document.querySelector('.subject-row[data-id="2"]');
                        if (subject2) {
                            subject2.querySelector('.subject-name').value = data.subjects[1].name || 'Physics';
                            subject2.querySelector('.subject-marks').value = data.subjects[1].marks || '78';
                            subject2.querySelector('.subject-credit').value = data.subjects[1].credit || '3';
                        }
                    }
                    
                    // Add additional subjects
                    for (let i = 2; i < data.subjects.length; i++) {
                        subjectIdCounter++;
                        const subjectRow = createSubjectRow(subjectIdCounter, data.subjects[i]);
                        subjectsContainer.appendChild(subjectRow);
                    }
                }
                
                // Load grading system
                if (data.gradingSystem) {
                    gradingSystemSelect.value = data.gradingSystem;
                    if (data.gradingSystem === 'custom') {
                        customScaleContainer.classList.remove('hidden');
                        if (data.customScale) {
                            customScaleInput.value = data.customScale;
                        }
                    }
                }
                
                // Update everything
                updateAllSubjectGrades();
                updateSubjectSummary();
                setTimeout(() => calculateCGPA(), 100);
                
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }
    
    // Create subject row HTML
    function createSubjectRow(id, data) {
        const row = document.createElement('div');
        row.className = 'subject-row';
        row.setAttribute('data-id', id);
        
        row.innerHTML = `
            <div class="subject-inputs">
                <input type="text" class="subject-name" placeholder="Subject ${id}" value="${data.name || ''}" required>
                <input type="number" class="subject-marks" placeholder="Marks" min="0" max="100" value="${data.marks || '75'}" required>
                <input type="number" class="subject-credit" placeholder="Credits" min="0.5" max="10" step="0.5" value="${data.credit || '3'}" required>
                <button type="button" class="btn-remove-subject" data-id="${id}">×</button>
            </div>
            <div class="subject-grade-display">
                <span class="grade-label">Grade:</span>
                <span class="grade-value">-</span>
                <span class="points-label">Points:</span>
                <span class="points-value">-</span>
            </div>
        `;
        
        // Add remove event listener
        row.querySelector('.btn-remove-subject').addEventListener('click', function() {
            removeSubject(id);
        });
        
        return row;
    }
    
    // Error handling functions
    function showNoSubjectsError() {
        cgpaResults.innerHTML = `
            <div class="error-message">
                <div class="error-icon">📚</div>
                <h3>No Subjects Added</h3>
                <p>Please add at least one subject with valid marks and credits.</p>
                <button id="addFirstSubject" class="btn-primary">Add Subject</button>
            </div>
        `;
        
        document.getElementById('addFirstSubject')?.addEventListener('click', addSubject);
        
        cgpaMetrics.classList.add('hidden');
    }
    
    function showNoValidSubjectsError() {
        cgpaResults.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <h3>Invalid Data</h3>
                <p>Please enter valid marks (0-100) and credits (greater than 0) for all subjects.</p>
            </div>
        `;
        
        cgpaMetrics.classList.add('hidden');
    }
    
    function showPercentageError(message) {
        percentageResultDiv.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <p>${message}</p>
            </div>
        `;
        percentageResultDiv.classList.remove('hidden');
        
        setTimeout(() => {
            percentageResultDiv.classList.add('hidden');
        }, 3000);
    }
    
    function showConversionError(message) {
        alert(message);
    }
});
