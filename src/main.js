import Vue from 'vue'
import vuetify from 'vuetify'
import App from './App'
import  * as firebase  from 'firebase/App'
import router from './router'
import {store} from './store'
import DateFilter from './filters/date'
import Alert from './components/Shared/Alert.vue'
import EditMeetupDetailsDialog from  './components/Meetup/Edit/EditMeetupDetailsDialog.vue'
import EditMeetupDateDialog from  './components/Meetup/Edit/EditMeetupDateDialog.vue'
import EditMeetupTimeDialog from  './components/Meetup/Edit/EditMeetupTimeDialog.vue'

// src/main.js
require('vuetify/src/stylus/app.styl')

// index.js or main.js
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
Vue.use(vuetify)
Vue.config.productionTip = false,
Vue.filter('date', DateFilter)
Vue.component('app-alert', Alert)
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog) 
Vue.component('app-edit-meetup-time-dialog', EditMeetupTimeDialog)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
firebase.initializeApp({
  apiKey: 'AIzaSyAJ2_QKJ3tLfmBJCkZeReciXiieV0wwcSs',
  authDomain: 'web-devmeetup.firebaseapp.com',
  databaseURL: 'https://web-devmeetup.firebaseio.com',
  projectId: 'web-devmeetup',
  storageBucket: 'gs://web-devmeetup.appspot.com', 
  messagingSenderId: '401779011144'
})
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    this.$store.dispatch('autoSignIn', user)
  }
})
this.$store.dispatch('loadedMeetups' )
  }

})
