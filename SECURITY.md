# Security reporting

## Scope

The current release line is v1.1. Security-related reports about the browser application are welcome, including unexpected data transmission, content rendering problems, incorrect state handling, and unintended inclusion of selected values in exports.

Known detection limits are documented in [detection.md](docs/detection.md). A missed format can be an ordinary bug or feature request; a defect that exposes reviewed text or breaks an expected privacy boundary deserves security review.

## Report privately when available

Use the repository's **Security → Report a vulnerability** option if private vulnerability reporting is enabled. This option must be enabled by the repository owner; this policy does not imply that it is already active.

If the private option is unavailable, open a public issue only to request a private reporting channel. Do not include vulnerability details, reproduction material, real credentials, or personal information in that request.

For a private report, include the affected version, browser, minimal fake reproduction, expected behavior, observed behavior, and potential impact. Test only local copies and systems you are authorized to assess.

## Expectations

This is an individually maintained project. No response-time guarantee, bounty, continuous monitoring, or independent security audit is promised. Please allow the maintainer to review a report before public disclosure.

## Privacy boundary

The application is designed to process text locally, with no remote analysis or browser-storage persistence. Clipboard history, downloads, browser extensions, host page logs, and device security remain outside its control. See [privacy.md](docs/privacy.md).
