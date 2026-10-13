import test from 'node:test';
import assert from 'node:assert/strict';
import {ActiveClock} from '../clock.js';
import {pluckedString} from '../sound.js';
import {fretDistance,neckGeometry,microCourse,lessons,makeProfile} from '../core.js';
test('Paused and nested orientation/gesture intervals never count as thinking time',()=>{
 let now=0;const clock=new ActiveClock(()=>now);
 now=200;clock.stop('pause');now=1200;assert.equal(clock.elapsed(),200);
 clock.stop('layout');clock.resume('pause');now=1600;assert.equal(clock.elapsed(),200);
 clock.resume('layout');now=1700;assert.equal(clock.elapsed(),300);
 clock.stop('gesture');now=2000;clock.resume('gesture');now=2100;assert.equal(clock.elapsed(),400);
 clock.stop('pause');clock.stop('pause');now=2600;clock.resume('pause');now=2700;assert.equal(clock.elapsed(),500);
});
test('Fret positions follow equal temperament and case widths decrease geometrically',()=>{
 assert.equal(fretDistance(0),0);assert.equal(fretDistance(12,648),324);
 const widths=Array.from({length:4},(_,i)=>fretDistance(i+1)-fretDistance(i));
 assert.ok(Math.abs(widths[0]-648/17.817153745105756)<1e-8);
 for(let i=1;i<4;i++)assert.ok(Math.abs(widths[i]/widths[i-1]-2**(-1/12))<1e-12);
 const g=neckGeometry(6,1);assert.equal(g.centers.length,2);assert.ok(g.fadeStart>g.frets[1]);assert.ok(g.width>g.fadeStart);
 assert.equal(neckGeometry(8,4).ys.length,8);
});
test('Plucked string has a decaying envelope, pitch periodicity, and bounded finite samples',()=>{
 let seed=1;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
 const sr=44100,hz=110,samples=pluckedString(hz,sr,1.6,random);
 const rms=(from,to)=>Math.sqrt(samples.slice(from,to).reduce((sum,v)=>sum+v*v,0)/(to-from));
 assert.equal(samples.length,70560);assert.ok(samples.every(v=>Number.isFinite(v)&&Math.abs(v)<=1));
 assert.ok(rms(1000,3000)>rms(55000,57000)*2);
 const correlation=lag=>{let sum=0;for(let i=5000;i<12000;i++)sum+=samples[i]*samples[i+lag];return sum;};
 const period=sr/hz,candidates=Array.from({length:11},(_,i)=>Math.round(period)-5+i);
 const best=candidates.reduce((a,b)=>correlation(a)>correlation(b)?a:b);
 assert.ok(Math.abs(best-period)<=2,`period ${best}, expected ${period}`);
 assert.throws(()=>pluckedString(0));
});
test('Every exercise has one short principle, a tuning-specific example and a clear objective',()=>{
 const profile=makeProfile('guitar6');
 for(const l of lessons(profile)){const course=microCourse(profile,l);for(const k of ['title','principle','example','goal'])assert.ok(course[k].length>8&&course[k].length<400);}
 assert.match(microCourse(profile,lessons(profile)[0]).example,/à vide = E ; case 1 = F/);
 assert.match(microCourse(profile,lessons(profile)[0],'latin').example,/à vide = Mi ; case 1 = Fa/);
});
