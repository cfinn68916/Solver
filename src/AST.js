class NumberAST{
    constructor(val){
        this.val=val;
    }
    getVal(x){
        return this.val;
    }
    getDerVal(x){
        return 0;
    }
}

class XAST{
    constructor(){

    }
    getVal(x){
        return x;
    }
    getDerVal(x){
        return 1;
    }
}
class MultiplyAST{
    constructor(a,b){
        this.a=a;
        this.b=b;
    }
    getVal(x){
        return this.a.getVal(x)*this.b.getVal(x);
    }
    getDerVal(x){
        return this.a.getDerVal(x)*this.b.getVal(x) + this.a.getVal(x)*this.b.getDerVal(x);
    }
}
class SubtractAST{
    constructor(a,b){
        this.a=a;
        this.b=b;
    }
    getVal(x){
        return this.a.getVal(x)-this.b.getVal(x);
    }
    getDerVal(x){
        return this.a.getDerVal(x) - this.b.getDerVal(x);
    }
}
class AddAST{
    constructor(a,b){
        this.a=a;
        this.b=b;
    }
    getVal(x){
        return this.a.getVal(x)+this.b.getVal(x);
    }
    getDerVal(x){
        return this.a.getDerVal(x) + this.b.getDerVal(x);
    }
}
class PowAST{
    constructor(a,pow){
        this.a=a;
        this.pow=pow;
    }
    getVal(x){
        return Math.pow(this.a.getVal(x),this.pow);
    }
    getDerVal(x){
        return this.a.getDerVal(x)*this.pow*Math.pow(this.a.getVal(x),this.pow-1);
    }
}
class DivAST{
    constructor(a,b){
        this.a=a;
        this.b=b;
    }
    getVal(x){
        return this.a.getVal(x)/this.b.getVal(x);
    }
    getDerVal(x){
        return (this.a.getDerVal(x)/this.b.getVal(x))-(this.a.getVal(x)*this.b.getDerVal(x)/(this.b.getVal(x)*this.b.getVal(x)));
    }
}

class SinAST{
    constructor(a){
        this.a=a;
    }
    getVal(x){
        return Math.sin(this.a.getVal(x));
    }
    getDerVal(x){
        return this.a.getDerVal(x)*Math.cos(this.a.getVal(x));
    }
}
class CosAST{
    constructor(a){
        this.a=a;
    }
    getVal(x){
        return Math.cos(this.a.getVal(x));
    }
    getDerVal(x){
        return -1.0*this.a.getDerVal(x)*Math.sin(this.a.getVal(x));
    }
}

class TanAST{
    constructor(a){
        this.a=a;
    }
    getVal(x){
        return Math.tan(this.a.getVal(x));
    }
    getDerVal(x){
        return this.a.getDerVal(x)/Math.pow(Math.cos(this.a.getVal(x)),2);
    }
}
function getSinDeg(angAST){
    return new SinAST(new MultiplyAST(angAST, new NumberAST(Math.PI/180.0)));
}
function getCosDeg(angAST){
    return new CosAST(new MultiplyAST(angAST, new NumberAST(Math.PI/180.0)));
}
function getTanDeg(angAST) {
    return new TanAST(new MultiplyAST(angAST, new NumberAST(Math.PI / 180.0)));
}