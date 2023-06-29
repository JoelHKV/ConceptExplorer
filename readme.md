# Gallery Galore

[The app is deployed to GitHub](https://joelhkv.github.io/HelsinkiCityBikeApp/)


## General Information

Gallery Galore is an exploratory App for examining the possibilities of AI for learning. In particular, Gallery Galore teaches the styles of famous painters in an engaging way. 

                    
## Instructions and Features

In the practice mode, users can click through random paintings or use sliders to change the title or painter.

In the quiz mode, users will be presented with four buttons, each displaying a different painter's name. The task is to click on the button that corresponds to the displayed painting.

Below are some screenshots from the app:


## Setup

The app contains of the following code files:
- index.html
- src/main.jsx
- src/App.jsx
- src/App.css
- src/reducers/counterSlice.js
- src/components/QuizBlock.jsx


## Technologies Used
The app is written in JavaScript (React + Redux), HTML, and CSS. 


## Testing

### Pseudo-random navigation with Selenium

With the following Python script, we navigate through menus and change the window size to test the app. We have tested the app with Chrome, Firefox, and Edge (but not Safari). 



```
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
import random
import time

def openbroswer(browser):
    if browser=='Chrome':
        from selenium.webdriver.chrome.service import Service
        from selenium.webdriver.chrome.options import Options
        s=Service('C:/Program Files (x86)/chromedriver.exe')
        driver = webdriver.Chrome(service=s)
    if browser=='Firefox':
        from selenium.webdriver.firefox.service import Service
        from selenium.webdriver.firefox.options import Options
        options = Options()
        options.binary_location = 'C:/Program Files/Mozilla Firefox/firefox.exe'  # Path to the Firefox binary
        s = Service('C:/Program Files (x86)/geckodriver.exe')  # Path to the geckodriver executable
        driver = webdriver.Firefox(service=s, options=options)
    if browser=='Edge': 
        from msedge.selenium_tools import Edge, EdgeOptions
        driver_path = 'C:/Program Files (x86)/msedgedriver.exe'
        options = EdgeOptions()
        driver = Edge(executable_path=driver_path, options=options)
           
    return driver

def randomdate():
    element = driver.find_element(By.ID, "tripview")
    element.click()
    element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "menu")))
    time.sleep(1)
    element = driver.find_element(By.ID, "currentdate")
    element.click()
    time.sleep(1)
    items = driver.find_elements(By.CLASS_NAME, 'generatedCell')
    random_item = random.choice(items)
    random_item.click()
    time.sleep(1)
    wait = WebDriverWait(driver, 10)
    wait.until(EC.element_to_be_clickable((By.ID, "fin")))
    
def clickrandomdiv(menu, div,subdiv,close):
    element = driver.find_element(By.ID, menu)
    element.click()
    element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, div)))  
    time.sleep(1)
    items = element.find_elements(By.CSS_SELECTOR, subdiv)
    random_item = random.choice(items)
    random_item.click()
    if close=='close':
        time.sleep(2)
        element = driver.find_element(By.ID, "closemap")
        element.click()
        
def clickspecialbutton(specialbuttons):
    random_item = random.choice(specialbuttons)
    element = driver.find_element(By.ID, random_item)
    element.click()        
              
def click_random_button(driver, excluded_buttons=[]):
    elements = driver.find_elements(By.XPATH, "//button")
    ids = [element.get_attribute("id") for element in elements if element.get_attribute("id") not in excluded_buttons]

    while True:    
        random_id = random.choice(ids)
        if random_id:
            button_to_click = driver.find_element(By.XPATH, "//button[@id='" + random_id + "']")
            if button_to_click.is_enabled() and button_to_click.is_displayed() and len(button_to_click.get_attribute("id")):
                print(random_id)
                button_to_click.click()
                wait = WebDriverWait(driver, 10)
                wait.until(EC.element_to_be_clickable((By.ID, "fin")))
                print('Successfully clicked ' + button_to_click.get_attribute("id"))
                wait = WebDriverWait(driver, 10)
                wait.until(EC.element_to_be_clickable((By.ID, "fin")))
                break
    return    
    


driver=openbroswer('Chrome')

url='http://127.0.0.1:5173/HelsinkiCityBikeApp/'
driver.get(url)

function_probabilities = [0.2,0.2,0.2,0.2,0.2] 

for x in range(50):
    
    driver.set_window_size(random.randint(370, 1920), random.randint(768, 1080))
    
    random_index = random.choices(range(len(function_probabilities)), function_probabilities)[0]
    if random_index==0:
        clickrandomdiv("stationview","stat_menu","div.menu-item","noclose")
        time.sleep(1)
        specialbuttons = ['TopDeparture', 'TopReturn', 'HeatmapDeparture', 'HeatmapReturn']
        clickspecialbutton(specialbuttons)
        time.sleep(1)
        clickspecialbutton(['closemap'])
    if random_index==1:
        clickrandomdiv("tripview","menu","div.menu-item","close")
    if random_index==2:
        clickrandomdiv("stationview","stat_menu","div.menu-item","close")        
    if random_index==3:
        randomdate()
    if random_index==4:
        click_random_button(driver, excluded_buttons=['currentdate','cleartext',"''",'fin','swe','eng','distance','duration'])


driver.quit()

```


### Bombardiering the DOM

With the following AHK script, we randomly click the screen every 2ms. You can refer to the following video for the demonstration: [BombardieringTheDom.mp4](https://storage.googleapis.com/joelvuolevi/bikeapp/BombardieringTheDom.mp4).

```
Loop
{
    WinGetPos, X, Y, Width, Height, Bike App
    Random, ClickX, X, X+Width
    Random, ClickY, Y+150, Y+Height-150
    ControlClick, x%ClickX% y%ClickY%, Bike App
    Sleep 2
   
    
    ; Check if the "Q" key is pressed
    if GetKeyState("Q", "P")
    {
        MsgBox Exiting the script.
        ExitApp ; Exit the script
    }
}

```

## Data

The painting files are currently saved in Google Cloud Storage and can be accessed as such. 


## Room for improvement
- Write a Google Cloud Function to serve the painting files for better access control.

- Better optimize layout for different screen resolutions: Ensure that the app's layout is optimized to provide a seamless user experience across various screen resolutions. Test and adjust the design to accommodate different screen sizes and aspect ratios.

- Perform unit test as well as other tests.

