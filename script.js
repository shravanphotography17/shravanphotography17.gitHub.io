const chat = document.getElementById("chat");
const userInput = document.getElementById("userInput");

const gstSlabs = {
  zero: ["insurance", "life policy", "health insurance", "medicine", "education", "milk", "bread", "paneer", "chapati", "roti"],
  five: ["agriculture", "fertilizer", "packaged food", "processed food", "bicycle", "tableware", "shampoo", "toothpaste", "toothbrush", "restaurant", "hotel"],
  eighteen: ["electronics", "motors", "automobile", "tv", "washing machine", "ac", "soaps", "cosmetics", "furniture"],
  forty: ["tobacco", "cigarette", "pan masala", "alcohol", "aerated drinks", "luxury car"]
};

const incomeTaxSlabs = [
  { upto: 250000, rate: 0 },
  { upto: 500000, rate: 5 },
  { upto: 750000, rate: 10 },
  { upto: 1000000, rate: 15 },
  { upto: 1250000, rate: 20 },
  { upto: 1500000, rate: 25 },
  { upto: Infinity, rate: 30 }
];

function addMessage(text, sender = "bot") {
  const message = document.createElement("div");
  message.className = "message " + sender;
  message.innerHTML = `<div class="bubble">${text}</div>`;
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

function gstRateFor(item) {
  item = item.toLowerCase().trim();
  for (let [rate, items] of Object.entries(gstSlabs)) {
    if (items.some(keyword => item.includes(keyword))) {
      switch(rate) {
        case 'zero': return 0;
        case 'five': return 5;
        case 'eighteen': return 18;
        case 'forty': return 40;
      }
    }
  }
  return 18; // default GST slab
}

function calculateGST(amount, rate) {
  let gst = (amount * rate) / 100;
  let total = amount + gst;
  return { gst, total };
}

function calculateIncomeTax(income) {
  let tax = 0;
  let lastLimit = 0;
  for (let slab of incomeTaxSlabs) {
    if (income > slab.upto) {
      tax += (slab.upto - lastLimit) * slab.rate / 100;
      lastLimit = slab.upto;
    } else {
      tax += (income - lastLimit) * slab.rate / 100;
      break;
    }
  }
  return tax;
}

function handleUserMessage(msg) {
  msg = msg.toLowerCase();

  // GST calculation
  let gstMatch = msg.match(/gst.*?(d+)/);
  if (gstMatch) {
    let amount = parseInt(gstMatch[1]);
    let item = msg.replace(/gst|calculate|tax|amount|d+/g, '').trim();
    let rate = gstRateFor(item);
    let result = calculateGST(amount, rate);
    addMessage(`
      <b>GST Calculation:</b><br>
      Item: ${item || 'Not specified'}<br>
      Amount (₹): ${amount.toLocaleString()}<br>
      GST Rate: ${rate}%<br>
      GST Amount: ₹${result.gst.toLocaleString()}<br>
      Total Amount: ₹${result.total.toLocaleString()}<br>
      <small>Based on Finance Ministry 2025 GST reforms.</small>
    `);
    return;
  }

  // Income tax calculation
  let incomeMatch = msg.match(/income.*?(d+)/);
  if (incomeMatch) {
    let income = parseInt(incomeMatch[1]);
    let tax = calculateIncomeTax(income);
    addMessage(`
      <b>Income Tax Estimation:</b><br>
      Annual Income (₹): ${income.toLocaleString()}<br>
      Estimated Tax (₹): ${tax.toLocaleString()}<br>
      <small>Following latest Income Tax slabs (2025-26).</small>
    `);
    return;
  }

  // Budget planner request
  if(msg.includes("budget")) {
    addMessage(`
      <b>Budget Planner</b><br>
      Please enter your monthly or annual income to get a budget plan including tax, savings, and expenses.
      Example: "Budget for monthly income 50000".
    `);
    return;
  }

  // Ministry news/request
  if(msg.includes("news") || msg.includes("update") || msg.includes("finance ministry")) {
    addMessage(`
      <b>Latest Finance Ministry Updates (2025):</b><br>
      - Simplified GST slabs of 0%, 5%, 18%, and 40% introduced.<br>
      - Major sectors like health, education made GST exempt or lowest rate.<br>
      - Income Tax slabs updated for FY 2025-26.<br>
      - GST Appellate Tribunal operational from Sept 2025.<br>
      See <a href="https://incometaxindia.gov.in/pages/tax-laws-rules.aspx" target="_blank">Income Tax Laws</a> and <a href="https://financialservices.gov.in/beta/en" target="_blank">Finance Ministry Portal</a>.
    `);
    return;
  }

  // Help fallback
  addMessage(`
    Hi! I can help with:<br>
    - GST calculations (e.g. "GST on 1000 shampoo")<br>
    - Income tax estimations (e.g. "Income tax 1200000")<br>
    - Budget planner<br>
    - Finance Ministry updates<br>
    Please ask me any question related to taxes!
  `);
}

function sendMessage() {
  let msg = userInput.value.trim();
  if (!msg) return;
  addMessage(msg, "user");
  userInput.value = "";
  setTimeout(() => handleUserMessage(msg), 600);
}

userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

window.onload = function () {
  addMessage("Hello! I am your India Tax & GST AI Chatbot. Ask me anything about GST, Income Tax, or budgeting.");
};
