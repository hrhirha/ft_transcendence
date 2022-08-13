import Phaser from "phaser";
import { NormalField, UltimateField, Ball, Paddle, YouWin, YouLose, RedButton, NormalButton } from "assets";
import { Socket } from "socket.io-client";

export default class PingPong extends Phaser.Scene
{
    swipeDirection: any;
    connection: boolean = true;
    isClicking: boolean = true;
    bestOf: number = 5;
    ballScale: number = 0.19;
    paddleScale: number = 0.25;
    ballspeed: number = 800;
    bounds: number = 100;
    leftScore: number = 0;
    rightScore: number = 0;
    h: number  = 720;
    w: number = 1080;
    bg?: Phaser.GameObjects.Image;
    ball?: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    paddle?: Phaser.GameObjects.Sprite;
    soc: Socket;
    enemy?: Phaser.GameObjects.Sprite;
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    status?: Phaser.GameObjects.Image;
    leftScoretxt?: Phaser.GameObjects.Text;
    rightScoretxt?: Phaser.GameObjects.Text;
    posx: number = 0;
    eposx: number = 0;
    posy: number = 0;
    restart: boolean = true;
    data!: any;
    End: boolean = false;
    sprite?: any;
    re: boolean = false;
    counter?: Phaser.GameObjects.Text;
    timedEvent?: Phaser.Time.TimerEvent;
    initialTime :number = 5;
    goal: boolean = false;
    gameIsStarted: boolean = false;
    win?: Phaser.GameObjects.Image;
    lose?: Phaser.GameObjects.Image;
    exit?: Phaser.GameObjects.Image;
    
    type: string;
    waiting?: Phaser.GameObjects.Text;
    buttonBg?: Phaser.GameObjects.Sprite;
    leave?: Phaser.GameObjects.Text;
    exitBg: Phaser.GameObjects.Sprite;
    restartText: Phaser.GameObjects.Text;
    restartClick: boolean = false;
    isPlayer: boolean = false;
    replay: Phaser.GameObjects.Text;
    replayClick: boolean = false;
    exitEmited: boolean = false;
    mobile: boolean = false;
    desktop: boolean = false;
    imgbg: string = undefined;
    map: boolean = false;
    roomId: string = undefined;
    mapUrl: string = undefined;
    
    constructor(msoc: Socket, type:string, isPlayer: boolean, roomId: string)
    {
        super("");
        console.log("type = " + type);
        console.log("roomId = " + roomId);
        console.log("isPlayer = " + isPlayer);
        this.roomId = roomId;
        this.isPlayer = isPlayer;
        this.type = type;
        this.soc = msoc;
    };
    
    addSprites ()
    {
        this.add.image(this.w / 2, this.h / 2, this.imgbg);
    }

    addScore()
    {
        if (this.leftScoretxt)
            this.leftScoretxt.destroy();
        this.leftScoretxt = this.add.text((this.w / 2) - (this.w / 10) - 40 , 30, this.leftScore.toString(), {
            fontSize: "60px",
            fontFamily: "Poppins_B",
            align: "center",
        });
        
        if (this.rightScoretxt)
            this.rightScoretxt.destroy();
        this.rightScoretxt = this.add.text((this.w / 2) + (this.w / 10) , 30, this.rightScore.toString(), {
            fontSize: "60px",
            fontFamily: "Poppins_B",
            align: "center"
        });
    }

    preload () : void
    {
        this.h = this.cameras.main.height;
        this.w = this.cameras.main.width;
        this.load.image('normalField', NormalField);
        this.load.image('ultimateField', UltimateField);
        this.load.image('ball', Ball);
        this.load.image('paddle', Paddle);
        this.load.image('normalButton', NormalButton);
        this.load.image('redButton', RedButton);
        this.load.image('youwin', YouWin);
        this.load.image('youlose', YouLose);
    }
//////////////////////// listeners Func '////////////////////////
    leaveFunc() : void
    {
        this.leave.text = "";
        this.soc.disconnect();
        this.scene.stop();
        if (this.buttonBg)
            this.buttonBg.destroy();
    }

    replayGame() : void
    {
        if (this.replayClick)
            return ;
        this.soc.removeAllListeners();
        this.replayClick = true;
        this.gameIsStarted = false;
        this.rightScore = 4;
        this.leftScore = 4;
        this.connection = true;
        this.scene.restart();
    }

    restartFunc()
    {
        if (this.re)
            return ;
        this.re = true;
        this.soc.removeAllListeners();
        this.scene.restart();
    }
////////////////////////.................////////////////////////
    
    createObjects(ballx: number, bally: number, lpaddle: number, rpaddle: number)
    {
            // create ball for the watcher ///////// 
            this.ball = this.physics.add.image(ballx,bally, 'ball');
            this.ball.setScale(this.ballScale); // scale the sprit 
            ////////////////////////////////////////

            ///////////////////////// lpaddle ////////////////////////
            this.paddle = this.add.sprite( 30,lpaddle, 'paddle').setOrigin(0,0);
            this.paddle.setScale(this.paddleScale); // scale the sprit
            // this.physics.add.existing(this.paddle, true); // set the physicss to paddle !!
            // this.physics.add.collider(this.paddle, this.ball); // set the collider with paddle and the ball
            /////////////////////////////////////////////////////

            /////////////////////////// rpaddle /////////////////////////
            this.enemy = this.add.sprite((this.w - (this.paddle.width * this.paddleScale) - 30) ,rpaddle, 'paddle').setOrigin(0,0);
            this.enemy.setScale(this.paddleScale); // scale the sprit
            // this.physics.add.existing(this.enemy, true); // set the physicss to paddle !!
            // this.physics.add.collider(this.enemy, this.ball);
            //////////////////////////////////////////////////////////////
    }

    watcherRender(d: any)
    {
        this.rightScore = d.rScore;
        this.leftScore = d.lScore;
        this.leftScoretxt.text = d.lScore.toString();
        this.rightScoretxt.text = d.rScore.toString();
        

        if (d.goal)
        {
            this.goal = true;
            this.soc.removeAllListeners();
            this.scene.restart();
        }

        if (!this.enemy && !this.ball && !this.paddle)
        {   
            console.log("gerre");
            this.createObjects(d.ballx, d.bally, d.lpaddle, d.rpaddle);
            return ;
        }

        this.ball.x = d.ballx;
        this.ball.y = d.bally; 
    
        this.enemy.y = d.rpaddle;
        this.paddle.y = d.lpaddle;

    }

    create() : void
    {
        this.bestOf = (this.type === "normaleQue") ? this.bestOf : 3;
        this.exitEmited = false;
        // no collision detection on left side and right side 
        this.physics.world.setBounds(-this.bounds, 0, this.w + (this.bounds * 2), this.h);
        
        // resize the images to fit the window
        if (!this.imgbg)
            this.imgbg = (this.type === "normaleQue") ? "normalField" : "ultimateField";
        this.imgbg = ( this.mapUrl ) ? "backGround": this.imgbg;
        this.bg = this.add.image(this.w / 2, this.h / 2, this.imgbg);

        /////////////////////////////// text ////////////////////////
        if (this.type !== "ultimateQue" || !this.isPlayer)
            this.addScore();

        this.soc.on("saveData", (data: { player: string, is_player: boolean, roomId: string, userId: string, mapUrl: string } ) => 
        {
            console.log(data);
            this.data = data;
            if (data.player === "player1")
            {
                if (this.buttonBg)
                    this.buttonBg.destroy();
                if (this.leave)
                    this.leave.destroy();
                if (this.waiting)
                    this.waiting.destroy();
            }
            if (data.mapUrl !== "normalField")
            {
                this.map = true;
                this.mapUrl = data.mapUrl;
                this.imgbg = "backGround";
                this.type = "ultimateQue";
                this.load.once('complete', this.addSprites, this);
                this.load.image(this.imgbg, this.mapUrl);
                this.load.start();
                setTimeout(()=> {
                    this.soc.removeAllListeners();
                    this.scene.restart();
                }, 500);
            }
        });

        this.soc.on("startGame", () => {
            if (this.waiting || this.buttonBg || this.leave)
            {
                this.End = false;
                if (this.waiting)
                    this.waiting.destroy();
                if (this.buttonBg)
                    this.buttonBg.destroy();
                if (this.leave)
                    this.leave.destroy();
                this.replayClick = false;
            }
            this.goalTime();
        });


        this.soc.on("waiting", (walo: any) => {

            this.waiting = this.add.text(this.w / 2 , this.h / 2 , "Waiting ...", { fontSize: "35px", fontFamily: "Poppins_B", align: "center" }).setOrigin(0.5);
            this.buttonBg = this.add.sprite(this.w / 2 , this.h / 1.20 , 'redButton').setInteractive().setOrigin(0.5).setScale(0.3);
            this.leave = this.add.text(this.w / 2 , this.h / 1.20 , "Leave", { fontSize: "35px", fontFamily: "Poppins_B", align: "center" }).setInteractive().setOrigin(0.5);
            this.buttonBg.on('pointerdown', () => {
                this.leaveFunc();
            }, this);
            this.leave.on('pointerdown', () => {
                this.leaveFunc();
            }, this);

        });

        this.soc.on("restartGame", () => {
            this.leftScore = 0;
            this.rightScore = 0;
            this.addScore();
            this.End = false;
            this.goal = false;
            if (this.data.is_player)
                this.input.keyboard.enabled = true;
            else
                if (this.buttonBg)
                    this.buttonBg.destroy();
                if (this.leave)
                    this.leave.destroy();
            this.goalTime();
        });
        
        this.soc.on("newRoom", (id: string) => 
        {
            this.restartClick = false;
            if (!this.data.is_player)
                if (this.win)
                    this.win.destroy();       
                if (this.lose)
                    this.lose.destroy();
            this.soc.emit("join", {
                oldData: this.data,
                newRoom: id
            });
            this.data.roomId = id;
        });

        this.soc.on("Watchers", (data: any) => 
        {
            if (!this.data || this.data.is_player || this.map)
                return ;
            this.watcherRender(data);
        });

        this.soc.on("youWin", () => 
        {
            this.exitEmited = true;
            if (this.End && this.data.is_player)
            {
                const replayBg = this.add.sprite(this.w / 2 , this.h / 2 + 85 , 'normalButton').setInteractive().setOrigin(0.5).setScale(0.3);
                this.replay = this.add.text(this.w / 2 , this.h / 2 + 85 , "New Game", { fontSize: "35px",
                fontFamily: "Poppins_B", align: "center" }).setInteractive().setOrigin(0.5).setScale(0.8);
                replayBg.on('pointerdown', () => {
                    this.replayGame();
                }, this);
    
                this.replay.on('pointerdown', () =>  {
                    this.replayGame();
                }, this);
                if (!this.restartClick)
                {
                    if (this.buttonBg)
                        this.buttonBg.destroy();
                    if (this.restartText)
                        this.restartText.destroy();
                    return ;
                }
                this.leave = this.add.text(this.w / 2 , this.h / 1.20 , "One Of players left the Game", { fontSize: "35px",
                fontFamily: "Poppins_B", align: "center" }).setInteractive().setOrigin(0.5);
                const exitBg = this.add.sprite(this.w / 2 , this.h / 2 + 170 , 'redButton').setInteractive().setOrigin(0.5).setScale(0.3);
                this.leave = this.add.text(this.w / 2 , this.h / 2 + 170 , "Exit", { fontSize: "35px",
                fontFamily: "Poppins_B", align: "center" }).setInteractive().setOrigin(0.5);
     
                exitBg.on('pointerdown', () => {
                    this.leaveFunc();
                }, this);
    
                this.leave.on('pointerdown', () =>  {
                    this.leaveFunc();
                }, this);
            }
            if (!this.End && this.data.is_player)
            {
                if (this.ball)
                    this.ball.destroy();
                if (this.paddle)
                    this.paddle.destroy();
                if (this.enemy)
                    this.enemy.destroy();
                this.add.image(this.w/2, this.h/2 - 100, "youwin").setOrigin(0.5).setScale(0.4);
                const exitBg = this.add.sprite(this.w / 2 , this.h / 2 + 170 , 'redButton').setInteractive().setOrigin(0.5).setScale(0.3);
                this.leave = this.add.text(this.w / 2 , this.h / 2 + 170 , "Exit", { fontSize: "35px",
                fontFamily: "Poppins_B", align: "center" }).setInteractive().setOrigin(0.5);
                const replayBg = this.add.sprite(this.w / 2 , this.h / 2 + 85 , 'normalButton').setInteractive().setOrigin(0.5).setScale(0.3);
                this.replay = this.add.text(this.w / 2 , this.h / 2 + 85 , "New Game", { fontSize: "35px",
                fontFamily: "Poppins_B", align: "center" }).setInteractive().setOrigin(0.5).setScale(0.8);
                replayBg.on('pointerdown', () => {
                    this.replayGame();
                }, this);
    
                this.replay.on('pointerdown', () =>  {
                    this.replayGame();
                }, this);
                exitBg.on('pointerdown', () => {
                    this.leaveFunc();
                }, this);
    
                this.leave.on('pointerdown', () =>  {
                    this.leaveFunc();
                }, this);
            }

        });

        this.soc.on("leave", () => {
            this.leave = this.add.text(this.w / 2 , this.h / 2 , "One Of players left the Game", { fontSize: "35px",
            fontFamily: "Poppins_B", align: "center" }).setInteractive().setOrigin(0.5);
            const exitBg = this.add.sprite(this.w / 2 , this.h / 2 + 85 , 'redButton').setInteractive().setOrigin(0.5).setScale(0.3);
            this.leave = this.add.text(this.w / 2 , this.h / 2 + 85 , "Exit", { fontSize: "35px",
            fontFamily: "Poppins_B", align: "center" }).setInteractive().setOrigin(0.5);
 
            exitBg.on('pointerdown', () => {
                this.leaveFunc();
            }, this);

            this.leave.on('pointerdown', () =>  {
                this.leaveFunc();
            }, this);
            
            if (this.data)
            {
                this.soc.emit('move', {
                    roomId: this.data.roomId,
                    paddleY: this.paddle.y,
                    ballx: (this.ball.body) ? this.ball.body.x: 0,
                    bally: (this.ball.body) ? this.ball.body.y: 0,
                    lScore: this.bestOf,
                    rScore: this.bestOf
                });
            }
            this.soc.disconnect();
            this.scene.stop();
        });

        this.soc.on("watcherEndMatch", () => {
            this.buttonBg = this.add.sprite(this.w / 2 , this.h / 2 , 'normalButton').setInteractive().setOrigin(0.5).setScale(0.4);
            this.leave = this.add.text(this.w / 2 , this.h / 2 , "Watching", { fontSize: "35px", fontFamily: "Poppins_B", align: "center" }).setInteractive().setOrigin(0.5);
            this.buttonBg = this.add.sprite(this.w / 2 , this.h / 2 + 150 , 'redButton').setInteractive().setOrigin(0.5).setScale(0.4);
            this.leave = this.add.text(this.w / 2 , this.h / 2 + 150 , "exit", { fontSize: "35px", fontFamily: "Poppins_B", align: "center" }).setInteractive().setOrigin(0.5);

            this.buttonBg.on('pointerdown', () =>
            {
                this.leaveFunc();
            }, this);
            this.leave.on('pointerdown', () =>
            {
                this.leaveFunc();
            }, this);
            let right = this.w - (this.w / 4);
            let left = this.w / 4;
            if (this.rightScore === this.bestOf)
            {
                this.win = this.add.image(right, this.h/2, "youwin").setOrigin(0.5, 0.5).setScale(0.3);
                this.lose = this.add.image(left, this.h/2, "youlose").setOrigin(0.5, 0.5).setScale(0.3)
                return ;
            }
            this.win = this.add.image(left, this.h/2, "youwin").setOrigin(0.5, 0.5).setScale(0.3);
            this.lose = this.add.image(right, this.h/2, "youlose").setOrigin(0.5, 0.5).setScale(0.3);

        });

        this.soc.on("restart", (img) => {
            this.add.image(this.w/2, this.h/2 - 100, img).setOrigin(0.5).setScale(0.4);
            this.buttonBg = this.add.sprite(this.w / 2 , this.h / 2 + 85, 'normalButton').setInteractive().setOrigin(0.5).setScale(0.3);
            this.restartText = this.add.text(this.w / 2 , this.h / 2 + 85 , "Replay", { fontSize: "35px",
            fontFamily: "Poppins_B", align: "center" }).setInteractive().setOrigin(0.5);
            this.exitBg = this.add.sprite(this.w / 2 , this.h / 2 + 170 , 'redButton').setInteractive().setOrigin(0.5).setScale(0.3);
            this.leave = this.add.text(this.w / 2 , this.h / 2 + 170 , "Exit", { fontSize: "35px",
            fontFamily: "Poppins_B", align: "center" }).setInteractive().setOrigin(0.5);
            
            this.exitBg.on('pointerdown', () =>
            {
                this.leaveFunc();
            }, this);

            this.leave.on('pointerdown', () =>
            {
                this.leaveFunc();
            }, this);

            this.restartText.on('pointerdown',  () => {
                this.restartText.setInteractive(false);
                this.restartFunc();
            }, this);
            
            this.buttonBg.on('pointerdown', () => {
                this.buttonBg.setInteractive(false);
                this.restartFunc();
            }, this);

        });

        this.soc.on('recv', (data: {
            roomId: string,
            paddleY: number,
            ballx: number,
            bally: number,
            lScore: number,
            rScore: number,
        }) => {
            if (this.enemy && this.enemy.body)
            {
                this.enemy.y = data.paddleY;
                if('updateFromGameObject' in this.enemy.body) {
                    this.enemy.body.updateFromGameObject();
                }
                if (this.ball && this.data.player === "player2")
                {
                    this.ball.x = data.ballx;
                    this.ball.y = data.bally;
                }
                if (this.data.player === "player2" && (this.rightScore !== data.rScore || this.leftScore !== data.lScore))
                {
                    this.rightScore = data.rScore;
                    this.leftScore = data.lScore;
                }
            }
        });
        if (!this.isPlayer && this.connection)
        {
            this.connection = false;
            this.soc.emit("watcher", this.roomId);
        }
        else if (this.map)
        {
            this.map = false;
            if (this.data.is_player)
            {
                this.goalTime();
                return ;
            }
        }
        else if (this.isPlayer && this.connection)
        {
            this.connection = false;
            this.soc.emit(this.type);
        }
        else if (this.re)
        {
            this.re = false;
            this.restartClick = true;
            this.soc.emit('restart', this.data); 
        }
        else if (!this.End && (this.rightScore >= this.bestOf || this.leftScore >= this.bestOf))
        {
            this.gameIsStarted = false;
            this.End = true;
            const msg = ((this.leftScore >= this.bestOf && this.data.player === "player1") || (this.rightScore >= this.bestOf && this.data.player === "player2")) ? "youwin" : "youlose";
            this.winner(msg);
        }
        else if  (!this.End && this.goal && !this.re && (this.leftScore || this.rightScore))
            this.goalTime();
        
    }

    formatTime(seconds:number){

        // Seconds
        var partInSeconds = seconds%60;
        // Adds left zeros to seconds
        var partInSecondsS = partInSeconds.toString();
        // Returns formated time
        return `${partInSecondsS}`;
    }

    onEvent ()
    {
        if (this.initialTime <= 0)
            return ;
        this.initialTime -= 1; // One second
        this.counter.setText('' + this.formatTime(this.initialTime)).setOrigin(0.5);
        if (this.initialTime <= 0)
        {
            this.goal = false;
            this.counter.text = "";
            if (this.exitEmited)
                return ;
            this.addScore();
            if (this.data.is_player)
                this.startGame();
            else
                this.createObjects(this.w / 2, this.h / 2, this.h / 2, this.h / 2);
            return;
        }
    }

    startGame() : void
    {
        this.gameIsStarted = true;
        if (this.sys.game.device.os.desktop)
            if (this.isPlayer)
            {
                this.desktop = true;
                this.cursors =  this.input.keyboard.createCursorKeys();
            }
        else
            if (this.isPlayer)
                this.mobile = true;
        // loading a ball add sprite to the 
        this.posx = (this.data.player === "player1") ? 30: this.w - (145 * this.paddleScale) - 30 ;
        this.eposx = (this.data.player !== "player1") ? 30: this.w - (145 * this.paddleScale) - 30 ;
        this.posy = ( ( (this.h / 2) - (this.h / 3) ) / 2) + (this.h / 3);

        this.createBall();
        if (this.data.player === "player1")
            this.paddle = this.add.sprite(this.posx, this.posy, 'paddle').setOrigin(0,0);
        else 
            this.paddle = this.add.sprite((this.w - (44 * this.paddleScale) - 30) , this.posy, 'paddle').setOrigin(0,0);
        this.paddle.setScale(this.paddleScale); // scale the sprit
        this.physics.add.existing(this.paddle, true); // set the physicss to paddle !!
        this.physics.add.collider(this.paddle, this.ball); // set the collider with paddle and the ball 
        // create enemy 
        this.createEnemy(this.paddle.width);
        // get the input from the user using "phaser-user-input-system"
    }

    createEnemy(w: number) : void
    {
        if (this.data.player === "player1")
            this.enemy = this.add.sprite((this.w - (w * this.paddleScale) - 30) , this.posy, 'paddle').setOrigin(0,0);
        else
            this.enemy = this.add.sprite(30, this.posy, 'paddle').setOrigin(0,0);
        this.enemy.setScale(this.paddleScale); // scale the sprit
        this.physics.add.existing(this.enemy, true); // set the physicss to paddle !!
        this.physics.add.collider(this.enemy, this.ball);
    }
    
    resetball() : void
    {
        this.ball.setPosition(this.w / 2, this.h / 2)
        if (this.data.player === "player1")
        {
            const arr= [45, -45, 135, -135];
            const ran = Phaser.Math.Between(0, 3);
            this.ball.setBounce(1, 1); // set the bounce effect to the ball 
            this.ball.setCollideWorldBounds(true, 1, 1); // set the bounce with world
            const vec = this.physics.velocityFromAngle(arr[ran], this.ballspeed);
            this.ball.body.setVelocity(vec.x, vec.y); // set the velocity to the ball
            // this.physics.accelerateTo(this.ball, this.ball.x, this.ball.y,this.ballspeed + 100);
        }
    }

    createBall() : void 
    {
        this.ball = this.physics.add.image(this.w / 2, this.h / 2, 'ball');
        this.ball.setScale(this.ballScale); // scale the sprit 
        // movement ball
        this.resetball();
    }


    winner(img: string) : void
    {
        if (this.ball)
            this.ball.destroy();
        if (this.paddle)
            this.paddle.destroy();
        if (this.enemy)
            this.enemy.destroy();
        this.input.keyboard.enabled = false;
        this.soc.emit('endGame', {
            player: this.data.player,
            rscore: this.rightScore,
            lscore: this.leftScore, 
            userId: this.data.userId,
            roomId: this.data.roomId,
            status: img
        });
    }
    updatePositions()
    {
        this.paddle.setPosition( this.posx, this.posy);
        if( this.paddle && this.paddle.body && 'updateFromGameObject' in this.paddle.body) {
            this.paddle.body.updateFromGameObject();
        }

        this.enemy.setPosition( this.eposx, this.posy);
        if(this.enemy && this.enemy.body && 'updateFromGameObject' in this.enemy.body) {
            this.enemy.body.updateFromGameObject();
        }
    }
    
    goalTime()
    {
        this.initialTime = 3;
        this.counter = this.add.text(this.w / 2, this.h / 2, '' + this.formatTime(this.initialTime), { fontSize: "60px", 
        fontFamily: "Poppins_B", align: "center"}).setOrigin(0.5);
        // Each 1000 ms call onEvent
        this.timedEvent = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });
    }

    update () : void
    {
        if (this.soc.disconnected)
        {
            this.add.text(this.w / 2, this.h / 2.5, 'the Server Is Down !!', { fontSize: "60px", 
            fontFamily: "Poppins_B", align: "center"}).setOrigin(0.5);
            this.scene.pause();
        }
        if (this.exitEmited || this.goal || !this.gameIsStarted || !this.isPlayer || this.map)
            return ;

        // ///// check For the  movment ////////////////
        if (this.desktop && !this.End)
        {
            if (this.cursors && this.cursors.up.isDown && ( this.paddle.y - 10) >= 0)
            {

                this.paddle.y -= 10;
                if('updateFromGameObject' in this.paddle.body) {
                    this.paddle.body.updateFromGameObject();
                }
            }
            else if (this.cursors && this.cursors.down.isDown && (this.paddle.y +
            (Phaser.Math.RoundTo(this.paddle.height * this.paddleScale, 0))
            + 10) <= this.h)
            {
                this.paddle.y += 10;
                if('updateFromGameObject' in this.paddle.body) {
                    this.paddle.body.updateFromGameObject();
                }
            }
        }
        else if (this.mobile && !this.End)
        {
            if(!this.input.activePointer.isDown && this.isClicking === true) {
                if(Math.abs(this.input.activePointer.upY - this.input.activePointer.downY) >= 50) {
                    if(this.input.activePointer.upY < this.input.activePointer.downY) {
                        this.swipeDirection = "up";
                    } else if(this.input.activePointer.upY > this.input.activePointer.downY) {
                        this.swipeDirection = "down";
                    }
                }
                this.isClicking = false;
            } else if(this.input.activePointer.isDown && this.isClicking === false) {
                this.isClicking = true;
            }
        
            if(this.swipeDirection === "down" && this.paddle.y < 530) {
                if(Math.abs(this.paddle.y - 530) <= 10) {
                    this.paddle.y = 530;
                    if('updateFromGameObject' in this.paddle.body) {
                        this.paddle.body.updateFromGameObject();
                    }
                } else {
                    this.paddle.y += 8;
                    if('updateFromGameObject' in this.paddle.body) {
                        this.paddle.body.updateFromGameObject();
                    }
                }
            } else if(this.swipeDirection === "up" && this.paddle.y > 15) {
                if(Math.abs(this.paddle.y - 15) <= 10) {
                    this.paddle.y = 15 ;
                    if('updateFromGameObject' in this.paddle.body) {
                        this.paddle.body.updateFromGameObject();
                    }
                } else {
                    this.paddle.y -= 8;
                    if('updateFromGameObject' in this.paddle.body) {
                        this.paddle.body.updateFromGameObject();
                    }
                }
            }
        }
        /////////////////////////////////////////////////////////

        
        // emit data to another player // 
        if (this.data.is_player && !this.End && this.ball && this.paddle)
        {
            this.soc.emit('move', {
                roomId: this.data.roomId,
                paddleY: this.paddle.y,
                ballx: (this.ball.body) ? this.ball.body.x: 0,
                bally: (this.ball.body) ? this.ball.body.y: 0,
                lScore: this.leftScore,
                rScore:this.rightScore
            });
        }
        //////////////////////////////////////////////
        if (this.data.is_player && this.data.player === "player1")
        {
            this.soc.emit('sendToWatcher', {
                roomId: this.data.roomId,
                lpaddle: this.paddle.y,
                rpaddle: this.enemy.y,
                ballx: this.ball.body.x,
                bally: this.ball.body.y,
                lScore: this.leftScore,
                rScore: this.rightScore,
                endGame: this.End,
                goal: this.goal,
            });
        }
        //////       check For the goals    //////////
        if ( this.data.is_player && !this.End && this.ball && (this.ball.x < 0 ||   (this.data.player === "player2" && (this.ball.x - 20 ) < 0 )))
        {
            /******************* add score for the leftUser *******************************/
            this.rightScore += 1;
            this.rightScoretxt.text = this.rightScore.toString();
            /******************************************************************************/

            if (this.data.is_player && !this.End)
            {
                this.goal = true;
                if (this.data.is_player && this.data.player === "player1")
                {
                    this.soc.emit('sendToWatcher', {
                        roomId: this.data.roomId,
                        lpaddle: this.paddle.y,
                        rpaddle: this.enemy.y,
                        ballx: this.ball.body.x,
                        bally: this.ball.body.y,
                        lScore: this.leftScore,
                        rScore: this.rightScore,
                        endGame: this.End,
                        goal: this.goal,
                    });
                }
                this.soc.removeAllListeners();
                this.scene.restart();
            }
            
        }
        else if (this.data.is_player && !this.End && this.ball && ((this.ball.x > this.w) || ( this.data.player === "player2" && (this.ball.x + 20 ) > this.w) ))
        {
            /******************* update the position of the paddle ************************/
            /******************************************************************************/
            
            /******************* add score for the leftUser *******************************/
            this.leftScore += 1; 
            this.leftScoretxt.text = this.leftScore.toString();
            /******************************************************************************/

            if (this.data.is_player && !this.End)
            {
                this.goal = true;
                if (this.data.is_player && this.data.player === "player1")
                {
                    this.soc.emit('sendToWatcher', {
                        roomId: this.data.roomId,
                        lpaddle: this.paddle.y,
                        rpaddle: this.enemy.y,
                        ballx: this.ball.body.x,
                        bally: this.ball.body.y,
                        lScore: this.leftScore,
                        rScore: this.rightScore,
                        endGame: this.End,
                        goal: this.goal,
                    });
                }
                this.soc.removeAllListeners();
                this.scene.restart();
            }
        }
    }
}

