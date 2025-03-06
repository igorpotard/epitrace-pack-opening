// content.js

const browserAPI = typeof browser !== "undefined" ? browser : chrome;


function find_a(el) {
  if (el.tagName == "A") return el;
  return find_a(el.parentElement);
}

function addHashToDB(hash) {
  browserAPI.storage.local.get({ hashes: [] }).then((result) => {
    let hashes = result.hashes;
    if (!hashes.includes(hash)) {
      hashes.push(hash);
      browserAPI.storage.local.set({ hashes: hashes });
    }
  });
}

async function isHashInDB(hash) {
  let result = await browserAPI.storage.local.get({ hashes: [] });
  return result.hashes.includes(hash);
}

async function getDB() {
  let result = await browserAPI.storage.local.get({ hashes: [] });
  return result.hashes;
}

let confettiWrapper = document.createElement("div");
confettiWrapper.classList.add("confetti-wrapper");
confettiWrapper.style.zIndex = "9999";
document.body.appendChild(confettiWrapper);

function add_pack_display() {
  if (!document.getElementById("pack-displayer")) {
    let packDisplayer = document.createElement("div");
    packDisplayer.id = "pack-displayer";
    packDisplayer.style.position = "absolute";
    packDisplayer.style.top = "0";
    packDisplayer.style.left = "0";
    packDisplayer.style.width = "100%";
    packDisplayer.style.height = "100%";
    packDisplayer.style.display = "none";
    packDisplayer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    document.body.appendChild(packDisplayer);
  }
}

function addPackToDisplay(pack) {
  let packDisplayer = document.getElementById("pack-displayer");
  if (packDisplayer) {
    packDisplayer.innerHTML = "";
    packDisplayer.appendChild(pack);
    packDisplayer.style.display = "flex";
    packDisplayer.addEventListener("click", closePackDisplay);
  }
}

function closePackDisplay() {
  let packDisplayer = document.getElementById("pack-displayer");
  if (packDisplayer) {
    packDisplayer.style.display = "none";
    packDisplayer.innerHTML = "";
  }
}

async function add_open_pack_button(traceSymbol) {
  if (
    traceSymbol.getAttribute("errorstatus") != "" ||
    traceSymbol.getAttribute("status") != "SUCCEEDED"
  )
    return;

  a_tag = find_a(traceSymbol);
  var link = a_tag.href;

  if ((await isHashInDB(link)) == true) return;

  let percentage = traceSymbol.getAttribute("successpercent");
  let button = document.createElement("button");
  button.textContent = "Open EpiPack";
  button.style.background = "#007BFF";
  button.style.color = "white";
  button.style.border = "none";
  button.style.padding = "5px 10px";
  button.style.cursor = "pointer";
  button.style.margin = "5px";

		let gototrace = document.createElement("button");
		gototrace.textContent = "Trace";
		gototrace.style.background = "#007BFF";
		gototrace.style.color = "white";
		gototrace.style.border = "none";
		gototrace.style.padding = "5px 10px";
		gototrace.style.cursor = "pointer";
		gototrace.style.margin = "5px";

  traceSymbol.setAttribute("data-processed", "true");
  traceSymbol.style.display = "none";

		traceSymbol.parentNode.insertBefore(button, traceSymbol);
		traceSymbol.parentNode.insertBefore(gototrace, traceSymbol);

  a_tag.href = "#";

  traceSymbol.setAttribute("link", link);

		button.addEventListener("click", function () {
				openPackAnimation(button, percentage);
				return;
		});

	gototrace.addEventListener("click", function () {
			window.location.href = link;
		});

}

async function replaceTraceSymbols() {
  if (document.body.dataset.replaceTraceSymbolsExecuted) {
    return;
  }

  document.body.dataset.replaceTraceSymbolsExecuted = true;

  add_pack_display();
  var alls = document.querySelectorAll("trace-symbol:not([data-processed])");

  for (let i = 0; i < alls.length; i++) {
    await add_open_pack_button(alls[i]);
  }

  if (document.getElementsByClassName("list").length == 0) return;

  var all_in_list = document.getElementsByClassName("list")[0].children;

  var hashes = await getDB();

  for (let i = 0; i < all_in_list.length; i++) {
    var href = all_in_list[i].href;
    console.log(href);
    var is_inside = false;
    for (let j = 0; j < hashes.length; j++) {
      if (hashes[j].includes(href)) {
        is_inside = true;
      }
    }

    if (!is_inside) {
				all_in_list[i].classList.innerHTML = "?";
      var checkMark =
        all_in_list[i].getElementsByClassName("list__item__right")[0];
      if (checkMark) checkMark.innerHTML = "?";
    }
  }
}

const observer = new MutationObserver(replaceTraceSymbols);
observer.observe(document.body, { childList: true, subtree: true });

replaceTraceSymbols();

function make_confetis() {
  const confettiWrapper = document.querySelector(".confetti-wrapper");
  if (confettiWrapper.children.length > 0) return;

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
    confettiWrapper.innerHTML = "";
  }, 4000);

  function getRandomColor() {
    const colors = ["#ff6347", "#ffa500", "#32cd32", "#1e90ff", "#ff69b4"];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

function get_image(percentage) {
  if (percentage == 100) return "Champion_Wild_Card";
		if (percentage >= 90) return "Legendary_Wild_Card";
		if (percentage >= 80) return "Epic_Wild_Card";
		if (percentage >= 60) return "Rare_Wild_Card";
		if (percentage >= 40) return "Common_Wild_Card";
		if (percentage >= 0) return "Elite_Wild_Card";
}

function get_color(image) {
  if (image == "rare_gold") return "#F6DB7B";
  return "#1e252a";
}

function get_url(percentage) {
  return browserAPI.runtime.getURL("img/" + get_image(percentage) + ".png");
}

let href = "";

async function openPackAnimation(button, inputPercentage) {
  function main_pack() {
    return browserAPI.runtime.getURL("img/Star_Drop_Common.png");
  }

  let pack = document.createElement("div");
  pack.classList.add("pack");
  pack.style.backgroundImage = `url(${main_pack()})`;
  let pack_text = document.createElement("span");
  pack_text.classList.add("text-pack");
  pack.appendChild(pack_text);

  addPackToDisplay(pack);
  pack.classList.add("spinning");

  href = button.parentElement
    .getElementsByTagName("trace-symbol")[0]
    .getAttribute("link");

  setTimeout(() => {
    let currentPercentage = 100;
    let decreaseTime = 1000;
    let steps = 10;
    let stepTime = decreaseTime / steps;

    let percentages = [
      Math.floor(Math.random() * 100),
      inputPercentage,
    ];
    pack_text.style.color = get_color(get_image(currentPercentage));
		let random_number = 20;
    let interval = setInterval(() => {
				pack.classList.remove("spinning");

        currentPercentage =  Math.floor(Math.random() * 100);
        pack_text.textContent = Math.floor(currentPercentage);
        pack_text.style.color = get_color(get_image(currentPercentage));
        pack.style.backgroundImage = `url(${get_url(currentPercentage)})`;
        if (random_number == 0) {
						pack_text.textContent = Math.floor(inputPercentage);
						pack_text.style.color = get_color(get_image(inputPercentage));
						pack.style.backgroundImage = `url(${get_url(inputPercentage)})`;
          clearInterval(interval);
          if (inputPercentage == 100) {
            make_confetis();
          }
          pack.style.cursor = "pointer";
          addHashToDB(href);
          pack.addEventListener("click", function () {
							console.log(href);
            document.location.href = href;
          });
      }
				random_number -= 1;
    }, 200);
  }, 1000);
}
