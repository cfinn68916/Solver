window.addEventListener('error', function (a) {
    alert(a.message);
    alert(a.filename);
});

function solve() {
    let lside = handleTop(new Tokenizer($('#lside').val()));
    let rside = handleTop(new Tokenizer($('#rside').val()));
    let err = new SubtractAST(lside, rside);
    let min_guess=parseFloat($('#guess_min').val().toString());
    let max_guess=parseFloat($('#guess_max').val().toString());
    let guess_step=parseFloat($('#guess_step').val().toString());
    let stop_err=parseFloat($('#stopping_error').val().toString());
    let group_dev=parseFloat($('#group_deviation').val().toString());
    let max_iter=parseFloat($('#max_iter').val().toString());
    let second_pass_iter=parseFloat($('#2nd_pass_iter').val().toString());


    let solutions: number[] = [];
    for (let initx = min_guess; initx < max_guess; initx += guess_step) {
        if (err.getDerVal(initx) != 0) {
            let x = initx;
            for (let i = 0; i < max_iter; i++) {
                x = x - (err.getVal(x) / err.getDerVal(x));
                if(Math.abs(err.getVal(x)) < stop_err || isNaN(x)){
                    break;
                }
                let alreadyin = false;
                for (let sol of solutions) {
                    if (Math.abs(sol - x) < group_dev) {
                        alreadyin = true;
                        break;
                    }
                }
                if (alreadyin){
                    break;
                }
            }
            if(Math.abs(err.getVal(x)) > stop_err || isNaN(x)){
                continue;
            }

            if(isNaN(err.getDerVal(x))){
                continue;
            }
            if (solutions.length == 0) {
                solutions.push(x);
            } else {
                let alreadyin = false;
                for (let sol of solutions) {
                    if (Math.abs(sol - x) < group_dev) {
                        alreadyin = true;
                        break;
                    }
                }
                if (!alreadyin) {
                    solutions.push(x);
                }
            }
        }

    }
    for (let solI = 0; solI < solutions.length; solI++) {
        for (let i = 0; i < second_pass_iter; i++) {
            solutions[solI] = solutions[solI] - (err.getVal(solutions[solI]) / err.getDerVal(solutions[solI]));
        }
    }
    let newSol:number[]=[];
    for (const sol of solutions) {
        if (newSol.length == 0) {
                newSol.push(sol);
            } else {
                let alreadyin = false;
                for (let sol2 of newSol) {
                    if (Math.abs(sol - sol2) < group_dev) {
                        alreadyin = true;
                        break;
                    }
                }
                if (!alreadyin) {
                    newSol.push(sol);
                }
            }
    }
    newSol.sort(function (a, b) {
        return a - b
    });
    for (let sol of newSol) {
        $('#solutions').append(`
        <details>
            <summary>${Math.round(sol*100000)/100000}</summary>
            <p>${sol}<br>
            Error: ${err.getVal(sol)}<br>
            LHS: ${lside.getVal(sol)}<br>
            RHS: ${rside.getVal(sol)}<br></p>
        </details>
        `);

    }
}

$(function (){
    if(window.localStorage.getItem('mode')==='dark'){
        $('*').addClass('dark-mode');
    }
});

function toggleDarkMode(){
    $('*').toggleClass('dark-mode');
    window.localStorage.setItem('mode', $('body').hasClass('dark-mode')?'dark':'light');
}

function toggleAngType(){
    if(window.localStorage.getItem('angType')==='radians'){
        window.localStorage.setItem('angType','degrees');
        $('#ang_type').text('Switch to Radians');
    }else{
        window.localStorage.setItem('angType','radians');
        $('#ang_type').text('Switch to Degrees');
    }
}