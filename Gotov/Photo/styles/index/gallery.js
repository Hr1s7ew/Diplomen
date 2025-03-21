const images = document.querySelectorAll(".gallery img");
      const modal = document.getElementById("modal");
      const modalImg = document.getElementById("modal-img");
      const closeModal = document.getElementById("close");

      images.forEach(img => {
          img.addEventListener("click", function() {
              modal.style.display = "flex";
              modalImg.src = this.src;
          });
      });

      closeModal.addEventListener("click", function() {
          modal.style.display = "none";
      });