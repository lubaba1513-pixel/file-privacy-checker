<a id="top"></a>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:163F3A,100:6A5689&height=220&section=header&text=File%20Privacy%20Checker&fontSize=42&fontColor=ffffff&fontAlignY=36&desc=Review%20locally.%20Redact%20thoughtfully.%20Share%20with%20care.&descSize=17&descAlignY=58" width="100%" alt="File Privacy Checker â€” Review locally. Redact thoughtfully. Share with care." />

<div align="center">

### Review before you share.

Keep the useful context. Protect passwords, keys, and personal details.

**A browser workspace for reviewing logs, notes, and AI prompts before sharing them.**

![Processing](https://img.shields.io/badge/Processing-Local%20Browser-1C6558?style=for-the-badge)
![Review](https://img.shields.io/badge/Review-Human%20Controlled-6A5689?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/Built%20With-Vanilla%20JavaScript-D9A441?style=for-the-badge&logo=javascript&logoColor=white)
[![License](https://img.shields.io/badge/License-MIT-1C6558?style=for-the-badge)](LICENSE)

**Six automatic detectors Â· Manual redaction Â· Copy and download Â· No backend**

[Start here](#start) Â· [Workspace](#workspace) Â· [Features](#features) Â· [Detection](#detection) Â· [Workflow](#workflow) Â· [Privacy](#privacy) Â· [Creator](#creator)

</div>

---

---

<a id="about"></a>
## ðŸ›¡ï¸ A last check before you share

A useful troubleshooting log can also contain a password. An AI prompt can include a customerâ€™s email. A configuration note can accidentally reveal a token or private key.

**File Privacy Checker helps you review that text in your browser, choose what to remove, and export a cleaner copy.** Automatic findings are a starting point; you can restore false positives and manually mark details the patterns miss.

> [!IMPORTANT]
> **No findings does not mean no sensitive information.** Review the entire output before sharing. This tool uses patterns and a checksum; it does not understand every context or certify that text is safe.

---

<a id="workspace"></a>
## ðŸ–¥ï¸ Inside the workspace

<div align="center">

<img src="assests/workspace.png" width="100%" alt="File Privacy Checker workspace with original input, a redacted preview, category counts, and seven reviewed findings using fictional data" />

<sub><strong>Original text â†’ reviewed choices â†’ redacted copy</strong><br/>Actual development screenshot: six automatic findings and one manual selection, using fictional data.</sub>

</div>

---

<a id="features"></a>
## âœ¨ Built for practical review

<table>
<tr>
<td width="50%" valign="top">
<h3>ðŸ”Ž Find common sensitive patterns</h3>
<p>Detect possible emails, phone numbers, labeled passwords and tokens, payment-card candidates, and complete private-key blocks.</p>
<p><code>6 detectors</code> Â· <code>Grouped counts</code></p>
</td>
<td width="50%" valign="top">
<h3>â˜‘ï¸ Decide what stays</h3>
<p>Use a checkbox for each occurrence, or choose <strong>Redact all</strong> and <strong>Keep all</strong>. Locate selects the original passage for closer review.</p>
<p><code>Per-item choices</code> Â· <code>Locate</code> Â· <code>Bulk controls</code></p>
</td>
</tr>
<tr>
<td width="50%" valign="top">
<h3>âœï¸ Mark what patterns miss</h3>
<p>After checking, select an additional passage in the original input and mark it for replacement with <code>[REDACTED]</code>.</p>
<p><code>Manual selection</code> Â· <code>[REDACTED]</code></p>
</td>
<td width="50%" valign="top">
<h3>ðŸ“„ Compare and export</h3>
<p>Review source and preview side by side on wider screens, then copy the reviewed text or download a <code>.txt</code> file.</p>
<p><code>Side-by-side preview</code> Â· <code>Copy</code> Â· <code>Download</code></p>
</td>
</tr>
</table>

---

<a id="start"></a>
## ðŸš€ Start in your browser

1. Choose **Code â†’ Download ZIP** on this repository and extract the folder.
2. Keep `index.html`, `style.css`, and `script.js` together.
3. Open **index.html** in a current browser.
4. Click **Try a fake example** to explore the tool.

**No installation, account, API key, or AWS setup is needed to use the application.** The demo replaces the current input with fictional text.

| Step | What to do |
|---|---|
| **Input** | Paste text or load a UTF-8 `.txt` file up to **1 MiB** (1,048,576 bytes). |
| **Check** | Run the check and inspect the findings and original text. |
| **Review** | Choose which occurrences to redact; manually mark any extra passage. |
| **Export** | Read the complete preview, then copy or download `reviewed-copy.txt`. |

> [!TIP]
> Editing the input invalidates the previous review. Running a new check resets manual selections and checkbox choices. **Clear all** resets the applicationâ€™s input, preview, file selection, and findings.

---

<a id="detection"></a>
## ðŸ” What it looks for

| Category | Supported pattern | Replacement |
|---|---|---|
| **Email** | Common email-address formats | `[EMAIL]` |
| **Phone** | 10â€“15 digits with a leading `+` or a recognized preceding phone label | `[PHONE]` |
| **Password** | Values labeled `password`, `passwd`, or `pwd` | `[PASSWORD]` |
| **API key / token** | Values labeled API key, access token, or secret key in supported forms | `[SECRET]` |
| **Payment card** | 13â€“19 digits passing a Luhn checksum; all-zero strings excluded | `[CARD]` |
| **Private key** | Complete blocks with matching supported PEM private-key markers | `[PRIVATE KEY]` |
| **Manual selection** | A nonempty passage you select after checking | `[REDACTED]` |

<details>
<summary><strong>Detection details and limitations</strong></summary>

Quoted credential values can contain spaces. Common quoted JSON labels are supported, but escaped quotes are not fully supported. A matching card checksum does not establish a real or active account, and matching private-key markers do not validate key contents.

**Read the exact rules and limitations:** [Detection reference â†’](docs/detection.md)

</details>

---

<a id="workflow"></a>
## âš™ï¸ From input to reviewed copy

### A small example, a useful difference

| Original text â€” fictional values | Reviewed copy |
|---|---|
| `Contact: test@example.com` | `Contact: [EMAIL]` |
| `password="Fake password"` | `password="[PASSWORD]"` |
| `api_key=FAKEabcdefgh12345678` | `api_key=[SECRET]` |
| `Order number: 1234567890` | `Order number: 1234567890` |

### The review flow

```mermaid
flowchart TB
    A["Pasted text or local .txt file"] --> B["Local pattern and checksum checks"]
    B --> C["Review findings and mark extra passages"]
    C --> D{"Redact this occurrence?"}
    D -->|Yes| E["Insert its placeholder"]
    D -->|No| F["Keep the original value"]
    E --> G["Preview, copy, or download"]
    F --> G
```

<details>
<summary><strong>How replacements and overlapping findings work</strong></summary>

Findings retain their original character positions. Selected replacements run from the end of the text towards the beginning, preserving earlier positions. Overlapping automatic findings keep the first accepted detection; private-key and labeled-credential checks run first. Manual selections cannot overlap an existing finding.

</details>

---

<a id="privacy"></a>
## ðŸ§­ Privacy with clear boundaries

<div align="center">

### Local processing. Visible choices. Human review.

</div>

| Principle | What the application does |
|---|---|
| **Process locally** | Checks entered text in browser memory, with no upload endpoint or remote analysis service. |
| **Keep decisions visible** | Shows the original input, selected findings, and current output. |
| **Avoid application persistence** | Does not save entered text in local storage or a database. |
| **Explain the limits** | Documents missed formats, false positives, and the need for manual review. |

Original values remain in the input. Credentials, cards, keys, and manual values are hidden in finding descriptions, but **Locate** selects them in the original input. Unchecking a finding restores it in the output.

> [!NOTE]
> Loading a hosted application requests its page files from the host. Copying and downloading can leave data in clipboard history or local files. Browser extensions, host request logs, and device security are outside the applicationâ€™s control. This README also uses externally hosted decorative banners and badges; those images are separate from the application and do not receive the text you review.

**Current scope:** plain text only. No PDF, Word, image, or document-metadata inspection. Names, addresses, unlabeled credentials, unsupported phone formats, and incomplete private keys can be missed.

[Privacy details and troubleshooting â†’](docs/privacy.md)

---

<a id="validation"></a>
## ðŸ§ª Test with fictional data

Load [the final test file](samples/final-privacy-test.txt) and run a check:

- Expect **six automatic findings**: email, phone, password, token, card, and private key.
- Expect **3 credentials Â· 2 contact details Â· 1 payment card**.
- The sample order number and ordinary paragraphs should stay intact.
- Mark **Blue Orchid** manually to create the seventh finding.
- Uncheck and recheck a finding, then compare copied and downloaded text with the preview.

The creator completed the development browser workflow and final sample-file checks. JavaScript syntax and simulated-DOM regression checks also passed during review. These checks cover exercised examples; they do not establish exhaustive detection, native-browser compatibility, or an independent security audit.

<details>
<summary><strong>Run automated development checks</strong></summary>

With **Node.js 22 or newer**, run from the repository folder:

```sh
node --check script.js
node tests/privacy-checker.test.cjs
```

No npm installation is needed. The tests execute the actual application against a simulated DOM, covering replacements, overlap handling, manual choices, exports, reset, file validation, file-read conflicts, and review controls. Native rendering, clipboard permissions, and download dialogs require separate browser checks.

GitHub Actions configuration is provided for the same checks. Check the repositoryâ€™s **Actions** tab for its actual hosted status.

</details>

[Full validation walkthrough â†’](docs/validation.md)

---

<a id="documentation"></a>
## ðŸ“š Explore the project

| Resource | What you will find |
|---|---|
| [Application structure](index.html) Â· [Styles](style.css) Â· [Logic](script.js) | HTML, CSS, and vanilla JavaScript with no application runtime dependencies. |
| [Detection](docs/detection.md) | Patterns, priority, overlaps, and replacements. |
| [Validation](docs/validation.md) Â· [Sample](samples/final-privacy-test.txt) | Repeatable checks with fictional data. |
| [Privacy](docs/privacy.md) | Data handling, limitations, and troubleshooting. |
| [Contributing](CONTRIBUTING.md) Â· [Changelog](CHANGELOG.md) | Contribution guidance and implemented features. |
| [Security reporting](SECURITY.md) Â· [Responsible use](ETHICS.md) | Report defects and handle sensitive material carefully. |
| [MIT license](LICENSE) | Reuse and modification terms, including commercial use with the notice retained. |

---

<a id="creator"></a>
## ðŸ‘©â€ðŸ’» Built by Lubaba

<div align="center">

**[Lubaba Zafar](https://github.com/lubaba1513-pixel)**

Cybersecurity project creator Â· File Privacy Checker

<br/>

**Built to make careful sharing easierâ€”one reviewed copy at a time.**

</div>

<details>
<summary><strong>AI-assisted development, human validation</strong></summary>

AI assisted with implementation guidance, troubleshooting, interface refinement, code review, and documentation. Lubaba performed the browser checks and final sample-file validation. The running application uses JavaScript patterns and a checksum; it does not call an AI model or send entered content to an AI service.

</details>

Have a useful improvement or a missed pattern? [Open an issue](https://github.com/lubaba1513-pixel/file-privacy-checker/issues) with a **minimal fictional example**. Follow [SECURITY.md](SECURITY.md) for security-sensitive reports. Never include real credentials or personal data in public reports.

---

<div align="center">

**Review the source. Choose what stays. Share the reviewed copy.**

[Start here](#start) Â· [Documentation](#documentation) Â· [Back to top â†‘](#top)

</div>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:6A5689,100:163F3A&height=100&section=footer" width="100%" alt="File Privacy Checker footer" />
