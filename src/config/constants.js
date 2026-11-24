export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const WORLD_WIDTH = 1600;
export const FLOOR_TOP = 426;
export const FLOOR_BOTTOM = 630;
export const CHAPTERS = [
 {title:'A DIVIDED TRAIN',subtitle:'THE ANNOUNCEMENT',objective:'Speak with Mai in Rear Shelter; then find Linh in Community Commons.'},
 {title:'THE HEAT CRISIS',subtitle:'THE COST OF WARMTH',objective:'Consult Daniel in Workers’ Bay, inspect the water console in Engine Control, and meet Dr. Park in Medical.'},
 {title:'VOICES OF RESISTANCE',subtitle:'THE ARCHIVE',objective:'Examine the sealed archive in Engine Control, then speak with Marcus in Community Commons.'},
 {title:'THE FINAL DECISION',subtitle:'THE COUNCIL',objective:'Enter First Class and confront Director Vale about the train’s future.'}
];
export const STAT_META = {
 food:{label:'Food', good:true, icon:'◈',unit:'% of stores'}, heat:{label:'Heat',good:true,icon:'☼',unit:'% capacity'}, medical:{label:'Medicine',good:true,icon:'✚',unit:'% reserves'}, water:{label:'Water safety',good:true,icon:'◉',unit:'index'},
 trust:{label:'Community trust',good:true,icon:'◇',unit:'index'}, safety:{label:'Passenger safety',good:true,icon:'⬡',unit:'index'}, tension:{label:'Class tension',good:false,icon:'⚡',unit:'index'}, legitimacy:{label:'Representation',good:true,icon:'◎',unit:'index'}, risk:{label:'Environmental risk',good:false,icon:'☣',unit:'index'}, inequality:{label:'Inequality',good:false,icon:'▥',unit:'index'}
};
export const PRIMARY_STATS = ['food','heat','trust','safety'];
