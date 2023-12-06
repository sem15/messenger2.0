<template>
  <div class="container">
    <div v-if="activeConnection == false" class="users-list">
      <div v-for="user in users" :key="user">
        <button v-if="user.peerID != myID" @click="initConnection(user.peerID)">{{ user.name }}</button>
      </div>
    </div>
    <div v-else class="movement-area">

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
      activeConnection: false,
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

    //set event listener for key down event
    document.addEventListener("keydown", this.onKeydown);
  },
  methods: {
    login() {
      let peer = new Peer();
      this.peer = peer

      this.peer.on('open', (id) => {
        this.myID = id
        // console.log("PeerJS ID:", this.myID)
        SocketioService.socket.emit("register-ID", {
          peerID: this.myID,
          name: `guest${Math.floor(Math.random() * 100) + 1}`
        });
      });

      this.peer.on('connection', (conn) => {

        this.conn = conn
        this.activeConnection = true
        conn.on('open', () => {
        // Receive messages
        conn.on('data', (data) => {
          console.log("Recieved:", data)
        });

        // Send messages
        conn.send('Hello!');
        });
      });

    },
    initConnection(target) {
      var conn = this.peer.connect(target)
      this.conn = conn
      this.activeConnection = true

      conn.on('open', () => {
      // Receive messages
      conn.on('data', (data) => {
        console.log("Recieved:", data)
      });

      // Send messages
      conn.send('Hello!');
      });
    },
    onKeydown(event) {
      if(this.conn == null) {
        console.log("connection not yet established")
        return true
      }
      if(event.key === "ArrowRight"){
        console.log('A key has been pressed');
        this.conn.send("right")
      }
    },
  }
}
</script>

<style>
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.users-list {
  height: 40%;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
}

.movement-area {
  height: 90%;
  width: 90%;
  border: 2px dotted black;
}
</style>
