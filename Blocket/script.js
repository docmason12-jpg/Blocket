/* =====================================================
   BLOCKET
   SUPABASE + GAME SYSTEM
===================================================== */

/* =========================
   SUPABASE
========================= */

const SUPABASE_URL = "https://whakyhbtqwfvicicnttu.supabase.co";
const SUPABASE_KEY = "sb_publishable_gKxzj3EC0h2FeLLST2JflA_QGBdSRbD";

const supabaseClient =
    window.supabase?.createClient
        ? window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        )
        : {
            auth: {
                signUp: async () => ({
                    data: null,
                    error: {
                        message: "Account service is unavailable."
                    }
                }),
                signInWithPassword: async () => ({
                    data: null,
                    error: {
                        message: "Account service is unavailable."
                    }
                }),
                getUser: async () => ({
                    data: { user: null },
                    error: null
                }),
                signOut: async () => ({ error: null }),
                onAuthStateChange: () => ({
                    data: {
                        subscription: {
                            unsubscribe: () => {}
                        }
                    }
                })
            }
        };
let coins =
    Number(localStorage.getItem("blocketCoins")) || 1000;

let collection =
    JSON.parse(
        localStorage.getItem("blocketCollection")
    ) || {};

const hiddenBlocks = [
    {
        name: "Time Watch",
        rarity: "Hidden",
        packName: "SECRET DISCOVERY",
        searchable: true
    },
    {
        name: "Eternal",
        rarity: "Hidden",
        packName: "ORE BOX",
        searchable: false
    }
];

let backgroundCollection =
    JSON.parse(
        localStorage.getItem("blocketBackgroundCollection")
    ) || {};

let titleCollection =
    JSON.parse(
        localStorage.getItem("blocketTitleCollection")
    ) || {};

let boxesOpened =
    Number(
        localStorage.getItem("blocketBoxesOpened")
    ) ||
    Number(
        localStorage.getItem("blocketPacksOpened")
    ) ||
    0;

let packStats =
    JSON.parse(
        localStorage.getItem("blocketPackStats")
    ) || {};

let lastDailySpin =
    localStorage.getItem("blocketDailySpin") || "";

let equippedBlock =
    localStorage.getItem("blocketEquippedBlock") || "Block";

let equippedBackground =
    localStorage.getItem("blocketEquippedBackground") || "Default";

let equippedTitle =
    localStorage.getItem("blocketEquippedTitle") || "";

let isDarkMode =
    localStorage.getItem("blocketTheme") === "dark";

let currentRolling = null;
let rollingInterval = null;
let currentBoxType = null;


/* =========================
   BOXES
========================= */

const boxes = {

    color: {

        name: "COLOR BOX",

        price: 20,

        blocks: [

            { name: "Red Block", rarity: "Common" },
            { name: "Yellow Block", rarity: "Common" },
            { name: "Blue Block", rarity: "Common" },

            { name: "Purple Block", rarity: "Uncommon" },
            { name: "Green Block", rarity: "Uncommon" },
            { name: "Orange Block", rarity: "Uncommon" },

            { name: "Pink Block", rarity: "Rare" },
            { name: "Lime Block", rarity: "Rare" },

            { name: "White Block", rarity: "Epic" },
            { name: "Black Block", rarity: "Epic" },

            { name: "Brown Block", rarity: "Legendary" },

            { name: "Rainbow Block", rarity: "Chroma" }

        ]

    },

    robot: {

        name: "ROBOT BOX",

        price: 15,

        blocks: [

            { name: "Rusty Bot", rarity: "Common" },
            { name: "Lil Bot", rarity: "Common" },

            { name: "Robot", rarity: "Uncommon" },

            { name: "Cyber Bot", rarity: "Rare" },

            { name: "Titan", rarity: "Epic" },

            { name: "Mega Titan", rarity: "Legendary" }

        ]

    },

    ocean: {

        name: "OCEAN PACK",

        price: 25,

        blocks: [

            { name: "Fish", rarity: "Common" },
            { name: "Dolphin", rarity: "Common" },

            { name: "Shark", rarity: "Uncommon" },

            { name: "Whale", rarity: "Rare" },

            { name: "Giant Squid", rarity: "Epic" },

            { name: "Kraken", rarity: "Legendary" },

            { name: "Megalodon", rarity: "Chroma" }

        ]

    },

    breakfast: {

        name: "BREAKFAST BOX",

        price: 20,

        blocks: [

            { name: "Toast", rarity: "Common" },
            { name: "Cereal", rarity: "Common" },

            { name: "Pancakes", rarity: "Uncommon" },

            { name: "Bacon", rarity: "Rare" },

            { name: "Donut", rarity: "Epic" },

            { name: "Waffle", rarity: "Legendary" },

            { name: "Waffles with Ice Cream", rarity: "Chroma" }

        ]

    },

    lunch: {

        name: "LUNCH BOX",

        price: 25,

        blocks: [

            { name: "Apple", rarity: "Common" },
            { name: "Sandwich", rarity: "Common" },

            { name: "Fries", rarity: "Uncommon" },

            { name: "Burger", rarity: "Rare" },

            { name: "Pizza", rarity: "Epic" },

            { name: "Sushi", rarity: "Legendary" },

            { name: "Cake", rarity: "Chroma" }

        ]

    },

    supper: {

        name: "SUPPER BOX",

        price: 30,

        blocks: [

            { name: "Rice", rarity: "Common" },
            { name: "Soup", rarity: "Common" },

            { name: "Mashed Potatoes", rarity: "Uncommon" },

            { name: "Chicken", rarity: "Rare" },

            { name: "Steak", rarity: "Epic" },

            { name: "Lobster", rarity: "Legendary" },

            { name: "Feast", rarity: "Chroma" }

        ]

    },

    sports: {

        name: "SPORTS BOX",

        price: 25,

        blocks: [

            { name: "Soccer Ball", rarity: "Common" },
            { name: "Basketball", rarity: "Common" },

            { name: "Baseball", rarity: "Uncommon" },

            { name: "Football", rarity: "Rare" },

            { name: "Tennis", rarity: "Epic" },

            { name: "Hockey", rarity: "Legendary" },

            { name: "Trophy", rarity: "Chroma" }

        ]

    },

    pirate: {

        name: "PIRATE PACK",

        price: 30,

        blocks: [

            { name: "Pirate Shipmate", rarity: "Common" },
            { name: "Pirate Rookie", rarity: "Common" },

            { name: "Pirate Sailor", rarity: "Uncommon" },

            { name: "Pirate Swordsman", rarity: "Rare" },

            { name: "Pirate Captain's Mate", rarity: "Epic" },

            { name: "Pirate Captain", rarity: "Legendary" },

            { name: "Davy Jones", rarity: "Chroma" }

        ]

    },

    dinosaur: {

        name: "DINOSAUR BOX",

        price: 30,

        blocks: [

            { name: "Triceratops", rarity: "Common" },
            { name: "Stegosaurus", rarity: "Common" },

            { name: "Velociraptor", rarity: "Uncommon" },

            { name: "Ankylosaurus", rarity: "Rare" },

            { name: "Spinosaurus", rarity: "Epic" },

            { name: "T-Rex", rarity: "Legendary" },

            { name: "Giganotosaurus", rarity: "Chroma" }

        ]

    },

    science: {

        name: "SCIENCE BOX",

        price: 30,

        blocks: [

            { name: "Test Tube", rarity: "Common" },
            { name: "Beaker", rarity: "Common" },

            { name: "Microscope", rarity: "Uncommon" },

            { name: "Scientist", rarity: "Rare" },

            { name: "Robot Scientist", rarity: "Epic" },

            { name: "Mad Scientist", rarity: "Legendary" }

        ]

    },

    superhero: {

        name: "SUPERHERO BOX",

        price: 35,

        blocks: [

            { name: "Rookie Hero", rarity: "Common" },
            { name: "Sidekick", rarity: "Common" },

            { name: "Superhero", rarity: "Uncommon" },

            { name: "Speedster", rarity: "Rare" },

            { name: "Supervillain", rarity: "Epic" },

            { name: "Superhero Captain", rarity: "Legendary" },

            { name: "Cosmic Hero", rarity: "Chroma" }

        ]

    },

    alien: {

        name: "ALIEN BOX",

        price: 35,

        blocks: [

            { name: "Little Alien", rarity: "Common" },
            { name: "Green Alien", rarity: "Common" },

            { name: "Alien Scout", rarity: "Uncommon" },

            { name: "Alien Warrior", rarity: "Rare" },

            { name: "Alien Commander", rarity: "Epic" },

            { name: "Alien Overlord", rarity: "Legendary" },

            { name: "Galactic Alien", rarity: "Chroma" }

        ]

    },

    bird: {

        name: "BIRD BOX",

        price: 35,

        blocks: [

            { name: "Sparrow", rarity: "Common" },
            { name: "Pigeon", rarity: "Common" },

            { name: "Blue Jay", rarity: "Uncommon" },

            { name: "Parrot", rarity: "Rare" },

            { name: "Eagle", rarity: "Epic" },

            { name: "Falcon", rarity: "Legendary" },

            { name: "Phoenix", rarity: "Chroma" }

        ]

    },

    school: {

        name: "SCHOOL BOX",

        price: 30,

        blocks: [

            { name: "Pencil", rarity: "Common" },
            { name: "Notebook", rarity: "Common" },

            { name: "Ruler", rarity: "Uncommon" },

            { name: "Backpack", rarity: "Rare" },

            { name: "Locker", rarity: "Epic" },

            { name: "Smart Board", rarity: "Legendary" }

        ]

    },

    pet: {

        name: "PET BOX",

        price: 35,

        blocks: [

            { name: "Cat", rarity: "Common" },
            { name: "Dog", rarity: "Common" },

            { name: "Hamster", rarity: "Uncommon" },

            { name: "Rabbit", rarity: "Rare" },

            { name: "Parrot", rarity: "Epic" },

            { name: "Dragon", rarity: "Legendary" },

            { name: "Unicorn", rarity: "Chroma" }

        ]

    },

    ore: {

        name: "ORE BOX",

        price: 30,

        blocks: [

            { name: "Stone", rarity: "Common" },
            { name: "Coal", rarity: "Common" },

            { name: "Copper", rarity: "Uncommon" },

            { name: "Gold", rarity: "Rare" },

            { name: "Diamond", rarity: "Epic" },

            { name: "Ruby", rarity: "Legendary" }

        ]

    },

    space: {

        name: "SPACE PACK",

        price: 35,

        blocks: [

            { name: "Earth", rarity: "Common" },
            { name: "Mars", rarity: "Common" },

            { name: "Venus", rarity: "Uncommon" },

            { name: "Neptune", rarity: "Rare" },

            { name: "Saturn", rarity: "Epic" },

            { name: "Jupiter", rarity: "Legendary" },

            { name: "The Sun", rarity: "Chroma" }

            ]

    },

    background: {

        name: "BACKGROUND BOX",

        price: 35,

        isBackground: true,

        backgrounds: [

            { name: "Forest", rarity: "Common" },
            { name: "Ocean", rarity: "Common" },

            { name: "Night", rarity: "Uncommon" },

            { name: "Volcano", rarity: "Rare" },

            { name: "Storm", rarity: "Epic" },

            { name: "Fire", rarity: "Legendary" },

            { name: "Rainbow", rarity: "Chroma" }

        ]

    },

    title: {

        name: "TITLE BOX",

        price: 35,

        isTitle: true,

        titles: [

            { name: "Rookie", rarity: "Common" },
            { name: "Explorer", rarity: "Common" },

            { name: "Collector", rarity: "Uncommon" },

            { name: "Pro", rarity: "Rare" },

            { name: "Expert", rarity: "Epic" },

            { name: "Master", rarity: "Legendary" },

            { name: "Legend", rarity: "Chroma" }

        ]

    },

    insect: {

        name: "INSECT BOX",

        price: 35,

        blocks: [

            { name: "Ant", rarity: "Common" },
            { name: "Fly", rarity: "Common" },

            { name: "Ladybug", rarity: "Uncommon" },

            { name: "Bee", rarity: "Rare" },

            { name: "Praying Mantis", rarity: "Epic" },

            { name: "Butterfly", rarity: "Legendary" },

            { name: "Queen Bee", rarity: "Chroma" }

        ]

    }

};


/* =========================
   SELL VALUES
========================= */

const sellValues = {

    Common: 5,
    Uncommon: 10,
    Rare: 25,
    Epic: 50,
    Legendary: 100,
    Chroma: 500,
    Hidden: 1000

};


/* =====================================================
   LOCAL SAVING
===================================================== */

function saveGame() {

    localStorage.setItem(
        "blocketCoins",
        coins
    );

    localStorage.setItem(
        "blocketCollection",
        JSON.stringify(collection)
    );

    localStorage.setItem(
        "blocketBackgroundCollection",
        JSON.stringify(backgroundCollection)
    );

    localStorage.setItem(
        "blocketTitleCollection",
        JSON.stringify(titleCollection)
    );

    localStorage.setItem(
        "blocketBoxesOpened",
        boxesOpened
    );

    localStorage.setItem(
        "blocketPacksOpened",
        boxesOpened
    );

    localStorage.setItem(
        "blocketPackStats",
        JSON.stringify(packStats)
    );

    localStorage.setItem(
        "blocketDailySpin",
        lastDailySpin
    );

    localStorage.setItem(
        "blocketEquippedBlock",
        equippedBlock
    );

    localStorage.setItem(
        "blocketEquippedBackground",
        equippedBackground
    );

    localStorage.setItem(
        "blocketEquippedTitle",
        equippedTitle
    );

}


/* =====================================================
   COINS
===================================================== */

function updateCoins() {

    const coinAmount =
        document.getElementById("coinAmount");

    if (coinAmount) {

        coinAmount.textContent = coins;

    }

    saveGame();

}


/* =====================================================
   THEME
===================================================== */

function updateTheme() {

    document.body.classList.toggle(
        "dark-mode",
        isDarkMode
    );

    applyEquippedBackground();

    const themeButton =
        document.getElementById("themeButton");

    if (themeButton) {

        themeButton.textContent =
            isDarkMode ? "☀️" : "🌙";

        themeButton.setAttribute(
            "aria-label",
            isDarkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
        );

    }

}


const backgroundStyles = {
    Default: "",
    Forest: "linear-gradient(135deg, #173d2b, #6aa85f)",
    Ocean: "linear-gradient(135deg, #0b4770, #5bc0d1)",
    Night: "linear-gradient(135deg, #090d29, #394c86)",
    Volcano: "linear-gradient(135deg, #321515, #d04d2f)",
    Storm: "linear-gradient(135deg, #353c52, #9aa7c2)",
    Fire: "linear-gradient(135deg, #641b0b, #f29c38)",
    Rainbow: "linear-gradient(120deg, #f66, #fc6, #6d6, #6cf, #c8f)"
};


function applyEquippedBackground() {

    document.body.style.background =
        backgroundStyles[equippedBackground] || "";

}


function equipBackground(backgroundName) {

    if (!backgroundCollection[backgroundName]) return;

    equippedBackground = backgroundName;
    saveGame();
    applyEquippedBackground();
    showBackgrounds();

}


function equipTitle(titleName) {

    if (!titleCollection[titleName]) return;

    equippedTitle = titleName;
    saveGame();
    showTitles();
    updateEquipped();

}


function getBoxRewards(box) {

    if (box.isBackground) return box.backgrounds;
    if (box.isTitle) return box.titles;
    return box.blocks;

}


function showTitles() {

    const mainContent = document.getElementById("mainContent");
    const titles = boxes.title.titles;

    mainContent.innerHTML = `
        <h1>TITLES</h1>
        <div class="collection-grid">
            ${titles.map(title => {
                const owned = titleCollection[title.name];
                const equipped = equippedTitle === title.name;

                return `
                    <div class="collection-block ${owned ? "" : "undiscovered"}">
                        <div class="collection-block-name">
                            ${owned ? title.name : "???"}
                        </div>
                        <div class="collection-rarity ${title.rarity.toLowerCase()}">
                            ${title.rarity}
                        </div>
                        <div class="collection-count">
                            ${owned ? `x${owned.amount}` : "Not discovered"}
                        </div>
                        ${owned ? `
                            <button class="equip-button" onclick='equipTitle(${JSON.stringify(title.name)})' ${equipped ? "disabled" : ""}>
                                ${equipped ? "EQUIPPED" : "EQUIP"}
                            </button>
                        ` : ""}
                    </div>
                `;
            }).join("")}
        </div>
    `;

}


function showBackgrounds() {

    const mainContent = document.getElementById("mainContent");
    const backgrounds = boxes.background.backgrounds;

    mainContent.innerHTML = `
        <h1>BACKGROUNDS</h1>
        <div class="collection-grid">
            ${backgrounds.map(background => {
                const owned = backgroundCollection[background.name];
                const equipped = equippedBackground === background.name;

                return `
                    <div class="collection-block ${owned ? "" : "undiscovered"}">
                        <div class="collection-block-name">
                            ${owned ? background.name : "???"}
                        </div>
                        <div class="collection-rarity ${background.rarity.toLowerCase()}">
                            ${background.rarity}
                        </div>
                        <div class="collection-count">
                            ${owned ? `x${owned.amount}` : "Not discovered"}
                        </div>
                        ${owned ? `
                            <button class="equip-button" onclick='equipBackground(${JSON.stringify(background.name)})' ${equipped ? "disabled" : ""}>
                                ${equipped ? "EQUIPPED" : "EQUIP"}
                            </button>
                        ` : ""}
                    </div>
                `;
            }).join("")}
        </div>
    `;

}


function toggleTheme() {

    isDarkMode = !isDarkMode;

    localStorage.setItem(
        "blocketTheme",
        isDarkMode ? "dark" : "light"
    );

    updateTheme();

}


/* =====================================================
   EQUIPPED BLOCK
===================================================== */

function updateEquipped() {

    const equipped =
        document.querySelector(".equipped");

    if (!equipped) return;

    equipped.innerHTML = `

        <div>Equipped Block</div>

        <div>${equippedBlock}</div>

        <div class="equipped-background-label">Title</div>

        <div>${equippedTitle || "None"}</div>

        <div class="equipped-background-label">Background</div>

        <div>${equippedBackground}</div>

    `;

}


function equipBlock(blockName) {

    if (!collection[blockName]) {
        return;
    }

    equippedBlock = blockName;

    saveGame();

    updateEquipped();

    showCollection();

}


/* =====================================================
   DAILY SPIN
===================================================== */

function getToday() {

    const now = new Date();

    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

}


function canDailySpin() {

    return lastDailySpin !== getToday();

}


/* =====================================================
   TABS
===================================================== */

function openTab(tab) {

    if (flapRace) {
        stopFlapRace();
    }

    if (tab === "collection") {
        showCollection();
    }

    if (tab === "backgrounds") {
        showBackgrounds();
    }

    if (tab === "titles") {
        showTitles();
    }

    if (tab === "market") {
        showMarket();
    }

    if (tab === "library") {
        showLibrary();
    }

    if (tab === "stats") {
        showStats();
    }

    if (tab === "info") {
        showInfo();
    }

    if (tab === "host") {
        showHost();
    }

    if (tab === "play") {
        showPlay();
    }

    if (tab === "updates") {
        showUpdates();
    }

}


/* =====================================================
   MARKET
===================================================== */

function showMarket() {

    const mainContent =
        document.getElementById("mainContent");

    const dailyAvailable =
        canDailySpin();

    mainContent.innerHTML = `

        <h1>MARKET</h1>

        <div class="market-balance">
            🪙 <span id="coinAmount">${coins}</span> COINS
        </div>

        <div class="market-grid">

            <div class="pack-card">

                <h2>🎨 COLOR BOX</h2>

                <p>
                    Contains random color Blocks!
                </p>

                <p class="pack-price">
                    20 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('color')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>🤖 ROBOT BOX</h2>

                <p>
                    Contains random Robot Blocks!
                </p>

                <p class="pack-price">
                    15 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('robot')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>🌊 OCEAN PACK</h2>

                <p>
                    Contains mysterious ocean Blocks!
                </p>

                <p class="pack-price">
                    25 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('ocean')"
                >
                    BUY PACK
                </button>

            </div>


            <div class="pack-card">

                <h2>🍳 BREAKFAST BOX</h2>

                <p>
                    Contains delicious breakfast Blocks!
                </p>

                <p class="pack-price">
                    20 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('breakfast')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>🥪 LUNCH BOX</h2>

                <p>
                    Contains tasty lunch Blocks!
                </p>

                <p class="pack-price">
                    25 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('lunch')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>🍽️ SUPPER BOX</h2>

                <p>
                    Contains hearty supper Blocks!
                </p>

                <p class="pack-price">
                    30 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('supper')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>🏅 SPORTS BOX</h2>

                <p>
                    Contains exciting sports Blocks!
                </p>

                <p class="pack-price">
                    25 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('sports')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>🏴‍☠️ PIRATE PACK</h2>

                <p>
                    Contains legendary pirate Blocks!
                </p>

                <p class="pack-price">
                    30 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('pirate')"
                >
                    BUY PACK
                </button>

            </div>


            <div class="pack-card">

                <h2>🦖 DINOSAUR BOX</h2>

                <p>
                    Contains powerful prehistoric Blocks!
                </p>

                <p class="pack-price">
                    30 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('dinosaur')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>🔬 SCIENCE BOX</h2>

                <p>
                    Contains fascinating science Blocks!
                </p>

                <p class="pack-price">
                    30 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('science')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>🦸 SUPERHERO BOX</h2>

                <p>
                    Contains powerful hero Blocks!
                </p>

                <p class="pack-price">
                    35 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('superhero')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>👽 ALIEN BOX</h2>

                <p>
                    Contains mysterious alien Blocks!
                </p>

                <p class="pack-price">
                    35 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('alien')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>🐦 BIRD BOX</h2>

                <p>
                    Contains colorful flying Blocks!
                </p>

                <p class="pack-price">
                    35 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('bird')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>📚 SCHOOL BOX</h2>

                <p>
                    Contains useful school Blocks!
                </p>

                <p class="pack-price">
                    30 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('school')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>🐾 PET BOX</h2>

                <p>
                    Contains adorable pet Blocks!
                </p>

                <p class="pack-price">
                    35 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('pet')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>⛏️ ORE BOX</h2>

                <p>
                    Contains valuable mining Blocks!
                </p>

                <p class="pack-price">
                    30 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('ore')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>🚀 SPACE PACK</h2>

                <p>
                    Contains planets and stars from space!
                </p>

                <p class="pack-price">
                    35 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('space')"
                >
                    BUY PACK
                </button>

            </div>


            <div class="pack-card">

                <h2>🖼️ BACKGROUND BOX</h2>

                <p>
                    Contains backgrounds for your profile and UI!
                </p>

                <p class="pack-price">
                    35 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('background')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>🏷️ TITLE BOX</h2>

                <p>
                    Contains titles to display beside your name!
                </p>

                <p class="pack-price">
                    35 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('title')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="pack-card">

                <h2>🐜 INSECT BOX</h2>

                <p>
                    Contains tiny but mighty insect Blocks!
                </p>

                <p class="pack-price">
                    35 COINS
                </p>

                <button
                    class="buy-button"
                    onclick="buyBox('insect')"
                >
                    BUY BOX
                </button>

            </div>


            <div class="daily-card">

                <h2>🎡 DAILY SPIN</h2>

                <p>
                    Spin once every day!
                </p>

                <p>
                    Win 500 - 2,000 Coins
                </p>

                <button
                    class="spin-button"
                    onclick="dailySpin()"
                    ${dailyAvailable ? "" : "disabled"}
                >

                    ${
                        dailyAvailable
                        ? "SPIN!"
                        : "COME BACK TOMORROW"
                    }

                </button>

            </div>

        </div>

    `;

    const packCards =
        mainContent.querySelectorAll(".pack-card");

    Object.keys(boxes).forEach((boxType, index) => {

        const packCard = packCards[index];

        packCard.dataset.boxType = boxType;
        packCard.title = "Click to view pack information";
        packCard.addEventListener(
            "click",
            () => showPackInfo(boxType)
        );

        packCard.querySelector("button").addEventListener(
            "click",
            event => event.stopPropagation()
        );

    });

}


function getRarityRank(rarity) {

    return [
        "Common",
        "Uncommon",
        "Rare",
        "Epic",
        "Legendary",
        "Chroma",
        "Hidden"
    ].indexOf(rarity);

}


function getPackStats(boxType) {

    return packStats[boxType] || {
        opens: 0,
        luckiestPull: null
    };

}


function showPackInfo(boxType) {

    const mainContent =
        document.getElementById("mainContent");

    const box = boxes[boxType];
    const stats = getPackStats(boxType);

    const blocksHTML =
        getBoxRewards(box).map(block => `

            <div class="pack-info-row">

                <span>${block.name}</span>

                <span class="library-rarity ${block.rarity.toLowerCase()}">
                    ${block.rarity}
                </span>

            </div>

        `).join("");

    const luckiestPull =
        stats.luckiestPull
            ? `${stats.luckiestPull.name} (${stats.luckiestPull.rarity})`
            : "None yet";

    mainContent.innerHTML = `

        <button
            class="back-button"
            onclick="showMarket()"
            type="button"
        >
            BACK TO MARKET
        </button>

        <h1>${box.name}</h1>

        <div class="pack-summary">

            <div>
                <span>PACK COST</span>
                <strong>${box.price} COINS</strong>
            </div>

            <div>
                <span>YOUR OPENS</span>
                <strong>${stats.opens}</strong>
            </div>

            <div>
                <span>LUCKIEST PULL</span>
                <strong>${luckiestPull}</strong>
            </div>

        </div>

        <div class="info-card pack-contents">

            <h2>WHAT'S INSIDE</h2>

            <div class="pack-info-list">
                ${blocksHTML}
            </div>

        </div>

    `;

}


/* =====================================================
   STATS
===================================================== */

function showStats() {

    const mainContent =
        document.getElementById("mainContent");

    let totalBlocks = 0;

    Object.values(collection).forEach(block => {

        totalBlocks += block.amount;

    });

    const uniqueBlocks =
        Object.keys(collection).length;

    const dailySpinStatus =
        canDailySpin() ? "READY" : "CLAIMED TODAY";

    const allBlocks =
        Object.values(boxes)
            .filter(box => !box.isBackground && !box.isTitle)
            .flatMap(box => box.blocks)
            .concat(
                hiddenBlocks.filter(block =>
                    collection[block.name]
                )
            );

    let rarestBlock = "None";

    if (collection["Rainbow Block"]) {

        rarestBlock = "Rainbow Block";

    } else if (collection["Megalodon"]) {

        rarestBlock = "Megalodon";

    } else if (collection["Trophy"]) {

        rarestBlock = "Trophy";

    } else if (collection["Davy Jones"]) {

        rarestBlock = "Davy Jones";

    } else if (collection["Giganotosaurus"]) {

        rarestBlock = "Giganotosaurus";

    } else if (collection["Cosmic Hero"]) {

        rarestBlock = "Cosmic Hero";

    } else if (collection["Galactic Alien"]) {

        rarestBlock = "Galactic Alien";

    } else if (collection["Phoenix"]) {

        rarestBlock = "Phoenix";

    } else if (collection["Mega Titan"]) {

        rarestBlock = "Mega Titan";

    } else if (collection["Kraken"]) {

        rarestBlock = "Kraken";

    } else if (collection["Hockey"]) {

        rarestBlock = "Hockey";

    } else if (collection["Pirate Captain"]) {

        rarestBlock = "Pirate Captain";

    } else if (collection["T-Rex"]) {

        rarestBlock = "T-Rex";

    } else if (collection["Falcon"]) {

        rarestBlock = "Falcon";

    } else if (collection["Smart Board"]) {

        rarestBlock = "Smart Board";

    } else if (collection["Unicorn"]) {

        rarestBlock = "Unicorn";

    } else if (collection["The Sun"]) {

        rarestBlock = "The Sun";

    } else if (collection["Eternal"]) {

        rarestBlock = "Eternal";

    } else if (collection["Jupiter"]) {

        rarestBlock = "Jupiter";

    } else if (collection["Queen Bee"]) {

        rarestBlock = "Queen Bee";

    } else if (collection["Butterfly"]) {

        rarestBlock = "Butterfly";

    } else if (collection["Ruby"]) {

        rarestBlock = "Ruby";

    } else if (collection["Brown Block"]) {

        rarestBlock = "Brown Block";

    } else if (collection["Titan"]) {

        rarestBlock = "Titan";

    } else if (uniqueBlocks > 0) {

        rarestBlock =
            Object.keys(collection)[0];

    }

    mainContent.innerHTML = `

        <h1>STATS</h1>

        <div class="stats-grid">

            <div class="stat-card">

                <h2>🪙 COINS</h2>

                <p>${coins}</p>

            </div>


            <div class="stat-card">

                <h2>📦 BOXES OPENED</h2>

                <p>${boxesOpened}</p>

            </div>


            <div class="stat-card">

                <h2>🎡 DAILY SPIN</h2>

                <p>${dailySpinStatus}</p>

            </div>


            <div class="stat-card">

                <h2>🧱 TOTAL BLOCKS</h2>

                <p>${totalBlocks}</p>

            </div>


            <div class="stat-card">

                <h2>📚 UNIQUE BLOCKS</h2>

                <p>${uniqueBlocks}/${allBlocks.length}</p>

            </div>


            <div class="stat-card">

                <h2>⭐ RAREST BLOCK</h2>

                <p>${rarestBlock}</p>

            </div>

        </div>

    `;

}


/* =====================================================
   LIBRARY
===================================================== */

function showLibrary() {

    const mainContent =
        document.getElementById("mainContent");

    const allBlocks =
        Object.values(boxes)
            .filter(box => !box.isBackground && !box.isTitle)
            .flatMap(box => box.blocks);

    let blocksHTML = "";

    allBlocks.forEach(block => {

const sellValue =
    Number(sellValues[ownedBlock.rarity]) || 0;

        blocksHTML += `

            <div class="library-block">

                <div class="library-block-name">
                    ${block.name}
                </div>

                <div
                    class="library-rarity ${block.rarity.toLowerCase()}"
                >
                    ${block.rarity}
                </div>

                <div class="library-sell">

                    Sell Value:
                    ${sellValue} 🪙

                </div>

            </div>

        `;

    });

    mainContent.innerHTML = `

        <h1>LIBRARY</h1>

        <p class="library-description">
            View every Block in Blocket.
        </p>

        <div class="library-grid">

            ${blocksHTML}

        </div>

    `;

}


/* =====================================================
   COLLECTION
===================================================== */

function showCollection(rarityFilter = "All", searchQuery = "") {

    const mainContent =
        document.getElementById("mainContent");

    const normalizedSearch =
        searchQuery.trim().toLowerCase();

    const renderBlock = block => {

            const ownedBlock =
                collection[block.name];

            const isEquipped =
                ownedBlock && equippedBlock === block.name;

            if (!ownedBlock) {
                return `

                    <div class="collection-block undiscovered">

                        <div class="collection-block-name">
                            ???
                        </div>

                        <div
                            class="collection-rarity ${block.rarity.toLowerCase()}"
                        >
                            ${block.rarity}
                        </div>

                        <div class="collection-pack">
                            From: ${block.packName}
                        </div>

                        <div class="collection-count">
                            Not discovered
                        </div>

                    </div>

                `;
            }

            const sellValue =
                sellValues[ownedBlock.rarity];

            return `

                <div class="collection-block">

                    <div class="collection-block-name">
                        ${ownedBlock.name}
                    </div>

                    <div
                        class="collection-rarity ${ownedBlock.rarity.toLowerCase()}"
                    >
                        ${ownedBlock.rarity}
                    </div>

                    <div class="collection-pack">
                        From: ${block.packName}
                    </div>

                    <div class="collection-count">
                        x${ownedBlock.amount}
                    </div>

<button
    class="sell-button"
    type="button"
    onclick='sellBlock(${JSON.stringify(block.name)})'
>
    SELL +${sellValue} 🪙
</button>

                    <button
                        class="sell-button"
                        onclick="sellBlock(${JSON.stringify(block.name)})"
                    >
                        SELL +${sellValue} 🪙
                    </button>

                </div>

            `;

        };

    const boxSections =
        Object.entries(boxes)
            .filter(([, box]) => !box.isBackground && !box.isTitle)
            .map(([boxType, box]) => {

                const matchingBlocks =
                    box.blocks.filter(block =>
                        (rarityFilter === "All" ||
                            block.rarity === rarityFilter) &&
                        (!normalizedSearch ||
                            block.name.toLowerCase().includes(normalizedSearch))
                    );

                if (matchingBlocks.length === 0) return "";

                return `
                    <section class="collection-box-section">
                        <h2>${box.name}</h2>
                        <div class="collection-grid">
                            ${matchingBlocks.map(renderBlock).join("")}
                        </div>
                    </section>
                `;
            }).join("");

    const hiddenMatches =
        hiddenBlocks.filter(block =>
            (collection[block.name] ||
                (block.searchable &&
                    normalizedSearch === block.name.toLowerCase())) &&
            (rarityFilter === "All" || block.rarity === rarityFilter)
        );

    const hiddenSection =
        hiddenMatches.length > 0
            ? `
                <section class="collection-box-section hidden-section">
                    <h2>MISC</h2>
                    <div class="collection-grid">
                        ${hiddenMatches.map(block => collection[block.name]
                            ? renderBlock(block)
                            : `
                                <div class="collection-block undiscovered hidden-discovery-card">
                                    <div class="collection-block-name">${block.name}</div>
                                    <div class="collection-rarity hidden">${block.rarity}</div>
                                    <div class="collection-pack">From: ${block.packName}</div>
                                    <button
                                        class="equip-button"
                                        onclick='collectHiddenBlock(${JSON.stringify(block.name)})'
                                    >
                                        COLLECT
                                    </button>
                                </div>
                            `
                        ).join("")}
                    </div>
                </section>
            `
            : "";

    const rarityOptions = [
        "Common",
        "Uncommon",
        "Rare",
        "Epic",
        "Legendary",
        "Chroma"
    ];

    if (
        normalizedSearch === "time watch" ||
        collection["Time Watch"] ||
        collection["Eternal"]
    ) {
        rarityOptions.push("Hidden");
    }

    mainContent.innerHTML = `

        <h1>COLLECTION</h1>

        <div class="collection-tools">

            <label for="rarityFilter">FILTER BY RARITY</label>

            <input
                id="collectionSearch"
                class="collection-search"
                type="search"
                value="${searchQuery.replace(/"/g, "&quot;")}"
                placeholder="SEARCH BLOCKS"
                oninput="filterCollection(this.value)"
            >

            <select
                id="rarityFilter"
                onchange="showCollection(this.value, document.getElementById('collectionSearch').value)"
            >
                <option value="All" ${rarityFilter === "All" ? "selected" : ""}>
                    All Rarities
                </option>
                ${rarityOptions.map(rarity => `
                    <option
                        value="${rarity}"
                        ${rarityFilter === rarity ? "selected" : ""}
                    >
                        ${rarity}
                    </option>
                `).join("")}
            </select>

        </div>

        <div id="collectionResults">
            ${boxSections}
            ${hiddenSection}
        </div>

    `;

}


function filterCollection(searchQuery) {

    const searchInput =
        document.getElementById("collectionSearch");

    const rarityFilter =
        document.getElementById("rarityFilter").value;

    const cursorPosition =
        searchInput.selectionStart;

    showCollection(
        rarityFilter,
        searchQuery
    );

    const updatedSearchInput =
        document.getElementById("collectionSearch");

    updatedSearchInput.focus();
    updatedSearchInput.setSelectionRange(
        cursorPosition,
        cursorPosition
    );

}


function collectHiddenBlock(blockName) {

    const hiddenBlock =
        hiddenBlocks.find(block => block.name === blockName);

    if (!hiddenBlock || collection[blockName]) return;

    collection[blockName] = {
        name: hiddenBlock.name,
        rarity: hiddenBlock.rarity,
        amount: 1
    };

    saveGame();

    filterCollection(
        document.getElementById("collectionSearch").value
    );

}


/* =====================================================
   INFO
===================================================== */

function showInfo() {

    const mainContent =
        document.getElementById("mainContent");

    mainContent.innerHTML = `

        <h1>INFO</h1>

        <div class="info-card">

            <h2>ABOUT BLOCKET</h2>

            <p>
                Welcome to Blocket!
            </p>

            <p>
                Collect Blocks, open Boxes,
                discover rare Blocks,
                and build your collection.
            </p>

            <h2>RARITIES</h2>

            <p>
                Common →
                Uncommon →
                Rare →
                Epic →
                Legendary →
                Chroma
            </p>

            <h2>BOXES</h2>

            <p>
                Open different Boxes
                to discover different Blocks.
            </p>

        </div>

    `;

}


/* =====================================================
   HOST + PLAY + MULTIPLAYER FLAP RACE
===================================================== */

let flapRace = null;

let flapRaceChannel = null;
let flapRaceRoomCode = null;
let flapRaceRoomIsHost = false;
let flapRaceRoomDisplayName = "";
let flapRaceRoomTimeLimit = 60;
let flapRaceRoomStarted = false;

let flapClientId =
    sessionStorage.getItem("blocketFlapClientId");

if (!flapClientId) {
    flapClientId =
        window.crypto?.randomUUID
            ? window.crypto.randomUUID()
            : `player-${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}`;

    sessionStorage.setItem(
        "blocketFlapClientId",
        flapClientId
    );
}


/* =========================
   REALTIME AVAILABILITY
========================= */

function canUseRealtime() {

    return (
        navigator.onLine &&
        typeof supabaseClient?.channel === "function"
    );

}


/* =========================
   ROOM CHANNEL
========================= */

async function connectFlapRaceRoom(
    roomCode,
    displayName,
    isHost,
    timeLimit
) {

    if (!canUseRealtime()) {
        return false;
    }

    await disconnectFlapRaceRoom();

    flapRaceRoomCode = roomCode;
    flapRaceRoomDisplayName =
        sanitizeDisplayName(displayName || "Player");

    flapRaceRoomIsHost = isHost;
    flapRaceRoomTimeLimit = timeLimit;
    flapRaceRoomStarted = false;

    const channelName =
        `blocket-flap-race:${roomCode}`;

    flapRaceChannel =
        supabaseClient.channel(
            channelName,
            {
                config: {
                    presence: {
                        key: flapClientId
                    },

                    broadcast: {
                        self: false
                    }
                }
            }
        );

    flapRaceChannel

        .on(
            "presence",
            {
                event: "sync"
            },
            () => {

                renderRoomPlayers();

            }
        )

        .on(
            "presence",
            {
                event: "join"
            },
            () => {

                renderRoomPlayers();

            }
        )

        .on(
            "presence",
            {
                event: "leave"
            },
            ({ key }) => {

                if (flapRace) {

                    delete flapRace.remoteRacers[key];

                }

                renderRoomPlayers();

            }
        )

        .on(
            "broadcast",
            {
                event: "race_start"
            },
            payload => {

                if (
                    flapRaceRoomIsHost ||
                    flapRaceRoomStarted
                ) {
                    return;
                }

                const startPayload =
                    payload.payload || {};

                flapRaceRoomStarted = true;

                const countdown =
                    Number(
                        startPayload.countdown || 2000
                    );

                setTimeout(() => {

                    startFlapRace(
                        flapRaceRoomDisplayName,
                        true,
                        false
                    );

                }, countdown);

            }
        )

        .on(
            "broadcast",
            {
                event: "player_state"
            },
            payload => {

                if (!flapRace) {
                    return;
                }

                const state =
                    payload.payload;

                if (!state || state.id === flapClientId) {
                    return;
                }

                flapRace.remoteRacers[state.id] = {
                    id: state.id,
                    name: sanitizeDisplayName(
                        state.name || "Player"
                    ),
                    title: sanitizeDisplayName(
                        state.title || ""
                    ),
                    distance:
                        Number(state.distance) || 0,
                    checkpoint:
                        Number(state.checkpoint) || 0,
                    birdY:
                        Number(state.birdY) || 210,
                    color:
                        state.color || "#8b62d9",
                    crashed:
                        Boolean(state.crashed),
                    lastSeen:
                        performance.now()
                };

            }
        )

        .on(
            "broadcast",
            {
                event: "race_end"
            },
            payload => {

                if (!flapRace) {
                    return;
                }

                showMultiplayerRaceResults(
                    payload.payload
                );

            }
        );

    return new Promise(resolve => {

        const timeout =
            setTimeout(() => {

                resolve(false);

            }, 8000);

        flapRaceChannel.subscribe(
            async status => {

                if (status === "SUBSCRIBED") {

                    clearTimeout(timeout);

                    try {

                        await flapRaceChannel.track({
                            id: flapClientId,
                            name:
                                flapRaceRoomDisplayName,
                            title:
                                equippedTitle || "",
                            host:
                                isHost,
                            online_at:
                                new Date().toISOString()
                        });

                        resolve(true);

                    } catch (error) {

                        console.error(
                            "PRESENCE ERROR:",
                            error
                        );

                        resolve(false);

                    }

                }

                if (
                    status === "CHANNEL_ERROR" ||
                    status === "TIMED_OUT"
                ) {

                    clearTimeout(timeout);

                    console.error(
                        "REALTIME ROOM ERROR:",
                        status
                    );

                    resolve(false);

                }

            }
        );

    });

}


/* =========================
   DISCONNECT ROOM
========================= */

async function disconnectFlapRaceRoom() {

    if (!flapRaceChannel) {
        return;
    }

    try {

        await flapRaceChannel.untrack();

    } catch {}

    try {

        if (
            typeof supabaseClient.removeChannel ===
            "function"
        ) {

            await supabaseClient.removeChannel(
                flapRaceChannel
            );

        }

    } catch {}

    flapRaceChannel = null;
    flapRaceRoomCode = null;
    flapRaceRoomStarted = false;

}


/* =========================
   ROOM PLAYERS
========================= */

function getRoomPlayers() {

    if (!flapRaceChannel) {
        return [];
    }

    const presence =
        flapRaceChannel.presenceState();

    return Object.entries(presence)
        .flatMap(([key, entries]) =>
            entries.map(entry => ({
                id: key,
                name:
                    sanitizeDisplayName(
                        entry.name || "Player"
                    ),
                title:
                    sanitizeDisplayName(
                        entry.title || ""
                    ),
                host:
                    Boolean(entry.host)
            }))
        );

}


/* =========================
   HOST LOBBY
========================= */

function renderHostLobby() {

    const status =
        document.getElementById("hostStatus");

    const players =
        document.getElementById("hostPlayers");

    const startButton =
        document.getElementById("startHostedRaceButton");

    if (!players) {
        return;
    }

    const roomPlayers =
        getRoomPlayers();

    players.innerHTML =
        roomPlayers.length
            ? roomPlayers.map(player => `
                <div class="race-racer">
                    <strong>
                        ${player.host ? "👑 " : ""}
                        ${player.name}
                    </strong>
                    <span>
                        ${player.host ? "HOST" : "PLAYER"}
                    </span>
                </div>
            `).join("")
            : "<p>No players connected yet.</p>";

    if (status) {

        status.textContent =
            `${roomPlayers.length} player${
                roomPlayers.length === 1 ? "" : "s"
            } in room.`;

    }

    if (startButton) {

        startButton.disabled =
            flapRaceRoomStarted;

    }

}


/* =========================
   HOST SCREEN
========================= */

function showHost() {

    const mainContent =
        document.getElementById("mainContent");

    const race =
        getHostedRace();

    mainContent.innerHTML = `

        <h1>HOST</h1>

        <div class="info-card game-lobby">

            <h2>🐦 FLAP RACE</h2>

            <p>
                Create a room and race with other Blocket players.
            </p>

            <label for="hostDisplayName">
                DISPLAY NAME
            </label>

            <input
                id="hostDisplayName"
                class="game-input"
                type="text"
                maxlength="18"
                placeholder="YOUR NAME"
                autocomplete="nickname"
            >

            <label for="raceTime">
                RACE TIME
            </label>

            <select
                id="raceTime"
                class="game-select"
            >
                <option value="30">
                    30 seconds
                </option>

                <option value="60" selected>
                    60 seconds
                </option>

                <option value="90">
                    90 seconds
                </option>
            </select>

            <button
                class="buy-button"
                onclick="createFlapRace()"
                type="button"
            >
                CREATE FLAP RACE
            </button>

            <p
                id="hostStatus"
                class="game-status"
            ></p>

            <div
                id="roomCodeDisplay"
                class="room-code-display"
            ></div>

            <div
                id="hostPlayers"
                class="race-scoreboard"
            ></div>

            <button
                id="startHostedRaceButton"
                class="buy-button"
                onclick="startHostedFlapRace()"
                type="button"
                style="display:none;"
            >
                START RACE
            </button>

        </div>

    `;

    if (race) {

        document.getElementById(
            "roomCodeDisplay"
        ).innerHTML = `
            ROOM CODE
            <strong>${race.roomCode}</strong>
            <br>
            <a
                href="${getRaceShareUrl(race)}"
            >
                ${getRaceShareUrl(race)}
            </a>
        `;

        document.getElementById(
            "hostDisplayName"
        ).value =
            sessionStorage.getItem(
                "blocketFlapDisplayName"
            ) || "";

        document.getElementById(
            "raceTime"
        ).value =
            race.timeLimit;

    }

}


/* =========================
   CREATE ROOM
========================= */

async function createFlapRace() {

    const displayName =
        document
            .getElementById("hostDisplayName")
            .value
            .trim();

    const timeLimit =
        Number(
            document
                .getElementById("raceTime")
                .value
        );

    if (!displayName) {

        document.getElementById(
            "hostStatus"
        ).textContent =
            "Enter a display name first.";

        return;

    }

    sessionStorage.setItem(
        "blocketFlapDisplayName",
        displayName
    );

    const roomCode =
        generateRoomCode();

    localStorage.setItem(
        "blocketFlapRace",
        JSON.stringify({
            timeLimit,
            roomCode,
            createdAt: Date.now()
        })
    );

    const connected =
        await connectFlapRaceRoom(
            roomCode,
            displayName,
            true,
            timeLimit
        );

    const status =
        document.getElementById(
            "hostStatus"
        );

    const roomDisplay =
        document.getElementById(
            "roomCodeDisplay"
        );

    const startButton =
        document.getElementById(
            "startHostedRaceButton"
        );

    if (!connected) {

        status.textContent =
            "Room created. Multiplayer is unavailable right now, so you can still play with AI offline.";

        roomDisplay.innerHTML = `
            ROOM CODE
            <strong>${roomCode}</strong>
        `;

        startButton.style.display =
            "block";

        startButton.textContent =
            "START OFFLINE RACE";

        return;

    }

    status.textContent =
        "Room created! Share the link or room code.";

    roomDisplay.innerHTML = `
        ROOM CODE
        <strong>${roomCode}</strong>
        <br>
        <a href="${getRaceShareUrl({
            roomCode,
            timeLimit
        })}">
            ${getRaceShareUrl({
                roomCode,
                timeLimit
            })}
        </a>
    `;

    startButton.style.display =
        "block";

    startButton.textContent =
        "START RACE";

    renderHostLobby();

}


/* =========================
   START HOSTED RACE
========================= */

async function startHostedFlapRace() {

    const displayName =
        document
            .getElementById("hostDisplayName")
            ?.value
            .trim() ||
        sessionStorage.getItem(
            "blocketFlapDisplayName"
        ) ||
        "Host";

    const race =
        getHostedRace();

    if (!race) {
        return;
    }

    flapRaceRoomStarted = true;

    const countdown =
        2000;

    if (
        flapRaceChannel &&
        flapRaceChannel.send
    ) {

        await flapRaceChannel.send({

            type: "broadcast",

            event: "race_start",

            payload: {
                countdown,
                timeLimit:
                    race.timeLimit
            }

        });

    }

    startFlapRace(
        displayName,
        Boolean(flapRaceChannel),
        true
    );

}


/* =========================
   PLAY SCREEN
========================= */

function showPlay() {

    const mainContent =
        document.getElementById("mainContent");

    const race =
        getHostedRace();

    mainContent.innerHTML = `

        <h1>PLAY</h1>

        <div class="info-card game-lobby">

            <h2>🐦 FLAP RACE</h2>

            <p>
                Join a room and race through the obstacle course.
            </p>

            <label for="roomCode">
                ROOM CODE
            </label>

            <input
                id="roomCode"
                class="game-input"
                type="text"
                maxlength="6"
                placeholder="ABC123"
                autocomplete="off"
            >

            <label for="displayName">
                DISPLAY NAME
            </label>

            <input
                id="displayName"
                class="game-input"
                type="text"
                maxlength="18"
                placeholder="YOUR NAME"
                autocomplete="nickname"
            >

            <button
                class="buy-button"
                onclick="joinFlapRace()"
                type="button"
            >
                JOIN FLAP RACE
            </button>

            <p
                id="playStatus"
                class="game-status"
            >
                Enter the room code from the host.
            </p>

        </div>

    `;

    if (race) {

        document.getElementById(
            "roomCode"
        ).value =
            race.roomCode;

    }

    document.getElementById(
        "displayName"
    ).value =
        sessionStorage.getItem(
            "blocketFlapDisplayName"
        ) || "";

}


/* =========================
   JOIN ROOM
========================= */

async function joinFlapRace() {

    const roomCode =
        document
            .getElementById("roomCode")
            .value
            .trim()
            .toUpperCase();

    const displayName =
        document
            .getElementById("displayName")
            .value
            .trim();

    const status =
        document.getElementById(
            "playStatus"
        );

    if (!roomCode) {

        status.textContent =
            "Enter a room code.";

        return;

    }

    if (!displayName) {

        status.textContent =
            "Enter a display name.";

        return;

    }

    const race =
        getHostedRace();

    const timeLimit =
        race?.timeLimit || 60;

    sessionStorage.setItem(
        "blocketFlapDisplayName",
        displayName
    );

    const connected =
        await connectFlapRaceRoom(
            roomCode,
            displayName,
            false,
            timeLimit
        );

    if (!connected) {

        status.textContent =
            "Could not connect to that room. Check your internet connection and the room code.";

        return;

    }

    status.textContent =
        "✅ Joined the room! Waiting for the host to start the race...";

}


/* =========================
   ROOM CODE
========================= */

function getRaceShareUrl(race) {

    const shareUrl =
        new URL(window.location.href);

    shareUrl.searchParams.set(
        "room",
        race.roomCode
    );

    shareUrl.searchParams.set(
        "time",
        race.timeLimit
    );

    return shareUrl.href;

}


function getHostedRace() {

    const savedRace =
        JSON.parse(
            localStorage.getItem(
                "blocketFlapRace"
            ) || "null"
        );

    const url =
        new URL(
            window.location.href
        );

    const roomCode =
        url.searchParams
            .get("room")
            ?.toUpperCase();

    const timeLimit =
        Number(
            url.searchParams.get("time")
        );

    if (
        roomCode &&
        [30, 60, 90].includes(timeLimit)
    ) {

        return {
            roomCode,
            timeLimit
        };

    }

    return savedRace;

}


function generateRoomCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let roomCode = "";

    for (
        let index = 0;
        index < 6;
        index++
    ) {

        roomCode +=
            characters[
                Math.floor(
                    Math.random() *
                    characters.length
                )
            ];

    }

    return roomCode;

}


/* =====================================================
   FLAP RACE
===================================================== */

function startFlapRace(
    displayName = "You",
    onlineMode = false,
    isHost = false
) {

    const race =
        getHostedRace();

    if (!race) {

        showPlay();

        return;

    }

    const mainContent =
        document.getElementById(
            "mainContent"
        );

    const safeDisplayName =
        sanitizeDisplayName(
            displayName
        );

    mainContent.innerHTML = `

        <div class="flap-race-header">

            <div>

                <h1>
                    🐦 FLAP RACE
                </h1>

                <p id="flapRaceStatus">
                    ${onlineMode
                        ? "GET READY..."
                        : "SPACE / CLICK TO FLAP"}
                </p>

            </div>

            <div
                class="race-timer"
                id="raceTimer"
            >
                ${race.timeLimit}.0
            </div>

        </div>

        <div
            class="race-scoreboard"
            id="raceScoreboard"
        ></div>

        <canvas
            id="flapCanvas"
            class="flap-canvas"
            width="900"
            height="420"
            aria-label="Flap Race obstacle course"
        ></canvas>

        <button
            class="buy-button flap-button"
            onclick="flapBird()"
            type="button"
        >
            FLAP
        </button>

    `;

    flapRace = {

        canvas:
            document.getElementById(
                "flapCanvas"
            ),

        context:
            document
                .getElementById("flapCanvas")
                .getContext("2d"),

        timeLimit:
            race.timeLimit,

        displayName:
            safeDisplayName,

        raceName:
            getDisplayedRaceName(
                safeDisplayName
            ),

        startedAt:
            performance.now(),

        lastFrame:
            performance.now(),

        distance: 0,

        checkpoint: 0,

        birdY: 210,

        birdVelocity: 0,

        lastPipe: -1,

        passedPipes: 0,

        checkpointOrder: 0,

        online:
            onlineMode,

        isHost:
            isHost,

        roomCode:
            race.roomCode,

        remoteRacers: {},

        lastBroadcast:
            0,

        color:
            isHost
                ? "#e85d75"
                : "#8b62d9",

        bots:
            onlineMode
                ? []
                : [
                    {
                        name: "Sky",
                        distance: 0,
                        speed: 0.93,
                        checkpoint: 0,
                        checkpointPipe: 0,
                        lastPipe: -1,
                        respawnUntil: 0,
                        color: "#e85d75"
                    },

                    {
                        name: "Wing",
                        distance: 0,
                        speed: 0.87,
                        checkpoint: 0,
                        checkpointPipe: 0,
                        lastPipe: -1,
                        respawnUntil: 0,
                        color: "#8b62d9"
                    },

                    {
                        name: "Cloud",
                        distance: 0,
                        speed: 0.8,
                        checkpoint: 0,
                        checkpointPipe: 0,
                        lastPipe: -1,
                        respawnUntil: 0,
                        color: "#e58b36"
                    }
                ],

        animation:
            null,

        keyHandler:
            event => {

                if (
                    event.code === "Space"
                ) {

                    event.preventDefault();

                    flapBird();

                }

            },

        clickHandler:
            () => flapBird()

    };

    document.addEventListener(
        "keydown",
        flapRace.keyHandler
    );

    flapRace.canvas.addEventListener(
        "click",
        flapRace.clickHandler
    );

    setRaceCountdown(() => {

        if (!flapRace) {
            return;
        }

        const status =
            document.getElementById(
                "flapRaceStatus"
            );

        if (status) {

            status.textContent =
                "SPACE / CLICK TO FLAP";

        }

        flapBird();

        flapRace.animation =
            requestAnimationFrame(
                updateFlapRace
            );

    });

}


/* =========================
   COUNTDOWN
========================= */

function setRaceCountdown(callback) {

    let seconds = 3;

    const status =
        document.getElementById(
            "flapRaceStatus"
        );

    if (!status) {

        callback();

        return;

    }

    status.textContent =
        `STARTING IN ${seconds}...`;

    const timer =
        setInterval(() => {

            seconds--;

            if (seconds <= 0) {

                clearInterval(timer);

                callback();

                return;

            }

            status.textContent =
                `STARTING IN ${seconds}...`;

        }, 500);

}


/* =========================
   DISPLAY NAME
========================= */

function sanitizeDisplayName(
    displayName
) {

    return String(displayName || "")
        .replace(
            /[&<>"']/g,
            character => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            })[character]
        )
        .slice(0, 18);

}


function getDisplayedRaceName(
    displayName
) {

    const safeName =
        sanitizeDisplayName(
            displayName
        );

    return equippedTitle
        ? `${sanitizeDisplayName(
            equippedTitle
        )} ${safeName}`
        : safeName;

}


/* =========================
   FLAP
========================= */

function flapBird() {

    if (!flapRace) {
        return;
    }

    flapRace.birdVelocity =
        -410;

}


/* =========================
   PIPE
========================= */

function getFlapPipe(
    pipeIndex
) {

    const gapHeight = 142;

    const center =
        105 +
        ((pipeIndex * 83) % 210);

    return {

        x:
            510 +
            pipeIndex * 250,

        top:
            center -
            gapHeight / 2,

        bottom:
            center +
            gapHeight / 2

    };

}


/* =========================
   SEND PLAYER STATE
========================= */

async function broadcastFlapRaceState() {

    if (
        !flapRace ||
        !flapRace.online ||
        !flapRaceChannel
    ) {
        return;
    }

    const now =
        performance.now();

    if (
        now -
        flapRace.lastBroadcast <
        100
    ) {
        return;
    }

    flapRace.lastBroadcast =
        now;

    try {

        await flapRaceChannel.send({

            type:
                "broadcast",

            event:
                "player_state",

            payload: {

                id:
                    flapClientId,

                name:
                    flapRace.raceName,

                title:
                    equippedTitle || "",

                distance:
                    flapRace.distance,

                checkpoint:
                    flapRace.checkpoint,

                birdY:
                    flapRace.birdY,

                crashed:
                    Boolean(
                        flapRace.crashed
                    ),

                color:
                    flapRace.color

            }

        });

    } catch (error) {

        console.warn(
            "RACE STATE SEND FAILED:",
            error
        );

    }

}


/* =========================
   UPDATE RACE
========================= */

function updateFlapRace(
    timestamp
) {

    if (!flapRace) {
        return;
    }

    const elapsed =
        (
            timestamp -
            flapRace.startedAt
        ) / 1000;

    const delta =
        Math.min(
            (
                timestamp -
                flapRace.lastFrame
            ) / 1000,
            0.05
        );

    flapRace.lastFrame =
        timestamp;

    flapRace.distance +=
        190 * delta;

    flapRace.birdVelocity +=
        1040 * delta;

    flapRace.birdY +=
        flapRace.birdVelocity *
        delta;

    /* =========================
       OFFLINE AI
    ========================= */

    flapRace.bots.forEach(
        bot => {

            if (
                timestamp <
                bot.respawnUntil
            ) {
                return;
            }

            bot.distance +=
                190 *
                bot.speed *
                delta;

            const botPipe =
                Math.floor(
                    (
                        bot.distance +
                        115
                    ) / 250
                );

            if (
                botPipe <=
                bot.lastPipe
            ) {
                return;
            }

            if (
                botPipe > 0 &&
                Math.random() <
                0.18
            ) {

                bot.distance =
                    bot.checkpoint;

                bot.lastPipe =
                    bot.checkpointPipe;

                bot.respawnUntil =
                    timestamp +
                    650;

                return;

            }

            bot.lastPipe =
                botPipe;

            if (
                botPipe > 0 &&
                botPipe % 5 === 0
            ) {

                bot.checkpoint =
                    bot.distance;

                bot.checkpointPipe =
                    botPipe;

            }

        }
    );


    /* =========================
       PLAYER CHECKPOINT
    ========================= */

    const pipeIndex =
        Math.floor(
            (
                flapRace.distance +
                115
            ) / 250
        );

    if (
        pipeIndex >
        flapRace.lastPipe
    ) {

        flapRace.lastPipe =
            pipeIndex;

        flapRace.passedPipes =
            pipeIndex;

        if (
            pipeIndex > 0 &&
            pipeIndex % 5 === 0
        ) {

            flapRace.checkpoint =
                flapRace.distance;

            flapRace.checkpointOrder++;

        }

    }


    /* =========================
       COLLISION
    ========================= */

    const birdScreenX = 145;

    const birdHitbox = {

        left:
            birdScreenX - 16,

        right:
            birdScreenX + 16,

        top:
            flapRace.birdY - 14,

        bottom:
            flapRace.birdY + 14

    };

    const hitPipe =
        [
            pipeIndex - 1,
            pipeIndex,
            pipeIndex + 1
        ].some(index => {

            if (index < 0) {
                return false;
            }

            const pipe =
                getFlapPipe(index);

            const pipeScreenX =
                pipe.x -
                flapRace.distance;

            return (
                pipeScreenX <
                birdHitbox.right &&

                pipeScreenX +
                58 >
                birdHitbox.left &&

                (
                    birdHitbox.top <
                    pipe.top ||

                    birdHitbox.bottom >
                    pipe.bottom
                )
            );

        });


    if (
        hitPipe ||
        flapRace.birdY < 0 ||
        flapRace.birdY > 420
    ) {

        const status =
            document.getElementById(
                "flapRaceStatus"
            );

        if (status) {

            status.textContent =
                "💥 CRASHED! RETURNING TO CHECKPOINT";

        }

        flapRace.distance =
            flapRace.checkpoint;

        flapRace.birdY =
            210;

        flapRace.birdVelocity =
            0;

        flapRace.lastPipe =
            Math.floor(
                flapRace.distance /
                250
            );

        flapRace.crashed =
            true;

    } else {

        flapRace.crashed =
            false;

    }


    /* =========================
       ONLINE STATE
    ========================= */

    broadcastFlapRaceState();


    /* =========================
       DRAW
    ========================= */

    drawFlapRace();

    updateFlapScoreboard();


    const timer =
        document.getElementById(
            "raceTimer"
        );

    if (timer) {

        timer.textContent =
            Math.max(
                0,
                flapRace.timeLimit -
                elapsed
            ).toFixed(1);

    }


    /* =========================
       END
    ========================= */

    if (
        elapsed >=
        flapRace.timeLimit
    ) {

        finishFlapRace();

        return;

    }

    flapRace.animation =
        requestAnimationFrame(
            updateFlapRace
        );

}


/* =========================
   DRAW
========================= */

function drawFlapRace() {

    const {
        context,
        canvas
    } = flapRace;

    const gradient =
        context.createLinearGradient(
            0,
            0,
            0,
            canvas.height
        );

    gradient.addColorStop(
        0,
        "#82d8ff"
    );

    gradient.addColorStop(
        1,
        "#e8f9ff"
    );

    context.fillStyle =
        gradient;

    context.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* CLOUDS */

    context.fillStyle =
        "rgba(255,255,255,0.72)";

    for (
        let cloud = 0;
        cloud < 7;
        cloud++
    ) {

        const cloudX =
            (
                cloud * 170 -
                flapRace.distance *
                0.15
            ) % 1040;

        context.beginPath();

        context.arc(
            cloudX,
            55 +
                (cloud % 3) *
                40,
            28,
            0,
            Math.PI * 2
        );

        context.arc(
            cloudX + 30,
            55 +
                (cloud % 3) *
                40,
            22,
            0,
            Math.PI * 2
        );

        context.fill();

    }


    /* PIPES */

    const firstPipe =
        Math.floor(
            flapRace.distance /
            250
        ) - 1;

    for (
        let index = firstPipe;
        index < firstPipe + 6;
        index++
    ) {

        if (index < 0) {
            continue;
        }

        const pipe =
            getFlapPipe(index);

        const x =
            pipe.x -
            flapRace.distance;

        context.fillStyle =
            index % 5 === 0
                ? "#2eae5c"
                : "#3fbd69";

        context.fillRect(
            x,
            0,
            58,
            pipe.top
        );

        context.fillRect(
            x,
            pipe.bottom,
            58,
            420 -
            pipe.bottom
        );

        context.fillStyle =
            "#218849";

        context.fillRect(
            x - 6,
            pipe.top - 12,
            70,
            12
        );

        context.fillRect(
            x - 6,
            pipe.bottom,
            70,
            12
        );

    }


    /* REMOTE PLAYERS */

    if (flapRace.online) {

        Object.values(
            flapRace.remoteRacers
        ).forEach(
            racer => {

                if (
                    performance.now() -
                    racer.lastSeen >
                    2500
                ) {
                    return;
                }

                const racerScreenX =
                    145 +
                    racer.distance -
                    flapRace.distance;

                const racerY =
                    racer.birdY;

                if (
                    racerScreenX <
                    -40 ||
                    racerScreenX >
                    canvas.width + 40
                ) {
                    return;
                }

                context.fillStyle =
                    racer.color;

                context.beginPath();

                context.arc(
                    racerScreenX,
                    racerY,
                    13,
                    0,
                    Math.PI * 2
                );

                context.fill();

                context.fillStyle =
                    "#ffffff";

                context.font =
                    "bold 11px Arial";

                context.fillText(
                    racer.name,
                    racerScreenX - 18,
                    racerY - 20
                );

                if (racer.title) {

                    context.fillStyle =
                        "#2d2140";

                    context.font =
                        "10px Arial";

                    context.fillText(
                        racer.title,
                        racerScreenX - 18,
                        racerY + 26
                    );

                }

            }
        );

    }


    /* OFFLINE AI */

    flapRace.bots.forEach(
        bot => {

            const botScreenX =
                145 +
                bot.distance -
                flapRace.distance;

            const botY =
                210 +
                Math.sin(
                    bot.distance /
                    75
                ) *
                55;

            if (
                botScreenX <
                -30 ||
                botScreenX >
                canvas.width + 30
            ) {

                return;

            }

            if (
                bot.respawnUntil >
                performance.now()
            ) {

                context.fillStyle =
                    "#ffffff";

                context.font =
                    "bold 11px Arial";

                context.fillText(
                    `${bot.name} CRASHED`,
                    botScreenX - 28,
                    botY - 20
                );

                return;

            }

            context.fillStyle =
                bot.color;

            context.beginPath();

            context.arc(
                botScreenX,
                botY,
                13,
                0,
                Math.PI * 2
            );

            context.fill();

            context.fillStyle =
                "#ffffff";

            context.font =
                "bold 11px Arial";

            context.fillText(
                bot.name,
                botScreenX - 14,
                botY - 20
            );

        }
    );


    /* LOCAL PLAYER */

    context.fillStyle =
        "#f0c33d";

    context.beginPath();

    context.arc(
        145,
        flapRace.birdY,
        16,
        0,
        Math.PI * 2
    );

    context.fill();

    context.fillStyle =
        "#2d2140";

    context.beginPath();

    context.arc(
        151,
        flapRace.birdY - 4,
        3,
        0,
        Math.PI * 2
    );

    context.fill();


    /* GROUND */

    context.fillStyle =
        "#4c9b60";

    context.fillRect(
        0,
        395,
        900,
        25
    );

    context.fillStyle =
        "#ffffff";

    context.font =
        "bold 14px Arial";

    context.fillText(
        `CHECKPOINT ${
            Math.floor(
                flapRace.checkpoint /
                250
            )
        }`,
        18,
        385
    );

}


/* =========================
   SCOREBOARD
========================= */

function updateFlapScoreboard() {

    if (!flapRace) {
        return;
    }

    const racers = [

        {
            id:
                flapClientId,

            name:
                flapRace.raceName,

            distance:
                flapRace.distance,

            order:
                0
        },

        ...Object.values(
            flapRace.remoteRacers
        ).map(
            (racer, index) => ({

                id:
                    racer.id,

                name:
                    racer.title
                        ? `${racer.title} ${racer.name}`
                        : racer.name,

                distance:
                    racer.distance,

                order:
                    index + 1

            })
        ),

        ...flapRace.bots.map(
            (bot, index) => ({

                id:
                    `bot-${index}`,

                name:
                    bot.name,

                distance:
                    bot.distance,

                order:
                    index + 100

            })
        )

    ].sort(
        (first, second) =>
            second.distance -
            first.distance ||
            first.order -
            second.order
    );


    document.getElementById(
        "raceScoreboard"
    ).innerHTML = racers.map(
        (racer, index) => `

            <div
                class="race-racer ${
                    racer.id === flapClientId
                        ? "player-racer"
                        : ""
                }"
            >

                <strong>
                    ${index + 1}.
                    ${racer.name}
                </strong>

                <span>
                    Pipe ${
                        Math.floor(
                            racer.distance /
                            250
                        )
                    }
                </span>

            </div>

        `
    ).join("");

}


/* =========================
   FINISH
========================= */

async function finishFlapRace() {

    if (!flapRace) {
        return;
    }

    const finishedRace =
        flapRace;

    if (
        finishedRace.online &&
        !finishedRace.isHost
    ) {

        stopFlapRace();

        const mainContent =
            document.getElementById(
                "mainContent"
            );

        mainContent.innerHTML = `
            <h1>🏁 RACE COMPLETE</h1>

            <div class="info-card race-results">

                <h2>WAITING FOR HOST</h2>

                <p>
                    Final results are being calculated...
                </p>

            </div>
        `;

        return;

    }


    stopFlapRace();


    const racers = [

        {
            id:
                flapClientId,

            name:
                finishedRace.raceName,

            distance:
                finishedRace.distance,

            order:
                0

        },

        ...Object.values(
            finishedRace.remoteRacers
        ).map(
            (racer, index) => ({

                id:
                    racer.id,

                name:
                    racer.title
                        ? `${racer.title} ${racer.name}`
                        : racer.name,

                distance:
                    racer.distance,

                order:
                    index + 1

            })
        ),

        ...finishedRace.bots.map(
            (bot, index) => ({

                id:
                    `bot-${index}`,

                name:
                    bot.name,

                distance:
                    bot.distance,

                order:
                    index + 100

            })
        )

    ].sort(
        (first, second) =>
            second.distance -
            first.distance ||
            first.order -
            second.order
    );


    const rewards = [
        300,
        200,
        125,
        75
    ];


    const results =
        racers.map(
            (racer, index) => ({

                id:
                    racer.id,

                name:
                    racer.name,

                distance:
                    racer.distance,

                place:
                    index + 1,

                reward:
                    rewards[index] || 0

            })
        );


    if (
        finishedRace.online &&
        finishedRace.isHost &&
        flapRaceChannel
    ) {

        try {

            await flapRaceChannel.send({

                type:
                    "broadcast",

                event:
                    "race_end",

                payload: {

                    results

                }

            });

        } catch (error) {

            console.error(
                "RACE END SEND FAILED:",
                error
            );

        }

    }


    const playerResult =
        results.find(
            result =>
                result.id ===
                flapClientId
        );


    const raceReward =
        playerResult?.reward ||
        0;

    coins +=
        raceReward;

    updateCoins();


    showRaceResults(
        results,
        raceReward
    );

}


/* =========================
   REMOTE RESULTS
========================= */

function showMultiplayerRaceResults(
    payload
) {

    if (!flapRace) {
        return;
    }

    const results =
        payload?.results;

    if (!Array.isArray(results)) {
        return;
    }

    const raceReward =
        results.find(
            result =>
                result.id ===
                flapClientId
        )?.reward || 0;

    stopFlapRace();

    coins +=
        raceReward;

    updateCoins();

    showRaceResults(
        results,
        raceReward
    );

}


/* =========================
   RESULTS UI
========================= */

function showRaceResults(
    results,
    raceReward
) {

    const rows =
        results.map(
            result => `

                <div
                    class="race-result-row"
                >

                    <strong>
                        ${result.place}.
                        ${result.name}
                    </strong>

                    <span>
                        Pipe ${
                            Math.floor(
                                result.distance /
                                250
                            )
                        }

                        ${
                            result.reward > 0
                                ? ` | +${result.reward} coins`
                                : ""
                        }
                    </span>

                </div>

            `
        ).join("");


    const playerPlace =
        results.find(
            result =>
                result.id ===
                flapClientId
        )?.place || 0;


    const mainContent =
        document.getElementById(
            "mainContent"
        );


    mainContent.innerHTML = `

        <h1>
            🏁 RACE COMPLETE
        </h1>

        <div
            class="info-card race-results"
        >

            <h2>
                FINAL DISTANCES
            </h2>

            ${rows}

            <p class="race-reward">
                You placed ${
                    playerPlace
                } and earned
                ${raceReward} coins.
            </p>

            <button
                class="buy-button"
                onclick="showPlay()"
                type="button"
            >
                RACE AGAIN
            </button>

        </div>

    `;

}


/* =========================
   STOP RACE
========================= */

function stopFlapRace() {

    if (!flapRace) {
        return;
    }

    if (
        flapRace.animation !== null
    ) {

        cancelAnimationFrame(
            flapRace.animation
        );

    }

    document.removeEventListener(
        "keydown",
        flapRace.keyHandler
    );


    if (flapRace.canvas) {

        flapRace.canvas.removeEventListener(
            "click",
            flapRace.clickHandler
        );

    }


    flapRace = null;

}


/* =========================
   OFFLINE / ONLINE CHANGE
========================= */

window.addEventListener(
    "offline",
    () => {

        if (!flapRace) {
            return;
        }

        const status =
            document.getElementById(
                "flapRaceStatus"
            );

        if (status) {

            status.textContent =
                "📴 Connection lost — continuing locally.";

        }

    }
);


window.addEventListener(
    "online",
    () => {

        if (!flapRace) {
            return;
        }

        const status =
            document.getElementById(
                "flapRaceStatus"
            );

        if (status) {

            status.textContent =
                "🌐 Connection restored.";

        }

    }
);

/* =====================================================
   UPDATES
===================================================== */

function showUpdates() {

    const mainContent =
        document.getElementById("mainContent");

    mainContent.innerHTML = `

        <h1>UPDATES</h1>

        <p class="updates-intro">
            See what has been added to Blocket in each version.
        </p>

<article class="update-card latest-update">
    <div class="update-heading">
        <h2>VERSION 2.0</h2>
        <span>Latest</span>
    </div>
    <p>Multiplayer update</p>
    <ul>
        <li>Added real multiplayer Flap Race rooms with room codes</li>
        <li>Players can join races and see other players racing in real time</li>
        <li>Improved multiplayer race syncing and player connections</li>
    </ul>
</article>

        <article class="update-card latest-update">
    <div class="update-heading">
        <h2>VERSION 1.9</h2>
    </div>
    <p>New Insect Box and insect collection</p>
    <ul>
        <li>Added the new Insect Box</li>
        <li>Added 7 new insect blocks, including Queen Bee as a Chroma</li>
        <li>Added new insect-themed designs and effects</li>
    </ul>
</article>

            <article class="update-card latest-update">
                <div class="update-heading">
                    <h2>VERSION 1.8</h2>
                </div>
                <p>Collection organization and discovery</p>
                <ul>
                    <li>Collection blocks are organized by the box they came from</li>
                    <li>Added block name search and rarity filtering</li>
                    <li>Improved collection discovery and organization</li>
                </ul>
            </article>

            <article class="update-card">
                <div class="update-heading">
                    <h2>VERSION 1.7</h2>
                </div>
                <p>Titles and player identity</p>
                <ul>
                    <li>Added Title Box with Rookie, Explorer, Collector, Pro, Expert, Master, and Legend</li>
                    <li>Added a dedicated Titles tab with title collection and equip controls</li>
                    <li>Equipped titles now display beside player names in Flap Race</li>
                    <li>Titles are saved separately from blocks and backgrounds</li>
                </ul>
            </article>

            <article class="update-card">
                <div class="update-heading">
                    <h2>VERSION 1.6</h2>
                </div>
                <p>Content, customization, and sharing</p>
                <ul>
                    <li>Added School, Pet, Ore, Bird, Superhero, and Alien boxes</li>
                    <li>Added Background Box with equipable Forest, Ocean, Night, Volcano, Storm, Fire, and Rainbow themes</li>
                    <li>Added background collection storage and a dedicated Backgrounds tab</li>
                    <li>Added Flap Race room codes, shareable GitHub links, display names, AI crashes, and race coin rewards</li>
                    <li>Fixed GitHub Pages script loading and added safe offline account fallback</li>
                </ul>
            </article>

            <article class="update-card">
                <div class="update-heading">
                    <h2>VERSION 1.5</h2>
                </div>
                <p>Multiplayer race improvements</p>
                <ul>
                    <li>Room codes for hosting and joining races</li>
                    <li>Custom display names in leaderboards</li>
                    <li>AI birds that can crash and respawn</li>
                    <li>Placement-based coin rewards</li>
                </ul>
            </article>

            <article class="update-card">
                <div class="update-heading">
                    <h2>VERSION 1.4</h2>
                </div>
                <p>Flap Race added</p>
                <ul>
                    <li>Playable obstacle-course racing game</li>
                    <li>Flap controls with Space, click, and button input</li>
                    <li>Checkpoints, pipe collisions, and timed races</li>
                    <li>Live standings and final race results</li>
                </ul>
            </article>

            <article class="update-card">
                <div class="update-heading">
                    <h2>VERSION 1.3</h2>
                </div>
                <p>Collection and pack information</p>
                <ul>
                    <li>Undiscovered blocks now appear as ???</li>
                    <li>Rarity filters and pack sources</li>
                    <li>Pack contents, costs, opens, and luckiest pulls</li>
                    <li>New block labels and collection counts</li>
                </ul>
            </article>

            <article class="update-card">
                <div class="update-heading">
                    <h2>VERSION 1.2</h2>
                </div>
                <p>More ways to play</p>
                <ul>
                    <li>Host, Play, and Updates tabs</li>
                    <li>Daily Spin status in Stats</li>
                    <li>Coin balance shown in Market</li>
                    <li>Persistent light and dark mode</li>
                </ul>
            </article>

            <article class="update-card">
                <div class="update-heading">
                    <h2>VERSION 1.1</h2>
                </div>
                <p>New themed boxes</p>
                <ul>
                    <li>Ocean, food, sports, pirate, and dinosaur boxes</li>
                    <li>Science, superhero, alien, and bird boxes</li>
                    <li>New Legendary and Chroma rewards</li>
                </ul>
            </article>

            <article class="update-card">
                <div class="update-heading">
                    <h2>VERSION 1.0</h2>
                </div>
                <p>Blocket launch</p>
                <ul>
                    <li>Color and Robot boxes</li>
                    <li>Collection, Library, Market, and Stats</li>
                    <li>Pack opening animations and selling</li>
                    <li>Daily Spin and account system</li>
                </ul>
            </article>

        </div>

    `;

}


/* =====================================================
   RANDOM BLOCK
===================================================== */

function getRandomBlock(boxType) {

    const box = boxes[boxType];
    const rewards = getBoxRewards(box);

    const now = new Date();

    if (
        boxType === "ore" &&
        now.getHours() === 11 &&
        now.getMinutes() === 11 &&
        Math.random() < 0.5
    ) {
        return hiddenBlocks.find(block =>
            block.name === "Eternal"
        );
    }

    const roll = Math.random() * 100;

    if (boxType === "color") {

        if (roll < 1) {
            return getBlockByRarity(rewards, "Chroma");
        }

        if (roll < 5) {
            return getBlockByRarity(rewards, "Legendary");
        }

        if (roll < 15) {
            return getBlockByRarity(rewards, "Epic");
        }

        if (roll < 35) {
            return getBlockByRarity(rewards, "Rare");
        }

        if (roll < 60) {
            return getBlockByRarity(rewards, "Uncommon");
        }

        return getBlockByRarity(rewards, "Common");

    }


    if (
        boxType === "robot" ||
        boxType === "science" ||
        boxType === "school" ||
        boxType === "ore"
    ) {

        if (roll < 2) {
            return getBlockByRarity(box.blocks, "Legendary");
        }

        if (roll < 10) {
            return getBlockByRarity(box.blocks, "Epic");
        }

        if (roll < 25) {
            return getBlockByRarity(box.blocks, "Rare");
        }

        if (roll < 50) {
            return getBlockByRarity(box.blocks, "Uncommon");
        }

        return getBlockByRarity(box.blocks, "Common");

    }


    if (boxType === "ocean") {

        if (roll < 1) {
            return getBlockByRarity(box.blocks, "Chroma");
        }

        if (roll < 5) {
            return getBlockByRarity(box.blocks, "Legendary");
        }

        if (roll < 15) {
            return getBlockByRarity(box.blocks, "Epic");
        }

        if (roll < 35) {
            return getBlockByRarity(box.blocks, "Rare");
        }

        if (roll < 60) {
            return getBlockByRarity(box.blocks, "Uncommon");
        }

        return getBlockByRarity(box.blocks, "Common");

    }


    if (
        boxType === "breakfast" ||
        boxType === "lunch" ||
        boxType === "supper" ||
        boxType === "sports" ||
        boxType === "pirate" ||
        boxType === "dinosaur" ||
        boxType === "superhero" ||
        boxType === "alien" ||
        boxType === "bird" ||
        boxType === "pet" ||
        boxType === "space" ||
        boxType === "insect"
    ) {

        if (roll < 1) {
            return getBlockByRarity(box.blocks, "Chroma");
        }

        if (roll < 5) {
            return getBlockByRarity(box.blocks, "Legendary");
        }

        if (roll < 15) {
            return getBlockByRarity(box.blocks, "Epic");
        }

        if (roll < 35) {
            return getBlockByRarity(box.blocks, "Rare");
        }

        if (roll < 60) {
            return getBlockByRarity(box.blocks, "Uncommon");
        }

        return getBlockByRarity(box.blocks, "Common");

    }


    if (
        boxType === "background" ||
        boxType === "title"
    ) {

        if (roll < 1) {
            return getBlockByRarity(rewards, "Chroma");
        }

        if (roll < 5) {
            return getBlockByRarity(rewards, "Legendary");
        }

        if (roll < 15) {
            return getBlockByRarity(rewards, "Epic");
        }

        if (roll < 35) {
            return getBlockByRarity(rewards, "Rare");
        }

        if (roll < 60) {
            return getBlockByRarity(rewards, "Uncommon");
        }

        return getBlockByRarity(rewards, "Common");

    }

}


function getBlockByRarity(blocks, rarity) {

    const possibleBlocks =
        blocks.filter(block =>
            block.rarity === rarity
        );

    return possibleBlocks[
        Math.floor(
            Math.random() *
            possibleBlocks.length
        )
    ];

}


/* =====================================================
   BUY BOX
===================================================== */

function buyBox(boxType) {

    const box = boxes[boxType];

    if (coins < box.price) {

        alert(
            "You don't have enough coins!"
        );

        return;

    }

    coins -= box.price;

    boxesOpened++;

    if (!packStats[boxType]) {
        packStats[boxType] = {
            opens: 0,
            luckiestPull: null
        };
    }

    packStats[boxType].opens++;

    saveGame();

    updateCoins();

    startBoxOpening(boxType);

}


/* =====================================================
   BOX OPENING
===================================================== */

function startBoxOpening(boxType) {

    const box = boxes[boxType];
    const rewards = getBoxRewards(box);

    currentBoxType = boxType;

    const overlay =
        document.createElement("div");

    overlay.className = "pack-overlay";

    overlay.innerHTML = `

        <div class="pack-opening">

            <div class="opening-box-name">
                ${box.name}
            </div>

            <div
                class="rolling-text"
                id="rollingText"
            >
                ${rewards[0].name}
            </div>

            <div class="opening-text">
                OPENING ${box.name}...
            </div>

            <button
                class="skip-button"
                onclick="skipPackOpening()"
            >
                SKIP
            </button>

        </div>

    `;

    document.body.appendChild(overlay);

    const rollingText =
        document.getElementById("rollingText");

    currentRolling =
        getRandomBlock(boxType);

    setRollingRarity(
        overlay,
        currentRolling
    );

    let rollCount = 0;

    rollingInterval =
        setInterval(() => {

            const randomBlock =
                rewards[
                    Math.floor(
                        Math.random() *
                        rewards.length
                    )
                ];

            rollingText.textContent =
                randomBlock.name;

            setRollingRarity(
                overlay,
                randomBlock
            );

            rollCount++;

            if (rollCount >= 25) {

                clearInterval(rollingInterval);

                rollingInterval = null;

                rollingText.textContent =
                    currentRolling.name;

                setRollingRarity(
                    overlay,
                    currentRolling
                );

                setTimeout(
                    finishPackOpening,
                    350
                );

            }

        }, 100);

}


function setRollingRarity(overlay, block) {

    const rarity =
        block.rarity.toLowerCase();

    overlay.className =
        `pack-overlay rolling-${rarity}`;

    const rarityColors = {
        common: "rgba(91, 91, 91, 0.82)",
        uncommon: "rgba(35, 151, 62, 0.82)",
        rare: "rgba(38, 111, 190, 0.82)",
        epic: "rgba(111, 54, 180, 0.82)",
        legendary: "rgba(207, 157, 0, 0.84)"
    };

    overlay.style.animation =
        rarity === "chroma"
            ? "rollingRainbow 2s linear infinite"
            : "none";

    overlay.style.background =
        rarity === "chroma"
            ? `linear-gradient(
                120deg,
                rgba(235, 72, 72, 0.86),
                rgba(244, 183, 55, 0.86),
                rgba(57, 181, 91, 0.86),
                rgba(53, 157, 222, 0.86),
                rgba(144, 82, 205, 0.86)
            )`
            : rarityColors[rarity];

    overlay.style.backgroundSize =
        rarity === "chroma" ? "300% 300%" : "auto";

}


/* =====================================================
   SKIP OPENING
===================================================== */

function skipPackOpening() {

    if (!currentRolling) {
        return;
    }

    if (rollingInterval) {

        clearInterval(rollingInterval);

        rollingInterval = null;

    }

    const overlay =
        document.querySelector(".pack-overlay");

    const rollingText =
        document.getElementById("rollingText");

    if (!overlay || !rollingText) {

        finishPackOpening();

        return;

    }

    rollingText.textContent =
        currentRolling.name;

    setRollingRarity(
        overlay,
        currentRolling
    );

    setTimeout(
        finishPackOpening,
        350
    );

}


function finishPackOpening() {

    if (rollingInterval) {

        clearInterval(rollingInterval);

        rollingInterval = null;

    }

    if (!currentRolling) {
        return;
    }

    const wonBlock =
        currentRolling;

    const isBackground =
        boxes[currentBoxType].isBackground;

    const isTitle =
        boxes[currentBoxType].isTitle;

    const isNew =
        isBackground
            ? !backgroundCollection[wonBlock.name]
            : isTitle
                ? !titleCollection[wonBlock.name]
                : !collection[wonBlock.name];

    currentRolling = null;

    const stats =
        getPackStats(currentBoxType);

    if (
        !stats.luckiestPull ||
        getRarityRank(wonBlock.rarity) >
            getRarityRank(stats.luckiestPull.rarity)
    ) {
        stats.luckiestPull = {
            name: wonBlock.name,
            rarity: wonBlock.rarity
        };
    }

    packStats[currentBoxType] = stats;
    currentBoxType = null;

    if (isBackground) {
        addToBackgroundCollection(wonBlock);
    } else if (isTitle) {
        addToTitleCollection(wonBlock);
    } else {
        addToCollection(wonBlock);
    }

    revealBlock(wonBlock, isNew);

}


function addToBackgroundCollection(background) {

    if (backgroundCollection[background.name]) {
        backgroundCollection[background.name].amount++;
    } else {
        backgroundCollection[background.name] = {
            name: background.name,
            rarity: background.rarity,
            amount: 1
        };
    }

    saveGame();

}


function addToTitleCollection(title) {

    if (titleCollection[title.name]) {
        titleCollection[title.name].amount++;
    } else {
        titleCollection[title.name] = {
            name: title.name,
            rarity: title.rarity,
            amount: 1
        };
    }

    saveGame();

}


/* =====================================================
   ADD TO COLLECTION
===================================================== */

function addToCollection(block) {

    if (collection[block.name]) {

        collection[block.name].amount++;

    } else {

        collection[block.name] = {

            name: block.name,
            rarity: block.rarity,
            amount: 1

        };

    }

    saveGame();

}


/* =====================================================
   SELL
===================================================== */

function sellBlock(blockName) {

    if (!blockName) {
        return;
    }

    const block = collection[blockName];

    if (!block) {
        console.warn("SELL FAILED: Block not found:", blockName);
        return;
    }

    const sellValue =
        Number(sellValues[block.rarity]) || 0;

    if (sellValue <= 0) {
        console.warn(
            "SELL FAILED: No sell value for rarity:",
            block.rarity
        );
        return;
    }

    if (block.amount <= 0) {
        return;
    }

    // Remove one copy
    block.amount -= 1;

    // Give coins
    coins += sellValue;

    // If that was the last copy, remove the block
    if (block.amount <= 0) {

        if (equippedBlock === blockName) {
            equippedBlock = "Block";
        }

        delete collection[blockName];
    }

    // Save everything
    saveGame();

    // Update coin display
    updateCoins();

    // Refresh equipped display
    updateEquipped();

    // Refresh collection
    showCollection();

}


/* =====================================================
   DAILY SPIN
===================================================== */

function dailySpin() {

    if (!canDailySpin()) {
        return;
    }

    const overlay =
        document.createElement("div");

    overlay.className = "spin-overlay";

    overlay.innerHTML = `

        <div class="spin-window">

            <h1>
                🎡 DAILY SPIN
            </h1>

            <div
                class="wheel"
                id="dailyWheel"
            >

                <div class="wheel-pointer">
                    ▼
                </div>

            </div>

            <div
                class="spin-result"
                id="spinResult"
            >
                SPINNING...
            </div>

        </div>

    `;

    document.body.appendChild(overlay);

    const wheel =
        document.getElementById("dailyWheel");

    const rewards = [
        500,
        750,
        1000,
        1250,
        1500,
        1750,
        2000
    ];

    const winningReward =
        rewards[
            Math.floor(
                Math.random() *
                rewards.length
            )
        ];

    const rotations =
        5 +
        Math.floor(
            Math.random() * 3
        );

    wheel.style.transform =
        `rotate(${
            rotations * 360 +
            Math.random() * 360
        }deg)`;

    setTimeout(() => {

        coins += winningReward;

        lastDailySpin =
            getToday();

        saveGame();

        updateCoins();

        document.getElementById(
            "spinResult"
        ).innerHTML = `

            🎉 YOU WON

            <strong>
                ${winningReward} 🪙
            </strong>

        `;

        const closeButton =
            document.createElement("button");

        closeButton.className =
            "close-spin";

        closeButton.textContent =
            "CONTINUE";

        closeButton.onclick = () => {

            overlay.remove();

            showMarket();

        };

        document.querySelector(
            ".spin-window"
        ).appendChild(closeButton);

    }, 3000);

}


/* =====================================================
   REVEAL BLOCK
===================================================== */

function revealBlock(block, isNew) {

    const overlay =
        document.querySelector(".pack-overlay");

    if (!overlay) return;

    overlay.innerHTML = `

            <div
                class="pack-reveal ${block.rarity.toLowerCase()}"
            >

            <div class="you-got">
                YOU GOT!
            </div>

            ${
                isNew
                ? '<div class="new-block">NEW</div>'
                : ''
            }

            <div class="revealed-block">
                ${block.name}
            </div>

            <div
                class="rarity ${block.rarity.toLowerCase()}"
            >
                ${block.rarity}
            </div>

            <button
                class="close-pack"
                onclick="closePack()"
            >
                CONTINUE
            </button>

        </div>

    `;

}


/* =====================================================
   CLOSE BOX
===================================================== */

function closePack() {

    const overlay =
        document.querySelector(".pack-overlay");

    if (overlay) {
        overlay.remove();
    }

}


/* =====================================================
   ACCOUNT POPUP
===================================================== */

function openAccount() {

    const overlay =
        document.getElementById("accountOverlay");

    if (!overlay) return;

    overlay.style.display = "flex";

    checkCurrentUser();

}


function closeAccount() {

    const overlay =
        document.getElementById("accountOverlay");

    if (!overlay) return;

    overlay.style.display = "none";

}


/* =====================================================
   LOGIN SCREEN
===================================================== */

function showLogin() {

    const content =
        document.getElementById("accountContent");

    content.innerHTML = `

        <h2>LOG IN</h2>

        <input
            id="loginEmail"
            class="account-input"
            type="email"
            placeholder="Email"
        >

        <input
            id="loginPassword"
            class="account-input"
            type="password"
            placeholder="Password"
        >

        <button
            class="account-main-button"
            onclick="login()"
        >
            LOG IN
        </button>

        <p id="loginMessage"></p>

        <p>
            Don't have an account?
        </p>

        <button
            class="account-link-button"
            onclick="showSignup()"
        >
            SIGN UP
        </button>

    `;
}


/* =====================================================
   SIGNUP SCREEN
===================================================== */

function showSignup() {

    const content =
        document.getElementById("accountContent");

    if (!content) return;

    content.innerHTML = `

        <h2>CREATE ACCOUNT</h2>

        <input
            id="signupEmail"
            class="account-input"
            type="email"
            placeholder="Email"
        >

        <input
            id="signupUsername"
            class="account-input"
            type="text"
            placeholder="Username"
        >

        <input
            id="signupPassword"
            class="account-input"
            type="password"
            placeholder="Password"
        >

        <button
            class="account-main-button"
            onclick="signup()"
        >
            CREATE ACCOUNT
        </button>

        <p id="signupMessage"></p>

        <p>
            Already have an account?
        </p>

        <button
            class="account-link-button"
            onclick="showLogin()"
        >
            LOG IN
        </button>

    `;

}


/* =====================================================
   SIGN UP
===================================================== */

async function signup() {

    const emailInput =
        document.getElementById("signupEmail");

    const usernameInput =
        document.getElementById("signupUsername");

    const passwordInput =
        document.getElementById("signupPassword");

    const message =
        document.getElementById("signupMessage");


    if (
        !emailInput ||
        !usernameInput ||
        !passwordInput ||
        !message
    ) {

        console.error(
            "SIGNUP ERROR: Signup inputs were not found."
        );

        return;

    }


    const email =
        emailInput.value.trim();

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    if (!email || !username || !password) {

        message.textContent =
            "Please fill in everything!";

        return;

    }


    if (username.length < 3) {

        message.textContent =
            "Username must be at least 3 characters.";

        return;

    }


    if (password.length < 6) {

        message.textContent =
            "Password must be at least 6 characters.";

        return;

    }


    message.textContent =
        "Creating account...";


    try {

const { data, error } =
    await supabaseClient.auth.signUp({

        email: email,

        password: password,

        options: {

            data: {
                username: username
            }

        }

    });


        if (error) {

            console.error(
                "SIGNUP ERROR:",
                error
            );

            message.textContent =
                error.message;

            return;

        }


        console.log(
            "ACCOUNT CREATED:",
            data
        );


        if (
            data.user &&
            data.session
        ) {

            message.textContent =
                "🎉 Account created and logged in!";

            setTimeout(() => {

                showAccountLoggedIn(
                    data.user
                );

            }, 800);

        } else {

            message.textContent =
                "🎉 Account created! Check your email to confirm your account.";

        }

    } catch (error) {

        console.error(
            "SIGNUP ERROR:",
            error
        );

        message.textContent =
            "Something went wrong. Check the Console.";

    }

}


/* =====================================================
   LOGIN
===================================================== */

async function login() {

    const emailInput =
        document.getElementById("loginEmail");

    const passwordInput =
        document.getElementById("loginPassword");

    const message =
        document.getElementById("loginMessage");

    if (!emailInput || !passwordInput) {
        console.error("LOGIN ERROR: Login inputs were not found.");
        return;
    }

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    if (!email || !password) {

        message.textContent =
            "Please enter your email and password!";

        return;
    }

    message.textContent =
        "Logging in...";

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email: email,
            password: password

        });

    if (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        message.textContent =
            error.message;

        return;
    }

    console.log(
        "LOGGED IN:",
        data
    );

    message.textContent =
        "🎉 Logged in!";

    setTimeout(() => {

        closeAccount();

    }, 1000);
}

/* =====================================================
   LOGGED-IN ACCOUNT
===================================================== */

function showAccountLoggedIn(user) {

    const content =
        document.getElementById("accountContent");

    if (!content) return;


    const username =
        user?.user_metadata?.username ||
        "Player";


    content.innerHTML = `

        <h2>WELCOME!</h2>

        <p>
            👤 ${username}
        </p>

        <p>
            ${user.email}
        </p>

        <button
            class="account-main-button"
            onclick="logout()"
        >
            LOG OUT
        </button>

    `;

}


/* =====================================================
   CHECK CURRENT USER
===================================================== */

async function checkCurrentUser() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getUser();


        if (error || !data.user) {

            return;

        }


        showAccountLoggedIn(
            data.user
        );

    } catch (error) {

        console.error(
            "ACCOUNT CHECK ERROR:",
            error
        );

    }

}


/* =====================================================
   LOGOUT
===================================================== */

async function logout() {

    const {
        error
    } =
        await supabaseClient.auth.signOut();


    if (error) {

        console.error(
            "LOGOUT ERROR:",
            error
        );

        return;

    }


    showLogin();

}


/* =====================================================
   SUPABASE AUTH LISTENER
===================================================== */

supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        console.log(
            "BLOCKET AUTH:",
            event
        );

        if (session?.user) {

            console.log(
                "CURRENT USER:",
                session.user
            );

        }

    }
);


/* =====================================================
   STARTUP
===================================================== */

updateTheme();

updateEquipped();

updateCoins();

console.log(
    "BLOCKET SUPABASE CONNECTED:",
    supabaseClient
);