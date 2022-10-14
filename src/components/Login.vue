<template>
    <div class="login-page">
        <div class="content">
            <div>
                <h1><span class="gift">Gift</span> Selector</h1>
                <h6>Bienvenue à Gift Selector!</h6>
                <div class="error" v-if="error">
                    * {{error}}
                </div> 
                <div class="form-login">
                    <form @submit.prevent="login()">
                        <input type="text" placeholder="Email" v-model="user" class="input-text">
                        <input type="password" placeholder="Mot de passe" v-model="password" class="input-text">
                        <input type="submit" value="Se connecter" class="btn-login">
                    </form>
                    <a class="btn-update-mdp" @click="mdpOublie()">Mot de passe oublié</a>
                </div> 
            </div>
        </div>
    </div>
</template>
<script>
    import firebase from 'firebase'
    export default {
        data() {
            return {
                user:'',
                password:'',
                error:undefined
            }
        },
        methods: {
            login(){
                firebase.auth().signInWithEmailAndPassword(this.user, this.password).then(user =>{
                    this.$router.replace('home')
                }, error =>{
                    switch (error.code) {
                        case 'auth/invalid-email':
                            this.error = 'L\'email est invalide'
                            break;
                        case 'auth/wrong-password':
                            this.error = 'Mot de passe invalide'
                            break;
                        case 'auth/user-not-found':
                            this.error = 'L\'usager n\'existe pas'
                            break;
                        default:
                            this.error = 'Erreur'
                            break;
                    }
                    console.log(error)
                });
            },
            createUser(){
                this.$router.replace('create-user')
            },
            mdpOublie(){
                this.$router.replace('password-update')
            }
        }
    }
</script>
<style scoped>
    .login-page{
        min-height: 100vh;
        display: flex;
        color: hsl(210, 29%, 24%);
        font-family: 'Ubuntu', sans-serif;
        align-items: center;
        justify-content: center;
        padding: 0 20px;

        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;
        background-position: top;
        background-image: url(https://images8.alphacoders.com/889/889089.jpg);
        width: 100%;
        height: 100%;
        letter-spacing: 0.02em;
        font-weight: 400;
        -webkit-font-smoothing: antialiased;
    }
    .login-page h1{
        font-weight: 600;
        font-family: 'Pacifico', cursive; 
        margin-bottom: 50px;
    }

    .login-page h6{
        text-align: left;
    }

    .login-page .content{
        border: 2px solid #69c2fa;
        border-radius: 50px;
        padding: 100px;
        background: #ffde8ff2;
    }
    @media screen and (max-width: 769px){
        
        .login-page >div{
            width: 100%;
        }
        .login-page .content{
            padding: 50px;
        }
    }
    .form-login{
        display: flex;
        flex-direction: column;
        margin-top: 10px;
    }
    form > *{
        display: block;
    }
    .btn-login{
        font-family: 'Ubuntu', sans-serif;
        float: right;
        padding: 10px;
        cursor: pointer;
        background: #549bc8;
        border:none;
        border-radius: 5px;
        color: hsl(210, 29%, 24%);
        font-weight: 500;
        margin-top: 20px;
    }
    .btn-login:hover{
        background: #4a88af;
    }
    .input-text{
        margin-bottom: 5px;
        height: 40px;
        width: 100%;
        border-radius: 5px;
        border:1px solid #a1a1a1;
        margin-bottom: 10px;
    }
    .error{
        margin-top: 10px;
        color: #e04122;
        font-weight: 500;
        text-align: left;
    }
    .btn-create{
        text-decoration: underline;
        color: hsl(210, 29%, 24%);
        cursor: pointer;
        margin-top: 30px;
        text-align: right;
        font-weight: 500;
        width: 100%;
        font-family: 'Ubuntu', sans-serif;
    }
    .btn-update-mdp{
        text-decoration: underline;
        color: #549bc8;
        cursor: pointer;
        margin-top: 10px;
        text-align: right;
        font-weight: 500;
        width: 100%;
        font-family: 'Ubuntu', sans-serif;
    }
</style>
            