/* ============================================================
   JITTERBYTES — script.js
   Edit the PROJECT DATA section to add/update your projects.
   Everything else runs automatically.
   ============================================================ */

// ============================================================
// PROJECT DATA — edit this
// ============================================================
const projects = [
  {
    id: "parking",
    name: "Parking Occupancy System",
    short: "Real-time vehicle detection using embedded sensing",
    type: "IoT / Embedded",
    platform: "ESP32",
    tags: ["ESP32", "C", "MQTT"],
    status: "done",            // done | wip | archived
    year: "2024",
    problem: "Parking lots in dense urban areas have no real-time occupancy data. Drivers waste time circling, and operators have no visibility. The goal was a low-cost, reliable embedded system that could detect vehicle presence accurately under real-world conditions — vibration, weather, varying light.",
    approach: "Deployed sensor fusion combining IR and ultrasonic readings, feeding into a debounce + threshold filter to eliminate false triggers. Data is published over MQTT to a lightweight broker. The firmware was written in C with a custom state machine for each slot, keeping the logic deterministic and easy to debug.",
    hardware: ["ESP32", "HC-SR04", "IR Proximity Sensor", "MQTT Broker", "Custom PCB"],
    challenges: "Noise was the biggest adversary — ground vibration from passing vehicles would occasionally trigger sensors. Solved with a moving-average filter and a minimum-occupancy hold timer. Power supply noise on the analog lines also required hardware-level decoupling.",
    result: "Stable detection with <2% false-trigger rate over a 2-week field test. System runs continuously on a 5V rail with no observed failures.",
    github: ""  // leave empty to hide
  }
  // Add more projects here:
  // {
  //   id: "fpga-uart",
  //   name: "FPGA UART Controller",
  //   short: "Hardware UART core in VHDL",
  //   type: "FPGA / RTL",
  //   platform: "Xilinx Artix-7",
  //   tags: ["VHDL", "Xilinx", "Serial"],
  //   status: "wip",
  //   year: "2025",
  //   problem: "...",
  //   approach: "...",
  //   hardware: ["Artix-7", "JTAG"],
  //   challenges: "...",
  //   result: "...",
  //   github: ""
  // }
];


// ============================================================
// NAVIGATION
// ============================================================
function navigate(page) {
  document.querySelector('.page').style.opacity = '0';
  document.querySelector('.page').style.transform = 'translateY(6px)';
  document.querySelector('.page').style.transition = 'all 0.25s ease';
  setTimeout(() => { window.location.href = page; }, 250);
}

// Active nav link
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
});


// ============================================================
// WAVEFORM BACKGROUND
// ============================================================
function initWave() {
  const canvas = document.getElementById('wave-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let t = 0;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = 120;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#e8a020';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#e8a020';
    ctx.shadowBlur = 4;
    ctx.beginPath();

    const w = canvas.width;
    const h = canvas.height;
    const mid = h * 0.5;

    for (let x = 0; x <= w; x++) {
      const freq1 = 0.008;
      const freq2 = 0.02;
      const freq3 = 0.005;
      const y = mid
        + Math.sin(x * freq1 + t * 0.8)  * 18
        + Math.sin(x * freq2 + t * 1.3)  * 8
        + Math.sin(x * freq3 + t * 0.4)  * 12;

      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // second trace — dimmer
    ctx.strokeStyle = 'rgba(232,160,32,0.25)';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    for (let x = 0; x <= w; x++) {
      const y = mid
        + Math.sin(x * 0.012 + t * 0.5 + 1.2) * 14
        + Math.sin(x * 0.03  + t * 0.9)         * 5;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    t += 0.015;
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}


// ============================================================
// PROJECTS LIST — projects.html
// ============================================================
function initProjectsList() {
  const container = document.getElementById('dir-body');
  if (!container) return;

  projects.forEach(p => {
    const row = document.createElement('div');
    row.className = 'dir-row';
    row.setAttribute('role', 'row');
    row.setAttribute('tabindex', '0');

    const statusClass = { done: 'status-done', wip: 'status-wip', archived: 'status-arch' }[p.status] || '';
    const statusLabel = { done: 'COMPLETE', wip: 'IN PROGRESS', archived: 'ARCHIVED' }[p.status] || '';

    row.innerHTML = `
      <div class="dir-icon">[D]</div>
      <div class="dir-name">${p.name}</div>
      <div class="dir-type">${p.type}</div>
      <div class="dir-tags">${p.tags.map(t => `<span class="dir-tag">${t}</span>`).join('')}</div>
      <div class="dir-status ${statusClass}">${statusLabel}</div>
    `;

    row.addEventListener('click', () => openProject(p.id));
    row.addEventListener('keydown', e => { if (e.key === 'Enter') openProject(p.id); });
    container.appendChild(row);
  });
}


// ============================================================
// PROJECT DETAIL — project-template.html
// ============================================================
function initProjectDetail() {
  const container = document.getElementById('project-detail');
  if (!container) return;

  const id = localStorage.getItem('projectId');
  const p  = projects.find(x => x.id === id);

  if (!p) {
    container.innerHTML = `<p class="detail-subtitle">Project not found.</p>`;
    return;
  }

  document.title = `${p.name} | Jitterbytes`;

  const hwChips = p.hardware.map(h => `<span class="hw-chip">${h}</span>`).join('');
  const githubBtn = p.github
    ? `<a class="btn btn-primary" href="${p.github}" target="_blank"><span>// View on GitHub</span></a>`
    : '';

  container.innerHTML = `
    <span class="detail-back" onclick="navigate('projects.html')">← back to /projects</span>

    <h1 class="detail-title">${p.name}</h1>
    <p class="detail-subtitle">${p.short}</p>

    <div class="detail-meta">
      <div class="detail-meta-item">
        <span class="detail-meta-label">Type</span>
        <span class="detail-meta-value">${p.type}</span>
      </div>
      <div class="detail-meta-item">
        <span class="detail-meta-label">Platform</span>
        <span class="detail-meta-value">${p.platform}</span>
      </div>
      <div class="detail-meta-item">
        <span class="detail-meta-label">Year</span>
        <span class="detail-meta-value">${p.year}</span>
      </div>
      <div class="detail-meta-item">
        <span class="detail-meta-label">Status</span>
        <span class="detail-meta-value ${{ done:'status-done', wip:'status-wip', archived:'status-arch' }[p.status]}">${
          { done:'Complete', wip:'In Progress', archived:'Archived' }[p.status]
        }</span>
      </div>
    </div>

    <div class="detail-sections">
      <div class="detail-block">
        <div class="detail-block-title">// Problem</div>
        <div class="detail-block-body">${p.problem}</div>
      </div>
      <div class="detail-block">
        <div class="detail-block-title">// Approach</div>
        <div class="detail-block-body">${p.approach}</div>
      </div>
      <div class="detail-block">
        <div class="detail-block-title">// Hardware &amp; Stack</div>
        <div class="hw-chips">${hwChips}</div>
      </div>
      <div class="detail-block">
        <div class="detail-block-title">// Challenges</div>
        <div class="detail-block-body">${p.challenges}</div>
      </div>
      <div class="detail-block">
        <div class="detail-block-title">// Result</div>
        <div class="detail-block-body">${p.result}</div>
      </div>
    </div>

    <div class="detail-github">
      ${githubBtn}
    </div>
  `;
}


// ============================================================
// OPEN PROJECT
// ============================================================
function openProject(id) {
  localStorage.setItem('projectId', id);
  navigate('project-template.html');
}


// ============================================================
// BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initWave();
  initProjectsList();
  initProjectDetail();
});