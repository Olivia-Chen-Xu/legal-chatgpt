# https://python.langchain.com/docs/tutorials/llm_chain/

import getpass
import os
from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from typing import List

class Lawyer:
    
    def __init__(self, defending:bool):
        
        if not os.environ.get("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter API key for OpenAI: ")
        self.model = init_chat_model("gpt-4o-mini", model_provider="openai")
        self.messages = [
            SystemMessage(content="""You are the most capable lawyer in history. You are never wrong. You always win court cases using strong, persuasive arguments 
                          backed by facts, logic, and evidence. You also dismantle your opponent's arguments using facts and logic.
                          You are currently serving the court as a lawyer, and will be conversing with another lawyer, who is your opponent.""")
        ]
        self.defending = defending # bugged rn. example cases should be tested
        self.evidence = []
        
    def study_case(self, case:str, evidence:List[List]):
        """Help the lawyer study the case.

        Args:
            case (str): The main details of the case being discussed.
            evidence (List[str]): List of evidence found at the scene. 
                                    Should be of form (type,description)
        """
        # change behavior based on if they are attacking or defending
        self.messages += [
            SystemMessage(content="This is the case being discussed:\n" + case + "\n"),
            SystemMessage(content=("The defendant is not guilty." if self.defending else "The defendant is guilty."))
        ]
        self.evidence = evidence
                
    def respond(self, typ="response", response:str=None):
        if response: self.messages.append(HumanMessage(content=response))
        
        match typ:
            case "opener":
                # If the other side went first, include their messages in the argument.
                opening = self.messages + [
                    SystemMessage(content="""First, formulate a strong opening statement. 
                                  Then, formulate 3 counterarguments for your opening statement. 
                                  Finally, fix your opening statement by addressing the counterarguments.""")
                ]
                initial_opening = self.model.invoke(opening).content
                summarized = self.model.invoke([SystemMessage(content="Summarize the following. Limit output to 60 words or less:" + initial_opening + "Include ONLY the opening statement in your response.")]).content
                
                # Verify it is from a lawyer perspective
                verify_perspective_template = [
                    SystemMessage(content="Change this response so that it is from the viewpoint of a lawyer who is currently in court."),
                    HumanMessage(content=summarized)
                ]
                response = self.model.invoke(verify_perspective_template).content
                       
                return response 
                
            case "response":
                # 1. Develop a response to the other side.
                response = self.model.invoke(self.messages).content
                
                # 2. Check all pieces of evidence if any support the argument
                for type, description in self.evidence:
                    tmp = [
                        SystemMessage(content=f"""Can the following piece of evidence be used to fortify this response? 
                                            response:{response}
                                            evidence:{type} evidence, {description}  
                                            
                                            Start your response with "YES" or "NO".
                                    """)
                    ]
                    can_be_used = True
                    tmp_res = self.model.invoke(tmp).content
                    for denial in ['no', 'No', 'NO']:
                        if denial in tmp_res:
                            can_be_used = False
                            break
                    
                    if can_be_used:
                        incorporate_template = [
                            SystemMessage(f"""Incorporate this evidence into the argument. 
                                                evidence: {type} evidence, {description}
                                                argument: {response}
                                                
                                                Include ONLY the update argument in your response.
                                          """)
                        ]
                        # 3. Incorporate evidence into argument.
                        response = self.model.invoke(incorporate_template).content
                
                summarized = self.model.invoke([SystemMessage(content="Summarize the following to 60 words or less:" + response)]).content
                       
                # 4. Verify it is from a lawyer perspective
                verify_perspective_template = [
                    SystemMessage(content="Change this response so that it is from the viewpoint of a lawyer who is currently in court."),
                    HumanMessage(content=summarized)
                ]
                response = self.model.invoke(verify_perspective_template).content
                       
                return response 
                
            case "closer":
                # If the other side went first, include their messages in the argument.
                if response: self.messages.append(HumanMessage(content=response))
                closing = self.messages + [
                    SystemMessage(content="""First, formulate a strong closing statement. 
                                  Then, formulate 3 counterarguments for your closing statement. 
                                  Finally, fix your closing statement by addressing the counterarguments.""")
                ]
                initial_opening = self.model.invoke(closing).content
                summarized = self.model.invoke([SystemMessage(content="Summarize the following to 60 words or less:" + initial_opening)]).content
                
                # Verify it is from a lawyer perspective
                verify_perspective_template = [
                    SystemMessage(content="Change this response so that it is from the viewpoint of a lawyer who is currently in court. L"),
                    HumanMessage(content=summarized)
                ]
                response = self.model.invoke(verify_perspective_template).content
                       
                return response 
            
    def get_arg_history(self):
        return self.messages[1:] # skip instruction message
    

if __name__ == "__main__":
    from data.trials import test_trial
    
    print("CASE:", test_trial["description"])
    print("\nEVIDENCE:")
    for typ, piece in test_trial["evidence"]:
        print(f"{typ}:{piece}")
    
    print('----------------opening statements----------------------')
    
    lawyer = Lawyer(defending=True) 
    lawyer.study_case(test_trial["description"], test_trial["evidence"])
    
    user_opener = input("\nEnter your opening statement:\n")
    opener = lawyer.respond(typ="opener")
    print("Defendent opens with:\n", opener)
    # print(user_opener)
    
    print('----------------evidence arguments----------------------')
    
    prev = None
    for i in range(5):
        print(lawyer.respond(typ="response", response=prev))
        prev = input("Enter your rebuttal:\n")
    
    print('----------------closing statements----------------------')
        
    user_closer = input("Enter your closing statement:\n")
    closer = lawyer.respond(typ="closer")
    print("Defendent closes with:\n", closer)
    # print(user_closer)
    
    
    