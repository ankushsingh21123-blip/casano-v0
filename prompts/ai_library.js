// This file stores the prompts used to call LLM APIs (Claude/OpenAI) 
// to make the app "Smart".
module.exports = {
    searchNormalization: `Task: Parse a raw user search query and return structured JSON. 
Handle Typos: "tothpaste" -> "toothpaste" 
Handle Hinglish: "doodh" -> "milk" 
Output JSON: { "normalized": "", "category": "", "is_urgent": bool }`,

    restockAdvisor: `Analyze sales data: [SALES_DATA].  
Predict stockout days.  
Suggest restock quantity for items with < 2 days stock.`,

    disputeResolution: `Tone: Empathetic, Firm. 
Rule: If missing item confirmed -> Refund 100%. 
Rule: If late > 20 mins -> Refund delivery fee.`
};
