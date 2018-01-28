'use strict';

import { h, render, Component } from 'preact'
import FetchBase64 from 'fetch-base64-in-browser'

let cache = {}
let githubUrl = 'https://swang.github.io/pharah/'
let url = 'Pharah_-_Impressed.mp3';

const ll = () => {
  let f = new FetchBase64()
  // let url = 'Pharah_-_Justice_rains_from_above!.ogg';
  if (cache[url]) {
    alert('already fetched and cached audio', url)
    document.getElementById('source').src = cache[url];
    document.getElementById('yoaudio').load();
  } else {
    f.fetchAsData(githubUrl + url, {mode:'no-cors'}).then((base64) => {
      document.getElementById('source').src = base64;
      cache[url] = base64;
      document.getElementById('yoaudio').load();
      alert('fetched and cached audio', url)
    }).catch((err) => {
      document.getElementById('debug').innerText = JSON.stringify(err);
      console.error(err);
    })

  }
}
ll()
// let f = new FetchBase64()
// f.fetchAsData(githubUrl + url, {mode:'no-cors'}).then((base64) => {
//   document.getElementById('source').src = base64;
//   cache[url] = base64;
//   document.getElementById('yoaudio').load();
// }).catch((err) => {
//   document.getElementById('debug').innerText = JSON.stringify(err);
//   console.error(err);
// })

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
      <span>Hello, world!</span>
      <button id="mainclick">Click Me</button>
      <button id="alt">alt play</button>
      <br />
      <audio id="yoaudio" controls>
        <source id="source" src="" type="audio/mpeg"></source>
      </audio><br />
      <audio id="yoaudio2" controls>
        <source id="source" src={props.githubUrl + props.url} type="audio/mpeg"></source>
      </audio><br />
      <div id="debug">
      </div>
    </div>)
  }
}

render(<PharahApp githubUrl={githubUrl} url={url} />, document.body)

document.getElementById('mainclick').addEventListener('click', () => {
  // document.getElementById('debug').innerText = 'clickign';
  document.getElementById('yoaudio').play().then(() => {
    document.getElementById('debug').innerText = 'yoaudio_play';
  }).catch((err) => {
    document.getElementById('debug').innerText = JSON.stringify(err);
  })
})



document.getElementById('alt').addEventListener('click', () => {
  document.getElementById('yoaudio2').play().then(() => {
    document.getElementById('debug').innerText = 'yoaudio2play';
  }).catch((err) => {
    document.getElementById('debug').innerText = JSON.stringify(err);
  })
})

