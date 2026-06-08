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

const galleryItems = [
  {
    title: "Головний екран EventHub",
    kicker: "Слайд 1 · Hero",
    image: "education",
    description:
      "Перший екран пояснює ідею продукту, показує пошук подій і формує швидкий шлях до каталогу."
  },
  {
    title: "Каталог і фільтри",
    kicker: "Слайд 2 · Навігація",
    image: "volunteer",
    description:
      "Картки, фільтри та active-стани допомагають користувачу знайти освітню, культурну або волонтерську подію."
  },
  {
    title: "Реєстрація на подію",
    kicker: "Слайд 3 · User flow",
    image: "online",
    description:
      "Форма має послідовні кроки, стани помилок і підтвердження, щоб користувач розумів результат дії."
  },
  {
    title: "Календар участі",
    kicker: "Слайд 4 · Мікровзаємодії",
    image: "culture",
    description:
      "Після реєстрації подія з’являється в календарі, а інтерфейс показує завершення користувацького сценарію."
  },
  {
    title: "Світла і темна теми",
    kicker: "Слайд 5 · Design system",
    image: "education",
    description:
      "CSS-змінні дозволяють перемикати тему без зміни структури сторінки та зберігати єдину дизайн-систему."
  },
  {
    title: "Планшетна адаптація",
    kicker: "Слайд 6 · Responsive UI",
    image: "volunteer",
    description:
      "Сітка перебудовується для планшетів: карточки стають у дві колонки, а навігація зберігає зручні touch-зони."
  }
];

const requestedTheme = new URLSearchParams(window.location.search).get("theme");

const state = {
  currentEvent: events[0],
  favorites: new Set([1]),
  registered: new Set(),
  category: "all",
  galleryIndex: 0,
  galleryAutoplay: true,
  galleryHover: false,
  theme: requestedTheme === "dark" || requestedTheme === "light"
    ? requestedTheme
    : localStorage.getItem("eventhub-theme") || "light"
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
const themeToggle = document.querySelector("#themeToggle");
const themeLabel = document.querySelector("#themeLabel");
const galleryTrack = document.querySelector("#galleryTrack");
const galleryKicker = document.querySelector("#galleryKicker");
const galleryTitle = document.querySelector("#galleryTitle");
const galleryDescription = document.querySelector("#galleryDescription");
const galleryDots = document.querySelector("#galleryDots");
const galleryProgress = document.querySelector("#galleryProgress");
const galleryAutoplayButton = document.querySelector("#galleryAutoplay");
const galleryStage = document.querySelector(".gallery-stage");

function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  themeLabel.textContent = state.theme === "dark" ? "Темна" : "Світла";
  themeToggle.setAttribute(
    "aria-label",
    state.theme === "dark" ? "Перемкнути на світлу тему" : "Перемкнути на темну тему"
  );
  localStorage.setItem("eventhub-theme", state.theme);
}

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

function renderGallery() {
  if (!galleryTrack) return;
  if (!galleryTrack.dataset.ready) {
    galleryTrack.innerHTML = galleryItems.map((item) => `
      <article class="gallery-slide">
        <div class="gallery-art ${item.image}"></div>
        <div class="gallery-slide-content">
          <p class="eyebrow">${item.kicker}</p>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      </article>
    `).join("");
    galleryTrack.dataset.ready = "true";
  }

  const current = galleryItems[state.galleryIndex];
  galleryTrack.style.transform = `translateX(-${state.galleryIndex * 100}%)`;
  galleryKicker.textContent = current.kicker;
  galleryTitle.textContent = current.title;
  galleryDescription.textContent = current.description;
  galleryProgress.style.width = `${((state.galleryIndex + 1) / galleryItems.length) * 100}%`;
  galleryAutoplayButton.textContent = state.galleryAutoplay ? "Пауза autoplay" : "Увімкнути autoplay";
  galleryDots.innerHTML = galleryItems.map((item, index) => `
    <button
      class="gallery-dot ${index === state.galleryIndex ? "active" : ""}"
      data-gallery-dot="${index}"
      aria-label="Відкрити ${item.kicker}">
    </button>
  `).join("");
}

function render() {
  renderHome();
  renderCatalog();
  renderDetail();
  renderFavorites();
  renderCalendar();
  renderProfile();
  renderGallery();
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

function setGalleryIndex(index) {
  state.galleryIndex = (index + galleryItems.length) % galleryItems.length;
  renderGallery();
}

function moveGallery(direction) {
  setGalleryIndex(state.galleryIndex + direction);
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

  const galleryDot = event.target.closest("[data-gallery-dot]");
  if (galleryDot) setGalleryIndex(Number(galleryDot.dataset.galleryDot));
});

document.querySelector("#loginButton").addEventListener("click", openModal);
themeToggle.addEventListener("click", () => {
  state.theme = state.theme === "dark" ? "light" : "dark";
  applyTheme();
  showToast(state.theme === "dark" ? "Увімкнено темну тему." : "Увімкнено світлу тему.");
});
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

document.querySelector("#galleryPrev").addEventListener("click", () => moveGallery(-1));
document.querySelector("#galleryNext").addEventListener("click", () => moveGallery(1));
galleryAutoplayButton.addEventListener("click", () => {
  state.galleryAutoplay = !state.galleryAutoplay;
  renderGallery();
  showToast(state.galleryAutoplay ? "Autoplay галереї увімкнено." : "Autoplay галереї зупинено.");
});
galleryStage.addEventListener("mouseenter", () => {
  state.galleryHover = true;
});
galleryStage.addEventListener("mouseleave", () => {
  state.galleryHover = false;
});

document.addEventListener("keydown", (event) => {
  if (!document.querySelector("#gallery").classList.contains("active")) return;
  if (event.key === "ArrowLeft") moveGallery(-1);
  if (event.key === "ArrowRight") moveGallery(1);
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

applyTheme();
render();

setInterval(() => {
  if (state.galleryAutoplay && !state.galleryHover) moveGallery(1);
}, 4200);
