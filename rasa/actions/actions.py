# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions


# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []
from rasa_sdk import Action
from rasa_sdk.events import SlotSet
import pandas as pd
from fuzzywuzzy import process

# Load dataset
file_path = "C:/Users/A C E R/Downloads/programs (2).xlsx"
df = pd.read_excel(file_path, sheet_name='Chương Trình Tập Huấn')

def find_best_match(query, choices, threshold=80):
    """Tìm kiếm gần đúng tên chương trình bằng fuzzy matching"""
    match, score = process.extractOne(query, choices)
    return match if score >= threshold else None

class ActionGetTrainingInfo(Action):
    def name(self):
        return "action_get_training_info"

    def run(self, dispatcher, tracker, domain):
        training_name = tracker.get_slot("Tên Chương Trình")

        if not training_name:
            dispatcher.utter_message(text="Bạn vui lòng cung cấp tên chương trình cụ thể.")
            return []

        # Tìm kiếm chính xác trước
        row = df[df["Tên Chương Trình"].str.strip().eq(training_name.strip())]

        # Nếu không tìm thấy, thử fuzzy matching
        if row.empty:
            best_match = find_best_match(training_name, df["Tên Chương Trình"].dropna().tolist())
            if best_match:
                row = df[df["Tên Chương Trình"] == best_match]
                training_name = best_match  # Cập nhật tên chương trình với tên đúng trong file

        if not row.empty:
            intent = tracker.latest_message['intent'].get('name')

            if intent == 'ask_training_duration':
                duration = row["Thời Gian Tập Huấn"].values[0]
                dispatcher.utter_message(text=f"Chương trình '{training_name}' có thời gian tập huấn là {duration}.")
            
            elif intent == 'ask_training_schedule':
                schedule = row["Thời Điểm Tổ Chức"].values[0]
                dispatcher.utter_message(text=f"Khóa học '{training_name}' được tổ chức vào {schedule}.")
            
            elif intent == 'ask_training_audience':
                audience = row["Đối Tượng Và Số Lượng"].values[0]
                dispatcher.utter_message(text=f"Chương trình '{training_name}' dành cho {audience}.")
            
            elif intent == 'ask_training_content':
                content = str(row["Nội Dung Tập Huấn"].values[0])
                dispatcher.utter_message(text=f"Nội dung chính của khóa học '{training_name}' là: {content}\n.")
            
            elif intent == 'ask_training_faculty':
                faculty = row["Khoa"].values[0]
                dispatcher.utter_message(text=f"Khóa học '{training_name}' thuộc khoa {faculty}.")
            
            elif intent == 'ask_training_instructor':
                instructor = row["Giảng Viên Chịu Trách Nhiệm"].values[0]
                dispatcher.utter_message(text=f"Giảng viên phụ trách chương trình '{training_name}': {instructor}.")
            
            else:
                dispatcher.utter_message(text="Xin lỗi, tôi không hiểu yêu cầu của bạn.")
        else:
            dispatcher.utter_message(text="Xin lỗi, tôi không tìm thấy thông tin về khóa học này.")

        return []
