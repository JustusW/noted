<template>
    <v-app id="inspire">
        <NavBar :routes="routes"/>

        <v-app-bar
                app
                color="indigo"
                dark
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>Application</v-toolbar-title>
        </v-app-bar>

        <v-content>
            <v-container
                    class="fill-height"
                    fluid
            >
                <router-view></router-view>
            </v-container>
        </v-content>
        <v-footer
                color="indigo"
                app
        >
            <span class="white--text">&copy; 2019</span>
        </v-footer>
    </v-app>
</template>

<script>
    import NavBar from './navbar'

    export default {
        props: {
            source: String,
            routes: Array,
        },
        components: {
            NavBar
        },
        data: () => ({
            drawer: null,
        }),
    }
</script>
