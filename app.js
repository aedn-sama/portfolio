import { profile } from "./profile.js";

const chapters = [
  { id: "einstieg", category: "DER EINSTIEG", color: "#dbad65" },
  { id: "ueber-mich", category: "ÜBER MICH", color: "#88a7d5" },
  {
    id: "tech-stack",
    category: "KERNKOMPETENZEN & TECH STACK",
    color: "#9dbb83",
  },
  { id: "profil", category: "STÄRKEN & SCHWÄCHEN", color: "#bc9dce" },
  { id: "kontakt", category: "KONTAKT", color: "#d8a16d" },
];
const tabs = [...document.querySelectorAll('[role="tab"]')];
let activeIndex = 0;
let soundEnabled = false;
let audioContext;

function playClick() {
  if (!soundEnabled) return;
  try {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume().catch(() => {});
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(640, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      320,
      audioContext.currentTime + 0.07,
    );
    gain.gain.setValueAtTime(0.025, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.08,
    );
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.08);
  } catch {
    /* Audio is optional; navigation remains available. */
  }
}

function selectChapter(
  index,
  { scroll = false, focusTab = false, updateHash = true, sound = true } = {},
) {
  if (index < 0 || index >= chapters.length) return;
  activeIndex = index;
  const chapter = chapters[index];
  tabs.forEach((tab, i) => {
    tab.setAttribute("aria-selected", String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden =
      i !== index;
  });
  document.documentElement.style.setProperty("--accent", chapter.color);
  const number = String(index + 1).padStart(2, "0");
  document.getElementById("chapter-label").textContent = `BUCH ${number} / 05`;
  document.getElementById("chapter-category").textContent = chapter.category;
  document.getElementById("reading-progress").innerHTML =
    `${number} <span>/ 05</span>`;
  document.getElementById("previous-chapter").disabled = index === 0;
  document.getElementById("next-chapter").disabled =
    index === chapters.length - 1;
  if (updateHash) history.pushState(null, "", `#${chapter.id}`);
  if (focusTab) tabs[index].focus({ preventScroll: true });
  if (scroll)
    document.getElementById("profile").scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  if (sound) playClick();
}

tabs.forEach((tab, index) =>
  tab.addEventListener("click", () => selectChapter(index)),
);
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  const index = chapters.findIndex(
    (chapter) => `#${chapter.id}` === link.getAttribute("href"),
  );
  if (index < 0) return;
  link.addEventListener("click", (event) => {
    event.preventDefault();
    selectChapter(index, { scroll: true });
    // Transfer focus to the content when navigation originated outside the tab list.
    document
      .getElementById(`panel-${chapters[index].id}`)
      .focus({ preventScroll: true });
  });
});

document
  .querySelector('[role="tablist"]')
  .addEventListener("keydown", (event) => {
    let index;
    if (event.key === "ArrowRight") index = (activeIndex + 1) % chapters.length;
    if (event.key === "ArrowLeft")
      index = (activeIndex + chapters.length - 1) % chapters.length;
    if (event.key === "Home") index = 0;
    if (event.key === "End") index = chapters.length - 1;
    if (index === undefined) return;
    event.preventDefault();
    selectChapter(index, { focusTab: true });
  });
document.addEventListener("keydown", (event) => {
  if (
    event.ctrlKey ||
    event.altKey ||
    event.metaKey ||
    event.isComposing ||
    event.target.closest('input, textarea, select, [contenteditable="true"]')
  )
    return;
  if (/^[1-5]$/.test(event.key)) {
    event.preventDefault();
    selectChapter(Number(event.key) - 1, { focusTab: true, scroll: true });
  }
});
document
  .getElementById("previous-chapter")
  .addEventListener("click", () => selectChapter(activeIndex - 1));
document
  .getElementById("next-chapter")
  .addEventListener("click", () => selectChapter(activeIndex + 1));

function restoreChapter() {
  const index = chapters.findIndex(
    (chapter) => `#${chapter.id}` === location.hash,
  );
  selectChapter(index < 0 ? 0 : index, { updateHash: false, sound: false });
  if (index >= 0)
    document.getElementById("profile").scrollIntoView({ behavior: "instant" });
}
window.addEventListener("popstate", restoreChapter);
window.addEventListener("hashchange", restoreChapter);
restoreChapter();

const soundToggle = document.getElementById("sound-toggle");
soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.setAttribute(
    "aria-label",
    soundEnabled ? "Sound ausschalten" : "Sound einschalten",
  );
  document.getElementById("sound-label").textContent = soundEnabled
    ? "Sound an"
    : "Sound aus";
  playClick();
});

const contacts = [
  {
    label: "LinkedIn",
    value: profile.linkedin,
    href: profile.linkedin,
    placeholder: "Profil-Link folgt",
  },
  {
    label: "GitHub",
    value: profile.github,
    href: profile.github,
    placeholder: "Profil-Link folgt",
  },
];
const contactRoot = document.getElementById("contact-links");
contacts.forEach((contact) => {
  let url;
  try {
    const parsed = new URL(contact.href);
    if (parsed.protocol === "https:") url = parsed.href;
  } catch {
    /* Missing contact information is displayed without a dead link. */
  }
  const item = document.createElement(url ? "a" : "div");
  item.className = `contact-item${url ? " link" : ""}`;
  if (url) {
    item.href = url;
    item.target = "_blank";
    item.rel = "noopener noreferrer";
  }
  const title = document.createElement("strong");
  title.textContent = `${contact.label}${url ? " ↗" : ""}`;
  const detail = document.createElement("span");
  detail.textContent = url
    ? contact.value.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")
    : contact.placeholder;
  if (!url) detail.className = "contact-pending";
  item.append(title, detail);
  contactRoot.append(item);
});
try {
  const sourceUrl = new URL(profile.repository);
  if (sourceUrl.protocol === "https:")
    document.getElementById("source-link").href = sourceUrl.href;
} catch {
  /* Retain the original repository link if the custom value is invalid. */
}
