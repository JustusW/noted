<template>
  <div :style='[
            "background-color: " + anchor.bgcolor,
            "position: fixed",
            "top: 0",
            "left: 0",
            "width: 100%",
            "height: 100%",
            "max-width: 100%",
            "max-height: 100%",
            "overflow: hidden",
        "",].join("; ")'
       @transform="ontransform"
       v-touch:touchhold.stop.prevent="longtap"
       v-touch:tap="closemenu"
       v-on:click="closemenu"
  >

    <div
        v-on:qmsettings="settings"
        v-on:qmaddnote="addnote"
        v-on:qmaddcontainer="addcontainer"
        v-on:qmhome="center"
        v-on:qmsave="save"
    >
      <QuickMenu
          :options="{
                show: qmshow, x: qmx, y: qmy, layerX: qmlayerx, layerY: qmlayery,
                items: [
                    {display: 'Add Note', event: 'menuaddnote'},
                    {display: 'Home', event: 'menuhome'},
                    {display: 'save', event: 'menuhome'},
                    ],
            }"
          ref="qm"
      ></QuickMenu>
    </div>

    <Zoom
        :options="{minZoom:1, maxZoom: 5, zoomSpeed: 0.065, smoothScroll: true, panning: true,which: -1,}"
        :offset="{
                    x: anchor.x,
                    y: anchor.y,
                }"
        :dblclick="doubleClick"
        ref="zoom">
      <div
          class="notes"
          :style="getStyle()"
          v-on:mousedown="checkPrevention"
          v-on:mousemove="checkPrevention"
          v-on:touchstart="checkPrevention"
          v-on:touchmove="checkPrevention"
          v-on:dblclick.stop="doubleClick"
      >
        <div v-for="container in anchor.container"
             v-bind:key="container.id"
             v-on:dropped.stop="droppedContainer($event, container)">
          <Container :container="container"
                     :anchor="anchor"></Container>
        </div>
        <div
            v-for="note in anchor.notes"
            v-bind:key="note.id"
            v-on:dropped.stop="droppedNote($event, note)">
          <Note
              :note="note"
              :anchor="anchor"></Note>
        </div>
        <Anchor :anchor="anchor"></Anchor>
      </div>
    </Zoom>
    <vue-dropzone
        ref="dropzone" id="dropzone" :options="dropzoneOptions"
        style="position: fixed; top: 64px; left: 64px; max-height: 50px; "
        v-touch:tap="touchToClick"
        v-on:vdropzone-file-added="fileAdded"></vue-dropzone>
    <v-dialog v-model="settingsDialog" width="500">
      <Settings v-model="anchor"></Settings>
    </v-dialog>
  </div>
</template>

<script>
import Note from './draggablenote'
import Anchor from './anchor'
import Zoom from './zoom'
import Settings from './settings'
import QuickMenu from './quickmenu'
import Container from './container'
import vue2Dropzone from 'vue2-dropzone'
import _ from 'lodash'

let clientWidth = window.innerWidth
let clientHeight = window.innerHeight

if (!localStorage.anchor) {
  localStorage.anchor = JSON.stringify({
    bgcolor: '#fff',
    notes: [
      {
        id: 0,
        name: 'sample note',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        y: 0, x: 0, width: 600, height: 400,
      }
    ],
    scale: 1,
    grid: false,
    container: [],
  })
}

let anchor = JSON.parse(localStorage.anchor)

export default {
  name: 'notes',
  props: {
    title: String
  },
  components: {
    Container,
    Settings,
    Note,
    Anchor,
    Zoom,
    QuickMenu,
    vueDropzone: vue2Dropzone
  },
  data: function () {
    return {
      dropped: {},
      settingsDialog: false,
      scaledTransform: {x: 0, y: 0, scale: 1},
      anchor,
      dropzoneOptions: {
        url: '/',
        thumbnailWidth: 150,
        maxFilesize: 0.5,
        headers: {"My-Awesome-Header": "header value"},
        autoQueue: false,
      },
      pivot: 'center',
      qmshow: false,
      qmx: 0,
      qmy: 0,
      qmlayerx: 0,
      qmlayery: 0,
    }
  },
  mounted() {
    this.$watch('anchor', _.debounce(function () {
      localStorage.anchor = JSON.stringify(this.anchor)
    }, 500), {deep: true})
    this.$nextTick(function () {
      if (this.anchor.grid !== false && this.anchor.grid !== true) {
        this.anchor.grid = false
      }
      if (this.anchor.bgcolor === undefined) {
        this.anchor.bgcolor = "#fff"
      }
      this.checkRoute()
    })
  },
  watch: {
    dropped: {
      deep: true,
      handler: function (v) {
        if (v.note && v.container) {
          v.note.x = 0
          v.note.y = 0
          v.note.width = 1
          v.note.height = 1
          v.container.notes.push(v.note)
          this.anchor.notes = this.anchor.notes.filter(n => {
            return n.id !== v.note.id
          })
          this.$set(this.dropped, 'container', undefined)
          this.$set(this.dropped, 'note', undefined)
        }
      }
    },
    $route() {
      this.$nextTick(function () {
        this.checkRoute()
      })
    },
  },
  methods: {
    droppedNote(e, note) {
      this.$set(this.dropped, 'note', note)
    },
    droppedContainer(e, container) {
      this.$set(this.dropped, 'container', container)
    },
    touchToClick(ev) {
      ev.target.click()
    },
    save() {
      let data = JSON.stringify(this.anchor)
      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
      element.setAttribute('download', 'noted.json');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    },
    settings() {
      this.settingsDialog = true
    },
    addcontainer() {
      this.closemenu()
      this.newContainer()
    },
    addnote() {
      this.closemenu()
      // this.newNote(undefined, e.detail.layerX - this.anchor.x, e.detail.layerY - this.anchor.y)
      this.newNote()
    },
    checkRoute() {
      let reset = false
      if (this.$route.params.zoom !== undefined) {
        reset = true
        let zoom = this.$refs.zoom
        zoom.zoom(parseInt(this.$route.params.zoom))
      }
      if (this.$route.params.id !== undefined) {
        reset = true
        this.$refs.zoom.shouldReset = false
        this.jumpTo(this.$route.params.id)
      }
      if (reset) {
        this.$router.push('/notes')
      }
    },
    jumpTo(id) {
      function fn(val) {
        return val.id === id || val.id === parseInt(id)
      }

      let zoom = this.$refs.zoom
      let note = this.anchor.notes.find(fn)
      if (!note) {
        for (let container of this.anchor.container) {
          note = container.notes.find(fn)
          if (note) {
            note = container
            break
          }
        }
      }
      if (!note) {
        return
      }
      let x = note.x
      let y = note.y

      zoom.moveTo(x, y)
    },
    ontransform(e) {
      this.closemenu()
      let transform = e.detail.getTransform()
      this.scaledTransform = e.detail.getScaledTransform()
      this.$set(this.anchor, 'scale', 5 / transform.scale)
    },
    closemenu() {
      if (Date.now() - this.lastLongTap > 500)
        this.$refs.qm.$refs.canvas_menu.hideContextMenu()
    },
    longtap(e) {
      this.lastLongTap = Date.now()
      let me = new MouseEvent('doubleclick', {
        clientX: e.changedTouches[0].clientX,
        clientY: e.changedTouches[0].clientY
      })
      this.$refs.qm.show(me)
    },
    doubleClick(ev) {
      this.$refs.qm.show(ev)
      let rect = this.$el.getBoundingClientRect()
      this.qmx = ev.clientX - rect.x
      this.qmy = ev.clientY - rect.y
      if (ev.target.className === 'notes') {
        this.qmlayerx = ev.layerX
        this.qmlayery = ev.layerY
      } else {
        this.qmlayerx = this.qmx + this.scaledTransform.x
        this.qmlayery = this.qmy + this.scaledTransform.y
      }
    },
    checkPrevention(ev) {
      let elm = ev.target
      let parent = elm.closest('.note, .anchor, .noteContainer, .noteContainerHandle')
      if (parent) {
        ev.preventDefault()
        ev.stopImmediatePropagation()
      }
    },
    getStyle() {
      return 'width: ' + 5 * clientWidth + 'px; '
          + 'height: ' + 5 * clientHeight + 'px; '
    },
    fileAdded(file) {
      if (file.name.endsWith('.json')) {
        file.text().then(t => {
          this.$refs.dropzone.removeFile(file)
          this.anchor = JSON.parse(t)
          localStorage.anchor = t
        })
      } else {
        const toBase64 = file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
        toBase64(file).then(bs => {
          this.$refs.dropzone.removeFile(file)
          this.newNote('<img src="' + bs + '" style="width: 100%; height: 100%;"/>')
        })

      }
    },
    newContainer(content, x, y) {
      if (this.anchor.container === undefined || !Array.isArray(this.anchor.container)) {
        this.$set(this.anchor, 'container', [])
      }
      if (content === undefined) {
        content = []
      }
      if (x === undefined) {
        x = 50
      }
      if (y === undefined) {
        y = 50
      }
      let highestId = 0
      for (let container of this.anchor.container) {
        let id = parseInt(container.id.replace(/[^\d.]/g, ''))
        if (!isNaN(id))
          highestId = Math.max(id, highestId)
      }
      this.anchor.container.push({
        notes: content,
        id: 'container' + (highestId + 1),
        x: x, y: y, width: 200, height: 200,
      })
    },
    newNote(content, x, y) {
      if (!content) {
        content = '<h1>Change me!</h1>'
      }
      if (x === undefined) {
        x = 50
      }
      if (y === undefined) {
        y = 50
      }
      let highestId = 0
      for (let note of this.anchor.notes) {
        let id = parseInt(note.id.replace(/[^\d.]/g, ''))
        if (!isNaN(id)) {
          highestId = Math.max(id, highestId)
        }
      }
      for (let container of this.anchor.container) {
        for (let note of container.notes) {
          let id = parseInt(note.id.replace(/[^\d.]/g, ''))
          if (!isNaN(id)) {
            highestId = Math.max(id, highestId)
          }
        }
      }
      this.anchor.notes.push({
        text: content,
        id: 'note' + (highestId + 1),
        x: x, y: y, width: 200, height: 200,
      })
    },
    isGrid() {
      return this.anchor.grid[0] === 200 && this.anchor.grid[1] === 200
    },
    center() {
      this.$refs.zoom.reset()
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#dropzone.dropzone {
  min-height: 40px;
  height: 40px;
  padding: 5px 5px;
}

.dropzone .dz-default.dz-message {
  margin: 0;
}

.vue-pan-zoom-item, .vue-pan-zoom-scene {
  height: 100%;
}

.notes {
  touch-action: none;
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(0.2);
}
</style>
