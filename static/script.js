
document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.slider');

function activate(e) {
const items = document.querySelectorAll('.item');
e.target.matches('.next') && slider.append(items[0])
e.target.matches('.prev') && slider.prepend(items[items.length-1]);
}

document.addEventListener('click',activate,false);
});

//from webdesign
// ScrollMagic Initialization
// Initialize Typed.js for the dynamic typing effect
const clubNavigatorOptions = {
    strings: ["Club Navigator Plus", "Your trusted mentor."],
    typeSpeed: 60, // Typing speed in milliseconds
    backSpeed: 40, // Backspacing speed in milliseconds
    startDelay: 500, // Delay before typing starts in milliseconds
    backDelay: 800, // Delay before backspacing starts in milliseconds
    showCursor: true, // Show blinking cursor
    cursorChar: "|", // Cursor character
    loop: true, // Infinite loop
};

const clubNavigatorTyped = new Typed("#clubNavigator", clubNavigatorOptions);


const controller = new ScrollMagic.Controller();

// Counter Animation
const testsCount = document.getElementById('testsCount');
const usersCount = document.getElementById('usersCount');

const counterAnimation = (target, endValue) => {
    gsap.to(target, {
        scrollTrigger: {
            trigger: target,
            triggerHook: 0.8,
            start: 'bottom 0%', // Adjust as needed
            once: true, // Only play the animation once
        },
        innerHTML: endValue,
        duration: 3,
        ease: 'power4.out',
        onUpdate: () => {
            target.innerHTML = Math.ceil(target.innerHTML);
        },
    });
};

// Set initial values
testsCount.innerHTML = 0;
usersCount.innerHTML = 0;

// Animate counters
counterAnimation(testsCount, 200); // Replace with the actual number
counterAnimation(usersCount, 200); // Replace with the actual number
// Create a ScrollMagic scene for the text transition
const textTransitionScene = new ScrollMagic.Scene({
    triggerElement: '#textTransitionTrigger', // Adjust the trigger element ID
    triggerHook: 0.8, // Adjust the trigger hook value
})
    .setTween('#textToCenter', { left: '20%', opacity: 1, ease: 'Power4.easeOut' })
    .addTo(new ScrollMagic.Controller());
const textTransitionScene2 = new ScrollMagic.Scene({
        triggerElement: '#textTransitionTrigger2', // Adjust the trigger element ID
        triggerHook: 0.8, // Adjust the trigger hook value
    })
        .setTween('#textToCenter2', { right: '50%', opacity: 1, ease: 'Power4.easeOut' })
        .addTo(new ScrollMagic.Controller());
    
    

