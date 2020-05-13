module.exports = function(RED) {
    function waitPathsNode(config) {
        RED.nodes.createNode(this,config);

        if (config.paths != "")
            this.pathsToWait = JSON.parse(config.paths);

        this.pathsContol = [];
        if ( config.timeout == "" )
            this.timeout = 15000;
        else
            this.timeout = Number(config.timeout);

        if ( config.finalTimeout == "" )
            this.finalTimeout = 60000;
        else
            this.finalTimeout = Number(config.finalTimeout);

        if ( this.finalTimeout < this.timeout )
            this.finalTimeout = this.timeout;

        var node = this;

        node.interval = setInterval( function () {

            var time = Date.now();



            var correlationIds = Object.keys(node.pathsContol);
            correlationIds.forEach( function (correlationId) {

                if ( node.pathsContol[correlationId].timeoutDone )
                {
                    if ( node.pathsContol[correlationId].time + node.finalTimeout < time )
                    {
                        delete node.pathsContol[correlationId];
                    }
                }
            });

        }, 5000);

        node.on('close', function() {
            clearInterval(node.interval);
            
        });
        
        node.on('input', function(msg) {
            
            if ( !msg.paths || typeof msg.paths != "object")
            {
                node.error("wait-paths 'msg.paths' undefined or not an object, must be paths['text']=value .", msg);
                return;
            }

            if (msg.pathsCorrelationId)
                var correlationId = msg.pathsCorrelationId;
            else             
                if (msg.paths_correlationId) // for compatibility with old name style
                    var correlationId = msg.paths_correlationId;
                else             
                    var correlationId = msg._msgid.replace(".","0");

            var pathExist = false;

            if ( !node.pathsContol[correlationId] || 
                 node.pathsContol[correlationId] && !node.pathsContol[correlationId].timeoutDone ) // si ya dio timeout. No hago nada.
            {
                if (msg.pathsToWait)
                    var pathsToWait = msg.pathsToWait;
                else
                    if ( !node.pathsToWait )
                    {
                        node.error("wait-paths pathsToWait must be defined.", msg);
                        return;
                    }
                    else
                        var pathsToWait = node.pathsToWait;

                
                var pathsLength = pathsToWait.length;
                
                // guardo variables que van llegando
                for (var i = 0; i < pathsLength; i++) {
                    if (pathsToWait[i] in msg.paths) {

                        pathExist = true;

                        if ( !node.pathsContol[correlationId] )
                        {
                            node.pathsContol[correlationId] = {};
                            node.pathsContol[correlationId].time = Date.now();

                            node.pathsContol[correlationId].timeOut = setTimeout( function () {

                                node.pathsContol[correlationId].timeoutDone = true;
                                node.error(`wait-paths timeout at: ${pathsToWait[i]}`, node.pathsContol[correlationId].main_msg);

                            }, node.timeout)
                        }

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
                        if (! (pathsToWait[i] in node.pathsContol[correlationId].main_msg.paths))
                        {
                            // para el resto solo guardo el dato del path.
                            node.pathsContol[correlationId].main_msg.paths[pathsToWait[i]] = msg.paths[pathsToWait[i]];
                        }

                    }
                }
                // Si el path no etaba configurado doy error.
                if ( !pathExist )
                {
                    node.error("wait-paths msg.paths[\"path\"] not exists in pathsToWait!", msg);
                    return;
                }
                // evaluo si ya llegaron todos
                for (var i = 0; i < pathsLength; i++) {

                    if ( ! (pathsToWait[i] in node.pathsContol[correlationId].main_msg.paths) )
                        break;
                }
                // si llegaron todos devuelvo msg y elimino auxiliares.
                if ( i == pathsLength )
                {
                    clearTimeout(node.pathsContol[correlationId].timeOut);
                    node.send(node.pathsContol[correlationId].main_msg);
                    delete node.pathsContol[correlationId]; //[paths[i]];

                }
            }                
            
        });
    }
    RED.nodes.registerType("wait-paths",waitPathsNode);
}
