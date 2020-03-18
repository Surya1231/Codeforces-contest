import requests
from bs4 import BeautifulSoup

# page = requests.get("https://www.codechef.com/users/surya_1231")
# soup = BeautifulSoup(page.content, 'html.parser')
#
# r = soup.find_all('div', class_="rating-number")[0].get_text()
# maxr = (soup.find_all('small')[-1].get_text()).split()[-1]
# maxr = maxr[:len(maxr)-1]
# print(r,maxr)

url = 'https://clist.by/api/v1/json/contest/?&order_by=-start&username=swiggy123&api_key=a0fc6e7ce627ee61b7fced4c976609b97bb65b76'
params = dict({
    'resource__id' : 2
})
resp = requests.get(url=url, params=params)
x = resp.json()
t = x['objects']
for i in t:
    print(i['event'])
