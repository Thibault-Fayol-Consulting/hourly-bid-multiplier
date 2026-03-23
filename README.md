# Hourly Budget Multiplier

A Google Ads Script that adjusts campaign daily budgets based on the current hour, allowing you to concentrate spend during your best-performing hours.

## What It Does

- Reads the current hour using the account timezone
- Multiplies a base budget by the corresponding hourly multiplier
- Applies the adjusted budget to all enabled campaigns (or those matching a label)
- Sends an email log of all changes

**Important:** This script adjusts daily budgets, not bid modifiers, because Google Ads Scripts cannot set campaign-level bid modifiers programmatically. For true hourly bid control, use ad schedules in the Google Ads UI.

## Setup

1. In Google Ads, go to **Tools & Settings > Bulk Actions > Scripts**
2. Paste the contents of `main_en.gs` (or `main_fr.gs` for French)
3. Set `BASE_BUDGET` to your normal daily budget
4. Adjust `HOURLY_MULTIPLIERS` to match your hourly performance patterns
5. Set `TEST_MODE` to `false` when ready
6. Schedule the script to run **hourly**

## CONFIG Reference

| Parameter            | Type    | Default  | Description                                                 |
|----------------------|---------|----------|-------------------------------------------------------------|
| `TEST_MODE`          | Boolean | `true`   | When true, logs changes but does not modify budgets         |
| `NOTIFICATION_EMAIL` | String  | —        | Email address for change log and error alerts               |
| `BASE_BUDGET`        | Number  | `50`     | Base daily budget in account currency                       |
| `HOURLY_MULTIPLIERS` | Array   | 24 values | Multiplier per hour (index 0 = midnight, 23 = 11 PM)      |
| `CAMPAIGN_LABEL`     | String  | `''`     | Only adjust campaigns with this label (empty = all)         |

## How It Works

1. Gets the current hour from the account timezone using `Utilities.formatDate()`
2. Calculates `BASE_BUDGET * HOURLY_MULTIPLIERS[hour]`
3. Applies the adjusted budget to matching campaigns
4. Sends an email summary

## Requirements

- Google Ads account with active campaigns
- Script must be scheduled to run **every hour**
- Google Ads Scripts access

## License

MIT — Thibault Fayol Consulting
