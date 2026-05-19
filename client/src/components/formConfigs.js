// formConfigs.js — Field definitions for each FM form fill modal
// field types: text | date | textarea | select | staff | multicheck | yesno | number
// staff   → dropdown populated from /api/users/staff
// multicheck → checkboxes, stores array

export const FORM_CONFIGS = {

  // ══════════════════════════════════════════════════════════
  'FM-02': {
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
        { id: 'name',       label: 'სახელი / გვარი',    type: 'staff' },
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
  'FM-03': {
    title: 'კონფიდენციალობის შეთანხმება',
    signers: ['შემავსებელი', 'შემოწმებული', 'დამტკიცებული'],
    sections: [
      { label: 'მონაცემები', fields: [
        { id: 'name',     label: 'სახელი / გვარი', type: 'staff' },
        { id: 'position', label: 'თანამდებობა',     type: 'text' },
        { id: 'date',     label: 'თარიღი',          type: 'date' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'FM-04': {
    title: 'შიდა აუდიტის გეგმა და ანგარიში',
    signers: ['შემავსებელი', 'შემოწმებული', 'დამტკიცებული'],
    sections: [
      { label: 'საიდენტიფიკაციო მონაცემები', fields: [
        { id: 'auditNumber',  label: 'აუდიტის №',                    type: 'text' },
        { id: 'period',       label: 'პერიოდი (წელი)',                type: 'text' },
        { id: 'auditor',      label: 'აუდიტორი',                      type: 'staff' },
        { id: 'auditDate',    label: 'თარიღი',                        type: 'date' },
        { id: 'auditedStaff', label: 'შემოწმებული პერსონალი',         type: 'text', placeholder: 'მაგ: ნ. ბეგიაშვილი, გ. ვალიაშვილი' },
        { id: 'documents',    label: 'შემოწმებული დოკუმენტები',        type: 'text' },
        { id: 'cases',        label: 'შემოწმებული საქმეები (№)',        type: 'text' },
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
  'FM-06': {
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
        { id: 'capaInitiated',    label: 'FM-10 ინიცირებულია',           type: 'yesno' },
        { id: 'capaNumber',       label: 'FM-10 №',                      type: 'text' },
        { id: 'responseSentDate', label: 'პასუხის გაგზავნის თარიღი',     type: 'date' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'FM-07': {
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
      { label: 'D. გამოყენების ისტორია (5 ჩანაწერი)', fields: [
        { id: 'h1_case',      label: 'H1. BE-CASE / ვიზიტი',    type: 'text' },
        { id: 'h1_date',      label: 'H1. თარიღი',               type: 'date' },
        { id: 'h1_inspector', label: 'H1. ინსპექტორი',           type: 'staff' },
        { id: 'h1_note',      label: 'H1. შენიშვნა',             type: 'text' },
        { id: 'h2_case',      label: 'H2. BE-CASE / ვიზიტი',    type: 'text' },
        { id: 'h2_date',      label: 'H2. თარიღი',               type: 'date' },
        { id: 'h2_inspector', label: 'H2. ინსპექტორი',           type: 'staff' },
        { id: 'h2_note',      label: 'H2. შენიშვნა',             type: 'text' },
        { id: 'h3_case',      label: 'H3. BE-CASE / ვიზიტი',    type: 'text' },
        { id: 'h3_date',      label: 'H3. თარიღი',               type: 'date' },
        { id: 'h3_inspector', label: 'H3. ინსპექტორი',           type: 'staff' },
        { id: 'h3_note',      label: 'H3. შენიშვნა',             type: 'text' },
        { id: 'h4_case',      label: 'H4. BE-CASE / ვიზიტი',    type: 'text' },
        { id: 'h4_date',      label: 'H4. თარიღი',               type: 'date' },
        { id: 'h4_inspector', label: 'H4. ინსპექტორი',           type: 'staff' },
        { id: 'h4_note',      label: 'H4. შენიშვნა',             type: 'text' },
        { id: 'h5_case',      label: 'H5. BE-CASE / ვიზიტი',    type: 'text' },
        { id: 'h5_date',      label: 'H5. თარიღი',               type: 'date' },
        { id: 'h5_inspector', label: 'H5. ინსპექტორი',           type: 'staff' },
        { id: 'h5_note',      label: 'H5. შენიშვნა',             type: 'text' },
      ]},
      { label: 'შეუსაბამობა და შედეგები', fields: [
        { id: 'nonConformityFound', label: 'შეუსაბამობა ნაპოვნია',  type: 'yesno' },
        { id: 'fm14Number',         label: 'FM-14 №',               type: 'text' },
        { id: 'verifierName',       label: 'ვერიფიკატორი',          type: 'staff' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'FM-08': {
    title: 'კომპეტენციის შეფასება',
    signers: ['ინსპექტორი', 'ტექნიკური მენეჯერი', 'ხარისხის მენეჯერი'],
    sections: [
      { label: 'ინსპექტორის მონაცემები', fields: [
        { id: 'name',           label: 'სახელი / გვარი',       type: 'staff' },
        { id: 'personalId',     label: 'პირადი №',             type: 'text' },
        { id: 'position',       label: 'თანამდებობა',          type: 'text' },
        { id: 'assessmentDate', label: 'შეფასების თარიღი',     type: 'date' },
        { id: 'assessor',       label: 'შემფასებელი',          type: 'staff' },
        { id: 'assessmentType', label: 'შეფასების ტიპი',       type: 'select', options: ['საწყისი','პერიოდული','witnessing'] },
        { id: 'scope',          label: 'სპეციალობა (BE-PR-XX)', type: 'text' },
        { id: 'eduMatch',       label: 'განათლება შეესაბამება', type: 'yesno' },
        { id: 'experience',     label: 'გამოცდილება (წელი)',   type: 'text' },
      ]},
      { label: 'შეფასების ქულები (1–5)', fields: [
        { id: 'score1',         label: '1. სამუშაო ნიმუში / ნორმები',      type: 'number' },
        { id: 'score2',         label: '2. ISO 17020 ცოდნა',               type: 'number' },
        { id: 'score3',         label: '3. გადაწყვეტილების მიღების პრაქტიკა', type: 'number' },
        { id: 'score4',         label: '4. ანგარიშის შედგენის უნარი',      type: 'number' },
        { id: 'score5',         label: '5. witnessing',                    type: 'number' },
        { id: 'decision',       label: 'გადაწყვეტილება', type: 'select', options: ['ავტორიზებული','გაგრძელება','ტრენინგი','ჩამოშორება'] },
        { id: 'trainingNeeded', label: 'ტრენინგის საჭიროება',              type: 'textarea' },
        { id: 'nextAssessment', label: 'მომდევნო შეფასების თარიღი',       type: 'date' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'FM-09': {
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
        { id: 'fm02Number',     label: 'FM-02 №',                         type: 'text' },
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
        { id: 'r_fm02',        label: 'FM-02 კი/არა — მიუკ. შეფასება',                 type: 'yesno' },
        { id: 'r_fm02_note',   label: 'FM-02 კომენტარი',                                type: 'text' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'FM-10': {
    title: 'CAPA — მაკორექტირებელი ქმედება',
    signers: ['შემდგენი', 'ხარისხის მენეჯერი', 'დირექტორი'],
    sections: [
      { label: 'A. რეგისტრაცია', fields: [
        { id: 'capaNumber',  label: 'CAPA №',                   type: 'text' },
        { id: 'initDate',    label: 'ინიცირების თარიღი',        type: 'date' },
        { id: 'initiator',   label: 'ინიციატორი',               type: 'staff' },
        { id: 'source',      label: 'წყარო', type: 'select', options: ['შიდა აუდიტი','გარე შემოწმება','საჩივარი','შეუსაბამო სამუშაო','ინციდენტი','ანალიზი'] },
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
        { id: 'responsible',  label: 'შემსრულებელი',                    type: 'staff' },
        { id: 'deadline',     label: 'ვადა',                            type: 'date' },
      ]},
      { label: 'F. ეფექტურობის შემოწმება', fields: [
        { id: 'checkDate',      label: 'შემოწმების თარიღი',             type: 'date' },
        { id: 'effectiveCheck', label: 'ეფექტურია',                     type: 'yesno' },
        { id: 'closingDate',    label: 'დახურვის თარიღი',               type: 'date' },
        { id: 'qualityMgrVerif',label: 'ხარისხის მენეჯერის ვიზა',       type: 'staff' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'FM-11': {
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
      { label: 'საიდენტიფიკაციო მონაცემები', fields: [
        { id: 'caseNumber',     label: 'BE-CASE №',                    type: 'case' },
        { id: 'inspDate',       label: 'ინსპექციის თარიღი',            type: 'date' },
        { id: 'address',        label: 'ობიექტის მისამართი',           type: 'text' },
        { id: 'client',         label: 'დამკვეთი',                     type: 'text' },
        { id: 'contractNumber', label: 'ხელშეკრულების №',              type: 'text' },
        { id: 'fm09Number',     label: 'FM-09 №',                      type: 'text' },
        { id: 'inspector',      label: 'ინსპექტორი',                   type: 'staff' },
        { id: 'techManager',    label: 'ტექნიკური მენეჯერი',           type: 'staff' },
        { id: 'specialNotes',   label: 'განსაკუთრებული მოთხოვნები / რისკები', type: 'textarea' },
      ]},
      { label: 'D. ეტაპები', fields: [
        { id: 'stage1_date',        label: 'ეტ.1 თარიღი — დოკ. მომზადება',      type: 'date' },
        { id: 'stage1_responsible', label: 'ეტ.1 პასუხისმგებელი',               type: 'staff' },
        { id: 'stage1_status',      label: 'ეტ.1 სტატუსი',                       type: 'text' },
        { id: 'stage2_date',        label: 'ეტ.2 თარიღი — კლიენტთან შეხვედრა', type: 'date' },
        { id: 'stage2_responsible', label: 'ეტ.2 პასუხისმგებელი',               type: 'staff' },
        { id: 'stage2_status',      label: 'ეტ.2 სტატუსი',                       type: 'text' },
        { id: 'stage3_date',        label: 'ეტ.3 თარიღი — საიტის ვიზიტი',      type: 'date' },
        { id: 'stage3_responsible', label: 'ეტ.3 პასუხისმგებელი',               type: 'staff' },
        { id: 'stage3_status',      label: 'ეტ.3 სტატუსი',                       type: 'text' },
        { id: 'stage4_date',        label: 'ეტ.4 თარიღი — ანგარიშის პროექტი',  type: 'date' },
        { id: 'stage4_responsible', label: 'ეტ.4 პასუხისმგებელი',               type: 'staff' },
        { id: 'stage4_status',      label: 'ეტ.4 სტატუსი',                       type: 'text' },
        { id: 'stage5_date',        label: 'ეტ.5 თარიღი — ტექ. განხილვა',      type: 'date' },
        { id: 'stage5_responsible', label: 'ეტ.5 პასუხისმგებელი',               type: 'staff' },
        { id: 'stage5_status',      label: 'ეტ.5 სტატუსი',                       type: 'text' },
        { id: 'stage6_date',        label: 'ეტ.6 თარიღი — ანგარიშის გაგზავნა', type: 'date' },
        { id: 'stage6_responsible', label: 'ეტ.6 პასუხისმგებელი',               type: 'staff' },
        { id: 'stage6_status',      label: 'ეტ.6 სტატუსი',                       type: 'text' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'FM-12': {
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
        { id: 'validator',        label: 'შემმოწმებელი',              type: 'staff' },
        { id: 'caseNumber',       label: 'BE-CASE №',                 type: 'text' },
        { id: 'decision',         label: 'გადაწყვეტილება', type: 'select', options: ['დამტკიცებულია','პირობით დამტკიცება','უარყოფილია'] },
        { id: 'condition',        label: 'პირობები (პირობითი დამტ.)', type: 'text' },
        { id: 'validUntil',       label: 'ვალიდური ვადა',             type: 'date' },
      ]},
      { label: 'C. კომპეტენციის ქულები (4 სფერო)', fields: [
        { id: 'comp1_scope',   label: 'C1. ინსპ. სფერო',    type: 'text' },
        { id: 'comp1_score',   label: 'C1. ქულა (1–5)',      type: 'number' },
        { id: 'comp1_comment', label: 'C1. კომენტარი',       type: 'text' },
        { id: 'comp2_scope',   label: 'C2. ინსპ. სფერო',    type: 'text' },
        { id: 'comp2_score',   label: 'C2. ქულა (1–5)',      type: 'number' },
        { id: 'comp2_comment', label: 'C2. კომენტარი',       type: 'text' },
        { id: 'comp3_scope',   label: 'C3. ინსპ. სფერო',    type: 'text' },
        { id: 'comp3_score',   label: 'C3. ქულა (1–5)',      type: 'number' },
        { id: 'comp3_comment', label: 'C3. კომენტარი',       type: 'text' },
        { id: 'comp4_scope',   label: 'C4. ინსპ. სფერო',    type: 'text' },
        { id: 'comp4_score',   label: 'C4. ქულა (1–5)',      type: 'number' },
        { id: 'comp4_comment', label: 'C4. კომენტარი',       type: 'text' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'FM-13': {
    title: 'ტრენინგის ჩანაწერი',
    signers: ['თანამშრომელი', 'ტექნიკური მენეჯერი', 'ხარისხის მენეჯერი'],
    sections: [
      { label: 'თანამშრომლის მონაცემები', fields: [
        { id: 'name',         label: 'სახელი / გვარი',              type: 'staff' },
        { id: 'personalId',   label: 'პირადი №',                    type: 'text' },
        { id: 'position',     label: 'თანამდებობა',                 type: 'text' },
        { id: 'trainingDate', label: 'ტრენინგის თარიღი',            type: 'date' },
        { id: 'duration',     label: 'ხანგრძლივობა (საათი)',        type: 'number' },
        { id: 'location',     label: 'ადგილმდებარეობა',             type: 'text' },
        { id: 'type',         label: 'ტრენინგის სახეობა', type: 'select', options: ['შიდა ანალიზი','გარე ტრენინგი','witnessing','ახალი ინსტ. ზედამხ.','ნორმატიული დოკ.','IT','სხვა'] },
        { id: 'title',        label: 'სათაური / თემა',              type: 'text' },
        { id: 'organizer',    label: 'ორგანიზატორი / ინსტიტუტი',   type: 'text' },
        { id: 'competent',    label: 'კომპეტენტურია',               type: 'yesno' },
        { id: 'nextTraining', label: 'მომდევნო ტრენინგის თარიღი',  type: 'date' },
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
  'FM-14': {
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
        { id: 'detector',        label: 'გამომვლენი პირი',           type: 'staff' },
        { id: 'isoClause',       label: 'ISO §',                     type: 'text' },
        { id: 'description',     label: 'შეუსაბამობის აღწერა',       type: 'textarea' },
      ]},
      { label: '4–5. მართვა და ფესვური მიზეზი', fields: [
        { id: 'immediateAction', label: 'მიღებული ქმედება',          type: 'textarea' },
        { id: 'responsible',     label: 'პასუხისმგებელი',            type: 'staff' },
        { id: 'deadline',        label: 'ვადა',                      type: 'date' },
        { id: 'rootCause',       label: 'ფესვური მიზეზი',            type: 'textarea' },
      ]},
      { label: '6–7. CAPA და დახურვა', fields: [
        { id: 'capaNumber',      label: 'FM-10 CAPA №',              type: 'text' },
        { id: 'capaDeadline',    label: 'CAPA ვადა',                  type: 'date' },
        { id: 'closed',          label: 'დახურულია',                 type: 'yesno' },
        { id: 'closingDate',     label: 'დახურვის თარიღი',           type: 'date' },
        { id: 'qualityMgrVerif', label: 'ხარისხის მენეჯერის ვიზა',   type: 'staff' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'FM-15': {
    title: 'მართვის ანალიზი — სხდომის ოქმი',
    signers: ['სხდომის თავმჯდომარე', 'ხარისხის მენეჯერი', 'დირექტორი'],
    sections: [
      { label: 'სხდომის მონაცემები', fields: [
        { id: 'meetingNumber', label: 'სხდომის №',                    type: 'text' },
        { id: 'date',          label: 'თარიღი',                       type: 'date' },
        { id: 'location',      label: 'ადგილმდებარეობა',              type: 'text' },
        { id: 'chairman',      label: 'თავმჯდომარე',                  type: 'staff' },
        { id: 'secretary',     label: 'მდივანი',                      type: 'staff' },
        { id: 'participants',  label: 'მონაწილეები (სახელები)',         type: 'textarea' },
        { id: 'effectiveness', label: 'სისტემის ეფექტურობა', type: 'select', options: ['ეფექტური','არაეფექტური','CAPA საჭიროა'] },
      ]},
      { label: '3. გადაწყვეტილებები (4 ჩანაწერი)', fields: [
        { id: 'dec1_action',      label: 'D1. ქმედება',            type: 'textarea' },
        { id: 'dec1_responsible', label: 'D1. პასუხისმგებელი',     type: 'staff' },
        { id: 'dec1_deadline',    label: 'D1. ვადა',                type: 'date' },
        { id: 'dec1_status',      label: 'D1. სტატუსი',             type: 'text' },
        { id: 'dec2_action',      label: 'D2. ქმედება',            type: 'textarea' },
        { id: 'dec2_responsible', label: 'D2. პასუხისმგებელი',     type: 'staff' },
        { id: 'dec2_deadline',    label: 'D2. ვადა',                type: 'date' },
        { id: 'dec2_status',      label: 'D2. სტატუსი',             type: 'text' },
        { id: 'dec3_action',      label: 'D3. ქმედება',            type: 'textarea' },
        { id: 'dec3_responsible', label: 'D3. პასუხისმგებელი',     type: 'staff' },
        { id: 'dec3_deadline',    label: 'D3. ვადა',                type: 'date' },
        { id: 'dec3_status',      label: 'D3. სტატუსი',             type: 'text' },
        { id: 'dec4_action',      label: 'D4. ქმედება',            type: 'textarea' },
        { id: 'dec4_responsible', label: 'D4. პასუხისმგებელი',     type: 'staff' },
        { id: 'dec4_deadline',    label: 'D4. ვადა',                type: 'date' },
        { id: 'dec4_status',      label: 'D4. სტატუსი',             type: 'text' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'FM-16': {
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
        { id: 'inspector',     label: 'ინსპექტორი',                       type: 'staff' },
        { id: 'clientRep',     label: 'დამკვეთის წარმომადგენელი',         type: 'text' },
        { id: 'contractorRep', label: 'კონტრაქტორის წარმომადგენელი',      type: 'text' },
        { id: 'visitType',     label: 'ვიზიტის სახეობა', type: 'select', options: ['დათვალიერება / გაზომვა','სინჯის აღება','ფოტო-სამუშაო','საკონტროლო ეტაპი','გარდამავალი ოქმი','მოულოდნელი შემოწმება'] },
      ]},
      { label: 'C. ინსპექტირება (3 ჩანაწერი)', fields: [
        { id: 'c1_name',     label: 'C1. ინსპ. დასახელება',        type: 'text' },
        { id: 'c1_standard', label: 'C1. სტანდარტის №',             type: 'text' },
        { id: 'c1_control',  label: 'C1. კონტროლის ვითარება',       type: 'text' },
        { id: 'c1_note',     label: 'C1. ჩვენება / შენიშვნა',       type: 'text' },
        { id: 'c2_name',     label: 'C2. ინსპ. დასახელება',        type: 'text' },
        { id: 'c2_standard', label: 'C2. სტანდარტის №',             type: 'text' },
        { id: 'c2_control',  label: 'C2. კონტროლის ვითარება',       type: 'text' },
        { id: 'c2_note',     label: 'C2. ჩვენება / შენიშვნა',       type: 'text' },
        { id: 'c3_name',     label: 'C3. ინსპ. დასახელება',        type: 'text' },
        { id: 'c3_standard', label: 'C3. სტანდარტის №',             type: 'text' },
        { id: 'c3_control',  label: 'C3. კონტროლის ვითარება',       type: 'text' },
        { id: 'c3_note',     label: 'C3. ჩვენება / შენიშვნა',       type: 'text' },
      ]},
      { label: 'D. დეფექტები (5 ჩანაწერი)', fields: [
        { id: 'd1_element',  label: 'D1. სამშ. ელემენტი',           type: 'text' },
        { id: 'd1_photo',    label: 'D1. ფოტო გადაღება',             type: 'text' },
        { id: 'd1_page',     label: 'D1. სტანდარტის გვ.',            type: 'text' },
        { id: 'd1_deviation',label: 'D1. გადახრა',                   type: 'text' },
        { id: 'd1_note',     label: 'D1. შენიშვნა',                  type: 'text' },
        { id: 'd2_element',  label: 'D2. სამშ. ელემენტი',           type: 'text' },
        { id: 'd2_photo',    label: 'D2. ფოტო გადაღება',             type: 'text' },
        { id: 'd2_page',     label: 'D2. სტანდარტის გვ.',            type: 'text' },
        { id: 'd2_deviation',label: 'D2. გადახრა',                   type: 'text' },
        { id: 'd2_note',     label: 'D2. შენიშვნა',                  type: 'text' },
        { id: 'd3_element',  label: 'D3. სამშ. ელემენტი',           type: 'text' },
        { id: 'd3_photo',    label: 'D3. ფოტო გადაღება',             type: 'text' },
        { id: 'd3_page',     label: 'D3. სტანდარტის გვ.',            type: 'text' },
        { id: 'd3_deviation',label: 'D3. გადახრა',                   type: 'text' },
        { id: 'd3_note',     label: 'D3. შენიშვნა',                  type: 'text' },
        { id: 'd4_element',  label: 'D4. სამშ. ელემენტი',           type: 'text' },
        { id: 'd4_photo',    label: 'D4. ფოტო გადაღება',             type: 'text' },
        { id: 'd4_page',     label: 'D4. სტანდარტის გვ.',            type: 'text' },
        { id: 'd4_deviation',label: 'D4. გადახრა',                   type: 'text' },
        { id: 'd4_note',     label: 'D4. შენიშვნა',                  type: 'text' },
        { id: 'd5_element',  label: 'D5. სამშ. ელემენტი',           type: 'text' },
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
  'FM-21': {
    title: 'ინსპექციების რეგისტრი (ჟურნალი)',
    signers: ['ხარისხის მენეჯერი'],
    sections: [
      { label: 'ჟურნალის მონაცემები', fields: [
        { id: 'journalNumber',  label: 'ჟურნალის №',                         type: 'text' },
        { id: 'period',         label: 'პერიოდი (წელი)',                       type: 'text' },
        { id: 'qualityManager', label: 'პასუხისმგებელი (ხარისხის მენეჯერი)', type: 'staff' },
        { id: 'openDate',       label: 'გახსნის თარიღი',                      type: 'date' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'FM-22': {
    title: 'გაცნობის ფურცელი',
    signers: ['შემდგენი', 'შემმოწმებელი (ხარისხის მენეჯერი)', 'დამტკიცება (დირექტორი)'],
    sections: [
      { label: 'დოკუმენტის მონაცემები', fields: [
        { id: 'documentName',  label: 'დოკუმენტის სახელი',           type: 'text' },
        { id: 'documentCode',  label: 'კოდი',                        type: 'text' },
        { id: 'oldVersion',    label: 'ძველი ვერსია',                 type: 'text' },
        { id: 'newVersion',    label: 'ახალი ვერსია',                 type: 'text' },
        { id: 'effectiveDate', label: 'ძალაში შესვლის თარიღი',       type: 'date' },
        { id: 'changeDesc',    label: 'ცვლილების მოკლე აღწერა',      type: 'textarea' },
        { id: 'deadline',      label: 'გაცნობის ვადა (5 სამ. დღე)',  type: 'date' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'FM-23': {
    title: 'დოკუმენტის ცვლილების წინადადება',
    signers: ['ინიციატორი', 'ხარისხის მენეჯერი', 'დამტკიცება / დირექტორი'],
    sections: [
      { label: 'ინიციატორის მონაცემები', fields: [
        { id: 'initiatorName',  label: 'სახელი / გვარი',              type: 'staff' },
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
  'FM-24': {
    title: 'ცვლილებების რეგისტრი',
    signers: ['ხარისხის მენეჯერი'],
    sections: [
      { label: 'ჟურნალის მონაცემები', fields: [
        { id: 'qualityManager', label: 'პასუხისმგებელი (ხარისხის მენეჯერი)', type: 'staff' },
        { id: 'period',         label: 'პერიოდი (წელი)',                      type: 'text' },
      ]},
    ],
  },

  // ══════════════════════════════════════════════════════════
  'FM-25': {
    title: 'ლიკვიდაციის (განადგურების) აქტი',
    signers: ['შემდგენი / პასუხისმგებელი', 'მოწმე', 'ხარისხის მენეჯერი'],
    sections: [
      { label: 'საიდენტიფიკაციო მონაცემები', fields: [
        { id: 'actNumber',           label: 'აქტის № (BE-DEST-YYYY-____)', type: 'text' },
        { id: 'date',                label: 'შედგენის თარიღი',             type: 'date' },
        { id: 'responsible',         label: 'პასუხისმგებელი / შემდგენი',  type: 'staff' },
        { id: 'witness',             label: 'მოწმე',                       type: 'staff' },
      ]},
      { label: 'C–D. განადგურება და შედეგი', fields: [
        { id: 'method',              label: 'განადგურების მეთოდი', type: 'select', options: ['შეშლა (ფიზიკური)','ციფრული წაშლა','სხვა'] },
        { id: 'allCopiesDestroyed',  label: 'ყველა ასლი განადგურებულია',  type: 'yesno' },
        { id: 'fm24Updated',         label: 'FM-24 განახლებულია',          type: 'yesno' },
        { id: 'qualityMgrVerif',     label: 'ხარისხის მენეჯერის ვიზა',    type: 'staff' },
      ]},
    ],
  },
};
