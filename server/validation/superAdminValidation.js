function isIsoDate(text) {
  return typeof text === 'string' && !Number.isNaN(Date.parse(text))
}

export function validateSchoolPayload(body) {
  const schoolId = String(body.schoolId || '').trim()
  const name = String(body.name || '').trim()
  const status = String(body.status || '').trim()
  const proprietorId = body.proprietorId ? String(body.proprietorId).trim() : null
  if (!schoolId || !name) return 'schoolId and name are required'
  if (!['active', 'pending', 'suspended'].includes(status)) return 'status must be active, pending, or suspended'
  return { schoolId, name, status, proprietorId }
}

export function validateProprietorPayload(body) {
  const username = String(body.username || '').trim().toLowerCase()
  const fullName = String(body.fullName || '').trim()
  const password = String(body.password || '')
  const schoolId = body.schoolId ? String(body.schoolId).trim() : null
  if (!username || !fullName || !password) return 'username, fullName, and password are required'
  if (password.length < 6) return 'password must be at least 6 characters'
  return { username, fullName, password, schoolId }
}

export function validatePricingPayload(body) {
  const id = body.id ? String(body.id).trim() : null
  const name = String(body.name || '').trim()
  const monthlyAmount = Number(body.monthlyAmount)
  const yearlyAmount = Number(body.yearlyAmount)
  const maxStudents = Number(body.maxStudents)
  const status = String(body.status || '').trim()
  if (!name || Number.isNaN(monthlyAmount) || Number.isNaN(yearlyAmount) || Number.isNaN(maxStudents)) {
    return 'name, monthlyAmount, yearlyAmount, and maxStudents are required'
  }
  if (!['active', 'inactive'].includes(status)) return 'status must be active or inactive'
  return { id, name, monthlyAmount, yearlyAmount, maxStudents, status }
}

export function validateSubscriptionPayload(body) {
  const schoolId = String(body.schoolId || '').trim()
  const pricingPlanId = String(body.pricingPlanId || '').trim()
  const billingCycle = String(body.billingCycle || '').trim()
  const amount = Number(body.amount)
  const startDate = String(body.startDate || '').trim()
  const expiryDate = String(body.expiryDate || '').trim()
  const status = String(body.status || '').trim()
  if (!schoolId || !pricingPlanId || Number.isNaN(amount) || !startDate || !expiryDate) {
    return 'schoolId, pricingPlanId, amount, startDate, and expiryDate are required'
  }
  if (!['monthly', 'yearly'].includes(billingCycle)) return 'billingCycle must be monthly or yearly'
  if (!['active', 'expired', 'pending', 'blocked', 'cancelled'].includes(status)) return 'invalid subscription status'
  if (!isIsoDate(startDate) || !isIsoDate(expiryDate)) return 'startDate and expiryDate must be valid ISO dates'
  return { schoolId, pricingPlanId, billingCycle, amount, startDate, expiryDate, status }
}

export function validateFinancialPayload(body) {
  const schoolId = String(body.schoolId || '').trim()
  const subscriptionId = body.subscriptionId ? String(body.subscriptionId).trim() : null
  const amount = Number(body.amount)
  const type = String(body.type || '').trim()
  const status = String(body.status || '').trim()
  const reference = String(body.reference || '').trim()
  if (!schoolId || Number.isNaN(amount) || !type || !status || !reference) {
    return 'schoolId, amount, type, status, and reference are required'
  }
  if (!['subscription_payment', 'refund', 'adjustment'].includes(type)) return 'invalid transaction type'
  if (!['success', 'pending', 'failed'].includes(status)) return 'invalid transaction status'
  return { schoolId, subscriptionId, amount, type, status, reference }
}

