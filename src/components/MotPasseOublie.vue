<template>
    <div class="mdp-oublie-page">
        <div class="image">
            <img src="../assets/gift.svg">
        </div>
        <div class="content">
            <div v-if="!emailSended">
                <h2>Mot de passe oublié</h2>
                <div class="form-create">
                    <h6>Indiquez l'adresse email associée à votre compte pour générer un nouveau mot de passe.</h6>
                    <form @submit.prevent="sendEmail()">
                        <div class="form-group">
                            <label for="prenom">Adresse email:</label>
                            <input type="text" class="form-control" id="prenom" v-model="email">
                        </div>
                        <button type="submit" class="btn btn-action" :disabled="!isFormValid()" :class="{'disabled':!isFormValid()}">Valider</button>
                    </form>
                </div>
            </div>
            <div v-else>
                <h2>Mot de passe oublié</h2>
                <h6>Un message a été envoyé à l'adresse email {{email}} pour modifier votre mot de passe.</h6>
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
                email:undefined,
                emailSended:false
            }
        },
        methods: {
            isFormValid(){
                return this.email;
            },
            sendEmail(){
                try{
                    let auth = firebase.auth()
                    auth.sendPasswordResetEmail(this.email).then(() => {
                        console.log('email envoyé')
                        this.emailSended = true
                    }).catch((error) => {  
                        console.log(error)
                        this.emailSended = true
                    });
                }catch(e){
                    console.log(e);
                }
            },
        }
    }
</script>
<style scoped>
    .mdp-oublie-page{
        min-height: 100vh;
        display: flex;   
        font-family: 'Yatra One', cursive;
        background: #fdfdfd;
        flex-wrap: wrap;
    }
    .mdp-oublie-page>div{
        width: 50%;
    }
    .mdp-oublie-page .image{
        background: #e1f3fe;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .mdp-oublie-page .image img{
        width: 70%;
        height: auto;
    }
    .mdp-oublie-page .content{
        padding: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .mdp-oublie-page .content h6{
        text-align: left;
        font-family: 'Ubuntu', sans-serif;
        color:#666666;
    }
    @media screen and (max-width: 769px){
        .mdp-oublie-page .image{
            display: none;
        }
        .mdp-oublie-page>div{
            width: 100%;
        }
        .mdp-oublie-page .content{
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