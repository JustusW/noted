<template>
    <v-app id="inspire">
<!--        <NavBar :routes="routes" :drawer="drawer"/>-->
        <vue-simple-context-menu
                element-id="main_menu"
                :options="routes"
                ref="main_menu"
                @option-clicked="click"
        />
        <v-app-bar
                app
                color="indigo"
                dark
        >
            <v-app-bar-nav-icon @click.stop="showMainMenu"></v-app-bar-nav-icon>
            <v-toolbar-title>Application</v-toolbar-title>
        </v-app-bar>

        <v-main>
            <v-container
                    class="fill-height"
            >
                <router-view></router-view>
            </v-container>
        </v-main>
        <v-footer
                color="indigo"
                app
        >
            <span class="white--text">&copy; 2019</span>
        </v-footer>
    </v-app>
</template>

<script>
    // import NavBar from './navbar'

    export default {
        props: {
            source: String,
            routes: Array,
        },
        components: {
            // NavBar
        },
        data: () => ({
            drawer: null,
        }),
        methods: {
            click(e) {
                this.$router.push(e.option.link || e.option.path)
            },
            showMainMenu(e) {
                this.$refs.main_menu.showMenu(e)
            }
        },
    }
</script>

<style scoped>
    .container {
        padding: 0;
    }
</style>
