const kafka = require('kafka-node');
const Producer = kafka.Producer;
const client = new kafka.KafkaClient();
const producer = new Producer(client);
const KeyedMessage = kafka.KeyedMessage;

const km = new KeyedMessage('key', 'message');
const payloads = [
    { topic: 'topic1', messages: 'hi', partition: 0 },
    { topic: 'topic2', messages: ['hello', 'world', km] }
];
producer.on('ready', function() {
    producer.send(payloads, function(err, data) {
        console.log(data);
    });
});

producer.on('error', function(err) { console.log(err) });