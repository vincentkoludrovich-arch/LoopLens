const zoneProfiles = {
  dining: {
    label: "Dining hall",
    summary:
      "Dining halls generate the heaviest mix of food-soiled packaging and need compost-versus-recycling guidance at the point of disposal.",
  },
  dorm: {
    label: "Dorm lobby",
    summary:
      "Dorm lobbies need simpler resident-facing instructions and clearer battery, bottle, and late-night waste separation.",
  },
  student: {
    label: "Student center",
    summary:
      "Student centers mix coffee cups, takeout packaging, and event traffic, which makes sorting errors highly repetitive.",
  },
  stadium: {
    label: "Stadium concourse",
    summary:
      "Concourse waste spikes quickly, so the biggest gains come from beverage recovery and fast contamination control.",
  },
  office: {
    label: "Break room",
    summary:
      "Break rooms perform best when disposal rules are simple, visible, and placed near coffee and snack waste.",
  },
};

const els = {
  location: document.querySelector("#location"),
  zone: document.querySelector("#zone"),
  itemType: document.querySelector("#item-type"),
  material: document.querySelector("#material"),
  residue: document.querySelector("#residue"),
  volume: document.querySelector("#volume"),
  volumeReadout: document.querySelector("#volume-readout"),
  upload: document.querySelector("#upload"),
  imagePreview: document.querySelector("#image-preview"),
  analyzeButton: document.querySelector("#analyze-button"),
  resultTitle: document.querySelector("#result-title"),
  resultStatus: document.querySelector("#result-status"),
  resultDescription: document.querySelector("#result-description"),
  metricPath: document.querySelector("#metric-path"),
  metricRisk: document.querySelector("#metric-risk"),
  metricDiversion: document.querySelector("#metric-diversion"),
  metricSavings: document.querySelector("#metric-savings"),
  impactSummary: document.querySelector("#impact-summary"),
  actionSummary: document.querySelector("#action-summary"),
  reasoningSummary: document.querySelector("#reasoning-summary"),
  confidenceSummary: document.querySelector("#confidence-summary"),
  chartCaption: document.querySelector("#chart-caption"),
  barBefore: document.querySelector("#bar-before"),
  barAfter: document.querySelector("#bar-after"),
  barAvoided: document.querySelector("#bar-avoided"),
  scanSignal: document.querySelector("#scan-signal"),
  scanConfidence: document.querySelector("#scan-confidence"),
  mistakeList: document.querySelector("#mistake-list"),
  signageStack: document.querySelector("#signage-stack"),
  zoneMap: document.querySelector("#zone-map"),
  zoneSummary: document.querySelector("#zone-summary"),
  downloadSignage: document.querySelector("#download-signage"),
};

const state = {
  uploadedImageDataUrl: null,
  uploadedImageName: null,
  currentAnalysis: null,
  currentSignage: [],
  backendReachable: false,
  aiConfigured: false,
  demoMode: false,
};

const sampleAnalyses = {
  dining: {
    title: "Dining hall contamination report",
    status: "Showcase sample",
    description:
      "LoopLens identified food-soiled cardboard, coffee cups, and mixed beverage waste as the top contamination drivers in this dining hall sample.",
    path: "Compost food-soiled fiber, recycle clean containers, route hazardous items separately",
    risk: "High",
    diversion: "+18%",
    savings: "$1,240",
    impactSummary:
      "Dining areas usually produce the highest concentration of food-soiled packaging, which makes compost guidance and contamination prevention the fastest path to better recovery.",
    actionSummary:
      "Install compost-first signage near tray return, add drain-before-recycle messaging, and separate battery drop points from general waste stations.",
    reasoningSummary:
      "This sample combines dense student traffic, mixed takeout packaging, and heavy liquid residue, which typically drives confusion between landfill, compost, and recycling streams.",
    confidenceSummary:
      "Showcase sample - based on a representative campus dining scenario rather than a live API response.",
    chartCaption:
      "A focused intervention in one dining hall can materially improve recovery within the first month.",
    scanSignal: "Sample workflow loaded",
    scanConfidence: "Showcase mode",
    mistakes: [
      "Greasy pizza boxes are entering paper recycling.",
      "Coffee cups and lids are being mixed into the wrong stream.",
      "Half-full drink containers are contaminating nearby recyclables.",
    ],
    signage: [
      "Food-soiled cardboard goes to compost where available.",
      "Empty liquids before recycling bottles and cans.",
      "Coffee cups do not belong in paper recycling.",
    ],
    bars: {
      before: 34,
      after: 56,
      avoided: 29,
    },
  },
  dorm: {
    title: "Dorm lobby recovery report",
    status: "Showcase sample",
    description:
      "LoopLens flagged batteries, snack packaging, and drink containers as the most common dorm-lobby sorting mistakes in this sample report.",
    path: "Recycle beverage containers, isolate batteries, landfill contaminated packaging",
    risk: "Medium",
    diversion: "+12%",
    savings: "$760",
    impactSummary:
      "Dorm lobbies benefit most from simpler instructions, hazardous item visibility, and clear separation between beverage recovery and general waste.",
    actionSummary:
      "Install a battery collection point, add resident-facing bin labels, and place bottle recovery signage at the main entrance and mail area.",
    reasoningSummary:
      "Dorms have lower food-soil volume than dining halls, but repeated confusion around late-night packaging and batteries creates preventable contamination.",
    confidenceSummary:
      "Showcase sample - based on a representative residential waste scenario rather than a live API response.",
    chartCaption:
      "Simple signage and hazardous-item separation can improve dorm recycling performance quickly.",
    scanSignal: "Sample workflow loaded",
    scanConfidence: "Showcase mode",
    mistakes: [
      "Loose batteries are dropped into general trash.",
      "Students mix snack wrappers with bottles and cans.",
      "Residents default to trash when bin labels are unclear.",
    ],
    signage: [
      "Use the battery drop box for all loose batteries.",
      "Recycle empty bottles and cans only.",
      "When in doubt, do not contaminate the recycling stream.",
    ],
    bars: {
      before: 41,
      after: 55,
      avoided: 21,
    },
  },
};

function updateVolumeReadout() {
  els.volumeReadout.textContent = `${els.volume.value} items/week`;
}

function setStatus(title, status, description) {
  els.resultTitle.textContent = title;
  els.resultStatus.textContent = status;
  els.resultDescription.textContent = description;
}

function updateZoneMap(activeZone) {
  const nodes = els.zoneMap.querySelectorAll(".zone-node");
  nodes.forEach((node) => {
    node.classList.toggle("active", node.dataset.zone === activeZone);
  });
  els.zoneSummary.textContent = zoneProfiles[activeZone].summary;
}

function renderMistakes(mistakes = [], zoneLabel = "") {
  els.mistakeList.innerHTML = "";
  mistakes.forEach((mistake, index) => {
    const row = document.createElement("div");
    row.className = "mistake-row";
    row.innerHTML = `
      <span class="mistake-rank">0${index + 1}</span>
      <div>
        <strong>${mistake}</strong>
        <p>Priority in ${zoneLabel.toLowerCase()} this week.</p>
      </div>
    `;
    els.mistakeList.appendChild(row);
  });
}

function renderSignage(signage = [], zoneLabel = "") {
  els.signageStack.innerHTML = "";
  signage.forEach((line) => {
    const card = document.createElement("div");
    card.className = "signage-card";
    card.innerHTML = `
      <span class="signage-title">${zoneLabel}</span>
      <strong>${line}</strong>
    `;
    els.signageStack.appendChild(card);
  });
}

function renderImagePreview(file) {
  if (!file) {
    els.imagePreview.innerHTML = "<span>No image selected yet</span>";
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  els.imagePreview.innerHTML = "";

  const image = document.createElement("img");
  image.src = objectUrl;
  image.alt = "Uploaded waste preview";
  image.addEventListener("load", () => {
    URL.revokeObjectURL(objectUrl);
  });

  els.imagePreview.appendChild(image);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}

function renderAnalysis(analysis) {
  const zoneLabel = zoneProfiles[els.zone.value].label;
  state.currentAnalysis = analysis;
  state.currentSignage = analysis.signage;

  els.resultTitle.textContent = analysis.title;
  els.resultStatus.textContent = analysis.status;
  els.resultDescription.textContent = analysis.description;
  els.metricPath.textContent = analysis.path;
  els.metricRisk.textContent = analysis.risk;
  els.metricDiversion.textContent = analysis.diversion;
  els.metricSavings.textContent = analysis.savings;
  els.impactSummary.textContent = analysis.impactSummary;
  els.actionSummary.textContent = analysis.actionSummary;
  els.reasoningSummary.textContent = analysis.reasoningSummary;
  els.confidenceSummary.textContent = analysis.confidenceSummary;
  els.chartCaption.textContent = analysis.chartCaption;
  els.barBefore.style.width = `${analysis.bars.before}%`;
  els.barAfter.style.width = `${analysis.bars.after}%`;
  els.barAvoided.style.width = `${analysis.bars.avoided}%`;
  els.scanSignal.textContent = analysis.scanSignal;
  els.scanConfidence.textContent = analysis.scanConfidence;

  renderMistakes(analysis.mistakes, zoneLabel);
  renderSignage(analysis.signage, zoneLabel);
}

function loadSampleAnalysis(sampleKey) {
  state.demoMode = true;
  renderAnalysis(sampleAnalyses[sampleKey]);
}

function getPayload() {
  return {
    location: els.location.value,
    zone: els.zone.value,
    zoneLabel: zoneProfiles[els.zone.value].label,
    itemType: els.itemType.value,
    material: els.material.value,
    materialLabel: els.material.options[els.material.selectedIndex].text,
    residue: els.residue.value,
    residueLabel: els.residue.options[els.residue.selectedIndex].text,
    volume: Number(els.volume.value),
    imageDataUrl: state.uploadedImageDataUrl,
    imageName: state.uploadedImageName,
  };
}

async function analyzeWithBackend() {
  const payload = getPayload();
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to analyze with AI backend.");
  }

  return data;
}

async function checkBackendHealth() {
  if (window.location.protocol === "file:") {
    state.backendReachable = false;
    state.aiConfigured = false;
    state.demoMode = true;
    setStatus(
      "Showcase mode active",
      "Live AI optional",
      "LoopLens can still be explored through guided sample reports when the live backend is unavailable."
    );
    els.scanSignal.textContent = "Sample analysis available";
    els.scanConfidence.textContent = "Showcase mode";
    return;
  }

  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    state.backendReachable = Boolean(data.ok);
    state.aiConfigured = Boolean(data.aiConfigured);

    if (!state.aiConfigured) {
      state.demoMode = true;
      setStatus(
        "Showcase mode active",
        "Live AI unavailable",
        "The site is live, but backend AI analysis is currently unavailable. Guided sample reports remain available for visitors."
      );
      els.scanSignal.textContent = "Server connected";
      els.scanConfidence.textContent = "Showcase mode";
    }
  } catch {
    state.backendReachable = false;
    state.aiConfigured = false;
    state.demoMode = true;
    setStatus(
      "Showcase mode active",
      "Backend offline",
      "LoopLens is showing guided sample reports because live backend analysis is not currently available."
    );
    els.scanSignal.textContent = "Sample analysis available";
    els.scanConfidence.textContent = "Showcase mode";
  }
}

async function runAnalysis() {
  if (window.location.protocol === "file:") {
    state.demoMode = true;
    setStatus(
      "Showcase mode active",
      "Live AI optional",
      "This local file view supports guided sample reports. Open the hosted version or local backend to run live AI analysis."
    );
    loadSampleAnalysis("dining");
    return;
  }

  if (!state.backendReachable) {
    state.demoMode = true;
    setStatus(
      "Showcase mode active",
      "Backend unavailable",
      "The backend is not reachable right now, so LoopLens is falling back to guided sample reports."
    );
    loadSampleAnalysis("dining");
    return;
  }

  if (!state.aiConfigured) {
    state.demoMode = true;
    setStatus(
      "Showcase mode active",
      "Live AI unavailable",
      "Live AI analysis is temporarily unavailable, but the full product workflow can still be explored through sample reports."
    );
    loadSampleAnalysis("dining");
    return;
  }

  els.analyzeButton.disabled = true;
  setStatus(
    "Analyzing with LoopLens",
    "AI processing",
    "LoopLens is sending your image and waste context to the backend to generate a live routing report."
  );
  els.scanSignal.textContent = state.uploadedImageDataUrl
    ? "Image attached for AI review"
    : "No image attached";
  els.scanConfidence.textContent = "Analyzing";

  try {
    const analysis = await analyzeWithBackend();
    state.demoMode = false;
    renderAnalysis(analysis);
  } catch (error) {
    state.demoMode = true;
    if (
      error.message.includes("insufficient_quota") ||
      error.message.includes("Incorrect API key") ||
      error.message.includes("invalid_api_key")
    ) {
      setStatus(
        "Showcase mode active",
        "Live AI unavailable",
        "Live AI analysis is temporarily unavailable, so LoopLens has switched to guided sample reports for the showcase."
      );
      loadSampleAnalysis("dining");
    } else {
      setStatus(
        "Showcase mode active",
        "Temporary fallback",
        "LoopLens could not complete a live AI response, so a guided sample report has been loaded instead."
      );
      loadSampleAnalysis("dining");
    }
  } finally {
    els.analyzeButton.disabled = false;
  }
}

function downloadSignage() {
  const zoneLabel = zoneProfiles[els.zone.value].label;
  const text = [
    "LoopLens signage pack",
    `Zone: ${zoneLabel}`,
    `Location: ${els.location.options[els.location.selectedIndex].text}`,
    `Item focus: ${els.itemType.value}`,
    "",
    ...state.currentSignage.map((line, index) => `${index + 1}. ${line}`),
  ].join("\n");

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `looplens-signage-${els.zone.value}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

els.volume.addEventListener("input", updateVolumeReadout);
els.analyzeButton.addEventListener("click", runAnalysis);
els.downloadSignage.addEventListener("click", downloadSignage);
document.querySelectorAll("[data-sample]").forEach((button) => {
  button.addEventListener("click", () => {
    loadSampleAnalysis(button.dataset.sample);
  });
});

els.upload.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  renderImagePreview(file);

  if (!file) {
    state.uploadedImageDataUrl = null;
    state.uploadedImageName = null;
    els.scanSignal.textContent = "No photo analyzed";
    els.scanConfidence.textContent = "--";
    return;
  }

  state.uploadedImageDataUrl = await readFileAsDataUrl(file);
  state.uploadedImageName = file.name;
  els.scanSignal.textContent = `${file.name} attached`;
  els.scanConfidence.textContent = "Ready for AI";
});

[els.location, els.zone, els.itemType, els.material, els.residue].forEach(
  (element) => {
    element.addEventListener("change", () => {
      updateZoneMap(els.zone.value);
    });
  }
);

els.zoneMap.querySelectorAll(".zone-node").forEach((node) => {
  node.dataset.zone = node.textContent.includes("Dining")
    ? "dining"
    : node.textContent.includes("Dorm")
      ? "dorm"
      : node.textContent.includes("Student")
        ? "student"
        : "stadium";

  node.addEventListener("click", () => {
    els.zone.value = node.dataset.zone;
    updateZoneMap(node.dataset.zone);
  });
});

updateVolumeReadout();
updateZoneMap(els.zone.value);
setStatus(
  "Ready for live analysis",
  "Awaiting input",
  "Configure your inputs and run LoopLens to generate a backend-powered AI waste routing report."
);
renderMistakes(
  [
    "Coffee cups are entering paper recycling after events.",
    "Greasy cardboard is showing up in mixed recycling bins.",
    "Loose batteries are being hidden in general waste bags.",
  ],
  zoneProfiles[els.zone.value].label
);
renderSignage(
  [
    "Empty liquids before disposal.",
    "Food-soiled packaging does not belong in paper recycling.",
    "Use the battery drop box for hazardous items.",
  ],
  zoneProfiles[els.zone.value].label
);
checkBackendHealth();
