[Home](../README.md) · [Detection](detection.md) · [Validation](validation.md)

# Privacy and troubleshooting

## Where data goes

Pasted input and local file text are processed in the page's JavaScript memory. The application contains no upload endpoint, analytics integration, AI API, database, or browser-storage persistence for the text.

Copy writes the reviewed output to the system clipboard. Download writes it to a local file. Both destinations can retain data after the page is cleared. The application does not manage clipboard history or downloaded files.

If hosted, loading the page requests application assets from the hosting provider. Local processing of entered text does not eliminate the host's ordinary page-request logs.

## Visible originals

The original input retains all values. Passwords, tokens, cards, private keys, and manually marked values are hidden in finding descriptions, but **Locate** selects the original value in the input box. Unchecking restores it in the output. Keep this in mind when sharing your screen.

## What the tool cannot guarantee

Pattern recognition can produce both false positives and false negatives. It does not understand context, prove that a detected credential is valid, or certify that the output is safe. It only handles plain text and does not inspect document metadata or embedded images.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Copy fails | Clipboard access varies by browser and page context. Use Ctrl+C or Cmd+C after the fallback selects the output. |
| Style or buttons do not load | Keep the HTML, CSS, and JavaScript together. Check filename spelling and refresh. |
| Local phone number is missed | Add a recognized phone label, or manually select the value after checking. |
| Key block is missed | Verify complete matching PEM markers with five hyphens on each side. |
| Manual selection is rejected | Check the current input first; choose a nonempty selection that does not overlap an existing finding. |
| File is rejected | Use a `.txt` filename and a file no larger than 1 MiB. UTF-8 text is expected. |
| Review disappears after editing | This is intentional: changing source text invalidates the old character positions. Run a new check. |

Report problems using fake examples only.

[Back to project home](../README.md)
