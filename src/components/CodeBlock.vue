<template>
    <n-config-provider :hljs="hljs">
        <div class="code-container rounded-sm overflow-hidden " :style="customStyle">
            <div class="code-select rounded-sm flex justify-between items-center pr-2">
                <div class="mr-5 grow overflow-x-auto" style="display: inline-flex;">
                    <a-tag v-for="tag in tags" :key="tag" :checked="true" color="arcoblue" class="ml-2 shrink-0">
                        <template #icon>
                            <icon-tag />
                        </template>
                        {{ tag }}
                    </a-tag>
                </div>
                <a-space class="flex items-center">
                    <span class="shrink-0"> {{ language || '纯文本' }}</span>
                    <slot name="menu">
                        <code-menu :code="code" />
                    </slot>
                </a-space>
            </div>
            <a-divider margin="0" />
            <div :class="isText ? 'code  rounded-sm' : 'code  rounded-sm px-3'" style="overflow-x: auto;">
                <n-code :code="code" :language="getLanguage(language)" show-line-numbers ref="code" />
            </div>
        </div>
    </n-config-provider>
</template>
<script>
import { NCode, NConfigProvider } from "naive-ui"
import { eq, hasIn, upperCase } from "lodash-es"
import CodeMenu from "./CodeMenu.vue"
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import java from "highlight.js/lib/languages/java"
import css from "highlight.js/lib/languages/css"
import sql from "highlight.js/lib/languages/sql"
import xml from "highlight.js/lib/languages/xml"
import yaml from "highlight.js/lib/languages/yaml"
import c from "highlight.js/lib/languages/c"
import cpp from "highlight.js/lib/languages/cpp"
import dockerfile from "highlight.js/lib/languages/dockerfile"
import shell from "highlight.js/lib/languages/shell"
import dart from "highlight.js/lib/languages/dart"
import python from "highlight.js/lib/languages/python"
import rust from "highlight.js/lib/languages/rust"
import php from "highlight.js/lib/languages/php"
import go from "highlight.js/lib/languages/go"
import { toRefs, unref } from 'vue'

const modes = {
    javascript,
    java,
    css,
    xml,
    sql,
    shell,
    rust,
    php,
    python,
    c,
    go,
    dart,
    yaml,
    cpp,
    dockerfile
}
Object.keys(modes).forEach(m => {
    hljs.registerLanguage(m, modes[m])
})

export default {
    name: "CodeBlock",
    install(Vue) {
        Vue.component(this.name, this)
    },
    components: {
        NCode,
        CodeMenu,
        NConfigProvider
    },
    props: {
        customStyle: {
            type: Object,
            default: () => {
                return {}
            }
        },
        code: {
            type: String,
            default: ''
        },
        language: {
            type: String,
            default: ''
        },
        tags: {
            type: Array,
            default: () => ([])
        }
    },
    setup(props) {
        const { language } = toRefs(props)
        const isText = hasIn(modes, unref(language))
        const getLanguage = (language) => {
            const l = unref(language)
            //html 要大写
            if (eq(l, 'html')) {
                return upperCase(l)
            }

            return language
        }
        return {
            hljs,
            isText,
            getLanguage
        }
    },
}
</script>
<style lang="less" scoped>
.code-select {
    height: 40px;
    background-color: #f2f3f5;
}

.code {
    background-color: #f2f3f5;

    :deep {
        .n-code__line-numbers {
            padding-right: 3px;
            margin-right: 4px;
            padding-left: 5px;
            border-right: 1px solid #ddd;
            background-color: #f7f7f7;
            color: #999;
        }
    }
}
</style>