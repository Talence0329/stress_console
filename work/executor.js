const { exec, spawn } = require('child_process')

function DoWork (command, param, Close) {
  const work = spawn(command, param, { shell: true })
  work.processRecord = []
  work.stdout.on('data', (data) => {
    work.processRecord.push(new Date().toLocaleDateString().replace(/\//g, '-') + ' ' + new Date().toLocaleTimeString() + '  ' + data.toString())
  })
  work.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })
  work.on('error', (error) => {
    console.error(error)
  })
  work.on('close', (code) => {
    if (Close) { Close() }
    console.log(`child process exited with code ${code}`)
  })
  return work
}

module.exports = { DoWork }
