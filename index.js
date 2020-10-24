const { runHelper } = require('gpujs-hive-compute/dist/util/runHelper');
const { hiveHelpDefaults } = require('gpujs-hive-compute/dist/helper');

class WSocket extends WebSocket {
  openHandlers = [];
  errHandlers = [];
  messageHandlers = [];
  closeHandlers = [];

  constructor(...opts) {
    super(...opts);

    this.onopen = ({ data }) => {
      this.openHandlers.forEach(handler => handler(data));
    }
    this.onerror = ({ data }) => {
      this.errHandlers.forEach(handler => handler(data));
    }
    this.onmessage = ({ data }) => {
      this.messageHandlers.forEach(handler => handler(data));
    }
    this.onclose = ({ data }) => {
      this.closeHandlers.forEach(handler => handler(data));
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
