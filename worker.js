export default {
  async fetch(request, env) {
    //Allow the frontend to talk to worker (CORS)
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    //Handle the browser's security check
    if (request.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    //Get the log data from the user
    if (request.method !== "POST") return new Response("Send a POST request", { headers });
    
    const { log_line } = await request.json();

    //Ask the AI to analyze it
    const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
      messages: [
        { role: "system", content: "You are a SOC Analyst. Explain why this log is dangerous." },
        { role: "user", content: log_line }
      ]
    });

    // Save the result to the Database (KV)
    // current Time as the "Key" and the Analysis as the "Value"
    await env.HISTORY.put(Date.now().toString(), JSON.stringify({
        input: log_line,
        result: aiResponse.response
    }));

    // Send the answer back to the website
    return new Response(JSON.stringify(aiResponse), {
      headers: { ...headers, "Content-Type": "application/json" }
    });
  }
};
