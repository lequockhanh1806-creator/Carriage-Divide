import Phaser from 'phaser';
import {supportedLanguage} from './i18n/index.js';
import './styles/main.css';
import {GAME_WIDTH,GAME_HEIGHT} from './config/constants.js';
import {GameState} from './systems/GameState.js';
import {SaveManager} from './systems/SaveManager.js';
import {AudioManager} from './systems/AudioManager.js';
import {UIManager} from './ui/UIManager.js';
import {MenuScene} from './scenes/MenuScene.js';
import {TrainScene} from './scenes/TrainScene.js';
const save=new SaveManager(),settings=save.getSettings(),state=new GameState(),audio=new AudioManager(settings);
const ctx={save,settings,state,audio,actions:{},game:null,ui:null,train:null};
settings.language=supportedLanguage(settings.language);ctx.ui=new UIManager(document.querySelector('#overlay-root'),ctx);
const game=new Phaser.Game({type:Phaser.AUTO,width:GAME_WIDTH,height:GAME_HEIGHT,parent:'phaser-root',backgroundColor:'#08111b',render:{antialias:true,pixelArt:false},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:GAME_WIDTH,height:GAME_HEIGHT},physics:{default:'arcade',arcade:{debug:false,gravity:{x:0,y:0}}},scene:[new MenuScene(ctx),new TrainScene(ctx)]});ctx.game=game;
ctx.actions={
 newGame(){ctx.state.reset();save.clear();game.scene.start('TrainScene',{newGame:true})},
 continueGame(){let loaded=save.load();if(!loaded){ctx.ui.notify(settings.language==='vi'?'Không tìm thấy bản lưu hợp lệ.':'No valid save was found.');return}ctx.state.restore(loaded);game.scene.start('TrainScene',{newGame:false})},
 loadGame(){let loaded=save.load();if(!loaded){ctx.ui.notify(settings.language==='vi'?'Không có bản lưu hợp lệ.':'No usable save data available.');return}ctx.state.restore(loaded);game.scene.start('TrainScene',{newGame:false})},
 restartChapter(){ctx.state.restartChapter();game.scene.start('TrainScene',{newGame:false});ctx.ui.notify(settings.language==='vi'?'Đã khởi động lại chương từ mốc lưu gần nhất.':'Chapter restarted from the latest checkpoint.')},
 toTitle(){save.save(ctx.state.data);game.scene.start('MenuScene')},
 fullscreen(){const stage=document.querySelector('#stage');if(document.fullscreenElement)document.exitFullscreen?.();else stage.requestFullscreen?.().catch(()=>ctx.ui.notify('Fullscreen is unavailable in this browser.'))}
};
window.addEventListener('beforeunload',()=>{if(ctx.train&&ctx.state.data.chapter&&!ctx.ui.mode.startsWith('menu'))save.save(ctx.state.data)});
