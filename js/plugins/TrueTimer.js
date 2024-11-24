// TrueTimer.js Ver.2.0.0
// MIT License (C) 2022 あわやまたな
// http://opensource.org/licenses/mit-license.php

/*:
* @target MZ MV
* @plugindesc タイマーに機能を追加します。
* 顧客が本当に必要だった物。
* @author あわやまたな (Awaya_Matana)
* @url https://awaya3ji.seesaa.net/article/493253297.html
* @help [プラグインコマンド（MV）]
* TrueTimer start 分 秒 //タイマーの始動
*
* TrueTimer change 分 秒 true/false //タイマーの変更
* 現在の時間から増減します。
* true/未入力で増やす。falseで減らす。
*
* TrueTimer stop //タイマーの停止
*
* TrueTimer pause //タイマーの一時停止
* タイマーを一時停止します。タイマーは起動中のままです。
*
* TrueTimer restart //タイマーの再始動
* 一時停止したタイマーを再開します。
*
* TrueTimer countUp true/false //タイマーのカウントアップ
* trueにするとカウントアップになります。
*
* TrueTimer transparency true/false/default //透明状態の変更
* trueで常に表示。falseで常に消去。defaultで動作中のみ表示。
*
* [パラメータ]
* 【変数】
* 秒数が変化したタイミングで代入されます。
* よって秒数をイベントの出現条件として使用可能になります。
*
* 12分02秒：722秒なので722が変数に格納されます。
*
* 【分秒】
* 変数を代入する際、下二桁以外を分、下二桁を秒にします。
* これによって出現条件をより感覚的に指定できます。
*
* 12分02秒：1202が変数に格納されます。
* 1分53秒：153が変数に格納されます。
* 5秒：5が変数に格納されます。
*
* [更新履歴]
* 2022/11/06：Ver.1.0.0　公開
* 2022/11/06：Ver.1.0.1　バグ対策と時間を相対的に変更する機能を追加。
* 2022/11/27：Ver.1.0.2　時間を減らすとマイナスになる不具合を修正。
* 2023/04/08：Ver.2.0.0　プラグインコマンド「タイマーの一時停止」を追加。
*
* @command startTimer
* @text タイマーの始動
* @desc タイマーを始動します。
*
* @arg min
* @text 分
* @desc タイマーに設定する時間です。
* @default 0
*
* @arg sec
* @text 秒
* @desc タイマーに設定する時間です。
* @default 0
*
* @command changeTimer
* @text タイマーの変更
* @desc タイマーの時間を増やす、または減らします。
* 
* @arg min
* @text 分
* @desc タイマーに増減する時間です。
* @default 0
*
* @arg sec
* @text 秒
* @desc タイマーに増減する時間です。
* @default 0
*
* @arg ope
* @text 操作
* @desc タイマーに増減する時間です。
* @type select
* @default 増やす
* @option 増やす
* @option 減らす
*
* @command stopTimer
* @text タイマーの停止
* @desc タイマーを停止します。
*
* @command pauseTimer
* @text タイマーの一時停止
* @desc タイマーを一時停止します。
* タイマーは起動中のままです。
*
* @command restartTimer
* @text タイマーの再始動
* @desc タイマーを再始動します。
*
* @command changeMode
* @text モードの変更
* @desc モードを変更します。
*
* @arg mode
* @text モード
* @desc タイマーをカウントダウンするかカウントアップするかを選択します。
* @type select
* @default カウントダウン
* @option カウントダウン
* @option カウントアップ
*
* @command changeTransparency
* @text 透明状態の変更
* @desc タイマーの表示／非表示を変更します。
*
* @arg transparency
* @text 透明状態
* @desc タイマーの表示するかしないかを選択します。
* 元に戻すとタイマー動作時のみ表示されるようになります。
* @type select
* @default ON
* @option ON
* @option OFF
* @option 元に戻す
*
* @param variableId
* @text 変数
* @desc タイマーの値を代入する変数。
* （なし）にすると使用しません。
* @type variable
*
* @param mmss
* @text 分秒
* @desc 変数の下二桁以外を分、下二桁を秒にします。
* @type boolean
* @default false
*
* @param abortBattle
* @text バトルの強制終了
* @desc バトルを強制終了する謎仕様です。
* @type boolean
* @default false
*
*/

'use strict';
{
	const useMZ = Utils.RPGMAKER_NAME === "MZ";
	const pluginName = document.currentScript.src.match(/^.*\/(.*).js$/)[1];
	const hasPluginCommonBase = typeof PluginManagerEx === "function";
	const parameter = PluginManager.parameters(pluginName);
	const variableId = Number(parameter["variableId"]);
	const mmss = parameter["mmss"] === "true";
	const abortBattle = parameter["abortBattle"] === "true";

	//-----------------------------------------------------------------------------
	// PluginManager

	if (useMZ) {
		PluginManager.registerCommand(pluginName, "startTimer", function (args) {
			const sec = Math.abs(args.min) * 60 + Math.abs(args.sec);
			$gameTimer.start(Math.floor(sec * 60));
		});

		PluginManager.registerCommand(pluginName, "changeTimer", function (args) {
			const ope = args.ope === "増やす" ? 1 : -1;
			const sec = Math.abs(args.min) * 60 + Math.abs(args.sec);
			$gameTimer.add(sec * 60 * ope);
		});

		if (hasPluginCommonBase) {
			PluginManagerEx.registerCommand(document.currentScript, "startTimer", function (args) {
				const sec = args.min * 60 + args.sec;
				$gameTimer.start(sec * 60);
			});

			PluginManagerEx.registerCommand(document.currentScript, "changeTimer", function (args) {
				const ope = args.ope === "増やす" ? 1 : -1;
				const sec = Math.abs(args.min) * 60 + Math.abs(args.sec);
				$gameTimer.add(sec * 60 * ope);
			});
		}

		PluginManager.registerCommand(pluginName, "pauseTimer", function (args) {
			$gameTimer.pause();
		});

		PluginManager.registerCommand(pluginName, "restartTimer", function (args) {
			$gameTimer.restart();
		});

		PluginManager.registerCommand(pluginName, "stopTimer", function (args) {
			$gameTimer.stop();
		});

		PluginManager.registerCommand(pluginName, "changeMode", function (args) {
			$gameTimer._countUp = args.mode === "カウントアップ";
		});

		PluginManager.registerCommand(pluginName, "changeTransparency", function (args) {
			$gameTimer._visibleForcing = true;
			switch (args.transparency) {
			case "ON":
				$gameTimer.hide();
				break;
			case "OFF":
				$gameTimer.show();
				break;
			default:
				$gameTimer._visibleForcing = false;
				break;
			}
		});
	}

	//-----------------------------------------------------------------------------
	// PluginManager

	const _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand.apply(this, arguments);
		if (command === pluginName) {
			switch (args[0]) {
			case "start":
				var sec = Math.abs(args[1]) * 60 + Math.abs(args[2]);
				$gameTimer.start(sec * 60);
				break;
			case "change":
				const ope = args[3] !== "false" ? 1 : -1;
				var sec =Math.abs(args[1]) * 60 + Math.abs(args[2]);
				$gameTimer.start(sec * 60 * ope);
				break;
			case "stop":
				$gameTimer.stop();
				break;
			case "pause":
				$gameTimer.pause();
				break;
			case "restart":
				$gameTimer.restart();
				break;
			case "countUp":
				$gameTimer._countUp = args[1] === "true";
				break;
			case "transparency":
				$gameTimer._visibleForcing = true;
				switch (args[1]) {
				case "true":
					$gameTimer.hide();
					break;
				case "false":
					$gameTimer.show();
					break;
				case "default":
					$gameTimer._visibleForcing = false;
					break;
				}
				break;
			}
		}
	};

	//-----------------------------------------------------------------------------
	// Game_Timer

	const _Game_Timer_initialize = Game_Timer.prototype.initialize;
	Game_Timer.prototype.initialize = function() {
		_Game_Timer_initialize.call(this);
		this._pausing = false;
		this._countUp = false;
		this._visibleForcing  = false;
		this._visible = false;
	};

	Game_Timer.prototype.isVisibleForcing = function() {
		return this._visibleForcing;
	};

	Game_Timer.prototype.isVisible = function() {
		return this._visible;
	};

	Game_Timer.prototype.show = function() {
		this._visible = true;
	};

	Game_Timer.prototype.hide = function() {
		this._visible = false;
	};

	const _Game_Timer_start = Game_Timer.prototype.start;
	Game_Timer.prototype.start = function(count) {
		_Game_Timer_start.call(this, count);
		this._pausing = false;
	};

	Game_Timer.prototype.pause = function() {
		this._pausing = true;
	};

	Game_Timer.prototype.restart = function() {
		this._pausing = false;
	};

	const _Game_Timer_stop = Game_Timer.prototype.stop;
	Game_Timer.prototype.stop = function() {
		_Game_Timer_stop.call(this);
	};

	Game_Timer.prototype.add = function(count) {
		const lastFrames = this._frames;
		this._frames += count;
		this._frames = Math.max(0, this._frames);
		if (this._working && lastFrames > 0 && this._frames === 0) {
			this.onExpire();
		}
	};

	const _Game_Timer_update = Game_Timer.prototype.update;
	Game_Timer.prototype.update = function(sceneActive) {
		if (this._pausing) {
			return;
		} else if (this._countUp && sceneActive && this._working) {
			this._frames++;
		} else {
			_Game_Timer_update.call(this, sceneActive);
		}
	};

	if (!abortBattle) {
		Game_Timer.prototype.onExpire = function() {};
	}

	if (variableId) {
		let lastSec = 0;
		function setValue() {
			const sec = $gameTimer.seconds();
			if (sec !== lastSec) {
				$gameVariables.setValue(variableId, getValue(sec));
			}
			lastSec = sec;
		}

		function getValue(sec) {
			if (!mmss) {
				return sec;
			}
			const m = Math.floor(sec / 60);
			const s = sec % 60;
			return m * 100 + s;
		};

		const _Game_Timer_update = Game_Timer.prototype.update;
		Game_Timer.prototype.update = function(sceneActive) {
			_Game_Timer_update.call(this, sceneActive);
			if (sceneActive && this._working) {
				setValue();
			}
		};

		const _Game_Timer_start = Game_Timer.prototype.start;
		Game_Timer.prototype.start = function(count) {
			_Game_Timer_start.call(this, count);
			setValue();
		};

		const _Game_Timer_add = Game_Timer.prototype.add;
		Game_Timer.prototype.add = function(count) {
			_Game_Timer_add.call(this, count);
			setValue();
		};
	}

	//-----------------------------------------------------------------------------
	// Sprite_Timer

	const _Sprite_Timer_initialize = Sprite_Timer.prototype.initialize;
	Sprite_Timer.prototype.initialize = function() {
		_Sprite_Timer_initialize.call(this);
		this.redraw();
	};

	const _Sprite_Timer_updateVisibility = Sprite_Timer.prototype.updateVisibility;
	Sprite_Timer.prototype.updateVisibility = function() {
		_Sprite_Timer_updateVisibility.call(this);
		if ($gameTimer.isVisibleForcing()) {
			this.visible = $gameTimer.isVisible();
		}
	};

}