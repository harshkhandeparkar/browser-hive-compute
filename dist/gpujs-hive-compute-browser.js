(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('ws')) :
	typeof define === 'function' && define.amd ? define(['ws'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.GPUjsHiveCompute = factory(global.ws));
}(this, (function (ws) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var ws__default = /*#__PURE__*/_interopDefaultLegacy(ws);

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
	    COMM_TYPE["ASK"] = "ask";
	    COMM_TYPE["TELL"] = "tell";
	    COMM_TYPE["REQUEST_CONN"] = "request_conn";
	})(COMM_TYPE = exports.COMM_TYPE || (exports.COMM_TYPE = {}));
	var TELL_ACTIONS;
	(function (TELL_ACTIONS) {
	    TELL_ACTIONS["KERNEL_BUILT"] = "kernel_built";
	    TELL_ACTIONS["KERNEL_RUN_DONE"] = "kernel_run_done";
	    TELL_ACTIONS["CONN_ACCEPTED"] = "conn_accepted";
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
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
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
	    return __awaiter(this, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	            return [2 /*return*/, new Promise(function (resolve, reject) {
	                    var ws = new WS(url);
	                    var k; // build kernel will be stored here
	                    ws.on('open', function () {
	                        logFunction('Connecting as helper.');
	                        ws.send(JSON.stringify({ type: constants.COMM_TYPE.REQUEST_CONN, data: {} }));
	                        comm.onTell(ws, constants.TELL_ACTIONS.CONN_ACCEPTED, function () { return logFunction('Connection accepted.'); });
	                    });
	                    ws.on('error', function () {
	                        reject(new Error('WebSocket error.'));
	                    });
	                    ws.on('close', function () {
	                        logFunction('Connection closed.');
	                        resolve();
	                    });
	                    comm.onAsk(ws, constants.ASK_ACTIONS.BUILD_KERNEL, function (data) {
	                        logFunction('Building kernel.');
	                        k = gpu.createKernel(data.extras.kernelFunc, data.extras.kernelOptions); //  Build the kernel
	                        logFunction('Kernel built.');
	                        comm.tell(ws, {
	                            action: constants.TELL_ACTIONS.KERNEL_BUILT
	                        });
	                    });
	                    comm.onAsk(ws, constants.ASK_ACTIONS.RUN_KERNEL, function (data) {
	                        logFunction('Running kernel.');
	                        var output;
	                        if (data.extras.inputsLength > 0)
	                            output = k.apply(void 0, data.extras.inputs); //  Run the kernel
	                        else
	                            output = k();
	                        logFunction('Output generated, transmitting.');
	                        comm.tell(ws, {
	                            action: constants.TELL_ACTIONS.KERNEL_RUN_DONE,
	                            extras: {
	                                output: output
	                            }
	                        });
	                    });
	                })];
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
	var __awaiter = (commonjsGlobal && commonjsGlobal.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (commonjsGlobal && commonjsGlobal.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.hiveHelp = exports.hiveHelpDefaults = void 0;
	var ws_1 = __importDefault(ws__default['default']);

	exports.hiveHelpDefaults = {
	    logFunction: console.log
	};
	/**
	 *
	 * @param options Options for the hiveHelp method
	 */
	function hiveHelp(options) {
	    return __awaiter(this, void 0, void 0, function () {
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    options = __assign(__assign({}, exports.hiveHelpDefaults), options);
	                    return [4 /*yield*/, runHelper_1.runHelper(ws_1.default, options.gpu, options.url, options.logFunction)];
	                case 1: return [2 /*return*/, _a.sent()];
	            }
	        });
	    });
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

	async function hiveHelp(options) {
	  options = {
	    hiveHelpDefaults,
	    ...options
	  };
	  const { gpu, url, logFunction } = options;

	  return await runHelper(WSocket, gpu, url, logFunction);
	}

	var browserHiveCompute = {
	  hiveHelp
	};

	return browserHiveCompute;

})));
