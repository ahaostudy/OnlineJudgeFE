<template>
  <div id="app">
    <div class="container">
      <Container></Container>
    </div>
  </div>
</template>

<script setup>
import Container from '@/components/pages/Login/Container.vue'
</script>

<style scoped>
#app {
  height: 100vh;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  width: 280px;
  height: 380px;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  padding: 48px;

  border-radius: 10px;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
</style>
