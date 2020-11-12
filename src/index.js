import express from 'express';
import { ExpressPeerServer } from 'peer'
const customGenerationFunction = () => (Math.random().toString(36) + '0000000000000000000').substr(2, 16);

const server_port = process.env.YOUR_PORT || process.env.PORT || 80;
//const server_host = process.env.YOUR_HOST || '0.0.0.0';
const server_host = 'rocky-river-23153.herokuapp.com'

const app = express();

//app.use(express.static(__dirname + 'public'));
//app.use(express.static(__dirname + 'lib'));

app.get('/', (req, res, next) => res.send('Hello world!'));

app.get('/users/:userId', function(req, res, next){
  console.log(req.params)
  const userId = req.params.userId;


  res.send(`<!DOCTYPE html>
  <html>
    <head>
      <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script>
      <title>Hello ${userId}</title>
    </head>
    <body>
      <div>
        <h1>Hello ${userId}</h1>
        <div>позвонить: <input type="text" id="another-peer-id"/> <span onclick="callButton()">call</span> </div>
        <video id="local" autoplay></video>
        <video id="remote" autoplay></video>
      </div>
      <script>

        var peer = new Peer("${userId}", {
          host: "${server_host}",
          port: ${server_port},
          path: '/peer-server',
        }); 

        peer.on('open', function(id) {
          console.log('My peer ID is: ' + id);
        });

        peer.on('connection', function(conn) {
          console.log('Conn: ', conn)
        });

        const startCall = async (peerId) => {

          console.log('dsfdsf')
          const localStream = await navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

          var call = peer.call(peerId, localStream);

          document.querySelector('video#local').srcObject = localStream

          call.answer(localStream); // Answer the call with an A/V stream.

          call.on('stream', function(remoteStream) {
            // Show stream in some video/canvas element.
            document.querySelector('video#remote').srcObject = remoteStream
          });
        }

        async function callButton(){
          
          const peerId = document.getElementById("another-peer-id").value
          console.log('call to ' + peerId)
          //startCall(peerId)
          
          try{

            const localStream = await navigator.mediaDevices.getUserMedia({
              video: true
            })
            console.log(111111, localStream)
            document.querySelector('video#local').srcObject = localStream
            
            // звоним 
            const call = peer.call(peerId, localStream);
            call.on('stream', (remoteStream) => {
              console.log(222222)
              // Show stream in some <video> element.
              document.querySelector('video#remote').srcObject = remoteStream
            });

          } catch(e){
            console.log(e)
          }       
        }
  
  
        peer.on('call', call => {
  
          console.log('вам звонок....')
  
          const startChat = async () => {
            const localStream = await navigator.mediaDevices.getUserMedia({
              video: true, 
              audio: true,
            })
            document.querySelector('video#local').srcObject = localStream
            call.answer(localStream)
            call.on('stream', remoteStream => {
              document.querySelector('video#remote').srcObject = remoteStream
            })
          }
          startChat()
        })
        
      </script>
  
      <!--
  <script src="./bundle.js"></script>
      -->
    </body>
  </html>`);
});

// =======

const server = app.listen(server_port, server_host, function() {
    console.log(`Listening on port: ${server_port}, host: ${server_host}`);
});



const peerServer = ExpressPeerServer(server, {
  path: '/',
  generateClientId: customGenerationFunction
});

app.use('/peer-server', peerServer);