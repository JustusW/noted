<template>
  <v-main class="secondary">
      <h1>Willkommen</h1>
      <v-btn
          dark
          fab
          small
          @click="dl()"
      >
        <v-icon>save</v-icon>
      </v-btn>
      <v-file-input @change="file" ref="fileInput"></v-file-input>
  </v-main>
</template>

<script>
import getAnchor, {setAnchor} from "@/data";

export default {
  name: 'home',
  props: {},
  components: {},
  methods: {
    dl: function () {
      const data = JSON.stringify(getAnchor())
      console.log(data)
      const blob = new Blob([data], {type: 'text/json'})
      const a = document.createElement('a')
      a.download = "notes.json"
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
      let e = new MouseEvent('click')
      a.dispatchEvent(e)
    },
    file(f) {
      if (!f) {
        return
      }
      f.text().then(d => {
        let data = JSON.parse(d)
        setAnchor(data)
        this.$refs.fileInput.reset()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
