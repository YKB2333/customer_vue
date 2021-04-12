<template>
  <img 
    :src="require('@/assets/images/client_icon_home.png')" 
    width="44" 
    height="44" style="position: fixed;right: 18px;bottom:100px;z-index: 9999;" 
    @click="$router.push({ name: 'Home' })"
  />
</template>