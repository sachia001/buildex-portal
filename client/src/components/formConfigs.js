// formConfigs.js — Field definitions for each FM form fill modal
// field types: text | date | textarea | select | staff | multicheck | yesno | number
// staff   → dropdown populated from /api/users/staff
// multicheck → checkboxes, stores array

export const FORM_CONFIGS = {

  // ══════════════════════════════════════════════════════════
  'BE-FM-IMP-DECL': {
    title: 'მიუკერძოებლობის დეკლარაცია',
    signers: ['შემავსებელი', 'შემოწმებული', 'დამტკიცებული'],
    // buildData converts flat c_* yesno fields → conflicts object expected by PDF
    buildData: (fd) => ({
      ...fd,
      conflicts: {
        ownership:  fd.c_ownership  === 'yes',
        family:     fd.c_family     === 'yes',
        employment: fd.c_employment === 'yes',
        financial:  fd.c_financial  === 'yes',
        contract:   fd.c_contract   === 'yes',
      },
    }),
    sections: [
      { label: 'პირადი მონაცემები', fields: [
        { id: 'name',       label: 'სახელი / გვარი',    type: 'staffmulti' },
        { id: 'position',   label: 'თანამდებობა',        type: 'text' },
        { id: 'personalId', label: 'პირადი №',           type: 'text' },
        { id: 'date',       label: 'თარიღი',             type: 'date' },
      ]},
      { label: 'ავტორიზებული სფეროები', fields: [
        { id: 'scopes', label: 'ინსპექციის სფეროები', type: 'multicheck',
          options: ['BE-PR-01','BE-PR-02','BE-PR-03','BE-PR-04'] },
      ]},
      { label: 'ინტერესთა კონფლიქტი (კი / არა)', fields: [
        { id: 'c_ownership',  label: 'მფლობელობითი ინტერესი კლიენტის კომპანიაში',      type: 'yesno' },
        { id: 'c_family',     label: 'ნათესავური / პირადი კავშირი კლიენტთან',           type: 'yesno' },
        { id: 'c_employment', label: 'ადრინდელი დასაქმება კლიენტთან (ბოლო 2 წელი)',    type: 'yesno' },
        { id: 'c_financial',  label: 'ფინანსური დამოკიდებულება კლიენტთან',              type: 'yesno' },
        { id: 'c_contract',   label: 'სხვა მოქმედი ხელშეკრულება / ვალდებულება კლიენტთან', type: 'yesno' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-CONF': {
    title: 'კონფიდენციალობის შეთანხმება',
    signers: ['შემავსებელი', 'შემოწმებული', 'დამტკიცებული'],
    sections: [
      { label: 'მონაცემები', fields: [
        { id: 'name',     label: 'სახელი / გვარი', type: 'staffmulti' },
        { id: 'position', label: 'თანამდებობა',     type: 'text' },
        { id: 'date',     label: 'თარიღი',          type: 'date' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-AUDIT-PLAN': {
    title: 'შიდა აუდიტის გეგმა და ანგარიში',
    signers: ['შემავსებელი', 'შემოწმებული', 'დამტკიცებული'],
    sections: [
      { label: 'შემოსამოწმებელი სფეროები', fields: [
        { id: 'areaRows', label: 'სფეროები (ISO §§ 4–9)', type: 'tablerows', minRows: 1, columns: [
          { id: 'c0', label: 'შემოსამოწმებელი ობიექტი (PR/FM/POL)', md: 6 }, { id: 'c1', label: 'ISO §', md: 2 },
          { id: 'c2', label: 'გეგმური თარიღი', type: 'date', md: 2 }, { id: 'c3', label: 'სტატუსი', md: 2 },
        ] },
      ]},
      { label: 'დამატებითი ინფორმაცია', fields: [
        { id: 'approvalDate', label: 'დამტკიცების თარიღი', type: 'date' },
        { id: 'notes', label: 'შენიშვნები', type: 'textarea' },
      ]},
      { label: 'საიდენტიფიკაციო მონაცემები', fields: [
        { id: 'auditNumber',  label: 'აუდიტის №',                    type: 'text' },
        { id: 'period',       label: 'პერიოდი (წელი)',                type: 'text' },
        { id: 'auditor',      label: 'აუდიტორი',                      type: 'staffmulti' },
        { id: 'auditDate',    label: 'თარიღი',                        type: 'date' },
        { id: 'auditedStaff', label: 'შემოწმებული პერსონალი',         type: 'text', placeholder: 'მაგ: ნ. ბეგიაშვილი, გ. ვალიაშვილი' },
        { id: 'documents',    label: 'შემოწმებული დოკუმენტები',        type: 'text' },
        { id: 'cases',        label: 'შემოწმებული საქმეები (№)',        type: 'text' },
      ]},
      { label: 'B. შემოწმების ფარგლები (ISO §§)', fields: [
        { id: 'auditScopes', label: 'შემოწმებული §§', type: 'multicheck',
          options: ['§4','§5','§6.1','§6.2','§7.1','§7.3','§7.4','§8.1','§8.5','§8.6','§8.7'] },
      ]},
      { label: 'C–D. შეუსაბამობები და CAPA', fields: [
        { id: 'nc1_desc',     label: 'NC1. შეუსაბამობის აღწერა',      type: 'textarea' },
        { id: 'nc1_clause',   label: 'NC1. ISO §',                    type: 'text' },
        { id: 'nc1_category', label: 'NC1. კატეგორია',                type: 'select', options: ['კ — კრიტიკული','მ — მცირე','გ — გამოსწორებული'] },
        { id: 'nc2_desc',     label: 'NC2. შეუსაბამობის აღწერა',      type: 'textarea' },
        { id: 'nc2_clause',   label: 'NC2. ISO §',                    type: 'text' },
        { id: 'nc2_category', label: 'NC2. კატეგორია',                type: 'select', options: ['კ — კრიტიკული','მ — მცირე','გ — გამოსწორებული'] },
        { id: 'nc3_desc',     label: 'NC3. შეუსაბამობის აღწერა',      type: 'textarea' },
        { id: 'nc3_clause',   label: 'NC3. ISO §',                    type: 'text' },
        { id: 'nc3_category', label: 'NC3. კატეგორია',                type: 'select', options: ['კ — კრიტიკული','მ — მცირე','გ — გამოსწორებული'] },
        { id: 'nc4_desc',     label: 'NC4. შეუსაბამობის აღწერა',      type: 'textarea' },
        { id: 'nc4_clause',   label: 'NC4. ISO §',                    type: 'text' },
        { id: 'nc4_category', label: 'NC4. კატეგორია',                type: 'select', options: ['კ — კრიტიკული','მ — მცირე','გ — გამოსწორებული'] },
        { id: 'capa1_num',    label: 'CAPA1. №',                      type: 'text' },
        { id: 'capa1_action', label: 'CAPA1. ქმედება',                type: 'textarea' },
        { id: 'capa1_deadline',label: 'CAPA1. ვადა / სტატუსი',        type: 'text' },
        { id: 'capa2_num',    label: 'CAPA2. №',                      type: 'text' },
        { id: 'capa2_action', label: 'CAPA2. ქმედება',                type: 'textarea' },
        { id: 'capa2_deadline',label: 'CAPA2. ვადა / სტატუსი',        type: 'text' },
      ]},
      { label: 'შეჯამება', fields: [
        { id: 'allRequirementsMet', label: 'ყველა ISO §8.6 მოთხოვნა დაკმაყოფილებულია', type: 'yesno' },
        { id: 'reauditNeeded',      label: 'ხელმეორე შემოწმება საჭიროა',                type: 'yesno' },
        { id: 'reauditDate',        label: 'ხელმეორე შემოწმების თარიღი',               type: 'date' },
        { id: 'generalComment',     label: 'კომენტარი / შენიშვნა',                      type: 'textarea' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-COMPLAINT': {
    title: 'საჩივარი / აპელაცია',
    signers: ['შემდგენი', 'ხარისხის მენეჯერი', 'დირექტორი'],
    sections: [
      { label: 'მომართვის მონაცემები', fields: [
        { id: 'type',            label: 'ტიპი',                         type: 'select', options: ['საჩივარი', 'აპელაცია'] },
        { id: 'regNumber',       label: 'რეგისტრაციის №',               type: 'text' },
        { id: 'date',            label: 'თარიღი',                       type: 'date' },
        { id: 'complainantName', label: 'მომჩივნის სახელი / ორგანიზაცია', type: 'text' },
        { id: 'phone',           label: 'ტელეფონი',                     type: 'text' },
        { id: 'email',           label: 'ელ. ფოსტა',                    type: 'text' },
        { id: 'contactForm',     label: 'კონტაქტის ფორმა',              type: 'select', options: ['ფიზიკური წერილი','ელ. ფოსტა','ვიდეო-გზავნილი','ტელეფონი'] },
        { id: 'caseNumber',      label: 'BE-CASE №',                    type: 'text' },
      ]},
      { label: 'შინაარსი და გადაწყვეტა', fields: [
        { id: 'description',      label: 'საჩივრის შინაარსი',            type: 'textarea' },
        { id: 'resolution',       label: 'გადაწყვეტა',                   type: 'textarea' },
        { id: 'capaInitiated',    label: 'BE-FM-CAPA ინიცირებულია',           type: 'yesno' },
        { id: 'capaNumber',       label: 'BE-FM-CAPA №',                      type: 'text' },
        { id: 'responseSentDate', label: 'პასუხის გაგზავნის თარიღი',     type: 'date' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-EQ-CHECK': {
    title: 'მოწყობილობის ვერიფიკაცია',
    signers: ['ვერიფიკატორი', 'შემდგენი', 'დირექტორი'],
    sections: [
      { label: 'მოწყობილობის იდენტიფიკაცია', fields: [
        { id: 'equipmentName',   label: 'დასახელება',            type: 'text' },
        { id: 'inventoryNumber', label: 'საინვენტარო №',         type: 'text' },
        { id: 'manufacturer',    label: 'მწარმოებელი',           type: 'text' },
        { id: 'model',           label: 'მოდელი / სერია',        type: 'text' },
        { id: 'purchaseDate',    label: 'შეძენის თარიღი',        type: 'date' },
        { id: 'location',        label: 'მდებარეობა',            type: 'text' },
      ]},
      { label: 'კალიბრაციის ინფორმაცია', fields: [
        { id: 'calibrationCenter', label: 'კალიბრების ცენტრი',           type: 'text' },
        { id: 'calibrationDate',   label: 'კალიბრაციის თარიღი',          type: 'date' },
        { id: 'nextCalibDate',     label: 'მომდევნო კალიბრაციის თარიღი', type: 'date' },
        { id: 'certNumber',        label: 'სერტიფიკატის №',              type: 'text' },
        { id: 'interval',          label: 'ინტერვალი (თვე)',              type: 'number' },
      ]},
      { label: 'C. შიდა ვერიფიკაცია', fields: [
        { id: 'vc1', label: 'გარეგნული დათვალიერება',                 type: 'yesno' },
        { id: 'vc2', label: 'ჩვენების ნული (zero)',                    type: 'yesno' },
        { id: 'vc3', label: 'სერტიფიკატის ვადა',                      type: 'yesno' },
        { id: 'vc4', label: 'ნიშანდობლივი ვიზუალური შემოწმება',       type: 'yesno' },
        { id: 'vc5', label: 'SI ერთეულების შესაბამისობა (§6.2.7)',     type: 'yesno' },
      ]},
      { label: 'D. გამოყენების ისტორია (5 ჩანაწერი)', fields: [
        { id: 'h1_case',      label: 'H1. BE-CASE / ვიზიტი',    type: 'text' },
        { id: 'h1_date',      label: 'H1. თარიღი',               type: 'date' },
        { id: 'h1_inspector', label: 'H1. ინსპექტორი',           type: 'staffmulti' },
        { id: 'h1_note',      label: 'H1. შენიშვნა',             type: 'text' },
        { id: 'h2_case',      label: 'H2. BE-CASE / ვიზიტი',    type: 'text' },
        { id: 'h2_date',      label: 'H2. თარიღი',               type: 'date' },
        { id: 'h2_inspector', label: 'H2. ინსპექტორი',           type: 'staffmulti' },
        { id: 'h2_note',      label: 'H2. შენიშვნა',             type: 'text' },
        { id: 'h3_case',      label: 'H3. BE-CASE / ვიზიტი',    type: 'text' },
        { id: 'h3_date',      label: 'H3. თარიღი',               type: 'date' },
        { id: 'h3_inspector', label: 'H3. ინსპექტორი',           type: 'staffmulti' },
        { id: 'h3_note',      label: 'H3. შენიშვნა',             type: 'text' },
        { id: 'h4_case',      label: 'H4. BE-CASE / ვიზიტი',    type: 'text' },
        { id: 'h4_date',      label: 'H4. თარიღი',               type: 'date' },
        { id: 'h4_inspector', label: 'H4. ინსპექტორი',           type: 'staffmulti' },
        { id: 'h4_note',      label: 'H4. შენიშვნა',             type: 'text' },
        { id: 'h5_case',      label: 'H5. BE-CASE / ვიზიტი',    type: 'text' },
        { id: 'h5_date',      label: 'H5. თარიღი',               type: 'date' },
        { id: 'h5_inspector', label: 'H5. ინსპექტორი',           type: 'staffmulti' },
        { id: 'h5_note',      label: 'H5. შენიშვნა',             type: 'text' },
      ]},
      { label: 'შეუსაბამობა და შედეგები', fields: [
        { id: 'nonConformityFound', label: 'შეუსაბამობა ნაპოვნია',  type: 'yesno' },
        { id: 'fm14Number',         label: 'BE-FM-NONCONF №',               type: 'text' },
        { id: 'verifierName',       label: 'ვერიფიკატორი',          type: 'staffmulti' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-COMP-CHECK': {
    title: 'კომპეტენციის შეფასება',
    signers: ['ხარისხის მენეჯერი', 'ტექნიკური მენეჯერი', 'დირექტორი (დამტკიცებულია)'],
    sections: [
      { label: 'ინსპექტორის მონაცემები', fields: [
        { id: 'name',           label: 'სახელი / გვარი',       type: 'staffmulti' },
        { id: 'personalId',     label: 'პირადი №',             type: 'text' },
        { id: 'position',       label: 'თანამდებობა',          type: 'text' },
        { id: 'assessmentDate', label: 'შეფასების თარიღი',     type: 'date' },
        { id: 'assessor',       label: 'შემფასებელი',          type: 'staffmulti' },
        { id: 'assessmentType', label: 'შეფასების ტიპი',       type: 'select', options: ['საწყისი','პერიოდული','witnessing'] },
        { id: 'scope',          label: 'სპეციალობა (BE-PR-XX)', type: 'text' },
        { id: 'eduMatch',       label: 'განათლება შეესაბამება', type: 'yesno' },
        { id: 'experience',     label: 'გამოცდილება (წელი)',   type: 'text' },
      ]},
      { label: 'შეფასების ქულები (1–5) და კომენტარი', fields: [
        { id: 'score1',         label: '1. სამუშაო ნიმუში / ნორმები',      type: 'number' },
        { id: 'comment1',       label: '1. კომენტარი',                     type: 'text' },
        { id: 'score2',         label: '2. ISO 17020 ცოდნა',               type: 'number' },
        { id: 'comment2',       label: '2. კომენტარი',                     type: 'text' },
        { id: 'score3',         label: '3. გადაწყვეტილების მიღების პრაქტიკა', type: 'number' },
        { id: 'comment3',       label: '3. კომენტარი',                     type: 'text' },
        { id: 'score4',         label: '4. ანგარიშის შედგენის უნარი',      type: 'number' },
        { id: 'comment4',       label: '4. კომენტარი',                     type: 'text' },
        { id: 'score5',         label: '5. witnessing',                    type: 'number' },
        { id: 'comment5',       label: '5. კომენტარი',                     type: 'text' },
        { id: 'decision',       label: 'გადაწყვეტილება', type: 'select', options: ['ავტორიზებული','გაგრძელება','ტრენინგი','ჩამოშორება'] },
        { id: 'trainingNeeded', label: 'ტრენინგის საჭიროება',              type: 'textarea' },
        { id: 'nextAssessment', label: 'მომდევნო შეფასების თარიღი',       type: 'date' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-CONTRACT-REVIEW': {
    title: 'ხელშეკრულების განხილვა',
    signers: ['შემდგენი', 'ტექნიკური მენეჯერი', 'დირექტორი'],
    caseAutoFill: (insp) => ({
      clientName: insp.clientName || '',
      deadline:   insp.deadline ? insp.deadline.split('T')[0] : '',
      inspScope:  insp.inspectionScope || '',
    }),
    sections: [
      { label: 'საიდენტიფიკაციო მონაცემები', fields: [
        { id: 'caseNumber',     label: 'BE-CASE №',                       type: 'case' },
        { id: 'reviewDate',     label: 'განხილვის თარიღი',                type: 'date' },
        { id: 'clientName',     label: 'დამკვეთი',                        type: 'text' },
        { id: 'inspScope',      label: 'ინსპექციის სფერო', type: 'select', options: ['BE-PR-01','BE-PR-02','BE-PR-03','BE-PR-04','სხვა'] },
        { id: 'contractNumber', label: 'ხელშეკრულების №',                 type: 'text' },
        { id: 'deadline',       label: 'ვადა',                            type: 'date' },
        { id: 'fee',            label: 'გასამრჯელო (₾)',                  type: 'text' },
        { id: 'fm02Number',     label: 'BE-FM-IMP-DECL №',                         type: 'text' },
        { id: 'clientReqs',     label: 'კლიენტის სპეციალური მოთხოვნები', type: 'textarea' },
        { id: 'deviations',     label: 'გადახრები / შენიშვნები',          type: 'textarea' },
        { id: 'approved',       label: 'დამტკიცებულია',                   type: 'yesno' },
      ]},
      { label: 'B. ISO §7.1.1 კრიტერიუმები (კი/არა + კომენტარი)', fields: [
        { id: 'r_7_1_1a',      label: '§7.1.1a კი/არა — ობიექტის იდენტიფიკაცია',      type: 'yesno' },
        { id: 'r_7_1_1a_note', label: '§7.1.1a კომენტარი',                              type: 'text' },
        { id: 'r_7_1_1b',      label: '§7.1.1b კი/არა — შესაძლებლობის დადასტურება',    type: 'yesno' },
        { id: 'r_7_1_1b_note', label: '§7.1.1b კომენტარი',                              type: 'text' },
        { id: 'r_7_1_1c',      label: '§7.1.1c კი/არა — მომსახურების შინაარსი',         type: 'yesno' },
        { id: 'r_7_1_1c_note', label: '§7.1.1c კომენტარი',                              type: 'text' },
        { id: 'r_7_1_1d',      label: '§7.1.1d კი/არა — კლიენტის მოთხოვნები',          type: 'yesno' },
        { id: 'r_7_1_1d_note', label: '§7.1.1d კომენტარი',                              type: 'text' },
        { id: 'r_7_1',         label: '§7.1 კი/არა — ვადა და გასამრჯელო',              type: 'yesno' },
        { id: 'r_7_1_note',    label: '§7.1 კომენტარი',                                 type: 'text' },
        { id: 'r_fm02',        label: 'BE-FM-IMP-DECL კი/არა — მიუკერძოებლობის შეფასება',                 type: 'yesno' },
        { id: 'r_fm02_note',   label: 'BE-FM-IMP-DECL კომენტარი',                                type: 'text' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-CAPA': {
    title: 'CAPA — მაკორექტირებელი ქმედება',
    signers: ['შემდგენი', 'ხარისხის მენეჯერი', 'დირექტორი'],
    sections: [
      { label: 'A. რეგისტრაცია', fields: [
        { id: 'capaNumber',  label: 'CAPA №',                   type: 'text' },
        { id: 'initDate',    label: 'ინიცირების თარიღი',        type: 'date' },
        { id: 'initiator',   label: 'ინიციატორი',               type: 'staffmulti' },
        { id: 'source',      label: 'წყარო', type: 'select', options: ['შიდა აუდიტი','გარე შემოწმება','საჩივარი','შეუსაბამო სამუშაო','ინციდენტი','სხვა'] },
        { id: 'isoClause',   label: 'ISO §',                    type: 'text' },
        { id: 'impact',      label: 'გავლენა', type: 'select', options: ['კრიტიკული','საშუალო','მცირე'] },
        { id: 'description', label: 'შეუსაბამობის აღწერა',      type: 'textarea' },
      ]},
      { label: 'C. გავრცელება (§8.5.3)', fields: [
        { id: 'otherCasesAffected',  label: 'სხვა საქმეები ზეგავლენის ქვეშ',  type: 'yesno' },
        { id: 'affectedCases',       label: 'ზეგავლენის ქვეშ №',               type: 'text' },
        { id: 'immediateCorrection', label: 'გადაუდებელი კორექცია',             type: 'textarea' },
      ]},
      { label: 'D–E. ფესვური მიზეზი და მოქმედება', fields: [
        { id: 'rootCause',    label: 'ფესვური მიზეზი (5-Why)',          type: 'textarea' },
        { id: 'corrAction',   label: 'მაკორექტირებელი ქმედება',         type: 'textarea' },
        { id: 'responsible',  label: 'შემსრულებელი',                    type: 'staffmulti' },
        { id: 'deadline',     label: 'ვადა',                            type: 'date' },
      ]},
      { label: 'F. ეფექტურობის შემოწმება', fields: [
        { id: 'checkDate',      label: 'შემოწმების თარიღი',             type: 'date' },
        { id: 'effectiveCheck', label: 'ეფექტურია',                     type: 'yesno' },
        { id: 'closingDate',    label: 'დახურვის თარიღი',               type: 'date' },
        { id: 'qualityMgrVerif',label: 'ხარისხის მენეჯერის ვიზა',       type: 'staffmulti' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-PLAN': {
    title: 'ინსპექციის გეგმა',
    signers: ['ტექნიკური მენეჯერი'],
    caseAutoFill: (insp) => {
      const expertName = insp.expert?.[0]
        ? `${insp.expert[0].firstName} ${insp.expert[0].lastName}` : '';
      const tmName = insp.technicalManager?.[0]
        ? `${insp.technicalManager[0].firstName} ${insp.technicalManager[0].lastName}` : '';
      return {
        address:     insp.objectAddress || '',
        client:      insp.clientName   || '',
        inspector:   expertName,
        techManager: tmName,
      };
    },
    sections: [
      { label: 'ინსპექტორების შეთანხმება (BE-FM-IMP-DECL)', fields: [
        { id: 'inspectorRows', label: 'ინსპექტორები', type: 'tablerows', minRows: 1, columns: [
          { id: 'c0', label: 'ინსპექტორი', type: 'staff', md: 5 }, { id: 'c1', label: 'BE-FM-IMP-DECL №', md: 4 },
          { id: 'c2', label: 'ხელმოწერა / თარიღი', md: 3 },
        ] },
      ]},
      { label: 'საიდენტიფიკაციო მონაცემები', fields: [
        { id: 'caseNumber',     label: 'BE-CASE №',                    type: 'case' },
        { id: 'inspDate',       label: 'ინსპექციის თარიღი',            type: 'date' },
        { id: 'address',        label: 'ობიექტის მისამართი',           type: 'text' },
        { id: 'client',         label: 'დამკვეთი',                     type: 'text' },
        { id: 'contractNumber', label: 'ხელშეკრულების №',              type: 'text' },
        { id: 'fm09Number',     label: 'BE-FM-CONTRACT-REVIEW №',                      type: 'text' },
        { id: 'inspector',      label: 'ინსპექტორი',                   type: 'staffmulti' },
        { id: 'techManager',    label: 'ტექნიკური მენეჯერი',           type: 'staffmulti' },
        { id: 'specialNotes',   label: 'განსაკუთრებული მოთხოვნები / რისკები', type: 'textarea' },
      ]},
      { label: 'B. ინსპექციის სფერო და კრიტერიუმები', fields: [
        { id: 'scopeCriteria', label: 'სფეროები', type: 'tablerows', minRows: 2,
          columns: [
            { id: 'scope',    label: 'სფეროს დასახელება',         md: 5 },
            { id: 'criteria', label: 'გამოსაყენებელი კრიტერიუმები', md: 5 },
            { id: 'comment',  label: 'კომენტარი',                   md: 2 },
          ],
        },
      ]},
      { label: 'D. ეტაპები', fields: [
        { id: 'stage1_date',        label: 'ეტაპი 1 თარიღი — დოკუმენტაციის მომზადება',      type: 'date' },
        { id: 'stage1_responsible', label: 'ეტ.1 პასუხისმგებელი',               type: 'staffmulti' },
        { id: 'stage1_status',      label: 'ეტ.1 სტატუსი',                       type: 'text' },
        { id: 'stage2_date',        label: 'ეტ.2 თარიღი — კლიენტთან შეხვედრა', type: 'date' },
        { id: 'stage2_responsible', label: 'ეტ.2 პასუხისმგებელი',               type: 'staffmulti' },
        { id: 'stage2_status',      label: 'ეტ.2 სტატუსი',                       type: 'text' },
        { id: 'stage3_date',        label: 'ეტ.3 თარიღი — საიტის ვიზიტი',      type: 'date' },
        { id: 'stage3_responsible', label: 'ეტ.3 პასუხისმგებელი',               type: 'staffmulti' },
        { id: 'stage3_status',      label: 'ეტ.3 სტატუსი',                       type: 'text' },
        { id: 'stage4_date',        label: 'ეტ.4 თარიღი — ანგარიშის პროექტი',  type: 'date' },
        { id: 'stage4_responsible', label: 'ეტ.4 პასუხისმგებელი',               type: 'staffmulti' },
        { id: 'stage4_status',      label: 'ეტ.4 სტატუსი',                       type: 'text' },
        { id: 'stage5_date',        label: 'ეტაპი 5 თარიღი — ტექნიკური განხილვა',      type: 'date' },
        { id: 'stage5_responsible', label: 'ეტ.5 პასუხისმგებელი',               type: 'staffmulti' },
        { id: 'stage5_status',      label: 'ეტ.5 სტატუსი',                       type: 'text' },
        { id: 'stage6_date',        label: 'ეტ.6 თარიღი — ანგარიშის გაგზავნა', type: 'date' },
        { id: 'stage6_responsible', label: 'ეტ.6 პასუხისმგებელი',               type: 'staffmulti' },
        { id: 'stage6_status',      label: 'ეტ.6 სტატუსი',                       type: 'text' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-SUB-MONITOR': {
    title: 'ქვეკონტრაქტორის შეფასება',
    signers: ['ტექნიკური მენეჯერი', 'ხარისხის მენეჯერი'],
    sections: [
      { label: 'საიდენტიფიკაციო მონაცემები', fields: [
        { id: 'assessmentNumber', label: 'შეფასების №',               type: 'text' },
        { id: 'date',             label: 'შეფასების თარიღი',          type: 'date' },
        { id: 'subName',          label: 'ქვეკონტრაქტორის სახელი',   type: 'text' },
        { id: 'serviceType',      label: 'მომსახურების სახეობა',      type: 'text' },
        { id: 'licenseNumber',    label: 'ლიცენზიის №',               type: 'text' },
        { id: 'licenseExpiry',    label: 'ლიცენზიის ვადა',            type: 'date' },
        { id: 'validator',        label: 'შემმოწმებელი',              type: 'staffmulti' },
        { id: 'caseNumber',       label: 'BE-CASE №',                 type: 'text' },
        { id: 'decision',         label: 'გადაწყვეტილება', type: 'select', options: ['დამტკიცებულია','პირობით დამტკიცება','უარყოფილია'] },
        { id: 'condition',        label: 'პირობები (პირობითი დამტ.)', type: 'text' },
        { id: 'validUntil',       label: 'ვალიდური ვადა',             type: 'date' },
      ]},
      { label: '2. ISO §6.6 კრიტერიუმები', fields: [
        { id: 'crit1', label: '§6.6.1 ინსპექტირების ობიექტის გამოცდილება',    type: 'yesno' },
        { id: 'crit2', label: '§6.6.2 კვალიფიკაცია და აკრედიტაცია',   type: 'yesno' },
        { id: 'crit3', label: '§6.6.3 კლიენტის ინსპექცია',             type: 'yesno' },
        { id: 'crit4', label: '§6.6.4 ISO 17020',                      type: 'yesno' },
        { id: 'crit5', label: 'BE-FM-REG ანგარიშის შეფასება',              type: 'yesno' },
        { id: 'crit6', label: 'PR-02 გამოცდილება ≥5 წელი',             type: 'yesno' },
      ]},
      { label: 'C. კომპეტენციის ქულები (4 სფერო)', fields: [
        { id: 'comp1_scope',   label: 'C1. ინსპექტირების სფერო',    type: 'text' },
        { id: 'comp1_score',   label: 'C1. ქულა (1–5)',      type: 'number' },
        { id: 'comp1_comment', label: 'C1. კომენტარი',       type: 'text' },
        { id: 'comp2_scope',   label: 'C2. ინსპექტირების სფერო',    type: 'text' },
        { id: 'comp2_score',   label: 'C2. ქულა (1–5)',      type: 'number' },
        { id: 'comp2_comment', label: 'C2. კომენტარი',       type: 'text' },
        { id: 'comp3_scope',   label: 'C3. ინსპექტირების სფერო',    type: 'text' },
        { id: 'comp3_score',   label: 'C3. ქულა (1–5)',      type: 'number' },
        { id: 'comp3_comment', label: 'C3. კომენტარი',       type: 'text' },
        { id: 'comp4_scope',   label: 'C4. ინსპექტირების სფერო',    type: 'text' },
        { id: 'comp4_score',   label: 'C4. ქულა (1–5)',      type: 'number' },
        { id: 'comp4_comment', label: 'C4. კომენტარი',       type: 'text' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-TRAIN': {
    title: 'ტრენინგის ჩანაწერი',
    signers: ['ტექნიკური მენეჯერი', 'ხარისხის მენეჯერი', 'დირექტორი'],
    sections: [
      { label: 'A. მონაწილე პერსონალი', fields: [
        { id: 'participants', label: 'მონაწილეები (მონიშნეთ — თითო ცხრილში ცალკე მწკრივად, პირადი ნომრით; ქვემოთ — კომპეტენციის შეფასება)', type: 'staffrows',
          statusField: { id: 'competency', label: 'E. კომპეტენციის შეფასების შედეგი (თითო მონაწილეზე)',
            options: [
              { value: 'სრულად',    label: 'სრულად კომპეტენტური' },
              { value: 'ნაწილობრივ', label: 'ნაწილობრივ კომპეტენტური' },
              { value: 'არა',       label: 'არ არის კომპეტენტური' },
            ] } },
        { id: 'trainingDate', label: 'ტრენინგის თარიღი',            type: 'date' },
        { id: 'duration',     label: 'ხანგრძლივობა (საათი)',        type: 'number' },
        { id: 'location',     label: 'ადგილმდებარეობა',             type: 'text' },
        { id: 'type',         label: 'ტრენინგის სახეობა', type: 'select', options: ['შიდა ანალიზი','გარე ტრენინგი','witnessing','ახალი ინსტრუმენტის ზედამხედველობა','ნორმატიული დოკუმენტი','IT','სხვა'] },
        { id: 'title',        label: 'სათაური / თემა',              type: 'text' },
        { id: 'organizer',    label: 'ორგანიზატორი / ინსტიტუტი',   type: 'text' },
        { id: 'nextTraining', label: 'მომდევნო ტრენინგის თარიღი',  type: 'date' },
      ]},
      { label: 'D. კომპეტენციის შეფასების მეთოდი (საერთო ყველა მონაწილისთვის)', fields: [
        { id: 'competencyMethods', label: 'კომპეტენციის მეთოდი', type: 'multicheck',
          options: ['წერილობითი ტესტი','witnessing','ზედამხედველობა გამოყენებაზე','პრაქტიკული სავარჯიშო','ტექნიკური მენეჯერის შეფასება'] },
      ]},
      { label: 'C. ტრენინგის შინაარსი (დამატებითი ჩანაწერები)', fields: [
        { id: 't2_title',     label: 'C2. სათაური / თემა',          type: 'text' },
        { id: 't2_organizer', label: 'C2. ორგანიზატორი',            type: 'text' },
        { id: 't2_comment',   label: 'C2. კომენტარი',               type: 'text' },
        { id: 't3_title',     label: 'C3. სათაური / თემა',          type: 'text' },
        { id: 't3_organizer', label: 'C3. ორგანიზატორი',            type: 'text' },
        { id: 't3_comment',   label: 'C3. კომენტარი',               type: 'text' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-NONCONF': {
    title: 'შეუსაბამო სამუშაოს მართვა',
    signers: ['ხარისხის მენეჯერი', 'ტექნიკური მენეჯერი', 'დირექტორი'],
    caseAutoFill: (insp) => ({
      object: insp.objectName || insp.objectAddress || '',
    }),
    sections: [
      { label: '1. იდენტიფიკაცია', fields: [
        { id: 'ncNumber',        label: 'NC № (BE-NC-YYYY-____)',     type: 'text' },
        { id: 'detectionDate',   label: 'გამოვლენის თარიღი',         type: 'date' },
        { id: 'caseNumber',      label: 'BE-CASE №',                 type: 'case' },
        { id: 'object',          label: 'ობიექტი / ინსპექცია',       type: 'text' },
        { id: 'detector',        label: 'გამომვლენი პირი',           type: 'staffmulti' },
        { id: 'isoClause',       label: 'ISO §',                     type: 'text' },
        { id: 'description',     label: 'შეუსაბამობის აღწერა',       type: 'textarea' },
      ]},
      { label: '1b. დაუყოვნებელი ქმედება + §3 გადაუდებელი შეჩერება', fields: [
        { id: 'immediateActions', label: 'იდენტიფიცირებული ქმედება (§1)', type: 'multicheck',
          options: ['სამუშაოს შეჩერება','ტექნიკური გადახედვა','კლიენტის შეტყობინება','გარე შემოწმება'] },
        { id: 'suspensionActions', label: 'გადაუდებელი შეჩერება (§3)', type: 'multicheck',
          options: ['კლიენტი — სამუშაო შეჩერება','ობიექტი — კორექცია','სხვა საქმეების გადახედვა','კლიენტთან გარკვევა საჭ. არ არის'] },
      ]},
      { label: '4–5. მართვა და ფესვური მიზეზი', fields: [
        { id: 'immediateAction', label: 'მიღებული ქმედება',          type: 'textarea' },
        { id: 'responsible',     label: 'პასუხისმგებელი',            type: 'staffmulti' },
        { id: 'deadline',        label: 'ვადა',                      type: 'date' },
        { id: 'rootCause',       label: 'ფესვური მიზეზი',            type: 'textarea' },
      ]},
      { label: '6–7. CAPA და დახურვა', fields: [
        { id: 'capaNumber',      label: 'BE-FM-CAPA CAPA №',              type: 'text' },
        { id: 'capaDeadline',    label: 'CAPA ვადა',                  type: 'date' },
        { id: 'closed',          label: 'დახურულია',                 type: 'yesno' },
        { id: 'closingDate',     label: 'დახურვის თარიღი',           type: 'date' },
        { id: 'qualityMgrVerif', label: 'ხარისხის მენეჯერის ვიზა',   type: 'staffmulti' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-MGMT-REVIEW': {
    title: 'მართვის ანალიზი — სხდომის ოქმი',
    signers: ['სხდომის თავმჯდომარე', 'ხარისხის მენეჯერი', 'დირექტორი'],
    sections: [
      { label: 'სხდომის მონაცემები', fields: [
        { id: 'meetingNumber', label: 'სხდომის №',                    type: 'text' },
        { id: 'date',          label: 'თარიღი',                       type: 'date' },
        { id: 'location',      label: 'ადგილმდებარეობა',              type: 'text' },
        { id: 'chairman',      label: 'თავმჯდომარე',                  type: 'staffmulti' },
        { id: 'secretary',     label: 'მდივანი',                      type: 'staffmulti' },
        { id: 'participants',  label: 'მონაწილეები (სახელები)',         type: 'textarea' },
        { id: 'effectiveness', label: 'სისტემის ეფექტურობა', type: 'select', options: ['ეფექტური','არაეფექტური','CAPA საჭიროა'] },
      ]},
      { label: '3. გადაწყვეტილებები (4 ჩანაწერი)', fields: [
        { id: 'dec1_action',      label: 'D1. ქმედება',            type: 'textarea' },
        { id: 'dec1_responsible', label: 'D1. პასუხისმგებელი',     type: 'staffmulti' },
        { id: 'dec1_deadline',    label: 'D1. ვადა',                type: 'date' },
        { id: 'dec1_status',      label: 'D1. სტატუსი',             type: 'text' },
        { id: 'dec2_action',      label: 'D2. ქმედება',            type: 'textarea' },
        { id: 'dec2_responsible', label: 'D2. პასუხისმგებელი',     type: 'staffmulti' },
        { id: 'dec2_deadline',    label: 'D2. ვადა',                type: 'date' },
        { id: 'dec2_status',      label: 'D2. სტატუსი',             type: 'text' },
        { id: 'dec3_action',      label: 'D3. ქმედება',            type: 'textarea' },
        { id: 'dec3_responsible', label: 'D3. პასუხისმგებელი',     type: 'staffmulti' },
        { id: 'dec3_deadline',    label: 'D3. ვადა',                type: 'date' },
        { id: 'dec3_status',      label: 'D3. სტატუსი',             type: 'text' },
        { id: 'dec4_action',      label: 'D4. ქმედება',            type: 'textarea' },
        { id: 'dec4_responsible', label: 'D4. პასუხისმგებელი',     type: 'staffmulti' },
        { id: 'dec4_deadline',    label: 'D4. ვადა',                type: 'date' },
        { id: 'dec4_status',      label: 'D4. სტატუსი',             type: 'text' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-VISIT': {
    title: 'ვიზიტის ჩანაწერი',
    signers: ['ინსპექტორი', 'დამკვეთის წარმომადგენელი', 'კონტრაქტორის წარმომადგენელი'],
    caseAutoFill: (insp) => {
      const expertName = insp.expert?.[0]
        ? `${insp.expert[0].firstName} ${insp.expert[0].lastName}` : '';
      return {
        address:   insp.objectAddress || '',
        clientRep: insp.contactPerson || insp.clientName || '',
        inspector: expertName,
      };
    },
    sections: [
      { label: 'საიდენტიფიკაციო მონაცემები', fields: [
        { id: 'caseNumber',    label: 'BE-CASE №',                        type: 'case' },
        { id: 'visitNumber',   label: 'ვიზიტის #',                        type: 'text' },
        { id: 'visitDate',     label: 'ვიზიტის თარიღი',                   type: 'date' },
        { id: 'visitTime',     label: 'დაწყება – დასრულება',              type: 'text', placeholder: 'მაგ: 10:00 – 14:00' },
        { id: 'address',       label: 'ობიექტის მისამართი',               type: 'text' },
        { id: 'inspector',     label: 'ინსპექტორი',                       type: 'staffmulti' },
        { id: 'clientRep',     label: 'დამკვეთის წარმომადგენელი',         type: 'text' },
        { id: 'contractorRep', label: 'კონტრაქტორის წარმომადგენელი',      type: 'text' },
        { id: 'visitType',     label: 'ვიზიტის სახეობა', type: 'select', options: ['დათვალიერება / გაზომვა','სინჯის აღება','ფოტო-სამუშაო','საკონტროლო ეტაპი','გარდამავალი ოქმი','მოულოდნელი შემოწმება'] },
      ]},
      { label: 'C. ინსპექტირება (3 ჩანაწერი)', fields: [
        { id: 'c1_name',     label: 'C1. ინსპექტირების დასახელება',        type: 'text' },
        { id: 'c1_standard', label: 'C1. სტანდარტის №',             type: 'text' },
        { id: 'c1_control',  label: 'C1. კონტროლის ვითარება',       type: 'text' },
        { id: 'c1_note',     label: 'C1. ჩვენება / შენიშვნა',       type: 'text' },
        { id: 'c2_name',     label: 'C2. ინსპექტირების დასახელება',        type: 'text' },
        { id: 'c2_standard', label: 'C2. სტანდარტის №',             type: 'text' },
        { id: 'c2_control',  label: 'C2. კონტროლის ვითარება',       type: 'text' },
        { id: 'c2_note',     label: 'C2. ჩვენება / შენიშვნა',       type: 'text' },
        { id: 'c3_name',     label: 'C3. ინსპექტირების დასახელება',        type: 'text' },
        { id: 'c3_standard', label: 'C3. სტანდარტის №',             type: 'text' },
        { id: 'c3_control',  label: 'C3. კონტროლის ვითარება',       type: 'text' },
        { id: 'c3_note',     label: 'C3. ჩვენება / შენიშვნა',       type: 'text' },
      ]},
      { label: 'D. დეფექტები (5 ჩანაწერი)', fields: [
        { id: 'd1_element',  label: 'D1. სამშენებლო ელემენტი',           type: 'text' },
        { id: 'd1_photo',    label: 'D1. ფოტო გადაღება',             type: 'text' },
        { id: 'd1_page',     label: 'D1. სტანდარტის გვ.',            type: 'text' },
        { id: 'd1_deviation',label: 'D1. გადახრა',                   type: 'text' },
        { id: 'd1_note',     label: 'D1. შენიშვნა',                  type: 'text' },
        { id: 'd2_element',  label: 'D2. სამშენებლო ელემენტი',           type: 'text' },
        { id: 'd2_photo',    label: 'D2. ფოტო გადაღება',             type: 'text' },
        { id: 'd2_page',     label: 'D2. სტანდარტის გვ.',            type: 'text' },
        { id: 'd2_deviation',label: 'D2. გადახრა',                   type: 'text' },
        { id: 'd2_note',     label: 'D2. შენიშვნა',                  type: 'text' },
        { id: 'd3_element',  label: 'D3. სამშენებლო ელემენტი',           type: 'text' },
        { id: 'd3_photo',    label: 'D3. ფოტო გადაღება',             type: 'text' },
        { id: 'd3_page',     label: 'D3. სტანდარტის გვ.',            type: 'text' },
        { id: 'd3_deviation',label: 'D3. გადახრა',                   type: 'text' },
        { id: 'd3_note',     label: 'D3. შენიშვნა',                  type: 'text' },
        { id: 'd4_element',  label: 'D4. სამშენებლო ელემენტი',           type: 'text' },
        { id: 'd4_photo',    label: 'D4. ფოტო გადაღება',             type: 'text' },
        { id: 'd4_page',     label: 'D4. სტანდარტის გვ.',            type: 'text' },
        { id: 'd4_deviation',label: 'D4. გადახრა',                   type: 'text' },
        { id: 'd4_note',     label: 'D4. შენიშვნა',                  type: 'text' },
        { id: 'd5_element',  label: 'D5. სამშენებლო ელემენტი',           type: 'text' },
        { id: 'd5_photo',    label: 'D5. ფოტო გადაღება',             type: 'text' },
        { id: 'd5_page',     label: 'D5. სტანდარტის გვ.',            type: 'text' },
        { id: 'd5_deviation',label: 'D5. გადახრა',                   type: 'text' },
        { id: 'd5_note',     label: 'D5. შენიშვნა',                  type: 'text' },
      ]},
      { label: 'E. ფოტო-დოკუმენტაცია (3 ჩანაწერი)', fields: [
        { id: 'e1_num',  label: 'E1. ფოტოს №',         type: 'text' },
        { id: 'e1_desc', label: 'E1. აღწერა',           type: 'text' },
        { id: 'e1_gps',  label: 'E1. GPS კოორდინატები', type: 'text' },
        { id: 'e2_num',  label: 'E2. ფოტოს №',         type: 'text' },
        { id: 'e2_desc', label: 'E2. აღწერა',           type: 'text' },
        { id: 'e2_gps',  label: 'E2. GPS კოორდინატები', type: 'text' },
        { id: 'e3_num',  label: 'E3. ფოტოს №',         type: 'text' },
        { id: 'e3_desc', label: 'E3. აღწერა',           type: 'text' },
        { id: 'e3_gps',  label: 'E3. GPS კოორდინატები', type: 'text' },
      ]},
      { label: 'F. შეუსაბამობები (3 ჩანაწერი)', fields: [
        { id: 'f1_desc',     label: 'F1. შეუსაბამობის აღწერა',  type: 'textarea' },
        { id: 'f1_category', label: 'F1. კატეგორია', type: 'select', options: ['კრიტიკული','არსებითი','ფორმალური / ობსერვაცია'] },
        { id: 'f1_action',   label: 'F1. მოქმედება / ვადა',      type: 'text' },
        { id: 'f2_desc',     label: 'F2. შეუსაბამობის აღწერა',  type: 'textarea' },
        { id: 'f2_category', label: 'F2. კატეგორია', type: 'select', options: ['კრიტიკული','არსებითი','ფორმალური / ობსერვაცია'] },
        { id: 'f2_action',   label: 'F2. მოქმედება / ვადა',      type: 'text' },
        { id: 'f3_desc',     label: 'F3. შეუსაბამობის აღწერა',  type: 'textarea' },
        { id: 'f3_category', label: 'F3. კატეგორია', type: 'select', options: ['კრიტიკული','არსებითი','ფორმალური / ობსერვაცია'] },
        { id: 'f3_action',   label: 'F3. მოქმედება / ვადა',      type: 'text' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-IR': {
    title: 'ინსპექტირების ანგარიში და დასკვნა',
    signers: ['ინსპექტორი', 'ტექნიკური მენეჯერი', 'ხელმძღვანელი'],
    caseAutoFill: (insp) => ({
      inspectionNumber: insp.inspectionNumber || '',
      objectName:       insp.objectName     || '',
      objectAddress:    insp.objectAddress  || '',
      clientName:       insp.clientName      || '',
      contactPerson:    insp.contactPerson  || insp.clientContact || '',
      accreditationScope: insp.inspectionScope || '',
      reportBasis:      insp.tenderNumber ? `განაცხადი / ხელშეკრულება № ${insp.tenderNumber}` : '',
      expert:           insp.expert || [],
      expertNames:      insp.expert && insp.expert[0] ? `${insp.expert[0].firstName} ${insp.expert[0].lastName}` : '',
      technicalManagerNames: insp.technicalManager && insp.technicalManager[0] ? `${insp.technicalManager[0].firstName} ${insp.technicalManager[0].lastName}` : '',
    }),
    sections: [
      { label: 'საიდენტიფიკაციო მონაცემები (ISO §7.4.2)', fields: [
        { id: 'caseNumber',         label: 'BE-CASE № (ავტო-შევსება)',     type: 'case' },
        { id: 'inspectionNumber',   label: 'ანგარიშის №',                  type: 'text' },
        { id: 'issueDate',          label: 'ანგარიშის გაცემის თარიღი',     type: 'date' },
        { id: 'startDate',          label: 'დაწყების თარიღი',              type: 'date' },
        { id: 'deadline',           label: 'დასრულების თარიღი',            type: 'date' },
        { id: 'objectName',         label: 'ობიექტის დასახელება',          type: 'text' },
        { id: 'objectAddress',      label: 'მისამართი',                    type: 'text' },
        { id: 'clientName',         label: 'დამკვეთი',                     type: 'text' },
        { id: 'contactPerson',      label: 'წარმომადგენელი',               type: 'text' },
        { id: 'reportBasis',        label: 'ანგარიშის შედგენის საფუძველი',  type: 'textarea' },
        { id: 'accreditationScope', label: 'აკრედიტაციის სფერო',           type: 'text' },
        { id: 'inspectionTask',     label: 'ინსპექტირების ამოცანა',        type: 'textarea' },
      ]},
      { label: 'შემსრულებლები და მასალები', fields: [
        { id: 'expertNames',           label: 'ინსპექტორ(ებ)ი',                        type: 'staffmulti' },
        { id: 'technicalManagerNames', label: 'ტექნიკური მენეჯერი',                    type: 'staffmulti' },
        { id: 'submittedMaterials',    label: 'წარმოდგენილი მასალები (თითო ხაზზე)',     type: 'textarea' },
        { id: 'normativeDocs',         label: 'ნორმატიული დოკუმენტაცია (თითო ხაზზე)',   type: 'textarea' },
        { id: 'tools',                 label: 'გამოყენებული ხელსაწყოები (თითო ხაზზე)',  type: 'textarea' },
      ]},
      { label: 'კვლევა და დასკვნა', fields: [
        { id: 'researchContent', label: 'კვლევითი ნაწილი (ტექსტი)', type: 'textarea' },
        { id: 'conclusion',      label: 'დასკვნა',                  type: 'textarea' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-INSP-REG': {
    title: 'ინსპექციების რეგისტრი (ჟურნალი)',
    signers: ['ხარისხის მენეჯერი'],
    sections: [
      { label: 'ინსპექციების სია (ჟურნალი)', fields: [
        { id: 'registerRows', label: 'ჩანაწერები', type: 'tablerows', minRows: 1, columns: [
          { id: 'c0', label: 'საქმის №', md: 4 }, { id: 'c1', label: 'დამკვეთი', md: 4 },
          { id: 'c2', label: 'ობიექტი / მისამართი', md: 4 }, { id: 'c3', label: 'სახეობა', md: 3 },
          { id: 'c4', label: 'ინსპექტორი', type: 'staff', md: 3 }, { id: 'c5', label: 'დასრულება', type: 'date', md: 3 },
          { id: 'c6', label: 'ოქმის თარიღი', type: 'date', md: 3 }, { id: 'c7', label: 'სტატუსი', md: 12 },
        ] },
      ]},
      { label: 'ჟურნალის მონაცემები', fields: [
        { id: 'journalNumber',  label: 'ჟურნალის №',                         type: 'text' },
        { id: 'period',         label: 'პერიოდი (წელი)',                       type: 'text' },
        { id: 'qualityManager', label: 'პასუხისმგებელი (ხარისხის მენეჯერი)', type: 'staffmulti' },
        { id: 'openDate',       label: 'გახსნის თარიღი',                      type: 'date' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-FAMIL': {
    title: 'გაცნობის ფურცელი',
    signers: ['შემმოწმებელი (ხარისხის მენეჯერი)', 'დამტკიცება (დირექტორი)'],
    sections: [
      { label: 'დოკუმენტის მონაცემები', fields: [
        { id: 'documentName',  label: 'დოკუმენტის სახელი',           type: 'text' },
        { id: 'documentCode',  label: 'კოდი',                        type: 'text' },
        { id: 'oldVersion',    label: 'ძველი ვერსია',                 type: 'text' },
        { id: 'newVersion',    label: 'ახალი ვერსია',                 type: 'text' },
        { id: 'effectiveDate', label: 'ძალაში შესვლის თარიღი',       type: 'date' },
        { id: 'changeDesc',    label: 'ცვლილების მოკლე აღწერა',      type: 'textarea' },
        { id: 'deadline',      label: 'გაცნობის ვადა (5 სამუშაო დღე)',  type: 'date' },
      ]},
      { label: 'გაცნობის ოქმი — პერსონალი (ხელმოწერა ხელით აქვს)', fields: [
        { id: 'acknowledgeRows', label: 'პერსონალის ჩამონათვალი', type: 'tablerows', minRows: 1,
          columns: [
            { id: 'name',     label: 'სახელი / გვარი', type: 'staff', md: 5 },
            { id: 'position', label: 'თანამდებობა', md: 4 },
            { id: 'date',     label: 'თარიღი', type: 'date', md: 3 },
          ] },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-CHANGE-INIT': {
    title: 'დოკუმენტის ცვლილების წინადადება',
    signers: ['ინიციატორი', 'ხარისხის მენეჯერი', 'დამტკიცება / დირექტორი'],
    sections: [
      { label: 'ინიციატორის მონაცემები', fields: [
        { id: 'initiatorName',  label: 'სახელი / გვარი',              type: 'staffmulti' },
        { id: 'position',       label: 'თანამდებობა',                  type: 'text' },
        { id: 'submissionDate', label: 'წარდგენის თარიღი',             type: 'date' },
        { id: 'dcrNumber',      label: 'DCR №',                       type: 'text' },
      ]},
      { label: 'დოკუმენტის ინფორმაცია', fields: [
        { id: 'documentName',   label: 'დოკუმენტის სახელი',           type: 'text' },
        { id: 'documentCode',   label: 'კოდი',                        type: 'text' },
        { id: 'currentVersion', label: 'მიმდინარე ვერსია',            type: 'text' },
        { id: 'currentText',    label: 'მიმდინარე ტექსტი',            type: 'textarea' },
        { id: 'proposedText',   label: 'შემოთავაზებული ახალი ტექსტი', type: 'textarea' },
        { id: 'reason',         label: 'მიზეზი / დასაბუთება',         type: 'textarea' },
        { id: 'decision',       label: 'გადაწყვეტილება', type: 'select', options: ['მოწონება','უარყოფა','განხილვა'] },
        { id: 'newVersion',     label: 'ახალი ვერსიის №',             type: 'text' },
        { id: 'effectiveDate',  label: 'ძალაში შესვლის თარიღი',       type: 'date' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-CHANGE-REG': {
    title: 'ცვლილებების რეგისტრი',
    signers: ['ხარისხის მენეჯერი'],
    sections: [
      { label: 'ცვლილებების ჟურნალი', fields: [
        { id: 'changeRows', label: 'ჩანაწერები', type: 'tablerows', minRows: 1, columns: [
          { id: 'c0', label: 'BE-FM-CHANGE-INIT №', md: 4 }, { id: 'c1', label: 'დოკუმენტის სახელი', md: 8 },
          { id: 'c2', label: 'ძველი ვერსია', md: 3 }, { id: 'c3', label: 'ახალი ვერსია', md: 3 },
          { id: 'c4', label: 'ძალაში შესვლის თარიღი', type: 'date', md: 3 }, { id: 'c5', label: 'ცვლილების ხასიათი', md: 8 },
          { id: 'c6', label: 'BE-FM-FAMIL (✓)', md: 4 },
        ] },
      ]},
      { label: 'ჟურნალის მონაცემები', fields: [
        { id: 'qualityManager', label: 'პასუხისმგებელი (ხარისხის მენეჯერი)', type: 'staffmulti' },
        { id: 'period',         label: 'პერიოდი (წელი)',                      type: 'text' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BLANK': {
    title: 'ოფიციალური ბლანკი — წერილი / ბრძანება',
    signers: ['დირექტორი'],
    sections: [
      { label: 'ადრესატი და სათაური', fields: [
        { id: 'to',      label: 'ადრესატი (ორგ./პირი)',        type: 'text', placeholder: 'მაგ: სს „სქოლარი"-ს დირექტორს' },
        { id: 'ref',     label: 'წერილის / საქმის №',          type: 'text', placeholder: 'მაგ: BE-2026-0042' },
        { id: 'date',    label: 'თარიღი',                      type: 'date' },
        { id: 'subject', label: 'სათაური / შინაარსი მოკლედ',   type: 'text', placeholder: 'მაგ: ინსპექტირების ანგარიშის შესახებ' },
      ]},
      { label: 'ძირითადი ტექსტი', fields: [
        { id: 'body', label: 'წერილის ტექსტი', type: 'textarea', placeholder: 'ჩაწერეთ სრული ტექსტი...' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-APP': {
    title: 'GAC — განცხადება ინსპექტირების შესახებ',
    signers: ['განმცხადებელი'],
    sections: [
      { label: 'განმცხადებლის მონაცემები', fields: [
        { id: 'org',    label: 'ორგანიზაცია / კომპანია',       type: 'text' },
        { id: 'rep',    label: 'წარმომადგენელი (სახ./გვ.)',     type: 'text' },
        { id: 'idCode', label: 'ID / საიდენტიფიკაციო კოდი / პირადი ნომერი',   type: 'text' },
        { id: 'email',  label: 'ელ.ფოსტა',                     type: 'text' },
        { id: 'phone',  label: 'ტელეფონი',                     type: 'text' },
      ]},
      { label: 'ინსპექტირების ობიექტი', fields: [
        { id: 'objectName',    label: 'ობიექტის დასახელება',    type: 'text' },
        { id: 'objectAddress', label: 'ობიექტის მისამართი',     type: 'text' },
      ]},
      { label: 'ინსპექტირების სფერო (ერთი ან მეტი)', fields: [
        { id: 'selectedScopes', label: 'სფეროები', type: 'multicheck',
          options: [
            'ობიექტის ხარჯთაღრიცხვის ინსპექტირება',
            'ობიექტის ხარჯთაღრიცხვის ფასწარმოქმნის ადეკვატურობის ინსპექტირება',
            'ობიექტზე შესრულებული სამუშაოების ინსპექტირება (მათ შორის ფორმა#2-ის მიხედვით)',
          ],
        },
      ]},
      { label: 'განცხადების შინაარსი და დოკუმენტაცია', fields: [
        { id: 'content', label: 'განცხადების შინაარსი', type: 'textarea' },
        { id: 'selectedDocs', label: 'წარმოდგენილი დოკუმენტაცია', type: 'multicheck',
          options: [
            'სატენდერო ხელშეკრულება;',
            'შეთანხმება;',
            'კორექტირებული ხარჯთაღრიცხვა;',
            'შესრულებული სამუშაოების ფორმა №2;',
            'ფარული სამუშაოთა აქტები;',
            'ლაბორატორიული დასკვნები;',
            'სხვა',
          ],
        },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-SATISF': {
    title: 'მომხმარებლის კმაყოფილების კვლევა',
    signers: ['კლიენტის წარმომადგენელი', 'ხარისხის მენეჯერი'],
    caseAutoFill: (insp) => ({
      caseNumber: insp.inspectionNumber || '',
      clientName: insp.clientName || '',
      inspScope:  insp.inspectionScope || '',
    }),
    sections: [
      { label: 'საიდენტიფიკაციო მონაცემები', fields: [
        { id: 'caseNumber',  label: 'BE-CASE №',                  type: 'case' },
        { id: 'surveyDate',  label: 'კვლევის თარიღი',             type: 'date' },
        { id: 'clientName',  label: 'კლიენტი / ორგანიზაცია',     type: 'text' },
        { id: 'clientRep',   label: 'წარმომადგენელი',             type: 'text' },
        { id: 'email',       label: 'ელ.ფოსტა',                   type: 'text' },
        { id: 'inspScope',   label: 'ინსპექტირების სფერო',        type: 'select', options: ['BE-PR-01','BE-PR-02','BE-PR-03','BE-PR-04','სხვა'] },
      ]},
      { label: 'B. კმაყოფილების შეფასება (1–5)', fields: [
        { id: 'q1', label: '1. მომსახურების ზოგადი ხარისხი',               type: 'select', options: ['1','2','3','4','5'] },
        { id: 'q2', label: '2. ინსპექტირების პროფესიონალიზმი',             type: 'select', options: ['1','2','3','4','5'] },
        { id: 'q3', label: '3. ანგარიშის სიზუსტე და სრულყოფილება',        type: 'select', options: ['1','2','3','4','5'] },
        { id: 'q4', label: '4. მომსახურების ვადების დაცვა',                type: 'select', options: ['1','2','3','4','5'] },
        { id: 'q5', label: '5. კომუნიკაცია და ინფორმირებულობა',            type: 'select', options: ['1','2','3','4','5'] },
        { id: 'q6', label: '6. პერსონალის კომპეტენტურობა',                 type: 'select', options: ['1','2','3','4','5'] },
        { id: 'q7', label: '7. ფასი / მომსახურების თანაფარდობა',           type: 'select', options: ['1','2','3','4','5'] },
        { id: 'q8', label: '8. ზოგადი კმაყოფილება',                        type: 'select', options: ['1','2','3','4','5'] },
      ]},
      { label: 'C. დამატებითი კითხვები', fields: [
        { id: 'wouldReturn',      label: 'კვლავ ისარგებლებდით ჩვენი მომსახურებით?', type: 'yesno' },
        { id: 'wouldRecommend',   label: 'გვირჩევდით სხვა კლიენტებს?',              type: 'yesno' },
        { id: 'conflictFound',    label: 'გამოვლინდა კონფლიქტი ინტერესებთან?',      type: 'yesno' },
        { id: 'avgScore',         label: 'საშუალო ქულა (გამოთვლა)',                  type: 'text', placeholder: 'მაგ: 4.5' },
        { id: 'comments',         label: 'შენიშვნები და წინადადებები',               type: 'textarea' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-TECH-REVIEW': {
    title: 'ანგარიშის ტექნიკური გადამოწმება',
    signers: ['ვერიფიკატორი (ტექნიკური მენეჯერი)', 'ხარისხის მენეჯერი'],
    caseAutoFill: (insp) => {
      const tmName = insp.technicalManager?.[0]
        ? `${insp.technicalManager[0].firstName} ${insp.technicalManager[0].lastName}` : '';
      const expertName = insp.expert?.[0]
        ? `${insp.expert[0].firstName} ${insp.expert[0].lastName}` : '';
      return {
        caseNumber: insp.inspectionNumber || '',
        inspector:  expertName,
        verifier:   tmName,
        inspScope:  insp.inspectionScope || '',
      };
    },
    sections: [
      { label: 'საიდენტიფიკაციო მონაცემები', fields: [
        { id: 'caseNumber',        label: 'BE-CASE №',                          type: 'case' },
        { id: 'reportNumber',      label: 'BE-FM-IR ანგარიშის №',               type: 'text' },
        { id: 'verificationDate',  label: 'გადამოწმების თარიღი',                type: 'date' },
        { id: 'verifier',          label: 'ვერიფიკატორი (ტექნიკური მენეჯერი)',       type: 'staffmulti' },
        { id: 'inspector',         label: 'ინსპექტორი',                         type: 'staffmulti' },
        { id: 'inspScope',         label: 'ინსპექციის სფერო',                   type: 'select', options: ['BE-PR-01','BE-PR-02','BE-PR-03','BE-PR-04','სხვა'] },
      ]},
      { label: 'B. ტექნიკური შემოწმების ჩამონათვალი (კი / არა / N/A)', fields: [
        { id: 'ck1',  label: '1. ანგარიში შეიცავს BE-CASE და მისამართს',                   type: 'yesno' },
        { id: 'ck1_note', label: '1. კომენტარი',                                            type: 'text' },
        { id: 'ck2',  label: '2. ინსპექტირების სფერო განსაზღვრულია',                       type: 'yesno' },
        { id: 'ck2_note', label: '2. კომენტარი',                                            type: 'text' },
        { id: 'ck3',  label: '3. სტანდარტები და კრიტერიუმები მითითებულია',                 type: 'yesno' },
        { id: 'ck3_note', label: '3. კომენტარი',                                            type: 'text' },
        { id: 'ck4',  label: '4. მეთოდები და მოწყობილობა ჩამოთვლილია',                    type: 'yesno' },
        { id: 'ck4_note', label: '4. კომენტარი',                                            type: 'text' },
        { id: 'ck5',  label: '5. ყველა შედეგი ნათლად ჩამოყალიბებულია',                    type: 'yesno' },
        { id: 'ck5_note', label: '5. კომენტარი',                                            type: 'text' },
        { id: 'ck6',  label: '6. შეუსაბამობები კატეგორიზებულია',                           type: 'yesno' },
        { id: 'ck6_note', label: '6. კომენტარი',                                            type: 'text' },
        { id: 'ck7',  label: '7. ფოტო-დოკუმენტაცია მითითებულია (ასეთის არსებობისას)',     type: 'yesno' },
        { id: 'ck7_note', label: '7. კომენტარი',                                            type: 'text' },
        { id: 'ck8',  label: '8. დასკვნა ასახავს მთელი ინსპექტირების შედეგს',             type: 'yesno' },
        { id: 'ck8_note', label: '8. კომენტარი',                                            type: 'text' },
        { id: 'ck9',  label: '9. ანგარიში ხელმოწერილია ინსპექტორის მიერ',                 type: 'yesno' },
        { id: 'ck9_note', label: '9. კომენტარი',                                            type: 'text' },
        { id: 'ck10', label: '10. ანგარიში შეესაბამება ISO/IEC 17020 §7.4 მოთხოვნებს',    type: 'yesno' },
        { id: 'ck10_note', label: '10. კომენტარი',                                          type: 'text' },
      ]},
      { label: 'C–D. შედეგი და შენიშვნები', fields: [
        { id: 'verificationResult', label: 'გადამოწმების შედეგი', type: 'select',
          options: ['ანგარიში დამტკიცებულია','ანგარიში საჭიროებს გადასწორებას','ანგარიში ხელახლა გადამოწმებას საჭიროებს'] },
        { id: 'remarks', label: 'შენიშვნები / გადასასწორებელი საკითხები', type: 'textarea' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-DESTROY-ACT': {
    title: 'ლიკვიდაციის (განადგურების) აქტი',
    signers: ['შემდგენი / პასუხისმგებელი', 'მოწმე', 'ხარისხის მენეჯერი'],
    sections: [
      { label: 'საიდენტიფიკაციო მონაცემები', fields: [
        { id: 'actNumber',           label: 'აქტის № (BE-DEST-YYYY-____)', type: 'text' },
        { id: 'date',                label: 'შედგენის თარიღი',             type: 'date' },
        { id: 'responsible',         label: 'პასუხისმგებელი / შემდგენი',  type: 'staffmulti' },
        { id: 'witness',             label: 'მოწმე',                       type: 'staffmulti' },
      ]},
      { label: 'B. გასანადგურებელი დოკუმენტების სია', fields: [
        { id: 'docList', label: 'დოკუმენტების სია', type: 'tablerows', minRows: 3,
          columns: [
            { id: 'name',    label: 'დოკუმენტის სახელი / კოდი', md: 4 },
            { id: 'version', label: 'ვერსია',                    md: 2 },
            { id: 'expiry',  label: 'შენახვის ვადა (თ/თ)',        md: 2 },
            { id: 'copies',  label: 'ასლების რ-ბა',               md: 2 },
            { id: 'result',  label: 'შედეგი',                     md: 2, type: 'select', options: ['ფ','ც','ა.რ.'] },
          ],
        },
      ]},
      { label: 'C–D. განადგურება და შედეგი', fields: [
        { id: 'method',              label: 'განადგურების მეთოდი', type: 'select', options: ['შეშლა (ფიზიკური)','ციფრული წაშლა','სხვა'] },
        { id: 'allCopiesDestroyed',  label: 'ყველა ასლი განადგურებულია',  type: 'yesno' },
        { id: 'fm24Updated',         label: 'BE-FM-CHANGE-REG განახლებულია',          type: 'yesno' },
        { id: 'qualityMgrVerif',     label: 'ხარისხის მენეჯერის ვიზა',    type: 'staffmulti' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-AUDIT-PLAN': {
    title: 'შიდა აუდიტის გეგმა',
    signers: ['შემდგენი (აუდიტორი)', 'შემმოწმებელი (ხარისხის მენეჯერი)', 'დამტკიცება (დირექტორი)'],
    sections: [
      { label: 'აუდიტის მონაცემები', fields: [
        { id: 'auditNumber',  label: 'აუდიტის №',                          type: 'text', placeholder: 'AUD-2026-01' },
        { id: 'period',       label: 'პერიოდი',                             type: 'text', placeholder: '2026-01 – 2026-12' },
        { id: 'auditor',      label: 'აუდიტორი',                           type: 'staffmulti' },
        { id: 'auditDate',    label: 'გეგმური თარიღი',                     type: 'date' },
        { id: 'auditedStaff', label: 'აუდიტირებული პირი',                  type: 'staffmulti' },
        { id: 'approvalDate', label: 'გეგმის დამტკიცების თარიღი',          type: 'date' },
      ]},
      { label: 'შედეგი', fields: [
        { id: 'allRequirementsMet', label: 'ყველა მოთხოვნა შესრულებულია (კი/არა)', type: 'yesno' },
        { id: 'reauditNeeded',      label: 'ხელმეორე აუდიტი საჭიროა (კი/არა)',     type: 'yesno' },
        { id: 'notes',              label: 'შენიშვნა / NC-ები',                      type: 'textarea' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-AUDIT-CHECK': {
    title: 'შიდა აუდიტის ჩეკლისტი',
    signers: ['აუდიტორი', 'შემმოწმებელი (ხარისხის მენეჯერი)', 'დამტკიცება (დირექტორი)'],
    sections: [
      { label: 'გამოვლენილი შეუსაბამობები (NC)', fields: [
        { id: 'ncRows', label: 'NC ჩანაწერები', type: 'tablerows', minRows: 1, columns: [
          { id: 'c0', label: 'NC №', md: 3 }, { id: 'c1', label: 'ISO §', md: 3 },
          { id: 'c2', label: 'კატეგორია', md: 3 }, { id: 'c3', label: 'აღწერა', md: 3 },
        ] },
      ]},
      { label: 'აუდიტის მონაცემები', fields: [
        { id: 'auditNumber',   label: 'BE-FM-AUDIT-PLAN აუდიტის №',                type: 'text' },
        { id: 'auditDate',     label: 'აუდიტის თარიღი',                 type: 'date' },
        { id: 'conforming',    label: 'ISO მოთხოვნები შესრულებულია (კი/არა)', type: 'yesno' },
        { id: 'overallResult', label: 'საერთო შეფასება', type: 'select',
          options: ['მოთხოვნები შეყვანილია','არსებითი NC-ები','მცირე NC-ები'] },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-AUDIT-REPORT': {
    title: 'შიდა აუდიტის ანგარიში',
    signers: ['აუდიტორი', 'შემმოწმებელი (ხარისხის მენეჯერი)', 'დამტკიცება (დირექტორი)'],
    sections: [
      { label: 'მიგნებები და ქმედებები', fields: [
        { id: 'findRows', label: 'მიგნებები (NC)', type: 'tablerows', minRows: 1, columns: [
          { id: 'c0', label: 'NC №', md: 3 }, { id: 'c1', label: 'ISO §', md: 2 }, { id: 'c2', label: 'კატეგორია', md: 3 },
          { id: 'c3', label: 'აღწერა', md: 8 }, { id: 'c4', label: 'BE-FM-CAPA №', md: 4 },
        ] },
        { id: 'actionRows', label: 'ინიცირებული ქმედებები', type: 'tablerows', minRows: 1, columns: [
          { id: 'c0', label: 'ქმედება', md: 6 }, { id: 'c1', label: 'პასუხისმგებელი', type: 'staff', md: 4 },
          { id: 'c2', label: 'ვადა', type: 'date', md: 3 }, { id: 'c3', label: 'სტატუსი', md: 4 },
        ] },
      ]},
      { label: 'ანგარიშის მონაცემები', fields: [
        { id: 'auditNumber',      label: 'BE-FM-AUDIT-PLAN აუდიტის №',              type: 'text' },
        { id: 'auditDate',        label: 'აუდიტის თარიღი',               type: 'date' },
        { id: 'auditedSections',  label: 'აუდიტირებული ISO §§',          type: 'text' },
        { id: 'keyFindings',      label: 'ძირითადი მიგნებები',           type: 'textarea' },
        { id: 'auditConclusion',  label: 'აუდიტის შეფასება', type: 'select',
          options: ['მოთხოვნები შეყვანილია','არსებითი NC-ები','მცირე NC-ები'] },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-AUDIT-NC': {
    title: 'აუდიტის შეუსაბამობის ფორმა',
    signers: ['აუდიტორი', 'შემმოწმებელი (ხარისხის მენეჯერი)', 'დამტკიცება (დირექტორი)'],
    sections: [
      { label: 'დამატებითი ინფორმაცია', fields: [
        { id: 'descriptionDetail', label: 'შეუსაბამობის დეტალური აღწერა', type: 'textarea' },
        { id: 'rootCauseDetail', label: 'ფესვური მიზეზი (დეტალურად)', type: 'textarea' },
        { id: 'correctiveActionDetail', label: 'მაკორექტირებელი ქმედება (დეტალურად)', type: 'textarea' },
        { id: 'checkResult', label: 'ეფექტურობის შემოწმების შედეგი', type: 'text' },
      ]},
      { label: 'შეუსაბამობის საიდენტიფიკაციო მონაცემები', fields: [
        { id: 'auditNumber',  label: 'BE-FM-AUDIT-PLAN აუდიტის №',      type: 'text' },
        { id: 'ncNumber',     label: 'NC №',                   type: 'text', placeholder: 'ANC-2026-01' },
        { id: 'isoClause',    label: 'ISO §',                   type: 'text' },
        { id: 'severity',     label: 'კატეგორია', type: 'select', options: ['მცირე (Minor)','არსებითი (Major)','კრიტიკული (Critical)'] },
        { id: 'description',  label: 'შეუსაბამობის აღწერა',   type: 'textarea' },
      ]},
      { label: 'CAPA', fields: [
        { id: 'rootCause',         label: 'ფესვური მიზეზი (5-Why)', type: 'textarea' },
        { id: 'correctiveAction',  label: 'მაკორექტირებელი ქმედება', type: 'textarea' },
        { id: 'capaNumber',        label: 'BE-FM-CAPA CAPA №',             type: 'text' },
        { id: 'deadline',          label: 'ვადა',                     type: 'date' },
        { id: 'checkDate',         label: 'შემოწმების თარიღი',        type: 'date' },
        { id: 'effective',         label: 'ეფექტურია (კი/არა)',        type: 'yesno' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-AUDIT-MEETING': {
    title: 'აუდიტის შეხვედრის ოქმი',
    signers: ['აუდიტორი', 'აუდიტირებული', 'ხარისხის მენეჯერი'],
    sections: [
      { label: 'NC და შეთანხმებული ქმედებები', fields: [
        { id: 'ncRows', label: 'NC სტატუსი', type: 'tablerows', minRows: 1, columns: [
          { id: 'c0', label: 'NC №', md: 4 }, { id: 'c1', label: 'სტატუსი', md: 5 }, { id: 'c2', label: 'BE-FM-CAPA №', md: 3 },
        ] },
        { id: 'actRows', label: 'შეთანხმებული ქმედებები', type: 'tablerows', minRows: 1, columns: [
          { id: 'c0', label: 'ქმედება', md: 6 }, { id: 'c1', label: 'პასუხისმგებელი', type: 'staff', md: 3 }, { id: 'c2', label: 'ვადა', type: 'date', md: 3 },
        ] },
      ]},
      { label: 'დამატებითი ინფორმაცია', fields: [
        { id: 'scopeDetail', label: 'აუდიტის სფერო (დეტალურად)', type: 'textarea' },
      ]},
      { label: 'შეხვედრის მონაცემები', fields: [
        { id: 'auditNumber',  label: 'BE-FM-AUDIT-PLAN აუდიტის №',                     type: 'text' },
        { id: 'meetingType',  label: 'შეხვედრის ტიპი', type: 'select', options: ['გახსნის შეხვედრა (kick-off)','დახურვის შეხვედრა (closing)'] },
        { id: 'meetingDate',  label: 'შეხვედრის თარიღი',                    type: 'date' },
        { id: 'auditor',      label: 'აუდიტორი',                            type: 'staffmulti' },
        { id: 'auditees',     label: 'აუდიტირებული პირ(ებ)ი',               type: 'text' },
        { id: 'participants', label: 'სხვა მონაწილეები',                    type: 'textarea' },
        { id: 'auditedScope', label: 'ინსპექტირებული სფერო / განყოფილება',  type: 'text' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-AUDIT-PROGRAM': {
    title: 'შიდა აუდიტის პროგრამა (წლიური გეგმა)',
    signers: ['შემდგენი (ხარისხის მენეჯერი)', 'შემმოწმებელი (აუდიტორი)', 'დამტკიცება (დირექტორი)'],
    sections: [
      { label: 'აუდიტირებული ობიექტები (წლიური)', fields: [
        { id: 'progRows', label: 'ობიექტები', type: 'tablerows', minRows: 1, columns: [
          { id: 'c0', label: 'აუდიტირებული ობიექტი (PR/FM/POL)', md: 6 }, { id: 'c1', label: 'აუდიტორი', type: 'staff', md: 6 },
          { id: 'q0', label: 'I კვარტალი (✓)', md: 3 }, { id: 'q1', label: 'II კვარტალი (✓)', md: 3 },
          { id: 'q2', label: 'III კვარტალი (✓)', md: 3 }, { id: 'q3', label: 'IV კვარტალი (✓)', md: 3 },
          { id: 'c2', label: 'სტატუსი', md: 12 },
        ] },
      ]},
      { label: 'პროგრამის მონაცემები', fields: [
        { id: 'programNumber',       label: 'პროგრამის №',                     type: 'text', placeholder: 'PROG-2026' },
        { id: 'year',                label: 'წელი',                             type: 'text', placeholder: '2026' },
        { id: 'qualityManager',      label: 'ხარისხის მენეჯერი',               type: 'staffmulti' },
        { id: 'approvalDate',        label: 'დამტკიცების კალენდარული თარიღი',      type: 'date' },
        { id: 'completedVsPlanned',  label: 'შესრულებული / გეგმური (რ-ბა)',    type: 'text' },
        { id: 'isoConforming',       label: 'ISO §8.6 კონფორმულია (კი/არა)',    type: 'yesno' },
        { id: 'remarks',             label: 'შეჯამება / შენიშვნები',            type: 'textarea' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-REG': {
    title: 'მოთხოვნის სარეგისტრაციო ფორმა',
    signers: ['ადმინისტრატორი', 'ტექნიკური მენეჯერი', 'ხარისხის მენეჯერი'],
    sections: [
      { label: 'წარდგენილი დოკუმენტაცია', fields: [
        { id: 'submittedDocs', label: 'წარდგენილი დოკუმენტაცია (მონიშნე)', type: 'multicheck', options: ['საპროექტო დოკუმენტაცია','ხარჯთაღრიცხვა','ტექნიკური დავალება','სახელშეკრულებო დოკ.','ნახაზები / სქემები','ნებართვა / ლიცენზია','სხვა'] },
      ]},
      { label: 'A. საქმის საიდენტიფიკაციო მონაცემები', fields: [
        { id: 'caseId',        label: 'BE-CASE №',           type: 'text' },
        { id: 'regDate',       label: 'რეგისტრაციის თარიღი',     type: 'date' },
        { id: 'receiptMethod', label: 'მიღების ფორმა',             type: 'select', options: ['ელ.ფოსტა', 'ფოსტა', 'პირადად', 'ტელ.'] },
        { id: 'caseType',      label: 'სამუშაოს სახე',           type: 'select', options: ['BE-PR-01', 'BE-PR-02', 'BE-PR-03', 'სხვა'] },
      ]},
      { label: 'B. დამკვეთის მონაცემები', fields: [
        { id: 'clientName',     label: 'ორგანიზაცია / სახელი, გვარი',   type: 'text' },
        { id: 'clientId',       label: 'საიდენტიფიკაციო კოდი / პირადი ნომერი',    type: 'text' },
        { id: 'clientPhone',    label: 'ტელ.',               type: 'text' },
        { id: 'clientEmail',    label: 'ელ. ფოსტა',              type: 'text' },
        { id: 'clientAddress',  label: 'მ-ბი',               type: 'text' },
        { id: 'representative', label: 'წარმ.',              type: 'text' },
      ]},
      { label: 'C. ობ.', fields: [
        { id: 'objectName',    label: 'ობიექტის დასახელება',              type: 'text' },
        { id: 'objectAddress', label: 'ობიექტის მისამართი',            type: 'text' },
        { id: 'objectCategory',label: 'ობიექტის კატეგორია',            type: 'text' },
        { id: 'contractNum',   label: 'ხელშეკრულების №',             type: 'text' },
        { id: 'description',   label: 'ა-ა',                type: 'textarea' },
      ]},
      { label: 'D. წ-ლი დ-ა', fields: [
        { id: 'docsProject',  label: 'საპროექტო დოკუმენტაცია',              type: 'yesno' },
        { id: 'docsBudget',   label: 'ხ-ა',                 type: 'yesno' },
        { id: 'docsTD',       label: 'ტექნიკური დავალება',             type: 'yesno' },
        { id: 'docsContract', label: 'სახელშეკრულებო დოკუმენტაცია',             type: 'yesno' },
        { id: 'docsDrawings', label: 'ნ-ბი / ს-ა',          type: 'yesno' },
        { id: 'otherDocs',    label: 'სხვა',                type: 'textarea' },
      ]},
      { label: 'E. წინასწარი შეფასება (ტექნიკური მენეჯერი)', fields: [
        { id: 'completenessCheck',  label: 'დ-ა ს-ე დ.',    type: 'yesno' },
        { id: 'scopeCheck',         label: 'ინსპექტირების სფერო განსაზღვრულია',   type: 'yesno' },
        { id: 'impartialityCheck',  label: 'BE-FM-IMP-DECL ინიცირებულია',    type: 'yesno' },
        { id: 'tmNote',             label: 'შ-ა / მ-ბი',    type: 'textarea' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-SCREEN': {
    title: 'ხელშეკრულების განხილვა და სამუშაოს მიღება',
    signers: ['ტექნიკური მენეჯერი', 'ხარისხის მენეჯერი', 'დირექტორი'],
    sections: [
      { label: 'A. საიდენტიფიკაციო მონაცემები', fields: [
        { id: 'caseId',      label: 'BE-CASE №',           type: 'text' },
        { id: 'reviewDate',  label: 'განხილვის თარიღი',         type: 'date' },
        { id: 'clientName',  label: 'დამკვეთი',             type: 'text' },
        { id: 'inspScope',   label: 'ინსპექტირების სფერო (BE-PR)',    type: 'select', options: ['BE-PR-01', 'BE-PR-02', 'BE-PR-03', 'სხვა'] },
        { id: 'contractNum', label: 'ხელშეკრულების №',              type: 'text' },
        { id: 'deadline',    label: 'ვადა',                 type: 'date' },
        { id: 'fee',         label: 'გასამრჯელო (₾)',          type: 'text' },
        { id: 'fm01Num',     label: 'BE-FM-REG №',              type: 'text' },
      ]},
      { label: 'B. ტექნიკური გადახედვის კრიტერიუმები (ISO §7.1.1)', fields: [
        { id: 'r_scope',      label: '§7.1.1a — ობიექტის იდენტიფიკაცია',   type: 'yesno' },
        { id: 'r_capability', label: '§7.1.1b — შესაძლებლობის დადასტურება',       type: 'yesno' },
        { id: 'r_content',    label: '§7.1.1c — მომსახურების შესაბამისობა',       type: 'yesno' },
        { id: 'r_clientReqs', label: '§7.1.1d — კლიენტის მოთხოვნები',         type: 'yesno' },
        { id: 'r_deadline',   label: '§7.1 — ვადა / გასამ.',     type: 'yesno' },
        { id: 'r_fm02',       label: 'BE-FM-IMP-DECL — მიუკ.',             type: 'yesno' },
        { id: 'r_conflict',   label: 'ინტერესთა კონფლიქტი',                type: 'yesno' },
      ]},
      { label: 'C. შესაძლებლობების დადასტურება', fields: [
        { id: 'staffAvailable', label: 'პ-ლი ხ-ა',   type: 'yesno' },
        { id: 'equipAvailable', label: 'აღჭურვილობა ხელმისაწვდომია',   type: 'yesno' },
        { id: 'timeAvailable',  label: 'ვ-ა რ-ლი',   type: 'yesno' },
      ]},
      { label: 'D–E. შ-ბები / გ-ა', fields: [
        { id: 'scopeLimitations', label: 'შ-ბები / შ-ა',          type: 'textarea' },
        { id: 'decision',         label: 'გ-ა', type: 'select', options: ['accept', 'reject', 'defer'] },
        { id: 'decisionDate',     label: 'გ-ის თ-ღი',              type: 'date' },
        { id: 'decisionNote',     label: 'გ-ის დასაბ.',            type: 'textarea' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-IMP-RISK': {
    title: 'მიუკერძოებლობის რისკების შეფასება',
    signers: ['ინსპექტორი', 'ხარისხის მენეჯერი', 'დირექტორი'],
    sections: [
      { label: 'A. ზ-ადი ი-ა', fields: [
        { id: 'assessmentId',   label: 'შეფასების №',       type: 'text' },
        { id: 'assessmentDate', label: 'თ-ღი',         type: 'date' },
        { id: 'caseId',         label: 'BE-CASE №',    type: 'text' },
        { id: 'inspector',      label: 'ინსპ.',         type: 'staffmulti' },
        { id: 'clientName',     label: 'დამკ.',         type: 'text' },
        { id: 'objectName',     label: 'ობ.',           type: 'text' },
      ]},
      { label: 'C. გ-ა', fields: [
        { id: 'overallRiskLevel', label: 'საერთო რისკის დონე', type: 'select', options: ['acceptable', 'review', 'mitigate'] },
        { id: 'controlMeasures', label: 'კ-ბი / შ-ები',  type: 'textarea' },
        { id: 'decision',        label: 'გ-ა',            type: 'select', options: ['accept', 'restricted', 'rejected'] },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-EQ-CARD': {
    title: 'აღჭურვილობის სარეგისტრაციო ბარათი',
    signers: ['ტექნიკური მენეჯერი', 'ხარისხის მენეჯერი', 'დირექტორი'],
    sections: [
      { label: 'A. აღჭურვილობის საიდენტიფიკაცია', fields: [
        { id: 'equipId',      label: 'სარეგისტრაციო №',          type: 'text' },
        { id: 'status',       label: 'სტ.',              type: 'select', options: ['Active', 'Calibrating', 'Suspended', 'Decommissioned'] },
        { id: 'name',         label: 'დასახ.',           type: 'text' },
        { id: 'model',        label: 'მოდ.',             type: 'text' },
        { id: 'serialNum',    label: 'სერიული №',           type: 'text' },
        { id: 'manufacturer', label: 'მწარ.',            type: 'text' },
        { id: 'country',      label: 'ქ.',               type: 'text' },
        { id: 'purchaseDate', label: 'შეძენის თარიღი',       type: 'date' },
        { id: 'location',     label: 'მდებარეობა',            type: 'text' },
        { id: 'measRange',    label: 'გაზომვის დიაპაზონი',        type: 'text' },
        { id: 'accuracy',     label: 'ს-ე',              type: 'text' },
      ]},
      { label: 'B. კალიბრაციის ინფორმაცია', fields: [
        { id: 'calibCenter',    label: 'კალიბრაციის ლაბორატორია / ორგანო',  type: 'text' },
        { id: 'lastCalibDate',  label: 'ბოლო კალიბრაცია',         type: 'date' },
        { id: 'nextCalibDate',  label: 'შემდეგი კალიბრაცია',        type: 'date' },
        { id: 'calibInterval',  label: 'ინ-ი (თვე)',         type: 'number' },
        { id: 'certNum',        label: 'სერტიფიკატის №',             type: 'text' },
        { id: 'traceability',   label: 'ეტალონთან კავშირი',               type: 'text' },
        { id: 'calibResult',    label: 'კალიბრაცია ვარგისია',   type: 'yesno' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'BE-FM-SUB-MONITOR': {
    title: 'ქვეკონტრაქტორის შეფასება და მონიტ. ჩ.',
    signers: ['ტექნიკური მენეჯერი', 'ხარისხის მენეჯერი', 'დირექტორი'],
    sections: [
      { label: 'A. ქვეკონტრაქტორის საიდენტიფიკაცია', fields: [
        { id: 'companyName',   label: 'ორგანიზაციის დასახელება',      type: 'text' },
        { id: 'legalForm',     label: 'იურიდიული ფორმა',         type: 'text' },
        { id: 'taxId',         label: 'ს/კ',             type: 'text' },
        { id: 'contact',       label: 'საკონტაქტო პირი',         type: 'text' },
        { id: 'phone',         label: 'ტ-ნი',            type: 'text' },
        { id: 'email',         label: 'ელ. ფოსტა',           type: 'text' },
        { id: 'address',       label: 'მ-ბი',            type: 'text' },
        { id: 'services',      label: 'გასაწევი მომსახურების სახე', type: 'textarea' },
        { id: 'accreditation', label: 'აკრედიტაცია / ლიცენზია №',   type: 'text' },
      ]},
      { label: 'B. კ-ა შ-ა ც-ლი (6 კრ.)', fields: [
        { id: 'q1',         label: 'იურიდიული სტატუსის დადასტურება (§6.3.1)',  type: 'yesno' },
        { id: 'q2',         label: 'ინსპექტირების უნარი და კომპეტენცია (§6.3.2)', type: 'yesno' },
        { id: 'q3',         label: 'პერსონალის კომპეტენცია (§6.3.3)',   type: 'yesno' },
        { id: 'q4',         label: 'აკრედიტაცია / იურიდიული საფუძველი (§6.3.4)', type: 'yesno' },
        { id: 'q5',         label: 'CAPA სისტემის დანერგვა (§8.7)',    type: 'yesno' },
        { id: 'q6',         label: 'კალიბრაცია / დადასტურება (§6.2)', type: 'yesno' },
        { id: 'totalScore', label: 'ჯ-ი ქ-ა (0–6)',          type: 'text' },
        { id: 'decision',   label: 'გ-ა', type: 'select', options: ['approved', 'conditional', 'rejected'] },
      ]},
    ],
  },

};
