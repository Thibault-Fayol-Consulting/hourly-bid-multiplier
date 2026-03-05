/**
 * --------------------------------------------------------------------------
 * hourly-bid-multiplier - Google Ads Script for SMBs
 * --------------------------------------------------------------------------
 * Author: Thibault Fayol - Consultant SEA PME
 * Website: https://thibaultfayol.com
 * License: MIT
 * --------------------------------------------------------------------------
 */
var CONFIG = { TEST_MODE: true, MULTIPLIERS: [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.2, 1.2, 1.2, 1.5, 1.5, 1.5, 1.5, 1.2, 1.2, 1.0, 1.0, 1.5, 1.5, 1.5, 1.2, 1.0, 1.0, 1.0] };
function main() {
    var hour = new Date().getHours();
    var multiplier = CONFIG.MULTIPLIERS[hour];
    var campIter = AdsApp.campaigns().withCondition("Status = ENABLED").get();
    while (campIter.hasNext()) {
        var camp = campIter.next();
        var currentBidMod = camp.bidding().getBidModifier();
        if (currentBidMod !== multiplier) {
            Logger.log("Hour " + hour + " - Adjusting " + camp.getName() + " to " + multiplier);
            if (!CONFIG.TEST_MODE) camp.bidding().setBidModifier(multiplier);
        }
    }
}
