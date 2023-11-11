document.addEventListener("DOMContentLoaded", function () {
    const userInfo = document.querySelector(".user-info");
    userInfo.addEventListener("click", function () {
      this.classList.toggle("active");
      
    });
    const reloadButton = document.getElementById('reloadButton');
    reloadButton.addEventListener('click', () => {
      reloadButton.classList.add('rotating');
      reloadButton.innerHTML = '<span class="spinner"><i class="fas fa-spinner fa-spin"></i></span>';
      setTimeout(() => {
        reloadButton.classList.remove('rotating');
        reloadButton.innerHTML = '<span class="spinner"><i class="fas fa-spinner fa-spin"></i></span> Reload';
      }, 2000); // Change the timeout to control how long the spinning effect lasts
    });
  });
