(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ws')) :
	typeof define === 'function' && define.amd ? define(['ws'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.GPUjsHiveCompute = factory(global.ws));
}(this, (function (ws) { 'use strict';

	ws = ws && Object.prototype.hasOwnProperty.call(ws, 'default') ? ws['default'] : ws;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

	var helper = createCommonjsModule(function (module, exports) {
	var __assign = (commonjsGlobal && commonjsGlobal.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.hiveHelp = exports.hiveHelpDefaults = void 0;
	var ws_1 = __importDefault(ws);

	exports.hiveHelpDefaults = {
	    logFunction: console.log
	};
	/**
	 *
	 * @param options Options for the hiveHelp method
	 */
	function hiveHelp(options) {
	    options = __assign(__assign({}, exports.hiveHelpDefaults), options);
	    runHelper_1.runHelper(ws_1.default, options.gpu, options.url, options.logFunction);
	}
	exports.hiveHelp = hiveHelp;
	});

	const { runHelper } = runHelper_1;
	const { hiveHelpDefaults } = helper;

	class WSocket extends WebSocket {
	  openHandlers = [];
	  errHandlers = [];
	  messageHandlers = [];
	  closeHandlers = [];

	  constructor(...opts) {
	    super(...opts);

	    this.onopen = ({ data }) => {
	      this.openHandlers.forEach(handler => handler(data));
	    };
	    this.onerror = ({ data }) => {
	      this.errHandlers.forEach(handler => handler(data));
	    };
	    this.onmessage = ({ data }) => {
	      this.messageHandlers.forEach(handler => handler(data));
	    };
	    this.onclose = ({ data }) => {
	      this.closeHandlers.forEach(handler => handler(data));
	    };
	  }

	  on(event, handler) {
	    switch (event) {
	      case 'open':
	        this.openHandlers.push(handler);
	        break;
	      case 'error':
	        this.errHandlers.push(handler);
	        break;
	      case 'message':
	        this.messageHandlers.push(handler);
	        break;
	      case 'close':
	        this.closeHandlers.push(handler);
	        break;
	    }
	  }
	}

	function hiveHelp(options) {
	  options = {
	    hiveHelpDefaults,
	    ...options
	  };
	  const { gpu, url, logFunction } = options;

	  runHelper(WSocket, gpu, url, logFunction);
	}

	var browserHiveCompute = {
	  hiveHelp
	};

	return browserHiveCompute;

})));
