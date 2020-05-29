<template>
    <RadialMenu
            style="background-color: white"
            :style="style()"
            :itemSize="90"
            :radius="120"
            :angle-restriction="180"
            @click="centerClick"
            :open="options.show"
    >
        <RadialMenuItem
                v-for="(item, index) in items"
                :key="index"
                style="background-color: white"
                @click="() => handleClick(item)">
            <span>{{item.display}}</span>
        </RadialMenuItem>
    </RadialMenu>
</template>

<script>
    import {RadialMenu, RadialMenuItem} from 'vue-radial-menu'

    export default {
        name: "quickmenu",
        components: {
            RadialMenu,
            RadialMenuItem
        },
        props: {
            options: Object,
        },
        data() {
            return {
                items: [
                    {display: 'Add Note', event: 'addnote'},
                ],
            }
        },
        methods: {
            centerClick() {
                this.$el.dispatchEvent(new CustomEvent('closeradial', {bubbles: true, detail: this.options}))
            },
            handleClick(item) {
                this.$el.dispatchEvent(new CustomEvent(item.event, {bubbles: true, detail: this.options}))
            },
            style() {
                return 'position: absolute; ' +
                    'left: ' + this.options.x + 'px;' +
                    'top: ' + this.options.y + 'px;' +
                    'display: ' + (this.options.show ? 'initial' : 'none') + '; '
            },
        },
    }
</script>

<style scoped>

</style>