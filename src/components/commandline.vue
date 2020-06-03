<template>
    <div>
        <v-chip dark color="indigo darken-2" @dblclick.stop="" class="commandline">
            <span class="cmdbtn cmdbtn-left">
                <v-speed-dial
                        style="display: inline;"
                        direction="bottom"
                        :open-on-hover="true"
                >
                    <template v-slot:activator>
                        <v-btn dark small link icon class="material-icons">
                            add
                        </v-btn>
                    </template>
                    <v-btn color="indigo darken-2" dark fab small class="material-icons"
                           style="font-size: 1.5rem;"
                           @click="emitCommand('newNote')">
                        bookmark
                    </v-btn>
                    <v-btn color="indigo darken-2" dark fab small class="material-icons"
                           style="font-size: 1.5rem;"
                           @click="emitCommand('newContainer')">
                        view_compact
                    </v-btn>
                </v-speed-dial>
                <v-btn dark small link icon class="material-icons" @click="emitCommand('settings')">settings</v-btn>
            </span>
            <ckeditor ref="editor" @ready="ready" v-model="text" :editor="editor"
                      :config="{startupFocus: true}"></ckeditor>
            <span class="cmdbtn cmdbtn-right">
                <v-btn dark small link icon class="material-icons" @click="emitCommand('newNote')">done</v-btn>
                <v-btn dark small link icon class="material-icons" @click="emitClose">cancel</v-btn>
            </span>
        </v-chip>
    </div>
</template>

<script>
    import balloonEditor from '@ckeditor/ckeditor5-build-balloon';

    export default {
        name: "commandline",
        data() {
            return {
                text: "",
                editor: balloonEditor,
            }
        },
        computed: {
            cke() {
                return this.$refs.editor.$el.ckeditorInstance
            }
        },
        methods: {
            ready(editor) {
                let cmd = this
                let enter = editor.commands.get('enter')
                enter.on('execute', function() {
                    cmd.blur()
                })
                editor.ui.view.on('keydown', function(e) {
                    console.log('keydown', e)
                })
            },
            emitCommand(c) {
                let text = this.cke.getData()
                this.$el.dispatchEvent(new CustomEvent(c, {bubbles: true, detail: text}))
            },
            emitClose() {
                this.$el.dispatchEvent(new Event('cmdClose', {bubbles: true}))
                this.cke.setData("")
            },
            focus() {
                this.cke.ui.element.focus()
            },
            blur() {
                if (this.cke.getData())
                    this.emitCommand('newNote')
                this.cke.setData("")
            }
        },
        destroyed() {
            try {
                this.cke.destroy()
            } catch (e) {
                console.debug(e)
            }
        },
    }
</script>

<style>
    .commandline {
        position: relative;
        overflow: visible;
        width: 100%;
    }

    .commandline .ck-content {
        width: 100%;
    }

    .commandline .ck-content {
        margin-right: 52px;
        margin-left: 52px;
    }

    .content > .commandline {
        width: 100%;
    }

    .cmdbtn-right {
        right: 0;
        width: 52px;
    }

    .cmdbtn-left {
        left: 0;
        width: 52px;
    }

    .cmdbtn {
        position: absolute;
    }

    .content > div > .commandline .v-chip__content {
        width: 100%;
        position: relative;
    }
</style>