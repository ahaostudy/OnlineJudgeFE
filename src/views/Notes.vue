<template>
  <div>
    <div>
      <Navbar default="5"></Navbar>
    </div>

    <Container>
      <a-carousel
        :autoPlay="true"
        animation-name="card"
        show-arrow="never"
        indicator-position="outer"
        :style="{
          height: '240px'
        }"
      >
        <a-carousel-item v-for="image in images" :style="{ width: '60%' }">
          <img
            :src="image"
            :style="{
              width: '100%'
            }"
          />
        </a-carousel-item>
      </a-carousel>

      <List></List>
    </Container>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import Navbar from '../components/common/Navbar.vue'
import List from '../components/pages/Notes/List.vue'
import Container from '../components/common/Container.vue'

const images = reactive([
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp',
  'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp'
])
</script>

<style scoped lang="less">
#notes-container {
  display: flex;
  justify-content: center;
}
</style>
