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
        const [one$, two$] = stream
            .branch([() => true, () => true]);

        const producerPromiseOne = one$
            .mapJSONConvenience()
            .mapWrapKafkaValue()
            .tap((msg) => console.log("one", msg))
            .wrapAsKafkaValue()
            .to(out, 1, "buffer");

        const producerPromiseTwo = two$
            .mapJSONConvenience()
            .mapWrapKafkaValue()
            .tap((msg) => console.log("two", msg))
            .wrapAsKafkaValue()
            .to(out, 1, "buffer");

        Promise.all([
            producerPromiseOne,
            producerPromiseTwo,
            stream.start(),
        ]).then(() => {
            console.log("Stream started, as kafka consumer and producers are ready.");
        }, (error) => {
            console.log("Streaming operation failed to start: ", error);
        });
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