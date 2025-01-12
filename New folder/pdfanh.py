import cv2
import numpy as np
from pdf2image import convert_from_path
import pytesseract

# Đường dẫn tới file PDF
pdf_path = "QD25_Quy-dinh-dao-tao-truc-tuyen-cua-Truong-DHCT.pdf"

# Đường dẫn tới Poppler
poppler_path = r"C:\Users\A C E R\Downloads\Release-24.08.0-0\poppler-24.08.0\Library\bin"

# Đường dẫn tới Tesseract OCR
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Chuyển đổi PDF thành hình ảnh
images = convert_from_path(pdf_path, poppler_path=poppler_path)

# Duyệt qua từng trang
for page_number, image in enumerate(images):
    # Chuyển đổi PIL Image sang định dạng NumPy array
    img = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    # Xử lý hình ảnh
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # Chuyển sang grayscale
    gray = cv2.GaussianBlur(gray, (5, 5), 0)     # Làm mịn ảnh
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)  # Nhị phân hóa

    # Trích xuất văn bản bằng Tesseract (tiếng Việt)
    text = pytesseract.image_to_string(thresh, lang='vie')  # Sử dụng gói ngôn ngữ 'vie'
    print(f"--- Trang {page_number + 1} ---")
    print(text)

    # Lưu hình ảnh đã xử lý (tùy chọn)
    cv2.imwrite(f"processed_page_{page_number + 1}.png", thresh)
