<template>
    <div style="width: 100%; height: 100%; touch-action: none; "
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
            dblclick: Function,
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
                this.pz.moveBy(150, 150)
            },
            zoom(z) {
                let tf = this.pz.getTransform()
                this.pz.zoomAbs(tf.x, tf.y, z)
            },
            reset() {
                this.moveTo(0, 0)
            },
        },
        mounted() {
            let z = this
            let elm = this.$el
            let opts = this.options
            opts.zoomDoubleClickSpeed = 1
            opts.onDoubleClick = function (e) {
                z.dblclick(e)

                let rect = elm.getBoundingClientRect()
                let tf = z.pz.getTransform()
                Object.defineProperty(e, 'clientX', {get: function () {
                        return -tf.x + rect.x
                    }})
                Object.defineProperty(e, 'clientY', {get: function () {
                        return -tf.y + rect.y
                    }})

                return false
            }
            this.pz = panzoom(this.$el, opts)

            let zoom = this
            this.pz
                .on('transform', function (e) {
                    let ev = new CustomEvent('transform', {
                        bubbles: true,
                        detail: {
                            getTransform: e.getTransform,
                            getScaledTransform: function () {
                                let r = zoom.$el.getBoundingClientRect()
                                let rc = zoom.$el.firstElementChild.getBoundingClientRect()
                                let rp = zoom.$el.parentNode.getBoundingClientRect()
                                console.log(r.x, r.y, rp.x, rp.y, rc.x, rc.y)
                            }
                        }
                    })
                    zoom.$el.firstElementChild.dispatchEvent(ev)
                })

            this.pz.zoomAbs(0, 0, 3)
        },
        destroyed() {
            this.pz.dispose()
        },
    }
</script>

<style scoped>

</style>