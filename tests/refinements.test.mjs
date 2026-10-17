import test from 'node:test';
import assert from 'node:assert/strict';
import {ActiveClock} from '../clock.js';
import {pluckedString} from '../sound.js';
import {fretDistance,neckGeometry,fitNeck} from '../core.js';
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
 const g=neckGeometry(6,1);assert.equal(g.centers.length,2);assert.equal(g.fadeStart,g.frets[1]);assert.equal(g.width,g.frets[1]+(g.frets[2]-g.frets[1])*.5);
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
test('All positions fit without horizontal panning and outer string margins stay narrow',()=>{
 for(const strings of [4,5,6,7,8])for(const last of [0,1,2,3,4])for(const [w,h] of [[140,180],[320,140],[410,220],[900,700]]){
  const g=neckGeometry(strings,last),f=fitNeck(g,w,h);assert.ok(f.width<=w&&f.height<=h);
  assert.equal(g.width,g.frets[last]+(g.frets[last+1]-g.frets[last])*.5);assert.ok(Math.min(...g.ys)<=5);assert.ok(g.height-Math.max(...g.ys)<=12);
  for(const x of g.centers)for(const y of g.ys){assert.ok(x*f.scale>=0&&x*f.scale<f.width);assert.ok(y*f.scale>=0&&y*f.scale<f.height);}
 }
});
