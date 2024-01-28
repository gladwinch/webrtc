// parseCandidate from https://github.com/fippo/sdp
function parseCandidate(line) {
    var parts;
    // Parse both variants.
    if (line.indexOf('a=candidate:') === 0) {
      parts = line.substring(12).split(' ');
    } else {
      parts = line.substring(10).split(' ');
    }
  
    var candidate = {
      foundation: parts[0],
      component: parts[1],
      protocol: parts[2].toLowerCase(),
      priority: parseInt(parts[3], 10),
      ip: parts[4],
      port: parseInt(parts[5], 10),
      // skip parts[6] == 'typ'
      type: parts[7]
    };
  
    for (var i = 8; i < parts.length; i += 2) {
      switch (parts[i]) {
        case 'raddr':
          candidate.relatedAddress = parts[i + 1];
          break;
        case 'rport':
          candidate.relatedPort = parseInt(parts[i + 1], 10);
          break;
        case 'tcptype':
          candidate.tcpType = parts[i + 1];
          break;
        default: // Unknown extensions are silently ignored.
          break;
      }
    }
    return candidate;
  };
  
  var candidates = {};
  var pc = new RTCPeerConnection({iceServers: [
      {urls: 'stun:stun1.l.google.com:19302'},
      {urls: 'stun:stun2.l.google.com:19302'}
  ]});
  pc.createDataChannel("foo");
  pc.onicecandidate = function(e) {
    if (e.candidate && e.candidate.candidate.indexOf('srflx') !== -1) {
      var cand = parseCandidate(e.candidate.candidate);
      if (!candidates[cand.relatedPort]) candidates[cand.relatedPort] = [];
      candidates[cand.relatedPort].push(cand.port);
    } else if (!e.candidate) {
      if (Object.keys(candidates).length === 1) {
        var ports = candidates[Object.keys(candidates)[0]];
        console.log(ports.length === 1 ? 'normal nat' : 'symmetric nat');
      }
    }
  };
  pc.createOffer()
  .then(offer => pc.setLocalDescription(offer))


// console.log('chat.js init');

// const BASE_URL = 'https://192.168.1.10:3000';
// let dataChannel;
// let local;
// let remote;

// const config = {
//     "iceServers": [{ "urls": "stun:stun.f.haeder.net:3478" }]
// };

// // Setup data channel event listeners
// function setupDataChannelEvents() {
//     dataChannel.onopen = () => console.log("Data channel is open");
//     dataChannel.onclose = () => console.log("Data channel is closed");
//     dataChannel.onmessage = event => document.getElementById('messages').value += `\n${event.data}`;
// }

// async function createOffer() {
//     const remoteId = document.getElementById('remoteId').value;
//     local = new RTCPeerConnection()

//     local.onicecandidate = async e => {
//         console.log('new offer: ')
//         await axios.post(`${BASE_URL}/offer`, {
//             offer: local.localDescription,
//             to: remoteId
//         })
//     }

//     dataChannel = local.createDataChannel('channel')
//     setupDataChannelEvents()
//     local.createOffer().then(o => local.setLocalDescription(o))
//     console.log('Offer set')
// }

// async function createAnswer() {
//     const localId = document.getElementById('localId').value
//     const response = await axios(`${BASE_URL}/signal/${localId}`)

//     const { offer } = response.data;

//     if (!offer) {
//         console.log("No offer found!");
//         return;
//     }

//     remote = new RTCPeerConnection()

//     remote.onicecandidate = e => {
//         console.log('new offer: ')
//     }

//     remote.ondatachannel = ({ channel }) => {
//         dataChannel = channel
//         setupDataChannelEvents()
//         remote.channel = dataChannel
//     }

//     await remote.setRemoteDescription(offer)
    
//     const o = await remote.createAnswer()
//     await remote.setLocalDescription(o)

//     await axios.post(`${BASE_URL}/answer`, {
//         answer: o,
//         to: localId
//     })

//     console.log('Answer set')
// }

// async function startChat() {
//     const remoteId = document.getElementById('remoteId').value;
//     const response = await axios(`${BASE_URL}/signal/${remoteId}`)
//     const { answer } = response.data;

//     if (!answer) {
//         console.log("No answer found!");
//         return;
//     }

//     console.log('a:::', answer)

//     await local.setRemoteDescription(answer)
//     console.log("Connection active!")
// }

// // Event listeners for buttons
// document.getElementById('createOffer').addEventListener('click', createOffer);
// document.getElementById('createAnswer').addEventListener('click', createAnswer);
// document.getElementById('startChat').addEventListener('click', startChat);

// document.getElementById('sendMessage').addEventListener('click', () => {
//     const message = document.getElementById('newMessage').value;
//     console.log('dataChannel.readyState: ', dataChannel.readyState)
//     if (dataChannel && dataChannel.readyState === 'open') {
//         dataChannel.send(message);
//         document.getElementById('messages').value += `\nYou: ${message}`;
//         document.getElementById('newMessage').value = '';
//     } else {
//         console.log('Data channel is not open. Cannot send message.');
//     }
// });
