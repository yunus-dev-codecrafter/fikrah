import { Router } from 'express'
import { authMiddleware, requireRoles } from '../middleware/auth.js'
import {
  createFinancialController,
  createProprietorController,
  createSchoolController,
  createSubscriptionController,
  enforceSubscriptionsController,
  exportController,
  getAnalyticsController,
  getExpiringAlertsController,
  globalSearchController,
  listAuditController,
  listFinancialController,
  listPricingController,
  listProprietorsController,
  listSchoolsController,
  listSubscriptionsController,
  upsertPricingController,
} from '../controllers/superAdminController.js'

const router = Router()

router.use(authMiddleware, requireRoles('super-admin'))

router.get('/analytics/summary', getAnalyticsController)
router.get('/search', globalSearchController)
router.get('/alerts/expiring-subscriptions', getExpiringAlertsController)
router.post('/subscriptions/enforce-expiry', enforceSubscriptionsController)

router.get('/schools', listSchoolsController)
router.post('/schools', createSchoolController)

router.get('/proprietors', listProprietorsController)
router.post('/proprietors', createProprietorController)

router.get('/pricing', listPricingController)
router.post('/pricing', upsertPricingController)

router.get('/subscriptions', listSubscriptionsController)
router.post('/subscriptions', createSubscriptionController)

router.get('/financial', listFinancialController)
router.post('/financial', createFinancialController)

router.get('/audit-logs', listAuditController)

router.get('/export/:type', exportController)

export default router

