"""
Utility script to create a clean, extractable zip archive of the entire project.
Run with: python3 create_zip.py or npm run zip
"""
import os
import zipfile

def make_zip():
    zip_filename = "project.zip"
    alt_filename = "inrisk-parametric-solar-project.zip"
    exclude_dirs = {"node_modules", "dist", ".git", ".cache", ".next", "__pycache__"}
    exclude_files = {zip_filename, alt_filename, ".DS_Store"}

    with zipfile.ZipFile(zip_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk("."):
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith(".")]
            for file in files:
                if file in exclude_files or file.endswith(".zip"):
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, ".")
                zipf.write(full_path, rel_path)

    # Also keep a copy with descriptive name
    import shutil
    shutil.copyfile(zip_filename, alt_filename)
    print(f"Successfully generated {zip_filename} and {alt_filename}.")

if __name__ == "__main__":
    make_zip()
