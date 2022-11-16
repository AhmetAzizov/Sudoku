var boxRow;
var boxCol;
var busy = false;
var test2 = 0;


function createStartPage(){
  const body = document.body;

  var startButtonn = document.createElement("button");
  startButtonn.id = "startButton";
  //startButtonn.onclick = startButton();
  startButtonn.onclick = () => {startButton()};
  startButtonn.innerText = "START";

  var selectDifficulty = document.createElement("select");
  selectDifficulty.id = "selectDifficulty";
  
  var optionDefault = document.createElement("option");
  optionDefault.selected = true;
  optionDefault.value = "0";
  optionDefault.disabled = true;
  optionDefault.hidden = true;
  optionDefault.innerText = "------Difficulty------";

  const optionEasy = document.createElement("option");
  optionEasy.value = "3";
  optionEasy.innerText = "Easy";

  const optionMedium = document.createElement("option");
  optionMedium.value = "4";
  optionMedium.innerText = "Medium";

  const optionHard = document.createElement("option");
  optionHard.value = "3";
  optionHard.innerText = "Hard";

  selectDifficulty.append(optionDefault, optionEasy, optionMedium, optionHard);


  var selectFormat = document.createElement("select");
  selectFormat.id = "selectFormat";

  const optionFormatDefault = document.createElement("option");
  optionFormatDefault.value = "0";
  optionFormatDefault.selected = true;
  optionFormatDefault.innerText = "------Format------";

  const option6x6 = document.createElement("option");
  option6x6.value = "2,3";
  option6x6.innerText = "6 x 6";

  const option9x9 = document.createElement("option");
  option9x9.value = "3,3";
  option9x9.innerHTML = "9 x 9";

  selectFormat.append(optionFormatDefault, option6x6, option9x9)
  
  body.append(startButtonn, selectDifficulty, selectFormat);
}

function deleteStartPage(){
  document.getElementById("startButton").remove();
  document.getElementById("selectFormat").remove();
  document.getElementById("selectDifficulty").remove();
}

function deleteMainPage(){
  document.getElementById("sudokuContainer").remove();
  document.getElementById("sideGroupBox").remove();
}

function createMainPage(format){
  var buttonPopup = document.createElement("div");
	buttonPopup.id = "buttonPopup"
	
	for (var a = 1; a < format + 1; a++) {
      var button1 = document.createElement("div");
			button1.id = `button${a}`;
			button1.classList.add("button");
			button1.innerHTML = `${a}`;
			
			buttonPopup.append(button1);
    	}
		
	var clearButton = document.createElement("div");
	clearButton.id = "clearButton";
	clearButton.classList.add("button");
	clearButton.innerHTML = "clear";
	
	var tipButton = document.createElement("div");
	tipButton.id = "tipButton";
	tipButton.classList.add("button");
	tipButton.innerHTML = "&#128161;";
	
	buttonPopup.append(clearButton, tipButton);
	
	var sideGroupBox = document.createElement("div");
	sideGroupBox.id = "sideGroupBox";
	
	var menuButton = document.createElement("div");
	menuButton.id = "menuButton";
	menuButton.classList.add("sideButton");
	menuButton.innerHTML = "&#127968;";

  var sideTipButton = document.createElement("div");
  sideTipButton.id = "sideTipButton";
  sideTipButton.classList.add("sideButton");
  sideTipButton.innerHTML = "&#128161; 0";
	
	var solveButton = document.createElement("div");
	solveButton.id = "solveButton";
	solveButton.classList.add("sideButton");
	solveButton.innerHTML = "Solve the Game";
	
	var pauseButton = document.createElement("div");
	pauseButton.id = "pauseButton";
	pauseButton.classList.add("sideButton");
	pauseButton.innerHTML = "&#9208;";
	
	var timer = document.createElement("div");
	timer.id = "timer";
	timer.classList.add("sideButton");
	timer.innerHTML = "00:00";
	
	sideGroupBox.append(menuButton, sideTipButton, solveButton, pauseButton, timer);

  var sudokuContainer = document.createElement("div");
  sudokuContainer.id = "sudokuContainer";
	
	for (var a = 1; a < format + 1; a++) {
      for (var b = 1; b < format + 1; b++) {
        var inputOdd = Math.ceil(a / boxRow) % 2 ^ Math.ceil(b / boxCol) % 2;
        
        var buttons = document.createElement("div");
        buttons.id = `a${a};${b}`;
        buttons.classList.add("input");
        buttons.classList.add(`input${inputOdd}`);
        
        sudokuContainer.append(buttons);
      }
    }
	
  sudokuContainer.append(buttonPopup);
	document.body.append(sideGroupBox, sudokuContainer);
}

createStartPage();

// this is the function that is invoked when the user presses start button 
function startButton(){
  if (busy) {
    return;
  }
  busy = true;
  try {
    // error message is shown if the user decides to press the start button without selecting difficulty, format or neither of them. Error message will be shown accordingly 
    if (document.getElementById("selectDifficulty").value == "0" && document.getElementById("selectFormat").value == "0") {
      alert("both difficulty and Format aren't selected");
      return;
    }
    else if (document.getElementById("selectDifficulty").value == "0") {
      alert("difficulty isn't selected");
      return;
    }else if (document.getElementById("selectFormat").value == "0") {
      alert("Format isn't selected");
      return;
    }

    currentFormat = document.getElementById("selectFormat").value; // this variable contains the value of dropdown "selectFormat", either 2,3 or 3,3.

    // these 2 variables store the information about the number of rows and columns will there be by looking at the value of currentFormat variable.
    boxRow = parseInt(currentFormat[0]); 
    boxCol = parseInt(currentFormat[2]);

    // this function takes 2 arguments and returns them in the specified format.
    function getIndex(row, col) {
      return row + ";" + col;
    }

    var format = boxRow * boxCol; // this variable stores the information whether the game will be 6x6 or 9x9 by simply multiplying the two sides.

    // this array contains numbers from 1 to 6 or 9 depending on the format user has chosen.
    var __random = [];
    for (let index = 0; index < format; index++) {
      __random.push(index + 1);
    }

    createMainPage(format);
    
    // here, we set the width of the container according to the format of the game. We do this to ensure the boxes inside the container are fitted correctly.
    document.getElementById("sudokuContainer").style.width = `${format * 100}px`; 

    
    // function popupButtons contains even listeners of buttons inside the popup. We store them in a function in order to be able to loop them and save space.
    for (var buttonIndex = 1; buttonIndex < format + 1; buttonIndex++) {
      popupButtons(buttonIndex);
    }

    function popupButtons(buttonIndex) {
      document.getElementById(`button${buttonIndex}`).onclick = () => {
        var error = 0;
        document.getElementById("buttonPopup").style.visibility = "hidden";

        document.getElementById(`a${getIndex(num1, num2)}`).innerHTML = `${buttonIndex}`;
        sudokuMatrix[getIndex(num1, num2)] = buttonIndex;

        for (var a = 1; a < format + 1; a++) {
          for (var b = 1; b < format + 1; b++) {
            currentValue = document.getElementById(`a${getIndex(a, b)}`).innerHTML;
            if (!checkMatrix(a, b, currentValue)) {
              error = 1;
              document.getElementById(`a${getIndex(a, b)}`).classList.add("cellError");
            } else
              document.getElementById(`a${getIndex(a, b)}`).classList.remove("cellError");
          }
        }

        var inputs = document.getElementsByClassName("input");
        for (let index = 0; index < inputs.length; index++) {
          const element = inputs[index];
          element.classList.remove("cellHover");
          element.classList.remove("cellActive");
        }


        if (Object.keys(sudokuMatrix).length == format ** 2 && error == 0) {
          document.getElementById("endScreen").style.visibility = "visible";
          document.getElementById("endScreenFinishTime").innerHTML = minutesDisplay + ":" + secondsDisplay;
          clearInterval(timer);
        }
      }
    }

    document.getElementById("menuButton").onclick = () => {
      document.getElementById("sudokuContainer").innerHTML = "";
      //document.getElementById("mainBody").innerHTML = mainbody; 

      createStartPage();
      deleteMainPage();

      clearInterval(timer);
    }

    document.getElementById("solveButton").onclick = () => {
      for (const key in matrixClone) {
        const element = matrixClone[key];
        document.getElementById(`a${key}`).innerHTML = element;
        //document.getElementById(`a${key}`).classList.add("cellInitial");
      }

      var inputs = document.getElementsByClassName("input");
      for (let index = 0; index < inputs.length; index++) {
        const element = inputs[index];
        element.classList.remove("cellError");
      }

      clearInterval(timer);
    }

    document.getElementById("pauseButton").onclick = () => {
      // document.getElementById("sudokuContainer").style.visibility = "hidden";
      document.getElementById("pauseScreen").style.visibility = "visible";

      document.getElementById("sudokuContainer").style.pointerEvents = "none";

      document.getElementById("pauseScreenTimeLeft").innerHTML = minutesDisplay + ":" + secondsDisplay;

      isPaused = true;
    }

    document.getElementById("pauseScreenResumeButton").onclick = () => {
      // document.getElementById("sudokuContainer").style.visibility = "visible";
      document.getElementById("pauseScreen").style.visibility = "hidden";

      document.getElementById("sudokuContainer").style.pointerEvents = "all";

      isPaused = false;
    }

    document.getElementById("endScreenHomeButton").onclick = () => {
      deleteMainPage();
      createStartPage();

      document.getElementById("endScreen").style.visibility = "hidden";
    }

    document.getElementById("endScreenReturnButton").onclick = () => {
      document.getElementById("endScreen").style.visibility = "hidden";
      
      clearInterval(timer);
    }

    document.getElementById("clearButton").onclick = () => {
      document.getElementById("buttonPopup").style.visibility = "hidden";

      document.getElementById(`a${getIndex(num1, num2)}`).innerHTML = null;
      delete sudokuMatrix[getIndex(num1, num2)];

      for (var a = 1; a < format + 1; a++) {
        for (var b = 1; b < format + 1; b++) {currentValue = document.getElementById(`a${getIndex(a, b)}`).innerHTML;
          if (!checkMatrix(a, b, currentValue))
            document.getElementById(`a${getIndex(a, b)}`).classList.add("cellError");
          else
            document.getElementById(`a${getIndex(a, b)}`).classList.remove("cellError");
        }
      }

      var inputs = document.getElementsByClassName("input");
        for (let index = 0; index < inputs.length; index++) {
          const element = inputs[index];
          element.classList.remove("cellHover");
          element.classList.remove("cellActive");
        }
    }
    

    var $ = document.getElementById.bind(document);

    var num1, num2;

    function onchangeHandler(i, j) {
      $(`a${getIndex(i, j)}`).addEventListener("click", (e) => {
        document.getElementById("buttonPopup").style.visibility = "visible";

        lightRowsAndColumns(i, j, e.target);

        num1 = i;
        num2 = j;

        var popupLeft = 60 + (j - 1) * 100;
        var popupTop = 50 + (i - 1) * 100;

        document.getElementById("buttonPopup").style.left = `${popupLeft}px`;
        document.getElementById("buttonPopup").style.top = `${popupTop}px`;
      });
    }

    // to change color of popup buttons when we hover over
    var buttons = document.getElementsByClassName("button");
      for (let index = 0; index < buttons.length - 1; index++) { // we put buttons.length - 1 to not affect tip button
        const element = buttons[index];
        
        element.addEventListener("mouseover", () => (element.style.backgroundColor = "rgb(85, 135, 154)"))
        element.addEventListener("mouseout", () => (element.style.backgroundColor = "rgb(133, 208, 235"))
    }
-

    function toggleRight(){
      num2++;
      
      var inputs = document.getElementsByClassName("input");
          for (let index = 0; index < inputs.length; index++) {
            const element = inputs[index];
            element.classList.remove("cellHover");
            element.classList.remove("cellActive");
          }
        
      for (var i = 1; i < format + 1; i++) {
            document.getElementById(`a${getIndex(i, num2)}`).classList.add("cellHover");
            document.getElementById(`a${getIndex(num1, i)}`).classList.add("cellHover");
          }
      
      document.getElementById(`a${getIndex(num1, num2)}`).classList.add("cellActive");
    }

    window.addEventListener('keydown', function (e) {
      var key = e.keyCode;
      if (key === 39)
      {
          toggleRight();
      }
      });

    // ------------------------------------------------------------

    function lightRowsAndColumns(row, col, e) {
      var inputs = document.getElementsByClassName("input");
      for (let index = 0; index < inputs.length; index++) {
        const element = inputs[index];
        element.classList.remove("cellHover");
        element.classList.remove("cellActive");
      }

      for (var i = 1; i < format + 1; i++) {
        document.getElementById(`a${getIndex(i, col)}`).classList.add("cellHover");
        document.getElementById(`a${getIndex(row, i)}`).classList.add("cellHover");
      }
      //e.getAttribute("sudoku-row");

      //var fnd = e.querySelector('[sudoku-row="1"][sudoku-column="1"]');

      e.classList.add("cellActive");
    }

  

    document.addEventListener("click", function (e) {
      if (!document.getElementById("sudokuContainer").contains(e.target) || document.getElementById("sideGroupBox").contains(e.target)){
        var inputs = document.getElementsByClassName("input");
        for (let index = 0; index < inputs.length; index++) {
          const element = inputs[index];
          element.classList.remove("cellHover");
          element.classList.remove("cellActive");
        }

        document.getElementById("buttonPopup").style.visibility = "hidden";
      }
    });

    function getRandomArray() {
      return __random.sort(() => Math.random() - 0.5).slice();
    }

    var sudokuMatrix = {};
    var matrixClone = {};

    function createMatrix() {
      for (var row = 1; row < format + 1; row++) {
        var randomArray = getRandomArray();
        var test = 0;
        test2 = 0;
        for (var col = 1; col < format + 1; col++) {
          var randomValue = Math.floor(Math.random() * randomArray.length);

          var finalValue = randomArray[randomValue];

          if (checkMatrix(row, col, finalValue)) {
            sudokuMatrix[getIndex(row, col)] = finalValue;
            // matrixClone[getIndex(row, col)] = finalValue;

            randomArray.splice(randomValue, 1);
          } else {
            test++;
            col--;
          }

          if (test > format) {
            for (let index = 0; index < format; index++) {
              delete sudokuMatrix[getIndex(row, index + 1)];
              // delete matrixClone[getIndex(row, index + 1)];
            }
            col = 0;
            test = 0;
            randomArray = getRandomArray();
            test2++;
          }

          if (test2 > 30) {
            for (let index = 0; index < format; index++) {
              delete sudokuMatrix[getIndex(row - 1, index + 1)];
              delete sudokuMatrix[getIndex(row, index + 1)];

              // delete matrixClone[getIndex(row - 1, index + 1)];
              // delete matrixClone[getIndex(row, index + 1)];
            }
            row--;
            if (row > 0) row--;
            break;
          }
        }
      }
            
    }

    function checkMatrix(row, col, value) {
      for (var i = 1; i < format + 1; i++) {
        if (
          (i != row && sudokuMatrix[getIndex(i, col)] == value) ||
          (i != col && sudokuMatrix[getIndex(row, i)] == value)
        )
          return false;
      }

      var startX = Math.ceil(col / boxCol) - 1;
      var startY = Math.ceil(row / boxRow) - 1;

      for (var x = 1; x < boxCol + 1; x++) {
        var currentX = startX * boxCol + x;
        for (var y = 1; y < boxRow + 1; y++) {
          var currentY = startY * boxRow + y;
          if (currentX == col && currentY == row) {
            continue;
          }
          if (sudokuMatrix[getIndex(currentY, currentX)] == value) {
            return false;
          }
        }
      }
      return true;
    }

    function createDifficulty() {

      var difficulty = document.getElementById("selectDifficulty").value;

      if (boxRow == 3) difficulty = difficulty * 1.5;

      var c,
        b = [];

      for (var i = 1; i < format + 1; i++) {
        for (var j = 1; j < difficulty; j++) {
          c = Math.floor(Math.random() * 6) + 1;
          var ifduplicate;

          do {
            if (b.includes(c)) {
              ifduplicate = 1;
              c = Math.floor(Math.random() * format) + 1;
            } else {
              ifduplicate = 0;
            }
          } while (ifduplicate == 1);

          //document.getElementById(`a${i}${c}`).innerHTML = null;
          //document.getElementById(`a${i}${c}`).disabled = false;

          onchangeHandler(i, c);

          matrixClone[getIndex(i, c)] = sudokuMatrix[getIndex(i, c)];

          delete sudokuMatrix[getIndex(i, c)];

          b.push(c);
        }
        b = [];
      }
    }

    createMatrix();

    createDifficulty();

    console.log(matrixClone);

    for (const key in sudokuMatrix) {
      const element = sudokuMatrix[key];
      document.getElementById(`a${key}`).innerHTML = element;
      document.getElementById(`a${key}`).classList.add("cellInitial");
    }

    // document.getElementById("mainBody").innerHTML = "";

    // ---------------------------------------------------------------------

    var seconds = 0;
    var minutes = 0;
    var secondsDisplay;
    var minutesDisplay;
    var isPaused = false;

    var timer = setInterval(interval, 1000);

    function interval(){
      if(!isPaused){
      seconds++;

      if(seconds < 10){
        secondsDisplay = "0" + seconds;
      }
      if(seconds > 9){
        secondsDisplay = `${seconds}`
      }
      if(seconds == 60){
        minutes++;
        seconds = 0;
        secondsDisplay = "00";
      }
      if(minutes < 9){
        minutesDisplay = "0" + minutes;
      }
      if(minutes > 9){
        minutesDisplay = `${minutes}`;
      }
      
      document.getElementById("timer").innerHTML = minutesDisplay + ":" + secondsDisplay;
    }
    }

    deleteStartPage();
  } finally {
    busy = false;
  }
}
