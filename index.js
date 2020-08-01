const { runHelper } = require('gpujs-hive-compute/dist/util/runHelper');

function hiveHelp(gpu, url, logFunction = console.log) {
  runHelper(WebSocket, gpu, url, logFunction)
}