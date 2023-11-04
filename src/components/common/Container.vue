<template>
  <a-row id="container">
    <a-col
      :span="props.col"
      :style="{
        minWidth: `${props.minWidth}px`,
        maxWidth: `${props.maxWidth}px`,
        margin: 'auto'
      }"
    >
      <slot></slot>
    </a-col>
  </a-row>
</template>

<script setup>
const props = defineProps({
  col: {
    type: Number,
    default: 18
  },
  minWidth: {
    type: Number,
    default: 800
  },
  maxWidth: {
    type: Number,
    default: 1300
  }
})
</script>
