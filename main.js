const lottoBtn = document.getElementById('lotto-btn');
const lottoNumbersDiv = document.getElementById('lotto-numbers');

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
