<template>
    <div style="width: 100%; height: 100%; "
         @transform="transform"
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
            offset: Object,
        },
        data: function () {
            return {
                shouldReset: true,
            }
        },
        methods: {
            transform() {
                if (this.shouldReset === true) {
                    this.shouldReset = false
                    this.reset()
                }
            },
            moveTo(x, y) {
                let tf = this.pz.getTransform()
                let scaleP = tf.scale / this.pz.getMaxZoom()
                this.pz.moveTo(-this.offset.x * tf.scale - x * scaleP, -this.offset.y * tf.scale - y * scaleP)
            },
            reset() {
                this.moveTo(0, 0)
            },
        },
        mounted() {
            this.pz = panzoom(this.$el, this.options)

            let zoom = this
            this.pz.on('transform', function (e) {
                let ev = new CustomEvent('transform', {bubbles: true, detail: e})
                zoom.$el.firstElementChild.dispatchEvent(ev)
            })

            this.pz.zoomAbs(0,0,3)
        },
        destroyed() {
            this.pz.dispose()
        },
    }
</script>

<style scoped>

</style>