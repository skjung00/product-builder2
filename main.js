const lottoBtn = document.getElementById('lotto-btn');
const lottoNumbersDiv = document.getElementById('lotto-numbers');
const themeBtn = document.getElementById('theme-btn');

// Theme toggle
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeBtn.textContent = '☀️ Light Mode';
}

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Tab navigation
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Lotto number generation
lottoBtn.addEventListener('click', () => {
  lottoNumbersDiv.innerHTML = '';
  const numbers = new Set();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
  sortedNumbers.forEach(number => {
    const span = document.createElement('span');
    span.textContent = number;
    lottoNumbersDiv.appendChild(span);
  });
});

// CSV parsing & statistics
function parseCSV(text) {
  const lines = text.trim().split('\n');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = [];
    let current = '';
    let inQuotes = false;
    for (const ch of lines[i]) {
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { parts.push(current); current = ''; continue; }
      current += ch;
    }
    parts.push(current);
    rows.push({
      round: parseInt(parts[0]),
      numbers: [1,2,3,4,5,6].map(j => parseInt(parts[j])),
      bonus: parseInt(parts[7])
    });
  }
  return rows;
}

function renderStats(data) {
  // 1~45 frequency count
  const freq = new Array(46).fill(0);
  data.forEach(row => {
    row.numbers.forEach(n => freq[n]++);
  });

  const maxFreq = Math.max(...freq.slice(1));

  // Frequency chart
  const chartEl = document.getElementById('freq-chart');
  chartEl.innerHTML = '';
  for (let n = 1; n <= 45; n++) {
    const bar = document.createElement('div');
    bar.className = 'bar-row';
    const pct = (freq[n] / maxFreq * 100).toFixed(1);
    bar.innerHTML =
      '<span class="bar-label">' + n + '</span>' +
      '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
      '<span class="bar-count">' + freq[n] + '회</span>';
    chartEl.appendChild(bar);
  }

  // Top 10 / Bottom 10
  const sorted = [];
  for (let n = 1; n <= 45; n++) sorted.push({ num: n, count: freq[n] });
  sorted.sort((a, b) => b.count - a.count);

  const top10El = document.getElementById('top10');
  top10El.innerHTML = '';
  sorted.slice(0, 10).forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = '<strong>' + item.num + '</strong>번 — ' + item.count + '회';
    top10El.appendChild(li);
  });

  const bottom10El = document.getElementById('bottom10');
  bottom10El.innerHTML = '';
  sorted.slice(-10).reverse().forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = '<strong>' + item.num + '</strong>번 — ' + item.count + '회';
    bottom10El.appendChild(li);
  });

  // Recent 10 rounds
  const recent = data.slice(0, 10);
  const tbody = document.querySelector('#recent-table tbody');
  tbody.innerHTML = '';
  recent.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + row.round + '</td>' +
      row.numbers.map(n => '<td>' + n + '</td>').join('') +
      '<td class="bonus">' + row.bonus + '</td>';
    tbody.appendChild(tr);
  });
}

fetch('/lotto_data.csv')
  .then(res => res.text())
  .then(text => {
    const data = parseCSV(text);
    renderStats(data);
  });
