// ========================================
// BLOCKET - IMPOSTERS
// Complete game: map, movement, tasks, roles,
// multiplayer, imposter unlock, and win conditions
// ========================================

// ========================================
// SETTINGS
// ========================================

const MAP_TILE_SIZE = 32;
const MAP_WIDTH = 30;
const MAP_HEIGHT = 22;
const MAP_PIXEL_WIDTH = MAP_WIDTH * MAP_TILE_SIZE;
const MAP_PIXEL_HEIGHT = MAP_HEIGHT * MAP_TILE_SIZE;

const PLAYER_SPEED = 3.2;
const PLAYER_RADIUS = 12;
const IMPOSTER_TASK_DISTANCE = 55;
const IMPOSTER_KILL_DISTANCE = 48;
const IMPOSTER_UNLOCK_DISTANCE = 65;

const IMPOSTER_TASKS = [
  {
    id: "power",
    name: "Power Calibration",
    room: "ENGINE",
    x: 19 * MAP_TILE_SIZE + 16,
    y: 5 * MAP_TILE_SIZE + 16,
    question: "What is 12 × 8?",
    answers: ["86", "96", "108", "112"],
    correct: "96",
  },
  {
    id: "security",
    name: "Security Check",
    room: "SECURITY",
    x: 23 * MAP_TILE_SIZE + 16,
    y: 5 * MAP_TILE_SIZE + 16,
    question: "How many sides does a hexagon have?",
    answers: ["5", "6", "7", "8"],
    correct: "6",
  },
  {
    id: "storage",
    name: "Supply Inventory",
    room: "STORAGE",
    x: 5 * MAP_TILE_SIZE + 16,
    y: 15 * MAP_TILE_SIZE + 16,
    question: "What is the opposite of north?",
    answers: ["East", "West", "South", "Up"],
    correct: "South",
  },
  {
    id: "admin",
    name: "Data Upload",
    room: "ADMIN",
    x: 14 * MAP_TILE_SIZE + 16,
    y: 15 * MAP_TILE_SIZE + 16,
    question: "Which is a primary color of light?",
    answers: ["Green", "Orange", "Purple", "Brown"],
    correct: "Green",
  },
  {
    id: "reactor",
    name: "Reactor Check",
    room: "REACTOR",
    x: 24 * MAP_TILE_SIZE + 16,
    y: 15 * MAP_TILE_SIZE + 16,
    question: "What is the chemical symbol for water?",
    answers: ["CO2", "H2O", "O2", "NaCl"],
    correct: "H2O",
  },
  {
    id: "cafeteria",
    name: "Cafeteria Cleanup",
    room: "CAFETERIA",
    x: 6 * MAP_TILE_SIZE + 16,
    y: 5 * MAP_TILE_SIZE + 16,
    question: "How many minutes are in one hour?",
    answers: ["30", "45", "60", "90"],
    correct: "60",
  },
];

const IMPOSTER_UNLOCK_QUESTIONS = [
  {
    question: "What is 7 × 8?",
    answers: ["54", "56", "64", "48"],
    correct: "56",
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: "Mars",
  },
  {
    question: "How many sides does a triangle have?",
    answers: ["2", "3", "4", "5"],
    correct: "3",
  },
  {
    question: "What is 100 divided by 4?",
    answers: ["20", "25", "40", "50"],
    correct: "25",
  },
  {
    question: "Which gas do plants absorb?",
    answers: ["Oxygen", "Carbon dioxide", "Hydrogen", "Helium"],
    correct: "Carbon dioxide",
  },
];

// ========================================
// GAME STATE
// ========================================

let imposterGameState = null;
let imposterLocalRole = null;
let imposterLocalPlayerId = null;
let imposterGameIsHost = false;

let imposterLocalTasks = [];
let imposterPrivateTasks = {};
let imposterCurrentTask = null;

let imposterUnlocked = false;
let imposterQuestionsAnswered = 0;
let imposterCurrentUnlockQuestion = 0;

let imposterGameRunning = false;
let imposterKeys = {};
let imposterLastBroadcast = 0;
let imposterAnimationFrame = null;
let imposterGamePage = null;
let imposterCanvas = null;
let imposterContext = null;

let imposterTaskPanel = null;
let imposterUnlockPanel = null;
let imposterResultPanel = null;

let imposterNetworkReady = false;
let imposterHostNetworkWrapped = false;

// ========================================
// MAP WALLS
// ========================================

// Each wall is a rectangle.
// The middle horizontal corridor connects all rooms.

const IMPOSTER_WALLS = [
  // Outer walls
  { x: 0, y: 0, w: MAP_PIXEL_WIDTH, h: 16 },
  { x: 0, y: MAP_PIXEL_HEIGHT - 16, w: MAP_PIXEL_WIDTH, h: 16 },
  { x: 0, y: 0, w: 16, h: MAP_PIXEL_HEIGHT },
  { x: MAP_PIXEL_WIDTH - 16, y: 0, w: 16, h: MAP_PIXEL_HEIGHT },

  // Top room dividers
  { x: 320, y: 16, w: 12, h: 105 },
  { x: 320, y: 170, w: 12, h: 134 },

  { x: 640, y: 16, w: 12, h: 105 },
  { x: 640, y: 170, w: 12, h: 134 },

  // Bottom room dividers
  { x: 320, y: 400, w: 12, h: 115 },
  { x: 320, y: 565, w: 12, h: 123 },

  { x: 640, y: 400, w: 12, h: 115 },
  { x: 640, y: 565, w: 12, h: 123 },

  // Upper rooms / corridor boundary
  { x: 16, y: 304, w: 270, h: 12 },
  { x: 345, y: 304, w: 270, h: 12 },
  { x: 674, y: 304, w: 270, h: 12 },

  // Corridor / lower rooms boundary
  { x: 16, y: 388, w: 270, h: 12 },
  { x: 345, y: 388, w: 270, h: 12 },
  { x: 674, y: 388, w: 270, h: 12 },
];

const IMPOSTER_ROOMS = [
  { name: "CAFETERIA", x: 16, y: 16, w: 304, h: 288 },
  { name: "ENGINE", x: 332, y: 16, w: 308, h: 288 },
  { name: "SECURITY", x: 652, y: 16, w: 292, h: 288 },
  { name: "STORAGE", x: 16, y: 400, w: 304, h: 288 },
  { name: "ADMIN", x: 332, y: 400, w: 308, h: 288 },
  { name: "REACTOR", x: 652, y: 400, w: 292, h: 288 },
];

// ========================================
// HELPERS
// ========================================

function shuffleImposterArray(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function createRandomImposterTasks() {
  return shuffleImposterArray(IMPOSTER_TASKS)
    .slice(0, 3)
    .map((task) => ({
      id: task.id,
      completed: false,
    }));
}

function getImposterLocalPlayer() {
  if (!imposterGameState) return null;

  return (
    imposterGameState.players.find(
      (player) => player.id === imposterLocalPlayerId,
    ) || null
  );
}

function getImposterPlayerColor(index) {
  const colors = [
    "#ef4444",
    "#3b82f6",
    "#22c55e",
    "#eab308",
    "#a855f7",
    "#f97316",
    "#ec4899",
    "#06b6d4",
  ];

  return colors[index % colors.length];
}

function getImposterTotalTasks() {
  return Object.values(imposterPrivateTasks).reduce(
    (total, tasks) => total + tasks.length,
    0,
  );
}

function getImposterCompletedTasks() {
  return Object.values(imposterPrivateTasks).reduce(
    (total, tasks) => total + tasks.filter((task) => task.completed).length,
    0,
  );
}

// ========================================
// COLLISION
// ========================================

function imposterCircleHitsWall(x, y) {
  for (const wall of IMPOSTER_WALLS) {
    const closestX = Math.max(wall.x, Math.min(x, wall.x + wall.w));

    const closestY = Math.max(wall.y, Math.min(y, wall.y + wall.h));

    const dx = x - closestX;
    const dy = y - closestY;

    if (dx * dx + dy * dy < PLAYER_RADIUS * PLAYER_RADIUS) {
      return true;
    }
  }

  return false;
}

function moveImposterPlayer(player, dx, dy) {
  if (!player) return;

  const nextX = player.x + dx;
  const nextY = player.y + dy;

  // Check horizontal and vertical movement separately.
  if (!imposterCircleHitsWall(nextX, player.y)) {
    player.x = nextX;
  }

  if (!imposterCircleHitsWall(player.x, nextY)) {
    player.y = nextY;
  }

  player.x = Math.max(
    PLAYER_RADIUS + 16,
    Math.min(MAP_PIXEL_WIDTH - PLAYER_RADIUS - 16, player.x),
  );

  player.y = Math.max(
    PLAYER_RADIUS + 16,
    Math.min(MAP_PIXEL_HEIGHT - PLAYER_RADIUS - 16, player.y),
  );
}

// ========================================
// CREATE GAME PAGE
// ========================================

function createImposterGamePage() {
  if (document.getElementById("imposter-game-page")) {
    imposterGamePage = document.getElementById("imposter-game-page");
    imposterCanvas = document.getElementById("imposter-map");
    imposterContext = imposterCanvas.getContext("2d");
    return;
  }

  const page = document.createElement("div");

  page.id = "imposter-game-page";

  page.style.cssText = `
        position:fixed;
        inset:0;
        z-index:9000;
        background:#101827;
        color:white;
        display:none;
        flex-direction:column;
        align-items:center;
        overflow:auto;
        padding:14px;
        box-sizing:border-box;
        font-family:Arial,sans-serif;
    `;

  page.innerHTML = `
        <div style="
            width:100%;
            max-width:960px;
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:12px;
            flex-wrap:wrap;
            margin-bottom:12px;
        ">
            <div>
                <h1 style="margin:0;color:#f8fafc;">IMPOSTERS</h1>
                <p id="imposter-role-label" style="margin:5px 0;color:#cbd5e1;">
                    Loading role...
                </p>
            </div>

            <div style="text-align:right;">
                <strong id="imposter-player-count">Players: 0</strong>
                <p id="imposter-objective" style="margin:5px 0;color:#cbd5e1;">
                    Complete your objectives!
                </p>
            </div>
        </div>

        <div style="
            width:100%;
            max-width:960px;
            background:#1e293b;
            border-radius:12px;
            padding:8px;
            box-sizing:border-box;
            overflow:hidden;
        ">
            <canvas
                id="imposter-map"
                width="${MAP_PIXEL_WIDTH}"
                height="${MAP_PIXEL_HEIGHT}"
                style="
                    width:100%;
                    height:auto;
                    display:block;
                    border-radius:8px;
                    background:#26364b;
                "
            ></canvas>
        </div>

        <div style="
            width:100%;
            max-width:960px;
            display:flex;
            justify-content:space-between;
            gap:12px;
            flex-wrap:wrap;
            margin-top:12px;
            color:#cbd5e1;
            font-size:13px;
        ">
            <span>WASD / Arrow Keys: Move</span>
            <span>E: Interact</span>
            <span>Q: Imposter action</span>
        </div>

        <div id="imposter-player-list" style="
            width:100%;
            max-width:960px;
            margin-top:12px;
            background:#1e293b;
            border-radius:12px;
            padding:12px;
            box-sizing:border-box;
        "></div>
    `;

  document.body.appendChild(page);

  imposterGamePage = page;
  imposterCanvas = document.getElementById("imposter-map");
  imposterContext = imposterCanvas.getContext("2d");

  createImposterTaskInterface();
  createImposterUnlockInterface();
  createImposterResultInterface();
}

function showImposterGamePage() {
  createImposterGamePage();

  imposterGamePage.style.display = "flex";

  const pages = [
    "packs-page",
    "collection-page",
    "play-page",
    "host-page",
    "lobby-page",
  ];

  pages.forEach((id) => {
    const element = document.getElementById(id);

    if (element) {
      element.style.display = "none";
    }
  });
}

// ========================================
// TASK INTERFACE
// ========================================

function createImposterTaskInterface() {
  if (document.getElementById("imposter-task-panel")) return;

  const panel = document.createElement("div");

  panel.id = "imposter-task-panel";

  panel.style.cssText = `
        display:none;
        position:fixed;
        inset:0;
        z-index:10001;
        background:rgba(0,0,0,0.8);
        align-items:center;
        justify-content:center;
        padding:20px;
    `;

  panel.innerHTML = `
        <div style="
            background:white;
            color:#111827;
            width:100%;
            max-width:430px;
            padding:25px;
            border-radius:18px;
            text-align:center;
            box-sizing:border-box;
        ">
            <h2 id="imposter-task-title">Task</h2>
            <p id="imposter-task-question"></p>

            <div id="imposter-task-answers" style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:10px;
                margin-top:20px;
            "></div>

            <p id="imposter-task-feedback"></p>

            <button id="imposter-task-close" style="
                padding:10px 20px;
                border:0;
                border-radius:9px;
                background:#64748b;
                color:white;
                cursor:pointer;
            ">Close</button>
        </div>
    `;

  document.body.appendChild(panel);

  document
    .getElementById("imposter-task-close")
    .addEventListener("click", closeImposterTask);

  imposterTaskPanel = panel;
}

function openImposterTask(task) {
  if (imposterLocalRole !== "crewmate") return;
  if (!task || task.completed) return;

  const definition = IMPOSTER_TASKS.find((item) => item.id === task.id);

  if (!definition) return;

  imposterCurrentTask = definition;

  createImposterTaskInterface();

  document.getElementById("imposter-task-title").textContent = definition.name;

  document.getElementById("imposter-task-question").textContent =
    definition.question;

  document.getElementById("imposter-task-feedback").textContent = "";

  const answers = document.getElementById("imposter-task-answers");
  answers.innerHTML = "";

  definition.answers.forEach((answer) => {
    const button = document.createElement("button");

    button.textContent = answer;

    button.style.cssText = `
            padding:13px;
            border:0;
            border-radius:10px;
            background:#e2e8f0;
            cursor:pointer;
            font-weight:bold;
        `;

    button.addEventListener("click", () => {
      submitImposterTaskAnswer(definition.id, answer);
    });

    answers.appendChild(button);
  });

  imposterTaskPanel.style.display = "flex";
}

function closeImposterTask() {
  if (imposterTaskPanel) {
    imposterTaskPanel.style.display = "none";
  }

  imposterCurrentTask = null;
}

function submitImposterTaskAnswer(taskId, answer) {
  if (!imposterCurrentTask || !imposterGameState) return;

  const feedback = document.getElementById("imposter-task-feedback");

  if (imposterGameIsHost) {
    const result = completeImposterTask(imposterLocalPlayerId, taskId, answer);

    if (result.success) {
      feedback.textContent = "Correct! Task completed!";
      feedback.style.color = "#16a34a";
      setTimeout(closeImposterTask, 700);
    } else {
      feedback.textContent = result.message;
      feedback.style.color = "#dc2626";
    }

    return;
  }

  if (!myConnection || !myConnection.open) {
    feedback.textContent = "Connection lost. Try again.";
    return;
  }

  myConnection.send({
    type: "imposter-task-answer",
    taskId,
    answer,
  });

  feedback.textContent = "Checking answer...";

  document
    .querySelectorAll("#imposter-task-answers button")
    .forEach((button) => (button.disabled = true));
}

// ========================================
// TASK VALIDATION
// ========================================

function completeImposterTask(playerId, taskId, answer) {
  if (!imposterGameIsHost || !imposterGameState) {
    return { success: false, message: "Game unavailable." };
  }

  const player = imposterGameState.players.find((item) => item.id === playerId);

  if (!player || player.eliminated) {
    return { success: false, message: "Player unavailable." };
  }

  if (player.role === "imposter") {
    return { success: false, message: "Imposters cannot complete crew tasks." };
  }

  const definition = IMPOSTER_TASKS.find((task) => task.id === taskId);

  if (!definition) {
    return { success: false, message: "Task not found." };
  }

  const assignedTasks = imposterPrivateTasks[playerId];

  if (!assignedTasks) {
    return { success: false, message: "No tasks assigned." };
  }

  const assignedTask = assignedTasks.find((task) => task.id === taskId);

  if (!assignedTask || assignedTask.completed) {
    return { success: false, message: "Task already completed." };
  }

  if (answer !== definition.correct) {
    sendImposterTaskResult(playerId, {
      success: false,
      taskId,
      message: "Incorrect answer. Try again!",
    });

    return { success: false, message: "Incorrect answer. Try again!" };
  }

  assignedTask.completed = true;

  player.tasksCompleted = assignedTasks.filter((task) => task.completed).length;

  broadcastImposterState();

  sendImposterTaskResult(playerId, {
    success: true,
    taskId,
  });

  checkImposterWinConditions();

  return { success: true };
}

function sendImposterTaskResult(playerId, result) {
  if (playerId === "host") {
    receiveImposterTaskResult(result);
    return;
  }

  const connection = hostConnections.get(playerId);

  if (connection && connection.open) {
    connection.send({
      type: "imposter-task-result",
      ...result,
    });
  }
}

function receiveImposterTaskResult(data) {
  if (!data) return;

  const feedback = document.getElementById("imposter-task-feedback");

  if (!data.success) {
    if (feedback) {
      feedback.textContent = data.message || "Incorrect answer!";
      feedback.style.color = "#dc2626";
    }

    document
      .querySelectorAll("#imposter-task-answers button")
      .forEach((button) => (button.disabled = false));

    return;
  }

  const task = imposterLocalTasks.find((item) => item.id === data.taskId);

  if (task) {
    task.completed = true;
  }

  if (feedback) {
    feedback.textContent = "Correct! Task completed!";
    feedback.style.color = "#16a34a";
  }

  renderImposterTaskProgress();

  setTimeout(closeImposterTask, 700);
}

// ========================================
// NEARBY TASKS
// ========================================

function findNearbyImposterTask() {
  const player = getImposterLocalPlayer();

  if (!player || imposterLocalRole !== "crewmate") return null;

  let nearest = null;
  let nearestDistance = IMPOSTER_TASK_DISTANCE;

  imposterLocalTasks.forEach((task) => {
    if (task.completed) return;

    const definition = IMPOSTER_TASKS.find((item) => item.id === task.id);

    if (!definition) return;

    const distance = Math.hypot(
      player.x - definition.x,
      player.y - definition.y,
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = task;
    }
  });

  return nearest;
}

// ========================================
// IMPOSTER UNLOCK INTERFACE
// ========================================

function createImposterUnlockInterface() {
  if (document.getElementById("imposter-unlock-panel")) return;

  const panel = document.createElement("div");

  panel.id = "imposter-unlock-panel";

  panel.style.cssText = `
        display:none;
        position:fixed;
        inset:0;
        z-index:10002;
        background:rgba(0,0,0,0.85);
        align-items:center;
        justify-content:center;
        padding:20px;
    `;

  panel.innerHTML = `
        <div style="
            background:#1e293b;
            color:white;
            width:100%;
            max-width:430px;
            padding:25px;
            border-radius:18px;
            text-align:center;
            box-sizing:border-box;
        ">
            <h2>Imposter Terminal</h2>
            <p id="imposter-unlock-progress">Answer 5 questions to unlock your action.</p>
            <p id="imposter-unlock-question"></p>

            <div id="imposter-unlock-answers" style="
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:10px;
            "></div>

            <p id="imposter-unlock-feedback"></p>

            <button id="imposter-unlock-close" style="
                padding:10px 20px;
                border:0;
                border-radius:9px;
                background:#64748b;
                color:white;
                cursor:pointer;
            ">Close</button>
        </div>
    `;

  document.body.appendChild(panel);

  document
    .getElementById("imposter-unlock-close")
    .addEventListener("click", () => {
      panel.style.display = "none";
    });

  imposterUnlockPanel = panel;
}

function openImposterUnlock() {
  if (imposterLocalRole !== "imposter") return;
  if (imposterUnlocked) return;

  createImposterUnlockInterface();

  imposterCurrentUnlockQuestion = 0;

  showImposterUnlockQuestion();

  imposterUnlockPanel.style.display = "flex";
}

function showImposterUnlockQuestion() {
  const question = IMPOSTER_UNLOCK_QUESTIONS[imposterCurrentUnlockQuestion];

  if (!question) return;

  document.getElementById("imposter-unlock-progress").textContent =
    `Question ${imposterCurrentUnlockQuestion + 1} of 5`;

  document.getElementById("imposter-unlock-question").textContent =
    question.question;

  document.getElementById("imposter-unlock-feedback").textContent = "";

  const answers = document.getElementById("imposter-unlock-answers");
  answers.innerHTML = "";

  question.answers.forEach((answer) => {
    const button = document.createElement("button");

    button.textContent = answer;

    button.style.cssText = `
            padding:13px;
            border:0;
            border-radius:10px;
            background:#334155;
            color:white;
            cursor:pointer;
            font-weight:bold;
        `;

    button.addEventListener("click", () => {
      answerImposterUnlockQuestion(answer);
    });

    answers.appendChild(button);
  });
}

function answerImposterUnlockQuestion(answer) {
  const question = IMPOSTER_UNLOCK_QUESTIONS[imposterCurrentUnlockQuestion];

  const feedback = document.getElementById("imposter-unlock-feedback");

  if (answer !== question.correct) {
    feedback.textContent = "Incorrect! Try that question again.";
    feedback.style.color = "#f87171";
    return;
  }

  imposterCurrentUnlockQuestion++;
  imposterQuestionsAnswered = imposterCurrentUnlockQuestion;

  if (imposterCurrentUnlockQuestion >= 5) {
    imposterUnlocked = true;

    feedback.textContent = "Unlocked! You can now use Q near a crewmate.";
    feedback.style.color = "#4ade80";

    setTimeout(() => {
      imposterUnlockPanel.style.display = "none";
      renderImposterTaskProgress();
    }, 1200);

    return;
  }

  showImposterUnlockQuestion();
}

// ========================================
// IMPOSTER ACTION
// ========================================

function tryImposterAction() {
  if (imposterLocalRole !== "imposter") return;
  if (!imposterUnlocked) return;

  const player = getImposterLocalPlayer();

  if (!player) return;

  const nearby = imposterGameState.players.find((target) => {
    if (target.id === player.id || target.eliminated) return false;
    if (target.role === "imposter") return false;

    return (
      Math.hypot(player.x - target.x, player.y - target.y) <
      IMPOSTER_KILL_DISTANCE
    );
  });

  if (!nearby) {
    showImposterMessage("No crewmates nearby.");
    return;
  }

  if (imposterGameIsHost) {
    eliminateImposterPlayer(nearby.id);
  } else if (myConnection && myConnection.open) {
    myConnection.send({
      type: "imposter-eliminate",
      targetId: nearby.id,
    });
  }
}

function eliminateImposterPlayer(targetId) {
  if (!imposterGameIsHost || !imposterGameState) return;

  const imposter = getImposterLocalPlayer();

  const target = imposterGameState.players.find(
    (player) => player.id === targetId,
  );

  if (!imposter || !target || target.eliminated) return;
  if (imposter.role !== "imposter" || !imposter.unlocked) return;

  const distance = Math.hypot(imposter.x - target.x, imposter.y - target.y);

  if (distance > IMPOSTER_KILL_DISTANCE) return;

  target.eliminated = true;

  broadcastImposterState();

  checkImposterWinConditions();
}

function showImposterMessage(message) {
  let element = document.getElementById("imposter-message");

  if (!element) {
    element = document.createElement("div");
    element.id = "imposter-message";

    element.style.cssText = `
            position:fixed;
            bottom:55px;
            left:50%;
            transform:translateX(-50%);
            z-index:10010;
            background:#0f172a;
            color:white;
            padding:12px 20px;
            border-radius:10px;
            pointer-events:none;
        `;

    document.body.appendChild(element);
  }

  element.textContent = message;
  element.style.display = "block";

  clearTimeout(element.hideTimer);

  element.hideTimer = setTimeout(() => {
    element.style.display = "none";
  }, 1800);
}

// ========================================
// TASK STATIONS
// ========================================

function drawImposterTaskStations(ctx) {
  if (imposterLocalRole !== "crewmate") return;

  IMPOSTER_TASKS.forEach((definition) => {
    const assigned = imposterLocalTasks.find(
      (task) => task.id === definition.id,
    );

    if (!assigned || assigned.completed) return;

    ctx.beginPath();
    ctx.arc(definition.x, definition.y, 11, 0, Math.PI * 2);

    ctx.fillStyle = "#facc15";
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#111827";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("E", definition.x, definition.y + 4);
  });
}

// ========================================
// DRAW MAP
// ========================================

function drawImposterMap(ctx) {
  ctx.clearRect(0, 0, MAP_PIXEL_WIDTH, MAP_PIXEL_HEIGHT);

  ctx.fillStyle = "#26364b";
  ctx.fillRect(0, 0, MAP_PIXEL_WIDTH, MAP_PIXEL_HEIGHT);

  // Room floors
  IMPOSTER_ROOMS.forEach((room) => {
    ctx.fillStyle = "#34475e";
    ctx.fillRect(room.x, room.y, room.w, room.h);

    ctx.strokeStyle = "#52677e";
    ctx.lineWidth = 3;
    ctx.strokeRect(room.x, room.y, room.w, room.h);

    ctx.fillStyle = "#9fb2c8";
    ctx.font = "bold 15px Arial";
    ctx.textAlign = "center";
    ctx.fillText(room.name, room.x + room.w / 2, room.y + 30);
  });

  // Central corridor
  ctx.fillStyle = "#40546b";
  ctx.fillRect(16, 316, MAP_PIXEL_WIDTH - 32, 72);

  ctx.fillStyle = "#dbeafe";
  ctx.font = "bold 14px Arial";
  ctx.textAlign = "center";
  ctx.fillText("MAIN CORRIDOR", MAP_PIXEL_WIDTH / 2, 358);

  // Walls
  IMPOSTER_WALLS.forEach((wall) => {
    ctx.fillStyle = "#718096";
    ctx.fillRect(wall.x, wall.y, wall.w, wall.h);

    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;
    ctx.strokeRect(wall.x, wall.y, wall.w, wall.h);
  });

  // Task stations
  drawImposterTaskStations(ctx);

  // Imposter terminal
  if (imposterLocalRole === "imposter" && !imposterUnlocked) {
    const terminalX = 480;
    const terminalY = 352;

    ctx.fillStyle = "#a855f7";
    ctx.fillRect(terminalX - 15, terminalY - 15, 30, 30);

    ctx.fillStyle = "white";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("E", terminalX, terminalY + 4);
  }

  // Players
  if (!imposterGameState) return;

  imposterGameState.players.forEach((player) => {
    if (player.eliminated) return;

    // Only reveal the imposter to themselves.
    const isLocalImposter =
      player.id === imposterLocalPlayerId && imposterLocalRole === "imposter";

    ctx.beginPath();
    ctx.arc(player.x, player.y, PLAYER_RADIUS, 0, Math.PI * 2);

    ctx.fillStyle = player.color || "#3b82f6";
    ctx.fill();

    ctx.strokeStyle = isLocalImposter ? "#f87171" : "white";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Small visor
    ctx.fillStyle = "#bae6fd";
    ctx.fillRect(player.x - 7, player.y - 5, 14, 7);

    ctx.fillStyle = "white";
    ctx.font = "11px Arial";
    ctx.textAlign = "center";
    ctx.fillText(player.name || "Player", player.x, player.y - 20);
  });
}

// ========================================
// TASK PROGRESS
// ========================================

function renderImposterTaskProgress() {
  const objective = document.getElementById("imposter-objective");

  if (!objective) return;

  if (imposterLocalRole === "crewmate") {
    const completed = imposterLocalTasks.filter(
      (task) => task.completed,
    ).length;

    objective.innerHTML = `
            <strong>Crewmate Tasks</strong><br>
            ${completed} / ${imposterLocalTasks.length} completed
        `;
  } else if (imposterLocalRole === "imposter") {
    objective.innerHTML = imposterUnlocked
      ? "<strong>Imposter action unlocked!</strong><br>Press Q near a crewmate."
      : `<strong>Unlock your action</strong><br>${imposterQuestionsAnswered} / 5 questions`;
  }
}

// ========================================
// PLAYER LIST
// ========================================

function renderImposterPlayerList() {
  const list = document.getElementById("imposter-player-list");

  if (!list || !imposterGameState) return;

  const players = imposterGameState.players;

  list.innerHTML = `
        <strong>Players</strong>
        <div style="
            display:flex;
            flex-wrap:wrap;
            gap:12px;
            margin-top:10px;
        ">
            ${players
              .map(
                (player) => `
                <div style="
                    background:#334155;
                    padding:8px 12px;
                    border-radius:8px;
                    opacity:${player.eliminated ? "0.45" : "1"};
                ">
                    <span style="
                        display:inline-block;
                        width:10px;
                        height:10px;
                        border-radius:50%;
                        background:${player.color};
                        margin-right:6px;
                    "></span>
                    ${escapeImposterText(player.name)}
                    ${player.eliminated ? "(Out)" : ""}
                </div>
            `,
              )
              .join("")}
        </div>
    `;

  const count = document.getElementById("imposter-player-count");

  if (count) {
    count.textContent = `Players: ${players.filter((p) => !p.eliminated).length}`;
  }
}

function escapeImposterText(value) {
  return String(value || "Player").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character],
  );
}

// ========================================
// RENDER GAME
// ========================================

function renderImposterGame() {
  if (!imposterGameState || !imposterGamePage) return;

  drawImposterMap(imposterContext);
  renderImposterPlayerList();
  renderImposterTaskProgress();
}

// ========================================
// BROADCAST GAME STATE
// ========================================

function broadcastImposterState() {
  if (!imposterGameIsHost || !imposterGameState) return;

  const publicState = {
    players: imposterGameState.players.map((player) => ({
      id: player.id,
      name: player.name,
      x: player.x,
      y: player.y,
      color: player.color,
      eliminated: player.eliminated,
      tasksCompleted: player.tasksCompleted || 0,
    })),
    completedTasks: getImposterCompletedTasks(),
    totalTasks: getImposterTotalTasks(),
    running: imposterGameState.running,
  };

  hostConnections.forEach((connection) => {
    if (connection && connection.open) {
      connection.send({
        type: "imposter-state",
        state: publicState,
      });
    }
  });

  renderImposterGame();
}

// ========================================
// HOST NETWORK MESSAGE HANDLING
// ========================================

function setupImposterHostNetworking() {
  if (imposterHostNetworkWrapped) return;
  if (typeof setupHostConnection !== "function") return;

  imposterHostNetworkWrapped = true;

  const previousSetupHostConnection = setupHostConnection;

  setupHostConnection = function (connection) {
    previousSetupHostConnection(connection);

    connection.on("data", (data) => {
      if (!data || typeof data !== "object") return;
      if (!imposterGameIsHost || !imposterGameState) return;

      const player = imposterGameState.players.find(
        (item) => item.id === connection.peer,
      );

      if (!player) return;

      if (data.type === "imposter-task-answer") {
        completeImposterTask(connection.peer, data.taskId, data.answer);
      }

      if (data.type === "imposter-move") {
        if (player.eliminated) return;

        const x = Number(data.x);
        const y = Number(data.y);

        if (!Number.isFinite(x) || !Number.isFinite(y)) return;

        const dx = x - player.x;
        const dy = y - player.y;

        // Prevent impossible movement jumps.
        if (Math.hypot(dx, dy) > 65) return;

        if (!imposterCircleHitsWall(x, player.y)) {
          player.x = x;
        }

        if (!imposterCircleHitsWall(player.x, y)) {
          player.y = y;
        }

        broadcastImposterState();
      }

      if (data.type === "imposter-eliminate") {
        const imposter = imposterGameState.players.find(
          (item) => item.id === connection.peer,
        );

        if (!imposter || imposter.role !== "imposter") return;
        if (!imposter.unlocked) return;

        eliminateImposterPlayer(data.targetId);
      }
    });
  };
}

// ========================================
// CLIENT NETWORK LISTENER
// ========================================

function setupImposterClientNetworking() {
  if (imposterNetworkReady) return;
  if (!myConnection) return;

  imposterNetworkReady = true;

  myConnection.on("data", (data) => {
    if (!data || typeof data !== "object") return;

    if (data.type === "imposter-task-result") {
      receiveImposterTaskResult(data);
    }

    if (data.type === "imposter-state") {
      imposterGameState = data.state;
      renderImposterGame();
    }

    if (data.type === "imposter-ended") {
      showImposterResult(data.winner, data.message);
    }
  });
}

// ========================================
// WIN CONDITIONS
// ========================================

function checkImposterWinConditions() {
  if (!imposterGameIsHost || !imposterGameState) return;

  const players = imposterGameState.players;

  const imposter = players.find((player) => player.role === "imposter");

  if (!imposter || imposter.eliminated) {
    endImposterGame(
      "crewmates",
      "The Imposter has been caught! Crewmates win!",
    );

    return;
  }

  const livingCrew = players.filter(
    (player) => player.role === "crewmate" && !player.eliminated,
  );

  if (livingCrew.length <= 1) {
    endImposterGame(
      "imposter",
      "The Imposter has taken control! Imposter wins!",
    );

    return;
  }

  const total = getImposterTotalTasks();
  const completed = getImposterCompletedTasks();

  if (total > 0 && completed >= total) {
    endImposterGame("crewmates", "All tasks completed! Crewmates win!");
  }
}

function endImposterGame(winner, message) {
  if (!imposterGameIsHost || !imposterGameState) return;

  imposterGameState.running = false;

  hostConnections.forEach((connection) => {
    if (connection && connection.open) {
      connection.send({
        type: "imposter-ended",
        winner,
        message,
      });
    }
  });

  showImposterResult(winner, message);
}

function createImposterResultInterface() {
  if (document.getElementById("imposter-result-panel")) return;

  const panel = document.createElement("div");

  panel.id = "imposter-result-panel";

  panel.style.cssText = `
        display:none;
        position:fixed;
        inset:0;
        z-index:10020;
        background:rgba(0,0,0,0.9);
        align-items:center;
        justify-content:center;
        padding:20px;
    `;

  panel.innerHTML = `
        <div style="
            background:#1e293b;
            color:white;
            width:100%;
            max-width:420px;
            padding:30px;
            border-radius:18px;
            text-align:center;
        ">
            <h1 id="imposter-result-title">Game Over</h1>
            <p id="imposter-result-message"></p>
        </div>
    `;

  document.body.appendChild(panel);

  imposterResultPanel = panel;
}

function showImposterResult(winner, message) {
  createImposterResultInterface();

  document.getElementById("imposter-result-title").textContent =
    winner === "crewmates" ? "CREWMATES WIN!" : "IMPOSTER WINS!";

  document.getElementById("imposter-result-message").textContent =
    message || "Game over.";

  imposterResultPanel.style.display = "flex";

  imposterGameRunning = false;

  if (imposterAnimationFrame) {
    cancelAnimationFrame(imposterAnimationFrame);
    imposterAnimationFrame = null;
  }
}

// ========================================
// INPUT CONTROLS
// ========================================

function setupImposterControls() {
  if (window.imposterControlsReady) return;

  window.imposterControlsReady = true;

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();

    if (
      ["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)
    ) {
      event.preventDefault();
    }

    imposterKeys[key] = true;

    if (!imposterGameRunning) return;

    if (
      key === "e" &&
      !document
        .getElementById("imposter-task-panel")
        ?.style.display.includes("flex") &&
      !document
        .getElementById("imposter-unlock-panel")
        ?.style.display.includes("flex")
    ) {
      if (imposterLocalRole === "crewmate") {
        const task = findNearbyImposterTask();

        if (task) {
          openImposterTask(task);
          return;
        }
      }

      if (imposterLocalRole === "imposter" && !imposterUnlocked) {
        const player = getImposterLocalPlayer();

        if (
          player &&
          Math.hypot(player.x - 480, player.y - 352) < IMPOSTER_UNLOCK_DISTANCE
        ) {
          openImposterUnlock();
        }
      }
    }

    if (key === "q" && imposterLocalRole === "imposter") {
      tryImposterAction();
    }
  });

  document.addEventListener("keyup", (event) => {
    imposterKeys[event.key.toLowerCase()] = false;
  });

  window.addEventListener("blur", () => {
    imposterKeys = {};
  });
}

// ========================================
// GAME LOOP
// ========================================

function updateImposterMovement() {
  if (!imposterGameRunning || !imposterGameState) return;

  if (
    document.getElementById("imposter-task-panel")?.style.display === "flex" ||
    document.getElementById("imposter-unlock-panel")?.style.display === "flex"
  ) {
    return;
  }

  const player = getImposterLocalPlayer();

  if (!player || player.eliminated) return;

  let dx = 0;
  let dy = 0;

  if (imposterKeys["w"] || imposterKeys["arrowup"]) dy -= 1;
  if (imposterKeys["s"] || imposterKeys["arrowdown"]) dy += 1;
  if (imposterKeys["a"] || imposterKeys["arrowleft"]) dx -= 1;
  if (imposterKeys["d"] || imposterKeys["arrowright"]) dx += 1;

  if (dx !== 0 || dy !== 0) {
    const length = Math.hypot(dx, dy);

    dx = (dx / length) * PLAYER_SPEED;
    dy = (dy / length) * PLAYER_SPEED;

    const oldX = player.x;
    const oldY = player.y;

    moveImposterPlayer(player, dx, dy);

    if (imposterGameIsHost) {
      const now = Date.now();

      if (now - imposterLastBroadcast > 70) {
        imposterLastBroadcast = now;
        broadcastImposterState();
      }
    } else if (
      myConnection &&
      myConnection.open &&
      (oldX !== player.x || oldY !== player.y)
    ) {
      myConnection.send({
        type: "imposter-move",
        x: player.x,
        y: player.y,
      });
    }
  }
}

function imposterGameLoop() {
  if (!imposterGameRunning) return;

  updateImposterMovement();
  renderImposterGame();

  imposterAnimationFrame = requestAnimationFrame(imposterGameLoop);
}

// ========================================
// START GAME - HOST
// ========================================

function startImposterGame() {
  if (!isRoomHost) {
    showImposterMessage("Only the host can start the game.");
    return;
  }

  if (roomPlayers.size < 3) {
    showImposterMessage("You need at least 3 players to start.");
    return;
  }

  const roomMembers = Array.from(roomPlayers.values());

  if (roomMembers.length > 8) {
    showImposterMessage("This game supports up to 8 players.");
    return;
  }

  setupImposterHostNetworking();

  const imposterIndex = Math.floor(Math.random() * roomMembers.length);

  imposterPrivateTasks = {};

  const players = roomMembers.map((member, index) => {
    const role = index === imposterIndex ? "imposter" : "crewmate";

    if (role === "crewmate") {
      imposterPrivateTasks[member.id] = createRandomImposterTasks();
    } else {
      imposterPrivateTasks[member.id] = [];
    }

    return {
      id: member.id,
      name: member.username || member.name || "Player",
      x: 480 + (index % 3) * 35,
      y: 352 + Math.floor(index / 3) * 35,
      color: getImposterPlayerColor(index),
      eliminated: false,
      tasksCompleted: 0,
      role,
      unlocked: false,
    };
  });

  imposterGameState = {
    players,
    running: true,
  };

  const hostPlayer = players.find((player) => player.id === "host");

  if (!hostPlayer) {
    showImposterMessage("Host player was not found.");
    return;
  }

  imposterGameIsHost = true;
  imposterLocalPlayerId = "host";
  imposterLocalRole = hostPlayer.role;

  imposterUnlocked = false;
  imposterQuestionsAnswered = 0;

  imposterLocalTasks = (imposterPrivateTasks.host || []).map((task) => ({
    ...task,
  }));

  showImposterGamePage();

  const roleData = {
    role: imposterLocalRole,
    tasks: imposterLocalTasks,
  };

  // Send each client their own private role and tasks.
  hostConnections.forEach((connection, playerId) => {
    if (!connection || !connection.open) return;

    const player = players.find((item) => item.id === playerId);

    if (!player) return;

    connection.send({
      type: "imposter-start",
      state: getPublicImposterState(),
      role: {
        role: player.role,
        tasks: imposterPrivateTasks[playerId] || [],
      },
    });
  });

  createImposterGamePage();

  document.getElementById("imposter-role-label").textContent =
    `You are the ${imposterLocalRole.toUpperCase()}!`;

  setupImposterControls();

  imposterGameRunning = true;

  broadcastImposterState();

  if (imposterAnimationFrame) {
    cancelAnimationFrame(imposterAnimationFrame);
  }

  imposterGameLoop();
}

// ========================================
// PUBLIC STATE
// ========================================

function getPublicImposterState() {
  return {
    players: imposterGameState.players.map((player) => ({
      id: player.id,
      name: player.name,
      x: player.x,
      y: player.y,
      color: player.color,
      eliminated: player.eliminated,
      tasksCompleted: player.tasksCompleted || 0,
    })),
    completedTasks: getImposterCompletedTasks(),
    totalTasks: getImposterTotalTasks(),
    running: true,
  };
}

// ========================================
// START GAME - CLIENT
// ========================================

function startImposterGameClient(state, roleData) {
  if (!state) return;

  imposterGameIsHost = false;
  imposterLocalPlayerId = myConnection ? myConnection.peer : null;

  // The host sends the private role and tasks in roleData.
  if (typeof roleData === "string") {
    imposterLocalRole = roleData;
    imposterLocalTasks = [];
  } else {
    imposterLocalRole = roleData?.role || "crewmate";
    imposterLocalTasks = (roleData?.tasks || []).map((task) => ({ ...task }));
  }

  imposterUnlocked = false;
  imposterQuestionsAnswered = 0;

  imposterGameState = state;

  showImposterGamePage();

  document.getElementById("imposter-role-label").textContent =
    `You are the ${imposterLocalRole.toUpperCase()}!`;

  setupImposterControls();
  setupImposterClientNetworking();

  imposterGameRunning = true;

  renderImposterGame();

  if (imposterAnimationFrame) {
    cancelAnimationFrame(imposterAnimationFrame);
  }

  imposterGameLoop();
}

// ========================================
// INITIALIZATION
// ========================================

createImposterGamePage();
createImposterTaskInterface();
createImposterUnlockInterface();
createImposterResultInterface();

setupImposterControls();
setupImposterHostNetworking();

console.log("Imposters game loaded successfully!");
