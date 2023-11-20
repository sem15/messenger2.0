import { createStore } from 'vuex'

const store = createStore({
  state: {
    sessionID: null,
    currentTextChannel: 'General',
    currentMessagesList: [
      {
        author: "Test User",
        text: "This is a test message!",
      },
      {
        author: "Test User2",
        text:
        "Melville began writing Moby-Dick in February 1850 and finished 18 months later, a year after he had anticipated. Melville drew on his experience as a common sailor from 1841 to 1844, including on whalers, and on wide reading in whaling literature. The white whale is modeled on a notoriously hard-to-catch albino whale Mocha Dick, and the book's ending is based on the sinking of the whaleship Essex in 1820. The detailed and realistic descriptions of whale hunting and of extracting whale oil, as well as life aboard ship among a culturally diverse crew, are mixed with exploration of class and social status, good and evil, and the existence of God. The book's literary influences include Shakespeare, Carlyle and the Bible. In addition",
      }
    ]
  },
  mutations: {
    changeTextChannel(state, payload) {
        state.currentTextChannel = payload
    },
    // setSessionID(state, payload) {
    //   state.sessionID = payload
    //   console.log("sessionID:", state.sessionID);
    // },
  },
  getters: {
    getCurrentTextChannel(state) {
        return state.currentTextChannel
    },
    getCurrentMessagesList(state) {
      // console.log("vuex was called and saw:", state.currentMessagesList)
      return state.currentMessagesList
    }
  }
});

export default store;