/**
 * --------------------------------------------------------------------------
 * Multiplicateur de Budget Horaire — Script Google Ads
 * --------------------------------------------------------------------------
 * Ajuste les budgets journaliers des campagnes en fonction de l'heure
 * actuelle (fuseau horaire du compte). Permet de concentrer le budget
 * sur les heures les plus performantes.
 *
 * Auteur : Thibault Fayol — Thibault Fayol Consulting
 * Site   : https://thibaultfayol.com
 * Licence: MIT
 * --------------------------------------------------------------------------
 */

var CONFIG = {
  TEST_MODE: true,
  NOTIFICATION_EMAIL: 'vous@exemple.com',
  BASE_BUDGET: 50,
  HOURLY_MULTIPLIERS: [
    0.5, 0.5, 0.5, 0.5, 0.5, 0.5,
    1.0, 1.0, 1.2, 1.5, 1.5, 1.5,
    1.5, 1.2, 1.2, 1.0, 1.0, 1.5,
    1.5, 1.5, 1.2, 1.0, 0.8, 0.5
  ],
  CAMPAIGN_LABEL: ''
};

function main() {
  try {
    Logger.log('Multiplicateur de Budget Horaire — demarrage');

    var tz = AdsApp.currentAccount().getTimeZone();
    var now = new Date();
    var today = Utilities.formatDate(now, tz, 'yyyy-MM-dd');
    var hour = parseInt(Utilities.formatDate(now, tz, 'HH'), 10);
    var multiplier = CONFIG.HOURLY_MULTIPLIERS[hour];
    var adjustedBudget = Math.round(CONFIG.BASE_BUDGET * multiplier * 100) / 100;
    var accountName = AdsApp.currentAccount().getName();

    var selector = AdsApp.campaigns().withCondition('Status = ENABLED');
    if (CONFIG.CAMPAIGN_LABEL) {
      selector = selector.withCondition("LabelNames CONTAINS_ANY ['" + CONFIG.CAMPAIGN_LABEL + "']");
    }
    var campIter = selector.get();

    var changes = [];

    while (campIter.hasNext()) {
      var camp = campIter.next();
      var currentBudget = camp.getBudget().getAmount();

      if (currentBudget !== adjustedBudget) {
        Logger.log(camp.getName() + ' : ' + currentBudget + ' -> ' + adjustedBudget + ' EUR');
        if (!CONFIG.TEST_MODE) { camp.getBudget().setAmount(adjustedBudget); }
        changes.push(camp.getName() + ' : ' + currentBudget + ' -> ' + adjustedBudget + ' EUR');
      }
    }

    var subject = '[Budget Horaire] ' + accountName + ' — Heure ' + hour;
    var body = 'Rapport Budget Horaire\nDate : ' + today + ', Heure : ' + hour +
      '\nMultiplicateur : ' + multiplier +
      '\nBudget ajuste : ' + adjustedBudget + ' EUR (base : ' + CONFIG.BASE_BUDGET + ' EUR)\n' +
      'Campagnes modifiees : ' + changes.length + '\n\n';

    if (changes.length > 0) { body += changes.join('\n') + '\n'; }
    body += '\n' + (CONFIG.TEST_MODE ? '(MODE TEST)\n' : '');

    MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, body);
    Logger.log('Termine. ' + changes.length + ' campagnes.');

  } catch (e) {
    Logger.log('ERREUR : ' + e.message);
    MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL,
      '[Budget Horaire] Erreur', e.message + '\n' + e.stack);
  }
}
