# 🤝 co-commit

Run `npx co-commit` to start. - No installation needed.

![screenshot of using gif co-commit](screenshot.gif)

## 🤓 Background

GitHub allows you to [co-author commits](https://help.github.com/articles/creating-a-commit-with-multiple-authors/) by appending `Co-authored-by: name <name@example.com>` to a commit message.

## 🧠 Advanced

### Make it blazing fast 🔥

Each time you run co-commit, `npx` will install the package. This will usually only takes a few seconds. To skip this you can preinstall co-commit using `npm i -g co-commit`.

### CLI arguments

You can also utilize git flags with co-commit: eg `git commit --all` becomes `npx co-commit --all`. Additionally, you can skip prompts using flags: eg: `-m "your commit message"` or `-co "mariiapunda"`.

### Multiple Co-Authors

To commit with multiple co-authors simply comma-separate their usernames.

## ⛓ Dependencies

To run co-commit you need to have [NodeJs](https://nodejs.org/en/) installed. Naturally, [git](https://git-scm.com/) is also required.

## Contributors

- [mariiapunda](https://github.com/MariiaPunda) 👩‍💻
- [juliettepretot](https://github.com/juliettepretot) 👩‍💻
