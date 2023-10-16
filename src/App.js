window.addEventListener('error',function(a){alert(a.message);alert(a.filename);});
// x^2+6x+9
//   (x+3)^2
// x^2+6x=-9



// 18.084=(45*cos(25))^2/20
function solve(){
//    let angast=new NumberAST(25);
//    let vast=new NumberAST(45);
//    let xast=new XAST();
//    let last=new SubtractAST(new MultiplyAST(xast, getTanDeg(angast)),new MultiplyAST(new NumberAST(5),new PowAST(new DivAST(xast,new MultiplyAST(vast, getCosDeg(angast))),2)));
//    let err=new SubtractAST(last, new DivAST(new PowAST(new MultiplyAST(vast, getSinDeg(angast)),2),new NumberAST(20)));
    let k;
    let lside=handleTop(new Tokenizer(document.querySelector('#lside').value));
    let rside=handleTop(new Tokenizer(document.querySelector('#rside').value));
    let err=new SubtractAST(lside, rside);

    let solutions=[];
    for (let initx = -100; initx < 100; initx+=1) {
        if(err.getDerVal(initx)!=0){
            let x=initx;
            while (Math.abs(err.getVal(x))>0.000000000001) {
                x=x-(err.getVal(x)/err.getDerVal(x));
            }
            if(solutions.length==0){
                solutions.push(x);
            }else{
                let alreadyin=false;
                for(let sol of solutions){
                    if(Math.abs(sol-x)<0.0001){
                        alreadyin=true;
                        break;
                    }
                }
                if(!alreadyin){
                    solutions.push(x);
                }
            }
        }

    }
    for(let sol of solutions){
        document.querySelector('#solutions').innerHTML+=(1.0*sol)+'<br>';
    }
}
