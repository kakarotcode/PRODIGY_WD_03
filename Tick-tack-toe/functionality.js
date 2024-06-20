document.addEventListener("DOMContentLoaded", () => {
    const cells = document.querySelectorAll(".cell");
    const statusDiv = document.getElementById("status");
    const resetButton = document.getElementById("reset");
    const modeSelectDiv = document.getElementById("mode-select");
    const pvpButton = document.getElementById("pvp");
    const pvcButton = document.getElementById("pvc");

    let currentPlayer = "X";
    let gameActive = true;
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let gameMode = "PVP";  // Default game mode is Player vs Player

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(event) {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

        if (gameState[clickedCellIndex] !== "" || !gameActive) {
            return;
        }

        updateGameState(clickedCell, clickedCellIndex);
        checkGameResult();

        if (gameMode === "PVC" && gameActive && currentPlayer === "O") {
            disableCells();
            statusDiv.textContent = "Computer is thinking...";
            statusDiv.classList.add("blink");
            setTimeout(makeComputerMove, 1000);  // Add 1 second delay
        }
    }

    function updateGameState(cell, index) {
        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(`player${currentPlayer}`);
    }

    function checkGameResult() {
        let roundWon = false;

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusDiv.textContent = `Player ${currentPlayer} has won!`;
            gameActive = false;
            return;
        }

        if (!gameState.includes("")) {
            statusDiv.textContent = "It's a draw!";
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        if (gameMode === "PVC" && currentPlayer === "O") {
            statusDiv.textContent = "Computer is thinking...";
            statusDiv.classList.add("blink");
        } else {
            statusDiv.textContent = `It's ${currentPlayer}'s turn`;
        }
    }

    function resetGame() {
        gameActive = true;
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        statusDiv.textContent = `It's ${currentPlayer}'s turn`;
        cells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove("playerX", "playerO");
        });
        statusDiv.classList.remove("blink");
        modeSelectDiv.style.display = "block";
        enableCells();
    }

    function setGameMode(mode) {
        gameMode = mode;
        resetGame();
        modeSelectDiv.style.display = "none";
    }

    function makeComputerMove() {
        let availableCells = [];
        gameState.forEach((cell, index) => {
            if (cell === "") availableCells.push(index);
        });

        if (availableCells.length === 0) return;

        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const cellIndex = availableCells[randomIndex];
        const cell = cells[cellIndex];

        updateGameState(cell, cellIndex);
        checkGameResult();
        statusDiv.classList.remove("blink");
        if (gameActive) {
            statusDiv.textContent = `It's ${currentPlayer}'s turn`;
        }
        enableCells();
    }

    function disableCells() {
        cells.forEach(cell => cell.removeEventListener("click", handleCellClick));
    }

    function enableCells() {
        cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    }

    enableCells();  // Initial enabling of cell clicks
    resetButton.addEventListener("click", resetGame);
    pvpButton.addEventListener("click", () => setGameMode("PVP"));
    pvcButton.addEventListener("click", () => setGameMode("PVC"));

    statusDiv.textContent = `Select game mode to start`;
});