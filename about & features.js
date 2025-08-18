document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll to Features section
  const startLink = document.querySelector(".start-link");
  const featuresSection = document.querySelector(".features-section");

  if (startLink && featuresSection) {
    startLink.addEventListener("click", (e) => {
      e.preventDefault();
      featuresSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Highlight selected feature card
  const cards = document.querySelectorAll(".card");

  if (cards.length > 0) {
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        cards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
      });
    });
  }
});
