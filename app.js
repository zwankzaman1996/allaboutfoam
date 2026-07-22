// Application State
const appState = {
  currentStep: 'Intro', // 'Intro', 1 (Qty), 2 (Cup), 'Customer'
  selectedDrinks: ["coffee", "matcha"], // Fixed menu: Coffee and Matcha
  totalQuantity: 100, // default 100 cups
  drinkAllocations: {
    coffee: 50,
    matcha: 50
  },
  customerDetails: {
    fullName: "",
    phone: "",
    email: "",
    eventDate: "",
    address: ""
  },
  paymentMethod: "fpx"
};

// DOM Content Loaded Handler
document.addEventListener("DOMContentLoaded", () => {
  initAmbientBg();
  initPerks();
  renderQuantityConfigurator();
  renderAllocationRows();
  updateStepVisibility();
  setupEventListeners();
});

/* Ambient background floating bubbles */
function initAmbientBg() {
  const bg = document.getElementById("ambientBg");
  if (!bg) return;
  bg.innerHTML = "";
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement("div");
    particle.className = "foam-particle";
    const size = Math.random() * 40 + 20;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
    bg.appendChild(particle);
  }
}

/* Render Step 1: Perks Callout */
function initPerks() {
  const container = document.getElementById("perksGrid");
  if (!container) return;

  let perks = [
    "Professional Pop-Up Barista Booth",
    "Dedicated Friendly Baristas",
    "Complimentary Artisanal Cold Foam Float"
  ];
  if (appState.totalQuantity >= 200) {
    perks.push("Free Transportation / Delivery");
  }

  container.innerHTML = perks.map(perk => `
    <div class="perk-item">${perk}</div>
  `).join('');
}

/* Step 1: Quantity Selector & Pricing Logic
 * Base price is RM 5.00 if order 100 cups.
 * For every increment of 100 cups above 100, price drops RM 0.20 per cup.
 * Max cups: 500.
 */
function getPricePerCup(totalQuantity = appState.totalQuantity) {
  if (totalQuantity < 200) return 5.00;
  const hundredIncrementsAbove100 = Math.floor((totalQuantity - 100) / 100);
  const discount = hundredIncrementsAbove100 * 0.20;
  return Math.max(4.00, 5.00 - discount);
}

function getTransportationFee() {
  return appState.totalQuantity >= 200 ? 0 : 50;
}

function renderQuantityConfigurator() {
  const qtyDisplay = document.getElementById("totalQtyDisplay");
  const slider = document.getElementById("qtyRangeSlider");
  const priceBadge = document.getElementById("pricePerCupBadge");
  const currentQty = appState.totalQuantity;

  if (qtyDisplay) qtyDisplay.innerText = currentQty.toLocaleString();
  if (slider) slider.value = currentQty;

  const unitPrice = getPricePerCup(currentQty);

  if (priceBadge) {
    if (currentQty < 200) {
      priceBadge.innerHTML = `Tip: Order 200 cups or more to unlock volume discount & FREE delivery!`;
    } else {
      const discountPerCup = (5.00 - unitPrice).toFixed(2);
      const totalSavings = (((5.00 - unitPrice) * currentQty) + 50).toFixed(2);
      priceBadge.innerHTML = `Volume Discount Unlocked: Save RM ${discountPerCup} / cup + FREE Delivery! <span style="color: var(--success); font-weight: 700;">(Total Savings: RM ${totalSavings})</span>`;
    }
  }

  initPerks();
}

function setTotalQuantity(newQty) {
  // Clamp between 50 and 500, step 50
  let qty = Math.max(50, Math.min(500, newQty));
  qty = Math.round(qty / 50) * 50;

  appState.totalQuantity = qty;
  redistributeCupsEqually();
  renderQuantityConfigurator();
  renderAllocationRows();
}

/* Redistribute Cups Equally across Coffee and Matcha */
function redistributeCupsEqually() {
  const half = Math.floor((appState.totalQuantity / 2) / 50) * 50;
  const remainder = appState.totalQuantity - half;
  appState.drinkAllocations = {
    coffee: half,
    matcha: remainder
  };
}

/* Render Step 2: Cup Allocation Rows for Coffee & Matcha */
function renderAllocationRows() {
  const container = document.getElementById("allocationRowsContainer");
  const allocatedStat = document.getElementById("allocatedQtyStat");
  const remainingStat = document.getElementById("remainingQtyStat");
  const progressPercentBar = document.getElementById("allocationPercentageBar");

  if (!container) return;

  // Calculate allocated total sum
  let currentAllocatedSum = 0;
  appState.selectedDrinks.forEach(drinkId => {
    currentAllocatedSum += (appState.drinkAllocations[drinkId] || 0);
  });

  const remaining = appState.totalQuantity - currentAllocatedSum;

  if (allocatedStat) allocatedStat.innerText = currentAllocatedSum;
  if (remainingStat) {
    remainingStat.innerText = remaining;
    if (remaining === 0) {
      remainingStat.className = "valid";
    } else {
      remainingStat.className = "invalid";
    }
  }

  // Update Review button state based on remaining validation
  const btnReview = document.getElementById("btnReviewOrder");
  if (btnReview) {
    if (remaining === 0) {
      btnReview.disabled = false;
      btnReview.innerText = "Review & Confirm Order";
    } else {
      btnReview.disabled = true;
      btnReview.innerText = remaining > 0 ? `Assign ${remaining} more cups to proceed` : `Overallocated by ${Math.abs(remaining)} cups`;
    }
  }

  // Render Allocation Rows for Coffee and Matcha
  container.innerHTML = appState.selectedDrinks.map(drinkId => {
    const drink = DRINKS_DATA.find(d => d.id === drinkId);
    const assignedCups = appState.drinkAllocations[drinkId] || 0;

    return `
      <div class="allocation-row">
        <div class="row-drink-info">
          <div class="row-drink-swatch" style="background: ${drink ? drink.liquidColor : '#6F4E37'}"></div>
          <div class="row-drink-details">
            <h4>${drink ? drink.name : drinkId}</h4>
            <p>topped with <strong>Complimentary Artisanal Cold Foam</strong></p>
          </div>
        </div>

        <div class="allocation-controls">
          <button class="stepper-control-btn btn-minus" data-drink-id="${drinkId}" ${assignedCups <= 0 ? 'disabled' : ''}>-</button>
          
          <div class="cup-value-display">
            <strong>${assignedCups}</strong>
            <span>cups</span>
          </div>
          
          <button class="stepper-control-btn btn-plus" data-drink-id="${drinkId}">+</button>
        </div>
      </div>
    `;
  }).join('');

  // Render Percentage Color Bar
  if (progressPercentBar) {
    progressPercentBar.innerHTML = appState.selectedDrinks.map(drinkId => {
      const drink = DRINKS_DATA.find(d => d.id === drinkId);
      const cups = appState.drinkAllocations[drinkId] || 0;
      const pct = (cups / appState.totalQuantity) * 100;
      return `<div class="percentage-segment" style="width: ${pct}%; background: ${drink ? drink.accentColor : '#D2691E'}" title="${drink ? drink.name : drinkId}: ${cups} cups (${pct.toFixed(0)}%)"></div>`;
    }).join('');
  }

  // Stepper button handlers (+50 / -50)
  container.querySelectorAll('.btn-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      const drinkId = btn.getAttribute('data-drink-id');
      const current = appState.drinkAllocations[drinkId] || 0;
      if (current >= 50) {
        appState.drinkAllocations[drinkId] = current - 50;
        renderAllocationRows();
      }
    });
  });

  container.querySelectorAll('.btn-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      const drinkId = btn.getAttribute('data-drink-id');
      const current = appState.drinkAllocations[drinkId] || 0;
      appState.drinkAllocations[drinkId] = current + 50;
      renderAllocationRows();
    });
  });
}

/* Update Stepper Navbar & Active Section Visibility */
function updateStepVisibility() {
  document.querySelectorAll('.step-section').forEach(sec => sec.classList.remove('active'));

  const stepperNav = document.getElementById('stepperNav');

  if (appState.currentStep === 'Intro') {
    document.getElementById('stepSectionIntro')?.classList.add('active');
    if (stepperNav) stepperNav.style.display = 'none';
  } else if (appState.currentStep === 1) {
    document.getElementById('stepSectionQty')?.classList.add('active');
    if (stepperNav) stepperNav.style.display = 'flex';
    document.getElementById('navStep1')?.setAttribute('class', 'step-item active');
    document.getElementById('navStep2')?.setAttribute('class', 'step-item');
  } else if (appState.currentStep === 2) {
    document.getElementById('stepSectionCup')?.classList.add('active');
    if (stepperNav) stepperNav.style.display = 'flex';
    document.getElementById('navStep1')?.setAttribute('class', 'step-item completed');
    document.getElementById('navStep2')?.setAttribute('class', 'step-item active');
  } else if (appState.currentStep === 'Customer') {
    document.getElementById('stepSectionCustomer')?.classList.add('active');
    if (stepperNav) stepperNav.style.display = 'none';
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Pricing Calculations */
function calculateOrderSubtotal() {
  const rate = getPricePerCup(appState.totalQuantity);
  return appState.totalQuantity * rate;
}

function calculateOrderTotal() {
  return calculateOrderSubtotal() + getTransportationFee();
}

/* Render Confirmation Summary Modal */
function openSummaryModal() {
  const modal = document.getElementById("orderSummaryModal");
  const summaryList = document.getElementById("summaryModalList");
  const totalCupsEl = document.getElementById("summaryModalTotalCups");
  const deliveryFeeEl = document.getElementById("summaryModalDeliveryFee");
  const finalTotalEl = document.getElementById("summaryModalFinalTotal");

  if (!modal || !summaryList) return;

  const rate = getPricePerCup(appState.totalQuantity);

  summaryList.innerHTML = appState.selectedDrinks.map(drinkId => {
    const drink = DRINKS_DATA.find(d => d.id === drinkId);
    const cups = appState.drinkAllocations[drinkId] || 0;
    const lineTotal = cups * rate;

    return `
      <div class="summary-item-card">
        <div class="summary-item-info">
          <h4>${drink ? drink.name : drinkId}</h4>
          <p>Topped with Complimentary Artisanal Cold Foam</p>
        </div>
        <div class="summary-item-qty" style="text-align: right;">
          <div>${cups} Cups</div>
          <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">@ RM ${rate.toFixed(2)}/cup (RM ${lineTotal.toFixed(2)})</div>
        </div>
      </div>
    `;
  }).join('');

  const fee = getTransportationFee();
  const total = calculateOrderTotal();

  if (totalCupsEl) totalCupsEl.innerText = `${appState.totalQuantity} Cups`;

  if (deliveryFeeEl) {
    if (fee === 0) {
      deliveryFeeEl.innerText = "FREE (Unlocked for >=200 cups)";
      deliveryFeeEl.style.color = "var(--success)";
    } else {
      deliveryFeeEl.innerText = `RM ${fee.toFixed(2)}`;
      deliveryFeeEl.style.color = "var(--text-primary)";
    }
  }

  if (finalTotalEl) finalTotalEl.innerText = `RM ${total.toFixed(2)}`;

  modal.classList.add("active");
}

function closeSummaryModal() {
  const modal = document.getElementById("orderSummaryModal");
  if (modal) modal.classList.remove("active");
}

/* Setup All Event Listeners */
function setupEventListeners() {
  // Intro Button
  document.getElementById("btnReadyToOrder")?.addEventListener("click", () => {
    appState.currentStep = 1;
    updateStepVisibility();
  });

  // Step 1: Quantity Navigation
  document.getElementById("btnBackToIntro")?.addEventListener("click", () => {
    appState.currentStep = 'Intro';
    updateStepVisibility();
  });

  document.getElementById("btnGoToStepCup")?.addEventListener("click", () => {
    appState.currentStep = 2;
    renderAllocationRows();
    updateStepVisibility();
  });

  // Step 2: Distribution Navigation
  document.getElementById("btnBackToQty")?.addEventListener("click", () => {
    appState.currentStep = 1;
    updateStepVisibility();
  });

  // Range Slider listener
  document.getElementById("qtyRangeSlider")?.addEventListener("input", (e) => {
    const qty = parseInt(e.target.value);
    setTotalQuantity(qty);
  });

  // Split Equally Button
  document.getElementById("btnSplitEqually")?.addEventListener("click", () => {
    redistributeCupsEqually();
    renderAllocationRows();
  });

  // Review Order -> Summary Modal
  document.getElementById("btnReviewOrder")?.addEventListener("click", () => {
    openSummaryModal();
  });

  document.getElementById("btnCloseSummaryModal")?.addEventListener("click", () => {
    closeSummaryModal();
  });

  // Button 1: "Change My Mind" -> Return to quantity step
  document.getElementById("btnChangeMyMind")?.addEventListener("click", () => {
    closeSummaryModal();
    appState.currentStep = 1;
    updateStepVisibility();
  });

  // Button 2: "Place My Order" -> Proceed to Customer form
  document.getElementById("btnPlaceMyOrder")?.addEventListener("click", () => {
    closeSummaryModal();
    appState.currentStep = 'Customer';
    updateStepVisibility();

    const payTotal = document.getElementById("payTotalAmount");
    if (payTotal) payTotal.innerText = `RM ${calculateOrderTotal().toFixed(2)}`;
  });

  document.getElementById("btnBackToSummary")?.addEventListener("click", () => {
    appState.currentStep = 2;
    updateStepVisibility();
    openSummaryModal();
  });

  // Customer Form Submit & Payment Simulator
  document.getElementById("customerDetailsForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    appState.customerDetails = {
      fullName: document.getElementById("inputFullName")?.value || "Valued Customer",
      phone: document.getElementById("inputPhone")?.value || "+60 12-345 6789",
      email: document.getElementById("inputEmail")?.value || "customer@example.com",
      eventDate: document.getElementById("inputEventDate")?.value || "2026-07-25 14:00",
      address: document.getElementById("inputAddress")?.value || "Event Location Address"
    };

    const submitBtn = document.getElementById("btnSubmitPayment");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = `Processing Payment Authorization...`;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = `Complete Payment`;
      }
      openReceiptModal();
    }, 1500);
  });

  // New Order Button on Receipt Modal
  document.getElementById("btnNewOrder")?.addEventListener("click", () => {
    const receiptModal = document.getElementById("receiptModal");
    if (receiptModal) receiptModal.classList.remove("active");

    appState.currentStep = 'Intro';
    appState.totalQuantity = 100;
    redistributeCupsEqually();

    renderQuantityConfigurator();
    renderAllocationRows();
    updateStepVisibility();
  });
}

/* Open Final Receipt Modal */
function openReceiptModal() {
  const modal = document.getElementById("receiptModal");
  if (!modal) return;

  const orderRef = `#AAF-${Math.floor(100000 + Math.random() * 900000)}`;
  const nowStr = new Date().toLocaleString();

  document.getElementById("receiptSentEmail").innerText = appState.customerDetails.email;
  document.getElementById("receiptOrderRef").innerText = `ORDER REF: ${orderRef}`;
  document.getElementById("receiptTimestamp").innerText = `DATE: ${nowStr}`;
  document.getElementById("receiptCustomerName").innerText = appState.customerDetails.fullName;
  document.getElementById("receiptCustomerPhone").innerText = appState.customerDetails.phone;
  document.getElementById("receiptEventDate").innerText = appState.customerDetails.eventDate.replace('T', ' ');
  document.getElementById("receiptAddress").innerText = appState.customerDetails.address;

  const rate = getPricePerCup(appState.totalQuantity);

  const itemsList = document.getElementById("receiptItemsList");
  if (itemsList) {
    itemsList.innerHTML = appState.selectedDrinks.map(drinkId => {
      const drink = DRINKS_DATA.find(d => d.id === drinkId);
      const cups = appState.drinkAllocations[drinkId] || 0;
      const itemPrice = cups * rate;

      return `
        <div class="receipt-row">
          <span>${cups}x ${drink ? drink.name : drinkId} (Cold Foam) @ RM ${rate.toFixed(2)}</span>
          <span>RM ${itemPrice.toFixed(2)}</span>
        </div>
      `;
    }).join('');
  }

  const fee = getTransportationFee();
  const feeEl = document.getElementById("receiptDeliveryFee");
  if (feeEl) {
    feeEl.innerText = fee === 0 ? "RM 0.00 (FREE)" : `RM ${fee.toFixed(2)}`;
  }

  const total = calculateOrderTotal();
  document.getElementById("receiptTotalCupsCount").innerText = `${appState.totalQuantity} Cups`;
  document.getElementById("receiptPaidTotal").innerText = `RM ${total.toFixed(2)}`;

  modal.classList.add("active");
}
