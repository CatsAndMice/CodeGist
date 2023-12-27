<template>
    <n-input v-model:value="description" type="text" placeholder="添加描述" maxlength="200" class="mb-4" />
    <!-- <n-input v-model:value="fileName" type="text" placeholder="文件名" maxlength="10" class="mb-4" /> -->
    <!-- 代码块选择/编辑器 -->
    <n-input v-model:value="code" type="textarea" class="mb-4" placeholder="内容" style="min-height: 300px;" autosize />
    <div class="flex justify-end">
        <n-button type="primary" class="ml-auto" @click="onCreate">
            创建
        </n-button>
    </div>
</template>
<script>
import { shallowRef } from 'vue'
import { v4 as uuidv4 } from 'uuid'
export default {
    setup() {
        const description = shallowRef('')
        const code = shallowRef('')

        const onCreate = () => {
            console.log(description.value, code.value, uuidv4());
        }

        return {
            description,
            code,
            onCreate
        }
    },
}
</script>
<style lang="less" scoped></style>