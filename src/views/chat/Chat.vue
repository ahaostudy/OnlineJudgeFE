<template>
  <Container :style="{ height: '100vh' }">
    <div style="margin: 50px 30px 30px">
      <TypographyTitle>ChatGPT (priview)</TypographyTitle>
    </div>
    <Chat></Chat>
  </Container>
</template>

<script setup>
import { TypographyTitle } from '@arco-design/web-vue'
import Container from '../../components/common/Container.vue'
import Chat from '../../components/pages/Problem/Chat.vue'

const localMsgs = localStorage.getItem('chat:')
if (!localMsgs?.length) {
  localStorage.setItem(
    'chat:0',
    JSON.stringify([{
      role: 'assistant',
      content: 'Hello.'
    }])
  )
}
</script>
