<template>
    <v-card>
        <v-card-title class="headline">Canvas Settings</v-card-title>

        <v-card-text>
            <v-row justify="space-around">
                <v-checkbox label="Snap to Grid" v-model="value.grid"></v-checkbox>
            </v-row>
            <v-row justify="space-around">
                <v-color-picker class="ma-2" show-swatches swatches-max-height="300px"
                                v-model="value.bgcolor"></v-color-picker>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        name: "settings",
        props: {
            value: Object,
        },
        data() {
            return {
                swatches: [
                    ['#FF0000', '#AA0000', '#550000'],
                    ['#FFFF00', '#AAAA00', '#555500'],
                    ['#00FF00', '#00AA00', '#005500'],
                    ['#00FFFF', '#00AAAA', '#005555'],
                    ['#0000FF', '#0000AA', '#000055'],
                ],
            }
        },
    }
</script>

<style scoped>

</style>