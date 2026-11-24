// Short labels for archive cards only; academic ideas should not be recited by NPCs.
export const sourceLabels={
 nixon:{en:'Rob Nixon (2011) · Slow violence',vi:'Rob Nixon (2011) · Bạo lực chậm'},
 bullard:{en:'Robert D. Bullard (1990) · Unequal protection',vi:'Robert D. Bullard (1990) · Bảo vệ không đồng đều'},
 lipsitz:{en:'George Lipsitz (2007) · Race, space and power',vi:'George Lipsitz (2007) · Chủng tộc, không gian và quyền lực'},
 morello:{en:'Morello-Frosch et al. (2011) · Community evidence',vi:'Morello-Frosch và cộng sự (2011) · Bằng chứng cộng đồng'},
 tang:{en:'Eric Tang (2011) · Cross-community solidarity',vi:'Eric Tang (2011) · Đoàn kết giữa các cộng đồng'},
 villarreal:{en:'Villarreal et al. (2025) · Language access',vi:'Villarreal và cộng sự (2025) · Tiếp cận ngôn ngữ'},
 snowpiercer:{en:'Snowpiercer (2013) · Film inspiration',vi:'Snowpiercer (2013) · Cảm hứng từ phim'}
};
export const shortSource=(id,lang='en')=>sourceLabels[id]?.[lang==='vi'?'vi':'en']||'Course reading';
