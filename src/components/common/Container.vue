<template>
  <a-row id="container">
    <a-col
      :span="18"
      :style="{ minWidth: '800px', maxWidth: '1300px', margin: 'auto' }"
      id="box"
    >
      <slot></slot>
    </a-col>
  </a-row>
</template>
