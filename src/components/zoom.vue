<template>
    <div style="width: 100%; height: 100%; "
         v-resize="onresize"
         @mousedown="onmousedown"
         @mouseup="onmouseup"
         @wheel="onwheel"
    >
        <slot></slot>
    </div>
</template>

<script>
    // import _ from 'lodash'

    export default {
        name: "zoom",
        props: {
            onscale: Function,
        },
        data: function () {
            return {
                scale: 1,
                minScale: 1,
                maxScale: 5,
                baseScale: 1,
                stepping: 10000,
                sensitivity: 25,
                x: 0,
                y: 0,
                offsetX: 0,
                offsetY: 0,
            }
        },
        methods: {
            zoom() {
                // this.scale = scale
                // this.offsetX = 0
                // this.offsetY = 0
                // this.slotStyle()
            },
            slotStyle() {
                let me = this.$el
                let elm = this.$el.firstElementChild
                this.baseScale = Math.max(me.clientWidth / elm.clientWidth, me.clientHeight / elm.clientHeight)

                elm.style.transform =
                    'scale(' + this.getAbsScale() + ')'
                elm.style.transformOrigin = 'top left'

                elm.style.left = this.getTranslateX() + 'px'
                elm.style.top = this.getTranslateY() + 'px'
            },
            getTranslateX() {
                return -this.x
            },
            getTranslateY() {
                return -this.y
            },
            getStepped(val) {
                return Math.round(val * this.stepping) / this.stepping
            },
            getAbsScale() {
                return this.getStepped(this.baseScale * this.getScale())
            },
            getScale() {
                return this.scale

            },
            onresize() {
                this.slotStyle()
            },
            onmousedown() {
            },
            onmouseup() {
            },
            onwheel: function (e) {
                if (!(e.deltaY < .3 || e.deltaY > -.3)) {
                    return
                }
                let scaleStep = e.deltaY / this.sensitivity
                this.scale = Math.max(this.minScale, Math.min(this.maxScale, this.scale + scaleStep))

                this.updateScale(e)

                this.onscale(this.getAbsScale())
                this.slotStyle()
            },
            updateScale(e) {
                let rect = this.$el.getBoundingClientRect()

                let cx = this.x / this.getAbsScale() + rect.width / this.getAbsScale() / 2
                let wx = (e.clientX - rect.x) / this.getAbsScale() + this.x / this.getAbsScale()

                let cy = this.y / this.getAbsScale() + rect.height / this.getAbsScale() / 2
                let wy = (e.clientY - rect.y) / this.getAbsScale() + this.y / this.getAbsScale()

                let deltaX = (wx - cx) * this.baseScale
                let deltaY = (wy - cy) * this.baseScale

                let baseWidth = rect.width / this.baseScale
                let baseHeight = rect.height / this.baseScale
                let scalePercent = (this.scale-1) / (this.maxScale-1)

                function div(id, x, y) {
                    let d = document.getElementById(id)
                    d.style.top = y + 'px'
                    d.style.left = x + 'px'
                }
                div('one', cx, cy)
                div('two', wx, wy)

                let sign = e.deltaY / Math.abs(e.deltaY)
                this.offsetX += deltaX * this.scale * sign / 100
                this.offsetY += deltaY * this.scale * sign / 100

                this.x = (baseWidth - rect.width) * scalePercent / 2 + this.offsetX
                this.y = (baseHeight - rect.height) * scalePercent / 2 + this.offsetY
            },
        },
        mounted() {
            let elm = this.$el
            function div(id, color) {
                let d = document.createElement('div')
                d.id = id
                d.style.border = '5px solid ' + color
                d.style.position = 'absolute'
                elm.firstElementChild.appendChild(d)
                return d
            }
            div('one', 'red')
            div('two', 'black')

            this.slotStyle()
        },
    }
</script>

<style scoped>

</style>