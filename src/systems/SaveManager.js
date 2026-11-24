import {deserialize,serialize,importVersionOne} from './GameState.js';
const KEY='carriage-divide.save.2.0',LEGACY='carriage-divide.save.1.0',SETTINGS='carriage-divide.settings.v1';
export class SaveManager{
 constructor(storage=typeof localStorage!=='undefined'?localStorage:null){this.storage=storage}
 save(state){try{this.storage?.setItem(KEY,serialize(state));return !!this.storage}catch{return false}}
 load(){try{return deserialize(this.storage?.getItem(KEY))||importVersionOne(this.storage?.getItem(LEGACY))}catch{return null}}
 hasSave(){return this.load()!==null}
 hasImportedSave(){try{return !this.storage?.getItem(KEY)&&Boolean(importVersionOne(this.storage?.getItem(LEGACY)))}catch{return false}}
 clear(){try{this.storage?.removeItem(KEY);return true}catch{return false}}
 getSettings(){try{return {...this.defaults(),...JSON.parse(this.storage?.getItem(SETTINGS)||'{}')}}catch{return this.defaults()}}
 defaults(){return {master:0.65,music:0.3,effects:0.75,textSpeed:30,reducedMotion:false,mute:false,language:'en'}}
 putSettings(s){try{this.storage?.setItem(SETTINGS,JSON.stringify(s));return true}catch{return false}}
}
