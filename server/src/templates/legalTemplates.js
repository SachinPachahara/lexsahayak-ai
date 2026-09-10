export const legalTemplates = [
  {
    id: 'rent-agreement', name: 'Rent Agreement', category: 'Personal', icon: 'Home',
    description: 'Create a residential tenancy agreement with rent, deposit, duration and responsibility clauses.',
    fields: [
      ['landlordName','Landlord name','text',true], ['tenantName','Tenant name','text',true],
      ['propertyAddress','Property address','textarea',true], ['monthlyRent','Monthly rent (INR)','number',true],
      ['securityDeposit','Security deposit (INR)','number',true], ['startDate','Start date','date',true],
      ['durationMonths','Duration (months)','number',true], ['noticePeriodDays','Notice period (days)','number',true],
      ['maintenanceResponsibility','Maintenance responsibility','text',false], ['city','City / jurisdiction','text',true]
    ]
  },
  {
    id: 'nda', name: 'Non-Disclosure Agreement', category: 'Business', icon: 'ShieldCheck',
    description: 'Draft a confidentiality agreement for two parties exchanging sensitive information.',
    fields: [
      ['disclosingParty','Disclosing party','text',true], ['receivingParty','Receiving party','text',true],
      ['purpose','Purpose of disclosure','textarea',true], ['confidentialInfo','Confidential information scope','textarea',true],
      ['termMonths','Confidentiality term (months)','number',true], ['effectiveDate','Effective date','date',true],
      ['exceptions','Exceptions','textarea',false], ['city','City / jurisdiction','text',true]
    ]
  },
  {
    id: 'employment-agreement', name: 'Employment Agreement', category: 'Business', icon: 'BriefcaseBusiness',
    description: 'Employment terms covering role, compensation, probation, notice and confidentiality.',
    fields: [
      ['employerName','Employer name','text',true], ['employeeName','Employee name','text',true],
      ['jobTitle','Job title','text',true], ['joiningDate','Joining date','date',true], ['salary','Annual salary (INR)','number',true],
      ['probationMonths','Probation (months)','number',false], ['noticePeriodDays','Notice period (days)','number',true],
      ['workLocation','Work location','text',true], ['remoteWork','Remote work terms','text',false], ['city','City / jurisdiction','text',true]
    ]
  },
  {
    id: 'freelance-agreement', name: 'Freelance Agreement', category: 'Business', icon: 'Laptop',
    description: 'Define scope, milestones, payment, intellectual property and termination for freelance work.',
    fields: [
      ['clientName','Client name','text',true], ['freelancerName','Freelancer name','text',true],
      ['scope','Scope of work','textarea',true], ['fee','Total fee (INR)','number',true], ['paymentSchedule','Payment schedule','textarea',true],
      ['startDate','Start date','date',true], ['endDate','Target completion date','date',false],
      ['ipOwnership','IP ownership terms','textarea',true], ['noticePeriodDays','Termination notice (days)','number',false]
    ]
  },
  {
    id: 'service-agreement', name: 'Service Agreement', category: 'Business', icon: 'Handshake',
    description: 'General agreement for a service provider and customer with deliverables and payment terms.',
    fields: [
      ['providerName','Service provider','text',true], ['customerName','Customer','text',true],
      ['services','Services / deliverables','textarea',true], ['fees','Fees and taxes','textarea',true],
      ['term','Term','text',true], ['sla','Service levels','textarea',false], ['termination','Termination terms','textarea',true],
      ['city','City / jurisdiction','text',true]
    ]
  },
  {
    id: 'partnership-agreement', name: 'Partnership Agreement', category: 'Startup', icon: 'UsersRound',
    description: 'Capture partner contributions, profit sharing, governance and exit arrangements.',
    fields: [
      ['firmName','Firm name','text',true], ['partners','Partners (comma separated)','textarea',true],
      ['businessPurpose','Business purpose','textarea',true], ['capitalContributions','Capital contributions','textarea',true],
      ['profitSharing','Profit/loss sharing','textarea',true], ['decisionRules','Decision-making rules','textarea',true],
      ['exitTerms','Retirement / exit terms','textarea',true], ['city','City / jurisdiction','text',true]
    ]
  },
  {
    id: 'affidavit', name: 'Affidavit', category: 'Personal', icon: 'FileSignature',
    description: 'Create a structured factual declaration suitable for review before notarisation/attestation.',
    fields: [
      ['deponentName','Deponent name','text',true], ['age','Age','number',true], ['address','Address','textarea',true],
      ['facts','Facts being affirmed','textarea',true], ['purpose','Purpose','textarea',true], ['city','Place','text',true],
      ['date','Date','date',true]
    ]
  },
  {
    id: 'consumer-complaint', name: 'Consumer Complaint Draft', category: 'Consumer', icon: 'BadgeAlert',
    description: 'Draft a plain-language consumer grievance/complaint with transaction and relief details.',
    fields: [
      ['complainantName','Complainant name','text',true], ['businessName','Business / seller','text',true],
      ['transactionDate','Transaction date','date',true], ['amount','Amount involved (INR)','number',false],
      ['issue','Issue / deficiency','textarea',true], ['stepsTaken','Previous resolution attempts','textarea',false],
      ['relief','Relief requested','textarea',true], ['city','City','text',true]
    ]
  },
  {
    id: 'internship-agreement', name: 'Internship Agreement', category: 'Career', icon: 'GraduationCap',
    description: 'Document internship duration, stipend, responsibilities, confidentiality and IP terms.',
    fields: [
      ['organizationName','Organization','text',true], ['internName','Intern name','text',true],
      ['role','Internship role','text',true], ['startDate','Start date','date',true], ['endDate','End date','date',true],
      ['stipend','Stipend (INR/month)','number',false], ['responsibilities','Responsibilities','textarea',true],
      ['mentor','Reporting manager / mentor','text',false], ['workMode','Work mode/location','text',true]
    ]
  },
  {
    id: 'legal-notice', name: 'Legal Notice Draft', category: 'Personal', icon: 'MailWarning',
    description: 'Prepare a factual notice draft for professional review before formal service.',
    fields: [
      ['senderName','Sender name','text',true], ['recipientName','Recipient name','text',true],
      ['senderAddress','Sender address','textarea',true], ['recipientAddress','Recipient address','textarea',true],
      ['facts','Material facts','textarea',true], ['demand','Demand / requested action','textarea',true],
      ['responseDays','Time requested for response (days)','number',true], ['city','City','text',true]
    ]
  },
  {
    id: 'cheque-bounce-notice', name: 'Cheque Bounce Notice (Sec 138 NI Act)', category: 'Personal', icon: 'AlertTriangle',
    description: 'Statutory demand notice under Section 138 of Negotiable Instruments Act, 1881 demanding payment within 15 days of dishonour.',
    fields: [
      ['payeeName','Payee / Complainant name','text',true], ['drawerName','Drawer / Accused name','text',true],
      ['drawerAddress','Drawer address','textarea',true], ['chequeNumber','Cheque number','text',true],
      ['chequeDate','Cheque date','date',true], ['chequeAmount','Cheque amount (INR)','number',true],
      ['bankName','Drawee bank & branch','text',true], ['returnMemoDate','Bank return memo date','date',true],
      ['dishonourReason','Reason for return (e.g. Funds Insufficient)','text',true],
      ['debtPurpose','Underlying legal liability / transaction details','textarea',true],
      ['city','City / jurisdiction','text',true]
    ]
  },
  {
    id: 'promissory-note', name: 'Promissory Note (On Demand)', category: 'Personal', icon: 'Receipt',
    description: 'Unconditional undertaking to pay a sum of money on demand under Section 4 of Negotiable Instruments Act, 1881.',
    fields: [
      ['makerName','Maker / Borrower name','text',true], ['makerAddress','Maker address','textarea',true],
      ['payeeName','Payee / Lender name','text',true], ['principalAmount','Principal amount (INR)','number',true],
      ['interestRate','Interest rate (% p.a., if any)','number',false], ['executionDate','Date of execution','date',true],
      ['repaymentType','Repayment condition (e.g. On demand / by specific date)','text',true], ['city','Place / city of execution','text',true]
    ]
  },
  {
    id: 'founders-agreement', name: "Co-Founders' Agreement", category: 'Startup', icon: 'Briefcase',
    description: 'Establish equity allocation, 4-year vesting schedule, 1-year cliff, IP assignment and exit terms for startup co-founders.',
    fields: [
      ['companyName','Proposed / Registered company name','text',true], ['founders','Founders names and roles (comma-separated)','textarea',true],
      ['businessObjective','Business scope and objective','textarea',true], ['equityDistribution','Equity split percentages (e.g. 50-50 or 60-40)','textarea',true],
      ['vestingPeriodYears','Vesting period in years (typically 4)','number',true], ['cliffPeriodMonths','Cliff period in months (typically 12)','number',true],
      ['ipAssignment','IP assignment clause details','textarea',true], ['decisionMaking','Major decision voting rule (e.g. Unanimous or 75%)','text',true],
      ['city','Governing jurisdiction / city','text',true]
    ]
  },
  {
    id: 'simple-will', name: 'Simple Will (Testament)', category: 'Personal', icon: 'Scroll',
    description: 'Testamentary disposition of movable and immovable assets with executor and 2 attesting witnesses under Indian Succession Act, 1925.',
    fields: [
      ['testatorName','Testator full name','text',true], ['fatherSpouseName',"Father's / Spouse's name",'text',true],
      ['age','Age of testator','number',true], ['residenceAddress','Current residential address','textarea',true],
      ['executorName','Appointed executor name','text',true], ['beneficiaries','Beneficiaries and asset distribution details','textarea',true],
      ['propertySchedule','Schedule of properties, bank accounts & investments','textarea',true],
      ['witnessNames','Names of two independent attesting witnesses','textarea',true], ['city','Place of execution','text',true]
    ]
  },
  {
    id: 'power-of-attorney', name: 'General Power of Attorney (GPA)', category: 'Personal', icon: 'FileCheck2',
    description: 'Appoint an agent / attorney to manage property, administrative, financial or legal affairs under Powers of Attorney Act, 1882.',
    fields: [
      ['principalName','Principal full name','text',true], ['principalAddress','Principal address','textarea',true],
      ['attorneyName','Attorney / Agent full name','text',true], ['attorneyAddress','Attorney address','textarea',true],
      ['powersDescription','Specific powers granted (property, banking, utility, representation)','textarea',true],
      ['effectiveDate','Effective date','date',true], ['revocationCondition','Revocation terms (e.g. At will of principal)','text',true],
      ['city','Place / jurisdiction','text',true]
    ]
  },
  {
    id: 'commercial-lease', name: 'Commercial Lease Agreement', category: 'Business', icon: 'Building2',
    description: 'Comprehensive lease for commercial shop, office or warehouse with rent escalation, lock-in period and maintenance terms.',
    fields: [
      ['lessorName','Landlord / Lessor name','text',true], ['lesseeName','Tenant / Lessee name / Entity','text',true],
      ['premisesAddress','Commercial premises address & area (sq ft)','textarea',true], ['monthlyRent','Monthly rent (INR)','number',true],
      ['securityDeposit','Interest-free security deposit (INR)','number',true], ['leaseDurationMonths','Lease tenure in months','number',true],
      ['lockInPeriodMonths','Lock-in period in months','number',true], ['rentEscalationPercent','Annual rent escalation (% e.g. 5%)','number',true],
      ['permittedUse','Permitted commercial activity','text',true], ['city','City / jurisdiction','text',true]
    ]
  },
  {
    id: 'website-privacy-policy', name: 'Website Privacy Policy (DPDP Act)', category: 'Startup', icon: 'Shield',
    description: 'Compliant digital privacy notice detailing data collection, consent, grievance redressal and rights under DPDP Act, 2023 & IT Rules.',
    fields: [
      ['platformName','App / Website name','text',true], ['companyName','Operating entity name','text',true],
      ['websiteUrl','Website URL','text',true], ['dataCollected','Types of personal data collected','textarea',true],
      ['processingPurpose','Purposes of data processing','textarea',true], ['grievanceOfficerName','Grievance Officer name & designation','text',true],
      ['grievanceOfficerEmail','Grievance Officer official email','text',true], ['city','Registered office city / jurisdiction','text',true]
    ]
  },
  {
    id: 'friendly-loan-agreement', name: 'Personal Loan Agreement', category: 'Personal', icon: 'Banknote',
    description: 'Agreement for friendly or personal monetary loan between individuals specifying repayment installments and default interest.',
    fields: [
      ['lenderName','Lender name','text',true], ['borrowerName','Borrower name','text',true],
      ['loanAmount','Loan amount (INR)','number',true], ['disbursementDate','Date of disbursement / payment mode','text',true],
      ['interestRate','Interest rate (% p.a., if any)','number',false], ['repaymentSchedule','Repayment schedule & final due date','textarea',true],
      ['defaultPenalty','Late payment fee / default consequence','text',false], ['city','City / jurisdiction','text',true]
    ]
  },
  {
    id: 'vendor-supply-agreement', name: 'Vendor Supply Agreement', category: 'Business', icon: 'Truck',
    description: 'Terms for regular procurement of goods, specifications, inspection, rejection window, invoicing and warranty.',
    fields: [
      ['buyerName','Buyer entity name','text',true], ['vendorName','Vendor / Supplier entity name','text',true],
      ['goodsDescription','Description and specifications of goods','textarea',true], ['pricingAndPayment','Pricing, GST and payment credit terms','textarea',true],
      ['deliveryTerms','Delivery schedule and location','textarea',true], ['inspectionDays','Inspection and rejection window (days)','number',true],
      ['warrantyPeriodMonths','Warranty period in months','number',false], ['city','Governing law / city','text',true]
    ]
  },
  {
    id: 'consultancy-agreement', name: 'Consultancy Agreement', category: 'Business', icon: 'UserCheck',
    description: 'Independent consultant agreement specifying advisory deliverables, retainer fees, non-solicitation and IP assignment.',
    fields: [
      ['clientName','Client company name','text',true], ['consultantName','Consultant name / firm','text',true],
      ['scopeOfServices','Detailed advisory scope and deliverables','textarea',true], ['feeStructure','Retainer fee / milestone fee (INR)','textarea',true],
      ['termDurationMonths','Engagement duration in months','number',true], ['nonSolicitationMonths','Non-solicitation period in months','number',false],
      ['city','City / jurisdiction','text',true]
    ]
  },
  {
    id: 'rera-delay-notice', name: 'RERA Builder Delay Notice', category: 'Consumer', icon: 'Building',
    description: 'Formal demand notice to developer under Section 18 of RERA, 2016 demanding interest for delayed possession or refund.',
    fields: [
      ['allotteeName','Homebuyer / Allottee name','text',true], ['builderName','Builder / Developer entity name','text',true],
      ['projectName','Project name and RERA registration number','text',true], ['unitDetails','Apartment / Flat / Plot number and tower','text',true],
      ['agreementDate','Date of Builder-Buyer Agreement','date',true], ['promisedPossessionDate','Promised possession date as per agreement','date',true],
      ['amountPaidTillDate','Total amount paid till date (INR)','number',true], ['reliefDemanded','Relief demanded (e.g. Monthly delay interest at SBI MCLR+2% or full refund)','textarea',true],
      ['responseDays','Response window in days (typically 15)','number',true], ['city','City / State RERA jurisdiction','text',true]
    ]
  },
  {
    id: 'gift-deed', name: 'Gift Deed (Immovable / Movable)', category: 'Personal', icon: 'Gift',
    description: 'Voluntary transfer of property without monetary consideration out of natural love and affection under Transfer of Property Act, 1882.',
    fields: [
      ['donorName','Donor full name','text',true], ['doneeName','Donee full name','text',true],
      ['relationship','Relationship between Donor and Donee','text',true], ['propertyDetails','Schedule and description of gifted property / asset','textarea',true],
      ['marketValue','Estimated market value for stamp duty (INR)','number',true], ['possessionHandoverDate','Date of delivery of possession','date',true],
      ['witnessNames','Names of two attesting witnesses','textarea',true], ['city','City / registration sub-registrar office','text',true]
    ]
  },
  {
    id: 'custom-document', name: 'Custom Legal Document', category: 'Custom', icon: 'FilePlus2',
    description: 'Create a guided first draft when the document you need is not in the template library.',
    fields: [
      ['documentTitle','Document name','text',true], ['partyOne','First party / person','text',true],
      ['partyTwo','Second party / person','text',false], ['purpose','Purpose and background','textarea',true],
      ['keyTerms','Main terms, facts and deliverables','textarea',true], ['paymentTerms','Payment / consideration, if any','textarea',false],
      ['startDate','Start / effective date','date',false], ['endDate','End date / duration, if any','date',false],
      ['terminationTerms','Termination or completion terms','textarea',false], ['specialClauses','Special clauses or instructions','textarea',false],
      ['city','City / jurisdiction','text',true]
    ]
  }
].map(t => ({ ...t, fields: t.fields.map(([name,label,type,required]) => ({ name,label,type,required })) }));

export function getTemplate(id) { return legalTemplates.find(t => t.id === id); }
