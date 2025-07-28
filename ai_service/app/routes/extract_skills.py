# ai_service/app/routes/extract_skills.py
from fastapi import APIRouter
from pydantic import BaseModel
import re

router = APIRouter()

# Canonical skill bank (already lowercased and stripped)
skill_bank = [s.lower().replace('.js', '') for s in [
    "Python", "Java", "JavaScript", "C++", "C#", "SQL", "HTML", "CSS", "React", "Node", "MongoDB", 
    "AWS", "Docker", "Kubernetes", "Git", "REST", "GraphQL", "Linux", "TensorFlow", "Power BI", "Excel",
    "Market Research", "Business Strategy", "Product Management", "Customer Relationship Management",
    "CRM", "Salesforce", "KPI Tracking", "Marketing Analytics", "Brand Management",
    "Digital Marketing", "Email Marketing", "SEO", "Google Analytics", "Content Creation",
    "Copywriting", "Advertising", "Social Media Management", "Facebook Ads", "Google Ads",
    "Agile", "Scrum", "OKRs", "Budgeting", "Vendor Management", "Stakeholder Management",
    "Financial Analysis", "Bookkeeping", "Accounts Payable", "Accounts Receivable",
    "Budget Forecasting", "SAP", "Oracle Financials", "QuickBooks", "Tax Filing",
    "Investment Analysis", "Risk Management", "Auditing", "Payroll", "Excel", "ERP Systems",
    "Legal Research", "Contract Drafting", "Litigation", "Legal Writing",
    "Case Management", "Compliance Analysis", "Data Privacy", "GDPR", "HIPAA",
    "Trademark Law", "Corporate Law", "Employment Law", "Due Diligence",
    "Clinical Research", "Patient Care", "Medical Coding", "ICD-10", "HIPAA Compliance",
    "Healthcare Analytics", "EMR", "EHR", "Meditech", "Phlebotomy", "Medical Billing",
    "Pharmacy Tech", "CPR Certified", "Nursing", "Triage", "Radiology", "Lab Testing",
    "Curriculum Design", "Lesson Planning", "Classroom Management", "Special Education",
    "Instructional Design", "LMS", "Canvas", "Blackboard", "Educational Psychology",
    "ESL", "TOEFL", "Student Counseling", "eLearning", "Zoom", "Google Classroom",
    "Graphic Design", "Video Editing", "Photography", "Adobe Photoshop", "Illustrator",
    "After Effects", "Final Cut Pro", "Canva", "UX Design", "UI Design", "3D Modeling",
    "Animation", "Copyediting", "Creative Writing", "Scriptwriting", "Content Strategy",
    "Inventory Management", "Warehouse Operations", "Supply Chain Planning",
    "Procurement", "Vendor Relations", "SAP", "Oracle SCM", "Logistics Coordination",
    "Freight Management", "Shipping Documentation", "Demand Forecasting",
    "Communication", "Leadership", "Teamwork", "Time Management", "Critical Thinking",
    "Problem Solving", "Negotiation", "Adaptability", "Empathy", "Conflict Resolution",
    "Multitasking", "Attention to Detail", "Decision Making", "Presentation Skills",
    "Recruiting", "Onboarding", "HRIS", "Workday", "PeopleSoft", "Payroll Processing",
    "Benefits Administration", "Policy Writing", "Employee Engagement", "Talent Acquisition",
    "Labor Law Compliance", "Job Descriptions", "Interviewing", "Timesheet Management",
    "Academic Writing", "Research Methods", "Literature Review", "Statistical Analysis",
    "SPSS", "R", "Data Collection", "Peer Review", "Grant Writing", "Survey Design",
    "Customer Service", "Point of Sale", "Cash Handling", "Conflict Resolution",
    "Shift Scheduling", "Barista", "Bartending", "Reservations", "Event Planning",
    "Housekeeping", "Guest Services", "Front Desk Operations", "Upselling",
    "Carpentry", "Plumbing", "HVAC", "Electrical Wiring", "Blueprint Reading",
    "Forklift Operation", "Welding", "Machine Maintenance", "Safety Compliance",
    "OSHA Certified", "Tool Handling", "Construction Management", "Auto Repair"
]]

class JDInput(BaseModel):
    job_description: str

@router.post("/extract-skills")
async def extract_skills(data: JDInput):
    jd = data.job_description.lower()
    jd_tokens = set(re.findall(r'\b[a-z0-9+#\-.]+\b', jd))
    matched_skills = [skill for skill in skill_bank if any(part in jd_tokens for part in skill.split())]

    print(" Extracted Required Skills:", matched_skills)
    return {"required_skills": list(set(matched_skills))}
