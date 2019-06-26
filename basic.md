备份冗余：
一个topic的分区有n个replica，每一个follower的备份都是在不同的
broker,副本Id为副本所在的broker的Id.如果leader挂掉，会选择一个
follower成为leader。平时follower只同步leader的数据，不提供其他服务。

ISR in-sync replica
对于至少一个存活的replica和已提交的消息，保证持久化。
未成功提交的消息依旧会丢失。
