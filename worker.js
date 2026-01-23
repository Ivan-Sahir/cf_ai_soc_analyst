export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response( null, { headers: corsHeaders });
    }


    const userInput = await request.json();
    const userLog = userInput.log_line; 

    const aiResponse = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
      messages: [
        { role: "system", content: "You are a SOC Analyst. Explain why this log is dangerous." },
        { role: "user", content: userLog }
      ]
    });

    const timeKey = Date.now().toString(); 
    

    await env.HISTORY.put(timeKey, JSON.stringify({
        log: userLog,
        analysis: aiResponse.response
    }));


    return new Response(JSON.stringify(aiResponse), {
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      }
    });
  }
};
