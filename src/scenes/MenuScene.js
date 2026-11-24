import Phaser from 'phaser';
import {paintTrainMenu} from '../entities/RoomPainter.js';
export class MenuScene extends Phaser.Scene{
 constructor(ctx){super({key:'MenuScene'});this.ctx=ctx}
 create(){this.ctx.train=null;paintTrainMenu(this);this.snow=Array.from({length:110},(_,i)=>({x:(i*173)%1280,y:(i*89)%720,r:i%5===0?2:1,s:12+i%7*9}));this.snowG=this.add.graphics();this.ctx.ui.showMenu();this.ctx.audio.setCar(0)}
 update(_,dt){if(this.ctx.settings.reducedMotion)return;let g=this.snowG;g.clear();g.fillStyle(0xd8ecf7,.54);for(let p of this.snow){p.x-=dt*.015;p.y+=dt*.001*p.s;if(p.x<0)p.x=1280;if(p.y>720)p.y=0;g.fillCircle(p.x,p.y,p.r)}}
}
