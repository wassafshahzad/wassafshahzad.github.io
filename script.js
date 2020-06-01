
const statusDisplay = document.querySelector('.game--status');
const URL = "http://wassaf.pythonanywhere.com/tree"

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

let moveTree;
// this represents nice empty boxes of board and will be used as a key to get optimal move from moveTree
let boardKey = "+++++++++";


const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

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

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
    if( currentPlayer == "O"){
        getOptimalMoveFromTree().then((index)=> {
            document.getElementById(
                index.toString()).
                click()
            enableClick()
        })
    }
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

async function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }
    disableClick()
    boardKey = boardKey.substring(0, clickedCellIndex) + currentPlayer.toLowerCase() + boardKey.substring(clickedCellIndex + 1);
    handleCellPlayed(clickedCell, clickedCellIndex);
    
    if(!moveTree){
        await getMoveTree(clickedCellIndex);
     }
     handleResultValidation();

}

function handleRestartGame() {
    resetBoard()
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

function disableClick(){
    document.getElementById("container").classList.add("disable")
}

function enableClick(){
    document.getElementById("container").classList.remove("disable")
}

function disableBtn(){
    document.getElementById("btn").classList.add("disable")
}

function enableBtn(){
    document.getElementById("btn").classList.remove("disable")
}


async function getMoveTree(index){
    disableBtn()
    return fetch(URL,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({
              "index":index
            })
    })
    .then(response => response.json()).then((data) => {
        enableBtn()
        moveTree = data
    })};

async function getOptimalMoveFromTree(){
    score = -99
    index = undefined
    moveTree[boardKey].map((ele)=>{
        if(ele[1]>=score){
            score = ele[1]
            index = ele[2]
        }
    });
    return index   
}

function resetBoard(){
    enableClick()
    boardKey = "+++++++++";
    moveTree = undefined;
}

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);