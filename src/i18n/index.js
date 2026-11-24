import {vi,vietnameseAmbient} from './vi.js';
import {voicedEvent} from '../data/voice.js';
import {ambientVoice} from '../data/ambientVoice.js';

export const languages={en:'English',vi:'Tiếng Việt'};
export const supportedLanguage=(language)=>Object.hasOwn(languages,language)?language:'en';
export const localizedChapter=(chapter,lang)=>lang==='vi'?vi.chapters[chapter-1]:null;
export const localizedStat=(key,lang,fallback=key)=>lang==='vi'?(vi.stats[key]||fallback):fallback;
export const localizedCharacter=(id,character,lang)=>lang==='vi'?{...character,...vi.characters[id]}:character;
export const localizedRoom=(index,room,lang)=>lang==='vi'?{...room,...vi.compartments[index],objects:room.objects.map((o,i)=>({...o,...vi.compartments[index]?.objects[i]}))}:room;
export function localizedEvent(event,lang){if(!event)return event;const translated=lang==='vi'?vi.events[event.id]:null;const base=translated?{...event,...translated,choices:event.choices.map((choice,i)=>({...choice,...translated.choices[i]}))}:event;return voicedEvent(base,lang);}
export const localizedEnding=(id,original,lang)=>lang==='vi'?{...original,...vi.endings[id]}:original;
export const localizedResearch=(items,lang)=>lang==='vi'?items.map(item=>({...item,...(item.viName?{name:item.viName,detail:item.viDetail,kind:item.viKind||item.kind}:{})})):items;
export const localizedAmbient=(id,state,lang,englishGetter)=>ambientVoice(id,state,lang);
export function localizedObjective(state,english,lang){
 if(lang!=='vi')return english;
 if(!english||english==='Preparing the next chapter…')return 'Đang chuẩn bị chương tiếp theo…';
 if(english.startsWith('Warning setup: inspect'))return 'Chuẩn bị cảnh báo: kiểm tra bảng Thông báo khẩn ở Khoang trú ẩn trước khi có khủng hoảng nước.';
 if(english.startsWith('Warning setup: speak'))return 'Chuẩn bị cảnh báo: gặp Linh ở Khoang cộng đồng để thử cách truyền tin.';
 if(english==='Locate and inspect the sealed archive in Engine Control.')return 'Tìm và kiểm tra kho hồ sơ niêm phong ở Khoang máy.';
 const match=english.match(/^(.+) · (.+)$/);
 if(match){const enToId={'THE EMERGENCY ANNOUNCEMENT':'announcement','THE RATION LINE':'food','THE FOOD LINE':'food','THE HEAT CRISIS':'heat','CONTAMINATED WATER':'water','THE TRIAGE BOARD':'medical','THE CLINIC QUEUE':'medical','THE HIDDEN REPORT':'report','VOICES OF RESISTANCE':'protest','THE FINAL VOTE':'vote','WHO GETS A SAY?':'vote'};
  const e=vi.events[enToId[match[1]]];const id=({'Rear Shelter':0,'Workers’ Bay':1,'Community Commons':2,'Medical Ward':3,'Engine Control':4,'Council Chamber':5})[match[2]];
  if(e&&id!==undefined)return `${e.title} · ${vi.compartments[id].short}`;
 }
 return english;
}
export function localizedImpact(state,lang){if(lang!=='vi')return null;const s=state.stats;return [
 s.inequality>=70?'Người ở khoang trú ẩn phía sau vẫn phải gánh rủi ro lớn hơn nhiều.':s.risk>65?'Phơi nhiễm ở khoang sau vẫn cao dù cách phân phối đã thay đổi.':'Cư dân khoang sau được bảo vệ tốt hơn tương đối, nhưng việc sửa chữa chưa hoàn tất.',
 state.flags.workers_organized?'Công nhân có khả năng thương lượng và tiếng nói công khai.':'Công nhân vẫn có ít quyền tác động lên điều kiện lao động của họ.',
 state.flags.water_warning_timing==='withheld'?'Cảnh báo nước đã bị giấu. Dù có hệ thống phiên dịch cũng không giúp được.':state.flags.water_warning_timing==='unfinished'?'Đã chọn phương án phiên dịch nhưng chưa thử xong trước lúc khủng hoảng nước.':state.flags.water_warning_timing==='direct'?'Khoang sau nhận được cảnh báo nước bằng tiếng Việt ngay, không phải chờ hàng xóm dịch.':state.flags.water_warning_timing==='relay'?'Tình nguyện viên đã truyền cảnh báo, nhưng tin đến trễ hoặc phải nhờ người thay ca.':'Khoang sau nhận được cảnh báo nước trễ vì loa chỉ phát bằng tiếng Anh.',
 `Tiếp cận y tế: ${{triage:'ưu tiên cấp cứu công khai',mobile:'phòng khám lưu động',tiered:'vẫn phân theo hạng vé'}[state.flags.medical_policy]||'chưa thay đổi'}.`,
 `Chính sách nước: ${{warn:'công khai cảnh báo',shutdown:'khóa đường ống',conceal:'che giấu thông tin'}[state.flags.water_policy]||'chưa thay đổi'}.`
];}
export function localizedChoiceRecord(record,lang){if(lang!=='vi')return record;const e=vi.events[record.eventId];return e?{...record,title:e.title,option:e.choices[record.choice]?.text||record.option,benefit:e.choices[record.choice]?.benefit||record.benefit}:record;}

// Exact labels are translated after constructing the existing DOM, preserving data-act attributes.
// Dynamic story content is translated by stable event/room/character IDs above.
export const uiVI={
 'AN INTERACTIVE STORY':'CÂU CHUYỆN TƯƠNG TÁC','SAME TRACKS. DIFFERENT LIVES.':'CÙNG ĐƯỜNG RAY. KHÁC SỐ PHẬN.',
 'Six cars. One shared future.':'Sáu khoang tàu. Một tương lai chung.','Who gets to survive—and who gets to decide?':'Ai được sống sót — và ai được quyền quyết định?',
 'BEGIN THE JOURNEY':'BẮT ĐẦU HÀNH TRÌNH','CONTINUE FROM SAVE':'TIẾP TỤC BẢN LƯU','SETTINGS':'CÀI ĐẶT','SOURCES & CREDITS':'NGUỒN VÀ GHI CÔNG',
 'ORIGINAL 2D NARRATIVE ADVENTURE':'PHIÊU LƯU KỂ CHUYỆN 2D NGUYÊN BẢN','DESKTOP EDITION':'PHIÊN BẢN MÁY TÍNH','THE LAST TRAIN NORTH':'CHUYẾN TÀU CUỐI CÙNG VỀ PHÍA BẮC','EST. WINTER / UNKNOWN YEAR':'MÙA ĐÔNG / KHÔNG RÕ NĂM',
 'MAP':'BẢN ĐỒ','JOURNAL':'NHẬT KÝ','ACTIVE OBJECTIVE':'MỤC TIÊU HIỆN TẠI','CH':'CH','CHAPTER':'CHƯƠNG',
 'IN THE CARRIAGE':'TRONG KHOANG TÀU','FIELD NOTE':'GHI CHÉP','TRANSMISSION':'THÔNG TIN','CONTINUE':'TIẾP TỤC',
 'EVERY ALLOCATION HAS A HISTORY':'MỖI CÁCH PHÂN PHỐI ĐỀU CÓ LỊCH SỬ','CASE FILE':'HỒ SƠ','CONTEXT & CONSEQUENCES':'BỐI CẢNH VÀ HỆ QUẢ','CURRENT CONDITIONS':'TÌNH TRẠNG HIỆN TẠI',
 'Values are fictional gameplay indices, not real-world risk measurements.':'Các chỉ số chỉ dùng trong trò chơi hư cấu, không đo rủi ro ngoài đời.',
 'THE DECISION IS YOURS':'QUYẾT ĐỊNH NẰM Ở BẠN','The train waits for an answer.':'Cả đoàn tàu đang chờ câu trả lời.','SELECT A COURSE OF ACTION':'CHỌN HƯỚNG HÀNH ĐỘNG','1–3 THEN ENTER':'BẤM 1–3 RỒI ENTER',
 'INTERLUDE':'CHUYỂN CHƯƠNG','OF':'TRÊN','CONTINUE THE JOURNEY':'TIẾP TỤC HÀNH TRÌNH',
 'TRAIN SCHEMATIC':'SƠ ĐỒ ĐOÀN TÀU','Six connected compartments · walk through the doors to travel':'Sáu khoang nối liền · đi qua cửa để di chuyển',
 'CLOSE':'ĐÓNG','YOU ARE HERE':'BẠN Ở ĐÂY','COUNCIL ACCESS RESTRICTED':'CHƯA ĐƯỢC VÀO HỘI ĐỒNG','EXPLORED':'ĐÃ KHÁM PHÁ','UNEXPLORED':'CHƯA KHÁM PHÁ',
 'The same rail line crosses radically different living conditions. No fast travel: physical access is part of this story.':'Cùng đường ray nhưng điều kiện sống chênh lệch. Không có di chuyển nhanh: quyền qua lại cũng là một phần câu chuyện.',
 'FIELD LOG / PERSONAL RECORD':'NHẬT KÝ KHẢO SÁT / GHI CHÉP CÁ NHÂN','THE JOURNAL':'NHẬT KÝ','Evidence, conversations, decisions and research':'Bằng chứng, đối thoại, quyết định và nghiên cứu',
 'INSIGHTS':'GÓC NHÌN','OBJECTIVES':'MỤC TIÊU','EVIDENCE':'BẰNG CHỨNG','PEOPLE':'NHÂN VẬT','DECISIONS':'QUYẾT ĐỊNH','RESEARCH':'NGHIÊN CỨU',
 'ONGOING WORK':'VIỆC ĐANG LÀM','CHAPTERS / COMPLETED':'CHƯƠNG / ĐÃ HOÀN THÀNH','FIELD OBSERVATIONS':'QUAN SÁT THỰC ĐỊA',
 'Walk through the compartments and examine marked objects.':'Đi qua các khoang và kiểm tra những vật được đánh dấu.',
 'DOCUMENTED EVIDENCE':'BẰNG CHỨNG ĐÃ GHI','A critical record discovered during the journey.':'Một hồ sơ quan trọng phát hiện trên hành trình.',
 'No evidence recorded yet. Examine signs, consoles and material traces.':'Chưa ghi nhận bằng chứng. Hãy kiểm tra bảng hiệu, bộ điều khiển và dấu vết vật chất.',
 'PEOPLE OF THE TRAIN':'NHỮNG NGƯỜI TRÊN TÀU','YOUR DECISION HISTORY':'LỊCH SỬ QUYẾT ĐỊNH','No major decisions have been made yet.':'Bạn chưa đưa ra quyết định lớn nào.',
 'RESEARCH & DESIGN NOTES':'NGHIÊN CỨU VÀ GHI CHÚ THIẾT KẾ','All train events, characters and numbers are fictional. These seven sources explain the ideas behind the story, not the invented statistics. Full readings may require library access.':'Sự kiện, nhân vật và số liệu trên tàu đều là hư cấu. Bảy nguồn này giải thích ý tưởng của truyện chứ không phải những con số tưởng tượng. Có nguồn cần quyền truy cập thư viện.',
 'READ TEXT (PDF)':'ĐỌC BẢN PDF','SOURCE / BOOK RECORD':'NGUỒN / TRANG SÁCH','VIEW SOURCE':'XEM NGUỒN','THE JOURNEY IS ON HOLD':'HÀNH TRÌNH TẠM DỪNG','PAUSED':'TẠM DỪNG','Cold rails, warm decisions.':'Đường ray lạnh giá, quyết định đầy hơi ấm.',
 'RESUME':'TIẾP TỤC','SAVE PROGRESS':'LƯU TIẾN TRÌNH','LOAD SAVED GAME':'TẢI BẢN LƯU','RESTART THIS CHAPTER':'CHƠI LẠI CHƯƠNG','RETURN TO TITLE':'VỀ MÀN HÌNH CHÍNH',
 'USER PREFERENCES':'TÙY CHỌN CỦA NGƯỜI CHƠI','Changes save automatically on this device':'Thay đổi tự lưu trên thiết bị này',
 'BACK':'QUAY LẠI','Master volume':'Âm lượng tổng','Train ambience':'Âm thanh đoàn tàu','Effects volume':'Âm lượng hiệu ứng','Text speed':'Tốc độ chữ',
 'Reduced motion':'Giảm chuyển động','Mute all sound':'Tắt mọi âm thanh','Display':'Hiển thị','TOGGLE FULLSCREEN':'BẬT / TẮT TOÀN MÀN HÌNH',
 'Language / Ngôn ngữ':'Ngôn ngữ / Language','English':'Tiếng Anh','Tiếng Việt':'Tiếng Việt',
 'KEYBOARD: WASD movement · Shift sprint · E interact · 1 / 2 / 3 select decisions · Enter confirm · Space advance · Escape pause · M map · J journal. No timed decisions.':'PHÍM: WASD di chuyển · Shift chạy nhanh · E tương tác · 1/2/3 chọn · Enter xác nhận · Space tiếp thoại · Esc tạm dừng · M bản đồ · J nhật ký. Không giới hạn thời gian.',
 'Progress saved to this browser.':'Đã lưu tiến trình trên trình duyệt này.','LocalStorage is unavailable; save failed.':'Không thể lưu tiến trình trên thiết bị này.',
 'ON':'BẬT','OFF':'TẮT','AN ORIGINAL INTERACTIVE WORK':'TÁC PHẨM TƯƠNG TÁC NGUYÊN BẢN','CREDITS & SOURCES':'GHI CÔNG VÀ NGUỒN',
 'THE STORY IS FICTIONAL.':'CÂU CHUYỆN LÀ HƯ CẤU.','Original characters, an imagined catastrophe and fictional resource indices. Any resemblance to historical people is not intended. Decisions illustrate structural trade-offs, not empirical survival probabilities.':'Nhân vật nguyên bản, thảm họa tưởng tượng và chỉ số tài nguyên hư cấu. Mọi sự trùng hợp với nhân vật lịch sử đều ngoài ý muốn. Quyết định minh họa đánh đổi cơ cấu, không phải xác suất sống sót thực tế.',
 'DESIGN & DEVELOPMENT':'THIẾT KẾ VÀ PHÁT TRIỂN','Procedurally drawn train environments, synthesized audio, original dialogue, stateful branching and testable rules. No Snowpiercer footage, characters, music or artwork are reproduced.':'Bối cảnh đoàn tàu được vẽ bằng thuật toán, âm thanh tổng hợp, hội thoại nguyên bản, cốt truyện phân nhánh và quy tắc kiểm thử được. Không tái sử dụng hình ảnh, nhân vật, nhạc hoặc cảnh phim Snowpiercer.',
 'RESEARCH INSPIRATIONS & CITATIONS':'CẢM HỨNG NGHIÊN CỨU VÀ TÀI LIỆU','SOURCE':'NGUỒN','Readings are linked where a public copy or reliable book record is available. Original books and articles remain with their publishers.':'Đã đính kèm đường dẫn tới bản công khai hoặc thông tin sách khi có. Bản quyền sách và bài báo vẫn thuộc đơn vị xuất bản.',
 'SCROLL TO SEE THE CONSEQUENCES':'CUỘN ĐỂ XEM HỆ QUẢ','POST-CRISIS ACCOUNTABILITY / A FICTIONAL REPORT':'GIẢI TRÌNH SAU KHỦNG HOẢNG / BÁO CÁO HƯ CẤU',
 'THE CONSEQUENCES':'NHỮNG HỆ QUẢ','All values are designed for gameplay; none predict actual human health outcomes.':'Mọi chỉ số được thiết kế cho trò chơi; không dự đoán sức khỏe con người ngoài đời.',
 '06 CARS':'06 KHOANG','01 SHARED FUTURE':'01 TƯƠNG LAI CHUNG','from start':'so với ban đầu','WHO FELT THE IMPACT?':'AI CHỊU TÁC ĐỘNG?',
 'YOUR EIGHT DECISIONS':'TÁM QUYẾT ĐỊNH CỦA BẠN','ENVIRONMENTAL JUSTICE / REFLECTION':'CÔNG BẰNG MÔI TRƯỜNG / SUY NGẪM',
 'REVISIT THE JOURNAL':'XEM LẠI NHẬT KÝ','READ SOURCES & CREDITS':'XEM NGUỒN VÀ GHI CÔNG','NEW JOURNEY':'HÀNH TRÌNH MỚI',
 'WASD move · Shift run · E interact · J journal · M map':'WASD di chuyển · Shift chạy · E tương tác · J nhật ký · M bản đồ',
 'WASD move · E interact · J journal · M map · Esc pause':'WASD di chuyển · E tương tác · J nhật ký · M bản đồ · Esc tạm dừng',
 'A new representative has arrived.':'Một người đại diện mới đã đến.'
};
export function translateLabel(raw,lang){if(lang!=='vi')return raw;const trimmed=raw.trim();if(!trimmed)return raw;let t=uiVI[trimmed];if(!t){
 if(/^CH \d{2} · /.test(trimmed)){t=trimmed.replace('CH ','CHƯƠNG ')}
 else if(/^\d+ \/ CHAPTER \d+$/.test(trimmed))t=trimmed.replace('CHAPTER','CHƯƠNG');
 else if(/^CHAPTER \d+/.test(trimmed))t=trimmed.replace('CHAPTER','CHƯƠNG');
 else if(/^\d+ OF 4$/.test(trimmed))t=trimmed.replace(' OF 4',' / 4');
 else if(/^\d+ \/ \d+ · SPACE \/ ENTER$/.test(trimmed))t=trimmed.replace('SPACE / ENTER','SPACE / ENTER');
 else if(trimmed.startsWith('Fictional game index: '))t='Chỉ số trò chơi hư cấu: '+trimmed.slice('Fictional game index: '.length);
 else if(trimmed==='Map (M)')t='Bản đồ (M)';
 else if(trimmed==='Journal (J)')t='Nhật ký (J)';
 else if(trimmed==='Pause (Esc)')t='Tạm dừng (Esc)';
 else return raw;
 }
 return raw.replace(trimmed,t);
}
export function translateElement(root,lang){if(lang!=='vi'||!root)return;const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walk.nextNode())nodes.push(walk.currentNode);for(const n of nodes){if(n.parentElement?.closest('script,style'))continue;const next=translateLabel(n.nodeValue,lang);if(next!==n.nodeValue)n.nodeValue=next}for(const el of root.querySelectorAll('[title],[aria-label]')){for(let attr of ['title','aria-label'])if(el.hasAttribute(attr)){const next=translateLabel(el.getAttribute(attr),lang);if(next!==el.getAttribute(attr))el.setAttribute(attr,next)}}}
