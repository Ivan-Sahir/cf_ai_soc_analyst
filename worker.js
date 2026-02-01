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


  try {

    let userInput;

    try {
      userInput = await request.json();
    } catch {
      return new Response(JSON.stringify({ response: "Invalid data format." }), {
        status: 400,
        headers: corsHeaders
      });
    }

    if (!userInput.log_line) {
      return new Response(JSON.stringify({ response: "Input is empty. Please paste a log to analyze." }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const userLog = userInput.log_line; 

    let cleanLog = userLog.replace(/^\w{3}\s+\d+\s+\d{2}:\d{2}:\d{2}\s+/, "");
      
    if (!cleanLog) cleanLog = userLog;

    const logFingerprint = "normalized_" + btoa(cleanLog);

  
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
        response: aiResponse.response
    }));


    return new Response(JSON.stringify({ response: aiResponse.response }), {
      headers: corsHeaders
    });

  } catch (error) {
    console.error("Worker Error:", error); 
    
    return new Response(JSON.stringify({ 
      response: "The AI Analyst is currently unavailable. Please try again." 
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
  }
};
