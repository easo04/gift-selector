<template>
<div class="details-groupe">
    <btn-back/>
    <h2>{{infosGroupe.nom}}</h2>
    <h5><span class="argent"><span v-if="infosGroupe.maximum">Max {{infosGroupe.maximum}}$</span> 
                    <span v-if="infosGroupe.minimum">Min {{infosGroupe.minimum}}$</span></span></h5>
    
    <div class="select-only">
        <div class="spinner-border" v-if="isLoading"></div>

        <div class="content-groupe" v-else>
            <div class="actions-groupe">
                <div class="action" @click="showContentAction('cadeaux')" :class="{'action-selected' : actionSelect === 'cadeaux'}">
                    Liste de cadeaux
                </div> 
                <div class="action" @click="showContentAction('a-donner')" :class="{'action-selected' : actionSelect === 'a-donner'}">
                    Mes choix
                </div> 
            </div>
            <div v-if="showCadeauxGroupe" class="action-content content-cadeaux">
                <div class="lstCadeaux">
                    <div class="actions" v-if="userActif.isAdmin">
                        <button class="btn btn-action delete" data-toggle="modal" data-target="#modalDeleteCadeau"><i class="fas fa-trash"></i> Supprimer</button>
                        <button class="btn btn-action add" data-toggle="modal" data-target="#modalAddCadeau"><i class="fas fa-plus"></i>Nouveau</button>
                    </div>      
                    <div class="itemsCadeaux">
                        <div class="item-cadeau" :class="{'select' : cadeau.isSelect}" v-for="(cadeau, index) in lstCadeaux" :key="index">
                            <div class="nom-cadeau">
                                <div>
                                    <h4>{{cadeau.nom}}</h4>
                                    <h6 v-if="cadeau.codeRabais">Code de rabais: {{cadeau.codeRabais}}</h6>
                                    <a :href="cadeau.link" target="_blank" v-if="cadeau.link">Lien de l'article</a>
                                </div>
                            </div>
                            <div class="actions-cadeau">
                                <button class="btn btn-action" @click="choisir(cadeau)" v-if="!cadeau.isSelect">Choisir</button>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
            <div class="action-content" v-if="showDonner">
                <div v-for="(cadeau, index) in lstCadeauxSelect" :key="index" class="item-cadeaux cadeaux-selected">
                    <div>
                        <h4>{{cadeau.nom}}</h4>
                        <a :href="cadeau.link" target="_blank" v-if="cadeau.link">Lien de l'article</a>
                    </div>
                    <div class="delete-cadeau" @click="deleteCadeauxSelect(cadeau, index)"><i class="fa fa-trash"></i></div>
                </div>
            </div> 
        </div>
    </div>
    <div class="modal" id="modalAddCadeau">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Nouveau cadeau</h4>
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
                <div class="form-group">
                    <label for="url">Code de rabais (facultatif):</label>
                    <input type="text" class="form-control" id="rabais" v-model="cadeauAddModel.codeRabais">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-action" @click="addCadeau()" :disabled="!cadeauAddModel.nom" :class="{'disabled':!cadeauAddModel.nom}">Sauvegarder</button>
            </div>
            </div>
        </div>
    </div>

    <div class="modal" id="modalDeleteCadeau">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">Supprimer les cadeaux</h4>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="item-cadeau-delete" v-for="(cadeau, index) in lstCadeaux" :key="index">
                        <div>{{cadeau.nom}}</div>
                        <div class="delete"><div v-if="cadeau.isSelect === false"><i class="fa fa-trash" @click="deleteCadeau(cadeau, index)"></i></div></div>
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
            infosGroupe:this.groupe,
            lstCadeaux:[],
            userSelect:undefined,
            isLoading:true,
            showCadeauxGroupe:true,
            showMesCadeaux:false,
            showDonner:false,
            actionSelect:'cadeaux',
            lstCadeauxSelect:[],
            userActif:{
                isAdmin:false
            },
            cadeauAddModel:{
                nom:undefined,
                url:undefined,
                codeRabais:undefined
            }, 
            userActifConnect:{}
        }
    },
    methods:{
        getUsers(){
            db.collection('groupe').doc(this.infosGroupe.idGroupe).collection('users').get().then(response =>{
                const users = [];
                response.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    users.push(data);
                });
                //select user connect
                this.userActif = users.find(u => u.email === this.user);
                sessionStorage.setItem('userActif', JSON.stringify(this.userActif));
            });
        },
        getCadeaux(){
            db.collection('groupe').doc(this.infosGroupe.idGroupe).collection('cadeaux').get().then(response =>{
                const cadeaux = [];
                response.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    cadeaux.push(data);
                });
                this.lstCadeaux = cadeaux;
                this.isLoading = false
                sessionStorage.setItem('lstCadeaux', JSON.stringify(this.lstCadeaux));
            });
        },
        choisir(cadeau){
            let cadeauDoc = db.collection('groupe').doc(this.infosGroupe.idGroupe).collection('cadeaux').doc(cadeau.id);
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
                    this.getCadeaux();
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
        getCadeauxSelect(){
            db.collection('groupe').doc(this.infosGroupe.idGroupe).collection('users').doc(this.userActif.id).collection('cadeaux-selected').get().then(response =>{
                const cadeaux = [];
                response.forEach(doc => {
                    let data = doc.data();
                    data.id = doc.id;
                    cadeaux.push(data);
                });
                
                this.lstCadeauxSelect = cadeaux;
            })
        },
        addCadeauSelect(cadeau){
            try{
                db.collection('groupe').doc(this.infosGroupe.idGroupe).collection('users').doc(this.userActif.id).collection('cadeaux-selected').add({
                    nom:cadeau.nom,
                    link:cadeau.link,
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
        deleteCadeauxSelect(cadeau, index){
            try{
                db.collection('groupe').doc(this.infosGroupe.idGroupe)
                .collection('users').doc(this.userActif.id).collection('cadeaux-selected').doc(cadeau.id).delete().then((response) =>{
                    console.log('mettre à jour cadeau origin')
                    let cadeauDoc = db.collection('groupe').doc(this.infosGroupe.idGroupe)
                    .collection('cadeaux').doc(cadeau.idCadeauOriginal);
                    
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
        },
        deleteCadeau(cadeau, index){
            try{
                db.collection('groupe').doc(this.infosGroupe.idGroupe).collection('cadeaux').doc(cadeau.id).delete().then((response) =>{
                    this.lstCadeaux.splice(index, 1);
                });
            }catch(e){
                console.log('error delete mes cadeaux: ' + e);
            }
        },
        addCadeau(){
            if(this.cadeauAddModel.nom){
                try{
                    db.collection('groupe').doc(this.infosGroupe.idGroupe).collection('cadeaux').add({
                        nom:this.cadeauAddModel.nom,
                        link:this.cadeauAddModel.url || '',
                        isSelect:false,
                        userSelect:'',
                        image:'',
                        codeRabais:this.cadeauAddModel.codeRabais || ''
                    }).then((res) => {
                        this.getCadeaux();
                        this.cadeauAddModel ={
                            nom:undefined,
                            url:undefined,
                            codeRabais:undefined
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
    },
    mounted(){
        
        const user = JSON.parse(sessionStorage.getItem('user'));
        const cadeaux = JSON.parse(sessionStorage.getItem('lstCadeaux'));
        const groupe = JSON.parse(sessionStorage.getItem('groupeSelect'));
        if(user && cadeaux && groupe){
            this.userActif = user;
            this.lstCadeaux = cadeaux;
            this.infosGroupe = groupe;
            this.isLoading = false;
        }else{
            this.infosGroupe = this.groupe;
            sessionStorage.setItem('groupeSelect', JSON.stringify(this.infosGroupe));
            this.getCadeaux();
            this.getUsers();
        }
        this.userActifConnect = user;
    },
    beforeDestroy(){
        sessionStorage.setItem('lstCadeaux', JSON.stringify(this.lstCadeaux));
    }
}
</script>
<style scoped>
    h2{
        font-family: 'Yatra One', cursive;
    }
    .details-groupe{
        padding: 50px 200px;
        color: hsl(210, 29%, 24%);
        background: #fdfdfd;
        font-family: 'Ubuntu', sans-serif;
    }
    @media screen and (max-width:769px){
        .details-groupe{
            padding: 20px;
        }
    }
    .item-cadeau{
        border:1px solid hsl(210, 29%, 24%);
        min-height: 100px;
        font-weight: 600;
        display : grid;
        grid-template-columns: 2fr 1fr;
        padding: 10px;
        border-radius: 5px;
        background: #e7edfc;
        margin-bottom: 20px;
    }
    .details-groupe h6{
        font-family: 'Ubuntu', sans-serif;
    }
    .actions{
        height: 60px;
    }
    .actions .btn{
        background: transparent !important;
        border:2px solid hsl(210, 29%, 24%) !important;
        border-radius: 5px !important;
        
    }

    .actions .btn:not(:last-child){
        margin-left: 10px;
    }
    .actions .btn:hover{
        background: hsl(210, 29%, 24%) !important;
        color:#e7edfc;
    }
    .item-cadeau.select{
        background: #6decbb;
    }
    .item-cadeau a{
        margin: 0;
    }
    .item-cadeau .nom-cadeau{
        text-align: left;
        display: flex;
        align-items: center;
    }
    .item-cadeau .nom-cadeau a{
        text-decoration: underline;
        color:royalblue;
        font-size: 14px;
    }
    .item-cadeau .actions-cadeau{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .item-cadeau .actions-cadeau button{
        width: 100%;
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
        border-radius: 5px;
    }

    .content-cadeaux > div{
        width: 100%;
    }

    .itemsCadeaux{
        font-size: 16px;
        height: auto;
    }

    .item-cadeaux{
        min-height: 100px;
        width: 100%;
        background: #3fb2cc;
        font-weight: 700;
        position: relative;
        margin-bottom: 20px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        text-align: left;
        padding: 10px;
        border:1px solid #3780AD;
    }

    .item-cadeaux a{
        text-decoration: underline;
        color: royalblue;
        font-size: 14px;
        font-family: 'Ubuntu', sans-serif;
    }

    .item-cadeaux.cadeau-select{
        background: #6decbb;
    }
    .item-cadeaux.cadeaux-selected{
        line-height: normal;
        background: #6decbb;
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
        color: hsl(210, 29%, 24%);   
        font-family: 'Ubuntu', sans-serif;
    }

    .delete-cadeau{
        position: absolute;
        top: 10px;
        right: 10px;
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
        background: #aa80d5;
    }

    .actions-groupe{
        display: grid;
        width: 100%;
        height: 60px;   
        grid-template-columns: 1fr 1fr;
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
        grid-template-columns: 1fr 1fr;
    }

    .action-selected{
        background: hsl(210, 29%, 24%) !important;
        color:#fdfdfd;
    }

    .btns{
        height: 50px;
    }
    .btn.btn-action{
        font-family: 'Ubuntu', sans-serif;
        float: right;
        padding: 10px;
        cursor: pointer;
        background: #549bc8;
        border:none;
        border-radius: 5px;
        color: hsl(210, 29%, 24%);
        font-weight: 500;
    }
    .btn.btn-action:hover{
        background: #437a9e;
    }
    .btn.btn-action.disabled{
        background: #b3b3b3;
    }

    .form-group label{
        text-align: left;
        float: left;
    }

    .form-group .form-control{
        margin-bottom: 5px;
        height: 40px;
        width: 100%;
        border-radius: 5px;
        border:1px solid #a1a1a1;
    }

    .item-cadeau-delete{
        display: flex;
        align-items: center;
        width: 100%;
        padding: 25px 0px;
    }

    .item-cadeau-delete:not(:last-child){
        border-bottom: 1px solid #a1a1a1;
    }

    .item-cadeau-delete>div:first-child{
        width: 80%;
        text-align: left;
    }
    .item-cadeau-delete>div:last-child{
        width: 20%;
        text-align: right;
    }

    .item-cadeau-delete .delete i {
        color:hsl(210, 29%, 24%);
        cursor: pointer;
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

    #modalDeleteCadeau .modal-body{
        height: 400px;
        overflow-y: auto;
    }
</style>