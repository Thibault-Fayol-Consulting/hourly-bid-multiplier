/**
 * --------------------------------------------------------------------------
 * Hourly Budget Multiplier — Google Ads Script
 * --------------------------------------------------------------------------
 * Adjusts campaign daily budgets based on the current hour of day using the
 * account timezone. Scales a base budget up or down to shift spend toward
 * your highest-converting hours.
 *
 * Author : Thibault Fayol — Thibault Fayol Consulting
 * Website: https://thibaultfayol.com
 * License: MIT
 * --------------------------------------------------------------------------
 */

var CONFIG = {
  TEST_MODE: true,
  NOTIFICATION_EMAIL: 'you@example.com',
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
    Logger.log('Hourly Budget Multiplier — start');

    var tz = AdsApp.currentAccount().getTimeZone();
    var now = new Date();
    var today = Utilities.formatDate(now, tz, 'yyyy-MM-dd');
    var hour = parseInt(Utilities.formatDate(now, tz, 'HH'), 10);
    var multiplier = CONFIG.HOURLY_MULTIPLIERS[hour];
    var adjustedBudget = Math.round(CONFIG.BASE_BUDGET * multiplier * 100) / 100;
    var accountName = AdsApp.currentAccount().getName();

    Logger.log('Hour: ' + hour + ', multiplier: ' + multiplier + ', budget: $' + adjustedBudget);

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
        Logger.log(camp.getName() + ': $' + currentBudget + ' -> $' + adjustedBudget);

        if (!CONFIG.TEST_MODE) {
          camp.getBudget().setAmount(adjustedBudget);
        }

        changes.push(camp.getName() + ': $' + currentBudget + ' -> $' + adjustedBudget);
      }
    }

    var subject = '[Hourly Budget] ' + accountName + ' — Hour ' + hour;
    var body = 'Hourly Budget Multiplier Report\n' +
      'Date: ' + today + ', Hour: ' + hour + '\n' +
      'Multiplier: ' + multiplier + '\n' +
      'Adjusted budget: $' + adjustedBudget + ' (base: $' + CONFIG.BASE_BUDGET + ')\n' +
      'Campaigns changed: ' + changes.length + '\n\n';

    if (changes.length > 0) {
      body += changes.join('\n') + '\n';
    }

    body += '\n' + (CONFIG.TEST_MODE ? '(TEST MODE — no budgets changed)\n' : '');

    MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL, subject, body);
    Logger.log('Done. ' + changes.length + ' campaigns adjusted.');

  } catch (e) {
    Logger.log('ERROR: ' + e.message);
    MailApp.sendEmail(CONFIG.NOTIFICATION_EMAIL,
      '[Hourly Budget] Error', e.message + '\n' + e.stack);
  }
}
