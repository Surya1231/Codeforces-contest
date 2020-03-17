import requests
from bs4 import BeautifulSoup

page = requests.get("https://www.codechef.com/users/surya_1231")
soup = BeautifulSoup(page.content, 'html.parser')

r = soup.find_all('div', class_="rating-number")[0].get_text()
maxr = (soup.find_all('small')[-1].get_text()).split()[-1]
maxr = maxr[:len(maxr)-1]
print(r,maxr)
