/**
 * @typedef {Object} Property
 * @property {string} id
 * @property {string} user_id
 * @property {string} name
 * @property {'apartment'|'house'|'land'|'shop'|'factory'} type
 * @property {'rented'|'vacant'|'non_rental'} status
 * @property {string} [address]
 * @property {number} [latitude]
 * @property {number} [longitude]
 * @property {number} [purchase_price]
 * @property {number} [current_value]
 * @property {number} [loan_balance]
 * @property {string} [loan_bank]
 * @property {string} [title_deed_no]
 * @property {string} [notes]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Insurance
 * @property {string} id
 * @property {string} [property_id]
 * @property {string} user_id
 * @property {'fire'|'flood'|'home'|'mlta'|'mrta'|'other'} type
 * @property {string} company
 * @property {string} policy_no
 * @property {number} sum_insured
 * @property {number} annual_premium
 * @property {string} start_date
 * @property {string} end_date
 * @property {string} [notes]
 */

/**
 * @typedef {Object} Tenancy
 * @property {string} id
 * @property {string} property_id
 * @property {string} tenant_name
 * @property {string} [tenant_ic]
 * @property {string} [tenant_phone]
 * @property {string} [tenant_email]
 * @property {string} start_date
 * @property {string} end_date
 * @property {number} monthly_rent
 * @property {number} [deposit]
 */

/**
 * @typedef {Object} TaxRecord
 * @property {string} id
 * @property {string} property_id
 * @property {'cukai_pintu'|'cukai_tanah'|'cukai_keuntungan'} tax_type
 * @property {string} [council]
 * @property {string} [account_no]
 * @property {number} amount
 * @property {string} due_date
 * @property {boolean} paid
 * @property {string} [paid_date]
 */
