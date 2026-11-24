import {WORLD_WIDTH} from '../config/constants.js';
const rect=(g,x,y,w,h,c,a=1)=>{g.fillStyle(c,a);g.fillRect(x,y,w,h)};
const round=(g,x,y,w,h,r,c,a=1)=>{g.fillStyle(c,a);g.fillRoundedRect(x,y,w,h,r)};
function label(scene,x,y,text,color=0xa9c0c8,size=16){return scene.add.text(x,y,text,{fontFamily:'monospace',fontSize:`${size}px`,color:`#${color.toString(16).padStart(6,'0')}`,letterSpacing:2}).setOrigin(.5).setDepth(15)}
export function paintRoom(scene,room,index,state){
 const g=scene.add.graphics().setDepth(-5),l=scene.add.graphics().setDepth(1),f=scene.add.graphics().setDepth(3);
 const dark=0x0a131b,ink=0x0b1720;
 rect(g,0,0,WORLD_WIDTH,720,room.color);
 // Atmospheric overhead bands and riveted paneling.
 for(let i=0;i<28;i++){rect(g,0,i*17,WORLD_WIDTH,5,i%2?0x060b10:0x6b8390,i%2?.03:.016)}
 rect(g,0,0,WORLD_WIDTH,104,0x090f16,.8);rect(g,0,99,WORLD_WIDTH,8,0x657380,.45);
 rect(g,0,367,WORLD_WIDTH,13,0x070e14,.8);rect(g,0,380,WORLD_WIDTH,45,0x152730,.88);
 rect(g,0,426,WORLD_WIDTH,232,0x19242b,.96);rect(g,0,638,WORLD_WIDTH,82,0x0a1017,1);
 for(let y=445;y<640;y+=36){g.lineStyle(1,0x6e8891,.085);g.lineBetween(0,y,WORLD_WIDTH,y)}
 for(let x=30;x<WORLD_WIDTH;x+=79){g.lineStyle(1,0xa1b5b2,.10);g.lineBetween(x,426,x+30,638);rect(g,x,638,30,5,0x75818c,.19)}
 // Roof cables, piping and spotlight pools.
 for(let y of [142,167,345]){rect(g,0,y,WORLD_WIDTH,8,0x09141a,.6);g.lineStyle(2,room.accent,.3);g.lineBetween(0,y+1,WORLD_WIDTH,y+1)}
 for(let x=35;x<WORLD_WIDTH;x+=275){rect(g,x,0,9,417,0x090e15,.24);for(let y of [113,281,385]){g.fillStyle(0xd2cfc6,.25);g.fillCircle(x+5,y,2)}}
 // Snow windows with skyline/mountains. Drawn inside original graphic, fully self-contained.
 const windows=[230,738,1244];
 for(let j=0;j<3;j++){
  let x=windows[j];round(g,x,183,330,165,8,ink);rect(g,x+12,196,306,138,room.window);
  rect(g,x+14,197,302,60,0x8198a3,.09);
  g.fillStyle(0xc3d6e0,.13);g.fillPoints([{x:x+12,y:318},{x:x+104,y:257},{x:x+190,y:326},{x:x+275,y:265},{x:x+318,y:313},{x:x+318,y:336},{x:x+12,y:336}],true);
  for(let z=0;z<9;z++){let xx=x+19+(z*37+j*13)%285,yy=202+(z*29)%110;g.fillStyle(0xeef5f6,.5);g.fillCircle(xx,yy,1+(z%2))}
  rect(g,x+161,191,8,151,0x0a1921,.9);rect(g,x+7,270,317,5,0x07131c,.8);
  g.lineStyle(5,room.accent,.46);g.strokeRoundedRect(x+7,188,318,153,6);
  rect(g,x+10,337,316,8,0x040d12,.8);
 }
 // Hallway edge markers and reinforced sliding doors.
 for(let x of [17,1515]){round(g,x,214,66,420,4,0x0b161d);rect(g,x+9,240,46,365,0x3a515b,.6);rect(g,x+25,263,13,256,0x091118,.8);rect(g,x+15,535,36,16,room.accent,.65);g.lineStyle(3,room.accent,.5);g.strokeRect(x+3,217,59,397)}
 // Ceiling lights: more sterile/luxurious toward the council.
 for(let x of [380,790,1230]){round(g,x-90,100,180,16,4,0x090d13);round(g,x-73,107,146,8,3,room.light,.65);g.fillStyle(room.light,index===5?.12:.055);g.fillTriangle(x-90,114,x+90,114,x+130,420);g.fillTriangle(x-90,114,x+130,420,x-140,420)}
 const edge=room.accent;
 // Architectural visual language unique to the car, furniture around the traversable corridor.
 if(index===0){
  // Shelter: deliberately no table-like furniture; leave walkable space clear.
  for(let x of [282,1280]){round(l,x,402,50,39,4,0x514d46);rect(l,x+4,407,42,7,0x9a8b6d,.5)}
  // Frozen, sputtering pipe.
  rect(l,880,366,315,13,0x617784,.7);for(let x=896;x<1188;x+=42)rect(l,x,365,6,16,0xb8cccd,.38);
 }else if(index===1){
  for(let x of [178,623,1160]){round(l,x,359,230,78,5,0x283b44);for(let z=0;z<4;z++){rect(l,x+12+z*50,369,34,37,0x14212a);rect(l,x+19+z*50,377,19,4,z===3?0xd66e63:0x75a4a6,.8)}rect(l,x+8,432,212,8,edge,.4)}
  for(let i=0;i<8;i++){rect(l,0,213+i*15,80,7,0x64737a,.3)}
 }else if(index===2){
  for(let x of [210,1110]){round(l,x,364,285,67,7,0x54483e);round(l,x+17,371,251,31,3,0x8b735d);rect(l,x+40,431,9,41,0x2c2b2b);rect(l,x+233,431,9,41,0x2c2b2b);for(let z=0;z<4;z++)round(l,x+25+z*59,381,25,14,5,0xccc2aa,.8)}
  round(l,684,299,275,127,3,0x293a44);for(let z=0;z<8;z++){rect(l,698+(z%4)*59,310+Math.floor(z/4)*50,48,40,[0x9b8272,0x5e8b8b,0xc3a77c][z%3],.77)}
 }else if(index===3){
  for(let x of [180,650,1210]){round(l,x,381,258,48,4,0xc0d4d0,.7);rect(l,x+11,388,241,24,0xb4c8c6,.83);rect(l,x+19,428,9,46,0xa4b9b8);rect(l,x+227,428,9,46,0xa4b9b8);rect(l,x-6,370,69,18,0x528187,.75)}
  for(let z=0;z<6;z++){rect(l,390+z*95,146,7,23,0xa2dcd4,.24)}
 }else if(index===4){
  for(let x of [240,650,1100]){round(l,x,298,252,140,5,0x253b42);round(l,x+12,312,227,97,3,0x101e28);for(let z=0;z<5;z++){rect(l,x+24+z*42,331,29,11,z%2?0xf09c60:0x78b8b8,z%2?.55:.62);rect(l,x+24+z*42,354,29,42,0x284856,.7)}rect(l,x+12,418,227,13,edge,.35)}
  for(let x=120;x<1540;x+=110){rect(l,x,380,7,44,0xaeb6a3,.21)}
 }else{
  for(let x of [220,635,1150]){round(l,x,368,279,65,12,0x594b46);round(l,x+14,378,249,36,9,0x907468);round(l,x+18,415,240,14,4,0xbf9578);rect(l,x+19,430,14,34,0x68524a);rect(l,x+244,430,14,34,0x68524a)}
  for(let x of [480,970]){rect(l,x,290,14,105,0x7c7466);g.fillStyle(0x7f9f80,.74);g.fillCircle(x+7,279,31);g.fillCircle(x-14,297,22);g.fillCircle(x+26,295,24)}
  for(let x=150;x<1520;x+=115){g.fillStyle(0xd1ab73,.32);g.fillCircle(x,385,3)}
 }
 // Foreground outlines and vents.
 rect(f,0,661,WORLD_WIDTH,14,0x050b10,.88);for(let x=0;x<WORLD_WIDTH;x+=92)rect(f,x,657,54,4,0x71848b,.19);
 for(let x of [84,1500])label(scene,x+19,185,x<100?'←':'→',room.accent,21);
 scene.roomNameLabel=label(scene,800,47,room.name,room.accent,24);scene.roomSubtitleLabel=label(scene,800,80,room.subtitle,0xb8c1c8,11);
 return [g,l,f];
}
export function paintTrainMenu(scene){
 let g=scene.add.graphics();g.fillStyle(0x07111c);g.fillRect(0,0,1280,720);
 for(let i=0;i<8;i++){g.fillStyle(0x2a4453,.08+i*.006);g.fillCircle(800,570,420-i*24)}
 g.fillStyle(0x1e303e);g.fillPoints([{x:0,y:610},{x:155,y:395},{x:360,y:600},{x:540,y:420},{x:780,y:610},{x:900,y:450},{x:1280,y:605},{x:1280,y:720},{x:0,y:720}],true);
 g.fillStyle(0x1b2a36);g.fillPoints([{x:0,y:660},{x:210,y:490},{x:470,y:660},{x:690,y:510},{x:1000,y:680},{x:1280,y:500},{x:1280,y:720},{x:0,y:720}],true);
 // A distinct rail train profile, drawn procedurally rather than with third-party media.
 g.fillStyle(0x081018);g.fillRect(0,573,1280,16);g.fillStyle(0x94acb2,.21);g.fillRect(0,580,1280,3);
 g.fillStyle(0x151f2a);g.fillRoundedRect(425,409,950,164,18);g.fillStyle(0x2a3d49);g.fillRect(425,438,950,10);
 for(let x=464;x<1375;x+=142){g.fillStyle(0x9dadb5,.45);g.fillRoundedRect(x,447,111,75,5);g.fillStyle(0xf4bc82,.25);g.fillRoundedRect(x+7,454,96,58,3);g.fillStyle(0x0b1720);g.fillRect(x+53,450,5,65)}
 g.fillStyle(0x141f29);g.fillRect(450,548,900,22);for(let x=480;x<1340;x+=125){g.fillStyle(0x0a0f15);g.fillCircle(x,573,19);g.lineStyle(3,0x73838b,.55);g.strokeCircle(x,573,13)}
 g.fillStyle(0x94b8c5,.12);g.fillEllipse(1080,375,420,55);g.fillEllipse(800,390,200,22);
}
