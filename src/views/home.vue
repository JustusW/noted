<template>
  <v-content>
    <div class="home">
      <h1>Willkommen</h1>
      <v-btn
          dark
          fab
          small
          @click="dl()"
      >
        <v-icon>save</v-icon>
      </v-btn>
      <vue-dropzone
          ref="jsonInput" id="jsonInput" :options="dropzoneOptions"
          @vdropzone-file-added="addedFile"
      >

      </vue-dropzone>
    </div>
  </v-content>
</template>

<script>
import getAnchor, {setAnchor} from "@/data";
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  name: 'home',
  props: {},
  components: {
    vueDropzone: vue2Dropzone
  },
  data: function () {
    return {
      dropzoneOptions: {
        url:"#",
        height: 100,
        width: 100,
        thumbnailWidth: 200,
        addRemoveLinks: true,
        dictDefaultMessage: "<i class='fa fa-cloud-upload'></i>Load Notes",
        autoProcessQueue: false,
        autoQueue: false,
      }
    };
  },
  methods: {
    dl: function () {
      const data = JSON.stringify(getAnchor())
      console.log(data)
      const blob = new Blob([data], {type: 'text/json'})
      const e = document.createEvent('MouseEvents'),
          a = document.createElement('a');
      a.download = "notes.json";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent(
          'click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    addedFile(f) {
      f.text().then(d => {
        let data = JSON.parse(d)
        setAnchor(data)
        this.$refs.jsonInput.removeFile(f)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
