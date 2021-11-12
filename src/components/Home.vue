<template>
    <div class="home-page">
        <div class="alert alert-success alert-dismissible" v-show="showPasswordChanged">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Success!</strong> Le mot de passe a été modifié
        </div>
        <h3>Mes groupes</h3>
        <mes-groupes :groupes="lstGroupes" :user="currentUser" />
    </div>
</template>
<script>
    import {db} from '@/main'
    import firebase from 'firebase'
import MesGroupes from './MesGroupes.vue'
    export default {
    components: { MesGroupes },
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
h3{
    text-align: left;
    margin-bottom: 20px;
}
</style>
