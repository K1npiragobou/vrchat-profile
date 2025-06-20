// script.js

const API_BASE_URL = 'https://my-portfolio-server-d81x.onrender.com';

// ブログ取得
fetch(`${API_BASE_URL}/blogs`)
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector('.blog-posts');
    container.innerHTML = '';
    data.slice(0, 3).forEach(post => {
      const div = document.createElement('div');
      div.className = 'blog-post';
      div.innerHTML = `<strong>${post.title}</strong><br><small>${post.date}</small>`;
      container.appendChild(div);
    });
  })
  .catch(() => {
    document.querySelector('.blog-posts').innerHTML = '<div>取得できませんでした</div>';
  });

// ゲーム情報取得
fetch(`${API_BASE_URL}/games`)
  .then(res => res.json())
  .then(data => {
    data.forEach(game => {
      const id = game.name.toLowerCase().includes('valorant') ? 'valorant' :
                 game.name.toLowerCase().includes('apex') ? 'apex' : null;
      if (!id) return;
      const container = document.getElementById(id);
      if (container) {
        container.querySelector('.rank').textContent = game.rank;
        container.querySelector('.rr').textContent = game.point;
      }
    });
  })
  .catch(() => {
    document.querySelectorAll('.game-item').forEach(item => {
      item.innerHTML += '<div>取得失敗</div>';
    });
  });

// ドラマ情報取得
fetch(`${API_BASE_URL}/dramas`)
  .then(res => res.json())
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
  .catch(() => {
    document.querySelector('.drama-progress').innerHTML = '<div>取得失敗</div>';
  });
// ツイート取得・表示
fetch(`${API_BASE_URL}/tweets`)
  .then(res => res.json())
  .then(tweets => {
    const ul = document.getElementById('tweet-list');
    ul.innerHTML = '';
    if (tweets && tweets.length > 0) {
      tweets.slice(0, 3).forEach(tweet => {
        const li = document.createElement('li');
        li.className = 'tweet';
        li.textContent = tweet.text;
        ul.appendChild(li);
      });
    } else {
      ul.innerHTML = '<li>ツイートがありません</li>';
    }
  })
  .catch(() => {
    document.getElementById('tweet-list').innerHTML = '<li>取得できませんでした</li>';
  });
// Chart and animation setup

document.addEventListener('DOMContentLoaded', function() {
    const valorantData = [1200, 1180, 1220, 1250, 1240, 1280, 1300];
    const apexData = [800, 850, 820, 880, 900, 950, 1000];

    createChart('valorantChart', valorantData, '#ff6b6b');
    createChart('apexChart', apexData, '#4ecdc4');

    function createChart(canvasId, data, color) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 20;
        const chartWidth = canvas.width - (padding * 2);
        const chartHeight = canvas.height - (padding * 2);

        const minVal = Math.min(...data);
        const maxVal = Math.max(...data);
        const range = maxVal - minVal;

        const points = data.map((value, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = padding + chartHeight - ((value - minVal) / range) * chartHeight;
            return { x, y };
        });

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        ctx.fillStyle = color;
        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

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
    }

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
