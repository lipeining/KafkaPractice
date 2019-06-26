const Transform = require('stream').Transform;
const kafka = require('kafka-node');
// const client = new kafka.KafkaClient();
const ProducerStream = kafka.ProducerStream;
const ConsumerGroupStream = kafka.ConsumerGroupStream;
const resultProducer = new ProducerStream();

const consumerOptions = {
    kafkaHost: '127.0.0.1:9092',
    groupId: 'ExampleTestGroup',
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    asyncPush: false,
    id: 'consumer1',
    fromOffset: 'latest'
};
// 需要使用 client.js 创建 ExampleTopic,
// 需要使用 client.js 创建 RebalanceTopic,

const consumerGroup = new ConsumerGroupStream(consumerOptions, 'ExampleTopic');

const messageTransform = new Transform({
    objectMode: true,
    decodeStrings: true,
    transform(message, encoding, callback) {
        console.log(`Received message ${message.value} transforming input`);
        callback(null, {
            topic: 'RebalanceTopic',
            messages: `You have been (${message.value}) made an example of`
        });
    }
});

consumerGroup.pipe(messageTransform).pipe(resultProducer);