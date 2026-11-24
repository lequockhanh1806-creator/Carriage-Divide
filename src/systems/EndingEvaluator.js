// These are story outcomes, not predictions about actual environmental health.
export const endingCatalog={
 stability:{title:'STABILITY WITHOUT JUSTICE',eyebrow:'ENDING A / THE OLD LINE',subtitle:'The clinic warms up. The rules stay the same.',
  description:'Vale gets the parts to the clinic and the engine keeps running. Mai is relieved that her mother has heat tonight. But voting still depends on ticket class, and a new breakdown is already on Daniel’s list. Vale promised repairs. People will have to make sure she keeps that promise.',
  reflection:'A quick repair matters. It does not answer why some people were left waiting for years.'},
 reform:{title:'COMMUNITY REFORM',eyebrow:'ENDING B / A DOOR OPENS',subtitle:'A seat at the table. Not control of the table.',
  description:'Passengers win elected delegates, public repair records, and a way to challenge council decisions. The council still controls much of the budget. Linh posts the first meeting time in three languages. Marcus says this is a start, not a finish.',
  reflection:'Small changes can protect people. Keeping those changes alive takes continued pressure and attention.'},
 fragmented:{title:'FRAGMENTED RESISTANCE',eyebrow:'ENDING C / THE TRAIN DIVIDES',subtitle:'Everyone wants change. They cannot agree how.',
  description:'The council refuses the proposal. Workers split over what to do next; families are afraid of another shutdown. Mai keeps helping people at the rear, and Elena keeps treating patients. The train moves, but the old problems remain.',
  reflection:'Anger alone cannot run a train. People need evidence, trust and ways to act together.'},
 transformation:{title:'COLLECTIVE TRANSFORMATION',eyebrow:'ENDING D / A NEW CHARTER',subtitle:'The passengers get a real say.',
  description:'Elected delegates from each car now control the repair budget and warning shifts. Meetings are translated, records are public, and delegates can be removed. Daniel reminds everyone that the broken heaters are still broken. Sharing power does not make the work disappear—it changes who decides what gets fixed.',
  reflection:'Environmental justice is also the right to be heard, to check the records, and to help make the decisions.'},
 destruction:{title:'BEYOND THE LAST STOP',eyebrow:'ENDING E / THE DRIVE FALLS SILENT',subtitle:'No more council route. No more moving train.',
  description:'The drive goes quiet. Vale loses her control of the route, and so does everyone else. The temperature drops fast. Elena moves patients toward the doors while Marcus gathers teams to search for shelter outside. Some passengers wanted this break. Others are terrified. Nobody knows what comes next.',
  reflection:'Stopping an unfair system can also put people at risk. Freedom and responsibility do not separate neatly.'}
};
export function fullTransformationRequirements(s){
 const f=s.flags,t=s.stats;
 const checks=[
  {key:'assembly',label:'Build a cross-car assembly with Marcus',ok:!!(f.assembly&&f.coalition&&f.workers_organized&&!f.protest_suppressed),car:2},
  {key:'archive',label:'Publish the signed maintenance archive',ok:!!f.report_released,car:4},
  {key:'testimony',label:'Hear Ada’s dated resident notes',ok:!!f.ada_testimony,car:0},
  {key:'repairs',label:'Share Daniel’s repair dates with Linh',ok:!!f.repair_story_shared,car:2},
  {key:'science',label:'Discuss the water readings with Elena',ok:!!f.public_science,car:3},
  {key:'warnings',label:'Finish warning setup and deliver the water alert',ok:!!f.warning_ready&&['direct','relay'].includes(f.water_warning_timing),car:2},
  {key:'support',label:'Keep enough community trust and representation',ok:t.trust>=55&&t.legitimacy>=45&&t.inequality<=64,car:2}
 ];return checks;
}
export function evaluateEnding(s){
 const f=s.flags,t=s.stats;
 if(f.final_platform==='break'||f.final_platform==='destruction')return 'destruction';
 if(f.final_platform==='central')return 'stability';
 if(f.final_platform!=='assembly')return 'fragmented';
 if(fullTransformationRequirements(s).every(c=>c.ok))return 'transformation';
 const organized=!!(f.coalition&&f.workers_organized&&!f.protest_suppressed);
 if((organized||f.council_cooperation)&&t.trust>=36&&t.legitimacy>=35&&t.tension<78)return 'reform';
 return 'fragmented';
}
export function consequenceSummary(s){
 const t=s.stats,delta=Object.fromEntries(Object.keys(t).map(k=>[k,t[k]-s.initialStats[k]]));
 const warning={direct:'The warning arrived in Vietnamese before families used the water.',relay:s.flags.volunteer_cover?'Volunteers relayed the warning, with kitchen shifts covered.':'Volunteers carried the warning, but it reached some families late.',unfinished:'The warning plan was chosen but not completed in time.',late:'The English-only warning left some families without usable instructions.',withheld:'The warning was withheld. Translation setup could not protect anyone.'};
 return {delta,impacts:[
  s.finalEnding==='destruction'?'The stopped train has no heat and no guaranteed safe shelter outside.':t.inequality>=70?'Rear residents still carry more of the risk.':'Rear families have somewhat better access, but repairs remain.',
  s.flags.workers_organized?'Workers have delegates and some bargaining power.':'Workers have little say over the machines they maintain.',
  warning[s.flags.water_warning_timing]||'Warning access was not tested in the later crisis.',
  `Medical care: ${{triage:'urgent cases first',mobile:'mobile care',tiered:'ticket-class queue'}[s.flags.medical_policy]||'unchanged'}.`,
  `Water response: ${{warn:'warnings and tests',shutdown:'feeder shut and rationed',conceal:'warning kept quiet'}[s.flags.water_policy]||'unchanged'}.`
 ]};
}
