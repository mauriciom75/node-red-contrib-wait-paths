# node-red-contrib-wait-paths

![Alt text](example.jpg?raw=true "Optional Title")

This node wait for any value in all defined variables in the configuration array of variables. Uses the context.flow to store temporary values until all variables are inicialized with values.
the variables must be/are stored under msg.paths["variable_name"].
When all variables are initialized (through diferent arrived messages) then only one output message is send, with all configured variables merged under msg.paths, and the temporary context.flow variables are deleted.
The key to store varibles in context.flow includes the msg._msgid value, to prevent merge of flow instances for example between http request-response execution flow instances.

Initial properties interface must be improved. warning! No validation of json argument in properties.

## Example

```javascript
[{"id":"90bd5827.aa91f8","type":"inject","z":"d4c3ac41.1b7ad","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":109,"y":71.00000190734863,"wires":[["b6754421.af9328","92c7a271.f5e14"]]},{"id":"92c7a271.f5e14","type":"delay","z":"d4c3ac41.1b7ad","name":"","pauseType":"delay","timeout":"2","timeoutUnits":"seconds","rate":"1","nbRateUnits":"1","rateUnits":"second","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":false,"x":182,"y":150.00000381469727,"wires":[["1d8a1bc.691bfe4"]]},{"id":"1d8a1bc.691bfe4","type":"change","z":"d4c3ac41.1b7ad","name":"","rules":[{"t":"set","p":"paths[\"other_path\"]","pt":"msg","to":"{\"pepe\":\"true\",\"camino\":\"2\"}","tot":"json"}],"action":"","property":"","from":"","to":"","reg":false,"x":375,"y":214.00000476837158,"wires":[["dea7d157.7e525"]]},{"id":"b6754421.af9328","type":"change","z":"d4c3ac41.1b7ad","name":"","rules":[{"t":"set","p":"paths[\"path_1\"]","pt":"msg","to":"true","tot":"bool"}],"action":"","property":"","from":"","to":"","reg":false,"x":379.0000305175781,"y":91.00000286102295,"wires":[["dea7d157.7e525"]]},{"id":"dea7d157.7e525","type":"wait-paths","z":"d4c3ac41.1b7ad","name":"","paths":"[\"path_1\",\"other_path\"]","x":599.1666717529297,"y":157.88889122009277,"wires":[["855fe189.f8657"]]},{"id":"855fe189.f8657","type":"debug","z":"d4c3ac41.1b7ad","name":"","active":true,"console":"false","complete":"true","x":763.1000556945801,"y":207.60004806518555,"wires":[]}]
```
