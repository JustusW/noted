<template>
    <div
            class="notes"
            :style="position()"
    >
        <button style="position: static; top: 68px; left: 20vw; " v-on:click="notes.push({text: '<h2>Change Me</h2>', width: 680, height: 420, x: 1920, y: 1080})">Add Note</button>
        <Note v-for="note in notes" v-bind:key="note.id" :note="note"></Note>
    </div>
</template>

<script>
    import Note from './note'
    let maxHeight = 2160
    let maxWidth = 3840

    let notes = [
        {
            name: 'sample note',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            y: maxHeight / 2, x: maxWidth / 4, width: 680, height: 420,
        }
    ]

    export default {
        name: 'notes',
        props: {
            title: String
        },
        components: {
            Note
        },
        methods: {
            position: function () {
                return 'width: ' + this.size.width + 'px; '
                    + 'height: ' + this.size.height + 'px; '
                    + 'top: ' + this.pos.y + 'px; '
                    + 'left: ' + this.pos.x + 'px; '
            }
        },
        data: function () {
            return {
                pos: {
                    x: -maxHeight / 4,
                    y: -maxWidth / 4,
                },
                size: {
                    width: maxWidth,
                    height: maxHeight,
                },
                notes: notes,
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .notes {
        position: absolute;
    }
</style>
