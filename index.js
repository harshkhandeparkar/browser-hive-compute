const { runHelper } = require('gpujs-hive-compute/dist/util/runHelper');
const { hiveHelpDefaults } = require('gpujs-hive-compute/dist/helper');

class WSocket extends WebSocket {
  openHandlers = [];
  errHandlers = [];
  messageHandlers = [];
  closeHandlers = [];

  constructor(...opts) {
    super(...opts);

    this.onopen = (...opts) => {
      this.openHandlers.forEach(handler => handler(...opts));
    }
    this.onerror = (...opts) => {
      this.errHandlers.forEach(handler => handler(...opts));
    }
    this.onmessage = (...opts) => {
      this.messageHandlers.forEach(handler => handler(...opts));
    }
    this.onclose = (...opts) => {
      this.closeHandlers.forEach(handler => handler(...opts));
    }
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
  }
  const { gpu, url, logFunction } = options;

  return await runHelper(WSocket, gpu, url, logFunction);
}

module.exports = {
  hiveHelp
}
