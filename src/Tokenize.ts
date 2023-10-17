class Token {
    /* Types
            -1:eof
            0:number
            1:expr
            2:parenEnter
            3:parenExit
            4:add
            5:subtract
            6:mul
            7:div
            8:pow

    */
    type: number;
    val: null | string;

    constructor(type, val = null) {
        this.type = type;
        this.val = val;
    }
}

function tokenize(inp) {
    let toks = [];
    let ctok = new Token(-2);
    let i = 0;
    const sreg = /[a-zA-Z]+/;
    const numreg = /[0-9\.]+/;
    while (i < inp.length) {
        let ch = inp[i];
        if (ctok.type == -2 && sreg.test(ch)) {
            ctok = new Token(1, ch);
        } else if (ctok.type == 1 && sreg.test(ch)) {
            ctok.val += '' + ch;
        } else if (ctok.type != 1 && sreg.test(ch)) {
            toks.push(new Token(ctok.type, ctok.val));
            ctok = new Token(1, '' + ch);
        } else if (ctok.type == -2 && numreg.test(ch)) {
            ctok = new Token(0, '' + ch);
        } else if (ctok.type == 0 && numreg.test(ch)) {
            ctok.val += '' + ch;
        } else if (ctok.type != 0 && numreg.test(ch)) {
            toks.push(new Token(ctok.type, ctok.val));
            ctok = new Token(0, '' + ch);
        } else if (ctok.type == -2 && ch == '(') {
            ctok = new Token(2);
        } else if (ch == '(') {
            toks.push(new Token(ctok.type, ctok.val));
            ctok = new Token(2);
        } else if (ctok.type == -2 && ch == ')') {
            ctok = new Token(3);
        } else if (ch == ')') {
            toks.push(new Token(ctok.type, ctok.val));
            ctok = new Token(3);
        } else if (ch == '+') {
            toks.push(new Token(ctok.type, ctok.val));
            ctok = new Token(4);
        } else if (ch == '-') {
            toks.push(new Token(ctok.type, ctok.val));
            ctok = new Token(5);
        } else if (ch == '*') {
            toks.push(new Token(ctok.type, ctok.val));
            ctok = new Token(6);
        } else if (ch == '/') {
            toks.push(new Token(ctok.type, ctok.val));
            ctok = new Token(7);
        } else if (ch == '^') {
            toks.push(new Token(ctok.type, ctok.val));
            ctok = new Token(8);
        }
        i++;
    }
    toks.push(ctok);
    return toks;
}


class Tokenizer {
    toks: Token[];
    iter: number;

    constructor(inp) {
        this.toks = tokenize(inp);
        this.iter = 0;
    }

    getTok() {
        if (this.iter >= this.toks.length) {
            return new Token(-1);
        }
        return this.toks[this.iter];
    }

    eatTok() {
        if (this.iter >= this.toks.length) {
            return new Token(-1);
        }
        return this.toks[this.iter++];
    }
}

function handleExpr(tokenizer) {
    if (tokenizer.getTok().val == 'x') {
        tokenizer.eatTok();
        return new XAST();
    } else if (tokenizer.getTok().val == 'sin') {
        tokenizer.eatTok();
        return getSin(handleParen(tokenizer));
    } else if (tokenizer.getTok().val == 'cos') {
        tokenizer.eatTok();
        return getCos(handleParen(tokenizer));
    } else if (tokenizer.getTok().val == 'tan') {
        tokenizer.eatTok();
        return getTan(handleParen(tokenizer));
    }
}

function handlePrimary(tokenizer) {
    if (tokenizer.getTok().type == 0) {
        return handleNum(tokenizer);
    } else if (tokenizer.getTok().type == 2) {
        return handleParen(tokenizer);
    } else if (tokenizer.getTok().type == 1) {
        return handleExpr(tokenizer);
    }
}

function handleNum(tokenizer) {
    return new NumberAST(parseFloat(tokenizer.eatTok().val));
}

function handleParen(tokenizer) {
    let curAST;
    let prevPrec = 0;
    tokenizer.eatTok();
    while (tokenizer.getTok().type != 3) {
        if (tokenizer.getTok().type == 0) {
            curAST = handleNum(tokenizer);
        } else if (tokenizer.getTok().type == 1) {
            curAST = handleExpr(tokenizer);
        } else if (tokenizer.getTok().type == 2) {
            curAST = handleParen(tokenizer);
        } else if (tokenizer.getTok().type == 4) {
            tokenizer.eatTok();
            curAST = new AddAST(curAST, handlePrimary(tokenizer));
        } else if (tokenizer.getTok().type == 5) {
            tokenizer.eatTok();
            curAST = new SubtractAST(curAST, handlePrimary(tokenizer));
        } else if (tokenizer.getTok().type == 6) {
            tokenizer.eatTok();
            curAST = new MultiplyAST(curAST, handlePrimary(tokenizer));
        } else if (tokenizer.getTok().type == 7) {
            tokenizer.eatTok();
            curAST = new DivAST(curAST, handlePrimary(tokenizer));
        } else if (tokenizer.getTok().type == 8) {
            tokenizer.eatTok();
            curAST = new PowAST(curAST, handlePrimary(tokenizer));
        }
    }
    tokenizer.eatTok();
    return curAST;
}


function handleTop(tokenizer) {
    let curAST;
    while (tokenizer.getTok().type != -1) {
        if (tokenizer.getTok().type == 0) {
            curAST = handleNum(tokenizer);
        } else if (tokenizer.getTok().type == 1) {
            curAST = handleExpr(tokenizer);
        } else if (tokenizer.getTok().type == 2) {
            curAST = handleParen(tokenizer);
        } else if (tokenizer.getTok().type == 4) {
            tokenizer.eatTok();
            curAST = new AddAST(curAST, handlePrimary(tokenizer));
        } else if (tokenizer.getTok().type == 5) {
            tokenizer.eatTok();
            curAST = new SubtractAST(curAST, handlePrimary(tokenizer));
        } else if (tokenizer.getTok().type == 6) {
            tokenizer.eatTok();
            curAST = new MultiplyAST(curAST, handlePrimary(tokenizer));
        } else if (tokenizer.getTok().type == 7) {
            tokenizer.eatTok();
            curAST = new DivAST(curAST, handlePrimary(tokenizer));
        } else if (tokenizer.getTok().type == 8) {
            tokenizer.eatTok();
            curAST = new PowAST(curAST, handlePrimary(tokenizer));
        }
    }
    return curAST;
}