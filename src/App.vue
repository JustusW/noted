<template>
  <BaseLine id="app" :routes="routes">
  </BaseLine>
</template>

<script>
import BaseLine from './components/baseline.vue'
import routes from './routes'

export default {
  name: 'App',
  data: function () {
    return {routes: routes.routes,}
  },
  components: {
    BaseLine
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
