<template>
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; max-width: 100%; max-height: 100%; overflow: hidden;"
         @transform="ontransform"
         @contextmenu.prevent.stop="doubleClick"
    >
        <div
                v-on:qmadd="addnote"
                v-on:qmhome="center"
                v-on:qmsave="save"
        >
            <QuickMenu
                    :options="{
                show: qmshow, x: qmx, y: qmy, layerX: qmlayerx, layerY: qmlayery,
                items: [
                    {display: 'Add Note', event: 'menuaddnote'},
                    {display: 'Home', event: 'menuhome'},
                    {display: 'save', event: 'menuhome'},
                    ],
            }"
                    ref="qm"
            ></QuickMenu>
        </div>

        <Zoom
                :options="{minZoom:1, maxZoom: 5, zoomSpeed: 0.065, smoothScroll: true, panning: true,which: -1,}"
                :offset="{
                    x: anchor.x,
                    y: anchor.y,
                }"
                :dblclick="doubleClick"
                ref="zoom">
            <div
                    class="notes"
                    :style="getStyle()"
                    v-on:mousedown="checkPrevention"
                    v-on:mousemove="checkPrevention"
                    v-on:dblclick.stop="doubleClick"
            >
                <Note v-for="note in anchor.notes" v-bind:key="note.id" :note="note" :anchor="anchor"></Note>
                <Anchor :anchor="anchor"></Anchor>
            </div>
        </Zoom>
        <vue-dropzone
                ref="dropzone" id="dropzone" :options="dropzoneOptions"
                style="position: fixed; top: 64px; left: 64px; max-height: 50px; "
                v-on:vdropzone-file-added="fileAdded"></vue-dropzone>
    </div>
</template>

<script>
    import Note from './note'
    import Anchor from './anchor'
    import Zoom from './zoom'
    import QuickMenu from './quickmenu'
    import vue2Dropzone from 'vue2-dropzone'
    import _ from 'lodash'

    let clientWidth = window.innerWidth
    let clientHeight = window.innerHeight

    if (!localStorage.anchor) {
        localStorage.anchor = JSON.stringify({
            notes: [
                {
                    id: 0,
                    name: 'sample note',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    y: 0, x: 0, width: 600, height: 400,
                }
            ],
            scale: 1,
            grid: [10, 10],
        })
    }

    let anchor = JSON.parse(localStorage.anchor)

    export default {
        name: 'notes',
        props: {
            title: String
        },
        components: {
            Note,
            Anchor,
            Zoom,
            QuickMenu,
            vueDropzone: vue2Dropzone
        },
        data: function () {
            return {
                scaledTransform: {x: 0, y: 0, scale: 1},
                anchor,
                dropzoneOptions: {
                    url: '/',
                    thumbnailWidth: 150,
                    maxFilesize: 0.5,
                    headers: {"My-Awesome-Header": "header value"},
                    autoQueue: false,
                },
                pivot: 'center',
                qmshow: false,
                qmx: 0,
                qmy: 0,
                qmlayerx: 0,
                qmlayery: 0,
            }
        },
        mounted() {
            this.$watch('anchor', _.debounce(function () {
                localStorage.anchor = JSON.stringify(this.anchor)
            }, 500), {deep: true})
            this.$nextTick(function () {
                this.checkRoute()
            })
        },
        watch: {
            $route() {
                this.$nextTick(function () {
                    this.checkRoute()
                })
            },
        },
        methods: {
            save() {
                let data = JSON.stringify(this.anchor)
                let element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
                element.setAttribute('download', 'noted.json');

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            },
            closeradial() {
                this.qmshow = false
            },
            addnote() {
                this.qmshow = false
                // this.newNote(undefined, e.detail.layerX - this.anchor.x, e.detail.layerY - this.anchor.y)
                this.newNote()
            },
            checkRoute() {
                let reset = false
                if (this.$route.params.zoom !== undefined) {
                    reset = true
                    let zoom = this.$refs.zoom
                    zoom.zoom(parseInt(this.$route.params.zoom))
                }
                if (this.$route.params.id !== undefined) {
                    reset = true
                    this.$refs.zoom.shouldReset = false
                    this.jumpTo(parseInt(this.$route.params.id))
                }
                if (reset) {
                    this.$router.push('/notes')
                }
            },
            jumpTo(id) {
                let zoom = this.$refs.zoom
                let note = this.anchor.notes.find(val => {
                    return val.id === parseInt(id)
                })
                if (!note) {
                    return
                }
                let x = note.x
                let y = note.y

                zoom.moveTo(x, y)
            },
            ontransform(e) {
                this.qmshow = false
                let transform = e.detail.getTransform()
                this.scaledTransform = e.detail.getScaledTransform()
                this.$set(this.anchor, 'scale', 5 / transform.scale)
            },
            doubleClick(ev) {
                this.$refs.qm.show(ev)
                let rect = this.$el.getBoundingClientRect()
                this.qmx = ev.clientX - rect.x
                this.qmy = ev.clientY - rect.y
                if (ev.target.className === 'notes') {
                    this.qmlayerx = ev.layerX
                    this.qmlayery = ev.layerY
                } else {
                    this.qmlayerx = this.qmx + this.scaledTransform.x
                    this.qmlayery = this.qmy + this.scaledTransform.y
                    console.log(this.scaledTransform)
                }
                console.log(this.qmlayerx, this.qmlayery)
            },
            checkPrevention(ev) {
                let elm = ev.target
                let parent = elm.closest('.note, .anchor')
                if (parent) {
                    ev.preventDefault()
                    ev.stopImmediatePropagation()
                }
            },
            getStyle() {
                return 'width: ' + 5 * clientWidth + 'px; '
                    + 'height: ' + 5 * clientHeight + 'px; '
            },
            fileAdded(file) {
                if (file.name === 'noted.json') {
                    file.text().then(t => {
                        this.$refs.dropzone.removeFile(file)
                        this.anchor = JSON.parse(t)
                    })
                } else {
                    this.newNote('<img src="' + URL.createObjectURL(file) + '" style="width: 100%; height: 100%;"/>')
                    this.$refs.dropzone.removeFile(file)
                }
            },
            newNote(content, x, y) {
                if (!content) {
                    content = '<h1>Change me!</h1>'
                }
                if (x === undefined) {
                    x = 50
                }
                if (y === undefined) {
                    y = 50
                }
                this.anchor.notes.push({
                    text: content,
                    id: this.anchor.notes.length,
                    x: x, y: y, width: 200, height: 200,
                })
            },
            isGrid() {
                return this.anchor.grid[0] === 200 && this.anchor.grid[1] === 200
            },
            center() {
                this.$refs.zoom.reset()
            },
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

    .vue-pan-zoom-item, .vue-pan-zoom-scene {
        height: 100%;
    }

    .notes {
        touch-action: none;
        position: absolute;
        top: 0;
        left: 0;
        transform: scale(0.2);
    }
</style>
