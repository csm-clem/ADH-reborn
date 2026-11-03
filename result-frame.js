/** Shared result anatomy. All mode-specific rewards, data and actions are slots. */
export function resultFrame({classes,header='',summary,summaryClasses='result-summary-panel',actions,details=''}){
 return `<main id="main-content" tabindex="-1" class="${classes}" data-component="result">${header}<div class="result-layout"><section class="${summaryClasses}" data-result-summary>${summary}</section><section class="result-action-panel" data-result-actions>${actions}</section></div>${details}</main>`;
}
