import {canPrepareWarnings,prepareWarnings} from '../systems/GameState.js';
// Short read-back conversations, not school-style tests. Mistakes may be retried.
export const knowledgeChecks = {
  warning_readback:{npc:'linh',car:2,chapter:1,requires:'language',
    question:'Linh: “Before we turn it on, what should the water warning say?”',
    viQuestion:'Linh: “Trước khi bật loa, mình phải nói gì về nước?”',
    answers:['“The water is completely safe.”','“Avoid the rear taps until tests are done. Ask us where to get clean water.”','“No need to tell the rear families yet.”'],
    viAnswers:['“Nước hoàn toàn an toàn.”','“Đừng dùng vòi nước khoang sau cho tới khi kiểm tra xong. Hỏi chỗ lấy nước sạch nhé.”','“Chưa cần báo cho gia đình khoang sau.”'],correct:1,
    success:'Linh: “Good. Clear words, and people know what to do. I’ll test it from Commons.”',
    viSuccess:'Linh: “Ừ, dễ hiểu. Mọi người biết phải làm gì. Mình sẽ thử tín hiệu từ Khoang cộng đồng.”',
    retry:'Linh: “That sounds risky. Think about what a family can actually do when they hear it.”',
    viRetry:'Linh: “Nghe nguy hiểm quá. Nghĩ xem gia đình nghe xong phải làm được gì.”',
    successFlag:'warning_ready',journal:'Linh tested the warning system after the notice was inspected.'},
  ignored_repairs:{npc:'linh',car:2,chapter:1,requires:'backlog',
    question:'Daniel’s repair log was a mess. What did you actually find in it?',
    viQuestion:'Sổ sửa chữa của Daniel rối thật. Bạn đọc được điều gì?',
    answers:['The heater failed without any warning.','Workers reported the same fault again and again, but repairs were deferred.','The passengers broke the system themselves.'],
    viAnswers:['Máy hỏng bất ngờ, không báo trước.','Công nhân đã báo cùng một lỗi nhiều lần, nhưng vẫn bị hoãn sửa.','Chính hành khách đã phá hệ thống.'],correct:1,
    success:'Linh: “Exactly. The breakdown started long before today. Can you help me put those dates on the noticeboard? People need to see the pattern.”',
    viSuccess:'Linh: “Đúng rồi. Máy hỏng từ lâu trước hôm nay. Giúp mình ghi mấy mốc ngày đó lên bảng nhé? Mọi người cần thấy chuyện này kéo dài thế nào.”',
    retry:'Linh: “Look at the dates again. Daniel kept asking for a repair. It’s not a trick question. Come back when you’ve read the log.”',
    viRetry:'Linh: “Xem lại ngày tháng đi. Daniel đã xin sửa nhiều lần. Không phải câu đố mẹo đâu. Đọc lại sổ rồi mình nói tiếp.”',
    successFlag:'repair_story_shared',journal:'Linh added the repeated repair dates to the community noticeboard.',
    viJournal:'Linh ghi các lần hoãn sửa lên bảng thông báo cộng đồng.'},
  shared_evidence:{npc:'elena',car:3,chapter:2,requires:'water_data',
    question:'The rear tap and the official monitor disagree. What should we do with that?',
    viQuestion:'Mẫu nước ở khoang sau và màn hình chính thức khác nhau. Giờ làm sao?',
    answers:['Hide one set of readings until we have a perfect answer.','Let the council decide which data people are allowed to hear.','Make both readings available, retest, and tell residents what is still uncertain.'],
    viAnswers:['Giấu bớt kết quả cho tới khi chắc chắn tuyệt đối.','Để hội đồng quyết định dân được nghe dữ liệu nào.','Công khai cả hai kết quả, xét nghiệm lại và nói rõ điều chưa chắc chắn.'],correct:2,
    success:'Elena: “Good. Patients can deal with uncertainty. What they can’t deal with is being kept in the dark.”',
    viSuccess:'Elena: “Tốt. Bệnh nhân chấp nhận được chuyện chưa chắc. Nhưng họ không thể chấp nhận bị giấu thông tin.”',
    retry:'Elena: “We still need tests. And the families need a warning while we run them. Think about who bears the risk of silence.”',
    viRetry:'Elena: “Vẫn cần xét nghiệm. Nhưng trong lúc chờ, gia đình ở đó phải được cảnh báo. Nghĩ xem ai đang gánh rủi ro nếu mình im lặng.”',
    successFlag:'public_science',journal:'Elena shared the disputed water readings with the public care team.',
    viJournal:'Elena chia sẻ các kết quả nước chưa thống nhất cho nhóm chăm sóc cộng đồng.'}
};
export const isKnowledgeAvailable=(s,id)=>{const k=knowledgeChecks[id];return Boolean(k&&s.chapter>=k.chapter&&s.evidence.includes(k.requires)&&!s.flags[k.successFlag]&&(id!=='warning_readback'||canPrepareWarnings(s)));};
export function answerKnowledge(s,id,index){
 const k=knowledgeChecks[id];if(!isKnowledgeAvailable(s,id))return {correct:false,blocked:true};
 if(index!==k.correct)return {correct:false,blocked:false};
 if(id==='warning_readback'){if(!prepareWarnings(s))return {correct:false,blocked:true};return {correct:true,blocked:false};}
 s.flags[k.successFlag]=true;
 // Explaining evidence to others creates a small participation effect, not a claim about real-world risk.
 s.stats.trust=Math.min(100,s.stats.trust+2);
 s.history.push({kind:'conversation',text:k.journal});
 return {correct:true,blocked:false};
}
