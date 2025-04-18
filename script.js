// Problem data
const problemData = {
 "prompt": "Divide the cost of a meal and tip among a given number of people.",
 "blocks": [
 {"id": "1", "code": "let tipAmount = mealCost * (tipPercentage /100);"},
 {"id": "2", "code": "let totalCost = mealCost + tipAmount;"},
 {"id": "3", "code": "let costPerPerson = totalCost / numPeople;"},
 {"id": "4", "code": "let costPerPerson = mealCost / numPeople;"},
 {"id": "5", "code": "let totalCost = mealCost - tipAmount;"},
 {"id": "6", "code": "let tipAmount = mealCost + (tipPercentage /100);"}
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

// Create drop zones
const dropZoneContainer = document.getElementById('drop-zone-container');
problemData.correctOrder.forEach(() => {
 const dropZone = document.createElement('div');
 dropZone.classList.add('drop-zone');
 dropZoneContainer.appendChild(dropZone);

 // Add event listeners for drag and drop
 dropZone.addEventListener('dragover', (e) => {
 e.preventDefault();
 });
 dropZone.addEventListener('drop', (e) => {
 e.preventDefault();
 const id = e.dataTransfer.getData('id');
 const blockDiv = document.getElementById(id);
 dropZone.appendChild(blockDiv);
 });
});

// Check order on button click
document.getElementById('check-order').addEventListener('click', () => {
 const dropZones = document.querySelectorAll('.drop-zone');
 const userOrder = Array.from(dropZones).map(zone => zone.children[0]?.dataset.id);
 const isCorrect = userOrder.filter(id => id !== undefined).join(',') === problemData.correctOrder.join(',');
 document.getElementById('result').innerText = isCorrect ? 'Correct!' : 'Incorrect. Try again!';
});