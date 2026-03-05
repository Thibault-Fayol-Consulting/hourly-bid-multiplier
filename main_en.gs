/**
 * hourly-bid-multiplier - Google Ads Script for SMBs
 * Author: Thibault Fayol
 */
var CONFIG = { TEST_MODE: true, MULTIPLIERS: [1.0, 1.2, 0.8] }; // Example hours
function main(){
  var hour = new Date().getHours();
  var mult = CONFIG.MULTIPLIERS[hour] || 1.0;
  var campIter = AdsApp.campaigns().withCondition("Status = ENABLED").get();
  while(campIter.hasNext()){
    var camp = campIter.next();
    Logger.log("Setting bid modifier to " + mult + " for " + camp.getName());
    if(!CONFIG.TEST_MODE){ camp.bidding().setBidModifier(mult); }
  }
}