class Token{
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
    constructor(type, val=null){
        this.type=type;
        this.val=val;
    }
}

function tokenize(inp){
    let toks=[];
    let ctok=new Token(-2);
    let i=0;
    const sreg=/[a-zA-Z]+/;
    const numreg=/[0-9\.]+/;
    while(i<inp.length){
        let ch=inp[i];
        if(ctok.type==-2 && sreg.test(ch)){
            ctok=new Token(1,ch);
        }else if(ctok.type==1 && sreg.test(ch)){
            ctok.val+=''+ch;
        }else if(ctok.type!=1 && sreg.test(ch)){
            toks.push(new Token(ctok.type, ctok.val));
            ctok=new Token(1,''+ch);
        }

        else if(ctok.type==-2 && numreg.test(ch)){
            ctok=new Token(0,''+ch);
        }else if(ctok.type==0 && numreg.test(ch)){
            ctok.val+=''+ch;
        }else if(ctok.type!=0 && numreg.test(ch)){
            toks.push(new Token(ctok.type, ctok.val));
            ctok=new Token(0,''+ch);
        }

        else if(ctok.type==-2 && ch=='('){
            ctok=new Token(2);
        }else if(ch=='('){
            toks.push(new Token(ctok.type, ctok.val));
            ctok=new Token(2);
        }
        else if(ctok.type==-2 && ch==')'){
            ctok=new Token(3);
        }else if(ch==')'){
            toks.push(new Token(ctok.type, ctok.val));
            ctok=new Token(3);
        }


        else if(ch=='+'){
            toks.push(new Token(ctok.type, ctok.val));
            ctok=new Token(4);
        }
        else if(ch=='-'){
            toks.push(new Token(ctok.type, ctok.val));
            ctok=new Token(5);
        }
        else if(ch=='*'){
            toks.push(new Token(ctok.type, ctok.val));
            ctok=new Token(6);
        }
        else if(ch=='/'){
            toks.push(new Token(ctok.type, ctok.val));
            ctok=new Token(7);
        }
        else if(ch=='^'){
            toks.push(new Token(ctok.type, ctok.val));
            ctok=new Token(8);
        }
        i++;
    }
    toks.push(ctok);
    return toks;
}


class Tokenizer{
    constructor(inp){
        this.toks=tokenize(inp);
        this.iter=0;
    }
    getTok(){
        if(this.iter>=this.toks.length){
            return new Token(-1);
        }
        return this.toks[this.iter];
    }
    eatTok(){
        if(this.iter>=this.toks.length){
            return new Token(-1);
        }
        return this.toks[this.iter++];
    }
}

function handleExpr(tokz){
    if(tokz.getTok().val=='x'){
        tokz.eatTok();
        return new XAST();
    }else if(tokz.getTok().val=='sin'){
        tokz.eatTok();
        return new SinAST(handleParen(tokz));
    }else if(tokz.getTok().val=='cos'){
        tokz.eatTok();
        return new CosAST(handleParen(tokz));
    }else if(tokz.getTok().val=='tan'){
        tokz.eatTok();
        return new TanAST(handleParen(tokz));
    }
}

function handlePrimary(tokz){
    if(tokz.getTok().type==0){
        return handleNum(tokz);
    }else if(tokz.getTok().type==2){
        return handleParen(tokz);
    }else if(tokz.getTok().type==1){
        return handleExpr(tokz);
    }
}

function handleNum(tokz){
    return new NumberAST(parseFloat(tokz.eatTok().val));
}

function handleParen(tokz){
    let curAST;
    let prevPrec=0;
    tokz.eatTok();
    while(tokz.getTok().type!=3){
        if(tokz.getTok().type==0){
            curAST=handleNum(tokz);
        }else if(tokz.getTok().type==1){
            curAST=handleExpr(tokz);
        }else if(tokz.getTok().type==2){
            curAST=handleParen(tokz);
        }else if(tokz.getTok().type==4){
            tokz.eatTok();
            curAST=new AddAST(curAST, handlePrimary(tokz));
        }else if(tokz.getTok().type==5){
            tokz.eatTok();
            curAST=new SubtractAST(curAST, handlePrimary(tokz));
        }else if(tokz.getTok().type==6){
            tokz.eatTok();
            curAST=new MultiplyAST(curAST, handlePrimary(tokz));
        }else if(tokz.getTok().type==7){
            tokz.eatTok();
            curAST=new DivAST(curAST, handlePrimary(tokz));
        }else if(tokz.getTok().type==8){
            tokz.eatTok();
            curAST=new PowAST(curAST, parseFloat(tokz.eatTok().val));
        }
    }
    tokz.eatTok();
    return curAST;
}


function handleTop(tokz) {
    let curAST;
    while (tokz.getTok().type != -1) {
        if (tokz.getTok().type == 0) {
            curAST = handleNum(tokz);
        } else if (tokz.getTok().type == 1) {
            curAST = handleExpr(tokz);
        } else if (tokz.getTok().type == 2) {
            curAST = handleParen(tokz);
        } else if (tokz.getTok().type == 4) {
            tokz.eatTok();
            curAST = new AddAST(curAST, handlePrimary(tokz));
        } else if (tokz.getTok().type == 5) {
            tokz.eatTok();
            curAST = new SubtractAST(curAST, handlePrimary(tokz));
        } else if (tokz.getTok().type == 6) {
            tokz.eatTok();
            curAST = new MultiplyAST(curAST, handlePrimary(tokz));
        } else if (tokz.getTok().type == 7) {
            tokz.eatTok();
            curAST = new DivAST(curAST, handlePrimary(tokz));
        } else if (tokz.getTok().type == 8) {
            tokz.eatTok();
            curAST = new PowAST(curAST, parseFloat(tokz.eatTok().val));
        }
    }
    return curAST;
}