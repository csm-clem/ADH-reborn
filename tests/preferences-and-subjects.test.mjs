import test from 'node:test';
import assert from 'node:assert/strict';
import {makeProfile} from '../core.js';
import {pilotPlan,practiceActivities} from '../pilot.js';
import {initialState,validateState} from '../state.js';
import {instrumentVoice} from '../sound.js';
test('Subjects describe the study material and subtitles independently describe its practice',()=>{
 const activities=practiceActivities(pilotPlan(makeProfile('guitar6')));
 assert.equal(activities[0].title,'Les cordes à vide');assert.equal(activities[0].subtitle,'Nommer les cordes');assert.equal(activities[1].title,'Les cordes à vide');assert.equal(activities[1].subtitle,'Retrouver les cordes');assert.equal(activities.find(m=>m.id==='note-11').title,'La note B');assert.equal(activities.find(m=>m.id==='note-11-find').subtitle,'Retrouver les positions');
 const latin=practiceActivities(pilotPlan(makeProfile('guitar6'),{notation:'latin'}));assert.equal(latin.find(m=>m.id==='note-11').title,'La note Si');assert.equal(latin.find(m=>m.id==='note-4').title,'La note Mi');
});
test('Explicit voices survive backup validation and override automatic instrument selection',()=>{
 for(const voice of ['auto','guitar-acoustic','guitar-clean','bass-electric']){assert.equal(validateState({...initialState(),voice}).voice,voice);for(const instrument of ['guitar6','bass5'])assert.equal(instrumentVoice(instrument,voice),voice==='auto'?(instrument==='bass5'?'bass-electric':'guitar-clean'):voice);}
 assert.throws(()=>validateState({...initialState(),voice:'unknown'}));const old={...initialState()};delete old.voice;assert.equal(validateState(old).voice,'auto');
});
