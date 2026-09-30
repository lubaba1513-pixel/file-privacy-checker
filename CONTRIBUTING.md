# Contributing

Useful contributions include small detector improvements, false-positive fixes, accessible interface changes, clearer documentation, and regression examples.

## Set up

Open `index.html` locally to use the app. The application itself requires no package installation. Automated regression checks require Node.js 22 or newer and use only built-in modules.

From the repository folder:

```sh
node --check script.js
node tests/privacy-checker.test.cjs
```

The tests simulate DOM events; they do not verify browser layout, native clipboard permissions, or actual download dialogs. Also run the [browser validation procedure](docs/validation.md) when changing UI or export behavior.

## Before submitting

1. Explain the user-visible problem and provide a minimal fictional example.
2. Keep changes focused; document any detection rule or privacy-boundary change.
3. Add a regression assertion for behavior changes, including a false-positive case where relevant.
4. Run the checks above and report what you actually verified.
5. Confirm examples, logs, and screenshots contain no real sensitive information.

Use a feature branch and submit a pull request. Contributions are offered under the project's [MIT license](LICENSE). Please keep discussion respectful and focus feedback on the work.

## Reporting

Use GitHub Issues for normal bugs and feature requests. Follow [SECURITY.md](SECURITY.md) for security-sensitive reports.

AI-assisted contributions are welcome when their author reviews the result, checks claims, and verifies behavior. Generated code or documentation should not introduce untested promises or confidential material.
