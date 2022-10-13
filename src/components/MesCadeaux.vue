<template>
<div class="mes-cadeaux">
    <h3>Mes cadeaux</h3>
    <div class="lstCadeaux">
        <div class="item-cadeau" :class="{'select' : cadeau.isSelect}" v-for="(cadeau, index) in lstCadeaux" :key="index">
            <h5>{{cadeau.nom}}</h5>
            <h6>{{cadeau.groupe}}</h6>
        </div> 
    </div> 
</div>
</template>
<script>
import {db} from '@/main'
export default {
    data(){
        return{
            lstCadeaux:[],
            user:{}
        }
    },
    methods:{
        getCadeaux(){
                db.collection('users').doc(this.user.id).collection('mes-cadeaux').get().then(response =>{
                response.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    this.lstCadeaux.push(data);
                });
            });
        }
    },
    mounted(){
        this.user = JSON.parse(sessionStorage.getItem('user'));
        this.getCadeaux();
    }
}
</script>
<style scoped>
.mes-cadeaux{
    padding: 50px 200px;
    font-family: 'Ubuntu', sans-serif;
    background: #fdfdfd;
    text-align: left;
}
@media screen and (max-width: 769px){
    .mes-cadeaux{
        padding: 20px;
    }
}
.mes-cadeaux h5 h6{
    font-family: 'Ubuntu', sans-serif;  
}
.mes-cadeaux h6{
    color:hsl(211, 28%, 37%); 
}
.mes-cadeaux .lstCadeaux .item-cadeau{
    padding: 20px;
    border:1px solid hsl(210, 29%, 24%);
    margin-bottom: 10px;
    border-radius: 5px;
}
.mes-cadeaux .lstCadeaux .item-cadeau.select{
    background: #47dea4;
}
</style>
