export const APP_NAME='Daily Fretboard Trainer';
export const RELEASE='0.13.0';
export const dataEpoch=version=>version.startsWith('0.')?version:'stable';
export const DATA_EPOCH=dataEpoch(RELEASE);
export const STATE_KEY='fretboard-trainer:settings';
export const PILOT_KEY=`fretboard-trainer:pilot:${DATA_EPOCH}`;
