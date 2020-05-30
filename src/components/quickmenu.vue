<template>
    <vue-simple-context-menu
            element-id="canvas_menu"
            ref="canvas_menu"
            :options="[
                {name: 'add', class: 'material-icons',eventName:'qmadd'},
                {name: 'home', class: 'material-icons',eventName:'qmhome'},
                {name: 'save', class: 'material-icons',eventName:'qmsave'},
            ]"
            @option-clicked="handleClick"
            v-touch:tap="handleTouch"
    />
</template>

<script>
    export default {
        name: "quickmenu",
        components: {},
        props: {
            options: Object,
        },
        methods: {
            show(ev) {
                this.$refs.canvas_menu.showMenu(ev, this.options)
            },
            handleTouch(e) {
                e.target.click()
            },
            handleClick(item) {
                this.$el.dispatchEvent(new CustomEvent(item.option.eventName, {bubbles: true, detail: this.options}))
            },
            style() {
                let height, width
                try {
                    let elm = this.$refs.rm.$el
                    height = parseInt(elm.style.height)
                    width = parseInt(elm.style.width)
                } catch (e) {
                    height = 0
                    width = 0
                }
                return 'position: absolute; ' +
                    'left: ' + (this.options.x - width / 2) + 'px;' +
                    'top: ' + (this.options.y - height / 2) + 'px;' +
                    'display: ' + (this.options.show ? 'initial' : 'none') + '; '
            },
        },
    }
</script>

<style scoped>

</style>