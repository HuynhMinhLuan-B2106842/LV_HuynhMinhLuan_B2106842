import requests
import pandas as pd
import time

API_URL = "http://localhost:9000/api/chuong-trinh"  # API của bạn
EXCEL_FILE = "C:/Users/A C E R/OneDrive - ctu.edu.vn/Desktop/LV/python/programs.xlsx"  # Đường dẫn file Excel

def fetch_programs():
    """Lấy danh sách chương trình từ API"""
    response = requests.get(API_URL)
    if response.status_code == 200:
        return response.json()
    else:
        print("Lỗi khi lấy dữ liệu từ API")
        return []

def update_excel():
    """Cập nhật file Excel với dữ liệu mới nhất"""
    programs = fetch_programs()
    
    if not programs:
        print("Không có dữ liệu để cập nhật.")
        return
    
    # Chuyển dữ liệu thành DataFrame
    df = pd.DataFrame([{
        "id": program["_id"],
        "Tên Chương Trình": program["tenChuongTrinh"],
        "Thời Gian Tập Huấn": program["thoiGianTapHuan"],
        "Thời Điểm Tổ Chức": program["thoiDiemToChuc"],
        "Đối Tượng Và Số Lượng": program["doiTuongVaSoLuong"],
        "Nội Dung Tập Huấn": program["noiDungTapHuan"],
        "Khoa": program["khoa"]["ten"] if "khoa" in program and program["khoa"] else "Chưa có",
        "Giảng Viên": ", ".join([gv["ten"] for gv in program["chiuTrachNhiemChinh"]]) if program["chiuTrachNhiemChinh"] else "Chưa có"
    } for program in programs])
    
    # Ghi vào file Excel
    df.to_excel(EXCEL_FILE, index=False, engine="openpyxl")
    print(f"File Excel đã được cập nhật tại {EXCEL_FILE}")

if __name__ == "__main__":
    while True:
        update_excel()  # Cập nhật file Excel
        time.sleep(5)  # Chạy lại sau 60 giây (có thể chỉnh thời gian tùy ý)
