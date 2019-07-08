const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient();
const consumer = new Consumer(
    client,
    [
        { topic: 'topic1', partition: 0 }, { topic: 'topic2', partition: 0 },
        { topic: 'kStreamTest_in_base', partition: 0 }
    ], {
        groupId: 'topic-group',
        autoCommit: true
    }
);
consumer.on('message', function(message) {
    console.log(message);
});

consumer.on('error', function(err) { console.log(err); });

consumer.on('offsetOutOfRange', function(err) { console.log(err); });
const topicsToCreate = ['t1', 't2'];
client.createTopics(topicsToCreate, (error, result) => {
    // result is an array of any errors if a given topic could not be created
    console.log(error, result);
    if (!error) {
        consumer.addTopics(topicsToCreate, function(err, added) {
            console.log(err, added);
        });
    }
});
process.once('SIGINT', function() {
    console.log('SIGINT');
    consumer.commit((err, data) => {
        console.log(err);
        console.log(data);
    })
});
// process.on('beforeExit', () => {
//     console.log('beforeExit');
//     consumer.close(true, err => {console.log(err);});
// });