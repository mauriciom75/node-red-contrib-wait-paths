# node-red-contrib-wait-paths

![Alt text](example.jpg?raw=true "Optional Title")

Wait parallel branches to continue flow.
This node wait for any value in all defined variables in the configuration array of variables. Each variable in the array corresponds with an input path.
The variables in the input messages must be stored under msg.paths["variable_name"].
When all variables are initialized with a value (through diferent arrived messages) then only one output message is sended, with all configured variables merged under msg.paths. This output message is based on the message that arrives from first variable/path defined in the configuration array.
The node uses an internal array to store temporary values until all variables are inicialized with values. By default it uses msg._msgid to correlate variables of same flow execution instance, but optionally you can use the field msg.paths_correlationId with another identifier. This identificator serves to prevent merge of flow instances for example between parallel http request-response execution flow instances.
This node includes a timeout configuration to prevent reserved memory forever if a message never arrives.

Initial properties interface must be improved. warning! Pending validation of json argument in properties.

## Example

```javascript
[{"id":"42bc4050.7b659","type":"inject","z":"53c0e5f0.e465fc","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":123,"y":77,"wires":[["8791c8ba.f5d388","77945912.9e95a8"]]},{"id":"77945912.9e95a8","type":"delay","z":"53c0e5f0.e465fc","name":"","pauseType":"delay","timeout":"2","timeoutUnits":"seconds","rate":"1","nbRateUnits":"1","rateUnits":"second","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":false,"x":196,"y":156.00000190734863,"wires":[["a057c6d2.c75488"]]},{"id":"a057c6d2.c75488","type":"change","z":"53c0e5f0.e465fc","name":"","rules":[{"t":"set","p":"paths[\"other_path\"]","pt":"msg","to":"{\"pepe\":\"true\",\"camino\":\"2\"}","tot":"json"}],"action":"","property":"","from":"","to":"","reg":false,"x":389,"y":220.00000286102295,"wires":[["3b52fab3.687a86"]]},{"id":"8791c8ba.f5d388","type":"change","z":"53c0e5f0.e465fc","name":"","rules":[{"t":"set","p":"paths[\"path_1\"]","pt":"msg","to":"true","tot":"bool"}],"action":"","property":"","from":"","to":"","reg":false,"x":393.0000305175781,"y":97.00000095367432,"wires":[["3b52fab3.687a86"]]},{"id":"3b52fab3.687a86","type":"wait-paths","z":"53c0e5f0.e465fc","name":"","paths":"[\"path_1\",\"other_path\"]","timeout":"15000","finalTimeout":"60000","x":613.1666717529297,"y":163.88888931274414,"wires":[["dec836b4.5ca998"]]},{"id":"dec836b4.5ca998","type":"debug","z":"53c0e5f0.e465fc","name":"","active":true,"console":"false","complete":"true","x":777.1000556945801,"y":213.6000461578369,"wires":[]}]
```
