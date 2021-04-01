<template>
<div class="mes-cadeaux">
    <h2>Mes cadeaux</h2>
    <h5>Choisir le groupe</h5>
    <div class="lstGroupes">
        <div class="item-groupe" v-for="(groupe, index) in lstGroupes" :key="index">
            {{groupe.nom}}
        </div> 
    </div> 
</div>
</template>
<script>
import {db} from '@/main'
export default {
    props:['user'],
    data(){
        return{
            lstGroupes:[]
        }
    },
    methods:{
        getGroupes(){
            db.collection('groupe').get().then((response) =>{
                const groupes = [];
                response.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    groupes.push(data);
                });

                this.lstGroupes = groupes;
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }
    },
    created(){
        this.getGroupes();
    }
}
</script>
<style scoped>
</style>
