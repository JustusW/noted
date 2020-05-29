<template>
    <dragResize
            :box="{x: this.note.x + this.anchor.x, y: this.note.y + this.anchor.y, w: this.note.width, h: this.note.height}"
            :scale="anchor.scale"
            ref="dr">
        <v-card
                class="note mx-auto scroll-y"
                outlined
                shaped
                dark
                height="100%"
                width="100%"
        >
<!--            <v-card-title>{{note.x}}/{{note.y}} {{note.width}}:{{note.height}}</v-card-title>-->
            <v-card-text v-html="note.text" @dblclick.stop="dialog = true">
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
    </dragResize>
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
            return {
                box: {
                    x: this.note.x + this.anchor.x,
                    y: this.note.y + this.anchor.y,
                    w: this.note.width,
                    h: this.note.height,
                },
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
        methods: {},
        mounted() {
            this.$watch('$refs.dr.rect', function (val) {
                this.$set(this.note, 'x', val.x - this.anchor.x)
                this.$set(this.note, 'y', val.y - this.anchor.y)
                this.$set(this.note, 'width', val.w)
                this.$set(this.note, 'height', val.h)
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

    .resizable-content {
        height: 100%;
        width: 100%;
        background-color: aqua;
    }
</style>
