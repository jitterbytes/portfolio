// NAVIGATION
function navigate(page) {
  document.body.style.opacity = 0;
  setTimeout(() => {
    window.location.href = page;
  }, 300);
}

// PROJECT DATA (EDIT THIS ONLY)
const projects = [
  {
    id: "parking",
    name: "Parking Occupancy System",
    desc: "Real-time vehicle detection using embedded sensing",
    problem: "Detect vehicle presence reliably in real-world conditions",
    approach: "Used sensor fusion + filtering logic",
    hardware: "ESP32, sensors",
    challenges: "Noise, false triggers",
    result: "Stable detection achieved"
  }
];

// LOAD PROJECT LIST
const container = document.getElementById("projects-container");
if (container) {
  projects.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>[ ${p.name} ]</h3>
      <p>> ${p.desc}</p>
      <p onclick="openProject('${p.id}')">> ACCESS LOG</p>
      <hr/>
    `;
    container.appendChild(div);
  });
}

// OPEN PROJECT
function openProject(id) {
  localStorage.setItem("projectId", id);
  navigate("project-template.html");
}

// LOAD PROJECT DETAIL
const detail = document.getElementById("project-detail");
if (detail) {
  const id = localStorage.getItem("projectId");
  const p = projects.find(x => x.id === id);

  detail.innerHTML = `
    <h1>[ ${p.name} ]</h1>
    <p>> ${p.desc}</p>

    <h3>[ PROBLEM ]</h3>
    <p>${p.problem}</p>

    <h3>[ APPROACH ]</h3>
    <p>${p.approach}</p>

    <h3>[ HARDWARE ]</h3>
    <p>${p.hardware}</p>

    <h3>[ CHALLENGES ]</h3>
    <p>${p.challenges}</p>

    <h3>[ RESULT ]</h3>
    <p>${p.result}</p>
  `;
}

// GRID BACKGROUND
const canvas = document.getElementById("grid");
if (canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  function drawGrid() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.strokeStyle = "rgba(0,255,156,0.1)";

    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x,0);
      ctx.lineTo(x,canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0,y);
      ctx.lineTo(canvas.width,y);
      ctx.stroke();
    }
  }

  drawGrid();
}