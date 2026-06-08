const events = [
  {
    id: 1,
    title: "Digital Education Forum 2026",
    type: "education",
    city: "Львів",
    date: "15 червня",
    day: 15,
    free: true,
    image: "education",
    tag: "Освіта",
    description:
      "Форум про цифрову освіту, UX-підходи в навчанні та молодіжні технологічні ініціативи."
  },
  {
    id: 2,
    title: "Волонтерський ярмарок можливостей",
    type: "volunteer",
    city: "Київ",
    date: "18 червня",
    day: 18,
    free: true,
    image: "volunteer",
    tag: "Волонтерство",
    description:
      "Зустріч громадських організацій і молоді, яка хоче долучитися до соціальних проєктів."
  },
  {
    id: 3,
    title: "Кінопоказ просто неба",
    type: "culture",
    city: "Одеса",
    date: "20 червня",
    day: 20,
    free: false,
    image: "culture",
    tag: "Культура",
    description:
      "Культурний вечір з обговоренням фільму, нетворкінгом і музичною програмою."
  },
  {
    id: 4,
    title: "Медіа воркшоп для студентів",
    type: "online",
    city: "Онлайн",
    date: "22 червня",
    day: 22,
    free: true,
    image: "online",
    tag: "Онлайн",
    description:
      "Практичний онлайн-воркшоп про створення візуального контенту та просування подій."
  }
];

const state = {
  currentEvent: events[0],
  favorites: new Set([1]),
  registered: new Set(),
  category: "all"
};

const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll("[data-view]");
const homeEvents = document.querySelector("#homeEvents");
const catalogEvents = document.querySelector("#catalogEvents");
const favoriteEvents = document.querySelector("#favoriteEvents");
const emptyFavorites = document.querySelector("#emptyFavorites");
const calendarGrid = document.querySelector("#calendarGrid");
const registeredList = document.querySelector("#registeredList");
const profileEvents = document.querySelector("#profileEvents");
const modal = document.querySelector("#modalBackdrop");
const authStep = document.querySelector("#authStep");
const registerForm = document.querySelector("#registerForm");
const toast = document.querySelector("#toast");

function setView(id) {
  views.forEach((view) => view.classList.toggle("active", view.id === id));
  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === id);
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  render();
}

function eventCard(event) {
  const favorite = state.favorites.has(event.id);
  return `
    <article class="event-card">
      <div class="event-photo ${event.image}"></div>
      <div class="event-body">
        <p class="event-meta">${event.date} · ${event.city}</p>
        <h3>${event.title}</h3>
        <div class="tag-row">
          <span class="tag ${event.type === "culture" ? "orange" : event.type === "volunteer" ? "green" : ""}">${event.tag}</span>
          <span class="tag">${event.free ? "Безкоштовно" : "Платно"}</span>
        </div>
        <div class="card-actions">
          <button class="primary-button compact" data-open-event="${event.id}">Деталі</button>
          <button class="icon-button ${favorite ? "active" : ""}" data-favorite="${event.id}" aria-label="Обране">♡</button>
        </div>
      </div>
    </article>
  `;
}

function eventRow(event) {
  const favorite = state.favorites.has(event.id);
  return `
    <article class="event-row">
      <div class="event-photo ${event.image}"></div>
      <div>
        <p class="event-meta">${event.date} · ${event.city}</p>
        <h3>${event.title}</h3>
        <p>${event.description}</p>
      </div>
      <div class="card-actions">
        <button class="primary-button compact" data-open-event="${event.id}">Деталі</button>
        <button class="icon-button ${favorite ? "active" : ""}" data-favorite="${event.id}">♡</button>
      </div>
    </article>
  `;
}

function filteredEvents() {
  const query = (document.querySelector("#catalogSearch")?.value || "").toLowerCase();
  const city = document.querySelector("#cityFilter")?.value || "all";
  const freeOnly = document.querySelector("#freeOnly")?.checked || false;

  return events.filter((event) => {
    const byCategory = state.category === "all" || event.type === state.category;
    const byQuery = !query || `${event.title} ${event.description} ${event.tag}`.toLowerCase().includes(query);
    const byCity = city === "all" || event.city === city;
    const byFree = !freeOnly || event.free;
    return byCategory && byQuery && byCity && byFree;
  });
}

function renderHome() {
  const visible = events.filter((event) => state.category === "all" || event.type === state.category);
  homeEvents.innerHTML = visible.map(eventCard).join("");
}

function renderCatalog() {
  const visible = filteredEvents();
  catalogEvents.innerHTML = visible.map(eventRow).join("");
  document.querySelector("#resultCount").textContent = `${visible.length} події`;
}

function renderDetail() {
  const event = state.currentEvent;
  document.querySelector("#detailVisual").className = `detail-visual ${event.image}`;
  document.querySelector("#detailType").textContent = event.tag;
  document.querySelector("#detailTitle").textContent = event.title;
  document.querySelector("#detailMeta").textContent = `${event.date} · ${event.city} · ${event.free ? "безкоштовно" : "платно"}`;
  document.querySelector("#detailDescription").textContent = event.description;
  document.querySelector("#detailFavoriteButton").textContent = state.favorites.has(event.id)
    ? "В обраному"
    : "Додати в обране";
}

function renderFavorites() {
  const visible = events.filter((event) => state.favorites.has(event.id));
  favoriteEvents.innerHTML = visible.map(eventRow).join("");
  emptyFavorites.classList.toggle("hidden", visible.length > 0);
}

function renderCalendar() {
  const registered = events.filter((event) => state.registered.has(event.id));
  calendarGrid.innerHTML = Array.from({ length: 28 }, (_, index) => {
    const day = index + 1;
    const event = registered.find((item) => item.day === day);
    return `<div class="day ${event ? "registered" : ""}">
      <span>${day}</span>
      ${event ? `<small>${event.title}</small>` : ""}
    </div>`;
  }).join("");
  registeredList.innerHTML = registered.length
    ? registered.map((event) => `<article class="event-row"><div class="event-photo ${event.image}"></div><div><h3>${event.title}</h3><p>${event.date} · ${event.city}</p></div></article>`).join("")
    : `<p class="empty-state">Після реєстрації подія з'явиться тут.</p>`;
}

function renderProfile() {
  const registered = events.filter((event) => state.registered.has(event.id));
  profileEvents.innerHTML = registered.length
    ? registered.map((event) => `<article class="event-row"><div class="event-photo ${event.image}"></div><div><p class="event-meta">Квиток EH-${event.id}524</p><h3>${event.title}</h3><p>${event.date} · підтверджено</p></div><button class="ghost-button">Квиток</button></article>`).join("")
    : `<p class="empty-state">Зареєструйся на подію, щоб побачити квиток.</p>`;
}

function render() {
  renderHome();
  renderCatalog();
  renderDetail();
  renderFavorites();
  renderCalendar();
  renderProfile();
}

function openEvent(id) {
  state.currentEvent = events.find((event) => event.id === Number(id)) || events[0];
  setView("detail");
}

function toggleFavorite(id) {
  const numeric = Number(id);
  if (state.favorites.has(numeric)) {
    state.favorites.delete(numeric);
    showToast("Подію видалено з обраного.");
  } else {
    state.favorites.add(numeric);
    showToast("Подію додано в обране.");
  }
  render();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add("hidden"), 2600);
}

function openModal() {
  authStep.classList.remove("hidden");
  registerForm.classList.add("hidden");
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

function validateForm() {
  let valid = true;
  const nameField = registerForm.elements.name;
  const emailField = registerForm.elements.email;
  const terms = registerForm.elements.terms;

  [nameField, emailField].forEach((field) => field.closest("label").classList.remove("invalid"));
  document.querySelector(".terms-error").classList.remove("visible");

  if (!nameField.value.trim()) {
    nameField.closest("label").classList.add("invalid");
    valid = false;
  }
  if (!/^\S+@\S+\.\S+$/.test(emailField.value.trim())) {
    emailField.closest("label").classList.add("invalid");
    valid = false;
  }
  if (!terms.checked) {
    document.querySelector(".terms-error").classList.add("visible");
    valid = false;
  }
  return valid;
}

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) setView(viewButton.dataset.view);

  const eventButton = event.target.closest("[data-open-event]");
  if (eventButton) openEvent(eventButton.dataset.openEvent);

  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) toggleFavorite(favoriteButton.dataset.favorite);
});

document.querySelector("#loginButton").addEventListener("click", openModal);
document.querySelector("#registerButton").addEventListener("click", openModal);
document.querySelector("#closeModal").addEventListener("click", closeModal);
document.querySelector("#modalBackdrop").addEventListener("click", (event) => {
  if (event.target.id === "modalBackdrop") closeModal();
});

document.querySelector("#continueAuth").addEventListener("click", () => {
  authStep.classList.add("hidden");
  registerForm.classList.remove("hidden");
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateForm()) {
    showToast("Перевір форму: є помилки.");
    return;
  }
  state.registered.add(state.currentEvent.id);
  state.favorites.add(state.currentEvent.id);
  closeModal();
  showToast("Реєстрацію підтверджено. Подію додано в календар.");
  setView("calendar");
});

document.querySelector("#detailFavoriteButton").addEventListener("click", () => {
  toggleFavorite(state.currentEvent.id);
});

document.querySelector("#homeSearchButton").addEventListener("click", () => {
  document.querySelector("#catalogSearch").value = document.querySelector("#homeSearch").value;
  setView("catalog");
});

document.querySelector("#applyFilters").addEventListener("click", render);
document.querySelector("#clearFilters").addEventListener("click", () => {
  document.querySelector("#catalogSearch").value = "";
  document.querySelector("#cityFilter").value = "all";
  document.querySelector("#freeOnly").checked = false;
  state.category = "all";
  document.querySelectorAll(".category-chip").forEach((chip) => chip.classList.toggle("active", chip.dataset.category === "all"));
  render();
});

document.querySelectorAll(".category-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    state.category = chip.dataset.category;
    document.querySelectorAll(".category-chip").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    render();
  });
});

render();
