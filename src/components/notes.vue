<template>
    <div style="position: relative; top: 0; left: 0; width: 100%; height: 100%; max-width: 100%; max-height: 100%; overflow: hidden;">
        <Zoom :onscale="onscale">
            <div
                    class="notes"
                    :style="getStyle()"
                    v-on:mousedown="checkPrevention"
                    v-on:mousemove="checkPrevention"
                    v-on:dblclick="checkPrevention"
                    v-resize:debounce="notesResized"
            >
                <Note v-for="note in anchor.notes" v-bind:key="note.id" :note="note" :anchor="anchor"></Note>
                <Anchor :anchor="anchor"></Anchor>
            </div>
        </Zoom>
        <v-btn style="position: fixed; top: 16px; left: 276px; "
                v-on:click="newNote()">
            <v-icon class="material-icons">add</v-icon>
        </v-btn>
        <v-btn style="position: fixed; top: 16px; left: 376px; "
               :depressed="isGrid()"
                v-bind:class="{
                    'primary': isGrid(),
                    'secondary': !isGrid(),
                }"
               v-on:click="anchor.grid=(isGrid()?[10,10]:[200,200])">
            <v-icon>apps</v-icon>
        </v-btn>
        <v-btn style="position: fixed; top: 16px; left: 476px; "
               v-on:click="center()">
            <v-icon>home</v-icon>
        </v-btn>
        <vue-dropzone
                ref="dropzone" id="dropzone" :options="dropzoneOptions"
                style="position: fixed; top: 64px; left: 276px; max-height: 50px; "
                v-on:vdropzone-file-added="fileAdded"></vue-dropzone>
    </div>
</template>

<script>
    import Note from './note'
    import Anchor from './anchor'
    import Zoom from './zoom'
    import vue2Dropzone from 'vue2-dropzone'

    let notes = [
        {
            name: 'sample note',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            y: 0, x: 0, width: 600, height: 400,
        }
    ]

    let clientWidth = window.innerWidth
    let clientHeight = window.innerHeight

    let anchor = {
        notes: notes,
        grid: [10, 10],
    }

    export default {
        name: 'notes',
        props: {
            title: String
        },
        components: {
            Note,
            Anchor,
            Zoom,
            vueDropzone: vue2Dropzone
        },
        data: function () {
            return {
                anchor,
                dropzoneOptions: {
                    url: '/',
                    thumbnailWidth: 150,
                    maxFilesize: 0.5,
                    headers: {"My-Awesome-Header": "header value"},
                    autoQueue: false,
                },
                pivot: 'center',
            }
        },
        methods: {
            onscale(scale) {
                this.anchor.scale = scale
            },
            checkPrevention(ev) {
                let elm
                try {
                    elm = ev.originalTarget
                } catch (e) {
                    elm = ev.explicitOriginalTarget
                } finally {
                    let parent
                    try {
                        parent = elm.closest('.note, .anchor')
                    } catch (e) {
                        parent = true
                    }

                    if (parent) {
                        ev.preventDefault()
                        ev.stopImmediatePropagation()
                    }
                }
            },
            getStyle() {
                return 'width: ' + 5 * clientWidth + 'px; '
                    + 'height: ' + 5 * clientHeight + 'px; '
            },
            fileAdded(file) {
                this.newNote('<img src="' + URL.createObjectURL(file) + '" style="width: 100%; height: 100%;"/>')
                this.$children[1].removeFile(file)
            },
            newNote(content) {
                if (!content) {
                    content = '<h1>Change me!</h1>'
                }
                this.anchor.notes.push({
                    text: content,
                    x: 50, y: 50, width: 200, height: 200,
                })
            },
            isGrid() {
                return this.anchor.grid[0] === 200 && this.anchor.grid[1] === 200
            },
            center() {
                this.$children[0].zoom(5)
            },
            notesResized() {
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                this.center()
            })
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    #dropzone.dropzone {
        min-height: 40px;
        height: 40px;
        padding: 5px 5px;
    }
    .dropzone .dz-default.dz-message {
        margin: 0;
    }

    .notes {
        position: absolute;
        top: 0;
        left: 0;
    }
</style>
