/* ============================================================
   JITTERBYTES — script.js
   Only edit the PROJECT DATA block below.
   ============================================================ */

// ────────────────────────────────────────────────────────────
//  PROJECT DATA  ← edit this
// ────────────────────────────────────────────────────────────
const projects = [
  {
    id: "project1 parking",
    name: "Parking Occupancy System",
    short: "Real-time vehicle presence detection using embedded sensing",
    type: "IoT / Embedded",
    platform: "ESP32",
    tags: ["ESP32", "C", "MQTT", "Sensor Fusion"],
    status: "done",    // done | wip | archived
    year: "2024",
    problem: "Parking lots have no real-time occupancy data. Drivers waste time circling. Operators are blind. The goal was a low-cost embedded system that detects vehicle presence accurately under real-world conditions — vibration, weather, varying light.",
    approach: "Sensor fusion combining IR and ultrasonic readings, feeding into a debounce + threshold filter to cut false triggers. Data published over MQTT. Firmware in C with a per-slot state machine keeping logic deterministic and debuggable.",
    hardware: ["ESP32", "HC-SR04", "IR Proximity Sensor", "MQTT Broker", "Custom PCB"],
    challenges: "Ground vibration from passing vehicles would occasionally trigger sensors. Solved with a moving-average filter and a minimum-hold timer. Power supply noise on analog lines required hardware-level decoupling.",
    result: "Stable detection with <2% false-trigger rate over a 2-week field test. Runs continuously on 5V rail with no observed failures.",
    github: ""
  },
  {
    id: "project2 fpga-uart",
    name: "FPGA UART Core",
    short: "Hardware UART implementation in VHDL",
    type: "FPGA / RTL",
    platform: "Xilinx Artix-7",
    tags: ["VHDL", "Xilinx", "Serial"],
    status: "wip",
    year: "2025",
    problem: "...",
    approach: "...",
    hardware: ["Artix-7 Dev Board", "JTAG"],
    challenges: "...",
    result: "...",
    github: ""
  }
];


// ────────────────────────────────────────────────────────────
//  NAVIGATION
// ────────────────────────────────────────────────────────────
function navigate(page) {
  const p = document.querySelector('.page');
  if (p) {
    p.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
    p.style.opacity = '0';
    p.style.transform = 'translateY(6px)';
  }
  setTimeout(() => { window.location.href = page; }, 230);
}

// Active nav state
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  initProjectsGrid();
  initProjectDetail();
});


// ────────────────────────────────────────────────────────────
//  PROJECTS GRID — projects.html
// ────────────────────────────────────────────────────────────
function initProjectsGrid() {
  const grid = document.getElementById('project-grid');
  if (!grid) return;

  const statusLabel = { done: 'Complete', wip: 'In Progress', archived: 'Archived' };
  const statusClass = { done: 'status-done', wip: 'status-wip', archived: 'status-archived' };

  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', p.name);
    card.style.animationDelay = `${i * 0.07}s`;

    card.innerHTML = `
      <div class="project-card-ref">
        <span class="project-card-ref-box">J${String(i + 1).padStart(2, '0')}</span>
        ${p.type}
      </div>
      <div class="project-card-name">${p.name}</div>
      <div class="project-card-desc">${p.short}</div>
      <div class="project-card-footer">
        <div class="project-card-tags">
          ${p.tags.slice(0, 3).map(t => `<span class="project-card-tag">${t}</span>`).join('')}
        </div>
        <span class="project-status ${statusClass[p.status]}">${statusLabel[p.status]}</span>
      </div>
    `;

    card.addEventListener('click', () => openProject(p.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openProject(p.id); });
    grid.appendChild(card);
  });
}


// ────────────────────────────────────────────────────────────
//  PROJECT DETAIL — project-template.html
// ────────────────────────────────────────────────────────────
function initProjectDetail() {
  const wrap = document.getElementById('project-detail');
  if (!wrap) return;

  const id = localStorage.getItem('projectId');
  const p = projects.find(x => x.id === id);

  if (!p) {
    wrap.innerHTML = `<p class="detail-desc">Project not found.</p>`;
    return;
  }

  document.title = `${p.name} | Jitterbytes`;

  const statusLabel = { done: 'Complete', wip: 'In Progress', archived: 'Archived' };
  const statusClass = { done: 'status-done', wip: 'status-wip', archived: 'status-archived' };

  wrap.innerHTML = `
    <span class="detail-back" onclick="navigate('projects.html')">← /projects</span>

    <h1 class="detail-title">${p.name}</h1>
    <p class="detail-desc">${p.short}</p>

    <div class="detail-meta-bar">
      <div class="detail-meta-item">
        <div class="detail-meta-label">Type</div>
        <div class="detail-meta-value">${p.type}</div>
      </div>
      <div class="detail-meta-item">
        <div class="detail-meta-label">Platform</div>
        <div class="detail-meta-value">${p.platform}</div>
      </div>
      <div class="detail-meta-item">
        <div class="detail-meta-label">Year</div>
        <div class="detail-meta-value">${p.year}</div>
      </div>
      <div class="detail-meta-item">
        <div class="detail-meta-label">Status</div>
        <div class="detail-meta-value ${statusClass[p.status]}">${statusLabel[p.status]}</div>
      </div>
    </div>

    <div class="detail-sections">
      <div class="detail-block">
        <div class="detail-block-label">Problem</div>
        <div class="detail-block-body">${p.problem}</div>
      </div>
      <div class="detail-block">
        <div class="detail-block-label">Approach</div>
        <div class="detail-block-body">${p.approach}</div>
      </div>
      <div class="detail-block">
        <div class="detail-block-label">Hardware</div>
        <div class="hw-chips">${p.hardware.map(h => `<span class="hw-chip">${h}</span>`).join('')}</div>
      </div>
      <div class="detail-block">
        <div class="detail-block-label">Challenges</div>
        <div class="detail-block-body">${p.challenges}</div>
      </div>
      <div class="detail-block">
        <div class="detail-block-label">Result</div>
        <div class="detail-block-body">${p.result}</div>
      </div>
    </div>

    ${p.github ? `<div class="detail-github"><a class="btn btn-primary" href="${p.github}" target="_blank">View on GitHub →</a></div>` : ''}
  `;
}


// ────────────────────────────────────────────────────────────
//  OPEN PROJECT
// ────────────────────────────────────────────────────────────
function openProject(id) {
  localStorage.setItem('projectId', id);
  navigate('project-template.html');
}