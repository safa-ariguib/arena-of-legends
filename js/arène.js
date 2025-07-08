function goFullScreen() {
    const fullscreenIcon = document.querySelector('.fullscreen-btn i');

    if (!document.fullscreenElement) {
        const requestFullscreen = document.documentElement.requestFullscreen ||
            document.documentElement.mozRequestFullScreen ||
            document.documentElement.webkitRequestFullscreen ||
            document.documentElement.msRequestFullscreen;
        requestFullscreen.call(document.documentElement);
        fullscreenIcon.className = 'fas fa-compress';
    } else {
        const exitFullscreen = document.exitFullscreen ||
            document.mozCancelFullScreen ||
            document.webkitExitFullscreen ||
            document.msExitFullscreen;
        exitFullscreen.call(document);
        fullscreenIcon.className = 'fas fa-expand';
    }
}
function startGame() {
    let allPlayersReady = true;
    gameConfig.players = [];

    for (let i = 1; i <= gameConfig.playerCount; i++) {
        const playerSetup = i <= 2
            ? document.querySelector(`#playerSetups .player-setup:nth-child(${i})`)
            : document.getElementById(`player${i}Setup`);

        const selectedHero = playerSetup.querySelector(".hero-option.selected");
        if (!selectedHero) {
            allPlayersReady = false;
            console.log(`Joueur ${i} n'a pas sélectionné de héros`);
            break;
        }
        const heroType = selectedHero.dataset.hero;
        const playerColor = playerColors[i - 1];

        gameConfig.players.push({
            id: i,
            name: `Joueur ${i}`,
            avatarUrl: `avatar${i}.jpg`,
            hero: heroType,
            color: playerColor,
            position: getStartPosition(i, gameConfig.playerCount),
            stats: { ...heroStats[heroType] },
            status: {
                isDefending: false,
                isDodging: false,
                specialActive: false
            },
            diceRoll: 0
        });
    }

    if (!allPlayersReady) {
        alert("Chaque joueur doit sélectionner un héros !");
        return;
    }

    setupScreen.style.display = "none";
    document.getElementById("diceRollScreen").style.display = "block";
    startDiceRoll();
}

function goFullScreen() {
    const fullscreenIcon = document.querySelector('.fullscreen-btn i');

    if (!document.fullscreenElement) {
        const requestFullscreen = document.documentElement.requestFullscreen ||
            document.documentElement.mozRequestFullScreen ||
            document.documentElement.webkitRequestFullscreen ||
            document.documentElement.msRequestFullscreen;
        requestFullscreen.call(document.documentElement);
        fullscreenIcon.className = 'fas fa-compress';
    } else {
        const exitFullscreen = document.exitFullscreen ||
            document.mozCancelFullScreen ||
            document.webkitExitFullscreen ||
            document.msExitFullscreen;
        exitFullscreen.call(document);
        fullscreenIcon.className = 'fas fa-expand';
    }
}
let gameConfig = {
    boardSize: 7,
    playerCount: 2,
    currentTurn: 1,
    selectedAction: null,
    selectedCell: null,
    players: [],
    gameStarted: false,
    soundEnabled: true,
    specialPowerUsed: {}
};

const heroStats = {
    chevalier: { health: 100, attack: 8, defense: 7, speed: 4, maxHealth: 100, specialPower: "Frappe Héroïque" },
    ninja: { health: 85, attack: 6, defense: 4, speed: 9, maxHealth: 85, specialPower: "Frappe Éclair" },
    sorcier: { health: 80, attack: 6, defense: 3, speed: 6, maxHealth: 70, specialPower: "Nova Arcanique" },
    moine: { health: 90, attack: 5, defense: 6, speed: 7, maxHealth: 90, specialPower: "Méditation" },
    bete: { health: 120, attack: 9, defense: 5, speed: 6, maxHealth: 120, specialPower: "Rage Bestiale" },
    assassin: { health: 85, attack: 8, defense: 5, speed: 8, maxHealth: 85, specialPower: "Coup Fatal" }
};
const playerColors = ["#2196f3", "#f44336", "#4caf50", "#9c27b0"];

const gameBoard = document.getElementById("gameBoard");
const setupScreen = document.getElementById("setupScreen");
const gameStatus = document.getElementById("gameStatus");
const playerTurn = document.getElementById("playerTurn");
const diceContainer = document.getElementById("diceContainer");
const dice = document.getElementById("dice");
const musicSound = document.getElementById("musique_principale");
const attackSound = document.getElementById("attack_sound");
const moveSound = document.getElementById("move_sound");
const diceSound = document.getElementById("dice_sound");
const powerSound = document.getElementById("power_sound");
const victorySound = document.getElementById("victory_sound");
document.addEventListener("DOMContentLoaded", function () {
    console.log("Initialisation");
    initializeGame();
    setupHeroSelection();
    const trapsToggle = document.getElementById("trapsToggle");
    if (trapsToggle) {
        trapsToggle.addEventListener("change", function () {
            gameConfig.traps.enabled = this.checked;
        });
    }
    document.getElementById("startGameBtn").addEventListener("click", startGame);
    document.getElementById("rollDiceBtn").addEventListener("click", rollDiceForCurrentPlayer);

});

function initializeGame() {
    console.log("Initialisation du jeu");
    createGameBoard();
    setupHeroSelectionListeners();
    musicSound.volume = 0.3;
    musicSound.loop = true;
}
function createGameBoard() {
    console.log("Créer le plateau de jeu");
    gameBoard.innerHTML = "";
    for (let row = 0; row < gameConfig.boardSize; row++) {
        for (let col = 0; col < gameConfig.boardSize; col++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener("click", () => handleCellClick(row, col));
            const coords = document.createElement('div');
            coords.className = 'cell-coordinates';
            coords.textContent = `${col + 1},${row + 1}`;
            cell.appendChild(coords);
            gameBoard.appendChild(cell);
        }
    }
}

function setupHeroSelection() {
    console.log("Configuration de la sélection de héros");
    document.querySelectorAll("#playerSetups .player-setup:nth-child(1) .hero-option").forEach(option => {
        option.addEventListener("click", function () {
            selectHero(this, 1);
        });
    });
    document.querySelectorAll("#playerSetups .player-setup:nth-child(2) .hero-option").forEach(option => {
        option.addEventListener("click", function () {
            selectHero(this, 2);
        });
    });

    document.querySelectorAll("#player3Setup .hero-option").forEach(option => {
        option.addEventListener("click", function () {
            selectHero(this, 3);
        });
    });
    document.querySelectorAll("#player4Setup .hero-option").forEach(option => {
        option.addEventListener("click", function () {
            selectHero(this, 4);
        });
    });
}
function selectPlayerCount(count) {
    console.log("Sélectionner le nombre de joueurs");
    gameConfig.playerCount = count;
    document.querySelectorAll(".player-option").forEach(option => {
        option.classList.remove("selected");
    });
    document.querySelector(`.player-option:nth-child(${count - 1})`).classList.add("selected");
    document.getElementById("player3Setup").style.display = count >= 3 ? "block" : "none";
    document.getElementById("player4Setup").style.display = count >= 4 ? "block" : "none";
    updatePlayerTurnIndicator();
}

function updatePlayerTurnIndicator() {
    console.log("Mettre à jour l'indicateur de tour des joueurs");
    playerTurn.innerHTML = "";

    for (let i = 1; i <= gameConfig.playerCount; i++) {
        const playerIndicator = document.createElement("div");
        playerIndicator.className = "player-indicator";

        const playerColor = document.createElement("div");
        playerColor.className = `player-color player${i}`;
        playerColor.style.backgroundColor = playerColors[i - 1];

        const playerName = document.createElement("span");
        playerName.id = `player${i}Name`;
        playerName.textContent = `Joueur ${i}`;

        const playerStatus = document.createElement("span");
        playerStatus.id = `player${i}Status`;
        if (i === gameConfig.currentTurn) {
            playerStatus.className = "current-turn";
            playerStatus.textContent = " (À vous de jouer)";
        } else {
            playerStatus.textContent = "";
        }

        playerIndicator.appendChild(playerColor);
        playerIndicator.appendChild(playerName);
        playerIndicator.appendChild(playerStatus);

        playerTurn.appendChild(playerIndicator);
    }

    updatePlayerCards();
}

function selectHero(element, playerIndex) {
    console.log("Sélectionner un héros");
    const playerSetup = element.closest(".player-setup");
    playerSetup.querySelectorAll(".hero-option").forEach(option => {
        option.classList.remove("selected");
    });
    element.classList.add("selected");

    checkAllPlayersReady();
}

function checkAllPlayersReady() {
    console.log("Vérifier si tous les joueurs sont prêts");

    let allReady = true;

    for (let i = 1; i <= gameConfig.playerCount; i++) {
        const playerSetup = i <= 2 ?
            document.querySelector(`#playerSetups .player-setup:nth-child(${i})`) :
            document.getElementById(`player${i}Setup`);

        if (!playerSetup.querySelector(".hero-option.selected")) {
            allReady = false;
            break;
        }
    }

    const startGameBtn = document.getElementById("startGameBtn");
    if (allReady) {
        startGameBtn.classList.remove("disabled");
    } else {
        startGameBtn.classList.add("disabled");
    }
}
gameConfig.traps = {
    enabled: true,
    probability: 0.15,
    activeTrapLocations: []
};

const trapTypes = {
    fireTrap: {
        name: "Piège de feu",
        effect: "damage",
        value: 15,
        description: "Inflige 15 points de dégâts",
        imageUrl: "./assets/images/fire_trap.png"
    },
    iceTrap: {
        name: "Piège de glace",
        effect: "skipTurn",
        value: 1,
        description: "Fait perdre 1 tour",
        imageUrl: "./assets/images/iceTrap.png"
    },
    poisonTrap: {
        name: "Piège empoisonné",
        effect: "poison",
        value: 5,
        description: "Empoisonne (5 dégâts par tour pendant 3 tours)",
        imageUrl: "./assets/images/poisonTrap.png"
    },
    healingTrap: {
        name: "Fontaine curative",
        effect: "heal",
        value: 20,
        description: "Restaure 20 points de vie",
        imageUrl: "./assets/images/healingTrap.png"
    },
    strengthTrap: {
        name: "Autel de force",
        effect: "buff",
        stat: "attack",
        value: 2,
        description: "Augmente l'attaque de 2 points",
        imageUrl: "./assets/images/strengthTrap.png"
    }
};





function createTemporaryDiceElement(type) {
    const dice = document.createElement('div');
    dice.id = `${type}-dice`;
    dice.style.display = 'inline-block';
    dice.style.width = '40px';
    dice.style.height = '40px';
    dice.style.backgroundColor = 'white';
    dice.style.border = '2px solid black';
    dice.style.borderRadius = '5px';
    dice.style.textAlign = 'center';
    dice.style.lineHeight = '40px';
    dice.style.fontSize = '24px';
    dice.style.margin = '0 10px';
    document.body.appendChild(dice);
    return dice;
}
function generateTraps() {
    gameConfig.traps.activeTrapLocations = [];
    const trapKeys = Object.keys(trapTypes);
    const minTraps = 10;
    const boardSize = gameConfig.boardSize;

    trapKeys.forEach((trapType, index) => {
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 50) {
            const row = Math.floor(Math.random() * boardSize);
            const col = Math.floor(Math.random() * boardSize);

            if (!isCellOccupied(row, col)) {
                gameConfig.traps.activeTrapLocations.push({
                    row: row,
                    col: col,
                    type: trapType,
                    triggered: false
                });
                placeTrapOnCell(row, col, trapType);
                placed = true;
            }
            attempts++;
        }
    });

    while (gameConfig.traps.activeTrapLocations.length < minTraps) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        const trapType = trapKeys[Math.floor(Math.random() * trapKeys.length)];

        if (!isCellOccupied(row, col)) {
            gameConfig.traps.activeTrapLocations.push({
                row: row,
                col: col,
                type: trapType,
                triggered: false
            });
            placeTrapOnCell(row, col, trapType);
        }
    }

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (!isCellOccupied(row, col) &&
                Math.random() < gameConfig.traps.probability &&
                gameConfig.traps.activeTrapLocations.length < 10
            ) {
                const trapType = trapKeys[Math.floor(Math.random() * trapKeys.length)];
                gameConfig.traps.activeTrapLocations.push({
                    row: row,
                    col: col,
                    type: trapType,
                    triggered: false
                });
                placeTrapOnCell(row, col, trapType);
            }
        }
    }

    console.log(`${gameConfig.traps.activeTrapLocations.length} pièges générés (dont tous les types)`);
}

function isCellOccupied(row, col) {
    return (
        gameConfig.players.some(p => p.position.row === row && p.position.col === col) ||
        gameConfig.traps.activeTrapLocations.some(t => t.row === row && t.col === col)
    );
}
function placeTrapOnCell(row, col, trapType) {
    const cell = getCellAt(row, col);
    if (!cell) return;

    const trapElement = document.createElement("div");
    trapElement.className = "trap";
    trapElement.dataset.type = trapType;

    trapElement.classList.add(`trap-${trapType}`);

    if (trapTypes[trapType].imageUrl) {
        trapElement.style.backgroundImage = `url('${trapTypes[trapType].imageUrl}')`;
    } else {
        trapElement.textContent = trapTypes[trapType].icon;
    }

    trapElement.title = `${trapTypes[trapType].name}: ${trapTypes[trapType].description}`;

    cell.appendChild(trapElement);
}


function getStartPosition(playerIndex, totalPlayers) {
    console.log("Obtenir la position de départ en fonction du joueur");
    const sides = [
        'top',
        'right',
        'bottom',
        'left'
    ].slice(0, totalPlayers);

    const side = totalPlayers === 4 ? sides[playerIndex - 1] :
        [...sides].sort(() => Math.random() - 0.5)[playerIndex - 1];

    const maxPos = gameConfig.boardSize - 1;
    let row, col;
    let positionIsTaken;

    do {
        switch (side) {
            case 'top':
                row = 0;
                col = Math.floor(Math.random() * gameConfig.boardSize);
                break;
            case 'right':
                row = Math.floor(Math.random() * gameConfig.boardSize);
                col = maxPos;
                break;
            case 'bottom':
                row = maxPos;
                col = Math.floor(Math.random() * gameConfig.boardSize);
                break;
            case 'left':
                row = Math.floor(Math.random() * gameConfig.boardSize);
                col = 0;
                break;
            default:
                row = 0;
                col = 0;
        }

        positionIsTaken = gameConfig.players.some(player => player.position.row === row && player.position.col === col);
    } while (positionIsTaken);

    return { row, col };
}


function placeCharactersOnBoard() {
    console.log("Placer les personnages sur le plateau");
    document.querySelectorAll(".character").forEach(char => {
        char.remove();
    });

    gameConfig.players.forEach(player => {
        const cell = getCellAt(player.position.row, player.position.col);
        if (cell) {
            const character = document.createElement("div");
            character.className = `character ${player.hero}`;
            character.dataset.player = player.id;

            const healthBar = document.createElement("div");
            healthBar.className = "health-bar";
            healthBar.style.width = `${(player.stats.health / player.stats.maxHealth) * 100}%`;

            character.appendChild(healthBar);
            cell.appendChild(character);
        }
    });
}
function updateActivePlayerAnimation() {
    document.querySelectorAll(".character").forEach(char => {
        char.classList.remove("active-player");
    });

    const currentPlayer = getCurrentPlayer();
    if (currentPlayer) {
        const activeCharacter = document.querySelector(`.character[data-player="${currentPlayer.id}"]`);
        if (activeCharacter) {
            activeCharacter.classList.add("active-player");
        }
    }
}

function updateGameInterface() {
    console.log("Mettre à jour l'interface du jeu");
    updatePlayerTurnIndicator();
    updateHealthBars();
    updateSpecialPowerButton();
    updatePlayerCards();
    updateActivePlayerAnimation();
}


function updateHealthBars() {
    gameConfig.players.forEach(player => {
        const character = document.querySelector(`.character[data-player="${player.id}"]`);
        if (character) {
            const healthBar = character.querySelector(".health-bar");
            if (healthBar) {
                healthBar.style.width = `${(player.stats.health / player.stats.maxHealth) * 100}%`;
            }
        }
    });
}


function updateSpecialPowerButton() {
    console.log("Mettre à jour le bouton de pouvoir spécial");
    const specialBtn = document.getElementById("specialBtn");
    const currentPlayer = getCurrentPlayer();

    if (currentPlayer) {
        const playerKey = `player${currentPlayer.id}`;
        if (gameConfig.specialPowerUsed[playerKey]) {
            specialBtn.classList.add("disabled");
            specialBtn.title = `Disponible dans ${gameConfig.specialPowerUsed[playerKey].turnsRemaining} tours`;
        } else {
            specialBtn.classList.remove("disabled");
            specialBtn.title = "Pouvoir spécial disponible";
        }
    }
}


function getCurrentPlayer() {
    console.log("Obtenir le joueur actuel");
    return gameConfig.players.find(player => player.id === gameConfig.currentTurn);
}

document.getElementById("moveBtn").addEventListener("click", () => selectAction("move"));
document.getElementById("attackBtn").addEventListener("click", () => selectAction("attack"));
document.getElementById("defendBtn").addEventListener("click", () => selectAction("defend"));
document.getElementById("dodgeBtn").addEventListener("click", () => selectAction("dodge"));
document.getElementById("specialBtn").addEventListener("click", () => selectAction("special"));
function selectAction(action) {
    console.log('Vérification');

    if (!gameConfig.gameStarted) return;

    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return;

    if (action === "special") {
        const playerKey = `player${currentPlayer.id}`;
        if (gameConfig.specialPowerUsed[playerKey]) {
            gameStatus.textContent = "Pouvoir spécial déjà utilisé - Veuillez choisir une autre action";
            return;
        }
    }

    resetHighlightedCells();

    gameConfig.selectedAction = action;

    switch (action) {
        case "move":
            gameStatus.textContent = "Sélectionnez une case pour vous déplacer";
            setTimeout(() => highlightValidMoves(currentPlayer), 500);
            break;

        case "attack":
            gameStatus.textContent = "Recherche d'adversaires à portée...";
            setTimeout(() => highlightValidAttacks(currentPlayer), 500);
            break;

        case "defend":
            gameStatus.textContent = `Joueur ${currentPlayer.id} se met en position défensive...`;
            setTimeout(() => executeDefend(currentPlayer), 1000);
            break;

        case "dodge":
            gameStatus.textContent = `Joueur ${currentPlayer.id} tente d'esquiver...`;
            setTimeout(() => executeDodge(currentPlayer), 1000);
            break;

        case "special":
            gameStatus.textContent = `Joueur ${currentPlayer.id} utilise son pouvoir spécial...`;
            setTimeout(() => executeSpecialPower(currentPlayer), 1500);
            break;
    }
}



function highlightValidMoves(player) {
    console.log("Mettre en surbrillance les déplacements valides");
    const { row, col } = player.position;
    let speed;

    switch (player.hero) {
        case 'chevalier':
        case 'sorcier':
            speed = 1;
            break;
        case 'ninja':
            speed = 2;
            break;
        default:
            speed = 1;
    }

    for (let r = Math.max(0, row - speed); r <= Math.min(gameConfig.boardSize - 1, row + speed); r++) {
        for (let c = Math.max(0, col - speed); c <= Math.min(gameConfig.boardSize - 1, col + speed); c++) {
            const distance = Math.abs(r - row) + Math.abs(c - col);
            if (distance <= speed && !cellHasCharacter(r, c)) {
                const cell = getCellAt(r, c);
                if (cell) {
                    cell.classList.add("highlight-move");
                }
            }
        }
    }
}

function highlightValidAttacks(player) {
    console.log("Calcul des attaques valides pour le joueur", player.id);
    const { row, col } = player.position;
    let attackRange = 1;
    let hasValidTargets = false;

    if (player.hero === 'sorcier') {
        attackRange = 3;
    }

    for (let r = Math.max(0, row - attackRange); r <= Math.min(gameConfig.boardSize - 1, row + attackRange); r++) {
        for (let c = Math.max(0, col - attackRange); c <= Math.min(gameConfig.boardSize - 1, col + attackRange); c++) {
            const distance = Math.abs(r - row) + Math.abs(c - col);
            if (distance <= attackRange) {
                const targetCell = getCellAt(r, c);
                if (targetCell) {
                    const character = targetCell.querySelector(".character");
                    if (character && character.dataset.player != player.id) {
                        hasValidTargets = true;
                        break;
                    }
                }
            }
        }
        if (hasValidTargets) break;
    }

    if (!hasValidTargets) {
        gameStatus.textContent = "Aucun adversaire à portée - Veuillez choisir une autre action";
        gameConfig.selectedAction = null;
        return;
    }

    let validAttacksCount = 0;
    for (let r = Math.max(0, row - attackRange); r <= Math.min(gameConfig.boardSize - 1, row + attackRange); r++) {
        for (let c = Math.max(0, col - attackRange); c <= Math.min(gameConfig.boardSize - 1, col + attackRange); c++) {
            const distance = Math.abs(r - row) + Math.abs(c - col);
            if (distance <= attackRange) {
                const targetCell = getCellAt(r, c);
                if (targetCell) {
                    const character = targetCell.querySelector(".character");
                    if (character && character.dataset.player != player.id) {
                        targetCell.classList.add("highlight-attack");
                        validAttacksCount++;
                    }
                }
            }
        }
    }

    console.log(`${validAttacksCount} attaques valides trouvées`);
}

function executeDefend(player) {
    console.log("Exécuter l'action de défense");

    player.status.isDefending = true;

    gameStatus.textContent = `Joueur ${player.id} prêt à contrer - La prochaine attaque sera moins efficace !`;
    const defendAudio = new Audio("./assets/audio/defendSound.mp3");
    defendAudio.volume = 0.5;
    if (gameConfig.soundEnabled) {
        defendAudio.play().catch(e => console.warn("Lecture audio impossible", e));
    }

    const playerElement = document.querySelector(`.character[data-player="${player.id}"]`);
    if (playerElement) {
        playerElement.classList.add("defending");
        setTimeout(() => playerElement.classList.remove("defending"), 1000);
    }

    setTimeout(() => nextTurn(), 1500);
    addActionToHistory(`Joueur ${player.id} pare la prochaine attaque qui le touchera`, player.id);
}

function executeDodge(player) {
    console.log("Exécuter l'action d'esquive");
    const dodgeChanceByHero = {
        chevalier: 0.4,
        ninja: 0.9,
        sorcier: 0.4,
        moine: 0.7,
        assassin: 0.8,
        'bête mythique': 0.2
    };

    const dodgeChance = dodgeChanceByHero[player.hero] || 0.4; // 40% par défaut
    player.status.isDodging = true;
    player.status.dodgeChance = dodgeChance;
    const character = document.querySelector(`.character[data-player="${player.id}"]`);
    if (character) {
        character.classList.add("dodging");
        const dodgeEffect = document.createElement("div");
        dodgeEffect.className = "dodge-effect";
        dodgeEffect.textContent = `Esquive ${Math.floor(dodgeChance * 100)}%`;
        character.appendChild(dodgeEffect);

        setTimeout(() => {
            dodgeEffect.remove();
        }, 1000);
    }
    gameStatus.textContent = `Joueur ${player.id} se prépare à esquiver (${Math.floor(dodgeChance * 100)}% de chance)`;
    setTimeout(() => {
        nextTurn();
    }, 1500);
    addActionToHistory(`Joueur ${player.id} tente d'esquiver (${Math.floor(dodgeChance * 100)}%)`, player.id);
}

function executeSpecialPower(player) {
    console.log("Exécuter le pouvoir spécial");
    const playerKey = `player${player.id}`;
    gameConfig.specialPowerUsed[playerKey] = {
        used: true,
        turnsRemaining: 3
    };

    let healAmount = 0;
    switch (player.hero) {
        case "chevalier":
            player.status.specialActive = true;
            gameStatus.textContent = "Frappe Héroïque activée ! Votre prochaine attaque infligera 50% de dégâts supplémentaires";
            break;

        case "ninja":
            player.status.specialActive = true;
            gameStatus.textContent = "Frappe Éclair activée ! Vous pourrez attaquer deux fois au prochain tour";
            break;

        case "sorcier":
            player.status.specialActive = true;
            gameStatus.textContent = "Nova Arcanique activée ! Vous pouvez attaquer jusqu'à 3 cases et toucher plusieurs ennemis";
            highlightValidAttacks(player);
            playSpecialSound(player);
            addActionToHistory(`Joueur ${player.id} utilise ${player.stats.specialPower}`, player.id);
            updateSpecialPowerButton();
            return;

        case "moine":
            healAmount = Math.floor(player.stats.maxHealth * 0.3);
            player.stats.health = Math.min(player.stats.health + healAmount, player.stats.maxHealth);

            const characterElement = document.querySelector(`.character[data-player="${player.id}"]`);
            if (characterElement) {
                characterElement.classList.add("healing-glow");

                const healAnimation = document.createElement("div");
                healAnimation.className = "heal-animation";
                healAnimation.textContent = `+${healAmount}`;
                characterElement.appendChild(healAnimation);

                setTimeout(() => {
                    healAnimation.remove();
                    characterElement.classList.remove("healing-glow");
                }, 1500);
            }
            gameStatus.textContent = `Joueur ${player.id} utilise Méditation et récupère ${healAmount} PV !`;
            updateHealthBars();
            break;

        case "bete":
            player.status.specialActive = true;
            player.stats.attack = Math.floor(player.stats.attack * 1.5);
            player.stats.defense = Math.floor(player.stats.defense * 0.7);
            gameStatus.textContent = "Rage Bestiale activée ! Attaque +50%, Défense -30%";
            break;

        case "assassin":
            if (!player.status.specialActive) {
                player.status.specialActive = {
                    isCritical: true,
                    critChance: 0.2
                };
                gameStatus.textContent = `${player.name} prépare un Coup Fatal (20% chance critique)`;
                addActionToHistory(`${player.name} active Coup Fatal`, player.id);
            } else {
                gameStatus.textContent = "Un Coup Fatal est déjà préparé !";
            }
            break;
    }

    playSpecialSound(player);

    updateSpecialPowerButton();
    addActionToHistory(`Joueur ${player.id} utilise ${player.stats.specialPower}`, player.id);

    if (player.hero !== "sorcier") {
        setTimeout(() => {
            nextTurn();
        }, 1500);
    }
}
function playSpecialSound(player) {
    if (!gameConfig.soundEnabled) return;

    let audioSrc = "./assets/audio/powerSound.mp3";
    if (player.hero === "moine") {
        audioSrc = "./assets/audio/healingSound.mp3";
    }

    const audio = new Audio(audioSrc);
    audio.volume = 0.5;
    audio.play().catch(e => console.warn("Lecture audio impossible sans interaction utilisateur", e));
}


function handleCellClick(row, col) {
    console.log("Gérer le clic sur une cellule");
    if (!gameConfig.gameStarted) return;
    const cell = getCellAt(row, col);
    if (!cell) return;
    const currentPlayer = getCurrentPlayer();
    if (!currentPlayer) return;
    switch (gameConfig.selectedAction) {
        case "move":
            if (cell.classList.contains("highlight-move")) {
                executeMove(currentPlayer, row, col);
            }
            break;

        case "attack":
            if (cell.classList.contains("highlight-attack")) {
                executeAttack(currentPlayer, row, col);
            }
            break;

        case "special":
            if (currentPlayer.hero === "sorcier" && cell.classList.contains("highlight-attack")) {
                executeAttack(currentPlayer, row, col, true);
            }
            break;
    }
}

function executeMove(player, targetRow, targetCol) {
    console.log("Exécuter un déplacement");
    const currentCell = getCellAt(player.position.row, player.position.col);
    const character = currentCell.querySelector(".character");
    currentCell.removeChild(character);
    player.position.row = targetRow;
    player.position.col = targetCol;
    const targetCell = getCellAt(targetRow, targetCol);
    targetCell.appendChild(character);
    resetHighlightedCells();
    const trapIndex = gameConfig.traps.activeTrapLocations.findIndex(
        trap => trap.row === targetRow && trap.col === targetCol && !trap.triggered
    );

    if (trapIndex !== -1) {
        const trap = gameConfig.traps.activeTrapLocations[trapIndex];
        const trapType = trap.type;
        let soundFile = "";
        switch (trapType) {
            case "fireTrap":
                soundFile = "./assets/audio/fireSound.mp3";
                break;
            case "iceTrap":
                soundFile = "./assets/audio/iceSound.mp3";
                break;
            case "poisonTrap":
                soundFile = "./assets/audio/poisonSound.mp3";
                break;
            case "healingTrap":
                soundFile = "./assets/audio/healingSound.mp3";
                break;
            case "strengthTrap":
                soundFile = "./assets/audio/strengthSound.mp3";
                break;
            default:
                soundFile = "./assets/audio/trapSound.mp3";
        }

        if (gameConfig.soundEnabled) {
            const trapAudio = new Audio(soundFile);
            trapAudio.volume = 0.5;
            trapAudio.play().catch(e => console.warn("Lecture audio impossible sans interaction utilisateur", e));
        }

        setTimeout(() => {
            triggerTrap(player, trapIndex);
        }, 500);
    } else {
        if (gameConfig.soundEnabled) {
            const moveAudio = new Audio("./assets/audio/moveSound.mp3");
            moveAudio.volume = 0.5;
            moveAudio.play().catch(e => console.warn("Lecture audio impossible sans interaction utilisateur", e));
        }
        nextTurn();
        addActionToHistory(`Joueur ${player.id} se déplace vers (${targetCol + 1},${targetRow + 1})`, player.id);
    }
}
function triggerTrap(player, trapIndex) {
    const trap = gameConfig.traps.activeTrapLocations[trapIndex];
    const trapInfo = trapTypes[trap.type];
    trap.triggered = true;
    const { row, col } = trap;
    const cell = getCellAt(row, col);
    const character = cell.querySelector(".character");
    const trapElement = cell.querySelector(".trap");
    if (trapElement) {
        trapElement.classList.add("triggered");
        setTimeout(() => {
            if (trapElement && trapElement.parentNode) {
                trapElement.parentNode.removeChild(trapElement);
            }
        }, 1500);
    }
    gameStatus.textContent = `${trapInfo.name} déclenché! ${trapInfo.description}`;
    switch (trapInfo.effect) {
        case "damage":
            player.stats.health = Math.max(0, player.stats.health - trapInfo.value);
            if (character) {
                const damageAnimation = document.createElement("div");
                damageAnimation.className = "damage-animation trap-damage";
                damageAnimation.textContent = `-${trapInfo.value}`;
                character.appendChild(damageAnimation);

                setTimeout(() => {
                    damageAnimation.remove();
                }, 1000);
            }
            break;

        case "poison":
            if (!player.status.poisoned) {
                player.status.poisoned = {
                    damage: trapInfo.value,
                    turnsRemaining: 3
                };

                if (character) {
                    const poisonEffect = document.createElement("div");
                    poisonEffect.className = "poison-effect";
                    character.appendChild(poisonEffect);
                }
            }
            break;

        case "skipTurn":
            player.status.skipTurns = (player.status.skipTurns || 0) + trapInfo.value;
            break;

        case "heal":
            const healAmount = Math.min(
                trapInfo.value,
                player.stats.maxHealth - player.stats.health
            );
            player.stats.health += healAmount;
            if (character) {
                const healAnimation = document.createElement("div");
                healAnimation.className = "heal-animation";
                healAnimation.textContent = `+${healAmount}`;
                character.appendChild(healAnimation);

                setTimeout(() => {
                    healAnimation.remove();
                }, 1000);
            }
            break;

        case "buff":
            player.stats[trapInfo.stat] += trapInfo.value;
            if (character) {
                const buffAnimation = document.createElement("div");
                buffAnimation.className = "buff-animation";
                buffAnimation.textContent = `+${trapInfo.value} ${trapInfo.stat}`;
                character.appendChild(buffAnimation);

                setTimeout(() => {
                    buffAnimation.remove();
                }, 1000);
            }
            break;
    }
    updateHealthBars();
    updatePlayerCards();
    if (player.stats.health <= 0) {
        if (character) {
            character.remove();
        }
        gameConfig.players = gameConfig.players.filter(p => p.id !== player.id);
        updatePlayerCards();
        checkForWinner();
    } else {
        setTimeout(() => {
            nextTurn();
        }, 2000);
    }
    addActionToHistory(`${trapInfo.name} sur Joueur ${player.id}: ${trapInfo.description}`, player.id);
}

function executeAttack(attacker, targetRow, targetCol, isSpecial = false) {
    console.log("Exécuter une attaque");
    const targetCell = getCellAt(targetRow, targetCol);
    const targetCharacter = targetCell.querySelector(".character");
    const targetPlayerId = parseInt(targetCharacter.dataset.player);
    const target = gameConfig.players.find(player => player.id === targetPlayerId);

    if (!target) return;
    rollDice("attack", () => {
        let attackPower = attacker.stats.attack;
        if (attacker.status.specialActive) {
            switch (attacker.hero) {
                case "chevalier":
                    if (attacker.status.specialActive) {
                        const baseAttack = attackPower;
                        attackPower = Math.floor(attackPower * 1.5);
                        attacker.status.specialActive = false;
                        console.log(
                            `[FRAPPE HÉROÏQUE] ${baseAttack} * 1.5 = ${attackPower}\n` +
                            `Défense ennemie: ${target.stats.defense || 0} / 2 = ${Math.floor((target.stats.defense || 0) / 2)}`
                        );
                    }
                    break;
                case "assassin":
                    if (attacker.status.specialActive) {
                        const isCritical = Math.random() < 0.2;
                        if (isCritical) {
                            const baseDamage = attackPower;
                            attackPower = Math.floor(attackPower * 2);
                            const critEffect = document.createElement('div');
                            critEffect.className = 'critical-effect';
                            critEffect.textContent = 'CRIT!';
                            document.querySelector(`.character[data-player="${attacker.id}"]`).appendChild(critEffect);
                            setTimeout(() => critEffect.remove(), 1000);
                            console.log(`[COUP CRITIQUE] ${baseDamage} -> ${attackPower}`);
                            gameStatus.textContent = `CRITIQUE! ${attacker.name} frappe x2 (${attackPower} dégâts)`;
                            addActionToHistory(`[💀] Coup critique: ${baseDamage}→${attackPower}`, attacker.id);
                        }
                        attacker.status.specialActive = false;
                    }
                    break;
            }

        }

        if (target.status.isDodging) {
            const dodgeChance = target.status.dodgeChance || 0.4;
            if (Math.random() < dodgeChance) {
                const dodgeAudio = new Audio("./assets/audio/dodgeSound.mp3");
                dodgeAudio.volume = 0.5;

                if (gameConfig.soundEnabled) {
                    dodgeAudio.play().catch(e => console.warn("Lecture audio impossible sans interaction utilisateur", e));
                }

                target.status.isDodging = false;
                target.status.dodgeChance = null;

                gameStatus.textContent = `Joueur ${target.id} esquive l'attaque avec succès !`;

                const targetElement = document.querySelector(`.character[data-player="${target.id}"]`);
                if (targetElement) {
                    targetElement.classList.add("dodging");

                    const dodgeSuccessEffect = document.createElement("div");
                    dodgeSuccessEffect.className = "dodge-success-effect";
                    dodgeSuccessEffect.textContent = "ESQUIVÉ !";
                    dodgeSuccessEffect.style.color = "#00ff00";
                    dodgeSuccessEffect.style.fontWeight = "bold";
                    dodgeSuccessEffect.style.fontStyle = "17";
                    targetElement.appendChild(dodgeSuccessEffect);

                    setTimeout(() => {
                        targetElement.classList.remove("dodging");
                        dodgeSuccessEffect.remove();
                    }, 1000);
                }

                addActionToHistory(`Joueur ${target.id} a esquivé l'attaque de Joueur ${attacker.id} !`, target.id);

                setTimeout(() => {
                    nextTurn();
                }, 1500);
                return;
            } else {
                target.status.isDodging = false;
                target.status.dodgeChance = null;
                gameStatus.textContent = `Joueur ${target.id} rate son esquive ! L'attaque continue...`;

                setTimeout(() => {
                    gameStatus.textContent = `Joueur ${attacker.id} attaque malgré la tentative d'esquive !`;
                }, 800);
            }
        }

        const attackAudio = new Audio("./assets/audio/attackSound.mp3");
        attackAudio.volume = 0.5;

        if (gameConfig.soundEnabled) {
            attackAudio.play().catch(e => console.warn("Lecture audio impossible sans interaction utilisateur", e));
        }

        let defense = target.stats.defense;
        if (target.status.isDefending) {
            const baseDefense = defense;
            defense = Math.round(defense * 1.5);
            console.log(`[DÉFENSE] Joueur ${target.id} - Défense de base: ${baseDefense} → Défense boostée: ${defense} (+50%)`);
            console.log(`[ATTAQUE] Joueur ${attacker.id} - Attaque brute: ${attackPower}`);
            gameStatus.textContent += ` (Défense boostée: ${baseDefense} → ${defense})`;
        }
        const damage = Math.max(1, attackPower - Math.floor(defense / 2));
        target.stats.health = Math.max(0, target.stats.health - damage);
        target.status.isDefending = false;
        updateHealthBars();
        updatePlayerCards();
        const targetElement = document.querySelector(`.character[data-player="${target.id}"]`);
        if (targetElement) {
            const damageAnimation = document.createElement("div");
            damageAnimation.className = "damage-animation";
            damageAnimation.textContent = `-${damage}`;
            damageAnimation.style.color = "#ff0000";
            damageAnimation.style.fontWeight = "bold";
            damageAnimation.style.fontSize = "20px";
            targetElement.appendChild(damageAnimation);

            targetElement.classList.add("damage-shake");

            setTimeout(() => {
                damageAnimation.remove();
                targetElement.classList.remove("damage-shake");
            }, 1000);
        }

        gameStatus.textContent = `Joueur ${attacker.id} attaque et inflige ${damage} points de dégâts !`;

        setTimeout(() => {
            if (gameStatus.textContent.includes("points de dégâts")) {
                gameStatus.textContent = "";
            }
        }, 2000);

        if (target.stats.health <= 0) {
            gameStatus.textContent = `Joueur ${target.id} est éliminé !`;

            if (targetElement) {
                targetElement.style.opacity = "0.3";
                targetElement.style.filter = "grayscale(100%)";

                setTimeout(() => {
                    targetElement.remove();
                }, 1500);
            }

            gameConfig.players = gameConfig.players.filter(player => player.id !== target.id);
            updatePlayerCards();

            addActionToHistory(`Joueur ${target.id} a été éliminé par Joueur ${attacker.id} !`, attacker.id);

            setTimeout(() => {
                checkForWinner();
            }, 1500);
        } else {
            if (attacker.hero === "ninja" && attacker.status.specialActive && !isSpecial) {
                attacker.status.specialActive = false;
                gameStatus.textContent = `Joueur ${attacker.id} (Ninja) peut attaquer une seconde fois !`;

                setTimeout(() => {
                    resetHighlightedCells();
                    highlightValidAttacks(attacker);
                    gameConfig.selectedAction = "attack";
                }, 1500);

                addActionToHistory(`Joueur ${attacker.id} attaque Joueur ${target.id} (-${damage} PV) - Prépare une 2ème attaque`, attacker.id);
                return;
            }

            addActionToHistory(`Joueur ${attacker.id} attaque Joueur ${target.id} (-${damage} PV)`, attacker.id);

            setTimeout(() => {
                nextTurn();
            }, 1500);
        }
    });
}
function nextTurn() {
    console.log("Passer au tour suivant");
    gameConfig.selectedAction = null;
    resetHighlightedCells();
    Object.keys(gameConfig.specialPowerUsed).forEach(playerKey => {
        if (gameConfig.specialPowerUsed[playerKey].used) {
            gameConfig.specialPowerUsed[playerKey].turnsRemaining--;

            if (gameConfig.specialPowerUsed[playerKey].turnsRemaining <= 0) {
                delete gameConfig.specialPowerUsed[playerKey];

                const playerId = parseInt(playerKey.replace('player', ''));
                const player = gameConfig.players.find(p => p.id === playerId);
                if (player) {
                    player.status.specialActive = false;
                    gameStatus.textContent = `Pouvoir spécial du Joueur ${playerId} réinitialisé !`;
                }
            }
        }
    });

    let nextPlayerIndex = gameConfig.currentTurn;
    do {
        nextPlayerIndex = nextPlayerIndex % gameConfig.players.length + 1;
    } while (!gameConfig.players.some(player => player.id === nextPlayerIndex));

    gameConfig.currentTurn = nextPlayerIndex;
    const currentPlayer = getCurrentPlayer();

    if (currentPlayer && currentPlayer.status.skipTurns > 0) {
        currentPlayer.status.skipTurns--;
        gameStatus.textContent = `Joueur ${currentPlayer.id} est gelé et passe son tour`;

        setTimeout(() => {
            nextTurn();
        }, 1500);
        return;
    }

    if (currentPlayer && currentPlayer.status.poisoned) {
        const poisonDamage = currentPlayer.status.poisoned.damage;
        currentPlayer.stats.health = Math.max(0, currentPlayer.stats.health - poisonDamage);
        const character = document.querySelector(`.character[data-player="${currentPlayer.id}"]`);
        if (character) {
            const poisonDamageAnimation = document.createElement("div");
            poisonDamageAnimation.className = "damage-animation poison-damage";
            poisonDamageAnimation.textContent = `-${poisonDamage}`;
            character.appendChild(poisonDamageAnimation);

            setTimeout(() => {
                poisonDamageAnimation.remove();
            }, 1000);
        }

        updateHealthBars();
        updatePlayerCards();

        currentPlayer.status.poisoned.turnsRemaining--;
        if (currentPlayer.status.poisoned.turnsRemaining <= 0) {
            currentPlayer.status.poisoned = null;

            if (character) {
                const poisonEffect = character.querySelector(".poison-effect");
                if (poisonEffect) {
                    poisonEffect.remove();
                }
            }
        }
        if (currentPlayer.stats.health <= 0) {
            if (character) {
                character.remove();
            }
            gameConfig.players = gameConfig.players.filter(p => p.id !== currentPlayer.id);
            updatePlayerCards();
            const result = checkForWinner();
            if (!result && gameConfig.players.length > 1) {
                nextTurn();
            }
            return;
        }
        if (gameConfig.specialPowerUsed[playerKey].turnsRemaining <= 0) {
            delete gameConfig.specialPowerUsed[playerKey];

            const playerId = parseInt(playerKey.replace('player', ''));
            const player = gameConfig.players.find(p => p.id === playerId);
            if (player) {
                player.status.specialActive = false;

                const character = document.querySelector(`.character[data-player="${playerId}"]`);
                if (character) {
                    const resetEffect = document.createElement("div");
                    resetEffect.className = "power-reset-effect";
                    resetEffect.textContent = "Pouvoir réinitialisé!";
                    character.appendChild(resetEffect);

                    setTimeout(() => {
                        resetEffect.remove();
                    }, 1500);
                }

                gameStatus.textContent = `Pouvoir spécial du Joueur ${playerId} réinitialisé !`;
                addActionToHistory(`Pouvoir spécial du Joueur ${playerId} est à nouveau disponible`, playerId);
            }
        }
    }

    updateGameInterface();

    setTimeout(() => {
        gameStatus.textContent = `Tour du Joueur ${gameConfig.currentTurn} - Choisissez une action`;
    }, 1000);
}


function checkForWinner() {
    console.log("Vérifier s'il y a un vainqueur, checkForWinner()");
    if (gameConfig.players.length === 1) {
        const winner = gameConfig.players[0];

        const victoryAudio = new Audio("./assets/audio/Victory-sound.mp3");
        victoryAudio.volume = 0.5;
        if (typeof musicSound !== 'undefined' && musicSound) {
            musicSound.pause();
            musicSound.currentTime = 0;
        }

        if (gameConfig.soundEnabled) {
            victoryAudio.play().catch(e => console.warn("Lecture audio impossible sans interaction utilisateur", e));
        }

        const modal = document.getElementById("gameOverModal");
        const winnerHeroElement = document.getElementById("winnerHero");
        document.getElementById("winnerPlayer").textContent = winner.id;
        let heroImage = "./assets/images/Chevalier.jpg";
        let winnerMessage = "";

        switch (winner.hero) {
            case "chevalier":
                winnerMessage = "Le chevalier a triomphé dans l'arène !";
                heroImage = "./assets/images/Chevalier.jpg";
                break;
            case "ninja":
                winnerMessage = "La discrétion et la rapidité du ninja ont eu raison de ses adversaires !";
                heroImage = "./assets/images/Ninja.avif";
                break;
            case "sorcier":
                winnerMessage = "La puissance arcanique du sorcier a dominé le champ de bataille !";
                heroImage = "./assets/images/Sorcier.jpg";
                break;
            case "moine":
                winnerMessage = "La sagesse et l'équilibre du moine l'ont mené à la victoire !";
                heroImage = "./assets/images/Moine.avif";
                break;
            case "bete":
                winnerMessage = "La férocité de la bête était trop puissante pour ses adversaires !";
                heroImage = "./assets/images/Bête\ mythique.avif";
                break;
            case "assassin":
                winnerMessage = "L'assassin a frappé ses cibles avec précision et efficacité !";
                heroImage = "./assets/images/Assasin.jpg";
                break;
        }

        document.getElementById("winnerMessage").textContent = winnerMessage;

        winnerHeroElement.style.backgroundImage = `url('${heroImage}')`;
        winnerHeroElement.style.backgroundSize = "cover";
        winnerHeroElement.style.backgroundPosition = "center";
        modal.style.display = "flex";
    }
    addActionToHistory(`Joueur ${winner.id} remporte la victoire avec le ${heroLabels[winner.hero]} !`);
}
function restartGame() {
    console.log("Redémarrer le jeu");
    gameConfig = {
        boardSize: 7,
        playerCount: gameConfig.playerCount,
        currentTurn: 1,
        selectedAction: null,
        selectedCell: null,
        players: [],
        gameStarted: false,
        soundEnabled: gameConfig.soundEnabled,
        specialPowerUsed: {}
    };

    document.getElementById("gameOverModal").style.display = "none";
    setupScreen.style.display = "flex";
    victorySound.currentTime = 0;

    document.querySelectorAll(".hero-option").forEach(option => {
        option.classList.remove("selected");
    });

    createGameBoard();
}

function rollDice(actionType, callback) {

    let diceSound;
    if (gameConfig.soundEnabled) {
        diceSound = new Audio("./assets/audio/Dice Roll Sound.mp3");
        diceSound.currentTime = 0;
    }
    console.log("Lancer le dé");
    diceContainer.style.display = "flex";


    let rollCount = 0;
    const maxRolls = 10;
    const rollInterval = 100;
    if (gameConfig.soundEnabled) {
        diceSound.play();
    }

    const rollAnimation = setInterval(() => {
        const randomValue = Math.floor(Math.random() * 6) + 1;
        dice.className = "dice show-" + randomValue;

        rollCount++;
        if (rollCount >= maxRolls) {
            clearInterval(rollAnimation);
            setTimeout(() => {
                diceContainer.style.display = "none";
                if (callback) callback(randomValue);
            }, 1000);
        }
    }, rollInterval);
}

function getCellAt(row, col) {
    const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    if (!cell) {
        console.log(`Cellule [${row},${col}] non trouvée`);
    }
    return cell;
}

function cellHasCharacter(row, col) {
    const cell = getCellAt(row, col);
    return cell ? cell.querySelector(".character") !== null : false;
}

function resetHighlightedCells() {
    document.querySelectorAll(".highlight-move, .highlight-attack").forEach(cell => {
        cell.classList.remove("highlight-move");
        cell.classList.remove("highlight-attack");
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function setupHeroSelectionListeners() {
    document.querySelectorAll(".hero-option").forEach(option => {
        // option.addEventListener("mouseover", function () {
        //     const heroName = this.dataset.hero;
        //     showHeroInfo(this, heroName);
        // });

        // option.addEventListener("mouseout", function () {
        //     hideHeroInfo();
        // });
    });
}
function showStartGameMessage() {
    console.log("afficher un message au centre de l'écran au début du jeu");
    const messageElement = document.createElement('div');
    messageElement.id = 'startGameMessage';
    messageElement.textContent = 'LA PARTIE COMMENCE !';
    messageElement.style.position = 'fixed';
    messageElement.style.top = '50%';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translate(-50%, -50%)';
    messageElement.style.backgroundColor = ' rgba(0, 40, 60, 0.8)';
    messageElement.style.color = '#fff';
    messageElement.style.padding = '20px 40px';
    messageElement.style.borderRadius = '10px';
    messageElement.style.fontSize = '36px';
    messageElement.style.fontWeight = 'bold';
    messageElement.style.zIndex = '1000';
    messageElement.style.textAlign = 'center';
    messageElement.style.boxShadow = '0 0 20px rgba(61, 185, 220, 0.7)';
    messageElement.style.animation = 'pulse 1.5s infinite';
    messageElement.style.width = '700px';
    const styleElement = document.createElement('style');
    styleElement.textContent = `
                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.1); }
                    100% { transform: translate(-50%, -50%) scale(1); }
                }
            `;
    document.head.appendChild(styleElement);

    document.body.appendChild(messageElement);

    setTimeout(() => {
        messageElement.style.transition = 'opacity 1s';
        messageElement.style.opacity = '0';

        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 1000);
    }, 3000);
}

function updatePlayerTurnIndicator(currentTurn) {
    const cards = document.querySelectorAll(".player-card");
    cards.forEach(card => {
        const playerId = parseInt(card.dataset.player);
        const statusText = card.querySelector(".player-status");
        if (playerId === currentTurn) {
            statusText.textContent = "À vous de jouer";
            card.classList.add("active");
        } else {
            statusText.textContent = "En attente";
            card.classList.remove("active");
        }
    });
}

const heroLabels = {
    chevalier: "Chevalier",
    ninja: "Ninja",
    sorcier: "Sorcier",
    moine: "Moine",
    bete: "Bête mythique",
    assassin: "Assassin"
};

function generatePlayerCard(player) {
    console.log("Générer une carte de joueur");
    const playerCard = document.createElement("div");
    playerCard.className = "player-card";
    playerCard.dataset.player = player.id;

    const playerHeader = document.createElement("div");
    playerHeader.className = "player-header";

    const playerColor = document.createElement("div");
    playerColor.className = "player-color";

    const playerColors = ["#21f36e", "#e22a1c", "#dece21", "#3055cd"];
    playerColor.style.backgroundColor = playerColors[(player.id - 1) % 4];

    const playerAvatar = document.createElement("div");
    playerAvatar.className = "player-avatar";

    const heroImage = document.createElement("img");
    heroImage.src = getHeroImage(player.hero);
    heroImage.alt = `${heroLabels[player.hero] || player.hero} Image`;
    heroImage.className = "avatar-image";

    playerAvatar.appendChild(heroImage);

    const playerName = document.createElement("div");
    playerName.className = "player-name";
    playerName.textContent = player.name;

    const playerStatus = document.createElement("div");
    playerStatus.className = "player-status";

    playerHeader.appendChild(playerAvatar);
    playerHeader.appendChild(playerName);
    playerHeader.appendChild(playerStatus);
    playerHeader.appendChild(playerColor);

    const heroClass = document.createElement("div");
    heroClass.className = "hero-class";

    const attributes = document.createElement("div");
    attributes.className = "attributes";

    const attributeLabels = {
        attack: "Attaque",
        defense: "Défense",
        speed: "Vitesse"
    };

    ["attack", "defense", "speed"].forEach(attr => {
        const attribute = document.createElement("div");
        attribute.className = "attribute";

        const attributeValue = document.createElement("div");
        attributeValue.className = `attribute-value ${attr}`;
        attributeValue.textContent = player.stats[attr];

        const attributeName = document.createElement("div");
        attributeName.className = "attribute-name";
        attributeName.textContent = attributeLabels[attr] || attr;

        attribute.appendChild(attributeValue);
        attribute.appendChild(attributeName);
        attributes.appendChild(attribute);
    });

    playerCard.appendChild(playerHeader);
    playerCard.appendChild(heroClass);
    playerCard.appendChild(attributes);

    return playerCard;
}


function getHeroImage(hero) {
    switch (hero) {
        case 'chevalier':
            return './assets/images/Chevalier.jpg';
        case 'ninja':
            return './assets/images/Ninja.avif';
        case 'sorcier':
            return './assets/images/Sorcier.jpg';
        case 'moine':
            return './assets/images/Moine.avif';
        case 'bete':
            return './assets/images/Bête mythique.avif';
        case 'assassin':
            return './assets/images/Assasin.jpg';
        default:
            return './assets/images/default-avatar.jpg';
    }
}

function renderPlayerCards() {
    console.log("Afficher les cartes des joueurs");
    const container = document.getElementById("playerCardsContainer");
    container.innerHTML = "";

    gameConfig.players.forEach(player => {
        const playerCard = generatePlayerCard(player);
        container.appendChild(playerCard);
    });
}

function updatePlayerCards() {
    const container = document.getElementById("playerCardsContainer");
    container.innerHTML = "";

    gameConfig.players.forEach(player => {
        const playerCard = generatePlayerCard(player);
        if (player.id === gameConfig.currentTurn) {
            playerCard.classList.add("active");
            const playerStatus = playerCard.querySelector(".player-status");
        }
        container.appendChild(playerCard);
    });
}


function initActionHistory() {
    document.getElementById('clearHistoryBtn').addEventListener('click', clearActionHistory);
}
function initActionHistory() {
    const toggleBtn = document.getElementById('toggleHistoryBtn');
    const historyContainer = document.getElementById('actionHistoryContainer');
    toggleBtn.addEventListener('click', function () {
        historyContainer.classList.toggle('history-visible');
        this.classList.toggle('active');
        if (historyContainer.classList.contains('history-visible')) {
            this.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            this.innerHTML = '<i class="fas fa-history"></i>';
        }
    });

    document.getElementById('clearHistoryBtn').addEventListener('click', clearActionHistory);
}
function addActionToHistory(message, playerId = null) {
    const historyContainer = document.getElementById('actionHistory');
    const actionEntry = document.createElement('div');
    actionEntry.className = 'action-entry';
    if (playerId) {
        actionEntry.classList.add(`player${playerId}`);
    }

    let icon = '⚡';
    if (message.includes('attaque')) icon = '⚔️';
    if (message.includes('défensive')) icon = '🛡️';
    if (message.includes('esquive')) icon = '🌀';
    if (message.includes('pouvoir spécial')) icon = '✨';
    if (message.includes('déplace')) icon = '👣';
    if (message.includes('piège')) icon = '⚠️';
    if (message.includes('victoire')) icon = '🏆';
    if (message.includes('mort')) icon = '💀';
    if (message.includes('soigne')) icon = '❤️';

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    actionEntry.innerHTML = `
        <span class="action-icon">${icon}</span> ${message}
        <span class="action-time">${timeString}</span>
    `;

    historyContainer.insertBefore(actionEntry, historyContainer.firstChild);

    if (historyContainer.children.length > 50) {
        historyContainer.removeChild(historyContainer.lastChild);
    }
}

function clearActionHistory() {
    document.getElementById('actionHistory').innerHTML = '';

    const btn = document.getElementById('clearHistoryBtn');
    btn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    }, 2000);
}

document.addEventListener("DOMContentLoaded", function () {
    initActionHistory();
});

function determineFirstPlayer() {
    const diceRollResults = document.getElementById("diceRollResults");
    const players = [...gameConfig.players];

    players.sort((a, b) => b.diceRoll - a.diceRoll);

    const topRoll = players[0].diceRoll;
    const tiedPlayers = players.filter(p => p.diceRoll === topRoll);

    if (tiedPlayers.length > 1) {
        diceRollResults.innerHTML += `<div class="dice-message">Égalité ! Relance pour Joueurs ${tiedPlayers.map(p => p.id).join(", ")}</div>`;
        tiedPlayers.forEach(p => p.diceRoll = 0);

        setTimeout(() => {
            tiedPlayers.forEach((player, index) => {
                setTimeout(() => {
                    rollDiceForPlayer(player, index);
                }, index * 1500);
            });
        }, 1500);
    } else {
        gameConfig.currentTurn = players[0].id;
        diceRollResults.innerHTML += `<div class="dice-message">Joueur ${players[0].id} commence !</div>`;
        document.getElementById("startWithDiceBtn").style.display = "block";
        document.getElementById("startWithDiceBtn").onclick = startGameAfterDice;
    }
}

function startDiceRoll() {
    document.getElementById("diceRollScreen").style.display = "block";
    const diceRollResults = document.getElementById("diceRollResults");
    diceRollResults.innerHTML = "";
    const rollDiceBtn = document.getElementById("rollDiceBtn");
    rollDiceBtn.style.display = "block";
    rollDiceBtn.textContent = `Joueur 1 - Lancer le dé`;
    rollDiceBtn.onclick = function () {
        rollDiceForPlayer(gameConfig.players[0], 0);
        rollDiceBtn.style.display = "none";
    };
}

function showDiceRollScreen() {
    startDiceRoll();
}

function testShowDiceScreen() {
    document.getElementById("diceRollScreen").style.display = "block";
}


function rollDiceForPlayer(player, index) {

    if (gameConfig.soundEnabled) {
        const rollStartSound = new Audio('./assets/audio/Dice Roll Sound.mp3');
        rollStartSound.volume = 0.3;
        rollStartSound.play().catch(e => console.warn("Son de lancement non lu", e));
    }


    const dice = document.querySelector("#diceRollScreen .dice-3d");
    const diceRollResults = document.getElementById("diceRollResults");

    if (!dice) {
        console.error("Dé non trouvé!");
        return;
    }
    const playerResultDiv = document.createElement("div");
    playerResultDiv.className = "player-dice-result";
    playerResultDiv.innerHTML = `
        <div style="display: flex; align-items: center;">
            <span class="player-color" style="background: ${player.color};"></span>
            <span>Joueur ${player.id}</span>
        </div>
        <span class="dice-value">...</span>
    `;
    diceRollResults.appendChild(playerResultDiv);

    dice.classList.add("rolling");
    setTimeout(() => {
        const result = Math.floor(Math.random() * 6) + 1;
        dice.classList.remove("rolling");
        console.log("Résultat du dé pour Joueur", player.id, ":", result);
        positionDice(result);
        playerResultDiv.querySelector(".dice-value").textContent = result;
        player.diceRoll = result;
        if (gameConfig.soundEnabled) {
            const diceSound = new Audio('./assets/audio/diceSound.mp3');
            diceSound.volume = 0.3;
            diceSound.play().catch(e => console.warn("Son du dé impossible", e));
        }
        if (index < gameConfig.players.length - 1) {
            const rollDiceBtn = document.getElementById("rollDiceBtn");
            rollDiceBtn.style.display = "block";
            rollDiceBtn.textContent = `Joueur ${index + 2} - Lancer le dé`;
            rollDiceBtn.onclick = function () {
                rollDiceForPlayer(gameConfig.players[index + 1], index + 1);
                rollDiceBtn.style.display = "none";
            };
        } else {
            setTimeout(() => determineFirstPlayer(), 1000);
        }
    }, 2000);
}
function positionDice(result) {
    const dice = document.querySelector("#diceRollScreen .dice-3d");
    if (!dice) {
        console.error("Dé non trouvé pour positioning!");
        return;
    }

    const transformMap = {
        1: 'rotateX(0deg) rotateY(0deg)', 
        2: 'rotateX(-90deg) rotateY(0deg)', 
        3: 'rotateX(0deg) rotateY(90deg)', 
        4: 'rotateX(0deg) rotateY(-90deg)',
        5: 'rotateX(90deg) rotateY(0deg)',
        6: 'rotateX(180deg) rotateY(0deg)' 
    };
    console.log(transformMap[result]);

    dice.style.transform = transformMap[result];
}
function determineFirstPlayer() {
    const diceRollResults = document.getElementById("diceRollResults");
    const players = [...gameConfig.players];
    players.sort((a, b) => b.diceRoll - a.diceRoll);
    const topRoll = players[0].diceRoll;
    const tiedPlayers = players.filter(p => p.diceRoll === topRoll);
    if (tiedPlayers.length > 1) {
        diceRollResults.innerHTML += `<div class="dice-message">Égalité ! Relance pour Joueurs ${tiedPlayers.map(p => p.id).join(", ")}</div>`;
        tiedPlayers.forEach(p => p.diceRoll = 0);
        const rollDiceBtn = document.getElementById("rollDiceBtn");
        rollDiceBtn.style.display = "block";
        rollDiceBtn.textContent = `Joueur ${tiedPlayers[0].id} - Relancer`;
        rollDiceBtn.onclick = function () {
            rollDiceForPlayer(tiedPlayers[0], 0);
            rollDiceBtn.style.display = "none";
        };
    } else {
        gameConfig.currentTurn = players[0].id;
        diceRollResults.innerHTML += `<div class="dice-message">Joueur ${players[0].id} commence !</div>`;
        document.getElementById("startWithDiceBtn").style.display = "flex";
        document.getElementById("startWithDiceBtn").onclick = startGameAfterDice;
    }
}
function startGameAfterDice() {
    document.getElementById("diceRollScreen").style.display = "none";
    const startGameAudio = new Audio('assets/audio/startGameSound.mp3');
    startGameAudio.play().catch(e => {
        console.warn("Impossible de jouer le son au démarrage du jeu :", e);
    });
    showStartGameMessage();
    if (gameConfig.traps.enabled) {
        generateTraps();
    }
    placeCharactersOnBoard();
    renderPlayerCards();
    updateGameInterface();
    gameConfig.gameStarted = true;
    console.log("Jeu démarré avec succès!");
    gameStatus.textContent = `Tour du Joueur ${gameConfig.currentTurn} - Choisissez une action`;
}
