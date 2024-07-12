<template>
  <v-card
      class="note mx-auto scroll-y"
      outlined
      shaped
      dark
      color="secondary lighten-1"
      height="100%"
      width="100%"
      @wheel.stop=""
  >
    <v-toolbar absolute dense collapse color="secondary darken-1">
      <v-menu
          offset-y
          top
          origin="center center"
          transition="scale-transition">
        <template v-slot:activator="{ on }">
          <v-app-bar-nav-icon v-on="on"></v-app-bar-nav-icon>
        </template>
        <v-list
            dark
            color="secondary darken">
          <v-list-item link @click="linkNote" v-touch:tap="linkNote">
            <v-list-item-icon class="material-icons">link</v-list-item-icon>
            <v-list-item-content>
              Link Note
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="deleteNote" v-touch:tap="deleteNote">
            <v-list-item-icon class="material-icons">delete</v-list-item-icon>
            <v-list-item-content>
              Delete Note
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="cloneNote" v-touch:tap="cloneNote">
            <v-list-item-icon class="material-icons">publish</v-list-item-icon>
            <v-list-item-content>
              Clone Note
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="openSettings" v-touch:tap="openSettings">
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
          <div ref="link"></div>
        </v-list>
      </v-menu>
      <v-btn icon class="material-icons" v-model="note.editing" @click="toggleEditing">
        edit
      </v-btn>
    </v-toolbar>
    <v-card-text class="static" v-if="!note.editing" v-html="note.text">
    </v-card-text>
    <v-card-text v-if="note.editing" @keydown.stop="">
      <ckeditor v-model="note.text" :editor="editor" @ready="ready" :config="editorConfig"></ckeditor>
    </v-card-text>
    <v-dialog v-model="dialog" width="300" class="secondary" dark>
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
import {NotSupportedError} from "core-js/internals/dom-exception-constants";
import {clone} from "@/util";

export default {
  name: 'note',
  props: {
    note: Object,
    anchor: Object,
    container: Object,
  },
  components: {},
  data() {
    if (this.note.z === undefined) {
      this.$set(this.note, 'z', 0)
    }

    return {
      startWithFocus: this.note.editing,
      editing: false,
      clipboardMessage: "",
      dialog: false,
      editor: balloonEditor,
      editorConfig: {
        link: {
          decorators: {
            isExternal: {
              mode: 'manual',
              label: 'Open in a new tab',
              attributes: {
                target: '_blank'
              }
            }
          }
        }
      },
    }
  },
  methods: {
    openSettings() {
      this.dialog = true
    },
    ready(e) {
      e.ui.element.focus()
    },
    cloneNote() {
      clone.data = this.note
    },
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
    handleClick() {
      throw new NotSupportedError("unimplemented")
    },
    touch(e) {
      this.dialog = true
      e.stopPropagation()
    },
    deleteNote() {
      if (this.container) {
        this.escape()
      }
      this.anchor.notes = this.anchor.notes.filter(val => {
        return val.id !== this.note.id
      })
    },
    selectText(element) {
      let range
      if (document.selection) {
        // IE
        range = document.body.createTextRange()
        range.moveToElementText(element)
        range.select()
      } else if (window.getSelection) {
        range = document.createRange()
        range.selectNode(element)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
      }
    },
    linkNote() {
      let name = this.note.name
      if (!name) {
        name = this.note.text.substring(this.note.text.indexOf('>') + 1, this.note.text.indexOf('</'))
      }
      let b = new Blob(
          ['<a href="' + window.location.origin + '#/notes/' + this.note.id + '">' + name + '</a>'],
          {type: 'text/html'})
      let data = [new window.ClipboardItem({
        [b.type]: b
      })]
      navigator.clipboard.write(data)
    },
  },
}
</script>


<style>
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

.v-application .note a {
  color: white;
}
</style>
