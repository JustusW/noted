<template>
    <v-card
            class="note mx-auto scroll-y"
            outlined
            shaped
            dark
            height="100%"
            width="100%"
            @wheel.stop=""
    >
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
                    <v-list-item v-if="note.container" link @click="escape">
                        <v-list-item-icon class="material-icons">eject</v-list-item-icon>
                        <v-list-item-content>
                            Escape Container
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn icon class="material-icons" v-model="note.editing" @click="toggleEditing">
                edit
            </v-btn>
        </v-toolbar>
        <v-card-text class="static" v-if="!note.editing" v-html="note.text">
        </v-card-text>
        <v-card-text v-if="note.editing">
            <ckeditor v-model="note.text" :editor="editor" :config="{}"></ckeditor>
        </v-card-text>
        <v-dialog v-model="dialog" width="300">
            <v-card>
                <v-card-title class="headline">
                    Edit Note
                </v-card-title>
                <v-card-text>
                    <v-text-field
                            v-model="note.name"
                            label="Note Name"
                            required
                    ></v-text-field>

                    <v-slider
                            label="Note Order"
                            max="100" v-model.number="note.z"
                            min="0" thumb-label="always"
                    ></v-slider>
                    <v-checkbox label="Lock" v-model="note.locked"></v-checkbox>
                    <v-checkbox label="Grid" v-model="note.grid"></v-checkbox>
                    <v-btn @click="deleteNote" dark class="dangerous" color="red">
                        <v-icon>delete</v-icon>
                    </v-btn>

                </v-card-text>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
    import balloonEditor from '@ckeditor/ckeditor5-build-balloon';

    export default {
        name: 'note',
        props: {
            note: Object,
            anchor: Object,
            container: Object,
        },
        components: {},
        data() {
            this.$nextTick(function () {
                this.$set(this.note, 'editing', false)
            })
            if (this.note.z === undefined) {
                this.$set(this.note, 'z', 0)
            }

            return {
                editing: false,
                clipboardMessage: "",
                dialog: false,
                editor: balloonEditor,
            }
        },
        methods: {
            escape() {
                this.note.container = false
                this.note.x = this.container.x
                this.note.y = this.container.y
                this.note.width = 200
                this.note.height = 200
                this.anchor.notes.push(this.note)
                this.container.notes = this.container.notes.filter(v => {
                    return v.id !== this.note.id
                })
            },
            toggleEditing() {
                this.$set(this.note, 'editing', !this.note.editing)
            },
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
        },
    }
</script>


<style scoped>
    .note {
        touch-action: none;
        padding-bottom: 16px;
    }

    .note .v-card__text {
        height: 100%;
        padding-top: 30px;
        overflow-y: auto;
    }

    .note .v-card__text.static {
        padding: 50px 25px 25px 25px;
    }
</style>
