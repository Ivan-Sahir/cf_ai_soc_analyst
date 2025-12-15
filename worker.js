export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle Browser Safety Check (Pre-flight)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === "POST") {
      try {
        // Read the user's input
        const { log_line } = await request.json();

        // The SOC Analyst System Prompt
        const messages = [
          {
            role: "system",
            content: "You are a Tier 3 SOC Analyst. Analyze the following server log. 1) Identify the specific attack vector (e.g., SQLi, XSS, Path Traversal). 2) Explain why it is dangerous. 3) Suggest a specific Cloudflare WAF rule or Regex to block it."
          },
          {
            role: "user",
            content: log_line
          }
        ];

        // DIRECTLY use the env.AI binding (No import needed!)
        const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', { messages });

        // Save to History (KV)
        const timestamp = Date.now().toString();
        await env.HISTORY.put(timestamp, JSON.stringify({
            log: log_line,
            analysis: response.response
        }));

        // Send answer back to frontend
        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, "content-type": "application/json" }
        });

      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response("SOC Analyst AI Active. Send POST request.", { headers: corsHeaders });
  }
};
