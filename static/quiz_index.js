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
const addQuizQuestion = (question, options) => {
    const quizContainer = document.getElementById('quiz-container');

    // Clear the contents of the quiz container
    quizContainer.innerHTML = '';

    const questionElement = document.createElement('div');
    questionElement.textContent = question;
    quizContainer.appendChild(questionElement);

    // Add options as buttons
    options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.textContent = option;
        optionButton.addEventListener('click', () => handleOptionClick(index));
        quizContainer.appendChild(optionButton);
    });
};

// Handle the option click (e.g., record the answer, move to the next question)
const handleOptionClick = (optionIndex) => {
    // Handle the selected option (e.g., record the answer to a data structure)

    // For now, let's just display a log message
    console.log(`Selected option: ${optionIndex}`);

    // Display the next question or submit button
    displayNextQuestion();
};

// Example: Add demo quiz questions every 10 seconds
const questionDisplayTime = 5000; // Time each question is displayed in milliseconds
let setNumber = 0;
let questionNumber = 0;

// Example: Add demo quiz questions every 10 seconds


// ... (previous code)

const demoQuestions = [
    [
        {
            question: "Tell us what's on your mind, which clubs you are interested in joining?",
            options: ["Option A", "Option B", "Option C", "Option D"],
        },
        {
            question: "Tell us what's on your mind, which clubs you are not interested in joining?",
            options: ["Option A", "Option B", "Option C", "Option D"],
        },
    ],
    // Add more sets of questions and options as needed
];

const displayNextQuestion = () => {
    if (setNumber < demoQuestions.length) {
        const currentSet = demoQuestions[setNumber];
        if (questionNumber < currentSet.length) {
            const currentQuestion = currentSet[questionNumber];
            addQuizQuestion(`Question ${setNumber + 1}.${questionNumber + 1}: ${currentQuestion.question}`, currentQuestion.options);
            questionNumber++;
        } else {
            // Increment the set number and reset question number for the next set
            setNumber++;
            questionNumber = 0;
            displayNextQuestion();
        }
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
    // Handle the submission logic (e.g., process user responses)
    console.log('Quiz submitted!');
};

// Initial delay before starting the question cycle
setTimeout(displayNextQuestion, questionDisplayTime);

// Start the animation loop
animate();
