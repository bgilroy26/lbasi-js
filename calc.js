// SO 24464404
let readline = require('readline');

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


// Teken types
//
// EOF (end-of-file) token is used to indicate that
// there is no more input left for lexical analysis
const INTEGER = 'INTEGER';
const PLUS = 'PLUS';
const EOF = 'EOF';

function Token(type, value) {
    this.type = type;
    this.value = value;
}

function isNumeric(n) {
    return !isNaN(n - parseFloat(n));
}

function Interpreter(text) {
    this.text = text;
    this.pos = 0;

    this.currentToken = null;

    this.error = function() {
        throw 'Error parsing output';
    }
    this.getNextToken = function() {
        text = this.text;

        if (this.pos > text.length-1) {
            return new Token(EOF, null);
        }

        currentChar = text.slice(this.pos, this.pos+1);

        if (isNumeric(currentChar)) {
            token = new Token(INTEGER, parseInt(currentChar));
            this.pos += 1;
            return token;
        }

        if (currentChar === '+') {
            token = new Token(PLUS, currentChar);
            this.pos += 1;
            return token;
        }

        this.error();
    }

    this.eat = function(tokenType) {
        if (this.currentToken.type === tokenType) { 
            this.currentToken = this.getNextToken();
        } else {
            this.error();
        }
    }
    
    this.expr = function() {
        this.currentToken = this.getNextToken();

        left = this.currentToken;
        this.eat(INTEGER);

        op = this.currentToken;
        this.eat(PLUS);

        right = this.currentToken;
        this.eat(INTEGER);

        result = left.value + right.value;
        return result;
    }
}

const main = function(){
    try {
        //https://stackoverflow.com/questions/k/how-to-readline-infinitely-in-node-js
        rl.setPrompt('calc> ', 6);
        rl.on('line', function(text) {
            interpreter = new Interpreter(text.trim());
            result = interpreter.expr();
            console.log(result);
            rl.prompt();
        }).on('close', function() {
            process.exit(0);
        });
        rl.prompt();
    } catch(e){
        console.log(e);
    }
}

main();

