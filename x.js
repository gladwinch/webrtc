const local = new RTCPeerConnection()
local.onicecandidate = e => console.log(JSON.stringify(local.localDescription))
const lchannel = local.createDataChannel('channel')
lchannel.onopen = () => console.log("open")
lchannel.onclose = () => console.log("close")
lchannel.onmessage = ({ data }) => console.log(data)
local.createOffer().then(o => local.setLocalDescription(o))


const remote = new RTCPeerConnection()
remote.onicecandidate = e => console.log(JSON.stringify(remote.localDescription))
remote.ondatachannel = ({channel}) => {
    const receive = channel
    receive.onopen = () => console.log("open")
    receive.onclose = () => console.log("close")
    receive.onmessage = ({ data }) => console.log(data)
    remote.channel = receive
}
remote.setRemoteDescription()
remote.createAnswer().then(a => console.log(remote.setLocalDescription(a)))

local.setRemoteDescription()