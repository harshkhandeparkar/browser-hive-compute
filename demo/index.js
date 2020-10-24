const gpu = new GPU();
const logList = document.querySelector('#logs ul');

const customLog = (...logs) => {
  const li = document.createElement('li');
  li.innerHTML = `<li><b>${new Date().toTimeString()}</b>: ${logs.toString()}</li>`;
  logList.append(li);
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

document.querySelector('#restart').addEventListener('click', e => {
  e.preventDefault();
  logList.innerHTML = '';

  document.querySelector('#url-form').classList.remove('invisible');
  document.querySelector('#logs').classList.add('invisible');
})
