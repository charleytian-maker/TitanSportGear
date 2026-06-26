// ====================================================
// 统一加载导航栏 header.html，并在加载完成后绑定语言切换 / 菜单逻辑
// 把这段放在 script.js 最前面，或者作为单独的 load-header.js 引入
// ====================================================

fetch('/header.html')
  .then(function(response) {
    return response.text();
  })
  .then(function(html) {
    document.getElementById('header-placeholder').innerHTML = html;
    initHeaderLogic();
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

  // 如果以后想给 Contact Us 做下拉面板而不是直接跳转，
  // 可以在这里加 addEventListener，目前 Contact Us 是直接跳转链接，不需要额外绑定。
}
