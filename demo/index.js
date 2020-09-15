const gpu = new GPU();
const logList = document.querySelector('#logs ul');

const customLog = (...logs) => {
  logList.append(`<li><b>${new Date().toTimeString()}</b>: ${logs}</li>`);
}

document.querySelector('#url-form').addEventListener('submit', e => {
  e.preventDefault();
  const url = document.querySelector('#url-input').value;
  
  try {
    GPUjsHiveCompute.hiveHelp({
      gpu,
      url,
      logFunction: customLog
    })
    document.querySelector('#url-form').classList.add('invisible');
    document.querySelector('#logs').classList.remove('invisible');
  }
  catch (e) {
    console.log('An error occured', e);
  }
})