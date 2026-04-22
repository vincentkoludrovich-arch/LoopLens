const locationProfiles = {
  campus: {
    label: "University campus",
    risk: 8,
    diversion: 5,
    savings: 1.2,
  },
  apartment: {
    label: "Apartment building",
    risk: 12,
    diversion: 3,
    savings: 1.1,
  },
  office: {
    label: "Office tower",
    risk: -4,
    diversion: 6,
    savings: 1.35,
  },
  venue: {
    label: "Concert venue",
    risk: 18,
    diversion: 2,
    savings: 1.45,
  },
};

const zoneProfiles = {
  dining: {
    label: "Dining hall",
    risk: 12,
    summary:
      "Dining halls generate the heaviest mix of food-soiled packaging and need compost-versus-recycling guidance at the point of disposal.",
  },
  dorm: {
    label: "Dorm lobby",
    risk: 6,
    summary:
      "Dorm lobbies need simpler resident-facing instructions and clearer battery, bottle, and late-night waste separation.",
  },
  student: {
    label: "Student center",
    risk: 9,
    summary:
      "Student centers mix coffee cups, takeout packaging, and event traffic, which makes sorting errors highly repetitive.",
  },
  stadium: {
    label: "Stadium concourse",
    risk: 15,
    summary:
      "Concourse waste spikes quickly, so the biggest gains come from beverage recovery and fast contamination control.",
  },
  office: {
    label: "Break room",
    risk: 3,
    summary:
      "Break rooms perform best when disposal rules are simple, visible, and placed near coffee and snack waste.",
  },
};

const residueProfiles = {
  low: { label: "Low residue", risk: -10, diversion: 4 },
  medium: { label: "Medium residue", risk: 0, diversion: 0 },
  high: { label: "High residue", risk: 16, diversion: -6 },
};

const materialProfiles = {
  mixed: {
    label: "Mixed / uncertain",
    risk: 8,
    note: "Material uncertainty means signage and sorting rules need to be extra clear.",
  },
  paper: {
    label: "Paper fiber",
    risk: 4,
    note: "Paper-based items lose value quickly when they are food-soiled.",
  },
  plastic: {
    label: "Plastic",
    risk: 0,
    note: "Plastic items depend heavily on local acceptance and whether they are empty and clean.",
  },
  metal: {
    label: "Metal",
    risk: -8,
    note: "Metal containers are usually strong recovery candidates when separated correctly.",
  },
  hazardous: {
    label: "Hazardous",
    risk: 22,
    note: "Hazardous items must be clearly separated from regular waste streams.",
  },
  compostable: {
    label: "Compostable fiber",
    risk: 6,
    note: "Compostables only help if the location actually has compost infrastructure.",
  },
};

const itemProfiles = {
  "coffee cup": {
    path: "Landfill unless a specialty cup program exists",
    baseRisk: 55,
    baseDiversion: 8,
    baseSavings: 180,
    impact:
      "Single-use cups are one of the most misunderstood waste items in dense public spaces.",
    action:
      "Deploy cup-specific signage, separate lids and sleeves, and test reusable cup incentives near coffee stations.",
    reasoning:
      "Cups often look recyclable to users even when they contain plastic lining or leftover liquid.",
    mistakes: [
      "Users assume paper cups belong in paper recycling.",
      "Liquid left in cups contaminates nearby material.",
      "Lids and sleeves are mixed into the wrong stream.",
    ],
    signage: [
      "Empty liquids before disposal.",
      "Cup body goes to landfill unless specialty recycling exists.",
      "Recycle clean lids only if locally accepted.",
    ],
  },
  "greasy pizza box": {
    path: "Compost if accepted locally, otherwise landfill",
    baseRisk: 72,
    baseDiversion: 14,
    baseSavings: 420,
    impact:
      "Greasy fiber contaminates paper streams and can lower the value of surrounding recyclables.",
    action:
      "Place compost messaging near dining areas and train staff to separate clean cardboard from food-soiled boxes.",
    reasoning:
      "Food residue turns a familiar cardboard item into a contamination problem very quickly.",
    mistakes: [
      "Food-soiled cardboard is dropped into mixed recycling.",
      "Users do not know that clean lids can be separated from greasy bottoms.",
      "Compost access is unclear near dining tables.",
    ],
    signage: [
      "Greasy boxes do not belong in paper recycling.",
      "Compost food-soiled cardboard where available.",
      "Separate clean cardboard sections when possible.",
    ],
  },
  "plastic bottle": {
    path: "Recycle if empty",
    baseRisk: 24,
    baseDiversion: 11,
    baseSavings: 210,
    impact:
      "Bottles are highly recoverable, but only when they are emptied and routed into the correct stream.",
    action:
      "Add drain-and-recycle signage and audit high-traffic bins where liquids are common.",
    reasoning:
      "Plastic bottles are easy wins when users know to empty them and keep them away from food waste.",
    mistakes: [
      "Half-full bottles leak into mixed recycling.",
      "Bottle caps and containers are thrown away together with residual liquid.",
      "People choose the nearest trash can instead of the recycling bin.",
    ],
    signage: [
      "Empty liquids first.",
      "Recycle bottles in this station.",
      "Keep food and paper out of this bin.",
    ],
  },
  batteries: {
    path: "Hazardous collection only",
    baseRisk: 88,
    baseDiversion: 21,
    baseSavings: 650,
    impact:
      "Battery disposal mistakes create fire risk, contaminate streams, and expose facilities to operational hazards.",
    action:
      "Install battery collection points and trigger alerts when hazardous items appear in standard bins.",
    reasoning:
      "Batteries belong in a completely separate stream and create outsized risk compared with ordinary waste items.",
    mistakes: [
      "Loose batteries are dropped into general waste.",
      "People do not know where the nearest collection point is.",
      "Hazardous items are hidden inside bags and cups.",
    ],
    signage: [
      "Do not place batteries in trash or recycling.",
      "Use the battery drop box only.",
      "Alert staff if hazardous items appear in the wrong bin.",
    ],
  },
  "takeout container": {
    path: "Depends on local acceptance and residue level",
    baseRisk: 49,
    baseDiversion: 10,
    baseSavings: 250,
    impact:
      "Takeout packaging drives contamination because material type and residue vary dramatically by vendor.",
    action:
      "Standardize vendor packaging where possible and create location-specific guidance with photo examples.",
    reasoning:
      "Takeout packaging is confusing because users cannot easily tell material type, coating, or compostability.",
    mistakes: [
      "Users cannot tell compostable fiber from coated packaging.",
      "Residue makes otherwise recyclable packaging unrecoverable.",
      "Vendors use too many packaging types in one location.",
    ],
    signage: [
      "Check food residue before sorting.",
      "Compostable packaging only goes in compost-enabled stations.",
      "When unsure, use the item guide instead of guessing.",
    ],
  },
  "aluminum can": {
    path: "Recycle after emptying",
    baseRisk: 18,
    baseDiversion: 16,
    baseSavings: 300,
    impact:
      "Metal containers are valuable when captured cleanly and are strong candidates for measurable diversion wins.",
    action:
      "Target concession areas and beverage stations with clear recycling bins and contamination checks.",
    reasoning:
      "Aluminum is one of the clearest recovery opportunities if users are prompted to empty and separate it properly.",
    mistakes: [
      "Cans are discarded with leftover liquid.",
      "Users combine metal containers with food trays and napkins.",
      "Recycling stations are too far from drink-heavy zones.",
    ],
    signage: [
      "Empty cans before recycling.",
      "Metal only in this stream.",
      "Keep food waste and napkins out.",
    ],
  },
};

const samplePresets = {
  dining: {
    location: "campus",
    zone: "dining",
    itemType: "greasy pizza box",
    material: "paper",
    residue: "high",
    volume: 120,
  },
  dorm: {
    location: "campus",
    zone: "dorm",
    itemType: "batteries",
    material: "hazardous",
    residue: "low",
    volume: 40,
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
  imageData: {
    name: null,
    width: 0,
    height: 0,
    brightness: 0,
    loaded: false,
  },
  currentSignage: [],
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatMoney(amount) {
  return `$${Math.round(amount).toLocaleString()}`;
}

function riskLabel(score) {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

function confidenceLabel(score) {
  if (score >= 88) return `${score}% confidence - strong match`;
  if (score >= 72) return `${score}% confidence - likely correct`;
  return `${score}% confidence - needs operator review`;
}

function updateVolumeReadout() {
  els.volumeReadout.textContent = `${els.volume.value} items/week`;
}

function updateZoneMap(activeZone) {
  els.zoneMap.querySelectorAll(".zone-node").forEach((node) => {
    node.classList.toggle("active", node.dataset.zone === activeZone);
  });
  els.zoneSummary.textContent = zoneProfiles[activeZone].summary;
}

function renderMistakes(mistakes, zoneLabel) {
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

function renderSignage(signage, zoneLabel) {
  state.currentSignage = signage;
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

function readImageMeta(file) {
  if (!file) {
    state.imageData = {
      name: null,
      width: 0,
      height: 0,
      brightness: 0,
      loaded: false,
    };
    els.scanSignal.textContent = "No photo analyzed";
    els.scanConfidence.textContent = "Ready";
    return;
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);

    const sampleWidth = Math.min(48, image.width);
    const sampleHeight = Math.min(48, image.height);
    const pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;

    let total = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      total += (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
    }

    state.imageData = {
      name: file.name,
      width: image.width,
      height: image.height,
      brightness: Math.round(total / (pixels.length / 4)),
      loaded: true,
    };

    els.scanSignal.textContent = `${file.name} analyzed`;
    els.scanConfidence.textContent = "Local analysis ready";
    URL.revokeObjectURL(objectUrl);
  };

  image.src = objectUrl;
}

function getImageSignal() {
  if (!state.imageData.loaded) {
    return {
      signal: "No photo analyzed",
      confidenceBoost: 0,
      reasoning:
        "No waste image was provided, so the analysis is based on item type, residue level, material profile, and location context.",
    };
  }

  if (state.imageData.brightness < 85) {
    return {
      signal: `Dark image (${state.imageData.width}x${state.imageData.height})`,
      confidenceBoost: -4,
      reasoning:
        "Lower lighting usually means the image gives weaker visual clues, so location and contamination context matter more.",
    };
  }

  if (state.imageData.height > state.imageData.width) {
    return {
      signal: `Portrait item image (${state.imageData.width}x${state.imageData.height})`,
      confidenceBoost: 8,
      reasoning:
        "A portrait image usually focuses tightly on a single object, which improves confidence in the item-specific decision.",
    };
  }

  return {
    signal: `Wide station image (${state.imageData.width}x${state.imageData.height})`,
    confidenceBoost: 4,
    reasoning:
      "A wider image usually gives more context about the station or nearby contamination patterns, which helps with signage recommendations.",
  };
}

function buildAnalysis() {
  const location = locationProfiles[els.location.value];
  const zone = zoneProfiles[els.zone.value];
  const item = itemProfiles[els.itemType.value];
  const material = materialProfiles[els.material.value];
  const residue = residueProfiles[els.residue.value];
  const volume = Number(els.volume.value);
  const imageSignal = getImageSignal();

  const riskScore = clamp(
    item.baseRisk +
      location.risk +
      zone.risk +
      residue.risk +
      material.risk -
      imageSignal.confidenceBoost,
    8,
    98
  );

  const diversionLift = clamp(
    item.baseDiversion +
      location.diversion +
      residue.diversion +
      Math.round(volume / 30) +
      Math.max(0, Math.round(imageSignal.confidenceBoost / 4)),
    2,
    45
  );

  const monthlySavings =
    item.baseSavings * location.savings * (volume / 60) * (1 + zone.risk / 100);
  const landfillAvoided = clamp(Math.round(diversionLift * 1.6), 6, 72);
  const before = clamp(42 - Math.round(riskScore / 4), 10, 68);
  const after = clamp(before + diversionLift, 18, 95);
  const confidence = clamp(
    70 +
      Math.round((100 - riskScore) / 6) +
      imageSignal.confidenceBoost +
      (material.risk <= 4 ? 5 : 0),
    58,
    96
  );

  return {
    title: `${item.path.includes("Hazardous") ? "Hazard" : "Waste"} routing report`,
    status: "Local analysis active",
    description:
      `${location.label}, ${zone.label}: ${els.itemType.value} with ${residue.label.toLowerCase()} in a ` +
      `${material.label.toLowerCase()} profile. LoopLens uses local waste rules and contamination heuristics to recommend the strongest disposal path and intervention strategy.`,
    path: item.path,
    risk: riskLabel(riskScore),
    diversion: `+${diversionLift}%`,
    savings: formatMoney(monthlySavings),
    impactSummary:
      `${item.impact} In this ${zone.label.toLowerCase()} deployment, the strongest gains come from reducing repeat sorting mistakes before they contaminate the stream.`,
    actionSummary:
      `${item.action} ${material.note} At the current weekly volume, this area represents a ${formatMoney(monthlySavings)} monthly recovery opportunity.`,
    reasoningSummary:
      `${item.reasoning} ${imageSignal.reasoning} LoopLens combines item type, residue level, zone pressure, and material rules to generate this recommendation.`,
    confidenceSummary:
      `${confidenceLabel(confidence)} This result is generated by the public rules-based LoopLens engine, so anyone can use it without a paid backend.`,
    chartCaption:
      `${volume} items per week in ${zone.label.toLowerCase()} could shift recovery performance within the first month if the recommended changes are adopted.`,
    scanSignal: imageSignal.signal,
    scanConfidence: confidenceLabel(confidence),
    mistakes: item.mistakes,
    signage: item.signage,
    bars: {
      before,
      after,
      avoided: landfillAvoided,
    },
  };
}

function renderAnalysis(analysis) {
  const zoneLabel = zoneProfiles[els.zone.value].label;
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
  els.scanSignal.textContent = analysis.scanSignal;
  els.scanConfidence.textContent = analysis.scanConfidence;
  els.barBefore.style.width = `${analysis.bars.before}%`;
  els.barAfter.style.width = `${analysis.bars.after}%`;
  els.barAvoided.style.width = `${analysis.bars.avoided}%`;
  renderMistakes(analysis.mistakes, zoneLabel);
  renderSignage(analysis.signage, zoneLabel);
}

function runAnalysis() {
  renderAnalysis(buildAnalysis());
}

function applyPreset(presetKey) {
  const preset = samplePresets[presetKey];
  if (!preset) return;

  els.location.value = preset.location;
  els.zone.value = preset.zone;
  els.itemType.value = preset.itemType;
  els.material.value = preset.material;
  els.residue.value = preset.residue;
  els.volume.value = preset.volume;
  updateVolumeReadout();
  updateZoneMap(preset.zone);
  runAnalysis();
}

function downloadSignage() {
  const zoneLabel = zoneProfiles[els.zone.value].label;
  const text = [
    "LoopLens signage pack",
    `Zone: ${zoneLabel}`,
    `Location: ${locationProfiles[els.location.value].label}`,
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

els.volume.addEventListener("input", () => {
  updateVolumeReadout();
  runAnalysis();
});

els.upload.addEventListener("change", (event) => {
  const file = event.target.files[0];
  renderImagePreview(file);
  readImageMeta(file);
  setTimeout(runAnalysis, 50);
});

els.analyzeButton.addEventListener("click", runAnalysis);
els.downloadSignage.addEventListener("click", downloadSignage);

[els.location, els.zone, els.itemType, els.material, els.residue].forEach(
  (element) => {
    element.addEventListener("change", () => {
      updateZoneMap(els.zone.value);
      runAnalysis();
    });
  }
);

document.querySelectorAll("[data-sample]").forEach((button) => {
  button.addEventListener("click", () => {
    applyPreset(button.dataset.sample);
  });
});

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
    runAnalysis();
  });
});

updateVolumeReadout();
updateZoneMap(els.zone.value);
runAnalysis();
