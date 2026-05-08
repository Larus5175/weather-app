const assets = {
  '7203.T': { symbol: '7203.T', name: 'トヨタ自動車', market: 'jp', price: 3652.0, change: 1.54, base: 3600, marginBuy: '3,562,400株', marginSell: '1,287,600株', loan: '2,145,200株' },
  '8306.T': { symbol: '8306.T', name: '三菱UFJ銀行', market: 'jp', price: 1580.5, change: 1.28, base: 1550, marginBuy: '8,102,000株', marginSell: '2,946,000株', loan: '4,451,000株' },
  '6758.T': { symbol: '6758.T', name: 'ソニーグループ', market: 'jp', price: 13245, change: -0.16, base: 13200, marginBuy: '1,904,300株', marginSell: '655,900株', loan: '1,204,000株' },
  'AAPL': { symbol: 'AAPL', name: 'Apple Inc.', market: 'us', price: 193.97, change: 0.81, base: 190, marginBuy: '-', marginSell: 'Short Interest', loan: 'Borrow Data' },
  'NVDA': { symbol: 'NVDA', name: 'NVIDIA Corporation', market: 'us', price: 1071.63, change: 1.97, base: 1040, marginBuy: '-', marginSell: 'Short Interest', loan: 'Borrow Data' },
  'TSLA': { symbol: 'TSLA', name: 'Tesla Inc.', market: 'us', price: 182.44, change: -0.72, base: 185, marginBuy: '-', marginSell: 'Short Interest', loan: 'Borrow Data' },
  'BTC': { symbol: 'BTC', name: 'Bitcoin', market: 'crypto', price: 107812, change: 2.35, base: 106000, marginBuy: '-', marginSell: '-', loan: '-' },
  'ETH': { symbol: 'ETH', name: 'Ethereum', market: 'crypto', price: 2593.4, change: 1.62, base: 2500, marginBuy: '-', marginSell: '-', loan: '-' },
  'SOL': { symbol: 'SOL', name: 'Solana', market: 'crypto', price: 168.56, change: 2.11, base: 165, marginBuy: '-', marginSell: '-', loan: '-' },
  'XRP': { symbol: 'XRP', name: 'XRP', market: 'crypto', price: 0.5223, change: 1.33, base: 0.51, marginBuy: '-', marginSell: '-', loan: '-' }
};

const watchSymbols = ['7203.T', '8306.T', '6758.T', 'AAPL', 'NVDA', 'BTC', 'ETH'];
const cryptoSymbols = ['BTC', 'ETH', 'SOL', 'XRP'];

let currentSymbol = '7203.T';
let chart;
let candleSeries;

function fmtPrice(value) {
  if (value === '-' || value == null) return '-';
  return Number(value).toLocaleString('ja-JP', { maximumFractionDigits: value < 10 ? 4 : 2 });
}

function normalizeSymbol(value) {
  let s = String(value || '').trim().toUpperCase();
  if (!s) return '';

  const aliases = {
    'TOYOTA': '7203.T',
    'トヨタ': '7203.T',
    'トヨタ自動車': '7203.T',
    'UFJ': '8306.T',
    '三菱UFJ': '8306.T',
    'SONY': '6758.T',
    'ソニー': '6758.T',
    'APPLE': 'AAPL',
    'アップル': 'AAPL',
    'NVIDIA': 'NVDA',
    'エヌビディア': 'NVDA',
    'TESLA': 'TSLA',
    'テスラ': 'TSLA',
    'BITCOIN': 'BTC',
    'ビットコイン': 'BTC',
    'ETHEREUM': 'ETH',
    'イーサリアム': 'ETH',
    'SOLANA': 'SOL',
    'ソラナ': 'SOL'
  };

  return aliases[s] || s;
}

function getAsset(symbol) {
  const normalized = normalizeSymbol(symbol);
  if (assets[normalized]) return assets[normalized];

  if (/^\d{4}$/.test(normalized)) {
    const jp = normalized + '.T';
    return {
      symbol: jp,
      name: '日本株 銘柄コード ' + normalized,
      market: 'jp',
      price: 1000 + Number(normalized.slice(0, 2)) * 20,
      change: 0.25,
      base: 1000 + Number(normalized.slice(0, 2)) * 20,
      marginBuy: 'データ接続待ち',
      marginSell: 'データ接続待ち',
      loan: 'データ接続待ち'
    };
  }

  return {
    symbol: normalized,
    name: '検索銘柄 ' + normalized,
    market: 'us',
    price: 100 + normalized.length * 7,
    change: 0.42,
    base: 100 + normalized.length * 7,
    marginBuy: '-',
    marginSell: 'Short Interest',
    loan: 'Borrow Data'
  };
}

function createChartData(asset, days = 140) {
  const data = [];
  const start = new Date();
  start.setDate(start.getDate() - days);

  let base = Number(asset.base || asset.price || 100);
  let trend = asset.change >= 0 ? 1 : -1;

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const drift = trend * i * base * 0.00035;
    const wave = Math.sin(i / 8) * base * 0.018;
    const noise = (Math.random() - 0.5) * base * 0.025;
    const open = Math.max(0.01, base + drift + wave + noise);
    const close = Math.max(0.01, open + (Math.random() - 0.48) * base * 0.025);
    const high = Math.max(open, close) + Math.random() * base * 0.018;
    const low = Math.max(0.01, Math.min(open, close) - Math.random() * base * 0.018);

    data.push({
      time: d.toISOString().slice(0, 10),
      open,
      high,
      low,
      close
    });
  }

  return data;
}

function renderWatchlist() {
  const watchlist = document.getElementById('watchlist');
  watchlist.innerHTML = '';

  watchSymbols.forEach(symbol => {
    const item = assets[symbol];
    const cls = item.change >= 0 ? 'green' : 'red';
    const sign = item.change >= 0 ? '+' : '';
    const el = document.createElement('div');
    el.className = 'watch-item' + (symbol === currentSymbol ? ' active' : '');
    el.innerHTML = `
      <div>
        <div class="watch-name">${item.symbol}</div>
        <div class="watch-sub">${item.name}</div>
      </div>
      <div>
        <div class="watch-price">${fmtPrice(item.price)}</div>
        <div class="watch-change ${cls}">${sign}${item.change.toFixed(2)}%</div>
      </div>
    `;

    el.addEventListener('click', () => loadSymbol(item.symbol));
    watchlist.appendChild(el);
  });
}

function renderFeeds(asset) {
  const snsFeed = document.getElementById('snsFeed');
  snsFeed.innerHTML = '';

  const feedData = [
    { user: 'Market Watch', meta: '@market ・ 1分前', text: `${asset.symbol} を監視中。出来高と移動平均の位置を確認。` },
    { user: '投資家メモ', meta: '@investmemo ・ 3分前', text: `${asset.name} は短期トレンド確認。ニュースと信用残も合わせて見る。` },
    { user: '速報チェック', meta: '@news ・ 5分前', text: `${asset.symbol} 関連の投稿をX検索リンクで確認できます。` }
  ];

  feedData.forEach(item => {
    const el = document.createElement('div');
    el.className = 'feed-item';
    el.innerHTML = `<div class="feed-meta">${item.user} ${item.meta}</div><div>${item.text}</div>`;
    snsFeed.appendChild(el);
  });

  const newsFeed = document.getElementById('newsFeed');
  newsFeed.innerHTML = '';
  const newsData = [
    { title: `${asset.name} の関連ニュースを確認`, meta: 'Google News 検索' },
    { title: `${asset.symbol} の決算・材料・需給をチェック`, meta: 'マーケット確認' },
    { title: 'リアルデータ接続は次ステップで追加可能', meta: '無料API連携予定' }
  ];

  newsData.forEach(item => {
    const el = document.createElement('div');
    el.className = 'news-item';
    el.innerHTML = `<div class="news-meta">${item.meta}</div><div>${item.title}</div>`;
    newsFeed.appendChild(el);
  });
}

function renderCryptoList() {
  const cryptoList = document.getElementById('cryptoList');
  cryptoList.innerHTML = '';

  cryptoSymbols.forEach(symbol => {
    const item = assets[symbol];
    const sign = item.change >= 0 ? '+' : '';
    const el = document.createElement('div');
    el.className = 'crypto-item';
    el.innerHTML = `
      <div>
        <div>${item.symbol}/USD</div>
        <div class="crypto-sub">CoinGecko接続予定</div>
      </div>
      <div>
        <div>${fmtPrice(item.price)}</div>
        <div class="green">${sign}${item.change.toFixed(2)}%</div>
      </div>
    `;
    cryptoList.appendChild(el);
  });
}

function updateLinks(symbol) {
  document.getElementById('xSearch').href = `https://x.com/search?q=${encodeURIComponent(symbol)}&src=typed_query`;
  document.getElementById('googleNews').href = `https://news.google.com/search?q=${encodeURIComponent(symbol)}`;
}

function updateTabs(asset) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.market === asset.market);
  });
}

function loadSymbol(symbol) {
  const asset = getAsset(symbol);
  currentSymbol = asset.symbol;

  document.getElementById('symbolInput').value = asset.symbol;
  document.getElementById('assetName').textContent = `${asset.symbol}　${asset.name}`;

  const cls = asset.change >= 0 ? 'green' : 'red';
  const sign = asset.change >= 0 ? '+' : '';
  document.getElementById('priceLine').innerHTML = `現在値 <b>${fmtPrice(asset.price)}</b> <span class="${cls}">${sign}${asset.change.toFixed(2)}%</span>　※無料版はデモ値`;

  document.getElementById('marginBuy').textContent = asset.marginBuy;
  document.getElementById('marginSell').textContent = asset.marginSell;
  document.getElementById('loanBalance').textContent = asset.loan;

  updateLinks(asset.symbol);
  updateTabs(asset);
  renderWatchlist();
  renderFeeds(asset);
  renderCryptoList();

  const data = createChartData(asset);
  candleSeries.setData(data);
  chart.timeScale().fitContent();

  drawMiniChart('buyCanvas', asset.change >= 0 ? 'up' : 'down');
  drawMiniChart('sellCanvas', asset.change >= 0 ? 'down' : 'up');
  drawMiniChart('loanCanvas', 'up');

  document.getElementById('updatedAt').textContent = new Date().toLocaleTimeString('ja-JP');
}

function drawMiniChart(canvasId, mode) {
  const canvas = document.getElementById(canvasId);
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, rect.width * dpr);
  canvas.height = Math.max(1, rect.height * dpr);

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, rect.width, rect.height);

  const points = [];
  const count = 24;
  for (let i = 0; i < count; i++) {
    const trend = mode === 'up' ? -i * 1.2 : i * 1.2;
    const y = rect.height * 0.58 + trend + Math.sin(i / 2.2) * 9 + (Math.random() - 0.5) * 5;
    points.push({ x: (rect.width / (count - 1)) * i, y });
  }

  const color = mode === 'up' ? '#22c55e' : '#ef4444';
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.stroke();
}

function initChart() {
  const chartContainer = document.getElementById('chart');
  chart = LightweightCharts.createChart(chartContainer, {
    layout: { background: { color: 'transparent' }, textColor: '#cbd5e1' },
    grid: {
      vertLines: { color: 'rgba(148,163,184,0.08)' },
      horzLines: { color: 'rgba(148,163,184,0.08)' }
    },
    width: chartContainer.clientWidth,
    height: chartContainer.clientHeight,
    rightPriceScale: { borderColor: 'rgba(148,163,184,0.2)' },
    timeScale: { borderColor: 'rgba(148,163,184,0.2)' }
  });

  candleSeries = chart.addCandlestickSeries({
    upColor: '#22c55e',
    downColor: '#ef4444',
    borderVisible: false,
    wickUpColor: '#22c55e',
    wickDownColor: '#ef4444'
  });

  window.addEventListener('resize', () => {
    chart.applyOptions({ width: chartContainer.clientWidth, height: chartContainer.clientHeight });
    drawMiniChart('buyCanvas', 'up');
    drawMiniChart('sellCanvas', 'down');
    drawMiniChart('loanCanvas', 'up');
  });
}

function setupEvents() {
  document.getElementById('loadBtn').addEventListener('click', () => {
    const symbol = document.getElementById('symbolInput').value.trim();
    if (symbol) loadSymbol(symbol);
  });

  document.getElementById('symbolInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const symbol = e.currentTarget.value.trim();
      if (symbol) loadSymbol(symbol);
    }
  });

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const market = tab.dataset.market;
      if (market === 'jp') loadSymbol('7203.T');
      if (market === 'us') loadSymbol('AAPL');
      if (market === 'crypto') loadSymbol('BTC');
    });
  });
}

initChart();
setupEvents();
loadSymbol('7203.T');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
