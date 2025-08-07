const { companies } = require("../data/mock-data");

// Helper function to filter activities by a date range
const filterActivitiesByDateRange = (activities, startDate, endDate) => {
  if (!startDate || !endDate) return activities;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return activityDate >= start && activityDate <= end;
  });
};

// 1. GET /report/overview
const getOverviewReport = (startDate, endDate) => {
  let totalCompanies = 0;
  let totalTeams = 0;
  let totalMembers = 0;
  let totalActivities = 0;
  let totalHours = 0;
  const activityHoursMap = new Map();

  companies.forEach(company => {
    totalCompanies++;
    company.teams.forEach(team => {
      totalTeams++;
      team.members.forEach(member => {
        totalMembers++;
        const filteredActivities = filterActivitiesByDateRange(member.activities, startDate, endDate);
        totalActivities += filteredActivities.length;
        filteredActivities.forEach(activity => {
          totalHours += activity.hours;
          activityHoursMap.set(activity.type, (activityHoursMap.get(activity.type) || 0) + activity.hours);
        });
      });
    });
  });

  const topActivityTypes = Array.from(activityHoursMap.entries())
    .map(([type, totalHours]) => ({ type, totalHours }))
    .sort((a, b) => b.totalHours - a.totalHours);

  return {
    totalCompanies,
    totalTeams,
    totalMembers,
    totalActivities,
    totalHours,
    topActivityTypes
  };
};

// 2. GET /report/company/:companyId - UPDATED
const getCompanyReport = (companyId, startDate, endDate) => {
  const company = companies.find(c => c.companyId === companyId);
  if (!company) return null;

  const activitySummaryByType = new Map();

  const teams = company.teams.map(team => {
    let totalHours = 0;
    const activityBreakdownMap = new Map();
    const uniqueTags = new Set();
    const totalMembers = team.members.length;

    team.members.forEach(member => {
      const filteredActivities = filterActivitiesByDateRange(member.activities, startDate, endDate);
      
      // Update activity summary for the entire company
      filteredActivities.forEach(activity => {
        const activityType = activitySummaryByType.get(activity.type) || { totalHours: 0, members: new Set() };
        activityType.totalHours += activity.hours;
        activityType.members.add(member.memberId);
        activitySummaryByType.set(activity.type, activityType);
      });

      // Update for team-specific breakdown
      totalHours += filteredActivities.reduce((sum, activity) => sum + activity.hours, 0);
      filteredActivities.forEach(activity => {
        activityBreakdownMap.set(activity.type, (activityBreakdownMap.get(activity.type) || 0) + activity.hours);
        activity.tags.forEach(tag => uniqueTags.add(tag));
      });
    });

    const activityBreakdown = Array.from(activityBreakdownMap.entries())
      .map(([type, totalHours]) => ({ type, totalHours }));

    return {
      teamId: team.teamId,
      teamName: team.name,
      totalMembers,
      totalHours,
      activityBreakdown,
      uniqueTags: Array.from(uniqueTags)
    };
  });

  // Convert the activitySummaryByType map into the required object format
  const activitySummary = {};
  for (const [type, data] of activitySummaryByType.entries()) {
    activitySummary[type] = {
      totalHours: data.totalHours,
      members: data.members.size
    };
  }

  return {
    companyId: company.companyId,
    companyName: company.name,
    teams,
    activitySummaryByType: activitySummary
  };
};

// 3. GET /report/member/:memberId
const getMemberReport = (memberId, startDate, endDate) => {
  let memberFound = null;
  for (const company of companies) {
    for (const team of company.teams) {
      memberFound = team.members.find(m => m.memberId === memberId);
      if (memberFound) break;
    }
    if (memberFound) break;
  }

  if (!memberFound) return null;

  const filteredActivities = filterActivitiesByDateRange(memberFound.activities, startDate, endDate);
  const totalHours = filteredActivities.reduce((sum, activity) => sum + activity.hours, 0);
  
  const dailyBreakdownMap = new Map();
  filteredActivities.forEach(activity => {
    const dailyEntry = dailyBreakdownMap.get(activity.date) || { date: activity.date, activities: [], hours: 0 };
    dailyEntry.activities.push(activity.type);
    dailyEntry.hours += activity.hours;
    dailyBreakdownMap.set(activity.date, dailyEntry);
  });

  const dailyBreakdown = Array.from(dailyBreakdownMap.values()).sort((a, b) => new Date(a.date) - new Date(b.date));

  return {
    memberId: memberFound.memberId,
    name: memberFound.name,
    totalHours,
    dailyBreakdown
  };
};

// New function to add an activity
const addActivity = (memberId, newActivity) => {
  let memberFound = null;
  for (const company of companies) {
    for (const team of company.teams) {
      memberFound = team.members.find(m => m.memberId === memberId);
      if (memberFound) {
        memberFound.activities.push(newActivity);
        return true;
      }
    }
  }
  return false;
};

module.exports = {
  getOverviewReport,
  getCompanyReport,
  getMemberReport,
  addActivity
};