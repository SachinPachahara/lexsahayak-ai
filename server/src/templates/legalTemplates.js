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
