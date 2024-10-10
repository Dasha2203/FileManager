

console.log(greeting())

process.stdin.on('data',(chunk) => {
  const data = chunk.toString().trim();

  if (data === '.exit') {
    goodBuy();
    process.exit();
  }
})

process.on('SIGINT', () => {
  goodBuy()
  process.exit();
});

function getName() {
  return process.argv[2].split('=')[1]
}

function greeting() {
  const name = getName();

  return `Welcome to the File Manager, ${name}!`;
}

function goodBuy() {
  const name = getName();

  console.log(`\nThank you for using File Manager, ${name}, goodbye!`);
}

