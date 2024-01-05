import { nextTick } from "vue"

export default {
    top: 0,
    setTop(scrollTop = 0) {
        this.top = scrollTop
    },
    scrollTo() {
        const top = this.top
        if (!top) return
        // 回退到原有的滚动位置处
        nextTick(() => {
            document.documentElement.scrollTo({
                top,
                left: 0
            })
        })
    }
}