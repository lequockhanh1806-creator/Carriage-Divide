import {events} from '../data/events.js';
import {CHAPTERS} from '../config/constants.js';
import {warningProgress} from './GameState.js';
import {fullTransformationRequirements} from './EndingEvaluator.js';
const PLACES=['Rear Shelter','Workers’ Bay','Community Commons','Medical Ward','Engine Control','Council Chamber'];
export const pendingEvents=state=>events.filter(e=>e.chapter===state.chapter&&!state.decisions.some(d=>d.eventId===e.id));
export function objectiveText(s){
 const w=warningProgress(s);
 if(w.chosen&&w.plan!==2&&!w.ready&&!w.closed){
  if(!w.notice)return 'Warning setup: inspect the Emergency Notice in Rear Shelter (before the water crisis).';
  return 'Warning setup: speak to Linh in Community Commons and finish the read-back test.';
 }
 const remaining=pendingEvents(s);if(!remaining.length)return 'Preparing the next chapter…';
 const e=remaining[0];if(e.id==='report'&&!s.evidence.includes('hidden_report'))return 'Locate and inspect the sealed archive in Engine Control.';
 return `${e.title} · ${PLACES[e.car]}`;
}
export function taskProgress(s){
 const w=warningProgress(s),waterDone=s.decisions.some(d=>d.eventId==='water');
 const r=[];
 if(w.chosen){
  r.push({label:'Choose the warning plan',viLabel:'Chọn cách truyền cảnh báo',done:true,location:'Rear Shelter'});
  if(w.plan!==2){
   r.push({label:'Inspect the Emergency Notice',viLabel:'Kiểm tra Thông báo khẩn',done:w.notice,location:'Rear Shelter',deadline:'Before the water crisis'});
   r.push({label:'Ask Linh to test the translated warning',viLabel:'Nhờ Linh thử cảnh báo đã dịch',done:w.ready,location:'Community Commons',deadline:'Before the water crisis'});
   if(w.plan===1)r.push({label:'Optional: ask Sol to cover the kitchen shift',viLabel:'Tùy chọn: nhờ Sol thay ca bếp',done:w.coverage,location:'Community Commons',optional:true});
  } else r.push({label:'The English-only system remains in use',viLabel:'Loa vẫn chỉ phát tiếng Anh',done:true,location:'Train-wide'});
 }
 if(w.closed)r.push({label:`Water-warning outcome: ${s.flags.water_warning_timing||'unknown'}`,viLabel:`Kết quả cảnh báo nước: ${s.flags.water_warning_timing||'unknown'}`,done:waterDone,location:'Engine Control',outcome:true});
 if(s.chapter>=3){
  for(const item of fullTransformationRequirements(s).slice(0,6)){
   const names={assembly:'Organize delegates with Marcus',archive:'Publish the signed maintenance report',testimony:'Hear Ada’s resident notes',repairs:'Share repair dates with Linh',science:'Discuss water readings with Elena',warnings:'Deliver a prepared water warning'};
   r.push({label:names[item.key],viLabel:({assembly:'Tổ chức đại biểu với Marcus',archive:'Công khai hồ sơ bảo trì',testimony:'Nghe Ada kể về các gia đình',repairs:'Chia sẻ ngày tháng sửa chữa với Linh',science:'Trao đổi mẫu nước với Elena',warnings:'Phát cảnh báo nước đã chuẩn bị'})[item.key],done:item.ok,location:PLACES[item.car],optional:true});
  }
 }
 return r;
}
export const chapterTitle=s=>CHAPTERS[s.chapter-1].title;
