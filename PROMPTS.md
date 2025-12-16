# AI Prompt History

## Prompt 1:
"I need to build a log analysis tool using Cloudflare's platform. The main goal is to create a 'SOC Analyst AI' where a user can paste a log, and an LLM explains what it means. 
The project has to include: Cloudflare Workers (backend logic), Workers AI (Llama 3 for analysis), Workers KV (analyzed log history), and Cloudflare Pages (HTML frontend). 
Please explain how to connect these components."

## Prompt 2 (Workers):
"Write a Cloudflare Worker script in JavaScript that handles a POST (sent) request containing a log line. Use the env.AI binding to send the user's text to the Llama 3 model (@cf/meta/llama-3-8b-instruct). 
The system prompt should tell the AI to act as a SOC Analyst. Save the log and the result into the env.HISTORY KV binding. Return the AI's answer as a JSON response."

## Prompt 3 (Pages):
"Create an index.html file interface for the frontend to be hosted on Cloudflare Pages. It needs to include a text area for pasting logs and an 'Analyze Threat' button that sends a POST (sent) request to my Worker. 
Make sure the AI's answer appears on the screen under the button as a readable report. Use simple CSS with clean whites, grays, and orange accents to make it look like a professional security tool."

## Prompt 4:
"Define the specific task for the Llama 3 model. The AI must act as a specialized Cybersecurity Analyst. The output needs to be structured and concise, covering three points:
1) Identify the specific attack vector (SQLi, XSS, etc.), 2) Explain why it is dangerous, and 3) Suggest a specific WAF rule or Regex to block it."
