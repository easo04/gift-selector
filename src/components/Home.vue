<template>
    <div class="home-page">
        <div class="alert alert-success alert-dismissible" v-show="showPasswordChanged">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Success!</strong> Le mot de passe a été modifié
        </div>
        <h2>Bienvenue {{email}}</h2>
        <div class="modifier-password">
            <button class="btn btn-action" data-toggle="modal" data-target="#modalPasswordChanged">Modifier mot de passe</button>
        </div> 
        <div class="dashboard">
            <div class="item-groupe" v-for="(groupe, index) in lstGroupes" :key="index" @click="goToDetails(groupe)">
                <div>
                    <span>{{groupe.nom}}</span><br>
                    <span class="argent"><span v-if="groupe.maximum">Max {{groupe.maximum}}$</span>
                    <span v-if="groupe.minimum"> Min {{groupe.minimum}}$</span></span>
                </div>
            </div>
        </div>

        <div class="modal" id="modalPasswordChanged">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Modifier votre mot de passe</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="newPassword">Nouveau mot de passe:</label>
                            <input type="password" class="form-control" id="newPassword" v-model="modelPassword.newPassword">
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Confirmer le nouveau mot de passe:</label>
                            <input type="password" class="form-control" id="confirmPassword" v-model="modelPassword.confirmPassword">
                        </div>
                        <div v-if="modelPassword.error !== undefined">
                            <span class="badge badge-danger">{{modelPassword.error}}</span>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-action" @click="updatePassword()">Sauvegarder</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import {db} from '@/main'
    import firebase from 'firebase'
    export default {
        data(){
            return{
                email:'',
                currentUser:undefined,
                lstGroupes:[],
                showPasswordChanged:false,
                modelPassword:{
                    newPassword:undefined,
                    confirmPassword:undefined
                }
            }
        },
        methods:{
            getCurrentUser(){
                db.collection('users').get().then(response =>{
                    const users = [];
                    response.forEach(doc => {
                        let data = doc.data();
                        data.id = doc.id;
                        users.push(data);
                    });

                    //select user connect
                    this.currentUser = users.find(u => u.email === firebase.auth().currentUser.email);

                    sessionStorage.setItem('user', JSON.stringify(this.currentUser));

                    db.collection('users').doc(this.currentUser.id).collection('groupes').get().then(res => {
                        res.forEach(doc => {
                            let data = doc.data();
                            data.id = doc.id;
                            this.lstGroupes.push(data);
                        });

                        sessionStorage.setItem('lstGroupes', JSON.stringify(this.lstGroupes));
                    })
                }).catch(error => console.error("Error get users: ", error));
            },
            goToDetails(groupe){
                if(groupe.isOnlySelect){
                    this.$router.push({name: 'detailsGroupeOnly', params:{'groupe' : groupe, 'user': this.currentUser.email}});
                }else{
                    this.$router.push({name: 'detailsGroupe', params:{'groupe' : groupe, 'user': this.currentUser.email}});
                }
            },
            updatePassword(){
                if(this.modelPassword.newPassword === this.modelPassword.confirmPassword){
                    let user = firebase.auth().currentUser;
                    //var newPassword = getASecureRandomPassword();
                    let newPassword = this.modelPassword.newPassword
                    user.updatePassword(newPassword).then(() =>{
                        this.showPasswordChanged = true
                        this. modelPassword = {
                            newPassword:undefined,
                            confirmPassword:undefined
                        }
                        $("#modalPasswordChanged").modal("hide");
                    }).catch((error) => {
                        this.showPasswordChanged = false
                        console.log('erreur passeword changed')
                    });
                }else{
                    this.modelPassword.error = 'Le mot de passe n\'est pas le même'
                }
            }
        },
        created(){
            this.email = firebase.auth().currentUser.email;

            //get current user ans theirs groupes
            const lstGroupesLocal = JSON.parse(sessionStorage.getItem('lstGroupes'));
            const currentUserLocal = JSON.parse(sessionStorage.getItem('user'));
            if(lstGroupesLocal && currentUserLocal){
                this.lstGroupes = lstGroupesLocal;
                this.currentUser = currentUserLocal;
            }else{ 
                this.getCurrentUser();
            }
        },
        mounted(){
        }
    }
</script>
<style scoped>
.home-page{
    padding: 50px 200px;
    font-family: 'Yatra One', cursive;
    background: #fdfdfd;
}
@media screen and (max-width: 769px){
    .home-page{
        padding: 20px;
    }
}
.btn-logout{
    text-decoration: underline;
    color: royalblue;
    cursor: pointer;
}
.dashboard{
    display: flex;
    flex-wrap: wrap;
    widows: 100%;
}
.item-groupe{
    border: 2px solid #3780AD;
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
}
.item-groupe:hover{
    background: #c8c640;
}
.argent{
    font-size: 14px;
    color: seagreen;
}
.modifier-password{
    margin-top:20px;
    height: 60px;
        width: 100%;
}
.modifier-password .btn{
    float: right;
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
    background: #4a88af;
}
.form-group{
    text-align: left;
}
</style>
