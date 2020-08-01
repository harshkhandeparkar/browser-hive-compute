const { runHelper } = require('gpujs-hive-compute/dist/util/runHelper');

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

module.exports = {
  hiveHelp
}