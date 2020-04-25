<template>
    <div class="tf">
        <button @click="reloadData">Refresh</button>
        <p v-for="field in entityProps" :key="field">
            <span v-if="testData">
                <label :for="testData[field]">{{ field }} = {{ testData[field]['currentTime'] }}</label>
                <br />
                <input :id="testData[field]" v-model="testData[field]['currentTime']" />
            </span>
        </p>
        <!-- <p>
            <label for="name">Rabbit:</label>
            <input id="name" v-model="msg.rabbit.eats" />
        </p>
        <p>Lion: {{ msg.lion.eats }}</p>
        <p>Rabbit: {{ msg.rabbit.eats }}</p>-->
    </div>
</template>
                
<script>
import * as tfjsUtils from '../utils/TfJsUtils.js'

const accessId = 'access.adx.admin'
const serviceRequestEntityType =
    'tribefire.adx.model.deployment.service.statistics.GetGlobalRepresentationJobStatistics'
let sessionId = ''
let session = ''

export default {
    name: 'TfData',
    props: ['msg'],
    data() {
        return {
            testData: null,
            entityProps: [
                'lastDayDistribution',
                'lastDayPanicDistribution',
                'lastDaySuccessDistribution',
                'lastHourDistribution',
                'lastHourPanicDistribution',
                'lastHourSuccessDistribution',
                'lastMonthDistribution',
                'lastMonthPanicDistribution',
                'lastMonthSuccessDistribution',
                'lastYearDistribution',
                'lastYearPanicDistribution',
                'lastYearSuccessDistribution'
            ]
        }
    },
    methods: {
        readData() {
            // console.log(tfjsUtils)
            tfjsUtils
                .tfAuthenticate()
                .then(result => {
                    console.log('1.')
                    sessionId = result
                    return sessionId
                })
                .then(() => {
                    console.log('2.')
                    return tfjsUtils.getSession(accessId)
                })
                .then(result => {
                    console.log('3.')
                    session = result
                    return result
                })
                .then(session => {
                    console.log('4.')
                    return tfjsUtils.serviceRequestCall(session, sessionId, accessId, serviceRequestEntityType)
                })
                .then(result => {
                    console.log('ServisProcessor successfully executed', result)
                    this.testData = result
                })
                .catch(err => {
                    this.errors.push(err.DetailMessage)
                })
        },
        reloadData() {
            tfjsUtils.serviceRequestCall(session, sessionId, accessId, serviceRequestEntityType).then(result => {
                console.log('ServisProcessor successfully executed', result)
                this.testData = result
            })
        }
    },
    created() {
        this.readData()
    }
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
