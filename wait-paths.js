module.exports = function(RED) {
    function waitPathsNode(config) {
        RED.nodes.createNode(this,config);

        this.paths = JSON.parse(config.paths);

        var node = this;
        node.on('input', function(msg) {
            
            var flow1 = this.context().flow;
            var msgid = msg._msgid.replace(".","0");
            var paths = this.paths;
            var pathsLength = paths.length;
            
            // guardo variables que van llegando
            for (var i = 0; i < pathsLength; i++) {
                if (msg.paths[paths[i]]) {
                    flow1.set(msgid+paths[i],msg.paths[paths[i]]);
                }
            }

            // recupero variables para verificar si ya llegaron todas
            for (var i = 0; i < pathsLength; i++) {
                msg.paths[paths[i]] = flow1.get(msgid+paths[i]);
            }

            // evaluo si ya llegaron todos
            for (var i = 0; i < pathsLength; i++) {
                if ( !msg.paths[paths[i]] )
                    break;
            }
            // si llegaron todos devuelvo msg y elimino auxiliares.
            if ( i == pathsLength )
            {
                for (var i = 0; i < pathsLength; i++) {
                    flow1.set(msgid+paths[i],undefined);
                }
                //return msg;
                node.send(msg);
            }
            
            
        });
    }
    RED.nodes.registerType("wait-paths",waitPathsNode);
}
