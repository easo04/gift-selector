<template>
    <div class="create-user-page">
        <div class="image">
            <img src="../assets/gift.svg">
        </div>
        <div class="content">
            <div>
                <h2>Créer votre compte</h2>
                <div class="form-create">
                    <div class="error" v-if="error">
                        * {{error}}
                    </div> 
                    <form @submit.prevent="login()">
                        <div class="form-group">
                            <label for="prenom">Prénom:</label>
                            <input type="text" class="form-control" id="prenom" v-model="firstName">
                        </div>
                        <div class="form-group">
                            <label for="nom">Nom:</label>
                            <input type="text" class="form-control" id="nom" v-model="lastName">
                        </div>
                        <div class="form-group">
                            <label for="email">Email:</label>
                            <input type="text" class="form-control" id="email" v-model="user">
                        </div>
                        <div class="form-group">
                            <label for="mdp">Mot de passe:</label>
                            <input type="password" class="form-control" id="mdp" v-model="password">
                        </div>
                        <div class="form-group">
                            <label for="mdpConfirm">Confirmez votre mot de passe:</label>
                            <input type="password" class="form-control" id="mdpConfirm" v-model="passwordConfirm">
                        </div>
                        <button type="submit" class="btn btn-action" :disabled="!isFormValid()" :class="{'disabled':!isFormValid()}">Sauvegarder</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import firebase from 'firebase'
    import {db} from '@/main';
    export default {
        data() {
            return {
                user:undefined,
                password:undefined,
                firstName:undefined,
                lastName:undefined,
                passwordConfirm:undefined,
                error:undefined,
                groupe:{}
            }
        },
        methods: {
            isFormValid(){
                return this.user && this.password && this.passwordConfirm && this.firstName &&
                    this.lastName;
            },
            addUser(){
                try{
                    db.collection('users').add({
                        nom:this.lastName,
                        prenom:this.firstName,
                        email:this.user.toLowerCase()
                    }).then((res) => {
                        db.collection('users').doc(res.id).collection('groupes').add({
                            nom:this.groupe.nom,
                            idGroupe:this.groupe.id,
                            maximum:this.groupe.maximum ? this.groupe.maximum : 0,
                            minimum:this.groupe.minimum ? his.groupe.minimum : 0,
                            isOnlySelect:this.groupe.isOnlySelect ? this.groupe.isOnlySelect : false,
                            isRandomGroupe:this.groupe.isRandomGroupe ? this.groupe.isRandomGroupe : false
                        }).then(()=>{
                            db.collection('groupe').doc(this.groupe.id).collection('users').add({
                                nom:this.lastName,
                                prenom:this.firstName,
                                email:this.user.toLowerCase(),
                                isAdmin:false
                            }).then(() => this.$router.replace('home'))              
                        })
                    }).catch((error) =>{
                        console.log('erreur add user:' + error)
                    });
                }catch(e){
                    console.log(e);
                }
            },
            login(){
                if(this.password !== this.passwordConfirm){
                    this.error = 'Svp rentrez le même mot de passe';
                    return
                }

                firebase.auth().createUserWithEmailAndPassword(this.user, this.password).then(user =>{
                    this.addUser();
                }, error =>{
                    switch (error.code) {
                        case 'auth/invalid-email':
                            this.error = 'Le format du email est invalide'
                            break;
                        case 'auth/wrong-password':
                            this.error = 'Mot de passe invalide'
                            break;
                        case 'auth/email-already-in-use':
                            this.error = 'L\email est déjà utilisé par un autre compte'
                            break;
                        default:
                            this.error = 'Erreur'
                            break;
                    }
                    console.log(error)
                });
            }
        },
        mounted(){
            if(this.$route.query && this.$route.query.groupe){
                const idGroupe = this.$route.query.groupe;
                db.collection('groupe').doc(idGroupe).get().then(doc =>{
                    this.groupe = doc.data();
                    this.groupe.id = idGroupe;
                    console.log(this.groupe)
                }).catch(err =>  this.$router.replace('login'))
            }else{
                this.$router.replace('login')
            }
        }
    }
</script>
<style scoped>
    .create-user-page{
        min-height: 100vh;
        display: flex;   
        font-family: 'Yatra One', cursive;
        background: #fdfdfd;
        flex-wrap: wrap;
    }
    .create-user-page>div{
        width: 50%;
    }
    .create-user-page .image{
        background: #e1f3fe;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .create-user-page .image img{
        width: 70%;
        height: auto;
    }
    .create-user-page .content{
        padding: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    @media screen and (max-width: 769px){
        .create-user-page .image{
            display: none;
        }
        .create-user-page>div{
            width: 100%;
        }
        .create-user-page .content{
            padding: 50px;
            height: auto;
        }
    }
    form > *{
        display: block;
    }
    .error{
        margin-top: 10px;
        color: #e04122;
        font-weight: 500;
        text-align: left;
    }
    .btn-create{
        text-decoration: underline;
        color: royalblue;
        cursor: pointer;
        margin-top: 10px;
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
</style>