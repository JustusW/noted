<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
    import panzoom from "panzoom";

    export default {
        name: "zoom",
        props: {
            anchor: Object,
        },
        mounted() {
            this.pz = panzoom(this.$el, {
                minZoom: 0.2,
                maxZoom: 1,
                zoomDoubleClickSpeed: 1,
            })
            let zoom = this
            this.pz.on('transform', function (e) {
                let tf = e.getTransform()
                zoom.$set(zoom.anchor, 'scale', tf.scale)
            })
            this.reset()
        },
        destroyed() {
            this.pz.dispose()
        },
        methods: {
            reset(scale) {
                if (!scale) {
                    scale = 5.
                }
                let pz = this.pz
                pz.moveTo(10,10)
                pz.moveTo(0,0)
                pz.zoomAbs(0,0, scale/5)
            },
            focus(item) {
                let pz = this.pz

                pz.moveTo(0,0)
                pz.moveTo(-item.x + 20,-item.y + 20)
            }
        },
    }
</script>

<style scoped>

</style>