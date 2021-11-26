<template>
    <div class="details-groupe-random">
        <btn-back/>
        <h2>{{groupeCurrent.nom}}</h2>
        <div class="img-groupe"><img class="logo-header" src="../assets/groupe-type-random.svg"></div>
        <div>
            <div class="spinner-border" v-if="isLoading"></div>
            <div class="content-groupe" v-else>
                <div class="btns" v-if="showBtnSelect()">
                    <button class="btn btn-action btn-random" data-toggle="modal" data-target="#modalRandomUser" @click="selectRandomUser()"><i class="fas fa-random"></i> Piger un nom</button>
                </div>
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
                        <h5>Participants</h5>       
                        <div class="itemsUsers">
                            <div class="item-user" v-for="(user, index) in lstUsers" :key="index" @click="selectUser(user)" :class="{'user-select' : user.email === userSelect.email}">
                                <div>{{user.prenom}}</div>
                                <div class="my-select" v-if="user.isMySelect"><i class="fas fa-gift"></i></div>
                            </div> 
                        </div>
                    </div>
                    <div class="lstCadeaux">
                        <h5>Liste de cadeaux de l'usager</h5>
                        <div class="itemsCadeaux">
                            <div class="item-cadeaux" v-for="(c, index) in lstCadeaux" :key="index" :class="{'cadeau-select' : c.isSelect}" c.isSelect>
                                <div class="nom-cadeau">
                                    <h5>{{c.nom}}</h5>
                                    <a :href="c.url" target="_blank" v-if="c.url">Lien de l'article</a>
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
                        <h5>{{cadeau.nom}}</h5>
                        <div class="delete-cadeau" @click="deleteMesCadeaux(cadeau, index)" v-if="!cadeau.isSelect"><i class="fa fa-trash"></i></div>
                    </div>
                </div> 
                <div class="action-content" v-if="showDonner && userRandom">
                    <h5>La liste de cadeaux de <strong>{{userRandom.prenom}}</strong></h5>
                    <div v-for="(cadeau, index) in lstCadeauxSelect" :key="index" class="item-cadeaux cadeaux-selected">
                        <h5>{{cadeau.nom}}</h5>
                        <span class="nom-user">{{cadeau.user}}</span>
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
                        <input type="text" class="form-control" id="nom" v-model="cadeauAddModel.nom" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label for="url">Url (facultatif):</label>
                        <input type="text" class="form-control" id="url" v-model="cadeauAddModel.url"  autocomplete="off">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn" @click="addCadeau()">Sauvegarder</button>
                </div>
                </div>
            </div>
        </div>
        <div class="modal" id="modalRandomUser">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Piger un nom au hasard</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <h5>La personne que vous avez choisi est ...</h5>
                            <div class="loading" v-if="loadinRandomUser">
                                <img src="../assets/drum.svg">
                            </div>
                            <div v-else>
                                <img src="../assets/happy.svg">
                                <h4>{{userRandom.prenom}} {{userRandom.nom}}</h4>
                            </div>
                        </div>
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
            groupeCurrent:{},
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
            userRandom:undefined,
            userActifConnect:{},
            loadinRandomUser:true,
        }
    },
        methods:{
        showBtnSelect(){
            return false;
            //return  !this.userActif.userSelect;
        },
        initUserInfos(users){
            this.lstUsers = users;
            this.userSelect = this.lstUsers[0]
            this.selectUser(this.userSelect);

            //select user connect
            this.userActif = this.lstUsers.find(u => u.email === this.user);

            if(this.userActif.userSelect){
                let userSelected = this.lstUsers.find(u=> u.email === this.userActif.userSelect);
                userSelected.isMySelect = true;
                this.userRandom = userSelected;
            }
            
            this.isLoading = false;
        },
        getUsers(){
            db.collection('groupe').doc(this.groupeCurrent.idGroupe).collection('users').get().then(response =>{
                const users = [];
                response.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    users.push(data);
                });
                this.initUserInfos(users);
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
            if(this.userRandom && this.userRandom.id){
                db.collection('groupe').doc(this.groupeCurrent.idGroupe).collection('users').doc(this.userRandom.id).collection('cadeaux').get().then(response =>{
                    const cadeaux = [];
                    response.forEach(doc => {
                        let data = doc.data();
                        data.id = doc.id;
                        cadeaux.push(data);
                    });
                    
                    this.lstCadeauxSelect = cadeaux;
                })
            }
        },
        addCadeau(){
            if(this.cadeauAddModel.nom){
                try{
                    let cadeau = {  
                        nom:this.cadeauAddModel.nom,
                        url:this.cadeauAddModel.url ? this.cadeauAddModel.url : '',
                        isSelect:false,
                        userSelect:''
                    };
                    db.collection('groupe').doc(this.groupeCurrent.idGroupe).collection('users').doc(this.userActif.id).collection('cadeaux').add(cadeau).then(() => {                           
                        cadeau.groupe = this.groupeCurrent.nom;
                        db.collection('users').doc(this.userActifConnect.id).collection('mes-cadeaux').add(cadeau).then(() =>{
                            this.lstMesCadeaux.push(this.cadeauAddModel);
                            this.cadeauAddModel ={
                                nom:undefined,
                                url:undefined
                            };
                            $("#modalAddCadeau").modal("hide");
                        });
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
                db.collection('groupe').doc(this.groupeCurrent.idGroupe)
                .collection('users').doc(this.userActif.id).collection('cadeaux').doc(cadeau.id).delete().then((response) =>{
                    this.lstMesCadeaux.splice(index, 1);
                });
            }catch(e){
                console.log('error delete mes cadeaux: ' + e);
            }
        },
        updateUsersSelect(emailUserSelect){
            let userDoc = db.collection('groupe').doc(this.groupeCurrent.idGroupe).collection('users').doc(this.userActif.id);
            return db.runTransaction(function(transaction) {
                    return transaction.get(userDoc).then(function(sfDoc) {
                        if (!sfDoc.exists) {
                            throw "Document does not exist!";
                        }
                        transaction.update(userDoc, { userSelect: emailUserSelect});
                    });
            }).then(() =>{
                this.loadinRandomUser = false;
                //mettre à jour la liste d'usagers
                this.getUsers();
            }).catch(function(error) {
                console.log("Transaction failed: ", error);
            });

        },
        selectRandomUser(){
            //this.updateUsersSelect();
            this.loadinRandomUser = true;

            const usersNotSelect = this.lstUsers.filter(user => !user.isSelect && user.id !== this.userActif.id);
            this.userRandom = usersNotSelect[Math.floor(Math.random() * usersNotSelect.length)];

            let userDoc = db.collection('groupe').doc(this.groupeCurrent.idGroupe).collection('users').doc(this.userRandom.id);

            setTimeout(() => { 
                return db.runTransaction(function(transaction) {
                    return transaction.get(userDoc).then(function(sfDoc) {
                        if (!sfDoc.exists) {
                            throw "Document does not exist!";
                        }
                        transaction.update(userDoc, { isSelect: true});
                    });
                }).then(() =>{
                    this.updateUsersSelect(this.userRandom.email);
                }).catch(function(error) {
                    console.log("Transaction failed: ", error);
                });
            }, 2000);
        }
    },
    created(){
        if(!this.groupe){
            this.$router.replace('home')
        }
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
        this.userActifConnect = user;
        
        const users = JSON.parse(sessionStorage.getItem('lstUsers'));
        //si le groupe est passé en scope, on recharge la page
        if(this.groupe || !users){
            this.getUsers();
        }else{
            this.initUserInfos(users);
        }
    }
}
</script>
<style>
    h2{
        font-family: 'Yatra One', cursive;
    }
    h5{
        text-align: left;
        margin-bottom: 10px;
    }
    .details-groupe-random{
        padding: 50px 200px;
        color: hsl(210, 29%, 24%);
        background: #fdfdfd;
        font-family: 'Ubuntu', sans-serif;
        position: relative;
    }

    @media screen and (max-width: 769px){

        .details-groupe-random{
            padding: 50px 20px;
        }
    }

    .img-groupe{
        position: absolute;
        top:20px;
        right: 60px;
    }
    .itemsUsers{
        display: flex;
        flex-wrap: wrap;
    }

    .itemsUsers .item-user{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 5px;
    }

    @media screen and (max-width: 769px){

        .itemsUsers{
            flex-wrap: nowrap;
            overflow-x:scroll;
            padding: 10px 0px;
        }
    }



    .item-user{
        border:1px solid #69C2FA;
        cursor: pointer;
        font-weight: 600;
        margin-right: 10px;
        padding: 10px 20px;
        border-radius: 10px;
        font-size: 0.9rem;
        position: relative;
        z-index: 1;
    }
    .item-user a{
        margin: 0;
    }
    .item-user:hover{
        background:  #69C2FA;
    }
    .item-user .my-select{
        position: absolute;
        font-size: 1.5em;
        color: #ff4d54;
        top: -8px;
        right: -5px;
        z-index: 2;
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

    .item-cadeaux{
        border: 1px solid hsl(210, 29%, 24%);
        padding: 10px;
        min-height: 100px;
        font-weight: 600;
        width: 100%;
        border-radius: 5px;
        background: #e7edfc;
        position: relative;
        margin-bottom: 20px;
        text-align: left;
    }

    .item-cadeaux.cadeaux-selected{
        line-height: normal;
        cursor: default;
    }
    .nom-user{
        font-size: 12px;
        color:hsl(211, 25%, 34%);
    }
    .nom-cadeau{
        text-align: left;
    }

    .nom-cadeau a{
        text-decoration: underline;
        color:royalblue;
        font-size: 14px;
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

    .btns .btn.btn-action.btn-random{
        background-color: #69C2FA;
    }

    #modalRandomUser .modal-body{
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #modalRandomUser .modal-body img{
        height: 70px;
        width: 70px;
        margin: 10px 0px;
    }

    #modalAddCadeau .modal-body{
        display: block;
        height: auto;
    }

    #modalAddCadeau .modal-body .form-group{
        text-align: left;
    }

    
</style>