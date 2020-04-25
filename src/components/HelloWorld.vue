<template>
    <div class="hello">
        <p>
            <label for="name">Lion:</label>
            <input id="name" v-model="msg.lion.eats" />
        </p>
        <p>
            <label for="name">Rabbit:</label>
            <input id="name" v-model="msg.rabbit.eats" />
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
