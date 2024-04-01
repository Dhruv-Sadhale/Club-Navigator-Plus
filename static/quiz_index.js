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
let outer=0;

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
         console.log("in addquizquestion  options:"+option+" "+option.club);
         if(option.parent!==null)
         outer=option.parent[1];
        //  if(outer.parent!=null)
        //  console.log("Outer:"+outer.parent[1])
        // else {
        //     console.log("Outer is still null");
        // }
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
        { question: "In order to maximize my extra-curricular hours, I want to:", options: [
            ()=>{
                //console.log("hello2");
                parentfornow[0]=parent[0];
                parentfornow[1]=parent[1];
                if((parentfornow[0]!=2)){
                   // console.log(parent[0]+"is here");
                   if(parent[0]!=0) {parent[0]=0; parent[1]=0;}
            return {no:1,text: "Bring out the tech-savvy qualities which abide in me", nextQuestion: 2, parent:null,club:null }}},
            ()=>{
                if((parentfornow[0]!=3)){
                    if(parent[0]!=0) {parent[0]=0; parent[1]=0;}
            return{  no:2,text: "Let my creative interests flourish by inclining towards arts and finer skills", parent:null,nextQuestion: 3,club: null }}},
            ()=>{
                if((parentfornow[0]!=4)){
                    if(parent[0]!=0) {parent[0]=0; parent[1]=0;}
            return { no:3,text: "Showcase and master my physical prowess in sports", nextQuestion: 4 ,parent:null,club :null}} },
            ()=>{
                if((parentfornow[0]!=5)){
                    if(parent[0]!=0) {parent[0]=0; parent[1]=0;}
            return{ no:4,text: "Explore new ideas of Social-Welfare, History and Philanthrophy", nextQuestion: 5,parent:null,club :null }}},
        ], questionId: 1},
        { question: "Fascinating! You appear to have great taste in Technology, which is a vast domain in itself. Which of the following excites you the most?", options: [
            
            ()=>{
                if(parent[0]==0 && parent[1]==0|| (parent[0]==2 && parent[1]!=1)){
             return {no:1, text: "The thought of building my own start-up or consultancy services", parent:null,nextQuestion: 6 ,club :null}
                }},
                ()=>{
                    if(parent[0]==0 && parent[1]==0||  (parent[0]==2 && parent[1]!=2)){
                 return { no:2,text: "The thought of hosting my own website in hackathons and national level coding contests", parent:null,nextQuestion: 11 ,club :null}}},
                 ()=>{
                    if(parent[0]==0 && parent[1]==0||  (parent[0]==2 && parent[1]!=3)){
                 return { no:3,text: "The thought of constructing robots or intruments, perhaps to deploy them in space",parent:null, nextQuestion: 7,club :null }}},
                 ()=>{
                    if(parent[0]==0 && parent[1]==0||  (parent[0]==2 && parent[1]!=4)){
                 return { no:4,text: "The thought of desiging and implementing various sub-systems in the automobile domain",parent:null, nextQuestion: 8,club :null }}},
        ], questionId: 2},
        { question: "Fantastic! Which of these skill sets describe you perfectly?", options: 
            ()=>{
                parentfornow[0]=parent[0];
                if(parent[0]!=0)
                parentfornow[1]=outer;
     return  [ ()=>{
                if(parentfornow[0]==0 || ( parentfornow[0]==3 && parentfornow[1]!=1)){
                    parent[0]=3;
                    parent[1]=1;
                    
             return {no:1, text: "Sublime communication skills, general knowledge and confidence", nextQuestion: 14 ,parent:[3,1],club :"Debate and Quiz Club"}}},
             ()=>{
                if(parentfornow[0]==0  || ( parentfornow[0]==3 && parentfornow[1]!=2)){
                    parent[0]=3;
                    parent[1]=2;
             return { no:2,text: "Mastery in designing posters, portraits and animations", nextQuestion: 16,parent:[3,2],club :"AnC" }}},
             ()=>{
                if(parentfornow[0]==0  || ( parentfornow[0]==3 && parentfornow[1]!=3)){
                    parent[0]=3;
                    parent[1]=3;
             return { no:3,text: "Proficiency in acting, tradional dances and performing arts", nextQuestion: 14,parent:[3,3],club :"Cultural Club" }}},
             ()=>{
                if(parentfornow[0]==0  || ( parentfornow[0]==3 && parentfornow[1]!=4)){
                    parent[0]=3;
                    parent[1]=4;
             return  { no:4,text: "Prowess in musical instruments and classical singing", nextQuestion: 14,parent:[3,4],club :"SpicMacay" }}},
             ()=>{
                if(parentfornow[0]==0  || ( parentfornow[0]==3 && parentfornow[1]!=5)){
                    parent[0]=3;
                    parent[1]=5;
             return { no:5,text: "Firm belief in 'the pen being mightier than the sword' ", nextQuestion: 16 ,parent:[3,5],club :"Abhijaat newsletter"}}}
]}, questionId: 3},
        { question: "'All work and no play makes Jack a dull boy'.If you were told to represent college in a sport, which will it be?", options: 
            ()=>{
                parentfornow[0]=parent[0];
                if(parent[0]!=0)
                parentfornow[1]=outer;
        return[()=>{
                if(parentfornow[0]==0  || ( parentfornow[0]==4 && parentfornow[1]!=1)){
                    parent[0]=4;
                    parent[1]=1;
             return {no:1, text: "Carry forward the prestine legacy of COEP's boat club", nextQuestion: 9 ,parent:[4,1], club :null  }}},
             ()=>{
                if(parentfornow[0]==0 || ( parentfornow[0]==4 && parentfornow[1]!=2)){
                    parent[0]=4;
                    parent[1]=2;
             return { no:2,text: "Explore the wide range of sports first and maybe try out rowing later", nextQuestion: 10,parent:[4,2], club :null }}}

    ]}, questionId: 4},

        { question: "Interesting, how would you associate yourself to the following domains?", options: 
            ()=>{
                parentfornow[0]=parent[0];
                if(parent[0]!=0)
                parentfornow[1]=outer;

                console.log(parentfornow);
         return[   ()=>{
                if(parentfornow[0]==0 || ( parentfornow[0]==5 && parentfornow[1]!=1)){
                    parent[0]=5;
                    parent[1]=1;
             return  { no:1,text: "I believe firmly in Women's Welfare and their equality in Society", nextQuestion: 16, parent:[5,1],club :"Aarya Raas/Society for Women Engineers" }}},
             ()=>{
                if(parentfornow[0]==0 || ( parentfornow[0]==5 && parentfornow[1]!=2)){
                    parent[0]=5;
                    parent[1]=2;
             return { no:2,text: "I want to be a part of a student body aimed at student welfare in and out of college", nextQuestion: 16,parent:[5,2], club :"Student Welfare Forum/Student Welfare Association" }}},
             ()=>{
                if(parentfornow[0]==0 || ( parentfornow[0]==5 && parentfornow[1]!=3)){
                    parent[0]=5;
                    parent[1]=3;
             return { no:3,text: "I believe in unearthing the hidden secrets of our nation's History and Culture", nextQuestion: 16,parent:[5,3], club :"History Club" }}},
             ()=>{
                if(parentfornow[0]==0  || ( parentfornow[0]==5 && parentfornow[1]!=4)){
                    parent[0]=5;
                    parent[1]=4;
             return  { no:4,text: "I am all for social welfare and community service towards the needy", nextQuestion: 16,parent:[5,4], club :"Spandan" }}},
             ()=>{
                if(parentfornow[0]==0  || ( parentfornow[0]==5 && parentfornow[1]!=5)){
                    parent[0]=5;
                    parent[1]=5;
             return  { no:5,text: "I have strong incliation towards giving the UPSC exam.", nextQuestion: 14,parent:[5,5], club :"CSAC" }}}
    ]}, questionId: 5},
        { question: "What would best describe your interests?", options: [
            ()=>{
                parent[0]=2;
                parent[1]=1;
            
            return{ text: "Help the college in the Consulting Department", nextQuestion: 16,parent:[2,1], club :"COEP Consulting Club" }},
            ()=>{
                parent[0]=2;
                parent[1]=1;
            return  { text: "Maybe ending up in Shark Tank in the near future", nextQuestion: 16, parent:[2,1],club :"i2i" }},
        ], questionId: 6},

        { question: "In this era of automation, I look forward to:", options: [
            ()=>{
                parent[0]=2;
                parent[1]=3;
            return { text: "Build my own telescope and host star-gazing sessions", nextQuestion: 14, parent:[2,3],club :"Astronomy Club" }},
            ()=>{
                parent[0]=2;
                parent[1]=3;
            return{ text: "Working towards development and testing of satellites", nextQuestion: 14, parent:[2,3],club :"CSAT" }},
            ()=>{
                parent[0]=2;
                parent[1]=3;
            return{ text: "Build transmitters to communicate with the International Space Station", nextQuestion: 16, parent:[2,3],club :"HAM" }},
            ()=>{
                parent[0]=2;
                parent[1]=3;
            return{ text: "Build payloads for drones and contribute towards manufacturing industrial robots", nextQuestion: 14,parent:[2,3], club :"RSC/ARSC" }},

        ], questionId: 7},
        { question: "What domain intrests you the most?", options: [
            ()=>{
                parent[0]=2;
                parent[1]=4;
            return { text: "octane", nextQuestion: 14,parent:[2,4], club :"Octane" }},
            ()=>{
                parent[0]=2;
                parent[1]=4;
            return{ text: "veloce", nextQuestion: 14, parent:[2,4],club :"Veloceracers" }},
            ()=>{
                parent[0]=2;
                parent[1]=4;
            return{ text: "Nemesis", nextQuestion: 16, parent:[2,4],club :"Nemesis" }},

        ], questionId: 8},
        { question: "COEP's Boat club dates back to over a 100 years. On the day of Regatta do you want to:", options: [
            { text: "See yourself narrating a story through vibrant display of various shapes with boats ", nextQuestion: 14, parent:null,club :"Punt Formation" },
            { text: "See yourself light up the river with fire crackers and lights ", nextQuestion: 14, parent:null,club :"TeleMatches" },
            { text: "See youself rowing in one of the hardest boats in a dynamic display of shapes", nextQuestion: 14, parent:null,club :"Kayak Ballet" },
            { text: "See yourself rowing in the longest and oldest boats", parent:null,nextQuestion: 14, club :"Shell Games" },

        ], questionId: 9},
        { question: "Gymkhana offers a wide range of sports, which would be your first choice?", options: [
            { text: "Football", nextQuestion: 16,parent:null, club :"Football" },
            { text: "Cricket", nextQuestion: 16,parent:null, club :"Cricket" },
            { text: "Hockey", nextQuestion: 16,parent:null, club :"Hockey" },

        ], questionId: 10},


        { question: "What side of the Software world would you like to explore", options: [
            ()=>{
                parent[0]=2;
                parent[1]=2;
            return { text: "I want to contribute to the Open Source community and learn more about Github, Linux and other open source softwares", nextQuestion: 16,parent:[2,2], club :"COFSUG" }},
            ()=>{
                parent[0]=2;
                parent[1]=2;
            return{ text: "I am keen on building and developing android apps and web applications to meet college demands.", nextQuestion: 16,parent:[2,2], club :"SDS" }},
            ()=>{
                parent[0]=2;
                parent[1]=2;
            return { text: "I want to learn how ChatGpt, Gemini and other AI models work in depth", nextQuestion: 16, parent:[2,2],club :"AI-DS Club" }},
            ()=>{
                parent[0]=2;
                parent[1]=2;
            return { text: "I want to host and participate in Competitive coding and community networking events", nextQuestion: 16, parent:[2,2],club :"CSI/ASCII" }},
        ], questionId: 11},

        
                {   question: ()=>{
                    count++;
                    if(count==3){
                        addSubmitButton();
                    }
                  else return `Great responses so far, your No.${count} recommendation is ready. Bear in mind that this club is a bit time intensive.`}, 
                  options: ()=>{
                    if(count==1){
                        return[
                { text: "Let us continue to explore clubs from a similar domain of your interest!", nextQuestion: parent[0],parent:null,club :null },
                
                ]}
                    else if(count==2){
                       
                     return   [
                            { text: "Let us explore a new domain altogether!", nextQuestion: 1, parent:null,club :null },
                           
                            ]    
                    }}, questionId: 12},
                    {   question: ()=>{
                        count++;
                        if(count==3){
                            addSubmitButton();
                        }
                      else return `Great responses so far, your No.${count} recommendation is ready.It seems it will perfectly fit your schedule.`}, 
                      options: ()=>{
                        if(count==1){
                            return [
                    { text: "Let us continue to explore clubs from a similar domain of your interest!", nextQuestion: parent[0], parent:null,club :null },
                    
                    ]}
                        else if(count==2){
                            
                          return  [
                                { text: "Let us explore a new domain altogether!", nextQuestion: 1,parent:null, club :null },
                                
                                ]    
                        }}, questionId: 13},
        
        { question: "How would you rate your problem-solving skills for the previously chosen domain?", options: [
            { text: "Excellent", nextQuestion: 15, parent:null,club :null },
            { text: "Good", nextQuestion: 15, parent:null,club :null },
            { text: "Above Average", nextQuestion: 15, parent:null,club :null },
            { text: "Below Average", nextQuestion: 15, parent:null,club :null },
            ], questionId: 14},

        { question: "How do you assess your ability to work in a team for the previously chosen domain?", options: [
            { text: "Excellent", nextQuestion: 12,parent:null, club :null },
            { text: "Good", nextQuestion: 12, parent:null,club :null },
            { text: "Above Average", nextQuestion: 12,parent:null, club :null },
            { text: "Below Average", nextQuestion: 12, parent:null,club :null },
            ], questionId: 15},

        { question: "How confident are you in your communication skills for the previously chosen domain?", options: [
            { text: "Excellent", nextQuestion: 17,parent:null, club :null },
            { text: "Good", nextQuestion: 17,parent:null, club :null },
            { text: "Above Average", nextQuestion: 17,parent:null, club :null },
            { text: "Below Average", nextQuestion: 17,parent:null, club :null },
            ], questionId: 16},

        { question: "How do you perceive your ability to adapt to new situations for the previously chosen domain?", options: [
            { text: "Excellent", nextQuestion: 18,parent:null, club :null },
            { text: "Good", nextQuestion: 18,parent:null, club :null },
            { text: "Above Average", nextQuestion: 18,parent:null, club :null },
            { text: "Below Average", nextQuestion: 18, parent:null,club :null },
            ], questionId: 17},

        { question: "How would you rate your ability to manage time effectively for the previously chosen domain?", options: [
            { text: "Excellent", nextQuestion: 13,parent:null, club :null },
            { text: "Good", nextQuestion: 13,parent:null, club :null },
            { text: "Above Average", nextQuestion: 13,parent:null, club :null },
            { text: "Below Average", nextQuestion: 13,parent:null, club :null },
            ], questionId: 18},

    
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
            { text: "Web/Software Development and Competitive Coding", nextQuestion: 14 ,club :null},
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

        addQuizQuestion(q, options, currentQuestion.questionId);    
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