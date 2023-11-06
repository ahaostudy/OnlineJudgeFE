<template>
  <a-split id="console" direction="vertical" :default-size="0.6" :max="0.86">
    <template #first>
      <a-typography-paragraph>
        <div id="sample">
          <a-radio-group
            type="button"
            v-model="props.sample"
            @change="changeSample"
          >
            <a-radio v-for="(_, i) in props.problem.samples" :value="i"
              >示例 {{ i + 1 }}</a-radio
            >
          </a-radio-group>
          <div
            v-for="(_, i) in props.problem.samples"
            v-show="props.sample == i"
          >
            <a-typography-title :heading="6" class="sample-title">
              示例 {{ i + 1 }}
            </a-typography-title>
            <a-form layout="vertical">
              <a-form-item label="自测输入">
                <a-textarea
                  v-model="props.problem.samples[i].input"
                  :auto-size="{ minRows: 1, maxRows: 20 }"
                  @input="changeProblem"
                />
              </a-form-item>
              <a-form-item label="实际输出">
                <a-textarea
                  v-model="props.problem.samples[i].output"
                  :auto-size="{ minRows: 1, maxRows: 20 }"
                  @input="changeProblem"
                />
              </a-form-item>
            </a-form>
          </div>
        </div>
      </a-typography-paragraph>
    </template>
    <template #second>
      <a-typography-paragraph>
        <div
          id="result"
          v-for="(_, i) in props.problem.samples"
          v-show="props.sample == i"
        >
          <a-alert
            :type="constStore.GetStatus(props.problem.status[i]).type"
            :title="constStore.GetStatus(props.problem.status[i]).status"
            v-show="constStore.GetStatus(props.problem.status[i]).status.length"
          >
            <div
              v-html="
                props.problem.stdouts[i]
                  .replaceAll('\n', '<br>')
                  .replaceAll(' ', '&ensp;')
              "
            ></div>
          </a-alert>
        </div>
      </a-typography-paragraph>
    </template>
  </a-split>
</template>

<script setup>
import { defineEmits } from 'vue'
import { useConstStore } from '@/store/const'

const emit = defineEmits(['update:problem', 'update:sample'])
const constStore = useConstStore()

const props = defineProps({
  problem: {
    require: true
  },
  sample: {
    require: true
  },
  status: {
    default: 12
  },
  title: {
    default: ''
  },
  type: {
    default: ''
  },
  stdout: {
    default: ''
  }
})

function changeProblem() {
  emit('update:problem', props.problem)
}

function changeSample(value) {
  emit('update:sample', value)
}
</script>

<style scoped>
#console {
  height: 100%;
}

#sample {
  margin: 40px 60px;

  .sample-title {
    margin: 24px 0;
  }
}

#result {
  padding: 40px 60px;
}
</style>
