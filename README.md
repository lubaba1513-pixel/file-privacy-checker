# File Privacy Checker v1.1

Review and redact sensitive text before sharing logs, notes, or AI prompts. This first version runs entirely in your browser, without a server, account, external libraries, or network requests from the application.

## Run locally

Keep `index.html`, `style.css`, and `script.js` in the same folder. Double-click `index.html` to open it in a current desktop browser. No installation or AWS account is needed.

## Use

1. Paste text or select a UTF-8 `.txt` file up to 1 MiB (1,048,576 bytes).
2. Click **Check for sensitive information**.
3. Review each finding. Checked items are redacted; unchecking restores their original values.
4. For an extra finding, select text in the original input box and click **Mark selected text as sensitive**. Overlapping selections are rejected.
5. Review the entire output, then copy it or download `reviewed-copy.txt`.
6. Use **Clear all** to reset the page.

Editing input invalidates the old review. Checking again resets manual selections and checkbox choices. Copying may require HTTPS or localhost in some browsers; if clipboard access fails, select the output and use Ctrl+C (Cmd+C on macOS).

## Supported patterns

- Common email addresses: `[EMAIL]`.
- Possible phone numbers with 10–15 digits, starting with `+` or following a phone/mobile/tel/telephone/whatsapp label: `[PHONE]`.
- Values labeled password, passwd, or pwd: `[PASSWORD]`.
- Values labeled api_key, api-key, apikey, access_token, access-token, accesstoken, secret_key, secret-key, or secretkey: `[SECRET]`.
- Possible payment card numbers with 13–19 digits that pass a Luhn checksum: `[CARD]`.
- Complete matching PEM private key blocks, including generic, RSA, EC, OPENSSH, and ENCRYPTED PRIVATE KEY markers: `[PRIVATE KEY]`.
- Manually selected text: `[REDACTED]`.

Password and token values can be quoted (including spaces) or unquoted. Common quoted JSON labels are supported. Private keys, passwords, tokens, cards, and manual selections are hidden in the findings list, but original values remain in the input box.

## Privacy and limitations

Text is processed in browser memory. The application does not upload it, use analytics, or save it in browser storage. Copying places output on your system clipboard; downloading saves it on your device. Browser extensions, clipboard history, and device security are outside this application's control.

This is a pattern-based review aid, not a guarantee that text is safe to share. It can miss names, addresses, unlabeled credentials, unusual formats, incomplete key blocks, escaped quoted values, and local phone numbers without labels. Luhn checks identify possible card numbers, not valid or active cards, and may flag unrelated identifiers. It does not inspect PDF, Word, images, or file metadata. Always review the complete result. Use only fake data for testing.

## Quick smoke test

Paste the following fake sample and check it:

```text
Contact: test@example.com
Phone: +923001234567
password="Fake password with spaces"
api_key=FAKEabcdefgh12345678
Card: 4111 1111 1111 1111
-----BEGIN PRIVATE KEY-----
FAKE_TEST_DATA
-----END PRIVATE KEY-----
Order number: 1234567890
```

Expect six findings and these replacements:

```text
Contact: [EMAIL]
Phone: [PHONE]
password="[PASSWORD]"
api_key=[SECRET]
Card: [CARD]
[PRIVATE KEY]
Order number: 1234567890
```

Select the order number and mark it manually: expect a seventh finding and `[REDACTED]`. Toggle a checkbox, download the output, edit the input, and clear the page to verify the full workflow.

## Review workspace

The desktop layout places original text and redacted output side by side; narrow screens stack the panels. Finding counts group credentials, contact details, payment cards, and manual selections. Counts represent detected occurrences, including unchecked items. The preview badge reports how many items are selected for removal.

- **Try a fake example** replaces current input and runs a sample check.
- **Locate** selects a finding in the original text; hidden values become visible there.
- **Redact all** selects every finding; **Keep all** restores all original values in the output.
- Copy and download are available only after a review produces output.

New review controls use the same local detection and redaction rules described above.
