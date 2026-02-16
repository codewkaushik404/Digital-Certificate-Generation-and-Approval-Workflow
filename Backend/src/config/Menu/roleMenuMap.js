
const ROLE_MENU_MAP = {
    "USER": ["Organizations", "Events", "Certificates", "Calendar", "Settings"],
    "ADMIN": ["Register", "Users", "Roles", "Templates", "Generate", "System"],
    "FACULTY": ["Templates", "Pending", "Approved", "Rejected", "My Requests"],
    "HOD": ["Submitted", "Reports",  "My Requests"],
    "CLUB-COORDINATOR": ["Templates", "Create", "Draft", "Submitted", "Approved", "Rejected", "My Requests"],
    "PRESIDENT": ["Templates", "Create", "Draft", "Submitted", "Approved", "Rejected"],
    "CORE-TEAM": ["Approved", "Rejected"],
    "TEAM-LEAD": ["Submitted", "Approved", "Rejected"]
}

module.exports = ROLE_MENU_MAP;