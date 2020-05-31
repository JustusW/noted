<template>
    <div
            v-on:move.prevent.stop="move"
            v-on:resize.prevent.stop="resize"
            :style="style()">
        <slot></slot>
    </div>
</template>

<script>
    import interact from 'interactjs'

    export default {
        name: "dragresize",
        props: {
            box: Object,
            scale: Number,
        },
        data() {
            return {
                rect: this.box
            }
        },
        methods: {
            style() {
                return ['touch-action: none',
                    'position: absolute',
                    'z-index: ' + this.rect.z,
                    'left: ' + this.rect.x + 'px',
                    'top: ' + this.rect.y + 'px',
                    'width: ' + this.rect.w + 'px',
                    'height: ' + this.rect.h + 'px',
                '',].join('; ')
            },
            resize(e) {
                let event = e.detail
                this.rect.w += event.deltaRect.width
                this.rect.h += event.deltaRect.height
                this.rect.x += event.deltaRect.left
                this.rect.y += event.deltaRect.top
            },
            move(e) {
                let event = e.detail
                this.rect.x += event.dx * (this.scale || 1)
                this.rect.y += event.dy * (this.scale || 1)
            }
        },
        mounted() {
            this.$watch('box.z', function (v) {
                this.rect.z = v
            })
            this.$watch('box.x', function (v) {
                this.rect.x = v
            })
            this.$watch('box.y', function (v) {
                this.rect.y = v
            })
            let dr = this
            this.i = interact(this.$el)
                .resizable({
                    edges: { left: true, right: true, bottom: true, top: true },
                    listeners: {
                        move(e) {
                            dr.$el.dispatchEvent(new CustomEvent('resize', {detail: e}))
                        }
                    },
                }).draggable({
                    listeners: {
                        move(e) {
                            dr.$el.dispatchEvent(new CustomEvent('move', {detail: e}))
                        }
                    },
                })
        }
    }
</script>

<style scoped>

</style>