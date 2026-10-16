import test from 'node:test';
import assert from 'node:assert/strict';
import {PilotController} from '../pilot-ui.js';
import {makeProfile} from '../core.js';
import {naturalDiagnostic,questionsFor} from '../pilot.js';
test('A diagnostic with a sufficient question score but failed families asks for another attempt',()=>{
 const profile=makeProfile('guitar6'),controller=new PilotController({getState:()=>({profile,notation:'international',sound:false})}),queue=questionsFor(naturalDiagnostic(profile));
 controller.session={id:'failed-families',activity:'natural-diagnostic',queue,events:queue.map(q=>({...q,correct:true,aids:[],ms:3000})),stage:'result',motifIndex:0,familyErrors:1};
 controller.data.diagnostic={passed:false};
 const html=controller.result();assert.match(html,/Des repères restent à confirmer/);assert.match(html,/>Refaire cette activité<\/button><div class="result-secondary-actions">/);assert.match(html,/certains repères du diagnostic restent à confirmer/);assert.doesNotMatch(html,/objectif atteint|Leçon suivante/);
});
