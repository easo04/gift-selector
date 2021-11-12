import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import CreateUser from '@/components/CreateUser'
import DetailsGroupe from '@/components/DetailsGroupe'
import DetailsGroupeSelectOnly from '@/components/DetailsGroupeSelectOnly'
import Groupes from '@/components/Groupes'
import DetailsGroupeRandom from '@/components/DetailsGroupeRandom'
import MesCadeaux from '@/components/MesCadeaux'
import MotPasseOublie from '@/components/MotPasseOublie'
import GroupeDetail from '@/components/GroupeDetail'
import monProfil from '@/components/MonProfil'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path:'*',
      redirect:'/login'
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta:{
        auth:true
      }
    },
    {
      path: '/details-groupe',
      name: 'detailsGroupe',
      component: DetailsGroupe,
      meta:{
        auth:true
      },
      props:true,
    },
    {
      path: '/details-groupe-only',
      name: 'detailsGroupeOnly',
      component: DetailsGroupeSelectOnly,
      meta:{
        auth:true
      },
      props:true,
    },
    {
      path: '/details-groupe-ramdom',
      name: 'detailsGroupeRandom',
      component: DetailsGroupeRandom,
      meta:{
        auth:true
      },
      props:true,
    },
    {
      path: '/mes-cadeaux',
      name: 'mesCadeaux',
      component: MesCadeaux,
      meta:{
        auth:true
      },
      props:true,
    },
    {
      path: '/all-groupes',
      name: 'allGroupes',
      component: Groupes,
      meta:{
        auth:true
      },
      props:true,
    },
    {
      path: '/create-user',
      name: 'createUser',
      component: CreateUser,
    },
    {
      path: '/password-update',
      name: 'MotPasseOublie',
      component: MotPasseOublie,
    },
    {
      path: '/groupe-detail',
      name: 'groupeDetail',
      component: GroupeDetail,
      meta:{
        auth:true
      },
      props:true,
    },
    {
      path: '/mon-profil',
      name: 'monProfil',
      component: monProfil,
      meta:{
        auth:true
      },
      props:true,
    },
  ]
})

router.beforeEach((to, from, next) =>{
  let user = firebase.auth().currentUser
  let autorisation = to.matched.some(record => record.meta.auth)

  if(autorisation && !user){
    next('login')
  }else if(!autorisation && user){
    next('home')
  }else{
    next()
  }
})

export default router;
