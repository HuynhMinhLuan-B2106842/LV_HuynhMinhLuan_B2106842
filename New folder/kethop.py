import re
import fitz  # PyMuPDF để trích xuất văn bản từ PDF
import cv2
import numpy as np
from pdf2image import convert_from_path
import pytesseract


def extract_text_with_ocr(pdf_path, poppler_path):
    """Trích xuất văn bản từ PDF bằng OCR."""
    images = convert_from_path(pdf_path, poppler_path=poppler_path)
    ocr_text = ""

    for page_number, image in enumerate(images):
        img = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (5, 5), 0)
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        page_text = pytesseract.image_to_string(thresh, lang='vie')  # Tiếng Việt
        ocr_text += f"--- Trang {page_number + 1} ---\n{page_text}\n\n"
    return ocr_text


def extract_text_from_pdf(file_path):
    """Trích xuất văn bản từ file PDF bằng PyMuPDF."""
    pdf_document = fitz.open(file_path)
    text = ""
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        text += page.get_text()
    pdf_document.close()
    return text


def extract_information(text):
    """Trích xuất thông tin từ văn bản công văn bằng regex."""
    # Tìm số hiệu
    so_hieu_pattern = r"Số:\s+([^\n]+)"
    so_hieu = re.search(so_hieu_pattern, text)
    so_hieu = so_hieu.group(1).strip() if so_hieu else None

    # Tìm ngày ban hành
    ngay_ban_hanh_pattern = r"ngày\s+\d{1,2}\s+tháng\s+\d{1,2}\s+năm\s+\d{4}"
    ngay_ban_hanh = re.search(ngay_ban_hanh_pattern, text)
    ngay_ban_hanh = ngay_ban_hanh.group(0).strip() if ngay_ban_hanh else None

    # Tìm nội dung
    noi_dung_pattern = r"QUYẾT ĐỊNH\s+([\s\S]+?)\nCăn cứ"
    noi_dung = re.search(noi_dung_pattern, text)
    noi_dung = noi_dung.group(1).strip() if noi_dung else None

    return {
        "Số hiệu": so_hieu,
        "Ngày ban hành": ngay_ban_hanh,
        "Nội dung": noi_dung,
    }


def main():
    # Đường dẫn tới file PDF
    pdf_path = "document.pdf"  # Thay bằng file của bạn
    poppler_path = r"C:\Users\A C E R\Downloads\Release-24.08.0-0\poppler-24.08.0\Library\bin"
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

    try:
        # Trích xuất văn bản bằng PyMuPDF
        print("Đang trích xuất văn bản từ PyMuPDF...")
        text = extract_text_from_pdf(pdf_path)

        # Nếu văn bản trống, thử OCR
        if not text.strip():
            print("Không thể đọc văn bản từ PDF. Thử OCR...")
            text = extract_text_with_ocr(pdf_path, poppler_path)

        # Hiển thị văn bản trích xuất được
        print("\n--- Văn bản trích xuất ---")
        print(text)

        # Trích xuất thông tin
        extracted_info = extract_information(text)

        # Hiển thị kết quả
        print("\nThông tin trích xuất từ công văn:")
        for key, value in extracted_info.items():
            print(f"{key}: {value}")

    except Exception as e:
        print("Có lỗi xảy ra:", e)


if __name__ == "__main__":
    main()
