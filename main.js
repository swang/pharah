'use strict';

import { h, render, Component } from 'preact'
import FetchBase64 from 'fetch-base64-in-browser'

let cache = {}
let imgCache = {}
// let githubUrl = 'https://swang.github.io/pharah/'
let githubUrl = 'http://localhost:8080/'
let url = 'Pharah_-_Impressed.mp3';

const ll = () => {

  let f = new FetchBase64()
  // let url = 'Pharah_-_Justice_rains_from_above!.ogg';
  if (cache[url]) {
    // alert('already fetched and cached audio ' + url)
    // document.getElementById('source').src = cache[url];
    // document.getElementById('yoaudio').load();
  } else {
    f.fetch(githubUrl + url, {mode:'no-cors'}).then((base64) => {
      // document.getElementById('source').src = base64;
      cache[url] = base64;
      // document.getElementById('yoaudio').load();
      // alert('fetched and cached audio ' + url)
    }).catch((err) => {
      document.getElementById('debug').innerText = JSON.stringify(err);
      console.error(err);
    })
  }

  if (imgCache['pharah_icon.jpg']) {
    document.getElementById('pharah_icon').src = imgCache['pharah_icon.jpg']
  } else {
    f.fetchAsData(githubUrl + 'pharah_icon.jpg').then((dataUri) => {
      document.getElementById('pharah_icon').src = dataUri
      imgCache['pharah_icon.jpg'] = dataUri
    }).catch((err) => {
      console.log('Unable to load Pharah Icon', err)
    })
  }
}
ll()

class PharahApp extends Component {
  constructor(props) {
    super(props)
    // set initial time:
    this.props = {
      githubUrl: githubUrl,
      url: url
    }
  }
  render(props, state) {
    return (<div id="foo">
      <button id="pharah"><img id="pharah_icon" src='' /></button>

      <div id="debug"></div>
    </div>)
  }
}

render(<PharahApp githubUrl={githubUrl} url={url} />, document.body)

document.getElementById('pharah').addEventListener('click', () => {

  function base64ToArrayBuffer(base64) {
    var binaryString =  window.atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  var base64 = cache[url];
  var audioContext = new (window.AudioContext || window.webkitAudioContext)();
  var source = audioContext.createBufferSource();
  audioContext.decodeAudioData(base64ToArrayBuffer(base64), function(buffer) {
     source.buffer = buffer;
     source.connect(audioContext.destination);
     source.start(0);
  });


  // // document.getElementById('debug').innerText = 'clickign';
  // document.getElementById('yoaudio').src = cache[url];
  // document.getElementById('yoaudio').load()
  // document.getElementById('yoaudio').play().then(() => {
  //   document.getElementById('debug').innerText = 'yoaudio_play';
  // }).catch((err) => {
  //   document.getElementById('debug').innerText = JSON.stringify(err);
  // })
})



// document.getElementById('alt').addEventListener('click', () => {
//   document.getElementById('yoaudio').src = cache[url];
//   document.getElementById('yoaudio2').load()
//   document.getElementById('yoaudio2').play().then(() => {
//     document.getElementById('debug').innerText = 'yoaudio2play';
//   }).catch((err) => {
//     document.getElementById('debug').innerText = JSON.stringify(err);
//   })
// })

