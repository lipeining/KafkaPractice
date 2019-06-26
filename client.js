const kafka = require('kafka-node');
const Producer = kafka.Producer;
const client = new kafka.KafkaClient();
const config = require('./config');


function example() {
    const topicsToCreate = config.example.topics;

    client.createTopics(topicsToCreate, (error, result) => {
        // result is an array of any errors if a given topic could not be created
        console.log(error, result);
    });
}

function stream() {
    const topicsToCreate = config.stream.topics;
    client.createTopics(topicsToCreate, (error, result) => {
        // result is an array of any errors if a given topic could not be created
        console.log(error, result);
    });
}
stream();