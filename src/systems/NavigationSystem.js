// Pure navigation rules. Geometry/input rules can be verified without Phaser or the DOM.
export function normalizedDirection(horizontal,vertical){const magnitude=Math.hypot(horizontal,vertical);return magnitude?{x:horizontal/magnitude,y:vertical/magnitude}:{x:0,y:0}}
export function doorAccess(from,to,chapter){
 if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||from>5||to<0||to>5||Math.abs(to-from)!==1)return {allowed:false,reason:'Only adjacent train cars are connected.'};
 if(to===5&&chapter<4)return {allowed:false,reason:'The council requires a final-hearing invitation.'};
 return {allowed:true,target:to};
}
export function entryPosition(from,to){return {x:to>from?137:1440,y:535}}
export function movementIsLocked(mode,transitioning=false){return transitioning||mode!=='none'}
