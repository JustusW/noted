<template>
    <vue-draggable-resizable
            @dragging="dr"
            @resizing="dr"
            :parent="true"
            :w="note.width"
            :h="note.height"
            :x="note.x"
            :y="note.y">
        <v-card
                class="note mx-auto scroll-y"
                outlined
                shaped
                height="100%"
                width="100%"
        >
            <v-card-text v-html="note.text" @dblclick="dialog = true">
            </v-card-text>
        </v-card>
        <v-dialog v-model="dialog">
            <v-card>
                <v-card-title class="headline">Edit Note</v-card-title>

                <v-card-text>
                    <TiptapVuetify v-model="note.text" :extensions="extensions"></TiptapVuetify>
                </v-card-text>
            </v-card>
        </v-dialog>
    </vue-draggable-resizable>
</template>

<script>
    import {
        TiptapVuetify,
        Heading,
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
            note: Object
        },
        components: {
            TiptapVuetify
        },
        data() {
            return {
                dialog: false,
                extensions: [
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
            dr: function (x, y, width, height) {
                this.note.x = x
                this.note.y = y
                if (width >= 0) {
                    this.note.width = width
                }
                if (height >= 0) {
                    this.note.height = height
                }
            }
        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .scroll-y {
        overflow-y: auto;
        height: 100%;
    }

    .note {
        margin: auto;
    }

    .vdr {
        border: 0;
    }
</style>
