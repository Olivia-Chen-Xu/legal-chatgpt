export async function fetchAssistantResponse(formType: "description" | "onboarding" | "performance" | "termination", jobPosition: string) {
    const assistantKeys: Record<"description" | "onboarding" | "performance" | "termination", string> = {
      description: "ASSISTANT_KEY_1",
      onboarding: "ASSISTANT_KEY_2",
      performance: "ASSISTANT_KEY_3",
      termination: "ASSISTANT_KEY_4"
    };


    
  
    const assistantKey = assistantKeys[formType];
  
    if (!assistantKey) {
      throw new Error("Invalid form type.");
    }
  
    const prompt = `Provide information for a ${formType} regarding the job position: ${jobPosition}.
    Format the response into 5 sections separated by five asterisks (*****).`;
  
    const response = await fetch("/api/(routes)/llm/query2", {  
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: prompt,
        dialogFlow: "", 
        includedDocuments: [], 
        fullConversation: [],
        token: assistantKey,
      }),
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch OpenAI response");
    }
  
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No response body");
  
    let result = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      result += new TextDecoder().decode(value);
    }
  
    // Split response into 5 sections
    return result.split("*****").map((section) => section.trim());
  }
  