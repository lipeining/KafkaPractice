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
const stream = kafkaStreams.getKStream(input);


kafkaStreams.on("error", (error) => {
    console.log("Error occured:", error.message);
});



async function test() {
    try {
        // await help.setUpProducer({ clientId: `${type}Id`, type, input });
        stream
            .mapJSONConvenience()
            .concatMap((msg) => {
                return stream.getNewMostFrom([
                    Promise.resolve({ taskId: 1, type: 1, value: msg.value }),
                    Promise.resolve({ taskId: 1, type: 2, value: "type_2" })
                ]);
            })
            .awaitPromises()
            .map((message) => {
                return {
                    payload: message,
                    time: new Date().toISOString(),
                    type: message.type,
                    id: message.taskId,
                };
            })
            .to(out, 1, "buffer");
        //start the stream
        //(wait for the kafka consumer to be ready)
        // await stream.start().then(_ => {
        //     //wait a few ms and close all connections
        //     // setTimeout(kafkaStreams.closeAll.bind(kafkaStreams), 3000);
        // });
        await stream.start();
        const stats = await stream.getStats();
        console.log(stats);
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