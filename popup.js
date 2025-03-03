function make_confetis() {
  const confettiWrapper = document.querySelector(".confetti-wrapper");
  if (confettiWrapper.children.length > 0) return; // Prevent infinite confetti

  // Generate confetti
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti-piece");
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.setProperty("--fall-duration", `${Math.random() * 3 + 3}s`);
    confetti.style.setProperty("--confetti-color", getRandomColor());
    confettiWrapper.appendChild(confetti);
  }

  setTimeout(() => {
    confettiWrapper.innerHTML = ""; // Remove confetti after animation
  }, 4000);

  function getRandomColor() {
    const colors = ["#ff6347", "#ffa500", "#32cd32", "#1e90ff", "#ff69b4"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

document.getElementById("openPack").addEventListener("click", function () {
  let inputPercentage = document.getElementById("percentage").value;
  let pack = document.getElementById("pack");
  pack.classList.add("spinning");

  function get_image(percentage) {
    if (percentage == 100) return "icon";
    if (percentage >= 90) return "rare_gold";
    if (percentage >= 80) return "gold";
    if (percentage >= 60) return "silver";
    if (percentage >= 40) return "rare_bronze";
    if (percentage >= 1) return "bronze";
    return "icon"; // im a troller eheheh
  }

  setTimeout(() => {
    pack.classList.remove("spinning");
    pack.textContent = 100 + "%";

    if (inputPercentage == 100) {
      make_confetis();
    }

    setTimeout(() => {
      let currentPercentage = 100;
      let decreaseTime = 1000; // 1 second total decrease time
      let steps = 50; // Number of steps
      let stepTime = decreaseTime / steps;
      let decrement = (100 - inputPercentage) / steps;

      let interval = setInterval(() => {
        if (currentPercentage > inputPercentage) {
          currentPercentage -= decrement;
          pack.textContent =
            Math.max(Math.floor(currentPercentage), inputPercentage) + "%";

          pack.style.backgroundImage = `url(./img/${get_image(
            currentPercentage
          )}.png)`;
        } else {
          pack.textContent = inputPercentage + "%";
          clearInterval(interval);
        }
      }, stepTime);
    }, 1000);
  }, 1000);
});
