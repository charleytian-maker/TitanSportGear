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
