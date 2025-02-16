# https://python.langchain.com/docs/tutorials/llm_chain/

import getpass
import os
from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from typing import List

class Judge:
    
    def __init__(self):
        if not os.environ.get("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter API key for OpenAI: ")
        self.model = init_chat_model("gpt-4o-mini", model_provider="openai")
        self.prompt_template = ChatPromptTemplate.from_messages([
            ("system", """You are a tough but fair judge. You will be presented a defendent followed by some evidence for and against their case. You should rule if the defendent is GUILTY or NOT GUILTY, and support it using 3 strong points."""),
            ("user", "{text}")
        ])
        
        self.verification_messages = [
            SystemMessage(content="Consider the ruling. Find 3 counterarguments to your ruling, and defend your ruling against the counterarguments."),
        ]
        
        self.conclusion_message = [
            SystemMessage(content="Now consider this entire conversation. Is the defendent GUILTY or NOT GUILTY?")
        ]
        
    def judge(self, prompt:str):
        prompt = self.prompt_template.invoke({"text":prompt})
        prompt = prompt.to_messages()
        
        response = self.model.invoke(prompt).content
        
        messages = prompt + [SystemMessage(content=response)] + self.verification_messages
        
        thoughtful_response = self.model.invoke(messages).content
        
        messages += self.conclusion_message
        
        conclusion = self.model.invoke(messages).content
        
        return response, thoughtful_response, conclusion
    
    def judge_conversation(self, convo:List):
        """convo should be a list AIMessage/HumanMessage objects that will be turned into a dialogue for the judge bot for prompting."""
        str_convo = ""
        for message in convo:
            if isinstance(message, AIMessage):
                str_convo += f"Defense: {message}\n"
            else: # HumanMessage
                str_convo += f"Prosecution: {message}\n"
                
        conversation_str = [
            SystemMessage(content="How would a tough, but fair judge rule the following case? Output should be from the judge's perspective."),
            HumanMessage(content=str_convo)
        ]
        
        response = self.model.invoke(conversation_str).content
        
        result_str = [
            SystemMessage("You are a tough but fair judge. There is no jury. Given the following reasoning, decide if the accused is GUILTY or NOT GUILTY of the crimes discussed. If the accused is guilty, provide a reasonable punishment."),    
            HumanMessage(content=response)
        ]
        response = self.model.invoke(result_str).content
        
        return response
    
    def respond(self, convo:List, query:str):
        """convo should be a list AIMessage/HumanMessage objects that will be turned into a dialogue for the judge bot for prompting."""
        str_convo = ""
        for message in convo:
            if isinstance(message, AIMessage):
                str_convo += f"Defense: {message}\n"
            else: # HumanMessage
                str_convo += f"Prosecution: {message}\n"
        
        conversation_str = [
            SystemMessage(content="You are a tough but fair judge. Answer the user query as best as you can, given the following context."),
            SystemMessage(content="""Context:
The user is the prosecution. 
Court Proceeding:""" + str_convo),
            HumanMessage(content=query)
        ]
        
        response = self.model.invoke(conversation_str).content
        return response
    
    def test_judge(self):
        example="""The appellants, Robin Eldridge and John and Linda Warren, are deaf and prefer to communicate through sign language. After a not-for-profit agency stopped providing free medical interpretation in 1990, they were unable to receive a similar service from the government. Without interpretation, they had difficulty communicating with their doctors, increasing their risk of misdiagnosis and ineffective treatment. Neither the Hospital Insurance Act nor the Medical and Health Care Services Act in British Columbia provided funding for sign language interpretation for the deaf. The appellants sought a declaration that the failure to provide sign language interpreters constituted discrimination on the basis of physical disability, and therefore violated the appellants’ equality rights under s. 15(1) of the Canadian Charter of Rights and Freedoms."""
        print("Judging an example client.\n")
        response, thoughtful, conclusion = self.judge(example)
        print("First thought:\n", response)
        print("----------------------")
        
        print("Second thought:\n", thoughtful)
        print("----------------------")
        
        print("Conclusion:\n", conclusion)
        print("----------------------")
        
if __name__ == '__main__':
    judge = Judge()
    judge.test_judge()