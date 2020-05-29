<template>
    <div style="width: 100%; height: 100%; "
    >
        <slot></slot>
    </div>
</template>

<script>
    // import _ from 'lodash'
    import panzoom from 'panzoom'

    export default {
        name: "zoom",
        props: {
            options: Object,
        },
        data: function () {
            return {}
        },
        methods: {
            reset() {
                let elm = this.$el.firstElementChild
                let rect = elm.getBoundingClientRect()
                let zw = rect.width
                let zh = rect.height
                this.pz.zoomTo(zw * 3, zh * 3, 5)
            },
        },
        mounted() {
            this.pz = panzoom(this.$el, this.options)

            this.reset()

            let zoom = this
            this.pz.on('transform', function (e) {
                let ev = new CustomEvent('transform', {bubbles: true, detail: e})
                zoom.$el.dispatchEvent(ev)
            })
        },
        destroyed() {
            this.pz.dispose()
        },
    }
</script>

<style scoped>

</style>