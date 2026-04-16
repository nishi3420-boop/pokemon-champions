import os
with open('mega_list.utf8', 'w', encoding='utf-8') as f:
    for file in os.listdir('assets/zukan_official'):
        if 'メガ' in file:
            f.write(file + '\n')
