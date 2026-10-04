const COLORS = ["#fdf0b4", "#d0e8ee", "#ffd9d9", "#ffd3a6", "#e3f0cf", "#e7dcf5"];
const KEY = "sticky-wall-notes";

const defaults = [
  { id: 1, title: "Title of Note 1", color: COLORS[0], body: "-  content 1\n-  content 2\n- content 3" },
  { id: 2, title: "Title of Note 2", color: COLORS[1], body: "-  content 1\n-  content 2\n- content 3" },

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
