import streamlit as st
from lawyer import Lawyer
from judge import Judge
from player_filler import PlayerGenerator
from stylable_container import stylable_container


# streamlit run app.py
# To stop, open a tab and press CTRL + C

from langchain_core.messages import AIMessage, HumanMessage
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate



class JudgeMessage:
    def __init__(self, content):
        self.content = content

# app config
st.set_page_config(page_title="Lawyer-Off!", page_icon="⚖️", layout="wide")

# elem1, elem2, space = st.columns([1,1,1])
# with elem1:
#     st.title("Ace Attorney, A2J")
# with elem2: 
#     st.image("./pheonix.png", width=50)

st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    
    .pixelated-title {
        font-family: 'Press Start 2P', cursive;
        font-size: 36px;
        color: #ffffff;
        text-align: center;
    }
    .pixelated-text {
        font-family: 'Press Start 2P', cursive;
        font-size: 12px;
        color: #ffffff;
        text-align: center;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Add the title with the pixelated font
st.markdown('<div class="pixelated-title">Ace Attorney, A2J</div>', unsafe_allow_html=True)
st.markdown("""<div class="pixelated-text">*not actual certified legal advice</div>""", unsafe_allow_html=True)    

st.write("#")

if "cur_section" not in st.session_state:
    st.session_state.cur_section = 0 # 0 - Opener, 1 - Debate, 2 - Closer, 3 - Judgement & Feedback

col1, col2 = st.columns([0.5,1])

with col1:
    # Selection component
    option = st.selectbox("",
        ("", "Employment", "Landlord & Tenant", "Immigration")
    )
    print("User chose area:", option)

if 'case_info' not in st.session_state:
    st.session_state.case_info = ""

with col2:
    # Focus on employment law, Landlord & Tenant law, or Immigration Law
    if option:
        with st.expander("Case Info", expanded=False):
            # Indexing matters a lot in markdown.
            case=st.session_state.case_info
            st.markdown(case)
            st.download_button(
                label="Download insights",
                data=case,
                file_name="case_info.txt",
            )

if option:
    lawyer = PlayerGenerator()
    
    # Custom CSS for the faded separator
    st.markdown("""
    <style>
    .faded-separator {
        color: #888; /* Light gray color for faded text */
        font-style: italic;
        text-align: center;
        margin: 10px 0;
        opacity: 0.7; /* Faded effect */
    }
    </style>
    """, unsafe_allow_html=True)

    # conversation

    # Custom CSS to adjust the layout
    st.markdown(
        """
        <style>
        .stChatBox {
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 10px;
            margin: 10px 0;
        }
        .stSelectbox {
            margin-bottom: 10px;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )
    # Create two columns for the chat windows
    
    # session state
    if "human_history" not in st.session_state:
        st.session_state.human_history = []
    if "cpu_history" not in st.session_state:
        st.session_state.cpu_history = []

    for i in range(len(st.session_state.human_history)):
        col1, middle, col2 = st.columns([1, 1, 1])
        hm, cm = st.session_state.human_history[i], st.session_state.cpu_history[i]
        with col1:
            with st.chat_message("Human"):
                st.write(hm.content)
                
        with col2:
            with st.chat_message("AI"):
                st.write(cm.content)

    col1, middle, col2 = st.columns([1, 1, 1])
    with middle:                
        st.markdown(f"""<div class="faded-separator">Explore legal hypotheticals by entering them in the chat window below.</div>""", unsafe_allow_html=True)
        st.markdown(f"""<div class="faded-separator">General tips for using Ace Attorney:</div>""", unsafe_allow_html=True)
        st.markdown(f"""<div class="faded-separator">- Be specific! Every detail helps.</div>""", unsafe_allow_html=True)
        st.markdown(f"""<div class="faded-separator">- Be nice! Speak to it as you would a real legal consultant.</div>""", unsafe_allow_html=True)

        st.write("##")
        user_query = st.chat_input("Type your questions here...")
        if user_query is not None and user_query != "":
            st.session_state.human_history.append(HumanMessage(content=user_query))
            
            response = lawyer.respond(query=user_query, history=st.session_state.human_history)
            st.session_state.cpu_history.append(AIMessage(content=response))

            convo = []
            for i in range(len(st.session_state.human_history)):
                convo.append(st.session_state.human_history[i])
                convo.append(st.session_state.cpu_history[i])

            summarization = lawyer.summarize(hist=convo)
            st.session_state.case_info = summarization

            print(len(st.session_state.human_history), len(st.session_state.cpu_history))
            
            st.rerun()

                
                
                

# for message in st.session_state.chat_history[:2]: # All openers
#     if isinstance(message, AIMessage):
#         with st.chat_message("AI"):
#             st.write(message.content)
#     elif isinstance(message, HumanMessage):
#         with st.chat_message("Human"):
#             st.write(message.content)

# if cur_section > 0: 
#     st.markdown(f'<div class="faded-separator">--- Presentation of Evidence and Testimony ---</div>', unsafe_allow_html=True)
#     st.markdown(f'<div class="faded-separator"> You each will have {num_args} chances to state your points. </div>', unsafe_allow_html=True)
#     for message in st.session_state.chat_history[2:2+num_args*2]: # All arguments
#         if isinstance(message, AIMessage):
#             with st.chat_message("AI"):
#                 st.write(message.content)
#         elif isinstance(message, HumanMessage):
#             with st.chat_message("Human"):
#                 st.write(message.content)

# if cur_section > 1:
#     st.markdown(f'<div class="faded-separator">--- Closing Statements ---</div>', unsafe_allow_html=True)
#     for message in st.session_state.chat_history[2+num_args*2:2+num_args*2+2]: # All closers
#         if isinstance(message, AIMessage):
#             with st.chat_message("AI"):
#                 st.write(message.content)
#         elif isinstance(message, HumanMessage):
#             with st.chat_message("Human"):
#                 st.write(message.content)

# if cur_section > 2:
#     st.markdown(f'<div class="faded-separator">--- Judgement & Reflection ---</div>', unsafe_allow_html=True)
#     for message in st.session_state.chat_history[2+num_args*2+2:]: # Feedback
#         if isinstance(message, AIMessage):
#             with st.chat_message("AI"):
#                 st.write(message.content)
#         elif isinstance(message, HumanMessage):
#             with st.chat_message("Human"):
#                 st.write(message.content)
#         else: # Judge message
#             with st.chat_message("Human", avatar="👨‍⚖️"):
#                 st.write(message.content)

# # user input
# match cur_section:
#     case 0:
#         message = "Enter your opening statement here..."
#     case 1:
#         message = "Enter your argument here..."
#     case 2:
#         message = "Enter your closing statement here..."
#     case 3:
#         message = "Ask for feedback here..."

# user_query = st.chat_input(message)
# if user_query is not None and user_query != "":
#     st.session_state.chat_history.append(HumanMessage(content=user_query))

#     with st.chat_message("Human"):
#         st.markdown(user_query)

#     with st.chat_message("AI"):
#         match cur_section:
#             case 0:
#                 response = lawyer.respond(typ="opener", response=user_query)
#             case 1:
#                 response = lawyer.respond(typ="response", response=user_query)
#             case 2:
#                 response = lawyer.respond(typ="closer", response=user_query)
#             case 3:
#                 response = judge.respond(convo=st.session_state.chat_history, query=user_query)
#         st.write(response)

#     st.session_state.chat_history.append(AIMessage(content=response) if cur_section < 2 else JudgeMessage(content=response))
#     print(len(st.session_state.chat_history), cur_section)
    
#     if len(st.session_state.chat_history) == 2 + 2*num_args + 2:
#         # Now swap to judge.
#         print("Now judging the court.")
#         response = judge.judge_conversation(convo=st.session_state.chat_history)
#         st.session_state.chat_history.append(JudgeMessage(content=response))
    
#         # TODO: Also determine the winner
    
#     st.rerun()
    
    # if len(st.session_state.chat_history) >= 2:
    #     cur_section = 1
    # elif len(st.session_state.chat_history) >= 2 + 2*num_args:
    #     cur_section = 2
    # elif len(st.session_state.chat_history) >= 2 + 2*num_args + 2:
    #     cur_section = 3 # Judgement & Feedback