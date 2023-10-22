<template>
  <div>
    <a-avatar
      :image-url="props.avatar"
      :size="props.size"
      v-if="props?.avatar && props?.avatar !== ''"
      :trigger-icon-style="{
        minWidth: '15px',
        minHeight: '15px',
        width: `${props.size / 4}px`,
        height: `${props.size / 4}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }"
    >
      <template #trigger-icon v-if="props.showEditButton">
        <icon-edit
          @click="emit('click-icon')"
          :style="{
            minWidth: '9px',
            minHeight: '9px',
            width: `${props.size / 8}px`,
            height: `${props.size / 8}px`
          }"
        />
      </template>
    </a-avatar>
    <a-avatar
      :size="props.size"
      :style="{ backgroundColor: props.backgroundColor }"
      :trigger-icon-style="{
        minWidth: '15px',
        minHeight: '15px',
        width: `${props.size / 4}px`,
        height: `${props.size / 4}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }"
      v-else
    >
      {{ props.name.substring(0, 1).toUpperCase() }}
      <template #trigger-icon v-if="props.showEditButton">
        <icon-edit
          @click="emit('click-icon')"
          :style="{
            minWidth: '9px',
            minHeight: '9px',
            width: `${props.size / 8}px`,
            height: `${props.size / 8}px`
          }"
        />
      </template>
    </a-avatar>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

const props = defineProps({
  avatar: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  size: {
    type: Number,
    default: 30
  },
  backgroundColor: {
    type: String,
    default: '#165dff'
  },
  showEditButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click-icon'])
</script>
