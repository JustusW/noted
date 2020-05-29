<template>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item
                v-for="route in routes"
                v-bind:key="route.name"
                router-link
                :to="route.link || route.path">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ route.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
  export default {
    props: {
      source: String,
      routes: Array,
    },

    data: () => ({
      drawer: null,
    }),
  }
</script>
