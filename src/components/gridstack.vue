<template>
    <div
            v-on:click.stop=""
            v-on:scroll.stop=""
            v-on:mousedown.stop=""
            v-on:mouseout.stop=""
            v-on:wheel.stop=""
            v-on:mouseover.stop=""
            v-on:remove.stop=""
    >

        <slot></slot>
    </div>
</template>

<script>
    import { Dashboard, DashLayout, DashItem } from "vue-responsive-dash";

    export default {
        name: "gridstack",
        data() {
            return {
                widgets: [],
                gs: null,
            }
        },
        components: {
            Dashboard,
        },
        methods: {
        },
        mounted() {
        },
    }
</script>

<style scoped>

</style>