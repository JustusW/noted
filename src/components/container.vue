<template>
    <dragResize
            :box="{
                x: container.x + anchor.x,
                y: container.y + anchor.y,
                w: container.width,
                h: container.height,
                z: container.z,
                grid: container.grid,
                locked: container.locked || autolock,
            }"
            :scale="anchor.scale"
            ref="dr"
            :drop="true">
        <div class="noteContainerHandle"
             @dblclick.stop="dialog = true"
        >
            <div class="noteContainer"
                 :style="[
                     'background-color: ' + anchor.bgcolor
                 ].join('; ')"
                 v-on:mouseup="autolock = false"
                 v-on:mouseleave="autolock = false"
                 v-on:mousedown="checkPrevention"
            >
                <Dashboard :id="container.id">
                    <DashLayout
                            :breakpoint="'md'"
                            :compact="container.compact"
                            :numberOfCols="container.cols || 1">
                        <DashItem
                                v-for="note in container.notes"
                                v-bind:key="note.id"
                                v-bind.sync="note"
                        >
                            <div class="content"
                                 v-on:mousedown="autolock = true">
                                <Note :anchor="anchor"
                                      :note="note"
                                      :container="container"
                                ></Note>
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
    import Note from "./gridnote";

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
            }
        },
        components: {
            Note,
            dragResize,
            Dashboard, DashLayout, DashItem
        },
        props: {
            anchor: Object,
            container: Object
        },
        methods: {
            checkPrevention(e) {
                if(e.target.closest('.item')) {
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
            for (let note of this.container.notes) {
                if (note.width > 12) {
                    this.$set(note, 'width', 1)
                }
                if (note.height > 12) {
                    this.$set(note, 'height', 1)
                }
                if (note.x > 12) {
                    this.$set(note, 'x', 0)
                }
                if (note.y > 100) {
                    this.$set(note, 'y', 0)
                }
            }
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

    .noteContainerHandle, .noteContainer, .noteContainer div {
        width: 100%;
        height: 100%;
    }

    .noteContainerHandle {
        padding: 50px;
        border: 5px dashed lightgray;
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