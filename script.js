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


const chat = document.getElementById("chat");
const userInput = document.getElementById("userInput");

// GST slabs data for 2025 reform
const gstSlabs = {
  zero: ["insurance", "life policy", "health insurance", "medicine", "education", "milk", "bread", "paneer", "roti", "chapati"],
  five: ["agriculture", "fertilizer", "processed food", "hotel", "restaurant", "cosmetics", "salon", "shampoo", "toothpaste", "bicycle", "kitchenware", "handicraft"],
  eighteen: ["electronics", "automobile", "tv", "furniture", "motors", "ac", "small car", "motorbike", "software"],
  forty: ["tobacco", "cigarette", "pan masala", "aerated drinks", "alcohol", "luxury car"]
};
// Income Tax Slabs FY 2025-26 (AY 2026-27) - new regime
const incomeTaxSlabs = [
  { upto: 300000, rate: 0 },
  { upto: 700000, rate: 5 },
  { upto: 1000000, rate: 10 },
  { upto: 1200000, rate: 15 },
  { upto: 1500000, rate: 20 },
  { upto: Infinity, rate: 30 }
];

function addMessage(text, sender = "bot") {
  const div = document.createElement("div");
  div.className = "message " + sender;
  div.innerHTML = `<span class="icon">${sender === "bot" ? "🤖" : "👤"}</span><div>${text}</div>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function guessGSTRate(item) {
  item = item.toLowerCase();
  for (const tier in gstSlabs) {
    if (gstSlabs[tier].some(term => item.includes(term))) {
      return tier === "zero" ? 0 : tier === "five" ? 5 : tier === "eighteen" ? 18 : 40;
    }
  }
  return 18;
}

function calculateGST(amount, rate) {
  const gstAmount = ((amount * rate) / 100).toFixed(2);
  return { gstAmount, total: (amount + parseFloat(gstAmount)).toFixed(2) };
}

function calculateIncomeTax(income) {
  let tax = 0;
  let prev = 0;
  for (const slab of incomeTaxSlabs) {
    if (income > slab.upto) {
      tax += ((slab.upto - prev) * slab.rate) / 100;
      prev = slab.upto;
    } else {
      tax += ((income - prev) * slab.rate) / 100;
      break;
    }
  }
  return tax.toFixed(2);
}

function handleUserInput(input) {
  input = input.toLowerCase();

  if (/gst/.test(input) && /d/.test(input)) {
    const amountMatch = input.match(/d+(,d+)?(.d+)?/);
    if (!amountMatch) {
      addMessage("Please specify the amount for GST calculation.");
      return;
    }
    const amount = parseFloat(amountMatch[0].replace(/,/g, ""));
    const item = input.replace(/gst|calculate|on|for|d+|,|.|₹|amount/gi, "").trim();
    const rate = guessGSTRate(item);
    const { gstAmount, total } = calculateGST(amount, rate);
    addMessage(`
      <b>GST Calculation</b><br>
      Item: ${item || "General"}<br>
      Amount: ₹${amount.toLocaleString()}<br>
      Rate: ${rate}%<br>
      GST: ₹${parseFloat(gstAmount).toLocaleString()}<br>
      Total: ₹${parseFloat(total).toLocaleString()}
    `);
    return;
  }

  if (/income tax/.test(input) && /d/.test(input)) {
    const incomeMatch = input.match(/d+(,d+)?(.d+)?/);
    if (!incomeMatch) {
      addMessage("Please specify your income for tax estimation.");
      return;
    }
    const income = parseFloat(incomeMatch[0].replace(/,/g, ""));
    const tax = calculateIncomeTax(income);
    addMessage(`
      <b>Income Tax Estimation</b><br>
      Income: ₹${income.toLocaleString()}<br>
      Estimated Tax: ₹${parseFloat(tax).toLocaleString()}<br>
      (Calculated based on AY 2025-26 new tax slabs)
    `);
    return;
  }

  if (input.includes("budget")) {
    addMessage(`
      <b>Budget Planner</b><br>
      Please provide your monthly or annual income and key expenses.<br>
      Example:<br>
      "Budget for monthly income 50000"<br>
      "Help me plan budget with ₹100000 annual income"
    `);
    return;
  }

  if (input.includes("finance") || input.includes("news") || input.includes("update")) {
    addMessage(`
      <b>Finance Ministry Updates (2025)</b><br>
      - GST slab simplification to 0%, 5%, 18%, 40%.<br>
      - Income Tax slabs updated for FY 2025-26.<br>
      - Operationalization of GST Appellate Tribunal by December 2025.<br>
      For more official updates visit:<br>
      <a href="https://incometaxindia.gov.in/pages/tax-laws-rules.aspx" target="_blank">Income Tax Dept.</a><br>
      <a href="https://financialservices.gov.in/beta/en" target="_blank">Ministry of Finance</a>
    `);
    return;
  }

  addMessage(`
    Hi! I can help you with:<br>
    - GST calculation<br>
    - Income tax estimation<br>
    - Budget planning ideas<br>
    - Latest finance & tax updates<br>
    Please ask your question!
  `);
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  addMessage(text, "user");
  userInput.value = "";
  setTimeout(() => handleUserInput(text), 600);
}

userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

window.onload = () => {
  addMessage("Hello! Welcome to the India Tax & GST Chatbot. Ask me anything about GST, Income Tax, budget planning, or finance updates.");
};


const chat = document.getElementById("chat");
const userInput = document.getElementById("userInput");

// GST slabs data for 2025 reform
const gstSlabs = {
  zero: ["insurance", "life policy", "health insurance", "medicine", "education", "milk", "bread", "paneer", "roti", "chapati"],
  five: ["agriculture", "fertilizer", "processed food", "hotel", "restaurant", "cosmetics", "salon", "shampoo", "toothpaste", "bicycle", "kitchenware", "handicraft"],
  eighteen: ["electronics", "automobile", "tv", "furniture", "motors", "ac", "small car", "motorbike", "software"],
  forty: ["tobacco", "cigarette", "pan masala", "aerated drinks", "alcohol", "luxury car"]
};
// Income Tax Slabs FY 2025-26 (AY 2026-27) - new regime
const incomeTaxSlabs = [
  { upto: 300000, rate: 0 },
  { upto: 700000, rate: 5 },
  { upto: 1000000, rate: 10 },
  { upto: 1200000, rate: 15 },
  { upto: 1500000, rate: 20 },
  { upto: Infinity, rate: 30 }
];

function addMessage(text, sender = "bot") {
  const div = document.createElement("div");
  div.className = "message " + sender;
  div.innerHTML = `<span class="icon">${sender === "bot" ? "🤖" : "👤"}</span><div>${text}</div>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function guessGSTRate(item) {
  item = item.toLowerCase();
  for (const tier in gstSlabs) {
    if (gstSlabs[tier].some(term => item.includes(term))) {
      return tier === "zero" ? 0 : tier === "five" ? 5 : tier === "eighteen" ? 18 : 40;
    }
  }
  return 18;
}

function calculateGST(amount, rate) {
  const gstAmount = ((amount * rate) / 100).toFixed(2);
  return { gstAmount, total: (amount + parseFloat(gstAmount)).toFixed(2) };
}

function calculateIncomeTax(income) {
  let tax = 0;
  let prev = 0;
  for (const slab of incomeTaxSlabs) {
    if (income > slab.upto) {
      tax += ((slab.upto - prev) * slab.rate) / 100;
      prev = slab.upto;
    } else {
      tax += ((income - prev) * slab.rate) / 100;
      break;
    }
  }
  return tax.toFixed(2);
}

function handleUserInput(input) {
  input = input.toLowerCase();

  if (/gst/.test(input) && /d/.test(input)) {
    const amountMatch = input.match(/d+(,d+)?(.d+)?/);
    if (!amountMatch) {
      addMessage("Please specify the amount for GST calculation.");
      return;
    }
    const amount = parseFloat(amountMatch[0].replace(/,/g, ""));
    const item = input.replace(/gst|calculate|on|for|d+|,|.|₹|amount/gi, "").trim();
    const rate = guessGSTRate(item);
    const { gstAmount, total } = calculateGST(amount, rate);
    addMessage(`
      <b>GST Calculation</b><br>
      Item: ${item || "General"}<br>
      Amount: ₹${amount.toLocaleString()}<br>
      Rate: ${rate}%<br>
      GST: ₹${parseFloat(gstAmount).toLocaleString()}<br>
      Total: ₹${parseFloat(total).toLocaleString()}
    `);
    return;
  }

  if (/income tax/.test(input) && /d/.test(input)) {
    const incomeMatch = input.match(/d+(,d+)?(.d+)?/);
    if (!incomeMatch) {
      addMessage("Please specify your income for tax estimation.");
      return;
    }
    const income = parseFloat(incomeMatch[0].replace(/,/g, ""));
    const tax = calculateIncomeTax(income);
    addMessage(`
      <b>Income Tax Estimation</b><br>
      Income: ₹${income.toLocaleString()}<br>
      Estimated Tax: ₹${parseFloat(tax).toLocaleString()}<br>
      (Calculated based on AY 2025-26 new tax slabs)
    `);
    return;
  }

  if (input.includes("budget")) {
    addMessage(`
      <b>Budget Planner</b><br>
      Please provide your monthly or annual income and key expenses.<br>
      Example:<br>
      "Budget for monthly income 50000"<br>
      "Help me plan budget with ₹100000 annual income"
    `);
    return;
  }

  if (input.includes("finance") || input.includes("news") || input.includes("update")) {
    addMessage(`
      <b>Finance Ministry Updates (2025)</b><br>
      - GST slab simplification to 0%, 5%, 18%, 40%.<br>
      - Income Tax slabs updated for FY 2025-26.<br>
      - Operationalization of GST Appellate Tribunal by December 2025.<br>
      For more official updates visit:<br>
      <a href="https://incometaxindia.gov.in/pages/tax-laws-rules.aspx" target="_blank">Income Tax Dept.</a><br>
      <a href="https://financialservices.gov.in/beta/en" target="_blank">Ministry of Finance</a>
    `);
    return;
  }

  addMessage(`
    Hi! I can help you with:<br>
    - GST calculation<br>
    - Income tax estimation<br>
    - Budget planning ideas<br>
    - Latest finance & tax updates<br>
    Please ask your question!
  `);
}

function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  addMessage(text, "user");
  userInput.value = "";
  setTimeout(() => handleUserInput(text), 600);
}

userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

window.onload = () => {
  addMessage("Hello! Welcome to the India Tax & GST Chatbot. Ask me anything about GST, Income Tax, budget planning, or finance updates.");
};
