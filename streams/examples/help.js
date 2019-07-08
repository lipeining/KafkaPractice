const { NConsumer, NProducer } = require("sinek");

/**
 * 
 * @param {Object} options 
 * @param {Object} options.intvCount
 * @param {Object} options.intvTime 
 * @param {Object} options.clientId
 * @param {Object} options.type
 * @param {Object} options.input
 */
async function setUpProducer(options) {
    // 定时的发送对应的消息，根据我们的需要，一般100ms
    // 同时，可以指定发送的次数
    const intvTime = options.intvTime || 100;
    const intvCount = options.intvCount || 5;
    const producerConfiguration = {
        noptions: {
            "metadata.broker.list": "localhost:9092",
            "client.id": options.clientId,
            // "compression.codec": "none",
            "socket.keepalive.enable": true,
            "api.version.request": true,
            "queue.buffering.max.ms": 1000,
            "batch.num.messages": 500,
        },
        tconf: {
            "request.required.acks": 1
        },
    };

    // amount of partitions of the topics this consumer produces to
    const partitionCount = 1; // all messages to partition 0
    const producer = new NProducer(producerConfiguration, null, partitionCount);
    producer.on("error", error => {
        console.log('help producer error');
        console.error(error);
    });
    await producer.connect();
    const partition = 0;
    const key = options.type;
    let count = 0;
    let t = setTimeout(_send, intvTime);

    async function _send() {
        if (count < intvCount) {
            const sendRes = await producer.send(options.input, JSON.stringify({
                type: options.type,
                createTime: Date.now(),
                number: Math.random(),
            }), partition);
            console.log(`producer send result:${JSON.stringify(sendRes)}`);
            count++;
            t = setTimeout(_send, intvTime);
        } else {
            clearTimeout(t);
        }
    }
    return producer;
}

/**
 * 
 * @param {Object} options 
 * @param {Object} options.groupId
 * @param {Object} options.out
 */
async function setUpConsumer(options) {
    const consumerConfiguration = {
        noptions: {
            "metadata.broker.list": "localhost:9092",
            "group.id": options.groupId,
            "enable.auto.commit": false,
            "socket.keepalive.enable": true,
            "api.version.request": true,
            "socket.blocking.max.ms": 100,
            "queued.min.messages": 1000,
            "queued.max.messages.kbytes": 5000,
            "fetch.message.max.bytes": 524288,
        },
        tconf: {
            "auto.offset.reset": "earliest",
        },
    };
    const batchOptions = {
        batchSize: 10,
        commitEveryNBatch: 1,
        manualBatching: true,
        // batchSize: 1000, // decides on the max size of our "batchOfMessages"
        // commitEveryNBatch: 1, // will be ignored
        // concurrency: 1, // will be ignored
        // commitSync: false, // will be ignored
        noBatchCommits: true, // important, because we want to commit manually
        // manualBatching: true, // important, because we want to control the concurrency of batches ourselves
        sortedManualBatch: true, // important, because we want to receive the batch in a per-partition format for easier processing
    };
    const consumer = new NConsumer([options.out], consumerConfiguration);
    consumer.on("error", (error) => {
        console.log('help consumer error');
        console.error(error);
    });
    await consumer.connect();
    consumer.consume(async (batchOfMessages, callback) => {
        // deal with array of messages
        // and when your done call the callback to commit (depending on your batch settings)
        // 这里已经需要打印forEach即可
        console.log(`${options.out}:consuming:start`);
        /*
                export interface SortedMessageBatch {
                    [topic: string]: {
                        [partition: number]: KafkaMessage[];
                    };
                }
            */

        // parallel processing on topic level
        const topicPromises = Object.keys(batchOfMessages).map(async (topic) => {

            // parallel processing on partition level
            const partitionPromises = Object.keys(batchOfMessages[topic]).map((partition) => {

                // sequential processing on message level (to respect ORDER)
                const messages = batchOfMessages[topic][partition];
                // write batch of messages to db, process them e.g. async.eachLimit
                messages.map(message => { console.log(message); });
                return Promise.resolve();
            });

            // wait until all partitions of this topic are processed and commit its offset
            // make sure to keep batch sizes large enough, you dont want to commit too often
            await Promise.all(partitionPromises);
            await consumer.commitLocalOffsetsForTopic(topic);
        });

        await Promise.all(topicPromises);
        // callback still controlls the "backpressure"
        // as soon as you call it, it will fetch the next batch of messages
        console.log(`${options.out}:consuming:end`);
        callback();
    }, true, false, batchOptions);
    // asString asJSON
    // console.log(consumer);
    consumer.enableAnalytics();
    consumer.once('analytics', async () => {
        const consumerHealth = await consumer.checkHealth();
        console.log(consumerHealth);
    });
    return consumer;
}

module.exports = {
    setUpProducer,
    setUpConsumer,
}