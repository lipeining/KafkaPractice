const kafka = require('kafka-node');
const client = new kafka.KafkaClient();
const admin = new kafka.Admin(client); // client must be KafkaClient
function list() {
    admin.listGroups((err, res) => {
        console.log('consumerGroups', res);
    });
}

function describe(groups) {
    admin.describeGroups(groups, (err, res) => {
        console.log(JSON.stringify(res, null, 1));
    });
}
describe(['ExampleTestGroup']);