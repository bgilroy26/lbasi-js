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
const MUL = 'MUL';
const DIV = 'DIV';
const LPAREN = 'LPAREN';
const RPAREN = 'RPAREN';
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

function Lexer(text) {
    this.text = text;
    this.pos = 0;

    this.currentChar = this.text.slice(this.pos, this.pos+1);

    this.error = function() {
        throw 'Invalid character';
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

            if (this.currentChar === '*') {
                this.advance();
                return new Token(MUL, this.currentChar);
            }

            if (this.currentChar === '/') {
                this.advance();
                return new Token(DIV, this.currentChar);
            }

            if (this.currentChar === '(') {
                this.advance();
                return new Token(LPAREN, this.currentChar);
            }

            if (this.currentChar === ')') {
                this.advance();
                return new Token(RPAREN, this.currentChar);
            }

            this.error();
        }
        return new Token(EOF, null);
    }
}


function Interpreter(lexer) {
    this.lexer = lexer
    this.currentToken = this.lexer.getNextToken();;

    this.error = function() {
        throw 'Syntax error';
    }
        
    
    this.eat = function(tokenType) {
        if (this.currentToken.type === tokenType) { 
            this.currentToken = this.lexer.getNextToken();
        } else {
            this.error();
        }
    }
    
    this.factor = function() {
        token = this.currentToken;
        if (token.type === INTEGER) {
            this.eat(INTEGER);
            return token.value;
        } else if (token.type === LPAREN) {
            this.eat(LPAREN);
            result = this.expr();
            this.eat(RPAREN);
            return result;
        }
    }

    this.term = function() {
        let result = this.factor();

        while ([MUL, DIV].includes(this.currentToken.type)) {
            token = this.currentToken;
            if (token.type === MUL) {
                this.eat(MUL);
                result = result * this.factor();
            } else if (token.type === DIV) {
                this.eat(DIV);
                result = result / this.factor();
            }
        }
        return result;
    }

    
    this.expr = function() {
        let result = this.term();

        while ([PLUS, MINUS].includes(this.currentToken.type)) {
            token = this.currentToken;
            if (token.type === PLUS) {
                this.eat(PLUS);
                result = result + this.term();
            } else if (token.type == MINUS) {
                this.eat(MINUS);
                result = result - this.term();
            }
        } 
        return result;
    }
}

const main = function(){
    //https://stackoverflow.com/questions/k/how-to-readline-infinitely-in-node-js
    rl.on('line', function(text) {
        lexer = new Lexer(text)
        interpreter = new Interpreter(lexer);
        result = interpreter.expr();
        console.log(result);
        rl.prompt();
    }).on('close', function() {
        process.exit(0);
    });
    rl.prompt();
}

main();

