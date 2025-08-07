const express = require('express');
const router = express.Router();
const reportService = require('../services/report-service');

// Middleware to extract date range query parameters
const getDateRange = (req, res, next) => {
  req.startDate = req.query.startDate;
  req.endDate = req.query.endDate;
  next();
};

// GET /report/overview
router.get('/overview', getDateRange, (req, res) => {
  try {
    const report = reportService.getOverviewReport(req.startDate, req.endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate overview report' });
  }
});

// GET /report/company/:companyId
router.get('/company/:companyId', getDateRange, (req, res) => {
  const { companyId } = req.params;
  try {
    const report = reportService.getCompanyReport(companyId, req.startDate, req.endDate);
    if (!report) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate company report' });
  }
});

// GET /report/member/:memberId
router.get('/member/:memberId', getDateRange, (req, res) => {
  const { memberId } = req.params;
  try {
    const report = reportService.getMemberReport(memberId, req.startDate, req.endDate);
    if (!report) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate member report' });
  }
});

// POST /activity
router.post('/activity', (req, res) => {
  const { memberId, date, type, hours, tags } = req.body;

  if (!memberId || !date || !type || !hours) {
    return res.status(400).json({ error: 'Missing required activity fields: memberId, date, type, hours' });
  }

  const newActivity = {
    date,
    type,
    hours,
    tags: tags || []
  };

  const success = reportService.addActivity(memberId, newActivity);

  if (success) {
    res.status(201).json({ message: 'Activity added successfully' });
  } else {
    res.status(404).json({ error: 'Member not found' });
  }
});


module.exports = router;