window.addEventListener("load", function () {
    const user_input = document.getElementById("user_input");
    const player_no = document.getElementById("player_no");
    const name = document.getElementsByName("name")[0];
    const player_btn = document.getElementById("player_btn");
    const player_turn = document.getElementById("player_turn");
    const board_table = document.getElementById("board_table");
    const result = document.getElementById("result");
    const win_result = document.getElementById("win_result");
    const play_again_btn = document.getElementById("play_again");
    const p1_name = document.getElementById("p1_name");
    const p1_result = document.getElementById("p1_result");
    const p2_name = document.getElementById("p2_name");
    const p2_result = document.getElementById("p2_result");
    const draw_result = document.getElementById("draw_result");
    let game_history = {}
    let player_names = []
    let mark = "x"
    let turn_no = -1
    let board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ]

    play_again_btn.addEventListener("click", function () {
        reset_game();
        result.style.display = "none";
        play(null);
    });

    player_btn.addEventListener("click", function (event) {
        event.preventDefault();
        if (name.value.length > 0) get_player_name()
    });

    board_table.addEventListener("click", function (event) {
        if (event.target.tagName === "U") {
            if (!event.target.classList.contains("x") && !event.target.classList.contains("o"))
                play(event.target)
        }
    });

    function get_player_name() {
        if (player_no.innerText === "1") {
            player_names.push(name.value);
            player_no.innerText = "2";
            name.value = ""
        } else {
            player_names.push(name.value);
            user_input.style.display = "none";
            name.value = ""
            p1_name.innerText = player_names[0]
            p2_name.innerText = player_names[1]
            game_history[player_names[0]] = 0
            game_history[player_names[1]] = 0
            game_history["draw"] = 0
            play(null);
        }
    }

    function mark_board(row, col, clicked) {
        board[row][col] = mark;
        clicked.setAttribute("class", mark)
    }

    function check_row(turn) {
        for (let row in board) {
            if (board[row][0] === turn && board[row][1] === turn && board[row][2] === turn)
                return true;
        }
        return false;
    }

    function check_col(turn) {
        for (let row in board) {
            if (board[0][row] === turn && board[1][row] === turn && board[2][row] === turn)
                return true;
        }
        return false;
    }

    function check_first_diag(turn) {
        return board[0][0] === turn && board[1][1] === turn && board[2][2] === turn;
    }

    function check_second_diag(turn) {
        return board[0][2] === turn && board[1][1] === turn && board[2][0] === turn;
    }

    function check_draw() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "")
                    return false
            }
        }
        return true
    }

    function reset_board() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = ""
            }
        }
        console.log(board)
        for (let cell of document.getElementsByClassName("col")) {
            cell.firstElementChild.classList.remove("o")
            cell.firstElementChild.classList.remove("x")
        }
    }

    function reset_game() {
        reset_board()
        turn_no = -1
        mark = "x"
        player_names.pop()
    }

    function check_board() {
        if (check_row("x") || check_col("x") || check_first_diag("x") || check_second_diag("x"))
            return player_names[2]
        if (check_row("o") || check_col("o") || check_first_diag("o") || check_second_diag("o"))
            return (player_names[2] + 1) % 2
        if (check_draw())
            return -1
        return 3
    }

    function play(clicked) {
        if (turn_no === -1) {
            turn_no = random_turn()
            player_names.push(turn_no);
            player_turn.innerHTML = "<span id='turn_name'> " + player_names[player_names[2]] + "</span>'s turn";
        }
        if (clicked === null)
            return
        let row = clicked.parentElement.parentElement.parentElement.rowIndex
        let col = clicked.parentElement.parentElement.cellIndex
        mark_board(row, col, clicked)
        let status = check_board()
        let msg = ""
        if (status !== 3) {
            if (status === -1) {
                msg = "It's a draw!"
                game_history["draw"] += 1
                draw_result.innerText = game_history["draw"];
            } else {
                msg = player_names[status] + " wins!"
                game_history[player_names[status]] += 1;
                if (status === 0)
                    p1_result.innerText = game_history[player_names[status]]
                else
                    p2_result.innerText = game_history[player_names[status]]
            }
            player_turn.innerHTML = ""
            win_result.innerText = msg
            result.style.display = "flex";
        } else {
            turn_no = (turn_no + 1) % 2
            player_turn.innerHTML = "<span>" + player_names[turn_no] + "</span>'s turn"
            if (mark === "x")
                mark = "o"
            else
                mark = "x"
        }
    }

    function random_turn(min = 0, max = 2) {
        let difference = max - min;
        let rand = Math.random();
        rand = Math.floor(rand * difference);
        rand = rand + min;
        return rand;
    }
});
