const source = document.querySelector("#demo-source");
const initialDraft = source.value;
const originalDocument = "# Начало работы\n\nИнструкция скоро появится.";
const storageKey = "pushdocs-landing-draft-v1";
const announcement = document.querySelector("#announcement");
const preview = document.querySelector("#markdown-preview");
const previewToggle = document.querySelector("#preview-toggle");
const tabs = [...document.querySelectorAll("[data-tab]")];
let previewOpen = false;
let storageAvailable = true;

try {
  const saved = localStorage.getItem(storageKey);
  if (saved !== null) source.value = saved.slice(0, 5000);
} catch {
  storageAvailable = false;
}

function announce(message) {
  announcement.textContent = message;
}

// Build text nodes only. The illustrative preview never executes HTML or MDX.
function appendInline(parent, text) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      const strong = document.createElement("strong");
      strong.textContent = part.slice(2, -2);
      parent.append(strong);
    } else if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      const code = document.createElement("code");
      code.textContent = part.slice(1, -1);
      parent.append(code);
    } else parent.append(document.createTextNode(part));
  }
}

function renderPreview() {
  const fragment = document.createDocumentFragment();
  let list = null;
  for (const line of source.value.split("\n")) {
    if (!line.trim()) {
      list = null;
      continue;
    }
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    const item = line.match(/^[-*]\s+(.+)$/);
    if (item) {
      if (!list) {
        list = document.createElement("ul");
        fragment.append(list);
      }
      const li = document.createElement("li");
      appendInline(li, item[1]);
      list.append(li);
    } else {
      list = null;
      const element = document.createElement(
        heading ? `h${heading[1].length + 1}` : "p",
      );
      appendInline(element, heading ? heading[2] : line);
      fragment.append(element);
    }
  }
  if (!source.value.trim()) {
    const empty = document.createElement("p");
    empty.textContent = "Добавьте текст в редакторе, и он появится здесь.";
    fragment.append(empty);
  }
  preview.replaceChildren(fragment);
}

function renderDiff() {
  const before = originalDocument.split("\n");
  const after = source.value ? source.value.split("\n") : [];
  let prefix = 0;
  while (
    prefix < before.length &&
    prefix < after.length &&
    before[prefix] === after[prefix]
  )
    prefix++;
  let suffix = 0;
  while (
    suffix < before.length - prefix &&
    suffix < after.length - prefix &&
    before[before.length - 1 - suffix] === after[after.length - 1 - suffix]
  )
    suffix++;
  const removed = before.length - prefix - suffix;
  const added = after.length - prefix - suffix;
  const fragment = document.createDocumentFragment();
  const addLine = (text, type, marker) => {
    const line = document.createElement("div");
    line.className = `diff-line ${type}`;
    line.textContent = `${marker} ${text}`;
    fragment.append(line);
  };
  if (!removed && !added) {
    const message = document.createElement("p");
    message.className = "diff-empty";
    message.textContent =
      "Изменений нет. Текст совпадает с исходным документом.";
    fragment.append(message);
  } else {
    before.slice(0, prefix).forEach((line) => addLine(line, "unchanged", " "));
    before
      .slice(prefix, before.length - suffix)
      .forEach((line) => addLine(line, "removed", "−"));
    after
      .slice(prefix, after.length - suffix)
      .forEach((line) => addLine(line, "added", "+"));
    if (suffix)
      after.slice(-suffix).forEach((line) => addLine(line, "unchanged", " "));
  }
  document.querySelector("#diff-content").replaceChildren(fragment);
  document.querySelector("#diff-stat").textContent = `+${added} −${removed}`;
  document.querySelector("#review-stat").textContent = `+${added} −${removed}`;
}

function selectTab(name, focus = false) {
  tabs.forEach((tab) => {
    const selected = tab.dataset.tab === name;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden =
      !selected;
    if (selected && focus) tab.focus({ preventScroll: true });
  });
  if (name !== "editor") renderDiff();
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab.dataset.tab));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(tabs[next].dataset.tab, true);
  });
});
document
  .querySelectorAll("[data-next]")
  .forEach((button) =>
    button.addEventListener("click", () =>
      selectTab(button.dataset.next, true),
    ),
  );

function setPreview(open) {
  previewOpen = open;
  if (open) renderPreview();
  source.hidden = open;
  document.querySelector(".line-numbers").hidden = open;
  preview.hidden = !open;
  previewToggle.setAttribute("aria-pressed", String(open));
  previewToggle.textContent = open ? "К исходнику ‹/›" : "Предпросмотр ◉";
}
previewToggle.addEventListener("click", () => setPreview(!previewOpen));

function updateDraftStatus() {
  const status = document.querySelector("#draft-status");
  const dot = document.createElement("span");
  dot.className = "tiny-dot";
  status.replaceChildren(
    dot,
    document.createTextNode(
      storageAvailable
        ? "Черновик в этом браузере"
        : "Черновик до закрытия страницы",
    ),
  );
}
source.addEventListener("input", () => {
  try {
    localStorage.setItem(storageKey, source.value);
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
  updateDraftStatus();
});
document.querySelector("#reset-demo").addEventListener("click", () => {
  source.value = initialDraft;
  try {
    localStorage.removeItem(storageKey);
  } catch {
    /* Editing still works without storage. */
  }
  setPreview(false);
  selectTab("editor");
  updateDraftStatus();
  source.focus({ preventScroll: true });
  announce("Пример восстановлен. Вы можете снова изменить текст.");
});
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Открыть меню");
  mobileNav.hidden = true;
}
menuToggle.addEventListener("click", () => {
  const opening = menuToggle.getAttribute("aria-expanded") !== "true";
  mobileNav.hidden = !opening;
  menuToggle.setAttribute("aria-expanded", String(opening));
  menuToggle.setAttribute(
    "aria-label",
    opening ? "Закрыть меню" : "Открыть меню",
  );
});
mobileNav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileNav.hidden) {
    closeMenu();
    menuToggle.focus();
  }
});
matchMedia("(min-width: 601px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

const copyButton = document.querySelector("#copy-command");
const copyIcon = copyButton.querySelector("use");
let copyTimeout;
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(
      document.querySelector("#install-command").textContent,
    );
    copyIcon.setAttribute("href", "#i-check");
    copyButton.setAttribute("aria-label", "Команды скопированы");
    copyButton.title = "Скопировано";
    announce("Команды запуска скопированы.");
    clearTimeout(copyTimeout);
    copyTimeout = setTimeout(() => {
      copyIcon.setAttribute("href", "#i-copy");
      copyButton.setAttribute("aria-label", "Скопировать команды запуска");
      copyButton.title = "Скопировать";
    }, 3000);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector("#install-command"));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyButton.title = "Текст выделен. Нажмите Ctrl+C или ⌘C.";
    announce(
      "Копирование недоступно. Текст выделен. Нажмите Ctrl+C или Command+C.",
    );
  }
});
document.querySelector("#year").textContent = new Date().getFullYear();
updateDraftStatus();
renderDiff();
