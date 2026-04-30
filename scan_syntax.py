
import os

def check_syntax(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            lines = f.readlines()
        
        for i, line in enumerate(lines):
            trimmed = line.strip()
            # Tim dau ; le loi o dau dong (thuong la do loi ghep chuoi)
            if trimmed == ";":
                print(f"SUSPICIOUS: Lone semicolon at line {i+1}")
            
            # Kiem tra xem co khai bao bien nao bi thieu gia tri khong
            if " = ;" in line:
                print(f"ERROR: Missing value assignment at line {i+1}")

            # Kiem tra cac mảng bi trung lap dau , hoac ;
            if ",," in line:
                print(f"WARNING: Double comma at line {i+1}")
        
        print("Scan complete.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_syntax("app.js")
