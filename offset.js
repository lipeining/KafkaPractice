const kafka = require('kafka-node');
const client = new kafka.KafkaClient();
const offset = new kafka.Offset(client);

function time(time) {
    offset.fetch([
        { topic: 'topic1', partition: 0, time, maxNum: 1 }
    ], function(err, data) {
        // data
        // { 't': { '0': [999] } }
        console.log(err);
        console.log(data);
    });
}
time(); // undefined => Date.now()
time(-1); // 
time(-2); // 
function commited(groupId) {
    offset.fetchCommitsV1(groupId, [
        { topic: 'topic1', partition: 0 }
    ], function(err, data) {
        console.log(err);
        console.log(data);
    });
}
commited('topic-group');

function latestCommit(topic) {
    const partition = 0;
    offset.fetchLatestOffsets([topic], function(error, offsets) {
        console.log(error);
        console.log(offsets[topic][partition]);
    });
}
latestCommit('topic1');