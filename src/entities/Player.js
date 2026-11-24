import Phaser from 'phaser';
import {FLOOR_TOP,FLOOR_BOTTOM,WORLD_WIDTH} from '../config/constants.js';
import {normalizedDirection} from '../systems/NavigationSystem.js';
export class Player{
 constructor(scene,x,y){this.scene=scene;this.sprite=scene.physics.add.sprite(x,y,'player_idle');this.sprite.body.setSize(25,26).setOffset(16,49);this.sprite.setCollideWorldBounds(true);this.sprite.setDepth(y+100);this.sprite.setDrag(1100);this.sprite.setMaxVelocity(265);this.speed=188;this.fastSpeed=276;this.facing='right';this.t=0;this.walking=false;this.cursors=scene.input.keyboard.addKeys({up:'W',down:'S',left:'A',right:'D',sprint:'SHIFT'});this.sprite.body.setBoundsRectangle(new Phaser.Geom.Rectangle(74,FLOOR_TOP,WORLD_WIDTH-148,FLOOR_BOTTOM-FLOOR_TOP+28));}
 update(delta,locked=false){const b=this.sprite.body;if(locked){b.setVelocity(0,0);b.setAcceleration(0,0);this.walking=false;this.sprite.setTexture('player_idle');return}
 let x=Number(this.cursors.right.isDown)-Number(this.cursors.left.isDown),y=Number(this.cursors.down.isDown)-Number(this.cursors.up.isDown);const mag=Math.hypot(x,y);if(mag){({x,y}=normalizedDirection(x,y));const speed=this.cursors.sprint.isDown?this.fastSpeed:this.speed;b.setAcceleration(x*2100,y*2100);b.setMaxVelocity(speed);this.walking=true;if(x!==0)this.facing=x<0?'left':'right';this.t+=delta;if(this.t>=195){this.t=0;this.sprite.setTexture(this.sprite.texture.key==='player_walk_a'?'player_walk_b':'player_walk_a')}}else{b.setAcceleration(0,0);b.setVelocity(b.velocity.x*.76,b.velocity.y*.76);this.walking=false;this.sprite.setTexture('player_idle')}
 this.sprite.setFlipX(this.facing==='left');this.sprite.setDepth(this.sprite.y+100);
 }
 resetMotion(){this.sprite.setVelocity(0,0).setAcceleration(0,0);this.walking=false;for(let k of Object.values(this.cursors))k.reset?.()}
 get x(){return this.sprite.x}get y(){return this.sprite.y}
 teleport(x,y){this.sprite.setPosition(x,y);this.resetMotion()}
}
