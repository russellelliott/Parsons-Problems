let problems = [];

let currentProblemIndex = 0;
let previousAttempts = new Set();
let studentName = '';
let activityName = '';

const promptEl = document.getElementById('prompt');
const blocksContainer = document.getElementById('blocks-container');
const dropZoneContainer = document.getElementById('drop-zone-container');
const resultEl = document.getElementById('result');
const checkButton = document.getElementById('check-order');
const startButton = document.getElementById('start-button');
const nameInput = document.getElementById('name');
const studentDiv = document.getElementById('student');
const parsonDiv = document.getElementById('parson');
const certificateDiv = document.getElementById('certificate');
const studentNameSpan = document.getElementById('student-name');

// Entry point
startButton.addEventListener('click', async () => {
    studentName = nameInput.value;
    activityName = document.getElementById('activity-name').value; // Get the activity name input

    if (studentName.trim() === '' || activityName.trim() === '') {
        alert("Please enter both your name and the activity name.");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const specificationFile = urlParams.get('specification');

    if (specificationFile) {
        try {
            const response = await fetch(specificationFile);
            if (!response.ok) {
                throw new Error(`Failed to load specification file: ${specificationFile}`);
            }
            problems = await response.json();
        } catch (error) {
            console.error(error);
            alert("Failed to load the problem specification file. Please check the file path.");
            return;
        }
    } else {
        alert("No specification file provided in the URL. Please include '?specification=example.json'.");
        return;
    }

    studentDiv.style.display = 'none';
    parsonDiv.style.display = 'block';

    loadProblem(problems[currentProblemIndex]);
});

function loadProblem(problem) {
    previousAttempts.clear();
    blocksContainer.innerHTML = '';
    dropZoneContainer.innerHTML = '';
    resultEl.innerText = '';
    checkButton.disabled = true;
    checkButton.style.opacity = 0.5;

    promptEl.innerText = problem.prompt;

    shuffle(problem.blocks);

    // Render blocks
    problem.blocks.forEach(block => {
        const blockDiv = document.createElement('div');
        blockDiv.classList.add('block');
        blockDiv.id = block.id;
        blockDiv.draggable = true;
        blockDiv.innerText = block.code;
        blockDiv.dataset.id = block.id;
        blocksContainer.appendChild(blockDiv);

        blockDiv.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('id', blockDiv.dataset.id);
        });
    });

    // Adjust container width
    const blocks = document.querySelectorAll('.block');
    const maxWidth = Math.max(...Array.from(blocks).map(block => block.offsetWidth));
    const maxHeight = Math.max(...Array.from(blocks).map(block => block.offsetHeight));
    blocksContainer.style.width = `${maxWidth}px`;
    dropZoneContainer.style.width = `${maxWidth}px`;

    // Drop zones
    problem.correctOrder.forEach(() => {
        const dropZone = document.createElement('div');
        dropZone.classList.add('drop-zone');
        dropZone.style.height = `${maxHeight + 20}px`;
        dropZone.style.width = `${maxWidth + 20}px`;
        dropZoneContainer.appendChild(dropZone);

        dropZone.addEventListener('dragover', (e) => e.preventDefault());

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('id');
            const newBlock = document.getElementById(id);

            // Remove existing
            if (dropZone.children.length > 0) {
                const existingBlock = dropZone.children[0];
                blocksContainer.appendChild(existingBlock);
            }

            dropZone.appendChild(newBlock);
            evaluateIfNewAnswer();
        });
    });

    blocksContainer.addEventListener('dragover', (e) => e.preventDefault());
    blocksContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('id');
        const blockDiv = document.getElementById(id);
        blocksContainer.appendChild(blockDiv);
        evaluateIfNewAnswer();
    });
}

function evaluateIfNewAnswer() {
    const dropZones = document.querySelectorAll('.drop-zone');
    const currentOrder = Array.from(dropZones).map(zone => zone.children[0]?.dataset.id || '');
    const currentKey = currentOrder.join(',');

    const isNew = !previousAttempts.has(currentKey);
    checkButton.disabled = !isNew;
    checkButton.style.opacity = isNew ? 1 : 0.5;
}

checkButton.addEventListener('click', () => {
    const problem = problems[currentProblemIndex];
    const dropZones = document.querySelectorAll('.drop-zone');
    const userOrder = Array.from(dropZones).map(zone => zone.children[0]?.dataset.id || '');
    const answerKey = userOrder.join(',');

    if (previousAttempts.has(answerKey)) {
        alert("You've already tried this combination.");
        checkButton.disabled = true;
        checkButton.style.opacity = 0.5;
        return;
    }

    previousAttempts.add(answerKey);

    const isCorrect = answerKey === problem.correctOrder.join(',');
    resultEl.innerText = isCorrect ? 'Correct!' : 'Incorrect. Try again!';

    dropZones.forEach((zone, index) => {
        const child = zone.children[0];
        if (!child) {
            zone.style.backgroundColor = '';
        } else if (child.dataset.id === problem.correctOrder[index]) {
            zone.style.backgroundColor = 'lightgreen';
        } else if (problem.correctOrder.includes(child.dataset.id)) {
            zone.style.backgroundColor = 'yellow';
        } else {
            zone.style.backgroundColor = '#f88';
        }
    });

    if (isCorrect) {
        checkButton.disabled = true;
        checkButton.style.opacity = 0.5;
        setTimeout(() => {
            currentProblemIndex++;
            if (currentProblemIndex < problems.length) {
                loadProblem(problems[currentProblemIndex]);
            } else {
                showCertificate();
            }
        }, 1500);
    } else {
        const correctIds = new Set(problem.correctOrder);
        const distractorIds = problem.blocks
            .map(b => b.id)
            .filter(id => !correctIds.has(id));

        const availableDistractors = distractorIds.filter(id => {
            const elem = document.getElementById(id);
            return elem && elem.parentElement;
        });

        if (availableDistractors.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableDistractors.length);
            const toRemoveId = availableDistractors[randomIndex];
            const toRemoveElem = document.getElementById(toRemoveId);
            toRemoveElem.remove();
        }

        checkButton.disabled = true;
        checkButton.style.opacity = 0.5;
    }
});

// Function to display the certificate
function showCertificate() {
    parsonDiv.style.display = 'none';
    certificateDiv.style.display = 'block';

    // Ensure the student name and activity name are set on the certificate
    const studentNameSpan = document.getElementById('student-name');
    const activityNameSpan = document.getElementById('activity-name-certificate');
    
    if (studentNameSpan && activityNameSpan) {
        studentNameSpan.innerText = studentName;  // Display student name on the certificate
        activityNameSpan.innerText = activityName;  // Display activity name on the certificate
    } else {
        console.error("Elements for student name or activity name not found.");
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
