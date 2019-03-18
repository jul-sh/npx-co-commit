#!/usr/bin/env node

const prompts = require('prompts')
const arg = require('arg')
const { execSync } = require('child_process')
const os = require('os')

const gatherInput = async () => {
  const args = arg(
    {
      // Types
      '--co-authors': String,
      '--message': String,

      // Aliases
      '-co': '--co-authors',
      '-m': '--message'
    },
    {
      // maintain all other arguments in the '_' key.
      permissive: true
    }
  )

  return {
    coAuthors: args['--co-authors']
      ? args['--co-authors'].split(',').map(entry => entry.trim())
      : (await prompts(
          {
            type: 'list',
            name: 'coAuthors',
            message: 'Co-Author GitHub Username(s):',
            validate: coAuthors =>
              coAuthors ? true : 'Please specify a co-author to continue.'
          },
          { onCancel: () => process.exit() }
        )).coAuthors,
    message:
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
      )).message,
    otherArgs: args['_']
  }
}

const getGitCommand = ({ message, coAuthors, otherArgs }) => {
  const coAuthoringLines = coAuthors.map(
    coAuthor =>
      `Co-authored-by: ${coAuthor} <${coAuthor.toLowerCase()}@users.noreply.github.com>`
  )
  const coAuthoringMessage = os.EOL + os.EOL + coAuthoringLines.join(os.EOL)

  return `git commit -m "${message + coAuthoringMessage}" ${otherArgs.join(
    ' '
  )}`
}

;(async () => {
  const gitCommand = getGitCommand(await gatherInput())
  console.log(`\x1b[2m${gitCommand}\x1b[0m`)
  try {
    execSync(gitCommand, { stdio: 'inherit' })
  } catch (error) {
    // discard node error; git will print an error message.
  }
  process.exit()
})()
