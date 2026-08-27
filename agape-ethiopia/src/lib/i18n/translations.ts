export type Locale = "en" | "am" | "om" | "ti";

export const supportedLocales: Locale[] = ["en", "am", "om", "ti"];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  am: "አማርኛ",
  om: "Afaan Oromo",
  ti: "ትግርኛ",
};

export type TranslationDictionary = Record<string, string>;

export const translations: Record<Locale, TranslationDictionary> = {
  en: {
    "home": "Home",
    "about": "About",
    "services": "Services",
    "contact": "Contact",
    "donations": "Donations",
    "partners": "Partners",
    "partnerPortalTitle": "Partnership portal",
    "partnerPortalHeroTitle": "Partner With AGAPE MOBILITY ETHIOPIA",
    "partnerPortalHeroDescription": "Organizations can collaborate with AGAPE MOBILITY ETHIOPIA to improve mobility services for persons with disabilities throughout Ethiopia.",
    "partnerPortalCard": "Partnership portal",
    "partnerPortalCardDescription": "Download the official agreement, upload a signed copy, and track review progress.",
    "partnershipInformation": "Partnership information",
    "partnershipMission": "Mission",
    "partnershipMissionText": "Support inclusive mobility services and compassionate care for persons with disabilities.",
    "partnershipBenefits": "Benefits",
    "partnershipBenefitsText": "Create shared referral pathways, strengthen service access, and improve community impact.",
    "partnershipWhoCanJoin": "Who can partner",
    "partnershipWhoCanJoinText": "Hospitals, clinics, rehabilitation centers, NGOs, government organizations, charities, churches, and international partners.",
    "partnershipProcess": "Required process",
    "partnershipProcessText": "Review the agreement, sign it, and upload the signed PDF for review.",
    "officialAgreement": "Official document",
    "officialAgreementTitle": "Official Partnership Agreement",
    "officialAgreementDescription": "Download the official partnership agreement, review it carefully, sign it, and upload the signed copy below.",
    "downloadAgreement": "Download Agreement",
    "uploadSignedAgreementTitle": "Upload signed agreement",
    "uploadSignedAgreementDescription": "Share your organization details and upload the signed PDF so the AGAPE MOBILITY ETHIOPIA team can review it.",
    "organizationName": "Organization Name",
    "organizationType": "Organization Type",
    "contactPerson": "Contact Person",
    "agreementNumber": "Agreement Number",
    "uploadSignedPdf": "Upload Signed PDF",
    "uploadAgreement": "Upload Agreement",
    "uploadAgreementLimit": "Accepted format: PDF only. Maximum file size: 20 MB.",
    "uploadingAgreement": "Uploading agreement...",
    "uploadAgreementSuccess": "Your signed agreement was uploaded successfully. It is now pending review.",
    "uploadAgreementValidation": "Please complete every required field before uploading.",
    "uploadAgreementPdfOnly": "Please upload a PDF file.",
    "uploadAgreementSelectPdf": "Please select a PDF agreement.",
    "uploadAgreementSize": "The selected file exceeds the 20 MB limit.",
    "uploadAgreementStorageUnavailable": "Agreement storage is temporarily unavailable.",
    "uploadAgreementPermissionDenied": "You do not have permission to upload agreements.",
    "uploadAgreementRecordFailed": "The agreement was uploaded, but saving its record failed. Please try again.",
    "uploadAgreementError": "Unable to upload agreement. Please try again.",
    "agreementUnavailable": "This agreement is not available right now.",
    "agreementManagement": "Agreement management",
    "agreementManagementTitle": "Agreement review workspace",
    "agreementManagementDescription": "Search submissions, review uploaded agreements, and update their status.",
    "searchAgreements": "Search agreements",
    "loadingAgreements": "Loading agreements...",
    "noAgreements": "No agreements have been submitted yet.",
    "agapeMenu": "AGAPE MOBILITY ETHIOPIA Menu",
    "agapeMenuDescription": "Quick navigation across the main AGAPE MOBILITY ETHIOPIA modules",
    "navigation.agapeRegistration": "Agape Registration",
    "aboutTitle": "About AGAPE MOBILITY ETHIOPIA",
    "aboutDescription": "AGAPE MOBILITY ETHIOPIA helps people with disabilities access mobility support, rehabilitation, and compassionate community care.",
    "servicesTitle": "Our services",
    "servicesDescription": "A full-service support pathway from registration to assessment, distribution, and follow-up.",
    "contactTitle": "Contact us",
    "contactDescription": "Reach out to our team for partnerships, beneficiary support, or general inquiries.",
    "donationsTitle": "Support the mission",
    "donationsDescription": "Your contribution funds wheelchairs, mobility aids, and follow-up support for persons with disabilities in Ethiopia.",
    "partnersTitle": "Organization partnerships",
    "partnersDescription": "We work with hospitals, clinics, rehabilitation centers, NGOs, and government agencies to improve access and impact.",
    "impactStats": "Impact stats",
    "partnerNetwork": "Partner network",
    "beneficiariesSupported": "Beneficiaries supported",
    "partnerOrganizations": "Partner organizations",
    "beneficiaries": "Beneficiaries",
    "newRegistration": "New registration",
    "registerBeneficiary": "Register beneficiary",
    "beneficiaryRegistry": "Beneficiary Registry",
    "heroTitle": "No More Crawling on the Floor",
    "heroSubtitle": "Your support brings hope, restores dignity, and changes lives in Ethiopia.",
    "beneficiaryRegistration": "Beneficiary Registration",
    "equipmentTracking": "Equipment Tracking",
    "assessmentManagement": "Assessment Management",
    "ourMission": "Our Mission",
    "ourMissionTitle": "Our Mission",
    "ourMissionText": "Provide compassionate mobility assistance and comprehensive beneficiary support services across Ethiopia.",
    "ourReach": "Our Reach",
    "ourReachTitle": "Our Reach",
    "ourReachText": "Visualizing our recent outreach and beneficiary impact.",
    "operationalDashboard": "Operational Dashboard",
    "dashboardDescription": "The interface provides comprehensive tracking of impact metrics, donations, requests, and administrative oversight with real-time Supabase integration.",
    "selfRegistrationCard": "Self registration",
    "selfRegistrationTitle": "Self registration",
    "selfRegistrationText": "Beneficiaries can submit their full profile, contact details, and photo directly.",
    "staffPanelCard": "Staff panel",
    "staffPanelTitle": "Staff panel",
    "staffPanelText": "Staff can save, review, edit, and manage beneficiary registrations and workflow actions.",
    "adminPanelCard": "Admin panel",
    "adminPanelTitle": "Admin panel",
    "adminPanelText": "Administrators can manage users, site content, and the wider system from one place.",
    "registrationNumber": "Registration number",
    "registrationDate": "Registration date",
    "firstName": "First name",
    "fathersName": "Father's name",
    "grandfathersName": "Grandfather's name",
    "dateOfBirth": "Date of birth",
    "gender": "Gender",
    "male": "Male",
    "female": "Female",
    "phone": "Phone",
    "region": "Region",
    "woredaZone": "Woreda / Zone",
    "kifleKetema": "Kifle Ketema",
    "houseNumber": "House number",
    "notes": "Notes",
    "save": "Save beneficiary",
    "savingRecord": "Saving beneficiary record...",
    "savedSuccessfully": "Beneficiary registered successfully!",
    "saveFailed": "Save failed:",
    "searchTerm": "Search term",
    "searchBeneficiaries": "Search beneficiaries",
    "equipmentType": "Equipment type",
    "beneficiaryProfile": "Beneficiary Profile",
    "loadingRecord": "Loading beneficiary record and history...",
    "viewProfile": "View profile",
    "uploadPhoto": "Upload photo",
    "selectLanguage": "Language",
    "login": "Login",
    "loginPrompt": "to access the AGAPE MOBILITY ETHIOPIA management system",
    "password": "Password",
    "signingIn": "Signing in...",
    "signIn": "Sign in",
    "signOut": "Sign out",
    "profileLoaded": "Beneficiary profile loaded.",
    "noRecords": "No beneficiary records match your search.",
    "loadingRecent": "Loading recent beneficiary records...",
    "showRecent": "Showing the most recent beneficiary records.",
    "invalidFileType": "Invalid image type. Use JPG, JPEG, PNG, or WEBP.",
    "invalidFileSize": "Image too large. Maximum size is 3 MB.",
    "autoGeneratedOnly": "Auto-generated on save",
    "uploadPhotoLabel": "Beneficiary photo",
    "dashboard": "Dashboard",
    "systemSettings": "System settings",
    "userManagement": "User management",
    "reports": "Reports",
    "settings": "Settings",
    "unauthorized": "Unauthorized access. Please sign in with a valid account.",
    "loading": "Loading...",
    "liveDashboard": "Welcome to AGAPE MOBILITY ETHIOPIA",
    "languageUpdated": "Language updated.",
    "applicationName": "AGAPE MOBILITY ETHIOPIA",
    "applicationTagline": "Mobility Management System",
    "searchPlaceholder": "Name, reg. number, phone, region, kebele",
    "roleStaff": "Staff",
    "roleAdmin": "Administrator",
    "adminPanel": "Admin panel",
    "adminCenter": "Admin Center",
    "adminCenterDescription": "Review urgent requests, mark items as matched, and manage logistics queues.",
    "openRequests": "Open requests",
    "availableWheelchairs": "Available wheelchairs",
    "beneficiary": "Beneficiary",
    "item": "Item",
    "status": "Status",
    "unnamed": "Unnamed",
    "statusPending": "Pending",
    "statusMatched": "Matched",
    "statusDelivered": "Delivered",
    "users": "Users",
    "usersDescription": "Manage application accounts and assign roles for administrators and staff.",
    "unknownProfile": "Unknown profile",
    "overview": "Overview",
    "buttonLabel": "Button label",
    "supabaseNotConfigured": "Supabase is not configured.",
    "email": "Email",
    "role": "Role",
    "access": "Access",
    "actions": "Actions",
    "disabled": "Disabled",
    "active": "Active",
    "enable": "Enable",
    "disable": "Disable",
    "noUsersFound": "No users found.",
    "assessmentReady": "Ready to add a new assessment.",
    "savingAssessment": "Saving assessment...",
    "saveAssessment": "Save assessment",
    "assessmentSaved": "Assessment saved successfully.",
    "newAssessment": "New Assessment",
    "assessmentDescription": "Capture structured wheelchair measurement data for a beneficiary.",
    "beneficiaryId": "Beneficiary ID",
    "beneficiaryIdPlaceholder": "Beneficiary UUID",
    "hipWidth": "Hip Width",
    "hipWidthPlaceholder": "Hip width",
    "measurements": "Measurements",
    "measurementsPlaceholder": "Height, seat depth, etc.",
    "wheelchairFitting": "Wheelchair fitting",
    "wheelchairFittingPlaceholder": "Fitting information",
    "recommendations": "Recommendations",
    "recommendationsPlaceholder": "Recommended device, follow-up actions, or referrals",
    "seatDepth": "Seat Depth",
    "seatDepthPlaceholder": "Seat depth",
    "backHeight": "Back Height",
    "backHeightPlaceholder": "Back height",
    "recommendedEquipment": "Recommended equipment",
    "selectEquipment": "Select equipment",
    "adultWheelchair": "Adult Wheelchair",
    "childrenWheelchair": "Children Wheelchair",
    "crutches": "Crutches",
    "walker": "Walker",
    "other": "Other",
    "recommendedSize": "Recommended size",
    "selectSize": "Select size",
    "sizeSmall": "Small",
    "sizeMedium": "Medium",
    "sizeLarge": "Large",
    "sizeXL": "Extra Large",
    "assessorName": "Assessor name",
    "assessorNamePlaceholder": "Assessor name",
    "assessmentDate": "Assessment date",
    "additionalAssessmentNotes": "Additional assessment notes",
    "equipmentPlaceholder": "Wheelchair, crutches, walker",
    "kebele": "Kebele",
    "equipment": "Equipment",
    "addEquipmentAssignment": "Add equipment assignment",
    "assignmentNotesPlaceholder": "Condition, special needs, delivery details",
    "assignmentReady": "Ready to add equipment assignment.",
    "assignmentSaved": "Equipment assignment saved successfully.",
    "issueDate": "Issue date",
    "mobilityAssessment": "Mobility assessment",
    "notRecorded": "Not recorded",
    "notSpecified": "Not specified",
    "noAssessmentsFound": "No assessments found for this beneficiary.",
    "noBeneficiarySelected": "No beneficiary selected.",
    "noEquipmentDistributionsFound": "No equipment distributions found for this beneficiary.",
    "noNotesProvided": "No notes provided.",
    "receivedBy": "Received by",
    "registrationDetails": "Registration details",
    "registerDescription": "Capture registration details for AGAPE MOBILITY ETHIOPIA beneficiaries and preserve records for future assessment and assignment tracking.",
    "registrationReady": "Ready to register a beneficiary.",
    "selectGender": "Select gender",
    "size": "Size",
    "unknownDate": "Unknown date",
    "unknown": "Unknown",
    "unableToLoadBeneficiary": "Unable to load beneficiary:",
    "trackAssignedEquipment": "Track issued mobility equipment for this beneficiary.",
    "exampleFirstName": "Example: Amanuel",
    "exampleMiddleName": "Example: Bekele",
    "exampleLastName": "Example: Tadesse",
    "examplePhone": "Example: +251 9xx xxx xxx",
    "exampleRegion": "Addis Ababa, Oromia, Amhara",
    "exampleNeighborhood": "Neighborhood or sub-city",
    "exampleKebele": "Kebele",
    "exampleHouseNumber": "House number",
    "notesPlaceholder": "Optional disability, access, or support details.",
    "unknownBeneficiary": "Unknown beneficiary",
    "searching": "Searching beneficiaries...",
    "foundRecords": "Found {{count}} beneficiary record(s).",
    "foundRecordsPrefix": "Found",
    "loadingApplications": "Loading applications...",
    "unableToLoadApplications": "Unable to load applications:",
    "applicationsLoaded": "Applications loaded.",
    "unableToLoadApplicationsShort": "Unable to load applications.",
    "unableToUpdateStatus": "Unable to update status:",
    "statusUpdated": "Status updated to",
    "unableToSaveChanges": "Unable to save changes:",
    "beneficiaryUpdated": "Beneficiary details updated.",
    "staffReviewDashboard": "Staff review dashboard",
    "staffReviewDescription": "Review registrations and approve or reject each case.",
    "allStatuses": "All statuses",
    "statusApproved": "Approved",
    "statusRejected": "Rejected",
    "edit": "Edit",
    "approve": "Approve",
    "reject": "Reject",
    "location": "Location",
    "needs": "Needs",
    "saveChanges": "Save changes",
    "cancel": "Cancel",
    "saving": "Saving...",
    "noApplicationsMatch": "No applications match this filter.",
    "distribution": "Distribution",
    "equipmentDistribution": "Equipment Distribution",
    "operationalReports": "Operational Reports",
    "operations": "Operations",
    "operationalActions": "Operational Actions",
    "operationsDescription": "Use the core workflow actions to register beneficiaries, capture assessments, and record distributions.",
    "action.registerBeneficiary.title": "Register Beneficiary",
    "action.registerBeneficiary.desc": "Add a new beneficiary record.",
    "action.searchBeneficiary.title": "Search Beneficiary",
    "action.searchBeneficiary.desc": "Search existing beneficiaries.",
    "action.newAssessment.title": "New Assessment",
    "action.newAssessment.desc": "Record wheelchair assessment measurements.",
    "action.distributeEquipment.title": "Distribute Equipment",
    "action.distributeEquipment.desc": "Record equipment distribution events.",
    "action.reports.title": "Distribution Reports",
    "action.reports.desc": "View operational reports and summaries.",
    "offline.title": "You're Offline",
    "offline.message": "It looks like you've lost your internet connection. Some features may not be available right now.",
    "offline.whatYouCanDoTitle": "What you can do:",
    "offline.checkConnection": "Check your internet connection",
    "offline.viewCached": "View previously cached pages",
    "offline.reviewSaved": "Review saved information",
    "offline.tryAgain": "Try Again",
    "offline.goBack": "Go Back",
    "offline.reconnectInfo": "Your app will work normally once you reconnect to the internet.",
    "offline.icon": "ð¡",
    "register.title": "Beneficiary registration",
    "register.description": "Submit your support request and it will be reviewed by the AGAPE MOBILITY ETHIOPIA team.",
    "impact.header": "Master Home",
    "impact.title": "Matching mobility support to urgent requests in real time.",
    "impact.description": "AGAPE MOBILITY ETHIOPIA’s dashboard turns incoming donations and beneficiary requests into a live logistics flow for wheelchairs, mobility aids, and urgent support coordination.",
    "impact.insightLabel": "Live matching insight",
    "impact.pendingRequestsSymbol": "pending requests â",
    "impact.donationRecords": "donation records",
    "impact.insightDescription": "This is the live operational snapshot the admin panel uses to prioritize next matching actions.",
    "impact.statRequestsLabel": "urgent mobility requests",
    "impact.statDonationsLabel": "donation records in flight",
    "impact.liveLabel": "Live",
    "impact.syncStatusLabel": "Supabase sync status",
    "beneficiaries.totalRegisteredLabel": "Total registered",
    "beneficiaries.totalRegisteredTitle": "Manage all beneficiaries",
    "beneficiaries.assessmentsLabel": "Assessments",
    "beneficiaries.assessmentsTitle": "Track mobility evaluations",
    "beneficiaries.equipmentLabel": "Equipment",
    "beneficiaries.equipmentTitle": "Monitor assignments & history",
    "coreServices.title": "Core Services",
    "coreServices.text": "Beneficiary registration, mobility assessments, equipment distribution, and impact tracking.",
    "impactDriven.title": "Impact Driven",
    "impactDriven.text": "Transparent reporting, data-driven decisions, and measurable community impact.",
    "beneficiaryReport.title": "Beneficiary Report",
    "beneficiaryReport.description": "Recent beneficiaries with registration and location details.",
    "distributionReport.title": "Distribution Report",
    "distributionReport.description": "Recent equipment distributions and recipient details.",
    "report.regNumber": "Reg. #",
    "report.name": "Name",
    "report.region": "Region",
    "report.kebele": "Kebele",
    "report.date": "Date",
    "report.beneficiary": "Beneficiary",
    "report.equipment": "Equipment",
    "report.size": "Size",
    "report.loadingBeneficiaries": "Loading beneficiaries...",
    "report.noBeneficiaries": "No beneficiaries found.",
    "report.loadingDistributions": "Loading distribution records...",
    "report.noDistributions": "No distribution records found.",
    "equipment.sizeSummary.title": "Equipment Size Distribution Summary",
    "equipment.sizeSummary.description": "Summary of distributed equipment by type and size.",
    "equipment.sizeSummary.loading": "Loading summary...",
    "equipment.sizeSummary.empty": "No distribution data available.",
    "request.title": "Request Portal",
    "request.description": "Log urgent mobility requests from beneficiaries and track matching progress.",
    "request.ready": "Ready to submit a beneficiary request.",
    "request.submitting": "Submitting request...",
    "request.submitFailed": "Submission failed:",
    "request.success": "Request saved successfully.",
    "request.create": "Create request",
    "request.beneficiaryName": "Beneficiary name",
    "request.exampleName": "Example: Selam Bekele",
    "request.itemNeeded": "Item needed",
    "request.exampleItem": "Wheelchair",
    "request.details": "Need details",
    "request.detailsPlaceholder": "Describe urgency and delivery context.",
    "equipment.distribution.title": "Distribute Equipment",
    "equipment.distribution.description": "Record wheelchair distribution events for beneficiaries.",
    "equipment.distribution.ready": "Ready to record equipment distribution.",
    "equipment.distribution.saving": "Saving distribution...",
    "equipment.distribution.save": "Save distribution",
    "equipment.distribution.saveFailed": "Save failed:",
    "equipment.distribution.saved": "Equipment distribution saved successfully.",
    "equipment.fields.beneficiaryId": "Beneficiary ID",
    "equipment.placeholder.beneficiaryId": "Beneficiary UUID",
    "equipment.fields.type": "Equipment type",
    "equipment.placeholder.selectEquipment": "Select equipment",
    "equipment.fields.size": "Equipment size",
    "equipment.placeholder.selectSize": "Select size",
    "equipment.fields.distributionDate": "Distribution date",
    "equipment.fields.signatureConfirmed": "Signature confirmed",
    "equipment.placeholder.notes": "Delivery details or beneficiary observations",
    "equipment.placeholder.distributionLocation": "Distribution location",
    "equipment.placeholder.receivedBy": "Recipient or staff name",
    "donation.title": "Donation Form",
    "donation.description": "Capture donor details and inventory updates that sync into the live donations table.",
    "donation.status.ready": "Ready to save a donation record.",
    "donation.status.saving": "Saving donation...",
    "donation.status.saveFailed": "Save failed:",
    "donation.status.saved": "Donation saved successfully.",
    "donation.donorName": "Donor name",
    "donation.itemType": "Item type",
    "donation.notes": "Notes",
    "donation.placeholder.donorName": "Example: Addis Relief Fund",
    "donation.placeholder.itemType": "Wheelchair, walker, mattress",
    "donation.placeholder.notes": "Add delivery notes, urgency, or logistics details.",
    "donation.save": "Save donation",
    "register.public.ready": "Share your details and we will review your request.",
    "register.public.saving": "Saving your registration request...",
    "register.public.validation.required": "Please complete the required beneficiary details before submitting.",
    "register.public.error": "Unable to submit registration.",
    "register.public.success": "Your registration was submitted successfully. A staff member will review it shortly.",
    "register.public.submitting": "Submitting...",
    "register.public.submit": "Submit registration",
    "referralSource": "Referral source",
    "referralSourcePlaceholder": "Clinic, family, community leader",
    "validation.validBeneficiaryIdRequired": "A valid beneficiary ID is required to display profile details.",
    "*": "*",
    ".": " ",
    "/login": "/login",
    "assessments": "Assessments",
    "beneficiaryProfileDescription": "Beneficiary registration and history summary.",
    "beneficiary_id,equipment_type": "Beneficiary_id,equipment_type",
    "disabilityType": "Disability type",
    "disabilityTypeOtherDescription": "Describe the disability",
    "disabilityTypeOtherPlaceholder": "Describe other disability",
    "equipmentDistributions": "Equipment distributions",
    "equipment_type,equipment_size": "Equipment_type,equipment_size",
    "id,assessment_date,measurements,wheelchair_fit,notes,recommendations": "Id,assessment_date,measurements,wheelchair_fit,notes,recommendations",
    "id,beneficiary_id,equipment_type,equipment_size,distribution_date,distribution_location,received_by,signature_confirmed,notes": "Id,beneficiary_id,equipment_type,equipment_size,distribution_date,distribution_location,received_by,signature_confirmed,notes",
    "id,distribution_date,equipment_type,equipment_size,distribution_location,received_by,signature_confirmed,notes": "Id,distribution_date,equipment_type,equipment_size,distribution_location,received_by,signature_confirmed,notes",
    "id,email,role,is_disabled": "Id,email,role,is_disabled",
    "id,first_name,last_name,phone,region,status": "Id,first_name,last_name,phone,region,status",
    "id,key,value": "Id,key,value",
    "id,registration_number,first_name,middle_name,last_name,phone,region,kebele,photo_url": "Id,registration_number,first_name,middle_name,last_name,phone,region,kebele,photo_url",
    "id,registration_number,first_name,middle_name,last_name,region,kifle_ketema,kebele,house_number": "Id,registration_number,first_name,middle_name,last_name,region,kifle_ketema,kebele,house_number",
    "id,registration_number,registration_date,first_name,middle_name,last_name,date_of_birth,gender,phone,region,kifle_ketema,kebele,house_number,notes,photo_url": "Id,registration_number,registration_date,first_name,middle_name,last_name,date_of_birth,gender,phone,region,kifle_ketema,kebele,house_number,notes,photo_url",
    "key,value": "Key,value",
    "lastName": "Last name",
    "middleName": "Middle name",
    "noAdditionalNotes": "No additional notes provided.",
    "savingAssignment": "Saving assignment...",
    "selectDisabilityType": "Select disability type",
    "settings.saved": "Settings saved.",
    "seatWidth": "Seat Width",
    "armrestHeight": "Armrest Height",
    "footrestLength": "Footrest Length",
    "overallHeight": "Overall Height",
    "weight": "Weight",
    "deliveryConfirmation": "Delivery Confirmation",
    "delivery.date": "Delivery date",
    "delivery.wheelchairType": "Wheelchair type",
    "delivery.wheelchairSize": "Wheelchair size",
    "delivery.serialNumber": "Serial number",
    "delivery.beneficiarySignature": "Beneficiary signature",
    "delivery.partnerSignature": "Partner signature",
    "delivery.print": "Print / Save as PDF",
    "organization.agreements": "Organization Agreements",
    "organization.downloadAgreement": "Download agreement",
    "organization.uploadAgreement": "Upload signed agreement",
    "organization.type": "Organization type",
    "organization.type.hospital": "Hospital",
    "organization.type.clinic": "Clinic",
    "organization.type.rehab": "Rehabilitation Center",
    "organization.type.ngo": "NGO",
    "organization.type.gov": "Government Organization",
    "organization.type.other": "Other Partner",
    "Spinal Cord Injury": "Spinal Cord Injury",
    "Cerebral Palsy": "Cerebral Palsy",
    "Amputation": "Amputation",
    "Polio": "Polio",
    "Muscular Dystrophy": "Muscular Dystrophy",
    "Multiple Sclerosis": "Multiple Sclerosis",
    "Stroke": "Stroke",
    "Arthritis": "Arthritis",
    "Congenital Disability": "Congenital Disability",
    "Temporary Mobility Impairment": "Temporary Mobility Impairment",
    "admin.resetPassword": "Reset Password",
    "admin.resetPasswordIssued": "Temporary password issued.",
    "admin.resetPasswordFailed": "Unable to reset password.",
    "admin.resetPasswordError": "Reset failed.",
    "staff.recentRegistrations": "Recent registrations",
    "staff.allStatuses": "All statuses",
    "staff.searchBeneficiaries": "Search beneficiaries",
    "donation.howWould": "How would you like to donate?",
    "donation.chooseFlow": "Choose how you want to donate",
    "donation.yourSupport": "Your support helps provide mobility assistance for persons with disabilities in Ethiopia.",
    "donation.local": "Local Donation",
    "donation.localDescription": "Donate in Ethiopian currency with local payment methods.",
    "donation.international": "International Donation",
    "donation.internationalDescription": "Donate in USD, EUR, GBP, CAD or AUD.",
    "donation.internationalDonation": "International Donation",
    "donation.yourInformation": "Your Information",
    "donation.fullName": "Full Name",
    "donation.emailAddress": "Email Address",
    "donation.phoneNumber": "Phone Number",
    "donation.country": "Country",
    "donation.donationAmount": "Donation Amount",
    "donation.amount": "Amount",
    "donation.currency": "Currency",
    "donation.donationPurpose": "Donation Purpose",
    "donation.paymentMethod": "Payment Method",
    "donation.selectMethod": "Select a payment method",
    "donation.cbeBirr": "CBE Birr Mobile App",
    "donation.cbeBirrDesc": "Scan QR code or send to phone number",
    "donation.telebirr": "Telebirr (Ethio Telecom)",
    "donation.telebirrDesc": "*143# or Telebirr app",
    "donation.bankTransfer": "Bank Transfer (CBE)",
    "donation.bankTransferDesc": "Direct transfer to AGAPE account",
    "donation.cash": "Cash at Office",
    "donation.cashDesc": "Visit our office in Addis Ababa",
    "donation.paypal": "PayPal",
    "donation.paypalDesc": "Fast, secure, widely accepted worldwide",
    "donation.stripe": "Credit/Debit Card",
    "donation.stripeDesc": "Visa, Mastercard, and other cards via Stripe",
    "donation.wire": "Bank Wire Transfer",
    "donation.wireDesc": "International wire transfer via SWIFT",
    "donation.confirmDonation": "Confirm Your Donation",
    "donation.reviewDetails": "Please review your donation details before submitting",
    "donation.processingPayment": "Processing Payment...",
    "donation.pleaseWait": "Please wait while we process your donation",
    "donation.redirecting": "You will be redirected to complete payment",
    "donation.totalDonations": "Total Donations",
    "donation.bankInfo": "Bank Details",
    "donation.whySupport": "Why Support AGAPE?",
    "donation.wheelchairs": "Wheelchairs",
    "donation.wheelchairsDesc": "Provide custom-fitted mobility equipment for persons with disabilities.",
    "donation.medicalSupport": "Medical Support",
    "donation.medicalSupportDesc": "Fund assessments, fittings, and clinical follow-up care.",
    "donation.community": "Community",
    "donation.communityDesc": "Build partnerships with local organizations for sustainable impact.",
    "donation.faq": "Frequently Asked Questions",
    "donation.faqIsSecure": "Is my donation secure?",
    "donation.faqIsSecureAnswer": "Yes! All donations are processed through secure payment gateways with industry-standard encryption.",
    "donation.faqReceipt": "Will I receive a receipt?",
    "donation.faqReceiptAnswer": "Yes! You will receive a donation receipt via email immediately after your donation is processed.",
    "donation.faqDeductible": "Is my donation tax-deductible?",
    "donation.faqDeductibleAnswer": "AGAPE MOBILITY ETHIOPIA is registered as a non-profit organization. Consult your local tax advisor for eligibility.",
    "donation.faqUsed": "How is my donation used?",
    "donation.faqUsedAnswer": "Your donation goes directly to wheelchair purchases, assessments, follow-up care, and community partnerships in Ethiopia.",
    "donation.supportWorldwide": "Support from anywhere",
    "donation.supportEthiopia": "Support from Ethiopia",
    "donation.nextStep": "Next",
    "donation.proceedPayment": "Proceed to Payment",
    "donation.backButton": "Back",
    "donation.acceptedMethods": "Accepted local payment methods",
    "donation.generalFund": "General Fund",
    "donation.wheelchairsOption": "Wheelchairs",
    "donation.followUpCare": "Follow-up Care",
    "donation.emergencySupport": "Emergency Support",
    "donation.localDonation": "Local Donation",
    "donation.simpleSecure": "Simple and secure local donation",
    "donation.back": "Back",
    "donation.required": "Please fill in all required fields",
    "donation.validAmount": "Please enter a valid amount",
    "donation.errorProcessing": "Error processing donation",
    "donation.failedProcess": "Failed to process donation",
    "donation.bankName": "Bank Name",
    "donation.accountName": "Account Name",
    "donation.accountNumber": "Account Number",
    "donation.copyAccount": "Copy Account Number",
    "donation.note": "Note",
    "donation.contactSupport": "Contact Support",
    "donation.bankInfoDescription": "Manual donation information for direct bank transfers",
    "donation.faqSimpleDescription": "Frequently asked questions about donations",
    "donation.supportInternational": "Support from around the world",
    "donation.donationRecorded": "Donation recorded as",
    "donation.paymentWillBeHandledBy": "Payment processing would be handled by",
    "donation.inProduction": "in production",
    "optional": "Optional",
    "staffManagement": "Staff Management",
    "beneficiaryManagement": "Beneficiary Management",
    "donationControl": "Donation Control",
    "auditLog": "Audit Log",
    "changePassword": "Change Password",
    "staffDashboardDescription": "Overview of beneficiaries, registrations, and operational metrics.",
    "operationalMetrics": "Operational Metrics",
    "totalBeneficiaries": "Total Beneficiaries",
    "newRegistrations": "New Registrations",
    "pendingApprovals": "Pending Approvals",
    "approvedRegistrations": "Approved Registrations",
    "rejectedRegistrations": "Rejected Registrations",
    "assessmentsPending": "Assessments Pending",
    "quickActions": "Quick Actions",
    "addNewBeneficiaryRecord": "Add a new beneficiary",
    "findExistingBeneficiary": "Find existing beneficiary",
    "recordWheelchairMeasurements": "Record measurements",
    "recordEquipmentDistribution": "Record distribution",
    "recentBeneficiaries": "Recent Beneficiaries",
    "noBeneficiariesFound": "No beneficiaries found",
    "adminControlCenter": "Admin Control Center",
    "systemWideManagement": "System-wide organizational management and oversight.",
    "systemMetrics": "System Metrics",
    "registrationsToday": "Registrations Today",
    "registrationsThisMonth": "Registrations (Month)",
    "approvalStatus": "Approval Status",
    "activeStaff": "Active Staff",
    "disabledStaff": "Disabled Staff",
    "donationOverview": "Donation Overview",
    "donationTotal": "Total Donations",
    "donationsThisMonth": "Donations (Month)",
    "adminActions": "Admin Actions",
    "manageStaffAccounts": "Manage staff accounts",
    "beneficiaryControl": "Beneficiary Control",
    "allBeneficiaryRecords": "All beneficiary records",
    "donationReports": "Manage donations",
    "generateReports": "View reports",
    "staffDirectory": "Staff Directory",
    "noStaffFound": "No staff members found",
    "errorLoadingData": "Error loading data",
    "staffDashboard": "Staff Dashboard",
    "staffAdminPortal": "Staff / Admin Portal",
    "accountDisabled": "Your account has been disabled. Please contact an administrator.",
    "noPermission": "You do not have permission to access this system."
  },
  am: {
    "home": "ቤት",
    "AGAPE MOBILITY ETHIOPIA Menu ": "አጋፔ ሞቢሊቲ ኢትዮጵያ ምናሌ",
    "partners": "አጋርዎች",
    "partnerPortalTitle": "የአጋርነት ፖርታል",
    "partnerPortalHeroTitle": "ከአጋፔ ሞቢሊቲ ኢትዮጵያ ጋር ይተባበሩ",
    "partnerPortalHeroDescription": "ድርጅቶች በኢትዮጵያ ውስጥ ለአካል ጉዳተኞች የሞቢሊቲ አገልግሎቶች እንዲሻሻሉ ከአጋፔ ሞቢሊቲ ኢትዮጵያ ጋር መተባበር ይችላሉ።",
    "partnerPortalCard": "የአጋርነት ፖርታል",
    "partnerPortalCardDescription": " የስምምነት ሰነዱን ያውርዱ፣ ሰነዱን ፈርመው ይስቀሉ እና የግምገማ ሂደት ይከታተሉ።",
    "partnershipInformation": "የአጋርነት መረጃ",
    "partnershipMission": "ተልዕኮ",
    "partnershipMissionText": "ለአካል ጉዳተኞች የአጠቃቀም ተንቀሳቃሽነት አገልግሎቶች እና ርህራሄ እንክብካቤ ይደግፉ።",
    "partnershipBenefits": "ጥቅሞች",
    "partnershipBenefitsText": "የማጣቀሻ መንገዶችን ያጋራሉ፣ የአገልግሎት መዳረሻን ያጠናክራሉ እና የማህበረሰብ ተጽእኖ ያሻሻሉ።",
    "partnershipWhoCanJoin": "ማን ሊተባበር ይችላል",
    "partnershipWhoCanJoinText": "ሆስፒታሎች፣ ክሊኒኮች፣ የእገዛ ማዕከላት፣ ድርጅቶች፣ የመንግስት ድርጅቶች፣ በጎ አድራጎት ድርጅቶች፣ ቤተክርስቲያኖች እና ዓለም አቀፍ አጋሮች።",
    "partnershipProcess": "የሚያስፈልገው ሂደት",
    "partnershipProcessText": "ስምምነቱን ይመልከቱ፣ በፊርማ ያገኙ እና ተፈራርሞ ፒዲኤፍ ይስቀሉ።",
    "officialAgreement": "ኦፊሴላዊ ሰነድ",
    "officialAgreementTitle": "ኦፊሴላዊ የአጋርነት ስምምነት",
    "officialAgreementDescription": "ኦፊሴላዊ የአጋርነት ስምምነቱን ያውርዱ፣ በጥንቃቄ ይመልከቱ፣ በፊርማ ላይ ያስቀምጡ እና ከዚህ በታች ተፈራርሞ እትም ይስቀሉ።",
    "downloadAgreement": "ስምምነት ያውርዱ",
    "uploadSignedAgreementTitle": "ተፈረምቶ የተፈረመ ስምምነት ይስቀሉ",
    "uploadSignedAgreementDescription": "የድርጅትዎን መረጃ ይጋራ እና ተፈረምቶ የተፈረመ ፒዲኤፍ ይስቀሉ እንዲሁም አጋፔ ቡድን ግምገማ ያድርግ።",
    "organizationName": "የድርጅት ስም",
    "organizationType": "የድርጅት አይነት",
    "contactPerson": "የእውቂያ ሰው",
    "agreementNumber": "የስምምነት ቁጥር",
    "uploadSignedPdf": "ተፈረምቶ የተፈረመ ፒዲኤፍ ይስቀሉ",
    "uploadAgreement": "ስምምነት ይስቀሉ",
    "uploadAgreementLimit": "የተቀበሉ ቅርጾች: ፒዲኤፍ ብቻ። ከፍተኛ ቅርጽ: 20 MB።",
    "uploadingAgreement": "ስምምነት በመስቀል ላይ...",
    "uploadAgreementSuccess": "የስምምነት ሰነዱ በተሳካ ሁኔታ ተሰቅሏል።",
    "uploadAgreementValidation": "እባክዎ ከመስቀልዎ በፊት ሁሉንም አስፈላጊ መረጃ ይሙሉ።",
    "uploadAgreementPdfOnly": "እባክዎ ፒዲኤፍ ፋይል ይስቀሉ።",
    "uploadAgreementSize": "የተመረጠው ፋይል 20 MB ገደብ አልፎታል።",
    "uploadAgreementError": "ስምምነት ለመስቀል አልተሳካም። እባክዎ እንደገና ይሞክሩ።",
    "agreementManagement": "የስምምነት አስተዳደር",
    "agreementManagementTitle": "የግምገማ መስክ",
    "agreementManagementDescription": "አስገባዎችን ይፈልጉ፣ ተስቀልዎችን ይገምግሙ እና ሁኔታቸውን ያዘምኑ።",
    "searchAgreements": "ስምምነቶችን ፈልግ",
    "loadingAgreements": "ስምምነቶች በመጫን ላይ...",
    "noAgreements": "እስካሁን ምንም ስምምነቶች አልተሰቀሉም።",
    "beneficiaries": "ተጠቃሚዎች",
    "newRegistration": "አዲስ ምዝገባ",
    "registerBeneficiary": "ተጠቃሚ ይመዝገቡ",
    "beneficiaryRegistry": "ተጠቃሚ መመዝገቢያ",
    "heroTitle": "የወለል ላይ መጎተት ይብቃ!",
    "heroSubtitle": "የእርስዎ ድጋፍ ተስፋን ይሰጣል ፤ በኢትዮጵያ የሰዎችን ሕይወት ይለውጣል።",
    "beneficiaryRegistration": "ተጠቃሚ ምዝገባ",
    "equipmentTracking": "መሳሪያ ክትትል",
    "assessmentManagement": "የስራ ግምገማ",
    "ourMission": "የእኛ ተልዕኮ",
    "ourMissionTitle": "የእኛ ተልዕኮ",
    "ourMissionText": "በመላው ኢትዮጵያ የእንቅስቃሴ ድጋፍ እና ሁሉን አቀፍ የተጠቃሚዎች ድጋፍ አገልግሎቶችን ማቅረብ።",
    "ourReach": "ተደራሽንታችን",
    "ourReachTitle": "ተደራሽንታችን",
    "ourReachText": "የቅርብ ጊዜ የማህበረሰብ ተደራሽነታችንን እና በተጠቃሚዎቻችን ላይ ያሳደረውን ተፅዕኖ በምስላዊ መልኩ ማሳየት።",
    "operationalDashboard": "የሥራ ሂደት መከታተያ ቦታ",
    "dashboardDescription": " ይህ ቦታ የተፅዕኖ መለኪያዎችን፣ ልገሳዎችን፣ ጥያቄዎችን እና የአስተዳደር ክትትልን በስፋት የሚከታተል ሲሆን፣ ከSupabase ጋር በቅጽበት የሚደረግ ውህደትንም ያቀርባል።",
    "selfRegistrationCard": "ራስ ምዝገባ",
    "selfRegistrationTitle": "ራስ ምዝገባ",
    "selfRegistrationText": "ተጠቃሚዎች ሙሉ ጫፍ, የግል ዝርዝር, እና ፎቶ በቀጥታ ሊያሳትፉ ይችላሉ።",
    "staffPanelCard": "የሰራተኞች ፓነል ካርድ",
    "staffPanelTitle": "የሰራተኞች ፓነል",
    "staffPanelText": "ሰራተኞች የተጠቃሚዎችን ምዝገባ እና የሥራ ሂደት እርምጃዎችን ማስቀመጥ፣ መገምገም፣ ማስተካከል እና ማስተዳደር ይችላሉ።",
    "adminPanelCard": "የአስተዳዳሪ ፓነል ካርድ",
    "adminPanelTitle": "የአስተዳዳሪ ፓነል",
    "adminPanelText": "አስቸኳይ ጥያቄዎችን ይገምግሙ፣ እቃዎችን ተመሳሳይ እንደሆኑ ምልክት ያድርጉ፣ እና የሎጂስቲክስ ወረፋዎችን ያስተዳድሩ።",
    "registrationNumber": "ምዝገባ ቁጥር",
    "registrationDate": "ምዝገባ ቀን",
    "firstName": "የመጀመሪያ ስም",
    "fathersName": "የአባት ስም",
    "grandfathersName": "የአያት ስም",
    "dateOfBirth": "የትውልድ ቀን",
    "gender": "ወንድ/ሴት",
    "male": "ወንድ",
    "female": "ሴት",
    "phone": "ስልክ",
    "region": "ክልል",
    "woredaZone": "ወረዳ / ሊቃ",
    "kifleKetema": "ክፍለ ከተማ",
    "houseNumber": "ቤት ቁጥር",
    "notes": "ማስታወሻ",
    "save": "አስቀምጥ",
    "savingRecord": "መዝገብ በማስቀመጥ ላይ",
    "savedSuccessfully": "ተጠቃሚ በተሳካ ሁኔታ ተቀምጧል።",
    "saveFailed": "ማስቀመጥ አልተሳካም:",
    "searchTerm": "ፈልግ ቃል",
    "searchBeneficiaries": "ተጠቃሚዎችን ፈልግ",
    "equipmentType": "መሳሪያ አይነት",
    "beneficiaryProfile": "የተጠቃሚ መረጃ",
    "loadingRecord": "መዝገብ በመጫን ላይ",
    "viewProfile": "መረጃውን ይመልከቱ",
    "uploadPhoto": "ፎቶውን ጫን",
    "selectLanguage": "ቋንቋ",
    "login": "ግባ",
    "password": "የምስጢር ቃል",
    "signIn": "ግባ",
    "signOut": "ወጣ",
    "profileLoaded": "ተጠቃሚ መረጃ ተሞልቷል።",
    "noRecords": "ተጠቃሚ ምዝገባ የለም።",
    "loadingRecent": "የቅርብ ጊዜ መረጃዎችን በመጫን ላይ…",
    "showRecent": "የቅርብ ጊዜዎቹን አሳይ",
    "invalidFileType": "ዋናው ፎቶ አይነት። JPG, JPEG, PNG, ወይም WEBP ተጠቀም።",
    "invalidFileSize": "ፎቶ በጣም ትልቅ ነው። ከፍተኛው መጠን 3 MB ነው።",
    "autoGeneratedOnly": "በራስ ተነሰ ሙሉ ሲያስቀምጡ",
    "uploadPhotoLabel": "ተጠቃሚ ፎቶ",
    "dashboard": "ዳሽቦርድ",
    "systemSettings": "ስርዓተ ቅንብር",
    "userManagement": "የተጠቃሚዎች አስተዳደር",
    "reports": "ዘገባዎች",
    "settings": "ቅንብር",
    "unauthorized": "ፈቃድ የለዎትም",
    "loading": "በመጫን ላይ…",
    "liveDashboard": "እንኳን ወደ አጋፔ ሞቢሊቲ ኢትዮጵያ ደህና መጡ።",
    "languageUpdated": "ቋንቋ ታዳሰ።",
    "applicationName": "አጋፔ ኢትዮጵያ",
    "applicationTagline": "የወለል ላይ መጎተት ይብቃ!",
    "searchPlaceholder": "ስም, ምዝገባ ቁጥር, ስልክ, ክልል, ቀበሌ",
    "roleStaff": "ሠራተኛ",
    "roleAdmin": "አስተዳዳሪ",
    "adminPanel": "አስተዳዳሪ ፓነል",
    "adminCenter": "አስተዳዳሪ ማእከል",
    "adminCenterDescription": "አስቸኳይ ጥያቄዎችን ይገምግሙ፣ እቃዎችን ከጥያቄዎች ጋር እንዲጣጣሙ ምልክት ያድርጉ፣ እና የሎጂስቲክስ ወረፋዎችን ያስተዳድሩ።",
    "openRequests": "ጥያቄዎችን ክፈት",
    "availableWheelchairs": "ያሉ የዊልቸሮች",
    "beneficiary": "ተጠቃሚ",
    "item": "ዕቃ",
    "status": "ሁኔታ",
    "unnamed": "ስም ያልተሰጠው",
    "statusPending": "በመጠባበቅ ላይ",
    "statusMatched": "ተጣጥሟል",
    "statusDelivered": "ተላልፏል",
    "users": "ተጠቃሚዎች",
    "usersDescription": "የመተግበሪያ መለያዎችን ያስተዳድሩ እና ለአስተዳዳሪዎችና ለሰራተኞች ሚናዎችን ይመድቡ።",
  
"unknownProfile": "ያልታወቀ መገለጫ",
"overview": "አጠቃላይ እይታ",
"buttonLabel": "የአዝራር መለያ",
"supabaseNotConfigured": "Supabase አልተዋቀረም።",
"email": "ኢሜይል",
"role": "ሚና",
"access": "መዳረሻ",
"actions": "እርምጃዎች",
"disabled": "ተሰናክሏል",
"active": "ንቁ",
"enable": "አንቃ",
"disable": "አሰናክል",
"noUsersFound": "ምንም ተጠቃሚ አልተገኘም።",
"assessmentReady": "አዲስ ግምገማ ለመጨመር ዝግጁ ነው።",
"savingAssessment": "ግምገማውን በማስቀመጥ ላይ...",
"saveAssessment": "ግምገማውን አስቀምጥ",
"assessmentSaved": "ግምገማው በተሳካ ሁኔታ ተቀምጧል።",
"newAssessment": "አዲስ ግምገማ",
"assessmentDescription": "ለተጠቃሚው የዊልቸር መለኪያ መረጃዎችን በተዋቀረ መልኩ ይመዝግቡ።",
"beneficiaryId": "የተጠቃሚ መለያ",
"beneficiaryIdPlaceholder": "የተጠቃሚ UUID",
"hipWidth": "የዳሌ ስፋት",
"hipWidthPlaceholder": "የዳሌ ስፋት",
"measurements": "መለኪያዎች",
"measurementsPlaceholder": "ቁመት፣ የመቀመጫ ጥልቀት፣ ወዘተ.",
"wheelchairFitting": "የዊልቸር ማስተካከያ",
"wheelchairFittingPlaceholder": "የማስተካከያ መረጃ",
"recommendations": "ምክረ ሀሳቦች",
"recommendationsPlaceholder": "የሚመከረው መሳሪያ፣ የክትትል እርምጃዎች ወይም ሪፈራል",
"seatDepth": "የመቀመጫ ጥልቀት",
"seatDepthPlaceholder": "የመቀመጫ ጥልቀት",
"backHeight": "የጀርባ ቁመት",
"backHeightPlaceholder": "የጀርባ ቁመት",
"recommendedEquipment": "የሚመከር መሳሪያ",
"selectEquipment": "መሳሪያ ይምረጡ",
"adultWheelchair": "የአዋቂዎች ዊልቸር",
"childrenWheelchair": "የህፃናት ዊልቸር",
"crutches": "የክራንች ዱላዎች",
"walker": "የመራመጃ መሳሪያ",
"other": "ሌላ",
"recommendedSize": "የሚመከር መጠን",
"selectSize": "መጠን ይምረጡ",
"sizeSmall": "ትንሽ",
"sizeMedium": "መካከለኛ",
"sizeLarge": "ትልቅ",
"sizeXL": "በጣም ትልቅ",
"assessorName": "የገምጋሚ ስም",
"assessorNamePlaceholder": "የገምጋሚ ስም",
"assessmentDate": "የግምገማ ቀን",
"additionalAssessmentNotes": "ተጨማሪ የግምገማ ማስታወሻዎች",
"equipmentPlaceholder": "ዊልቸር፣ ክራንች፣ የመራመጃ መሳሪያ",
"kebele": "ቀበሌ",
"equipment": "መሳሪያ",
"addEquipmentAssignment": "የመሳሪያ ምደባ ጨምር",
"assignmentNotesPlaceholder": "ሁኔታ፣ ልዩ ፍላጎቶች፣ የማድረሻ ዝርዝሮች",
"assignmentReady": "የመሳሪያ ምደባ ለመጨመር ዝግጁ ነው።",
"assignmentSaved": "የመሳሪያ ምደባው በተሳካ ሁኔታ ተቀምጧል።",
"issueDate": "የማስረከቢያ ቀን",
"mobilityAssessment": "የእንቅስቃሴ ግምገማ",
"notRecorded": "አልተመዘገበም",
"notSpecified": "አልተገለጸም",
"noAssessmentsFound": "ለዚህ ተጠቃሚ ምንም ግምገማ አልተገኘም።",
"noBeneficiarySelected": "ምንም ተጠቃሚ አልተመረጠም።",
"noEquipmentDistributionsFound": "ለዚህ ተጠቃሚ ምንም የመሳሪያ ስርጭት አልተገኘም።",
"noNotesProvided": "ምንም ማስታወሻ አልተሰጠም።",
"receivedBy": "የተቀበለው",
"registrationDetails": "የምዝገባ ዝርዝሮች",
"registerDescription": "የAGAPE MOBILITY ETHIOPIA ተጠቃሚዎችን የምዝገባ ዝርዝሮች ይመዝግቡ እና ለወደፊት ግምገማና የመሳሪያ ምደባ ክትትል መዝገቦችን ያስቀምጡ።",
"registrationReady": "ተጠቃሚን ለመመዝገብ ዝግጁ ነው።",
"selectGender": "ጾታ ይምረጡ",
"size": "መጠን",
"unknownDate": "ያልታወቀ ቀን",
"unknown": "ያልታወቀ",
"unableToLoadBeneficiary": "ተጠቃሚውን መጫን አልተቻለም፦",
"trackAssignedEquipment": "ለዚህ ተጠቃሚ የተሰጠውን የእንቅስቃሴ መሳሪያ ይከታተሉ።",
"exampleFirstName": "ምሳሌ፦ አማኑኤል",
"exampleMiddleName": "ምሳሌ፦ በቀለ",
"exampleLastName": "ምሳሌ፦ ታደሰ",
"examplePhone": "ምሳሌ፦ +251 9xx xxx xxx",
"exampleRegion": "አዲስ አበባ፣ ኦሮሚያ፣ አማራ",
"exampleNeighborhood": "ሰፈር ወይም ክፍለ ከተማ",
"exampleKebele": "ቀበሌ",
"exampleHouseNumber": "የቤት ቁጥር",
"notesPlaceholder": "እንደ አማራጭ የአካል ጉዳት፣ የመዳረሻ ወይም የድጋፍ ዝርዝሮች።",
"unknownBeneficiary": "ያልታወቀ ተጠቃሚ",
"searching": "ተጠቃሚዎችን በመፈለግ ላይ...",
"foundRecords": "{{count}} የተጠቃሚ መዝገብ(ቦች) ተገኝተዋል።",
"foundRecordsPrefix": "ተገኝተዋል",
"loadingApplications": "ማመልከቻዎችን በመጫን ላይ...",
"unableToLoadApplications": "ማመልከቻዎችን መጫን አልተቻለም፦",
"applicationsLoaded": "ማመልከቻዎች ተጭነዋል።",
"unableToLoadApplicationsShort": "ማመልከቻዎችን መጫን አልተቻለም።",
"unableToUpdateStatus": "ሁኔታውን ማዘመን አልተቻለም፦",
"statusUpdated": "ሁኔታው ተዘምኗል ወደ",
"unableToSaveChanges": "ለውጦችን ማስቀመጥ አልተቻለም፦",
"beneficiaryUpdated": "የተጠቃሚው ዝርዝሮች ተዘምነዋል።",
"staffReviewDashboard": "የሰራተኞች ግምገማ ዳሽቦርድ",
"staffReviewDescription": "ምዝገባዎችን ይገምግሙ እና እያንዳንዱን ጉዳይ ያጽድቁ ወይም ውድቅ ያድርጉ።",
"allStatuses": "ሁሉም ሁኔታዎች",
"statusApproved": "ጸድቋል",
"statusRejected": "ውድቅ ተደርጓል",
"edit": "አስተካክል",
"approve": "አጽድቅ",
"reject": "ውድቅ አድርግ",
"location": "አካባቢ",
"needs": "ፍላጎቶች",
"saveChanges": "ለውጦችን አስቀምጥ",
"cancel": "ሰርዝ",
"saving": "በማስቀመጥ ላይ...",
"noApplicationsMatch": "ከዚህ ማጣሪያ ጋር የሚዛመድ ማመልከቻ የለም።",
"distribution": "ስርጭት",
"equipmentDistribution": "የመሳሪያ ስርጭት",
"operationalReports": "የአሠራር ሪፖርቶች",
"operations": "አሠራሮች",
"operationalActions": "የአሠራር እርምጃዎች",
"operationsDescription": "ተጠቃሚዎችን ለመመዝገብ፣ ግምገማዎችን ለመመዝገብ እና ስርጭቶችን ለመመዝገብ ዋና የሥራ ሂደት እርምጃዎችን ይጠቀሙ።",
"action.registerBeneficiary.title": "ተጠቃሚ መዝግብ",
"action.registerBeneficiary.desc": "አዲስ የተጠቃሚ መዝገብ ይጨምሩ።",
"action.searchBeneficiary.title": "ተጠቃሚ ፈልግ",
"action.searchBeneficiary.desc": "ነባር ተጠቃሚዎችን ይፈልጉ።",
"action.newAssessment.title": "አዲስ ግምገማ",
"action.newAssessment.desc": "የዊልቸር ግምገማ መለኪያዎችን ይመዝግቡ።",
"action.distributeEquipment.title": "መሳሪያ አከፋፍል",
"action.distributeEquipment.desc": "የመሳሪያ ስርጭት ክስተቶችን ይመዝግቡ።",
"action.reports.title": "የስርጭት ሪፖርቶች",
"action.reports.desc": "የአሠራር ሪፖርቶችንና ማጠቃለያዎችን ይመልከቱ።",
"offline.title": "ከኢንተርኔት ውጭ ነዎት",
"offline.message": "የኢንተርኔት ግንኙነትዎ የተቋረጠ ይመስላል። አንዳንድ ባህሪያት አሁን ላይገኙ ይችላሉ።",
"offline.whatYouCanDoTitle": "ማድረግ የሚችሉት፦",
"offline.checkConnection": "የኢንተርኔት ግንኙነትዎን ይፈትሹ",
"offline.viewCached": "ቀደም ሲል የተሸጎጡ ገጾችን ይመልከቱ",
"offline.reviewSaved": "የተቀመጠ መረጃን ይገምግሙ",
"offline.tryAgain": "እንደገና ይሞክሩ",
"offline.goBack": "ተመለስ",
"offline.reconnectInfo": "እንደገና ከኢንተርኔት ጋር ሲገናኙ መተግበሪያው በመደበኛነት ይሰራል።",
"offline.icon": "ð¡",
"register.title": "የተጠቃሚ ምዝገባ",
"register.description": "የድጋፍ ጥያቄዎን ያስገቡ፤ የAGAPE MOBILITY ETHIOPIA ቡድንም ይገመግመዋል።",
"impact.header": "ዋና መነሻ ገጽ",
"impact.title": "የእንቅስቃሴ ድጋፍን ከአስቸኳይ ጥያቄዎች ጋር በቅጽበት ማጣጣም።",
"impact.description": "የAGAPE MOBILITY ETHIOPIA ዳሽቦርድ የሚመጡ ልገሳዎችንና የተጠቃሚዎችን ጥያቄዎች ለዊልቸሮች፣ ለእንቅስቃሴ መርጃዎች እና ለአስቸኳይ ድጋፍ ቅንጅት ወደ ቀጥታ የሎጂስቲክስ ሂደት ይቀይራል።",
"impact.insightLabel": "የቀጥታ ማጣጣሚያ ግንዛቤ",
"impact.pendingRequestsSymbol": "በመጠባበቅ ላይ ያሉ ጥያቄዎች",
"impact.donationRecords": "የልገሳ መዝገቦች",
"impact.insightDescription": "ይህ የአስተዳዳሪ ፓነሉ ቀጣይ የማጣጣሚያ እርምጃዎችን ለማስቀደም የሚጠቀምበት የቀጥታ የአሠራር ማጠቃለያ ነው።",
"impact.statRequestsLabel": "አስቸኳይ የእንቅስቃሴ ጥያቄዎች",
"impact.statDonationsLabel": "በሂደት ላይ ያሉ የልገሳ መዝገቦች",
"impact.liveLabel": "ቀጥታ",
"impact.syncStatusLabel": "የSupabase ማመሳሰል ሁኔታ",
"beneficiaries.totalRegisteredLabel": "ጠቅላላ የተመዘገቡ",
"beneficiaries.totalRegisteredTitle": "ሁሉንም ተጠቃሚዎች ያስተዳድሩ",
"beneficiaries.assessmentsLabel": "ግምገማዎች",
"beneficiaries.assessmentsTitle": "የእንቅስቃሴ ግምገማዎችን ይከታተሉ",
"beneficiaries.equipmentLabel": "መሳሪያዎች",
"beneficiaries.equipmentTitle": "ምደባዎችንና ታሪክን ይከታተሉ",
"coreServices.title": "ዋና አገልግሎቶች",
"coreServices.text": "የተጠቃሚ ምዝገባ፣ የእንቅስቃሴ ግምገማዎች፣ የመሳሪያ ስርጭት እና የተፅዕኖ ክትትል።",
"impactDriven.title": "በተፅዕኖ የሚመራ",
"impactDriven.text": "ግልጽ ሪፖርት፣ በመረጃ የተመሰረቱ ውሳኔዎች እና ሊለካ የሚችል የማህበረሰብ ተፅዕኖ።",
"beneficiaryReport.title": "የተጠቃሚ ሪፖርት",
"beneficiaryReport.description": "የቅርብ ጊዜ ተጠቃሚዎችን ከምዝገባና ከአካባቢ ዝርዝሮች ጋር።",
"distributionReport.title": "የስርጭት ሪፖርት",
"distributionReport.description": "የቅርብ ጊዜ የመሳሪያ ስርጭቶችንና የተቀባዮችን ዝርዝሮች።",
"report.regNumber": "የምዝገባ ቁጥር",
"report.name": "ስም",
"report.region": "ክልል",
"report.kebele": "ቀበሌ",
"report.date": "ቀን",
"report.beneficiary": "ተጠቃሚ",
"report.equipment": "መሳሪያ",
"report.size": "መጠን",
"report.loadingBeneficiaries": "ተጠቃሚዎችን በመጫን ላይ...",
"report.noBeneficiaries": "ምንም ተጠቃሚ አልተገኘም።",
"report.loadingDistributions": "የስርጭት መዝገቦችን በመጫን ላይ...",
"report.noDistributions": "ምንም የስርጭት መዝገብ አልተገኘም።",
"equipment.sizeSummary.title": "የመሳሪያ መጠን ስርጭት ማጠቃለያ",
"equipment.sizeSummary.description": "በዓይነትና በመጠን የተከፋፈሉ የተሰራጩ መሳሪያዎች ማጠቃለያ።",
"equipment.sizeSummary.loading": "ማጠቃለያውን በመጫን ላይ...",
"equipment.sizeSummary.empty": "ምንም የስርጭት መረጃ የለም።",
"request.title": "የጥያቄ ፖርታል",
"request.description": "ከተጠቃሚዎች የሚመጡ አስቸኳይ የእንቅስቃሴ ጥያቄዎችን ይመዝግቡ እና የማጣጣሚያ ሂደቱን ይከታተሉ።",
"request.ready": "የተጠቃሚ ጥያቄ ለማስገባት ዝግጁ ነው።",
"request.submitting": "ጥያቄውን በማስገባት ላይ...",
"request.submitFailed": "ጥያቄውን ማስገባት አልተሳካም፦",
"request.success": "ጥያቄው በተሳካ ሁኔታ ተቀምጧል።",
"request.create": "ጥያቄ ፍጠር",
"request.beneficiaryName": "የተጠቃሚ ስም",
"request.exampleName": "ምሳሌ፦ ሰላም በቀለ",
"request.itemNeeded": "የሚያስፈልገው ዕቃ",
"request.exampleItem": "ዊልቸር",
"request.details": "የፍላጎት ዝርዝሮች",
"request.detailsPlaceholder": "የአስቸኳይነትንና የማድረሻ ሁኔታን ይግለጹ።",
"equipment.distribution.title": "መሳሪያ አከፋፍል",
"equipment.distribution.description": "ለተጠቃሚዎች የዊልቸር ስርጭት ክስተቶችን ይመዝግቡ።",
"equipment.distribution.ready": "የመሳሪያ ስርጭት ለመመዝገብ ዝግጁ ነው።",
"equipment.distribution.saving": "ስርጭቱን በማስቀመጥ ላይ...",
"equipment.distribution.save": "ስርጭቱን አስቀምጥ",
"equipment.distribution.saveFailed": "ማስቀመጥ አልተሳካም፦",
"equipment.distribution.saved": "የመሳሪያ ስርጭቱ በተሳካ ሁኔታ ተቀምጧል።",
"equipment.fields.beneficiaryId": "የተጠቃሚ መለያ",
"equipment.placeholder.beneficiaryId": "የተጠቃሚ UUID",
"equipment.fields.type": "የመሳሪያ ዓይነት",
"equipment.placeholder.selectEquipment": "መሳሪያ ይምረጡ",
"equipment.fields.size": "የመሳሪያ መጠን",
"equipment.placeholder.selectSize": "መጠን ይምረጡ",
"equipment.fields.distributionDate": "የስርጭት ቀን",
"equipment.fields.signatureConfirmed": "ፊርማ ተረጋግጧል",
"equipment.placeholder.notes": "የማድረሻ ዝርዝሮች ወይም የተጠቃሚ ምልከታዎች",
"equipment.placeholder.distributionLocation": "የስርጭት ቦታ",
"equipment.placeholder.receivedBy": "የተቀባይ ወይም የሰራተኛ ስም",
"donation.title": "የልገሳ ቅጽ",
"donation.description": "የለጋሽ ዝርዝሮችንና የእቃ ዝርዝር ማዘመኛዎችን ይመዝግቡ፤ እነዚህም ከቀጥታ የልገሳ ሰንጠረዥ ጋር ይመሳሰላሉ።",
"donation.status.ready": "የልገሳ መዝገብ ለማስቀመጥ ዝግጁ ነው።",
"donation.status.saving": "ልገሳውን በማስቀመጥ ላይ...",
"donation.status.saveFailed": "ማስቀመጥ አልተሳካም፦",
"donation.status.saved": "የልገሳ መዝገቡ በተሳካ ሁኔታ ተቀምጧል።",
"donation.donorName": "የለጋሽ ስም",
"donation.itemType": "የዕቃ ዓይነት",
"donation.notes": "ማስታወሻዎች",
"donation.placeholder.donorName": "ምሳሌ፦ አዲስ ሪሊፍ ፈንድ",
"donation.placeholder.itemType": "ዊልቸር፣ የመራመጃ መሳሪያ፣ ፍራሽ",
"donation.placeholder.notes": "የማድረሻ ማስታወሻዎችን፣ አስቸኳይነትን ወይም የሎጂስቲክስ ዝርዝሮችን ያክሉ።",
"donation.save": "ልገሳውን አስቀምጥ",
"register.public.ready": "ዝርዝሮችዎን ያጋሩ፤ ጥያቄዎንም እንገመግማለን።",
"register.public.saving": "የምዝገባ ጥያቄዎን በማስቀመጥ ላይ...",
"register.public.validation.required": "እባክዎ ከማስገባትዎ በፊት አስፈላጊ የተጠቃሚ ዝርዝሮችን ይሙሉ።",
"register.public.error": "ምዝገባውን ማስገባት አልተቻለም።",
"register.public.success": "ምዝገባዎ በተሳካ ሁኔታ ቀርቧል። የሰራተኛ አባል በቅርቡ ይገመግመዋል።",
"register.public.submitting": "በማስገባት ላይ...",
"register.public.submit": "ምዝገባ አስገባ",
"referralSource": "የሪፈራል ምንጭ",
"referralSourcePlaceholder": "ክሊኒክ፣ ቤተሰብ፣ የማህበረሰብ መሪ",
"validation.validBeneficiaryIdRequired": "የመገለጫ ዝርዝሮችን ለማሳየት ትክክለኛ የተጠቃሚ መለያ ያስፈልጋል።",
"*": "*",
".": " ",
"/login": "/login",
"assessments": "ግምገማዎች",
"beneficiaryProfileDescription": "የተጠቃሚ ምዝገባና የታሪክ ማጠቃለያ።",
"beneficiary_id,equipment_type": "የተጠቃሚ_መለያ፣የመሳሪያ_ዓይነት",
"disabilityType": "የአካል ጉዳት ዓይነት",
"disabilityTypeOtherDescription": "የአካል ጉዳቱን ይግለጹ",
"disabilityTypeOtherPlaceholder": "ሌላ የአካል ጉዳት ይግለጹ",
"equipmentDistributions": "የመሳሪያ ስርጭቶች",
"equipment_type,equipment_size": "የመሳሪያ_ዓይነት፣የመሳሪያ_መጠን",
"id,assessment_date,measurements,wheelchair_fit,notes,recommendations": "መለያ፣የግምገማ_ቀን፣መለኪያዎች፣የዊልቸር_ማስተካከያ፣ማስታወሻዎች፣ምክረ_ሀሳቦች",
"id,beneficiary_id,equipment_type,equipment_size,distribution_date,distribution_location,received_by,signature_confirmed,notes": "መለያ፣የተጠቃሚ_መለያ፣የመሳሪያ_ዓይነት፣የመሳሪያ_መጠን፣የስርጭት_ቀን፣የስርጭት_ቦታ፣የተቀበለው፣ፊርማ_ተረጋግጧል፣ማስታወሻዎች",
"id,distribution_date,equipment_type,equipment_size,distribution_location,received_by,signature_confirmed,notes": "መለያ፣የስርጭት_ቀን፣የመሳሪያ_ዓይነት፣የመሳሪያ_መጠን፣የስርጭት_ቦታ፣የተቀበለው፣ፊርማ_ተረጋግጧል፣ማስታወሻዎች",
"id,email,role,is_disabled": "መለያ፣ኢሜይል፣ሚና፣ተሰናክሏል",
"id,first_name,last_name,phone,region,status": "መለያ፣ስም፣የአባት_ስም፣ስልክ፣ክልል፣ሁኔታ",
"id,key,value": "መለያ፣ቁልፍ፣እሴት",
"id,registration_number,first_name,middle_name,last_name,phone,region,kebele,photo_url": "መለያ፣የምዝገባ_ቁጥር፣ስም፣የአባት_ስም፣የአያት_ስም፣ስልክ፣ክልል፣ቀበሌ፣የፎቶ_አድራሻ",
"id,registration_number,first_name,middle_name,last_name,region,kifle_ketema,kebele,house_number": "መለያ፣የምዝገባ_ቁጥር፣ስም፣የአባት_ስም፣የአያት_ስም፣ክልል፣ክፍለ_ከተማ፣ቀበሌ፣የቤት_ቁጥር",
"id,registration_number,registration_date,first_name,middle_name,last_name,date_of_birth,gender,phone,region,kifle_ketema,kebele,house_number,notes,photo_url": "መለያ፣የምዝገባ_ቁጥር፣የምዝገባ_ቀን፣ስም፣የአባት_ስም፣የአያት_ስም፣የትውልድ_ቀን፣ጾታ፣ስልክ፣ክልል፣ክፍለ_ከተማ፣ቀበሌ፣የቤት_ቁጥር፣ማስታወሻዎች፣የፎቶ_አድራሻ",
"key,value": "ቁልፍ፣እሴት",
"lastName": "የአያት ስም",
"middleName": "የአባት ስም",
"noAdditionalNotes": "ምንም ተጨማሪ ማስታወሻ አልተሰጠም።",
"savingAssignment": "ምደባውን በማስቀመጥ ላይ...",
"selectDisabilityType": "የአካል ጉዳት ዓይነት ይምረጡ",
"settings.saveFailed": "ማስቀመጥ አልተሳካም፦",
"settings.saved": "ቅንብሮቹ ተቀምጠዋል።",
"seatWidth": "የመቀመጫ ስፋት",
"armrestHeight": "የክንድ መደገፊያ ቁመት",
"footrestLength": "የእግር መደገፊያ ርዝመት",
"overallHeight": "ጠቅላላ ቁመት",
"weight": "ክብደት",
"deliveryConfirmation": "የማድረስ ማረጋገጫ",
"delivery.date": "የማድረስ ቀን",
"delivery.wheelchairType": "የዊልቸር ዓይነት",
"delivery.wheelchairSize": "የዊልቸር መጠን",
"delivery.serialNumber": "መለያ ቁጥር",
"delivery.beneficiarySignature": "የተጠቃሚ ፊርማ",
"delivery.partnerSignature": "የአጋር ፊርማ",
"delivery.print": "አትም / እንደ PDF አስቀምጥ",
"organization.agreements": "የድርጅት ስምምነቶች",
"organization.downloadAgreement": "ስምምነቱን አውርድ",
"organization.uploadAgreement": "የተፈረመ ስምምነት ስቀል",
"organization.type": "የድርጅት ዓይነት",
"organization.type.hospital": "ሆስፒታል",
"organization.type.clinic": "ክሊኒክ",
"organization.type.rehab": "የተሃድሶ ማዕከል",
"organization.type.ngo": "መንግስታዊ ያልሆነ ድርጅት",
"organization.type.gov": "የመንግስት ድርጅት",
"organization.type.other": "ሌላ አጋር",
"Spinal Cord Injury": "የአከርካሪ ነርቭ ጉዳት",
"Cerebral Palsy": "ሴሬብራል ፓልሲ",
"Amputation": "የአካል ክፍል መቆረጥ",
"Polio": "ፖሊዮ",
"Muscular Dystrophy": "የጡንቻ ድክመት",
"Multiple Sclerosis": "መልቲፕል ስክሌሮሲስ",
"Stroke": "ስትሮክ",
"Arthritis": "የመገጣጠሚያ በሽታ",
"Congenital Disability": "ከልደት ጀምሮ ያለ የአካል ጉዳት",
"Temporary Mobility Impairment": "ጊዜያዊ የእንቅስቃሴ ጉዳት",
"staffDashboardDescription": "የተጠቃሚዎች ፣ ምዝገባዎች እና ስራተናዊ መጠኖች ምልከታ።",
"operationalMetrics": "ስራተናዊ መጠኖች",
"totalBeneficiaries": "ጠቅላላ ተጠቃሚዎች",
"newRegistrations": "አዲስ ምዝገባዎች",
"pendingApprovals": "በመጠበቅ ላይ ያለ ፈቃዶች",
"approvedRegistrations": "ተመዝግቦ የሰጠ ምዝገባዎች",
"rejectedRegistrations": "የተከለከሉ ምዝገባዎች",
"assessmentsPending": "በመጠበቅ ላይ ያለ ግምገማዎች",
"quickActions": "ፈጣን እርምጃዎች",
"addNewBeneficiaryRecord": "አዲስ ተጠቃሚ ይጨምሩ",
"findExistingBeneficiary": "ያለውን ተጠቃሚ ይፈልጉ",
"recordWheelchairMeasurements": "መለኪያዎችን ይመዝግቡ",
"recordEquipmentDistribution": "ስርጭቱን ይመዝግቡ",
"recentBeneficiaries": "የቅርብ ጊዜ ተጠቃሚዎች",
"noBeneficiariesFound": "ተጠቃሚዎች አልተገኙም",
"adminControlCenter": "የአስተዳደር ቁጥጥር ማዕከል",
"systemWideManagement": "ሥርዓተ-አስተዳደር ማስተዳደር።",
"systemMetrics": "የስርዓት መጠኖች",
"registrationsToday": "ዛሬ ምዝገባዎች",
"registrationsThisMonth": "በዚህ ወር ምዝገባዎች",
"approvalStatus": "ፈቃድ ሁኔታ",
"activeStaff": "ንቁ ሰራተኞች",
"disabledStaff": "የተሰናከለ ሰራተኞች",
"donationOverview": "የልገሳ ጠቅላላ ዕይታ",
"donationTotal": "ጠቅላላ ልገሳዎች",
"donationsThisMonth": "በዚህ ወር ልገሳዎች",
"adminActions": "የአስተዳደር እርምጃዎች",
"manageStaffAccounts": "ሰራተኞች ሂሳቦችን ይስተዳድሩ",
"beneficiaryControl": "ተጠቃሚ ቁጥጥር",
"allBeneficiaryRecords": "ሁሉም ተጠቃሚ መዝገቦች",
"donationReports": "ልገሳዎችን ይስተዳድሩ",
"generateReports": "ሪፖርቶችን ይመልከቱ",
"staffDirectory": "የሰራተኞች ዝርዝር",
"noStaffFound": "ሰራተኞች አልተገኙም",
"errorLoadingData": "ውሂብ ሲጫን ስህተት",
"staffDashboard": "የሰራተኞች ዳሽቦርድ",
"staffAdminPortal": "ሰራተኞች / አስተዳደሪ ፖርታል",
"accountDisabled": "ፍቃድዎ ተሰናክሏል። እባክዎ ከአስተዳደሪ ጋር ይติኩ።",
"noPermission": "ይህን ስርዓት ለመድረስ ፍቃድ የለዎም።"


  },
  om: {
     "home": "Mana",
  "about": "Waa'ee",
  "services": "Tajaajilawwan",
  "contact": "Nu Qunnami",
  "donations": "Arjooma",
  "partners": "Hiriyaa",
  "navigation.agapeRegistration": "Galmee AGAPE MOBILITY ETHIOPIA",
  "agapeMenu": "Menuu AGAPE MOBILITY ETHIOPIA",
  "agapeMenuDescription": "Hojiiwwan AGAPE MOBILITY ETHIOPIA keessaa saffisaan naanna'uuf menuu",
  "aboutTitle": "Waa'ee AGAPE MOBILITY ETHIOPIA",
  "aboutDescription": "AGAPE MOBILITY ETHIOPIA namoota qaama isaanii irratti rakkoo qabanif deeggarsa sochii, yaalaa fi kunuunsa hawaasummaa gara laafinaan ni kenna.",
  "servicesTitle": "Tajaajilawwan Keenya",
  "servicesDescription": "Karoora tajaajilaa guutuu kan galmee, madaallii, raabsa fi hordoffii of keessaa qabu.",
  "contactTitle": "Nu Qunnami",
  "contactDescription": "Deeggarsa, hirmaannaa ykn gaaffiiwwan waliigalaa argachuuf nu qunnami.",
  "donationsTitle": "Hojii Keenya Milkeessuuf Gargaaraa",
  "donationsDescription": "Gargaarsi keessan kursiiwwan, meeshaalee sochii fi hordoffii namoota qaama isaanii irratti rakkoo qabanif kennamuuf gargaara.",
  "partnersTitle": "Dhaabbilee Hiriyaa",
  "partnersDescription": "Hospitaalota, kilinika, manneen yaalaa, NGOwwan fi dhaabbilee mootummaa waliin hojjechaa jirra.",
  "impactStats": "Lakkoofsa Dhiibbaa",
  "partnerNetwork": "Neetworkii Hiriyaa",
  "beneficiariesSupported": "Fayyadamtoota Deeggarsa Argatan",
  "partnerOrganizations": "Dhaabbilee Hiriyaa",
  "beneficiaries": "Fayyadamtoota",
  "newRegistration": "Galmee Haaraa",
  "registerBeneficiary": "Fayyadamaa Galmeessi",
  "beneficiaryRegistry": "Galmee Fayyadamtootaa",
  "heroTitle": "Amma Lafoorratti Kooli'uu Hin Qabdan",
  "heroSubtitle": "Deeggarsi keessan abdii fida, kabaja deebisa, akkasumas jireenya namootaa Itoophiyaa keessatti jijjiira.",
  "beneficiaryRegistration": "Galmee Fayyadamtootaa",
  "equipmentTracking": "Hordoffii Meeshaalee",
  "assessmentManagement": "Bulchiinsa Madaallii",
  "ourMission": "Ergaa Keenya",
  "ourMissionTitle": "Ergaa Keenya",
  "ourMissionText": "Itoophiyaa keessatti deeggarsa sochii gara laafinaa fi tajaajila deeggarsa fayyadamtootaa guutuu kennuu.",
  "ourReach": "Gahee Keenya",
  "ourReachTitle": "Gahee Keenya",
  "ourReachText": "Hojiiwwan deeggarsaa fi dhiibbaa fayyadamtootaa yeroo dhiyoo keessatti argame agarsiisuu.",
  "operationalDashboard": "Daashboordii Hojii",
  "dashboardDescription": "Interfeesiin kun lakkoofsota dhiibbaa, arjooma, gaaffiiwwan fi hordoffii bulchiinsaa, akkasumas Supabase waliin walitti hidhamiinsa yeroo dhugaa, guutummaatti hordofuuf gargaara.",
  "selfRegistrationCard": "Ofiin Galmeessuu",
  "selfRegistrationTitle": "Ofiin Galmeessuu",
  "selfRegistrationText": "Fayyadamtoonni piroofaayila guutuu, odeeffannoo quunnamtii fi suuraa isaanii kallattiin galchuu danda'u.",
  "staffPanelCard": "Paanaalii Hojjettootaa",
  "staffPanelTitle": "Paanaalii Hojjettootaa",
  "staffPanelText": "Hojjettoonni galmee fayyadamtootaa fi hojiiwwan adeemsa hojii olkaa'uu, ilaalu, gulaaluu fi bulchuu danda'u.",
  "adminPanelCard": "Paanaalii Bulchaa",
  "adminPanelTitle": "Paanaalii Bulchaa",
  "adminPanelText": "Bulchitoonni fayyadamtoota, qabiyyee marsariitii fi sirna bal'aa bakka tokko irraa bulchuu danda'u.",
  "registrationNumber": "Lakkoofsa Galmee",
  "registrationDate": "Guyyaa Galmee",
  "firstName": "Maqaa Jalqabaa",
  "fathersName": "Maqaa Abbaa",
  "grandfathersName": "Maqaa Akaakayyuu",
  "dateOfBirth": "Guyyaa Dhalootaa",
  "gender": "Saala",
  "male": "Dhiira",
  "female": "Dubartii",
  "phone": "Bilbila",
  "region": "Naannoo",
  "woredaZone": "Aanaa / Godina",
  "kifleKetema": "Kutaa Magaalaa",
  "houseNumber": "Lakkoofsa Manaa",
  "notes": "Yaadannoo",
  "save": "Fayyadamaa Olkaa'i",
  "savingRecord": "Galmee olkaa'aa jira...",
  "savedSuccessfully": "Fayyadamaan milkaa'inaan galmaa'e!",
  "saveFailed": "Olkaa'uun hin danda'amne:",
  "searchTerm": "Jechoota Barbaaddu",
  "searchBeneficiaries": "Fayyadamtoota Barbaadi",
  "equipmentType": "Gosa Meeshaa",
  "beneficiaryProfile": "Piroofaayila Fayyadamaa",
  "loadingRecord": "Galmee fayyadamaa fe'aa jira...",
  "viewProfile": "Piroofaayila Ilaali",
  "uploadPhoto": "Suuraa Olkaa'i",
  "selectLanguage": "Afaan",
  "login": "Seeni",
  "password": "Jecha Iccitii",
  "signIn": "Seeni",
  "signOut": "Ba'i",
  "profileLoaded": "Piroofaayilaan fayyadamaa fe'ameera.",
  "noRecords": "Galmeen tokko illee hin argamne.",
  "loadingRecent": "Galmeewwan dhiheenyaa fe'aa jira...",
  "showRecent": "Galmeewwan dhiheenyaa agarsiisi.",
  "invalidFileType": "Gosti faayilaa sirrii miti. JPG, JPEG, PNG ykn WEBP fayyadami.",
  "invalidFileSize": "Suuraan baay'ee guddaa dha. Hammanti ol'aanaan 3 MB dha.",
  "autoGeneratedOnly": "Yeroo olkaa'amu qofa ni uumama.",
  "uploadPhotoLabel": "Suuraa Fayyadamaa",
  "dashboard": "Daashboordii",
  "systemSettings": "Qindaa'inoota Sirnaa",
  "userManagement": "Bulchiinsa Fayyadamtootaa",
  "reports": "Gabaasawwan",
  "settings": "Qindaa'inoota",
  "unauthorized": "Hayyamni hin jiru. Maaloo maqaa fayyadamaa sirrii fayyadami.",
  "loading": "Fe'aa...",
  "liveDashboard": "AGAPE'etti Baga Nagaan Dhuftan",
  "languageUpdated": "Afaan jijjiirameera.",
  "applicationName": "AGAPE MOBILITY ETHIOPIA",
  "applicationTagline": "Sirna Bulchiinsa Sochii",
  "searchPlaceholder": "Maqaa, lakkoofsa galmee, bilbila, naannoo, keebilee",
  "roleStaff": "Hojjetaa",
  "roleAdmin": "Bulchaa",
  "adminPanel": "Bulchiinsa",
  "adminCenter": "Giddugala Bulchiinsaa",
  "adminCenterDescription": "Gaaffiiwwan banaa saffisaan ilaali, meeshaalee walitti qindaa'an mallattoo godhi, akkasumas loojistikii bulchi.",
  "openRequests": "Gaaffiiwwan Banaa",
  "availableWheelchairs": "Kursiiwwan Jiran",
  "beneficiary": "Fayyadamaa",
  "item": "Meeshaa",
  "status": "Haala",
  "unnamed": "Maqaan Hin Qabne",
  "statusPending": "Eegamaa Jira",
  "statusMatched": "Walitti Qindaa'ame",
  "statusDelivered": "Dabarfameera",
  "users": "Fayyadamtoota",
  "usersDescription": "Herregaawwan appilikeeshinii bulchiitii fi gahee bulchitootaa fi hojjettootaa kenni.",
  "unknownProfile": "Piroofaayila Hin Beekamne",
  "overview": "Cuunfaa",
  "buttonLabel": "Maqaa Baasi",
  "supabaseNotConfigured": "Supabase hin qindaa'in.",
  "email": "Imeelii",
  "role": "Gahee",
  "access": "Hayyama Seensaa",
  "actions": "Gochaawwan",
  "disabled": "Hojii Irraa Dhaabbate",
  "active": "Hojii Irra Jira",
  "enable": "Hojjechiisi",
  "disable": "Hojii Irraa Dhaabi",
  "noUsersFound": "Fayyadamaan tokko illee hin argamne.",
  "assessmentReady": "Madaallii haaraa dabaluuf qophiidha.",
  "savingAssessment": "Madaallii olkaa'aa jira...",
  "saveAssessment": "Madaallii Olkaa'i",
  "assessmentSaved": "Madaalliin milkaa'inaan olkaa'ameera.",
  "newAssessment": "Madaallii Haaraa",
  "assessmentDescription": "Odeeffannoo safartuu kursiiwwan fayyadamaa sirnaan qindaa'e galchi.",
  "beneficiaryId": "Eenyummaa Fayyadamaa"
     "beneficiaryIdPlaceholder": "UUID Fayyadamaa",

  "hipWidth": "Bal'ina Mudhii",

  "hipWidthPlaceholder": "Bal'ina mudhii",

  "measurements": "Safartuuwwan",

  "measurementsPlaceholder": "Dheerina, gadi-fageenya teessoo, fi kkf.",

  "wheelchairFitting": "Sirreessa Kursiiwwan Qaama Miilaa",

  "wheelchairFittingPlaceholder": "Odeeffannoo sirreessaa",

  "recommendations": "Gorsaawwan",

  "recommendationsPlaceholder": "Meeshaa gorfame, tarkaanfiiwwan hordoffii ykn gara tajaajila biraatti dabarsuu",

  "seatDepth": "Gadi-fageenya Teessoo",

  "seatDepthPlaceholder": "Gadi-fageenya teessoo",

  "backHeight": "Olka'iinsa Dugdaa",

  "backHeightPlaceholder": "Olka'iinsa dugdaa",

  "recommendedEquipment": "Meeshaa Gorfame",

  "selectEquipment": "Meeshaa Filadhu",

  "adultWheelchair": "Kursiiwwan Qaama Miilaa Ga'eessotaa",

  "childrenWheelchair": "Kursiiwwan Qaama Miilaa Daa'immanii",

  "crutches": "Ulee Deeggarsaa",

  "walker": "Meeshaa Deemsa Deeggaraa",

  "other": "Kan Biraa",

  "recommendedSize": "Hammamtaa Gorfame",

  "selectSize": "Hammamtaa Filadhu",

  "sizeSmall": "Xiqqaa",

  "sizeMedium": "Giddu-galeessa",

  "sizeLarge": "Guddaa",

  "sizeXL": "Baay'ee Guddaa",

  "assessorName": "Maqaa Nama Madaalee",

  "assessorNamePlaceholder": "Maqaa nama madaalee",

  "assessmentDate": "Guyyaa Madaallii",

  "additionalAssessmentNotes": "Yaadannoowwan Dabalataa Madaallii",

  "equipmentPlaceholder": "Kursiiwwan qaama miilaa, ulee deeggarsaa, meeshaa deemsa deeggaraa",

  "kebele": "Keebilee",

  "equipment": "Meeshaalee",

  "addEquipmentAssignment": "Ramaddii Meeshaa Dabaluu",

  "assignmentNotesPlaceholder": "Haala meeshaa, fedhii addaa, ykn odeeffannoo dabarsaa",

  "assignmentReady": "Ramaddii meeshaa dabaluuuf qophiidha.",

  "assignmentSaved": "Ramaddiin meeshaa milkaa'inaan olkaa'ameera.",

  "issueDate": "Guyyaa Kenniinsaa",

  "mobilityAssessment": "Madaallii Sochii",

  "notRecorded": "Hin Galmoofne",

  "notSpecified": "Hin Ibsaamne",

  "noAssessmentsFound": "Madaalliin fayyadamaa kanaaf hin argamne.",

  "noBeneficiarySelected": "Fayyadamaan hin filatamne.",

  "noEquipmentDistributionsFound": "Raabsiin meeshaalee fayyadamaa kanaaf hin argamne.",

  "noNotesProvided": "Yaadannoon hin kennamne.",

  "receivedBy": "Kan Fudhate",

  "registrationDetails": "Bal'ina Galmee",

  "registerDescription": "Bal'ina galmee fayyadamtoota AGAPE MOBILITY ETHIOPIA galchi; galmeewwanis madaallii fi hordoffii ramaddii gara fuula duraa tiif eegi.",

  "registrationReady": "Fayyadamaa galmeessuuf qophiidha.",

  "selectGender": "Saala Filadhu",

  "size": "Hammamtaa",

  "unknownDate": "Guyyaa Hin Beekamne",

  "unknown": "Hin Beekamne",

  "unableToLoadBeneficiary": "Fayyadamaa fe'uu hin dandeenye:",

  "trackAssignedEquipment": "Meeshaalee sochii fayyadamaa kanaaf kennaman hordofi.",

  "exampleFirstName": "Fakkeenya: Amanuel",

  "exampleMiddleName": "Fakkeenya: Bekele",

  "exampleLastName": "Fakkeenya: Tadesse",

  "examplePhone": "Fakkeenya: +251 9xx xxx xxx",

  "exampleRegion": "Finfinnee, Oromiyaa, Amaaraa",

  "exampleNeighborhood": "Naannoo ykn kutaa magaalaa",

  "exampleKebele": "Keebilee",

  "exampleHouseNumber": "Lakkoofsa Manaa",

  "notesPlaceholder": "Odeeffannoo dabalataa waa'ee qaama miidhamuu, argamummaa ykn deeggarsaa yoo jiraate.",

  "unknownBeneficiary": "Fayyadamaa Hin Beekamne",

  "searching": "Fayyadamtoota barbaadaa jira...",

  "foundRecords": "Galmeewwan fayyadamtootaa {{count}} argamaniiru.",

  "foundRecordsPrefix": "Argame",

  "loadingApplications": "Iyyannoowwan fe'aa jira...",

  "unableToLoadApplications": "Iyyannoowwan fe'uu hin dandeenye:",

  "applicationsLoaded": "Iyyannoowwan fe'amaniiru.",

  "unableToLoadApplicationsShort": "Iyyannoowwan fe'uu hin dandeenye.",

  "unableToUpdateStatus": "Haala jijjiiruu hin dandeenye:",

  "statusUpdated": "Haalichi gara kanatti jijjiirame",

  "unableToSaveChanges": "Jijjiiramoota olkaa'uu hin dandeenye:",

  "beneficiaryUpdated": "Bal'inni fayyadamaa haaromfameera.",

  "staffReviewDashboard": "Daashboordii Sakatta'iinsa Hojjettootaa",

  "staffReviewDescription": "Galmeewwan sakatta'ii, dhimma tokkoon tokkoon isaa raggaasi ykn kuffisi.",

  "allStatuses": "Haalawwan Hunda",

  "statusApproved": "Raggaafame",

  "statusRejected": "Kufaa'e",

  "edit": "Gulaali",

  "approve": "Raggaasi",

  "reject": "Kuffisi",

  "location": "Bakka",

  "needs": "Fedhiiwwan",

  "saveChanges": "Jijjiiramoota Olkaa'i",

  "cancel": "Haqi",

  "saving": "Olkaa'aa jira...",

  "noApplicationsMatch": "Iyyannoon tokko illee filannoo kanaan hin walsimne.",

  "distribution": "Raabsa",

  "equipmentDistribution": "Raabsa Meeshaalee",

  "operationalReports": "Gabaasawwan Hojii",

  "operations": "Hojiiwwan",

  "operationalActions": "Tarkaanfiiwwan Hojii",

  "operationsDescription": "Fayyadamtoota galmeessuuf, madaalliiwwan galchuuf, fi raabsa meeshaalee galmeessuuf hojiiwwan ijoo fayyadami.",

  "action.registerBeneficiary.title": "Fayyadamaa Galmeessi",

  "action.registerBeneficiary.desc": "Galmee fayyadamaa haaraa dabali.",

  "action.searchBeneficiary.title": "Fayyadamaa Barbaadi",

  "action.searchBeneficiary.desc": "Fayyadamtoota duraan galmaa'an barbaadi.",

  "action.newAssessment.title": "Madaallii Haaraa",

  "action.newAssessment.desc": "Safartuuwwan madaallii kursiiwwan qaama miilaa galchi.",

  "action.distributeEquipment.title": "Meeshaa Raabsi",

  "action.distributeEquipment.desc": "Taateewwan raabsa meeshaalee galmeessi.",

  "action.reports.title": "Gabaasa Raabsa",

  "action.reports.desc": "Gabaasawwan hojii fi cuunfaa ilaali.",

  "offline.title": "Intarneetii Irraa Addaan Baateetta",

  "offline.message": "Walitti dhufeenyi intarneetii kee addaan citee fakkaata. Amaloonni tokko tokko yeroo ammaa hojjechuu dhiisuu danda'u.",

  "offline.whatYouCanDoTitle": "Waan gochuu dandeessu:",

  "offline.checkConnection": "Walitti dhufeenya intarneetii kee ilaali",

  "offline.viewCached": "Fuulota duraan kuufaman ilaali",

  "offline.reviewSaved": "Odeeffannoo olkaa'ame sakatta'i",

  "offline.tryAgain": "Irra Deebi'ii Yaali",

  "offline.goBack": "Duubatti Deebi'i",

  "offline.reconnectInfo": "Yeroo intarneetii waliin walitti deebitu appilikeeshiniin kee akkuma duraanii ni hojjetaa.",

  "offline.icon": "📡",

  "register.title": "Galmee Fayyadamaa",

  "register.description": "Gaaffii deeggarsaa kee galchi; gareen AGAPE MOBILITY ETHIOPIA ni sakatta'a.",

  "impact.header": "Fuula Guddaa",

  "impact.title": "Deeggarsa sochii gaaffiiwwan ariifachiisaa waliin yeroo dhugaa keessatti walitti qindeessuu.",

  "impact.description": "Daashboordiin AGAPE MOBILITY ETHIOPIA arjooma dhufaa fi gaaffiiwwan fayyadamtootaa gara adeemsa loojistikii yeroo dhugaatti kursiiwwan qaama miilaa, meeshaalee sochii fi qindoomina deeggarsa ariifachiisaa keessatti jijjiira.",

  "impact.insightLabel": "Hubannoo walitti qindoominaa yeroo dhugaa",

  "impact.pendingRequestsSymbol": "gaaffiiwwan eegamaa jiran",

  "impact.donationRecords": "galmeewwan arjoomaa",

  "impact.insightDescription": "Kun suuraa hojii yeroo dhugaati; paanaaliin bulchiinsaa tarkaanfiiwwan walitti qindoominaa itti aanan dursa kennuuf itti fayyadama.",

  "impact.statRequestsLabel": "gaaffiiwwan sochii ariifachiisaa",

  "impact.statDonationsLabel": "galmeewwan arjoomaa adeemsarra jiran",

  "impact.liveLabel": "Yeroo Dhugaa",

  "impact.syncStatusLabel": "Haala wal-simsiisa Supabase",

  "beneficiaries.totalRegisteredLabel": "Waliigala Galmaa'an",

  "beneficiaries.totalRegisteredTitle": "Fayyadamtoota Hunda Bulchi",

  "beneficiaries.assessmentsLabel": "Madaalliiwwan",

  "beneficiaries.assessmentsTitle": "Madaalliiwwan sochii hordofi",

  "beneficiaries.equipmentLabel": "Meeshaalee",

  "beneficiaries.equipmentTitle": "Ramaddii fi seenaa meeshaalee hordofi",

  "coreServices.title": "Tajaajilawwan Ijoo",

  "coreServices.text": "Galmee fayyadamtootaa, madaalliiwwan sochii, raabsa meeshaalee fi hordoffii dhiibbaa.",

  "impactDriven.title": "Dhiibbaa Irratti Kan Xiyyeeffate",

  "impactDriven.text": "Gabaasa iftoomina qabu, murtoo daataa irratti hundaa'e fi dhiibbaa hawaasaa safaramuu danda'u.",

  "beneficiaryReport.title": "Gabaasa Fayyadamtootaa",

  "beneficiaryReport.description": "Fayyadamtoota dhiheenya galmaa'an, bal'ina galmee fi bakka jireenyaa isaanii waliin.",

  "distributionReport.title": "Gabaasa Raabsa",

  "distributionReport.description": "Raabsa meeshaalee dhiheenya raawwatamanii fi bal'ina namoota meeshaalee fudhatanii."
    "report.regNumber": "Lakkoofsa Galmee",
  "report.name": "Maqaa",
  "report.region": "Naannoo",
  "report.kebele": "Keebilee",
  "report.date": "Guyyaa",
  "report.beneficiary": "Fayyadamaa",
  "report.equipment": "Meeshaa",
  "report.size": "Hammamtaa",
  "report.loadingBeneficiaries": "Fayyadamtoota fe'aa jira...",
  "report.noBeneficiaries": "Fayyadamaan tokko illee hin argamne.",
  "report.loadingDistributions": "Galmeewwan raabsa fe'aa jira...",
  "report.noDistributions": "Galmeen raabsa tokko illee hin argamne.",

  "equipment.sizeSummary.title": "Cuunfaa Raabsa Meeshaalee Akka Hammamtaatti",
  "equipment.sizeSummary.description": "Cuunfaa meeshaalee raabsa taasifame gosa fi hammamtaa isaaniitiin.",
  "equipment.sizeSummary.loading": "Cuunfaa fe'aa jira...",
  "equipment.sizeSummary.empty": "Daataan raabsa meeshaalee hin jiru.",

  "request.title": "Poortaalii Gaaffii",
  "request.description": "Gaaffiiwwan sochii ariifachiisaa fayyadamtootaa galmeessi fi adeemsa walitti qindoominaa hordofi.",
  "request.ready": "Gaaffii fayyadamaa galchuuf qophiidha.",
  "request.submitting": "Gaaffii galchaa jira...",
  "request.submitFailed": "Gaaffiin galchuun hin milkoofne:",
  "request.success": "Gaaffiin milkaa'inaan olkaa'ameera.",
  "request.create": "Gaaffii Uumi",
  "request.beneficiaryName": "Maqaa Fayyadamaa",
  "request.exampleName": "Fakkeenya: Selam Bekele",
  "request.itemNeeded": "Meeshaa Barbaachisu",
  "request.exampleItem": "Kursii qaama miilaa",
  "request.details": "Bal'ina Fedhii",
  "request.detailsPlaceholder": "Ariifachiisummaa fi haala dabarsaa ibsi.",

  "equipment.distribution.title": "Meeshaa Raabsi",
  "equipment.distribution.description": "Taateewwan raabsa kursiiwwan qaama miilaa fayyadamtootaaf taasifaman galmeessi.",
  "equipment.distribution.ready": "Raabsa meeshaa galmeessuuf qophiidha.",
  "equipment.distribution.saving": "Raabsa olkaa'aa jira...",
  "equipment.distribution.save": "Raabsa Olkaa'i",
  "equipment.distribution.saveFailed": "Olkaa'uun hin milkoofne:",
  "equipment.distribution.saved": "Raabsi meeshaa milkaa'inaan olkaa'ameera.",

  "equipment.fields.beneficiaryId": "Eenyummaa Fayyadamaa",
  "equipment.placeholder.beneficiaryId": "UUID Fayyadamaa",
  "equipment.fields.type": "Gosa Meeshaa",
  "equipment.placeholder.selectEquipment": "Meeshaa Filadhu",
  "equipment.fields.size": "Hammamtaa Meeshaa",
  "equipment.placeholder.selectSize": "Hammamtaa Filadhu",
  "equipment.fields.distributionDate": "Guyyaa Raabsa",
  "equipment.fields.signatureConfirmed": "Mallattoon Mirkanaa'eera",
  "equipment.placeholder.notes": "Bal'ina dabarsaa ykn yaada fayyadamaa",
  "equipment.placeholder.distributionLocation": "Bakka Raabsa",
  "equipment.placeholder.receivedBy": "Maqaa Fudhataa ykn Hojjetaa",

  "donation.title": "Unka Arjoomaa",
  "donation.description": "Odeeffannoo arjoomaa fi haaromsa kuusaa meeshaalee galchi; daataan kun gabatee arjoomaa yeroo dhugaa waliin wal-simsiifama.",
  "donation.status.ready": "Galmee arjoomaa olkaa'uuf qophiidha.",
  "donation.status.saving": "Arjooma olkaa'aa jira...",
  "donation.status.saveFailed": "Olkaa'uun hin milkoofne:",
  "donation.status.saved": "Arjoomni milkaa'inaan olkaa'ameera.",
  "donation.donorName": "Maqaa Arjoomaa",
  "donation.itemType": "Gosa Meeshaa",
  "donation.notes": "Yaadannoo",
  "donation.placeholder.donorName": "Fakkeenya: Addis Relief Fund",
  "donation.placeholder.itemType": "Kursii qaama miilaa, meeshaa deemsa deeggaraa, siree",
  "donation.placeholder.notes": "Yaadannoo dabarsaa, ariifachiisummaa ykn bal'ina loojistikii galchi.",
  "donation.save": "Arjooma Olkaa'i",

  "register.public.ready": "Odeeffannoo keessan nuuf kennaa; gaaffii keessan ni sakatta'ina.",
  "register.public.saving": "Gaaffii galmee keessanii olkaa'aa jira...",
  "register.public.validation.required": "Maaloo galmee galchuu dura odeeffannoo barbaachisaa fayyadamaa guutaa.",
  "register.public.error": "Galmee galchuu hin dandeenye.",
  "register.public.success": "Galmeen keessan milkaa'inaan galmaa'eera. Hojjetaan tokko yeroo gabaabaa keessatti ni sakatta'a.",
  "register.public.submitting": "Galchaa jira...",
  "register.public.submit": "Galmee Ergi",

  "referralSource": "Madda Ergaa",
  "referralSourcePlaceholder": "Kilinika, maatii, hoogganaa hawaasaa",

  "validation.validBeneficiaryIdRequired": "Bal'ina piroofaayila agarsiisuuf eenyummaan fayyadamaa sirrii barbaachisa."
    "*": "*",
    ".": " ",
    "/login": "/login",

  "assessments": "Madaalliiwwan",

  "beneficiaryProfileDescription": "Cuunfaa galmee fi seenaa fayyadamaa.",

  "beneficiary_id,equipment_type": "Eenyummaa_fayyadamaa,gosa_meeshaa",

  "disabilityType": "Gosa Qaama Miidhamuu",

  "disabilityTypeOtherDescription": "Qaama miidhamuu ibsi",

  "disabilityTypeOtherPlaceholder": "Qaama miidhamuu biraa ibsi",

  "equipmentDistributions": "Raabsa Meeshaalee",

  "equipment_type,equipment_size": "Gosa_meeshaa,hammamtaa_meeshaa",

  "id,assessment_date,measurements,wheelchair_fit,notes,recommendations": "Eenyummaa,guyyaa_madaallii,safartuuwwan,sirreessa_kursii,yaadannoo,gorsaawwan",

  "id,beneficiary_id,equipment_type,equipment_size,distribution_date,distribution_location,received_by,signature_confirmed,notes": "Eenyummaa,eenyummaa_fayyadamaa,gosa_meeshaa,hammamtaa_meeshaa,guyyaa_raabsa,bakka_raabsa,kan_fudhate,mallattoo_mirkanaa'e,yaadannoo",

  "id,distribution_date,equipment_type,equipment_size,distribution_location,received_by,signature_confirmed,notes": "Eenyummaa,guyyaa_raabsa,gosa_meeshaa,hammamtaa_meeshaa,bakka_raabsa,kan_fudhate,mallattoo_mirkanaa'e,yaadannoo",

  "id,email,role,is_disabled": "Eenyummaa,imeelii,gahee,hojii_irraa_dhaabbate",

  "id,first_name,last_name,phone,region,status": "Eenyummaa,maqaa_jalqabaa,maqaa_dhumaa,bilbila,naannoo,haala",

  "id,key,value": "Eenyummaa,mallattoo,gatii",

  "id,registration_number,first_name,middle_name,last_name,phone,region,kebele,photo_url": "Eenyummaa,lakkoofsa_galmee,maqaa_jalqabaa,maqaa_giddugaleessaa,maqaa_dhumaa,bilbila,naannoo,keebilee,linkii_suuraa",

  "id,registration_number,first_name,middle_name,last_name,region,kifle_ketema,kebele,house_number": "Eenyummaa,lakkoofsa_galmee,maqaa_jalqabaa,maqaa_giddugaleessaa,maqaa_dhumaa,naannoo,kutaa_magaalaa,keebilee,lakkoofsa_manaa",

  "id,registration_number,registration_date,first_name,middle_name,last_name,date_of_birth,gender,phone,region,kifle_ketema,kebele,house_number,notes,photo_url": "Eenyummaa,lakkoofsa_galmee,guyyaa_galmee,maqaa_jalqabaa,maqaa_giddugaleessaa,maqaa_dhumaa,guyyaa_dhalootaa,saala,bilbila,naannoo,kutaa_magaalaa,keebilee,lakkoofsa_manaa,yaadannoo,linkii_suuraa",

  "key,value": "Mallattoo,gatii",

  "lastName": "Maqaa Dhumaa",

  "middleName": "Maqaa Giddugaleessaa",

  "noAdditionalNotes": "Yaadannoon dabalataa hin kennamne.",

  "savingAssignment": "Ramaddii olkaa'aa jira...",

  "selectDisabilityType": "Gosa Qaama Miidhamuu Filadhu",

  "settings.saveFailed": "Qindaa'inoota olkaa'uun hin milkoofne:",

  "settings.saved": "Qindaa'inoonni olkaa'amaniiru.",

  "seatWidth": "Bal'ina Teessoo",

  "armrestHeight": "Olka'iinsa Irra Deeggarsa Harkaa",

  "footrestLength": "Dheerina Irra Deeggarsa Miilaa",

  "overallHeight": "Olka'iinsa Waliigalaa",

  "weight": "Ulfaatina",

  "deliveryConfirmation": "Mirkaneessa Dabarsaa",

  "delivery.date": "Guyyaa Dabarsaa",

  "delivery.wheelchairType": "Gosa Kursii Qaama Miilaa",

  "delivery.wheelchairSize": "Hammamtaa Kursii Qaama Miilaa",

  "delivery.serialNumber": "Lakkoofsa Tartiibaa",

  "delivery.beneficiarySignature": "Mallattoo Fayyadamaa",

  "delivery.partnerSignature": "Mallattoo Hiriyaa",

  "delivery.print": "Maxxansi / PDF Taasisi",

  "organization.agreements": "Waliigaltee Dhaabbataa",

  "organization.downloadAgreement": "Waliigaltee Buufadhu",

  "organization.uploadAgreement": "Waliigaltee Mallatteeffame Olkaa'i",

  "organization.type": "Gosa Dhaabbataa",

  "organization.type.hospital": "Hospitaala",

  "organization.type.clinic": "Kilinika",

  "organization.type.rehab": "Giddugala Haaromsaa",

  "organization.type.ngo": "NGO",

  "organization.type.gov": "Dhaabbata Mootummaa",

  "organization.type.other": "Hiriyaa Biraa",

  "Spinal Cord Injury": "Miidhaa Lafee Dugdaa",

  "Cerebral Palsy": "Rakkoo Sochii Sammuu",

  "Amputation": "Kutamuu Qaamaa",

  "Polio": "Pooliyoo",

  "Muscular Dystrophy": "Dadhabbii Maashaa",

  "Multiple Sclerosis": "Multiple Sclerosis",

  "Stroke": "Dhiibbaa Sammuu",

  "Arthritis": "Dhukkuba Buusaa",

  "Congenital Disability": "Qaama Miidhamuu Dhalootaan Dhufu",

  "Temporary Mobility Impairment": "Rakkoo Sochii Yeroo Murtaa'eef Jiru",

  "staffDashboardDescription": "Ibsa waliigalaa fayyadamtootaa, galmeewwanii fi safartuuwwan hojii.",

  "operationalMetrics": "Safartuuwwan Hojii",

  "totalBeneficiaries": "Waliigala Fayyadamtootaa",

  "newRegistrations": "Galmeewwan Haaraa",

  "pendingApprovals": "Raggaasiiwwan Eegamaa Jiran",

  "approvedRegistrations": "Galmeewwan Raggaafaman",

  "rejectedRegistrations": "Galmeewwan Kufaatii Argatan",

  "assessmentsPending": "Madaalliiwwan Eegamaa Jiran",

  "quickActions": "Tarkaanfiiwwan Saffisaa",

  "addNewBeneficiaryRecord": "Fayyadamaa Haaraa Galmee Keessatti Dabali",

  "findExistingBeneficiary": "Fayyadamaa Duraan Jiru Barbaadi",

  "recordWheelchairMeasurements": "Safartuuwwan Galmeessi",

  "recordEquipmentDistribution": "Raabsa Meeshaa Galmeessi",

  "recentBeneficiaries": "Fayyadamtoota Dhiheenyaa",

  "noBeneficiariesFound": "Fayyadamaan tokko illee hin argamne",

  "adminControlCenter": "Giddugala To'annoo Bulchiinsaa",

  "systemWideManagement": "Bulchiinsa dhaabbataa sirna guutuu.",

  "systemMetrics": "Safartuuwwan Sirnaa",

  "registrationsToday": "Galmeewwan Har'aa",

  "registrationsThisMonth": "Galmeewwan Ji'a Kanaa",

  "approvalStatus": "Haala Raggaasii",

  "activeStaff": "Hojjettoota Hojii Irra Jiran",

  "disabledStaff": "Hojjettoota Hojii Irraa Dhaabbatan",

  "donationOverview": "Cuunfaa Arjoomaa",

  "donationTotal": "Waliigala Arjoomaa",

  "donationsThisMonth": "Arjoomawwan Ji'a Kanaa",

  "adminActions": "Tarkaanfiiwwan Bulchiinsaa",

  "manageStaffAccounts": "Herrega Hojjettootaa Bulchi",

  "beneficiaryControl": "To'annoo Fayyadamtootaa",

  "allBeneficiaryRecords": "Galmeewwan Fayyadamtootaa Hunda",

  "donationReports": "Arjoomawwan Bulchi",

  "generateReports": "Gabaasawwan Ilaali",

  "staffDirectory": "Tarree Hojjettootaa",

  "noStaffFound": "Hojjetaan tokko illee hin argamne",

  "errorLoadingData": "Daataa Fe'uu Irratti Dogoggorri Mudate",

  "staffDashboard": "Daashboordii Hojjettootaa",

  "staffAdminPortal": "Poortaalii Hojjettootaa / Bulchiinsaa",

  "accountDisabled": "Herregni kee hojii irraa dhaabbateera. Hayyama bulchiinsaa argachuuf qunnami.",

  "noPermission": "Sirna kana seenuuf hayyama hin qabdu."
  },
  ti: {
    "/login": "/login",

  "assessments": "ገምጋማት",

  "beneficiaryProfileDescription": "ሓፈሻዊ መግለጺ ምዝገባን ታሪኽን ተጠቃሚ።",

  "beneficiary_id,equipment_type": "መለለዪ_ተጠቃሚ፣ዓይነት_መሳርሒ",

  "disabilityType": "ዓይነት ስንክልና",

  "disabilityTypeOtherDescription": "እቲ ስንክልና ግለጽ",

  "disabilityTypeOtherPlaceholder": "ካልእ ስንክልና ግለጽ",

  "equipmentDistributions": "ምክፍፋል መሳርሒታት",

  "equipment_type,equipment_size": "ዓይነት_መሳርሒ፣መጠን_መሳርሒ",

  "id,assessment_date,measurements,wheelchair_fit,notes,recommendations": "መለለዪ፣ዕለት_ገምጋም፣መለክዒታት፣ምስማማዕ_ዊልቸር፣መዘኻኸሪታት፣ምኽርታት",

  "id,beneficiary_id,equipment_type,equipment_size,distribution_date,distribution_location,received_by,signature_confirmed,notes": "መለለዪ፣መለለዪ_ተጠቃሚ፣ዓይነት_መሳርሒ፣መጠን_መሳርሒ፣ዕለት_ምክፍፋል፣ቦታ_ምክፍፋል፣ዝተቐበለ_ሰብ፣ፊርማ_ተረጋጊጹ፣መዘኻኸሪ",

  "id,distribution_date,equipment_type,equipment_size,distribution_location,received_by,signature_confirmed,notes": "መለለዪ፣ዕለት_ምክፍፋል፣ዓይነት_መሳርሒ፣መጠን_መሳርሒ፣ቦታ_ምክፍፋል፣ዝተቐበለ_ሰብ፣ፊርማ_ተረጋጊጹ፣መዘኻኸሪ",

  "id,email,role,is_disabled": "መለለዪ፣ኢመይል፣ተራ፣ተሰናኺሉ",

  "id,first_name,last_name,phone,region,status": "መለለዪ፣ስም_መጀመርታ፣ስም_ኣቦ፣ተሌፎን፣ክልል፣ኩነታት",

  "id,key,value": "መለለዪ፣መፍትሕ፣ዋጋ",

  "id,registration_number,first_name,middle_name,last_name,phone,region,kebele,photo_url": "መለለዪ፣ቁጽሪ_ምዝገባ፣ስም_መጀመርታ፣ማእከላይ_ስም፣ስም_ኣቦ፣ተሌፎን፣ክልል፣ቀበሌ፣ሊንክ_ስእሊ",

  "id,registration_number,first_name,middle_name,last_name,region,kifle_ketema,kebele,house_number": "መለለዪ፣ቁጽሪ_ምዝገባ፣ስም_መጀመርታ፣ማእከላይ_ስም፣ስም_ኣቦ፣ክልል፣ክፍለ_ከተማ፣ቀበሌ፣ቁጽሪ_ገዛ",

  "id,registration_number,registration_date,first_name,middle_name,last_name,date_of_birth,gender,phone,region,kifle_ketema,kebele,house_number,notes,photo_url": "መለለዪ፣ቁጽሪ_ምዝገባ፣ዕለት_ምዝገባ፣ስም_መጀመርታ፣ማእከላይ_ስም፣ስም_ኣቦ፣ዕለት_ልደት፣ጾታ፣ተሌፎን፣ክልል፣ክፍለ_ከተማ፣ቀበሌ፣ቁጽሪ_ገዛ፣መዘኻኸሪ፣ሊንክ_ስእሊ",

  "key,value": "መፍትሕ፣ዋጋ",

  "lastName": "ስም ኣቦ",

  "middleName": "ማእከላይ ስም",

  "noAdditionalNotes": "ተወሳኺ መዘኻኸሪ የለን።",

  "savingAssignment": "ምደባ ብምዕቃብ ላዕሊ እዩ...",

  "selectDisabilityType": "ዓይነት ስንክልና ምረጽ",

  "settings.saveFailed": "ቅንብራት ምዕቃብ ኣይተዓወተን:",

  "settings.saved": "ቅንብራት ተዓቂቡ።",

  "seatWidth": "ስፍሓት መቐመጢ",

  "armrestHeight": "ቁመት መደገፊ ኢድ",

  "footrestLength": "ንውሓት መደገፊ እግሪ",

  "overallHeight": "ጠቕላላ ቁመት",

  "weight": "ክብደት",

  "deliveryConfirmation": "ምርግጋጽ ኣቕርቦት",

  "delivery.date": "ዕለት ኣቕርቦት",

  "delivery.wheelchairType": "ዓይነት ዊልቸር",

  "delivery.wheelchairSize": "መጠን ዊልቸር",

  "delivery.serialNumber": "ተኸታታሊ ቁጽሪ",

  "delivery.beneficiarySignature": "ፊርማ ተጠቃሚ",

  "delivery.partnerSignature": "ፊርማ መሻርኽቲ",

  "delivery.print": "ኣትም / ከም PDF ዓቅብ",

  "organization.agreements": "ስምምዓት ትካል",

  "organization.downloadAgreement": "ስምምዕ ኣውርድ",

  "organization.uploadAgreement": "ዝተፈረመ ስምምዕ ስቐል",

  "organization.type": "ዓይነት ትካል",

  "organization.type.hospital": "ሆስፒታል",

  "organization.type.clinic": "ክሊኒክ",

  "organization.type.rehab": "ማእከል ምሕዋይ",

  "organization.type.ngo": "NGO",

  "organization.type.gov": "መንግስታዊ ትካል",

  "organization.type.other": "ካልእ መሻርኽቲ",

  "Spinal Cord Injury": "መጉዳእቲ ኣከርካሪ",

  "Cerebral Palsy": "ሽባነት ሓንጎል",

  "Amputation": "ምቑራጽ ኣካል",

  "Polio": "ፖሊዮ",

  "Muscular Dystrophy": "ሕማም ምድካም ጭዋዳታት",

  "Multiple Sclerosis": "ብዙሕ ስክሌሮሲስ",

  "Stroke": "ስትሮክ",

  "Arthritis": "ሕማም መላግቦታት",

  "Congenital Disability": "ካብ ልደት ዝመጽእ ስንክልና",

  "Temporary Mobility Impairment": "ግዝያዊ ጸገም ምንቅስቓስ",

  "staffDashboardDescription": "ሓፈሻዊ ርእይቶ ተጠቀምቲ፣ ምዝገባታትን መለክዒታት ስራሕን።",

  "operationalMetrics": "መለክዒታት ስራሕ",

  "totalBeneficiaries": "ጠቕላላ ተጠቀምቲ",

  "newRegistrations": "ሓደሽቲ ምዝገባታት",

  "pendingApprovals": "ንምጽዳቕ ዝጽበዩ",

  "approvedRegistrations": "ዝጸደቑ ምዝገባታት",

  "rejectedRegistrations": "ዝተነጸጉ ምዝገባታት",

  "assessmentsPending": "ገምጋማት ዝጽበዩ",

  "quickActions": "ቅልጡፍ ተግባራት",

  "addNewBeneficiaryRecord": "ሓድሽ ተጠቃሚ ወስኽ",

  "findExistingBeneficiary": "ዝነበረ ተጠቃሚ ድለ",

  "recordWheelchairMeasurements": "መለክዒታት መዝግብ",

  "recordEquipmentDistribution": "ምክፍፋል መሳርሒ መዝግብ",

  "recentBeneficiaries": "ቀረባ ግዜ ዝተመዝገቡ ተጠቀምቲ",

  "noBeneficiariesFound": "ሓደ ተጠቃሚ እውን ኣይተረኽበን",

  "adminControlCenter": "ማእከል ቁጽጽር ኣስተዳደር",

  "systemWideManagement": "ኣስተዳደር ትካል ኣብ ምሉእ ስርዓት።",

  "systemMetrics": "መለክዒታት ስርዓት",

  "registrationsToday": "ሎሚ ዝተመዝገቡ",

  "registrationsThisMonth": "ምዝገባታት ናይዚ ወርሒ",

  "approvalStatus": "ኩነታት ምጽዳቕ",

  "activeStaff": "ኣብ ስራሕ ዘለዉ ሰራሕተኛታት",

  "disabledStaff": "ካብ ስራሕ ዝተሰናኸሉ ሰራሕተኛታት",

  "donationOverview": "ሓፈሻዊ ርእይቶ ወፈያ",

  "donationTotal": "ጠቕላላ ወፈያ",

  "donationsThisMonth": "ወፈያታት ናይዚ ወርሒ",

  "adminActions": "ተግባራት ኣስተዳደር",

  "manageStaffAccounts": "ኣካውንታት ሰራሕተኛታት ኣስተዳድር",

  "beneficiaryControl": "ቁጽጽር ተጠቀምቲ",

  "allBeneficiaryRecords": "ኩሎም መዝገባት ተጠቀምቲ",

  "donationReports": "ወፈያታት ኣስተዳድር",

  "generateReports": "ሪፖርታት ርአ",

  "staffDirectory": "መዝገብ ሰራሕተኛታት",

  "noStaffFound": "ሓደ ሰራሕተኛ እውን ኣይተረኽበን",

  "errorLoadingData": "ዳታ ኣብ ምጽዓን ጌጋ ተፈጢሩ",

  "staffDashboard": "ዳሽቦርድ ሰራሕተኛ",

  "staffAdminPortal": "ፖርታል ሰራሕተኛ / ኣስተዳደር",

  "accountDisabled": "ኣካውንትካ ተሰናኺሉ ኣሎ። ንዝያዳ ሓበሬታ ምስ ኣስተዳደር ተወከስ።",

  "noPermission": "ነዚ ስርዓት ንምእታው ፍቓድ የብልካን።"
     "firstName": "ቀዳማይ ስም",

  "fathersName": "ስም ኣቦ",

  "grandfathersName": "ስም ኣቦሓጎ",

  "dateOfBirth": "ዕለት ልደት",

  "gender": "ጾታ",

  "male": "ተባዕታይ",

  "female": "ኣንስታይ",

  "phone": "ተሌፎን",

  "region": "ክልል",

  "woredaZone": "ወረዳ / ዞባ",

  "kifleKetema": "ክፍለ ከተማ",

  "houseNumber": "ቁጽሪ ገዛ",

  "notes": "መዘኻኸሪ",

  "save": "ተጠቃሚ ዓቅብ",

  "savingRecord": "መዝገብ ተጠቃሚ ይዕቀብ ኣሎ...",

  "savedSuccessfully": "ተጠቃሚ ብዓወት ተመዝጊቡ!",

  "saveFailed": "ምዕቃብ ኣይተዓወተን:",

  "searchTerm": "ቃል ምድላይ",

  "searchBeneficiaries": "ተጠቀምቲ ድለ",

  "equipmentType": "ዓይነት መሳርሒ",

  "beneficiaryProfile": "ፕሮፋይል ተጠቃሚ",

  "loadingRecord": "መዝገብን ታሪኽን ተጠቃሚ ይጽዓን ኣሎ...",

  "viewProfile": "ፕሮፋይል ርአ",

  "uploadPhoto": "ስእሊ ስቐል",

  "selectLanguage": "ቋንቋ",

  "login": "እቶ",

  "password": "መሕለፊ ቃል",

  "signIn": "እቶ",

  "signOut": "ውጻእ",

  "profileLoaded": "ፕሮፋይል ተጠቃሚ ተጻዒኑ።",

  "noRecords": "ሓደ መዝገብ ተጠቃሚ እውን ኣይተረኽበን።",

  "loadingRecent": "ቀረባ ግዜ ዝተመዝገቡ ተጠቀምቲ ይጽዓኑ ኣለዉ...",

  "showRecent": "ቀረባ ግዜ ዝተመዝገቡ ተጠቀምቲ ኣርእይ።",

  "invalidFileType": "ዘይቅኑዕ ዓይነት ስእሊ። JPG, JPEG, PNG, ወይ WEBP ተጠቐም።",

  "invalidFileSize": "ስእሊ ኣዝዩ ዓቢ እዩ። እቲ ዝለዓለ መጠን 3 MB እዩ።",

  "autoGeneratedOnly": "ኣብ ግዜ ምዕቃብ ጥራይ ብራስ-ሰር ይፍጠር",

  "uploadPhotoLabel": "ስእሊ ተጠቃሚ",

  "dashboard": "ዳሽቦርድ",

  "systemSettings": "ቅንብራት ስርዓት",

  "userManagement": "ኣስተዳደር ተጠቀምቲ",

  "reports": "ሪፖርታት",

  "settings": "ቅንብራት",

  "unauthorized": "ፍቓድ የብልካን። ትኽክለኛ ተጠቃሚ ተጠቐም።",

  "loading": "ይጽዓን ኣሎ...",

  "liveDashboard": "እንቋዕ ናብ ኣጋፔ ሞቢሊቲ ኢትዮጵያ ብደሓን መጻእኩም።",

  "languageUpdated": "ቋንቋ ተሓዲሱ።",

  "applicationName": "ኣጋፔ ሞቢሊቲ ኢትዮጵያ",

  "applicationTagline": "ስርዓት ኣስተዳደር ምንቅስቓስ",

  "searchPlaceholder": "ስም፣ ቁጽሪ ምዝገባ፣ ተሌፎን፣ ክልል፣ ቀበሌ",

  "roleStaff": "ሰራሕተኛ",

  "roleAdmin": "ኣስተዳዳሪ",

  "adminPanel": "ፓነል ኣስተዳዳሪ",

  "adminCenter": "ማእከል ኣስተዳደር",

  "adminCenterDescription": "ህጹጽ ሕቶታት ገምግም፣ ነገራት ከም ዝተማሓዙ ምልክት ግበር፣ ከምኡውን ምስራዕ ሎጂስቲክስ ኣስተዳድር።",

  "openRequests": "ክፉት ሕቶታት",

  "availableWheelchairs": "ዘለዉ ዊልቸራት",

  "beneficiary": "ተጠቃሚ",

  "item": "ንብረት",

  "status": "ኩነታት",

  "unnamed": "ስም ዘይብሉ",

  "statusPending": "ተጸባዪ",

  "statusMatched": "ተመሳሲሉ",

  "statusDelivered": "ተዋሂቡ",

  "users": "ተጠቀምቲ",

  "usersDescription": "ኣካውንታት መተግበሪ ኣስተዳድር፣ ንኣስተዳደርን ሰራሕተኛታትን ድማ ሓላፍነታት ምደብ።",

  "unknownProfile": "ዘይተፈልጠ ፕሮፋይል",

  "overview": "ሓፈሻዊ ርእይቶ",

  "buttonLabel": "ስያመ መልዓሊ",

  "supabaseNotConfigured": "Supabase ኣይተዋቐረን።",

  "email": "ኢመይል",

  "role": "ተራ",

  "access": "መእተዊ ፍቓድ",

  "actions": "ተግባራት",

  "disabled": "ተሰናኺሉ",

  "active": "ንጡፍ",

  "enable": "ኣንቀሳቕስ",

  "disable": "ኣሰናኽል",

  "noUsersFound": "ሓደ ተጠቃሚ እውን ኣይተረኽበን።",

  "assessmentReady": "ሓድሽ ገምጋም ንምውሳኽ ድሉው እዩ።",

  "savingAssessment": "ገምጋም ይዕቀብ ኣሎ...",

  "saveAssessment": "ገምጋም ዓቅብ",

  "assessmentSaved": "ገምጋም ብዓወት ተዓቂቡ።",

  "newAssessment": "ሓድሽ ገምጋም",

  "assessmentDescription": "ዝተዋቐረ ናይ ዊልቸር መለክዒ ሓበሬታ ንተጠቃሚ መዝግብ።",

  "beneficiaryId": "መለለዪ ተጠቃሚ",

  "beneficiaryIdPlaceholder": "UUID ተጠቃሚ",

  "hipWidth": "ስፍሓት ሕቖ"
   "hipWidthPlaceholder": "ስፍሓት ሕቖ",

  "measurements": "መለክዒታት",

  "measurementsPlaceholder": "ቁመት፣ ዕምቀት መቐመጢ፣ ወዘተ.",

  "wheelchairFitting": "ምስማማዕ ዊልቸር",

  "wheelchairFittingPlaceholder": "ሓበሬታ ምስማማዕ",

  "recommendations": "ምኽርታት",

  "recommendationsPlaceholder": "ዝተመከረ መሳርሒ፣ ናይ ክትትል ተግባራት፣ ወይ መሰናኸል",

  "seatDepth": "ዕምቀት መቐመጢ",

  "seatDepthPlaceholder": "ዕምቀት መቐመጢ",

  "backHeight": "ቁመት ድሕሪት",

  "backHeightPlaceholder": "ቁመት ድሕሪት",

  "recommendedEquipment": "ዝተመከረ መሳርሒ",

  "selectEquipment": "መሳርሒ ምረጽ",

  "adultWheelchair": "ዊልቸር ንዓበይቲ",

  "childrenWheelchair": "ዊልቸር ንህጻናት",

  "crutches": "በትሪ መራገፊ",

  "walker": "መራመዲ",

  "other": "ካልእ",

  "recommendedSize": "ዝተመከረ መጠን",

  "selectSize": "መጠን ምረጽ",

  "sizeSmall": "ንእሽቶ",

  "sizeMedium": "ማእከላይ",

  "sizeLarge": "ዓቢ",

  "sizeXL": "ኣዝዩ ዓቢ",

  "assessorName": "ስም ገምጋሚ",

  "assessorNamePlaceholder": "ስም ገምጋሚ",

  "assessmentDate": "ዕለት ገምጋም",

  "additionalAssessmentNotes": "ተወሳኺ መዘኻኸሪታት ገምጋም",

  "equipmentPlaceholder": "ዊልቸር፣ በትሪ መራገፊ፣ መራመዲ",

  "kebele": "ቀበሌ",

  "equipment": "መሳርሒ",

  "addEquipmentAssignment": "ምደባ መሳርሒ ወስኽ",

  "assignmentNotesPlaceholder": "ኩነታት፣ ፍሉይ ድሌታት፣ ዝርዝር ኣቕርቦት",

  "assignmentReady": "ምደባ መሳርሒ ንምውሳኽ ድሉው እዩ።",

  "assignmentSaved": "ምደባ መሳርሒ ብዓወት ተዓቂቡ።",

  "issueDate": "ዕለት ምውሳድ",

  "mobilityAssessment": "ገምጋም ንቅስቓሴ",

  "notRecorded": "ኣይተመዝገበን",

  "notSpecified": "ኣይተገልጸን",

  "noAssessmentsFound": "ንዚ ተጠቃሚ ዝምልከት ገምጋም ኣይተረኽበን።",

  "noBeneficiarySelected": "ሓደ ተጠቃሚ እውን ኣይተመርጸን።",

  "noEquipmentDistributionsFound": "ንዚ ተጠቃሚ ዝምልከት ምክፍፋል መሳርሒ ኣይተረኽበን።",

  "noNotesProvided": "መዘኻኸሪ ኣይተዋህበን።",

  "receivedBy": "ዝተቐበሎ",

  "registrationDetails": "ዝርዝር ምዝገባ",

  "registerDescription": "ናይ AGAPE MOBILITY ETHIOPIA ተጠቀምቲ ዝርዝር ምዝገባ መዝግብ፣ ንወደፊት ገምጋምን ክትትል ምደባን ድማ መዝገባት ዓቅብ።",

  "registrationReady": "ተጠቃሚ ንምምዝጋብ ድሉው እዩ።",

  "selectGender": "ጾታ ምረጽ",

  "size": "መጠን",

  "unknownDate": "ዘይተፈልጠ ዕለት",

  "unknown": "ዘይተፈልጠ",

  "unableToLoadBeneficiary": "ተጠቃሚ ምጽዓን ኣይተኻእለን:",

  "trackAssignedEquipment": "ነዚ ተጠቃሚ ዝተዋህበ መሳርሒ ንቅስቓሴ ተኸታተል።",

  "exampleFirstName": "ኣብነት፦ ኣማኑኤል",

  "exampleMiddleName": "ኣብነት፦ በቀለ",

  "exampleLastName": "ኣብነት፦ ታደሰ",

  "examplePhone": "ኣብነት፦ +251 9xx xxx xxx",

  "exampleRegion": "ኣዲስ ኣበባ፣ ኦሮሚያ፣ ኣማራ",

  "exampleNeighborhood": "ከባቢ ወይ ክፍለ ከተማ",

  "exampleKebele": "ቀበሌ",

  "exampleHouseNumber": "ቁጽሪ ገዛ",

  "notesPlaceholder": "ኣማራጺ ዝርዝር ስንክልና፣ ተደራሽነት፣ ወይ ድጋፍ።",

  "unknownBeneficiary": "ዘይተፈልጠ ተጠቃሚ",

  "searching": "ተጠቀምቲ ይድለዩ ኣለዉ...",

  "foundRecords": "{{count}} መዝገብ ተጠቃሚ ተረኺቡ።",

  "foundRecordsPrefix": "ተረኺቡ",

  "loadingApplications": "ማመልከቻታት ይጽዓኑ ኣለዉ...",

  "unableToLoadApplications": "ማመልከቻታት ምጽዓን ኣይተኻእለን:",

  "applicationsLoaded": "ማመልከቻታት ተጻዒኖም።",

  "unableToLoadApplicationsShort": "ማመልከቻታት ምጽዓን ኣይተኻእለን።",

  "unableToUpdateStatus": "ኩነታት ምሕዳስ ኣይተኻእለን:",

  "statusUpdated": "ኩነታት ናብ",

  "unableToSaveChanges": "ለውጥታት ምዕቃብ ኣይተኻእለን:",

  "beneficiaryUpdated": "ዝርዝር ተጠቃሚ ተሓዲሱ።",

  "staffReviewDashboard": "ዳሽቦርድ ግምገማ ሰራሕተኛታት",

  "staffReviewDescription": "ምዝገባታት ገምግም፣ ነፍሲ ወከፍ ጉዳይ ድማ ኣጽድቕ ወይ ንጸግ።",

  "allStatuses": "ኩሎም ኩነታት",

  "statusApproved": "ጸዲቑ",

  "statusRejected": "ተነጺጉ",

  "edit": "ኣርም",

  "approve": "ኣጽድቕ",

  "reject": "ንጸግ",

  "location": "ቦታ",

  "needs": "ድሌታት",

  "saveChanges": "ለውጥታት ዓቅብ",

  "cancel": "ሰርዝ",

  "saving": "ይዕቀብ ኣሎ..."
   "noApplicationsMatch": "ምስዚ ማጣሪያ ዝሰማማዑ መመልከቲታት የለዉን።",
  "distribution": "ምክፍፋል",
  "equipmentDistribution": "ምክፍፋል መሳርሒታት",
  "operationalReports": "ሪፖርት ስራሕ",
  "operations": "ስራሕቲ",
  "operationalActions": "ተግባራት ስራሕ",
  "operationsDescription": "ቀንዲ መስርሕ ስራሕ ተጠቒምኩም ተጠቀምቲ መዝግቡ፣ ገምጋማት ምንቅስቓስ ኣካል ኣካይዱ፣ ከምኡውን ምክፍፋል መሳርሒታት መዝግቡ።",

  "action.registerBeneficiary.title": "ተጠቃሚ መዝግብ",
  "action.registerBeneficiary.desc": "ሓድሽ መዝገብ ተጠቃሚ ወስኽ።",

  "action.searchBeneficiary.title": "ተጠቃሚ ድለ",
  "action.searchBeneficiary.desc": "ዝነበሩ ተጠቀምቲ ድለ።",

  "action.newAssessment.title": "ሓድሽ ገምጋም",
  "action.newAssessment.desc": "መለክዒታት ገምጋም ዊልቸር መዝግብ።",

  "action.distributeEquipment.title": "መሳርሒ ኣከፋፍል",
  "action.distributeEquipment.desc": "ናይ መሳርሒ ምክፍፋል ፍጻመታት መዝግብ።",

  "action.reports.title": "ሪፖርት ምክፍፋል",
  "action.reports.desc": "ሪፖርታትን ሓፈሻዊ ሓበሬታታትን ስራሕ ርአ።",

  "offline.title": "ኢንተርኔት የብልካን",
  "offline.message": "ምስ ኢንተርኔት ዝነበረካ ርክብ ዝተቋረጸ ይመስል። ገለ ኣገልግሎታት ሕጂ ክሰርሑ ኣይክእሉን ይኾኑ።",
  "offline.whatYouCanDoTitle": "ክትገብሮ እትኽእል:",
  "offline.checkConnection": "ርክብ ኢንተርኔትካ መርምር",
  "offline.viewCached": "ቅድም ዝተቐመጡ ገጻት ርአ",
  "offline.reviewSaved": "ዝተቐመጠ ሓበሬታ ርአ",
  "offline.tryAgain": "እንደገና ፈትን",
  "offline.goBack": "ተመለስ",
  "offline.reconnectInfo": "ምስ ኢንተርኔት እንደገና ምስ ተራኸብካ መተግበሪያኻ ብመደበኛ ክሰርሕ እዩ።",
  "offline.icon": "ð¡",

  "register.title": "ምዝገባ ተጠቃሚ",
  "register.description": "ሕቶ ደገፍካ ኣቕርብ፣ እዚ ድማ ብጉጅለ AGAPE MOBILITY ETHIOPIA ክግምገም እዩ።",

  "impact.header": "ዋና ገዛ",
  "impact.title": "ደገፍ ምንቅስቓስ ኣካል ምስ ቀልጢፎም ዝደልዩ ሕቶታት ብእዋኑ ምስማማዕ።",
  "impact.description": "ዳሽቦርድ AGAPE MOBILITY ETHIOPIA ዝመጹ ወፈያታትን ሕቶታት ተጠቀምትን ናብ ቀጥታዊ መስርሕ ሎጂስቲክስ ናይ ዊልቸር፣ መሳርሒታት ምንቅስቓስን ህጹጽ ምውህሃድ ደገፍን ይቕይሮ።",
  "impact.insightLabel": "ቀጥታዊ ሓበሬታ ምስማማዕ",
  "impact.pendingRequestsSymbol": "ዝጽበዩ ሕቶታት",
  "impact.donationRecords": "መዝገባት ወፈያ",
  "impact.insightDescription": "እዚ ድማ እቲ ናይ ቀጥታ ስራሕ ሓፈሻዊ ምስሊ እዩ፣ ኣስተዳደር ንዝቕጽሉ ቀንዲ ተግባራት ምስማማዕ ንምውሳን ይጥቀመሉ።",
  "impact.statRequestsLabel": "ህጹጽ ሕቶታት ምንቅስቓስ ኣካል",
  "impact.statDonationsLabel": "ኣብ መስርሕ ዘለዉ መዝገባት ወፈያ",
  "impact.liveLabel": "ቀጥታዊ",
  "impact.syncStatusLabel": "ኩነታት ምስ Supabase ምስማማዕ",

  "beneficiaries.totalRegisteredLabel": "ጠቕላላ ዝተመዝገቡ",
  "beneficiaries.totalRegisteredTitle": "ኩሎም ተጠቀምቲ ኣስተዳድር",
  "beneficiaries.assessmentsLabel": "ገምጋማት",
  "beneficiaries.assessmentsTitle": "ገምጋማት ምንቅስቓስ ኣካል ተኸታተል",
  "beneficiaries.equipmentLabel": "መሳርሒታት",
  "beneficiaries.equipmentTitle": "ምደባን ታሪኽን መሳርሒታት ተኸታተል",

  "coreServices.title": "ቀንዲ ኣገልግሎታት",
  "coreServices.text": "ምዝገባ ተጠቀምቲ፣ ገምጋም ምንቅስቓስ ኣካል፣ ምክፍፋል መሳርሒታትን ምክትታል ተጽዕኖን።",

  "impactDriven.title": "ብተጽዕኖ ዝምራሕ",
  "impactDriven.text": "ግልጺ ሪፖርት፣ ብመረጃ ዝተመርኮሰ ውሳነታትን ዝለካዕ ተጽዕኖ ማሕበረሰብን።",

  "beneficiaryReport.title": "ሪፖርት ተጠቃሚ",
  "beneficiaryReport.description": "ናይ ቀረባ ግዜ ተጠቀምቲ ምስ ዝርዝር ምዝገባን ቦታን።",

  "distributionReport.title": "ሪፖርት ምክፍፋል",
  "distributionReport.description": "ናይ ቀረባ ግዜ ምክፍፋል መሳርሒታትን ዝተቐበሉ ተጠቀምትን ዝርዝር።",

  "report.regNumber": "ቁ. ምዝገባ",
  "report.name": "ስም",
  "report.region": "ክልል",
  "report.kebele": "ቀበሌ",
  "report.date": "ዕለት",
  "report.beneficiary": "ተጠቃሚ",
  "report.equipment": "መሳርሒ",
  "report.size": "ዓቐን",
  "report.loadingBeneficiaries": "ተጠቀምቲ ይጽዓኑ ኣለዉ...",
  "report.noBeneficiaries": "ምንም ተጠቃሚ ኣይተረኽበን።",
  "report.loadingDistributions": "መዝገባት ምክፍፋል ይጽዓኑ ኣለዉ...",
  "report.noDistributions": "ምንም መዝገብ ምክፍፋል ኣይተረኽበን።",

  "equipment.sizeSummary.title": "ሓፈሻዊ ሪፖርት ምክፍፋል ዓቐን መሳርሒታት",
  "equipment.sizeSummary.description": "ሓፈሻዊ ሓበሬታ ዝተኸፋፈሉ መሳርሒታት ብዓይነትን ዓቐንን።",
  "equipment.sizeSummary.loading": "ሓፈሻዊ ሓበሬታ ይጽዓን ኣሎ...",
  "equipment.sizeSummary.empty": "ምንም መረዳእታ ምክፍፋል የለን።",

  "request.title": "ፖርታል ሕቶ",
  "request.description": "ህጹጽ ሕቶታት ምንቅስቓስ ኣካል ካብ ተጠቀምቲ መዝግብን ምስማማዕ ተኸታተልን።",
  "request.ready": "ሕቶ ተጠቃሚ ንምቕራብ ድሉው እዩ።",
  "request.submitting": "ሕቶ ይልኣኽ ኣሎ...",
  "request.submitFailed": "ምልኣኽ ኣይተዓወተን:",
  "request.success": "ሕቶ ብዓወት ተቐሚጡ።",
  "request.create": "ሕቶ ፍጠር",
  "request.beneficiaryName": "ስም ተጠቃሚ",
  "request.exampleName": "ኣብነት: ሰላም በቀለ",
  "request.itemNeeded": "ዘድሊ ነገር",
  "request.exampleItem": "ዊልቸር",
  "request.details": "ዝርዝር ድሌት",
  "request.detailsPlaceholder": "ህጹጽነትን ኩነታት ምብጻሕን ግለጽ።",

  "equipment.distribution.title": "መሳርሒ ኣከፋፍል",
  "equipment.distribution.description": "ናይ ዊልቸር ምክፍፋል ፍጻመታት ንተጠቀምቲ መዝግብ።",
  "equipment.distribution.ready": "ምክፍፋል መሳርሒ ንምዝጋብ ድሉው እዩ።",
  "equipment.distribution.saving": "ምክፍፋል ይቕመጥ ኣሎ...",
  "equipment.distribution.save": "ምክፍፋል ኣቐምጥ",
  "equipment.distribution.saveFailed": "ምቕማጥ ኣይተዓወተን:",
  "equipment.distribution.saved": "ምክፍፋል መሳርሒ ብዓወት ተቐሚጡ።",
  "equipment.fields.beneficiaryId": "መለለዪ ተጠቃሚ",
  "equipment.placeholder.beneficiaryId": "UUID ተጠቃሚ",
  "equipment.fields.type": "ዓይነት መሳርሒ",
  "equipment.placeholder.selectEquipment": "መሳርሒ ምረጽ",
  "equipment.fields.size": "ዓቐን መሳርሒ",
  "equipment.placeholder.selectSize": "ዓቐን ምረጽ",
  "equipment.fields.distributionDate": "ዕለት ምክፍፋል",
  "equipment.fields.signatureConfirmed": "ፊርማ ተረጋጊጹ",
  "equipment.placeholder.notes": "ዝርዝር ምብጻሕ ወይ ምልከታታት ተጠቃሚ",
  "equipment.placeholder.distributionLocation": "ቦታ ምክፍፋል",
  "equipment.placeholder.receivedBy": "ስም ተቐባሊ ወይ ሰራሕተኛ",

  "donation.title": "ቅጥዒ ወፈያ",
  "donation.description": "ዝርዝር ወፋዪን ሓበሬታ እቃታትን ኣእቱ፣ እዚ ድማ ምስ ቀጥታዊ ሰደቓ ወፈያታት ይመሳሰል።",
  "donation.status.ready": "መዝገብ ወፈያ ንምቕማጥ ድሉው እዩ።",
  "donation.status.saving": "ወፈያ ይቕመጥ ኣሎ...",
  "donation.status.saveFailed": "ምቕማጥ ኣይተዓወተን:",
  "donation.status.saved": "ወፈያ ብዓወት ተቐሚጡ።",
  "donation.donorName": "ስም ወፋዪ",
  "donation.itemType": "ዓይነት እቃ",
  "donation.notes": "ማስታወሻ"
    "donation.placeholder.donorName": "ኣብነት፡ ኣዲስ ሪሊፍ ፈንድ",
  "donation.placeholder.itemType": "ዊልቸር፣ መመላለሲ መሳርሒ፣ ፍራሽ",
  "donation.placeholder.notes": "ዝርዝር ምብጻሕ፣ ህጹጽነት ወይ ሎጂስቲክስ ሓበሬታ ወስኽ።",
  "donation.save": "ወፈያ ኣቐምጥ",

  "register.public.ready": "ዝርዝር ሓበሬታኻ ኣካፍል፣ ንሕቶኻ ድማ ክንግምግሞ ኢና።",
  "register.public.saving": "ሕቶ ምዝገባኻ ይቕመጥ ኣሎ...",
  "register.public.validation.required": "ቅድሚ ምልኣኽካ ኩሉ ኣድላዪ ዝርዝር ተጠቃሚ ምልኣ።",
  "register.public.error": "ምዝገባ ክትልእኽ ኣይተኻእለን።",
  "register.public.success": "ምዝገባኻ ብዓወት ተላኢኹ። ሓደ ሰራሕተኛ ቀልጢፉ ክግምግሞ እዩ።",
  "register.public.submitting": "ይልኣኽ ኣሎ...",
  "register.public.submit": "ምዝገባ ልኣኽ",

  "referralSource": "ምንጪ ሪፈራል",
  "referralSourcePlaceholder": "ክሊኒክ፣ ስድራቤት፣ መራሒ ማሕበረሰብ",

  "validation.validBeneficiaryIdRequired": "ዝርዝር ፕሮፋይል ተጠቃሚ ንምርኣይ ቅኑዕ መለለዪ ተጠቃሚ የድሊ።"
    "*": "*",
    ".": " ",
     "/login": "/login",
  "assessments": "ገምጋማት",
  "beneficiaryProfileDescription": "ሓፈሻዊ መግለጺ ምዝገባን ታሪኽን ተጠቃሚ።",

  "beneficiary_id,equipment_type": "መለለዪ_ተጠቃሚ፣ዓይነት_መሳርሒ",
  "disabilityType": "ዓይነት ስንክልና",
  "disabilityTypeOtherDescription": "ነቲ ስንክልና ግለጽ",
  "disabilityTypeOtherPlaceholder": "ካልእ ስንክልና ግለጽ",
  "equipmentDistributions": "ምክፍፋል መሳርሒታት",
  "equipment_type,equipment_size": "ዓይነት_መሳርሒ፣ዓቐን_መሳርሒ",

  "id,assessment_date,measurements,wheelchair_fit,notes,recommendations": "መለለዪ፣ዕለት_ገምጋም፣መለክዒታት፣ምስክር_ዊልቸር፣ማስታወሻታት፣ምኽርታት",

  "id,beneficiary_id,equipment_type,equipment_size,distribution_date,distribution_location,received_by,signature_confirmed,notes": "መለለዪ፣መለለዪ_ተጠቃሚ፣ዓይነት_መሳርሒ፣ዓቐን_መሳርሒ፣ዕለት_ምክፍፋል፣ቦታ_ምክፍፋል፣ብዝተቐበለ፣ፊርማ_ተረጋጊጹ፣ማስታወሻታት",

  "id,distribution_date,equipment_type,equipment_size,distribution_location,received_by,signature_confirmed,notes": "መለለዪ፣ዕለት_ምክፍፋል፣ዓይነት_መሳርሒ፣ዓቐን_መሳርሒ፣ቦታ_ምክፍፋል፣ብዝተቐበለ፣ፊርማ_ተረጋጊጹ፣ማስታወሻታት",

  "id,email,role,is_disabled": "መለለዪ፣ኢሜይል፣ግደፍ፣ተሰናኺሉ",
  "id,first_name,last_name,phone,region,status": "መለለዪ፣ስም_መጀመርታ፣ስም_ሓደ፣ስልኪ፣ክልል፣ኩነታት",
  "id,key,value": "መለለዪ፣መፍትሕ፣ዋጋ",

  "id,registration_number,first_name,middle_name,last_name,phone,region,kebele,photo_url": "መለለዪ፣ቁጽሪ_ምዝገባ፣ስም_መጀመርታ፣ማእከላይ_ስም፣ስም_ሓደ፣ስልኪ፣ክልል፣ቀበሌ፣መራኸቢ_ሊንክ_ስእሊ",

  "id,registration_number,first_name,middle_name,last_name,region,kifle_ketema,kebele,house_number": "መለለዪ፣ቁጽሪ_ምዝገባ፣ስም_መጀመርታ፣ማእከላይ_ስም፣ስም_ሓደ፣ክልል፣ክፍለ_ከተማ፣ቀበሌ፣ቁጽሪ_ገዛ",

  "id,registration_number,registration_date,first_name,middle_name,last_name,date_of_birth,gender,phone,region,kifle_ketema,kebele,house_number,notes,photo_url": "መለለዪ፣ቁጽሪ_ምዝገባ፣ዕለት_ምዝገባ፣ስም_መጀመርታ፣ማእከላይ_ስም፣ስም_ሓደ፣ዕለት_ልደት፣ጾታ፣ስልኪ፣ክልል፣ክፍለ_ከተማ፣ቀበሌ፣ቁጽሪ_ገዛ፣ማስታወሻታት፣መራኸቢ_ሊንክ_ስእሊ",

  "key,value": "መፍትሕ፣ዋጋ",
  "lastName": "ስም ሓደ",
  "middleName": "ማእከላይ ስም",
  "noAdditionalNotes": "ተወሳኺ ማስታወሻ የለን።",
  "savingAssignment": "ምደባ ይቕመጥ ኣሎ...",
  "selectDisabilityType": "ዓይነት ስንክልና ምረጽ",

  "settings.saveFailed": "ምቕማጥ ኣይተዓወተን:",
  "settings.saved": "ቅንብራት ተቐሚጦም።",

  "seatWidth": "ስፍሓት መቐመጢ",
  "armrestHeight": "ቁመት መደገፊ ኢድ",
  "footrestLength": "ንውሓት መደገፊ እግሪ",
  "overallHeight": "ጠቕላላ ቁመት",
  "weight": "ክብደት",

  "deliveryConfirmation": "ምርግጋጽ ምብጻሕ",
  "delivery.date": "ዕለት ምብጻሕ",
  "delivery.wheelchairType": "ዓይነት ዊልቸር",
  "delivery.wheelchairSize": "ዓቐን ዊልቸር",
  "delivery.serialNumber": "ቁጽሪ መለለዪ",
  "delivery.beneficiarySignature": "ፊርማ ተጠቃሚ",
  "delivery.partnerSignature": "ፊርማ መሻርኽቲ",
  "delivery.print": "ኣትም / ከም PDF ዓቅብ",

  "organization.agreements": "ስምምዓት ውድብ",
  "organization.downloadAgreement": "ስምምዕ ኣውርድ",
  "organization.uploadAgreement": "ዝተፈረመ ስምምዕ ስቐል",
  "organization.type": "ዓይነት ውድብ",
  "organization.type.hospital": "ሆስፒታል",
  "organization.type.clinic": "ክሊኒክ",
  "organization.type.rehab": "ማእከል ምሕዋይ",
  "organization.type.ngo": "NGO",
  "organization.type.gov": "መንግስታዊ ውድብ",
  "organization.type.other": "ካልእ መሻርኽቲ",

  "Spinal Cord Injury": "መጉዳእቲ ኣከርካሪ",
  "Cerebral Palsy": "ሓማም ሽባነት ህጻናት",
  "Amputation": "ምቑራጽ ኣካል",
  "Polio": "ፖሊዮ",
  "Muscular Dystrophy": "ሕማም ድኽመት ጭዋዳታት",
  "Multiple Sclerosis": "ብዙሕ ስክለሮሲስ",
  "Stroke": "ስትሮክ",
  "Arthritis": "ሕማም መላግቦ",
  "Congenital Disability": "ብውልደት ዝመጽእ ስንክልና",
  "Temporary Mobility Impairment": "ግዝያዊ ጸገም ምንቅስቓስ",

  "staffDashboardDescription": "ሓፈሻዊ ምልከታ ተጠቀምቲ፣ ምዝገባታትን መለክዒታት ስራሕን።",
  "operationalMetrics": "መለክዒታት ስራሕ",
  "totalBeneficiaries": "ጠቕላላ ተጠቀምቲ",
  "newRegistrations": "ሓደሽቲ ምዝገባታት",
  "pendingApprovals": "ዝጽበዩ ፍቓዳት",
  "approvedRegistrations": "ዝተፈቐዱ ምዝገባታት",
  "rejectedRegistrations": "ዝተነጸጉ ምዝገባታት",
  "assessmentsPending": "ዝጽበዩ ገምጋማት",

  "quickActions": "ቅልጡፍ ተግባራት",
  "addNewBeneficiaryRecord": "ሓድሽ ተጠቃሚ ወስኽ",
  "findExistingBeneficiary": "ዝነበረ ተጠቃሚ ድለ",
  "recordWheelchairMeasurements": "መለክዒታት መዝግብ",
  "recordEquipmentDistribution": "ምክፍፋል መዝግብ",
  "recentBeneficiaries": "ናይ ቀረባ ግዜ ተጠቀምቲ",
  "noBeneficiariesFound": "ምንም ተጠቃሚ ኣይተረኽበን",

  "adminControlCenter": "ማእከል ቁጽጽር ኣስተዳደር",
  "systemWideManagement": "ምሉእ ኣስተዳደር ውድባዊ ስርዓት።",
  "systemMetrics": "መለክዒታት ስርዓት",
  "registrationsToday": "ምዝገባታት ሎሚ",
  "registrationsThisMonth": "ምዝገባታት (ወርሒ)",
  "approvalStatus": "ኩነታት ፍቓድ",
  "activeStaff": "ንጡፋት ሰራሕተኛታት",
  "disabledStaff": "ዝተሰናኸሉ ሰራሕተኛታት",

  "donationOverview": "ሓፈሻዊ ምልከታ ወፈያ",
  "donationTotal": "ጠቕላላ ወፈያ",
  "donationsThisMonth": "ወፈያታት (ወርሒ)",

  "adminActions": "ተግባራት ኣስተዳደር",
  "manageStaffAccounts": "ኣካውንታት ሰራሕተኛታት ኣስተዳድር",
  "beneficiaryControl": "ቁጽጽር ተጠቀምቲ",
  "allBeneficiaryRecords": "ኩሎም መዝገባት ተጠቀምቲ",
  "donationReports": "ወፈያታት ኣስተዳድር",
  "generateReports": "ሪፖርታት ርአ"
    "staffDirectory": "መዝገብ ሰራተኞች",

"noStaffFound": "ምንም ሰራተኛ ኣይተረኽበን",

"errorLoadingData": "ዳታ ኣብ ምጽዓን ጌጋ ተፈጢሩ",

"staffDashboard": "ዳሽቦርድ ሰራተኛ",

"staffAdminPortal": "ፖርታል ሰራተኛ / ኣስተዳደር",

"accountDisabled": "ኣካውንትካ ተሰናኺሉ ኣሎ። በጃኻ ምስ ኣስተዳዳሪ ተራኸብ።",

"noPermission": "ነዚ ስርዓት ንምእታው ፍቓድ የብልካን።"
  },
};
