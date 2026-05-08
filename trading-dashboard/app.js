const watchData = [
  { symbol: '7203.T', name: 'トヨタ自動車', price: '3,652.0', change: '+1.54%', cls: 'green' },
  { symbol: '8306.T', name: '三菱UFJ', price: '1,580.5', change: '+1.28%', cls: 'green' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: '193.97', change: '+0.81%', cls: 'green' },
  { symbol: 'NVDA', name: 'NVIDIA', price: '1,071.63', change: '+1.97%', cls: 'green' },
  { symbol: 'BTC', name: 'Bitcoin', price: '107,812', change: '+2.35%', cls: 'green' },
  { symbol: 'ETH', name: 'Ethereum', price: '2,593.4', change: '+1.62%', cls: 'green' }
];

const feedData = [
  {
    user: '株好き太郎',
    meta: '@kabuzukitaro ・ 1分前',
    text: 'トヨタ強い！3,650円台回復。決算期待で買い入ってる？'
  },
  {
    user: '投資家A',
    meta: '@investorA ・ 2分前',
    text: '半導体かなり戻してる。NVDA継続監視。'
  },
  {
    user: 'マーケット速報',
    meta: '@marketnews ・ 3分前',
    text: '米市場先物プラス推移。仮想通貨も堅調。'
  }
];

const newsData = [
  { title: 'トヨタ、米国でEV生産を拡大', meta: 'ロイター ・ 6分前' },
  { title: 'NVIDIA続伸、AI需要期待', meta: 'Bloomberg ・ 12分前' },
  { title: 'BTC 10万ドル台維持', meta: 'CoinDesk ・ 18分前' }
];

const cryptoData = [
  { symbol: 'BTC/USD', price: '107,812', change: '+2.35%' },
  { symbol: 'ETH/USD', price: '2,593.4', change: '+1.62%' },
  { symbol: 'SOL/USD', price: '168.56', change: '+2.11%' },
  { symbol: 'XRP/USD', price: '0.5223', change: '+1.33%' }
];

const watchlist = document.getElementById('watchlist');
watchData.forEach((item, index) => {
  const el = document.createElement('div');
  el.className = 'watch-item' + (index === 0 ? ' active' : '');
  el.innerHTML = `
    <div>
      <div class="watch-name">${item.symbol}</div>
      <div class="watch-sub">${item.name}</div>
    </div>
    <div>
      <div class="watch-price">${item.price}</div>
      <div class="watch-change ${item.cls}">${item.change}</div>
    </div>
  `;

  el.addEventListener('click', () => {
    document.querySelectorAll('.watch-item').forEach(x => x.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('symbolInput').value = item.symbol;
    updateLinks(item.symbol);
    document.getElementById('assetName').textContent = item.symbol + ' ' + item.name;
  });

  watchlist.appendChild(el);
});

const snsFeed = document.getElementById('snsFeed');
feedData.forEach(item => {
  const el = document.createElement('div');
  el.className = 'feed-item';
  el.innerHTML = `
    <div class="feed-meta">${item.user} ${item.meta}</div>
    <div>${item.text}</div>
  `;
  snsFeed.appendChild(el);
});

const newsFeed = document.getElementById('newsFeed');
newsData.forEach(item => {
  const el = document.createElement('div');
  el.className = 'news-item';
  el.innerHTML = `
    <div class="news-meta">${item.meta}</div>
    <div>${item.title}</div>
  `;
  newsFeed.appendChild(el);
});

const cryptoList = document.getElementById('cryptoList');
cryptoData.forEach(item => {
  const el = document.createElement('div');
  el.className = 'crypto-item';
  el.innerHTML = `
    <div>
      <div>${item.symbol}</div>
      <div class="crypto-sub">CoinGecko</div>
    </div>
    <div>
      <div>${item.price}</div>
      <div class="green">${item.change}</div>
    </div>
  `;
  cryptoList.appendChild(el);
});

function updateLinks(symbol) {
  document.getElementById('xSearch').href = `https://x.com/search?q=${encodeURIComponent(symbol)}&src=typed_query`;
  document.getElementById('googleNews').href = `https://news.google.com/search?q=${encodeURIComponent(symbol)}`;
}

updateLinks('7203.T');

const chartContainer = document.getElementById('chart');
const chart = LightweightCharts.createChart(chartContainer, {
  layout: {
    background: { color: 'transparent' },
    textColor: '#cbd5e1'
  },
  grid: {
    vertLines: { color: 'rgba(148,163,184,0.08)' },
    horzLines: { color: 'rgba(148,163,184,0.08)' }
  },
  width: chartContainer.clientWidth,
  height: chartContainer.clientHeight,
  rightPriceScale: {
    borderColor: 'rgba(148,163,184,0.2)'
  },
  timeScale: {
    borderColor: 'rgba(148,163,184,0.2)'
  }
});

const candleSeries = chart.addCandlestickSeries({
  upColor: '#22c55e',
  downColor: '#ef4444',
  borderVisible: false,
  wickUpColor: '#22c55e',
  wickDownColor: '#ef4444'
});

const data = [];
let base = 3200;
for (let i = 1; i <= 120; i++) {
  const open = base + (Math.random() - 0.5) * 40;
  const close = open + (Math.random() - 0.5) * 80;
  const high = Math.max(open, close) + Math.random() * 35;
  const low = Math.min(open, close) - Math.random() * 35;

  data.push({
    time: `2026-01-${String((i % 28) + 1).padStart(2, '0')}`,
    open,
    high,
    low,
    close
  });

  base = close;
}

candleSeries.setData(data);
chart.timeScale().fitContent();

window.addEventListener('resize', () => {
  chart.applyOptions({
    width: chartContainer.clientWidth,
    height: chartContainer.clientHeight
  });
});

document.getElementById('updatedAt').textContent = new Date().toLocaleTimeString('ja-JP');

const loadBtn = document.getElementById('loadBtn');
loadBtn.addEventListener('click', () => {
  const symbol = document.getElementById('symbolInput').value.trim();
  if (!symbol) return;

  updateLinks(symbol);
  document.getElementById('assetName').textContent = symbol + ' 読み込み準備完了';
  document.getElementById('priceLine').textContent = '次回：API接続でリアルデータ化';
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
