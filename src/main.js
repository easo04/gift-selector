// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import firebase from 'firebase/app';
import 'firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyBMZTkV6QVeUhchpCkjDFFNRyP3aCeksWk",
  authDomain: "regalos-selector.firebaseapp.com",
  databaseURL: "https://regalos-selector.firebaseio.com",
  projectId: "regalos-selector",
  storageBucket: "regalos-selector.appspot.com",
  messagingSenderId: "561276584859",
  appId: "1:561276584859:web:f60df6f995323f50dcd73e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();

firebase.auth().onAuthStateChanged((user) =>{

/* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
  })

})

