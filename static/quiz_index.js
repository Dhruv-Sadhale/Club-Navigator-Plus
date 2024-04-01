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

const questionDisplayTime = 2000; // Time each question is displayed in milliseconds
let setNumber = 0;
let questionNumber = 0;
let temp=[];
let count=0;
let parent=[0,0];
let parentfornow=[0,0];

// Function to add quiz questions to the container
const addQuizQuestion = (question, options, question_id) => {
    const quizContainer = document.getElementById('quiz-container');
    
    // Clear the contents of the quiz container
    quizContainer.innerHTML = '';

    const questionElement = document.createElement('div');
    questionElement.textContent = question;
    quizContainer.appendChild(questionElement);
    //console.log("question is:")
    //console.log(question);
    //console.log("in addquizquestion  options:"+options);
    // Add options as buttons
    options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.textContent = option.text;
        //console.log("OPTION:"+option.text)
        optionButton.addEventListener('click', () =>{
        
         //console.log("next question id: "+option.nextQuestion+" current question id: "+ question_id)
         console.log("in addquizquestion  options:"+option+" "+option.club)
         handleOptionClick(option.nextQuestion, question_id, option)});
        quizContainer.appendChild(optionButton);
    });
};


const recordclub=(club)=>{
    console.log("in record club"+club)
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
   // console.log(currentQuestionIndex);
    const selectedOption = option.text;
    console.log("in recordselectedoption:"+option.club)
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
    console.log("in handle option clik:"+option.club)
   recordSelectedOption(currentQuestionIndex, option);

    // Display the next question or submit button
    displayNextQuestion(nextQuestionIndex);
};



// Example: Add demo quiz questions every 10 seconds

const demoQuestions = [
    [
        { question: "Which option best suits your inclinations ?", options: [
            ()=>{
                //console.log("hello2");
                if(parent[0]==0 && parent[1]==0 || (parent[0]!=2)){
                   // console.log(parent[0]+"is here");
                   if(parent[0]!=0) parent[0]=0;
            return {no:1,text: "A platform to develop and use technical skills,Co-Curricular activities for an engineer.", nextQuestion: 2, club:null }}},
            ()=>{
                if(parent[0]==0 && parent[1]==0|| (parent[0]!=3)){
                    if(parent[0]!=0) parent[0]=0;
            return{  no:2,text: "To let my creative intrests flourish .Be a part of extra-curricular activities which have an inclinations towards arts and finer skills", nextQuestion: 3,club: null }}},
            ()=>{
                if(parent[0]==0 && parent[1]==0|| (parent[0]!=4)){
                    if(parent[0]!=0) parent[0]=0;
            return { no:3,text: "I have a incliation towards sports.I actively train or would like to train for a sport and showcase physical prowess", nextQuestion: 4 ,club :null}} },
            ()=>{
                if(parent[0]==0 && parent[1]==0|| (parent[0]!=5)){
                    if(parent[0]!=0) parent[0]=0;
            return{ no:4,text: "Ideas of Social-Welfare , History and Philanthrophy", nextQuestion: 5,club :null }}},
        ], questionId: 1},
        { question: "What domain out of the options givenbest suits your intrests?", options: [
            
            ()=>{
                if(parent[0]==0 && parent[1]==0|| (parent[0]==2 && parent[1]!=1)){
             return {no:1, text: "Innovation and consulting", nextQuestion: 6 ,club :null}
                }},
                ()=>{
                    if(parent[0]==0 && parent[1]==0||  (parent[0]==2 && parent[1]!=2)){
                 return { no:2,text: "Web/Software Development and Competitive Coding", nextQuestion: 11 ,club :null}}},
                 ()=>{
                    if(parent[0]==0 && parent[1]==0||  (parent[0]==2 && parent[1]!=3)){
                 return { no:3,text: "Building Real life systems withapplications in aviation , robotics and astronomy ", nextQuestion: 7,club :null }}},
                 ()=>{
                    if(parent[0]==0 && parent[1]==0||  (parent[0]==2 && parent[1]!=4)){
                 return { no:4,text: "Desiging and Implementing various sub-systems in theautomobile domain", nextQuestion: 8,club :null }}},
        ], questionId: 2},
        { question: "What quality sets would best describe you?", options: 
            ()=>{
                 parentfornow=parent;
     return  [ ()=>{
                if(parentfornow[0]==0 || ( parentfornow[0]==3 && parentfornow[1]!=1)){
                    parent[0]=3;
                    parent[1]=1;
             return {no:1, text: "Good Speaking Skills General Knowledge and Confidence", nextQuestion: 12 ,club :"Debate and Quiz Club"}}},
             ()=>{
                if(parentfornow[0]==0  || ( parentfornow[0]==3 && parentfornow[1]!=2)){
                    parent[0]=3;
                    parent[1]=2;
             return { no:2,text: "B. Creative outlook towards arts craft and desgin.", nextQuestion: 13,club :"AnC" }}},
             ()=>{
                if(parentfornow[0]==0  || ( parentfornow[0]==3 && parentfornow[1]!=3)){
                    parent[0]=3;
                    parent[1]=3;
             return { no:3,text: "C. Acting and Speaking with an inclination towards performing arts/Production", nextQuestion: 12,club :"Cultural/Junoon/Drama and Film" }}},
             ()=>{
                if(parentfornow[0]==0  || ( parentfornow[0]==3 && parentfornow[1]!=4)){
                    parent[0]=3;
                    parent[1]=4;
             return  { no:4,text: "D. Prowess in Musical Instruments and Singing ", nextQuestion: 12,club :"Cultural/SpicMacay" }}},
             ()=>{
                if(parentfornow[0]==0  || ( parentfornow[0]==3 && parentfornow[1]!=5)){
                    parent[0]=3;
                    parent[1]=5;
             return { no:5,text: "E. Writing skills and the ability to express", nextQuestion: 13 ,club :"Abhiyanta/Abhijaat newsletter"}}}
]}, questionId: 3},
        { question: "Would you like to be a part of boat club or would you be intrested in other sports under gymkhana", options: 
            ()=>{
                 parentfornow=parent;
        return[()=>{
                if(parentfornow[0]==0  || ( parentfornow[0]==4 && parentfornow[1]!=1)){
                    parent[0]=4;
                    parent[1]=1;
             return {no:1, text: "Boat Club Activities", nextQuestion: 9 ,parent:[4,1], club :null  }}},
             ()=>{
                if(parentfornow[0]==0 || ( parentfornow[0]==4 && parentfornow[1]!=2)){
                    parent[0]=4;
                    parent[1]=2;
             return { no:2,text: "Gymkhana Sports", nextQuestion: 10,parent:[4,2], club :null }}}

    ]}, questionId: 4},

        { question: "What domain intrests you the most?", options: 
            ()=>{
                parentfornow=parent;
                console.log(parentfornow);
         return[   ()=>{
                if(parentfornow[0]==0 || ( parentfornow[0]==5 && parentfornow[1]!=1)){
                    parent[0]=5;
                    parent[1]=1;
             return  { no:1,text: "Women's Welfare", nextQuestion: 13, parent:[5,1],club :"Aarya Raas/Society for Women Engineers" }}},
             ()=>{
                if(parentfornow[0]==0 || ( parentfornow[0]==5 && parentfornow[1]!=2)){
                    parent[0]=5;
                    parent[1]=2;
             return { no:2,text: "Student bodies aimed at student welfare", nextQuestion: 13,parent:[5,2], club :"Student Welfare Forum/Student Welfare Association" }}},
             ()=>{
                if(parentfornow[0]==0 || ( parentfornow[0]==5 && parentfornow[1]!=3)){
                    parent[0]=5;
                    parent[1]=3;
             return { no:3,text: "History and Culture", nextQuestion: 13,parent:[5,3], club :"History Club" }}},
             ()=>{
                if(parentfornow[0]==0  || ( parentfornow[0]==5 && parentfornow[1]!=4)){
                    parent[0]=5;
                    parent[1]=4;
             return  { no:4,text: "Social Welfare", nextQuestion: 13,parent:[5,4], club :"Spandan" }}},
             ()=>{
                if(parentfornow[0]==0  || ( parentfornow[0]==5 && parentfornow[1]!=5)){
                    parent[0]=5;
                    parent[1]=5;
             return  { no:5,text: "Incliation towards civil services", nextQuestion: 12,parent:[5,5], club :"CSAC" }}}
    ]}, questionId: 5},
        { question: "What would best describe your intrests?", options: [
            ()=>{
                parent[0]=2;
                parent[1]=1;
            
            return{ text: "Consulting in Industry domain", nextQuestion: 13,parent:[2,1], club :"COEP Consulting Club" }},
            ()=>{
                parent[0]=2;
                parent[1]=1;
            return  { text: "Innovation and Enerpreneurship", nextQuestion: 13, parent:[2,1],club :"i2i" }},
        ], questionId: 6},

        { question: "What domain intrests you the most?", options: [
            ()=>{
                parent[0]=2;
                parent[1]=3;
            return { text: "Technical as well as non-technical aspects of astronomy", nextQuestion: 12, parent:[2,3],club :"Astronomy Club" }},
            ()=>{
                parent[0]=2;
                parent[1]=3;
            return{ text: "Working towards development and testing of satellites", nextQuestion: 12, parent:[2,3],club :"CSAT" }},
            ()=>{
                parent[0]=2;
                parent[1]=3;
            return{ text: "HAM", nextQuestion: 13, parent:[2,3],club :"HAM" }},
            ()=>{
                parent[0]=2;
                parent[1]=3;
            return{ text: "Robotics and Automation", nextQuestion: 12,parent:[2,3], club :"RSC/ARSC" }},

        ], questionId: 7},
        { question: "What domain intrests you the most?", options: [
            ()=>{
                parent[0]=2;
                parent[1]=4;
            return { text: "octane", nextQuestion: 12,parent:[2,4], club :"Octane" }},
            ()=>{
                parent[0]=2;
                parent[1]=4;
            return{ text: "veloce", nextQuestion: 12, parent:[2,4],club :"Veloceracers" }},
            ()=>{
                parent[0]=2;
                parent[1]=4;
            return{ text: "Nemesis", nextQuestion: 13, parent:[2,4],club :"Nemesis" }},

        ], questionId: 8},
        { question: "Select a Boat Club Activity", options: [
            { text: "Punt Formation", nextQuestion: 12, club :"Punt Formation" },
            { text: "TeleMatches", nextQuestion: 12, club :"TeleMatches" },
            { text: "Kayak Ballet", nextQuestion: 12, club :"Kayak Ballet" },
            { text: "Shell Games", nextQuestion: 12, club :"Shell Games" },

        ], questionId: 9},
        { question: "Select a Gymkhana Sport Activity", options: [
            { text: "Football", nextQuestion: 13, club :"Football" },
            { text: "Cricket", nextQuestion: 13, club :"Cricket" },
            { text: "Hockey", nextQuestion: 13, club :"Hockey" },

        ], questionId: 10},


        { question: "What side of the Software world would you like to explore", options: [
            ()=>{
                parent[0]=2;
                parent[1]=2;
            return { text: "Free and Open source software", nextQuestion: 13,parent:[2,2], club :"COFSUG" }},
            ()=>{
                parent[0]=2;
                parent[1]=2;
            return{ text: "Software Development", nextQuestion: 13,parent:[2,2], club :"SDS" }},
            ()=>{
                parent[0]=2;
                parent[1]=2;
            return { text: "A.I. and Data Science", nextQuestion: 13, parent:[2,2],club :"AI-DS Club" }},
            ()=>{
                parent[0]=2;
                parent[1]=2;
            return { text: "Competitive coding and community networking along with organising events and seminars", nextQuestion: 13, parent:[2,2],club :"CSI/ASCII" }},
        ], questionId: 11},

        
                {   question: ()=>{
                    count++;
                    if(count==3){
                        addSubmitButton();
                    }
                  else return "The Club recommended for you is time intensive. Would you like to:"}, 
                  options: ()=>{
                    if(count==1){
                        return[
                { text: "Explore clubs from similar domain", nextQuestion: parent[0], club :null },
                { text: "Explore clubs from a similar domain", nextQuestion: parent[0], club :null },
                ]}
                    else if(count==2){
                       
                     return   [
                            { text: "Explore clubs from another domain", nextQuestion: 1, club :null },
                            { text: "Explore clubs from a another domain", nextQuestion: 1, club :null },
                            ]    
                    }}, questionId: 12},
                    {   question: ()=>{
                        count++;
                        if(count==3){
                            addSubmitButton();
                        }
                      else return "The Club recommended for you is not very time intensive. Would you like to:"}, 
                      options: ()=>{
                        if(count==1){
                            return [
                    { text: "Explore clubs from similar domain", nextQuestion: parent[0], club :null },
                    { text: "Explore clubs from a similar domain", nextQuestion: parent[0], club :null },
                    ]}
                        else if(count==2){
                            
                          return  [
                                { text: "Explore clubs from another domain", nextQuestion: 1, club :null },
                                { text: "Explore clubs from a another domain", nextQuestion: 1, club :null },
                                ]    
                        }}, questionId: 13},
        
        { question: "How would you rate your problem-solving skills ?", options: [
            { text: "Excellent", nextQuestion: 16, club :null },
            { text: "Good", nextQuestion: 16, club :null },
            { text: "Above Average", nextQuestion: 16, club :null },
            { text: "Below Average", nextQuestion: 16, club :null },
            ], questionId: 15},

        { question: "How do you assess your ability to work in a team ?", options: [
            { text: "Excellent", nextQuestion: 17, club :null },
            { text: "Good", nextQuestion: 17, club :null },
            { text: "Above Average", nextQuestion: 17, club :null },
            { text: "Below Average", nextQuestion: 17, club :null },
            ], questionId: 16},

        { question: "How confident are you in your communication skills?", options: [
            { text: "Excellent", nextQuestion: 18, club :null },
            { text: "Good", nextQuestion: 18, club :null },
            { text: "Above Average", nextQuestion: 18, club :null },
            { text: "Below Average", nextQuestion: 18, club :null },
            ], questionId: 17},

        { question: "How do you perceive your ability to adapt to new situations??", options: [
            { text: "Excellent", nextQuestion: 19, club :null },
            { text: "Good", nextQuestion: 19, club :null },
            { text: "Above Average", nextQuestion: 19, club :null },
            { text: "Below Average", nextQuestion: 19, club :null },
            ], questionId: 18},

        { question: "How would you rate your ability to manage time effectively?", options: [
            { text: "Excellent", nextQuestion: 15, club :null },
            { text: "Good", nextQuestion: 15, club :null },
            { text: "Above Average", nextQuestion: 15, club :null },
            { text: "Below Average", nextQuestion: 15, club :null },
            ], questionId: 19},

    
    ],
];
/*const demoQuestions = [
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
];*/




const displayNextQuestion = (nextQuestionIndex) => {
    // if(demoQuestions[club]!== null){
    //     recordclub(demoQuestions.club);
    // }
    let q="";
    if (nextQuestionIndex !== null) {
        // Display the next question
        let options=[];
        //console.log("SET NO>"+setNumber);
        const currentSet = demoQuestions[setNumber];
       // console.log(currentSet)
        console.log("current question no. :"+nextQuestionIndex)
        console.log("current question parent:"+parent)
        const currentQuestion = currentSet[nextQuestionIndex - 1];
       // console.log("Options are:"+currentQuestion.options);
        if(currentQuestion.questionId==1 || currentQuestion.questionId==2 ||currentQuestion.questionId==11 ||currentQuestion.questionId==7 ||currentQuestion.questionId==8 ||currentQuestion.questionId==6){
             options=currentQuestion.options.map(callback=>callback()).filter(option => option !== undefined);
             q=currentQuestion.question;
        }
        else if(currentQuestion.questionId>=3 && currentQuestion.questionId<=5){

            options=currentQuestion.options().map(fn=>fn()).filter(option => option !== undefined);
            q=currentQuestion.question;
        }
        else if(currentQuestion.questionId==12 || currentQuestion.questionId==13){
            q=currentQuestion.question()
            options=currentQuestion.options().filter(option => option !== undefined);
        }
        else {
            q=currentQuestion.question;
            options= currentQuestion.options;
        }

        addQuizQuestion(`Question.no. ${nextQuestionIndex}: ${q}`, options, currentQuestion.questionId);    
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