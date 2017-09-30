module.exports = function(RED) {
    function waitPathsNode(config) {
        RED.nodes.createNode(this,config);

        this.paths = JSON.parse(config.paths);
        //this.paths = config.paths;

        var node = this;
        node.on('input', function(msg) {
            //msg.payload = msg.payload.toLowerCase();
            //node.send(msg);
            
            var flow1 = this.context().flow;

            var msgid = msg._msgid.replace(".","0");
            console.log(msgid);

            var paths = this.paths;
            console.log(JSON.stringify(paths));

            var pathsLength = paths.length;

            for (var i = 0; i < pathsLength; i++) {
                console.log("pase por 1");
                if (msg.paths[paths[i]]) {
                    console.log("pase por 2");
                    flow1.set(msgid+paths[i],msg.paths[paths[i]]);
                }
            }

            for (var i = 0; i < pathsLength; i++) {
                msg.paths[paths[i]] = flow1.get(msgid+paths[i]);
                console.log("pase por 3:" + msg.paths[paths[i]]);
            }

            // evaluo si ya estan todos
            for (var i = 0; i < pathsLength; i++) {
                if ( !msg.paths[paths[i]] )
                    break;
            }
            // si están todos devuelvo msg y elimino auxiliares.
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