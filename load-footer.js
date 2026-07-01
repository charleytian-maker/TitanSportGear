// ===========================================================
// 统一加载页脚 footer.html
// 用法：在页面 </body> 前加入：
//   <div id="footer-placeholder"></div>
//   <script src="/load-footer.js"></script>
// ===========================================================

fetch('/footer.html')
  .then(function(response) {
    return response.text();
  })
  .then(function(html) {
    document.getElementById('footer-placeholder').innerHTML = html;
  })
  .catch(function(err) {
    console.error('页脚加载失败:', err);
  });
<a href=" "
   target="_blank"
   id="whatsappFloat"
   aria-label="Chat on WhatsApp">
  <i class="fa-brands fa-whatsapp"></i>
</a >

<style>
#whatsappFloat {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: #25D366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 999;
  transition: transform 0.2s;
}
#whatsappFloat:hover {
  transform: scale(1.08);
}
</style>
