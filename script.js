const inputText = document.getElementById("inputText");
const checkButton = document.getElementById("checkButton");
const findings = document.getElementById("findings");
const fileInput = document.getElementById("fileInput");
const redactedText = document.getElementById("redactedText");
const copyButton = document.getElementById("copyButton");
const reviewSection = document.getElementById("reviewSection");
const reviewList = document.getElementById("reviewList");

const summary = document.getElementById("summary");
const outputState = document.getElementById("outputState");
const demoButton = document.getElementById("demoButton");
const selectAllButton = document.getElementById("selectAllButton");
const deselectAllButton = document.getElementById("deselectAllButton");
let checkedText = "";
let detectedItems = [];
let fileReadVersion = 0;
let copyTimer;

function clearReview(message) {
  clearTimeout(copyTimer);
  copyButton.textContent = "Copy redacted text";
  checkedText = "";
  detectedItems = [];
  reviewList.replaceChildren();
  reviewSection.hidden = true;
  redactedText.value = "";
  findings.textContent = message;
  summary.replaceChildren();
  summary.hidden = true;
  outputState.textContent = "Awaiting review";
  copyButton.disabled = true;
  document.getElementById("downloadButton").disabled = true;
}

function addItem(type, value, start, replacement) {
  detectedItems.push({
    type,
    value,
    start,
    end: start + value.length,
    replacement,
    redact: true
  });
}

function updateRedactedCopy() {
  let output = checkedText;

  // Work backwards so earlier character positions do not change.
  for (const item of [...detectedItems].reverse()) {
    if (item.redact) {
      output =
        output.slice(0, item.start) +
        item.replacement +
        output.slice(item.end);
    }
  }

  redactedText.value = output;
  copyButton.disabled = !output;
  document.getElementById("downloadButton").disabled = !output;
  const removed = detectedItems.filter(item => item.redact).length;
  outputState.textContent = detectedItems.length
    ? `${removed} of ${detectedItems.length} removed`
    : "Review still needed";
  updateSummary();
}

function updateSummary() {
  summary.replaceChildren();
  summary.hidden = !checkedText;
  const groups = [
    ["Credentials", ["Password", "API key or token", "Private key"]],
    ["Contact details", ["Email", "Phone"]],
    ["Payment cards", ["Payment card"]],
    ["Manual selections", ["Manual"]]
  ];
  for (const [title, types] of groups) {
    const card = document.createElement("div");
    card.className = "stat";
    const count = document.createElement("strong");
    const name = document.createElement("span");
    count.textContent = String(detectedItems.filter(item => types.includes(item.type)).length);
    name.textContent = title;
    card.append(count, name);
    summary.append(card);
  }
}

function renderReview() {
  reviewList.replaceChildren();
  reviewSection.hidden = detectedItems.length === 0;
  for (const item of detectedItems) {
    const row = document.createElement("div");
    row.className = "finding-row";
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.redact;
    const description = document.createElement("span");
    const hideValue = ["Private key", "Password", "API key or token", "Payment card", "Manual"]
      .includes(item.type);
    description.textContent = hideValue
      ? (item.type === "Manual" ? "Manual selection" : item.type)
      : `${item.type}: ${item.value}`;
    const detail = document.createElement("small");
    const line = checkedText.slice(0, item.start).split("\n").length;
    detail.textContent = `Line ${line} · Character ${item.start + 1}${hideValue ? " · Value hidden" : ""}`;
    description.append(detail);
    checkbox.addEventListener("change", () => {
      item.redact = checkbox.checked;
      updateRedactedCopy();
    });
    label.append(checkbox, description);
    const locate = document.createElement("button");
    locate.type = "button";
    locate.className = "quiet";
    locate.textContent = "Locate";
    locate.setAttribute("aria-label", `Locate ${item.type} at character ${item.start + 1}`);
    locate.addEventListener("click", () => {
      inputText.focus();
      inputText.setSelectionRange(item.start, item.end);
      inputText.scrollIntoView({ behavior: "smooth", block: "center" });
      const lineHeight = parseFloat(getComputedStyle(inputText).lineHeight) || 21;
      inputText.scrollTop = Math.max(0, (line - 3) * lineHeight);
    });
    row.append(label, locate);
    reviewList.append(row);
  }
}

checkButton.addEventListener("click", () => {
  const text = inputText.value;

  if (text.trim() === "") {
    clearReview("Paste some text first.");
    return;
  }

  checkedText = text;
  detectedItems = [];
  const privateKeyPattern =
    /-----BEGIN ((?:[A-Z0-9]+ )?PRIVATE KEY)-----[\s\S]*?-----END \1-----/g;

  for (const match of text.matchAll(privateKeyPattern)) {
    addItem("Private key", match[0], match.index, "[PRIVATE KEY]");
  }
  // Password values are identified first so they are not also treated
  // as phone numbers or email addresses.
  // Capture a whole quoted value, including spaces, or an unquoted value.
  function detectLabeledValues(pattern, type, replacement) {
    for (const match of text.matchAll(pattern)) {
      const value = match[2] ?? match[3] ?? match[4];
      if (!value) continue;
      const quoted = match[2] !== undefined || match[3] !== undefined;
      const start = match.index + match[1].length + (quoted ? 1 : 0);
      addItem(type, value, start, replacement);
    }
  }

  const passwordPattern =
    /(\b(?:password|passwd|pwd)["']?[ \t]*[:=][ \t]*)(?:"([^"\r\n]*)"|'([^'\r\n]*)'|([^\s"'&,;]+))/gi;
  detectLabeledValues(passwordPattern, "Password", "[PASSWORD]");

  const keyPattern =
    /(\b(?:api[_-]?key|access[_-]?token|secret[_-]?key)["']?[ \t]*[:=][ \t]*)(?:"([^"\r\n]*)"|'([^'\r\n]*)'|([^\s"'&,;]+))/gi;
  detectLabeledValues(keyPattern, "API key or token", "[SECRET]");

  const cardPattern = /(?<![A-Za-z0-9_])\d(?:[ -]?\d){12,18}(?![A-Za-z0-9_]|[ -]\d)/g;

  for (const match of text.matchAll(cardPattern)) {
    const digits = match[0].replace(/\D/g, "");

    let sum = 0;
    let doubleNext = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = Number(digits[i]);

      if (doubleNext) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      doubleNext = !doubleNext;
    }

    if (sum % 10 === 0 && !/^0+$/.test(digits)) {
      addItem("Payment card", match[0], match.index, "[CARD]");
    }
  }
  const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

  for (const match of text.matchAll(emailPattern)) {
    addItem("Email", match[0], match.index, "[EMAIL]");
  }
  const phonePattern =
    /(?<![A-Za-z0-9_])\+?\d[\d \t().-]{8,}\d(?![A-Za-z0-9_])/g;

  for (const match of text.matchAll(phonePattern)) {
    const value = match[0];
    const digitCount = value.replace(/\D/g, "").length;
    const lineStart = text.lastIndexOf("\n", match.index - 1) + 1;
    const beforeNumber = text.slice(lineStart, match.index);

    const hasPhoneLabel =
      /\b(?:phone|mobile|tel|telephone|whatsapp)\s*[:=-]?\s*$/i
        .test(beforeNumber);

    if (
      digitCount >= 10 &&
      digitCount <= 15 &&
      (value.startsWith("+") || hasPhoneLabel)
    ) {
      addItem("Phone", value, match.index, "[PHONE]");
    }
  }
  // If two patterns identify the same characters, keep the first finding.
  const accepted = [];

  for (const item of detectedItems) {
    const overlaps = accepted.some(
      (existing) => item.start < existing.end && item.end > existing.start
    );

    if (!overlaps) accepted.push(item);
  }

  detectedItems = accepted.sort((a, b) => a.start - b.start);
  findings.textContent = detectedItems.length
    ? `${detectedItems.length} possible sensitive item(s) found. Review the choices below.`
    : "No supported patterns found. Other sensitive information may still be present.";
  renderReview();
  updateRedactedCopy();
});

const markButton = document.getElementById("markButton");

markButton.addEventListener("click", () => {
  if (!checkedText || checkedText !== inputText.value) {
    findings.textContent = "Click the check button before marking text.";
    return;
  }

  const start = inputText.selectionStart;
  const end = inputText.selectionEnd;

  if (start === end || !checkedText.slice(start, end).trim()) {
    findings.textContent = "Select some text in the input box first.";
    return;
  }

  const overlaps = detectedItems.some(
    (item) => start < item.end && end > item.start
  );

  if (overlaps) {
    findings.textContent = "This selection overlaps an existing finding.";
    return;
  }

  addItem("Manual", checkedText.slice(start, end), start, "[REDACTED]");
  detectedItems.sort((a, b) => a.start - b.start);
  renderReview();
  findings.textContent =
    `${detectedItems.length} possible sensitive item(s) found. Review the choices below.`;
  updateRedactedCopy();
});
fileInput.addEventListener("change", async () => {
  const readVersion = ++fileReadVersion;
  const file = fileInput.files[0];
  if (!file) return;

  if (!file.name.toLowerCase().endsWith(".txt")) {
    clearReview("Please select a .txt file.");
    fileInput.value = "";
    return;
  }

  if (file.size > 1024 * 1024) {
    clearReview("Please select a file no larger than 1 MiB.");
    fileInput.value = "";
    return;
  }

  clearReview("Reading file…");
  try {
    const text = await file.text();
    if (readVersion !== fileReadVersion) return;
    inputText.value = text;
    clearReview("File loaded. Click the check button to review it.");
  } catch {
    if (readVersion !== fileReadVersion) return;
    clearReview("Could not read this file. Please try another .txt file.");
  }
});

inputText.addEventListener("input", () => {
  fileReadVersion++;
  clearReview("Text changed. Click the check button to review it again.");
});

copyButton.addEventListener("click", async () => {
  if (!redactedText.value) {
    findings.textContent = "Check some text before copying.";
    return;
  }

  try {
    await navigator.clipboard.writeText(redactedText.value);
    copyButton.textContent = "Copied!";
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => {
      copyButton.textContent = "Copy redacted text";
    }, 2000);
  } catch {
    redactedText.select();
    findings.textContent = "Press Ctrl + C to copy the selected text.";
  }
});
const downloadButton = document.getElementById("downloadButton");

downloadButton.addEventListener("click", () => {
  if (!redactedText.value) {
    findings.textContent = "Check some text before downloading.";
    return;
  }

  const blob = new Blob([redactedText.value], {
    type: "text/plain;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "reviewed-copy.txt";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
const clearButton = document.getElementById("clearButton");

clearButton.addEventListener("click", () => {
  fileReadVersion++;
  inputText.value = "";
  fileInput.value = "";
  clearReview("Your results will appear here.");
  copyButton.textContent = "Copy redacted text";
  inputText.focus();
});
selectAllButton.addEventListener("click", () => {
  detectedItems.forEach(item => item.redact = true);
  renderReview();
  updateRedactedCopy();
});

deselectAllButton.addEventListener("click", () => {
  detectedItems.forEach(item => item.redact = false);
  renderReview();
  updateRedactedCopy();
});

demoButton.addEventListener("click", () => {
  fileReadVersion++;
  fileInput.value = "";
  inputText.value = `Contact: test@example.com
Phone: +923001234567
password="Fake password with spaces"
api_key=FAKEabcdefgh12345678
Card: 4111 1111 1111 1111
-----BEGIN PRIVATE KEY-----
FAKE_TEST_DATA
-----END PRIVATE KEY-----
Order number: 1234567890`;
  clearReview("Fake example loaded.");
  checkButton.click();
});
