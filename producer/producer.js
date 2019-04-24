
var stan = require('node-nats-streaming').connect('test-cluster', 'producer', process.env.NATS_URI)
const fs = require('fs')

fs.writeFileSync('./progress.txt', '', { encoding: 'utf-8', flag: 'w' })
const publish = () => {
  for (let i = 0; i < 1000; i++) {
    stan.publish('Foo', String(i), (err, guid) => {
      if (err) {
        console.log('publish failed: ' + err);
      } else {
      }
    })
  }
}
const publishPrio = () => {
  stan.publish('Prio', "PRIORITY VIESTI APUA", () => {
    console.log('prio lähetetty')
  })
}
stan.on('connect', () => {
  publish()
  setInterval(() => {
  publish()
  }, 180 * 1000)
  setInterval(() => {
    publishPrio()
  }, 5 * 1000)
})