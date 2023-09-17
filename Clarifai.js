import React, { Component } from 'react';
import './App.css';
import ParticlesBg from 'particles-bg';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';

const returnClarifaiRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '******';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'esra75';       
const APP_ID = 'Test';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';   
const IMAGE_URL = imageUrl;

const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
                }
            }
        }
    ]
});

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};

return requestOptions

}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl:'',
      box: {},
    }
 }

calculateFaceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

displayFaceBox = (box) => {
  console.log(box);
  this.setState({box: box});
}

onInputChange = (event) => {
  this.setState({input:event.target.value});
}

onButtonSubmit = () => {
  this.setImage({imageUrl: this.state.input})
  fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(this.state.input))
  .then(response => response.json())
  .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
  .catch(err => console.log(err));
    
}

render() {
  return (
    <div className="App">
      <ParticlesBg type="cobweb" bg={true} className='particles' />
      <Navigation />
      <Logo />
      <ImageLinkForm 
      onInputChange={this.onInputChange}
      onButtonSubmit={this.onButtonSubmit}
      />
      <Rank />
      <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
    </div>
    );
  
  }

}

export default App;

