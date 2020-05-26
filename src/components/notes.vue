<template>
    <div class="notes">
        <h1>Notes</h1>
    </div>
</template>

<script>
    export default {
        name: 'notes',
        props: {
            title: String
        },
        data: function () {
            return {
                notes: [
                    {name: 'sample note'}
                ],
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
