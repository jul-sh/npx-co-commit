#!/usr/bin/env node

const prompts = require('prompts')
const arg = require('arg')
const { exec } = require('child_process')
const { promisify } = require('util')
const asyncExec = promisify(exec)

const writeCommit = async ({ message, coAuthors, otherArgs }) => {
  const coAuthoringLines = coAuthors.map(
    coAuthor =>
      `-m "Co-authored-by: ${coAuthor} <${coAuthor.toLowerCase()}@users.noreply.github.com>"`
  )
  const gitCommand = `git commit -m "${message}" ${coAuthoringLines.join(
    ' '
  )} ${otherArgs.join(' ')}`
  console.log(`\x1b[2m${gitCommand}\x1b[0m`)

  try {
    await asyncExec(gitCommand, { stdio: 'inherit' })
  } catch (error) {
    console.log(error.stdout)
  }
  process.exit()
}

const coCommit = async () => {
  const args = arg(
    {
      // Types
      '--co-authors': [String],
      '--message': String,

      // Aliases
      '-co': '--co-authors',
      '-m': '--message'
    },
    {
      permissive: true
    }
  )

  const coAuthors =
    args['--co-authors'] ||
    (await prompts(
      {
        type: 'list',
        name: 'coAuthors',
        message: 'Co-Author GitHub Username(s):',
        validate: coAuthors =>
          coAuthors ? true : 'Please specify a co-author to continue.'
      },
      { onCancel: () => process.exit() }
    )).coAuthors

  const message =
    args['--message'] ||
    (await prompts(
      {
        type: 'text',
        name: 'message',
        message: 'Commit Message:',
        validate: message =>
          message ? true : 'Please specify a commit message to continue.'
      },
      { onCancel: () => process.exit() }
    )).message

  const otherArgs = args['_']

  return await writeCommit({ message, coAuthors, otherArgs })
}

coCommit()
