<template>
<div class="details-groupe">
    <h2>{{groupe.nom}}</h2>
    <h5><span class="argent"><span v-if="groupe.maximum">Max {{groupe.maximum}}$</span> 
                    <span v-if="groupe.minimum">Min {{groupe.minimum}}$</span></span></h5>
    
    <div>
        <div class="spinner-border" v-if="isLoading"></div>

        <div class="content-groupe" v-else>
            <div class="actions-groupe">
                <div class="action" @click="showContentAction('cadeaux')" :class="{'action-selected' : actionSelect === 'cadeaux'}">
                    Cadeaux
                </div> 
                <div class="action" @click="showContentAction('mes-cadeaux')" :class="{'action-selected' : actionSelect === 'mes-cadeaux'}">
                    Mes cadeaux
                </div> 
                <div class="action" @click="showContentAction('a-donner')" :class="{'action-selected' : actionSelect === 'a-donner'}">
                    À donner
                </div> 
            </div>
            <div v-if="showCadeauxGroupe" class="action-content content-cadeaux">
                <div class="lstUsers">
                    <h5>Liste usagers</h5>       
                    <div class="itemsCadeaux">
                        <div class="item-user" v-for="(user, index) in lstUsers" :key="index" @click="selectUser(user)" :class="{'user-select' : user.email === userSelect.email}">
                            {{user.prenom}} {{user.nom}}
                        </div> 
                    </div>
                </div>
                <div class="lstCadeaux">
                    <h5>Liste cadeaux</h5>
                    <div class="itemsCadeaux">
                        <div class="item-cadeaux" v-for="(c, index) in lstCadeaux" :key="index" :class="{'cadeau-select' : c.isSelect}">
                            <div class="nom-cadeau" v-if="c.isSelect">
                                <a :href="c.url" target="_blank" v-if="c.url">{{c.nom}}</a>
                                <span v-else>{{c.nom}}</span>
                            </div>
                            <div class="nom-cadeau to-select" @click="choisir(c)" v-else>
                                <span >{{c.nom}}</span>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
            <div class="action-content" v-if="showMesCadeaux">
                <div class="btns">
                    <button class="btn btn-primary btn-action" data-toggle="modal" data-target="#modalAddCadeau">+</button>
                </div>
                <div v-for="(cadeau, index) in lstMesCadeaux" :key="index" class="item-cadeaux" :class="{'cadeau-select' : cadeau.isSelect}">
                    {{cadeau.nom}}
                    <div class="delete-cadeau" @click="deleteMesCadeaux(cadeau, index)" v-if="!cadeau.isSelect"><i class="fa fa-trash-o"></i></div>
                </div>
            </div> 
            <div class="action-content" v-if="showDonner">
                <div v-for="(cadeau, index) in lstCadeauxSelect" :key="index" class="item-cadeaux cadeaux-selected">
                    <span>{{cadeau.nom}}</span><br>
                    <span class="nom-user">{{cadeau.user}}</span>
                    <div class="delete-cadeau" @click="deleteCadeauxSelect(cadeau, index)"><i class="fa fa-trash-o"></i></div>
                </div>
            </div> 
        </div>
    </div>
    <div class="modal" id="modalAddCadeau">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Ajouter cadeau</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="nom">Nom:</label>
                    <input type="text" class="form-control" id="nom" v-model="cadeauAddModel.nom">
                </div>
                <div class="form-group">
                    <label for="url">Url (facultatif):</label>
                    <input type="text" class="form-control" id="url" v-model="cadeauAddModel.url">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-success" @click="addCadeau()">Sauvegarder</button>
            </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import {db} from '@/main';
export default {
    props:['groupe', 'user'],
    data(){
        return{
            infosGroupe:undefined,
            lstUsers:[],
            lstCadeaux:[],
            userSelect:undefined,
            isLoading:true,
            showCadeauxGroupe:true,
            showMesCadeaux:false,
            showDonner:false,
            actionSelect:'cadeaux',
            lstMesCadeaux:[],
            lstCadeauxSelect:[],
            userActif:undefined,
            cadeauAddModel:{
                nom:undefined,
                url:undefined
            }
        }
    },
    methods:{
        getUsers(){
            db.collection('groupe').doc(this.groupe.idGroupe).collection('users').get().then(response =>{
                const users = [];
                response.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    users.push(data);
                });
                this.lstUsers = users;
                this.userSelect = this.lstUsers[0]
                this.selectUser(this.userSelect);
                this.isLoading = false

                //select user connect
                this.userActif = this.lstUsers.find(u => u.email === this.user);
            });
        },
        selectUser(user){        
            this.userSelect = user
            db.collection('groupe').doc(this.groupe.idGroupe).collection('users').doc(user.id).collection('cadeaux').get().then(response =>{
                const cadeaux = [];
                response.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    cadeaux.push(data);
                });
                this.lstCadeaux = cadeaux;
            });
        },
        choisir(cadeau){
            let cadeauDoc = db.collection('groupe').doc(this.groupe.idGroupe).collection('users').doc(this.userSelect.id).collection('cadeaux').doc(cadeau.id);
            let userSelected = this.user;
            
            return db.runTransaction(function(transaction) {
                return transaction.get(cadeauDoc).then(function(sfDoc) {
                    if (!sfDoc.exists) {
                        throw "Document does not exist!";
                    }
                    transaction.update(cadeauDoc, { isSelect: true, userSelect: userSelected});
                });
            }).then(() =>{
                console.log("Transaction successfully committed!");
                cadeau.isSelect = true
                this.addCadeauSelect(cadeau);
            }).catch(function(error) {
                console.log("Transaction failed: ", error);
            });

        },
        showContentAction(action){
            this.actionSelect = action
            switch (action) {
                case 'cadeaux':
                    this.showCadeauxGroupe = true
                    this.showMesCadeaux = false
                    this.showDonner = false
                    this.getUsers();
                    break;
                case 'mes-cadeaux':
                    this.showMesCadeaux = true
                    this.showCadeauxGroupe = false
                    this.showDonner = false         
                    this.getMesCadeaux();
                    break;
                case 'a-donner':
                    this.showDonner = true
                    this.showCadeauxGroupe = false
                    this.showMesCadeaux = false
                    this.getCadeauxSelect()
                    break;
                default:
                    break;
            }
        },
        getMesCadeaux(){
            /*db.collection('users').where('email', '==', this.user).get().then(response =>{
            });*/
            db.collection('groupe').doc(this.groupe.idGroupe).collection('users').doc(this.userActif.id).collection('cadeaux').get().then(response =>{
                const cadeaux = [];
                response.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    cadeaux.push(data);
                });
                
                this.lstMesCadeaux = cadeaux;
            })
        },
        getCadeauxSelect(){
            db.collection('groupe').doc(this.groupe.idGroupe).collection('users').doc(this.userActif.id).collection('cadeaux-select').get().then(response =>{
                const cadeaux = [];
                response.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    cadeaux.push(data);
                });
                
                this.lstCadeauxSelect = cadeaux;
            })
        },
        addCadeau(){
            if(this.cadeauAddModel.nom){
                try{
                    db.collection('groupe').doc(this.groupe.idGroupe).collection('users').doc(this.userActif.id).collection('cadeaux').add({
                        nom:this.cadeauAddModel.nom,
                        url:this.cadeauAddModel.url ? this.cadeauAddModel.url : '',
                        isSelect:false,
                        userSelect:''
                    }).then(() => {
                        this.lstMesCadeaux.push(this.cadeauAddModel);
                        this.cadeauAddModel ={
                            nom:undefined,
                            url:undefined
                        }
                        $("#modalAddCadeau").modal("hide");
                    }).catch((error) =>{
                        console.log('erreur add cadeau:' + error)
                    });
                }catch(e){
                    console.log(e);
                }
            }
        },
        addCadeauSelect(cadeau){
            try{
                db.collection('groupe').doc(this.groupe.idGroupe).collection('users').doc(this.userActif.id).collection('cadeaux-select').add({
                    nom:cadeau.nom,
                    user:this.userSelect.prenom + ' ' + this.userSelect.nom,
                    idProprietario: this.userSelect.id,
                    idCadeauOriginal:cadeau.id
                }).then(() => {
                    console.log('cadeau select ajouté')
                }).catch((error) =>{
                    console.log('erreur add cadeau:' + error)
                });
            }catch(e){
                console.log(e);
            }
        },
        deleteMesCadeaux(cadeau, index){
            try{
                db.collection('groupe').doc(this.groupe.idGroupe)
                .collection('users').doc(this.userActif.id).collection('cadeaux').doc(cadeau.id).delete().then((response) =>{
                    this.lstMesCadeaux.splice(index, 1);
                });
            }catch(e){
                console.log('error delete mes cadeaux: ' + e);
            }
        },
        deleteCadeauxSelect(cadeau, index){
            try{
                db.collection('groupe').doc(this.groupe.idGroupe)
                .collection('users').doc(this.userActif.id).collection('cadeaux-select').doc(cadeau.id).delete().then((response) =>{
                    console.log('mettre à jour cadeau origin')
                    let cadeauDoc = db.collection('groupe').doc(this.groupe.idGroupe)
                    .collection('users').doc(cadeau.idProprietario).collection('cadeaux').doc(cadeau.idCadeauOriginal);
                    
                    return db.runTransaction(function(transaction) {
                        return transaction.get(cadeauDoc).then(function(sfDoc) {
                            if (!sfDoc.exists) {
                                throw "Document does not exist!";
                            }
                            transaction.update(cadeauDoc, { isSelect: false, userSelect: ''});
                        });
                    }).then(() =>{
                        this.lstCadeauxSelect.splice(index, 1);
                    }).catch(function(error) {
                        console.log("Transaction failed: ", error);
                    });
                });
            }catch(e){
                console.log('error delete cadeaux select: ' + e);
            }
        }
    },
    created(){
        console.log(this.groupe)
        this.getUsers();
    }
}
</script>
<style scoped>
    .details-groupe{
        padding: 20px;
    }
    .item-user{
        border:1px solid #6e5588;
        height: 60px;
        line-height: 60px;
        cursor: pointer;
        font-weight: 600;
    }
    .item-user a{
        margin: 0;
    }
    .item-user:hover{
        background:  #aa80d5;
    }
    .argent{
        font-size: 14px;
        color: seagreen;
    }
    .content-groupe{
        margin-top: 20px;
    }

    .action-content{   
        margin-top: 20px;
    }

    .content-cadeaux{
        display: flex; 
        flex-wrap: wrap;  
    }

    .content-cadeaux > div{
        width: 50%;
    }

    .itemsCadeaux{
        padding: 5px;
        font-size: 16px;
        border:2px solid #6e5588;
        height: 500px;
        overflow-y: scroll;
    }

    .item-cadeaux{
        border: 1px solid #6e5588;
        height: 60px;
        width: 100%;
        line-height: 55px;
        background: #3fb2cc;
        font-weight: 700;
        position: relative;
    }

    .item-cadeaux.cadeau-select{
        background: #47dea4;
    }
    .item-cadeaux.cadeaux-selected{
        line-height: normal;
        background: #47dea4;
        padding: 10px;
    }
    .nom-user{
        font-size: 12px;
    }
    .nom-cadeau{
        text-align: center;
    }
    .nom-cadeau.to-select{
        cursor: pointer;
    }

    .nom-cadeau a{
        color: hsl(210, 29%, 24%);;
    }

    .delete-cadeau{
        position: absolute;
        top: 5px;
        right: 5px;
        color: red;
        cursor: pointer;
        line-height: normal;
    }

    .choisir{
        width: 30%;
        background: #e04122;
        cursor: pointer;
        font-weight: 600;
    }
    .choisir:hover{
        background: #a1301a;
    }
    .user-select{
        background: #aa80d5;
    }

    .actions-groupe{
        display: grid;
        width: 100%;
        height: 60px;
        border:1px solid #e04122;
        grid-template-columns: auto auto auto;
    }

    .actions-groupe .action{
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f5f5f5;
        border:1px solid #e04122;
        cursor: pointer;
        font-weight: 600;
    }

    .actions-groupe .action:hover{
        background: #dbdbdb;
    }

    .select-only .actions-groupe{
        grid-template-columns: auto auto;
    }

    .action-selected{
        background: #fe937e !important;
    }

    .btns{
        height: 50px;
    }
    .btns .btn-action{
        background: #fe937e;
        float: right;
        border: 1px solid #e04122;
    }

    .form-group label{
        text-align: left;
    }
</style>