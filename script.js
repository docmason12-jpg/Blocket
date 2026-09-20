// ============================================================
// BLOCKET
// FULL SCRIPT
// ============================================================


// ============================================================
// SUPABASE
// ============================================================

const SUPABASE_URL =
    "https://whakyhbtqwfvicicnttu.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_gKxzj3EC0h2FeLLST2JflA_QGBdSRbD";

let supabaseClient = null;

if (window.supabase) {
    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );
}


// ============================================================
// GAME STATE
// ============================================================

let currentUser = null;
let isGuest = false;

let currentTab = "market";

let currentPack = null;

let currentSoloSubject = null;

let currentQuestion = null;

let currentQuestionPool = [];

let previousQuestion = null;

let currentTheme = "classic";

let soloSession = {
    active: false,
    questionsAnswered: 0,
    correctAnswers: 0,
    coinsEarned: 0
};

let gameState = {
    coins: 100,
    inventory: [],
    equipped: null,
    questionsAnswered: 0,
    correctAnswers: 0
};


// ============================================================
// SAVE SYSTEM
// ============================================================

function getSaveKey() {

    if (!currentUser) {
        return null;
    }

    return `blocket_save_${currentUser.id}`;
}


function resetGuestState() {

    gameState = {
        coins: 100,
        inventory: [],
        equipped: null,
        questionsAnswered: 0,
        correctAnswers: 0
    };

}


function saveGame() {

    // Guest progress never saves
    if (
        isGuest ||
        !currentUser
    ) {
        return;
    }

    const key = getSaveKey();

    if (!key) {
        return;
    }

    try {

        localStorage.setItem(
            key,
            JSON.stringify(gameState)
        );

    } catch (error) {

        console.error(
            "Could not save Blocket data:",
            error
        );

    }
}


function loadGame() {

    if (
        isGuest ||
        !currentUser
    ) {

        resetGuestState();

        return;
    }

    const key = getSaveKey();

    if (!key) {
        return;
    }

    try {

        const saved =
            localStorage.getItem(key);

        if (!saved) {

            gameState = {
                coins: 100,
                inventory: [],
                equipped: null,
                questionsAnswered: 0,
                correctAnswers: 0
            };

            return;
        }

        const parsed =
            JSON.parse(saved);

        gameState = {
            coins:
                Number(
                    parsed.coins ?? 100
                ),

            inventory:
                Array.isArray(parsed.inventory)
                    ? parsed.inventory
                    : [],

            equipped:
                parsed.equipped ?? null,

            questionsAnswered:
                Number(
                    parsed.questionsAnswered ?? 0
                ),

            correctAnswers:
                Number(
                    parsed.correctAnswers ?? 0
                )
        };

    } catch (error) {

        console.error(
            "Could not load Blocket data:",
            error
        );

        gameState = {
            coins: 100,
            inventory: [],
            equipped: null,
            questionsAnswered: 0,
            correctAnswers: 0
        };

    }
}


// ============================================================
// RARITIES
// ============================================================

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

const rarityValues = {
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


// ============================================================
// PACKS
// ============================================================

const packs = {


    // ========================================================
    // COLOR PACK
    // ========================================================

    "Color Pack": {

        name: "Color Pack",

        price: 20,

        image: null,

        rewards: [

            {
                name: "Red",
                rarity: "Common",
                pullRate: 30,
                image: null
            },

            {
                name: "Yellow",
                rarity: "Common",
                pullRate: 25,
                image: null
            },

            {
                name: "Blue",
                rarity: "Common",
                pullRate: 20,
                image: null
            },

            {
                name: "Purple",
                rarity: "Uncommon",
                pullRate: 10,
                image: null
            },

            {
                name: "Green",
                rarity: "Rare",
                pullRate: 7,
                image: null
            },

            {
                name: "Pink",
                rarity: "Epic",
                pullRate: 4,
                image: null
            },

            {
                name: "White",
                rarity: "Legendary",
                pullRate: 2,
                image: null
            },

            {
                name: "Black",
                rarity: "Chroma",
                pullRate: 1.99,
                image: null
            },

            {
                name: "Rainbow",
                rarity: "Mythical",
                pullRate: 0.01,
                image: null
            }

        ]

    },


    // ========================================================
    // BOT PACK
    // ========================================================

    "Bot Pack": {

        name: "Bot Pack",

        price: 20,

        image:
            "./Images/robot.png.png",

        rewards: [

            {
                name: "Rusty Bot",
                rarity: "Common",
                pullRate: 35,
                image:
                    "./Images/Rusty-bot.png"
            },

            {
                name: "Lil Bot",
                rarity: "Common",
                pullRate: 25,
                image:
                    "./Images/lil%20bot.png"
            },

            {
                name: "Robot",
                rarity: "Uncommon",
                pullRate: 18,
                image:
                    "./Images/robot.png.png"
            },

            {
                name: "Cyber Bot",
                rarity: "Rare",
                pullRate: 10,
                image:
                    "./Images/Cyber-bot.png"
            },

            {
                name: "Titan",
                rarity: "Epic",
                pullRate: 6,
                image:
                    "./Images/Titan.png"
            },

            {
                name: "Mega Titan",
                rarity: "Legendary",
                pullRate: 6,
                image:
                    "./Images/Mega%20Titan.png"
            }

        ]

    },


    // ========================================================
    // OG PACK
    // ========================================================

    "OG Pack": {

        name: "OG Pack",

        price: 50,

        image: null,

        rewards: [

            {
                name:
                    "@Totallynotatheatrekid",
                rarity: "OG",
                pullRate: 8
            },

            {
                name: "@strykr-v2k",
                rarity: "OG",
                pullRate: 7
            },

            {
                name: "@HelenSmith-o3k",
                rarity: "OG",
                pullRate: 6
            },

            {
                name:
                    "@LeviPlaysAndEdits",
                rarity: "OG",
                pullRate: 5
            },

            {
                name: "Waymore",
                rarity: "OG",
                pullRate: 5
            },

            {
                name: "@adrianarturosm",
                rarity: "OG",
                pullRate: 5
            },

            {
                name: "@TheJoeyCha-real",
                rarity: "OG",
                pullRate: 5
            },

            {
                name: "sinozilla",
                rarity: "OG",
                pullRate: 5
            },

            {
                name: "Sentinel",
                rarity: "OG",
                pullRate: 4
            },

            {
                name: "math roblox",
                rarity: "OG",
                pullRate: 4
            },

            {
                name: "knuckles",
                rarity: "OG",
                pullRate: 4
            },

            {
                name:
                    "@fortzgeometrydash",
                rarity: "OG",
                pullRate: 4
            },

            {
                name: "starborn",
                rarity: "OG",
                pullRate: 4
            },

            {
                name: "@Forniteboy",
                rarity: "OG",
                pullRate: 4
            },

            {
                name: "@NicholeCohen",
                rarity: "OG",
                pullRate: 4
            },

            {
                name: "@KETCHAAA534",
                rarity: "OG",
                pullRate: 3
            },

            {
                name:
                    "@bradleyrauch4881",
                rarity: "OG",
                pullRate: 3
            },

            {
                name:
                    "@SfsultamateGamer",
                rarity: "OG",
                pullRate: 3
            },

            {
                name:
                    "@ALemonFoxranter",
                rarity: "OG",
                pullRate: 3
            },

            {
                name: "@cloudysquash",
                rarity: "OG",
                pullRate: 2
            },

            {
                name: "@JACollins07",
                rarity: "OG",
                pullRate: 2
            },

            {
                name: "@AnabelleDale",
                rarity: "OG",
                pullRate: 2
            },

            {
                name: "@Jennifer-c5q2h",
                rarity: "OG",
                pullRate: 2
            },

            {
                name:
                    "@Cptbabyrabbit-n4x",
                rarity: "OG",
                pullRate: 1
            },

            {
                name:
                    "@Fat_frog_in_space",
                rarity: "OG",
                pullRate: 1
            },

            {
                name: "@AmeeSoni1",
                rarity: "OG",
                pullRate: 1
            },

            {
                name:
                    "@Sheldon-cooper-explains",
                rarity: "OG",
                pullRate: 1
            },

            {
                name: "@TheJoeyCha-",
                rarity: "OG",
                pullRate: 2
            }

        ]

    },


    // ========================================================
    // MEDIEVAL PACK
    // ========================================================

    "Medieval Pack": {

        name: "Medieval Pack",

        price: 40,

        image:
            "./Images/dragon.svg",

        rewards: [

            {
                name: "Witch",
                rarity: "Common",
                pullRate: 10,
                image:
                    "./Images/witch.svg"
            },

            {
                name: "Wizard",
                rarity: "Common",
                pullRate: 9,
                image:
                    "./Images/wizard.svg"
            },

            {
                name: "Elf",
                rarity: "Common",
                pullRate: 7,
                image:
                    "./Images/elf.svg"
            },

            {
                name: "Fairy",
                rarity: "Common",
                pullRate: 5,
                image:
                    "./Images/fairy.svg"
            },

            {
                name: "Slime Monster",
                rarity: "Common",
                pullRate: 4,
                image:
                    "./Images/slimemonster.svg"
            },

            {
                name: "Jester",
                rarity: "Uncommon",
                pullRate: 25,
                image:
                    "./Images/jester.svg"
            },

            {
                name: "Unicorn",
                rarity: "Rare",
                pullRate: 20,
                image:
                    "./Images/unicorn.svg"
            },

            {
                name: "Dragon",
                rarity: "Epic",
                pullRate: 19,
                image:
                    "./Images/dragon.svg"
            },

            {
                name: "Queen",
                rarity: "Legendary",
                pullRate: 0.5,
                image:
                    "./Images/queen.svg"
            },

            {
                name: "King",
                rarity: "Legendary",
                pullRate: 0.35,
                image:
                    "./Images/king.svg"
            },

            {
                name: "Phantom Queen",
                rarity: "Chroma",
                pullRate: 0.1,
                image:
                    "./Images/static-assets-upload7275842502952922222.webp"
            },

            {
                name: "Phantom King",
                rarity: "Chroma",
                pullRate: 0.05,
                image:
                    "./Images/phathom%20king.webp"
            }

        ]

    }

};


// ============================================================
// HIDDEN BLOCKS
// ============================================================

const hiddenBlocks = [

    {
        name: "Time Watch",
        rarity: "Hidden",
        source: "Secret Discovery",
        searchable: true,
        image: null
    },

    {
        name: "Golden Tater",
        rarity: "Hidden",
        source: "OG Pack",
        searchable: false,
        image: null
    }

];


// ============================================================
// NEWS
// ============================================================

const newsItems = [

    {
        date: "September 20, 2026",
        version: "v2.0",
        title: "🏰 Medieval Pack",
        text:
            "The Medieval Pack has arrived!",
        details: [

            "Added 12 Medieval Blocks.",
            "Added Witch.",
            "Added Wizard.",
            "Added Elf.",
            "Added Fairy.",
            "Added Slime Monster.",
            "Added Jester.",
            "Added Unicorn.",
            "Added Dragon.",
            "Added Queen.",
            "Added King.",
            "Added Phantom Queen.",
            "Added Phantom King.",
            "Phantom Queen and Phantom King are Chroma."

        ]
    },


    {
        date: "September 20, 2026",
        version: "v2.0",
        title: "📚 Endless Study",
        text:
            "Study Mode is now endless.",
        details: [

            "Added more Study questions.",
            "Questions continue forever.",
            "Questions reshuffle after the pool is completed.",
            "Added STOP STUDYING.",
            "Added session statistics.",
            "Correct answers give +2 Coins.",
            "Added All Correct.",
            "Every answer in All Correct is correct."

        ]
    },


    {
        date: "September 20, 2026",
        version: "v2.0",
        title: "🎨 Settings & Themes",
        text:
            "Settings now includes free Blocket themes.",
        details: [

            "Added SETTINGS.",
            "Added Classic Purple.",
            "Added Ruby Red.",
            "Added Ocean Blue.",
            "Added Forest Green.",
            "Added Golden.",
            "Added Midnight.",
            "Added One Color Red.",
            "Added One Color Blue.",
            "Added One Color Green.",
            "Added One Color Purple.",
            "Logged-in users can save their theme."

        ]
    },


    {
        date: "September 20, 2026",
        version: "v2.0",
        title: "🌈 Rarity Changes",
        text:
            "The rarest Color Pack rewards have been rebalanced.",
        details: [

            "Rainbow is now a 0.01% Mythical.",
            "Black is now a 1.99% Chroma.",
            "Medieval Legendary Blocks are now much rarer.",
            "Medieval Phantom Blocks are extremely rare."

        ]
    },


    {
        date: "September 19, 2026",
        version: "v1.9",
        title: "📦 Pack Opening Update",
        text:
            "Pack opening received a rarity progression animation.",
        details: [

            "Added black starting screen.",
            "Added rarity progression.",
            "Improved final reward reveal.",
            "Improved Chroma ending.",
            "Improved OG ending."

        ]
    },


    {
        date: "September 17, 2026",
        version: "v1.8",
        title: "🎨 Collection Update",
        text:
            "The Blocks collection received equipment and selling.",
        details: [

            "Added Block equipment.",
            "Added Block selling.",
            "Added rarity badges.",
            "Improved collection cards."

        ]
    },


    {
        date: "August 20, 2026",
        version: "v1.0",
        title: "💜 Blocket Begins",
        text:
            "The Blocket web project begins.",
        details: [

            "Initial Blocket interface created.",
            "Market system introduced.",
            "Block collection introduced.",
            "Guest mode introduced.",
            "Account system introduced."

        ]
    }

];


// ============================================================
// STUDY QUESTIONS
// ============================================================

const soloQuestions = {


    // ========================================================
    // MATH
    // ========================================================

    Math: [

        {
            question: "What is 7 + 8?",
            answers: [
                "13",
                "14",
                "15",
                "16"
            ],
            correct: 2
        },

        {
            question: "What is 9 × 6?",
            answers: [
                "42",
                "54",
                "56",
                "64"
            ],
            correct: 1
        },

        {
            question: "What is 100 ÷ 4?",
            answers: [
                "20",
                "25",
                "30",
                "40"
            ],
            correct: 1
        },

        {
            question: "What is 12 - 7?",
            answers: [
                "4",
                "5",
                "6",
                "7"
            ],
            correct: 1
        },

        {
            question: "What is 6 × 7?",
            answers: [
                "36",
                "42",
                "48",
                "49"
            ],
            correct: 1
        },

        {
            question: "What is 45 + 27?",
            answers: [
                "62",
                "72",
                "82",
                "92"
            ],
            correct: 1
        },

        {
            question: "What is 81 ÷ 9?",
            answers: [
                "7",
                "8",
                "9",
                "10"
            ],
            correct: 2
        },

        {
            question: "What is 15 × 3?",
            answers: [
                "30",
                "45",
                "50",
                "60"
            ],
            correct: 1
        },

        {
            question: "What is 200 - 75?",
            answers: [
                "115",
                "120",
                "125",
                "135"
            ],
            correct: 2
        },

        {
            question: "What is half of 50?",
            answers: [
                "20",
                "25",
                "30",
                "35"
            ],
            correct: 1
        },

        {
            question: "What is 11 × 11?",
            answers: [
                "111",
                "121",
                "131",
                "141"
            ],
            correct: 1
        },

        {
            question: "What is 64 ÷ 8?",
            answers: [
                "6",
                "7",
                "8",
                "9"
            ],
            correct: 2
        },

        {
            question: "What is 14 + 19?",
            answers: [
                "31",
                "32",
                "33",
                "34"
            ],
            correct: 2
        },

        {
            question: "What is 72 ÷ 8?",
            answers: [
                "7",
                "8",
                "9",
                "10"
            ],
            correct: 2
        },

        {
            question: "What is 13 × 4?",
            answers: [
                "42",
                "48",
                "52",
                "56"
            ],
            correct: 2
        },

        {
            question: "What is 90 - 37?",
            answers: [
                "43",
                "53",
                "63",
                "73"
            ],
            correct: 1
        },

        {
            question: "What is 25 + 25?",
            answers: [
                "40",
                "45",
                "50",
                "55"
            ],
            correct: 2
        },

        {
            question: "What is 7 × 8?",
            answers: [
                "54",
                "56",
                "58",
                "64"
            ],
            correct: 1
        }

    ],


    // ========================================================
    // ENGLISH
    // ========================================================

    English: [

        {
            question:
                "Which word is a noun?",
            answers: [
                "Run",
                "Blue",
                "Dog",
                "Quickly"
            ],
            correct: 2
        },

        {
            question:
                "Which word means the opposite of 'hot'?",
            answers: [
                "Warm",
                "Cold",
                "Fast",
                "Bright"
            ],
            correct: 1
        },

        {
            question:
                "Which sentence ends with a question mark?",
            answers: [
                "I like pizza.",
                "That was awesome!",
                "Where are you?",
                "Go outside."
            ],
            correct: 2
        },

        {
            question:
                "Which word is a verb?",
            answers: [
                "Jump",
                "Green",
                "House",
                "Slowly"
            ],
            correct: 0
        },

        {
            question:
                "Which word is spelled correctly?",
            answers: [
                "Beutiful",
                "Beautiful",
                "Beautifull",
                "Beutifull"
            ],
            correct: 1
        },

        {
            question:
                "Which word is an adjective?",
            answers: [
                "Quick",
                "Run",
                "Apple",
                "Swimming"
            ],
            correct: 0
        },

        {
            question:
                "What is the plural of 'mouse'?",
            answers: [
                "Mouses",
                "Mousees",
                "Mice",
                "Mices"
            ],
            correct: 2
        },

        {
            question:
                "Which sentence uses an exclamation mark?",
            answers: [
                "Where are you?",
                "I love this!",
                "The cat is sleeping.",
                "It is Tuesday."
            ],
            correct: 1
        },

        {
            question:
                "Which word means the opposite of 'large'?",
            answers: [
                "Huge",
                "Tiny",
                "Tall",
                "Wide"
            ],
            correct: 1
        },

        {
            question:
                "Which word is a pronoun?",
            answers: [
                "Blue",
                "Run",
                "They",
                "House"
            ],
            correct: 2
        },

        {
            question:
                "Which word is a conjunction?",
            answers: [
                "And",
                "Quick",
                "House",
                "Jump"
            ],
            correct: 0
        },

        {
            question:
                "Which is the correct spelling?",
            answers: [
                "Because",
                "Becouse",
                "Becaus",
                "Becoz"
            ],
            correct: 0
        },

        {
            question:
                "Which word is an adverb?",
            answers: [
                "Quickly",
                "Blue",
                "House",
                "Dog"
            ],
            correct: 0
        },

        {
            question:
                "Which sentence is complete?",
            answers: [
                "Because the dog.",
                "Running through.",
                "The dog ran home.",
                "After school."
            ],
            correct: 2
        }

    ],


    // ========================================================
    // HISTORY
    // ========================================================

    History: [

        {
            question:
                "Which civilization built the pyramids at Giza?",
            answers: [
                "Romans",
                "Ancient Egyptians",
                "Vikings",
                "Greeks"
            ],
            correct: 1
        },

        {
            question:
                "Who was known as a medieval king?",
            answers: [
                "King Arthur",
                "Albert Einstein",
                "Neil Armstrong",
                "George Washington"
            ],
            correct: 0
        },

        {
            question:
                "Castles were especially common during the...",
            answers: [
                "Stone Age",
                "Middle Ages",
                "Space Age",
                "Ice Age"
            ],
            correct: 1
        },

        {
            question:
                "Which people are famous for longships?",
            answers: [
                "Vikings",
                "Romans",
                "Aztecs",
                "Samurai"
            ],
            correct: 0
        },

        {
            question:
                "Which ancient city was buried by Mount Vesuvius?",
            answers: [
                "Pompeii",
                "Athens",
                "Sparta",
                "Carthage"
            ],
            correct: 0
        },

        {
            question:
                "Knights were commonly associated with...",
            answers: [
                "Castles",
                "Spaceships",
                "Submarines",
                "Airplanes"
            ],
            correct: 0
        },

        {
            question:
                "Which civilization was based in ancient Rome?",
            answers: [
                "Roman",
                "Mayan",
                "Incan",
                "Egyptian"
            ],
            correct: 0
        },

        {
            question:
                "What was a medieval fortified building called?",
            answers: [
                "Castle",
                "Factory",
                "Skyscraper",
                "Laboratory"
            ],
            correct: 0
        },

        {
            question:
                "Which civilization built Machu Picchu?",
            answers: [
                "Roman",
                "Inca",
                "Viking",
                "Egyptian"
            ],
            correct: 1
        },

        {
            question:
                "Samurai were associated with which country?",
            answers: [
                "Japan",
                "France",
                "Egypt",
                "Brazil"
            ],
            correct: 0
        },

        {
            question:
                "What were Viking ships commonly called?",
            answers: [
                "Longships",
                "Caravans",
                "Galleons",
                "Triremes"
            ],
            correct: 0
        },

        {
            question:
                "Which empire was centered around Constantinople?",
            answers: [
                "Byzantine Empire",
                "Mali Empire",
                "Aztec Empire",
                "Mongol Empire"
            ],
            correct: 0
        },

        {
            question:
                "Which ancient people are associated with democracy in Athens?",
            answers: [
                "Greeks",
                "Vikings",
                "Mongols",
                "Romans"
            ],
            correct: 0
        }

    ],


    // ========================================================
    // SCIENCE
    // ========================================================

    Science: [

        {
            question:
                "What planet do we live on?",
            answers: [
                "Mars",
                "Venus",
                "Earth",
                "Jupiter"
            ],
            correct: 2
        },

        {
            question:
                "What gas do humans need to breathe?",
            answers: [
                "Oxygen",
                "Helium",
                "Carbon dioxide",
                "Hydrogen"
            ],
            correct: 0
        },

        {
            question:
                "What is H2O commonly called?",
            answers: [
                "Salt",
                "Water",
                "Oxygen",
                "Sugar"
            ],
            correct: 1
        },

        {
            question:
                "How many planets are in our Solar System?",
            answers: [
                "7",
                "8",
                "9",
                "10"
            ],
            correct: 1
        },

        {
            question:
                "What force pulls objects toward Earth?",
            answers: [
                "Magnetism",
                "Gravity",
                "Electricity",
                "Friction"
            ],
            correct: 1
        },

        {
            question:
                "Which organ pumps blood around the body?",
            answers: [
                "Brain",
                "Heart",
                "Lung",
                "Stomach"
            ],
            correct: 1
        },

        {
            question:
                "What star is closest to Earth?",
            answers: [
                "Sirius",
                "The Sun",
                "Polaris",
                "Betelgeuse"
            ],
            correct: 1
        },

        {
            question:
                "What do plants use to make food?",
            answers: [
                "Photosynthesis",
                "Digestion",
                "Evaporation",
                "Freezing"
            ],
            correct: 0
        },

        {
            question:
                "Which state of matter has a fixed shape?",
            answers: [
                "Gas",
                "Liquid",
                "Solid",
                "Plasma"
            ],
            correct: 2
        },

        {
            question:
                "What is Earth's natural satellite?",
            answers: [
                "Mars",
                "The Moon",
                "The Sun",
                "Venus"
            ],
            correct: 1
        },

        {
            question:
                "Which part of a plant absorbs water?",
            answers: [
                "Roots",
                "Flowers",
                "Fruit",
                "Seeds"
            ],
            correct: 0
        },

        {
            question:
                "What is the boiling point of water at sea level?",
            answers: [
                "50°C",
                "75°C",
                "100°C",
                "150°C"
            ],
            correct: 2
        },

        {
            question:
                "What gas do plants take in during photosynthesis?",
            answers: [
                "Oxygen",
                "Carbon dioxide",
                "Helium",
                "Hydrogen"
            ],
            correct: 1
        }

    ],


    // ========================================================
    // FUN FACTS
    // ========================================================

    "Fun Facts": [

        {
            question:
                "Which animal is known for saying 'oink'?",
            answers: [
                "Cow",
                "Pig",
                "Duck",
                "Horse"
            ],
            correct: 1
        },

        {
            question:
                "How many legs does a spider have?",
            answers: [
                "6",
                "7",
                "8",
                "10"
            ],
            correct: 2
        },

        {
            question:
                "Which one is the fastest land animal?",
            answers: [
                "Lion",
                "Horse",
                "Cheetah",
                "Wolf"
            ],
            correct: 2
        },

        {
            question:
                "How many days are in a week?",
            answers: [
                "5",
                "6",
                "7",
                "8"
            ],
            correct: 2
        },

        {
            question:
                "Which animal is famous for having a very long neck?",
            answers: [
                "Elephant",
                "Giraffe",
                "Rabbit",
                "Penguin"
            ],
            correct: 1
        },

        {
            question:
                "What color are emeralds usually?",
            answers: [
                "Blue",
                "Red",
                "Green",
                "Orange"
            ],
            correct: 2
        },

        {
            question:
                "How many sides does a triangle have?",
            answers: [
                "2",
                "3",
                "4",
                "5"
            ],
            correct: 1
        },

        {
            question:
                "Which animal is the largest land animal?",
            answers: [
                "Elephant",
                "Giraffe",
                "Rhino",
                "Hippo"
            ],
            correct: 0
        },

        {
            question:
                "How many colors are traditionally in a rainbow?",
            answers: [
                "5",
                "6",
                "7",
                "8"
            ],
            correct: 2
        },

        {
            question:
                "Which animal is known for building dams?",
            answers: [
                "Beaver",
                "Fox",
                "Tiger",
                "Eagle"
            ],
            correct: 0
        },

        {
            question:
                "Which bird is known for not being able to fly?",
            answers: [
                "Penguin",
                "Eagle",
                "Falcon",
                "Hawk"
            ],
            correct: 0
        },

        {
            question:
                "How many hearts does an octopus have?",
            answers: [
                "1",
                "2",
                "3",
                "4"
            ],
            correct: 2
        },

        {
            question:
                "Which animal is known for changing its color?",
            answers: [
                "Chameleon",
                "Horse",
                "Elephant",
                "Cow"
            ],
            correct: 0
        },

        {
            question:
                "Which animal is famous for black and white stripes?",
            answers: [
                "Zebra",
                "Lion",
                "Fox",
                "Bear"
            ],
            correct: 0
        }

    ],


    // ========================================================
    // ALL CORRECT
    // EVERY ANSWER IS CORRECT
    // ========================================================

    "All Correct": [

        {
            question:
                "Which of these are numbers?",
            answers: [
                "1",
                "2",
                "3",
                "4"
            ]
        },

        {
            question:
                "Which of these are colors?",
            answers: [
                "Red",
                "Blue",
                "Green",
                "Purple"
            ]
        },

        {
            question:
                "Which of these are animals?",
            answers: [
                "Dog",
                "Cat",
                "Horse",
                "Fox"
            ]
        },

        {
            question:
                "Which of these are ways to make 4?",
            answers: [
                "2 + 2",
                "1 + 3",
                "4",
                "8 ÷ 2"
            ]
        },

        {
            question:
                "Which of these are planets?",
            answers: [
                "Earth",
                "Mars",
                "Venus",
                "Jupiter"
            ]
        },

        {
            question:
                "Which of these are foods?",
            answers: [
                "Pizza",
                "Apple",
                "Bread",
                "Carrot"
            ]
        },

        {
            question:
                "Which of these are shapes?",
            answers: [
                "Circle",
                "Square",
                "Triangle",
                "Rectangle"
            ]
        },

        {
            question:
                "Which of these are forms of water?",
            answers: [
                "Ice",
                "Liquid Water",
                "Water Vapor",
                "Snow"
            ]
        },

        {
            question:
                "Which of these can be found in the sky?",
            answers: [
                "Sun",
                "Moon",
                "Clouds",
                "Stars"
            ]
        },

        {
            question:
                "Which of these are school subjects?",
            answers: [
                "Math",
                "Science",
                "History",
                "English"
            ]
        },

        {
            question:
                "Which of these are things you can read?",
            answers: [
                "Book",
                "Magazine",
                "Comic",
                "Newspaper"
            ]
        },

        {
            question:
                "Which of these are medieval things?",
            answers: [
                "Castle",
                "Knight",
                "Crown",
                "Sword"
            ]
        },

        {
            question:
                "Which of these are types of weather?",
            answers: [
                "Rain",
                "Snow",
                "Thunder",
                "Fog"
            ]
        },

        {
            question:
                "Which of these are rainbow colors?",
            answers: [
                "Red",
                "Green",
                "Blue",
                "Yellow"
            ]
        },

        {
            question:
                "Which of these are things found in a castle?",
            answers: [
                "Throne",
                "Tower",
                "Gate",
                "Crown"
            ]
        },

        {
            question:
                "Which of these animals can swim?",
            answers: [
                "Fish",
                "Dolphin",
                "Duck",
                "Seal"
            ]
        },

        {
            question:
                "Which of these can be used to write?",
            answers: [
                "Pencil",
                "Pen",
                "Marker",
                "Crayon"
            ]
        },

        {
            question:
                "Which of these are shapes with four sides?",
            answers: [
                "Square",
                "Rectangle",
                "Diamond",
                "Trapezoid"
            ]
        }

    ]

};


// ============================================================
// DOM HELPERS
// ============================================================

function $(id) {
    return document.getElementById(id);
}


function getMainContent() {
    return $("mainContent");
}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escapeJSString(value) {

    return String(value)
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'");

}


function showNotification(message) {

    let notification =
        $("blocketNotification");

    if (!notification) {

        notification =
            document.createElement("div");

        notification.id =
            "blocketNotification";

        notification.className =
            "blocket-notification";

        document.body.appendChild(
            notification
        );

    }

    notification.textContent =
        message;

    notification.classList.add(
        "show"
    );

    clearTimeout(
        notification._timeout
    );

    notification._timeout =
        setTimeout(
            () => {

                notification.classList.remove(
                    "show"
                );

            },
            2200
        );

}


// ============================================================
// START SCREEN
// ============================================================

function startBlocket() {

    const startScreen =
        $("startScreen");

    const app =
        $("app");

    if (startScreen) {
        startScreen.style.display =
            "none";
    }

    if (app) {
        app.style.display =
            "flex";
    }

    updatePlayerInfo();

    openTab(
        "market"
    );

}


function playAsGuest() {

    currentUser = null;

    isGuest = true;

    currentTheme =
        "classic";

    removeAllThemeClasses();

    resetGuestState();

    startBlocket();

    showNotification(
        "Playing as Guest — progress won't be saved."
    );

}


async function initializeBlocket() {

    const startScreen =
        $("startScreen");

    const app =
        $("app");

    if (app) {
        app.style.display =
            "none";
    }

    if (startScreen) {
        startScreen.style.display =
            "flex";
    }

    if (!supabaseClient) {

        console.warn(
            "Supabase library did not load."
        );

        return;
    }

    try {

        const {
            data: {
                session
            }
        } =
            await supabaseClient.auth.getSession();

        if (
            session &&
            session.user
        ) {

            currentUser =
                session.user;

            isGuest =
                false;

            loadGame();

            loadTheme();

            startBlocket();

        }

    } catch (error) {

        console.error(
            "Supabase session error:",
            error
        );

    }

    supabaseClient.auth.onAuthStateChange(
        (
            _event,
            session
        ) => {

            currentUser =
                session?.user ??
                null;

            if (currentUser) {

                isGuest =
                    false;

                loadGame();

                loadTheme();

                updatePlayerInfo();

            }

        }
    );

}


// ============================================================
// PLAYER INFO
// ============================================================

function updatePlayerInfo() {

    const coinsElement =
        $("coinDisplay");

    if (coinsElement) {

        coinsElement.textContent =
            `${gameState.coins} Coins`;

    }

    const accountButton =
        document.querySelector(
            ".account-button"
        );

    if (accountButton) {

        accountButton.textContent =
            isGuest
                ? "GUEST"
                : "ACCOUNT";

    }

}


// ============================================================
// TABS
// ============================================================

function openTab(tab) {

    currentTab =
        tab;

    const content =
        getMainContent();

    if (!content) {
        return;
    }

    document
        .querySelectorAll(
            ".menu-item"
        )
        .forEach(
            item => {

                item.classList.remove(
                    "active"
                );

            }
        );

    const activeItem =
        document.querySelector(
            `[data-tab="${tab}"]`
        );

    if (activeItem) {

        activeItem.classList.add(
            "active"
        );

    }

    if (
        tab ===
        "market"
    ) {

        renderMarket();

    }

    if (
        tab ===
        "blocks"
    ) {

        renderBlocks();

    }

    if (
        tab ===
        "news"
    ) {

        renderNews();

    }

    if (
        tab ===
        "solo"
    ) {

        renderSolo();

    }

    if (
        tab ===
        "settings"
    ) {

        renderSettings();

    }

    updatePlayerInfo();

}


// ============================================================
// MARKET
// ============================================================

function renderMarket() {

    const content =
        getMainContent();

    if (!content) {
        return;
    }

    let html = `

        <div class="page-header">

            <div>

                <h1>
                    MARKET
                </h1>

                <p>
                    Buy packs and discover new Blocks.
                </p>

            </div>

            <div class="market-coins">
                ${gameState.coins}
                Coins
            </div>

        </div>

        <div class="pack-grid">

    `;

    Object.values(
        packs
    ).forEach(
        pack => {

            const imageHTML =
                pack.image

                    ? `
                        <img
                            src="${pack.image}"
                            alt="${escapeHTML(
                                pack.name
                            )}"
                        >
                    `

                    : `
                        <div class="pack-placeholder">
                            ?
                        </div>
                    `;

            const safeName =
                escapeJSString(
                    pack.name
                );

            html += `

                <div class="pack-card">

                    <div class="pack-image">
                        ${imageHTML}
                    </div>

                    <h2>
                        ${escapeHTML(
                            pack.name
                        )}
                    </h2>

                    <p>
                        ${pack.rewards.length}
                        Blocks
                    </p>

                    <button
                        class="primary-button"
                        onclick="buyPack('${safeName}')"
                        type="button"
                    >
                        ${pack.price}
                        COINS
                    </button>

                    <button
                        class="secondary-button"
                        onclick="showPackContents('${safeName}')"
                        type="button"
                    >
                        VIEW CONTENTS
                    </button>

                </div>

            `;

        }
    );

    html += `
        </div>
    `;

    content.innerHTML =
        html;

}


function buyPack(packName) {

    const pack =
        packs[packName];

    if (!pack) {

        showNotification(
            "Pack not found."
        );

        return;
    }

    if (
        gameState.coins <
        pack.price
    ) {

        showNotification(
            "Not enough coins!"
        );

        return;
    }

    gameState.coins -=
        pack.price;

    currentPack =
        packName;

    const reward =
        getRandomReward(
            pack
        );

    saveGame();

    updatePlayerInfo();

    animateOpening(
        pack,
        reward
    );

}


function getRandomReward(
    pack
) {

    const roll =
        Math.random() *
        100;

    let cumulative =
        0;

    for (
        const reward
        of pack.rewards
    ) {

        cumulative +=
            reward.pullRate;

        if (
            roll <=
            cumulative
        ) {

            return reward;

        }

    }

    return pack.rewards[
        pack.rewards.length - 1
    ];

}


// ============================================================
// PACK CONTENTS
// ============================================================

function showPackContents(
    packName
) {

    const pack =
        packs[packName];

    if (!pack) {
        return;
    }

    const content =
        getMainContent();

    if (!content) {
        return;
    }

    let rows = "";

    pack.rewards.forEach(
        reward => {

            const image =
                reward.image

                    ? `
                        <img
                            src="${reward.image}"
                            alt="${escapeHTML(
                                reward.name
                            )}"
                        >
                    `

                    : `
                        <div class="mini-block-placeholder"></div>
                    `;

            rows += `

                <div class="reward-row">

                    <div class="reward-image">
                        ${image}
                    </div>

                    <div class="reward-name">
                        ${escapeHTML(
                            reward.name
                        )}
                    </div>

                    <div
                        class="
                            reward-rarity
                            rarity-${reward.rarity.toLowerCase()}
                        "
                    >
                        ${reward.rarity}
                    </div>

                    <div class="reward-rate">
                        ${reward.pullRate}%
                    </div>

                </div>

            `;

        }
    );

    content.innerHTML = `

        <div class="page-header">

            <div>

                <h1>
                    ${escapeHTML(
                        pack.name
                    )}
                </h1>

                <p>
                    Pack contents
                </p>

            </div>

            <button
                class="secondary-button"
                onclick="openTab('market')"
                type="button"
            >
                BACK
            </button>

        </div>

        <div class="reward-list">
            ${rows}
        </div>

    `;

}


// ============================================================
// PACK OPENING
// ============================================================

function animateOpening(
    pack,
    targetReward
) {

    const oldOverlay =
        $("openingOverlay");

    if (oldOverlay) {
        oldOverlay.remove();
    }

    const overlay =
        document.createElement("div");

    overlay.id =
        "openingOverlay";

    overlay.className =
        "opening-overlay opening-black";

    document.body.appendChild(
        overlay
    );

    const stages = [

        {
            rarity: "Common",
            className:
                "opening-common"
        },

        {
            rarity: "Uncommon",
            className:
                "opening-uncommon"
        },

        {
            rarity: "Rare",
            className:
                "opening-rare"
        },

        {
            rarity: "Epic",
            className:
                "opening-epic"
        },

        {
            rarity: "Legendary",
            className:
                "opening-legendary"
        },

        {
            rarity: "Chroma",
            className:
                "opening-chroma"
        },

        {
            rarity: "Mythical",
            className:
                "opening-mythical"
        }

    ];

    overlay.innerHTML = `

        <div class="opening-box">

            <div
                class="opening-rarity"
                id="openingRarity"
            >
                OPENING...
            </div>

            <div
                class="opening-block"
                id="openingBlock"
            >
                ?
            </div>

        </div>

    `;

    const rarityElement =
        $("openingRarity");

    const blockElement =
        $("openingBlock");

    let targetIndex =
        stages.findIndex(
            stage =>
                stage.rarity ===
                targetReward.rarity
        );

    if (
        targetReward.rarity ===
        "OG"
    ) {

        targetIndex =
            stages.length - 1;

    }

    if (
        targetIndex < 0
    ) {

        targetIndex = 0;

    }

    let stageIndex =
        -1;

    function nextStage() {

        stageIndex++;

        if (
            stageIndex >
            targetIndex
        ) {

            finishOpening();

            return;
        }

        const stage =
            stages[stageIndex];

        rarityElement.textContent =
            stage.rarity;

        overlay.className =
            `opening-overlay ${stage.className}`;

        setTimeout(
            nextStage,
            420
        );

    }

    function finishOpening() {

        overlay.className =
            "opening-overlay opening-final";

        if (
            targetReward.image
        ) {

            blockElement.innerHTML = `

                <img
                    src="${targetReward.image}"
                    alt="${escapeHTML(
                        targetReward.name
                    )}"
                >

            `;

        } else {

            blockElement.textContent =
                getRewardVisual(
                    targetReward
                );

        }

        rarityElement.textContent =
            targetReward.rarity ===
                "OG"
                ? "OG!"
                : targetReward.rarity;

        setTimeout(
            () => {

                addRewardToInventory(
                    targetReward
                );

                overlay.remove();

                showNotification(
                    `You got ${targetReward.name}!`
                );

                renderMarket();

            },
            1800
        );

    }

    setTimeout(
        nextStage,
        500
    );

}


function getRewardVisual(
    reward
) {

    const symbols = {

        Red: "🔴",
        Yellow: "🟡",
        Blue: "🔵",
        Purple: "🟣",
        Green: "🟢",
        Pink: "🩷",
        White: "⚪",
        Black: "⚫",
        Rainbow: "🌈"

    };

    return (
        symbols[reward.name] ||
        "⬛"
    );

}


// ============================================================
// BLOCK COLLECTION
// ============================================================

function addRewardToInventory(
    reward
) {

    gameState.inventory.push({

        name:
            reward.name,

        rarity:
            reward.rarity,

        image:
            reward.image ??
            null,

        obtained:
            Date.now()

    });

    saveGame();

}


function renderBlocks() {

    const content =
        getMainContent();

    if (!content) {
        return;
    }

    let html = `

        <div class="page-header">

            <div>

                <h1>
                    BLOCKS
                </h1>

                <p>
                    Your collection of Blocks.
                </p>

            </div>

            <div class="market-coins">
                ${gameState.inventory.length}
                Blocks
            </div>

        </div>

    `;

    if (
        gameState.inventory.length ===
        0
    ) {

        html += `

            <div class="empty-state">

                <div class="empty-icon">
                    📦
                </div>

                <h2>
                    No Blocks Yet
                </h2>

                <p>
                    Buy a pack in the Market
                    to start collecting.
                </p>

                <button
                    class="primary-button"
                    onclick="openTab('market')"
                    type="button"
                >
                    GO TO MARKET
                </button>

            </div>

        `;

        content.innerHTML =
            html;

        return;
    }

    html += `
        <div class="block-grid">
    `;

    gameState.inventory.forEach(
        (
            block,
            index
        ) => {

            const imageHTML =
                block.image

                    ? `
                        <img
                            src="${block.image}"
                            alt="${escapeHTML(
                                block.name
                            )}"
                        >
                    `

                    : `
                        <div class="block-placeholder">
                            ${getRewardVisual(
                                block
                            )}
                        </div>
                    `;

            const equipped =
                gameState.equipped &&
                gameState.equipped.name ===
                    block.name
                    ? "equipped"
                    : "";

            html += `

                <div
                    class="
                        block-card
                        ${equipped}
                    "
                >

                    <div
                        class="block-card-image"
                    >
                        ${imageHTML}
                    </div>

                    <h3>
                        ${escapeHTML(
                            block.name
                        )}
                    </h3>

                    <div
                        class="
                            rarity-badge
                            rarity-${block.rarity.toLowerCase()}
                        "
                    >
                        ${block.rarity}
                    </div>

                    <button
                        class="primary-button"
                        onclick="equipBlock(${index})"
                        type="button"
                    >
                        ${
                            equipped
                                ? "EQUIPPED"
                                : "EQUIP"
                        }
                    </button>

                    <button
                        class="sell-button"
                        onclick="sellBlock(${index})"
                        type="button"
                    >
                        SELL FOR
                        ${getSellValue(
                            block.rarity
                        )}
                        COINS
                    </button>

                </div>

            `;

        }
    );

    html += `
        </div>
    `;

    content.innerHTML =
        html;

}


function equipBlock(
    index
) {

    const block =
        gameState.inventory[
            index
        ];

    if (!block) {
        return;
    }

    gameState.equipped =
        block;

    saveGame();

    updatePlayerInfo();

    renderBlocks();

    showNotification(
        `${block.name} equipped!`
    );

}


function getSellValue(
    rarity
) {

    return (
        rarityValues[
            rarity
        ] ??
        0
    );

}


function sellBlock(
    index
) {

    const block =
        gameState.inventory[
            index
        ];

    if (!block) {
        return;
    }

    const value =
        getSellValue(
            block.rarity
        );

    gameState.coins +=
        value;

    gameState.inventory.splice(
        index,
        1
    );

    if (
        gameState.equipped &&
        gameState.equipped.name ===
            block.name
    ) {

        gameState.equipped =
            null;

    }

    saveGame();

    updatePlayerInfo();

    renderBlocks();

    showNotification(
        `Sold ${block.name} for ${value} coins.`
    );

}


// ============================================================
// HIDDEN BLOCKS
// ============================================================

function getHiddenBlock(
    name
) {

    return hiddenBlocks.find(
        block =>
            block.name ===
            name
    );

}


function discoverHiddenBlock(
    name
) {

    const hidden =
        getHiddenBlock(
            name
        );

    if (!hidden) {
        return;
    }

    const alreadyHave =
        gameState.inventory.some(
            block =>
                block.name ===
                hidden.name
        );

    if (alreadyHave) {

        showNotification(
            "You already found this Block!"
        );

        return;
    }

    gameState.inventory.push({

        name:
            hidden.name,

        rarity:
            hidden.rarity,

        image:
            hidden.image,

        obtained:
            Date.now()

    });

    saveGame();

    showNotification(
        `HIDDEN DISCOVERY: ${hidden.name}!`
    );

    if (
        currentTab ===
        "blocks"
    ) {

        renderBlocks();

    }

}


// ============================================================
// NEWS
// ============================================================

function renderNews() {

    const content =
        getMainContent();

    if (!content) {
        return;
    }

    let html = `

        <div class="page-header">

            <div>

                <h1>
                    NEWS
                </h1>

                <p>
                    Update logs, new features,
                    and Blocket news.
                </p>

            </div>

        </div>

        <div class="news-list">

    `;

    newsItems.forEach(
        (
            item,
            index
        ) => {

            html += `

                <div class="news-card">

                    <div class="news-meta">

                        <span class="news-date">
                            ${escapeHTML(
                                item.date
                            )}
                        </span>

                        <span class="news-version">
                            ${escapeHTML(
                                item.version
                            )}
                        </span>

                    </div>

                    <h2>
                        ${escapeHTML(
                            item.title
                        )}
                    </h2>

                    <p>
                        ${escapeHTML(
                            item.text
                        )}
                    </p>

                    <button
                        class="
                            secondary-button
                            news-details-button
                        "
                        onclick="showUpdateDetails(${index})"
                        type="button"
                    >
                        MORE INFO
                    </button>

                </div>

            `;

        }
    );

    html += `
        </div>
    `;

    content.innerHTML =
        html;

}


function showUpdateDetails(
    index
) {

    const item =
        newsItems[
            index
        ];

    if (!item) {
        return;
    }

    const content =
        getMainContent();

    if (!content) {
        return;
    }

    const detailsHTML =
        item.details
            .map(
                detail =>
                    `
                        <li>
                            ${escapeHTML(
                                detail
                            )}
                        </li>
                    `
            )
            .join("");

    content.innerHTML = `

        <div class="page-header">

            <div>

                <div class="news-meta">

                    <span class="news-date">
                        ${escapeHTML(
                            item.date
                        )}
                    </span>

                    <span class="news-version">
                        ${escapeHTML(
                            item.version
                        )}
                    </span>

                </div>

                <h1>
                    ${escapeHTML(
                        item.title
                    )}
                </h1>

            </div>

            <button
                class="secondary-button"
                onclick="renderNews()"
                type="button"
            >
                BACK
            </button>

        </div>

        <div class="update-details-card">

            <p>
                ${escapeHTML(
                    item.text
                )}
            </p>

            <h2>
                What's New?
            </h2>

            <ul>
                ${detailsHTML}
            </ul>

        </div>

    `;

}


// ============================================================
// SOLO
// ============================================================

function renderSolo() {

    soloSession.active =
        false;

    currentQuestion =
        null;

    currentQuestionPool =
        [];

    previousQuestion =
        null;

    const content =
        getMainContent();

    if (!content) {
        return;
    }

    const subjects =
        Object.keys(
            soloQuestions
        );

    let buttons = "";

    subjects.forEach(
        subject => {

            const safeSubject =
                escapeJSString(
                    subject
                );

            let description;

            if (
                subject ===
                "All Correct"
            ) {

                description =
                    "EVERY ANSWER IS CORRECT • +2 COINS PER CLICK";

            } else {

                description =
                    `${soloQuestions[subject].length} questions • +2 Coins per correct answer`;

            }

            buttons += `

                <button
                    class="subject-button"
                    onclick="startSolo('${safeSubject}')"
                    type="button"
                >

                    <strong>
                        ${escapeHTML(
                            subject
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            description
                        )}
                    </span>

                </button>

            `;

        }
    );

    content.innerHTML = `

        <div class="page-header">

            <div>

                <h1>
                    SOLO
                </h1>

                <p>
                    Study for as long as you want.
                    Stop whenever you're ready.
                </p>

            </div>

        </div>

        <div class="subject-grid">
            ${buttons}
        </div>

        <div class="study-info-card">

            <h2>
                📚 How Study Works
            </h2>

            <p>
                Choose a subject and keep answering
                questions forever.
            </p>

            <p>
                Normal subjects give
                <strong>+2 Coins</strong>
                for every correct answer.
            </p>

            <p>
                <strong>All Correct</strong> is special:
                every answer is correct.
            </p>

            <p>
                You can stop your study session
                whenever you want.
            </p>

        </div>

    `;

}


function startSolo(
    subject
) {

    if (
        !soloQuestions[
            subject
        ]
    ) {

        showNotification(
            "Subject not found."
        );

        return;
    }

    currentSoloSubject =
        subject;

    currentQuestionPool =
        [
            ...soloQuestions[
                subject
            ]
        ];

    shuffleArray(
        currentQuestionPool
    );

    previousQuestion =
        null;

    soloSession = {

        active: true,

        questionsAnswered: 0,

        correctAnswers: 0,

        coinsEarned: 0

    };

    nextSoloQuestion();

}


function nextSoloQuestion() {

    if (
        !soloSession.active
    ) {

        renderSolo();

        return;
    }

    const content =
        getMainContent();

    if (!content) {
        return;
    }

    // Refill forever
    if (
        currentQuestionPool.length ===
        0
    ) {

        currentQuestionPool =
            [
                ...soloQuestions[
                    currentSoloSubject
                ]
            ];

        shuffleArray(
            currentQuestionPool
        );

        if (
            previousQuestion &&
            currentQuestionPool.length >
                1 &&
            currentQuestionPool[0] ===
                previousQuestion
        ) {

            [
                currentQuestionPool[0],
                currentQuestionPool[1]
            ] = [
                currentQuestionPool[1],
                currentQuestionPool[0]
            ];

        }

    }

    currentQuestion =
        currentQuestionPool.pop();

    previousQuestion =
        currentQuestion;

    const answerColors = [

        "answer-red",
        "answer-yellow",
        "answer-green",
        "answer-blue"

    ];

    let answerButtons =
        "";

    currentQuestion.answers.forEach(
        (
            answer,
            index
        ) => {

            answerButtons += `

                <button
                    class="
                        answer-button
                        ${answerColors[index]}
                    "
                    onclick="submitSoloAnswer(${index})"
                    type="button"
                >
                    ${escapeHTML(
                        answer
                    )}
                </button>

            `;

        }
    );

    const allCorrect =
        currentSoloSubject ===
        "All Correct";

    content.innerHTML = `

        <div class="solo-header">

            <button
                class="secondary-button"
                onclick="stopSolo()"
                type="button"
            >
                STOP STUDYING
            </button>

            <div class="solo-subject-name">

                ${
                    allCorrect
                        ? "🔥 ALL CORRECT"
                        : `📚 ${escapeHTML(
                            currentSoloSubject
                        )}`
                }

            </div>

            <div class="solo-stats">

                ${
                    soloSession.questionsAnswered
                }
                Answered
                •
                ${
                    soloSession.correctAnswers
                }
                Correct
                •
                ${
                    soloSession.coinsEarned
                }
                Session Coins
                •
                ${
                    gameState.coins
                }
                Total Coins

            </div>

        </div>

        <div class="question-card">

            <div class="question-number">

                Question
                ${
                    soloSession.questionsAnswered +
                    1
                }

                ${
                    allCorrect
                        ? " • EVERY ANSWER IS CORRECT"
                        : ""
                }

            </div>

            <h1>
                ${escapeHTML(
                    currentQuestion.question
                )}
            </h1>

            <div class="answers-grid">
                ${answerButtons}
            </div>

        </div>

    `;

}


function submitSoloAnswer(
    answerIndex
) {

    if (
        !currentQuestion ||
        !soloSession.active
    ) {

        return;
    }

    soloSession.questionsAnswered++;

    gameState.questionsAnswered++;

    let isCorrect =
        false;

    // ALL CORRECT
    if (
        currentSoloSubject ===
        "All Correct"
    ) {

        isCorrect =
            true;

    } else {

        isCorrect =
            Number(answerIndex) ===
            Number(
                currentQuestion.correct
            );

    }

    if (isCorrect) {

        soloSession.correctAnswers++;

        soloSession.coinsEarned +=
            2;

        gameState.correctAnswers++;

        gameState.coins +=
            2;

        if (
            currentSoloSubject ===
            "All Correct"
        ) {

            showNotification(
                "+2 COINS! ✅"
            );

        } else {

            showNotification(
                "+2 Coins! Correct! ✅"
            );

        }

    } else {

        showNotification(
            "Incorrect!"
        );

    }

    saveGame();

    updatePlayerInfo();

    setTimeout(
        () => {

            if (
                soloSession.active
            ) {

                nextSoloQuestion();

            }

        },
        currentSoloSubject ===
            "All Correct"
            ? 180
            : 550
    );

}


function stopSolo() {

    if (
        !soloSession.active
    ) {

        renderSolo();

        return;
    }

    const questions =
        soloSession.questionsAnswered;

    const correct =
        soloSession.correctAnswers;

    const coins =
        soloSession.coinsEarned;

    const subject =
        currentSoloSubject;

    soloSession.active =
        false;

    currentQuestion =
        null;

    currentQuestionPool =
        [];

    previousQuestion =
        null;

    const content =
        getMainContent();

    if (!content) {
        return;
    }

    const safeSubject =
        escapeJSString(
            subject
        );

    content.innerHTML = `

        <div class="study-finished-card">

            <div class="study-finished-icon">
                📚
            </div>

            <h1>
                Study Session Complete!
            </h1>

            <p>
                You stopped whenever you
                decided you were ready.
            </p>

            <div class="study-results">

                <div>

                    <strong>
                        ${questions}
                    </strong>

                    <span>
                        Questions
                    </span>

                </div>

                <div>

                    <strong>
                        ${correct}
                    </strong>

                    <span>
                        Correct
                    </span>

                </div>

                <div>

                    <strong>
                        ${coins}
                    </strong>

                    <span>
                        Coins Earned
                    </span>

                </div>

            </div>

            <div class="study-finished-buttons">

                <button
                    class="primary-button"
                    onclick="startSolo('${safeSubject}')"
                    type="button"
                >
                    STUDY AGAIN
                </button>

                <button
                    class="secondary-button"
                    onclick="renderSolo()"
                    type="button"
                >
                    CHOOSE SUBJECT
                </button>

            </div>

        </div>

    `;

    saveGame();

    updatePlayerInfo();

}


// ============================================================
// THEMES
// ============================================================

const blocketThemes = {

    classic: {

        name:
            "Classic Purple",

        description:
            "The original Blocket look.",

        className:
            ""

    },

    ruby: {

        name:
            "Ruby Red",

        description:
            "A strong red theme.",

        className:
            "theme-ruby"

    },

    ocean: {

        name:
            "Ocean Blue",

        description:
            "A cool blue theme.",

        className:
            "theme-ocean"

    },

    forest: {

        name:
            "Forest Green",

        description:
            "A natural green theme.",

        className:
            "theme-forest"

    },

    golden: {

        name:
            "Golden",

        description:
            "A bright golden theme.",

        className:
            "theme-golden"

    },

    midnight: {

        name:
            "Midnight",

        description:
            "A darker Blocket theme.",

        className:
            "theme-midnight"

    },

    oneRed: {

        name:
            "One Color Red",

        description:
            "A red-focused theme.",

        className:
            "theme-one-red"

    },

    oneBlue: {

        name:
            "One Color Blue",

        description:
            "A blue-focused theme.",

        className:
            "theme-one-blue"

    },

    oneGreen: {

        name:
            "One Color Green",

        description:
            "A green-focused theme.",

        className:
            "theme-one-green"

    },

    onePurple: {

        name:
            "One Color Purple",

        description:
            "A purple-focused theme.",

        className:
            "theme-one-purple"

    }

};


function removeAllThemeClasses() {

    Object.values(
        blocketThemes
    ).forEach(
        theme => {

            if (
                theme.className
            ) {

                document.body.classList.remove(
                    theme.className
                );

            }

        }
    );

}


function renderSettings() {

    const content =
        getMainContent();

    if (!content) {
        return;
    }

    let html = `

        <div class="page-header">

            <div>

                <h1>
                    SETTINGS
                </h1>

                <p>
                    Change your Blocket theme.
                    Every theme is free.
                </p>

            </div>

        </div>

        <div class="settings-section">

            <div class="settings-section-header">

                <h2>
                    🎨 FREE THEMES
                </h2>

                <span>
                    ${
                        Object.keys(
                            blocketThemes
                        ).length
                    }
                    available
                </span>

            </div>

            <div class="theme-grid">

    `;

    Object.entries(
        blocketThemes
    ).forEach(
        (
            [
                id,
                theme
            ]
        ) => {

            const selected =
                currentTheme === id
                    ? "selected"
                    : "";

            html += `

                <button
                    class="
                        theme-card
                        ${selected}
                    "
                    onclick="setTheme('${id}')"
                    type="button"
                >

                    <div class="theme-preview">

                        <div
                            class="
                                theme-preview-top
                                ${theme.className}
                            "
                        ></div>

                        <div
                            class="
                                theme-preview-body
                                ${theme.className}
                            "
                        >

                            <div class="theme-preview-box"></div>

                            <div class="theme-preview-box"></div>

                            <div class="theme-preview-box"></div>

                        </div>

                    </div>

                    <div class="theme-card-info">

                        <strong>
                            ${escapeHTML(
                                theme.name
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                theme.description
                            )}
                        </span>

                    </div>

                    ${
                        selected

                            ? `
                                <div class="theme-selected">
                                    ✓ SELECTED
                                </div>
                            `

                            : `
                                <div class="theme-free">
                                    FREE
                                </div>
                            `
                    }

                </button>

            `;

        }
    );

    html += `

            </div>

        </div>

        <div class="settings-info">

            <h2>
                ⚙️ YOUR SETTINGS
            </h2>

            <p>
                Current theme:
                <strong>
                    ${escapeHTML(
                        blocketThemes[
                            currentTheme
                        ].name
                    )}
                </strong>
            </p>

            ${
                isGuest

                    ? `
                        <p>
                            You're playing as a guest,
                            so your theme resets when
                            you leave.
                        </p>
                    `

                    : `
                        <p>
                            Your selected theme is saved
                            to your account.
                        </p>
                    `
            }

        </div>

    `;

    content.innerHTML =
        html;

}


function setTheme(
    themeId
) {

    const theme =
        blocketThemes[
            themeId
        ];

    if (!theme) {
        return;
    }

    currentTheme =
        themeId;

    removeAllThemeClasses();

    if (
        theme.className
    ) {

        document.body.classList.add(
            theme.className
        );

    }

    if (
        currentUser &&
        !isGuest
    ) {

        try {

            localStorage.setItem(
                `blocket_theme_${currentUser.id}`,
                themeId
            );

        } catch (error) {

            console.error(
                "Could not save theme:",
                error
            );

        }

    }

    showNotification(
        `${theme.name} selected!`
    );

    if (
        currentTab ===
        "settings"
    ) {

        renderSettings();

    }

}


function loadTheme() {

    removeAllThemeClasses();

    if (
        !currentUser ||
        isGuest
    ) {

        currentTheme =
            "classic";

        return;
    }

    try {

        const savedTheme =
            localStorage.getItem(
                `blocket_theme_${currentUser.id}`
            );

        if (
            savedTheme &&
            blocketThemes[
                savedTheme
            ]
        ) {

            currentTheme =
                savedTheme;

        } else {

            currentTheme =
                "classic";

        }

    } catch (error) {

        console.error(
            "Could not load theme:",
            error
        );

        currentTheme =
            "classic";

    }

    const theme =
        blocketThemes[
            currentTheme
        ];

    if (
        theme &&
        theme.className
    ) {

        document.body.classList.add(
            theme.className
        );

    }

}


// ============================================================
// ACCOUNT
// ============================================================

function openAccount() {

    const overlay =
        $("accountOverlay");

    if (!overlay) {
        return;
    }

    overlay.classList.add(
        "show"
    );

    if (currentUser) {

        renderLoggedInAccount();

    } else if (isGuest) {

        renderGuestAccount();

    } else {

        renderAccountMenu();

    }

}


function closeAccount() {

    const overlay =
        $("accountOverlay");

    if (!overlay) {
        return;
    }

    overlay.classList.remove(
        "show"
    );

}


function renderAccountMenu() {

    const accountContent =
        $("accountContent");

    if (!accountContent) {
        return;
    }

    accountContent.innerHTML = `

        <h2>
            ACCOUNT
        </h2>

        <button
            class="account-main-button"
            onclick="showLogin()"
            type="button"
        >
            LOG IN
        </button>

        <button
            class="account-main-button"
            onclick="showSignup()"
            type="button"
        >
            SIGN UP
        </button>

    `;

}


function renderGuestAccount() {

    const accountContent =
        $("accountContent");

    if (!accountContent) {
        return;
    }

    accountContent.innerHTML = `

        <h2>
            GUEST
        </h2>

        <p>
            You are playing as a guest.
            Your progress will not be saved.
        </p>

        <button
            class="account-main-button"
            onclick="showLogin()"
            type="button"
        >
            LOG IN
        </button>

        <button
            class="account-main-button"
            onclick="showSignup()"
            type="button"
        >
            CREATE ACCOUNT
        </button>

    `;

}


function renderLoggedInAccount() {

    const accountContent =
        $("accountContent");

    if (!accountContent) {
        return;
    }

    const email =
        currentUser?.email ||
        "Logged in";

    accountContent.innerHTML = `

        <h2>
            ACCOUNT
        </h2>

        <p>
            ${escapeHTML(
                email
            )}
        </p>

        <p>
            ${gameState.coins}
            Coins
        </p>

        <p>
            ${gameState.inventory.length}
            Blocks
        </p>

        <button
            class="account-main-button"
            onclick="logout()"
            type="button"
        >
            LOG OUT
        </button>

    `;

}


// ============================================================
// LOGIN
// ============================================================

function showLogin() {

    const accountContent =
        $("accountContent");

    if (!accountContent) {
        return;
    }

    accountContent.innerHTML = `

        <h2>
            LOG IN
        </h2>

        <input
            id="loginEmail"
            class="account-input"
            type="email"
            placeholder="Email"
            autocomplete="email"
        >

        <input
            id="loginPassword"
            class="account-input"
            type="password"
            placeholder="Password"
            autocomplete="current-password"
        >

        <button
            class="account-main-button"
            onclick="login()"
            type="button"
        >
            LOG IN
        </button>

        <button
            class="account-secondary-button"
            onclick="renderAccountMenu()"
            type="button"
        >
            BACK
        </button>

    `;

}


// ============================================================
// SIGNUP FORM
// ============================================================

function showSignup() {

    const accountContent =
        $("accountContent");

    if (!accountContent) {
        return;
    }

    accountContent.innerHTML = `

        <h2>
            SIGN UP
        </h2>

        <input
            id="signupEmail"
            class="account-input"
            type="email"
            placeholder="Email"
            autocomplete="email"
        >

        <input
            id="signupPassword"
            class="account-input"
            type="password"
            placeholder="Password"
            autocomplete="new-password"
        >

        <button
            class="account-main-button"
            onclick="signup()"
            type="button"
        >
            SIGN UP
        </button>

        <button
            class="account-secondary-button"
            onclick="renderAccountMenu()"
            type="button"
        >
            BACK
        </button>

    `;

}


// ============================================================
// LOGIN ACTION
// ============================================================

async function login() {

    if (!supabaseClient) {

        showNotification(
            "Supabase failed to load."
        );

        return;
    }

    const email =
        $("loginEmail")
            ?.value
            .trim();

    const password =
        $("loginPassword")
            ?.value;

    if (
        !email ||
        !password
    ) {

        showNotification(
            "Enter your email and password."
        );

        return;
    }

    try {

        const result =
            await supabaseClient.auth.signInWithPassword({

                email:
                    email,

                password:
                    password

            });

        const {
            data,
            error
        } = result;

        if (error) {

            console.error(
                "Supabase login error:",
                error
            );

            showNotification(
                error.message ||
                "Login failed."
            );

            return;
        }

        currentUser =
            data.user;

        isGuest =
            false;

        loadGame();

        loadTheme();

        saveGame();

        closeAccount();

        startBlocket();

        showNotification(
            "Logged in!"
        );

    } catch (error) {

        console.error(
            "BLOCKET LOGIN ERROR:",
            error
        );

        showNotification(
            "Could not connect to Supabase."
        );

    }

}


// ============================================================
// SIGNUP ACTION
// ============================================================

async function signup() {

    const email =
        $("signupEmail")
            ?.value
            .trim();

    const password =
        $("signupPassword")
            ?.value;

    if (
        !email ||
        !password
    ) {

        showNotification(
            "Enter your email and password."
        );

        return;
    }

    if (
        password.length <
        6
    ) {

        showNotification(
            "Password must be at least 6 characters."
        );

        return;
    }

    if (!supabaseClient) {

        showNotification(
            "Supabase failed to load."
        );

        console.error(
            "supabaseClient is null."
        );

        return;
    }

    try {

        console.log(
            "Starting Blocket signup..."
        );

        console.log(
            "Supabase URL:",
            SUPABASE_URL
        );

        const result =
            await supabaseClient.auth.signUp({

                email:
                    email,

                password:
                    password

            });

        console.log(
            "Supabase signup result:",
            result
        );

        const {
            data,
            error
        } = result;

        if (error) {

            console.error(
                "Supabase signup error:",
                error
            );

            showNotification(
                error.message ||
                "Signup failed."
            );

            return;
        }

        if (
            !data ||
            !data.user
        ) {

            showNotification(
                "Account created. Check your email to confirm it."
            );

            return;
        }

        currentUser =
            data.user;

        isGuest =
            false;

        gameState = {

            coins: 100,

            inventory: [],

            equipped: null,

            questionsAnswered: 0,

            correctAnswers: 0

        };

        saveGame();

        showNotification(
            "Account created!"
        );

        setTimeout(
            () => {

                closeAccount();

                startBlocket();

            },
            700
        );

    } catch (error) {

        console.error(
            "BLOCKET SIGNUP CRASH:",
            error
        );

        console.error(
            "Error name:",
            error?.name
        );

        console.error(
            "Error message:",
            error?.message
        );

        showNotification(
            "Could not connect to Supabase."
        );

    }

}


// ============================================================
// LOGOUT
// ============================================================

async function logout() {

    try {

        if (supabaseClient) {

            await supabaseClient.auth.signOut();

        }

    } catch (error) {

        console.error(
            "Sign out error:",
            error
        );

    }

    currentUser =
        null;

    isGuest =
        true;

    currentTheme =
        "classic";

    removeAllThemeClasses();

    resetGuestState();

    soloSession.active =
        false;

    closeAccount();

    const app =
        $("app");

    const startScreen =
        $("startScreen");

    if (app) {

        app.style.display =
            "none";

    }

    if (startScreen) {

        startScreen.style.display =
            "flex";

    }

    showNotification(
        "Logged out."
    );

}


// ============================================================
// SEARCH
// ============================================================

function searchBlocks(
    query
) {

    const search =
        String(
            query || ""
        )
            .trim()
            .toLowerCase();

    if (!search) {

        renderBlocks();

        return;
    }

    const content =
        getMainContent();

    if (!content) {
        return;
    }

    const results =
        gameState.inventory.filter(
            block =>
                block.name
                    .toLowerCase()
                    .includes(
                        search
                    )
        );

    let html = `

        <div class="page-header">

            <div>

                <h1>
                    BLOCKS
                </h1>

                <p>
                    Search results for
                    "${escapeHTML(
                        query
                    )}"
                </p>

            </div>

            <button
                class="secondary-button"
                onclick="renderBlocks()"
                type="button"
            >
                CLEAR
            </button>

        </div>

    `;

    if (
        results.length ===
        0
    ) {

        html += `

            <div class="empty-state">

                <div class="empty-icon">
                    🔎
                </div>

                <h2>
                    No Blocks Found
                </h2>

            </div>

        `;

        content.innerHTML =
            html;

        return;
    }

    html += `
        <div class="block-grid">
    `;

    results.forEach(
        block => {

            const imageHTML =
                block.image

                    ? `
                        <img
                            src="${block.image}"
                            alt="${escapeHTML(
                                block.name
                            )}"
                        >
                    `

                    : `
                        <div class="block-placeholder">
                            ${getRewardVisual(
                                block
                            )}
                        </div>
                    `;

            const originalIndex =
                gameState.inventory.indexOf(
                    block
                );

            html += `

                <div class="block-card">

                    <div class="block-card-image">
                        ${imageHTML}
                    </div>

                    <h3>
                        ${escapeHTML(
                            block.name
                        )}
                    </h3>

                    <div
                        class="
                            rarity-badge
                            rarity-${block.rarity.toLowerCase()}
                        "
                    >
                        ${block.rarity}
                    </div>

                    <button
                        class="primary-button"
                        onclick="equipBlock(${originalIndex})"
                        type="button"
                    >
                        EQUIP
                    </button>

                </div>

            `;

        }
    );

    html += `
        </div>
    `;

    content.innerHTML =
        html;

}


// ============================================================
// KEYBOARD
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeAccount();

            const opening =
                $("openingOverlay");

            if (opening) {

                opening.remove();

            }

        }

    }
);


// ============================================================
// NAVIGATION SETUP
// ============================================================

function setupNavigation() {

    document
        .querySelectorAll(
            ".menu-item"
        )
        .forEach(
            item => {

                item.addEventListener(
                    "click",
                    () => {

                        const tab =
                            item.dataset.tab;

                        if (tab) {

                            openTab(
                                tab
                            );

                        }

                    }
                );

            }
        );
}


// ============================================================
// START BUTTON SETUP
// ============================================================

function setupStartButtons() {

    const loginButton =
        $("startLoginButton");

    const guestButton =
        $("guestButton");

    if (loginButton) {

        loginButton.addEventListener(
            "click",
            () => {

                openAccount();

                showLogin();

            }
        );

    }

    if (guestButton) {

        guestButton.addEventListener(
            "click",
            playAsGuest
        );

    }

}


// ============================================================
// WINDOW EXPORTS
// ============================================================

window.startBlocket =
    startBlocket;

window.playAsGuest =
    playAsGuest;

window.openTab =
    openTab;

window.buyPack =
    buyPack;

window.showPackContents =
    showPackContents;

window.getRandomReward =
    getRandomReward;

window.renderMarket =
    renderMarket;

window.renderBlocks =
    renderBlocks;

window.renderNews =
    renderNews;

window.showUpdateDetails =
    showUpdateDetails;

window.renderSolo =
    renderSolo;

window.startSolo =
    startSolo;

window.nextSoloQuestion =
    nextSoloQuestion;

window.submitSoloAnswer =
    submitSoloAnswer;

window.stopSolo =
    stopSolo;

window.equipBlock =
    equipBlock;

window.sellBlock =
    sellBlock;

window.searchBlocks =
    searchBlocks;

window.discoverHiddenBlock =
    discoverHiddenBlock;

window.renderSettings =
    renderSettings;

window.setTheme =
    setTheme;

window.openAccount =
    openAccount;

window.closeAccount =
    closeAccount;

window.showLogin =
    showLogin;

window.showSignup =
    showSignup;

window.login =
    login;

window.signup =
    signup;

window.logout =
    logout;


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupNavigation();

        setupStartButtons();

        initializeBlocket();

    }
);