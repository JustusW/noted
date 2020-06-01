<template>
        <Note :note="note" :anchor="anchor"></Note>
</template>

<script>
    import Note from './note'

    export default {
        name: "gridnote",
        props: {
            note: Object,
            anchor: Object,
            container: Object,
        },
        components: {
                Note,
        },
    }
</script>

<style scoped>

</style>