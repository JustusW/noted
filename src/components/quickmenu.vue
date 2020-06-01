<template>
    <vue-simple-context-menu
            element-id="canvas_menu"
            ref="canvas_menu"
            :options="[
                {name: 'post_add', class: 'material-icons',eventName:'qmaddnote'},
                {name: 'add_to_queue', class: 'material-icons',eventName:'qmaddcontainer'},
                {name: 'home', class: 'material-icons',eventName:'qmhome'},
                {name: 'save', class: 'material-icons',eventName:'qmsave'},
                {name: 'settings', class: 'material-icons',eventName:'qmsettings'},
            ]"
            @option-clicked="handleClick"
            v-touch:tap.stop.prevent="touch"
    />
</template>

<script>
    import _ from 'lodash'

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
            touch(ev) {
                ev.target.click()
            },
            handleClick: _.debounce(function (item) {
                this.$el.dispatchEvent(new CustomEvent(item.option.eventName, {bubbles: true, detail: this.options}))
            }, 100),
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