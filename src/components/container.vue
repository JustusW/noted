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
        <v-toolbar absolute dense collapse>
            <v-menu
                    offset-y
                    top
                    dark
                    origin="center center"
                    transition="scale-transition">
                <template v-slot:activator="{ on }">
                    <v-app-bar-nav-icon v-on="on"></v-app-bar-nav-icon>
                </template>
                <v-list>
                    <v-list-item link @click="dialog = true">
                        <v-list-item-icon class="material-icons">settings</v-list-item-icon>
                        <v-list-item-content>
                            Settings
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item link @click="newNote">
                        <v-list-item-icon class="material-icons">add</v-list-item-icon>
                        <v-list-item-content>
                            Note
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-toolbar>
        <div class="noteContainerHandle"
             @wheel.stop="">

            <div class="noteContainer"
                 :style="[
                     'background-color: ' + anchor.bgcolor
                 ].join('; ')"
                 v-on:mouseleave="autolock = false">
                <Dashboard :id="container.id">
                    <DashLayout
                            :breakpoint="'md'"
                            :compact="container.compact"
                            :numberOfCols="container.cols || 1">
                        <DashItem
                                v-for="note in container.notes"
                                v-bind:key="note.id"
                                v-bind.sync="note"
                                :draggable="!note.editing"
                                :resizable="!note.editing"
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
                                 v-on:newNote="newNote">
                                <commandline></commandline>
                            </div>
                        </DashItem>
                    </DashLayout>
                </Dashboard>
            </div>
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
                cmd: {id: 'cmd', x: 0, y: 0, width: this.container.cols, height: 1},
                autolock: false,
                dialog: false,
            }
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

    .noteContainerHandle:hover {
        margin: 0;
        background-color: #e1e1e1;
    }

    .drop-active .noteContainerHandle {
        border-color: darkgray;
    }

    .drop-target.drop-active .noteContainerHandle {
        border-color: black;
    }
</style>