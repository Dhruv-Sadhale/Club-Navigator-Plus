// Set up Three.js scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background').appendChild(renderer.domElement);

// Create a simple animated background (e.g., rotating cube)
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

// Animation loop
const animate = () => {
    requestAnimationFrame(animate);

    // Rotate the cube for the background animation
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
};

// Function to add quiz questions to the container
const addQuizQuestion = (question, options, question_id) => {
    const quizContainer = document.getElementById('quiz-container');

    // Clear the contents of the quiz container
    quizContainer.innerHTML = '';

    const questionElement = document.createElement('div');
    questionElement.textContent = question;
    quizContainer.appendChild(questionElement);

    // Add options as buttons
    options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.textContent = option.text;
        optionButton.addEventListener('click', () => handleOptionClick(option.nextQuestion, question_id, option));
        quizContainer.appendChild(optionButton);
    });
};

// Function to record the selected option and send it to the backend
const recordSelectedOption = (currentQuestionIndex, option) => {
    console.log(currentQuestionIndex);
    const selectedOption = option.text;

    if (selectedOption !== null) {
        // Make an AJAX request to the Django view
        fetch('/api/record_response/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({
                'question_number': currentQuestionIndex,  // Adjust as needed
                'selected_option': selectedOption,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Selected option recorded successfully.');
            } else {
                console.error('Failed to record selected option:', data.message);
            }
        })
        .catch(error => {
            console.error('Error recording selected option:', error);
        });
    }
};


// Handle the option click (e.g., record the answer, move to the next question)
const handleOptionClick = (nextQuestionIndex, currentQuestionIndex, option) => {
    // Record the selected option
    recordSelectedOption(currentQuestionIndex, option);

    // Display the next question or submit button
    displayNextQuestion(nextQuestionIndex);
};



// Example: Add demo quiz questions every 10 seconds
const questionDisplayTime = 2000; // Time each question is displayed in milliseconds
let setNumber = 0;
let questionNumber = 0;

const demoQuestions = [
    [
        { question: "What's your favorite color?", options: [
            { text: "Red", nextQuestion: 2 },
            { text: "Blue", nextQuestion: 3 },
            { text: "Green", nextQuestion: 4 },
            { text: "Yellow", nextQuestion: 5 },
        ], questionId: 1},
        { question: "Which animal do you like the most?", options: [
            { text: "Dog", nextQuestion: null },
            { text: "Cat", nextQuestion: null },
            { text: "Elephant", nextQuestion: null },
            { text: "Dolphin", nextQuestion: null },
        ], questionId: 2},
        { question: "What's your preferred mode of transportation?", options: [
            { text: "Car", nextQuestion: null },
            { text: "Bicycle", nextQuestion: null },
            { text: "Motorcycle", nextQuestion: null },
            { text: "Walking", nextQuestion: null },
        ], questionId: 3},
        { question: "Which cuisine do you enjoy the most?", options: [
            { text: "Italian", nextQuestion: null },
            { text: "Chinese", nextQuestion: null },
            { text: "Mexican", nextQuestion: null },
            { text: "Indian", nextQuestion: null },
        ], questionId: 4},
        { question: "What's your favorite sport?", options: [
            { text: "Football", nextQuestion: null },
            { text: "Basketball", nextQuestion: null },
            { text: "Tennis", nextQuestion: null },
            { text: "Cricket", nextQuestion: null },
        ], questionId: 5},
    ],
];

const displayNextQuestion = (nextQuestionIndex) => {
    if (nextQuestionIndex !== null) {
        // Display the next question
        const currentSet = demoQuestions[setNumber];
        const currentQuestion = currentSet[nextQuestionIndex - 1];
        addQuizQuestion(`Question ${setNumber + 1}.${nextQuestionIndex}: ${currentQuestion.question}`, currentQuestion.options, currentQuestion.questionId);    
    } else {
        // Display the submit button after all sets are completed
        addSubmitButton();
    }
};

const addSubmitButton = () => {
    const quizContainer = document.getElementById('quiz-container');

    // Clear the contents of the quiz container
    quizContainer.innerHTML = '';

    // Add a submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.addEventListener('click', () => handleSubmission());
    quizContainer.appendChild(submitButton);
};

const handleSubmission = () => {
    window.location.href = '/dashboard/';
};


const getCSRFToken = () => {
    const csrfCookie = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('csrftoken='));

    return csrfCookie ? csrfCookie.split('=')[1] : null;
};

// Initial delay before starting the question cycle
setTimeout(() => displayNextQuestion(1), questionDisplayTime);

// Start the animation loop
animate();
