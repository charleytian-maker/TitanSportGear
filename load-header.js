// ===========================================================
// 统一加载导航栏 header.html
// 加载完成后绑定语言切换逻辑，并处理锚点跳转定位
//
// 使用前提：页面 body 内必须有一个容器：
//   <div id="header-placeholder"></div>
// 如果容器不存在或 id 拼写错误，本脚本会在控制台报错提示，
// 不会让整个脚本崩溃中断。
// ===========================================================

var isGermanPage = window.location.pathname.indexOf('/de/') > -1;
var headerFile = isGermanPage ? '/header_de.html' : '/header.html';

fetch(headerFile)
  .then(function(response) {
    return response.text();
  })
  .then(function(html) {
    var placeholder = document.getElementById('header-placeholder');

    if (!placeholder) {
      console.error('load-header.js: 未找到 header-placeholder 容器，门楣无法注入，请检查本页面是否有该 div。');
      return;
    }

    placeholder.innerHTML = html;
    initHeaderLogic();
    scrollToAnchorAfterHeaderLoad();
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

  if (!enLink || !deLink) {
    console.error('load-header.js: 未找到语言切换链接 lang-en 或 lang-de，语言切换逻辑跳过。');
    return;
  }

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
}

// ===========================================================
// 锚点跳转修复
// 门楣是异步注入的，浏览器初次渲染时的锚点定位常常会失败
// 因此在门楣插入完成后，手动滚动到 URL 中的锚点位置一次
// ===========================================================
function scrollToAnchorAfterHeaderLoad() {
  if (!window.location.hash) return;

  var targetId = window.location.hash.substring(1);
  var targetEl = document.getElementById(targetId);
  if (!targetEl) return;

  requestAnimationFrame(function() {
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
