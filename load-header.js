/ ===========================================================
// 统一加载导航栏 header.html，并在加载完成后绑定语言切换 / 菜单逻辑
// 把这段放在 script.js 最前面，或者作为单独的 load-header.js 引入
// ===========================================================

fetch('/header.html')
  .then(function(response) {
    return response.text();
  })
  .then(function(html) {
    document.getElementById('header-placeholder').innerHTML = html;
    initHeaderLogic();
    scrollToAnchorAfterHeaderLoad(); // 门楣插入完成、页面高度撑开后，再处理锚点跳转
  })
  .catch(function(err) {
    console.error('导航栏加载失败:', err);
  });

function initHeaderLogic() {
  var path = window.location.pathname;
  var fileName = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  var isGerman = path.indexOf('/de/') === 0 || path.indexOf('/de/') > -1;

  var enLink = document.getElementById('lang-en');
  var deLink = document.getElementById('lang-de');

  if (isGerman) {
    deLink.classList.add('lang-active');
    enLink.classList.remove('lang-active');
    enLink.href = '/' + fileName;
    deLink.href = '/de/' + fileName;
  } else {
    enLink.classList.add('lang-active');
    deLink.classList.remove('lang-active');
    enLink.href = '/' + fileName;
    deLink.href = '/de/' + fileName;
  }

  // 如果以后想给 Contact Us 做下拉菜单不想直接跳转，
  // 可以在这里加 addEventListener。目前 Contact Us 是直接跳转链接，不需要额外绑定。
}

// ===========================================================
// 锚点跳转修复：
// 由于门楣是异步 fetch 注入的，浏览器在页面初次渲染时尝试的锚点定位
// 往往会失败（此时门楣还没插入，页面高度还没撑开）。
// 这里等门楣插入完成后，再手动滚动到 URL 中的 #锚点 位置一次。
// ===========================================================
function scrollToAnchorAfterHeaderLoad() {
  if (!window.location.hash) return;

  var targetId = window.location.hash.substring(1); // 去掉开头的 #
  var targetEl = document.getElementById(targetId);
  if (!targetEl) return;

  // 用 requestAnimationFrame 确保浏览器已经完成一次布局计算（门楣高度已生效）
  requestAnimationFrame(function() {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
