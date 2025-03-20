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
import re
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
        # Kiểm tra slot 'Tên Chương Trình'
        training_name = tracker.get_slot("Tên Chương Trình")
        intent = tracker.latest_message['intent'].get('name')
        if intent == 'ask_training_sessions':
                # Lọc ra các chương trình theo số buổi
            session_count = tracker.get_slot("session_count")
            if session_count:
                    # Lọc ra các chương trình có số buổi tương ứng
                programs_with_sessions = df[df["Thời Gian Tập Huấn"].str.contains(f"{session_count}", case=False, na=False)]
                if not programs_with_sessions.empty:
                    programs = programs_with_sessions["Tên Chương Trình"].tolist()
                    dispatcher.utter_message(text=f"Các chương trình tập huấn {session_count} bao gồm:\n-" + "\n- ".join(programs))
                else:
                    dispatcher.utter_message(text=f"Xin lỗi, không có chương trình tập huấn {session_count} nào.")
            else:
                    dispatcher.utter_message(text="Xin vui lòng cung cấp số buổi bạn muốn tìm.")   
        
        if intent == 'ask_training_by_faculty' :
            faculty_name = tracker.get_slot("Khoa")
            # Lọc tất cả chương trình thuộc khoa đó
            programs_in_faculty = df[df["Khoa"].str.contains(f"{faculty_name}", case=False, na=False)]
            if not programs_in_faculty.empty:
                programs = programs_in_faculty["Tên Chương Trình"].tolist()
                dispatcher.utter_message(text=f"Các chương trình thuộc khoa {faculty_name}:\n-" + "\n- ".join(programs))
            else:
                dispatcher.utter_message(text=f"Không tìm thấy chương trình nào thuộc khoa {faculty_name}.")
        if intent == 'ask_training_by_audience':
            audience = tracker.get_slot("Đối Tượng Và Số Lượng")
            # Lọc tất cả chương trình có cùng đối tượng tham gia
            programs_for_audience = df[df["Đối Tượng Và Số Lượng"].str.contains(audience, case=False, na=False)]
            if not programs_for_audience.empty:
                programs = programs_for_audience["Tên Chương Trình"].tolist()
                dispatcher.utter_message(text=f"Các chương trình dành cho {audience}:\n- " + "\n- ".join(programs))
            else:
                dispatcher.utter_message(text=f"Không tìm thấy chương trình nào dành cho {audience}.")                 
        
        if intent == 'ask_training_by_instructor':
            # Lấy nguyên câu hỏi của người dùng
            user_message = tracker.latest_message.get('text', '').lower()

            # Lấy danh sách giảng viên từ file Excel
            all_instructors = df["Giảng Viên Chịu Trách Nhiệm"].dropna().tolist()

            # Tạo danh sách giảng viên riêng lẻ
            instructor_list = set()
            for instructors in all_instructors:
                instructor_list.update(map(str.strip, instructors.split(",")))  # Tách theo dấu phẩy và loại bỏ khoảng trắng

            # Tìm giảng viên xuất hiện trong câu hỏi
            possible_instructors = [name for name in instructor_list if name.lower() in user_message]

            # Nếu không tìm được giảng viên, dùng fuzzy matching
            best_match, score = process.extractOne(user_message, list(instructor_list)) if not possible_instructors else (possible_instructors[0], 100)

            if score >= 55:
                # Lọc các chương trình của giảng viên tìm thấy
                programs_by_instructor = df[df["Giảng Viên Chịu Trách Nhiệm"].str.contains(fr"\b{best_match}\b", case=False, na=False, regex=True)]
                
                if not programs_by_instructor.empty:
                    programs = programs_by_instructor["Tên Chương Trình"].tolist()
                    dispatcher.utter_message(text=f"Các chương trình có sự tham gia của giảng viên {best_match}:\n- " + "\n- ".join(programs))
                else:
                    dispatcher.utter_message(text=f"Không tìm thấy chương trình nào có sự tham gia của giảng viên {best_match}.")
            else:
                dispatcher.utter_message(text=f"Không tìm thấy giảng viên phù hợp trong dữ liệu. Bạn có thể thử nhập lại tên chính xác hơn.")

        
        
        if not training_name:
            # dispatcher.utter_message(text="Bạn vui lòng cung cấp tên chương trình cụ thể.")
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
            elif intent == 'ask_related_programs':
                if training_name:
                    current_program = df[df["Tên Chương Trình"].str.strip().eq(training_name.strip())]

                    if current_program.empty:
                        best_match = find_best_match(training_name, df["Tên Chương Trình"].dropna().tolist())
                        if best_match:
                            current_program = df[df["Tên Chương Trình"] == best_match]
                            training_name = best_match  

                    if not current_program.empty:
                        content = current_program["Nội Dung Tập Huấn"].values[0]
                        faculty = current_program["Khoa"].values[0]
                        instructor = current_program["Giảng Viên Chịu Trách Nhiệm"].values[0]
                        duration = current_program["Thời Gian Tập Huấn"].values[0]
                        schedule = current_program["Thời Điểm Tổ Chức"].values[0]

                        # Tìm các chương trình có nội dung tương tự
                        all_other_programs = df[df["Tên Chương Trình"] != training_name].dropna(subset=["Nội Dung Tập Huấn"])
                        similar_programs = []
                        
                        for _, row in all_other_programs.iterrows():
                            content_score = process.extractOne(content, [row["Nội Dung Tập Huấn"]])[1]
                            faculty_match = (row["Khoa"] == faculty)
                            instructor_match = (row["Giảng Viên Chịu Trách Nhiệm"] == instructor)
                            duration_match = (row["Thời Gian Tập Huấn"] == duration)
                            schedule_match = (row["Thời Điểm Tổ Chức"] == schedule)

                            # Nếu nội dung tương tự hoặc có giảng viên giống nhau hoặc cùng khoa
                            if content_score >= 80 and faculty_match:
                                similar_programs.append(row["Tên Chương Trình"])

                        if similar_programs:
                            dispatcher.utter_message(
                                text=f"Các chương trình có nội dung hoặc đặc điểm tương tự '{training_name}':\n- " + "\n- ".join(similar_programs)
                            )
                        else:
                            dispatcher.utter_message(
                                text=f"Không tìm thấy chương trình nào có nội dung hoặc đặc điểm tương tự '{training_name}'."
                            )
                    else:
                        dispatcher.utter_message(
                            text="Xin lỗi, tôi không tìm thấy chương trình bạn yêu cầu để tìm nội dung tương tự."
                        )
                else:
                    dispatcher.utter_message(
                        text="Vui lòng cung cấp tên chương trình cụ thể để tìm nội dung tương tự."
                    )



            
            else:
                dispatcher.utter_message(text="Xin lỗi, tôi không hiểu yêu cầu của bạn.")
        else:
            dispatcher.utter_message(text="")
            # Xin lỗi, tôi không tìm thấy thông tin về khóa học này.

        return []