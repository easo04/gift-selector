<template>
  <div id="app">
    <header>
        <div class="header-links">
          <div v-if="isAuth">
            <a @click="goToHome()"><img class="logo-header" src="./assets/logo.svg"></a>
          </div>
          <div v-else>
            <a href="/"><img class="logo-header" src="./assets/logo.svg"></a>
          </div>
          <span class="title">Gift Selector</span>
        </div>
        <div class="header-actions">
          <div v-if="isAuth">
            <a @click="logout()"><i class="fas fa-sign-out-alt"></i> Se déconnecter</a>
          </div>
        </div> 
    </header>
    <div class="content-app">
      <menu-left v-show="isAuth"/>
      <div class="content-router" :class="{'auth' : isAuth}">
        <router-view/>
      </div>
    </div>
    <footer>
      © Copyright <span>Gift Selector</span>
    </footer>
  </div>
</template>

<script>
import firebase from 'firebase'
import MenuLeft from './components/MenuLeft.vue'
export default {
  components: { MenuLeft },
  name: 'App',
  data(){
    return{
      isAuth:false,
    }
  },
  methods:{
    goToLogin(){
      this.$router.replace('login')
    },
    goToHome(){
      sessionStorage.removeItem('userActif');
      sessionStorage.removeItem('lstCadeaux');
      sessionStorage.removeItem('groupeSelect');
      this.$router.replace('home')
    },
    logout(){
      firebase.auth().signOut().then(response =>{
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('lstGroupes');
        sessionStorage.removeItem('userActif');
        sessionStorage.removeItem('lstCadeaux');
        sessionStorage.removeItem('groupeSelect');
        sessionStorage.removeItem('groupe');
        sessionStorage.removeItem('lstUsers');
        this.$router.replace('login');
      })
    },
    goToMesCadeau(){
        this.$router.push({name: 'mesCadeaux', params:{'user': this.user}});
    }
  },
  mounted(){
    let auth = firebase.auth().currentUser;
    this.isAuth = auth !== null;
  }
}
</script>

<style>
body{
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: hsl(210, 29%, 24%);
  position: relative;
}
h2{
  margin-top: 0;
}
.logo{
    width: 300px;
    margin-top: 20px;
}
.logo-header{
  width: 50px;
}
.item-menu{
  height: 80px;
  border-bottom: 1px solid #69C2FA;
  position: relative;
  padding: 10px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.item-menu:hover{
  background: gray;
}
.content-app{
  position: relative;
  min-height: 100vh;
  margin-top: 80px;
}

.content-router{
  padding-left: 0px;
}

.content-router.auth{
  margin-left: 100px;
}

header{
  background: #69C2FA;
  height: 80px;
  padding: 0 10px;
  position: fixed;
  top:0;
  z-index: 900;
  width: 100%;
}
header a{
  cursor: pointer;
  font-weight: 500;
  font-family: 'Ubuntu', sans-serif;
  color: hsl(210, 29%, 24%);
  text-decoration: underline  !important;
}
header a:hover{
  text-decoration: none  !important;
}
.header-links{
  float: left;
  display: flex;
  align-items: center;
  height: 100%;
  font-family: 'Yatra One', cursive;
}
.header-links .title{
  margin-left: 20px;
  font-weight: 600;
  font-size: 18px;
  font-family: 'Pacifico', cursive;
}
.header-actions{
  float: right;
  display: flex;
  align-items: center;
  height: 100%;
  
}

footer{
  background: #549bc8;
  color: hsl(210, 29%, 24%);
  padding: 10px;
  font-family: 'Ubuntu', sans-serif;
  font-weight: 500;
}

footer span{
  font-family:  'Pacifico', cursive;
  font-weight: 600;
}

</style>
