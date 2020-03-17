import requests
from bs4 import BeautifulSoup

url = "https://codeforces.com/api/contest.list"
x = requests.get(url)
x = x.json()

for i in x['result']:
    if i['phase'] == "FINISHED":
        l = i["id"]
        break

f = open("total.js","w+")
f.write("var total_questions = {")
for id in range(1,l+1):
    print(id)
    page = requests.get("https://codeforces.com/contest/"+str(id))
    soup = BeautifulSoup(page.content, 'html.parser')
    w = False
    a = []
    for i in soup.find_all('option'):
        t = i.get_text()
        if t == "Choose problem":
            if w:
                break;
            else:
                w = True
        else:
            a.append(t.split(' ')[0])
    temp = str(id)+':'+str(a)+','
    f.write(temp)
f.write("}")
f.close()
