from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import threading
import time
import os
import sys
import uvicorn
from io import BytesIO
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import subprocess
# Tạo app FastAPI
app = FastAPI()

# Thêm middleware CORS để cho phép frontend truy cập từ localhost:3001
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Biến toàn cục để lưu dữ liệu
data_programs = None  
cosine_sim = None
indices = None

# Đọc file Excel cố định ngay khi ứng dụng khởi động
def load_data_from_excel():
    global data_programs, cosine_sim, indices
    
    try:
        file_path = "C:/Users/A C E R/OneDrive - ctu.edu.vn/Desktop/LV/python/programs.xlsx"  
        data_programs = pd.read_excel(file_path, engine='openpyxl')

        required_columns = {'Nội Dung Tập Huấn', 'Tên Chương Trình'}
        if not required_columns.issubset(data_programs.columns):
            raise HTTPException(status_code=400, detail=f"File Excel thiếu cột bắt buộc: {required_columns}")

        tfidf = TfidfVectorizer()
        tfidf_matrix = tfidf.fit_transform(data_programs['Nội Dung Tập Huấn'].fillna(""))

        cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
        indices = pd.Series(data_programs.index, index=data_programs['Tên Chương Trình'])

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

load_data_from_excel()

@app.get("/recommend/{program_id}")
async def get_recommend_programs(program_id: str):
    global data_programs, cosine_sim, indices

    if data_programs is None:
        raise HTTPException(status_code=400, detail="No dataset loaded! Please check the file.")

    if program_id not in data_programs['id'].astype(str).values:
        raise HTTPException(status_code=404, detail="Program not found! Please check the program ID.")

    idx = data_programs[data_programs['id'].astype(str) == program_id].index[0]

    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores_8 = sim_scores[:9]
    program_index = [i[0] for i in sim_scores_8]

    if idx in program_index:
        program_index.remove(idx)

    recommendations = data_programs.iloc[program_index][['id', 'Tên Chương Trình', 'Nội Dung Tập Huấn']].to_dict(orient="records")

    return {"recommendations": recommendations}

# 🔥 Chức năng tự động restart sau 5 giây
def restart_app():
    while True:
        time.sleep(5)  
        print("Restarting FastAPI server...")

        # Sử dụng subprocess để restart ứng dụng thay vì os.execl()
        python = sys.executable
        script_path = os.path.abspath(sys.argv[0])  # Lấy đường dẫn tuyệt đối của script
        subprocess.Popen([python, script_path])  # Mở lại script
        os._exit(0)  # Thoát ứng dụng hiện tại để script mới chạy

# Chạy restart trong luồng riêng
threading.Thread(target=restart_app, daemon=True).start()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
