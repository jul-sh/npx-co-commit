#!/usr/bin/env node
const { execSync } = require('child_process')

const prompt = question =>
  // use promises instead of a async/await for better callback compatibility.
  new Promise(resolve => {
    const { stdin, stdout } = process

    stdin.resume()
    stdout.write(`\x1b[36m? \x1b[0m\x1b[1m${question} \x1b[0m`)

    stdin.once('data', reponse => resolve(reponse.toString().trim()))
  })

const writeCommit = ({ message, coAuthors }) => {
  const messageLine = message ? `-m "${message}"` : ''
  const coAuthoringLines = coAuthors.map(
    coAuthor =>
      `-m "Co-authored-by: ${coAuthor} <${coAuthor.toLowerCase()}@users.noreply.github.com>"`
  )
  const gitCommand = `git commit ${messageLine} ${coAuthoringLines.join(' ')}`

  try {
    console.log('\x1b[2m', gitCommand, '\x1b[0m')
    execSync(gitCommand, { stdio: 'inherit' })
  } catch (error) {
    // discard node error; git will print an error message.
    process.exit()
  }
}

const coCommit = async () => {
  const coAuthors = (await prompt('Co-Author GitHub Username(s):'))
    .split(',')
    .map(coAuthor => coAuthor.trim())
    .filter(coAuthor => coAuthor.length > 0)
  const message = await prompt('Commit Message:')

  return writeCommit({ message, coAuthors })
}

coCommit()
