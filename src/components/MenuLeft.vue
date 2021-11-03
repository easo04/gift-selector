<template>
    <div>
        <div class="menu-left" :class="{'close-menu' : !showMenu}" v-if="showMenu">
            <ul v-if="showMenu">
                <li class="btn-bars" @click="showLeftMenu()"><i class="fas fa-bars"></i></li>
                <li class="btn-with-border-bottom"><a><i class="fas fa-plus"></i> Nouveau groupe</a></li>
                <li><a><i class="fas fa-gifts"></i> Mes groupes</a></li>
                <li class="btn-with-border-bottom"><a><i class="fas fa-gift"></i> Mes cadeaux</a></li>
                <li><a><i class="fas fa-users"></i> Usagers</a></li>
                <li><a><i class="fas fa-user"></i> Mon profil</a></li>
            </ul>
        </div>
        <div v-else class="menu-left-closed" @click="showLeftMenu()"><i class="fas fa-bars"></i></div>
    </div>
</template>
<script>
export default {
    props:['user'],
    data(){
        return{
            showMenu:true
        }
    },
    methods:{
        showLeftMenu(){
            this.showMenu = !this.showMenu;
        }
    }
}
</script>
<style>
.menu-left{
    position: absolute;
    left: 0;
    width: 100px;
    font-size: 10px;
    top: 0;
    height: 100%;
    background-color:  hsl(210, 29%, 24%);
    z-index: 9;

        
    transition: left 1s ease;
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
    font-size: 1.3em;
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

@media screen and (max-width: 769px){
    .btn-bars{
        display: block;
    }
}
</style>