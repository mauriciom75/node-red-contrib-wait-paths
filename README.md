# node-red-contrib-wait-paths

![Alt text](example.jpg?raw=true "Optional Title")

This node wait for any value in all defined variables in the configuration array of variables. Uses the context.flow to store temporary values until all variables are inicialized with values.
the variables must be/are stored under msg.paths["variable_name"].
when all variables are initialized (with diferent arrived messages) the node merge the variables under msg.paths, send the output message and delete temporary context.flow variables.
The key to store flow varibles include the msg._msgid value, to prevent merge of flow instances between for example in http request-response flows.

Initial properties interface must be improved. warning! No validation of json argument in properties.
