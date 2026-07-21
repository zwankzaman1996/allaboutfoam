// Recommended Foam Pairing per Drink Type
const RECOMMENDED_FOAMS = {
  coffee: "seasalt_cold_foam",
  matcha: "cheese_foam",
  chocolate: "vanilla_cold_foam",
  red_thai_tea: "normal_cream",
  green_thai_tea: "normal_cream"
};

// Application State
const appState = {
  currentStep: 1,
  selectedDrinks: ["coffee", "matcha"], // default 2 selected drinks
  foamSelections: {
    coffee: "seasalt_cold_foam",
    matcha: "cheese_foam"
  },
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
  renderDrinksGrid();
  renderFoamPairing();
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

/* Helper: SVG Drink Cup Generator */
function generateCupSVG(drinkColor, liquidColor, accentColor, foamColor = "#FFFDF0") {
  return `
    <svg class="svg-cup" viewBox="0 0 100 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Glass Cup Shadow & Cup Outline -->
      <path d="M 20 25 L 28 125 C 28 132 72 132 72 125 L 80 25 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
      
      <!-- Liquid Body -->
      <path d="M 22 45 L 28 122 C 28 130 72 130 72 122 L 78 45 Z" fill="${liquidColor}" />
      
      <!-- Liquid Gradient Reflection Overlay -->
      <path d="M 22 45 L 28 122 C 28 130 72 130 72 122 L 78 45 Z" fill="url(#liquidGrad-${drinkColor.replace('#','')})" opacity="0.4" />
      
      <defs>
        <linearGradient id="liquidGrad-${drinkColor.replace('#','')}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#000000" stop-opacity="0.5" />
        </linearGradient>
      </defs>

      <!-- Simulated Floating Ice Cubes -->
      <rect x="34" y="55" width="16" height="16" rx="3" fill="rgba(255,255,255,0.4)" transform="rotate(12 42 63)" />
      <rect x="52" y="70" width="18" height="18" rx="4" fill="rgba(255,255,255,0.35)" transform="rotate(-8 61 79)" />

      <!-- Thick Cold Foam Layer Cap -->
      <path d="M 17 22 C 17 18, 30 16, 50 16 C 70 16, 83 18, 83 22 C 83 34, 75 44, 50 44 C 25 44, 17 34, 17 22 Z" fill="${foamColor}" />
      
      <!-- Cold Foam Pillowy Texture Bubbles -->
      <ellipse cx="32" cy="22" rx="10" ry="6" fill="#FFFFFF" opacity="0.8" />
      <ellipse cx="50" cy="20" rx="14" ry="7" fill="#FFFFFF" opacity="0.9" />
      <ellipse cx="68" cy="23" rx="11" ry="6" fill="#FFFFFF" opacity="0.85" />

      <!-- Transparent Straw -->
      <line x1="65" y1="5" x2="45" y2="120" stroke="rgba(255,255,255,0.6)" stroke-width="4" stroke-linecap="round" />
      <line x1="65" y1="5" x2="45" y2="120" stroke="${accentColor}" stroke-width="2" stroke-linecap="round" opacity="0.8" />

      <!-- Glass Highlight Reflection -->
      <path d="M 23 30 L 26 115" stroke="rgba(255,255,255,0.4)" stroke-width="3" stroke-linecap="round" />
    </svg>
  `;
}

/* Render Step 1: Drinks Grid */
function renderDrinksGrid() {
  const container = document.getElementById("drinksGrid");
  if (!container) return;

  container.innerHTML = DRINKS_DATA.map(drink => {
    const isSelected = appState.selectedDrinks.includes(drink.id);
    const chosenFoamId = appState.foamSelections[drink.id] || RECOMMENDED_FOAMS[drink.id] || "normal_cream";
    const foamObj = FOAMS_DATA.find(f => f.id === chosenFoamId) || FOAMS_DATA[0];

    return `
      <div class="drink-card ${isSelected ? 'selected' : ''}" data-drink-id="${drink.id}" style="--card-color: ${drink.accentColor}">
        <div class="selection-badge">✓</div>
        
        <div class="cup-illustration-wrapper">
          ${generateCupSVG(drink.id, drink.liquidColor, drink.accentColor, foamObj.color)}
        </div>

        <span class="drink-card-badge">${drink.badge}</span>
        <h3 class="drink-name">${drink.name}</h3>
        <div class="drink-tagline">${drink.tagline}</div>
        <p class="drink-desc">${drink.shortDesc}</p>
      </div>
    `;
  }).join('');

  // Add click listeners
  container.querySelectorAll('.drink-card').forEach(card => {
    card.addEventListener('click', () => {
      const drinkId = card.getAttribute('data-drink-id');
      toggleDrinkSelection(drinkId);
    });
  });
}

/* Toggle Drink Selection */
function toggleDrinkSelection(drinkId) {
  const index = appState.selectedDrinks.indexOf(drinkId);
  
  if (index > -1) {
    // Prevent deselecting if it's the only drink selected
    if (appState.selectedDrinks.length === 1) {
      alert("At least 1 drink type must be selected for your event booth menu!");
      return;
    }
    appState.selectedDrinks.splice(index, 1);
    delete appState.foamSelections[drinkId];
    delete appState.drinkAllocations[drinkId];
  } else {
    appState.selectedDrinks.push(drinkId);
    // Assign default recommended foam for newly selected drink
    appState.foamSelections[drinkId] = RECOMMENDED_FOAMS[drinkId] || "normal_cream";
  }

  // Recalculate cup allocations for selected drinks
  redistributeCupsEqually();
  
  // Re-render UI
  renderDrinksGrid();
  renderFoamPairing();
  renderAllocationRows();
  updateMiniCart();
}

/* Render Step 2: Foam Pairing Options per selected drink */
function renderFoamPairing() {
  const container = document.getElementById("foamPairingContainer");
  if (!container) return;

  if (appState.selectedDrinks.length === 0) {
    container.innerHTML = `<p style="text-align:center; color: var(--text-muted);">Please select at least 1 drink in Step 1 first.</p>`;
    return;
  }

  container.innerHTML = appState.selectedDrinks.map(drinkId => {
    const drink = DRINKS_DATA.find(d => d.id === drinkId);
    const recFoamId = RECOMMENDED_FOAMS[drinkId];
    const selectedFoamId = appState.foamSelections[drinkId] || recFoamId || FOAMS_DATA[0].id;

    return `
      <div class="foam-drink-group">
        <div class="foam-drink-header">
          <div class="foam-drink-icon" style="color: ${drink.accentColor}">☕</div>
          <div class="foam-drink-title">
            <h3>Pair Cold Foam for: <span style="color: ${drink.accentColor}">${drink.name}</span></h3>
            <p>Select 1 signature foam crown to top every cup of ${drink.name} served at your event.</p>
          </div>
        </div>

        <div class="foam-options-grid">
          ${FOAMS_DATA.map(foam => {
            const isFoamSelected = selectedFoamId === foam.id;
            const isRecommended = foam.id === recFoamId;
            return `
              <div class="foam-card ${isFoamSelected ? 'selected' : ''}" 
                   data-drink-id="${drinkId}" 
                   data-foam-id="${foam.id}">
                <div>
                  <div class="foam-top-bar">
                    ${isRecommended ? `<span class="foam-badge recommended">⭐ Recommended</span>` : `<span></span>`}
                    <div class="foam-radio"></div>
                  </div>
                  <h4 class="foam-name">${foam.name}</h4>
                  <div class="foam-subtitle">${foam.subtitle}</div>
                  <p class="foam-desc">${foam.tasteProfile}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Click event listeners for foam cards
  container.querySelectorAll('.foam-card').forEach(card => {
    card.addEventListener('click', () => {
      const drinkId = card.getAttribute('data-drink-id');
      const foamId = card.getAttribute('data-foam-id');
      appState.foamSelections[drinkId] = foamId;
      renderFoamPairing();
      renderDrinksGrid();
    });
  });
}

/* Render Step 3: Perks Callout */
function initPerks() {
  const container = document.getElementById("perksGrid");
  if (!container) return;

  let perks = [...EVENT_PACKAGE_PERKS];
  if (appState.totalQuantity > 200) {
    perks.push("Free Transportation/Delivery");
  }

  container.innerHTML = perks.map(perk => `
    <div class="perk-item">${perk}</div>
  `).join('');

  // Encouraging banner callout
  let promoEl = document.getElementById("perksEncouragementBanner");
  if (!promoEl && container.parentElement) {
    promoEl = document.createElement("div");
    promoEl.id = "perksEncouragementBanner";
    container.parentElement.appendChild(promoEl);
  }

  if (promoEl) {
    if (appState.totalQuantity > 200) {
      promoEl.innerHTML = `<div style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--success); font-weight: 700; display: flex; align-items: center; gap: 0.4rem;">🎉 Unlocked FREE Transportation & Delivery for ordering >200 cups!</div>`;
    } else {
      promoEl.innerHTML = `<div style="margin-top: 0.75rem; font-size: 0.85rem; color: var(--accent-gold); font-weight: 700; background: rgba(255, 183, 3, 0.12); padding: 0.6rem 0.8rem; border-radius: 8px; border: 1px dashed rgba(255,183,3,0.3); display: flex; align-items: center; gap: 0.4rem;">🚚 Order >200 cups to get FREE Transportation & Delivery (Save RM50!)</div>`;
    }
  }
}

/* Step 3: Quantity Selector Logic */
function renderQuantityConfigurator() {
  const qtyDisplay = document.getElementById("totalQtyDisplay");
  const slider = document.getElementById("qtyRangeSlider");
  const presetBtns = document.querySelectorAll("#qtyPresetsContainer .preset-btn");
  const priceBadge = document.getElementById("pricePerCupBadge");

  if (qtyDisplay) qtyDisplay.innerText = appState.totalQuantity.toLocaleString();
  if (slider) slider.value = appState.totalQuantity;

  const unitPrice = getPricePerCup(appState.totalQuantity);
  if (priceBadge) {
    let hasPremiumFoam = appState.selectedDrinks.some(dId => (appState.foamSelections[dId] || RECOMMENDED_FOAMS[dId]) !== "normal_cream");
    const foamNote = hasPremiumFoam ? ` <span style="font-size:0.78rem; color:var(--accent-amber); font-weight:600; margin-left:4px;">(+RM0.20 foam fee)</span>` : '';

    if (unitPrice < 5.00) {
      const discount = (5.00 - unitPrice).toFixed(2);
      priceBadge.innerHTML = `🏷️ Base Rate: <strong>RM ${unitPrice.toFixed(2)}</strong> / cup <span style="font-size:0.82rem; color:var(--success); margin-left:6px; font-weight:700;">(Saved RM ${discount}/cup!)</span>${foamNote}`;
    } else {
      priceBadge.innerHTML = `🏷️ Base Rate: <strong>RM ${unitPrice.toFixed(2)}</strong> / cup${foamNote}`;
    }
  }

  // Preset button active state
  presetBtns.forEach(btn => {
    const val = parseInt(btn.getAttribute("data-qty"));
    if (val === appState.totalQuantity) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  initPerks();
  updateMiniCart();
}

function setTotalQuantity(newQty) {
  // Clamp between 50 and 1000, step 50
  let qty = Math.max(50, Math.min(1000, newQty));
  qty = Math.round(qty / 50) * 50;

  appState.totalQuantity = qty;
  redistributeCupsEqually();
  renderQuantityConfigurator();
  renderAllocationRows();
}

/* Redistribute Cups Equally across selected drinks */
function redistributeCupsEqually() {
  const count = appState.selectedDrinks.length;
  if (count === 0) return;

  const basePerDrink = Math.floor(appState.totalQuantity / count / 50) * 50;
  let remainder = appState.totalQuantity - (basePerDrink * count);

  appState.selectedDrinks.forEach((drinkId, idx) => {
    let assigned = basePerDrink;
    if (remainder >= 50) {
      assigned += 50;
      remainder -= 50;
    }
    appState.drinkAllocations[drinkId] = assigned;
  });
}

/* Render Step 4: Cup Allocation Rows */
function renderAllocationRows() {
  const container = document.getElementById("allocationRowsContainer");
  const targetText = document.getElementById("allocationTargetText");
  const targetStat = document.getElementById("targetQtyStat");
  const allocatedStat = document.getElementById("allocatedQtyStat");
  const remainingStat = document.getElementById("remainingQtyStat");
  const progressPercentBar = document.getElementById("allocationPercentageBar");

  if (!container) return;

  if (targetText) targetText.innerText = `${appState.totalQuantity} cups`;
  if (targetStat) targetStat.innerText = appState.totalQuantity;

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
      btnReview.innerText = "Review & Confirm Order →";
    } else {
      btnReview.disabled = true;
      btnReview.innerText = remaining > 0 ? `Assign ${remaining} more cups to proceed` : `Overallocated by ${Math.abs(remaining)} cups`;
    }
  }

  // Render Allocation Rows
  container.innerHTML = appState.selectedDrinks.map(drinkId => {
    const drink = DRINKS_DATA.find(d => d.id === drinkId);
    const chosenFoamId = appState.foamSelections[drinkId] || "vanilla_cold_foam";
    const foam = FOAMS_DATA.find(f => f.id === chosenFoamId);
    const assignedCups = appState.drinkAllocations[drinkId] || 0;

    return `
      <div class="allocation-row">
        <div class="row-drink-info">
          <div class="row-drink-swatch" style="background: ${drink.liquidColor}"></div>
          <div class="row-drink-details">
            <h4>${drink.name}</h4>
            <p> topped with <strong>${foam ? foam.name : 'Cold Foam'}</strong></p>
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
      return `<div class="percentage-segment" style="width: ${pct}%; background: ${drink.accentColor}" title="${drink.name}: ${cups} cups (${pct.toFixed(0)}%)"></div>`;
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

  const activeSec = document.getElementById(`stepSection${appState.currentStep}`);
  if (activeSec) activeSec.classList.add('active');

  // Update Stepper Navbar items
  for (let i = 1; i <= 4; i++) {
    const navItem = document.getElementById(`navStep${i}`);
    if (!navItem) continue;

    if (i === appState.currentStep) {
      navItem.className = "step-item active";
    } else if (i < appState.currentStep) {
      navItem.className = "step-item completed";
    } else {
      navItem.className = "step-item";
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Calculate Transportation Fee (RM50 for <=200 cups, FREE for >200 cups) */
function getTransportationFee() {
  return appState.totalQuantity > 200 ? 0 : 50;
}

/* Calculate Tiered Price Per Cup:
 * Base price: RM 5.00/cup
 * Every 100 cups increment above 100 reduces price by RM 0.20 per cup (e.g. 100=RM5.00, 200=RM4.80, 250=RM4.80)
 * Minimum price cap (ceiling discount): RM 4.00/cup
 */
function getPricePerCup(totalQuantity = appState.totalQuantity) {
  if (totalQuantity < 100) return 5.00;
  const hundredIncrementsAbove100 = Math.floor((totalQuantity - 100) / 100);
  const discount = hundredIncrementsAbove100 * 0.20;
  const finalPrice = 5.00 - discount;
  return Math.max(4.00, finalPrice);
}

/* Get Effective Cup Rate for a drink (Base rate + RM0.20 if non-normal_cream foam selected) */
function getDrinkPricePerCup(drinkId, totalQuantity = appState.totalQuantity) {
  const baseRate = getPricePerCup(totalQuantity);
  const chosenFoamId = appState.foamSelections[drinkId] || RECOMMENDED_FOAMS[drinkId] || "normal_cream";
  const foamSurcharge = (chosenFoamId !== "normal_cream") ? 0.20 : 0;
  return baseRate + foamSurcharge;
}

/* Calculate Price Subtotal */
function calculateOrderSubtotal() {
  let subtotal = 0;
  appState.selectedDrinks.forEach(drinkId => {
    const cups = appState.drinkAllocations[drinkId] || 0;
    const rate = getDrinkPricePerCup(drinkId, appState.totalQuantity);
    subtotal += cups * rate;
  });
  return subtotal;
}

function calculateOrderTotal() {
  return calculateOrderSubtotal() + getTransportationFee();
}

/* Update Mini Cart Pill Header */
function updateMiniCart() {
  const countEl = document.getElementById("miniCartCount");
  if (countEl) {
    countEl.innerText = `${appState.totalQuantity} Cups (RM ${calculateOrderTotal().toFixed(2)})`;
  }
}

/* Render Confirmation Summary Modal (Step 5) */
function openSummaryModal() {
  const modal = document.getElementById("orderSummaryModal");
  const summaryList = document.getElementById("summaryModalList");
  const totalCupsEl = document.getElementById("summaryModalTotalCups");
  const subtotalEl = document.getElementById("summaryModalSubtotal");
  const deliveryFeeEl = document.getElementById("summaryModalDeliveryFee");
  const finalTotalEl = document.getElementById("summaryModalFinalTotal");

  if (!modal || !summaryList) return;

  summaryList.innerHTML = appState.selectedDrinks.map(drinkId => {
    const drink = DRINKS_DATA.find(d => d.id === drinkId);
    const chosenFoamId = appState.foamSelections[drinkId] || RECOMMENDED_FOAMS[drinkId] || "normal_cream";
    const foam = FOAMS_DATA.find(f => f.id === chosenFoamId);
    const cups = appState.drinkAllocations[drinkId] || 0;
    const effectiveRate = getDrinkPricePerCup(drinkId, appState.totalQuantity);
    const lineTotal = cups * effectiveRate;

    return `
      <div class="summary-item-card">
        <div class="summary-item-info">
          <h4>${drink.name}</h4>
          <p>👑 Foam: <strong>${foam ? foam.name : 'Cold Foam'}</strong>${chosenFoamId !== 'normal_cream' ? ' <span style="color:var(--accent-amber); font-size:0.75rem; font-weight:700;">(+RM0.20/cup)</span>' : ''}</p>
        </div>
        <div class="summary-item-qty" style="text-align: right;">
          <div>${cups} Cups</div>
          <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">@ RM ${effectiveRate.toFixed(2)}/cup (RM ${lineTotal.toFixed(2)})</div>
        </div>
      </div>
    `;
  }).join('');

  const subtotal = calculateOrderSubtotal();
  const fee = getTransportationFee();
  const total = calculateOrderTotal();
  const baseUnitPrice = getPricePerCup(appState.totalQuantity);

  if (totalCupsEl) totalCupsEl.innerText = `${appState.totalQuantity} Cups`;
  const unitPriceEl = document.getElementById("summaryModalUnitPrice");
  if (unitPriceEl) {
    let hasPremiumFoam = appState.selectedDrinks.some(dId => (appState.foamSelections[dId] || RECOMMENDED_FOAMS[dId]) !== "normal_cream");
    unitPriceEl.innerText = hasPremiumFoam ? `RM ${baseUnitPrice.toFixed(2)} (+RM0.20) / cup` : `RM ${baseUnitPrice.toFixed(2)} / cup`;
  }
  if (subtotalEl) subtotalEl.innerText = `RM ${subtotal.toFixed(2)}`;
  
  if (deliveryFeeEl) {
    if (fee === 0) {
      deliveryFeeEl.innerText = "FREE (Unlocked for >200 cups)";
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
  // Navigation Buttons
  document.getElementById("btnGoToStep2")?.addEventListener("click", () => {
    appState.currentStep = 2;
    updateStepVisibility();
  });

  document.getElementById("btnBackToStep1")?.addEventListener("click", () => {
    appState.currentStep = 1;
    updateStepVisibility();
  });

  document.getElementById("btnGoToStep3")?.addEventListener("click", () => {
    appState.currentStep = 3;
    updateStepVisibility();
  });

  document.getElementById("btnBackToStep2")?.addEventListener("click", () => {
    appState.currentStep = 2;
    updateStepVisibility();
  });

  document.getElementById("btnGoToStep4")?.addEventListener("click", () => {
    appState.currentStep = 4;
    renderAllocationRows();
    updateStepVisibility();
  });

  document.getElementById("btnBackToStep3")?.addEventListener("click", () => {
    appState.currentStep = 3;
    updateStepVisibility();
  });

  // Step 3: Presets & Slider
  document.querySelectorAll("#qtyPresetsContainer .preset-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const qty = parseInt(btn.getAttribute("data-qty"));
      setTotalQuantity(qty);
    });
  });

  document.getElementById("qtyRangeSlider")?.addEventListener("input", (e) => {
    const qty = parseInt(e.target.value);
    setTotalQuantity(qty);
  });

  // Step 4: Split Equally Button
  document.getElementById("btnSplitEqually")?.addEventListener("click", () => {
    redistributeCupsEqually();
    renderAllocationRows();
  });

  // Step 4: Review Order -> Triggers Summary Modal (Step 5)
  document.getElementById("btnReviewOrder")?.addEventListener("click", () => {
    openSummaryModal();
  });

  document.getElementById("btnCloseSummaryModal")?.addEventListener("click", () => {
    closeSummaryModal();
  });

  // EXACT SPEC BUTTON 1: "Change My Mind" -> Return to ordering page
  document.getElementById("btnChangeMyMind")?.addEventListener("click", () => {
    closeSummaryModal();
    appState.currentStep = 1;
    updateStepVisibility();
  });

  // EXACT SPEC BUTTON 2: "Place My Order" -> Proceed to customer detail page
  document.getElementById("btnPlaceMyOrder")?.addEventListener("click", () => {
    closeSummaryModal();
    appState.currentStep = 'Customer';
    document.querySelectorAll('.step-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('stepSectionCustomer')?.classList.add('active');
    
    // Update total amount on payment button
    const payTotal = document.getElementById("payTotalAmount");
    if (payTotal) payTotal.innerText = `RM ${calculateOrderTotal().toFixed(2)}`;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById("btnBackToSummary")?.addEventListener("click", () => {
    appState.currentStep = 4;
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

    // Trigger Payment Processing Loader State
    const submitBtn = document.getElementById("btnSubmitPayment");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `⏳ Processing Payment Authorization...`;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `🔒 Complete Payment`;
      }
      openReceiptModal();
    }, 1500);
  });

  // New Order Button on Receipt Modal
  document.getElementById("btnNewOrder")?.addEventListener("click", () => {
    const receiptModal = document.getElementById("receiptModal");
    if (receiptModal) receiptModal.classList.remove("active");

    // Reset app state
    appState.currentStep = 1;
    appState.selectedDrinks = ["coffee"];
    appState.foamSelections = { coffee: "vanilla_cold_foam" };
    appState.totalQuantity = 100;
    appState.drinkAllocations = { coffee: 100 };

    renderDrinksGrid();
    renderFoamPairing();
    renderQuantityConfigurator();
    renderAllocationRows();
    updateStepVisibility();
  });
}

/* Open Final Receipt Modal with Email Toast */
function openReceiptModal() {
  const modal = document.getElementById("receiptModal");
  if (!modal) return;

  const orderRef = `#AAF-${Math.floor(100000 + Math.random() * 900000)}`;
  const nowStr = new Date().toLocaleString();

  // Populate Receipt Fields
  document.getElementById("receiptSentEmail").innerText = appState.customerDetails.email;
  document.getElementById("receiptOrderRef").innerText = `ORDER REF: ${orderRef}`;
  document.getElementById("receiptTimestamp").innerText = `DATE: ${nowStr}`;
  document.getElementById("receiptCustomerName").innerText = appState.customerDetails.fullName;
  document.getElementById("receiptCustomerPhone").innerText = appState.customerDetails.phone;
  document.getElementById("receiptEventDate").innerText = appState.customerDetails.eventDate.replace('T', ' ');
  document.getElementById("receiptAddress").innerText = appState.customerDetails.address;

  // Render Receipt Items List
  const itemsList = document.getElementById("receiptItemsList");
  if (itemsList) {
    itemsList.innerHTML = appState.selectedDrinks.map(drinkId => {
      const drink = DRINKS_DATA.find(d => d.id === drinkId);
      const chosenFoamId = appState.foamSelections[drinkId] || RECOMMENDED_FOAMS[drinkId] || "normal_cream";
      const foam = FOAMS_DATA.find(f => f.id === chosenFoamId);
      const cups = appState.drinkAllocations[drinkId] || 0;
      const effectiveRate = getDrinkPricePerCup(drinkId, appState.totalQuantity);
      const itemPrice = cups * effectiveRate;

      return `
        <div class="receipt-row">
          <span>${cups}x ${drink ? drink.name : drinkId} (${foam ? foam.name : 'Foam'}) @ RM ${effectiveRate.toFixed(2)}</span>
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
