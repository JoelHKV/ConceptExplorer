# Concept Explorer
[Concept Explorer is deployed to GitHub](https://joelhkv.github.io/ConceptExplorer/)

## General Information
Concept Explorer is an educational app for understanding concepts, which are fundamental building blocks in thinking. With Concept Explorer, the user can learn not only the definitions but also how concepts relate to one another. For instance, <em>Mind</em> and <em>Consciousness</em> are closely related in the <em>conceptual space</em>, much like how <em> Belgium</em> and <em>the Netherlands</em> are closely located in the <em>physical space</em>.

## Instructions and Features
### Globe View
Concept Explorer starts with <strong>Globe View</strong>, displaying a Google Map with custom markers representing concepts. You can navigate and zoom the map just like a regular Google Map. Once you find an interesting concept, you can start exploring it by clicking on it. Alternatively, you can click <em>RAND</em> to explore a random concept. If you're not satisfied with the concept you are exploring, simply click <em>GLOBE</em> to return to <strong>Globe View</strong>.

<img src="https://raw.githubusercontent.com/JoelHKV/ConceptExplorer/main/public/Instruction_Fig1.jpg" width="600" height="auto">

### Browse View
Concept Explorer switches to <strong>Browse View</strong> once a starting concept has been selected. In <strong>Browse View</strong>, the map zooms in and shows the selected concept in the center of the screen, surrounded by eight closely related concepts. You can click on any of these surrounding concepts to make it the new center concept. Alternatively, you can click on the center concept to switch to <strong>Details View</strong> that contains more information about the concept.

<img src="https://raw.githubusercontent.com/JoelHKV/ConceptExplorer/main/public/Instruction_Fig2.jpg" width="600" height="auto">

### Details View
<strong>Details View</strong> is a popup window that provides a summary of the concept, a link to the corresponding Wikipedia article for further exploration, and a score ranging from 0 to 100, indicating how concrete versus abstract the concept is. This score is also displayed in the middle of the marker in <strong>Browse View</strong>.

<img src="https://raw.githubusercontent.com/JoelHKV/ConceptExplorer/main/public/Instruction_Fig3.jpg" width="600" height="auto">


## Getting Started
To run this React app locally, follow these four steps:
1. **Clone the Repository:**
```
git clone https://github.com/JoelHKV/ConceptExplorer.git
```
2. **Navigate to the Project Directory:**
```
cd your-react-app
```
3. **Install Dependencies:**
```
npm install
```
4. **Start the Development Server:**
```
npm run dev
```

## Folder Structure
The project directory is organized as follows:

* src/: This folder contains the main source code.
* main.jsx: The JavaScript entry point.
* App.jsx: The main entry point.
* App.css: The main CSS styles specific to App.jsx.
* assets/: Stores static assets like images, fonts, etc.
* components/: Houses React components.
* hooks/: Contains custom React hooks.
* reducers/: Stores Redux reducers.
* utilities/: Holds utility functions.



## Database Schema


## API Documentation




## Technologies Used
Concept Explorer is written in JavaScript (React + Redux), HTML, and CSS. 

## Testing

## Data

The data for Concept Explorer is created in the Concept Generation -project.

 
## Room for improvement
- Perform unit tests and clicking tests with Selenium.

