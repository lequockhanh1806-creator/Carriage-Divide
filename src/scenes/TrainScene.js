import Phaser from 'phaser';
import {WORLD_WIDTH,GAME_HEIGHT} from '../config/constants.js';
import {compartments} from '../data/compartments.js';
import {characters} from '../data/characters.js';
import {eventById} from '../data/events.js';
import {Player} from '../entities/Player.js';
import {generateTextures} from '../entities/ActorArt.js';
import {paintRoom} from '../entities/RoomPainter.js';
import {canTrigger,chapterReady,canPrepareWarnings,hearResident,discussRaceAndClass,coverVolunteerShift} from '../systems/GameState.js';
import {getAmbientDialogue} from '../data/dialogues.js';
import {insightFor} from '../data/insights.js';
import {openingBeat,resultBeat,finalBriefing} from '../data/storyBeats.js';
import {knowledgeChecks,isKnowledgeAvailable,answerKnowledge} from '../data/knowledge.js';
import {evaluateEnding,fullTransformationRequirements} from '../systems/EndingEvaluator.js';
import {doorAccess,entryPosition,movementIsLocked} from '../systems/NavigationSystem.js';
import {localizedRoom,localizedEvent,localizedCharacter,localizedAmbient,localizedStat} from '../i18n/index.js';
const COLORS={white:'#dae7e9',muted:'#8cb5ba',amber:'#ebc58b'};
export class TrainScene extends Phaser.Scene{
 constructor(ctx){super({key:'TrainScene'});this.ctx=ctx}
 get lang(){return this.ctx.settings.language}
 room(i){return localizedRoom(i,compartments[i],this.lang)}
 event(event){return localizedEvent(event,this.lang)}
 localizeRoomText(){
  if(!this.scene?.isActive()||!this.roomNameLabel)return;
  const car=this.ctx.state.data.car,r=this.room(car);
  this.roomNameLabel.setText(r.name);this.roomSubtitleLabel.setText(r.subtitle);
  // Keep interaction prompts consistent when players switch languages inside a compartment.
  for(const target of this.targets||[]){
   if(target.type==='door')target.label=`${this.lang==='vi'?'CỬA':'DOOR'} · ${this.room(target.to).short.toUpperCase()}`;
   if(target.type==='npc')target.label=`${this.lang==='vi'?'NÓI CHUYỆN':'TALK'} · ${characters[target.id].name.toUpperCase()}`;
   if(target.type==='object')target.label=`${this.lang==='vi'?'KIỂM TRA':'EXAMINE'} · ${r.objects.find(o=>o.id===target.ref.id).label.toUpperCase()}`;
  }
 }
 init(data){this.newGame=Boolean(data?.newGame);this.transitioning=false;this.t=0;this.stepTick=0;this.promptTarget=null;this.snowTimer=0;this.ambientTimer=0;this.visitedOnce=false}
 create(){this.ctx.train=this;const s=this.ctx.state.data,room=this.room(s.car);this.physics.world.setBounds(0,390,WORLD_WIDTH,GAME_HEIGHT-390);this.cameras.main.setBounds(0,0,WORLD_WIDTH,GAME_HEIGHT);
  generateTextures(this,characters);paintRoom(this,room,s.car,s);this.drawConditionalDetails(s);this.createSnow(s.car);this.createAtmosphere(s.car);this.createObjects(room);this.createNPCs(s.car);
  this.player=new Player(this,s.player.x,s.player.y);this.cameras.main.startFollow(this.player.sprite,true,.08,.12,0,0);this.cameras.main.setZoom(1);this.player.sprite.setDepth(this.player.y+100);this.createSolidFurniture(s.car);this.ctx.audio.setCar(s.car);this.ctx.ui.clear();this.ctx.ui.drawHUD(true);
  this.interactKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);this.input.keyboard.on('keydown-E',()=>{if(!this.ctx.ui.locked)this.interact()});
  this.observationOnEntry(s.car);
  if(s.car===5&&s.chapter===4&&!s.flags.final_community_briefing){
   s.flags.final_community_briefing=true;
   this.ctx.save.save(s);
   this.time.delayedCall(450,()=>this.ctx.ui.showDialogue({speaker:'marcus',context:this.lang==='vi'?'TRƯỚC CỬA HỘI ĐỒNG / TIẾNG NÓI CỘNG ĐỒNG':'BEFORE THE COUNCIL / FROM THE COMMONS',lines:finalBriefing(s,this.lang)}));
  }
  if(s.finalEnding){this.time.delayedCall(200,()=>this.ctx.ui.showEnding(s.finalEnding));return}
  if(this.newGame){this.time.delayedCall(350,()=>this.showIntro())}else{this.ctx.ui.notify(`${room.name} — ${room.note}`)}
 }
 drawConditionalDetails(s){const g=this.add.graphics().setDepth(4);const c=s.car;if(c===0&&(s.flags.heating==='elite'||s.roomConditions[0].damage>80)){for(let i=0;i<8;i++){g.lineStyle(2,0xb2d7e6,.37);g.lineBetween(730+i*35,368,731+i*35,392);g.lineBetween(730+i*35,389,735+i*35,396)}}
  if(c===0&&s.flags.heating==='vulnerable'){g.fillStyle(0xf7a76e,.18);g.fillEllipse(960,429,350,64)}
  if(c===2&&s.flags.coalition){for(let x of [580,610,641,671]){g.fillStyle(0xe9ad80,.76);g.fillTriangle(x,284,x+12,301,x-4,306)}}
  if(c===4&&s.flags.report_released){for(let x of [580,605,630]){g.fillStyle(0xd8ba87,.68);g.fillRect(x,347,18,26)}}
  if(c===5){g.fillStyle(0xf3d5a2,.07);g.fillRect(0,120,WORLD_WIDTH,305)}
 }
 createSnow(car){this.snow=Array.from({length:54},(_,i)=>({x:220+(i*79)%1320,y:195+(i*29)%125,s:8+i%7*5}));this.snowG=this.add.graphics().setDepth(-1)}
 createAtmosphere(car){this.fx=this.add.graphics().setDepth(490);this.steam=Array.from({length:15},(_,i)=>({x:920+(i*31)%235,y:381+(i*11)%36,p:0.4+(i%5)*.11}));this.fxCar=car}
 drawAtmosphere(time,delta){const g=this.fx;if(!g)return;g.clear();const c=this.fxCar,reduce=this.ctx.settings.reducedMotion;
  let glow=reduce?.22:.16+.09*Math.sin(time/170)+(c===0&&Math.sin(time/44)>.9?-.15:0);
  g.fillStyle(c===5?0xffdca5:0xdeb68e,Math.max(.02,glow));for(let x of [380,790,1230])g.fillEllipse(x,123,140,28);
  if(c===0||c===1||c===4){g.fillStyle(0xb2dbe3,.20);for(let p of this.steam){if(!reduce){p.y-=delta*.01*p.p;p.x+=Math.sin(time/170+p.p*13)*.13;if(p.y<327)p.y=385}g.fillCircle(p.x,p.y,2+(385-p.y)*.07)}}
  if(c===4||this.ctx.state.data.stats.risk>68){const a=reduce?.65:(Math.sin(time/330)>0?.6:.12);g.fillStyle(0xe66561,a);for(let x of [355,1137])g.fillCircle(x,318,6)}
 }
 createObjects(room){this.targets=[];this.objects=[];room.objects.forEach((o,i)=>{
  const g=this.add.graphics().setDepth(420);g.lineStyle(2,room.accent,.77);g.strokeRoundedRect(o.x-13,o.y-18,26,27,3);g.fillStyle(room.accent,.15);g.fillRoundedRect(o.x-13,o.y-18,26,27,3);g.fillStyle(room.accent);g.fillCircle(o.x,o.y-5,3);this.add.text(o.x,o.y-31,'◇',{fontFamily:'monospace',fontSize:'17px',color:'#ecc791'}).setOrigin(.5).setDepth(425);
  this.targets.push({type:'object',x:o.x,y:o.y,ref:o,label:`${this.lang==='vi'?'KIỂM TRA':'EXAMINE'} · ${o.label.toUpperCase()}`});this.objects.push(g);
 });
  if(room.id!=='shelter')this.targets.push({type:'door',x:95,y:545,to:this.ctx.state.data.car-1,label:`${this.lang==='vi'?'CỬA':'DOOR'} · ${this.room(this.ctx.state.data.car-1)?.short.toUpperCase()}`});
  if(this.ctx.state.data.car<5)this.targets.push({type:'door',x:1510,y:545,to:this.ctx.state.data.car+1,label:`${this.lang==='vi'?'CỬA':'DOOR'} · ${this.room(this.ctx.state.data.car+1)?.short.toUpperCase()}`});
 }
 createNPCs(car){this.npcs=[];for(const [id,c] of Object.entries(characters)){if(c.car!==car)continue;let npc=this.physics.add.sprite(c.x,c.y,`npc_${id}`);npc.setImmovable(true);npc.body.setSize(24,22).setOffset(16,49);npc.body.setAllowGravity(false);npc.setDepth(c.y+99);const name=this.add.text(c.x,c.y-60,c.name,{fontFamily:'Arial, sans-serif',fontSize:'13px',fontStyle:'bold',color:COLORS.white,backgroundColor:'#101b23cc',padding:{x:9,y:5}}).setOrigin(.5).setDepth(600);this.npcs.push({id,npc,name,baseY:c.y});this.targets.push({type:'npc',id,x:c.x,y:c.y,label:`${this.lang==='vi'?'NÓI CHUYỆN':'TALK'} · ${c.name.toUpperCase()}`})}}
 createSolidFurniture(car){this.solids=[];
  // Static blockers correspond to furnishings in the top edge of each car.
  const layouts=[[],[[178,365,230,74],[623,365,230,74],[1160,365,230,74]],[[210,368,285,68],[1110,368,285,68]],[[180,380,258,63],[650,380,258,63],[1210,380,258,63]],[[240,300,252,139],[650,300,252,139],[1100,300,252,139]],[[220,369,279,68],[635,369,279,68],[1150,369,279,68]]];
  for(let [x,y,w,h] of layouts[car]){const r=this.add.rectangle(x+w/2,y+h/2,w,h,0xffffff,0).setVisible(false);this.physics.add.existing(r,true);this.physics.add.collider(this.player.sprite,r);this.solids.push(r)}
  for(let item of this.npcs)this.physics.add.collider(this.player.sprite,item.npc);
 }
 observationOnEntry(car){const s=this.ctx.state.data;if(!s.visitedCars.includes(car)){s.visitedCars.push(car);this.ctx.state.observe(`entered_car_${car}`,this.room(car).note);this.ctx.save.save(s)}}
 nearest(){const p=this.player;let best=null,d=120;for(let t of this.targets){let dist=Math.hypot((t.type==='door'?t.x:t.x)-p.x,(t.type==='door'?545:t.y)-p.y);if(dist<d){d=dist;best=t}}return best}
 refreshPrompt(){if(!this.player||this.ctx.ui.locked||this.transitioning){this.ctx.ui.showInteraction(null);return}this.promptTarget=this.nearest();this.ctx.ui.showInteraction(this.promptTarget?.label||null)}
 interact(){if(this.transitioning||this.ctx.ui.locked)return;const t=this.nearest();if(!t)return;this.player.resetMotion();this.ctx.audio.unlock();this.ctx.audio.play('interact');if(t.type==='door')this.goToCar(t.to);if(t.type==='npc')this.talk(t.id);if(t.type==='object')this.inspect(t.ref)}
 goToCar(target){const s=this.ctx.state.data;const permission=doorAccess(s.car,target,s.chapter);if(!permission.allowed&&target!==5)return;if(!permission.allowed){this.ctx.ui.showDialogue({speaker:'vale',context:this.lang==='vi'?'CHƯA ĐƯỢC VÀO':'RESTRICTED ACCESS',lines:this.lang==='vi'?['Cửa hội đồng bị khóa cho đến phiên điều trần cuối. Nhân viên bảo vệ yêu cầu bạn quay lại khoang máy.','“Đơn kiến nghị sẽ được xem xét sau khi đội hạ tầng và đại hội công nhân trình báo cáo.”']:['The council door is sealed until the final hearing. A guard directs you back toward the engine.','“Your petition will be heard after the infrastructure and workers’ assemblies have reported.”']});return}
  this.transitioning=true;this.ctx.audio.play('door');const prior=s.car;s.car=target;
  s.player=entryPosition(prior,target);
  const doorX=target>prior?1520:82;const slab=this.add.rectangle(doorX,435,48,358,0x233945,.94).setDepth(10000).setAlpha(.12);
  this.tweens.add({targets:slab,alpha:.9,x:doorX+(target>prior?-25:25),duration:this.ctx.settings.reducedMotion?1:215,ease:'Sine.easeOut'});
  this.ctx.save.save(s);this.cameras.main.fadeOut(220,0,0,0);this.cameras.main.once('camerafadeoutcomplete',()=>this.scene.restart({newGame:false}));
 }
 talk(id){const s=this.ctx.state.data;
  // Personal accounts are separate from scholarly lectures. These follow-ups matter later.
  if(id==='ada'&&!s.flags.ada_testimony){
   hearResident(s);this.ctx.save.save(s);
   this.ctx.ui.showDialogue({speaker:'ada',context:this.lang==='vi'?'NGƯỜI BỊ BỎ SÓT':'PEOPLE THE LIST MISSED',lines:this.lang==='vi'?[
    'Ada: “Tôi ghi lại ngày mấy nhà bắt đầu bị ho. Hồ sơ phòng khám thiếu mấy người đó.”',
    '“Họ không đi khám được, đâu có nghĩa là họ không bị bệnh. Giữ tờ ghi chép này nhé.”'
   ]:[
    'Ada: “I wrote down when those families started coughing. Some of them aren’t even in the clinic records.”',
    '“They couldn’t get to a doctor. That doesn’t mean they were fine. Keep this list, okay?”'
   ]});return;
  }
  if(id==='marcus'&&!s.flags.race_class_heard){
   discussRaceAndClass(s);this.ctx.save.save(s);
   this.ctx.ui.showDialogue({speaker:'marcus',context:this.lang==='vi'?'CÙNG CẢNH NGỘ, KHÁC CÁCH ĐỐI XỬ':'SAME TICKET, DIFFERENT TREATMENT',lines:this.lang==='vi'?[
    'Marcus: “Ben với tôi cùng hạng vé. Cùng phòng lạnh luôn. Vậy mà hôm qua bảo vệ chỉ chặn tôi.”',
    '“Ben là người da trắng. Cậu ấy đi qua được. Tiền vé giống nhau, nhưng họ đâu đối xử như nhau.”'
   ]:[
    'Marcus: “Ben and I pay the same ticket price. Same cold room, too. Yesterday a guard stopped only me.”',
    '“Ben is white. He walked through. We have the same class of ticket. We don’t always get treated the same.”'
   ]});return;
  }
  if(id==='sol'&&s.flags.warning_plan===1&&!s.flags.volunteer_cover&&!s.flags.warning_locked){
   coverVolunteerShift(s);this.ctx.save.save(s);this.ctx.ui.drawHUD(true);
   this.ctx.ui.showDialogue({speaker:'sol',context:this.lang==='vi'?'CA BẾP ĐƯỢC THAY':'KITCHEN SHIFT COVERED',lines:this.lang==='vi'?[
    'Sol: “Linh phải bỏ ca để dịch cảnh báo à? Được, tôi đổi người làm thay.”',
    '“Mất thêm chút đồ ăn dự trữ đấy. Nhưng đâu thể bắt người ta làm hai việc một lúc.”'
   ]:[
    'Sol: “Linh has to miss kitchen duty to translate? Okay. I’ll cover her shift.”',
    '“It costs another supply point. But we can’t ask someone to work two shifts at once.”'
   ]});return;
  }
  const quizId=id==='linh'?'ignored_repairs':id==='elena'?'shared_evidence':null;
  // Give a mandatory story event priority. On later visits, discovered facts become a conversation.
  const requiredActive=Object.values(eventById).some(e=>e.actor===id&&e.car===s.car&&canTrigger(s,e.id)&&e.id!=='report');
  if(id==='linh'&&!requiredActive&&canPrepareWarnings(s)&&isKnowledgeAvailable(s,'warning_readback')){
   this.ctx.ui.showQuiz('warning_readback',()=>{
    const result=answerKnowledge(s,'warning_readback',knowledgeChecks.warning_readback.correct);
    if(result.correct){this.ctx.save.save(s);this.ctx.ui.drawHUD(true);this.ctx.ui.showDialogue({speaker:'linh',context:this.lang==='vi'?'CẢNH BÁO SẴN SÀNG':'WARNINGS READY',lines:[this.lang==='vi'?knowledgeChecks.warning_readback.viSuccess:knowledgeChecks.warning_readback.success]});}
   });return;
  }
  if(!requiredActive&&quizId&&isKnowledgeAvailable(s,quizId)){
   this.ctx.ui.showQuiz(quizId,()=>{
    const result=answerKnowledge(s,quizId,knowledgeChecks[quizId].correct);
    if(result.correct){this.ctx.save.save(s);this.ctx.ui.drawHUD(true);this.ctx.ui.showDialogue({speaker:id,context:this.lang==='vi'?'ĐÃ KẾT NỐI MANH MỐI':'EVIDENCE SHARED',lines:[this.lang==='vi'?knowledgeChecks[quizId].viSuccess:knowledgeChecks[quizId].success]});}
   });return;
  }
  let match=Object.values(eventById).find(e=>e.actor===id&&e.car===s.car&&canTrigger(s,e.id)&&!(e.id==='report'));
  if(match){this.startEvent(match);return}
  if(id==='marcus'&&s.car===2&&s.chapter===4){this.ctx.ui.showDialogue({speaker:'marcus',context:this.lang==='vi'?'HỌP LẦN CUỐI':'ONE MORE COMMUNITY MEETING',lines:finalBriefing(s,this.lang)});s.flags.final_community_briefing=true;this.ctx.save.save(s);return}
  if(id==='daniel'&&s.car===1&&s.chapter===3){this.ctx.ui.showDialogue({speaker:id,lines:this.lang==='vi'?['Tôi đã giữ lại khóa truy cập chẩn đoán cũ. Toàn bộ hồ sơ ở Phòng điều khiển, sau tấm bảng ghi ARCHIVE.','Hãy tìm nó trước cuộc họp hội đồng. Lý thuyết thì dễ bác bỏ, nhưng chữ ký trên báo cáo thì không.']:['I saved the old diagnostic access key. The full record is kept in Engine Control, behind a panel marked ARCHIVE.','Find it before the council meeting. A theory is easy to dismiss. The signature on a report is not.']});return}
  this.ctx.ui.showDialogue({speaker:id,lines:localizedAmbient(id,s,this.lang,getAmbientDialogue),context:localizedCharacter(id,characters[id],this.lang).role.toUpperCase()});s.dialogueFlags[id]=(s.dialogueFlags[id]||0)+1;this.ctx.save.save(s)
 }
 inspect(o){const s=this.ctx.state.data,first=this.ctx.state.inspect(o.evidence,`${o.label}: ${o.description}`);
  if(first)this.ctx.ui.notify(`${this.lang==='vi'?'BẰNG CHỨNG MỚI':'NEW EVIDENCE'} · ${o.label.toUpperCase()}`);
  if(o.evidence==='language'&&!s.flags.warning_locked){
   s.flags.warning_notice_checked=true;
   if(s.flags.warning_plan!==null&&s.flags.warning_plan!==2&&!s.flags.warning_ready)
    this.ctx.ui.notify(this.lang==='vi'?'ĐÃ KIỂM TRA THÔNG BÁO · GIỜ TÌM LINH Ở KHOANG CỘNG ĐỒNG':'NOTICE CHECKED · FIND LINH IN COMMUNITY COMMONS');
  }
  if(o.event&&canTrigger(s,o.event)){this.startEvent(eventById[o.event]);return}
  const finding=insightFor(o.evidence,this.lang);
  if(finding){this.ctx.ui.showInsight(o.evidence,'game');}
  else this.ctx.ui.showDialogue({speaker:'narrator',context:this.lang==='vi'?'BẰNG CHỨNG MÔI TRƯỜNG':'ENVIRONMENTAL EVIDENCE',lines:[o.description,first?(this.lang==='vi'?'Đã lưu bằng chứng vào nhật ký. Nhấn J để xem.':'Evidence copied into your journal. Press J to review it.'):(this.lang==='vi'?'Bạn đã ghi nhận quan sát này.':'You have already documented this observation.')]});
  this.ctx.save.save(s)
 }
 startEvent(event){this.player.resetMotion();const s=this.ctx.state.data;
  const view=this.event(event);const lines=[...openingBeat(event.id,s,this.lang),...view.lines];
  if(event.id==='vote'){
   const missing=fullTransformationRequirements(s).filter(x=>!x.ok);
   if(missing.length)lines.unshift(this.lang==='vi'?'Cộng đồng vẫn thiếu chuẩn bị ở vài việc. Chia sẻ quyền điều hành lúc này có thể gặp khó.':'The community is missing some preparation. Shared control may be harder to hold together.');
   else lines.unshift(this.lang==='vi'?'Mọi người đã chuẩn bị bằng chứng và đại biểu. Nhưng ngày mai vẫn phải sửa máy.':'The delegates brought records and a plan. They will still have to fix the engine tomorrow.');

   if(s.flags.repair_story_shared)lines.unshift(this.lang==='vi'?'Linh đã dán toàn bộ lịch hoãn sửa lên bảng. Giờ mọi người trong phòng đều biết đây không phải sự cố bất ngờ.':'Linh put the repair dates on every board. Nobody in this room can call it a surprise anymore.');
   if(s.flags.public_science)lines.unshift(this.lang==='vi'?'Elena đã gửi cả hai mẫu nước kèm ghi chú về điều chưa chắc chắn.':'Elena brought both water readings, with the uncertainties written beside them.');
  }
  this.ctx.ui.showDialogue({speaker:event.actor,lines,context:view.tag,onDone:()=>this.ctx.ui.showDecision(event,index=>this.commitEvent(event,index))});
 }
 commitEvent(event,index){const before={...this.ctx.state.data.stats};const result=this.ctx.state.decide(event.id,index);if(!result.applied){this.ctx.ui.notify(this.lang==='vi'?'Quyết định này không còn khả dụng.':'This decision is no longer available.','danger');this.ctx.ui.clear();return}
  this.ctx.audio.play('choice');this.ctx.ui.drawHUD(true);this.ctx.ui.changeFlash(before);this.ctx.save.save(this.ctx.state.data);
  const delta=Object.entries(result.choice.effects).filter(([,v])=>v!==0).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,2).map(([k,v])=>`${localizedStat(k,this.lang,k)} ${v>0?'+':''}${v}`).join(' · ');
  this.ctx.ui.notify(`${this.lang==='vi'?'ĐÃ GHI QUYẾT ĐỊNH':'DECISION RECORDED'} · ${delta}`);
  if(event.id==='announcement'&&index!==2){this.ctx.state.data.flags.warning_setup_pending=true;}
  if(event.id==='water'&&this.ctx.state.data.flags.water_warning_timing==='withheld')
   this.ctx.state.data.flags.translation_cannot_help_withheld=true;
  this.ctx.ui.showDialogue({speaker:event.actor,lines:[...this.event(event).choices[index].response,...resultBeat(event.id,index,this.ctx.state.data,this.lang)],context:this.lang==='vi'?'HỆ QUẢ / ĐÃ GHI':'CONSEQUENCE / RECORDED',onDone:()=>{
   if(event.id==='vote'){
    // The final briefing was shown in startEvent; resolve directly from recorded state.
    const key=evaluateEnding(this.ctx.state.data);
    this.ctx.state.data.finalEnding=key;
    this.ctx.save.save(this.ctx.state.data);
    this.ctx.ui.showEnding(key);
    return;
   }
   if(chapterReady(this.ctx.state.data)){this.ctx.state.nextChapter();this.ctx.save.save(this.ctx.state.data);this.ctx.ui.showChapter(this.ctx.state.data.chapter,()=>{this.ctx.ui.notify(this.lang==='vi'?'Đã mở hội thoại và quyết định mới.':'New conversations and decisions are now available.');this.ctx.ui.drawHUD(true);this.refreshPrompt()})}
   else{this.ctx.ui.drawHUD(true);this.refreshPrompt()}
  }});
 }
 showIntro(){const vi=this.lang==='vi';this.ctx.ui.showDialogue({speaker:'mai',context:vi?'MỞ ĐẦU / KHOANG TRÚ ẨN':'PROLOGUE / REAR SHELTER',lines:vi?[
  'Mai: “Hồi trước nhà mình ở gần con kênh. Ban đầu chỉ là mùi lạ. Rồi nước không dùng được nữa.”',
  '“Nhà máy cứ nói không sao. Vài năm sau, cả xóm phải chuyển đi. Không phải tai nạn bất ngờ đâu.”',
  '“Bạn được cử tạm để giúp các khoang đưa ra quyết định. Nhưng đừng nói thay mọi người khi chưa nghe họ nhé.”',
  'WASD để đi · Shift chạy · E nói chuyện/kiểm tra · J xem nhật ký · M xem bản đồ.'
 ]:[
  'Mai: “We used to live by a canal. First it was a strange smell. Then we couldn’t use the water.”',
  '“The factory kept saying it was fine. A few years later, our block had to leave. It wasn’t one sudden accident.”',
  '“You’ve been asked to help the cars make decisions for now. Just listen to people before you speak for them, okay?”',
  'WASD to move · Shift to run · E to talk or inspect · J for journal · M for map.'
 ],onDone:()=>this.ctx.ui.notify(vi?'NHIỆM VỤ ĐẦU · NÓI CHUYỆN VỚI MAI':'FIRST TASK · TALK TO MAI')})}
 drawSnow(delta){if(this.ctx.settings.reducedMotion||!this.snowG)return;const g=this.snowG;g.clear();g.fillStyle(0xe3f2f5,.55);for(let p of this.snow){p.x-=delta*.014;p.y+=delta*.012*(p.s/18);if(p.y>330)p.y=198;if(p.x<230)p.x=1540;const within=[230,738,1244].some(x=>p.x>x+12&&p.x<x+318);if(within)g.fillCircle(p.x,p.y,1.2)}}
 update(time,delta){if(!this.player)return;let locked=movementIsLocked(this.ctx.ui.mode,this.transitioning);this.player.update(delta,locked);if(!locked&&this.player.walking)this.ctx.audio.footsteps(time);
  if(!locked){this.t+=delta;this.stepTick+=delta;if(this.stepTick>220){this.stepTick=0;this.refreshPrompt()}const s=this.ctx.state.data;s.player.x=this.player.x;s.player.y=this.player.y}
  this.drawSnow(delta);this.drawAtmosphere(time,delta);if(!this.ctx.settings.reducedMotion){for(let item of this.npcs){item.npc.y=item.baseY+Math.sin(time/660+item.baseY)*1.2;item.npc.setDepth(item.npc.y+98)}}
 }
}
