__consumer_offset:
数据为：
group.id,topic+partition,offset
kafka内部记录consumer的消费的offset情况的topice
只要一个key：（group.id+topic+partition）进行了更新value:(offset)，kafka会定期执行compact操作，保证一个key只保存最新的offset的消息，
既避免了对分区日志消息的修改，也控制住了__consumer_offset topic总体的
日志容量，还能反映最新的消费进度。
做50个分区的目的是为了：
如果多个consumer同时提交offset,必将加重__consumer_offset的写入负载。
创建50个分区，对每一个group.id做哈希求模运算，将负载分散到不同的分区。

一些参数解读
session.timeout.ms在0.10.1.0之后，作为一个coordinator检测失败的时间，默认10s。
max.poll.interval.ms每一个consumer处理逻辑最大事件。
auto.offset.reset 指定无位移信息或位移越界时的处理策略。
earliest
latest
none

enable.auto.commit 是否自动提交
fetch.max.bytes指定consumer单次获取数据的最大字节数
如果业务消息很大，需要设置一个较大的值。否则consumer无法消费这些消息
max.poll.records默认500条。每次poll调用返回的最大消息数
heartbeat.interval.ms
心跳的发送时间，必须比session.timeout.ms小。

connections.max.idle.ms 默认9分钟的关闭空闲socket.如果不在意socket资源的消耗，那么可以设置为-1.

Java Consumer是一个多线程或者说双线程 程序。
1.创建KafakaConsumer的用户主线程，
2.consumer后台创建的一个心跳线程：后台心跳线程。
KafkaConsumer的poll方法在用户主线程中运行，表明：
消费组执行rebalance,消息获取，coordinator管理，异步任务结果的
处理甚至位移提交操作都是在用户主线程中的。所以调优poll方法的相关
超时时间参数至关重要。


poll返回的条件：其一即可
1.从broker获得足够的数据
2.等待时间超过指定的超时设置


交付语义:
at most once
at least once
exactly once
当consumer运行一段事件之后，它必须要提交自己的位移值。如果
consumer崩溃或者被关闭，它负责的分区就会被分配到其他consumer,因此
一定要在其他分区consumer读取这些分区之前，就做好offset提交工作，
否则会出现消息的重复消费。
默认的自动提交是：auot.commit.interval.ms为5秒。

rebalance触发条件：
1.组成员变更
2.组订阅topic数变更
3.组订阅topic的partition数变更

分配策略：
1.range,
2.round-robin
3.sticky
heartbeat请求中的响应中是否包含：REBALANCE_IN_PROGRESS来判断是否开启新一轮balance


