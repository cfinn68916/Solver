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
    solutions.sort(function (a, b) {
        return a - b
    });
    for (let sol of solutions) {
        $('#solutions').append(`
        <details>
            <summary>${Math.round(sol*1000000)/1000000}</summary>
            <p>${sol}<br>
            Error: ${err.getVal(sol)}<br>
            LHS: ${lside.getVal(sol)}<br>
            RHS: ${rside.getVal(sol)}<br></p>
        </details>
        `);

    }
}


