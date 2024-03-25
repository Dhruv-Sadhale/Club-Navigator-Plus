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
        { question: "Which option best suits your inclinations ?", options: [
            { text: "A platform to develop and use technical skills,Co-Curricular activities for an engineer.", nextQuestion: 2, club:null },
            { text: "To let my creative intrests flourish .Be a part of extra-curricular activities which have an inclinations towards arts and finer skills", nextQuestion: 3,club: null },
            { text: "I have a incliation towards sports.I actively train or would like to train for a sport and showcase physical prowess", nextQuestion: 4 ,club :null },
            { text: "Ideas of Social-Welfare , History and Philanthrophy", nextQuestion: 5,club :null },
        ], questionId: 1},
        { question: "What domain out of the options givenbest suits your intrests?", options: [
            { text: "Innovation and consulting", nextQuestion: 6 ,club :null},
            { text: "Web/Software Development and Competitive Coding", nextQuestion: 12 ,club :null},
            { text: "Building Real life systems withapplications in aviation , robotics and astronomy ", nextQuestion: 8,club :null },
            { text: "Desiging and Implementing various sub-systems in theautomobile domain", nextQuestion: 9,club :null },
        ], questionId: 2},
        { question: "What quality sets would best describe you?", options: [
            { text: "Good Speaking Skills General Knowledge and Confidence", nextQuestion: null ,club :"Debate and Quiz Club"},
            { text: "B. Creative outlook towards arts craft and desgin.", nextQuestion: null,club :"AnC" },
            { text: "C. Acting and Speaking with an inclination towards performing arts/Production", nextQuestion: null,club :"Cultural/Junoon/Drama and Film" },
            { text: "D. Prowess in Musical Instruments and Singing ", nextQuestion: null,club :"Cultural/SpicMacay" },
            { text: "E. Writing skills and the ability to express", nextQuestion: null ,club :"Abhiyanta/Abhijaat newsletter"},
        ], questionId: 3},
        { question: "Would you like to be a part of boat club or would you be intrested in other sports under gymkhana", options: [
            { text: "Boat Club Activities", nextQuestion: 10 , club :null  },
            { text: "Gymkhana Sports", nextQuestion: 11, club :null },

        ], questionId: 4},

        { question: "What domain intrests you the most?", options: [
            { text: "Women's Welfare", nextQuestion: null, club :"Aarya Raas/Society for Women Engineers" },
            { text: "Student bodies aimed at student welfare", nextQuestion: null, club :"Student Welfare Forum/Student Welfare Association" },
            { text: "History and Culture", nextQuestion: null, club :"History Club" },
            { text: "Social Welfare", nextQuestion: null, club :"Spandan" },
            { text: "Incliation towards civil services", nextQuestion: null, club :"CSAC" },
        ], questionId: 5},
        { question: "What would best describe your intrests?", options: [
            { text: "Consulting in Industry domain", nextQuestion: null, club :"The Consulting Club" },
            { text: "Innovation and Enerpreneurship", nextQuestion: null, club :"i2i/BHAU's E-Cell" },
        ], questionId: 6},
        { question: "What domain intrests you the most?", options: [
            { text: "Women's Welfare", nextQuestion: null, club :"Aarya Raas/Society for Women Engineers" },
            { text: "Student bodies aimed at student welfare", nextQuestion: null, club :"Student Welfare Forum/Student Welfare Association" },
            { text: "History and Culture", nextQuestion: null, club :"History Club" },
            { text: "Social Welfare", nextQuestion: null, club :"Spandan" },
            { text: "Incliation towards civil services", nextQuestion: null, club :"CSAC" },
        ], questionId: 7},
        { question: "What domain intrests you the most?", options: [
            { text: "Technical as well as non-technical aspects of astronomy", nextQuestion: null, club :"Astronomy Club" },
            { text: "Working towards development and testing of satellites", nextQuestion: null, club :"CSAT" },
            { text: "Robotics and Automation", nextQuestion: null, club :"RSC/ARSC" },

        ], questionId: 8},
        { question: "What domain intrests you the most?", options: [
            { text: "Technical as well as non-technical aspects of astronomy", nextQuestion: null, club :"Astronomy Club" },
            { text: "Working towards development and testing of satellites", nextQuestion: null, club :"CSAT" },
            { text: "Robotics and Automation", nextQuestion: null, club :"RSC/ARSC" },

        ], questionId: 9},
        { question: "Select a Boat Club Activity", options: [
            { text: "Punt Formation", nextQuestion: null, club :"Punt Formation" },
            { text: "TeleMatches", nextQuestion: null, club :"TeleMatches" },
            { text: "Kayak Ballet", nextQuestion: null, club :"Kayak Ballet" },
            { text: "Shell Games", nextQuestion: null, club :"Shell Games" },

        ], questionId: 10},
        { question: "Select a Gymkhana Sport Activity", options: [
            { text: "Football", nextQuestion: null, club :"Football" },
            { text: "Cricket", nextQuestion: null, club :"Cricket" },
            { text: "Hockey", nextQuestion: null, club :"Hockey" },

        ], questionId: 11},
        { question: "What side of the Software world would you like to explore", options: [
            { text: "Free and Open source software", nextQuestion: null, club :"COFSUG" },
            { text: "Software Development", nextQuestion: null, club :"SDS" },
            { text: "A.I. and Data Science", nextQuestion: null, club :"AI-DS Club" },
            { text: "Competitive coding and community networking along with organising events and seminars", nextQuestion: null, club :"CSI/ASCII" },


        ], questionId: 12},
    
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
    
}

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