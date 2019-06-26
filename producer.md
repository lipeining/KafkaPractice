producer端“无消息丢失配置”
block.on.buffer.full=true 0.10.0.0之后设置max.blocak.ms
acks=all or -1
retries = Integer.Max_VALUE
max.in.flight.request.per.connection = 1 主要防止同分区下的消息乱序问题。限制了producer在单个broker连接上能够发送的未响应请求的数量。如果设置为1,那么在broker发送响应之前，无法再给该broker发送produce请求。
使用回调机制发送消息
在callback逻辑中显示地立即关闭producer,close(0)
unclean.leader.election.enable= false
replication.factor=3
min.insync.replicas=2
replication.factor>min.insync.replicas
enable.auto.commit=false
