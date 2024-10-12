import os from 'os'

const commands = {
  '--EOL': eol,
  '--cpus': cpus,
  '--homedir': homeDir,
  '--username': userName,
  '--architecture': architecture
}

export function getInfo(name) {
  console.log()
  commands[name]()
  console.log()
}

function eol() {
  console.log(`Default system End-Of-Line: (${os.EOL}) New line`)
}

function cpus() {
  const CPUs = os.cpus()
  console.log(`Count CPUs: ${CPUs.length}\n`);

  CPUs.forEach((cpu, index) => {
    const clockRateGHz = (cpu.speed / 1000).toFixed(2);
    console.log(`\nProcessor ${index + 1}:`);
    console.log(`Model: ${cpu.model}`);
    console.log(`Clock rate (in GHz): ${clockRateGHz} GHz\n`);
  });
}

function homeDir() {
  console.log(`Home directory: ${os.homedir()}`)
}

function userName() {
  console.log(`System user name: ${os.userInfo().username}`)
}

function architecture() {
  console.log(`Architecture: ${process.arch}`)
}