import * as tfjs from '../../public/tf.js'

export let sessionId = null

export const tf = new tfjs.TribefireJs({
    protocol: 'https',
    host: '/dev-phoenix-adx.staging.tribefire.cloud',
    tribefireServicesUrl: 'services',
    port: '',
    sessionIdProvider: function() {
        return sessionId
    }
})

window.tf = tf

export async function tfAuthenticate(username = 'cortex', password = 'cortex') {
    return tf.authenticate(username, password).then(session => {
        sessionId = session.userSession.sessionId
        return sessionId
    })
}

export async function getSession(accessId) {
    return tf.session(accessId)
}
// TODO add params to make this method generic
export async function serviceRequestCall(session, sessionId, domainId, serviceRequestEntityType) {
    const request = tf.types.get(serviceRequestEntityType).create()
    request.domainId = domainId
    request.sessionId = sessionId
    const resp = session.eval(request)
    console.log(resp)
    return resp
}
