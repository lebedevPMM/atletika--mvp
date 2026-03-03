
import os
from pypdf import PdfReader

def extract_text_from_pdfs(directory):
    output_file = "requirements_summary.md"
    
    with open(output_file, "w", encoding="utf-8") as out:
        out.write("# Functional Requirements Summary\n\n")
        
        # Get all PDF files
        pdf_files = [f for f in os.listdir(directory) if f.endswith('.pdf')]
        pdf_files.sort()
        
        print(f"Found {len(pdf_files)} PDF files.")
        
        for filename in pdf_files:
            filepath = os.path.join(directory, filename)
            print(f"Processing: {filename}")
            
            try:
                reader = PdfReader(filepath)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() + "\n"
                
                out.write(f"## File: {filename}\n\n")
                out.write(text)
                out.write("\n\n---\n\n")
                
            except Exception as e:
                print(f"Error reading {filename}: {e}")
                out.write(f"## File: {filename}\n\n")
                out.write(f"Error extracting text: {e}\n\n")
                out.write("\n\n---\n\n")

    print(f"Extraction complete. Saved to {output_file}")

if __name__ == "__main__":
    requirements_dir = os.path.join(os.getcwd(), "requirements")
    if os.path.exists(requirements_dir):
        extract_text_from_pdfs(requirements_dir)
    else:
        print(f"Directory not found: {requirements_dir}")
