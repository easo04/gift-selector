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
          <span class="title"><span class="gift">Gift</span> Selector</span>
        </div>
        <div class="header-actions">
          <div v-if="isAuth" class="menu-desktop">
            <a @click="logout()"><i class="fas fa-sign-out-alt"></i> Se déconnecter</a>
          </div>
          <div v-if="isAuth" class="menu-mobil">
            <div class="menu" @click="setShowItemsMenu()"><i class="fas fa-bars"></i></div>
            <div class="menu-mobil-items" :class="{'cache' : !showItemsMenu}">
              <ul>
                <li class="btn-with-border-bottom" @click="setShowItemsMenu()" v-if="isAdmin" ><a data-toggle="modal" data-target="#modalAddGroupe"><i class="fas fa-plus"></i> Nouveau groupe</a></li>
                <li @click="setShowItemsMenu()"><router-link to="/home"><i class="fas fa-gifts"></i> Mes groupes</router-link></li>
                <li @click="setShowItemsMenu()" class="btn-with-border-bottom"><router-link to="/mes-cadeaux"><i class="fas fa-gift"></i> Mes cadeaux</router-link></li>
                <li @click="setShowItemsMenu()" v-if="isAdmin"><router-link to="/all-groupes"><i class="fas fa-layer-group"></i> Groupes</router-link></li>
                <li @click="setShowItemsMenu()" v-if="isAdmin"><router-link to="/home"><i class="fas fa-users"></i> Usagers</router-link></li>
                <li @click="setShowItemsMenu()"><router-link to="/mon-profil"><i class="fas fa-user"></i> Mon profil</router-link></li>
                <li @click="setShowItemsMenu()"><a @click="logout()"><i class="fas fa-sign-out-alt"></i> Se déconnecter</a></li>
              </ul>
            </div>
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
      © Copyright 2022 <span>Gift Selector</span>
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
      showItemsMenu:false,
      isAdmin:false
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
        sessionStorage.removeItem('lstCadeaux');
        sessionStorage.removeItem('groupeSelect');
        sessionStorage.removeItem('groupe');
        sessionStorage.removeItem('lstUsers');
        this.$router.replace('login');
      })
    },
    goToMesCadeau(){
        this.$router.push({name: 'mesCadeaux', params:{'user': this.user}});
    },
    setShowItemsMenu(){
      this.showItemsMenu = !this.showItemsMenu;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  justify-content: flex-end;
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

.modal .close{
    border:1px solid #8c8989;
    background-color: #b3b3b3;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
    margin-top: 0px;
    margin-right: 0px;
}

.modal-footer .btn{
    font-family: 'Ubuntu', sans-serif;
    float: right;
    padding: 10px;
    cursor: pointer;
    background: #69C2FA;
    border:none;
    border-radius: 5px;
    color: hsl(210, 29%, 24%);
    font-weight: 500;
    border:1px solid hsl(210, 29%, 24%);
}

.modal-footer .btn:hover{
    background: hsl(210, 29%, 24%);
    color:  #fdfdfd;
}

.menu-mobil{
  position: relative;
  display: none;
}

.menu-mobil .menu{
  font-size: 1.5em;
  color: hsl(210, 29%, 24%);
}

.menu-mobil .menu-mobil-items{
  position: absolute;
  height: 100vh;
  width: 300px;
  right: -10px;
  transition: right 1s ease;
  background: hsl(210, 29%, 24%);
  color:  #fdfdfd;
}

.menu-mobil .menu-mobil-items ul{
    list-style: none;
    text-align: left;
    padding: 0;
}
.menu-mobil .menu-mobil-items li{
    padding: 20px 15px;
}
.menu-mobil .menu-mobil-items li a{
  color:  #fdfdfd;
}


.menu-mobil .menu-mobil-items.cache{
  right: -500px;
}


@media screen and (max-width: 769px){

  .content-router.auth{
    margin-left: 0px;
  }

  .menu-mobil{
    display: block;
  }
  .menu-desktop{
    display: none;
  }
}

</style>
