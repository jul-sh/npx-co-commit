#!/usr/bin/env node

const prompts = require('prompts')
const { execSync } = require('child_process')

const writeCommit = async ({ message, coAuthors }) => {
  const coAuthoringLines = coAuthors.map(
    coAuthor =>
      `-m "Co-authored-by: ${coAuthor} <${coAuthor.toLowerCase()}@users.noreply.github.com>"`
  )
  const gitCommand = `git commit -m "${message}" ${coAuthoringLines.join(' ')}`

  try {
    console.log('\x1b[2m', gitCommand, '\x1b[0m')
    execSync(gitCommand, { stdio: 'inherit' })
  } catch (error) {
    // discard node error; git will print an error message.
  }
}

const coCommit = async () => {
  const { message, coAuthors } = await prompts(
    [
      {
        type: 'list',
        name: 'coAuthors',
        message: 'Co-Author GitHub Username(s):',
        validate: coAuthors =>
          coAuthors ? true : 'You must provide a co-author'
      },
      {
        type: 'text',
        name: 'message',
        message: 'Commit Message:',
        validate: value =>
          value ? true : 'Please specify a commit message to continue.'
      }
    ],
    { onCancel: () => process.exit() }
  )

  return writeCommit({ message, coAuthors })
}

coCommit()
