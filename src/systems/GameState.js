import { chapterEvents, eventById } from '../data/events.js';
import { compartments } from '../data/compartments.js';
import { characters } from '../data/characters.js';

// New slot and schema. A previously saved 1.0 game is IMPORTABLE; the original save is never overwritten.
export const SAVE_VERSION = 4;
export const clamp = v => Math.max(0,Math.min(100,Math.round(v)));
export const deepCopy = value => JSON.parse(JSON.stringify(value));
const START={food:64,heat:56,medical:48,water:70,trust:42,safety:57,tension:48,legitimacy:38,risk:55,inequality:76};
export function initialState(){
 return {version:SAVE_VERSION,chapter:1,car:0,player:{x:275,y:545},stats:{...START},initialStats:{...START},
  flags:{warning_plan:null,warning_ready:false,warning_notice_checked:false,warning_locked:false,volunteer_cover:false},
  relationships:Object.fromEntries(Object.keys(characters).map(k=>[k,0])),dialogueFlags:{},decisions:[],evidence:[],
  observations:[],completedObjectives:[],history:[],visitedCars:[0],
  roomConditions:Object.fromEntries(compartments.map((c,i)=>[i,{damage:i===0?72:15,access:i===5?95:32}])),
  finalEnding:null,chapterEntry:null,createdAt:new Date().toISOString()};
}
export function canTrigger(state,eventId){
 const event=eventById[eventId];return Boolean(event&&state.chapter===event.chapter&&
  !state.decisions.some(d=>d.eventId===eventId)&&(!event.requiresEvidence||state.evidence.includes(event.requiresEvidence)));
}
export function chapterReady(state){return chapterEvents(state.chapter).every(e=>state.decisions.some(d=>d.eventId===e.id));}
export function canPrepareWarnings(s){return Boolean(s.decisions.some(d=>d.eventId==='announcement')&&
  s.flags.warning_plan!==null&&s.flags.warning_plan!==2&&!s.flags.warning_ready&&!s.flags.warning_locked&&s.flags.warning_notice_checked);}
export function warningProgress(s){
 const chosen=s.decisions.some(d=>d.eventId==='announcement');const plan=s.flags.warning_plan;
 return {chosen,plan,notice:!!s.flags.warning_notice_checked,ready:!!s.flags.warning_ready,
  closed:!!s.flags.warning_locked,canTest:canPrepareWarnings(s),coverage:!!s.flags.volunteer_cover};
}
export function prepareWarnings(s){
 if(!canPrepareWarnings(s))return false;
 s.flags.warning_ready=true;s.flags.translation=true;
 s.stats.trust=clamp(s.stats.trust+3);
 s.history.push({kind:'conversation',text:'Linh and the player finished checking the multilingual alert. The warning plan is ready.'});
 return true;
}
export function hearResident(s){
 if(s.flags.ada_testimony)return false;
 s.flags.ada_testimony=true;s.stats.trust=clamp(s.stats.trust+2);
 s.history.push({kind:'conversation',text:'Ada shared dated accounts from families missing from clinic records.'});return true;
}
export function discussRaceAndClass(s){
 if(s.flags.race_class_heard)return false;
 s.flags.race_class_heard=true;
 s.history.push({kind:'conversation',text:'Marcus explained how he and Ben face the same ticket hardship but are treated differently by security.'});return true;
}
export function coverVolunteerShift(s){
 if(s.flags.volunteer_cover||s.flags.warning_plan!==1||s.flags.warning_locked)return false;
 s.flags.volunteer_cover=true;
 s.stats.food=clamp(s.stats.food-1);
 s.stats.trust=clamp(s.stats.trust+2);
 s.history.push({kind:'conversation',text:'Sol covered the volunteer interpreters’ missed kitchen shift using shared supplies.'});return true;
}
export function applyDecision(state,eventId,choiceIndex){
 if(!canTrigger(state,eventId))return {applied:false,reason:'Event already completed, locked, or missing evidence.'};
 const event=eventById[eventId],choice=event.choices[choiceIndex];if(!choice)return {applied:false,reason:'Invalid choice.'};
 const before={...state.stats};
 for(const [key,value] of Object.entries(choice.effects)){if(!(key in state.stats))throw Error(`Unknown stat: ${key}`);state.stats[key]=clamp(state.stats[key]+value)}
 Object.assign(state.flags,choice.flags||{});
 if(eventId==='announcement'){
  state.flags.warning_plan=choiceIndex;
  state.flags.warning_ready=false;
  state.flags.warning_locked=false;
  state.flags.translation=false; // Choosing a policy is NOT the same as installing it.
  state.flags.official_translation=false;
  state.flags.volunteer_translation=false;
 }
 let warningEffects={};
 if(eventId==='water'){
  state.flags.warning_locked=true;
  let timing='late';
  if(choiceIndex===2){timing='withheld';warningEffects={safety:-5,trust:-3,risk:5};}
  else if(state.flags.warning_ready&&state.flags.warning_plan===0){timing='direct';warningEffects={safety:5,trust:3,risk:-3};}
  else if(state.flags.warning_ready&&state.flags.warning_plan===1){timing='relay';warningEffects=state.flags.volunteer_cover?{safety:2,trust:2,risk:0}:{safety:-2,trust:1,risk:2};}
  else if(state.flags.warning_plan===0||state.flags.warning_plan===1){timing='unfinished';warningEffects={safety:-6,trust:-5,risk:5};}
  else {warningEffects={safety:-6,trust:-4,risk:5};}
  state.flags.water_warning_timing=timing;
  for(const [key,value] of Object.entries(warningEffects))state.stats[key]=clamp(state.stats[key]+value);
 }
 for(const [id,delta] of Object.entries(choice.relations||{}))state.relationships[id]=clamp((state.relationships[id]??0)+delta+50)-50;
 const effectiveEffects={...choice.effects,...Object.fromEntries(Object.entries(warningEffects).map(([k,v])=>[k,(choice.effects[k]||0)+v]))};
 state.decisions.push({eventId,choice:choiceIndex,title:event.title,option:choice.text,chapter:event.chapter,effects:effectiveEffects,before,after:{...state.stats},benefit:choice.benefit});
 state.completedObjectives.push(eventId);state.history.push({kind:'decision',text:`${event.title}: ${choice.text}`});
 if(eventId==='heat')state.roomConditions[0].damage=clamp(state.roomConditions[0].damage+(choiceIndex===2?17:-12));
 if(eventId==='water')state.roomConditions[0].damage=clamp(state.roomConditions[0].damage+(choiceIndex===2?14:-8));
 if(eventId==='report'&&choiceIndex===0)state.roomConditions[4].access=clamp(state.roomConditions[4].access+30);
 return {applied:true,event,choice:{...choice,effects:effectiveEffects},before,after:{...state.stats}};
}
export function advanceChapter(state){if(state.chapter>=4||!chapterReady(state))return false;state.chapter+=1;state.history.push({kind:'chapter',text:`Chapter ${state.chapter} begins`});return true;}
export function discover(state,id,text){if(state.evidence.includes(id))return false;state.evidence.push(id);state.history.push({kind:'evidence',text});return true;}
export function observe(state,id,text){if(state.observations.includes(id))return false;state.observations.push(id);state.history.push({kind:'observation',text});return true;}
export function serialize(state){return JSON.stringify({saveVersion:SAVE_VERSION,state:deepCopy(state),savedAt:new Date().toISOString()});}
function validateAndNormalize(p,allowLegacy=false){
 if(!p||!p.state||!([SAVE_VERSION,...(allowLegacy?[3]:[])].includes(p.saveVersion)))return null;
 const s=p.state;
 if(!Number.isInteger(s.chapter)||s.chapter<1||s.chapter>4||!Number.isInteger(s.car)||s.car<0||s.car>5||!Array.isArray(s.decisions)||!Array.isArray(s.evidence)||!Array.isArray(s.history)||!s.stats||!s.flags||!s.player)return null;
 const blank=initialState();
 for(const k of Object.keys(blank.stats)){if(!Number.isFinite(s.stats[k]))return null;s.stats[k]=clamp(s.stats[k])}
 if(!s.decisions.every(d=>eventById[d.eventId]&&Number.isInteger(d.choice)&&d.choice>=0&&d.choice<eventById[d.eventId].choices.length)||new Set(s.decisions.map(d=>d.eventId)).size!==s.decisions.length)return null;
 s.player={x:Number.isFinite(s.player.x)?Math.max(100,Math.min(1500,s.player.x)):275,y:Number.isFinite(s.player.y)?Math.max(434,Math.min(620,s.player.y)):545};
 s.flags={...blank.flags,...s.flags};
 if(s.decisions.some(d=>d.eventId==='announcement')&&s.flags.warning_plan===null)s.flags.warning_plan=s.decisions.find(d=>d.eventId==='announcement').choice;
 if(s.decisions.some(d=>d.eventId==='water'))s.flags.warning_locked=true;
 if(s.flags.final_platform==='destruction')s.flags.final_platform='break';
 return {...blank,...s,version:SAVE_VERSION};
}
export function deserialize(raw){try{return validateAndNormalize(typeof raw==='string'?JSON.parse(raw):raw)}catch{return null}}
export function importVersionOne(raw){try{return validateAndNormalize(typeof raw==='string'?JSON.parse(raw):raw,true)}catch{return null}}
export class GameState{
 constructor(state=initialState()){this.data=state;this.listeners=new Set();this.chapterCheckpoint=deepCopy(state)}
 subscribe(cb){this.listeners.add(cb);return()=>this.listeners.delete(cb)}
 notify(){this.listeners.forEach(fn=>fn(this.data))}
 decide(id,idx){const result=applyDecision(this.data,id,idx);if(result.applied)this.notify();return result}
 nextChapter(){const advanced=advanceChapter(this.data);if(advanced){this.chapterCheckpoint=deepCopy(this.data);delete this.chapterCheckpoint.chapterEntry;this.data.chapterEntry=deepCopy(this.chapterCheckpoint);this.notify()}return advanced}
 inspect(id,text){const r=discover(this.data,id,text);if(r)this.notify();return r}
 observe(id,text){const r=observe(this.data,id,text);if(r)this.notify();return r}
 restartChapter(){const cp=this.data.chapter===1?initialState():(this.data.chapterEntry||this.chapterCheckpoint);this.data=deepCopy(cp);this.data.chapterEntry=this.data.chapter===1?null:deepCopy(cp);this.chapterCheckpoint=deepCopy(cp);this.notify()}
 reset(){this.data=initialState();this.chapterCheckpoint=deepCopy(this.data);this.notify()}
 restore(data){this.data=data;this.chapterCheckpoint=deepCopy(data.chapterEntry||data);this.notify()}
}
