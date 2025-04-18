// Problem data
const problemData = {
    "prompt": "Divide the cost of a meal and tip among a given number of people.",
    "blocks": [
        { "id": "1", "code": "let tipAmount = mealCost * (tipPercentage /100);" },
        { "id": "2", "code": "let totalCost = mealCost + tipAmount;" },
        { "id": "3", "code": "let costPerPerson = totalCost / numPeople;" },
        { "id": "4", "code": "let costPerPerson = mealCost / numPeople;" },
        { "id": "5", "code": "let totalCost = mealCost - tipAmount;" },
        { "id": "6", "code": "let tipAmount = mealCost + (tipPercentage /100);" }
    ],
    "correctOrder": ["1", "2", "3"]
};

// Display prompt
document.getElementById('prompt').innerText = problemData.prompt;

// Create and display blocks
const blocksContainer = document.getElementById('blocks-container');
problemData.blocks.forEach(block => {
    const blockDiv = document.createElement('div');
    blockDiv.classList.add('block');
    blockDiv.id = block.id;
    blockDiv.draggable = true;
    blockDiv.innerText = block.code;
    blockDiv.dataset.id = block.id;
    blocksContainer.appendChild(blockDiv);

    // Add event listeners for drag and drop
    blockDiv.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('id', blockDiv.dataset.id);
    });
});

// Adjust width of blocks container and drop zone container
const blocks = document.querySelectorAll('.block');
const maxWidth = Math.max(...Array.from(blocks).map(block => block.offsetWidth));
const maxHeight = Math.max(...Array.from(blocks).map(block => block.offsetHeight));
blocksContainer.style.width = `${maxWidth}px`;
const dropZoneContainer = document.getElementById('drop-zone-container');
dropZoneContainer.style.width = `${maxWidth}px`;

// Create drop zones
problemData.correctOrder.forEach(() => {
    const dropZone = document.createElement('div');
    dropZone.classList.add('drop-zone');
    dropZone.style.height = `${maxHeight + 20}px`; // adjust height dynamically
    dropZone.style.width = `${maxWidth + 20}px`; // adjust height dynamically
    dropZoneContainer.appendChild(dropZone);

    // Add event listeners for drag and drop
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('id');
        const newBlock = document.getElementById(id);

        // If there's already a block in this drop zone
        if (dropZone.children.length > 0) {
            const existingBlock = dropZone.children[0];
            blocksContainer.appendChild(existingBlock); // Move it back to the word bank
        }

        dropZone.appendChild(newBlock); // Add the new block
    });


    // Event listeners for dragging back to the word bank
    // Make the word bank (blocksContainer) a drop target
    blocksContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    blocksContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const id = e.dataTransfer.getData('id');
        const blockDiv = document.getElementById(id);
        blocksContainer.appendChild(blockDiv); // Move it back to the word bank
    });
});

// Check order on button click
document.getElementById('check-order').addEventListener('click', () => {
    const dropZones = document.querySelectorAll('.drop-zone');
    const userOrder = Array.from(dropZones).map(zone => zone.children[0]?.dataset.id);
    const isCorrect = userOrder.filter(id => id !== undefined).join(',') === problemData.correctOrder.join(',');
    document.getElementById('result').innerText = isCorrect ? 'Correct!' : 'Incorrect. Try again!';
});