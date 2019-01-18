const nixt = require('nixt')
const os = require('os')

describe('co-commit', () => {
  it('works using CLI arguments', done => {
    nixt()
      .run('node index.js -m "test commit" -co "mariiapunda" --dry-run')
      .expect(({ stdout }) => {
        const expectedGitCommand = `git commit -m "test commit${os.EOL +
          os.EOL}Co-authored-by: mariiapunda <mariiapunda@users.noreply.github.com>" --dry-run`

        if (!stdout.includes(expectedGitCommand))
          return new Error('Does not output correct git command')
      })
      .code(0)
      .end(done)
  })

  it('prompts for input if no arguments are provided', done => {
    nixt()
      .run('node index.js --dry-run')
      .on(/Co-Author GitHub/)
      .respond(`mariiapunda${os.EOL}`)
      .on(/Commit Message:/)
      .respond(`another test commit${os.EOL}`)
      .expect(({ stdout }) => {
        const expectedGitCommand = `git commit -m "another test commit${os.EOL +
          os.EOL}Co-authored-by: mariiapunda <mariiapunda@users.noreply.github.com>" --dry-run`

        if (!stdout.includes(expectedGitCommand))
          return new Error('Does not output correct git command')
      })
      .code(0)
      .end(done)
  })

  it('skips relevant prompts if some data is provided as an argument', done => {
    nixt()
      .run('node index.js -co "sophiebits" --dry-run')
      .on(/Commit Message:/)
      .respond(`committing with sophie${os.EOL}`)
      .expect(({ stdout }) => {
        const expectedGitCommand = `git commit -m "committing with sophie${os.EOL +
          os.EOL}Co-authored-by: sophiebits <sophiebits@users.noreply.github.com>" --dry-run`

        if (!stdout.includes(expectedGitCommand))
          return new Error('Does not output correct git command')
      })
      .code(0)
      .end(done)
  })

  it('supports comma-separated co-authors provided via the prompt', done => {
    nixt()
      .run('node index.js --dry-run')
      .on(/Co-Author GitHub/)
      .respond(`mariiapunda, tom-bonnike${os.EOL}`)
      .on(/Commit Message:/)
      .respond(`test commit with multiple authors${os.EOL}`)
      .expect(({ stdout }) => {
        const expectedGitCommand = `git commit -m "test commit with multiple authors${os.EOL +
          os.EOL}Co-authored-by: mariiapunda <mariiapunda@users.noreply.github.com>${
          os.EOL
        }Co-authored-by: tom-bonnike <tom-bonnike@users.noreply.github.com>"`

        if (!stdout.includes(expectedGitCommand))
          return new Error('Does not output correct git command')
      })
      .code(0)
      .end(done)
  })

  it('supports comma-separated co-authors provided as an argument', done => {
    nixt()
      .run(
        'node index.js -m "test commit with multiple authors" -co "mariiapunda, tom-bonnike" --dry-run'
      )
      .expect(({ stdout }) => {
        const expectedGitCommand = `git commit -m "test commit with multiple authors${os.EOL +
          os.EOL}Co-authored-by: mariiapunda <mariiapunda@users.noreply.github.com>${
          os.EOL
        }Co-authored-by: tom-bonnike <tom-bonnike@users.noreply.github.com>"`

        if (!stdout.includes(expectedGitCommand))
          return new Error('Does not output correct git command')
      })
      .code(0)
      .end(done)
  })
})
