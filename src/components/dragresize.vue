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
            drop: Boolean,
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
                this.rect.w += event.deltaRect.width / this.scale
                this.rect.h += event.deltaRect.height / this.scale
                this.rect.x += event.deltaRect.left / this.scale
                this.rect.y += event.deltaRect.top / this.scale
            },
            move(e) {
                let event = e.detail
                this.rect.x += event.dx / this.scale
                this.rect.y += event.dy / this.scale
            },
            setInteract(reset) {
                this.i = interact(this.$el)

                if (this.rect.locked || reset) {
                    this.i.unset()
                    if (!reset) {
                        return
                    }
                }

                if (this.drop === true) {
                    this.i.dropzone({
                        overlap: 0.75,
                        ondropactivate: function (event) {
                            event.target.classList.add('drop-active')
                        },
                        ondropdeactivate: function (event) {
                            event.target.classList.remove('drop-active')
                            event.target.classList.remove('drop-target')
                        },
                        ondragenter: function (event) {
                            event.target.classList.add('drop-target')
                        },
                        ondragleave: function (event) {
                            event.target.classList.remove('drop-target')
                        },
                        ondrop: function (event) {
                            let ev = new Event('dropped', {bubbles: true})
                            event.relatedTarget.dispatchEvent(ev)
                            event.target.dispatchEvent(ev)
                        },
                    })
                }

                let dr = this
                let modifiers = []
                if (this.rect.grid || this.rect.anchorGrid) {
                    modifiers = [
                        interact.modifiers.snap({
                            targets: [
                                interact.createSnapGrid({x: 100, y: 100})
                            ],
                            range: Infinity,
                            relativePoints: [{x: 0, y: 0}]
                        }),
                    ]
                }
                this.i.resizable({
                    edges: {left: true, right: true, bottom: true, top: true},
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
                    modifiers: modifiers,
                })
            },
        },
        destroyed() {
            this.i.unset()
        },
        mounted() {
            this.$watch('box.x', function (v) {
                this.rect.x = v
            })
            this.$watch('box.y', function (v) {
                this.rect.y = v
            })
            this.$watch('box.z', function (v) {
                this.rect.z = v
            })
            this.$watch('box.w', function (v) {
                this.rect.w = v
            })
            this.$watch('box.h', function (v) {
                this.rect.h = v
            })
            this.setInteract()
            this.$watch('box.locked', function (v) {
                this.rect.locked = v
                this.setInteract()
            })
            this.$watch('box.grid', function (v) {
                this.rect.grid = v
                this.setInteract(true)
            })
            this.$watch('box.anchorGrid', function (v) {
                this.rect.anchorGrid = v
                this.setInteract(true)
            })
        }
    }
</script>

<style scoped>

</style>