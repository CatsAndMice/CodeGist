<template>
    <div class="code-container rounded-sm">
        <div class="code-select rounded-t-sm flex justify-end items-center pr-1">
            <a-dropdown-button @select="onSelect">
                {{ lang || '纯文本' }}
                <template #icon>
                    <icon-down />
                </template>
                <template #content>
                    <a-doption>纯文本</a-doption>
                    <a-doption v-for="l in langs" :key="l" :value="l">{{ l }}</a-doption>
                </template>
            </a-dropdown-button>
        </div>
        <a-divider margin="0" />
        <div class="code  rounded-sm" ref="codeEl"></div>
    </div>
    <!-- <code-block code="const a = 1;" language="javascript" /> -->
</template>
<script>
import { templateRef } from "@vueuse/core"
import { onMounted, ref, toRefs, unref } from 'vue'
import { clone, } from "lodash-es"
import CodeMirror from 'codemirror/lib/codemirror'
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
//shell、yaml、dockerfile、dart、python、rust、markdown、java,c,cpp、htmlmixed、css、javascript、sql
const clikeObject = {
    'java': 'text/x-java',
    'c': 'text/x-csrc',
    'c++': 'text/x-c++src',
    html: 'htmlmixed'
}
export default {
    name: "CodeEdit",
    install(Vue) {
        Vue.component(this.name, this)
    },
    props: {
        modelValue: {
            type: String,
            default: ''
        },

        language: {
            type: String,
            default: ''
        },
    },
    emits: ['update:modelValue', 'update:language'],
    setup(props, { emit }) {
        const { modelValue, language } = toRefs(props)
        let codeMirror = null
        const langs = ref([])
        const lang = ref(unref(language))
        const codeEl = templateRef('codeEl')

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
            const cloneModes = clone(modesObj)
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
            langs,
            lang,
            onSelect,
        }
    },
}
</script>
<style lang="less" scoped>
@import "codemirror/lib/codemirror.css";

.code-select {
    height: 40px;
    background-color: #f2f3f5;

    :deep {
        .arco-dropdown-open .arco-icon-down {
            transform: rotate(180deg);
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