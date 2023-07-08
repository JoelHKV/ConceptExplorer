# Gallery Galore
[Gallery Galore is deployed to GitHub](https://JoelHKV.github.io/GalleryGalore/)

## General Information
Gallery Galore is an exploratory app for examining the possibilities of AI for learning. In particular, it is a collection of AI-generated paintings that help users associate famous painters with their distinct painting styles.


## Instructions and Features
Gallery Galore contains integrated instructions, so instead of reading on, consider simply click the link.

In the practice mode, users can browse through random paintings by clicking on the current painting. Alternatively, they can change the title with the bottom slider and the painter with the right slider. 

    

<img src="https://storage.googleapis.com/joeltestfiles/GG_Fig1.jpg" width="600" height="800">


 
In the quiz mode, users will be presented with a painting, and their task is to guess the painter's name. They indicate their answer by clicking one of the four buttons, each displaying a painter's name. After the answer has been given, the border of the painting flashes green for the correct answer and red for the wrong answer.



<img src="https://storage.googleapis.com/joeltestfiles/GG_Fig2.jpg" width="600" height="800">

## Setup
The app contains of the following code files:
- index.html
- src/main.jsx
- src/App.jsx
- src/App.css
- src/reducers/quizGameSlice.jsx (Redux to handle the game logic)
- src/components/CustomButtonGroup.jsx (a custom button array component utilizing MUI component library)
- src/components/IntroBlock.jsx (component containing integrated instructions)
- src/utilities/numberCruching.js (array suffling etc)
- src/assets/favicon_gg.png

## Technologies Used
Gallery Galore is written in JavaScript (React + Redux), HTML, and CSS. 

## Testing

## Painting Data
The 10 most famous painters are first selected using ChatGPT. Then, ChatGPT is asked to generate the 20 most prototypical titles across those painters. Finally, a Python script is used to instruct Dall-E to draw the paintings. The painting images are currently saved in Google Cloud Storage and accessed directly.

## Room for improvement
- Perform unit tests and clicking tests with Selenium.

