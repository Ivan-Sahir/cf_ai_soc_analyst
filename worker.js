export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response( null, { headers: corsHeaders });
    }


    const userInput = await request.json();
    const userLog = userInput.log_line; 

    const logFingerprint = "rawLog_" + btoa(userLog)

    const existingAnalysis = await env.HISTORY.get(logFingerprint)

    if(existingAnalysis) {
      return new Response(existingAnalysis, {headers: corsHeaders});
    }

    const aiResponse = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
      messages: [
        { role: "system", content: "You are a SOC Analyst. Explain why this log is dangerous." },
        { role: "user", content: userLog }
      ]
    });
    

    await env.HISTORY.put(logFingerprint, JSON.stringify({
        log: userLog,
        repsonse: aiResponse.response
    }));


    return new Response(JSON.stringify({ response: aiResponse.response }), {
      headers: corsHeaders
    });
  }
};
