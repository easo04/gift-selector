<template>
    <div>
        <div class="menu-left" :class="{'close-menu' : !showMenu}" v-if="showMenu">
            <ul v-if="showMenu">
                <li class="btn-bars" @click="showLeftMenu()"><i class="fas fa-bars"></i></li>
                <li class="btn-with-border-bottom" v-if="isAdmin"><a data-toggle="modal" data-target="#modalAddGroupe"><i class="fas fa-plus"></i> Nouveau groupe</a></li>
                <li><router-link to="/home"><i class="fas fa-gifts"></i> Mes groupes</router-link></li>
                <li class="btn-with-border-bottom"><router-link to="/home"><i class="fas fa-gift"></i> Mes cadeaux</router-link></li>
                <li v-if="isAdmin"><router-link to="/all-groupes"><i class="fas fa-layer-group"></i> Groupes</router-link></li>
                <li v-if="isAdmin"><router-link to="/home"><i class="fas fa-users"></i> Usagers</router-link></li>
                <li><router-link to="/home"><i class="fas fa-user"></i> Mon profil</router-link></li>
            </ul>
        </div>
        <div v-else class="menu-left-closed" @click="showLeftMenu()"><i class="fas fa-bars"></i></div>
        <add-groupe-modal/>
    </div>
</template>
<script>
import AddGroupeModal from './modals/AddGroupeModal.vue';
export default {
    components: { AddGroupeModal },
    data(){
        return{
            user:{},
            showMenu:true,
        }
    },
    computed:{
        isAdmin(){
            return this.user.isAdmin || false;
        }
    },
    methods:{
        showLeftMenu(){
            this.showMenu = !this.showMenu;
        }
    },
    mounted(){
        this.user = JSON.parse(sessionStorage.getItem('user'));
    }
}
</script>
<style>
.menu-left{
    position: absolute;
    left: 0;
    width: 70px;
    font-size: 10px;
    top: 0;
    height: 100%;
    background-color:  hsl(210, 29%, 24%);
    z-index: 9;
}

.btn-bars{
    display: none;
}

.btn-with-border-bottom{
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);;
}

.menu-left-closed{
    position: absolute;
    left: 40px;
    top: 20px;
    color:hsl(210, 29%, 24%);
    cursor: pointer;
}

.menu-left.close-menu{
    left:-100px;
}

.menu-left ul{
    list-style: none;
    padding: 0;
    font-family: 'Ubuntu', sans-serif;  
    color: #fdfdfd;
    font-size: 1.1em;
}

.menu-left ul li{
    padding: 20px 5px;
    cursor: pointer;
}

.menu-left ul li:hover{
    font-weight: bold;
}
.menu-left-closed i{
    font-size: 1.5em;
}
.menu-left i{
    display: block;
    font-size: 1.5em;
}

.menu-left ul li a{
    color: #fdfdfd;
}

@media screen and (max-width: 769px){
    .menu-left{
        display: none;
    }
    .btn-bars{
        display: block;
    }
}
</style>