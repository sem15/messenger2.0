<template>
  <div>
    <div v-for="user in users" :key="user">
      <button v-if="user.peerID != myID" @click="initConnection(user.peerID)">{{ user.name }}</button>
    </div>
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
      users: {},
      conn: null,
    }
  },
  created() {
    SocketioService.setupSocketConnection();
    SocketioService.socket.on('return-sessionid', (data) => {
      this.sessionID = data
      console.log(data)
    });
    SocketioService.socket.on('update-users', (data) => {
      this.users = new Object()
      this.users = data
      console.log(this.users)
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
          name: `guest${Math.floor(Math.random() * 100) + 1}`
        });
      });

      this.peer.on('connection', (conn) => {
        this.conn = conn
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
    initConnection(target) {
      var conn = this.peer.connect(target)
      this.conn = conn

      conn.on('open', () => {
      // Receive messages
      conn.on('data', (data) => {
        console.log("Recieved: ", data)
      });

      // Send messages
      conn.send('Hello!');
      });
      
    },
  }
}
</script>

<style>

</style>
