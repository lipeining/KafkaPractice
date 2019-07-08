"use strict";

const { KafkaStreams } = require("kafka-streams");
const path = require('path');
const config = require("../config");
const help = require('./help');

const kafkaStreams = new KafkaStreams(config.nativeConfig);
const dir = path.basename(__dirname);
const type = path.basename(__filename, '.js');

const input = `${config[dir].title}_in_${type}`;
const out = `${config[dir].title}_out_${type}`;


kafkaStreams.on("error", (error) => {
    console.log("Error occured:", error.message);
});

async function test() {
    try {
        // await help.setUpProducer({ clientId: `${type}Id`, type, input });
        //  use client to make first and second
        const firstStream = kafkaStreams.getKStream("first-topic");
        const secondStream = kafkaStreams.getKStream("second-topic");
        const mergedStream = firstStream.merge(secondStream); //new KStream instance

        Promise.all([
                firstStream.start(),
                secondStream.start(),
                mergedStream.to(out)
            ])
            .then(() => {
                console.log("both consumers and the producer have connected.");
            });
        const stats = await stream.getStats();
        console.log(stats);
        // await help.setUpProducer({ clientId: `${type}Id`, type, input });
        // await help.setUpProducer({ clientId: `${type}Id`, type, input });
        // console.log(stream);
        const myNConsumer = await help.setUpConsumer({ groupId: `${type}Group`, out });
        await help.setUpProducer({ clientId: `${type}Id`, type, input });
        console.log(myNConsumer);
        // 这里开始设置producer and consumer.
        // assuming instance of nConsumer  assigned to a variable 'myNConsumer'
        // const shutdownConsumer = async function() {
        //     if (myNConsumer) {
        //         await myNConsumer.close();
        //     } else {
        //         console.log('shut down no myNconsumer');
        //     }
        // };
        // process.on('exit', shutdownConsumer);
        // process.on('SIGTERM', shutdownConsumer);
        // process.on('SIGINT', shutdownConsumer);
    } catch (err) {
        console.log('try-catch :', err);
    }
}
// async function fakeData() {
//     await help.setUpProducer({ clientId: `${type}Id`, type, input });
// }
test();