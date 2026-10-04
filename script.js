const COLORS = ["#fdf0b4", "#d0e8ee", "#ffd9d9", "#ffd3a6", "#e3f0cf", "#e7dcf5"];
const KEY = "sticky-wall-notes";

const defaults = [
  { id: 1, title: "Social Media", color: COLORS[0], body: "- Plan social content\n- Build content calendar\n- Plan promotion and distribution" },
  { id: 2, title: "Content Strategy", color: COLORS[1], body: "Would need time to get insights (goals, personals, budget, audits), but after, it would be good to focus on assembling my team (start with SEO specialist, then perhaps an email marketer?). Also need to brainstorm on tooling." },
  { id: 3, title: "Email A/B Tests", color: COLORS[2], body: "- Subject lines\n- Sender\n- CTA\n- Sending times" },
  { id: 4, title: "Banner Ads", color: COLORS[3], body: "Notes from the workshop:\n- Sizing matters\n- Choose distinctive imagery\n- The landing page must match the display ad" }
];

let notes = load();
const wall = document.getElementById("wall");

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || defaults; }
  catch { return defaults; }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch {}
}

function render(filter = "") {
  wall.innerHTML = "";
  const q = filter.toLowerCase();

  notes
    .filter(n => (n.title + " " + n.body).toLowerCase().includes(q))
    .forEach(n => {
      const el = document.createElement("article");
      el.className = "note";
      el.style.background = n.color;

      const h = document.createElement("h3");
      h.contentEditable = true;
      h.textContent = n.title;
      h.addEventListener("input", () => { n.title = h.textContent; save(); });

      const p = document.createElement("p");
      p.contentEditable = true;
      p.textContent = n.body;
      p.addEventListener("input", () => { n.body = p.innerText; save(); });

      const del = document.createElement("button");
      del.className = "del";
      del.setAttribute("aria-label", "Delete note");
      del.innerHTML = "&times;";
      del.addEventListener("click", () => {
        notes = notes.filter(x => x.id !== n.id);
        save();
        render(document.getElementById("search").value);
      });

      el.append(h, p, del);
      wall.appendChild(el);
    });

  const add = document.createElement("button");
  add.className = "add-note";
  add.setAttribute("aria-label", "Add note");
  add.textContent = "+";
  add.addEventListener("click", () => {
    notes.push({
      id: Date.now(),
      title: "New note",
      color: COLORS[notes.length % COLORS.length],
      body: "Write something..."
    });
    save();
    render();
    wall.querySelectorAll(".note h3")[notes.length - 1]?.focus();
  });
  wall.appendChild(add);
}

document.getElementById("search").addEventListener("input", e => render(e.target.value));
document.getElementById("menuToggle").addEventListener("click", () =>
  document.getElementById("sidebar").classList.toggle("open"));

render();
