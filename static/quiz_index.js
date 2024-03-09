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
const recordclub=(club)=>{
    if (club !== null) {
        // Make an AJAX request to the Django view
        fetch('/api/record_club/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({
                'club': club,  // Adjust as needed
               
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
}
// Function to record the selected option and send it to the backend
const recordSelectedOption = (currentQuestionIndex, option) => {
    console.log(currentQuestionIndex);
    const selectedOption = option.text;
    if(option.club!==null){
        recordclub(option.club)
    }
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
            { text: "Red", nextQuestion: 2 , club:null},
            { text: "Blue", nextQuestion: 3 ,club:null},
            { text: "Green", nextQuestion: 4 ,club:null},
            { text: "Yellow", nextQuestion: 5 ,club:null},
        ], questionId: 1},
        { question: "Which animal do you like the most?", options: [
            { text: "Dog", nextQuestion: null, club: "astro" },
            { text: "Cat", nextQuestion: null, club:"anc" },
            { text: "Elephant", nextQuestion: null, club: "rsc" },
            { text: "Dolphin", nextQuestion: null , club:"arsc"},
        ], questionId: 2},
        { question: "What's your preferred mode of transportation?", options: [
            { text: "Car", nextQuestion: null, club:"debsoc" },
            { text: "Bicycle", nextQuestion: null , club:"boatclub"},
            { text: "Motorcycle", nextQuestion: null , club:"badminton"},
            { text: "Walking", nextQuestion: null, club:"cofsug" },
        ], questionId: 3},
        { question: "Which cuisine do you enjoy the most?", options: [
            { text: "Italian", nextQuestion: null, club:"sds" },
            { text: "Chinese", nextQuestion: null , club:"csi"},
            { text: "Mexican", nextQuestion: null , club:"ascii"},
            { text: "Indian", nextQuestion: null , club:"octane"},
        ], questionId: 4},
        { question: "What's your favorite sport?", options: [
            { text: "Football", nextQuestion: null , club:"nemesis"},
            { text: "Basketball", nextQuestion: null , club:"veloci"},
            { text: "Tennis", nextQuestion: null , club:"csat"},
            { text: "Cricket", nextQuestion: null , club:"csac"},
        ], questionId: 5},
    ],
];

const displayNextQuestion = (nextQuestionIndex) => {
    // if(demoQuestions[club]!== null){
    //     recordclub(demoQuestions.club);
    // }
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
