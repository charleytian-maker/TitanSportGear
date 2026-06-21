<!-- 这里是您网页原本的其他内容 -->

    <!-- 1. 刚才为您编写的弹窗 HTML 结构（如果还没加，可以和脚本放在一起） -->
    <div id="imageModal" class="modal" onclick="closeModal()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <span class="close-btn" onclick="closeModal()">&times;</span>
        < img id="modalImg" src="" alt="放大图片">
        <div id="modalDescription" class="modal-desc"></div>
      </div>
    </div>

    <!-- 2. JavaScript 脚本开始 -->
    <script>
      // 打开弹窗的函数
      function openModal(imgElement) {
        const modal = document.getElementById("imageModal");
        const modalImg = document.getElementById("modalImg");
        const modalDesc = document.getElementById("modalDescription");

        modal.style.display = "flex"; // 显示弹窗
        modalImg.src = imgElement.src; // 放大图片路径等于当前点击的图片
        
        // 设置下方产品描述：使用图片的 alt 属性文字 + 自定义介绍
        modalDesc.innerText = imgElement.alt + " - 这是一款高品质的专业匹克球套装，适合各阶段玩家。"; 
      }

      // 关闭弹窗的函数
      function closeModal() {
        document.getElementById("imageModal").style.display = "none";
      }
    </script>
    <!-- JavaScript 脚本结束 -->

  </body>
</html>
