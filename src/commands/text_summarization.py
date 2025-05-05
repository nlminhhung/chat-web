# from langchain_openai import ChatOpenAI
# from langchain_core.prompts import ChatPromptTemplate
# from dotenv import load_dotenv
# import os

# load_dotenv()
# ChatOpenAI.openai_api_key = os.getenv("OPENAI_API_KEY")

# model = ChatOpenAI(model="gpt-4o-mini")

# system_template = "Summarize the following conversation into {language} in less than 25 words."

# conversation = [
#     "Minh: Chào Hương, hôm nay đi làm có gì vui không?",
#     "Hương: Chào Minh! Cũng bình thường thôi, công việc hơi bận. Còn bạn, ngày hôm nay thế nào?",
#     "Minh: Mình thì rảnh hơn, sáng nay còn đi uống cà phê với bạn bè.",
#     "Hương: Nghe thích quá! Cuối tuần này bạn có kế hoạch gì chưa?",
#     "Minh: Chưa có gì đặc biệt. Nếu rảnh thì chúng ta gặp nhau nhé?",
#     "Hương: Được đó! Mình sẽ nhắn bạn để sắp xếp nhé.",
#     "Minh: Ok, hẹn gặp lại!",
#     "Hương: Hẹn gặp lại bạn!"
# ]


# conversation_text = "\n".join(conversation)

# prompt_template = ChatPromptTemplate.from_messages(
#     [("system", system_template), ("user", "{text}")]
# )
# prompt = prompt_template.invoke({"language": "English", "text":conversation_text})
# response = model.invoke(prompt)
# print(response.content)
