/* =========================================================
   BLOCKET
   COMPLETE SCRIPT
   ========================================================= */


/* =========================================================
   SUPABASE
   ========================================================= */

const SUPABASE_URL =
    "https://whakyhbtqwfvicicnttu.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_gKxzj3EC0h2FeLLST2JflA_QGBdSRdB";

let supabaseClient = null;

try {
    if (window.supabase) {
        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );
    }
} catch (error) {
    console.warn("Supabase unavailable:", error);
}


/* =========================================================
   DATA
   ========================================================= */

const rarityOrder = [
    "Common",
    "Uncommon",
    "Rare",
    "Epic",
    "Legendary",
    "Chroma",
    "Mythical",
    "OG",
    "Hidden"
];

const sellValues = {
    Common: 5,
    Uncommon: 10,
    Rare: 25,
    Epic: 50,
    Legendary: 100,
    Chroma: 500,
    Mythical: 2500,
    OG: 750,
    Hidden: 10000
};


/* =========================================================
   PACKS
   ========================================================= */

const packs = [

    /* =====================================================
       COLOR PACK
       ===================================================== */

    {
        id: "color",
        name: "Color Pack",
        price: 20,
        icon: "🎨",

        blocks: [
            {
                id: "red",
                name: "Red",
                rarity: "Common",
                chance: 30,
                image: null
            },
            {
                id: "yellow",
                name: "Yellow",
                rarity: "Common",
                chance: 25,
                image: null
            },
            {
                id: "blue",
                name: "Blue",
                rarity: "Common",
                chance: 20,
                image: null
            },
            {
                id: "purple",
                name: "Purple",
                rarity: "Uncommon",
                chance: 10,
                image: null
            },
            {
                id: "green",
                name: "Green",
                rarity: "Rare",
                chance: 7,
                image: null
            },
            {
                id: "pink",
                name: "Pink",
                rarity: "Epic",
                chance: 4,
                image: null
            },
            {
                id: "white",
                name: "White",
                rarity: "Legendary",
                chance: 2,
                image: null
            },
            {
                id: "black",
                name: "Black",
                rarity: "Chroma",
                chance: 1.99,
                image: null
            },
            {
                id: "rainbow",
                name: "Rainbow",
                rarity: "Mythical",
                chance: 0.01,
                image: null
            }
        ]
    },


    /* =====================================================
       BOT PACK
       ===================================================== */

    {
        id: "bot",
        name: "Bot Pack",
        price: 20,
        icon: "🤖",

        blocks: [
            {
                id: "rusty-bot",
                name: "Rusty Bot",
                rarity: "Common",
                chance: 35,
                image: "./Images/Rusty-bot.png"
            },
            {
                id: "lil-bot",
                name: "Lil Bot",
                rarity: "Common",
                chance: 25,
                image: "./Images/lil%20bot.png"
            },
            {
                id: "robot",
                name: "Robot",
                rarity: "Uncommon",
                chance: 18,
                image: "./Images/robot.png.png"
            },
            {
                id: "cyber-bot",
                name: "Cyber Bot",
                rarity: "Rare",
                chance: 10,
                image: "./Images/Cyber-bot.png"
            },
            {
                id: "titan",
                name: "Titan",
                rarity: "Epic",
                chance: 6,
                image: "./Images/Titan.png"
            },
            {
                id: "mega-titan",
                name: "Mega Titan",
                rarity: "Legendary",
                chance: 6,
                image: "./Images/Mega%20Titan.png"
            }
        ]
    },


    /* =====================================================
       OG PACK
       ===================================================== */

    {
        id: "og",
        name: "OG Pack",
        price: 50,
        icon: "⭐",

        blocks: [
            ["totallynotatheatrekid", "@Totallynotatheatrekid", 8],
            ["strykr-v2k", "@strykr-v2k", 7],
            ["helensmith-o3k", "@HelenSmith-o3k", 6],
            ["leviplaysandedits", "@LeviPlaysAndEdits", 5],
            ["waymore", "Waymore", 5],
            ["adrianarturosm", "@adrianarturosm", 5],
            ["thejoeycha-real", "@TheJoeyCha-real", 5],
            ["sinozilla", "sinozilla", 5],
            ["sentinel", "Sentinel", 4],
            ["math-roblox", "math roblox", 4],
            ["knuckles", "knuckles", 4],
            ["fortzgeometrydash", "@fortzgeometrydash", 4],
            ["starborn", "starborn", 4],
            ["forniteboy", "@Forniteboy", 4],
            ["nicholecohen", "@NicholeCohen", 4],
            ["ketchaaa534", "@KETCHAAA534", 3],
            ["bradleyrauch4881", "@bradleyrauch4881", 3],
            ["sfsultamategamer", "@SfsultamateGamer", 3],
            ["alemonfoxranter", "@ALemonFoxranter", 3],
            ["cloudysquash", "@cloudysquash", 2],
            ["jacollins07", "@JACollins07", 2],
            ["anabelledale", "@AnabelleDale", 2],
            ["jennifer-c5q2h", "@Jennifer-c5q2h", 2],
            ["cptbabyrabbit-n4x", "@Cptbabyrabbit-n4x", 1],
            ["fat-frog-in-space", "@Fat_frog_in_space", 1],
            ["ameesoni1", "@AmeeSoni1", 1],
            ["sheldon-cooper-explains", "@Sheldon-cooper-explains", 1],
            ["thejoeycha", "@TheJoeyCha-", 2]
        ].map(item => ({
            id: item[0],
            name: item[1],
            rarity: "OG",
            chance: item[2],
            image: null
        }))
    },


    /* =====================================================
       MEDIEVAL PACK
       ===================================================== */

    {
        id: "medieval",
        name: "Medieval Pack",
        price: 40,
        icon: "🏰",

        blocks: [
            {
                id: "witch",
                name: "Witch",
                rarity: "Common",
                chance: 10,
                image: "./Images/witch.svg"
            },
            {
                id: "wizard",
                name: "Wizard",
                rarity: "Common",
                chance: 9,
                image: "./Images/wizard.svg"
            },
            {
                id: "elf",
                name: "Elf",
                rarity: "Common",
                chance: 7,
                image: "./Images/elf.svg"
            },
            {
                id: "fairy",
                name: "Fairy",
                rarity: "Common",
                chance: 5,
                image: "./Images/fairy.svg"
            },
            {
                id: "slime-monster",
                name: "Slime Monster",
                rarity: "Common",
                chance: 4,
                image: "./Images/slimemonster.svg"
            },
            {
                id: "jester",
                name: "Jester",
                rarity: "Uncommon",
                chance: 25,
                image: "./Images/jester.svg"
            },
            {
                id: "unicorn",
                name: "Unicorn",
                rarity: "Rare",
                chance: 20,
                image: "./Images/unicorn.svg"
            },
            {
                id: "dragon",
                name: "Dragon",
                rarity: "Epic",
                chance: 19,
                image: "./Images/dragon.svg"
            },
            {
                id: "queen",
                name: "Queen",
                rarity: "Legendary",
                chance: 0.5,
                image: "./Images/queen.svg"
            },
            {
                id: "king",
                name: "King",
                rarity: "Legendary",
                chance: 0.35,
                image: "./Images/king.svg"
            },
            {
                id: "phantom-queen",
                name: "Phantom Queen",
                rarity: "Chroma",
                chance: 0.1,
                image: "./Images/static-assets-upload7275842502952922222.webp"
            },
            {
                id: "phantom-king",
                name: "Phantom King",
                rarity: "Chroma",
                chance: 0.05,
                image: "./Images/phathom%20king.webp"
            }
        ]
    },


    /* =====================================================
       🎃 SPOOKY PACK
       ===================================================== */

    {
        id: "spooky",
        name: "Spooky Pack",
        price: 50,
        icon: "🎃",

        blocks: [
            {
                id: "candy-corn",
                name: "Candy Corn",
                rarity: "Common",
                chance: 25,
                image: "./Images/candycorn.svg"
            },
            {
                id: "pumpkin",
                name: "Pumpkin",
                rarity: "Common",
                chance: 20,
                image: "./Images/pumpkin.svg"
            },
            {
                id: "caramel-apple",
                name: "Caramel Apple",
                rarity: "Common",
                chance: 15,
                image: "./Images/caramelapple2.svg"
            },
            {
                id: "crow",
                name: "Crow",
                rarity: "Common",
                chance: 10,
                image: "./Images/crow.svg"
            },
            {
                id: "zombie",
                name: "Zombie",
                rarity: "Uncommon",
                chance: 8,
                image: "./Images/zombie.svg"
            },
            {
                id: "mummy",
                name: "Mummy",
                rarity: "Uncommon",
                chance: 6,
                image: "./Images/mummy.svg"
            },
            {
                id: "vampire-bat",
                name: "Vampire Bat",
                rarity: "Rare",
                chance: 5,
                image: "./Images/vampirebat.svg"
            },
            {
                id: "frankenstein",
                name: "Frankenstein",
                rarity: "Rare",
                chance: 4,
                image: "./Images/frankenstein.svg"
            },
            {
                id: "werewolf",
                name: "Werewolf",
                rarity: "Rare",
                chance: 3,
                image: "./Images/werewolf.svg"
            },
            {
                id: "vampire",
                name: "Vampire",
                rarity: "Epic",
                chance: 1.5,
                image: "./Images/vampire.svg"
            },
            {
                id: "swamp-monster",
                name: "Swamp Monster",
                rarity: "Epic",
                chance: 1,
                image: "./Images/swampmonster.svg"
            },
            {
                id: "ghost",
                name: "Ghost",
                rarity: "Legendary",
                chance: 0.8,
                image: "./Images/ghost.svg"
            },
            {
                id: "spooky-ghost",
                name: "Spooky Ghost",
                rarity: "Chroma",
                chance: 0.5,
                image: "./Images/spookyghost.webp"
            },
            {
                id: "spooky-pumpkin",
                name: "Spooky Pumpkin",
                rarity: "Chroma",
                chance: 0.19,
                image: "./Images/spookypumpkin.webp"
            },
            {
                id: "spooky-skeleton",
                name: "Spooky Skeleton",
                rarity: "Mythical",
                chance: 0.01,
                image: "./Images/spookyskeletontin.webp"
            }
        ]
    },


];


/* =========================================================
   SEASONAL PACKS
   ========================================================= */

function isSpookySeason() {

    const now = new Date();

    const month = now.getMonth() + 1;
    const day = now.getDate();

    // 🎃 Spooky Season: September 22 - November 30
    if (month === 9 && day >= 22) return true;
    if (month === 10) return true;
    if (month === 11 && day <= 30) return true;

    return false;
}


function getAvailablePacks() {

    return packs.filter(pack => {

        if (pack.id === "spooky") {
            return isSpookySeason();
        }

        return true;

    });

}


/* =========================================================
   HIDDEN BLOCKS
   ========================================================= */

const hiddenBlocks = [

    {
        id: "time-watch",
        name: "Time Watch",
        rarity: "Hidden",
        chance: 0,
        image: "./Images/timewatch.png",
        pack: "SECRET DISCOVERY",
        searchable: true
    },

    {
        id: "golden-tater",
        name: "Golden Tater",
        rarity: "Hidden",
        chance: 0,
        image: null,
        pack: "OG PACK",
        searchable: false
    }

];


/* =========================================================
   THEMES
   ========================================================= */

const themes = [

    {
        id: "purple",
        name: "Classic Purple",

        main: "#7c3aed",
        dark: "#5b21b6",
        light: "#a78bfa",
        bg: "#f5f3ff"
    },

    {
        id: "ruby",
        name: "Ruby Red",

        main: "#dc2626",
        dark: "#991b1b",
        light: "#f87171",
        bg: "#fff5f5"
    },

    {
        id: "ocean",
        name: "Ocean Blue",

        main: "#0284c7",
        dark: "#075985",
        light: "#38bdf8",
        bg: "#f0f9ff"
    },

    {
        id: "forest",
        name: "Forest Green",

        main: "#16a34a",
        dark: "#166534",
        light: "#4ade80",
        bg: "#f0fdf4"
    },

    {
        id: "golden",
        name: "Golden",

        main: "#d97706",
        dark: "#92400e",
        light: "#fbbf24",
        bg: "#fffbeb"
    },

    {
        id: "midnight",
        name: "Midnight",

        main: "#6366f1",
        dark: "#111827",
        light: "#818cf8",
        bg: "#09090b"
    },

    {
        id: "one-red",
        name: "One Red",

        main: "#ef4444",
        dark: "#b91c1c",
        light: "#f87171",
        bg: "#fff1f2"
    },

    {
        id: "one-blue",
        name: "One Blue",

        main: "#3b82f6",
        dark: "#1d4ed8",
        light: "#60a5fa",
        bg: "#eff6ff"
    },

    {
        id: "one-green",
        name: "One Green",

        main: "#22c55e",
        dark: "#15803d",
        light: "#4ade80",
        bg: "#f0fdf4"
    },

    {
        id: "one-purple",
        name: "One Purple",

        main: "#a855f7",
        dark: "#7e22ce",
        light: "#c084fc",
        bg: "#faf5ff"
    }

];


/* =========================================================
   SOLO DATA
   ========================================================= */

const soloModes = {

    study: {
        name: "Study",
        icon: "📚",
        description:
            "Answer questions and earn Coins."
    },

    escape: {
        name: "Escape",
        icon: "🏃",
        description:
            "Dodge walls and survive quiz checkpoints."
    }

};


const questions = [

    {
        subject: "Math",
        question: "What is 7 × 8?",
        answers: ["54", "56", "64", "48"],
        correct: 1
    },

    {
        subject: "Math",
        question: "What is 100 ÷ 4?",
        answers: ["20", "25", "40", "50"],
        correct: 1
    },

    {
        subject: "Math",
        question: "What is 15 + 27?",
        answers: ["32", "42", "52", "40"],
        correct: 1
    },

    {
        subject: "Math",
        question: "What is 9²?",
        answers: ["18", "72", "81", "99"],
        correct: 2
    },

    {
        subject: "English",
        question: "Which word is a noun?",
        answers: ["Run", "Blue", "Dog", "Quickly"],
        correct: 2
    },

    {
        subject: "English",
        question: "What is the opposite of 'hot'?",
        answers: ["Warm", "Cold", "Dry", "Bright"],
        correct: 1
    },

    {
        subject: "English",
        question: "Which is spelled correctly?",
        answers: ["Because", "Becuase", "Becouse", "Beacuse"],
        correct: 0
    },

    {
        subject: "History",
        question: "Who was the first U.S. president?",
        answers: [
            "George Washington",
            "Abraham Lincoln",
            "Thomas Jefferson",
            "John Adams"
        ],
        correct: 0
    },

    {
        subject: "History",
        question: "The pyramids of Giza were built in which country?",
        answers: ["Egypt", "Greece", "Rome", "China"],
        correct: 0
    },

    {
        subject: "History",
        question: "The Roman Empire was centered around which city?",
        answers: ["Paris", "Rome", "London", "Athens"],
        correct: 1
    },

    {
        subject: "Science",
        question: "What planet do we live on?",
        answers: ["Mars", "Earth", "Venus", "Jupiter"],
        correct: 1
    },

    {
        subject: "Science",
        question: "What gas do humans breathe in?",
        answers: ["Oxygen", "Helium", "Carbon dioxide", "Hydrogen"],
        correct: 0
    },

    {
        subject: "Science",
        question: "How many legs does a spider have?",
        answers: ["6", "8", "10", "12"],
        correct: 1
    },

    {
        subject: "Fun Facts",
        question: "Which animal is known for its black-and-white stripes?",
        answers: ["Tiger", "Zebra", "Panda", "Skunk"],
        correct: 1
    },

    {
        subject: "Fun Facts",
        question: "How many days are in a leap year?",
        answers: ["364", "365", "366", "367"],
        correct: 2
    },

    {
        subject: "Fun Facts",
        question: "Which ocean is the largest?",
        answers: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correct: 3
    }

];


/* =========================================================
   STATE
   ========================================================= */

let currentUser = null;
let isGuest = false;

let currentTab = "market";

let coins = 100;

let inventory = {};

let equippedBlook = null;

let discoveredHidden = [];

let currentTheme = "purple";

let selectedSoloMode = "study";

let selectedSubject = "All Correct";

let studyQuestions = [];
let studyIndex = 0;

let escapeGame = null;


/* =========================================================
   DOM
   ========================================================= */

const $ = id => document.getElementById(id);

const startScreen = $("startScreen");
const app = $("app");
const content = $("content");

const loginStart = $("loginStart");
const guestStart = $("guestStart");

const accountModal = $("accountModal");
const accountContent = $("accountContent");
const closeAccount = $("closeAccount");

const accountButton = $("accountButton");
const themeQuick = $("themeQuick");

const coinDisplay = $("coinDisplay");

const opening = $("opening");
const openingRarity = $("openingRarity");
const openingImage = $("openingImage");
const openingName = $("openingName");
const openingPack = $("openingPack");

const notification = $("notification");


/* =========================================================
   STARTUP
   ========================================================= */

document.addEventListener("DOMContentLoaded", init);

function init() {

    loadLocalSettings();

    applyTheme(currentTheme);

    bindStartButtons();
    bindNavigation();
    bindTopButtons();
    bindAccountModal();

    updateCoins();

    renderMarket();
}


/* =========================================================
   START SCREEN
   ========================================================= */

function bindStartButtons() {

    if (loginStart) {
        loginStart.addEventListener("click", () => {
            openAccountModal();
        });
    }

    if (guestStart) {
        guestStart.addEventListener("click", () => {
            startAsGuest();
        });
    }
}


function startAsGuest() {

    isGuest = true;
    currentUser = null;

    coins = 100;
    inventory = {};
    equippedBlook = null;
    discoveredHidden = [];

    enterApp();

    notify(
        "Playing as guest — progress will not be saved."
    );
}


function enterApp() {

    if (startScreen) {
        startScreen.classList.add("hidden");
    }

    if (app) {
        app.classList.remove("hidden");
    }

    currentTab = "market";

    updateNavigation();

    renderCurrentTab();

    updateCoins();
}


/* =========================================================
   NAVIGATION
   ========================================================= */

function bindNavigation() {

    document
        .querySelectorAll(".nav-button")
        .forEach(button => {

            button.addEventListener("click", () => {

                const tab =
                    button.dataset.tab;

                if (!tab) return;

                currentTab = tab;

                updateNavigation();

                renderCurrentTab();
            });

        });

}


function updateNavigation() {

    document
        .querySelectorAll(".nav-button")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.tab === currentTab
            );

        });

}


function renderCurrentTab() {

    stopEscape(false);

    if (currentTab === "market") {
        renderMarket();
    }

    else if (currentTab === "blocks") {
        renderBlocks();
    }

    else if (currentTab === "solo") {
        renderSolo();
    }

    else if (currentTab === "news") {
        renderNews();
    }

    else if (currentTab === "settings") {
        renderSettings();
    }

}


/* =========================================================
   TOP BUTTONS
   ========================================================= */

function bindTopButtons() {

    if (accountButton) {
        accountButton.addEventListener(
            "click",
            openAccountModal
        );
    }

    if (themeQuick) {
        themeQuick.addEventListener(
            "click",
            () => {

                currentTab = "settings";

                updateNavigation();

                renderSettings();

            }
        );
    }

}


/* =========================================================
   ACCOUNT
   ========================================================= */

function bindAccountModal() {

    if (closeAccount) {
        closeAccount.addEventListener(
            "click",
            closeAccountModal
        );
    }

    if (accountModal) {

        accountModal.addEventListener(
            "click",
            event => {

                if (
                    event.target === accountModal
                ) {
                    closeAccountModal();
                }

            }
        );

    }

}


function openAccountModal() {

    if (!accountModal || !accountContent) {
        return;
    }

    accountModal.classList.remove("hidden");

    renderAccountContent();
}


function closeAccountModal() {

    if (accountModal) {
        accountModal.classList.add("hidden");
    }

}


function renderAccountContent() {

    if (isGuest) {

        accountContent.innerHTML = `

            <div class="account-title">
                Guest Mode
            </div>

            <div class="account-status">
                You are playing as a guest.
                Your progress will not be saved.
            </div>

            <button
                class="action-button"
                style="width:100%;margin-top:20px"
                id="accountLoginButton"
            >
                LOG IN / SIGN UP
            </button>

        `;

        const button =
            document.getElementById(
                "accountLoginButton"
            );

        if (button) {

            button.addEventListener(
                "click",
                () => {
                    renderLoginForm();
                }
            );

        }

        return;
    }


    if (currentUser) {

        accountContent.innerHTML = `

            <div class="account-title">
                Account
            </div>

            <div class="account-status">
                ${escapeHTML(
                    currentUser.email || "Logged in"
                )}
            </div>

            <button
                class="action-button"
                style="width:100%;margin-top:20px"
                id="logoutButton"
            >
                LOG OUT
            </button>

        `;

        const logout =
            document.getElementById(
                "logoutButton"
            );

        if (logout) {

            logout.addEventListener(
                "click",
                logoutUser
            );

        }

        return;
    }


    renderLoginForm();
}


function renderLoginForm() {

    accountContent.innerHTML = `

        <div class="account-title">
            Welcome to Blocket
        </div>

        <div class="account-status">
            Log in to save your collection.
        </div>

        <div class="account-form">

            <input
                id="emailInput"
                type="email"
                placeholder="Email"
            >

            <input
                id="passwordInput"
                type="password"
                placeholder="Password"
            >

            <button
                id="loginButton"
                class="action-button"
                style="width:100%"
            >
                LOG IN
            </button>

            <button
                id="signupButton"
                class="action-button"
                style="
                    width:100%;
                    margin-top:10px;
                    background:var(--theme-soft);
                    color:var(--theme-dark);
                "
            >
                CREATE ACCOUNT
            </button>

        </div>
    `;


    const login =
        document.getElementById("loginButton");

    const signup =
        document.getElementById("signupButton");


    if (login) {
        login.addEventListener(
            "click",
            loginUser
        );
    }

    if (signup) {
        signup.addEventListener(
            "click",
            signupUser
        );
    }

}


async function loginUser() {

    if (!supabaseClient) {

        notify(
            "Supabase is not available."
        );

        return;
    }

    const email =
        document.getElementById(
            "emailInput"
        )?.value.trim();

    const password =
        document.getElementById(
            "passwordInput"
        )?.value;


    if (!email || !password) {

        notify(
            "Enter your email and password."
        );

        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });


        if (error) {
            throw error;
        }


        currentUser =
            data.user;

        isGuest = false;

        loadAccountSave();

        closeAccountModal();

        enterApp();

        notify("Logged in!");

    }

    catch (error) {

        console.error(error);

        notify(
            error.message ||
            "Could not log in."
        );

    }

}


async function signupUser() {

    if (!supabaseClient) {

        notify(
            "Supabase is not available."
        );

        return;
    }

    const email =
        document.getElementById(
            "emailInput"
        )?.value.trim();

    const password =
        document.getElementById(
            "passwordInput"
        )?.value;


    if (!email || !password) {

        notify(
            "Enter your email and password."
        );

        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient.auth.signUp({
            email,
            password
        });


        if (error) {
            throw error;
        }


        if (data.user) {

            currentUser =
                data.user;

            isGuest = false;

            loadAccountSave();

            closeAccountModal();

            enterApp();

            notify(
                "Account created!"
            );

        } else {

            notify(
                "Check your email to confirm your account."
            );

        }

    }

    catch (error) {

        console.error(error);

        notify(
            error.message ||
            "Could not create account."
        );

    }

}


async function logoutUser() {

    try {

        if (supabaseClient) {
            await supabaseClient.auth.signOut();
        }

    } catch (error) {

        console.warn(error);

    }


    currentUser = null;
    isGuest = true;

    coins = 100;
    inventory = {};
    equippedBlook = null;
    discoveredHidden = [];

    closeAccountModal();

    enterApp();

    notify(
        "Logged out. Now playing as guest."
    );

}


/* =========================================================
   SAVE SYSTEM
   ========================================================= */

function getSaveKey() {

    if (!currentUser) {
        return null;
    }

    return `blocket_save_${currentUser.id}`;
}


function saveGame() {

    if (isGuest || !currentUser) {
        return;
    }

    const key = getSaveKey();

    if (!key) return;


    const save = {

        coins,

        inventory,

        equippedBlook,

        discoveredHidden,

        currentTheme

    };


    try {

        localStorage.setItem(
            key,
            JSON.stringify(save)
        );

    } catch (error) {

        console.warn(
            "Could not save game:",
            error
        );

    }

}


function loadAccountSave() {

    if (!currentUser) return;


    const key = getSaveKey();

    if (!key) return;


    try {

        const raw =
            localStorage.getItem(key);

        if (!raw) {

            coins = 100;
            inventory = {};
            equippedBlook = null;
            discoveredHidden = [];

            saveGame();

            return;
        }


        const save =
            JSON.parse(raw);


        coins =
            Number.isFinite(save.coins)
                ? save.coins
                : 100;

        inventory =
            save.inventory || {};

        equippedBlook =
            save.equippedBlook || null;

        discoveredHidden =
            Array.isArray(
                save.discoveredHidden
            )
                ? save.discoveredHidden
                : [];


        if (save.currentTheme) {

            currentTheme =
                save.currentTheme;

            applyTheme(currentTheme);

        }

    }

    catch (error) {

        console.warn(
            "Save was corrupted:",
            error
        );

        coins = 100;
        inventory = {};
        equippedBlook = null;
        discoveredHidden = [];

    }


    updateCoins();
}


/* =========================================================
   LOCAL SETTINGS
   ========================================================= */

function loadLocalSettings() {

    const savedTheme =
        localStorage.getItem(
            "blocket_theme"
        );

    if (savedTheme) {
        currentTheme = savedTheme;
    }

}


function saveTheme() {

    try {

        localStorage.setItem(
            "blocket_theme",
            currentTheme
        );

    } catch (error) {

        console.warn(error);

    }


    saveGame();

}


/* =========================================================
   COINS
   ========================================================= */

function updateCoins() {

    if (coinDisplay) {

        coinDisplay.textContent =
            `${coins} Coins`;

    }

}


function addCoins(amount) {

    coins += amount;

    updateCoins();

    saveGame();

}


/* =========================================================
   MARKET
   ========================================================= */

function renderMarket() {

    content.innerHTML = `

        <h1 class="page-title">
            Market
        </h1>

        <p class="page-subtitle">
            Open packs and collect Blocks.
        </p>

        <div class="pack-grid">

    ${getAvailablePacks().map(
        pack => createPackCard(pack)
    ).join("")}

        </div>
    `;


    document
        .querySelectorAll(".pack-open-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openPack(
                        button.dataset.pack
                    );

                }
            );

        });

}


function createPackCard(pack) {

    return `

        <div class="pack-card">

            <div class="pack-icon">
                ${pack.icon}
            </div>

            <div class="pack-name">
                ${escapeHTML(pack.name)}
            </div>

            <div class="pack-price">
                🪙 ${pack.price} Coins
            </div>

            <button
                class="pack-open-button"
                data-pack="${pack.id}"
            >
                OPEN PACK
            </button>

        </div>

    `;

}


/* =========================================================
   PACK OPENING
   ========================================================= */

function openPack(packId) {

 const pack =
    getAvailablePacks().find(
         p => p.id === packId
     );

    if (!pack) return;


    if (coins < pack.price) {

        notify(
            "You don't have enough Coins."
        );

        return;
    }


    coins -= pack.price;

    updateCoins();


    const block =
        weightedRandom(
            pack.blocks
        );


    if (!block) {

        addCoins(pack.price);

        notify(
            "Pack opening failed."
        );

        return;
    }


    inventory[block.id] =
        (inventory[block.id] || 0) + 1;


    if (
        !equippedBlook
    ) {

        equippedBlook =
            block.id;

    }


    saveGame();


    showOpening(
        block,
        pack
    );

}


function weightedRandom(items) {

    const total =
        items.reduce(
            (sum, item) =>
                sum + Number(item.chance || 0),
            0
        );


    if (total <= 0) {
        return null;
    }


    let random =
        Math.random() * total;


    for (const item of items) {

        random -=
            Number(item.chance || 0);

        if (random <= 0) {
            return item;
        }

    }


    return items[
        items.length - 1
    ];

}


function showOpening(block, pack) {

    if (!opening) return;


    opening.classList.remove(
        "hidden"
    );


    openingRarity.textContent =
        block.rarity;


    openingName.textContent =
        block.name;


    openingPack.textContent =
        pack.name;


    if (block.image) {

        openingImage.innerHTML =
            `<img src="${block.image}" alt="">`;

    } else {

        openingImage.innerHTML =
            "🧱";

    }


    setTimeout(() => {

        opening.classList.add(
            "hidden"
        );

        renderCurrentTab();

    }, 2200);

}


/* =========================================================
   BLOCKS
   ========================================================= */

function getAllVisibleBlocks() {

    const normal =
        packs.flatMap(
            pack =>
                pack.blocks.map(
                    block => ({
                        ...block,
                        packId: pack.id,
                        packName: pack.name
                    })
                )
        );


    const hidden =
        hiddenBlocks
            .filter(
                block =>
                    discoveredHidden.includes(
                        block.id
                    )
            )
            .map(
                block => ({
                    ...block,
                    packId: "misc",
                    packName: block.pack
                })
            );


    return [
        ...normal,
        ...hidden
    ];

}


function renderBlocks() {

    content.innerHTML = `

        <h1 class="page-title">
            Blocks
        </h1>

        <p class="page-subtitle">
            Your Block collection.
        </p>

        <input
            id="blockSearch"
            class="collection-search"
            placeholder="Search Blocks..."
        >

        <div id="collectionContainer"></div>

    `;


    const search =
        document.getElementById(
            "blockSearch"
        );


    if (search) {

        search.addEventListener(
            "input",
            () => {

                renderCollection(
                    search.value
                );

            }
        );

    }


    renderCollection("");

}


function renderCollection(searchText) {

    const container =
        document.getElementById(
            "collectionContainer"
        );

    if (!container) return;


    const query =
        searchText
            .trim()
            .toLowerCase();


    const normalPacks =
        packs.map(pack => ({
            ...pack,
            blocks: pack.blocks
                .map(block => ({
                    ...block,
                    packId: pack.id,
                    packName: pack.name
                }))
                .filter(block => {

                    if (!query) {
                        return true;
                    }

                    return (
                        block.name
                            .toLowerCase()
                            .includes(query)
                    );

                })
        }));


    let html = "";


    for (const pack of normalPacks) {

        if (!pack.blocks.length) {
            continue;
        }


        const sorted =
            sortByRarity(
                pack.blocks
            );


        html += `

            <section class="collection-section">

                <div class="collection-section-title">
                    ${escapeHTML(pack.name)}
                </div>

                <div class="block-grid">

                    ${sorted
                        .map(
                            block =>
                                createCollectionBlock(
                                    block
                                )
                        )
                        .join("")}

                </div>

            </section>
        `;

    }


    const discovered =
        hiddenBlocks.filter(
            block =>
                discoveredHidden.includes(
                    block.id
                )
        );


    const misc =
        discovered.filter(block => {

            if (!query) return true;

            if (!block.searchable) {
                return false;
            }

            return block.name
                .toLowerCase()
                .includes(query);

        });


    if (misc.length) {

        html += `

            <section class="collection-section">

                <div class="collection-section-title">
                    MISC
                </div>

                <div class="block-grid">

                    ${misc
                        .map(
                            block =>
                                createCollectionBlock({
                                    ...block,
                                    packId: "misc",
                                    packName: block.pack
                                })
                        )
                        .join("")}

                </div>

            </section>

        `;

    }


    container.innerHTML =
        html ||
        `<div class="panel">
            No Blocks found.
        </div>`;


    bindBlockCards();

}


function sortByRarity(blocks) {

    return [...blocks].sort(
        (a, b) =>
            rarityOrder.indexOf(a.rarity) -
            rarityOrder.indexOf(b.rarity)
    );

}


function createCollectionBlock(block) {

    const owned =
        inventory[block.id] || 0;


    const isOwned =
        owned > 0;


    let imageHTML;


    if (block.image) {

        imageHTML = `
            <img
                src="${block.image}"
                class="block-image ${isOwned ? "" : "locked-image"}"
                alt=""
            >
        `;

    } else {

        imageHTML = `
            <div
                class="block-image ${isOwned ? "" : "locked-image"}"
            >
                🧱
            </div>
        `;

    }


    return `

        <button
            class="block-card"
            data-block="${block.id}"
        >

            ${imageHTML}

            <div class="block-name">
                ${
                    isOwned
                        ? escapeHTML(block.name)
                        : "???"
                }
            </div>

            <div
                class="block-rarity rarity-${block.rarity.toLowerCase()}"
            >
                ${
                    isOwned
                        ? block.rarity
                        : "LOCKED"
                }
            </div>

        </button>

    `;

}


function bindBlockCards() {

    document
        .querySelectorAll(".block-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    const block =
                        getAllVisibleBlocks()
                            .find(
                                b =>
                                    b.id ===
                                    card.dataset.block
                            );


                    if (!block) return;


                    const owned =
                        inventory[
                            block.id
                        ] || 0;


                    if (!owned) {

                        notify(
                            "You haven't discovered this Block yet."
                        );

                        return;
                    }


                    showBlockInfo(block);

                }
            );

        });

}


function showBlockInfo(block) {

    const owned =
        inventory[block.id] || 0;


    const equipped =
        equippedBlook === block.id;


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "modal";


    let imageHTML =
        block.image
            ? `<img
                    src="${block.image}"
                    class="block-info-image"
                    alt=""
               >`
            : `<div class="block-info-image">
                    🧱
               </div>`;


    modal.innerHTML = `

        <div class="modal-card">

            <button
                class="modal-close"
                id="closeBlockInfo"
            >
                ×
            </button>

            <div class="block-info">

                ${imageHTML}

                <div class="block-info-name">
                    ${escapeHTML(block.name)}
                </div>

                <div
                    class="block-rarity rarity-${block.rarity.toLowerCase()}"
                    style="margin:8px 0 20px"
                >
                    ${block.rarity}
                </div>

                <div class="block-info-row">
                    <strong>Pack</strong>
                    <span>
                        ${escapeHTML(block.packName)}
                    </span>
                </div>

                <div class="block-info-row">
                    <strong>Owned</strong>
                    <span>${owned}</span>
                </div>

                <div class="block-info-row">
                    <strong>Sell Value</strong>
                    <span>
                        🪙 ${sellValues[block.rarity] || 0}
                    </span>
                </div>

                <div class="info-actions">

                    <button
                        id="equipBlock"
                        class="action-button"
                    >
                        ${
                            equipped
                                ? "EQUIPPED"
                                : "EQUIP"
                        }
                    </button>

                    <button
                        id="sellBlock"
                        class="action-button danger"
                    >
                        SELL
                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    modal
        .querySelector("#closeBlockInfo")
        .addEventListener(
            "click",
            () => modal.remove()
        );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {
                modal.remove();
            }

        }
    );


    modal
        .querySelector("#equipBlock")
        .addEventListener(
            "click",
            () => {

                equipBlock(
                    block.id
                );

                modal.remove();

            }
        );


    modal
        .querySelector("#sellBlock")
        .addEventListener(
            "click",
            () => {

                sellBlock(
                    block.id
                );

                modal.remove();

            }
        );

}


function equipBlock(blockId) {

    if (
        !inventory[blockId] ||
        inventory[blockId] <= 0
    ) {

        notify(
            "You don't own that Block."
        );

        return;
    }


    equippedBlook =
        blockId;


    saveGame();

    notify(
        "Block equipped!"
    );


    renderCurrentTab();

}


function sellBlock(blockId) {

    if (
        !inventory[blockId] ||
        inventory[blockId] <= 0
    ) {

        return;
    }


    const block =
        getAllVisibleBlocks()
            .find(
                b => b.id === blockId
            );


    if (!block) return;


    const value =
        sellValues[
            block.rarity
        ] || 0;


    inventory[blockId]--;

    if (
        inventory[blockId] <= 0
    ) {

        delete inventory[blockId];

        if (
            equippedBlook ===
            blockId
        ) {

            equippedBlook = null;

        }

    }


    addCoins(value);

    saveGame();

    notify(
        `Sold ${block.name} for ${value} Coins.`
    );


    renderCurrentTab();

}


/* =========================================================
   EQUIPPED BLOOK
   ========================================================= */

function getEquippedBlock() {

    if (!equippedBlook) {
        return null;
    }


    return getAllVisibleBlocks()
        .find(
            block =>
                block.id ===
                equippedBlook
        ) || null;

}


function getEquippedBlookHTML() {

    const block =
        getEquippedBlock();


    if (!block) {

        return `
            <div
                style="
                    font-size:40px;
                    line-height:1;
                "
            >
                🧱
            </div>
        `;

    }


    if (block.image) {

        return `
            <img
                src="${block.image}"
                alt="${escapeHTML(block.name)}"
            >
        `;

    }


    return `
        <div
            style="
                font-size:40px;
                line-height:1;
            "
        >
            🧱
        </div>
    `;

}


/* =========================================================
   NEWS
   ========================================================= */

function renderNews() {

    content.innerHTML = `

        <h1 class="page-title">
            News
        </h1>

        <p class="page-subtitle">
            What's happening in Blocket.
        </p>

        <div class="news-list">

            <div class="news-card">

                <div class="news-date">
                    SEASON 2
                </div>

                <div class="news-title">
                    Blocket is growing!
                </div>

                <div class="news-text">
                    New packs, Blocks, solo modes,
                    themes and discoveries are being
                    added to Blocket.
                </div>

            </div>

            <div class="news-card">

                <div class="news-date">
                    UPDATE
                </div>

                <div class="news-title">
                    Escape Mode
                </div>

                <div class="news-text">
                    Dodge falling walls and answer
                    quiz checkpoints to keep going.
                </div>

            </div>

        </div>
    `;

}


/* =========================================================
   SOLO
   ========================================================= */

function renderSolo() {

    content.innerHTML = `

        <h1 class="page-title">
            Solo
        </h1>

        <p class="page-subtitle">
            Play Blocket by yourself.
        </p>

        <div class="mode-grid">

            ${Object.entries(soloModes)
                .map(
                    ([id, mode]) => `

                        <div
                            class="mode-card"
                            data-mode="${id}"
                        >

                            <div class="mode-icon">
                                ${mode.icon}
                            </div>

                            <div class="mode-name">
                                ${mode.name}
                            </div>

                            <div class="mode-description">
                                ${mode.description}
                            </div>

                        </div>

                    `
                )
                .join("")}

        </div>

        <div class="panel">

            <div class="panel-title">
                Choose a Subject
            </div>

            <div class="subject-grid">

                ${[
                    "Math",
                    "English",
                    "History",
                    "Science",
                    "Fun Facts",
                    "All Correct"
                ].map(
                    subject => `

                        <button
                            class="subject-button"
                            data-subject="${subject}"
                        >
                            ${subject}
                        </button>

                    `
                ).join("")}

            </div>

        </div>

    `;


    document
        .querySelectorAll(".mode-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    selectedSoloMode =
                        card.dataset.mode;

                    startSelectedSolo();

                }
            );

        });


    document
        .querySelectorAll(".subject-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectedSubject =
                        button.dataset.subject;

                    notify(
                        `${selectedSubject} selected.`
                    );

                }
            );

        });

}


function startSelectedSolo() {

    if (
        selectedSoloMode ===
        "study"
    ) {

        startStudy(
            selectedSubject
        );

    }

    else if (
        selectedSoloMode ===
        "escape"
    ) {

        startEscape(
            selectedSubject
        );

    }

}


/* =========================================================
   STUDY
   ========================================================= */

function startStudy(subject) {

    if (
        subject ===
        "All Correct"
    ) {

        startAllCorrect();

        return;
    }


    studyQuestions =
        getQuestionsForSubject(
            subject
        );


    if (!studyQuestions.length) {

        notify(
            "No questions available."
        );

        return;
    }


    studyQuestions =
        shuffle(
            [...studyQuestions]
        );


    studyIndex = 0;


    renderStudyQuestion();

}


function getQuestionsForSubject(subject) {

    return questions.filter(
        question =>
            question.subject ===
            subject
    );

}


function renderStudyQuestion() {

    const question =
        studyQuestions[
            studyIndex %
            studyQuestions.length
        ];


    content.innerHTML = `

        <div class="study-game">

            <h1 class="page-title">
                Study
            </h1>

            <p class="page-subtitle">
                ${escapeHTML(question.subject)}
            </p>

            <div class="study-question">
                ${escapeHTML(question.question)}
            </div>

            <div class="answer-grid">

                ${question.answers
                    .map(
                        (answer, index) => `

                            <button
                                class="answer-button"
                                data-answer="${index}"
                            >
                                ${escapeHTML(answer)}
                            </button>

                        `
                    )
                    .join("")}

            </div>

            <button
                id="stopStudy"
                class="stop-button"
            >
                STOP STUDYING
            </button>

        </div>

    `;


    document
        .querySelectorAll(".answer-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const answer =
                        Number(
                            button.dataset.answer
                        );


                    if (
                        answer ===
                        question.correct
                    ) {

                        addCoins();

                        notify(
                            "+2 Coins!"
                        );

                    } else {

                        notify(
                            "Not quite!"
                        );

                    }


                    studyIndex++;

                    if (
                        studyIndex >=
                        studyQuestions.length
                    ) {

                        studyQuestions =
                            shuffle(
                                [...studyQuestions]
                            );

                        studyIndex = 0;

                    }


                    setTimeout(
                        renderStudyQuestion,
                        250
                    );

                }
            );

        });


    document
        .getElementById("stopStudy")
        ?.addEventListener(
            "click",
            () => renderSolo()
        );

}


function startAllCorrect() {

    content.innerHTML = `

        <div class="study-game">

            <h1 class="page-title">
                All Correct
            </h1>

            <p class="page-subtitle">
                EVERY ANSWER IS CORRECT •
                +2 COINS PER CLICK
            </p>

            <div class="study-question">
                Pick any answer!
            </div>

            <div class="answer-grid">

                <button class="answer-button">
                    CORRECT
                </button>

                <button class="answer-button">
                    CORRECT
                </button>

                <button class="answer-button">
                    CORRECT
                </button>

                <button class="answer-button">
                    CORRECT
                </button>

            </div>

            <button
                id="stopStudy"
                class="stop-button"
            >
                STOP STUDYING
            </button>

        </div>

    `;


    document
        .querySelectorAll(".answer-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    addCoins(2);

                    notify(
                        "+2 Coins!"
                    );

                }
            );

        });


    document
        .getElementById("stopStudy")
        ?.addEventListener(
            "click",
            () => renderSolo()
        );

}


/* =========================================================
   ESCAPE
   ========================================================= */

function startEscape(subject) {

    stopEscape(false);


    const startingX = 50;


    escapeGame = {

    running: true,

    subject,

    playerX: 50,
    playerY: 78,

    walls: [],

    wallsDodged: 0,

    nextQuiz: 5,

    lastTime: performance.now(),

    spawnTimer: 0,

    // HARDER START
    spawnInterval: 750,

    speed: 270,

    quizActive: false,

    quizIndex: 0,

    quizQuestions: [],

    mouseActive: false

    };


    renderEscapeGame();


    document.addEventListener(
        "mousemove",
        escapeMouseMove
    );


    escapeGame.animation =
        requestAnimationFrame(
            escapeLoop
        );

}


function renderEscapeGame() {

    content.innerHTML = `

        <div
            id="escapeGame"
            class="escape-game"
        >

            <div class="escape-header">

                <div class="escape-title">
                    ESCAPE
                </div>

                <div
                    id="escapeCounter"
                    class="escape-counter"
                >
                    WALLS DODGED: 0
                </div>

                <div
                    id="escapeNext"
                    class="escape-next"
                >
                    NEXT QUIZ: 5 WALLS
                </div>

            </div>


            <div
                id="escapePlayer"
                class="escape-player"
            >
                ${getEquippedBlookHTML()}
            </div>


            <div class="escape-hint">
                MOVE WITH MOUSE
            </div>

        </div>

    `;


    updateEscapePlayer();
}


function escapeMouseMove(event) {

    if (
        !escapeGame ||
        !escapeGame.running ||
        escapeGame.quizActive
    ) {
        return;
    }


    const arena =
        document.getElementById(
            "escapeGame"
        );


    if (!arena) return;


    const rect =
        arena.getBoundingClientRect();


    const x =
        ((event.clientX - rect.left) /
            rect.width) *
        100;


    const y =
        ((event.clientY - rect.top) /
            rect.height) *
        100;


    escapeGame.playerX =
        Math.max(
            4,
            Math.min(96, x)
        );


    escapeGame.playerY =
        Math.max(
            14,
            Math.min(88, y)
        );


    escapeGame.mouseActive =
        true;


    updateEscapePlayer();

}


function updateEscapePlayer() {

    if (!escapeGame) return;


    const player =
        document.getElementById(
            "escapePlayer"
        );


    if (!player) return;


    player.style.left =
        `${escapeGame.playerX}%`;


    player.style.top =
        `${escapeGame.playerY}%`;


    player.style.transform =
        "translate(-50%, -50%)";

}


function escapeLoop(timestamp) {

    if (
        !escapeGame ||
        !escapeGame.running
    ) {
        return;
    }


    if (
        escapeGame.quizActive
    ) {

        escapeGame.animation =
            requestAnimationFrame(
                escapeLoop
            );

        return;
    }


    const delta =
        Math.min(
            (timestamp -
                escapeGame.lastTime) /
                1000,
            0.05
        );


    escapeGame.lastTime =
        timestamp;


    escapeGame.spawnTimer +=
        delta * 1000;


    if (
        escapeGame.spawnTimer >=
        escapeGame.spawnInterval
    ) {

        escapeGame.spawnTimer = 0;

        spawnEscapeWall();

    }


    updateEscapeWalls(
        delta
    );


    checkEscapeCollisions();


    escapeGame.animation =
        requestAnimationFrame(
            escapeLoop
        );

}


function spawnEscapeWall() {

    if (
        !escapeGame ||
        !escapeGame.running
    ) {
        return;
    }


    const arena =
        document.getElementById(
            "escapeGame"
        );


    if (!arena) return;


    const wall =
        document.createElement(
            "div"
        );


    wall.className =
        "escape-wall";


    const x =
        8 +
        Math.random() *
        84;


    const y =
        -12;


    wall.style.left =
        `${x}%`;

    wall.style.top =
        `${y}%`;


    arena.appendChild(
        wall
    );


    escapeGame.walls.push({

        element: wall,

        x,
        y,

        speed:
            escapeGame.speed *
            (0.85 +
                Math.random() *
                0.3)

    });

}


function updateEscapeWalls(delta) {

    if (!escapeGame) return;


    for (
        let i =
            escapeGame.walls.length - 1;

        i >= 0;

        i--
    ) {

        const wall =
            escapeGame.walls[i];


        wall.y +=
            (wall.speed *
                delta /
                6);


        wall.element.style.top =
            `${wall.y}%`;


        if (
            wall.y >
            110
        ) {

            wall.element.remove();

            escapeGame.walls.splice(
                i,
                1
            );


            escapeWallDodged();

        }

    }

}


function escapeWallDodged() {

    if (!escapeGame) return;


    escapeGame.wallsDodged++;


    escapeGame.nextQuiz--;


    const counter =
        document.getElementById(
            "escapeCounter"
        );

    const next =
        document.getElementById(
            "escapeNext"
        );


    if (counter) {

        counter.textContent =
            `WALLS DODGED: ${escapeGame.wallsDodged}`;

    }


    if (
        escapeGame.nextQuiz <= 0
    ) {

        escapeGame.nextQuiz =
            5;


        if (next) {

            next.textContent =
                "QUIZ CHECKPOINT!";

        }


        startEscapeQuiz();

        return;
    }


    if (next) {

        next.textContent =
            `NEXT QUIZ: ${escapeGame.nextQuiz} WALLS`;

    }

}


function checkEscapeCollisions() {

    if (
        !escapeGame ||
        escapeGame.quizActive
    ) {
        return;
    }


    const player =
        document.getElementById(
            "escapePlayer"
        );


    if (!player) return;


    const playerRect =
        player.getBoundingClientRect();


    for (
        const wall of
        escapeGame.walls
    ) {

        const wallRect =
            wall.element
                .getBoundingClientRect();


        const collision =
            playerRect.left <
                wallRect.right &&
            playerRect.right >
                wallRect.left &&
            playerRect.top <
                wallRect.bottom &&
            playerRect.bottom >
                wallRect.top;


        if (collision) {

            escapeGameOver();

            return;

        }

    }

}


function escapeGameOver() {

    if (
        !escapeGame ||
        !escapeGame.running
    ) {
        return;
    }


    escapeGame.running =
        false;


    cancelAnimationFrame(
        escapeGame.animation
    );


    document.removeEventListener(
        "mousemove",
        escapeMouseMove
    );


    content.innerHTML = `

        <div class="panel"
             style="
                max-width:650px;
                margin:auto;
                text-align:center;
                padding:45px;
             ">

            <div style="
                font-size:60px;
            ">
                💥
            </div>

            <h1>
                YOU GOT HIT!
            </h1>

            <p style="
                color:var(--muted);
                font-weight:800;
            ">
                You dodged
                ${escapeGame.wallsDodged}
                walls.
            </p>

            <button
                id="escapeRetry"
                class="action-button"
                style="width:100%"
            >
                TRY AGAIN
            </button>

            <button
                id="escapeBack"
                class="action-button"
                style="
                    width:100%;
                    margin-top:10px;
                    background:var(--theme-soft);
                    color:var(--theme-dark);
                "
            >
                BACK TO SOLO
            </button>

        </div>

    `;


    document
        .getElementById("escapeRetry")
        ?.addEventListener(
            "click",
            () => startEscape(
                escapeGame.subject
            )
        );


    document
        .getElementById("escapeBack")
        ?.addEventListener(
            "click",
            () => renderSolo()
        );

}


function startEscapeQuiz() {

    if (
        !escapeGame ||
        !escapeGame.running
    ) {
        return;
    }


    escapeGame.quizActive =
        true;


    escapeGame.quizIndex =
        0;


    escapeGame.quizQuestions =
        getEscapeQuestions(
            escapeGame.subject
        );


    if (
        !escapeGame.quizQuestions.length
    ) {

        finishEscapeQuiz();

        return;
    }


    renderEscapeQuiz();

}


function getEscapeQuestions(subject) {

    if (
        subject ===
        "All Correct"
    ) {

        return [
            {
                question:
                    "Every answer is correct!",
                answers: [
                    "Correct",
                    "Correct",
                    "Correct",
                    "Correct"
                ],
                correct: 0
            },
            {
                question:
                    "Pick an answer!",
                answers: [
                    "Correct",
                    "Correct",
                    "Correct",
                    "Correct"
                ],
                correct: 0
            },
            {
                question:
                    "All of these work!",
                answers: [
                    "Correct",
                    "Correct",
                    "Correct",
                    "Correct"
                ],
                correct: 0
            }
        ];

    }


    const pool =
        getQuestionsForSubject(
            subject
        );


    return shuffle(
        [...pool]
    ).slice(
        0,
        3
    );

}


function renderEscapeQuiz() {

    if (
        !escapeGame ||
        !escapeGame.quizActive
    ) {
        return;
    }


    const question =
        escapeGame.quizQuestions[
            escapeGame.quizIndex
        ];


    const game =
        document.getElementById(
            "escapeGame"
        );


    if (!game) return;


    const quiz =
        document.createElement(
            "div"
        );


    quiz.className =
        "escape-quiz";


    quiz.innerHTML = `

        <div class="escape-quiz-card">

            <h2>
                QUIZ CHECKPOINT
            </h2>

            <div class="quiz-progress">
                QUESTION
                ${escapeGame.quizIndex + 1}
                / 3
            </div>

            <div class="study-question">
                ${escapeHTML(
                    question.question
                )}
            </div>

            <div class="answer-grid">

                ${question.answers
                    .map(
                        (answer, index) => `

                            <button
                                class="answer-button"
                                data-quiz-answer="${index}"
                            >
                                ${escapeHTML(answer)}
                            </button>

                        `
                    )
                    .join("")}

            </div>

        </div>

    `;


    game.appendChild(
        quiz
    );


    quiz
        .querySelectorAll(
            "[data-quiz-answer]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    answerEscapeQuestion(
                        Number(
                            button.dataset.quizAnswer
                        )
                    );

                }
            );

        });

}


function answerEscapeQuestion(answer) {

    if (
        !escapeGame ||
        !escapeGame.quizActive
    ) {
        return;
    }


    const question =
        escapeGame.quizQuestions[
            escapeGame.quizIndex
        ];


    if (
        answer ===
        question.correct
    ) {

        addCoins(2);

        notify(
            "+2 Coins!"
        );

    } else {

        notify(
            "Wrong answer!"
        );

    }


    escapeGame.quizIndex++;


    if (
        escapeGame.quizIndex >= 3
    ) {

        finishEscapeQuiz();

        return;
    }


    document
        .querySelector(
            ".escape-quiz"
        )
        ?.remove();


    renderEscapeQuiz();

}


function finishEscapeQuiz() {

    if (!escapeGame) return;


    escapeGame.quizActive =
        false;


    escapeGame.quizIndex =
        0;


    escapeGame.quizQuestions =
        [];


    document
        .querySelector(
            ".escape-quiz"
        )
        ?.remove();


    const next =
        document.getElementById(
            "escapeNext"
        );


    if (next) {

        next.textContent =
            `NEXT QUIZ: ${escapeGame.nextQuiz} WALLS`;

    }


    escapeGame.lastTime =
        performance.now();

}


function stopEscape(clearContent = false) {

    if (!escapeGame) {
        return;
    }


    escapeGame.running =
        false;


    if (
        escapeGame.animation
    ) {

        cancelAnimationFrame(
            escapeGame.animation
        );

    }


    document.removeEventListener(
        "mousemove",
        escapeMouseMove
    );


    escapeGame.walls
        ?.forEach(
            wall =>
                wall.element.remove()
        );


    escapeGame = null;


    if (clearContent) {
        renderSolo();
    }

}


/* =========================================================
   SETTINGS
   ========================================================= */

function renderSettings() {

    content.innerHTML = `

        <h1 class="page-title">
            Settings
        </h1>

        <p class="page-subtitle">
            Customize your Blocket experience.
        </p>

        <div class="panel">

            <div class="panel-title">
                Themes
            </div>

            <div class="theme-grid">

                ${themes
                    .map(
                        theme =>
                            createThemeCard(
                                theme
                            )
                    )
                    .join("")}

            </div>

        </div>

        <div
            class="panel"
            style="margin-top:20px"
        >

            <div class="panel-title">
                Current Blook
            </div>

            <div style="
                display:flex;
                align-items:center;
                gap:20px;
            ">

                <div style="
                    width:80px;
                    height:80px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                ">

                    ${
                        getEquippedBlookHTML()
                    }

                </div>

                <div>

                    <strong>
                        ${
                            getEquippedBlock()
                                ?.name ||
                            "No Blook equipped"
                        }
                    </strong>

                    <div style="
                        color:var(--muted);
                        margin-top:5px;
                    ">
                        This Blook appears
                        in Escape.
                    </div>

                </div>

            </div>

        </div>

    `;


    document
        .querySelectorAll(
            ".theme-card"
        )
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    applyTheme(
                        card.dataset.theme
                    );

                    renderSettings();

                    notify(
                        "Theme changed!"
                    );

                }
            );

        });

}


function createThemeCard(theme) {

    const selected =
        currentTheme === theme.id;


    return `

        <div
            class="theme-card ${selected ? "selected" : ""}"
            data-theme="${theme.id}"
        >

            <div
                class="theme-preview"
                style="
                    --preview-main:${theme.main};
                    --preview-dark:${theme.dark};
                    --preview-bg:${theme.bg};
                "
            >

                <div
                    class="preview-sidebar"
                ></div>

                <div
                    class="preview-main"
                >

                    <div
                        class="preview-ui"
                    ></div>

                </div>

            </div>

            <div class="theme-name">
                ${escapeHTML(theme.name)}
            </div>

        </div>

    `;

}


function applyTheme(themeId) {

    const theme =
        themes.find(
            t => t.id === themeId
        );


    if (!theme) return;


    currentTheme =
        theme.id;


    document.body.className =
        `theme-${theme.id}`;


    saveTheme();

}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

let notificationTimer = null;

function notify(message) {

    if (!notification) return;


    notification.textContent =
        message;


    notification.classList.add(
        "show"
    );


    clearTimeout(
        notificationTimer
    );


    notificationTimer =
        setTimeout(
            () => {

                notification.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* =========================================================
   HELPERS
   ========================================================= */

function shuffle(array) {

    for (
        let i =
            array.length - 1;

        i > 0;

        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];

    }


    return array;

}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   AUTO AUTH CHECK
   ========================================================= */

async function checkExistingLogin() {

    if (!supabaseClient) {
        return;
    }


    try {

        const {
            data
        } =
            await supabaseClient
                .auth
                .getSession();


        const user =
            data?.session?.user;


        if (!user) {
            return;
        }


        currentUser =
            user;

        isGuest =
            false;


        loadAccountSave();

    }

    catch (error) {

        console.warn(
            "Auth check failed:",
            error
        );

    }

}


/* =========================================================
   RUN AUTH CHECK
   ========================================================= */

checkExistingLogin();
