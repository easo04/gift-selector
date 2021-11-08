<template>
    <div class="copy-input-group">
        <input type="text" class="form-control" id="url" v-model="url" autocomplete="off" disabled>
        <button class="btn-copy" @click="copyUrl()"><i class="fas fa-copy"></i></button>
    </div>
</template>
<script>
export default {
    props:['groupe'],
    data(){
        return{
            url:'http://localhost:8080/#/create-user?groupe=' + this.groupe.id
        }
    },
    methods:{
        copyUrl(){
            let copyText = document.getElementById("url");

            /* Select the text field */
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(copyText.value);
        }
    }
}
</script>
<style>
    .copy-input-group{
        display: flex;
        position: relative;
    }
    
    .copy-input-group .form-control{
        border-radius: 0;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        border:none;
        border-top: 1px solid #ced4da;
        border-left: 1px solid #ced4da;
        border-bottom: 1px solid #ced4da;
        font-family: 'Ubuntu', sans-serif;
    }
    .copy-input-group .btn-copy{
        background-color: #e9ecef;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border:none;
        border-top: 1px solid #ced4da;
        border-right: 1px solid #ced4da;
        border-bottom: 1px solid #ced4da;
        color:hsl(210, 29%, 24%);
        outline: none;
    }
    .copy-input-group .btn-copy:hover{
        color:hsl(212, 26%, 13%);
    }
</style>