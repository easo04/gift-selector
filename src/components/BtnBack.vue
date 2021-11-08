<template>
    <div class="btn-back">
        <a @click="back()">Back</a>
    </div>
</template>
<script>
export default {
    methods:{
        back(){
            this.$router.go(-1);
        }
    }
}
</script>
<style>
    .btn-back{
        text-align: left;
        font-family: 'Ubuntu', sans-serif;
        font-size: 0.8em;
        text-decoration: underline;
        color: royalblue;
        font-weight: 600;
        margin-bottom: 30px;
    }
</style>