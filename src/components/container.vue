<template>
    <dragResize
            :box="{
                x: container.x,
                y: container.y,
                w: container.width,
                h: container.height,
                z: container.z,
                grid: container.grid,
                locked: container.locked || autolock,
            }"
            :scale="anchor.scale"
            ref="dr"
            :drop="true">
        <div class="noteContainerHandle secondary lighten-4"
             @wheel.stop=""
             v-on:mouseleave="active = false"
             v-on:mouseenter="active = true">

            <div class="noteContainer"
                 :style="[
                     'background-color: ' + anchor.bgcolor
                 ].join('; ')"
                 v-on:mouseleave="autolock = false">
                <Dashboard :id="container.id">
                    <DashLayout
                            :breakpoint="'md'"
                            :compact="container.compact"
                            :numberOfCols="container.cols || 1"
                            ref="dashlayout">
                        <DashItem
                                v-for="note in container.notes"
                                v-bind:key="note.id"
                                v-bind.sync="note"
                                :draggable="!note.editing"
                                :resizable="!note.editing"
                                @moveStart="move(true, note)"
                                @moveEnd="move(false, note)"
                                :ref="'dashitem.' + note.id"
                        >
                            <div class="content"
                                 v-on:mousedown="autolock = true">
                                <Note :anchor="anchor"
                                      :note="note"
                                      :container="container"
                                ></Note>
                            </div>
                        </DashItem>
                        <DashItem v-bind.sync="cmd">
                            <div class="content"
                                 v-on:mousedown="autolock = true"
                                 v-on:newNote="newNote"
                                 @settings="dialog = true">
                                <commandline></commandline>
                            </div>
                        </DashItem>
                    </DashLayout>
                </Dashboard>
            </div>
            <!--            <v-btn v-if="active" fab absolute top style="left: 50%; margin-left: -1em; font-size: 2em; " class="material-icons"-->
            <!--                   @click="extend($event, 'up')">keyboard_arrow_up</v-btn>-->
            <!--            <v-btn v-if="active" fab absolute bottom style="left: 50%; margin-left: -1em; font-size: 2em; " class="material-icons"-->
            <!--                   @click="extend($event, 'down')">keyboard_arrow_down</v-btn>-->
            <v-btn v-if="active" fab absolute style="top: 50%; right: -1em; margin-top: -1em; font-size: 2em; "
                   class="material-icons"
                   @click="extend($event, 'right')"
                   @mouseup="dragEnd('right')">keyboard_arrow_right
            </v-btn>
            <v-btn v-if="active" fab absolute style="top: 50%; left: -1em; margin-top: -1em; font-size: 2em; "
                   class="material-icons"
                   @click="extend($event, 'left')"
                   @mouseup="dragEnd('left')">keyboard_arrow_left
            </v-btn>
        </div>
        <v-dialog v-model="dialog" width="300">
            <v-card>
                <v-card-title class="headline">
                    Edit Container
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field
                                v-model="container.name"
                                label="Container Name"
                                required
                        ></v-text-field>
                        <v-checkbox label="Compact" v-model="container.compact"></v-checkbox>
                        <v-checkbox label="Auto Extend" v-model="container.autoextend"></v-checkbox>
                        <v-checkbox label="Lock" v-model="container.locked"></v-checkbox>
                        <v-checkbox label="Grid" v-model="container.grid"></v-checkbox>
                        <br>
                        <v-slider
                                label="Order"
                                max="100" v-model.number="container.z"
                                min="0" thumb-label="always"
                        ></v-slider>
                        <br>
                        <v-slider
                                label="Columns"
                                max="12" v-model.number="container.cols"
                                min="0" thumb-label="always"
                        ></v-slider>
                        <v-btn @click="deleteContainer" dark class="dangerous" color="red">
                            <v-icon>delete</v-icon>
                        </v-btn>

                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </dragResize>
</template>

<script>
    import {Dashboard, DashLayout, DashItem} from "vue-responsive-dash";
    import dragResize from './dragresize'
    import NoteComp from "./gridnote";
    import {Note} from "@/data";
    import Commandline from "@/components/commandline";

    export default {
        name: "container",
        data() {
            if (this.container.compact === undefined) {
                this.container.compact = false
            }
            if (this.container.cols === undefined) {
                this.container.cols = 3
            }
            return {
                autolock: false,
                dialog: false,
                active: false,
                activeNote: undefined,
            }
        },
        computed: {
            cmd() {
                let cmdY = -1
                for (let n of this.container.notes) {
                    cmdY = Math.max(cmdY, n.y)
                }
                return {id: 'cmd', x: 0, y: cmdY + 1, width: this.container.cols, height: 1}
            },
        },
        components: {
            Commandline,
            Note: NoteComp,
            dragResize,
            Dashboard, DashLayout, DashItem
        },
        props: {
            anchor: Object,
            container: Object
        },
        methods: {
            move(moving, note) {
                if (note)
                    this.activeNote = note
                else
                    this.activeNote = undefined
            },
            dragEnd(direction) {
                if (!this.activeNote) {
                    return
                }
                this.extend(null, direction)

                if (direction === 'left') {
                    for (let note of this.container.notes) {
                        this.$set(note, 'x', note.x + 1)
                    }
                    let dl = this.$refs.dashlayout.l
                    let item = this.$refs['dashitem.' + this.activeNote.id][0]
                    dl.itemDraggingComplete(item.item)
                    this.$set(this.activeNote, 'x', 0)
                } else {
                    let dl = this.$refs.dashlayout.l
                    let item = this.$refs['dashitem.' + this.activeNote.id][0]
                    dl.itemDraggingComplete(item.item)
                    this.$set(this.activeNote, 'x', this.container.cols - 1)
                }
            },
            extend(e, direction) {
                this.$set(this.container, 'cols', this.container.cols + 1)
                this.$set(this.cmd, 'width', this.container.cols)

                if (this.container.autoextend) {
                    let width = this.container.width / this.container.cols
                    this.$set(this.container, 'width', this.container.width + width)
                    if (direction === 'left') {
                        this.$set(this.container, 'x', this.container.x - width)
                    }
                }
            },
            newNote(e) {
                let ref = {x: 0, y: 0, width: 1, height: 1, text: ''}
                if (e) {
                    ref.text = e.detail
                    ref.x = this.cmd.x
                    ref.y = this.cmd.y
                    ref.width = this.cmd.width
                    ref.height = this.cmd.height
                    this.$set(this.cmd, 'y', this.cmd.y + 1)
                }
                let note = new Note(ref)
                note.container = true
                this.$nextTick(function () {
                    this.container.notes.push(note)
                })
            },
            checkPrevention(e) {
                if (e.target.closest('.item')) {
                    this.autolock = true
                }
            },
            deleteContainer() {
                this.anchor.container = this.anchor.container.filter(val => {
                    return val.id !== this.container.id
                })
            },
        },
        mounted() {
            this.$watch('$refs.dr.rect', function (val) {
                this.$set(this.container, 'x', val.x)
                this.$set(this.container, 'y', val.y)
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

    .noteContainerHandle, .noteContainer, .noteContainer div {
        width: 100%;
        height: 100%;
    }

    .noteContainerHandle {
        padding: 50px;
        border: 5px dashed lightgray;
        overflow-y: auto;
    }

    .noteContainerHandle:not(:hover) {
        background-color: unset !important;
    }

    .noteContainerHandle:hover {
        margin: 0;
    }

    .drop-active .noteContainerHandle {
        border-color: darkgray;
    }

    .drop-target.drop-active .noteContainerHandle {
        border-color: black;
    }
</style>
