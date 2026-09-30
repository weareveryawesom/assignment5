// NYC Payroll Interactive Prototype - Assignment 5
// Shows borough pay differences and overtime spending

let data = [
  { borough: "MANHATTAN", count: 2906, medianBase: 85453, totalBase: 269.0, totalReg: 252.0, totalOT: 40.6, avgOTHours: 195, medOTHours: 58, avgPay: 109357, col: [237, 201, 72] },
  { borough: "BROOKLYN",  count: 2287, medianBase: 105606, totalBase: 227.7, totalReg: 213.1, totalOT: 29.6, avgOTHours: 207, medOTHours: 116, avgPay: 114975, col: [242, 142, 43] },
  { borough: "QUEENS",    count: 1646, medianBase: 58746, totalBase: 124.8, totalReg: 108.5, totalOT: 20.2, avgOTHours: 198, medOTHours: 139, avgPay: 86500,  col: [118, 183, 178] },
  { borough: "BRONX",     count: 864,  medianBase: 60363, totalBase: 70.5,  totalReg: 66.0,  totalOT: 17.2, avgOTHours: 295, medOTHours: 276, avgPay: 108477, col: [160, 32, 60] },
  { borough: "RICHMOND",  count: 177,  medianBase: 83820, totalBase: 15.3,  totalReg: 14.8,  totalOT: 3.5,  avgOTHours: 285, medOTHours: 268, avgPay: 115952, col: [78, 121, 167] }
];

let mode = "total"; // "total", "base", or "worker"
let currentHeights = [0, 0, 0, 0, 0];
let targetHeights = [0, 0, 0, 0, 0];
let hoverIndex = -1;

function setup() {
  createCanvas(850, 540);
  updateTargets();
}

function updateTargets() {
  for (let i = 0; i < data.length; i++) {
    if (mode === "total") {
      targetHeights[i] = data[i].totalReg + data[i].totalOT; // Total paid ($M)
    } else if (mode === "base") {
      targetHeights[i] = data[i].totalBase; // Contract base budget ($M)
    } else if (mode === "worker") {
      targetHeights[i] = data[i].avgPay / 1000; // In thousands ($k)
    }
  }
}

function draw() {
  background(248);
  hoverIndex = -1;

  // Title and subtitle (alignment locked to prevent shifting)
  fill(30);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(18);
  textStyle(BOLD);
  text("NYC Payroll: Borough Pay and Overtime Breakdown", 40, 30);

  textSize(12);
  textStyle(NORMAL);
  fill(100);
  text("Click a button to switch the metric. Hover over any bar to see borough details.", 40, 52);

  // Buttons
  drawButtons();

  // Chart layout
  let startX = 80;
  let groundY = 440;
  let chartW = 700;
  let chartH = 280;

  // Smooth transition animation
  for (let i = 0; i < data.length; i++) {
    currentHeights[i] = lerp(currentHeights[i], targetHeights[i], 0.15);
  }

  // Draw grid lines
  let maxLimit = mode === "worker" ? 140 : 320;
  let step = mode === "worker" ? 20 : 80;
  let labelUnit = mode === "worker" ? "k" : "M";

  stroke(225);
  strokeWeight(1);
  line(startX, groundY, startX + chartW, groundY);

  textAlign(RIGHT, CENTER);
  textSize(11);
  fill(120);
  noStroke();

  for (let v = 0; v <= maxLimit; v += step) {
    let yPos = map(v, 0, maxLimit, groundY, groundY - chartH);
    stroke(235);
    line(startX, yPos, startX + chartW, yPos);
    noStroke();
    text("$" + v + labelUnit, startX - 8, yPos);
  }

  // Draw bars
  let slotW = chartW / data.length;
  let barW = slotW * 0.55;

  for (let i = 0; i < data.length; i++) {
    let x = startX + i * slotW + (slotW - barW) / 2;
    let barH = map(currentHeights[i], 0, maxLimit, 0, chartH);
    let y = groundY - barH;

    // Check hover
    if (mouseX >= x && mouseX <= x + barW && mouseY >= y && mouseY <= groundY) {
      hoverIndex = i;
    }

    // Main bar
    fill(data[i].col[0], data[i].col[1], data[i].col[2]);
    stroke(255);
    strokeWeight(1);
    rect(x, y, barW, barH, 3, 3, 0, 0);

    // Overtime stack on top (only in total view)
    if (mode === "total") {
      let otFraction = data[i].totalOT / (data[i].totalReg + data[i].totalOT);
      let otH = barH * otFraction;
      fill(255, 110, 40, 210);
      rect(x, y, barW, otH, 3, 3, 0, 0);
    }

    // Borough name under bar
    noStroke();
    fill(60);
    textSize(11);
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text(data[i].borough, x + barW / 2, groundY + 10);
  }

  // Draw hover tooltip
  if (hoverIndex !== -1) {
    drawTooltip(hoverIndex);
  }
}

function drawButtons() {
  let btns = [
    { id: "total", text: "Total Payroll (Reg + Overtime)" },
    { id: "base",  text: "Base Salary Budget" },
    { id: "worker", text: "Avg Earnings per Worker" }
  ];

  let btnX = 40;
  let btnY = 75;
  let btnH = 26;

  for (let i = 0; i < btns.length; i++) {
    let btnW = textWidth(btns[i].text) + 24;
    let active = (mode === btns[i].id);

    fill(active ? color(50, 90, 160) : color(230));
    stroke(active ? color(50, 90, 160) : color(200));
    strokeWeight(1);
    rect(btnX, btnY, btnW, btnH, 5);

    noStroke();
    fill(active ? 255 : 70);
    textSize(11);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(btns[i].text, btnX + btnW / 2, btnY + btnH / 2);

    btnX += btnW + 10;
  }
}

function drawTooltip(index) {
  let d = data[index];
  let tipW = 230;
  let tipH = 130;
  let tipX = mouseX + 15;
  let tipY = mouseY - 60;

  if (tipX + tipW > width - 15) tipX = mouseX - tipW - 15;
  if (tipY < 40) tipY = 40;

  fill(25, 30, 40, 235);
  noStroke();
  rect(tipX, tipY, tipW, tipH, 6);

  fill(255);
  textAlign(LEFT, TOP);
  textSize(12);
  textStyle(BOLD);
  text(d.borough + " STATS", tipX + 12, tipY + 12);

  textStyle(NORMAL);
  textSize(11);
  fill(210);
  text("Employees: " + d.count.toLocaleString(), tipX + 12, tipY + 34);
  text("Median Base Salary: $" + d.medianBase.toLocaleString(), tipX + 12, tipY + 52);
  text("Base Budget: $" + d.totalBase.toFixed(1) + "M", tipX + 12, tipY + 70);
  text("Overtime Paid: $" + d.totalOT.toFixed(1) + "M", tipX + 12, tipY + 88);
  fill(255, 170, 70);
  text("Median OT: " + d.medOTHours + " hrs (Mean: " + d.avgOTHours + " hrs)", tipX + 12, tipY + 106);
}

function mousePressed() {
  let btns = [
    { id: "total", text: "Total Payroll (Reg + Overtime)" },
    { id: "base",  text: "Base Salary Budget" },
    { id: "worker", text: "Avg Earnings per Worker" }
  ];

  let btnX = 40;
  let btnY = 75;
  let btnH = 26;

  for (let i = 0; i < btns.length; i++) {
    let btnW = textWidth(btns[i].text) + 24;
    if (mouseX >= btnX && mouseX <= btnX + btnW && mouseY >= btnY && mouseY <= btnY + btnH) {
      mode = btns[i].id;
      updateTargets();
      break;
    }
    btnX += btnW + 10;
  }
}