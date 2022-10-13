<template>
    <div class="mon-profil">
        <h3>Mon profil</h3>
        <div><span class="label">Nom: </span>{{user.prenom}} {{user.nom}}</div>
        <div><span class="label">Email: </span>{{user.email}}</div>
        <div class="modifier-password">
            <button class="btn btn-action" data-toggle="modal" data-target="#modalPasswordChanged">Modifier mot de passe</button>
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
export default {
    data(){
        return{
            user:{},
            modelPassword:{
                newPassword:undefined,
                confirmPassword:undefined
            }
        }
    },
    methods:{
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
    mounted(){
        this.user = JSON.parse(sessionStorage.getItem('user'));
    }
    
}
</script>
<style>
    .mon-profil h3{
        text-align: left;
        margin-bottom: 10px;
        font-family: 'Ubuntu', sans-serif;
    }

    .mon-profil{
        padding: 50px 200px;
        color: hsl(210, 29%, 24%);
        background: #fdfdfd;
        font-family: 'Ubuntu', sans-serif;
        text-align: left;
    }

    @media screen and (max-width: 769px){
        .mon-profil{
            padding: 20px;
        }
    }
    .label{
        font-weight: 600;
    }

    .modifier-password{
        margin-top:20px;
        height: 60px;
        width: 100%;
    }
    .modifier-password .btn{
        float: left;
        font-family: 'Ubuntu', sans-serif;
        padding: 10px;
        cursor: pointer;
        background: transparent;
        border:none;
        border-radius: 5px;
        color: hsl(210, 29%, 24%);
        font-weight: 500;
        border:1px solid hsl(210, 29%, 24%);
    }
</style>