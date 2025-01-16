from PIL import Image
import pytesseract

# Đường dẫn tới Tesseract OCR
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Đường dẫn tới ảnh
image_path = "taphuan6.jpg"  # Thay bằng đường dẫn file của bạn

# Danh sách các tiêu đề cần loại trừ
exclude_keywords = [
    "Thời gian tập huấn",
    "Tên chương trình",
    "Thời điểm tổ chức",
    "Đối tượng tập huấn",
    "Nội dung tập huấn",
    "Chịu trách nhiệm chính",
    "Thông tin liên hệ"
]

try:
    # Thực hiện OCR
    text = pytesseract.image_to_string(Image.open(image_path), lang="vie")
    
    # Loại bỏ các dòng chứa các tiêu đề
    filtered_lines = [
        line for line in text.splitlines() 
        if not any(keyword in line for keyword in exclude_keywords)
    ]
    
    # Gộp các dòng lại thành văn bản hoàn chỉnh
    filtered_text = "\n".join(filtered_lines)
    
    print("Kết quả OCR sau khi loại bỏ các tiêu đề:")
    print(filtered_text)
    
    # Lưu kết quả vào file
    with open("ketqua_loc_tieude.txt", "w", encoding="utf-8") as f:
        f.write(filtered_text)
except pytesseract.TesseractError as e:
    print("Lỗi khi thực hiện OCR:", str(e))
