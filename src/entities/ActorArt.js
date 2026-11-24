export function actorTexture(scene,key,skin,coat,{hair=0x141a22,phase=0,accent=0xdbc49f}={}){
 if(scene.textures.exists(key))return key;
 let g=scene.make.graphics({x:0,y:0});
 const boots=0x101b25,outline=0x091018;
 const step=phase?6:0;
 g.fillStyle(0x050b13,.32);g.fillEllipse(27,72,37,9);
 g.fillStyle(boots);g.fillRoundedRect(14+step,55,13,19,4);g.fillRoundedRect(30-step,55,13,19,4);
 g.fillStyle(outline);g.fillRoundedRect(11,26,34,37,8);
 g.fillStyle(coat);g.fillRoundedRect(14,29,28,31,6);
 g.fillStyle(accent);g.fillRect(25,31,4,26);
 g.fillStyle(outline);g.fillRoundedRect(4,33+step/2,11,26,5);g.fillRoundedRect(41,33-step/2,11,26,5);
 g.fillStyle(coat);g.fillRoundedRect(6,34+step/2,8,22,3);g.fillRoundedRect(42,34-step/2,8,22,3);
 g.fillStyle(skin);g.fillCircle(28,18,15);g.fillRect(23,25,9,7);
 g.fillStyle(hair);g.fillEllipse(28,10,31,15);g.fillRect(13,11,5,10);g.fillRect(40,11,4,8);
 g.fillStyle(0x18202a);g.fillCircle(22,20,1.4);g.fillCircle(34,20,1.4);
 g.fillStyle(0x6d4640);g.fillRect(26,25,4,1);
 g.lineStyle(1,0xffffff,.17);g.strokeRoundedRect(14,30,28,30,6);
 g.generateTexture(key,56,78);g.destroy();return key;
}
export function generateTextures(scene,characters){
 for(const [id,c] of Object.entries(characters)){actorTexture(scene,`npc_${id}`,c.color,c.coat,{hair:id==='elena'?0x302733:0x17212b,accent:id==='elena'?0x86afb1:0xdfb485})}
 actorTexture(scene,'player_idle',0xe6b48d,0xb8785c,{hair:0x1b2632,accent:0xedd39a});
 actorTexture(scene,'player_walk_a',0xe6b48d,0xb8785c,{hair:0x1b2632,accent:0xedd39a,phase:0});
 actorTexture(scene,'player_walk_b',0xe6b48d,0xb8785c,{hair:0x1b2632,accent:0xedd39a,phase:1});
}
