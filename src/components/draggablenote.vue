<template>
    <dragResize
            :box="{
                x: note.x + anchor.x,
                y: note.y + anchor.y,
                w: note.width,
                h: note.height,
                z: note.z,
                locked: note.locked,
                grid: note.grid,
                anchorGrid: anchor.grid,
            }"
            :scale="anchor.scale"
            ref="dr">
        <Note :note="note" :anchor="anchor"></Note>
    </dragResize>
</template>

<script>
    import Note from './note'
    import DragResize from './dragresize'

    export default {
        name: "draggablenote",
        props: {
            note: Object,
            anchor: Object,
            container: Object,
        },
        components: {
            Note, DragResize
        },
        mounted() {
            this.$watch('$refs.dr.rect', function (val) {
                this.$set(this.note, 'x', val.x - this.anchor.x)
                this.$set(this.note, 'y', val.y - this.anchor.y)
                this.$set(this.note, 'width', val.w)
                this.$set(this.note, 'height', val.h)
                this.$set(this.note, 'z', val.z)
            }, {
                deep: true
            })
        },
    }
</script>

<style scoped>

</style>