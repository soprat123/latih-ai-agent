(function () {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const categoryList = document.getElementById("categoryList");
  const categoryChips = categoryList
    ? Array.from(categoryList.querySelectorAll(".category-chip"))
    : [];
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  const emptyState = document.getElementById("emptyState");

  let activeCategory = "semua";
  let searchQuery = "";

  function normalizeText(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function getProductName(card) {
    if (card.dataset.name) {
      return normalizeText(card.dataset.name);
    }

    const nameElement = card.querySelector(".product-name");
    return normalizeText(nameElement ? nameElement.textContent : "");
  }

  function getProductCategory(card) {
    if (card.dataset.category) {
      return normalizeText(card.dataset.category);
    }

    const categoryElement = card.querySelector(".product-category");
    return normalizeText(categoryElement ? categoryElement.textContent : "");
  }

  function applyFilters() {
    let visibleCount = 0;

    productCards.forEach(function (card) {
      const productName = getProductName(card);
      const productCategory = getProductCategory(card);

      const matchesCategory =
        activeCategory === "semua" || productCategory === activeCategory;
      const matchesSearch =
        searchQuery === "" || productName.includes(searchQuery);

      const isVisible = matchesCategory && matchesSearch;
      card.hidden = !isVisible;
      card.classList.toggle("is-hidden", !isVisible);

      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
  }

  function setActiveCategory(category) {
    activeCategory = normalizeText(category) || "semua";

    categoryChips.forEach(function (chip) {
      const chipCategory = normalizeText(chip.dataset.category);
      const isActive = chipCategory === activeCategory;
      chip.classList.toggle("active", isActive);
      chip.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    applyFilters();
  }

  if (searchForm && searchInput) {
    searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      searchQuery = normalizeText(searchInput.value);
      applyFilters();
    });

    searchInput.addEventListener("input", function () {
      searchQuery = normalizeText(searchInput.value);
      applyFilters();
    });
  }

  categoryChips.forEach(function (chip) {
    chip.setAttribute("aria-pressed", chip.classList.contains("active") ? "true" : "false");

    chip.addEventListener("click", function () {
      setActiveCategory(chip.dataset.category || "semua");
    });
  });

  applyFilters();
})();
