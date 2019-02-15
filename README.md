# node-red-contrib-wait-paths

![Alt text](example.jpg?raw=true "Optional Title")

Wait parallel branches to continue flow.
It can also be used as a timeout node.

This node waits for any value in all defined variables in the configuration array of variables. Each variable in the array corresponds with an input path to wait. It can also be configured in execution time using msg.pathsToWait with the array of variables/paths names to wait. 

The variables in the input messages must be stored in associative array (object) msg.paths["variable_name"]=value . When all variables are initialized with a value (through diferent arrived messages) then only one output message is sent, with all configured variables merged under msg.paths. This output message is based on the message that arrives from first variable/path defined in the configuration array.

The node uses an internal array to store temporary values until all variables are inicialized with values. By default it uses msg._msgid to correlate variables of same flow execution instance, but optionally you can use the field msg.pathsCorrelationId with another identifier. This identificator serves to prevent merge of flow instances for example between parallel http request-response execution flow instances.

This node includes a timeout configuration to prevent reserved memory forever if a message never arrives.

Another use case can be as a timeout node, taking advantage of the timeout functionality. An input message arrives and starts a "timer" (setTimeout) if the second message does not arrive in the configured interval, this node throws a timeout error with the first message received. Then you can catch the error and continue with the flow.


## Example

```javascript
[{"id":"dc75add7.56beb","type":"inject","z":"57c55450.7ddccc","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":152,"y":460,"wires":[["81c0b9da.6cc5c8","af182b53.c06ab8"]]},{"id":"af182b53.c06ab8","type":"delay","z":"57c55450.7ddccc","name":"","pauseType":"delay","timeout":"2","timeoutUnits":"seconds","rate":"1","nbRateUnits":"1","rateUnits":"second","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":false,"x":225,"y":539.0000019073486,"wires":[["c22fe762.c28108"]]},{"id":"c22fe762.c28108","type":"change","z":"57c55450.7ddccc","name":"","rules":[{"t":"set","p":"paths[\"other_path\"]","pt":"msg","to":"{\"pepe\":\"true\",\"camino\":\"2\"}","tot":"json"}],"action":"","property":"","from":"","to":"","reg":false,"x":418,"y":603.000002861023,"wires":[["60cfe846.e05e68"]]},{"id":"81c0b9da.6cc5c8","type":"change","z":"57c55450.7ddccc","name":"","rules":[{"t":"set","p":"paths[\"path_1\"]","pt":"msg","to":"true","tot":"bool"}],"action":"","property":"","from":"","to":"","reg":false,"x":422.0000305175781,"y":480.0000009536743,"wires":[["60cfe846.e05e68"]]},{"id":"60cfe846.e05e68","type":"wait-paths","z":"57c55450.7ddccc","name":"","pathsToWait":"[\"path_1\",\"other_path\"]","timeout":"15000","finalTimeout":"60000","x":642.1666717529297,"y":546.8888893127441,"wires":[["d03cc862.9795f8"]]},{"id":"d03cc862.9795f8","type":"debug","z":"57c55450.7ddccc","name":"","active":true,"console":"false","complete":"true","x":806.1000556945801,"y":596.6000461578369,"wires":[]}]
```
