// All audio is generated at runtime. No external copyrighted audio or playback autoplay dependency.
export class AudioManager{
 constructor(settings){this.settings=settings;this.ctx=null;this.ambientNode=null;this.master=null;this.lastStep=0;this.car=0}
 init(){if(this.ctx)return;try{const Context=window.AudioContext||window.webkitAudioContext;this.ctx=new Context();this.master=this.ctx.createGain();this.master.connect(this.ctx.destination);this.applySettings();this.ambient()}catch{this.ctx=null}}
 unlock(){this.init();this.ctx?.resume().catch(()=>{})}
 applySettings(s=this.settings){this.settings=s;if(this.master)this.master.gain.value=s.mute?0:s.master}
 tone(freq=440,duration=.07,type='sine',volume=.14,group='effects'){
 if(!this.ctx||this.settings.mute)return;const t=this.ctx.currentTime;let o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(35,freq*.65),t+duration);g.gain.setValueAtTime(Math.max(.0001,volume*(group==='music'?this.settings.music:this.settings.effects)),t);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+duration+.005)
 }
 play(id){const p={select:[520,.055,'sine',.11],interact:[660,.08,'triangle',.11],door:[105,.28,'sawtooth',.13],alert:[790,.4,'square',.1],step:[88,.042,'triangle',.075],choice:[440,.16,'triangle',.14],chapter:[380,.55,'sine',.15]};let [f,d,t,v]=p[id]||p.select;this.tone(f,d,t,v)}
 ambient(){if(!this.ctx)return;const o=this.ctx.createOscillator(),g=this.ctx.createGain(),filter=this.ctx.createBiquadFilter();o.type='sawtooth';o.frequency.value=41;filter.type='lowpass';filter.frequency.value=90;g.gain.value=.014*this.settings.music;o.connect(filter);filter.connect(g);g.connect(this.master);o.start();this.ambientNode={o,g,filter}}
 setCar(i){this.car=i;if(this.ambientNode){this.ambientNode.filter.frequency.setTargetAtTime([75,95,120,85,140,52][i],this.ctx.currentTime,.25);this.ambientNode.g.gain.setTargetAtTime([.018,.027,.016,.014,.035,.007][i]*this.settings.music,this.ctx.currentTime,.3)}}
 footsteps(now){if(now-this.lastStep>245){this.play('step');this.lastStep=now}}
}
