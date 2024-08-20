import os
import re

def insert_wordcount(content):
    correct_import = "import WordCount from '../../../../src/components/WordCount/WordCount';\n\n"
    header = correct_import + "<WordCount>\n\n"
    footer = "\n</WordCount>"
    
    # 检查是否已经包含了 WordCount
    if "import WordCount" in content:
        # 如果已存在导入，检查并更正路径
        content = re.sub(
            r"import\s+WordCount\s+from\s+['\"].*?['\"];",
            correct_import.strip(),
            content
        )
        if "<WordCount>" in content:
            return content
    
    # 查找 frontmatter 的结束位置
    frontmatter_end = re.search(r'^---\s*$', content, re.MULTILINE)
    if frontmatter_end:
        insert_position = frontmatter_end.end()
        return content[:insert_position] + "\n" + header + content[insert_position:] + footer
    else:
        return header + content + footer

def process_files(directory):
    for root, dirs, files in os.walk(directory):
        for filename in files:
            if filename.endswith('.md') or filename.endswith('.mdx'):
                filepath = os.path.join(root, filename)
                new_filepath = os.path.join(root, filename[:-3] + '.mdx')
                
                with open(filepath, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                new_content = insert_wordcount(content)
                
                with open(new_filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                
                if filepath != new_filepath:
                    os.remove(filepath)
                print(f"Processed: {filepath} -> {new_filepath}")

if __name__ == "__main__":
    current_directory = os.getcwd()
    process_files(current_directory)
    print("All files processed successfully.")