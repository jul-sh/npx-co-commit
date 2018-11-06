#!/usr/bin/env node

const prompts = require('prompts')
const arg = require('arg')
const { execSync } = require('child_process')

const writeCommit = ({ message, coAuthors, filteredArgs }) => {
  const coAuthoringLines = coAuthors.map(
    coAuthor =>
      `-m "Co-authored-by: ${coAuthor} <${coAuthor.toLowerCase()}@users.noreply.github.com>"`
  )
  const gitCommand = `git commit -m "${message}" ${coAuthoringLines.join(
    ' '
  )} ${filteredArgs.join(' ')}`

  try {
    console.log('\x1b[2m', gitCommand, '\x1b[0m')
    execSync(gitCommand, { stdio: 'inherit' })
  } catch (error) {
    // discard node error; git will print an error message.
    process.exit()
  }
}

const getCoAuthors = async args => {
  if (args['--co-author']) return args['--co-author']
  const { coAuthors } = await prompts(
    {
      type: 'list',
      name: 'coAuthors',
      message: 'Co-Author GitHub Username(s):',
      validate: coAuthors =>
        coAuthors ? true : 'Please specify a co-author to continue.'
    },
    { onCancel: () => process.exit() }
  )

  return coAuthors
}

const getMessage = async args => {
  if (args['--message']) return args['--message']
  const { message } = await prompts(
    {
      type: 'text',
      name: 'message',
      message: 'Commit Message:',
      validate: message =>
        message ? true : 'Please specify a commit message to continue.'
    },
    { onCancel: () => process.exit() }
  )

  return message
}

const coCommit = async () => {
  const args = arg({
    // Types
    '--co-author': [String],
    '--message': String,

    // Aliases
    '-c': '--co-author',
    '--co-authors': '--co-author',
    '--coauthor': '--co-author',
    '--coauthors': '--co-author',
    '-m': '--message'
  })
  const coAuthors = await getCoAuthors(args)
  const message = await getMessage(args)
  const filteredArgs = args['_']

  return writeCommit({ message, coAuthors, filteredArgs })
}

coCommit()
