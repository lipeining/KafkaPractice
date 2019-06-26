const kafka = require('kafka-node');
const HighLevelProducer = kafka.HighLevelProducer;
const client = new kafka.KafkaClient();
const producer = new HighLevelProducer(client);
const KeyedMessage = kafka.KeyedMessage;

const km = new KeyedMessage('key', 'message');
const payloads = [
    { topic: 'topic1', messages: 'high-hi', partition: 0, key: 'order' },
    { topic: 'topic2', messages: ['high-hello', 'high-world', km], key: 'order' }
];
producer.on('ready', function() {
    producer.send(payloads, function(err, data) {
        console.log(data);
    });
});

producer.on('error', function(err) { console.log(err) });