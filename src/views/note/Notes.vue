<template>
  <div id="notes-container">
    <div>
      <Navbar default="5"></Navbar>
    </div>

    <Container>
      <a-tabs default-active-key="2">
        <a-tab-pane key="1" title="关注">
          <List></List>
        </a-tab-pane>
        <a-tab-pane key="2" title="推荐">
          <List></List>
        </a-tab-pane>
        <template #extra>
          <router-link to="/note/editor">
            <div class="btn-create-note">
              <icon-edit />
              写笔记
            </div>
          </router-link>
        </template>
      </a-tabs>
    </Container>
  </div>
</template>

<script setup>
import Navbar from '../components/common/Navbar.vue'
import List from '../components/pages/Notes/List.vue'
import Container from '../components/common/Container.vue'
</script>

<style scoped lang="less">
#notes-container {
  .btn-create-note {
    color: var(--color-neutral-6);
    cursor: pointer;
    user-select: none;
  }

  .btn-create-note:hover {
    color: var(--color-neutral-4);
  }
}
</style>

<style>
#notes-container .arco-tabs-tab {
  font-size: 18px;
  color: var(--color-neutral-6);
}
#notes-container .arco-tabs-nav {
  padding: 20px 0;
}
#notes-container .arco-tabs-nav::before {
  height: 0;
}
#notes-container .arco-tabs-content {
  padding-left: 20px;
}
#notes-container .arco-tabs-tab-active,
.arco-tabs-tab-active:hover {
  color: var(--color-neutral-10);
}
#notes-container .arco-tabs-nav-ink {
  background-color: var(--color-neutral-10);
}
</style>
