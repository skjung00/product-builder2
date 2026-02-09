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
