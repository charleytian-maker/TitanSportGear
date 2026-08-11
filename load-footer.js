// 根据当前路径判断语言，加载对应页脚
var footerPath = window.location.pathname.includes('/de/') 
  ? '/de/footer.html' 
  : '/footer.html';

fetch(footerPath)
  .then(function(response) {
    return response.text();
  })
  .then(function(html) {
    document.getElementById('footer-placeholder').innerHTML = html;
  })
  .catch(function(err) {
    console.error('页脚加载失败:', err);
  });