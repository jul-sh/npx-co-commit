const nixt = require('nixt')

describe('co-commit', () => {
  it('ouputs the correct git commit based on flags', done => {
    nixt()
      .run('node index.js -m "test commit" -co "mariiapunda" --dry-run')
      .expect(({ stdout }) => {
        const expectedGitCommand =
          'git commit -m "test commit" -m "Co-authored-by: mariiapunda <mariiapunda@users.noreply.github.com>" --dry-run'

        if (!stdout.includes(expectedGitCommand))
          return new Error('Does not output correct git command')
      })
      .code(0)
      .end(done)
  })

  it('ouputs the correct git commit based on prompts', done => {
    nixt()
      .run('node index.js --dry-run')
      .on(/Co-Author GitHub/)
      .respond('mariiapunda\n')
      .on(/Commit Message:/)
      .respond('another test commit\n')
      .expect(({ stdout }) => {
        const expectedGitCommand =
          'git commit -m "another test commit" -m "Co-authored-by: mariiapunda <mariiapunda@users.noreply.github.com>" --dry-run'

        if (!stdout.includes(expectedGitCommand))
          return new Error('Does not output correct git command')
      })
      .code(0)
      .end(done)
  })

  it('skips prompts when the correct arg is provided', done => {
    nixt()
      .run('node index.js -co "sophiebits" --dry-run')
      .on(/Commit Message:/)
      .respond('committing with sophie\n')
      .expect(({ stdout }) => {
        const expectedGitCommand =
          'git commit -m "committing with sophie" -m "Co-authored-by: sophiebits <sophiebits@users.noreply.github.com>" --dry-run'

        if (!stdout.includes(expectedGitCommand))
          return new Error('Does not output correct git command')
      })
      .code(0)
      .end(done)
  })
})
