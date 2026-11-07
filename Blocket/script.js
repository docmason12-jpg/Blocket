// ========================================
// BLOCKET - MAIN SCRIPT
// ========================================

// ========================================
// GLOBAL CONSTANTS
// ========================================

const ACCOUNT_STORAGE_KEY = "blocket_accounts";
const SESSION_STORAGE_KEY = "blocket_session";

const STARTING_TOKENS = 500;
const MAX_QUANTITY = 1000000000;

const DAILY_REWARD = 10000000;
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000;

const MAX_PLAYERS = 8;

// ========================================
// HTML ELEMENTS
// ========================================

const packsPage = document.getElementById("packs-page");
const collectionPage = document.getElementById("collection-page");
const playPage = document.getElementById("play-page");
const hostPage = document.getElementById("host-page");
const lobbyPage = document.getElementById("lobby-page");

const packsNav = document.getElementById("packs-nav");
const collectionNav = document.getElementById("collection-nav");
const playNav = document.getElementById("play-nav");
const hostNav = document.getElementById("host-nav");
const dailyRewardButton = document.getElementById("daily-reward-button");

const packContainer = document.getElementById("pack-container");
const collectionContainer = document.getElementById("collection-container");

const gameModeCards = document.querySelectorAll(".game-mode-card");
const selectedGameMessage = document.getElementById("selected-game-message");
const createGameButton = document.getElementById("create-game-button");

const joinRoomCode = document.getElementById("join-room-code");
const joinGameButton = document.getElementById("join-game-button");
const joinGameMessage = document.getElementById("join-game-message");

const lobbyGameName = document.getElementById("lobby-game-name");
const lobbyRoomCode = document.getElementById("lobby-room-code");
const lobbyPlayerCount = document.getElementById("lobby-player-count");
const lobbyMessage = document.getElementById("lobby-message");
const leaveLobbyButton = document.getElementById("leave-lobby-button");
const startGameButton = document.getElementById("start-game-button");

// ========================================
// ACCOUNT DATA
// ========================================

let accounts = {};

try {
  accounts = JSON.parse(localStorage.getItem(ACCOUNT_STORAGE_KEY)) || {};
} catch {
  accounts = {};
}

let currentAccountKey = null;
let isGuest = false;

let tokens = STARTING_TOKENS;
let collection = {};
let lastDailyClaim = 0;
let equippedBlook = null;

// ========================================
// MULTIPLAYER DATA
// ========================================

let selectedGameMode = null;
let currentRoomCode = null;

let multiplayerPeer = null;
let myConnection = null;

let isRoomHost = false;
let isConnecting = false;

let hostConnections = new Map();
let roomPlayers = new Map();

// ========================================
// PACK DATA
// ========================================

const packs = [
  {
    name: "Starter Pack",
    price: 0,
    image: "assets/packs/starter.png",
    description:
      "Welcome to Blocket! Start your collection with the Starter Pack.",
    blooks: [
      {
        name: "Dog",
        rarity: "Common",
        chance: 60,
        image: "assets/blooks/dog.png",
      },
      {
        name: "Cat",
        rarity: "Uncommon",
        chance: 25,
        image: "assets/blooks/cat.png",
      },
      {
        name: "Dragon",
        rarity: "Rare",
        chance: 12,
        image: "assets/blooks/dragon.png",
      },
      {
        name: "Golden Dragon",
        rarity: "Legendary",
        chance: 3,
        image: "assets/blooks/golden-dragon.png",
      },
    ],
  },

  {
    name: "Color Pack",
    price: 25,
    image: "assets/packs/color.png",
    description: "Bring some color to your collection!",
    blooks: [
      {
        name: "Red",
        rarity: "Uncommon",
        chance: 21.31617,
        image: "assets/blooks/color/red.png",
      },
      {
        name: "Yellow",
        rarity: "Uncommon",
        chance: 21.31617,
        image: "assets/blooks/color/yellow.png",
      },
      {
        name: "Blue",
        rarity: "Uncommon",
        chance: 21.31616,
        image: "assets/blooks/color/blue.png",
      },
      {
        name: "Orange",
        rarity: "Rare",
        chance: 10,
        image: "assets/blooks/color/orange.png",
      },
      {
        name: "Lime",
        rarity: "Rare",
        chance: 10,
        image: "assets/blooks/color/lime.png",
      },
      {
        name: "Green",
        rarity: "Epic",
        chance: 5,
        image: "assets/blooks/color/green.png",
      },
      {
        name: "Purple",
        rarity: "Epic",
        chance: 5,
        image: "assets/blooks/color/purple.png",
      },
      {
        name: "Pink",
        rarity: "Epic",
        chance: 5,
        image: "assets/blooks/color/pink.png",
      },
      {
        name: "White",
        rarity: "Legendary",
        chance: 0.5,
        image: "assets/blooks/color/white.png",
      },
      {
        name: "Black",
        rarity: "Legendary",
        chance: 0.5,
        image: "assets/blooks/color/black.png",
      },
      {
        name: "Grey",
        rarity: "Chroma",
        chance: 0.05,
        image: "assets/blooks/color/grey.png",
      },
      {
        name: "Rainbow",
        rarity: "Mystical",
        chance: 0.001,
        image: "assets/blooks/color/rainbow.png",
      },
      {
        name: "Dr. Hue N. Spectrum",
        rarity: "Unique",
        chance: 0.0005,
        image: "assets/blooks/color/dr-hue-n-spectrum.png",
      },
    ],
  },
];

// ========================================
// ACCOUNT SAVING
// ========================================

function saveAccounts() {
  localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
}

async function hashPassword(password, saltHex) {
  if (!crypto.subtle) {
    throw new Error(
      "Password hashing is unavailable. Open Blocket using localhost or HTTPS.",
    );
  }

  const salt = new Uint8Array(
    saltHex.match(/.{2}/g).map((byte) => parseInt(byte, 16)),
  );

  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const result = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 150000,
      hash: "SHA-256",
    },
    key,
    256,
  );

  return Array.from(new Uint8Array(result))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function generateSalt() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

// ========================================
// EQUIPPED BLOOK SYSTEM
// ========================================

function isBlookOwned(packIndex, blookName) {
  return Number(collection[packIndex]?.[blookName] || 0) > 0;
}

function getEquippedBlookData() {
  if (!equippedBlook) return null;

  const pack = packs[equippedBlook.packIndex];

  if (!pack) return null;

  return (
    pack.blooks.find((item) => item.name === equippedBlook.blookName) || null
  );
}

function equipBlook(packIndex, blookName) {
  if (!isBlookOwned(packIndex, blookName)) return false;

  equippedBlook = {
    packIndex,
    blookName,
  };

  saveAccountProgress();
  displayCollection();

  return true;
}

function unequipBlook() {
  equippedBlook = null;

  saveAccountProgress();
  displayCollection();
}

// ========================================
// ACCOUNT PROGRESS
// ========================================

function saveAccountProgress() {
  if (!currentAccountKey || isGuest) return;

  const account = accounts[currentAccountKey];

  if (!account) return;

  account.tokens = tokens;
  account.collection = collection;
  account.lastDailyClaim = lastDailyClaim;
  account.equippedBlook = equippedBlook;

  saveAccounts();
}

function loadAccountProgress(accountKey) {
  const account = accounts[accountKey];

  if (!account) return;

  tokens = Number.isFinite(account.tokens) ? account.tokens : STARTING_TOKENS;

  collection =
    account.collection && typeof account.collection === "object"
      ? account.collection
      : {};

  lastDailyClaim = Number(account.lastDailyClaim) || 0;
  equippedBlook = account.equippedBlook || null;

  if (
    equippedBlook &&
    !isBlookOwned(equippedBlook.packIndex, equippedBlook.blookName)
  ) {
    equippedBlook = null;
  }

  currentAccountKey = accountKey;
  isGuest = false;

  localStorage.setItem(SESSION_STORAGE_KEY, accountKey);

  updateTokenDisplay();
  updateDailyRewardButton();
  displayCollection();
}

// ========================================
// ACCOUNT SCREENS
// ========================================

function showAccountScreen(screen) {
  document.getElementById("account-screen").style.display =
    screen === "welcome" ? "flex" : "none";

  document.getElementById("login-screen").style.display =
    screen === "login" ? "flex" : "none";

  document.getElementById("signup-screen").style.display =
    screen === "signup" ? "flex" : "none";

  document.getElementById("app-layout").style.display = "none";
}

function enterBlocket() {
  document.getElementById("account-screen").style.display = "none";
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("signup-screen").style.display = "none";

  document.getElementById("app-layout").style.display = "";

  const usernameDisplay = document.getElementById("username-display");

  if (usernameDisplay) {
    usernameDisplay.textContent = isGuest
      ? "👤 Guest"
      : "👤 " + accounts[currentAccountKey].username;
  }

  updateTokenDisplay();
  updateDailyRewardButton();
  displayCollection();

  showPage("packs");
}

// ========================================
// TOKEN SYSTEM
// ========================================

function saveTokens() {
  saveAccountProgress();
}

function updateTokenDisplay() {
  const display = document.getElementById("token-balance");

  if (display) {
    display.textContent = tokens.toLocaleString();
  }
}

// ========================================
// DAILY REWARDS
// ========================================

function updateDailyRewardButton() {
  if (!dailyRewardButton) return;

  const remaining = DAILY_COOLDOWN - (Date.now() - lastDailyClaim);

  if (!lastDailyClaim || remaining <= 0) {
    dailyRewardButton.disabled = false;
    dailyRewardButton.textContent = "🎁 Claim Daily Reward";
  } else {
    dailyRewardButton.disabled = true;

    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);

    dailyRewardButton.textContent = `🎁 ${hours}h ${minutes}m remaining`;
  }
}

dailyRewardButton.addEventListener("click", () => {
  const remaining = DAILY_COOLDOWN - (Date.now() - lastDailyClaim);

  if (lastDailyClaim && remaining > 0) {
    updateDailyRewardButton();
    return;
  }

  tokens += DAILY_REWARD;
  lastDailyClaim = Date.now();

  saveTokens();
  updateTokenDisplay();
  updateDailyRewardButton();

  alert(`You received ${DAILY_REWARD.toLocaleString()} tokens! 🎉`);
});

setInterval(updateDailyRewardButton, 60000);

// ========================================
// COLLECTION SAVING
// ========================================

function saveCollection() {
  saveAccountProgress();
}

// ========================================
// NAVIGATION
// ========================================

function showPage(page) {
  packsPage.style.display = page === "packs" ? "block" : "none";

  collectionPage.style.display = page === "collection" ? "block" : "none";

  playPage.style.display = page === "play" ? "block" : "none";

  hostPage.style.display = page === "host" ? "block" : "none";

  lobbyPage.style.display = page === "lobby" ? "block" : "none";

  packsNav.classList.toggle("active", page === "packs");
  collectionNav.classList.toggle("active", page === "collection");
  playNav.classList.toggle("active", page === "play");
  hostNav.classList.toggle("active", page === "host");

  if (page === "collection") {
    displayCollection();
  }
}

packsNav.addEventListener("click", () => showPage("packs"));
collectionNav.addEventListener("click", () => showPage("collection"));
playNav.addEventListener("click", () => showPage("play"));
hostNav.addEventListener("click", () => showPage("host"));

// ========================================
// DISPLAY PACKS
// ========================================

function displayPacks() {
  packContainer.innerHTML = "";

  packs.forEach((pack, index) => {
    const card = document.createElement("div");
    card.className = "pack-card";

    card.innerHTML = `
            <div class="pack-image">
                <img src="${pack.image}" alt="${pack.name}">
            </div>
            <h3>${pack.name}</h3>
            <p>${pack.price === 0 ? "FREE" : "🪙 " + pack.price}</p>
        `;

    card.addEventListener("click", () => {
      openPackDetails(index);
    });

    packContainer.appendChild(card);
  });
}

// ========================================
// PACK DETAILS
// ========================================

function openPackDetails(index) {
  const pack = packs[index];

  document.getElementById("pack-popup")?.remove();

  let quantity = 1;

  const popup = document.createElement("div");
  popup.id = "pack-popup";

  popup.innerHTML = `
        <div class="popup-content bulk-popup">
            <button class="close-popup">×</button>

            <img class="details-pack-image"
                src="${pack.image}" alt="${pack.name}">

            <h2>${pack.name}</h2>
            <p>${pack.description}</p>

            <button class="drop-rate-button">Show Drop Rates</button>

            <div class="drop-rates" style="display:none;">
                ${pack.blooks
                  .map(
                    (blook) => `
                    <div class="drop-rate-row">
                        <span>${blook.name}</span>
                        <span class="rarity-${blook.rarity.toLowerCase()}">
                            ${blook.rarity}
                        </span>
                        <strong>${blook.chance}%</strong>
                    </div>
                `,
                  )
                  .join("")}
            </div>

            <div class="pack-price">
                ${pack.price === 0 ? "FREE" : "🪙 " + pack.price}
            </div>

            <div class="quantity-heading">
                <label>Purchase Quantity:</label>
                <input class="quantity-input" type="number"
                    min="1" max="${MAX_QUANTITY}" value="1">
            </div>

            <div class="quantity-controls">
                <button data-change="-1">−1</button>
                <button data-change="1">+1</button>
                <button data-change="5">+5</button>
                <button data-change="10">+10</button>
            </div>

            <div class="quantity-presets">
                ${[1, 5, 10, 25, 50, 100]
                  .map(
                    (amount) => `
                    <button data-quantity="${amount}">${amount}</button>
                `,
                  )
                  .join("")}
                <button class="reset-quantity">↻</button>
            </div>

            <button class="purchase-button"></button>
        </div>
    `;

  document.body.appendChild(popup);

  const input = popup.querySelector(".quantity-input");
  const purchaseButton = popup.querySelector(".purchase-button");

  function updateQuantity(value) {
    quantity = Math.max(1, Math.min(MAX_QUANTITY, Math.floor(value) || 1));

    input.value = quantity;

    purchaseButton.textContent =
      pack.price === 0
        ? `OPEN ${quantity} ${quantity === 1 ? "PACK" : "PACKS"}`
        : `BUY ${quantity} FOR 🪙 ${quantity * pack.price}`;
  }

  input.addEventListener("input", () => {
    if (input.value !== "") {
      updateQuantity(Number(input.value));
    }
  });

  input.addEventListener("change", () => {
    updateQuantity(Number(input.value));
  });

  popup.querySelectorAll("[data-change]").forEach((button) => {
    button.addEventListener("click", () => {
      updateQuantity(quantity + Number(button.dataset.change));
    });
  });

  popup.querySelectorAll("[data-quantity]").forEach((button) => {
    button.addEventListener("click", () => {
      updateQuantity(Number(button.dataset.quantity));
    });
  });

  popup.querySelector(".reset-quantity").onclick = () => {
    updateQuantity(1);
  };

  const dropButton = popup.querySelector(".drop-rate-button");
  const dropRates = popup.querySelector(".drop-rates");

  dropButton.onclick = () => {
    const visible = dropRates.style.display !== "none";

    dropRates.style.display = visible ? "none" : "block";

    dropButton.textContent = visible ? "Show Drop Rates" : "Hide Drop Rates";
  };

  popup.querySelector(".close-popup").onclick = () => {
    popup.remove();
  };

  popup.addEventListener("click", (event) => {
    if (event.target === popup) popup.remove();
  });

  purchaseButton.onclick = () => {
    const totalCost = quantity * pack.price;

    if (tokens < totalCost) {
      alert("Not enough tokens!");
      return;
    }

    tokens -= totalCost;

    saveTokens();
    updateTokenDisplay();

    const amount = quantity;

    popup.remove();

    openPack(index, amount);
  };

  updateQuantity(1);
}

// ========================================
// RANDOM BLOOK SELECTION
// ========================================

function getRandomBlook(pack) {
  const totalChance = pack.blooks.reduce(
    (total, blook) => total + blook.chance,
    0,
  );

  let random = Math.random() * totalChance;

  for (const blook of pack.blooks) {
    random -= blook.chance;

    if (random < 0) return blook;
  }

  return pack.blooks[0];
}

// ========================================
// OPEN PACKS
// ========================================

function openPack(index, amount = 1) {
  const pack = packs[index];

  const popup = document.createElement("div");
  popup.id = "pack-popup";

  popup.innerHTML = `
        <div class="popup-content opening-popup">
            <h2>OPENING ${amount} ${amount === 1 ? "PACK" : "PACKS"}!</h2>
            <img class="opening-image"
                src="${pack.image}" alt="${pack.name}">
            <p>Let's see what you got!</p>
        </div>
    `;

  document.body.appendChild(popup);

  setTimeout(() => {
    const rewards = [];

    for (let i = 0; i < amount; i++) {
      const reward = getRandomBlook(pack);

      rewards.push(reward);

      if (!collection[index]) {
        collection[index] = {};
      }

      collection[index][reward.name] =
        (collection[index][reward.name] || 0) + 1;
    }

    saveCollection();

    const groupedRewards = {};

    rewards.forEach((reward) => {
      if (!groupedRewards[reward.name]) {
        groupedRewards[reward.name] = {
          ...reward,
          count: 0,
        };
      }

      groupedRewards[reward.name].count++;
    });

    popup.innerHTML = `
            <div class="results-screen">
                <button class="close-popup">×</button>
                <h1>Pack Results</h1>

                <div class="results-grid">
                    ${Object.values(groupedRewards)
                      .map(
                        (reward) => `
                        <div class="result-blook">
                            <img src="${reward.image}"
                                alt="${reward.name}"
                                title="${reward.name} - ${reward.rarity}">
                            <div class="result-count">${reward.count}</div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>

                <button class="results-done">AWESOME!</button>
            </div>
        `;

    popup.querySelector(".close-popup").onclick = () => {
      popup.remove();
    };

    popup.querySelector(".results-done").onclick = () => {
      popup.remove();
    };
  }, 1800);
}

// ========================================
// BLOOK DETAILS + EQUIPPING
// ========================================

function openBlookDetails(blook, count, packIndex) {
  document.getElementById("blook-details-popup")?.remove();

  const popup = document.createElement("div");
  popup.id = "blook-details-popup";

  const isEquipped =
    equippedBlook &&
    equippedBlook.packIndex === packIndex &&
    equippedBlook.blookName === blook.name;

  popup.innerHTML = `
        <div class="popup-content blook-details">
            <button class="close-popup">×</button>

            <img src="${blook.image}" alt="${blook.name}">

            <h2>${blook.name}</h2>

            <div class="rarity rarity-${blook.rarity.toLowerCase()}">
                ${blook.rarity}
            </div>

            <div class="owned-count">Owned: ${count}</div>

            ${
              isEquipped
                ? `<p class="equipped-status">✓ Currently Equipped</p>`
                : ""
            }

            <button class="equip-blook-button"
                ${count <= 0 ? "disabled" : ""}>
                ${count <= 0 ? "LOCKED" : isEquipped ? "UNEQUIP" : "EQUIP"}
            </button>
        </div>
    `;

  popup.style.position = "fixed";
  popup.style.inset = "0";
  popup.style.background = "rgba(30,50,70,0.65)";
  popup.style.display = "flex";
  popup.style.justifyContent = "center";
  popup.style.alignItems = "center";
  popup.style.zIndex = "1000";
  popup.style.padding = "20px";

  document.body.appendChild(popup);

  popup.querySelector(".close-popup").onclick = () => {
    popup.remove();
  };

  popup.addEventListener("click", (event) => {
    if (event.target === popup) popup.remove();
  });

  popup.querySelector(".equip-blook-button").addEventListener("click", () => {
    if (count <= 0) return;

    if (isEquipped) {
      unequipBlook();
    } else {
      equipBlook(packIndex, blook.name);
    }

    popup.remove();

    openBlookDetails(
      blook,
      collection[packIndex]?.[blook.name] || 0,
      packIndex,
    );
  });
}

// ========================================
// COLLECTION PAGE
// ========================================

function displayCollection() {
  collectionContainer.innerHTML = "";

  packs.forEach((pack, packIndex) => {
    const ownedBlooks = collection[packIndex] || {};

    const section = document.createElement("div");
    section.className = "collection-section";

    section.innerHTML = `
            <h2 class="collection-pack-title">${pack.name}</h2>

            <div class="collection-blook-row">
                ${pack.blooks
                  .map((blook, blookIndex) => {
                    const count = ownedBlooks[blook.name] || 0;
                    const locked = count === 0;

                    const isEquipped =
                      equippedBlook &&
                      equippedBlook.packIndex === packIndex &&
                      equippedBlook.blookName === blook.name;

                    return `
                        <div class="collection-blook
                            ${locked ? "locked" : ""}
                            ${isEquipped ? "equipped" : ""}"
                            data-pack="${packIndex}"
                            data-blook="${blookIndex}"
                            title="${locked ? "Locked" : blook.name}">

                            <img src="${blook.image}"
                                alt="${blook.name}">

                            ${
                              locked
                                ? `<div class="locked-overlay">?</div>`
                                : `<div class="collection-count">${count}</div>`
                            }

                            ${
                              isEquipped
                                ? `<div class="equipped-marker">EQUIPPED</div>`
                                : ""
                            }
                        </div>
                    `;
                  })
                  .join("")}
            </div>
        `;

    section.querySelectorAll(".collection-blook").forEach((tile) => {
      tile.addEventListener("click", () => {
        const selectedPackIndex = Number(tile.dataset.pack);
        const selectedPack = packs[selectedPackIndex];
        const selectedBlook = selectedPack.blooks[Number(tile.dataset.blook)];

        const count = collection[selectedPackIndex]?.[selectedBlook.name] || 0;

        openBlookDetails(selectedBlook, count, selectedPackIndex);
      });
    });

    collectionContainer.appendChild(section);
  });
}

// ========================================
// GAME MODE SELECTION
// ========================================

gameModeCards.forEach((card) => {
  card.addEventListener("click", () => {
    gameModeCards.forEach((otherCard) => {
      otherCard.classList.remove("selected");
    });

    card.classList.add("selected");

    selectedGameMode = card.dataset.gameMode;

    const gameNames = {
      imposter: "Imposter",
      pirate: "Pirate Treasure",
    };

    selectedGameMessage.textContent =
      gameNames[selectedGameMode] + " selected! Ready to host?";

    createGameButton.disabled = false;
  });
});

// ========================================
// MULTIPLAYER PLAYER INFORMATION
// ========================================

function getLocalPlayerInfo() {
  const blook = getEquippedBlookData();

  return {
    username: isGuest
      ? "Guest"
      : accounts[currentAccountKey]?.username || "Player",

    blookName: blook?.name || null,
    blookImage: blook?.image || null,
  };
}

// ========================================
// ROOM CODE
// ========================================

function generateRoomCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < 6; i++) {
    code += characters[Math.floor(Math.random() * characters.length)];
  }

  return code;
}

// ========================================
// DISPLAY LOBBY PLAYERS
// ========================================

function renderLobbyPlayers(players) {
  const playerList = document.getElementById("lobby-player-list");

  playerList.innerHTML = "";

  players.forEach((player) => {
    const card = document.createElement("div");
    card.className = "lobby-player";

    const blookContainer = document.createElement("div");
    blookContainer.className = "lobby-player-blook";

    if (player.blookImage) {
      const image = document.createElement("img");

      image.src = player.blookImage;
      image.alt = player.blookName || "Equipped Blook";

      blookContainer.appendChild(image);
    }

    const info = document.createElement("div");
    info.className = "lobby-player-info";

    const username = document.createElement("strong");
    username.textContent = player.username;

    const role = document.createElement("span");
    role.textContent = player.isHost ? "Host" : "Player";

    info.append(username, role);
    card.append(blookContainer, info);

    if (player.isHost) {
      const badge = document.createElement("div");

      badge.className = "host-badge";
      badge.textContent = "HOST";

      card.appendChild(badge);
    }

    playerList.appendChild(card);
  });

  lobbyPlayerCount.textContent =
    players.length + (players.length === 1 ? " Player" : " Players");
}

function getRoomPlayerArray() {
  return Array.from(roomPlayers.values());
}

// ========================================
// HOST BROADCASTS LOBBY
// ========================================

function broadcastLobbyUpdate() {
  if (!isRoomHost) return;

  const message = {
    type: "lobby-update",
    roomCode: currentRoomCode,
    gameMode: selectedGameMode,
    players: getRoomPlayerArray(),
  };

  hostConnections.forEach((connection) => {
    if (connection.open) {
      connection.send(message);
    }
  });

  renderLobbyPlayers(getRoomPlayerArray());
}

// ========================================
// HANDLE HOST CONNECTIONS
// ========================================

function setupHostConnection(connection) {
  connection.on("data", (data) => {
    if (!data || typeof data !== "object") return;

    if (data.type === "join") {
      if (roomPlayers.size >= MAX_PLAYERS) {
        connection.send({
          type: "room-full",
        });

        connection.close();
        return;
      }

      const player = {
        id: connection.peer,

        username: String(data.player?.username || "Player").slice(0, 20),

        blookName: data.player?.blookName || null,
        blookImage: data.player?.blookImage || null,
        isHost: false,
      };

      hostConnections.set(connection.peer, connection);
      roomPlayers.set(connection.peer, player);

      lobbyMessage.textContent = player.username + " joined the lobby!";

      broadcastLobbyUpdate();
    }
  });

  connection.on("close", () => {
    hostConnections.delete(connection.peer);
    roomPlayers.delete(connection.peer);

    if (isRoomHost) {
      broadcastLobbyUpdate();
      lobbyMessage.textContent = "A player left the lobby.";
    }
  });

  connection.on("error", (error) => {
    console.error("Player connection error:", error);
  });
}

// ========================================
// CREATE MULTIPLAYER ROOM
// ========================================

function createLobby(attempt = 0) {
  if (!selectedGameMode || isConnecting) return;

  if (typeof Peer === "undefined") {
    lobbyMessage.textContent = "PeerJS failed to load. Refresh the page.";
    return;
  }

  if (attempt >= 5) {
    lobbyMessage.textContent =
      "Couldn't find an available room code. Try again.";

    createGameButton.disabled = false;
    isConnecting = false;
    return;
  }

  isConnecting = true;
  isRoomHost = true;

  currentRoomCode = generateRoomCode();

  roomPlayers.clear();
  hostConnections.clear();

  createGameButton.disabled = true;
  lobbyMessage.textContent = "Creating your room...";

  multiplayerPeer = new Peer("blocket-" + currentRoomCode);

  multiplayerPeer.on("open", () => {
    const localPlayer = getLocalPlayerInfo();

    roomPlayers.set("host", {
      id: "host",
      username: localPlayer.username,
      blookName: localPlayer.blookName,
      blookImage: localPlayer.blookImage,
      isHost: true,
    });

    const gameNames = {
      imposter: "Imposter",
      pirate: "Pirate Treasure",
    };

    lobbyGameName.textContent = gameNames[selectedGameMode];

    lobbyRoomCode.textContent = currentRoomCode;

    renderLobbyPlayers(getRoomPlayerArray());

    lobbyMessage.textContent = "Your room is ready! Invite your friends.";

    startGameButton.style.display = "";
    startGameButton.disabled = false;

    showPage("lobby");

    createGameButton.disabled = false;
    isConnecting = false;
  });

  multiplayerPeer.on("connection", (connection) => {
    setupHostConnection(connection);
  });

  multiplayerPeer.on("error", (error) => {
    console.error("PeerJS host error:", error);

    if (error.type === "unavailable-id") {
      multiplayerPeer.destroy();
      multiplayerPeer = null;

      isConnecting = false;
      createLobby(attempt + 1);
      return;
    }

    lobbyMessage.textContent = "Connection error: " + error.type;

    createGameButton.disabled = false;
    isConnecting = false;
  });
}

// ========================================
// CREATE GAME BUTTON
// ========================================

createGameButton.addEventListener("click", () => {
  if (!selectedGameMode) return;

  createLobby();
});

// ========================================
// JOIN MULTIPLAYER ROOM
// ========================================

joinGameButton.addEventListener("click", () => {
  const roomCode = joinRoomCode.value.trim().toUpperCase();

  if (!/^[A-HJ-NP-Z2-9]{6}$/.test(roomCode)) {
    joinGameMessage.textContent = "Enter a valid 6-character room code!";

    joinGameMessage.style.color = "#e74c3c";
    return;
  }

  if (isConnecting) return;

  if (typeof Peer === "undefined") {
    joinGameMessage.textContent = "PeerJS failed to load. Refresh the page.";
    return;
  }

  if (multiplayerPeer) {
    multiplayerPeer.destroy();
    multiplayerPeer = null;
  }

  isConnecting = true;
  joinGameButton.disabled = true;

  joinGameMessage.textContent = "Finding room...";
  joinGameMessage.style.color = "#8B5CF6";

  multiplayerPeer = new Peer();

  multiplayerPeer.on("open", () => {
    myConnection = multiplayerPeer.connect("blocket-" + roomCode, {
      reliable: true,
    });

    myConnection.on("open", () => {
      myConnection.send({
        type: "join",
        player: getLocalPlayerInfo(),
      });

      joinGameMessage.textContent = "Connected! Loading lobby...";
    });

    myConnection.on("data", (data) => {
      if (!data || typeof data !== "object") return;

      if (data.type === "room-full") {
        joinGameMessage.textContent = "Sorry, this room is full!";

        joinGameButton.disabled = false;
        isConnecting = false;
        return;
      }

      if (data.type === "host-left") {
        lobbyMessage.textContent = "The host closed the room.";
        return;
      }

      if (data.type === "lobby-update") {
        currentRoomCode = data.roomCode;
        selectedGameMode = data.gameMode;

        isRoomHost = false;

        const gameNames = {
          imposter: "Imposter",
          pirate: "Pirate Treasure",
        };

        lobbyGameName.textContent = gameNames[selectedGameMode] || "Game";

        lobbyRoomCode.textContent = currentRoomCode;

        roomPlayers.clear();

        data.players.forEach((player) => {
          roomPlayers.set(player.id, player);
        });

        renderLobbyPlayers(data.players);

        lobbyMessage.textContent = "Connected to the host!";

        startGameButton.style.display = "none";

        joinGameMessage.textContent = "";

        joinGameButton.disabled = false;
        isConnecting = false;

        showPage("lobby");
      }

      // ========================================
      // PIRATE TREASURE MULTIPLAYER MESSAGES
      // ========================================

      if (data.type === "pirate-start") {
        startPirateGameClient(data.state);
      }

      if (data.type === "pirate-state") {
        pirateGameState = data.state;
        renderPirateGame();
      }

      // ========================================
      // OTHER GAME MODE MESSAGES
      // ========================================

      if (data.type === "game-starting") {
        lobbyMessage.textContent = "The host is starting the game!";
      }
    });

    myConnection.on("close", () => {
      lobbyMessage.textContent = "Disconnected from the host.";

      joinGameButton.disabled = false;
      isConnecting = false;
    });

    myConnection.on("error", (error) => {
      console.error(error);

      joinGameMessage.textContent = "Couldn't connect to that room.";

      joinGameButton.disabled = false;
      isConnecting = false;
    });
  });

  multiplayerPeer.on("error", (error) => {
    console.error("Join error:", error);

    joinGameMessage.textContent =
      error.type === "peer-unavailable"
        ? "Room not found! Check the code."
        : "Connection error. Please try again.";

    joinGameButton.disabled = false;
    isConnecting = false;
  });
});

// ========================================
// LEAVE LOBBY
// ========================================

leaveLobbyButton.addEventListener("click", () => {
  const wasHost = isRoomHost;

  if (wasHost) {
    hostConnections.forEach((connection) => {
      if (connection.open) {
        connection.send({
          type: "host-left",
        });

        connection.close();
      }
    });
  }

  if (myConnection) {
    myConnection.close();
    myConnection = null;
  }

  if (multiplayerPeer) {
    multiplayerPeer.destroy();
    multiplayerPeer = null;
  }

  hostConnections.clear();
  roomPlayers.clear();

  currentRoomCode = null;
  isRoomHost = false;
  isConnecting = false;

  startGameButton.style.display = "";

  showPage(wasHost ? "host" : "play");
});

// ========================================
// START GAME
// ========================================

startGameButton.addEventListener("click", () => {
  if (!isRoomHost) return;

  // Start Pirate Treasure when that mode is selected.
  if (selectedGameMode === "pirate") {
    startPirateGame();
    return;
  }

  // Other game modes.
  hostConnections.forEach((connection) => {
    if (connection.open) {
      connection.send({
        type: "game-starting",
        gameMode: selectedGameMode,
      });
    }
  });

  lobbyMessage.textContent = "Imposter gameplay is coming next!";
});

// ========================================
// ACCOUNT BUTTONS
// ========================================

document.getElementById("login-button").addEventListener("click", () => {
  document.getElementById("login-message").textContent = "";
  showAccountScreen("login");
});

document.getElementById("signup-button").addEventListener("click", () => {
  document.getElementById("signup-message").textContent = "";
  showAccountScreen("signup");
});

document.getElementById("login-back").addEventListener("click", () => {
  showAccountScreen("welcome");
});

document.getElementById("signup-back").addEventListener("click", () => {
  showAccountScreen("welcome");
});

// ========================================
// SIGN UP
// ========================================

document.getElementById("signup-submit").addEventListener("click", async () => {
  const usernameInput = document.getElementById("signup-username");
  const passwordInput = document.getElementById("signup-password");
  const confirmInput = document.getElementById("signup-confirm");
  const message = document.getElementById("signup-message");

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmInput.value;

  const usernameKey = username.toLowerCase();

  message.style.color = "#e74c3c";

  if (!/^[a-zA-Z0-9_]{3,16}$/.test(username)) {
    message.textContent =
      "Username must be 3-16 characters and use only letters, numbers, or underscores.";
    return;
  }

  if (accounts[usernameKey]) {
    message.textContent = "That username is already taken!";
    return;
  }

  if (password.length < 6) {
    message.textContent = "Your password must be at least 6 characters!";
    return;
  }

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match!";
    return;
  }

  const submitButton = document.getElementById("signup-submit");

  submitButton.disabled = true;
  submitButton.textContent = "Creating account...";

  try {
    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    let startingTokens = STARTING_TOKENS;
    let startingCollection = {};
    let startingDailyClaim = 0;

    if (Object.keys(accounts).length === 0) {
      const oldTokens = localStorage.getItem("blocket_tokens");

      if (oldTokens !== null) {
        const parsedTokens = Number(oldTokens);

        if (Number.isFinite(parsedTokens) && parsedTokens >= 0) {
          startingTokens = parsedTokens;
        }
      }

      try {
        startingCollection =
          JSON.parse(localStorage.getItem("blocket_collection")) || {};
      } catch {
        startingCollection = {};
      }

      startingDailyClaim =
        Number(localStorage.getItem("blocket_daily_claim")) || 0;
    }

    accounts[usernameKey] = {
      username,
      salt,
      passwordHash,
      tokens: startingTokens,
      collection: startingCollection,
      lastDailyClaim: startingDailyClaim,
      equippedBlook: null,
    };

    saveAccounts();

    loadAccountProgress(usernameKey);
    enterBlocket();
  } catch (error) {
    message.textContent =
      error.message || "Something went wrong creating your account.";
  }

  submitButton.disabled = false;
  submitButton.textContent = "Create Account";
});

// ========================================
// LOG IN
// ========================================

document.getElementById("login-submit").addEventListener("click", async () => {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const message = document.getElementById("login-message");

  const usernameKey = username.toLowerCase();

  message.style.color = "#e74c3c";

  const account = accounts[usernameKey];

  if (!account) {
    message.textContent = "Account not found!";
    return;
  }

  const submitButton = document.getElementById("login-submit");

  submitButton.disabled = true;
  submitButton.textContent = "Logging in...";

  try {
    const passwordHash = await hashPassword(password, account.salt);

    if (passwordHash !== account.passwordHash) {
      message.textContent = "Incorrect password!";
    } else {
      loadAccountProgress(usernameKey);
      enterBlocket();
    }
  } catch (error) {
    message.textContent = error.message || "Something went wrong logging in.";
  }

  submitButton.disabled = false;
  submitButton.textContent = "Log In";
});

// ========================================
// PLAY AS GUEST
// ========================================

document.getElementById("guest-button").addEventListener("click", () => {
  currentAccountKey = null;
  isGuest = true;

  tokens = STARTING_TOKENS;
  collection = {};
  lastDailyClaim = 0;
  equippedBlook = null;

  localStorage.removeItem(SESSION_STORAGE_KEY);

  enterBlocket();
});

// ========================================
// LOG OUT
// ========================================

const logoutButton = document.createElement("button");

logoutButton.id = "logout-button";
logoutButton.className = "nav-button";
logoutButton.textContent = "🚪 Log Out";

document.querySelector(".side-nav").appendChild(logoutButton);

logoutButton.addEventListener("click", () => {
  // Close any active multiplayer connections first.
  if (isRoomHost) {
    hostConnections.forEach((connection) => {
      if (connection.open) {
        connection.send({ type: "host-left" });
        connection.close();
      }
    });
  }

  if (myConnection) {
    myConnection.close();
    myConnection = null;
  }

  if (multiplayerPeer) {
    multiplayerPeer.destroy();
    multiplayerPeer = null;
  }

  hostConnections.clear();
  roomPlayers.clear();

  currentRoomCode = null;
  isRoomHost = false;
  isConnecting = false;

  localStorage.removeItem(SESSION_STORAGE_KEY);

  currentAccountKey = null;
  isGuest = false;

  tokens = STARTING_TOKENS;
  collection = {};
  lastDailyClaim = 0;
  equippedBlook = null;

  selectedGameMode = null;

  gameModeCards.forEach((card) => {
    card.classList.remove("selected");
  });

  createGameButton.disabled = true;

  selectedGameMessage.textContent = "Select a game mode to continue.";

  document.getElementById("pack-popup")?.remove();
  document.getElementById("blook-details-popup")?.remove();

  document.getElementById("login-username").value = "";
  document.getElementById("login-password").value = "";

  showAccountScreen("welcome");
});

// ========================================
// START BLOCKET
// ========================================

displayPacks();
displayCollection();
updateTokenDisplay();
updateDailyRewardButton();

showPage("packs");

// ========================================
// CHECK EXISTING SESSION
// ========================================

const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);

if (savedSession && accounts[savedSession]) {
  loadAccountProgress(savedSession);
  enterBlocket();
} else {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  showAccountScreen("welcome");
}
