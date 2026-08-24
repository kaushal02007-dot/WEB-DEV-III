const crypto = require("crypto");

function rollDice() {
    return crypto.randomInt(1, 7);  //why 1,7 becoz crypto.randomInt(min, max) uses: min --> included & max--> excluded to it will generate 1 to 6 only not 7
    
}

for (let i = 1; i <= 5; i++) {
    console.log(`Roll ${i}: ${rollDice()}`);
}