let player = 1;         //プレイヤー(1か-1が入る)
let moves = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];  //石がどの方向に動くか
let massArray = [[0,0,0,0,0,0,0,0],                 //初期状態(0=なにもなし、1=プレイヤー1の石、-1=プレイヤー2の石)           
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,1,-1,0,0,0],
                [0,0,0,-1,1,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0]];
let rows = 8;
let cols = 8;

function startGame(){                               //ゲームを開始（reversi.html)に遷移する関数
    let player1 = document.getElementById("player1Name");             //テキストボックスに入力された名前をストレージに格納する処理
    localStorage.setItem(1,player1.value);                            //プレイヤー1の名前のキーは"1"
    let player2 = document.getElementById("player2Name");
    localStorage.setItem(-1,player2.value);                           //プレイヤー2の名前のキーは"2"
    window.location.href="reversi.html";                              
}

function show(){                                       //マスの表示
    let message = document.getElementById("message");
    message.textContent = localStorage.getItem(player) + "の番です";
    let table = document.getElementById("table");
    table.textContent = "";
    for(let i = 0;i < rows;i++){
        let tr = document.createElement("tr");
        for(let j = 0;j < cols;j++){
            let td = document.createElement("td");
            if(massArray[i][j] == 1){
                let img1 = document.createElement("img");
                img1.src = "img/white.png";
                img1.className = "image";
                td.appendChild(img1);               //プレイヤー1の石を置く
            }
            else if(massArray[i][j] == -1){
                let img2 = document.createElement("img");
                img2.src = "img/black.png";
                img2.className = "image";
                td.appendChild(img2);                   //プレイヤー2の石を置く
            }
            td.addEventListener("click", () => {        //マス目をクリックしたら判定処理に入る
                placeDecision(i,j);
            });
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    endGame();
}

function placeDecision(row,col){                //マスに石を置けるかどうかの判定と置く処理(rowは置く場所の行番号,colは列番号)
    let dicision = false;           //  石を置いていいか(falseはダメ trueは良い)
    if(massArray[row][col] == 0){
        for(let [moveY,moveX] of moves){        //movesの配列から一つずつ試していく{例 moves[0,1]=moveY(0),moveX(1)}
            let stones = [];
            let x = col + moveX;                //縦に動く
            let y = row + moveY;                //横に動く
            while(x >= 0 && x < cols && y >= 0 && y < rows && massArray[y][x] == (player * -1)){    //xとyがマスの範囲内で、相手の石がある間
                stones.push([y,x]);
                x += moveX;
                y += moveY;
            }
            if(x >= 0 && x < cols && y >= 0 && y < rows && massArray[y][x] == player && stones.length>=1){       //xとyがマスの範囲内で、移動先に自分の石があり、相手の石が1つ以上あった時
                console.log(stones.length)
                for(let [stoneY,stoneX] of stones){                     //挟んだ石を自分の石にしていく処理
                    massArray[stoneY][stoneX] = player;
                }
                massArray[row][col] = player;
                dicision = true;
            }
        }
        if(dicision == true){
            player *= -1;                   //相手の番になる
        }
        show();
    }

}
function skip(){            //自分の番をスキップする処理
    player *= -1;
    show();
}

function endGame(){           //ゲームを終わらせる処理
    let count1 = 0;           //プレイヤー1の石の数
    let count2 = 0;           //プレイやー2の石の数
    let winDecision = true;   //ゲームが終了したか(falseなら継続,trueなら終了)      
    for(let i = 0;i < rows;i++){
        for(let j = 0;j < cols;j++){
            if(massArray[i][j] == 1){
                count1 += 1;
            }
            else if(massArray[i][j] == -1){
                count2 += 1;
            }
            else{
                winDecision = false;
            }
        }
    }
    if(count1 == 0 || count2 == 0){         //どちらかのプレイヤーの石の数が0個になったとき
        winDecision = true;
    }
    if(winDecision == true){
        let player1 = localStorage.getItem("1");
        let player2 = localStorage.getItem("-1");
        alert("ゲームが終了しました");
        let winner = document.getElementById("winner");
        if(count1 > count2){                            //プレイヤー1の石の数のほうが多ければプレイヤー1の勝ち
            winner.textContent = player1 +"の勝ちです";
        }
        else if(count1 < count2){                       //プレイヤー2の石の数のほうが多ければプレイヤー2の勝ち
            winner.textContent = player2 + "の勝ちです";
        }
        else{                                           //石の数が同じなら引き分け
            winner.textContent = "引き分けです";
        }
        let player1Count = document.getElementById("player1Count");
        player1Count.textContent = player1 +"の枚数" + count1 + "枚";
        let player2Count = document.getElementById("player2Count");
        player2Count.textContent = player2 +"の枚数" + count2 + "枚";
    }
}