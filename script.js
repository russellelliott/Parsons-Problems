// Problem data
const problemData = {
    "prompt": "Divide the cost of a meal and tip among a given number of people.",
    "blocks": [
        { "id": "1", "code": "let tipAmount = mealCost * (tipPercentage /100);" },
        { "id": "2", "code": "let totalCost = mealCost + tipAmount;" },
        { "id": "3", "code": "let costPerPerson = totalCost / numPeople;" },
        { "id": "4", "code": "xxx let costPerPerson = mealCost / numPeople;" },
        { "id": "5", "code": "xxx let totalCost = mealCost - tipAmount;" },
        { "id": "6", "code": "xxx let tipAmount = mealCost + (tipPercentage /100);" }
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

const checkButton = document.getElementById('check-order');

checkButton.addEventListener('click', () => {
  const dropZones = document.querySelectorAll('.drop-zone');
  const userOrder = Array.from(dropZones).map(zone => zone.children[0]?.dataset.id);
  const isCorrect = userOrder.filter(id => id !== undefined).join(',') === problemData.correctOrder.join(',');
  
  const resultText = document.getElementById('result');
  resultText.innerText = isCorrect ? 'Correct!' : 'Incorrect. Try again!';

  // Style each drop zone based on correctness
  dropZones.forEach((zone, index) => {
    const child = zone.children[0];
    if (!child) {
      zone.style.backgroundColor = ''; // reset if empty
    } else if (child.dataset.id === problemData.correctOrder[index]) {
      zone.style.backgroundColor = 'lightgreen';
    } else {
      zone.style.backgroundColor = '#f88'; // light red
    }
  });

  // If incorrect, remove a random distractor
  if (!isCorrect) {
    const allUsedIds = new Set(userOrder.filter(Boolean));
    const correctIds = new Set(problemData.correctOrder);

    const distractorIds = problemData.blocks
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

    // Disable the check button
    // checkButton.disabled = true;
    // checkButton.style.opacity = 0.5;
  } else {
    // checkButton.disabled = false;
    // checkButton.style.opacity = 1;
  }
});

  