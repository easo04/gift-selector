<template>
    <div class="modal" id="modalAddGroupe">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Ajouter un groupe</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div v-if="!isCreated">
                        <div class="form-group">
                            <label for="nom">Nom:</label>
                            <input type="text" class="form-control" id="nom" v-model="groupe.nom" autocomplete="off">
                        </div>
                        <div class="form-group">
                            <label for="type">Type:</label>
                            <select class="form-control"  v-model="groupe.type">
                                <option value="random">Tirage au sort</option>
                                <option value="default">Liste de cadeaux</option>
                                <option value="onlySelect">Sélection seulement</option>
                            </select>
                        </div>
                    </div>
                    <div v-else>
                        <div class="form-group">
                            <label for="nom">Url d'invitation:</label>
                            <copy-text-input :groupe="groupe"/>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" v-if="!isCreated">
                    <button type="button" class="btn" @click="save()">Sauvegarder</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {db} from '@/main';
import CopyTextInput from '../CopyTextInput.vue';
export default {
    components: { CopyTextInput },
    data(){
        return{
            groupe:{
                nom:undefined,
                url:undefined,
                type:undefined
            },
            isCreated:false,
            urlCreated:''
        }
    },
    methods:{
        save(){
            try{
                db.collection('groupe').add({
                    nom:this.groupe.nom,
                    isRandomGroupe: this.groupe.type === 'random',
                    isOnlySelect:this.groupe.type === 'onlySelect',
                }).then((res) => {
                    this.isCreated = true;
                    this.groupe.id = res.id;
                }).catch((error) =>{
                    console.log('erreur add cadeau:' + error)
                });
            }catch(e){
                console.log(e);
            }
        },
    }
}
</script>
<style>
    .modal{
        color: hsl(210, 29%, 24%);
        font-family: 'Ubuntu', sans-serif;
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

    #modalAddGroupe .modal-body{
        display: block;
        height: auto;
    }

    #modalAddGroupe .modal-body .form-group{
        text-align: left;
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
</style>