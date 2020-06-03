<template>
    <v-content v-if="anchor" :style="'background: ' + anchor.bgcolor">
        <div style="width: 100%; height: 100%; " @dblclick="openMenu">
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
        <v-menu
                dark
                origin="center center"
                transition="scale-transition"
                v-model="menu.show" :position-x="menu.x" :position-y="menu.y" absolute>
            <v-list>
                <v-list-item link @click="newContainer">
                    <v-list-item-icon class="material-icons">add</v-list-item-icon>
                    <v-list-item-content>Container</v-list-item-content>
                </v-list-item>
                <v-list-item link @click="newNote">
                    <v-list-item-icon class="material-icons">add</v-list-item-icon>
                    <v-list-item-content>Note</v-list-item-content>
                </v-list-item>
                <v-list-item link @click="settingsDialog = true">
                    <v-list-item-icon class="material-icons">settings</v-list-item-icon>
                    <v-list-item-content>
                        Settings
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-menu>

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

    export default {
        name: "notes",
        components: {
            Container: ContainerComp,
            Anchor,
            Zoom, Note: NoteComp, Settings
        },
        data() {
            let anchor = getAnchor()
            return {
                zoomControls: false,
                dropped: {},
                menu: {
                    x: 0, y: 0, show: false,
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
        methods: {
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
                let x = Math.round(offsetX + this.menu.x)
                let y = Math.round(offsetY + this.menu.y)
                return {x, y}
            },
            newContainer() {
                this.anchor.container.push(new Container(this.menuPosition()))
            },
            newNote() {
                this.anchor.notes.push(new Note(this.menuPosition()))
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