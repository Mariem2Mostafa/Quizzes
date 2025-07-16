
        const questions = [
            {
                "question": "What will this code print?<br><code>print(\"Hello\", \"World\")</code>",
                "options": [
                    "A. Hello<br>World",
                    "B. HelloWorld",
                    "C. Hello World",
                    "D. Hello – World"
                ],
                "answer": "C. Hello World",
                "points": 1
            },
            {
                "question": "What will this code print?<br><code>name = \"Ahmed\"<br>print(\"Hello\", name)</code>",
                "options": [
                    "A. Hello name",
                    "B. Hello What is your name?",
                    "C. Hello Ahmed",
                    "D. Gives an error"
                ],
                "answer": "C. Hello Ahmed",
                "points": 1
            },
            {
                "question": "What will this code print?<br><code>for l in range(1, 4):<br>&nbsp;&nbsp;&nbsp;&nbsp;print(\"Hi\")</code>",
                "options": [
                    "A. Hi",
                    "B. Hi Hi",
                    "C. Hi Hi Hi",
                    "D. Error"
                ],
                "answer": "C. Hi Hi Hi",
                "points": 1
            },
            {
                "question": "What will this code print?<br><code>List = [1, \"Apple\", True, [1,2,3,4]]<br>print(\"Orange\" not in List)</code>",
                "options": [
                    "1. True",
                    "2. False",
                    "3. Error",
                    "4. List=[1,\"Apple\",True,[1,2,3,4]]"
                ],
                "answer": "3. Error",
                "points": 1
            },
            {
                "question": "Write a Python program that asks the user to enter their age, then prints a message based on how old they are",
                "type": "checkbox",
                "options": [
                    "1. If the age is under 10 → print: 'You are a child!'",
                    "2. If the age is between 10 and 15 (inclusive) → print: 'You are a teenager!'",
                    "3. If the age is more than 15 → print: 'You are older than 15!'"
                ],
                "optionPoints": [1, 1, 1],
                "points": 3,
                "image": "Output.png"
            },
            {
                "question": "Task: Print the Letters of a Word One by One<br>Ask the user to enter a word, then use a for loop to print each letter on a new line",
                "type": "checkbox",
                "options": [
                    "1. Ask the user to enter a word",
                    "2. Iterate through each character using for loop",
                    "3. Print each character on separate lines"
                ],
                "optionPoints": [1, 1, 1],
                "points": 3,
                "image": "Hello.jpg"
            }
        ];

        // DOM Elements
        const quizForm = document.getElementById('quiz-form');
        const questionsContainer = document.getElementById('questions-container');
        const resultsSection = document.getElementById('results-section');
        const studentInfoEl = document.getElementById('student-info');
        const scoreEl = document.getElementById('score');
        const totalEl = document.getElementById('total');
        const progressBar = document.getElementById('progress-bar');
        const answersFeedback = document.getElementById('answers-feedback');
        const thankYouEl = document.getElementById('thank-you');
        const restartBtn = document.getElementById('restart-btn');
        const thankYouRestartBtn = document.getElementById('thank-you-restart');

        function renderQuestions() {
            let html = '';
            
            questions.forEach((question, index) => {
                html += `<div class="question-card" data-question-id="${index}">`;
                html += `<h5>${index + 1}. ${question.question} <span class="points-badge">${question.points} point${question.points > 1 ? 's' : ''}</span></h5>`;
                
                if (question.image) {
                    html += `<img src="${question.image}" class="question-image" alt="Question illustration">`;
                }
                
                if (question.type === 'checkbox') {
                    question.options.forEach((option, optIndex) => {
                        const pointValue = question.optionPoints ? question.optionPoints[optIndex] : 0;
                        html += `<div class="form-check mb-2">`;
                        html += `<input class="form-check-input" type="checkbox" name="q${index}" id="q${index}_${optIndex}" value="${option}" data-points="${pointValue}">`;
                        html += `<label class="form-check-label" for="q${index}_${optIndex}">`;
                        html += `${option} <span class="option-points">(${pointValue} point)</span>`;
                        html += `</label>`;
                        html += `</div>`;
                    });
                } else {
                    question.options.forEach((option, optIndex) => {
                        html += `<div class="form-check mb-2">`;
                        html += `<input class="form-check-input" type="radio" name="q${index}" id="q${index}_${optIndex}" value="${option}" required>`;
                        html += `<label class="form-check-label" for="q${index}_${optIndex}">${option}</label>`;
                        html += `</div>`;
                    });
                }
                
                html += `</div>`;
            });
            
            questionsContainer.innerHTML = html;
        }

        function calculateScore() {
            const studentName = document.getElementById('student-name').value;
            
            let totalScore = 0;
            const answers = [];
            
            questions.forEach((question, index) => {
                const questionEl = document.querySelector(`.question-card[data-question-id="${index}"]`);
                let selectedOptions = [];
                let questionScore = 0;
                
                if (question.type === 'checkbox') {
                    const checkboxes = questionEl.querySelectorAll(`input[name="q${index}"]:checked`);
                    checkboxes.forEach(checkbox => {
                        selectedOptions.push(checkbox.value);
                        questionScore += parseFloat(checkbox.dataset.points);
                    });
                    
                    // Ensure score doesn't exceed question max points
                    questionScore = Math.min(questionScore, question.points);
                    totalScore += questionScore;
                    
                    answers.push({
                        question: question.question,
                        selected: selectedOptions.join(', '),
                        correct: question.options.join(', '),
                        points: questionScore,
                        maxPoints: question.points,
                        isCorrect: questionScore === question.points
                    });
                } else {
                    const selectedOption = questionEl.querySelector(`input[name="q${index}"]:checked`);
                    const selected = selectedOption ? selectedOption.value : 'No answer selected';
                    
                    // Calculate points for radio questions
                    const points = selected === question.answer ? question.points : 0;
                    totalScore += points;
                    
                    answers.push({
                        question: question.question,
                        selected: selected,
                        correct: question.answer,
                        points: points,
                        maxPoints: question.points,
                        isCorrect: points === question.points
                    });
                }
            });
            
            return {
                studentName,
                totalScore: Math.round(totalScore),
                answers,
                maxScore: questions.reduce((sum, q) => sum + q.points, 0),
                timestamp: new Date().toISOString()
            };
        }

        // Show results
        function showResults(results) {
            // Display student info
            studentInfoEl.innerHTML = `
                <div class="row">
                    <div class="col-md-3"><strong>Name:</strong> ${results.studentName}</div>
                    <div class="col-md-6"><strong>Time:</strong> ${new Date().toLocaleString()}</div>
                </div>
            `;
            
            // Display score
            scoreEl.textContent = results.totalScore;
            totalEl.textContent = results.maxScore;
            
            // Update progress bar
            const percentage = (results.totalScore / results.maxScore) * 100;
            progressBar.style.width = `${percentage}%`;
            progressBar.setAttribute('aria-valuenow', percentage);
            
            // Set progress bar color based on score
            progressBar.classList.remove('bg-success', 'bg-warning', 'bg-danger');
            if (percentage >= 80) {
                progressBar.classList.add('bg-success');
            } else if (percentage >= 50) {
                progressBar.classList.add('bg-warning');
            } else {
                progressBar.classList.add('bg-danger');
            }
            
            // Display answers feedback
            let feedbackHtml = '<h5 class="mb-3">Answer Details:</h5>';
            
            results.answers.forEach((answer, index) => {
                feedbackHtml += `
                    <div class="answer-feedback ${answer.isCorrect ? 'correct' : 'incorrect'}">
                        <h6>${index + 1}. ${answer.question}</h6>
                        <p><strong>Your answer:</strong> ${answer.selected || 'No answer'}</p>
                        <p><strong>Correct answer:</strong> ${answer.correct}</p>
                        <p><strong>Points:</strong> ${answer.points}/${answer.maxPoints}</p>
                    </div>
                `;
            });
            
            answersFeedback.innerHTML = feedbackHtml;
            
            // Show results section
            resultsSection.style.display = 'block';
            quizForm.closest('.quiz-container').style.display = 'none';
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Event Listeners
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const results = calculateScore();
            showResults(results);
        });

        restartBtn.addEventListener('click', function() {
            location.reload();
        });

        thankYouRestartBtn.addEventListener('click', function() {
            location.reload();
        });

        // Initialize the quiz
        document.addEventListener('DOMContentLoaded', function() {
            renderQuestions();
        });
