// Original fictional scenes. Vietnamese words are part of the story, not a translation exam.
// The player always gets the meaning through nearby dialogue, including in English mode.
export function openingBeat(id,state,lang='en'){
 const vi=lang==='vi';
 switch(id){
  case 'announcement': return vi?[
   'Mẹ của Mai: “Mai ơi, loa vừa nói gì vậy con? Mẹ nghe mà không hiểu.”',
   'Mai: “Họ nói đường nước có thể bị ảnh hưởng. Mẹ khoan dùng nước nhé.”',
   'Mẹ của Mai: “Trời ơi, sao không ai báo bằng tiếng Việt vậy?”',
   'Mai: “Lần này con ở đây còn dịch được. Lỡ lần sau con đi làm thì sao?”'
  ]:[
   'Mai’s mom: “Mai ơi, loa vừa nói gì vậy con? Mẹ nghe mà không hiểu.” (Mai, what did the speaker say? I couldn’t understand.)',
   'Mai: “Họ nói đường nước có thể bị ảnh hưởng. Mẹ khoan dùng nước nhé.” (They said the water line might be affected. Please don’t use the tap yet.)',
   'Mai’s mom: “Trời ơi, sao không ai báo bằng tiếng Việt vậy?” (Why didn’t they say it in Vietnamese?)',
   'Mai: “Mom had to ask me what to do. I can’t be here for every warning.”'
  ];
  case 'water': {
   if(state.flags.warning_ready)return vi?[
    'Linh (qua bộ đàm): “Hệ thống phiên dịch đã sẵn sàng. Nhưng phải quyết định có phát cảnh báo hay không.”',
    'Mai: “Nếu báo, phải chỉ cho mọi nhà chỗ lấy nước sạch nữa.”'
   ]:[
    'Linh, over the radio: “The translated warnings are ready. But someone still has to decide whether to send one.”',
    'Mai: “And if we send it, we need to tell people where to get clean water.”'
   ];
   return vi?[
    'Mai: “Loa chỉ phát tiếng Anh. Mẹ mình nghe được âm thanh, nhưng không biết nó báo gì.”',
    'Linh: “Vậy mà nước có thể đang nguy hiểm. Giờ phải làm sao?”'
   ]:[
    'Mai: “Mom can hear the speaker, but she doesn’t understand what it says.”',
    'Linh: “And the water might be unsafe. We need to decide what to tell people.”'
   ];
  }
  case 'report':return vi?[
   'Daniel: “Thấy ngày này không? Đây là hôm Mai nói nước bắt đầu có mùi lạ. Nhưng trên sổ, họ đã biết đường ống có vấn đề từ trước đó.”'
  ]:[
   'Daniel: “See this date? Mai told me the water first smelled wrong that week. But this file says they knew there was a pipe problem long before that.”'
  ];
  case 'protest':return vi?[
   'Mai: “Mình không muốn ai hứa rồi quên nữa.” Marcus: “Vậy thì mình mang cả bằng chứng và mọi người đến. Không để một người nói thay tất cả.”'
  ]:[
   'Mai: “I’m tired of promises that vanish.” Marcus: “Then we bring the records and the people. No one gets to speak for the whole train alone.”'
  ];
  default:return [];
 }
}
export function resultBeat(id,choiceIndex,state,lang='en'){
 const vi=lang==='vi';
 if(id==='announcement'){
  const extras=vi?[
   'Mẹ của Mai: “Vậy từ giờ có thông báo, mẹ đọc được rồi hả?” Mai: “Dạ. Còn sai chỗ nào, mẹ cứ hỏi tụi con.”',
   'Mẹ của Mai: “Linh ơi, cảm ơn con.” Linh: “Dạ, nhưng mai con còn đi làm. Mình phải có người thay nữa.”',
   'Mẹ của Mai: “Vậy lúc có chuyện thì mẹ đợi ai đến nói sao?” Mai không biết trả lời thế nào.'
  ]:[
   'Mai’s mom: “So next time I can read it myself?” Mai: “That’s the plan. And you can tell us if anything’s unclear.”',
   'Mai’s mom: “Cảm ơn con, Linh.” (“Thank you, Linh.”) Linh: “I’ll help. But who does this when I’m at work?”',
   'Mai’s mom: “Vậy lúc có chuyện thì mẹ đợi ai đến nói sao?” (“So if something happens, I just wait for someone to tell me?”) Mai has no answer.'
  ];
  return [extras[choiceIndex]];
 }
 if(id==='water'){
  const timing=state.flags.water_warning_timing;
  const en={
   direct:[
    'Mai’s mom: “Mai ơi, mẹ nghe cảnh báo rồi. Mẹ khóa vòi rồi.” (Mai, I heard the warning. I turned off the tap.)',
    'Mai: “She understood the warning herself this time. Now we still need clean water for everyone.”'
   ],
   relay:[state.flags.volunteer_cover?'Linh: “We got the warning out. Sol covered our kitchen shift, but volunteers still had to run between rooms.”':'Linh: “We got the warning out. But I was working in the kitchen, so some people heard it late.”',
    'Mai: “Mom got the message, but we can’t keep asking the same few people to run between cars.”'],
   unfinished:[
    'Mai’s mom: “Mẹ vừa lấy nước rồi. Giờ mới biết không nên dùng.” (I already filled the kettle. Now I hear it might be unsafe.)',
    'Mai: “We chose a plan, but we never tested the notice. That delay mattered.”'
   ],
   late:[
    'Mai’s mom: “Mẹ nghe loa mà chẳng biết phải làm gì.” (I heard the speaker, but I didn’t know what to do.)',
    'Mai: “She only found out later what the alarm meant.”'
   ],
   withheld:['Elena: “You kept the reading quiet. A translation system can’t help if nobody sends the warning.”']
  };
  const vn={
   direct:[
    'Mẹ của Mai: “Mai ơi, mẹ nghe cảnh báo bằng tiếng Việt rồi. Mẹ khóa vòi rồi.”',
    'Mai: “Lần này mẹ tự hiểu, không phải đợi mình. Giờ phải lo nước sạch cho mọi người nữa.”'
   ],
   relay:[state.flags.volunteer_cover?'Linh: “Đã báo được rồi. Sol làm thay ca bếp, nhưng mọi người vẫn phải chạy khắp các khoang.”':'Linh: “Đã báo được, nhưng mình phải làm ca bếp. Có nhà biết tin trễ.”',
    'Mai: “Mẹ mình nhận được tin rồi. Nhưng không thể cứ bắt vài người chạy đi báo mãi được.”'],
   unfinished:[
    'Mẹ của Mai: “Mẹ vừa lấy nước rồi. Giờ mới biết không nên dùng.”',
    'Mai: “Mình đã chọn cách làm mà chưa thử bảng tin. Mẹ biết chuyện quá trễ.”'
   ],
   late:[
    'Mẹ của Mai: “Mẹ nghe loa mà chẳng biết phải làm gì.”',
    'Mai: “Tới lúc có người tới nói thì mẹ mới hiểu cảnh báo là gì.”'
   ],
   withheld:['Elena: “Bạn giấu chỉ số nước. Dù có người phiên dịch, không phát cảnh báo thì họ cũng đâu giúp được.”']
  };
  return (vi?vn:en)[timing]||[];
 }
 if(id==='protest'&&state.flags.coalition)return [vi?'Linh: “Bảng yêu cầu đã có tiếng Việt, tiếng Anh và chỗ ký tên. Không phải ai cũng đồng ý hết, nhưng ai cũng được nói.”':'Linh: “We’ve got the demands in Vietnamese and English, with room for everyone to sign. We don’t all agree. At least we all get a voice.”'];
 return [];
}
export function finalBriefing(s,lang='en'){
 const vi=lang==='vi',f=s.flags;
 const organized=!!(f.coalition&&!f.protest_suppressed);
 const preparation=[f.ada_testimony,f.repair_story_shared,f.public_science,f.warning_ready,f.report_released];
 const missing=preparation.filter(x=>!x).length;
 if(vi)return [
  organized?'Marcus: “Có người ký tên từ đủ sáu khoang. Vẫn còn cãi nhau, nhưng lần này có người đại diện thật.”':'Marcus: “Mọi người vẫn chia rẽ. Đừng bảo hội đồng là ai cũng đồng ý khi họ chưa được hỏi.”',
  f.report_released?'Daniel: “Hồ sơ đã công khai. Giờ chẳng ai nói được là họ không biết.”':'Daniel: “Hồ sơ chưa công khai. Đừng để hội đồng gạt lời kể của dân đi.”',
  missing?'Linh: “Mình còn thiếu vài bằng chứng hoặc việc chuẩn bị. Vẫn có thể yêu cầu thay đổi, nhưng khó giữ mọi người cùng một hướng.”':'Linh: “Mình có lời kể, sổ sửa máy, dữ liệu nước và cảnh báo đã thử. Đây là việc làm chung.”',
  'Mai: “Ở Khoang cộng đồng ai cũng có thể nói. Còn hội đồng thì khóa cửa. Nhớ cả cảnh báo tiếng Việt nữa nhé.”'
 ];
 return [
  organized?'Marcus: “People from every car signed the plan. We still argue, but now we have people to speak for us.”':'Marcus: “People are still split. Don’t tell Vale everyone agrees when they haven’t been asked.”',
  f.report_released?'Daniel: “The repair files are public now. They can’t say they didn’t know.”':'Daniel: “The repair files aren’t public. Don’t let them brush off what people saw.”',
  missing?'Linh: “We’re still missing some evidence or preparation. We can ask for change, but keeping everyone together will be harder.”':'Linh: “We have the people’s notes, repair dates, water tests and a warning we actually tried out. We did this together.”',
  'Mai: “In Commons, anyone can speak. Here the council has a locked door. And please remember the Vietnamese warnings.”'
 ];
}
