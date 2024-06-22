// Псевдоданные для демонстрации
const tokens = [
    { name: 'BASE', liquidity: 228248.28 },
    { name: 'Wrapped Ether', liquidity: 228248.28 },
    { name: 'BrianArmstrongCoinbaseUSDC2012Normie', liquidity: 58047.89 },
    { name: 'Base Protocol', liquidity: 35182.66 },
    { name: 'Wrapped Ether', liquidity: 35182.66 }
];

const svgWidth = 800;
const svgHeight = 600;
const scaleFactor = 10; // 1 пиксель = 10 долларов

// Создание контейнера SVG
const svg = d3.select('#chart')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

// Функция для обновления кругов с новыми данными
function updateCircles(tokens) {
    // Привязка данных
    const circles = svg.selectAll('circle')
        .data(tokens, d => d.name);

    // Вставка новых кругов
    circles.enter()
        .append('circle')
        .attr('cx', (d, i) => (i + 1) * (svgWidth / (tokens.length + 1)))
        .attr('cy', svgHeight / 2)
        .attr('r', d => d.liquidity / scaleFactor)
        .attr('fill', 'steelblue')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .append('title') // Всплывающая подсказка с именем токена и ликвидностью
        .text(d => `${d.name}: $${d.liquidity}`);

    // Обновление существующих кругов
    circles
        .attr('cx', (d, i) => (i + 1) * (svgWidth / (tokens.length + 1)))
        .attr('cy', svgHeight / 2)
        .attr('r', d => d.liquidity / scaleFactor)
        .select('title')
        .text(d => `${d.name}: $${d.liquidity}`);

    // Удаление старых кругов
    circles.exit().remove();

    // Создание меток для каждого токена
    const labels = svg.selectAll('text')
        .data(tokens, d => d.name);

    // Вставка новых меток
    labels.enter()
        .append('text')
        .attr('x', (d, i) => (i + 1) * (svgWidth / (tokens.length + 1)))
        .attr('y', svgHeight / 2)
        .attr('dy', d => -d.liquidity / scaleFactor - 10)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .text(d => d.name);

    // Обновление существующих меток
    labels
        .attr('x', (d, i) => (i + 1) * (svgWidth / (tokens.length + 1)))
        .attr('y', svgHeight / 2)
        .attr('dy', d => -d.liquidity / scaleFactor - 10)
        .text(d => d.name);

    // Удаление старых меток
    labels.exit().remove();
}

// Функция для получения и обновления данных каждые 2 секунды
function fetchData() {
    // Псевдо API вызов, замените на фактический API вызов
    const url = 'https://api.dexscreener.com/latest/dex/search/?q=ethereum';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const pairs = data.pairs;
            const tokens = pairs.map(pair => ({
                name: pair.baseToken.name,
                liquidity: pair.liquidity.usd
            })).filter(token => token.liquidity > 0);
            updateCircles(tokens);
        })
        .catch(error => console.error('Ошибка получения данных:', error));
}

// Первоначальное получение данных и запуск интервала
fetchData();
setInterval(fetchData, 2000);
