<template>
    <div class="details-groupe-page">
        <btn-back/>
        <div class="actions-page"> 
            <div class="actions">
                <div><button class="btn" data-toggle="modal" data-target="#modalAddUser"><i class="fas fa-user-plus"></i> Ajouter usager</button></div>
                <div><button class="btn"><i class="fas fa-pen"></i> Modifier</button></div>
                <div><button class="btn"><i class="fas fa-trash"></i> Supprimer</button></div>
            </div>
        </div>
        <h3>{{groupe.nom}}</h3>
        <h6>Type: {{type}}</h6>
        <div>
            <h6>Url d'invitation: </h6>
            <copy-text-input :text="'http://localhost:8080/#/create-user?groupe=' + groupe.id"/>
        </div>
        <div class="lstUsers">
            <h6>Usagers: </h6>
            <div class="item-user" v-for="(user, index) in users" :key="user.id">
                <div>{{user.prenom}} {{user.nom}}</div>
                <div class="actions"><span @click="deleteUser(user, index)"><i class="fas fa-trash"></i></span></div>
            </div>
        </div>
        <div class="modal" id="modalAddUser">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Ajouter usager</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="nom">Nom:</label>
                            <input type="text" class="form-control" id="nom" v-model="modelUser.nom">
                        </div>
                        <div class="form-group">
                            <label for="url">Prenom:</label>
                            <input type="text" class="form-control" id="url" v-model="modelUser.prenom">
                        </div>
                        <div class="form-group">
                            <label for="url">Email:</label>
                            <input type="text" class="form-control" id="url" v-model="modelUser.email">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" @click="saveUser()">Sauvegarder</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {db} from '@/main';
import BtnBack from './BtnBack.vue'
import CopyTextInput from './CopyTextInput.vue';
import firebase from 'firebase';
export default {
    components: { BtnBack, CopyTextInput },
    props:['groupe'],
    data(){
        return{
            users:[],
            modelUser:{
                nom:undefined,
                prenom:undefined,
                email:undefined
            }
        }
    },
    computed:{
        type(){
            if(this.groupe.isOnlySelect){
                return 'Sélection seulement';
            }

            if(this.groupe.isRandomGroupe){
                return 'Tirage au sort';
            }

            return 'Liste de cadeaux';
        }
    },
    methods:{
        getUsersGroupe(){
            db.collection('groupe').doc(this.groupe.id).collection('users').get().then(response =>{
                response.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    this.users.push(data);
                });
            });
        },
        deleteUser(user, index){
            try{
                db.collection('groupe').doc(this.groupe.id)
                .collection('users').doc(user.id).delete().then((response) =>{
                    this.users.splice(index, 1);
                });
            }catch(e){
                console.log('error delete mes cadeaux: ' + e);
            }
        },
        saveUser(){
            let user = {
                nom:this.modelUser.nom,
                prenom:this.modelUser.prenom,
                email:this.modelUser.email.toLowerCase()
            };
            try{
                firebase.auth().createUserWithEmailAndPassword(user.email, 'Bonjour123!').then(() =>{
                    db.collection('users').add(user).then((res) => {
                        user.id = res.id;
                        db.collection('users').doc(res.id).collection('groupes').add({
                            nom:this.groupe.nom,
                            idGroupe:this.groupe.id,
                            isOnlySelect:this.groupe.isOnlySelect,
                            isRandomGroupe:this.groupe.isRandomGroupe,
                        }).then(()=>{
                            db.collection('groupe').doc(this.groupe.id).collection('users').add({
                                nom:this.modelUser.nom,
                                prenom:this.modelUser.prenom,
                                email:this.modelUser.email.toLowerCase(),
                                isAdmin:false
                            }).then(() =>{
                                this.users.push(user);
                                $("#modalAddUser").modal("hide");
                            })              
                        })
                    }).catch((error) =>{
                        console.log('erreur add user:' + error)
                    });
                });
            }catch(e){
                console.log(e);
            }
        },
    },
    mounted(){
        this.getUsersGroupe();
    }
}
</script>
<style>
.details-groupe-page{
    padding: 50px 200px;
    font-family: 'Yatra One', cursive;
    background: #fdfdfd;
}
.details-groupe-page h3, h6{
    text-align: left;
}
.details-groupe-page h6{
    font-family: 'Ubuntu', sans-serif;
}
.details-groupe-page .actions-page{
    display: flex;
    justify-content: flex-end;
}
.details-groupe-page .actions-page .actions{
    display: flex;
}
.details-groupe-page .actions-page .actions >div{
    margin-left: 10px;
}
.details-groupe-page .actions-page .actions >div .btn{
    font-family: 'Ubuntu', sans-serif;
    float: right;
    padding: 10px;
    cursor: pointer;
    background: transparent;
    border:none;
    border-radius: 5px;
    color: hsl(210, 29%, 24%);
    font-weight: 500;
    border:1px solid hsl(210, 29%, 24%);
}

.details-groupe-page .actions-page .actions >div .btn:hover{
    background: hsl(210, 29%, 24%);
    color: #fdfdfd;
}
.details-groupe-page .lstUsers{
    margin-top: 20px;
}
.details-groupe-page .lstUsers .item-user{
    text-align: left;
    border-bottom:1px solid #b5b5b5;
    padding: 20px 0;
    font-size: 0.9em;
    font-family: 'Ubuntu', sans-serif;
    display: grid;
    grid-template-columns: 1fr 1fr;
}
.details-groupe-page .lstUsers .item-user .actions{
    display: flex;
    justify-content: flex-end;
}
.details-groupe-page .lstUsers .item-user .actions span{
    cursor: pointer;
}

#modalAddUser .modal-body{
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
}

#modalAddUser .modal-body img{
    height: 70px;
    width: 70px;
    margin: 10px 0px;
}

#modalAddUser .modal-body{
    display: block;
    height: auto;
}

#modalAddUser .modal-body .form-group{
    text-align: left;
}

</style>