<template>
  <router-link
    :to="props.to"
    :style="{
      height: `${props.size}px`,
      cursor: 'pointer',
      ...props.style
    }"
  >
    <img
      alt="online judge"
      src="../../assets/logo.svg"
      :style="{
        height: `${props.size}px`,
      }"
    />
  </router-link>
</template>

<script setup>
const props = defineProps({
  to: {
    type: String,
    default: '/'
  },
  size: {
    type: Number,
    default: 26
  },
  style: {
    type: Object,
    default: {}
  }
})
</script>
