<template>
    <div class="anchor"
         v-resize:debounce="resized"
    >
        <v-icon class="material-icons">home</v-icon>
    </div>
</template>

<script>
    export default {
        name: "anchor",
        props: {
            anchor: Object
        },
        methods: {
            resized() {
                let notes = this.$el.closest('.notes')
                let x = notes.clientWidth / 2
                let y = notes.clientHeight / 2
                x = x - (x % 200)
                y = y - (y % 200)
                this.$set(this.anchor, 'x', x)
                this.$set(this.anchor, 'y', y)
                this.reset()
            },
            reset() {
                let elm = this.$el
                elm.style.transform = 'translate(' +
                    (this.anchor.x - elm.clientWidth / 2)
                    + 'px, ' +
                    (this.anchor.y - elm.clientHeight / 2)
                    + 'px)'
            }
        },
    }
</script>

<style scoped>
    .anchor {
        position: absolute;
        top: 0;
        left: 0;
    }
</style>