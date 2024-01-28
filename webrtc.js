// Assuming an environment where both peers are on the same page,
// and you manually trigger "Call" after "Start" has been clicked on both.

let localPeerConnection;
let remotePeerConnection;

document.getElementById('startButton').addEventListener('click', startConnection);
document.getElementById('callButton').addEventListener('click', call);
document.getElementById('hangupButton').addEventListener('click', hangUp);

function startConnection() {
    console.log('Starting connection...');
    localPeerConnection = new RTCPeerConnection();
    remotePeerConnection = new RTCPeerConnection();

    // Setup ICE handling
    localPeerConnection.onicecandidate = e => {
        if (e.candidate) {
            console.log('Sending local ICE candidate');
            // Here you would send the candidate to the remote peer over your signaling channel
            fetch('/candidate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidate: e.candidate, id: 'local' }) // Assuming 'local' and 'remote' IDs for simplicity
            });
        }
    };

    remotePeerConnection.onicecandidate = e => {
        if (e.candidate) {
            console.log('Sending remote ICE candidate');
            // Here you would send the candidate to the local peer over your signaling channel
            fetch('/candidate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ candidate: e.candidate, id: 'remote' })
            });
        }
    };

    // When the remote stream is added, show it in the UI
    remotePeerConnection.ontrack = e => {
        if (e.streams && e.streams[0]) {
            document.getElementById('remoteVideo').srcObject = e.streams[0];
        }
    };
}

function call() {
    localPeerConnection.createOffer().then(offer => {
        return localPeerConnection.setLocalDescription(offer);
    }).then(() => {
        // Send the offer to the remote peer through the signaling server
        console.log('Sending offer');
        fetch('/offer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ offer: localPeerConnection.localDescription, id: 'offerId' }) // Use a unique ID for the offer
        });
    }).catch(console.error);
}

function hangUp() {
    console.log('Ending call');
    localPeerConnection.close();
    remotePeerConnection.close();
    // Resetting peer connections to ensure a clean state
    localPeerConnection = null;
    remotePeerConnection = null;
}
