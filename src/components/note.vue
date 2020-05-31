<template>
    <dragResize
            :box="{
                x: this.note.x + this.anchor.x,
                y: this.note.y + this.anchor.y,
                w: this.note.width,
                h: this.note.height,
                z: this.note.z,
            }"
            :scale="anchor.scale"
            ref="dr">
        <v-card
                class="note mx-auto scroll-y"
                outlined
                shaped
                dark
                height="100%"
                width="100%"
                v-touch:touchhold="touch"
                @dblclick.stop="dialog = true"
        >
            <!--            <v-card-title>{{note.x}}/{{note.y}} {{note.width}}:{{note.height}}</v-card-title>-->
            <v-card-text v-html="note.text">
            </v-card-text>
        </v-card>
        <v-dialog v-model="dialog">
            <v-card>
                <v-card-title class="headline">Edit Note</v-card-title>
                <v-card-text>
                    <v-form>
                        <v-container>
                            <v-row>
                                <v-col cols="12" md="4">
                                    <v-text-field
                                            v-model="note.name"
                                            label="Note Name"
                                            required
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model.number="note.z"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-btn @click="deleteNote">
                                        <v-icon>delete</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                            <TiptapVuetify v-model="note.text" :extensions="extensions"></TiptapVuetify>
                        </v-container>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </dragResize>
</template>

<script>
    import {
        TiptapVuetify,
        Heading,
        Image,
        Bold,
        Italic,
        Strike,
        Underline,
        Code,
        Paragraph,
        BulletList,
        OrderedList,
        ListItem,
        Link,
        Blockquote,
        HardBreak,
        HorizontalRule,
        History
    } from 'tiptap-vuetify'
    import dragResize from './dragresize'

    export default {
        name: 'note',
        props: {
            note: Object,
            anchor: Object,
        },
        components: {
            TiptapVuetify,
            dragResize
        },
        data() {
            if (this.note.z === undefined) {
                this.$set(this.note, 'z', 0)
            }
            return {
                dialog: false,
                extensions: [
                    Image,
                    History,
                    Blockquote,
                    Link,
                    Underline,
                    Strike,
                    Italic,
                    ListItem,
                    BulletList,
                    OrderedList,
                    [Heading, {
                        options: {
                            levels: [1, 2, 3]
                        }
                    }],
                    Bold,
                    Code,
                    HorizontalRule,
                    Paragraph,
                    HardBreak
                ],
            }
        },
        methods: {
            touch(e) {
                this.dialog = true
                e.stopPropagation()
            },
            deleteNote() {
                this.anchor.notes = this.anchor.notes.filter(val => {
                    return val.id !== this.note.id
                })
            },
        },
        mounted() {
            this.$watch('$refs.dr.rect', function (val) {
                this.$set(this.note, 'x', val.x - this.anchor.x)
                this.$set(this.note, 'y', val.y - this.anchor.y)
                this.$set(this.note, 'width', val.w)
                this.$set(this.note, 'height', val.h)
                this.$set(this.note, 'z', val.z)
            }, {
                deep: true
            })
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .scroll-y {
        overflow-y: auto;
        height: 100%;
    }

    .note, .note * {
        touch-action: none;
    }

    .resizable-content {
        height: 100%;
        width: 100%;
        background-color: aqua;
    }
</style>
