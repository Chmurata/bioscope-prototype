// Shared currency formatting for the voucher surfaces — the dollar
// denomination is always the headline, the taka price is the secondary
// transactional line. Format here once so no component hand-rolls
// thousands separators or the ৳ prefix.

export const formatUsd = (amount) => `$${amount}`;

export const formatBdt = (amount) => `৳${Math.round(amount).toLocaleString('en-US')}`;
