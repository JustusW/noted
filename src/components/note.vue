<template>
    <div style="height: 100%; width: 100%;">
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
            <v-card style="height: 80vh; ">
                <v-card-title class="headline">
                    Edit Note
                </v-card-title>
                <v-card-text style="height: 70vh;">
                    <v-form>
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-text-field
                                        v-model="note.name"
                                        label="Note Name"
                                        required
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-slider
                                        label="Note Order"
                                        max="100" v-model.number="note.z"
                                        min="0" thumb-label="always"
                                ></v-slider>
                            </v-col>
                            <v-col cols="12" md="1">
                                <v-checkbox label="Lock" v-model="note.locked"></v-checkbox>
                            </v-col>
                            <v-col cols="12" md="1">
                                <v-checkbox label="Grid" v-model="note.grid"></v-checkbox>
                            </v-col>
                            <v-col cols="12" md="2">
                                <v-btn type="button" @click.stop="selectNote">
                                    Create Reference
                                </v-btn>
                            </v-col>
                            <v-col cols="12" md="1">
                                <v-btn @click="deleteNote" dark class="dangerous" color="red">
                                    <v-icon>delete</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <div class="overflow-y-auto" style="max-height: 50vh; position: relative; margin-top: 50px; ">
                            <TiptapVuetify v-model="note.text" :extensions="extensions"></TiptapVuetify>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card>
            <div class="noteLinkMenu"></div>
            <vue-simple-context-menu
                    :element-id="'note_ref_menu' + note.id"
                    ref="note_ref_menu"
                    :options="notes"
                    @option-clicked="handleClick"
            ></vue-simple-context-menu>
        </v-dialog>
    </div>
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

    export default {
        name: 'note',
        props: {
            note: Object,
            anchor: Object,
            container: Object,
        },
        components: {
            TiptapVuetify,
        },
        data() {
            if (this.note.z === undefined) {
                this.$set(this.note, 'z', 0)
            }

            let allnotes = this.anchor.notes
            for (let container of this.anchor.container) {
                allnotes = allnotes.concat(container.notes)
            }
            let notes = []
            for (let note of allnotes) {
                notes.push({name: (!note.name ? note.id : note.name + ' (' + note.id + ')'), note: note})
            }
            return {
                clipboardMessage: "",
                notes,
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
            handleClick(item) {
                let link = '<a href="#/notes/' + item.option.note.id + '">' + item.option.name + '</a>'
                this.$set(this.note, 'text', link + '<br>' + this.note.text)
            },
            touch(e) {
                this.dialog = true
                e.stopPropagation()
            },
            deleteNote() {
                this.anchor.notes = this.anchor.notes.filter(val => {
                    return val.id !== this.note.id
                })
            },
            selectNote(e) {
                this.$refs.note_ref_menu.showMenu(e)
            }
        },
    }
</script>


<style>
    .scroll-y {
        overflow-y: auto;
        height: 100%;
    }

    .note, .note * {
        touch-action: none;
    }

    .tiptap-vuetify-editor__toolbar {
        position: fixed;
        margin-top: -50px;
    }

    .noteLinkMenu + div {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
    }
</style>
