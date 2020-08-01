(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.GPUjsHiveCompute = factory());
}(this, (function () { 'use strict';

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var constants = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.ASK_ACTIONS = exports.TELL_ACTIONS = exports.COMM_TYPE = void 0;
	var COMM_TYPE;
	(function (COMM_TYPE) {
	    COMM_TYPE[COMM_TYPE["ASK"] = 0] = "ASK";
	    COMM_TYPE[COMM_TYPE["TELL"] = 1] = "TELL";
	    COMM_TYPE[COMM_TYPE["REQUEST_CONN"] = 2] = "REQUEST_CONN";
	})(COMM_TYPE = exports.COMM_TYPE || (exports.COMM_TYPE = {}));
	var TELL_ACTIONS;
	(function (TELL_ACTIONS) {
	    TELL_ACTIONS[TELL_ACTIONS["KERNEL_BUILT"] = 0] = "KERNEL_BUILT";
	    TELL_ACTIONS[TELL_ACTIONS["KERNEL_RUN_DONE"] = 1] = "KERNEL_RUN_DONE";
	    TELL_ACTIONS[TELL_ACTIONS["CONN_ACCEPTED"] = 2] = "CONN_ACCEPTED";
	})(TELL_ACTIONS = exports.TELL_ACTIONS || (exports.TELL_ACTIONS = {}));
	var ASK_ACTIONS;
	(function (ASK_ACTIONS) {
	    ASK_ACTIONS[ASK_ACTIONS["BUILD_KERNEL"] = 0] = "BUILD_KERNEL";
	    ASK_ACTIONS[ASK_ACTIONS["RUN_KERNEL"] = 1] = "RUN_KERNEL";
	})(ASK_ACTIONS = exports.ASK_ACTIONS || (exports.ASK_ACTIONS = {}));
	});

	var comm = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.onDisconnect = exports.onConnect = exports.onTell = exports.onAsk = exports.tell = exports.ask = void 0;

	function ask(ws, data) {
	    ws.send(JSON.stringify({
	        type: constants.COMM_TYPE.ASK,
	        data: data
	    }));
	    return ws;
	}
	exports.ask = ask;
	function tell(ws, data) {
	    ws.send(JSON.stringify({
	        type: constants.COMM_TYPE.TELL,
	        data: data
	    }));
	    return ws;
	}
	exports.tell = tell;
	function onAsk(ws, action, handler) {
	    ws.on('message', function (msgData) {
	        var msg = JSON.parse(msgData);
	        tell(ws, {
	            action: constants.TELL_ACTIONS.CONN_ACCEPTED
	        });
	        if (msg.type == constants.COMM_TYPE.ASK && msg.data.action == action) {
	            handler(msg.data);
	        }
	    });
	    return ws;
	}
	exports.onAsk = onAsk;
	function onTell(ws, action, handler) {
	    ws.on('message', function (msgData) {
	        var msg = JSON.parse(msgData);
	        if (msg.type == constants.COMM_TYPE.TELL && msg.data.action == action) {
	            handler(msg.data);
	        }
	    });
	    return ws;
	}
	exports.onTell = onTell;
	function onConnect(ws, handler) {
	    ws.on('message', function (msgData) {
	        var msg = JSON.parse(msgData);
	        if (msg.type == constants.COMM_TYPE.REQUEST_CONN) {
	            handler(ws);
	        }
	    });
	    return ws;
	}
	exports.onConnect = onConnect;
	function onDisconnect(ws, handler) {
	    ws.on('close', handler);
	    return ws;
	}
	exports.onDisconnect = onDisconnect;
	});

	var runHelper_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.runHelper = void 0;


	/**
	 *
	 * @param gpu Instance of GPU.js `GPU` class
	 * @param url WebSocket URL e.g: ws://localhost:4532
	 * @param logFunction A custom log function
	 */
	function runHelper(WS, gpu, url, logFunction) {
	    if (logFunction === void 0) { logFunction = console.log; }
	    var ws = new WS(url);
	    var k; // build kernel will be stored here
	    ws.on('open', function () {
	        logFunction('Connecting as helper.');
	        ws.send(JSON.stringify({ type: constants.COMM_TYPE.REQUEST_CONN, data: {} }));
	        comm.onTell(ws, constants.TELL_ACTIONS.CONN_ACCEPTED, function () { return logFunction('Connection Accepted.'); });
	    });
	    ws.on('close', function () { return logFunction("Connection refused or closed unexpectedly."); });
	    comm.onAsk(ws, constants.ASK_ACTIONS.BUILD_KERNEL, function (data) {
	        logFunction('building');
	        k = gpu.createKernel(data.extras.kernelFunc, data.extras.kernelOptions); //  Build the kernel
	        logFunction('built');
	        comm.tell(ws, {
	            action: constants.TELL_ACTIONS.KERNEL_BUILT
	        });
	    });
	    comm.onAsk(ws, constants.ASK_ACTIONS.RUN_KERNEL, function (data) {
	        logFunction('running');
	        var output;
	        if (data.extras.inputsLength > 0)
	            output = k.apply(void 0, data.extras.inputs); //  Run the kernel
	        else
	            output = k();
	        logFunction('done');
	        comm.tell(ws, {
	            action: constants.TELL_ACTIONS.KERNEL_RUN_DONE,
	            extras: {
	                output: output
	            }
	        });
	    });
	}
	exports.runHelper = runHelper;
	});

	const { runHelper } = runHelper_1;

	class WSocket extends WebSocket {
	  on(event, handler) {
	    switch (event) {
	      case 'open':
	        return this.onopen = handler;
	      case 'error':
	        return this.onerror = handler;
	      case 'message':
	        return this.onmessage = handler;
	      case 'close':
	        return this.onclose = handler;
	    }
	  }
	}

	function hiveHelp(gpu, url, logFunction = console.log) {
	  runHelper(WSocket, gpu, url, logFunction);
	}

	var browserHiveCompute = {
	  hiveHelp
	};

	return browserHiveCompute;

})));
