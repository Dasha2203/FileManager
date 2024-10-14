export function setColor(text, color) {
  const colors = {
    green: 32,
    yellow: 33,
    blue: 34,
    red: 31
  }

  return `\x1b[${colors[color]}m ${text} \x1b[0m`
}