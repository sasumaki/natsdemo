
var stan = require('node-nats-streaming').connect('test-cluster', process.env.HOSTNAME, process.env.NATS_URI);
const fs = require('fs');


console.log(`STARTING WITH ${process.env.HOSTNAME} as id`)
var opts = stan.subscriptionOptions();
opts.setManualAckMode(true);
opts.setAckWait(30 * 1000); //30s
opts.setDeliverAllAvailable()
opts.setDurableName('durable')
opts.setMaxInFlight(1)

stan.on('connect', function () {

  const sub = stan.subscribe('Foo', 'foo.workers', opts)
  const prioSub = stan.subscribe('Prio', 'foo.workers', opts)
  sub.on('message', async (msg) => {
    setTimeout(() => {
      if (Math.random() <= 0.025) {
        console.log('CRASHED ON: ', msg.getData())
        process.exit(1)
      }
      msg.ack();
      fs.appendFile('progress.txt', `${msg.getData()}\n`, function (err) {
        if (err) throw err;
      });    }, 300)
  });
  prioSub.on('message', async (msg) => {
    setTimeout(() => {
      if (Math.random() <= 0.025) {
        console.log('CRASHED ON: ', msg.getData())
        process.exit(1)
      }
      msg.ack();
      fs.appendFile('progress.txt', `${msg.getData()}\n`, function (err) {
        if (err) throw err;
      });    }, 300)
  });
})