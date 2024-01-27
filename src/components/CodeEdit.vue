<template>
    <div class="code-container rounded-sm" tabindex="0">
        <div class="code-select rounded-t-sm flex justify-between items-center px-2">
            <a-select :model-value="label" @update:modelValue="updateModelValue" :options="options" :unique-value="true"
                :max-tag-count="2" style="display: inline-flex; max-width: 300px;overflow-x: auto;" placeholder="选择标签"
                allow-clear :input-value="inputValue" multiple allow-create @update:input-value="onInput">
                <template #arrow-icon></template>
                <template #label="{ data }">
                    <span><icon-tag class="mr-1" />{{ data?.label }}</span>
                </template>
            </a-select>
            <a-space class="flex items-center">
                <a-dropdown-button @select="onSelect">
                    {{ lang || '纯文本' }}
                    <template #icon>
                        <icon-down />
                    </template>
                    <template #content>
                        <!-- <a-doption>纯文本</a-doption> -->
                        <a-doption v-for="l in langs" :key="l" :value="l">{{ l }}</a-doption>
                    </template>
                </a-dropdown-button>

                <code-menu :code="modelValue">
                    <a-doption @click="onFormatCode">
                        <template #icon>
                            <icon-drive-file size="18px" />
                        </template>
                        格式化代码
                    </a-doption>
                    <a-doption @click="onUpdateFile">
                        <template #icon>
                            <icon-folder-add size="18px" />
                        </template>
                        上传文件
                    </a-doption>
                </code-menu>
            </a-space>
        </div>
        <a-divider margin="0" />
        <div class="code  rounded-sm" ref="codeEl"></div>
    </div>
</template>
<script>
import { templateRef } from "@vueuse/core"
import { onMounted, ref, toRefs, unref } from 'vue'
import { clone, trim } from "lodash-es"
import CodeMenu from './CodeMenu.vue'
import CodeMirror from 'codemirror/lib/codemirror'
import "codemirror"
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/css/css'
import 'codemirror/mode/dockerfile/dockerfile'
import 'codemirror/mode/dart/dart'
import 'codemirror/mode/python/python'
import 'codemirror/mode/rust/rust'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/shell/shell'
import 'codemirror/mode/php/php'
import 'codemirror/mode/go/go'
import 'codemirror/mode/markdown/markdown'
import '@/utils/formatCode'

//shell、yaml、dockerfile、dart、python、rust、markdown、java,c,cpp、htmlmixed、css、javascript、sql
const clikeObject = {
    'java': 'text/x-java',
    'c': 'text/x-csrc',
    'c++': 'text/x-c++src',
    html: 'htmlmixed',
}
export default {
    name: "CodeEdit",
    install(Vue) {
        Vue.component(this.name, this)
    },
    components: {
        CodeMenu
    },
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        tags: {
            type: Array,
            default: () => ([])
        },
        options: {
            type: Array,
            default: () => ([])
        },
        language: {
            type: String,
            default: ''
        },
        defaultTags: {
            type: Array,
            default: () => ([])
        }
    },
    emits: ['update:modelValue', 'update:language', 'update:tags'],
    setup(props, { emit }) {
        const { modelValue, language, defaultTags } = toRefs(props)
        let codeMirror = null
        const langs = ref([])
        const lang = ref(unref(language))
        const codeEl = templateRef('codeEl')
        const inputValue = ref('')
        const label = ref(unref(defaultTags) || [])

        const onSelect = (value) => {
            if (unref(lang) === value) return
            localStorage.setItem('language', value)
            emit('update:language', value)
            lang.value = value

            if (clikeObject[value]) {
                codeMirror.setOption('mode', clikeObject[value])
                return
            }
            codeMirror.setOption('mode', langs.value.includes(value) ? value : null)
        }

        const getModes = (modesObj) => {
            console.log(modesObj)
            const cloneModes = clone(modesObj)
            delete cloneModes['vue-template']
            cloneModes['java'] = cloneModes.clike
            cloneModes['c'] = cloneModes.clike
            cloneModes['c++'] = cloneModes.clike
            cloneModes['html'] = cloneModes.htmlmixed
            delete cloneModes['clike']
            delete cloneModes['htmlmixed']
            return Array.from(Object.keys(cloneModes)).filter(mode => mode !== 'null').sort((a, b) => {
                let aLower = a.toLowerCase();
                let bLower = b.toLowerCase();
                if (aLower < bLower) {
                    return -1;
                } else if (aLower > bLower) {
                    return 1;
                } else {
                    return 0;
                }
            })
        }


        const onInput = (value) => {
            const content = trim(value)
            //不多于10个字符
            if (content.length > 15) return
            inputValue.value = value
        }

        const updateModelValue = (values) => {
            label.value = values
            emit('update:tags', values)
        }

        const onFormatCode = () => {
            let totalLines = codeMirror.lineCount();
            codeMirror.autoFormatRange({ line: 0, ch: 0 }, { line: totalLines });
        }

        //上传文件，读取内容
        const onUpdateFile = () => {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.onchange = (e) => {
                const file = e.target.files[0]
                const reader = new FileReader();
                reader.readAsText(file, 'UTF-8');
                reader.onload = function (e) {
                    codeMirror.setOption('value', e.target.result)
                }
            }
            document.body.appendChild(input)
            input.click()
            input.remove()
        }


        onMounted(() => {
            langs.value = getModes(CodeMirror.modes)
            codeMirror = CodeMirror(unref(codeEl), {
                value: unref(modelValue),
                mode: clikeObject[unref(language)] ? clikeObject[unref(language)] : (unref(language) || null),
                theme: 'default',
                lineNumbers: true,
            });
            codeMirror.on('change', (codeMirror) => {
                const { doc } = codeMirror
                emit('update:modelValue', doc.getValue())
            })
        })

        return {
            onUpdateFile,
            label,
            langs,
            lang,
            onSelect,
            onInput,
            inputValue,
            updateModelValue,
            onFormatCode
        }
    },
}
</script>
<style lang="less" scoped>
@import "codemirror/lib/codemirror.css";

.code-container {
    :deep {
        .arco-select-view-input {
            opacity: 0;
        }

        &:focus-within,
        &:hover {
            .arco-select-view-input {
                opacity: 1;
            }
        }
    }


}

.code-select {
    height: 40px;
    background-color: #f2f3f5;

    :deep {
        .arco-dropdown-open .arco-icon-down {
            transform: rotate(180deg);
        }

        .arco-select-view-tag {
            color: rgb(22, 93, 255);
            background-color: rgb(232, 243, 255);
            border-color: transparent;
        }

        .arco-select-view-inner {
            display: inline-flex;

            .arco-tag {
                flex-shrink: 0;
            }
        }
    }
}

.code {
    height: 400px;

    :deep {
        .CodeMirror {
            height: 100%;
            background-color: #f2f3f5;
        }
    }
}
</style>