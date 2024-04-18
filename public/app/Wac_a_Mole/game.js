// Selects the html element
const cursor = document.querySelector('.cursor')
const holes = [...document.querySelectorAll('.hole')]
const scoreEl = document.querySelector('.score span')
const streakEl = document.querySelector('.streak span')
const moleEl = document.querySelector('.molenumber span')
const bombEl = document.querySelector('.bombnumber span')
const darkmoleEl = document.querySelector('.darkmolenumber span')

// Initializes the variables
let score = 0
let streak = 0
let bombnumber = 0
let molenumber = 0
let darkmolenumber = 0

// Sets the maximum number of img
const maxmoles = 4
const maxbomb = 3
const maxdarkmoles = 2

function run(){
    if (score >= 0 && score <= 100) { // If the score is between 0 and 100
        function mole(){ // Function to handle the appearance of regular moles
            const img = document.createElement('img') // Creates an img element
            img.classList.add('mole') // Adds the class 'mole' to the img element
            img.src = 'img/moles.png' // Sets the source of the img element

            if (molenumber < maxmoles) { // If the number of moles is less than the maximum allowed
                const i = Math.floor(Math.random() * holes.length) // Generates a random index for the holes array
                const hole = holes[i] // Selects the hole element at the generated index
                let timer = null // Initializes the timer variable
            
                img.addEventListener('click', () => { // Event listener for when the mole is clicked
                    score += 10 // Increases the score by 10
                    streak += 1 // Increases the streak by 1
                    streakEl.textContent = streak // Updates the streak element with the new streak value
                    scoreEl.textContent = score // Updates the score element with the new score value
                    img.src = 'img/whacked.png' // Changes the source of the img element to display a whacked mole
                    clearTimeout(timer) // Clears the timer
                    setTimeout(() => {
                        hole.removeChild(img) // Removes the mole from the hole
                        molenumber -= 1 // Decreases the mole count
                        moleEl.textContent = molenumber // Updates the mole count element
                        run() // Calls the run function again to continue the game
                    }, 500) // Waits for 500 milliseconds before removing the mole
                })
            
                hole.appendChild(img) // Appends the mole img to the selected hole
                molenumber += 1 // Increases the mole count
                moleEl.textContent = molenumber // Updates the mole count element
                timer = setTimeout(() => {
                    hole.removeChild(img) // Removes the mole from the hole
                    run() // Calls the run function again to continue the game
                    molenumber -= 1 // Decreases the mole count
                    moleEl.textContent = molenumber // Updates the mole count element
                }, 1500) // Waits for 1500 milliseconds before removing the mole
            }
        }
        mole() // Calls the mole function to start showing regular moles
      } else if (score >= 200 && score <= 500) {
        function darkmole(){ // Function to handle the appearance of dark moles
            const img3 = document.createElement('img') // Creates an img element for the dark mole
            img3.classList.add('moles-dark') // Adds the class 'moles-dark' to the img element
            img3.src = 'img/moles_dark.png' // Sets the source of the img element to display a dark mole
        
            const availableHoles = holes.filter(hole => !hole.holeInUse) // Filters out holes that are not in use
            if (availableHoles.length > 0 && darkmolenumber < maxdarkmoles) { // If there are available holes and the dark mole count is less than the maximum allowed
                const i3 = Math.floor(Math.random() * availableHoles.length) // Generates a random index for the available holes array
                const hole3 = availableHoles[i3] // Selects the hole element at the generated index
                let timer3 = null // Initializes the timer variable
        
                img3.addEventListener('click', () => { // Event listener for when the dark mole is clicked
                    score += 20 // Increases the score by 20
                    streak += 1 // Increases the streak by 1
                    streakEl.textContent = streak // Updates the streak element with the new streak value
                    scoreEl.textContent = score // Updates the score element with the new score value
                    img3.src = 'img/whacked_dark.png' // Changes the source of the img element to display a whacked dark mole
                    clearTimeout(timer3) // Clears the timer
                    setTimeout(() => {
                        hole3.removeChild(img3) // Removes the dark mole from the hole
                        hole3.holeInUse = false // Marks the hole as not in use
                        darkmolenumber -= 1 // Decreases the dark mole count
                        darkmoleEl.textContent = darkmolenumber // Updates the dark mole count element
                        run() // Calls the run function again to continue the game
                    }, 500) // Waits for 500 milliseconds before removing the dark mole
                })
        
                hole3.appendChild(img3) // Appends the dark mole img to the selected hole
                hole3.holeInUse = true // Marks the hole as in use
                darkmolenumber += 1 // Increases the dark mole count
                darkmoleEl.textContent = darkmolenumber // Updates the dark mole count element
                timer3 = setTimeout(() => {
                    hole3.removeChild(img3) // Removes the dark mole from the hole
                    hole3.holeInUse = false // Marks the hole as not in use
                    darkmolenumber -= 1 // Decreases the dark mole count
                    darkmoleEl.textContent = darkmolenumber // Updates the dark mole count element
                    run() // Calls the run function again to continue the game
                }, 1000) // Waits for 1000 milliseconds before removing the dark mole
            }
        }
        darkmole() // Calls the darkmole function to start showing dark moles

        function bomb(){ // Function to handle the appearance of bombs
            const img2 = document.createElement('img') // Creates an img element for the bomb
            img2.classList.add('bomb') // Adds the class 'bomb' to the img element
            img2.src = 'img/bomb.png' // Sets the source of the img element to display a bomb
        
            const availableHoles = holes.filter(hole => !hole.holeInUse) // Filters out holes that are not in use
            if (availableHoles.length > 0 && bombnumber < maxbomb) { // If there are available holes and the bomb count is less than the maximum allowed
                const i2 = Math.floor(Math.random() * availableHoles.length) // Generates a random index for the available holes array
                const hole2 = availableHoles[i2] // Selects the hole element at the generated index
                let timer2 = null // Initializes the timer variable
        
                img2.addEventListener('click', () => { // Event listener for when the bomb is clicked
                    score -= 10 // Decreases the score by 10
                    streak = 0 // Resets the streak to 0
                    streakEl.textContent = streak // Updates the streak element with the new streak value
                    scoreEl.textContent = score // Updates the score element with the new score value
                    img2.src = 'img/explosion.png' // Changes the source of the img element to display an explosion
                    clearTimeout(timer2) // Clears the timer
                    setTimeout(() => {
                        hole2.removeChild(img2) // Removes the bomb from the hole
                        hole2.holeInUse = false // Marks the hole as not in use
                        bombnumber -= 1 // Decreases the bomb count
                        bombEl.textContent = bombnumber // Updates the bomb count element
                        run() // Calls the run function again to continue the game
                    }, 500) // Waits for 500 milliseconds before removing the bomb
                })
        
                hole2.appendChild(img2) // Appends the bomb img to the selected hole
                hole2.holeInUse = true // Marks the hole as in use
                bombnumber += 1 // Increases the bomb count
                bombEl.textContent = bombnumber // Updates the bomb count element
                timer2 = setTimeout(() => {
                    hole2.removeChild(img2) // Removes the bomb from the hole
                    hole2.holeInUse = false // Marks the hole as not in use
                    bombnumber -= 1 // Decreases the bomb count
                    bombEl.textContent = bombnumber // Updates the bomb count element
                    run() // Calls the run function again to continue the game
                }, 1250) // Waits for 1250 milliseconds before removing the bomb
            }
        }
        bomb() // Calls the bomb function to start showing bombs

        function mole(){ // Function to handle the appearance of regular moles
            const img = document.createElement('img') // Creates an img element
            img.classList.add('mole') // Adds the class 'mole' to the img element
            img.src = 'img/moles.png' // Sets the source of the img element
        
            const availableHoles = holes.filter(hole => !hole.holeInUse) // Filters out holes that are not in use
            if (availableHoles.length > 0 && molenumber < maxmoles) { // If there are available holes and the mole count is less than the maximum allowed
                const i = Math.floor(Math.random() * availableHoles.length) // Generates a random index for the available holes array
                const hole = availableHoles[i] // Selects the hole element at the generated index
                let timer = null // Initializes the timer variable
        
                img.addEventListener('click', () => { // Event listener for when the mole is clicked
                    score += 10 // Increases the score by 10
                    streak += 1 // Increases the streak by 1
                    streakEl.textContent = streak // Updates the streak element with the new streak value
                    scoreEl.textContent = score // Updates the score element with the new score value
                    img.src = 'img/whacked.png' // Changes the source of the img element to display a whacked mole
                    clearTimeout(timer) // Clears the timer
                    setTimeout(() => {
                        hole.removeChild(img) // Removes the mole from the hole
                        hole.holeInUse = false // Marks the hole as not in use
                        molenumber -= 1 // Decreases the mole count
                        moleEl.textContent = molenumber // Updates the mole count element
                        run() // Calls the run function again to continue the game
                    }, 500) // Waits for 500 milliseconds before removing the mole
                })
        
                hole.appendChild(img) // Appends the mole img to the selected hole
                hole.holeInUse = true // Marks the hole as in use
                molenumber += 1 // Increases the mole count
                moleEl.textContent = molenumber // Updates the mole count element
                timer = setTimeout(() => {
                    hole.removeChild(img) // Removes the mole from the hole
                    hole.holeInUse = false // Marks the hole as not in use
                    run() // Calls the run function again to continue the game
                    molenumber -= 1 // Decreases the mole count
                    moleEl.textContent = molenumber // Updates the mole count element
                }, 1500) // Waits for 1500 milliseconds before removing the mole
            }
        }
        mole() // Calls the mole function to start showing regular moles
      } else if (score >= 100 && score <= 200) {
        function bomb(){ // Function to handle the appearance of bombs
            const img2 = document.createElement('img') // Creates an img element for the bomb
            img2.classList.add('bomb') // Adds the class 'bomb' to the img element
            img2.src = 'img/bomb.png' // Sets the source of the img element to display a bomb
        
            const availableHoles = holes.filter(hole => !hole.holeInUse) // Filters out holes that are not in use
            if (availableHoles.length > 0 && bombnumber < maxbomb) { // If there are available holes and the bomb count is less than the maximum allowed
                const i2 = Math.floor(Math.random() * availableHoles.length) // Generates a random index for the available holes array
                const hole2 = availableHoles[i2] // Selects the hole element at the generated index
                let timer2 = null // Initializes the timer variable
        
                img2.addEventListener('click', () => { // Event listener for when the bomb is clicked
                    score -= 10 // Decreases the score by 10
                    streak = 0 // Resets the streak to 0
                    streakEl.textContent = streak // Updates the streak element with the new streak value
                    scoreEl.textContent = score // Updates the score element with the new score value
                    img2.src = 'img/explosion.png' // Changes the source of the img element to display an explosion
                    clearTimeout(timer2) // Clears the timer
                    setTimeout(() => {
                        hole2.removeChild(img2) // Removes the bomb from the hole
                        hole2.holeInUse = false // Marks the hole as not in use
                        bombnumber -= 1 // Decreases the bomb count
                        bombEl.textContent = bombnumber // Updates the bomb count element
                        run() // Calls the run function again to continue the game
                    }, 500) // Waits for 500 milliseconds before removing the bomb
                })
        
                hole2.appendChild(img2) // Appends the bomb img to the selected hole
                hole2.holeInUse = true // Marks the hole as in use
                bombnumber += 1 // Increases the bomb count
                bombEl.textContent = bombnumber // Updates the bomb count element
                timer2 = setTimeout(() => {
                    hole2.removeChild(img2) // Removes the bomb from the hole
                    hole2.holeInUse = false // Marks the hole as not in use
                    bombnumber -= 1 // Decreases the bomb count
                    bombEl.textContent = bombnumber // Updates the bomb count element
                    run() // Calls the run function again to continue the game
                }, 1250) // Waits for 1250 milliseconds before removing the bomb
            }
        }
        bomb() // Calls the bomb function to start showing bombs

        function mole(){ // Function to handle the appearance of regular moles
            const img = document.createElement('img') // Creates an img element
            img.classList.add('mole') // Adds the class 'mole' to the img element
            img.src = 'img/moles.png' // Sets the source of the img element
        
            const availableHoles = holes.filter(hole => !hole.holeInUse) // Filters out holes that are not in use
            if (availableHoles.length > 0 && molenumber < maxmoles) { // If there are available holes and the mole count is less than the maximum allowed
                const i = Math.floor(Math.random() * availableHoles.length) // Generates a random index for the available holes array
                const hole = availableHoles[i] // Selects the hole element at the generated index
                let timer = null // Initializes the timer variable
        
                img.addEventListener('click', () => { // Event listener for when the mole is clicked
                    score += 10 // Increases the score by 10
                    streak += 1 // Increases the streak by 1
                    streakEl.textContent = streak // Updates the streak element with the new streak value
                    scoreEl.textContent = score // Updates the score element with the new score value
                    img.src = 'img/whacked.png' // Changes the source of the img element to display a whacked mole
                    clearTimeout(timer) // Clears the timer
                    setTimeout(() => {
                        hole.removeChild(img) // Removes the mole from the hole
                        hole.holeInUse = false // Marks the hole as not in use
                        molenumber -= 1 // Decreases the mole count
                        moleEl.textContent = molenumber // Updates the mole count element
                        run() // Calls the run function again to continue the game
                    }, 500) // Waits for 500 milliseconds before removing the mole
                })
        
                hole.appendChild(img) // Appends the mole img to the selected hole
                hole.holeInUse = true // Marks the hole as in use
                molenumber += 1 // Increases the mole count
                moleEl.textContent = molenumber // Updates the mole count element
                timer = setTimeout(() => {
                    hole.removeChild(img) // Removes the mole from the hole
                    hole.holeInUse = false // Marks the hole as not in use
                    run() // Calls the run function again to continue the game
                    molenumber -= 1 // Decreases the mole count
                    moleEl.textContent = molenumber // Updates the mole count element
                }, 1500) // Waits for 1500 milliseconds before removing the mole
            }
        }
        mole() // Calls the mole function to start showing regular moles
      }else{
        //Notify if the user have won the game
        alert("Congratulations! You have won the game!");
      }  
}
run()
//If Restart button is clicked
function restartGame() {
    location.reload();
    console.log("Game restarted!");
}

var timer;
var ele = document.getElementById('timer');

(function (){
  var sec = 0;
  timer = setInterval(()=>{
    ele.innerHTML =+ sec;
    sec ++;
  }, 1000) // each 1 second
})() 

window.addEventListener('mousemove', e => {
    cursor.style.top = e.pageY + 'px'
    cursor.style.left = e.pageX + 'px'
})
window.addEventListener('mousedown', () => {
    cursor.classList.add('active')
})
window.addEventListener('mouseup', () => {
    cursor.classList.remove('active')
})