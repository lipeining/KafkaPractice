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

const keyMapperEtl = (kafkaMessage) => {
    const value = kafkaMessage.value.toString("utf8");
    const elements = value.toLowerCase().split(" ");
    return {
        someField: elements[0],
    };
};

async function test() {
    try {

        const stream = kafkaStreams.getKStream();

        stream
            .from(input)
            .map(keyMapperEtl)
            .countByKey("someField", "count")
            .filter(kv => kv.count >= 3)
            .map(kv => kv.someField + " " + kv.count)
            .tap(kv => console.log(kv))
            .to(out);

        const inputStream = kafkaStreams.getKStream();
        inputStream.to(input);

        const produceInterval = setInterval(() => {
            inputStream.writeToStream("kah vow");
        }, 100);

        Promise.all([
            stream.start(),
            inputStream.start()
        ]).then(() => {
            console.log("started..");
            // produce & consume for 5 seconds
            setTimeout(() => {
                clearInterval(produceInterval);
                kafkaStreams.closeAll();
                console.log("stopped..");
            }, 5000);
        });
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