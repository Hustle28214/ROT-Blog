import os 
cnt = 0
for root, dirs, files in os.walk("."):
    for file in files:
        if file.endswith(".mdx"):
            cnt += 1
            print(os.path.join(root, file))


print(cnt-11)