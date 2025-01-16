
import re
import fitz  # PyMuPDF để trích xuất văn bản từ PDF


def extract_text_from_pdf(file_path):
    """Trích xuất văn bản từ file PDF."""
    pdf_document = fitz.open(file_path)
    text = ""
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        text += page.get_text()
    pdf_document.close()
    return text


def extract_information(text):
    """Trích xuất thông tin từ văn bản công văn bằng regex."""

    # Tìm số công văn
    so_cong_van_pattern = r"Số:\s+([^\n]+)"
    so_cong_van = re.search(so_cong_van_pattern, text)
    so_cong_van = so_cong_van.group(1).strip() if so_cong_van else None

    # Tìm ngày ban hành
    ngay_ban_hanh_pattern = r"Hà Nội,\s+ngày\s+(\d{1,2})\s+tháng\s+(\d{1,2})\s+năm\s+(\d{4})"
    ngay_ban_hanh = re.search(ngay_ban_hanh_pattern, text)
    ngay_ban_hanh = f"{ngay_ban_hanh.group(1)}/{ngay_ban_hanh.group(2)}/{ngay_ban_hanh.group(3)}" if ngay_ban_hanh else None

    # Tìm nghị định liên quan
    nghi_dinh_pattern = r"Nghị định số\s+([^\s]+)"
    nghi_dinh = re.search(nghi_dinh_pattern, text)
    nghi_dinh = nghi_dinh.group(1).strip() if nghi_dinh else None

    # Tìm người ký
    nguoi_ky_pattern = r"BỘ TRƯỞNG BỘ TÀI CHÍNH\s+([^\n]+)"
    nguoi_ky = re.search(nguoi_ky_pattern, text)
    nguoi_ky = nguoi_ky.group(1).strip() if nguoi_ky else None

    # Trả về kết quả
    return {
        "Số công văn": so_cong_van,
        "Ngày ban hành": ngay_ban_hanh,
        "Nghị định liên quan": nghi_dinh,
        "Người ký": nguoi_ky,
    }


def main():
    # Đường dẫn tới file PDF công văn
    file_path = "Công văn 5512.pdf"  # Thay bằng đường dẫn file của bạn

    try:
        # Trích xuất văn bản từ PDF
        text = extract_text_from_pdf(file_path)

        # Trích xuất thông tin chính
        extracted_info = extract_information(text)

        # Hiển thị thông tin
        print("Thông tin trích xuất từ công văn:")
        for key, value in extracted_info.items():
            print(f"{key}: {value}")

    except Exception as e:
        print("Có lỗi xảy ra:", e)


if __name__ == "__main__":
    main()
