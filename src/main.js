import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/style.css'

// TODO: 全局导入，仅开发时使用
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';

// acro design 图标
import ArcoVueIcon from '@arco-design/web-vue/es/icon';

// v-md-editor
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';

// katex
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';

VMdPreview.use(githubTheme, {
    Hljs: hljs,
});
VMdPreview.use(createKatexPlugin());

const app = createApp(App)

app.use(VMdPreview)
app.use(createPinia())
app.use(router)
app.use(ArcoVue);
app.use(ArcoVueIcon)
app.mount('#app')
