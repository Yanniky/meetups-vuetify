import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'
Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{
        loadedMeetups:[
            { imageUrl:  'https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg', id: 'Yann Mountou', title: ' New Zealand', date: new Date(),location: 'Mouindi',description:'Mouindi la bele' },   
             { imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Paris_-_Blick_vom_gro%C3%9Fen_Triumphbogen.jpg', title: ' New Congo',  date: new Date(),location: 'Point-Noir',description:'Ponton la bele'} ,    
              { imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Paris_-_Blick_vom_gro%C3%9Fen_Triumphbogen.jpg', id: 'NEW DRC', title: ' New DRC',  date: new Date(),location: 'Loumbumbachi',description:'Loumbumbachi la bele'}                 
        ],
        user: null,
        loading: false,
        error: null
    },
    mutations: {
        setLoadedMeetups (state, payload) {
          state.loadedMeetups = payload
        },
        createMeetup (state, payload) {
          state.loadedMeetups.push(payload)
        },
        updateMeetup (state, payload) {
          const meetup = state.loadedMeetups.find(meetup => {
            return meetup.id === payload.id
          })
          if (payload.title) {
            meetup.title = payload.title
          }
          if (payload.description) {
            meetup.description = payload.description
          }
          if (payload.date) {
            meetup.date = payload.date
          }
        },
        setUser (state, payload) {
          state.user = payload
        },
        setLoading (state, payload) {
          state.loading = payload
        },
        setError (state, payload) {
          state.error = payload
        },
        clearError (state) {
          state.error = null
        }
      },
    actions:{
        loadMeetups({commit}) {
            commit('setLoading', true)
            firebase.database().ref('meetups').once('value')
            .then((data) =>{
                const meetups = []
                const obj = data.val()
                for (let key in obj){
                    meetups.push({
                        id: key,
                        title: obj [key].title,
                        description: obj [key].description,
                        imageUrl: obj [key].imageUrl,
                        date: obj [key].date,
                        location: obj[key].location,
                        creatorId: obj [key].creatorId
                    })
                }
                commit('setLoadedMeetups', meetups)
                commit('setLoading', fasle)
              
            })
            .catch(
                (error) => {
                    console.log(error)
                    commit('setLoading', fasle)
                }
            )
        },
        createMeetup ({commit, getters}, payload) {
            const meetup = {
                title: payload.title,
                location: payload.location,
                description: payload.description,
                date: payload.date.toISOString(),
               creatorId: getters.user.id
            }
            let imageUrl
            let key

            firebase.database().ref('meetups').push(meetup)
            .then((data) =>{
                key = data.key
                return key
            })
            .then(key => {
                const filename = payload.image.name
                const ext = filename.slice(filename.lastIndexOf('.'))
                return firebase.storage().ref('meetups/' + key + '.' + ext).put(payload.image)
            })
            .then(fileData => {
                fileData.ref.getDownloadURL()
                  .then(imageUrl => {
                      imageUrl = imageUrl
                      console.log('File available at', imageUrl);
                      return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
                  })
             })
            .then(() =>{
                 commit('createMeetup', {
                    ...meetup,
                    imageUrl: imageUrl,
                    id: key
                })
            })
            .catch((error) => {
                console.log(error)
            })
            //reach out to firebase and store it
           
        },
         updateMeetupData ({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
      firebase.database().ref('meetups').child(payload.id).update(updateObj)
        .then(() => {
          commit('setLoading', false)
          commit('updateMeetup', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
        signUserUp ({commit}, payload){
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(
            user => {
                commit('setLoading', false)
                const newUser = {
                    id: user.uid,
                    registeredMeetups: []
                }
                commit('setUser', newUser)
            }
        )
        .catch(error =>{ 
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)

                 }
            )
        },
        signUserIn ({commit}, payload){
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then(
                user =>{
                    commit('setLoading', false)
                    const newUser = {
                        id: user.uid,
                        registeredMeetups: []
                    }
                    commit('setUser', newUser)
                }
            )
            .catch(
                error =>{
                    commit('setLoading', false)
                    commit('setError', error)
                    console.log(error)
                }
            )
        } ,
        autoSignIn({commit}, payload){
            commit('setUser', {id: payload.uid, registeredMeetups: []})
        },
        logout({commit}) {
            firebase.auth().signOut()
            commit ('setUser', null)
        },
        clearError ({commit}) {
        commit('clearError') 
        }
    },
    getters: {
        loadedMeetups(state){
            return state.loadedMeetups.sort((meetupA, meetupB) => {
                return meetupA.date > meetupB.date
            })
        },
        featuredMeetups( state, getters){
            return getters.loadedMeetups.slice(0, 5)

        },
        loadedMeetup(state){
            return (meetupId) => {
                return state.loadedMeetups.find((meetup) => {
                    return meetup.id === meetupId
                })
            }
        },
        user(state) {
            return state.user
        },
        loading (state) {
            return state.loading
          },
          error (state) {
            return state.error
          }
    }
})