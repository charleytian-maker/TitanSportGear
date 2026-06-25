// 1. 打开弹窗的函数
function openModal(imgElement) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const modalDesc = document.getElementById("modalDescription");

    // 显示弹窗
    modal.style.display = "flex";
    
    // 给大图传路径
    modalImg.src = imgElement.src;
    
    // 设置下方的文字描述
    modalDesc.innerText = imgElement.alt + " - 这是一款高品质的专业匹克球套装，适合各阶段玩家。";
}

// 2. 关闭弹窗的函数
function closeModal() {
    document.getElementById("imageModal").style.display = "none";
    
ocument.addEventListener('DOMContentLoaded', function() {
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
const aboutBtn = document.getElementById('about-us-btn');
const contactPanel = document.getElementById('contact-panel');

// 点击 About Us 切换显示/隐藏
aboutBtn.addEventListener('click', function(event) {
  event.stopPropagation(); // 阻止事件冒泡
  contactPanel.classList.toggle('is-active');
});

// 点击页面其他任何空白地方时，自动收起面板
document.addEventListener('click', function() {
  contactPanel.classList.remove('is-active');
});
