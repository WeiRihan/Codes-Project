require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Game":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0486fOqHrJN+6c5PQg5FHh9', 'Game');
// scripts\Game.js

var Player = require('Player');
var ScoreFX = require('ScoreFX');
var Star = require('Star');

var Game = cc.Class({
    'extends': cc.Component,

    properties: {
        // 这个属性引用了星星预制资源
        starPrefab: {
            'default': null,
            type: cc.Prefab
        },
        scoreFXPrefab: {
            'default': null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        // 地面节点，用于确定星星生成的高度
        ground: {
            'default': null,
            type: cc.Node
        },
        // player 节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            'default': null,
            type: Player
        },
        // score label 的引用
        scoreDisplay: {
            'default': null,
            type: cc.Label
        },
        // 得分音效资源
        scoreAudio: {
            'default': null,
            url: cc.AudioClip
        },
        btnNode: {
            'default': null,
            type: cc.Node
        },
        gameOverNode: {
            'default': null,
            type: cc.Node
        },
        controlHintLabel: {
            'default': null,
            type: cc.Label
        },
        keyboardHint: {
            'default': '',
            multiline: true
        },
        touchHint: {
            'default': '',
            multiline: true
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;

        // store last star's x position
        this.currentStar = null;
        this.currentStarX = 0;

        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;

        // is showing menu or running game
        this.isRunning = false;

        // initialize control hint
        var hintText = cc.sys.isMobile ? this.touchHint : this.keyboardHint;
        this.controlHintLabel.string = hintText;

        // initialize star and score pool
        this.starPool = new cc.NodePool('Star');
        this.scorePool = new cc.NodePool('ScoreFX');
    },

    onStartGame: function onStartGame() {
        // 初始化计分
        this.resetScore();
        // set game state to running
        this.isRunning = true;
        // set button and gameover text out of screen
        this.btnNode.setPositionX(3000);
        this.gameOverNode.active = false;
        // reset player position and move speed
        this.player.startMoveAt(cc.p(0, this.groundY));
        // spawn star
        this.spawnNewStar();
    },

    spawnNewStar: function spawnNewStar() {
        var newStar = null;
        // 使用给定的模板在场景中生成一个新节点
        if (this.starPool.size() > 0) {
            newStar = this.starPool.get(this); // this will be passed to Star's reuse method
        } else {
                newStar = cc.instantiate(this.starPrefab);
            }
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        // pass Game instance to star
        newStar.getComponent('Star').init(this);
        // start star timer and store star reference
        this.startTimer();
        this.currentStar = newStar;
    },

    despawnStar: function despawnStar(star) {
        this.starPool.put(star);
        this.spawnNewStar();
    },

    startTimer: function startTimer() {
        // get a life duration for next star
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function getNewStarPosition() {
        // if there's no star, set a random x pos
        if (!this.currentStar) {
            this.currentStarX = cc.randomMinus1To1() * this.node.width / 2;
        }
        var randX = 0;
        // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + cc.random0To1() * this.player.jumpHeight + 50;
        // 根据屏幕宽度和上一个星星的 x 坐标，随机得到一个新生成星星 x 坐标
        var maxX = this.node.width / 2;
        if (this.currentStarX >= 0) {
            randX = -cc.random0To1() * maxX;
        } else {
            randX = cc.random0To1() * maxX;
        }
        this.currentStarX = randX;
        // 返回星星坐标
        return cc.p(randX, randY);
    },

    gainScore: function gainScore(pos) {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        // 播放特效
        var fx = this.spawnScoreFX();
        this.node.addChild(fx.node);
        fx.node.setPosition(pos);
        fx.play();
        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    resetScore: function resetScore() {
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
    },

    spawnScoreFX: function spawnScoreFX() {
        var fx;
        if (this.scorePool.size() > 0) {
            fx = this.scorePool.get();
            return fx.getComponent('ScoreFX');
        } else {
            fx = cc.instantiate(this.scoreFXPrefab).getComponent('ScoreFX');
            fx.init(this);
            return fx;
        }
    },

    despawnScoreFX: function despawnScoreFX(scoreFX) {
        this.scorePool.put(scoreFX);
    },

    // called every frame
    update: function update(dt) {
        if (!this.isRunning) return;
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    },

    gameOver: function gameOver() {
        this.gameOverNode.active = true;
        this.player.enabled = false;
        this.player.stopMove();
        this.currentStar.destroy();
        this.isRunning = false;
        this.btnNode.setPositionX(0);
    }
});

cc._RFpop();
},{"Player":"Player","ScoreFX":"ScoreFX","Star":"Star"}],"Player":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c10bbPdGYhDWaLoKLV38bHf', 'Player');
// scripts\Player.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 辅助形变动作时间
        squashDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,
        // 跳跃音效资源
        jumpAudio: {
            "default": null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.enabled = false;
        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        // 主角当前水平方向速度
        this.xSpeed = 0;
        // screen boundaries
        this.minPosX = -this.node.parent.width / 2;
        this.maxPosX = this.node.parent.width / 2;

        // 初始化跳跃动作
        this.jumpAction = this.setJumpAction();

        // 初始化键盘输入监听
        this.setInputControl();
    },

    setInputControl: function setInputControl() {
        var self = this;
        //add keyboard input listener to jump, turnLeft and turnRight
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // set a flag when key pressed
            onKeyPressed: function onKeyPressed(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                }
            },
            // unset a flag when key released
            onKeyReleased: function onKeyReleased(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.a:
                    case cc.KEY.left:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                    case cc.KEY.right:
                        self.accRight = false;
                        break;
                }
            }
        }, self.node);

        // touch input
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function onTouchBegan(touch, event) {
                var touchLoc = touch.getLocation();
                if (touchLoc.x >= cc.winSize.width / 2) {
                    self.accLeft = false;
                    self.accRight = true;
                } else {
                    self.accLeft = true;
                    self.accRight = false;
                }
                // don't capture the event
                return true;
            },
            onTouchEnded: function onTouchEnded(touch, event) {
                self.accLeft = false;
                self.accRight = false;
            }
        }, self.node);
    },

    setJumpAction: function setJumpAction() {
        // 跳跃上升
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 形变
        var squash = cc.scaleTo(this.squashDuration, 1, 0.6);
        var stretch = cc.scaleTo(this.squashDuration, 1, 1.2);
        var scaleBack = cc.scaleTo(this.squashDuration, 1, 1);
        // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
        var callback = cc.callFunc(this.playJumpSound, this);
        // 不断重复，而且每次完成落地动作后调用回调来播放声音
        return cc.repeatForever(cc.sequence(squash, stretch, jumpUp, scaleBack, jumpDown, callback));
    },

    playJumpSound: function playJumpSound() {
        // 调用声音引擎播放声音
        cc.audioEngine.playEffect(this.jumpAudio, false);
    },

    getCenterPos: function getCenterPos() {
        var centerPos = cc.p(this.node.x, this.node.y + this.node.height / 2);
        return centerPos;
    },

    startMoveAt: function startMoveAt(pos) {
        this.enabled = true;
        this.xSpeed = 0;
        this.node.setPosition(pos);
        this.node.runAction(this.setJumpAction());
    },

    stopMove: function stopMove() {
        this.node.stopAllActions();
    },

    // called every frame
    update: function update(dt) {
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        this.node.x += this.xSpeed * dt;

        // limit player position inside screen
        if (this.node.x > this.node.parent.width / 2) {
            this.node.x = this.node.parent.width / 2;
            this.xSpeed = 0;
        } else if (this.node.x < -this.node.parent.width / 2) {
            this.node.x = -this.node.parent.width / 2;
            this.xSpeed = 0;
        }
    }
});

cc._RFpop();
},{}],"ScoreAnim":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b1f9e88YHdGr7qD17shtr2w', 'ScoreAnim');
// scripts\ScoreAnim.js

cc.Class({
    "extends": cc.Component,

    init: function init(scoreFX) {
        this.scoreFX = scoreFX;
    },

    hideFX: function hideFX() {
        this.scoreFX.despawn();
    }
});

cc._RFpop();
},{}],"ScoreFX":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dd18c67pr9OM5wJb/yY6Onf', 'ScoreFX');
// scripts\ScoreFX.js

cc.Class({
    'extends': cc.Component,

    properties: {
        anim: {
            'default': null,
            type: cc.Animation
        }
    },

    init: function init(game) {
        this.game = game;
        this.anim.getComponent('ScoreAnim').init(this);
    },

    despawn: function despawn() {
        this.game.despawnScoreFX(this.node);
    },

    play: function play() {
        this.anim.play('score_pop');
    }
});

cc._RFpop();
},{}],"Star":[function(require,module,exports){
"use strict";
cc._RFpush(module, '21890Xr4RBJlqTJhmXJ/f5s', 'Star');
// scripts\Star.js

cc.Class({
    "extends": cc.Component,

    properties: {
        // 星星和主角之间的距离小于这个数值时，就会完成收集
        pickRadius: 0,
        // 暂存 Game 对象的引用
        game: {
            "default": null,
            serializable: false
        }
    },

    onLoad: function onLoad() {
        this.enabled = false;
    },

    // use this for initialization
    init: function init(game) {
        this.game = game;
        this.enabled = true;
        this.node.opacity = 255;
    },

    reuse: function reuse(game) {
        this.init(game);
    },

    getPlayerDistance: function getPlayerDistance() {
        // 根据 player 节点位置判断距离
        var playerPos = this.game.player.getCenterPos();
        // 根据两点位置计算两点之间距离
        var dist = cc.pDistance(this.node.position, playerPos);
        return dist;
    },

    onPicked: function onPicked() {
        var pos = this.node.getPosition();
        // 调用 Game 脚本的得分方法
        this.game.gainScore(pos);
        // 当星星被收集时，调用 Game 脚本中的接口，销毁当前星星节点，生成一个新的星星
        this.game.despawnStar(this.node);
    },

    // called every frame
    update: function update(dt) {
        // 每帧判断和主角之间的距离是否小于收集距离
        if (this.getPlayerDistance() < this.pickRadius) {
            // 调用收集行为
            this.onPicked();
            return;
        }
        // 根据 Game 脚本中的计时器更新星星的透明度
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }
});

cc._RFpop();
},{}]},{},["Game","Star","ScoreAnim","Player","ScoreFX"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0NvY29zQ3JlYXRvci9yZXNvdXJjZXMvYXBwLmFzYXIvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsImFzc2V0cy9zY3JpcHRzL0dhbWUuanMiLCJhc3NldHMvc2NyaXB0cy9QbGF5ZXIuanMiLCJhc3NldHMvc2NyaXB0cy9TY29yZUFuaW0uanMiLCJhc3NldHMvc2NyaXB0cy9TY29yZUZYLmpzIiwiYXNzZXRzL3NjcmlwdHMvU3Rhci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcInVzZSBzdHJpY3RcIjtcbmNjLl9SRnB1c2gobW9kdWxlLCAnMDQ4NmZPcUhySk4rNmM1UFFnNUZIaDknLCAnR2FtZScpO1xuLy8gc2NyaXB0c1xcR2FtZS5qc1xuXG52YXIgUGxheWVyID0gcmVxdWlyZSgnUGxheWVyJyk7XG52YXIgU2NvcmVGWCA9IHJlcXVpcmUoJ1Njb3JlRlgnKTtcbnZhciBTdGFyID0gcmVxdWlyZSgnU3RhcicpO1xuXG52YXIgR2FtZSA9IGNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8g6L+Z5Liq5bGe5oCn5byV55So5LqG5pif5pif6aKE5Yi26LWE5rqQXG4gICAgICAgIHN0YXJQcmVmYWI6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxuICAgICAgICB9LFxuICAgICAgICBzY29yZUZYUHJlZmFiOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcbiAgICAgICAgfSxcbiAgICAgICAgLy8g5pif5pif5Lqn55Sf5ZCO5raI5aSx5pe26Ze055qE6ZqP5py66IyD5Zu0XG4gICAgICAgIG1heFN0YXJEdXJhdGlvbjogMCxcbiAgICAgICAgbWluU3RhckR1cmF0aW9uOiAwLFxuICAgICAgICAvLyDlnLDpnaLoioLngrnvvIznlKjkuo7noa7lrprmmJ/mmJ/nlJ/miJDnmoTpq5jluqZcbiAgICAgICAgZ3JvdW5kOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIC8vIHBsYXllciDoioLngrnvvIznlKjkuo7ojrflj5bkuLvop5LlvLnot7PnmoTpq5jluqbvvIzlkozmjqfliLbkuLvop5LooYzliqjlvIDlhbNcbiAgICAgICAgcGxheWVyOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBQbGF5ZXJcbiAgICAgICAgfSxcbiAgICAgICAgLy8gc2NvcmUgbGFiZWwg55qE5byV55SoXG4gICAgICAgIHNjb3JlRGlzcGxheToge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuTGFiZWxcbiAgICAgICAgfSxcbiAgICAgICAgLy8g5b6X5YiG6Z+z5pWI6LWE5rqQXG4gICAgICAgIHNjb3JlQXVkaW86IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH0sXG4gICAgICAgIGJ0bk5vZGU6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLk5vZGVcbiAgICAgICAgfSxcbiAgICAgICAgZ2FtZU92ZXJOb2RlOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5Ob2RlXG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRyb2xIaW50TGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIGtleWJvYXJkSGludDoge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiAnJyxcbiAgICAgICAgICAgIG11bHRpbGluZTogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICB0b3VjaEhpbnQ6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogJycsXG4gICAgICAgICAgICBtdWx0aWxpbmU6IHRydWVcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcbiAgICAgICAgLy8g6I635Y+W5Zyw5bmz6Z2i55qEIHkg6L205Z2Q5qCHXG4gICAgICAgIHRoaXMuZ3JvdW5kWSA9IHRoaXMuZ3JvdW5kLnkgKyB0aGlzLmdyb3VuZC5oZWlnaHQgLyAyO1xuXG4gICAgICAgIC8vIHN0b3JlIGxhc3Qgc3RhcidzIHggcG9zaXRpb25cbiAgICAgICAgdGhpcy5jdXJyZW50U3RhciA9IG51bGw7XG4gICAgICAgIHRoaXMuY3VycmVudFN0YXJYID0gMDtcblxuICAgICAgICAvLyDliJ3lp4vljJborqHml7blmahcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XG4gICAgICAgIHRoaXMuc3RhckR1cmF0aW9uID0gMDtcblxuICAgICAgICAvLyBpcyBzaG93aW5nIG1lbnUgb3IgcnVubmluZyBnYW1lXG4gICAgICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZSBjb250cm9sIGhpbnRcbiAgICAgICAgdmFyIGhpbnRUZXh0ID0gY2Muc3lzLmlzTW9iaWxlID8gdGhpcy50b3VjaEhpbnQgOiB0aGlzLmtleWJvYXJkSGludDtcbiAgICAgICAgdGhpcy5jb250cm9sSGludExhYmVsLnN0cmluZyA9IGhpbnRUZXh0O1xuXG4gICAgICAgIC8vIGluaXRpYWxpemUgc3RhciBhbmQgc2NvcmUgcG9vbFxuICAgICAgICB0aGlzLnN0YXJQb29sID0gbmV3IGNjLk5vZGVQb29sKCdTdGFyJyk7XG4gICAgICAgIHRoaXMuc2NvcmVQb29sID0gbmV3IGNjLk5vZGVQb29sKCdTY29yZUZYJyk7XG4gICAgfSxcblxuICAgIG9uU3RhcnRHYW1lOiBmdW5jdGlvbiBvblN0YXJ0R2FtZSgpIHtcbiAgICAgICAgLy8g5Yid5aeL5YyW6K6h5YiGXG4gICAgICAgIHRoaXMucmVzZXRTY29yZSgpO1xuICAgICAgICAvLyBzZXQgZ2FtZSBzdGF0ZSB0byBydW5uaW5nXG4gICAgICAgIHRoaXMuaXNSdW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgLy8gc2V0IGJ1dHRvbiBhbmQgZ2FtZW92ZXIgdGV4dCBvdXQgb2Ygc2NyZWVuXG4gICAgICAgIHRoaXMuYnRuTm9kZS5zZXRQb3NpdGlvblgoMzAwMCk7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXJOb2RlLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAvLyByZXNldCBwbGF5ZXIgcG9zaXRpb24gYW5kIG1vdmUgc3BlZWRcbiAgICAgICAgdGhpcy5wbGF5ZXIuc3RhcnRNb3ZlQXQoY2MucCgwLCB0aGlzLmdyb3VuZFkpKTtcbiAgICAgICAgLy8gc3Bhd24gc3RhclxuICAgICAgICB0aGlzLnNwYXduTmV3U3RhcigpO1xuICAgIH0sXG5cbiAgICBzcGF3bk5ld1N0YXI6IGZ1bmN0aW9uIHNwYXduTmV3U3RhcigpIHtcbiAgICAgICAgdmFyIG5ld1N0YXIgPSBudWxsO1xuICAgICAgICAvLyDkvb/nlKjnu5nlrprnmoTmqKHmnb/lnKjlnLrmma/kuK3nlJ/miJDkuIDkuKrmlrDoioLngrlcbiAgICAgICAgaWYgKHRoaXMuc3RhclBvb2wuc2l6ZSgpID4gMCkge1xuICAgICAgICAgICAgbmV3U3RhciA9IHRoaXMuc3RhclBvb2wuZ2V0KHRoaXMpOyAvLyB0aGlzIHdpbGwgYmUgcGFzc2VkIHRvIFN0YXIncyByZXVzZSBtZXRob2RcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5zdGFyUHJlZmFiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgLy8g5bCG5paw5aKe55qE6IqC54K55re75Yqg5YiwIENhbnZhcyDoioLngrnkuIvpnaJcbiAgICAgICAgdGhpcy5ub2RlLmFkZENoaWxkKG5ld1N0YXIpO1xuICAgICAgICAvLyDkuLrmmJ/mmJ/orr7nva7kuIDkuKrpmo/mnLrkvY3nva5cbiAgICAgICAgbmV3U3Rhci5zZXRQb3NpdGlvbih0aGlzLmdldE5ld1N0YXJQb3NpdGlvbigpKTtcbiAgICAgICAgLy8gcGFzcyBHYW1lIGluc3RhbmNlIHRvIHN0YXJcbiAgICAgICAgbmV3U3Rhci5nZXRDb21wb25lbnQoJ1N0YXInKS5pbml0KHRoaXMpO1xuICAgICAgICAvLyBzdGFydCBzdGFyIHRpbWVyIGFuZCBzdG9yZSBzdGFyIHJlZmVyZW5jZVxuICAgICAgICB0aGlzLnN0YXJ0VGltZXIoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhciA9IG5ld1N0YXI7XG4gICAgfSxcblxuICAgIGRlc3Bhd25TdGFyOiBmdW5jdGlvbiBkZXNwYXduU3RhcihzdGFyKSB7XG4gICAgICAgIHRoaXMuc3RhclBvb2wucHV0KHN0YXIpO1xuICAgICAgICB0aGlzLnNwYXduTmV3U3RhcigpO1xuICAgIH0sXG5cbiAgICBzdGFydFRpbWVyOiBmdW5jdGlvbiBzdGFydFRpbWVyKCkge1xuICAgICAgICAvLyBnZXQgYSBsaWZlIGR1cmF0aW9uIGZvciBuZXh0IHN0YXJcbiAgICAgICAgdGhpcy5zdGFyRHVyYXRpb24gPSB0aGlzLm1pblN0YXJEdXJhdGlvbiArIGNjLnJhbmRvbTBUbzEoKSAqICh0aGlzLm1heFN0YXJEdXJhdGlvbiAtIHRoaXMubWluU3RhckR1cmF0aW9uKTtcbiAgICAgICAgdGhpcy50aW1lciA9IDA7XG4gICAgfSxcblxuICAgIGdldE5ld1N0YXJQb3NpdGlvbjogZnVuY3Rpb24gZ2V0TmV3U3RhclBvc2l0aW9uKCkge1xuICAgICAgICAvLyBpZiB0aGVyZSdzIG5vIHN0YXIsIHNldCBhIHJhbmRvbSB4IHBvc1xuICAgICAgICBpZiAoIXRoaXMuY3VycmVudFN0YXIpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFN0YXJYID0gY2MucmFuZG9tTWludXMxVG8xKCkgKiB0aGlzLm5vZGUud2lkdGggLyAyO1xuICAgICAgICB9XG4gICAgICAgIHZhciByYW5kWCA9IDA7XG4gICAgICAgIC8vIOagueaNruWcsOW5s+mdouS9jee9ruWSjOS4u+inkui3s+i3g+mrmOW6pu+8jOmaj+acuuW+l+WIsOS4gOS4quaYn+aYn+eahCB5IOWdkOagh1xuICAgICAgICB2YXIgcmFuZFkgPSB0aGlzLmdyb3VuZFkgKyBjYy5yYW5kb20wVG8xKCkgKiB0aGlzLnBsYXllci5qdW1wSGVpZ2h0ICsgNTA7XG4gICAgICAgIC8vIOagueaNruWxj+W5leWuveW6puWSjOS4iuS4gOS4quaYn+aYn+eahCB4IOWdkOagh++8jOmaj+acuuW+l+WIsOS4gOS4quaWsOeUn+aIkOaYn+aYnyB4IOWdkOagh1xuICAgICAgICB2YXIgbWF4WCA9IHRoaXMubm9kZS53aWR0aCAvIDI7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGFyWCA+PSAwKSB7XG4gICAgICAgICAgICByYW5kWCA9IC1jYy5yYW5kb20wVG8xKCkgKiBtYXhYO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmFuZFggPSBjYy5yYW5kb20wVG8xKCkgKiBtYXhYO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3VycmVudFN0YXJYID0gcmFuZFg7XG4gICAgICAgIC8vIOi/lOWbnuaYn+aYn+WdkOagh1xuICAgICAgICByZXR1cm4gY2MucChyYW5kWCwgcmFuZFkpO1xuICAgIH0sXG5cbiAgICBnYWluU2NvcmU6IGZ1bmN0aW9uIGdhaW5TY29yZShwb3MpIHtcbiAgICAgICAgdGhpcy5zY29yZSArPSAxO1xuICAgICAgICAvLyDmm7TmlrAgc2NvcmVEaXNwbGF5IExhYmVsIOeahOaWh+Wtl1xuICAgICAgICB0aGlzLnNjb3JlRGlzcGxheS5zdHJpbmcgPSAnU2NvcmU6ICcgKyB0aGlzLnNjb3JlLnRvU3RyaW5nKCk7XG4gICAgICAgIC8vIOaSreaUvueJueaViFxuICAgICAgICB2YXIgZnggPSB0aGlzLnNwYXduU2NvcmVGWCgpO1xuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQoZngubm9kZSk7XG4gICAgICAgIGZ4Lm5vZGUuc2V0UG9zaXRpb24ocG9zKTtcbiAgICAgICAgZngucGxheSgpO1xuICAgICAgICAvLyDmkq3mlL7lvpfliIbpn7PmlYhcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLnNjb3JlQXVkaW8sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgcmVzZXRTY29yZTogZnVuY3Rpb24gcmVzZXRTY29yZSgpIHtcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgICAgIHRoaXMuc2NvcmVEaXNwbGF5LnN0cmluZyA9ICdTY29yZTogJyArIHRoaXMuc2NvcmUudG9TdHJpbmcoKTtcbiAgICB9LFxuXG4gICAgc3Bhd25TY29yZUZYOiBmdW5jdGlvbiBzcGF3blNjb3JlRlgoKSB7XG4gICAgICAgIHZhciBmeDtcbiAgICAgICAgaWYgKHRoaXMuc2NvcmVQb29sLnNpemUoKSA+IDApIHtcbiAgICAgICAgICAgIGZ4ID0gdGhpcy5zY29yZVBvb2wuZ2V0KCk7XG4gICAgICAgICAgICByZXR1cm4gZnguZ2V0Q29tcG9uZW50KCdTY29yZUZYJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmeCA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc2NvcmVGWFByZWZhYikuZ2V0Q29tcG9uZW50KCdTY29yZUZYJyk7XG4gICAgICAgICAgICBmeC5pbml0KHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIGZ4O1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGRlc3Bhd25TY29yZUZYOiBmdW5jdGlvbiBkZXNwYXduU2NvcmVGWChzY29yZUZYKSB7XG4gICAgICAgIHRoaXMuc2NvcmVQb29sLnB1dChzY29yZUZYKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzUnVubmluZykgcmV0dXJuO1xuICAgICAgICAvLyDmr4/luKfmm7TmlrDorqHml7blmajvvIzotoXov4fpmZDluqbov5jmsqHmnInnlJ/miJDmlrDnmoTmmJ/mmJ9cbiAgICAgICAgLy8g5bCx5Lya6LCD55So5ri45oiP5aSx6LSl6YC76L6RXG4gICAgICAgIGlmICh0aGlzLnRpbWVyID4gdGhpcy5zdGFyRHVyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRpbWVyICs9IGR0O1xuICAgIH0sXG5cbiAgICBnYW1lT3ZlcjogZnVuY3Rpb24gZ2FtZU92ZXIoKSB7XG4gICAgICAgIHRoaXMuZ2FtZU92ZXJOb2RlLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMucGxheWVyLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5wbGF5ZXIuc3RvcE1vdmUoKTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3Rhci5kZXN0cm95KCk7XG4gICAgICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYnRuTm9kZS5zZXRQb3NpdGlvblgoMCk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdjMTBiYlBkR1loRFdhTG9LTFYzOGJIZicsICdQbGF5ZXInKTtcbi8vIHNjcmlwdHNcXFBsYXllci5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8g5Li76KeS6Lez6LeD6auY5bqmXG4gICAgICAgIGp1bXBIZWlnaHQ6IDAsXG4gICAgICAgIC8vIOS4u+inkui3s+i3g+aMgee7reaXtumXtFxuICAgICAgICBqdW1wRHVyYXRpb246IDAsXG4gICAgICAgIC8vIOi+heWKqeW9ouWPmOWKqOS9nOaXtumXtFxuICAgICAgICBzcXVhc2hEdXJhdGlvbjogMCxcbiAgICAgICAgLy8g5pyA5aSn56e75Yqo6YCf5bqmXG4gICAgICAgIG1heE1vdmVTcGVlZDogMCxcbiAgICAgICAgLy8g5Yqg6YCf5bqmXG4gICAgICAgIGFjY2VsOiAwLFxuICAgICAgICAvLyDot7Pot4Ppn7PmlYjotYTmupBcbiAgICAgICAganVtcEF1ZGlvOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCxcbiAgICAgICAgICAgIHVybDogY2MuQXVkaW9DbGlwXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAvLyDliqDpgJ/luqbmlrnlkJHlvIDlhbNcbiAgICAgICAgdGhpcy5hY2NMZWZ0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYWNjUmlnaHQgPSBmYWxzZTtcbiAgICAgICAgLy8g5Li76KeS5b2T5YmN5rC05bmz5pa55ZCR6YCf5bqmXG4gICAgICAgIHRoaXMueFNwZWVkID0gMDtcbiAgICAgICAgLy8gc2NyZWVuIGJvdW5kYXJpZXNcbiAgICAgICAgdGhpcy5taW5Qb3NYID0gLXRoaXMubm9kZS5wYXJlbnQud2lkdGggLyAyO1xuICAgICAgICB0aGlzLm1heFBvc1ggPSB0aGlzLm5vZGUucGFyZW50LndpZHRoIC8gMjtcblxuICAgICAgICAvLyDliJ3lp4vljJbot7Pot4PliqjkvZxcbiAgICAgICAgdGhpcy5qdW1wQWN0aW9uID0gdGhpcy5zZXRKdW1wQWN0aW9uKCk7XG5cbiAgICAgICAgLy8g5Yid5aeL5YyW6ZSu55uY6L6T5YWl55uR5ZCsXG4gICAgICAgIHRoaXMuc2V0SW5wdXRDb250cm9sKCk7XG4gICAgfSxcblxuICAgIHNldElucHV0Q29udHJvbDogZnVuY3Rpb24gc2V0SW5wdXRDb250cm9sKCkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vYWRkIGtleWJvYXJkIGlucHV0IGxpc3RlbmVyIHRvIGp1bXAsIHR1cm5MZWZ0IGFuZCB0dXJuUmlnaHRcbiAgICAgICAgY2MuZXZlbnRNYW5hZ2VyLmFkZExpc3RlbmVyKHtcbiAgICAgICAgICAgIGV2ZW50OiBjYy5FdmVudExpc3RlbmVyLktFWUJPQVJELFxuICAgICAgICAgICAgLy8gc2V0IGEgZmxhZyB3aGVuIGtleSBwcmVzc2VkXG4gICAgICAgICAgICBvbktleVByZXNzZWQ6IGZ1bmN0aW9uIG9uS2V5UHJlc3NlZChrZXlDb2RlLCBldmVudCkge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoa2V5Q29kZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5hOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5sZWZ0OlxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NMZWZ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjUmlnaHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5kOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5yaWdodDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjTGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NSaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gdW5zZXQgYSBmbGFnIHdoZW4ga2V5IHJlbGVhc2VkXG4gICAgICAgICAgICBvbktleVJlbGVhc2VkOiBmdW5jdGlvbiBvbktleVJlbGVhc2VkKGtleUNvZGUsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChrZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmE6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgY2MuS0VZLmxlZnQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFjY0xlZnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5kOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIGNjLktFWS5yaWdodDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjUmlnaHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgc2VsZi5ub2RlKTtcblxuICAgICAgICAvLyB0b3VjaCBpbnB1dFxuICAgICAgICBjYy5ldmVudE1hbmFnZXIuYWRkTGlzdGVuZXIoe1xuICAgICAgICAgICAgZXZlbnQ6IGNjLkV2ZW50TGlzdGVuZXIuVE9VQ0hfT05FX0JZX09ORSxcbiAgICAgICAgICAgIG9uVG91Y2hCZWdhbjogZnVuY3Rpb24gb25Ub3VjaEJlZ2FuKHRvdWNoLCBldmVudCkge1xuICAgICAgICAgICAgICAgIHZhciB0b3VjaExvYyA9IHRvdWNoLmdldExvY2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRvdWNoTG9jLnggPj0gY2Mud2luU2l6ZS53aWR0aCAvIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NMZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjUmlnaHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjTGVmdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuYWNjUmlnaHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgY2FwdHVyZSB0aGUgZXZlbnRcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvblRvdWNoRW5kZWQ6IGZ1bmN0aW9uIG9uVG91Y2hFbmRlZCh0b3VjaCwgZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBzZWxmLmFjY0xlZnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBzZWxmLmFjY1JpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHNlbGYubm9kZSk7XG4gICAgfSxcblxuICAgIHNldEp1bXBBY3Rpb246IGZ1bmN0aW9uIHNldEp1bXBBY3Rpb24oKSB7XG4gICAgICAgIC8vIOi3s+i3g+S4iuWNh1xuICAgICAgICB2YXIganVtcFVwID0gY2MubW92ZUJ5KHRoaXMuanVtcER1cmF0aW9uLCBjYy5wKDAsIHRoaXMuanVtcEhlaWdodCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25PdXQoKSk7XG4gICAgICAgIC8vIOS4i+iQvVxuICAgICAgICB2YXIganVtcERvd24gPSBjYy5tb3ZlQnkodGhpcy5qdW1wRHVyYXRpb24sIGNjLnAoMCwgLXRoaXMuanVtcEhlaWdodCkpLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcbiAgICAgICAgLy8g5b2i5Y+YXG4gICAgICAgIHZhciBzcXVhc2ggPSBjYy5zY2FsZVRvKHRoaXMuc3F1YXNoRHVyYXRpb24sIDEsIDAuNik7XG4gICAgICAgIHZhciBzdHJldGNoID0gY2Muc2NhbGVUbyh0aGlzLnNxdWFzaER1cmF0aW9uLCAxLCAxLjIpO1xuICAgICAgICB2YXIgc2NhbGVCYWNrID0gY2Muc2NhbGVUbyh0aGlzLnNxdWFzaER1cmF0aW9uLCAxLCAxKTtcbiAgICAgICAgLy8g5re75Yqg5LiA5Liq5Zue6LCD5Ye95pWw77yM55So5LqO5Zyo5Yqo5L2c57uT5p2f5pe26LCD55So5oiR5Lus5a6a5LmJ55qE5YW25LuW5pa55rOVXG4gICAgICAgIHZhciBjYWxsYmFjayA9IGNjLmNhbGxGdW5jKHRoaXMucGxheUp1bXBTb3VuZCwgdGhpcyk7XG4gICAgICAgIC8vIOS4jeaWremHjeWkje+8jOiAjOS4lOavj+asoeWujOaIkOiQveWcsOWKqOS9nOWQjuiwg+eUqOWbnuiwg+adpeaSreaUvuWjsOmfs1xuICAgICAgICByZXR1cm4gY2MucmVwZWF0Rm9yZXZlcihjYy5zZXF1ZW5jZShzcXVhc2gsIHN0cmV0Y2gsIGp1bXBVcCwgc2NhbGVCYWNrLCBqdW1wRG93biwgY2FsbGJhY2spKTtcbiAgICB9LFxuXG4gICAgcGxheUp1bXBTb3VuZDogZnVuY3Rpb24gcGxheUp1bXBTb3VuZCgpIHtcbiAgICAgICAgLy8g6LCD55So5aOw6Z+z5byV5pOO5pKt5pS+5aOw6Z+zXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5qdW1wQXVkaW8sIGZhbHNlKTtcbiAgICB9LFxuXG4gICAgZ2V0Q2VudGVyUG9zOiBmdW5jdGlvbiBnZXRDZW50ZXJQb3MoKSB7XG4gICAgICAgIHZhciBjZW50ZXJQb3MgPSBjYy5wKHRoaXMubm9kZS54LCB0aGlzLm5vZGUueSArIHRoaXMubm9kZS5oZWlnaHQgLyAyKTtcbiAgICAgICAgcmV0dXJuIGNlbnRlclBvcztcbiAgICB9LFxuXG4gICAgc3RhcnRNb3ZlQXQ6IGZ1bmN0aW9uIHN0YXJ0TW92ZUF0KHBvcykge1xuICAgICAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnhTcGVlZCA9IDA7XG4gICAgICAgIHRoaXMubm9kZS5zZXRQb3NpdGlvbihwb3MpO1xuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHRoaXMuc2V0SnVtcEFjdGlvbigpKTtcbiAgICB9LFxuXG4gICAgc3RvcE1vdmU6IGZ1bmN0aW9uIHN0b3BNb3ZlKCkge1xuICAgICAgICB0aGlzLm5vZGUuc3RvcEFsbEFjdGlvbnMoKTtcbiAgICB9LFxuXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lXG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoZHQpIHtcbiAgICAgICAgLy8g5qC55o2u5b2T5YmN5Yqg6YCf5bqm5pa55ZCR5q+P5bin5pu05paw6YCf5bqmXG4gICAgICAgIGlmICh0aGlzLmFjY0xlZnQpIHtcbiAgICAgICAgICAgIHRoaXMueFNwZWVkIC09IHRoaXMuYWNjZWwgKiBkdDtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmFjY1JpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLnhTcGVlZCArPSB0aGlzLmFjY2VsICogZHQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8g6ZmQ5Yi25Li76KeS55qE6YCf5bqm5LiN6IO96LaF6L+H5pyA5aSn5YC8XG4gICAgICAgIGlmIChNYXRoLmFicyh0aGlzLnhTcGVlZCkgPiB0aGlzLm1heE1vdmVTcGVlZCkge1xuICAgICAgICAgICAgLy8gaWYgc3BlZWQgcmVhY2ggbGltaXQsIHVzZSBtYXggc3BlZWQgd2l0aCBjdXJyZW50IGRpcmVjdGlvblxuICAgICAgICAgICAgdGhpcy54U3BlZWQgPSB0aGlzLm1heE1vdmVTcGVlZCAqIHRoaXMueFNwZWVkIC8gTWF0aC5hYnModGhpcy54U3BlZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8g5qC55o2u5b2T5YmN6YCf5bqm5pu05paw5Li76KeS55qE5L2N572uXG4gICAgICAgIHRoaXMubm9kZS54ICs9IHRoaXMueFNwZWVkICogZHQ7XG5cbiAgICAgICAgLy8gbGltaXQgcGxheWVyIHBvc2l0aW9uIGluc2lkZSBzY3JlZW5cbiAgICAgICAgaWYgKHRoaXMubm9kZS54ID4gdGhpcy5ub2RlLnBhcmVudC53aWR0aCAvIDIpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS54ID0gdGhpcy5ub2RlLnBhcmVudC53aWR0aCAvIDI7XG4gICAgICAgICAgICB0aGlzLnhTcGVlZCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ub2RlLnggPCAtdGhpcy5ub2RlLnBhcmVudC53aWR0aCAvIDIpIHtcbiAgICAgICAgICAgIHRoaXMubm9kZS54ID0gLXRoaXMubm9kZS5wYXJlbnQud2lkdGggLyAyO1xuICAgICAgICAgICAgdGhpcy54U3BlZWQgPSAwO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICdiMWY5ZTg4WUhkR3I3cUQxN3NodHIydycsICdTY29yZUFuaW0nKTtcbi8vIHNjcmlwdHNcXFNjb3JlQW5pbS5qc1xuXG5jYy5DbGFzcyh7XG4gICAgXCJleHRlbmRzXCI6IGNjLkNvbXBvbmVudCxcblxuICAgIGluaXQ6IGZ1bmN0aW9uIGluaXQoc2NvcmVGWCkge1xuICAgICAgICB0aGlzLnNjb3JlRlggPSBzY29yZUZYO1xuICAgIH0sXG5cbiAgICBoaWRlRlg6IGZ1bmN0aW9uIGhpZGVGWCgpIHtcbiAgICAgICAgdGhpcy5zY29yZUZYLmRlc3Bhd24oKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2RkMThjNjdwcjlPTTV3SmIveVk2T25mJywgJ1Njb3JlRlgnKTtcbi8vIHNjcmlwdHNcXFNjb3JlRlguanNcblxuY2MuQ2xhc3Moe1xuICAgICdleHRlbmRzJzogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBhbmltOiB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IG51bGwsXG4gICAgICAgICAgICB0eXBlOiBjYy5BbmltYXRpb25cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5hbmltLmdldENvbXBvbmVudCgnU2NvcmVBbmltJykuaW5pdCh0aGlzKTtcbiAgICB9LFxuXG4gICAgZGVzcGF3bjogZnVuY3Rpb24gZGVzcGF3bigpIHtcbiAgICAgICAgdGhpcy5nYW1lLmRlc3Bhd25TY29yZUZYKHRoaXMubm9kZSk7XG4gICAgfSxcblxuICAgIHBsYXk6IGZ1bmN0aW9uIHBsYXkoKSB7XG4gICAgICAgIHRoaXMuYW5pbS5wbGF5KCdzY29yZV9wb3AnKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzIxODkwWHI0UkJKbHFUSmhtWEovZjVzJywgJ1N0YXInKTtcbi8vIHNjcmlwdHNcXFN0YXIuanNcblxuY2MuQ2xhc3Moe1xuICAgIFwiZXh0ZW5kc1wiOiBjYy5Db21wb25lbnQsXG5cbiAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIC8vIOaYn+aYn+WSjOS4u+inkuS5i+mXtOeahOi3neemu+Wwj+S6jui/meS4quaVsOWAvOaXtu+8jOWwseS8muWujOaIkOaUtumbhlxuICAgICAgICBwaWNrUmFkaXVzOiAwLFxuICAgICAgICAvLyDmmoLlrZggR2FtZSDlr7nosaHnmoTlvJXnlKhcbiAgICAgICAgZ2FtZToge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICBzZXJpYWxpemFibGU6IGZhbHNlXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICAgIH0sXG5cbiAgICAvLyB1c2UgdGhpcyBmb3IgaW5pdGlhbGl6YXRpb25cbiAgICBpbml0OiBmdW5jdGlvbiBpbml0KGdhbWUpIHtcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ub2RlLm9wYWNpdHkgPSAyNTU7XG4gICAgfSxcblxuICAgIHJldXNlOiBmdW5jdGlvbiByZXVzZShnYW1lKSB7XG4gICAgICAgIHRoaXMuaW5pdChnYW1lKTtcbiAgICB9LFxuXG4gICAgZ2V0UGxheWVyRGlzdGFuY2U6IGZ1bmN0aW9uIGdldFBsYXllckRpc3RhbmNlKCkge1xuICAgICAgICAvLyDmoLnmja4gcGxheWVyIOiKgueCueS9jee9ruWIpOaWrei3neemu1xuICAgICAgICB2YXIgcGxheWVyUG9zID0gdGhpcy5nYW1lLnBsYXllci5nZXRDZW50ZXJQb3MoKTtcbiAgICAgICAgLy8g5qC55o2u5Lik54K55L2N572u6K6h566X5Lik54K55LmL6Ze06Led56a7XG4gICAgICAgIHZhciBkaXN0ID0gY2MucERpc3RhbmNlKHRoaXMubm9kZS5wb3NpdGlvbiwgcGxheWVyUG9zKTtcbiAgICAgICAgcmV0dXJuIGRpc3Q7XG4gICAgfSxcblxuICAgIG9uUGlja2VkOiBmdW5jdGlvbiBvblBpY2tlZCgpIHtcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMubm9kZS5nZXRQb3NpdGlvbigpO1xuICAgICAgICAvLyDosIPnlKggR2FtZSDohJrmnKznmoTlvpfliIbmlrnms5VcbiAgICAgICAgdGhpcy5nYW1lLmdhaW5TY29yZShwb3MpO1xuICAgICAgICAvLyDlvZPmmJ/mmJ/ooqvmlLbpm4bml7bvvIzosIPnlKggR2FtZSDohJrmnKzkuK3nmoTmjqXlj6PvvIzplIDmr4HlvZPliY3mmJ/mmJ/oioLngrnvvIznlJ/miJDkuIDkuKrmlrDnmoTmmJ/mmJ9cbiAgICAgICAgdGhpcy5nYW1lLmRlc3Bhd25TdGFyKHRoaXMubm9kZSk7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZVxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7XG4gICAgICAgIC8vIOavj+W4p+WIpOaWreWSjOS4u+inkuS5i+mXtOeahOi3neemu+aYr+WQpuWwj+S6juaUtumbhui3neemu1xuICAgICAgICBpZiAodGhpcy5nZXRQbGF5ZXJEaXN0YW5jZSgpIDwgdGhpcy5waWNrUmFkaXVzKSB7XG4gICAgICAgICAgICAvLyDosIPnlKjmlLbpm4booYzkuLpcbiAgICAgICAgICAgIHRoaXMub25QaWNrZWQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyDmoLnmja4gR2FtZSDohJrmnKzkuK3nmoTorqHml7blmajmm7TmlrDmmJ/mmJ/nmoTpgI/mmI7luqZcbiAgICAgICAgdmFyIG9wYWNpdHlSYXRpbyA9IDEgLSB0aGlzLmdhbWUudGltZXIgLyB0aGlzLmdhbWUuc3RhckR1cmF0aW9uO1xuICAgICAgICB2YXIgbWluT3BhY2l0eSA9IDUwO1xuICAgICAgICB0aGlzLm5vZGUub3BhY2l0eSA9IG1pbk9wYWNpdHkgKyBNYXRoLmZsb29yKG9wYWNpdHlSYXRpbyAqICgyNTUgLSBtaW5PcGFjaXR5KSk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyJdfQ==
