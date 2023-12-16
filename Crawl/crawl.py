import os
from bs4 import BeautifulSoup
from openpyxl import Workbook
Code = []
Country = []
Title = []
Price = []
Time = []
Vehicle = []
Image = []

CountryPath = "Countries/"
CountyList = os.listdir(CountryPath)

for country in CountyList:

        if '.html' in country:
            with open(CountryPath + country , 'r', encoding='utf-8') as file:
                html_content = file.read()
                soup = BeautifulSoup(html_content, 'html.parser')
                block = soup.find_all('div', class_='col-xs-12 col-sm-12 col-md-12 col-lg-12 tourItem')
                j = 1
                for i in block:
                    Country.append(country[:-5])

                    title = i.find('span', class_='tourItemName').text.strip()
                    Title.append(title)

                    image = i.find('img', class_='img-responsive visible-xs lazy').get('data-src')
                    Image.append(image)
                    k = i.find('span', class_='tourItemPrice')
                    if k:
                        price = i.find('span', class_='tourItemPrice').text.strip().split(' ')[0]
                        price = int(price.replace('.',''))
                        Price.append(price)
                    else:
                        Price.append(None)
                    
                    code = i.find('span', class_='v-margin-right-15').text.strip()
                    Code.append(code[4:])

                    span = i.find_all('span',class_='v-margin-right-15')
                    for t in span:
                        if t.find('i', class_='glyphicon glyphicon-time'):
                            time = t.text.strip().split(' ')[0]
                            if time.isdigit():
                                Time.append(int(time))
                            else:
                                Time.append(1)
                    
                    vehicles = i.find_all('i', {'data-original-title': True})
                    vehicle = ''
                    count = 0
                    for v in vehicles:
                        if count != 0:
                            vehicle = vehicle +' - '+ v['data-original-title']
                        else:
                            vehicle = v['data-original-title']
                        count +=1
                        
                    Vehicle.append(vehicle)

workbook = Workbook()
sheet = workbook.active
sheet.append(['Code', 'Country', 'Title', 'Image', 'Time', 'Price', 'Vehicle'])
for a,b,c,d,e,f,g in zip(Code, Country, Title, Image, Time, Price, Vehicle):
    sheet.append([a,b,c,d,e,f,g])
workbook.save('TourData.xlsx')