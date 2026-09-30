[Home](../README.md) · [Validation](validation.md) · [Privacy](privacy.md)

# Detection reference

## Credentials

Password labels: `password`, `passwd`, and `pwd`.

Token labels: `api_key`, `api-key`, `apikey`, `access_token`, `access-token`, `accesstoken`, `secret_key`, `secret-key`, and `secretkey`. Matching is case-insensitive.

Labels use `:` or `=`. Double- or single-quoted values are captured through the closing quote on the same line. Unquoted values stop at whitespace, quotes, commas, ampersands, or semicolons. Common quoted JSON labels are accepted; this is pattern matching, not a JSON parser. Escaped quotes are not fully supported.

## Contacts

Email matching covers common address formats. Phone candidates require 10–15 digits and either a leading `+` or a preceding label on the same line: phone, mobile, tel, telephone, or whatsapp. Formatting spaces, tabs, dots, parentheses, and hyphens are allowed within candidates. These are possible phone numbers, not validated regional numbers.

## Payment cards

Candidates contain 13–19 digits with optional spaces or hyphens. They must pass a Luhn checksum; all-zero strings are excluded. Passing the checksum does not establish an active account. Some other numeric identifiers can pass too.

## Private keys

Complete blocks must have matching `-----BEGIN … PRIVATE KEY-----` and `-----END … PRIVATE KEY-----` markers. Supported examples include generic PRIVATE KEY and RSA, EC, OPENSSH, and ENCRYPTED PRIVATE KEY blocks. The detector recognizes markers; it does not validate key contents.

## Overlaps and manual selections

Checks run in this order: private keys, passwords, labeled keys/tokens, cards, emails, and phones. If findings overlap, the first accepted finding is kept. This prevents content inside an already detected private key or credential from becoming a second overlapping finding.

Manual selections must follow a check of the current input. They cannot overlap an existing finding, even if its checkbox is unchecked. Running a new check resets manual selections and review choices.

## Replacement

Each accepted item records a start, end, replacement, and checkbox state. Output is built from the original checked text. Selected findings are replaced from the end towards the beginning, preserving earlier offsets. Unchecked findings stay unchanged.

[Back to project home](../README.md)
