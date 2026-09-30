[Home](../README.md) · [Detection](detection.md) · [Privacy](privacy.md)

# Repeatable validation

Use [final-privacy-test.txt](../samples/final-privacy-test.txt). All sensitive values in the sample are fictional.

## Automatic review

1. Load the sample using the `.txt` file input.
2. Click **Check for sensitive information**.
3. Expect six findings: email, phone, password, token, card, and private key.
4. Expect summary counts: **3 credentials, 2 contact details, 1 payment card, 0 manual selections**.
5. Expect the preview badge to show **6 of 6 removed**.

The relevant output lines should be:

```text
Contact: [EMAIL]
Phone: [PHONE]
password="[PASSWORD]"
api_key=[SECRET]
Card: [CARD]

[PRIVATE KEY]
```

Project details, the meeting time, public reference, paragraphs, and `Order number: 1234567890` should remain intact.

## Human review

| Action | Expected result |
| --- | --- |
| Uncheck email | Original email returns; removal count becomes 5 of 6. |
| Check email again | Email placeholder returns; removal count becomes 6 of 6. |
| Keep all | Output matches original input; removal count is 0 of 6. |
| Redact all | Six automatic placeholders return. |
| Locate an item | Its original occurrence is selected in the input box. |
| Select Blue Orchid and mark it | Seventh finding appears; the note becomes `Internal note: [REDACTED]`. |
| Mark the same selection again | An overlap message appears; no duplicate finding is added. |

## Export and reset

- Copy into a temporary text editor and compare with the preview.
- Download the file and compare its contents with the preview.
- Edit the original input: the previous preview and review list clear, and export buttons become disabled.
- Clear all: input, output, file selection, and review state reset.
- Check empty input: expect “Paste some text first.”
- Narrow the browser window: panels should stack without horizontal page overflow.

## Evidence and scope

During development, Lubaba reported that the combined browser workflow and final sample-file test passed. The [supplied interface screenshot](../assets/workspace.png) shows seven findings with the expected category counts and reviewed output.

Additional development checks ran JavaScript in a simulated DOM to exercise state transitions, redaction offsets, file-read cancellation, and the new controls. The runnable regression script is now included at `tests/privacy-checker.test.cjs`. A GitHub Actions workflow is prepared to run syntax and regression checks after upload; a hosted CI result has not yet been verified. No claim is made of exhaustive coverage, independent security auditing, or compatibility with every browser.

[Back to project home](../README.md)

## Run automated checks

With Node.js 22 or newer, run from the repository folder:

```sh
node --check script.js
node tests/privacy-checker.test.cjs
```

The script uses built-in Node modules and executes the real application with a simulated DOM. A failing assertion returns a nonzero exit code. It exercises automatic and manual replacements, overlaps, checkbox restoration, export payloads, file validation and read conflicts, reset state, bulk controls, and locating an item. Native browser behavior remains a separate manual check.
