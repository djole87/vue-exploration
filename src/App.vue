<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png" />
        <HelloWorld :msg="testData" />
    </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
    name: 'App',
    components: {
        HelloWorld
    },
    data() {
        return {
            testData: null
        }
    },
    created() {
        // test starts
        let animal = {
            eats: 'eats'
        }

        let rabbit = {
            jumps: { value: 'jumps' }
        }

        Object.setPrototypeOf(rabbit, animal)
        rabbit.pera = Object.getPrototypeOf(rabbit)

        let lion = Object.create(animal)

        this.testData = {
            rabbit: rabbit,
            lion: lion
        }
        // test ends;
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
