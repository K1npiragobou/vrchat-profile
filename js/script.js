// script.js

const API_BASE_URL = 'https://my-portfolio-server-d81x.onrender.com';

// ブログ取得
fetch(`${API_BASE_URL}/api/blogs`)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    const container = document.querySelector('.blog-posts');
    container.innerHTML = '';
    data.slice(0, 3).forEach(post => {
      const div = document.createElement('div');
      div.className = 'blog-post';

      const title = document.createElement('strong');
      title.textContent = post.title;

      const br = document.createElement('br');

      const date = document.createElement('small');
      date.textContent = post.date;

      div.appendChild(title);
      div.appendChild(br);
      div.appendChild(date);
      container.appendChild(div);
    });
  })
  .catch(err => {
    document.querySelector('.blog-posts').textContent = `取得できませんでした (${err.message})`;
  });
// ゲーム情報取得＋グラフ描画
fetch(`${API_BASE_URL}/api/games`)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    data.forEach(game => {
      const container = document.getElementById(game.id);
      if (container) {
        // ランク・ポイント表示
        container.querySelector('.rank').textContent = game.rank;
        container.querySelector('.rr').textContent = game.point;

        // グラフ描画
        if (game.history && Array.isArray(game.history) && game.history.length > 1) {
          // 色はゲームごとに変えたい場合は分岐で
          let color = '#4ecdc4';
          if (game.id === 'streetfighter6') color = '#ff6b6b';
          if (game.id === 'pokepoke') color = '#4ecdc4';
          createChart(`${game.id}Chart`, game.history, color);
        }
      }
    });
  })
  .catch(err => {
    document.querySelectorAll('.game-item').forEach(item => {
      item.innerHTML += `<div>取得失敗 (${err.message})</div>`;
    });
  });

// ドラマ情報取得
fetch(`${API_BASE_URL}/api/dramas`)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(data => {
    const container = document.querySelector('.drama-progress');
    container.innerHTML = ''; // 初期化
    data.slice(0, 3).forEach(drama => {
      const percent = Math.round((drama.progress / drama.total) * 100);
      const div = document.createElement('div');
      div.className = 'drama-item';
      div.innerHTML = `
        <h4>${drama.title}</h4>
        <div class="progress-bar"><div class="progress-fill" style="width: ${percent}%;"></div></div>
        <span class="progress-text">${drama.progress} / ${drama.total}</span>
      `;
      container.appendChild(div);
    });
  })
  .catch(err => {
    document.querySelector('.drama-progress').innerHTML = `<div>取得失敗 (${err.message})</div>`;
  });
// ツイート取得・表示（XSS対策あり）
function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, function(match) {
    const escape = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escape[match];
  });
}

const ul = document.getElementById('tweet-list');
ul.innerHTML = '<li>読み込み中...</li>'; // ここで最初に表示

fetch(`${API_BASE_URL}/tweets`)
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(tweets => {
    ul.innerHTML = '';
    if (tweets && tweets.length > 0) {
      tweets.slice(0, 3).forEach(tweet => {
        const user = tweet.user || {};
        const profileImage = user.profile_image_url
          ? escapeHTML(user.profile_image_url)
          : 'https://abs.twimg.com/sticky/default_profile_images/default_profile.png'; // Twitter公式デフォルト画像

        const userName = user.name ? escapeHTML(user.name) : '不明なユーザー';
        const userUsername = user.username ? escapeHTML(user.username) : 'unknown';

        const li = document.createElement('li');
        li.className = 'tweet';
        li.innerHTML = `
          <img src="${profileImage}" alt="${userName}" class="tweet-icon" style="width:24px;height:24px;border-radius:50%;vertical-align:middle;margin-right:8px;">
          <span class="tweet-user" style="font-weight:bold;">${userName}</span>
          <span class="tweet-username" style="color:#888;">@${userUsername}</span><br>
          <span class="tweet-text">${escapeHTML(tweet.text)}</span>
          <span class="tweet-date" style="display:block;color:#aaa;font-size:0.8em;">${new Date(tweet.created_at).toLocaleString('ja-JP')}</span>
        `;
        ul.appendChild(li);
      });
    } else {
      ul.innerHTML = '<li>ツイートがありません</li>';
    }
  })
  .catch(err => {
    ul.innerHTML = `<li>取得できませんでした (${err.message})</li>`;
  });
// Chart and animation setup
function createChart(canvasId, data, color) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!data || data.length < 2) {
        ctx.fillStyle = '#aaa';
        ctx.font = '14px sans-serif';
        ctx.fillText('データが足りません', 30, canvas.height / 2);
        return;
    }

    // 直近10点だけ使う
    const plotData = data.slice(-10);

    const padding = 44; // 上下左右のパディング
    const chartWidth = canvas.width - (padding * 2);
    const chartHeight = canvas.height - padding;

    const minVal = Math.min(...plotData.map(d => d.point));
    const maxVal = Math.max(...plotData.map(d => d.point));
    const range = maxVal - minVal || 1;

    // 点の座標計算
    const points = plotData.map((d, i) => {
        const x = padding + (i / (plotData.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((d.point - minVal) / range) * chartHeight;
        return { x, y, date: d.date, point: d.point };
    });

    // 折れ線
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // 点
    ctx.fillStyle = color;
    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
    });

    // 塗りつぶし
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(points[points.length - 1].x, padding + chartHeight);
    ctx.lineTo(points[0].x, padding + chartHeight);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // x軸ラベル（日付）は描画しない

    // y軸ラベル（最小・最大）
    ctx.fillStyle = '#444';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(maxVal, padding - 4, padding + 8);
    ctx.fillText(minVal, padding - 4, padding + chartHeight);

    // グラフの下に日付を外部表示
    // 親要素（canvasの親）に日付ラベルを追加
    const parent = canvas.parentElement;
    let dateLabel = parent.querySelector('.chart-dates');
    if (!dateLabel) {
        dateLabel = document.createElement('div');
        dateLabel.className = 'chart-dates';
        dateLabel.style.fontSize = '10px';
        dateLabel.style.color = '#888';
        dateLabel.style.display = 'flex';
        dateLabel.style.justifyContent = 'space-between';
        dateLabel.style.marginTop = '2px';
        parent.appendChild(dateLabel);
    }
    // 日付ラベルを更新
    dateLabel.innerHTML = `
        <span>${plotData[0].date.slice(0, 10)}</span>
        <span>${plotData[plotData.length - 1].date.slice(0, 10)}</span>
    `;
}

document.addEventListener('DOMContentLoaded', function() {


    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });

    const tweets = document.querySelectorAll('.tweet');
    tweets.forEach(tweet => {
        tweet.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            this.style.transition = 'all 0.3s ease';
        });
        tweet.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    const interactiveItems = document.querySelectorAll('.game-item, .drama-item, .blog-post');
    interactiveItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            this.style.transition = 'all 0.3s ease';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
});
