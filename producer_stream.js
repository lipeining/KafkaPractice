const Transform = require('stream').Transform;
const kafka = require('kafka-node');
// const client = new kafka.KafkaClient();
const ProducerStream = kafka.ProducerStream;
const _ = require('lodash');
const producer = new ProducerStream();

// 需要使用 client.js 创建 ExampleTopic
const stdinTransform = new Transform({
    objectMode: true,
    decodeStrings: true,
    transform(text, encoding, callback) {
        text = _.trim(text);
        console.log(`pushing message ${text} to ExampleTopic`);
        callback(null, {
            topic: 'ExampleTopic',
            messages: text
        });
    }
});

process.stdin.setEncoding('utf8');
process.stdin.pipe(stdinTransform).pipe(producer);