document.addEventListener('DOMContentLoaded', function() {
    const cgpaForm = document.getElementById('cgpaCalculator');
    const resultDiv = document.getElementById('cgpaResult');
    
    // Add subject dynamically
    let subjectCount = 1;
    
    document.getElementById('addSubject').addEventListener('click', function() {
        subjectCount++;
        const subjectsContainer = document.getElementById('subjectsContainer');
        
        const subjectDiv = document.createElement('div');
        subjectDiv.className = 'subject-row';
        subjectDiv.innerHTML = `
            <div class="subject-inputs">
                <input type="text" placeholder="Subject ${subjectCount}" class="subject-name" required>
                <input type="number" min="0" max="100" placeholder="Marks" class="subject-marks" required>
                <input type="number" min="1" max="10" placeholder="Credit" class="subject-credit" required>
                <button type="button" class="remove-subject">×</button>
            </div>
        `;
        
        subjectsContainer.appendChild(subjectDiv);
        
        // Add remove functionality
        subjectDiv.querySelector('.remove-subject').addEventListener('click', function() {
            if (subjectCount > 1) {
                subjectDiv.remove();
                subjectCount--;
            }
        });
    });
    
    cgpaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const subjectRows = document.querySelectorAll('.subject-row');
        let totalCredits = 0;
        let totalGradePoints = 0;
        let allMarks = [];
        
        for (let row of subjectRows) {
            const marks = parseFloat(row.querySelector('.subject-marks').value);
            const credits = parseFloat(row.querySelector('.subject-credit').value);
            const gradePoint = calculateGradePoint(marks);
            
            totalCredits += credits;
            totalGradePoints += gradePoint * credits;
            allMarks.push(marks);
        }
        
        if (totalCredits === 0) {
            resultDiv.innerHTML = '<p class="error">Please add at least one subject</p>';
            return;
        }
        
        const cgpa = totalGradePoints / totalCredits;
        const percentage = cgpaToPercentage(cgpa);
        const totalMarks = allMarks.reduce((a, b) => a + b, 0);
        const average = totalMarks / allMarks.length;
        
        // Determine grade
        let grade = '';
        if (cgpa >= 9) grade = 'A+ (Excellent)';
        else if (cgpa >= 8) grade = 'A (Very Good)';
        else if (cgpa >= 7) grade = 'B+ (Good)';
        else if (cgpa >= 6) grade = 'B (Average)';
        else if (cgpa >= 5) grade = 'C (Below Average)';
        else grade = 'F (Fail)';
        
        resultDiv.innerHTML = `
            <div class="result-value">${cgpa.toFixed(2)}</div>
            <p><strong>CGPA Score</strong></p>
            <div class="result-breakdown">
                <p>• Equivalent Percentage: ${percentage.toFixed(2)}%</p>
                <p>• Grade: ${grade}</p>
                <p>• Total Credits: ${totalCredits}</p>
                <p>• Average Marks: ${average.toFixed(2)}%</p>
                <p>• Total Subjects: ${allMarks.length}</p>
            </div>
            <h4>Subject-wise Analysis:</h4>
            <table>
                <tr><th>Subject</th><th>Marks</th><th>Grade</th><th>Points</th></tr>
                ${Array.from(subjectRows).map((row, i) => {
                    const name = row.querySelector('.subject-name').value || `Subject ${i+1}`;
                    const marks = parseFloat(row.querySelector('.subject-marks').value);
                    const grade = getGradeFromMarks(marks);
                    const points = calculateGradePoint(marks);
                    return `<tr>
                        <td>${name}</td>
                        <td>${marks}%</td>
                        <td>${grade}</td>
                        <td>${points}</td>
                    </tr>`;
                }).join('')}
            </table>
        `;
    });
    
    function calculateGradePoint(marks) {
        if (marks >= 90) return 10;
        if (marks >= 80) return 9;
        if (marks >= 70) return 8;
        if (marks >= 60) return 7;
        if (marks >= 50) return 6;
        if (marks >= 40) return 5;
        if (marks >= 33) return 4;
        return 0;
    }
    
    function getGradeFromMarks(marks) {
        if (marks >= 90) return 'A+';
        if (marks >= 80) return 'A';
        if (marks >= 70) return 'B+';
        if (marks >= 60) return 'B';
        if (marks >= 50) return 'C';
        if (marks >= 40) return 'D';
        if (marks >= 33) return 'E';
        return 'F';
    }
    
    function cgpaToPercentage(cgpa) {
        // Using common conversion formula
        return (cgpa * 9.5);
    }
});
