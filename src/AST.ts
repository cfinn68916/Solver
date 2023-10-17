interface AST {
    getVal(x: number): number;

    getDerVal(x: number): number;
}

class NumberAST implements AST {
    val: number;

    constructor(val) {
        this.val = val;
    }

    getVal(x) {
        return this.val;
    }

    getDerVal(x) {
        return 0;
    }
}

class XAST implements AST {
    constructor() {

    }

    getVal(x) {
        return x;
    }

    getDerVal(x) {
        return 1;
    }
}

class MultiplyAST implements AST {
    lhs: AST;
    rhs: AST;

    constructor(a, b) {
        this.lhs = a;
        this.rhs = b;
    }

    getVal(x) {
        return this.lhs.getVal(x) * this.rhs.getVal(x);
    }

    getDerVal(x) {
        return this.lhs.getDerVal(x) * this.rhs.getVal(x) + this.lhs.getVal(x) * this.rhs.getDerVal(x);
    }
}

class SubtractAST implements AST {
    lhs: AST;
    rhs: AST;

    constructor(a, b) {
        this.lhs = a;
        this.rhs = b;
    }

    getVal(x) {
        return this.lhs.getVal(x) - this.rhs.getVal(x);
    }

    getDerVal(x) {
        return this.lhs.getDerVal(x) - this.rhs.getDerVal(x);
    }
}

class AddAST implements AST {
    lhs: AST;
    rhs: AST;

    constructor(a, b) {
        this.lhs = a;
        this.rhs = b;
    }

    getVal(x) {
        return this.lhs.getVal(x) + this.rhs.getVal(x);
    }

    getDerVal(x) {
        return this.lhs.getDerVal(x) + this.rhs.getDerVal(x);
    }
}

class PowAST implements AST {
    lhs: AST;
    rhs: AST;

    constructor(a, b) {
        this.lhs = a;
        this.rhs = b;
    }

    getVal(x) {
        return Math.pow(this.lhs.getVal(x), this.rhs.getVal(x));
    }

    getDerVal(x) {
        return Math.pow(this.lhs.getVal(x), this.rhs.getVal(x))*(this.rhs.getDerVal(x)*Math.log(this.lhs.getVal(x))+(this.lhs.getDerVal(x)*this.rhs.getVal(x)/this.lhs.getVal(x)));
    }
}

class DivAST implements AST {
    lhs: AST;
    rhs: AST;

    constructor(a, b) {
        this.lhs = a;
        this.rhs = b;
    }

    getVal(x) {
        return this.lhs.getVal(x) / this.rhs.getVal(x);
    }

    getDerVal(x) {
        return (this.lhs.getDerVal(x) / this.rhs.getVal(x)) - (this.lhs.getVal(x) * this.rhs.getDerVal(x) / (this.rhs.getVal(x) * this.rhs.getVal(x)));
    }
}

class SinAST implements AST {
    val: AST;

    constructor(a) {
        this.val = a;
    }

    getVal(x) {
        return Math.sin(this.val.getVal(x));
    }

    getDerVal(x) {
        return this.val.getDerVal(x) * Math.cos(this.val.getVal(x));
    }
}

class CosAST implements AST {
    val: AST;

    constructor(a) {
        this.val = a;
    }

    getVal(x) {
        return Math.cos(this.val.getVal(x));
    }

    getDerVal(x) {
        return -1.0 * this.val.getDerVal(x) * Math.sin(this.val.getVal(x));
    }
}

class TanAST implements AST {
    val: AST;

    constructor(a) {
        this.val = a;
    }

    getVal(x) {
        return Math.tan(this.val.getVal(x));
    }

    getDerVal(x) {
        return this.val.getDerVal(x) / Math.pow(Math.cos(this.val.getVal(x)), 2);
    }
}

function getSinDeg(angAST) {
    return new SinAST(new MultiplyAST(angAST, new NumberAST(Math.PI / 180.0)));
}

function getCosDeg(angAST) {
    return new CosAST(new MultiplyAST(angAST, new NumberAST(Math.PI / 180.0)));
}

function getTanDeg(angAST) {
    return new TanAST(new MultiplyAST(angAST, new NumberAST(Math.PI / 180.0)));
}