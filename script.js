const problems = [
    {
        prompt: "Divide the cost of a meal and tip among a given number of people.",
        blocks: [
            { id: "1", code: "let tipAmount = mealCost * (tipPercentage /100);" },
            { id: "2", code: "let totalCost = mealCost + tipAmount;" },
            { id: "3", code: "let costPerPerson = totalCost / numPeople;" },
            { id: "4", code: "let costPerPerson = mealCost / numPeople;" },
            { id: "5", code: "let totalCost = mealCost - tipAmount;" },
            { id: "6", code: "let tipAmount = mealCost + (tipPercentage /100);" }
        ],
        correctOrder: ["1", "2", "3"]
    },
    {
        prompt: "Convert a temperature from Fahrenheit to Celsius.",
        blocks: [
            { id: "a", code: "let diff = fahrenheit - 32;" },
            { id: "b", code: "let celsius = diff * (5 / 9);" },
            { id: "c", code: "let celsius = fahrenheit * (5 / 9);" },
            { id: "d", code: "let diff = fahrenheit + 32;" }
        ],
        correctOrder: ["a", "b"]
    }
];

let currentProblemIndex = 0;
let previousAttempts = new Set();

const promptEl = document.getElementById('prompt');
const blocksContainer = document.getElementById('blocks-container');
const dropZoneContainer = document.getElementById('drop-zone-container');
const resultEl = document.getElementById('result');
const checkButton = document.getElementById('check-order');

// Entry point
loadProblem(problems[currentProblemIndex]);

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
                promptEl.innerText = "You've completed all problems!";
                blocksContainer.innerHTML = '';
                dropZoneContainer.innerHTML = '';
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

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
