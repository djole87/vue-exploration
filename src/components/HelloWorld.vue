<template>
    <div class="hello">
        <p>
            <label for="lion">Lion:</label>
            <input id="lion" v-model="msg.lion.eats" />
        </p>
        <p>
            <label for="rabbit">Rabbit:</label>
            <input id="rabbit" v-model="msg.rabbit.eats" />
        </p>
        <p>Lion: {{ msg.lion.eats }}</p>
        <p>Rabbit: {{ msg.rabbit.eats }}</p>
    </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    props: ['msg']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}
</style>
