// SO 24464404
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'calc> '
});


// Teken types
//
// EOF (end-of-file) token is used to indicate that
// there is no more input left for lexical analysis
const INTEGER = 'INTEGER';
const PLUS = 'PLUS';
const MINUS = 'MINUS';
const EOF = 'EOF';

function Token(type, value) {
    this.type = type;
    this.value = value;
    this.toString = function(){
        return 'Token(`${this.type}, ${this.value})`';
    };
}

function isNumeric(n) {
    return !isNaN(n - parseFloat(n));
}

String.prototype.isSpace = function(char) {
    if (char.trim() === '') {
        return false;
    }
    return true;
}

function Interpreter(text) {
    this.text = text;
    this.pos = 0;

    this.currentToken = null;
    this.currentChar = this.text.slice(this.pos, this.pos+1);

    this.error = function() {
        throw 'Syntax error';
    }
        
    this.advance = function() {
        this.pos += 1;
        if (this.pos > this.text.length - 1) {
            this.currentChar = null;
        } else {
            this.currentChar = text.slice(this.pos, this.pos+1);
        }
    }
    this.skipWhitespace = function() {
        while (this.currentChar != null && this.currentChar === ' ') {
            this.advance();
        }
    }
    this.integer = function() {
        result = '';
        while (this.currentChar != null && isNumeric(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return parseInt(result);
    }   

    this.getNextToken = function() {
        while (this.currentChar !== null) {
            console.log(this.currentChar);

            if (this.currentChar === ' ') {
                this.skipWhitespace();
                continue;
            }

            if (isNumeric(this.currentChar)) {
                return new Token(INTEGER, this.integer());
            }

            if (this.currentChar === '+') {
                this.advance();
                return new Token(PLUS, this.currentChar);
            }

            if (this.currentChar === '-') {
                this.advance();
                return new Token(MINUS, this.currentChar);
            }

            this.error();
        }
        return new Token(EOF, null);
    }

    this.eat = function(tokenType) {
        if (this.currentToken.type === tokenType) { 
            this.currentToken = this.getNextToken();
        } else {
            this.error();
        }
    }
    
    this.term = function() {
        token = this.currentToken;
        this.eat(INTEGER);
        return token.value;
    }
    
    this.expr = function() {
        this.currentToken = this.getNextToken();

        let result = this.term();
        console.log(result);
        while ([PLUS, MINUS].includes(this.currentToken.type)) {
            token = this.currentToken
            if (token.type === PLUS) {
                this.eat(PLUS);
                num = this.term();
                result += num;
            } else {
                this.eat(MINUS);
                num = this.term();
                result -= num;
            }
        }

       return result;
    }
}

const main = function(){
    //https://stackoverflow.com/questions/k/how-to-readline-infinitely-in-node-js
    rl.on('line', function(text) {
        interpreter = new Interpreter(text.trim());
        result = interpreter.expr();
        console.log(result);
        rl.prompt();
    }).on('close', function() {
        process.exit(0);
    });
    rl.prompt();
}

main();

