// Function to handle the print process
function handlePrint() {
    window.print();
}

// Event listener for the print button
document.getElementById('print-button')?.addEventListener('click', handlePrint);