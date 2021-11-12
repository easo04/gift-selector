<template>
<div class="details-groupe">
    <btn-back/>
    <h2>{{groupeCurrent.nom}}</h2>
    <h5><span class="argent"><span v-if="groupeCurrent.maximum">Max {{groupeCurrent.maximum}}$</span> 
                    <span v-if="groupeCurrent.minimum">Min {{groupeCurrent.minimum}}$</span></span></h5>
                    
    <div class="img-groupe"><img class="logo-header" src="../assets/groupe-type-default.svg"></div>
    
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
                    <h5>Liste d'usagers</h5>       
                    <div class="itemsUsers">
                        <div class="item-user" v-for="(user, index) in lstUsers" :key="index" @click="selectUser(user)" :class="{'user-select' : user.email === userSelect.email}">
                            {{user.prenom}} {{user.nom}}
                        </div> 
                    </div>
                </div>
                <div class="lstCadeaux">
                    <h5>Liste de cadeaux de l'usager</h5>
                    <div class="itemsCadeaux">
                        <div class="item-cadeaux" v-for="(c, index) in lstCadeaux" :key="index" :class="{'cadeau-select' : c.isSelect}" c.isSelect>
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
                    <button class="btn btn-action" data-toggle="modal" data-target="#modalAddCadeau"><i class="fas fa-plus"></i> Nouveau</button>
                </div>
                <div v-for="(cadeau, index) in lstMesCadeaux" :key="index" class="item-cadeaux" :class="{'cadeau-select' : cadeau.isSelect}">
                    {{cadeau.nom}}
                    <div class="delete-cadeau" @click="deleteMesCadeaux(cadeau, index)" v-if="!cadeau.isSelect"><i class="fa fa-trash"></i></div>
                </div>
            </div> 
            <div class="action-content" v-if="showDonner">
                <div v-for="(cadeau, index) in lstCadeauxSelect" :key="index" class="item-cadeaux cadeaux-selected">
                    <span>{{cadeau.nom}}</span><br>
                    <span class="nom-user">{{cadeau.user}}</span><br>
                    <a class="lien" :href="cadeau.url" target="_blank">Lien de l'article</a>
                    <div class="delete-cadeau" @click="deleteCadeauxSelect(cadeau, index)"><i class="fa fa-trash"></i></div>
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
import BtnBack from './BtnBack.vue';
export default {
    components: { BtnBack },
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
            },
            groupeCurrent: {},
            userActifConnect:{}
        }
    },
    methods:{
        getUsers(){
            db.collection('groupe').doc(this.groupeCurrent.idGroupe).collection('users').get().then(response =>{
                const users = [];
                response.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    users.push(data);
                });
                this.lstUsers = users;
                this.userSelect = this.lstUsers[0]
                this.selectUser(this.userSelect);
                this.isLoading = false;

                //select user connect
                this.userActif = this.lstUsers.find(u => u.email === this.user);

                sessionStorage.setItem('lstUsers', JSON.stringify(this.lstUsers));
            });
        },
        selectUser(user){        
            this.userSelect = user;
            db.collection('groupe').doc(this.groupeCurrent.idGroupe).collection('users').doc(user.id).collection('cadeaux').get().then(response =>{
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
            let cadeauDoc = db.collection('groupe').doc(this.groupeCurrent.idGroupe).collection('users').doc(this.userSelect.id).collection('cadeaux').doc(cadeau.id);
            let userSelected = this.userActif.email;
            
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
            db.collection('groupe').doc(this.groupeCurrent.idGroupe).collection('users').doc(this.userActif.id).collection('cadeaux').get().then(response =>{
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
            db.collection('groupe').doc(this.groupeCurrent.idGroupe).collection('users').doc(this.userActif.id).collection('cadeaux-select').get().then(response =>{
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
                let cadeau = {
                    nom:this.cadeauAddModel.nom,
                    url:this.cadeauAddModel.url ? this.cadeauAddModel.url : '',
                    isSelect:false
                };
                try{
                    db.collection('groupe').doc(this.groupeCurrent.idGroupe).collection('users').doc(this.userActif.id).collection('cadeaux').add(cadeau).then(() => {
                        cadeau.groupe = this.groupeCurrent.nom;
                        db.collection('users').doc(this.userActifConnect.id).collection('mes-cadeaux').add(cadeau).then(() =>{
                            this.lstMesCadeaux.push(this.cadeauAddModel);
                            this.cadeauAddModel ={
                                nom:undefined,
                                url:undefined
                            };
                            $("#modalAddCadeau").modal("hide");
                        })
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
                db.collection('groupe').doc(this.groupeCurrent.idGroupe).collection('users').doc(this.userActif.id).collection('cadeaux-select').add({
                    nom:cadeau.nom,
                    user:this.userSelect.prenom + ' ' + this.userSelect.nom,
                    idProprietario: this.userSelect.id,
                    idCadeauOriginal:cadeau.id,
                    url:cadeau.url
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
                db.collection('groupe').doc(this.groupeCurrent.idGroupe)
                .collection('users').doc(this.userActif.id).collection('cadeaux').doc(cadeau.id).delete().then((response) =>{
                    this.lstMesCadeaux.splice(index, 1);
                });
            }catch(e){
                console.log('error delete mes cadeaux: ' + e);
            }
        },
        deleteCadeauxSelect(cadeau, index){
            try{
                db.collection('groupe').doc(this.groupeCurrent.idGroupe)
                .collection('users').doc(this.userActif.id).collection('cadeaux-select').doc(cadeau.id).delete().then((response) =>{
                    console.log('mettre à jour cadeau origin')
                    let cadeauDoc = db.collection('groupe').doc(this.groupeCurrent.idGroupe)
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
    },
    mounted(){
        const groupe = JSON.parse(sessionStorage.getItem('groupe'));
        if(!this.groupe && groupe){
            this.groupeCurrent = groupe;
        }else if(this.groupe){
            this.groupeCurrent = this.groupe;
            sessionStorage.setItem('groupe', JSON.stringify(this.groupe));
        }

        const user = JSON.parse(sessionStorage.getItem('user'));
        
        const users = JSON.parse(sessionStorage.getItem('lstUsers'));
        if(this.groupe || !users){
            this.getUsers();
        }else{
            this.lstUsers = users;
            this.userSelect = this.lstUsers[0];
            this.selectUser(this.userSelect);
            this.userActif = this.lstUsers.find(u => u.email === user.email);
            this.isLoading = false;
        }

        this.userActifConnect = user;
    },
}
</script>
<style scoped>
    h2{
        font-family: 'Yatra One', cursive;
    }
    h5{
        text-align: left;
        margin-bottom: 10px;
    }
    .details-groupe{
        padding: 50px 200px;
        color: hsl(210, 29%, 24%);
        background: #fdfdfd;
        font-family: 'Ubuntu', sans-serif;
    }

    @media screen and (max-width: 769px){

        .details-groupe{
            padding: 50px 20px;
        }
    }

    .details-groupe .img-groupe{
        position: absolute;
        top:20px;
        right: 60px;
    }
    .details-groupe .itemsUsers{
        display: flex;
        flex-wrap: wrap;
    }
    .details-groupe .item-user{
        border:1px solid #69C2FA;
        cursor: pointer;
        font-weight: 600;
        margin-right: 10px;
        padding: 10px 20px;
        border-radius: 10px;
        font-size: 0.9rem;
        margin-top: 10px;
    }
    .details-groupe .item-user a{
        margin: 0;
    }
    .details-groupe .item-user:hover{
        background:  #69C2FA;
    }
    .details-groupe .argent{
        font-size: 14px;
        color: seagreen;
    }
    .content-groupe{
        margin-top: 20px;
    }

    .action-content{   
        margin-top: 20px;
    }

    /*.content-cadeaux{
        display: flex; 
        flex-wrap: wrap;  
    }

    .content-cadeaux > div{
        width: 50%;
    }*/

    .lstCadeaux{
        margin-top: 20px;
    }

    .details-groupe .item-cadeaux{
        border: 1px solid hsl(210, 29%, 24%);
        padding: 10px;
        min-height: 100px;
        font-weight: 600;
        width: 100%;
        border-radius: 5px;
        background: #3fb2cc;
        position: relative;
        margin-bottom: 20px;
        text-align: left;
        cursor: pointer;
    }

    .item-cadeaux.cadeau-select{
        background: #47dea4;
        cursor: default;
    }
    .item-cadeaux.cadeaux-selected{
        line-height: normal;
        background: #47dea4;
        cursor: default;
    }
    .nom-user{
        font-size: 12px;
        color:hsl(211, 25%, 34%);
    }
    .nom-cadeau{
        text-align: left;
    }
    .nom-cadeau.to-select{
        cursor: pointer;
        min-height: inherit;
    }

    .nom-cadeau a{
        color: hsl(210, 29%, 24%);;
    }

    .delete-cadeau{
        position: absolute;
        top: 5px;
        right: 5px;
        color: hsl(210, 29%, 24%);
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
        background: #69C2FA;
    }

    .actions-groupe{
        display: grid;
        width: 100%;
        height: 60px;   
        grid-template-columns: 1fr 1fr 1fr;
        font-family: 'Ubuntu', sans-serif;
        border-radius: 5px;
    }

    .actions-groupe .action{
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f5f5f5;
        border:1px solid hsl(210, 29%, 24%);
        cursor: pointer;
        font-weight: 500;
    }

    .actions-groupe .action:first-child{
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    .actions-groupe .action:last-child{
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .actions-groupe .action:hover{
        background: #dbdbdb;
    }

    .select-only .actions-groupe{
        grid-template-columns: 1fr 1fr 1fr;
    }

    
    .action-selected{
        background: hsl(210, 29%, 24%) !important;
        color:#fdfdfd;
    }

    .btns{
        height: 50px;
        margin-bottom: 20px;
    }

    .btns .btn.btn-action{
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

    .btns .btn.btn-action:hover{
        background: hsl(210, 29%, 24%);
        color: #fdfdfd;
    }

    .btns .btn.btn-action.disabled{
        background: #b3b3b3;
    }

    .form-group label{
        text-align: left;
    }

    .lien{
        color: hsl(210, 29%, 24%);   
        font-family: 'Ubuntu', sans-serif;
        font-size: 0.8em;
        text-decoration: underline;
    }
</style>