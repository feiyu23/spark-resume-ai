/**
 * Comprehensive Industry Keywords Database
 * Based on open-source projects: AI-Resume-Analyzer, Nokia skilltree, and O*NET
 * Covers ALL industries, not just education
 */

export interface IndustryKeywords {
  name: string
  aliases: string[]
  keywords: {
    technical: string[]
    soft: string[]
    tools: string[]
    certifications: string[]
    australian?: string[] // Australian-specific terms
  }
  jobTitles: string[]
  companies?: string[] // Example companies in this industry
}

export const INDUSTRY_DATABASE: Record<string, IndustryKeywords> = {
  // Technology & Software
  'technology': {
    name: 'Technology & IT',
    aliases: ['tech', 'it', 'software', 'development', 'engineering'],
    keywords: {
      technical: [
        'software development', 'full stack', 'backend', 'frontend', 'API development',
        'microservices', 'cloud computing', 'DevOps', 'CI/CD', 'agile', 'scrum',
        'system design', 'scalability', 'performance optimization', 'debugging',
        'code review', 'version control', 'database design', 'REST APIs', 'GraphQL',
        'containerization', 'orchestration', 'monitoring', 'logging', 'security'
      ],
      soft: [
        'problem solving', 'analytical thinking', 'collaboration', 'communication',
        'time management', 'attention to detail', 'continuous learning', 'adaptability'
      ],
      tools: [
        'Git', 'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure', 'GCP', 'Terraform',
        'Ansible', 'Prometheus', 'Grafana', 'ElasticSearch', 'Redis', 'MongoDB',
        'PostgreSQL', 'MySQL', 'Visual Studio Code', 'IntelliJ IDEA', 'Postman'
      ],
      certifications: [
        'AWS Certified', 'Azure Certified', 'Google Cloud Certified', 'CISSP',
        'CompTIA Security+', 'Certified Scrum Master', 'PMP', 'ITIL'
      ],
      australian: [
        'Australian Computer Society', 'ACS certification', 'NBN experience',
        'MyGov integration', 'Australian privacy principles', 'APPs compliance'
      ]
    },
    jobTitles: [
      'Software Engineer', 'Developer', 'Programmer', 'DevOps Engineer',
      'Cloud Architect', 'Data Engineer', 'Full Stack Developer', 'Backend Developer',
      'Frontend Developer', 'Mobile Developer', 'QA Engineer', 'Site Reliability Engineer'
    ],
    companies: ['Atlassian', 'Canva', 'REA Group', 'SEEK', 'Xero', 'WiseTech Global']
  },

  // Data Science & AI
  'data_science': {
    name: 'Data Science & AI',
    aliases: ['data', 'analytics', 'machine learning', 'ai', 'ml'],
    keywords: {
      technical: [
        'machine learning', 'deep learning', 'neural networks', 'data analysis',
        'statistical modeling', 'predictive analytics', 'data visualization',
        'feature engineering', 'model deployment', 'A/B testing', 'hypothesis testing',
        'time series analysis', 'natural language processing', 'computer vision',
        'reinforcement learning', 'ensemble methods', 'cross-validation'
      ],
      soft: [
        'analytical thinking', 'problem solving', 'communication', 'storytelling',
        'business acumen', 'curiosity', 'attention to detail'
      ],
      tools: [
        'Python', 'R', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'Pandas',
        'NumPy', 'Jupyter', 'Tableau', 'Power BI', 'SQL', 'Spark', 'Hadoop',
        'MLflow', 'Kubeflow', 'SageMaker', 'DataBricks', 'Snowflake'
      ],
      certifications: [
        'TensorFlow Certificate', 'AWS Machine Learning', 'Google ML Engineer',
        'Microsoft Azure AI', 'Databricks Certified', 'SAS Certified'
      ],
      australian: [
        'CSIRO Data61', 'Australian Bureau of Statistics', 'ABS data',
        'Australian AI Ethics Framework', 'Data.gov.au'
      ]
    },
    jobTitles: [
      'Data Scientist', 'Machine Learning Engineer', 'AI Engineer', 'Data Analyst',
      'Business Analyst', 'Data Engineer', 'Research Scientist', 'ML Ops Engineer'
    ]
  },

  // Finance & Banking
  'finance': {
    name: 'Finance & Banking',
    aliases: ['banking', 'financial services', 'investment', 'accounting'],
    keywords: {
      technical: [
        'financial analysis', 'financial modeling', 'risk management', 'compliance',
        'regulatory reporting', 'budgeting', 'forecasting', 'valuation', 'auditing',
        'portfolio management', 'investment analysis', 'credit analysis', 'KYC',
        'AML', 'Basel III', 'IFRS', 'cash flow management', 'treasury', 'derivatives'
      ],
      soft: [
        'attention to detail', 'analytical skills', 'integrity', 'communication',
        'time management', 'problem solving', 'client relationship'
      ],
      tools: [
        'Excel', 'Bloomberg Terminal', 'SAP', 'Oracle Financials', 'QuickBooks',
        'MYOB', 'Xero', 'Power BI', 'Tableau', 'SQL', 'Python', 'R', 'MATLAB'
      ],
      certifications: [
        'CPA', 'CA', 'CFA', 'FRM', 'ACCA', 'CMA', 'CIA', 'CISA'
      ],
      australian: [
        'APRA compliance', 'ASIC regulations', 'ASX listing rules', 'GST',
        'Australian taxation', 'superannuation', 'SMSF', 'Responsible lending',
        'Banking Code of Practice', 'AUSTRAC', 'Open Banking'
      ]
    },
    jobTitles: [
      'Financial Analyst', 'Accountant', 'Investment Banker', 'Risk Manager',
      'Compliance Officer', 'Auditor', 'Treasury Analyst', 'Credit Analyst',
      'Portfolio Manager', 'Financial Planner', 'Tax Consultant'
    ],
    companies: ['Commonwealth Bank', 'Westpac', 'ANZ', 'NAB', 'Macquarie', 'AMP']
  },

  // Healthcare & Medical
  'healthcare': {
    name: 'Healthcare & Medical',
    aliases: ['medical', 'health', 'clinical', 'hospital', 'nursing'],
    keywords: {
      technical: [
        'patient care', 'clinical excellence', 'diagnosis', 'treatment planning',
        'medical records', 'patient safety', 'infection control', 'medication administration',
        'clinical research', 'evidence-based practice', 'health assessment',
        'care coordination', 'discharge planning', 'quality improvement', 'clinical protocols'
      ],
      soft: [
        'empathy', 'compassion', 'communication', 'teamwork', 'attention to detail',
        'stress management', 'critical thinking', 'cultural sensitivity'
      ],
      tools: [
        'EMR systems', 'EPIC', 'Cerner', 'Medical devices', 'Telehealth platforms',
        'PACS', 'Laboratory systems', 'Pharmacy systems', 'Clinical decision support'
      ],
      certifications: [
        'AHPRA registration', 'CPR certification', 'First Aid', 'ACLS', 'PALS',
        'Infection Control', 'Mental Health First Aid'
      ],
      australian: [
        'Medicare', 'PBS', 'MBS', 'AHPRA', 'TGA regulations', 'My Health Record',
        'ACSQHC standards', 'NDIS', 'WorkCover', 'Private health insurance'
      ]
    },
    jobTitles: [
      'Doctor', 'Nurse', 'Allied Health Professional', 'Medical Technician',
      'Healthcare Administrator', 'Clinical Researcher', 'Pharmacist',
      'Physiotherapist', 'Occupational Therapist', 'Psychologist'
    ],
    companies: ['Ramsay Health Care', 'Healthscope', 'St Vincent\'s', 'Royal Melbourne Hospital']
  },

  // Marketing & Advertising
  'marketing': {
    name: 'Marketing & Advertising',
    aliases: ['digital marketing', 'advertising', 'brand', 'communications'],
    keywords: {
      technical: [
        'digital marketing', 'SEO', 'SEM', 'content marketing', 'social media marketing',
        'email marketing', 'marketing automation', 'campaign management', 'brand strategy',
        'market research', 'consumer insights', 'conversion optimization', 'A/B testing',
        'marketing analytics', 'ROI analysis', 'customer segmentation', 'lead generation'
      ],
      soft: [
        'creativity', 'communication', 'analytical thinking', 'project management',
        'collaboration', 'adaptability', 'presentation skills'
      ],
      tools: [
        'Google Analytics', 'Google Ads', 'Facebook Ads Manager', 'HubSpot', 'Salesforce',
        'Mailchimp', 'Hootsuite', 'Adobe Creative Suite', 'Canva', 'SEMrush', 'Ahrefs',
        'Marketo', 'Pardot', 'WordPress', 'Shopify'
      ],
      certifications: [
        'Google Ads Certified', 'Google Analytics', 'Facebook Blueprint',
        'HubSpot Certified', 'Content Marketing Institute', 'Digital Marketing Institute'
      ],
      australian: [
        'ACCC advertising standards', 'AANA Code of Ethics', 'Australian privacy laws',
        'Spam Act compliance', 'Consumer law', 'TGA advertising guidelines'
      ]
    },
    jobTitles: [
      'Marketing Manager', 'Digital Marketing Specialist', 'Content Marketer',
      'Social Media Manager', 'SEO Specialist', 'Brand Manager', 'Marketing Analyst',
      'Campaign Manager', 'Growth Marketer', 'Product Marketing Manager'
    ]
  },

  // Sales & Business Development
  'sales': {
    name: 'Sales & Business Development',
    aliases: ['business development', 'account management', 'sales'],
    keywords: {
      technical: [
        'sales strategy', 'lead generation', 'pipeline management', 'account management',
        'business development', 'relationship building', 'negotiation', 'closing deals',
        'sales forecasting', 'territory management', 'solution selling', 'consultative selling',
        'value proposition', 'customer retention', 'upselling', 'cross-selling'
      ],
      soft: [
        'communication', 'persuasion', 'listening skills', 'resilience', 'empathy',
        'time management', 'networking', 'presentation skills'
      ],
      tools: [
        'Salesforce', 'HubSpot CRM', 'Pipedrive', 'LinkedIn Sales Navigator',
        'Outreach', 'SalesLoft', 'Zoom', 'Microsoft Teams', 'Slack'
      ],
      certifications: [
        'Salesforce Certified', 'HubSpot Sales', 'Sandler Training',
        'SPIN Selling', 'Challenger Sale'
      ],
      australian: [
        'Australian Consumer Law', 'ACCC guidelines', 'Fair Trading',
        'GST implications', 'Australian business culture'
      ]
    },
    jobTitles: [
      'Sales Manager', 'Business Development Manager', 'Account Executive',
      'Sales Representative', 'Account Manager', 'Sales Director',
      'Business Development Representative', 'Sales Engineer'
    ]
  },

  // Human Resources
  'hr': {
    name: 'Human Resources',
    aliases: ['human resources', 'people and culture', 'talent', 'recruitment'],
    keywords: {
      technical: [
        'talent acquisition', 'recruitment', 'onboarding', 'performance management',
        'employee relations', 'compensation and benefits', 'HRIS', 'workforce planning',
        'training and development', 'succession planning', 'organizational development',
        'change management', 'employee engagement', 'HR analytics', 'compliance'
      ],
      soft: [
        'communication', 'empathy', 'confidentiality', 'conflict resolution',
        'influencing', 'coaching', 'emotional intelligence'
      ],
      tools: [
        'Workday', 'SAP SuccessFactors', 'ADP', 'BambooHR', 'Culture Amp',
        'LinkedIn Recruiter', 'SEEK Talent', 'Indeed', 'Slack', 'Microsoft Teams'
      ],
      certifications: [
        'AHRI Certification', 'SHRM-CP', 'SHRM-SCP', 'CIPD'
      ],
      australian: [
        'Fair Work Act', 'Modern Awards', 'Enterprise Agreements', 'NES',
        'WorkCover', 'Superannuation Guarantee', 'Workplace Gender Equality Act',
        'Anti-discrimination laws', 'Privacy Act', 'Single Touch Payroll'
      ]
    },
    jobTitles: [
      'HR Manager', 'Talent Acquisition Specialist', 'HR Business Partner',
      'Recruiter', 'HR Advisor', 'People and Culture Manager', 'Learning and Development Manager'
    ]
  },

  // Engineering (Non-Software)
  'engineering': {
    name: 'Engineering',
    aliases: ['engineer', 'mechanical', 'electrical', 'civil', 'chemical'],
    keywords: {
      technical: [
        'project management', 'technical design', 'CAD', 'engineering analysis',
        'quality assurance', 'risk assessment', 'compliance', 'specifications',
        'prototyping', 'testing', 'commissioning', 'maintenance', 'troubleshooting',
        'process improvement', 'technical documentation', 'safety protocols'
      ],
      soft: [
        'problem solving', 'analytical thinking', 'attention to detail', 'teamwork',
        'project management', 'communication', 'innovation'
      ],
      tools: [
        'AutoCAD', 'SolidWorks', 'MATLAB', 'ANSYS', 'Revit', 'Civil 3D',
        'SAP', 'Microsoft Project', 'Primavera', 'SCADA', 'PLC programming'
      ],
      certifications: [
        'CPEng', 'NER', 'RPEQ', 'Project Management Professional', 'Six Sigma'
      ],
      australian: [
        'Australian Standards', 'Engineers Australia', 'NCC compliance',
        'WHS requirements', 'Environmental regulations', 'NATA accreditation'
      ]
    },
    jobTitles: [
      'Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer',
      'Chemical Engineer', 'Project Engineer', 'Design Engineer',
      'Quality Engineer', 'Process Engineer'
    ]
  },

  // Construction & Trades
  'construction': {
    name: 'Construction & Trades',
    aliases: ['building', 'construction', 'trades', 'contractor'],
    keywords: {
      technical: [
        'project management', 'construction management', 'site supervision',
        'building codes', 'safety compliance', 'quality control', 'subcontractor management',
        'scheduling', 'cost estimation', 'contract administration', 'blueprint reading',
        'building materials', 'construction methods', 'site safety'
      ],
      soft: [
        'leadership', 'communication', 'problem solving', 'time management',
        'attention to detail', 'physical fitness', 'teamwork'
      ],
      tools: [
        'Procore', 'Buildertrend', 'PlanGrid', 'AutoCAD', 'Revit', 'MS Project',
        'Aconex', 'SafetyCulture', 'Total stations', 'Building tools'
      ],
      certifications: [
        'White Card', 'Builders License', 'Trade licenses', 'Working at Heights',
        'Confined Spaces', 'First Aid', 'Traffic Control'
      ],
      australian: [
        'NCC', 'Australian Standards', 'Safe Work Australia', 'WorkCover',
        'QBCC', 'Master Builders', 'HIA', 'Environmental regulations'
      ]
    },
    jobTitles: [
      'Project Manager', 'Site Manager', 'Construction Manager', 'Foreman',
      'Quantity Surveyor', 'Estimator', 'Building Inspector', 'Tradesperson'
    ]
  },

  // Education & Training
  'education': {
    name: 'Education & Training',
    aliases: ['teaching', 'training', 'academic', 'education'],
    keywords: {
      technical: [
        'curriculum development', 'lesson planning', 'assessment design', 'student engagement',
        'differentiated instruction', 'classroom management', 'educational technology',
        'learning outcomes', 'pedagogical strategies', 'student assessment',
        'inclusive education', 'professional development', 'collaborative learning'
      ],
      soft: [
        'communication', 'patience', 'creativity', 'empathy', 'organization',
        'adaptability', 'leadership', 'mentoring'
      ],
      tools: [
        'LMS platforms', 'Moodle', 'Canvas', 'Blackboard', 'Google Classroom',
        'Microsoft Teams', 'Zoom', 'Interactive whiteboards', 'Educational apps'
      ],
      certifications: [
        'Teaching registration', 'VIT registration', 'NESA accreditation',
        'TAE40116', 'First Aid', 'Working with Children Check'
      ],
      australian: [
        'Australian Curriculum', 'AITSL standards', 'NAPLAN', 'VCE', 'HSC',
        'ATAR', 'TEQSA', 'ASQA', 'National Quality Framework'
      ]
    },
    jobTitles: [
      'Teacher', 'Lecturer', 'Trainer', 'Educational Coordinator',
      'Curriculum Developer', 'Learning Designer', 'Academic', 'Tutor'
    ]
  },

  // Retail & E-commerce
  'retail': {
    name: 'Retail & E-commerce',
    aliases: ['retail', 'ecommerce', 'store', 'shop'],
    keywords: {
      technical: [
        'customer service', 'sales', 'inventory management', 'merchandising',
        'point of sale', 'visual merchandising', 'stock control', 'loss prevention',
        'category management', 'pricing strategy', 'supply chain', 'e-commerce',
        'order fulfillment', 'returns processing'
      ],
      soft: [
        'customer focus', 'communication', 'teamwork', 'problem solving',
        'attention to detail', 'flexibility', 'enthusiasm'
      ],
      tools: [
        'POS systems', 'Shopify', 'WooCommerce', 'Magento', 'SAP Retail',
        'Square', 'Inventory systems', 'CRM systems', 'Excel'
      ],
      certifications: [
        'Retail Management Certificate', 'Customer Service Excellence',
        'Visual Merchandising', 'Loss Prevention'
      ],
      australian: [
        'Australian Consumer Law', 'GST', 'Fair Trading', 'Retail Award',
        'Product safety standards', 'ACCC regulations'
      ]
    },
    jobTitles: [
      'Store Manager', 'Retail Manager', 'Sales Associate', 'Visual Merchandiser',
      'Buyer', 'Category Manager', 'E-commerce Manager', 'Customer Service Representative'
    ]
  },

  // Manufacturing & Production
  'manufacturing': {
    name: 'Manufacturing & Production',
    aliases: ['manufacturing', 'production', 'factory', 'operations'],
    keywords: {
      technical: [
        'production planning', 'quality control', 'lean manufacturing', 'Six Sigma',
        'continuous improvement', 'supply chain management', 'inventory control',
        'process optimization', 'safety compliance', 'equipment maintenance',
        'production scheduling', 'cost reduction', 'waste reduction', 'automation'
      ],
      soft: [
        'attention to detail', 'problem solving', 'teamwork', 'time management',
        'analytical skills', 'adaptability', 'safety consciousness'
      ],
      tools: [
        'ERP systems', 'SAP', 'MRP systems', 'SCADA', 'PLC', 'AutoCAD',
        'Quality management systems', 'Microsoft Excel', 'Minitab'
      ],
      certifications: [
        'Six Sigma', 'Lean Manufacturing', 'ISO 9001', 'HACCP',
        'Forklift license', 'First Aid'
      ],
      australian: [
        'Australian Standards', 'Safe Work Australia', 'WHS requirements',
        'Environmental regulations', 'Fair Work', 'Modern Awards'
      ]
    },
    jobTitles: [
      'Production Manager', 'Operations Manager', 'Quality Manager',
      'Production Supervisor', 'Process Engineer', 'Quality Inspector',
      'Supply Chain Manager', 'Warehouse Manager'
    ]
  },

  // Hospitality & Tourism
  'hospitality': {
    name: 'Hospitality & Tourism',
    aliases: ['hospitality', 'tourism', 'hotel', 'restaurant', 'events'],
    keywords: {
      technical: [
        'customer service', 'guest relations', 'food and beverage', 'hotel operations',
        'event management', 'reservations', 'front desk operations', 'housekeeping',
        'revenue management', 'food safety', 'menu planning', 'catering',
        'tourism marketing', 'destination management'
      ],
      soft: [
        'communication', 'cultural awareness', 'teamwork', 'flexibility',
        'problem solving', 'attention to detail', 'multitasking'
      ],
      tools: [
        'PMS systems', 'Opera', 'POS systems', 'Booking engines', 'Channel managers',
        'Restaurant management systems', 'Event planning software'
      ],
      certifications: [
        'RSA', 'RCG', 'Food Safety Supervisor', 'Barista certification',
        'Wine knowledge', 'First Aid'
      ],
      australian: [
        'RSA requirements', 'Food safety standards', 'Liquor licensing',
        'Tourism Australia', 'Fair Work hospitality award', 'GST'
      ]
    },
    jobTitles: [
      'Hotel Manager', 'Restaurant Manager', 'Chef', 'Event Manager',
      'Tourism Manager', 'Front Desk Manager', 'Food and Beverage Manager'
    ]
  },

  // Legal & Compliance
  'legal': {
    name: 'Legal & Compliance',
    aliases: ['law', 'legal', 'compliance', 'regulatory'],
    keywords: {
      technical: [
        'legal research', 'contract drafting', 'compliance management', 'regulatory affairs',
        'litigation', 'due diligence', 'risk assessment', 'corporate governance',
        'intellectual property', 'employment law', 'commercial law', 'dispute resolution',
        'legal analysis', 'case management'
      ],
      soft: [
        'analytical thinking', 'attention to detail', 'communication', 'integrity',
        'time management', 'critical thinking', 'negotiation'
      ],
      tools: [
        'Legal research databases', 'Document management systems', 'E-discovery tools',
        'Contract management systems', 'Compliance software', 'Microsoft Office'
      ],
      certifications: [
        'Admitted to practice', 'Law degree', 'Graduate Diploma in Legal Practice',
        'Compliance certifications', 'Mediation accreditation'
      ],
      australian: [
        'Australian legal system', 'Corporations Act', 'Competition and Consumer Act',
        'Privacy Act', 'Work Health and Safety Act', 'Fair Work Act',
        'ASIC regulations', 'ACCC guidelines'
      ]
    },
    jobTitles: [
      'Lawyer', 'Legal Counsel', 'Compliance Officer', 'Paralegal',
      'Legal Secretary', 'Contract Manager', 'Risk Manager', 'Company Secretary'
    ]
  },

  // Government & Public Service
  'government': {
    name: 'Government & Public Service',
    aliases: ['government', 'public service', 'public sector', 'policy'],
    keywords: {
      technical: [
        'policy development', 'public administration', 'stakeholder engagement',
        'regulatory compliance', 'program management', 'budget management',
        'briefing preparation', 'legislative analysis', 'community consultation',
        'service delivery', 'grant management', 'procurement'
      ],
      soft: [
        'communication', 'integrity', 'analytical thinking', 'stakeholder management',
        'cultural sensitivity', 'teamwork', 'adaptability'
      ],
      tools: [
        'TRIM', 'SAP', 'Microsoft Office', 'SharePoint', 'GovCMS',
        'Statistical software', 'Project management tools'
      ],
      certifications: [
        'Security clearance', 'Public service training', 'Project management',
        'Policy development training'
      ],
      australian: [
        'APS Values', 'Public Service Act', 'FOI Act', 'Privacy Act',
        'Government procurement rules', 'Budget processes', 'Cabinet processes',
        'Senate estimates', 'ANAO requirements'
      ]
    },
    jobTitles: [
      'Policy Officer', 'Program Manager', 'Director', 'Executive Officer',
      'Project Officer', 'Analyst', 'Administrative Officer', 'Advisor'
    ]
  },

  // Transport & Logistics
  'logistics': {
    name: 'Transport & Logistics',
    aliases: ['logistics', 'supply chain', 'transport', 'freight', 'warehousing'],
    keywords: {
      technical: [
        'supply chain management', 'logistics coordination', 'freight forwarding',
        'warehouse management', 'inventory control', 'distribution', 'route planning',
        'customs clearance', 'dangerous goods', 'cold chain', 'last mile delivery',
        'fleet management', 'transportation planning'
      ],
      soft: [
        'problem solving', 'attention to detail', 'time management', 'communication',
        'analytical skills', 'stress management', 'teamwork'
      ],
      tools: [
        'WMS', 'TMS', 'SAP', 'Oracle SCM', 'GPS tracking', 'RFID',
        'EDI systems', 'Microsoft Excel', 'Power BI'
      ],
      certifications: [
        'Forklift license', 'Heavy vehicle license', 'Dangerous goods',
        'Chain of Responsibility', 'Customs broker license'
      ],
      australian: [
        'Chain of Responsibility', 'HVNL', 'Australian Border Force',
        'Biosecurity requirements', 'GST on imports', 'Free Trade Agreements'
      ]
    },
    jobTitles: [
      'Logistics Manager', 'Supply Chain Manager', 'Warehouse Manager',
      'Transport Coordinator', 'Freight Forwarder', 'Customs Broker',
      'Fleet Manager', 'Distribution Manager'
    ]
  },

  // Agriculture & Mining
  'agriculture_mining': {
    name: 'Agriculture & Mining',
    aliases: ['agriculture', 'farming', 'mining', 'resources'],
    keywords: {
      technical: [
        'crop management', 'livestock management', 'soil science', 'irrigation',
        'pest control', 'harvest planning', 'mining operations', 'geology',
        'drilling', 'exploration', 'environmental management', 'safety management',
        'resource extraction', 'rehabilitation'
      ],
      soft: [
        'problem solving', 'physical fitness', 'safety awareness', 'teamwork',
        'adaptability', 'attention to detail', 'self-reliance'
      ],
      tools: [
        'GPS guidance', 'Farm management software', 'Mining software',
        'GIS', 'Drones', 'Heavy machinery', 'Laboratory equipment'
      ],
      certifications: [
        'Chemical handling', 'Heavy machinery licenses', 'Mine safety',
        'Environmental management', 'First Aid'
      ],
      australian: [
        'Biosecurity', 'Murray-Darling Basin', 'Mining regulations',
        'Native Title', 'Environmental regulations', 'Water rights',
        'Carbon farming', 'Live export regulations'
      ]
    },
    jobTitles: [
      'Farm Manager', 'Agronomist', 'Mining Engineer', 'Geologist',
      'Environmental Officer', 'Safety Officer', 'Operations Manager'
    ]
  },

  // Real Estate & Property
  'real_estate': {
    name: 'Real Estate & Property',
    aliases: ['real estate', 'property', 'realty'],
    keywords: {
      technical: [
        'property sales', 'property management', 'leasing', 'valuation',
        'market analysis', 'negotiation', 'property law', 'strata management',
        'facilities management', 'property development', 'investment analysis',
        'tenant relations', 'maintenance coordination'
      ],
      soft: [
        'communication', 'negotiation', 'networking', 'customer service',
        'attention to detail', 'time management', 'integrity'
      ],
      tools: [
        'CRM systems', 'Property management software', 'REA', 'Domain',
        'CoreLogic', 'Microsoft Office', 'DocuSign'
      ],
      certifications: [
        'Real Estate License', 'CPP', 'Property Management', 'Auctioneers license'
      ],
      australian: [
        'Residential Tenancies Act', 'Strata laws', 'REIQ', 'REIV',
        'Foreign investment rules', 'Stamp duty', 'Capital gains tax'
      ]
    },
    jobTitles: [
      'Real Estate Agent', 'Property Manager', 'Sales Agent', 'Leasing Consultant',
      'Property Developer', 'Valuer', 'Strata Manager', 'Facilities Manager'
    ]
  },

  // Media & Communications
  'media': {
    name: 'Media & Communications',
    aliases: ['media', 'journalism', 'communications', 'publishing', 'broadcasting'],
    keywords: {
      technical: [
        'content creation', 'journalism', 'copywriting', 'editing', 'storytelling',
        'media production', 'broadcasting', 'social media', 'public relations',
        'crisis communications', 'brand communications', 'video production',
        'podcast production', 'SEO writing'
      ],
      soft: [
        'creativity', 'communication', 'time management', 'attention to detail',
        'adaptability', 'critical thinking', 'networking'
      ],
      tools: [
        'Adobe Creative Suite', 'Final Cut Pro', 'Pro Tools', 'CMS platforms',
        'Social media tools', 'Analytics tools', 'CRM systems'
      ],
      certifications: [
        'Journalism degree', 'PR accreditation', 'Digital marketing',
        'Content marketing', 'Video production'
      ],
      australian: [
        'ACMA regulations', 'Australian Press Council', 'Defamation laws',
        'Copyright laws', 'Classification guidelines', 'ABC standards'
      ]
    },
    jobTitles: [
      'Journalist', 'Editor', 'Content Creator', 'Producer', 'PR Manager',
      'Communications Manager', 'Social Media Manager', 'Copywriter'
    ]
  },

  // Non-Profit & NGO
  'nonprofit': {
    name: 'Non-Profit & NGO',
    aliases: ['nonprofit', 'ngo', 'charity', 'social services'],
    keywords: {
      technical: [
        'fundraising', 'grant writing', 'donor management', 'volunteer coordination',
        'program management', 'community engagement', 'impact measurement',
        'stakeholder management', 'advocacy', 'partnership development',
        'financial stewardship', 'governance'
      ],
      soft: [
        'empathy', 'passion', 'communication', 'teamwork', 'resilience',
        'cultural sensitivity', 'integrity', 'adaptability'
      ],
      tools: [
        'CRM systems', 'Salesforce Nonprofit Cloud', 'Donor databases',
        'Grant management systems', 'Social media', 'Microsoft Office'
      ],
      certifications: [
        'Fundraising certification', 'Grant writing', 'Nonprofit management',
        'Volunteer management'
      ],
      australian: [
        'ACNC compliance', 'DGR status', 'Fundraising regulations',
        'Charity law', 'Privacy Act', 'Volunteer protection'
      ]
    },
    jobTitles: [
      'Program Manager', 'Fundraising Manager', 'Grant Writer',
      'Community Engagement Officer', 'Volunteer Coordinator',
      'Development Manager', 'Executive Director'
    ]
  },

  // Creative & Design
  'creative': {
    name: 'Creative & Design',
    aliases: ['design', 'creative', 'art', 'graphic design', 'ux'],
    keywords: {
      technical: [
        'graphic design', 'UI/UX design', 'web design', 'branding', 'typography',
        'color theory', 'layout design', 'user research', 'wireframing', 'prototyping',
        'visual communication', 'motion graphics', '3D design', 'illustration'
      ],
      soft: [
        'creativity', 'attention to detail', 'communication', 'time management',
        'collaboration', 'critical thinking', 'adaptability'
      ],
      tools: [
        'Adobe Creative Suite', 'Sketch', 'Figma', 'InVision', 'After Effects',
        'Cinema 4D', 'Blender', 'WordPress', 'HTML/CSS'
      ],
      certifications: [
        'Adobe Certified', 'Google UX Design', 'Design degree',
        'UI/UX certification'
      ],
      australian: [
        'AGDA', 'DIA', 'Copyright laws', 'IP protection',
        'Australian design standards'
      ]
    },
    jobTitles: [
      'Graphic Designer', 'UX Designer', 'UI Designer', 'Web Designer',
      'Creative Director', 'Art Director', 'Motion Graphics Designer'
    ]
  },

  // General/Other - Fallback category
  'general': {
    name: 'General',
    aliases: ['general', 'other', 'misc', 'various'],
    keywords: {
      technical: [
        'project management', 'process improvement', 'data analysis', 'reporting',
        'documentation', 'quality assurance', 'research', 'planning',
        'coordination', 'administration'
      ],
      soft: [
        'communication', 'teamwork', 'problem solving', 'time management',
        'attention to detail', 'adaptability', 'critical thinking', 'leadership',
        'customer service', 'organization'
      ],
      tools: [
        'Microsoft Office', 'Google Workspace', 'Slack', 'Zoom', 'Trello',
        'Asana', 'JIRA', 'Confluence'
      ],
      certifications: [
        'Project Management', 'Business Analysis', 'Six Sigma', 'ITIL'
      ],
      australian: [
        'Fair Work Act', 'WHS', 'Privacy Act', 'Australian Standards',
        'GST', 'ABN', 'Super guarantee'
      ]
    },
    jobTitles: [
      'Manager', 'Coordinator', 'Analyst', 'Administrator', 'Officer',
      'Specialist', 'Consultant', 'Assistant'
    ]
  }
}

// Helper function to get all industries
export function getAllIndustries(): string[] {
  return Object.keys(INDUSTRY_DATABASE)
}

// Helper function to get industry by name or alias
export function getIndustryByName(name: string): IndustryKeywords | null {
  const normalizedName = name.toLowerCase().trim()
  
  // Direct match
  if (INDUSTRY_DATABASE[normalizedName]) {
    return INDUSTRY_DATABASE[normalizedName]
  }
  
  // Check aliases
  for (const [key, industry] of Object.entries(INDUSTRY_DATABASE)) {
    if (industry.aliases.some(alias => alias.toLowerCase() === normalizedName)) {
      return industry
    }
  }
  
  return null
}

// Get keywords for specific industries
export function getKeywordsForIndustries(industries: string[]): string[] {
  const allKeywords = new Set<string>()
  
  for (const industryName of industries) {
    const industry = getIndustryByName(industryName) || INDUSTRY_DATABASE[industryName]
    if (industry) {
      // Add all types of keywords
      industry.keywords.technical.forEach(k => allKeywords.add(k))
      industry.keywords.soft.forEach(k => allKeywords.add(k))
      industry.keywords.tools.forEach(k => allKeywords.add(k))
      industry.keywords.certifications.forEach(k => allKeywords.add(k))
      if (industry.keywords.australian) {
        industry.keywords.australian.forEach(k => allKeywords.add(k))
      }
    }
  }
  
  // Always add some general keywords
  INDUSTRY_DATABASE.general.keywords.soft.forEach(k => allKeywords.add(k))
  
  return Array.from(allKeywords)
}

// Get job titles for industries
export function getJobTitlesForIndustries(industries: string[]): string[] {
  const allTitles = new Set<string>()
  
  for (const industryName of industries) {
    const industry = getIndustryByName(industryName) || INDUSTRY_DATABASE[industryName]
    if (industry) {
      industry.jobTitles.forEach(title => allTitles.add(title))
    }
  }
  
  return Array.from(allTitles)
}