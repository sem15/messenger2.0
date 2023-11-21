<template>
  <div>

  </div>
</template>

<script>
import SocketioService from './services/socketio.service.js';
import Peer from 'peerjs';

export default {
  name: 'App',
  components: {
    // HelloWorld
  },
  data() {
    return {
      sessionID: undefined,
      myID: null,
      peer: null,
    }
  },
  created() {
    SocketioService.setupSocketConnection();
    SocketioService.socket.on('return-sessionid', (data) => {
      this.sessionID = data
      console.log(data)
    });
  },
  beforeUnmount() {
    SocketioService.disconnect();
  },
  mounted() {
    this.login()
    SocketioService.requestSessionID()
  },
  methods: {
    login() {
      let peer = new Peer();
      this.peer = peer

      this.peer.on('open', (id) => {
        this.myID = id
        console.log("PeerJS ID:", this.myID)
        SocketioService.socket.emit("register-ID", {
          peerID: this.myID,
        });
      });

      this.peer.on('connection', (conn) => {
        this.conn = conn
        this.activeConnection = true
        conn.on('open', () => {
        // Receive messages
        conn.on('data', (data) => {
          console.log(data)
        });

        // Send messages
        conn.send('Hello!');
        });
      });

    },
  }
}
</script>

<style>

</style>
