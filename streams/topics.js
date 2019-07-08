// 这里统一创建对应的代码所需要的topics，
// 每一个例子的topic只创建一次。
// topics的格式是： title-in-type  title-out-type

const kafka = require('kafka-node');
const client = new kafka.KafkaClient();
const config = require('./config');

function getTopics(dir) {
    if (!config[dir]) {
        throw new Error(`no such dir ${dir}`);
    }
    return config[dir].types.map(type => {
        return [
            `${config[dir].title}_in_${type}`,
            `${config[dir].title}_out_${type}`,
        ].map(topic => {
            return {
                topic,
                partitions: 1,
                replicationFactor: 1
            }
        });
    }).reduce((acc, item) => {
        return acc.concat(item);
    }, []);
}
const argv = process.argv;
const dir = argv[2] || 'examples';
if (!dir) {
    console.log(`unkown argv ${JSON.stringify(argv)}`);
}
// console.log(config);
const topicsToCreate = getTopics(dir);
console.log(topicsToCreate);
// 目前的分区只能1:1=p:r
client.createTopics(topicsToCreate, (error, result) => {
    // result is an array of any errors if a given topic could not be created
    console.log(error, result);
});