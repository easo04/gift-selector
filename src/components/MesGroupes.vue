<template>
    <div class="mes-groupes">
        <div class="item-groupe" v-for="(groupe, index) in groupes" :key="index" @click="goToDetails(groupe)">
            <div>
                <div class="logo-type-groupe">
                    <img v-if="groupe.isOnlySelect" class="logo-header" src="../assets/groupe-type-select.svg">
                    <img v-else class="logo-header" src="../assets/groupe-type-default.svg">
                </div>
                <div class="details-groupe">
                    <span>{{groupe.nom}}</span><br>
                    <span class="argent"><span v-if="groupe.maximum">Max {{groupe.maximum}}$</span>
                    <span v-if="groupe.minimum"> Min {{groupe.minimum}}$</span></span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:['groupes', 'user'],
    methods:{
        goToDetails(groupe){
            if(groupe.isOnlySelect){
                this.$router.push({name: 'detailsGroupeOnly', params:{'groupe' : groupe, 'user': this.user.email}});
            }else{
                this.$router.push({name: 'detailsGroupe', params:{'groupe' : groupe, 'user': this.user.email}});
            }
        }
    }
}
</script>
<style>
.mes-groupes{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    /*flex-wrap: wrap;
    widows: 100%;*/
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
.argent{
    font-size: 14px;
    color: seagreen;
}
.logo-type-groupe{
    position: absolute;
    left: 10px;
    top:10px;
}
@media screen and (max-width: 769px){
    .mes-groupes{
        grid-template-columns: 1fr;
    }
}
</style>