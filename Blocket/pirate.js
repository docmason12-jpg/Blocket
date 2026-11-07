// ========================================
// BLOCKET - PIRATE TREASURE
// ========================================

const PIRATE_MATCH_LENGTH = 180;
const PIRATE_QUESTION_LENGTH = 12;
const PIRATE_POWER_REWARD = 10;
const PIRATE_WIN_REWARD = 500;

const pirateQuestions = [
  {
    question: "What is the name of a pirate's traditional ship?",
    answers: ["Galleon", "Submarine", "Airship", "Canoe"],
    correct: 0,
  },
  {
    question: "Which direction does the sun rise from?",
    answers: ["West", "North", "East", "South"],
    correct: 2,
  },
  {
    question: "How many sides does a hexagon have?",
    answers: ["Five", "Six", "Seven", "Eight"],
    correct: 1,
  },
  {
    question: "Which animal is known as the king of the jungle?",
    answers: ["Tiger", "Elephant", "Lion", "Wolf"],
    correct: 2,
  },
  {
    question: "What is frozen water called?",
    answers: ["Steam", "Ice", "Mist", "Salt"],
    correct: 1,
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
  },
  {
    question: "How many minutes are in one hour?",
    answers: ["30", "45", "60", "100"],
    correct: 2,
  },
  {
    question: "Which ocean is the largest?",
    answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correct: 3,
  },
  {
    question: "What do bees make?",
    answers: ["Milk", "Honey", "Bread", "Juice"],
    correct: 1,
  },
  {
    question: "What is 9 × 7?",
    answers: ["56", "63", "72", "49"],
    correct: 1,
  },
  {
    question: "Which is the largest land animal?",
    answers: ["Giraffe", "Rhino", "Elephant", "Hippo"],
    correct: 2,
  },
  {
    question: "What is the capital of France?",
    answers: ["London", "Paris", "Rome", "Madrid"],
    correct: 1,
  },
];

const PIRATE_ISLANDS = [
  {
    id: "tropical",
    name: "Tropical Island",
    emoji: "🌴",
    cost: 10,
    stock: 20,
  },
  {
    id: "volcano",
    name: "Volcano Island",
    emoji: "🌋",
    cost: 20,
    stock: 12,
  },
  {
    id: "skull",
    name: "Skull Island",
    emoji: "💀",
    cost: 30,
    stock: 8,
  },
];

let pirateGameState = null;
let pirateGameTimer = null;
let pirateQuestionTimer = null;
let pirateRewardClaimed = false;
let pirateGameIsHost = false;
let pirateLocalPlayerId = null;

// ========================================
// CREATE GAME INTERFACE
// ========================================

function createPirateInterface() {
  let page = document.getElementById("pirate-game-page");

  if (page) {
    page.remove();
  }

  page = document.createElement("section");
  page.id = "pirate-game-page";

  page.innerHTML = `
        <div class="pirate-game">

            <header class="pirate-header">
                <div>
                    <h1>🏴‍☠️ Pirate Treasure</h1>
                    <p>Answer questions. Sail the seas. Find treasure!</p>
                </div>

                <div class="pirate-timer">
                    <span>TIME LEFT</span>
                    <strong id="pirate-time">03:00</strong>
                </div>
            </header>

            <div class="pirate-stats">
                <div class="pirate-stat">
                    <span>⚡ POWER</span>
                    <strong id="pirate-power">0</strong>
                </div>

                <div class="pirate-stat">
                    <span>💰 LOOT</span>
                    <strong id="pirate-loot">0</strong>
                </div>

                <div class="pirate-stat">
                    <span>📍 LOCATION</span>
                    <strong id="pirate-location">Ship</strong>
                </div>
            </div>

            <div class="pirate-question-card">
                <div class="pirate-section-title">
                    <h2>📜 Captain's Question</h2>
                    <span id="pirate-question-number"></span>
                </div>

                <h3 id="pirate-question">Loading question...</h3>

                <div id="pirate-answers" class="pirate-answers"></div>

                <p id="pirate-answer-message">
                    Answer correctly to earn 10 power!
                </p>
            </div>

            <div class="pirate-map-card">
                <h2>🗺️ Explore the Islands</h2>
                <p>Spend power to sail to an island.</p>

                <div id="pirate-islands" class="pirate-islands"></div>

                <div id="pirate-island-info" class="pirate-island-info">
                    You are aboard your ship. Choose an island!
                </div>

                <button id="pirate-loot-button" disabled>
                    💰 LOOT ISLAND
                </button>
            </div>

            <div class="pirate-leaderboard-card">
                <h2>🏆 Treasure Rankings</h2>
                <div id="pirate-leaderboard"></div>
            </div>

            <div id="pirate-game-message"></div>

        </div>
    `;

  document.querySelector(".main-content").appendChild(page);

  page.querySelectorAll("[data-island]").forEach((button) => {
    button.addEventListener("click", () => {
      travelToPirateIsland(button.dataset.island);
    });
  });

  document
    .getElementById("pirate-loot-button")
    .addEventListener("click", lootPirateIsland);
}

// ========================================
// SHOW GAME PAGE
// ========================================

function showPiratePage() {
  showPage("pirate");

  const page = document.getElementById("pirate-game-page");

  if (page) {
    page.style.display = "block";
  }

  document.querySelector(".main-content").scrollTop = 0;
}

// ========================================
// START GAME - HOST
// ========================================

function startPirateGame() {
  if (!isRoomHost || !multiplayerPeer) return;

  clearInterval(pirateGameTimer);
  clearInterval(pirateQuestionTimer);

  const players = {};

  roomPlayers.forEach((player, id) => {
    players[id] = {
      id,
      username: player.username,
      blookImage: player.blookImage,
      power: 0,
      loot: 0,
      currentIsland: null,
      answeredQuestion: -1,
    };
  });

  pirateGameState = {
    phase: "playing",
    roomCode: currentRoomCode,
    startedAt: Date.now(),
    endsAt: Date.now() + PIRATE_MATCH_LENGTH * 1000,
    questionIndex: 0,
    questionEndsAt: Date.now() + PIRATE_QUESTION_LENGTH * 1000,
    players,
    islands: Object.fromEntries(
      pirateIslands.map((island) => [
        island.id,
        { remaining: island.treasure },
      ]),
    ),
    winners: [],
  };

  pirateGameIsHost = true;
  pirateLocalPlayerId = "host";
  pirateRewardClaimed = false;

  createPirateInterface();
  showPiratePage();

  broadcastPirateState("pirate-start");

  pirateGameTimer = setInterval(() => {
    if (!pirateGameState || pirateGameState.phase !== "playing") {
      return;
    }

    if (Date.now() >= pirateGameState.endsAt) {
      endPirateGame();
      return;
    }

    renderPirateGame();
  }, 1000);

  pirateQuestionTimer = setInterval(() => {
    if (!pirateGameState || pirateGameState.phase !== "playing") {
      return;
    }

    if (Date.now() >= pirateGameState.questionEndsAt) {
      pirateGameState.questionIndex =
        (pirateGameState.questionIndex + 1) % pirateQuestions.length;

      pirateGameState.questionEndsAt =
        Date.now() + PIRATE_QUESTION_LENGTH * 1000;

      broadcastPirateState();
    }
  }, 500);

  renderPirateGame();
}

// ========================================
// START GAME - JOINING PLAYER
// ========================================

function startPirateGameClient(state) {
  clearInterval(pirateGameTimer);
  clearInterval(pirateQuestionTimer);

  pirateGameState = state;
  pirateGameIsHost = false;
  pirateLocalPlayerId = multiplayerPeer?.id;
  pirateRewardClaimed = false;

  createPirateInterface();
  showPiratePage();

  pirateGameTimer = setInterval(() => {
    renderPirateGame();
  }, 1000);

  renderPirateGame();
}

// ========================================
// BROADCAST GAME STATE
// ========================================

function broadcastPirateState(type = "pirate-state") {
  if (!pirateGameIsHost || !pirateGameState) return;

  const message = {
    type,
    state: pirateGameState,
  };

  hostConnections.forEach((connection) => {
    if (connection.open) {
      connection.send(message);
    }
  });

  renderPirateGame();
}

// ========================================
// RECEIVE PLAYER ACTIONS
// ========================================

function handlePirateAction(playerId, data) {
  if (!pirateGameIsHost || !pirateGameState) return;

  if (pirateGameState.phase !== "playing") return;

  const player = pirateGameState.players[playerId];

  if (!player) return;

  if (data.type === "pirate-answer") {
    const questionIndex = pirateGameState.questionIndex;

    if (player.answeredQuestion === questionIndex) return;

    player.answeredQuestion = questionIndex;

    const question = pirateQuestions[questionIndex];

    if (Number(data.answer) === question.correct) {
      player.power += PIRATE_POWER_REWARD;
    }

    broadcastPirateState();
  }

  if (data.type === "pirate-travel") {
    const island = pirateIslands.find((item) => item.id === data.island);

    if (!island) return;

    if (player.power < island.cost) return;

    player.power -= island.cost;
    player.currentIsland = island.id;

    broadcastPirateState();
  }

  if (data.type === "pirate-loot") {
    if (!player.currentIsland) return;

    const island = pirateIslands.find(
      (item) => item.id === player.currentIsland,
    );

    if (!island) return;

    const islandState = pirateGameState.islands[island.id];

    if (!islandState || islandState.remaining <= 0) return;

    islandState.remaining--;

    const treasureFound = Math.floor(Math.random() * 3) + 1;

    player.loot += treasureFound;

    broadcastPirateState();
  }
}

// ========================================
// CONNECT ACTION HANDLER TO EXISTING HOST
// ========================================

const originalPirateHostSetup = setupHostConnection;

setupHostConnection = function (connection) {
  originalPirateHostSetup(connection);

  connection.on("data", (data) => {
    if (!data || typeof data !== "object") return;

    if (
      data.type === "pirate-answer" ||
      data.type === "pirate-travel" ||
      data.type === "pirate-loot"
    ) {
      handlePirateAction(connection.peer, data);
    }
  });

  connection.on("close", () => {
    if (pirateGameIsHost && pirateGameState?.phase === "playing") {
      delete pirateGameState.players[connection.peer];
      broadcastPirateState();
    }
  });
};

// ========================================
// SEND ACTION
// ========================================

function sendPirateAction(data) {
  if (!pirateGameState || pirateGameState.phase !== "playing") return;

  if (pirateGameIsHost) {
    handlePirateAction("host", data);
  } else if (myConnection?.open) {
    myConnection.send(data);
  }
}

// ========================================
// ANSWER QUESTION
// ========================================

function answerPirateQuestion(answerIndex) {
  if (!pirateGameState || pirateGameState.phase !== "playing") return;

  const player = pirateGameState.players[pirateLocalPlayerId];

  if (!player) return;

  if (player.answeredQuestion === pirateGameState.questionIndex) return;

  sendPirateAction({
    type: "pirate-answer",
    answer: answerIndex,
  });
}

// ========================================
// TRAVEL
// ========================================

function travelToPirateIsland(islandId) {
  const island = pirateIslands.find((item) => item.id === islandId);

  if (!island || !pirateGameState) return;

  const player = pirateGameState.players[pirateLocalPlayerId];

  if (!player) return;

  if (player.power < island.cost) {
    document.getElementById("pirate-game-message").textContent =
      `You need ${island.cost} power to sail to ${island.name}!`;
    return;
  }

  sendPirateAction({
    type: "pirate-travel",
    island: islandId,
  });
}

// ========================================
// LOOT ISLAND
// ========================================

function lootPirateIsland() {
  if (!pirateGameState) return;

  const player = pirateGameState.players[pirateLocalPlayerId];

  if (!player || !player.currentIsland) return;

  const islandState = pirateGameState.islands[player.currentIsland];

  if (!islandState || islandState.remaining <= 0) {
    document.getElementById("pirate-game-message").textContent =
      "This island has been completely looted!";
    return;
  }

  sendPirateAction({
    type: "pirate-loot",
  });
}

// ========================================
// RENDER GAME
// ========================================

function renderPirateGame() {
  if (!pirateGameState) return;

  const page = document.getElementById("pirate-game-page");

  if (!page) return;

  const player = pirateGameState.players[pirateLocalPlayerId];

  if (!player) return;

  const remaining = Math.max(
    0,
    Math.ceil((pirateGameState.endsAt - Date.now()) / 1000),
  );

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  document.getElementById("pirate-time").textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  document.getElementById("pirate-power").textContent = player.power;

  document.getElementById("pirate-loot").textContent = player.loot;

  const currentIsland = pirateIslands.find(
    (island) => island.id === player.currentIsland,
  );

  document.getElementById("pirate-location").textContent = currentIsland
    ? currentIsland.name
    : "Ship";

  renderPirateQuestion(player);
  renderPirateIslands(player);
  renderPirateLeaderboard();

  if (pirateGameState.phase === "ended") {
    renderPirateResults();
  }
}

// ========================================
// RENDER QUESTION
// ========================================

function renderPirateQuestion(player) {
  const index = pirateGameState.questionIndex;

  const question = pirateQuestions[index];

  document.getElementById("pirate-question-number").textContent =
    `QUESTION ${index + 1}`;

  document.getElementById("pirate-question").textContent = question.question;

  const answerContainer = document.getElementById("pirate-answers");

  answerContainer.innerHTML = "";

  const alreadyAnswered = player.answeredQuestion === index;

  question.answers.forEach((answer, answerIndex) => {
    const button = document.createElement("button");

    button.textContent = answer;
    button.disabled = alreadyAnswered;

    button.addEventListener("click", () => {
      answerPirateQuestion(answerIndex);
    });

    answerContainer.appendChild(button);
  });

  document.getElementById("pirate-answer-message").textContent = alreadyAnswered
    ? "You have answered this question. Wait for the next one!"
    : "Choose your answer. Correct answers earn 10 power!";
}

// ========================================
// RENDER ISLANDS
// ========================================

function renderPirateIslands(player) {
  const container = document.getElementById("pirate-islands");

  container.innerHTML = "";

  pirateIslands.forEach((island) => {
    const islandState = pirateGameState.islands[island.id];

    const button = document.createElement("button");

    button.className = "pirate-island-button";

    const isHere = player.currentIsland === island.id;

    button.innerHTML = `
            <span class="pirate-island-emoji">${island.emoji}</span>
            <strong>${island.name}</strong>
            <span>⚡ ${island.cost} Power</span>
            <span>💰 ${islandState.remaining} chests left</span>
            ${isHere ? "<span>YOU ARE HERE</span>" : ""}
        `;

    button.disabled =
      pirateGameState.phase !== "playing" ||
      isHere ||
      player.power < island.cost ||
      islandState.remaining <= 0;

    button.addEventListener("click", () => {
      travelToPirateIsland(island.id);
    });

    container.appendChild(button);
  });

  const info = document.getElementById("pirate-island-info");

  const lootButton = document.getElementById("pirate-loot-button");

  if (player.currentIsland) {
    const island = pirateIslands.find(
      (item) => item.id === player.currentIsland,
    );

    const remaining = pirateGameState.islands[player.currentIsland].remaining;

    info.textContent = `${island.name}: ${remaining} treasure chests remain!`;

    lootButton.disabled = remaining <= 0 || pirateGameState.phase !== "playing";

    lootButton.textContent = remaining > 0 ? "💰 LOOT ISLAND" : "ISLAND EMPTY";
  } else {
    info.textContent = "You are aboard your ship. Choose an island!";

    lootButton.disabled = true;
    lootButton.textContent = "💰 LOOT ISLAND";
  }
}

// ========================================
// LEADERBOARD
// ========================================

function renderPirateLeaderboard() {
  const container = document.getElementById("pirate-leaderboard");

  const players = Object.values(pirateGameState.players).sort(
    (a, b) => b.loot - a.loot,
  );

  container.innerHTML = "";

  players.forEach((player, index) => {
    const row = document.createElement("div");

    row.className = "pirate-leaderboard-row";

    const name = document.createElement("strong");

    name.textContent = `${index + 1}. ${player.username}`;

    const score = document.createElement("span");

    score.textContent = `💰 ${player.loot}`;

    row.append(name, score);

    container.appendChild(row);
  });
}

// ========================================
// END GAME
// ========================================

function endPirateGame() {
  if (!pirateGameIsHost || !pirateGameState) return;

  if (pirateGameState.phase === "ended") return;

  clearInterval(pirateGameTimer);
  clearInterval(pirateQuestionTimer);

  const players = Object.values(pirateGameState.players);

  const highestLoot = Math.max(0, ...players.map((player) => player.loot));

  pirateGameState.winners =
    highestLoot > 0
      ? players
          .filter((player) => player.loot === highestLoot)
          .map((player) => player.id)
      : [];

  pirateGameState.phase = "ended";

  broadcastPirateState();

  renderPirateResults();
}

// ========================================
// AWARD WINNER
// ========================================

function renderPirateResults() {
  const message = document.getElementById("pirate-game-message");

  const player = pirateGameState.players[pirateLocalPlayerId];

  if (!player) return;

  const isWinner = pirateGameState.winners.includes(pirateLocalPlayerId);

  if (isWinner && !pirateRewardClaimed) {
    tokens += PIRATE_WIN_REWARD;

    saveTokens();
    updateTokenDisplay();

    pirateRewardClaimed = true;
  }

  message.innerHTML = "";

  const title = document.createElement("h2");

  title.textContent = isWinner
    ? "🏆 YOU WON! +500 TOKENS!"
    : "🏴‍☠️ THE VOYAGE IS OVER!";

  const description = document.createElement("p");

  description.textContent = isWinner
    ? "Congratulations! You collected the most treasure!"
    : "Better luck next voyage!";

  const button = document.createElement("button");

  button.textContent = "RETURN TO LOBBY";

  button.addEventListener("click", () => {
    clearInterval(pirateGameTimer);
    clearInterval(pirateQuestionTimer);

    if (pirateGameIsHost) {
      hostConnections.forEach((connection) => {
        if (connection.open) {
          connection.send({ type: "host-left" });
          connection.close();
        }
      });

      if (multiplayerPeer) {
        multiplayerPeer.destroy();
        multiplayerPeer = null;
      }

      hostConnections.clear();
      roomPlayers.clear();
    } else {
      myConnection?.close();
      multiplayerPeer?.destroy();

      myConnection = null;
      multiplayerPeer = null;
    }

    pirateGameState = null;
    currentRoomCode = null;
    isRoomHost = false;
    isConnecting = false;
    pirateGameIsHost = false;

    showPage("host");
  });

  message.append(title, description, button);
}

// ========================================
// CLEAN UP ON HOST LEFT
// ========================================

const originalPirateLeaveMessage = lobbyMessage.textContent;
