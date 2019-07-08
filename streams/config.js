const config = {
    examples: {
        title: 'kStreamTest',
        types: ['base', 'merge', 'awaitPromise', 'wordCount', 'map']
    },
    nativeConfig: {
        noptions: {
            "metadata.broker.list": "localhost:9092",
            "group.id": "k-stream-test-1",
            "client.id": "k-stream-test-1",
            "event_cb": true,
            // "compression.codec": "snappy",
            "api.version.request": true,
            "socket.keepalive.enable": true,
            "socket.blocking.max.ms": 100,
            "enable.auto.commit": true,
            "auto.commit.interval.ms": 100,
            "heartbeat.interval.ms": 250,
            "retry.backoff.ms": 250,
            "fetch.min.bytes": 1,
            "fetch.message.max.bytes": 2 * 1024 * 1024,
            // "queued.min.messages": 100,
            // "fetch.error.backoff.ms": 100,
            // "queued.max.messages.kbytes": 50,
            // "fetch.wait.max.ms": 1000,
            // "queue.buffering.max.ms": 1000,
            // "batch.num.messages": 10000
        },
        tconf: {
            "auto.offset.reset": "earliest",
            "request.required.acks": 1
        },
        batchOptions: {
            "batchSize": 5,
            "commitEveryNBatch": 1,
            "concurrency": 1,
            "commitSync": false,
            "noBatchCommits": false
        }
    },
};

module.exports = config;