<template>
    <v-content v-if="anchor" class="indigo lighten-3" :style="'background-color: ' + anchor.bgcolor + ' !important'">
        <div style="width: 100%; height: 100%; " @dblclick="openMenu" @click="setCommandline"
             @mousedown="mouseDown"
             @wheel="cmd.show = false"
        >
            <Zoom :anchor="anchor" ref="zoom">
                <div v-for="container in anchor.container"
                     v-bind:key="container.id"
                     v-on:mousedown.stop=""
                     v-on:dropped.stop="droppedContainer($event, container)"
                >
                    <Container :container="container" :anchor="anchor"></Container>
                </div>
                <div v-for="note in anchor.notes"
                     v-bind:key="note.id"
                     v-on:mousedown.stop=""
                     v-on:dropped.stop="droppedNote($event, note)"
                >
                    <Note :note="note" :anchor="anchor"></Note>
                </div>
                <Anchor :anchor="anchor"></Anchor>
            </Zoom>
        </div>

        <v-speed-dial
                top absolute right
                v-model="zoomControls"
                direction="left"
                :open-on-hover="true"
        >
            <template v-slot:activator>
                <v-btn
                        style="font-size: 1.5rem;"
                        v-model="zoomControls"
                        dark
                        fab
                        small
                        class="material-icons"
                        v-text="zoomControls?'home':'zoom_in'"
                        @click="$refs.zoom.reset()"
                >
                </v-btn>
            </template>
            <v-btn
                    v-for="i in 5"
                    v-bind:key="'zoomRange.' + i"
                    dark
                    fab
                    small
                    @click="$refs.zoom.reset(6 - i)"
            >
                {{6 - i}}x
            </v-btn>
        </v-speed-dial>

        <div :style="[
            'position: absolute',
            'height: 56px',
            'left: ' + (cmd.x - 74) + 'px',
            'top: ' + (cmd.y - 16) + 'px',
            '',].join('; ')"
             v-if="cmd.show"
             @cmdClose="cmd.show = false"
             @settings="settingsDialog = true"
             @newContainer="newContainer"
             @newNote="newNote"
        >
            <commandline ref="commandline"></commandline>
        </div>

        <v-dialog v-model="settingsDialog" width="500">
            <Settings v-model="anchor"></Settings>
        </v-dialog>
    </v-content>
</template>

<script>
    import _ from 'lodash'
    import Zoom from '@/components/zoom'
    import NoteComp from '@/components/draggablenote'
    import Settings from '@/components/settings'
    import Anchor from "@/components/anchor";
    import {getAnchor, setAnchor, Container, Note} from "@/data";
    import ContainerComp from "@/components/container";
    import Commandline from "@/components/commandline";

    export default {
        name: "notes",
        components: {
            Commandline,
            Container: ContainerComp,
            Anchor,
            Zoom, Note: NoteComp, Settings
        },
        data() {
            let anchor = getAnchor()
            return {
                zoomControls: false,
                dropped: {},
                cmd: {
                    x: 0, y: 0, show: false, down: {x: 0, y: 0, time: 0},
                },
                settingsDialog: false,
                anchor: anchor,
            }
        },
        watch: {
            dropped: {
                deep: true,
                handler: function (v) {
                    if (v.note && v.container) {
                        v.note.x = 0
                        v.note.y = 0
                        v.note.width = 1
                        v.note.height = 1
                        v.note.container = true
                        v.container.notes.push(v.note)
                        this.anchor.notes = this.anchor.notes.filter(n => {
                            return n.id !== v.note.id
                        })
                        this.$set(this.dropped, 'container', undefined)
                        this.$set(this.dropped, 'note', undefined)
                    }
                }
            },
            anchor: {
                handler: _.debounce(function (v) {
                    if (v) {
                        setAnchor(v)
                    }
                }, 200),
                deep: true,
            },
        },
        computed: {
            OY() {
                let rect = this.$el.firstElementChild.getBoundingClientRect()
                return rect.top
            }
        },
        methods: {
            mouseDown(e) {
                this.$set(this.cmd, 'show', false)
                this.$set(this.cmd.down, 'time', new Date())
                this.$set(this.cmd.down, 'x', e.clientX)
                this.$set(this.cmd.down, 'y', e.clientY - this.OY)
            },
            setCommandline(e) {
                let now = new Date()
                if (now - this.cmd.down.time > 500
                    || Math.abs(this.cmd.down.x - e.clientX) > 100
                    || Math.abs(this.cmd.down.y - e.clientY + this.OY) > 100) {
                    return
                }

                this.$set(this.cmd, 'x', e.clientX)
                this.$set(this.cmd, 'y', e.clientY - this.OY)
                this.$set(this.cmd, 'show', true)
                this.$nextTick(function () {
                    console.log(this.cmd.y, this.$el)
                    let cmd = this.$refs.commandline
                    setTimeout(function () {
                        cmd.focus()
                    }, 200)
                })
            },
            droppedNote(e, note) {
                this.$set(this.dropped, 'note', note)
            },
            droppedContainer(e, container) {
                this.$set(this.dropped, 'container', container)
            },
            menuPosition() {
                let tf = this.$refs.zoom.pz.getTransform()
                let offsetX = -tf.x
                let offsetY = -tf.y
                let x = Math.round(offsetX + this.cmd.x)
                let y = Math.round(offsetY + this.cmd.y)
                return {x, y}
            },
            newContainer() {
                this.anchor.container.push(new Container(this.menuPosition()))
                this.$set(this.cmd, 'show', false)
            },
            newNote(e) {
                let ref = this.menuPosition()
                if (e && !Number.isInteger(e.detail)) {
                    ref.text = e.detail
                    if (ref.text) {
                        ref.x -= 25
                        ref.y -= 50
                    }
                    this.$set(this.cmd, 'show', false)
                }
                let n = new Note(ref)
                n.editing = true
                this.anchor.notes.push(n)
            },
            openMenu(e) {
                this.$set(this.menu, 'x', e.clientX)
                this.$set(this.menu, 'y', e.clientY)
                this.$nextTick(function () {
                    this.$set(this.menu, 'show', true)
                })
            },
        },
    }
</script>

<style scoped>

</style>