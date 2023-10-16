window.addEventListener('error',function(a){alert(a.message);alert(a.filename);});

function solve(){
    let lside=handleTop(new Tokenizer($('#lside').val()));
    let rside=handleTop(new Tokenizer($('#rside').val()));
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
    solutions.sort();
    for(let sol of solutions){
        document.querySelector('#solutions').innerHTML+=sol+'<br>';
    }
}


