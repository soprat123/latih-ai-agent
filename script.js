(function () {
  // ===== State =====
  let cart = [];
  let activeCategory = "semua";
  let searchQuery = "";
  let currentProductId = null;

  // ===== DOM Elements =====
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const categoryList = document.getElementById("categoryList");
  const categoryChips = categoryList
    ? Array.from(categoryList.querySelectorAll(".category-chip"))
    : [];
  const productCards = Array.from(document.querySelectorAll(".product-card"));
  const emptyState = document.getElementById("emptyState");

  // Cart elements
  const cartToggle = document.getElementById("cartToggle");
  const cartBadge = document.getElementById("cartBadge");
  const cartDrawer = document.getElementById("cartDrawer");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartClose = document.getElementById("cartClose");
  const cartContent = document.getElementById("cartContent");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartItemsList = document.getElementById("cartItems");
  const cartFooter = document.getElementById("cartFooter");
  const cartTotalItemsEl = document.getElementById("cartTotalItems");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const cartTotalEl = document.getElementById("cartTotal");
  const checkoutButton = document.getElementById("checkoutButton");

  // Product Detail Modal
  const productModal = document.getElementById("productModal");
  const productModalOverlay = document.getElementById("productModalOverlay");
  const productModalClose = document.getElementById("productModalClose");
  const modalProductImage = document.getElementById("modalProductImage");
  const modalProductCategory = document.getElementById("modalProductCategory");
  const modalProductName = document.getElementById("modalProductName");
  const modalProductPrice = document.getElementById("modalProductPrice");
  const modalProductDescription = document.getElementById("modalProductDescription");
  const modalAddToCart = document.getElementById("modalAddToCart");

  // Checkout Modal
  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutModalOverlay = document.getElementById("checkoutModalOverlay");
  const checkoutModalClose = document.getElementById("checkoutModalClose");
  const checkoutTotalItemsEl = document.getElementById("checkoutTotalItems");
  const checkoutSubtotalEl = document.getElementById("checkoutSubtotal");
  const checkoutTotalEl = document.getElementById("checkoutTotal");
  const checkoutForm = document.getElementById("checkoutForm");
  const buyerNameInput = document.getElementById("buyerName");
  const buyerPhoneInput = document.getElementById("buyerPhone");
  const buyerAddressInput = document.getElementById("buyerAddress");
  const buyerNoteInput = document.getElementById("buyerNote");
  const submitOrderButton = document.getElementById("submitOrder");

  // Success Modal
  const successModal = document.getElementById("successModal");
  const successModalOverlay = document.getElementById("successModalOverlay");
  const successClose = document.getElementById("successClose");
  const orderNumberEl = document.getElementById("orderNumber");
  const successTotalEl = document.getElementById("successTotal");

  // ===== Utility Functions =====
  function normalizeText(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  function formatRupiah(amount) {
    return "Rp" + amount.toLocaleString("id-ID");
  }

  function generateOrderNumber() {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, "");
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return "LS-" + dateStr + "-" + timeStr + "-" + random;
  }

  function showToast(message, type = "success") {
    let toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = "toast " + type;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
  }

  function getProductData(id) {
    const card = document.querySelector('.product-card[data-id="' + id + '"]');
    if (!card) return null;
    return {
      id: card.dataset.id,
      name: card.dataset.name,
      category: card.dataset.category,
      description: card.dataset.description,
      price: parseInt(card.dataset.price, 10),
      image: card.querySelector(".product-image").textContent.trim(),
    };
  }

  // ===== Cart Functions =====
  function loadCart() {
    try {
      const stored = localStorage.getItem("lutfulStoreCart");
      if (stored) {
        cart = JSON.parse(stored);
      }
    } catch (e) {
      cart = [];
    }
    updateCartUI();
  }

  function saveCart() {
    localStorage.setItem("lutfulStoreCart", JSON.stringify(cart));
  }

  function addToCart(productId) {
    const product = getProductData(productId);
    if (!product) return;

    const existingIndex = cart.findIndex((item) => item.id === productId);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }
    saveCart();
    updateCartUI();
    showToast(product.name + " ditambahkan ke keranjang");
  }

  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    saveCart();
    updateCartUI();
  }

  function updateQuantity(productId, delta) {
    const item = cart.find((item) => item.id === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      saveCart();
      updateCartUI();
    }
  }

  function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
  }

  function getCartTotalItems() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getCartSubtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function updateCartUI() {
    const totalItems = getCartTotalItems();
    const subtotal = getCartSubtotal();

    // Badge
    cartBadge.textContent = totalItems;
    cartBadge.classList.toggle("visible", totalItems > 0);

    // Cart items
    if (cart.length === 0) {
      cartEmpty.hidden = false;
      cartItemsList.hidden = true;
      cartFooter.hidden = true;
    } else {
      cartEmpty.hidden = true;
      cartItemsList.hidden = false;
      cartFooter.hidden = false;

      cartItemsList.innerHTML = cart
        .map(
          (item) => `
        <li class="cart-item" data-id="${item.id}">
          <div class="cart-item-image" aria-hidden="true">${item.image}</div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatRupiah(item.price)}</div>
          <div class="cart-item-controls">
            <button class="quantity-btn minus" type="button" aria-label="Kurangi quantity">−</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn plus" type="button" aria-label="Tambah quantity">+</button>
          </div>
          <div class="cart-item-subtotal">${formatRupiah(item.price * item.quantity)}</div>
          <button class="cart-item-remove" type="button" aria-label="Hapus ${item.name}">Hapus</button>
        </li>
      `
        )
        .join("");

      // Bind quantity buttons
      cartItemsList.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
        btn.addEventListener("click", function () {
          const id = this.closest(".cart-item").dataset.id;
          updateQuantity(id, -1);
        });
      });
      cartItemsList.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
        btn.addEventListener("click", function () {
          const id = this.closest(".cart-item").dataset.id;
          updateQuantity(id, 1);
        });
      });
      cartItemsList.querySelectorAll(".cart-item-remove").forEach((btn) => {
        btn.addEventListener("click", function () {
          const id = this.closest(".cart-item").dataset.id;
          removeFromCart(id);
        });
      });
    }

    // Summary
    cartTotalItemsEl.textContent = totalItems;
    cartSubtotalEl.textContent = formatRupiah(subtotal);
    cartTotalEl.textContent = formatRupiah(subtotal);
  }

  // ===== Cart Drawer =====
  function openCartDrawer() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  function closeCartDrawer() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("visible");
    document.body.style.overflow = "";
  }

  // ===== Product Detail Modal =====
  function openProductModal(productId) {
    const product = getProductData(productId);
    if (!product) return;

    currentProductId = productId;
    modalProductImage.textContent = product.image;
    modalProductCategory.textContent = product.category.charAt(0).toUpperCase() + product.category.slice(1);
    modalProductName.textContent = product.name;
    modalProductPrice.textContent = formatRupiah(product.price);
    modalProductDescription.textContent = product.description;

    productModal.hidden = false;
    requestAnimationFrame(() => productModal.classList.add("open"));
    document.body.style.overflow = "hidden";
  }

  function closeProductModal() {
    productModal.classList.remove("open");
    setTimeout(() => {
      productModal.hidden = true;
      currentProductId = null;
      document.body.style.overflow = "";
    }, 300);
  }

  // ===== Checkout Modal =====
  function openCheckoutModal() {
    if (cart.length === 0) {
      showToast("Keranjang kosong", "error");
      return;
    }
    closeCartDrawer();

    const totalItems = getCartTotalItems();
    const subtotal = getCartSubtotal();

    checkoutTotalItemsEl.textContent = totalItems;
    checkoutSubtotalEl.textContent = formatRupiah(subtotal);
    checkoutTotalEl.textContent = formatRupiah(subtotal);

    checkoutForm.reset();
    clearFormErrors();

    checkoutModal.hidden = false;
    requestAnimationFrame(() => checkoutModal.classList.add("open"));
    document.body.style.overflow = "hidden";
  }

  function closeCheckoutModal() {
    checkoutModal.classList.remove("open");
    setTimeout(() => {
      checkoutModal.hidden = true;
      document.body.style.overflow = "";
    }, 300);
  }

  function clearFormErrors() {
    checkoutForm.querySelectorAll(".error").forEach((el) => el.classList.remove("error"));
  }

  function validateForm() {
    clearFormErrors();
    let isValid = true;

    if (!buyerNameInput.value.trim()) {
      buyerNameInput.classList.add("error");
      isValid = false;
    }
    if (!buyerPhoneInput.value.trim()) {
      buyerPhoneInput.classList.add("error");
      isValid = false;
    }
    if (!buyerAddressInput.value.trim()) {
      buyerAddressInput.classList.add("error");
      isValid = false;
    }
    return isValid;
  }

  // ===== Success Modal =====
  function openSuccessModal(orderNumber, total) {
    closeCheckoutModal();
    orderNumberEl.textContent = orderNumber;
    successTotalEl.textContent = formatRupiah(total);

    successModal.hidden = false;
    requestAnimationFrame(() => successModal.classList.add("open"));
    document.body.style.overflow = "hidden";
  }

  function closeSuccessModal() {
    successModal.classList.remove("open");
    setTimeout(() => {
      successModal.hidden = true;
      document.body.style.overflow = "";
    }, 300);
  }

  // ===== Search & Filter =====
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

      const matchesCategory = activeCategory === "semua" || productCategory === activeCategory;
      const matchesSearch = searchQuery === "" || productName.includes(searchQuery);

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

  // ===== Event Listeners =====
  // Search
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

  // Category chips
  categoryChips.forEach(function (chip) {
    chip.setAttribute("aria-pressed", chip.classList.contains("active") ? "true" : "false");
    chip.addEventListener("click", function () {
      setActiveCategory(chip.dataset.category || "semua");
    });
  });

  // Product cards - click for detail, button for add to cart
  productCards.forEach((card) => {
    const addButton = card.querySelector(".add-to-cart-button");
    const productId = card.dataset.id;

    // Click on card (not button) opens detail modal
    card.addEventListener("click", function (e) {
      if (e.target === addButton || e.target.closest(".add-to-cart-button")) return;
      openProductModal(productId);
    });

    // Add to cart button
    if (addButton) {
      addButton.addEventListener("click", function (e) {
        e.stopPropagation();
        addToCart(productId);
      });
    }
  });

  // Modal add to cart button
  modalAddToCart.addEventListener("click", function () {
    if (currentProductId) {
      addToCart(currentProductId);
      closeProductModal();
    }
  });

  // Cart drawer
  cartToggle.addEventListener("click", openCartDrawer);
  cartClose.addEventListener("click", closeCartDrawer);
  cartOverlay.addEventListener("click", closeCartDrawer);

  // Product modal
  productModalClose.addEventListener("click", closeProductModal);
  productModalOverlay.addEventListener("click", closeProductModal);

  // Checkout modal
  checkoutButton.addEventListener("click", openCheckoutModal);
  checkoutModalClose.addEventListener("click", closeCheckoutModal);
  checkoutModalOverlay.addEventListener("click", closeCheckoutModal);

  // Checkout form submit
  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Mohon lengkapi semua field yang wajib diisi", "error");
      return;
    }

    const orderNumber = generateOrderNumber();
    const total = getCartSubtotal();

    // Simulate order creation
    showToast("Pesanan sedang diproses...", "success");
    setTimeout(() => {
      clearCart();
      openSuccessModal(orderNumber, total);
    }, 800);
  });

  // Success modal
  successClose.addEventListener("click", closeSuccessModal);
  successModalOverlay.addEventListener("click", closeSuccessModal);

  // Keyboard accessibility
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (cartDrawer.classList.contains("open")) closeCartDrawer();
      if (productModal.classList.contains("open")) closeProductModal();
      if (checkoutModal.classList.contains("open")) closeCheckoutModal();
      if (successModal.classList.contains("open")) closeSuccessModal();
    }
  });

  // Initialize
  loadCart();
  applyFilters();
})();