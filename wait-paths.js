module.exports = function(RED) {
    function waitPathsNode(config) {
        RED.nodes.createNode(this,config);

        this.paths = JSON.parse(config.paths);

        this.pathsContol = [];
        if ( config.timeout == "" )
            this.timeout = 15000;
        else
            this.timeout = Number(config.timeout);

        if ( config.finalTimeout == "" )
            this.finalTimeout = 60000;
        else
            this.finalTimeout = Number(config.finalTimeout);

        var node = this;

        node.interval = setInterval( function () {

            var time = Date.now();



            var correlationIds = Object.keys(node.pathsContol);
            correlationIds.forEach( function (correlationId) {

                if ( !node.pathsContol[correlationId].timeoutDone )
                {
                    /*
                    var wdelete = false;
                    var keys2 = Object.keys(node.pathsContol[correlationId].paths);
                    keys2.forEach( function (key2) {
                        console.log("  verifico " + key2);
                        if (node.pathsContol[correlationId].paths[key2].time + node.timeout < time)
                        {
                            wdelete = true;
                        }
                    });
                    */
                    //if (wdelete)
                    if (node.pathsContol[correlationId].time + node.timeout < time)
                    {
                        node.error("wait-paths timeout!", node.pathsContol[correlationId].main_msg);
                        node.pathsContol[correlationId].timeoutDone = true;
                        //delete node.pathsContol[correlationId];
                    }
                }
                else
                    if ( node.pathsContol[correlationId].time + node.finalTimeout < time )
                    {
                        delete node.pathsContol[correlationId];
                    }
            });

        }, 5000);

        node.on('close', function() {
            clearInterval(node.interval);
    
        });
        
        node.on('input', function(msg) {
            
            if (msg.paths_correlationId)
                var correlationId = msg.paths_correlationId;
            else            
                var correlationId = msg._msgid.replace(".","0");

            if ( !node.pathsContol[correlationId] || 
                 node.pathsContol[correlationId] && !node.pathsContol[correlationId].timeoutDone ) // si ya dio timeout. No hago nada.
            {
                var paths = node.paths;
                var pathsLength = paths.length;
                
                // guardo variables que van llegando
                for (var i = 0; i < pathsLength; i++) {
                    if (msg.paths[paths[i]]) {
                        if (!node.pathsContol[correlationId]) node.pathsContol[correlationId] = {};
                        node.pathsContol[correlationId].time = Date.now();

                        /*
                        node.pathsContol[correlationId].paths = {}; 

                        node.pathsContol[correlationId].paths[paths[i]] = { "data": msg.paths[paths[i]],
                                                                            "time": Date.now() };
                        */
                        // El path principal es el primero de la lista 
                        if ( i == 0 )
                        {
                            if ( !node.pathsContol[correlationId].main_msg )
                            {
                                // si vino el mensaje del path principal, uso ese.
                                node.pathsContol[correlationId].main_msg = msg;
                            }
                            else
                            {
                                // si había otro mensaje principal, lo piso.
                                var aux_paths = node.pathsContol[correlationId].main_msg.paths; 
                                node.pathsContol[correlationId].main_msg = Object.assign({}, msg ); // copia obj
                                node.pathsContol[correlationId].main_msg.paths = aux_paths;

                            }
                        }
                    
                        // actualizo el mensaje principal. En caso de error envío el mensage que tengo aunque no sea el principal.
                        if (!node.pathsContol[correlationId].main_msg)
                        {
                            // si es el primero guardo todo el mensaje.
                            node.pathsContol[correlationId].main_msg = msg;
                        }
                        if (!node.pathsContol[correlationId].main_msg.paths[paths[i]])
                        {
                            // para el resto solo guardo el dato del path.
                            node.pathsContol[correlationId].main_msg.paths[paths[i]] = msg.paths[paths[i]];
                        }

                    }
                }

                // evaluo si ya llegaron todos
                for (var i = 0; i < pathsLength; i++) {
                    //console.log( "verifico path :" + paths[i] +"   valor: " +node.pathsContol[correlationId].paths[paths[i]].data )
                    //if ( !node.pathsContol[correlationId].paths[paths[i]] )
                    if ( !node.pathsContol[correlationId].main_msg.paths[paths[i]] )
                        break;
                }
                // si llegaron todos devuelvo msg y elimino auxiliares.
                if ( i == pathsLength )
                {
                    node.send(node.pathsContol[correlationId].main_msg);
                    delete node.pathsContol[correlationId]; //[paths[i]];
                    //return msg;
                    //node.send(msg);
                }
            }                
            
        });
    }
    RED.nodes.registerType("wait-paths",waitPathsNode);
}
