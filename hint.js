const hintButton = document.getElementById("hint-button");

hintButton.addEventListener("click", async () => {
    // Disable button + show loading state
    hintButton.disabled = true;
    hintButton.innerText = "Generating Hint...";

    const problem = problems[currentProblemIndex];
    const availableBlocks = problem.blocks.filter(block => {
        const elem = document.getElementById(block.id);
        return elem && (elem.parentElement === blocksContainer || elem.parentElement.classList.contains("drop-zone"));
    });

    const availableCode = availableBlocks.map(block => `- ${block.code}`).join('\n');

    const correctCode = problem.correctOrder
        .map(id => {
            const match = problem.blocks.find(block => block.id === id);
            return match ? match.code : '';
        })
        .map(line => `- ${line}`)
        .join('\n');

    const prompt = `
You are helping a student solve a Parsons Problem.

Here are the code blocks still available:
${availableCode}

Here is the correct order of code (do NOT give this away, it's for your reference only):
${correctCode}

Provide a helpful hint to guide the student. 
Do not mention specific line numbers, IDs, or provide the answer directly. 
Instead, focus on a high-level suggestion or clue about what might be in the wrong place or what logical step they should consider.
    `.trim();

    try {
        const url = "https://parsons-problem2-main-1781037.d2.zuplo.dev/openai";
        const body = JSON.stringify({
            input: prompt,
            model: "gpt-4.1",
            temperature: 0.7,
            top_p: 1
        });

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });

        const data = await response.json();
        const hint = data.output[0].content[0].text;
        resultEl.innerText = "💡 Hint: " + hint;
    } catch (error) {
        console.error("An error occurred while fetching hint:", error);
        resultEl.innerText = "Error retrieving hint.";
    }

    // Re-enable button and restore text
    hintButton.disabled = false;
    hintButton.innerText = "Get Hint";
});
