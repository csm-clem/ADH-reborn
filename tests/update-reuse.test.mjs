import test from 'node:test';import assert from 'node:assert/strict';
import {UpdateController} from '../services/update-service.js';import {UPDATE_VERSION} from '../release.js';
test('Startup reuses the matching active worker, including repair URLs, but not a parent scope',async()=>{
 const oldNav=Object.getOwnPropertyDescriptor(globalThis,'navigator'),oldLocation=Object.getOwnPropertyDescriptor(globalThis,'location');
 try{for(const sameScope of [true,false]){
  let registers=0,updates=0;const registration={scope:sameScope?'https://example.test/DFT/lab/':'https://example.test/DFT/',active:{scriptURL:'https://example.test/sw.js?repair=123'},addEventListener(){},update:async()=>{updates++;}},own={...registration,scope:'https://example.test/DFT/lab/'};
  Object.defineProperty(globalThis,'location',{configurable:true,value:{href:'https://example.test/DFT/lab/'}});
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{serviceWorker:{getRegistration:async()=>registration,register:async()=>{registers++;return own;},addEventListener(){}}}});
  const controller=new UpdateController({beforeUpdate:()=>true});controller.workerVersion=async()=>UPDATE_VERSION;controller.checkRelease=async()=>{};await controller.start();assert.equal(registers,sameScope?0:1);assert.equal(updates,1);
 }}finally{if(oldNav)Object.defineProperty(globalThis,'navigator',oldNav);else delete globalThis.navigator;if(oldLocation)Object.defineProperty(globalThis,'location',oldLocation);else delete globalThis.location;}
});
