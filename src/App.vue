<template>
    <v-app id="noted">
        <v-app-bar app color="indigo">
            <v-menu
                    offset-y
                    bottom
                    origin="center center"
                    transition="scale-transition">
                <template v-slot:activator="{ on }">
                    <v-app-bar-nav-icon v-on="on"></v-app-bar-nav-icon>
                </template>
                <v-list>
                    <v-list-item
                            v-for="(route, index) in routes"
                            :key="index"
                            router-link
                            :to="route.link || route.path"
                    >
                        <v-list-item-content>
                            <v-list-item-title>{{ route.name }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>

                </v-list>
            </v-menu>
        </v-app-bar>
        <router-view :key="$route.fullPath"></router-view>

    </v-app>
</template>

<script>
    import routes from './routes'

    export default {
        name: 'noted',
        data: function () {
            return {
                routes: routes.routes
            }
        },
    }
</script>

<style>
</style>
