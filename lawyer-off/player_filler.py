# https://python.langchain.com/docs/tutorials/llm_chain/

import getpass
import os
from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from typing import List

# Trial data
import os 

all_cases = ""
folder_path="./data"
for filename in os.listdir(folder_path):
    file_path = os.path.join(folder_path, filename)  # Get the full file path
    with open(file_path, "r", encoding="utf-8") as file:  # Open the file
        all_cases += file.read() + "\n"  # Append the file's content to the string

class PlayerGenerator:
    
    def __init__(self):
        
        if not os.environ.get("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter API key for OpenAI: ")
        self.model = init_chat_model("gpt-4o-mini", model_provider="openai")
        self.messages = [
            SystemMessage(content="""You are a legal intake who will listen to a client's complaints about legal issues. Ask them a question
                          related to the legal situation to narrow down issues and facts, and cannot be answered using Yes/No.
                          Keep total response below 60.""")
        ]
        self.pity = [SystemMessage(content="""You are a legal intake who will listen to a client's complaints.
                                   Say something empathetic about the person's situation without being insensitive or demeaning.
                                   Keep total response below 30.""")]
        self.num = 0
                
    def respond(self, query, history = None):
        messages = self.messages + [
            HumanMessage(content=query)
        ]
        pity = self.pity+ [
            HumanMessage(content=query)
        ]
        
        if self.num == 1:
            response = self.model.invoke(pity).content + "\n" + self.model.invoke(messages).content
        else:
            response = (self.model.invoke(pity).content + "\n" + self.model.invoke(messages).content) if len(history) != 2 else (self.get_closest_case(history))
        self.num += 1
        return response
            
    def summarize(self, hist:List)->str:
        # hist is List of stuff
        convo = ""
        for msg in hist:
            if isinstance(msg, HumanMessage):
                convo += "User: " + msg.content + "\n"
            else:
                convo += "Advisor: " + msg.content + "\n"
        print("convo:", convo)
        
        summ = [
            SystemMessage(content="Summarize the facts and issues presented by the client in point-form. DO NOT GIVE ADVICE."),
            HumanMessage(content=convo)
        ]
        response = self.model.invoke(summ).content
        return response
    
    def get_closest_case(self, hist:List):
        # List of user messages
        convo = ""
        for msg in hist:
            convo += msg.content + "\n"
        print("convo:", convo)
        
        cases = [
            SystemMessage(content=f"""Given the following list of cases, 
                          find the one most relevant to the user's situation and use the case to ask relevant questions. DO NOT REFERENCE THE CASE. Keep output to 60 words or less. DO NOT GIVE ADVICE.\n{all_cases}"""),
            HumanMessage(content=f"User situation:{convo}")
        ]
        response = self.model.invoke(cases).content
        return response
        
    def get_arg_history(self):
        return self.messages[1:] # skip instruction message
    
if __name__ == "__main__":
    x = PlayerGenerator()
    print(x.respond("My boyfriend is cheating on me and using our credit card to take another girl to dinner. What can I do?"))
    print(x.get_arg_history())