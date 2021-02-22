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
        save
      </v-btn>
    </div>
  </v-content>
</template>

<script>
import getAnchor from "@/data";
const fs = require('fs')

export default {
  name: 'home',
  props: {},
  methods: {
    dl() {
      const data = JSON.stringify(getAnchor())
      console.log(data)
      try { fs.writeFileSync('notes.json', data, 'utf-8') }
      catch(e) {
        console.log(e)
        alert('Failed to save the file !')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
