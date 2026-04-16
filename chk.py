import sys

with open('js/app.js', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
b_count = 0
for i, line in enumerate(lines):
    b = line.count('`')
    if b > 0:
        b_count += b
        print(f"Line {i+1}: contains {b} backticks. Total so far: {b_count}")
