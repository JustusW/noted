<template>
    <v-card dark class="note">
        <v-card-text @dblclick.stop="">
            <ckeditor @ready="instanceReady" @blur="blur" v-model="text" :editor="editor" :config="{}"></ckeditor>
        </v-card-text>
    </v-card>
</template>

<script>
    import balloonEditor from '@ckeditor/ckeditor5-build-balloon';

    export default {
        name: "commandline",
        data() {
            return {
                text: "",
                editor: balloonEditor,
                cke: null,
            }
        },
        methods: {
            instanceReady(e) {
                this.cke = e
            },
            blur() {
                let text = this.cke.getData()
                if (text)
                    this.$el.dispatchEvent(new CustomEvent('newNote', {bubbles: true, detail: text}))
                this.cke.setData("")
            }
        },
        destroyed(e) {
            this.cke.destroy(e)
        },
    }
</script>

<style scoped>
    .cmd {
        position: fixed;
        top: 2em;
        width: 100%;
        z-index: 9999;
    }
</style>