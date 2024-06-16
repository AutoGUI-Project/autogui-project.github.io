
$(document).ready(function() {
    var editor = CodeMirror.fromTextArea(document.getElementById("bibtex"), {
        lineNumbers: false,
        lineWrapping: true,
        readOnly:true
    });
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });
    

});


// script.js
let contents = [];
let currentIndex = 0;

async function fetchData() {
    try {
        const response = await fetch('./assets/anno_examples/anno_example.json');
        contents = await response.json();

        // Initialize with the first content
        displayContent(currentIndex);
    } catch (error) {
        console.error('Error loading functionalities:', error);
    }
}
// Fetch data on load
fetchData();

// Fetch content from local JSON file
// fetch('/assets/anno_examples/anno_examples.json')
//     .then(response => response.json())
//     .then(data => {
//         contents = data.contents;
//         displayContent(currentIndex);
//     })
//     .catch(error => console.error('Error fetching content:', error));

function displayContent(index) {
    if (contents.length === 0) return;
    const content = contents[index];

    const contentImage = document.getElementById('autogui-image');
    const commentsList = document.getElementById('funcs');
    const imageContainer = document.querySelector('.image-container');
    const slider = document.querySelector('.slider');
    // Update the image
    contentImage.src = './assets/anno_examples/' + content.image;

    // Update the comments
    imageContainer.querySelectorAll('.box').forEach(box => box.remove());    commentsList.innerHTML = '';

    // Wait for the image to load to get correct dimensions
    contentImage.onload = function() {
        const containerRect = imageContainer.getBoundingClientRect();
        const sliderRect = slider.getBoundingClientRect();

        // Calculate offsets relative to the slider
        const containerOffsetX = containerRect.left - sliderRect.left;
        const containerOffsetY = containerRect.top - sliderRect.top;

        const imgWidth = contentImage.clientWidth;
        const imgHeight = contentImage.clientHeight;
        const containerWidth = imageContainer.clientWidth;
        const containerHeight = imageContainer.clientHeight;

        let W, H;
        if (imgWidth > imgHeight) {
            W = 1280;
            H = 720;
        }
        else {
            W = 428;
            H = 746;
        }
        const imageAspectRatio = W / H;
        const containerAspectRatio = containerWidth / containerHeight;
        
        let displayedWidth, displayedHeight, offsetX, offsetY;

        if (imageAspectRatio > containerAspectRatio) {
            // Image is wider than container
            displayedWidth = containerWidth;
            displayedHeight = containerWidth / imageAspectRatio;
            offsetX = containerOffsetX;
            offsetY = containerOffsetY + (containerHeight - displayedHeight) / 2;
        } else {
            // Image is taller than container
            displayedWidth = containerHeight * imageAspectRatio;
            displayedHeight = containerHeight;
            offsetX = (containerWidth - displayedWidth) / 2;
            offsetY = 0;
        }

        const widthRatio = imgWidth / W;
        const heightRatio = imgHeight / H;

        // Create and append boxes
        content.boxes.forEach((box, i) => {
            const boxElement = document.createElement('div');
            boxElement.classList.add('box');

            const x = box[0];
            const y = box[1];
            const w = box[2] - x;
            const h = box[3] - y;

            boxElement.style.left = `${offsetX + x * widthRatio}px`;
            boxElement.style.top = `${offsetY + y * heightRatio}px`;
            boxElement.style.width = `${w * widthRatio}px`;
            boxElement.style.height = `${h * heightRatio}px`;
            boxElement.dataset.index = i;
            boxElement.addEventListener('click', () => highlightBox(i, content.funcs[i]));
            imageContainer.appendChild(boxElement);
        });
    };
}

function highlightBox(boxIndex, func) {
    // Remove highlight from all boxes
    document.querySelectorAll('.box').forEach(box => box.classList.remove('highlight'));

    // Highlight the selected box
    const selectedBox = document.querySelector(`.box[data-index='${boxIndex}']`);
    selectedBox.classList.add('highlight');

    // Display comments for the selected box
    const commentsList = document.getElementById('funcs');
    commentsList.innerHTML = ''; // Clear previous comment
    const li = document.createElement('li');
    li.textContent = func;
    commentsList.appendChild(li);
}

function showNextContent() {
    currentIndex = (currentIndex + 1) % contents.length;
    displayContent(currentIndex);
}

function showPreviousContent() {
    currentIndex = (currentIndex - 1 + contents.length) % contents.length;
    displayContent(currentIndex);
}

function showRandomContent() {
    currentIndex = Math.floor(Math.random() * contents.length);
    displayContent(currentIndex);
}




// var frameNumber = 0, // start video at frame 0
//     // lower numbers = faster playback
//     playbackConst = 500, 
//     // get page height from video duration
//     setHeight = document.getElementById("main"), 
//     // select video element         
//     vid = document.getElementById('v0'); 
//     // var vid = $('#v0')[0]; // jquery option

    
    

// // Use requestAnimationFrame for smooth playback
// function scrollPlay(){  
//   var frameNumber  = window.pageYOffset/playbackConst;
//   vid.currentTime  = frameNumber;
//   window.requestAnimationFrame(scrollPlay);
// console.log('scroll');
// }
    
// // dynamically set the page height according to video length
// vid.addEventListener('loadedmetadata', function() {
//   setHeight.style.height = Math.floor(vid.duration) * playbackConst + "px";
// });
    
    
//     window.requestAnimationFrame(scrollPlay);