<template>
    <a-dropdown @click.stop position="br" :popup-container="popupContainer || 'body'">
        <a-button class="code-menu">
            <template #icon>
                <icon-more size="24px" />
            </template>
        </a-button>
        <template #content>
            <a-doption @click.stop="onCopy">
                <template #icon>
                    <icon-copy size="18px" />
                </template>
                复制代码
            </a-doption>
        </template>
    </a-dropdown>
</template>
<script>
import { toRefs, unref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { hasIn, uniqueId } from "lodash-es"
export default {
    props: {
        code: {
            type: String,
            default: ''
        },
        popupContainer: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const { code } = toRefs(props)
        const codeMenuClass = uniqueId('code-menu')
        const onCopy = () => {
            const type = "text/plain";
            const blob = new Blob([unref(code)], { type });
            const data = [new ClipboardItem({ [type]: blob })];
            if (hasIn(window, 'utools')) {
                try {
                    utools.copyText(unref(code))
                    Message.success({
                        showIcon: true,
                        closable: true,
                        content: '复制成功'
                    })
                } catch (e) {
                    Message.error({
                        showIcon: true,
                        closable: true,
                        content: '复制失败'
                    })
                }
                return
            }

            navigator.clipboard.write(data).then(
                () => {
                    Message.success({
                        showIcon: true,
                        closable: true,
                        content: '复制成功'
                    })
                },
                () => {
                    Message.error({
                        showIcon: true,
                        closable: true,
                        content: '复制失败'
                    })
                },
            );
        }

        return {
            onCopy,
            codeMenuClass
        }
    },
}
</script>