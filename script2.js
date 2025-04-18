async function sendPrompt() {
    const url = "https://parsons-problem2-main-1781037.d2.zuplo.dev/openai";

    const body = JSON.stringify({
        input: "hello there",
        model: "gpt-4.1", //model doesn't matter too much
        temperature: 0.7,
        top_p: 1
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        });

        const data = await response.json();
        console.log(data.output[0].content[0].text);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Call the function
sendPrompt();
