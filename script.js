let coins = Number(localStorage.getItem("blocketCoins")) || 1000;

let collection = JSON.parse(
    localStorage.getItem("blocketCollection")
) || {};

let boxesOpened = Number(
    localStorage.getItem("blocketBoxesOpened")
) || Number(localStorage.getItem("blocketPacksOpened")) || 0;

let lastDailySpin =
    localStorage.getItem("blocketDailySpin") || "";

let equippedBlock =
    localStorage.getItem("blocketEquippedBlock") || "Block";

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
    }
};

const sellValues = {
    Common: 5,
    Uncommon: 10,
    Rare: 25,
    Epic: 50,
    Legendary: 100,
    Chroma: 500
};

let currentRolling = null;
let rollingInterval = null;


/* =========================
   SAVING
========================= */

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
        "blocketBoxesOpened",
        boxesOpened
    );

    localStorage.setItem(
        "blocketPacksOpened",
        boxesOpened
    );

    localStorage.setItem(
        "blocketDailySpin",
        lastDailySpin
    );

    localStorage.setItem(
        "blocketEquippedBlock",
        equippedBlock
    );
}


/* =========================
   COINS
========================= */

function updateCoins() {

    const coinAmount =
        document.getElementById("coinAmount");

    if (coinAmount) {
        coinAmount.textContent = coins;
    }

    saveGame();
}


/* =========================
   EQUIPPED BLOCK
========================= */

function updateEquipped() {

    const equipped =
        document.querySelector(".equipped");

    if (!equipped) return;

    equipped.innerHTML = `
        <div>Equipped</div>
        <div>${equippedBlock}</div>
    `;
}


function equipBlock(blockName) {

    if (!collection[blockName]) {
        return;
    }

    equippedBlock = blockName;

    localStorage.setItem(
        "blocketEquippedBlock",
        equippedBlock
    );

    updateEquipped();

    showCollection();
}


/* =========================
   DATE / DAILY SPIN
========================= */

function getToday() {

    const now = new Date();

    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}


function canDailySpin() {

    return lastDailySpin !== getToday();
}


/* =========================
   TABS
========================= */

function openTab(tab) {

    if (tab === "collection") {
        showCollection();
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
}


/* =========================
   MARKET
========================= */

function showMarket() {

    const mainContent =
        document.getElementById("mainContent");

    const dailyAvailable =
        canDailySpin();

    mainContent.innerHTML = `

        <h1>MARKET</h1>

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
}


/* =========================
   STATS
========================= */

function showStats() {

    const mainContent =
        document.getElementById("mainContent");

    let totalBlocks = 0;

    Object.values(collection).forEach(block => {
        totalBlocks += block.amount;
    });

    const uniqueBlocks =
        Object.keys(collection).length;

    const allBlocks =
        Object.values(boxes)
        .flatMap(box => box.blocks);

    let rarestBlock = "None";

    if (collection["Rainbow Block"]) {

        rarestBlock = "Rainbow Block";

    } else if (collection["Mega Titan"]) {

        rarestBlock = "Mega Titan";

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

                <h2>🧱 TOTAL BLOCKS</h2>

                <p>${totalBlocks}</p>

            </div>


            <div class="stat-card">

                <h2>📚 UNIQUE BLOCKS</h2>

                <p>
                    ${uniqueBlocks}/${allBlocks.length}
                </p>

            </div>


            <div class="stat-card">

                <h2>⭐ RAREST BLOCK</h2>

                <p>${rarestBlock}</p>

            </div>

        </div>
    `;
}


/* =========================
   LIBRARY
========================= */

function showLibrary() {

    const mainContent =
        document.getElementById("mainContent");

    const allBlocks =
        Object.values(boxes)
        .flatMap(box => box.blocks);

    let blocksHTML = "";

    allBlocks.forEach(block => {

        const sellValue =
            sellValues[block.rarity];

        blocksHTML += `

            <div class="library-block">

                <div class="library-block-name">
                    ${block.name}
                </div>

                <div
                    class="library-rarity
                    ${block.rarity.toLowerCase()}"
                >
                    ${block.rarity}
                </div>

                <div class="library-sell">
                    Sell Value: ${sellValue} 🪙
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


/* =========================
   COLLECTION
========================= */

function showCollection() {

    const mainContent =
        document.getElementById("mainContent");

    let blocksHTML = "";

    const ownedBlocks =
        Object.keys(collection);

    if (ownedBlocks.length === 0) {

        blocksHTML = `
            <p class="empty-collection">
                You haven't collected any Blocks yet!
            </p>
        `;

    } else {

        ownedBlocks.forEach(blockName => {

            const block =
                collection[blockName];

            const sellValue =
                sellValues[block.rarity];

            const isEquipped =
                equippedBlock === block.name;

            blocksHTML += `

                <div class="collection-block">

                    <div class="collection-block-name">
                        ${block.name}
                    </div>

                    <div
                        class="collection-rarity
                        ${block.rarity.toLowerCase()}"
                    >
                        ${block.rarity}
                    </div>

                    <div class="collection-count">
                        x${block.amount}
                    </div>


                    <button
                        class="equip-button"
                        onclick="equipBlock('${block.name}')"
                        ${isEquipped ? "disabled" : ""}
                    >
                        ${
                            isEquipped
                            ? "EQUIPPED"
                            : "EQUIP"
                        }
                    </button>


                    <button
                        class="sell-button"
                        onclick="sellBlock('${block.name}')"
                    >
                        SELL +${sellValue} 🪙
                    </button>

                </div>

            `;
        });
    }

    mainContent.innerHTML = `

        <h1>COLLECTION</h1>

        <div class="collection-grid">

            ${blocksHTML}

        </div>

    `;
}


/* =========================
   INFO
========================= */

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
                discover rare Blocks, and build
                your collection.
            </p>

            <h2>RARITIES</h2>

            <p>
                Common → Uncommon → Rare →
                Epic → Legendary → Chroma
            </p>

            <h2>BOXES</h2>

            <p>
                Open different Boxes to discover
                different Blocks.
            </p>

        </div>

    `;
}


/* =========================
   RANDOM BLOCK
========================= */

function getRandomBlock(boxType) {

    const box =
        boxes[boxType];

    const roll =
        Math.random() * 100;


    /* COLOR BOX */

    if (boxType === "color") {

        if (roll < 1) {

            return getBlockByRarity(
                box.blocks,
                "Chroma"
            );

        }

        if (roll < 5) {

            return getBlockByRarity(
                box.blocks,
                "Legendary"
            );

        }

        if (roll < 15) {

            return getBlockByRarity(
                box.blocks,
                "Epic"
            );

        }

        if (roll < 35) {

            return getBlockByRarity(
                box.blocks,
                "Rare"
            );

        }

        if (roll < 60) {

            return getBlockByRarity(
                box.blocks,
                "Uncommon"
            );

        }

        return getBlockByRarity(
            box.blocks,
            "Common"
        );
    }


    /* ROBOT BOX */

    if (boxType === "robot") {

        if (roll < 2) {

            return getBlockByRarity(
                box.blocks,
                "Legendary"
            );

        }

        if (roll < 10) {

            return getBlockByRarity(
                box.blocks,
                "Epic"
            );

        }

        if (roll < 25) {

            return getBlockByRarity(
                box.blocks,
                "Rare"
            );

        }

        if (roll < 50) {

            return getBlockByRarity(
                box.blocks,
                "Uncommon"
            );

        }

        return getBlockByRarity(
            box.blocks,
            "Common"
        );
    }
}


function getBlockByRarity(blocks, rarity) {

    const possibleBlocks =
        blocks.filter(
            block => block.rarity === rarity
        );

    return possibleBlocks[
        Math.floor(
            Math.random() *
            possibleBlocks.length
        )
    ];
}


/* =========================
   BUY BOX
========================= */

function buyBox(boxType) {

    const box =
        boxes[boxType];

    if (coins < box.price) {

        alert(
            "You don't have enough coins!"
        );

        return;
    }

    coins -= box.price;

    boxesOpened++;

    saveGame();

    updateCoins();

    startBoxOpening(boxType);
}


/* =========================
   BOX OPENING
========================= */

function startBoxOpening(boxType) {

    const box =
        boxes[boxType];

    const overlay =
        document.createElement("div");

    overlay.className =
        "pack-overlay";

    overlay.innerHTML = `

        <div class="pack-opening">

            <div class="opening-box-name">
                ${box.name}
            </div>

            <div
                class="rolling-text"
                id="rollingText"
            >
                ${box.blocks[0].name}
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

    document.body.appendChild(
        overlay
    );

    const rollingText =
        document.getElementById(
            "rollingText"
        );

    const rollingBlocks =
        box.blocks.map(
            block => block.name
        );

    currentRolling =
        getRandomBlock(boxType);

    let rollCount = 0;

    rollingInterval =
        setInterval(() => {

            const randomName =
                rollingBlocks[
                    Math.floor(
                        Math.random() *
                        rollingBlocks.length
                    )
                ];

            rollingText.textContent =
                randomName;

            rollCount++;

            if (rollCount >= 25) {

                finishPackOpening();

            }

        }, 100);
}


function skipPackOpening() {

    if (!currentRolling) {
        return;
    }

    finishPackOpening();
}


function finishPackOpening() {

    if (rollingInterval) {

        clearInterval(
            rollingInterval
        );

        rollingInterval = null;
    }

    if (!currentRolling) {
        return;
    }

    const wonBlock =
        currentRolling;

    currentRolling = null;

    addToCollection(
        wonBlock
    );

    revealBlock(
        wonBlock
    );
}


/* =========================
   COLLECTION ADD
========================= */

function addToCollection(block) {

    if (collection[block.name]) {

        collection[
            block.name
        ].amount++;

    } else {

        collection[
            block.name
        ] = {

            name: block.name,

            rarity: block.rarity,

            amount: 1

        };
    }

    saveGame();
}


/* =========================
   SELL
========================= */

function sellBlock(blockName) {

    const block =
        collection[blockName];

    if (!block) {
        return;
    }

    const sellValue =
        sellValues[block.rarity];

    block.amount--;

    coins += sellValue;


    if (block.amount <= 0) {

        if (equippedBlock === blockName) {

            equippedBlock = "Block";

        }

        delete collection[blockName];
    }


    saveGame();

    updateCoins();

    updateEquipped();

    showCollection();
}


/* =========================
   DAILY SPIN
========================= */

function dailySpin() {

    if (!canDailySpin()) {
        return;
    }

    const overlay =
        document.createElement("div");

    overlay.className =
        "spin-overlay";

    overlay.innerHTML = `

        <div class="spin-window">

            <h1>🎡 DAILY SPIN</h1>

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

    document.body.appendChild(
        overlay
    );

    const wheel =
        document.getElementById(
            "dailyWheel"
        );

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
        5 + Math.floor(
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
            document.createElement(
                "button"
            );

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
        ).appendChild(
            closeButton
        );

    }, 3000);
}


/* =========================
   REVEAL
========================= */

function revealBlock(block) {

    const overlay =
        document.querySelector(
            ".pack-overlay"
        );

    overlay.innerHTML = `

        <div class="pack-reveal">

            <div class="you-got">
                YOU GOT!
            </div>

            <div class="revealed-block">
                ${block.name}
            </div>

            <div
                class="rarity
                ${block.rarity.toLowerCase()}"
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


/* =========================
   CLOSE BOX
========================= */

function closePack() {

    const overlay =
        document.querySelector(
            ".pack-overlay"
        );

    if (overlay) {
        overlay.remove();
    }
}


/* =========================
   STARTUP
========================= */

updateEquipped();
updateCoins();