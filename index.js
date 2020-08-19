const { runHelper } = require('gpujs-hive-compute/dist/util/runHelper');
const { hiveHelpDefaults } = require('gpujs-hive-compute/dist/helper');

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

function hiveHelp(options) {
  options = {
    hiveHelpDefaults,
    ...options
  }
  const { gpu, url, logFunction } = options;

  runHelper(WSocket, gpu, url, logFunction);
}

module.exports = {
  hiveHelp
}