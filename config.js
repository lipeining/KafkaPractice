module.exports = {
    example: {
        topics: [{
                topic: 'topic1',
                partitions: 1,
                replicationFactor: 1
            },
            {
                topic: 'topic2',
                partitions: 1,
                replicationFactor: 1,
                // Optional set of config entries
                configEntries: [{
                        name: 'compression.type',
                        value: 'gzip'
                    },
                    {
                        name: 'min.compaction.lag.ms',
                        value: '50'
                    }
                ],
            }
        ]
    },
    stream: {
        topics: [{
                topic: 'ExampleTopic',
                partitions: 1,
                replicationFactor: 1
            },
            {
                topic: 'RebalanceTopic',
                partitions: 1,
                replicationFactor: 1,
            }
        ]
    }
};