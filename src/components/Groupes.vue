<template>
    <div class="groupes-page">
        <h3>Tous les groupes</h3>
        <div class="all-groupe">
            <div class="item-groupe" v-for="groupe in lstGroupes" :key="groupe.id" @click="goToDetails(groupe)">
                {{groupe.nom}}
            </div>
        </div>
    </div>    
</template>
<script>
import {db} from '@/main';
export default {
    data(){
        return{
            lstGroupes:[]
        }
    },
    methods:{
        getAllGroups(){
            db.collection('groupe').get().then(res => {
                res.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    this.lstGroupes.push(data);
                });

                sessionStorage.setItem('lstAllGroupes', JSON.stringify(this.lstGroupes));
            }).catch(error => console.error("Error get users: ", error));
        },
        goToDetails(groupe){
            this.$router.push({name: 'groupeDetail', params:{'groupe' : groupe}});
        }
    },
    mounted(){
        const groupes = JSON.parse(sessionStorage.getItem('lstAllGroupes'));
        if(groupes){
            this.lstGroupes = groupes;
        }else{
            this.getAllGroups();
        }
    }
}
</script>
<style>
    .groupes-page{
        padding: 50px 200px;
        font-family: 'Ubuntu', sans-serif;
        background: #fdfdfd;
    }
    .groupes-page h3{
        text-align: left;
    }
    .all-groupe{
        margin-top: 20px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;
    }

    .item-groupe{
        border: 2px solid hsl(210, 29%, 24%);
        background: #FAF750;
        min-height: 200px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        font-weight: 700;
        cursor: pointer;
        border-radius: 5px;
        margin-bottom: 20px;
        position: relative;
    }
    .item-groupe:hover{
        background: #c8c640;
    }

    @media screen and (max-width: 769px){
    .all-groupe{
        grid-template-columns: 1fr;
    }
}
</style>
