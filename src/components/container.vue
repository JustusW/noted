<template>
    <dragResize
            :box="{
                x: this.container.x + this.anchor.x,
                y: this.container.y + this.anchor.y,
                w: this.container.width,
                h: this.container.height,
                z: this.container.z,
                locked: this.container.locked,
            }"
            :scale="anchor.scale"
            ref="dr"
            :drop="true">
        <div class="noteContainer">
            <Note v-for="note in container.notes"
                  v-bind:key="note.id"
                  :anchor="anchor"
                  :note="note"
                  :container="container"
            ></Note>
        </div>
    </dragResize>
</template>

<script>
    import dragResize from './dragresize'
    import Note from "./gridnote";
    export default {
        name: "container",
        components: {
            Note,
            dragResize
        },
        props: {
            anchor: Object,
            container: Object
        },
        mounted() {
            this.$watch('$refs.dr.rect', function (val) {
                this.$set(this.container, 'x', val.x - this.anchor.x)
                this.$set(this.container, 'y', val.y - this.anchor.y)
                this.$set(this.container, 'width', val.w)
                this.$set(this.container, 'height', val.h)
                this.$set(this.container, 'z', val.z)
            }, {
                deep: true
            })
        },
    }
</script>

<style scoped>
    .noteContainer {
        width: 100%;
        height: 100%;
        border: 5px dashed lightgray;
    }
    .drop-active .noteContainer {
        border-color: darkgray;
    }
    .drop-target.drop-active .noteContainer {
        border-color: black;
    }
</style>