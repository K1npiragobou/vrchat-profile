// script.js

// Twitter埋め込み（これはHTML側にスクリプトタグが必要）
// 通常はTwitterが自動で処理するのでJS側では何もしない

// ブログ記事の取得（例: noteの情報を自前APIで提供する場合）
fetch("https://your-api.onrender.com/api/blogs")
  .then((res) => res.json())
  .then((data) => {
    const blogContainer = document.querySelector(".blog-posts");
    blogContainer.innerHTML = "";
    data.forEach((post) => {
      const article = document.createElement("article");
      article.className = "blog-post";
      article.innerHTML = `
        <h4><a href="${post.url}" target="_blank">${post.title}</a></h4>
        <p class="blog-date">${post.date}</p>
        <p>${post.summary}</p>
      `;
      blogContainer.appendChild(article);
    });
  });

// ゲームランク情報の取得
fetch("https://your-api.onrender.com/api/games")
  .then((res) => res.json())
  .then((data) => {
    document.querySelector("#valorant .rank").textContent = data.valorant.rank;
    document.querySelector("#valorant .rr").textContent = data.valorant.rr;
    document.querySelector("#apex .rank").textContent = data.apex.rank;
    document.querySelector("#apex .rr").textContent = data.apex.rr;
  });

// ドラマ進捗の取得
fetch("https://your-api.onrender.com/api/dramas")
  .then((res) => res.json())
  .then((data) => {
    const dramaItems = document.querySelectorAll(".drama-item");
    data.forEach((drama, index) => {
      const fill = dramaItems[index].querySelector(".progress-fill");
      const text = dramaItems[index].querySelector(".progress-text");
      fill.style.width = `${drama.progress}%`;
      text.textContent = `${drama.episode}/${drama.total}話`;
    });
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
