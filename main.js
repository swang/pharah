'use strict';

import { h, render, Component } from 'preact'
import FetchBase64 from 'fetch-base64-in-browser'

let cache = {}
let imgCache = {}
let g = window.location.href
let githubUrl = g.endsWith('/index.html') ? g.slice(0, -10) : g

let mp3s = [
  'Pharah_-_Defend_The_Point,_Strike_As_One.mp3',
  'Pharah_-_I\'m_Impressed.mp3',
  'Pharah_-_I\'m_Taking_The_Objective,_Converge_On_Me.mp3',
  'Pharah_-_I_Always_Get_My_Prey.mp3',
  'Pharah_-_Impressed.mp3',
  'Pharah_-_Let\'s_Keep_The_Payload_Moving.mp3',
  'Pharah_-_My_Ultimate_Is_Ready.mp3',
  'Pharah_-_Remember_Your_Training,_And_We\'ll_Get_Through_This_Just_Fine.mp3',
  'Pharah_-_Tango,_Down.mp3'
]
let url = 'Pharah_-_Impressed.mp3'
let de = document.getElementById.bind(document)
let f = new FetchBase64()

const cacheAudio = (url) => {
  return new Promise((resolve, reject) => {
    if (cache[url]) {
      resolve(cache[url])
    } else {
      f.fetch(githubUrl + 'mp3/' + url, {mode:'no-cors'}).then((base64) => {
        cache[url] = base64;
        resolve(base64)
      }).catch((err) => {
        de('debug').innerText = JSON.stringify(err);
        console.error(err);
        reject(err)
      })
    }
  })
}


const cacheMedia = (url) => {

  // let icon = 'pharah_front_icon.jpg'
  let icon = './favicon.ico'
  if (imgCache[icon]) {
    de('pharah_icon').src = imgCache[icon]
  } else {
    f.fetchAsData(githubUrl + icon).then((dataUri) => {
      de('pharah_icon').src = dataUri
      imgCache[icon] = dataUri
    }).catch((err) => {
      console.log('Unable to load Pharah Icon', err)
    })
  }
}

cacheMedia(url)

class PharahApp extends Component {
  constructor(props) {
    super(props)
    this.props = {
      githubUrl: githubUrl,
      url: url
    }
  }
  render(props, state) {
    return (<div id="foo">
      <button id="pharah"><img id="pharah_icon" /></button>
      <div id="debug"></div>
    </div>)
  }
}

render(<PharahApp githubUrl={githubUrl} url={url} />, document.body)

de('pharah').addEventListener('click', () => {

  function base64ToArrayBuffer(base64) {
    var binaryString =  window.atob(base64)
    var len = binaryString.length
    var bytes = new Uint8Array(len)
    // bytes = bytes.map((b) => binaryString.charCodeAt(b))
    // return bytes.buffer
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // var base64 = cache[url];
  let url = mp3s[~~(Math.random() * mp3s.length)]
  cacheAudio(url).then((base64) => {
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var source = audioContext.createBufferSource();
    audioContext.decodeAudioData(base64ToArrayBuffer(base64), function(buffer) {
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
      source.onended = function() {
        audioContext.close()
      }
    });
  })
})
