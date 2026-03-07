// ეს ფაილი განსაზღვრავს დოკუმენტების ტიპებს და ინდექსებს
export const DOC_CATEGORIES = {
    PARTNER_ORDER: { code: 'PO', label: "პარტნიორთა კრების ოქმი" },
    DIRECTOR_GEN: { code: '01', label: "დირექტორის ბრძანება (საერთო)" },
    DIRECTOR_HR: { code: '02-HR', label: "დირექტორის ბრძანება (საკადრო)" },
    DIRECTOR_TRIP: { code: '03-TR', label: "დირექტორის ბრძანება (მივლინება)" },
    INCOMING: { code: 'IN', label: "შემოსული კორესპონდენცია" },
    OUTGOING: { code: 'OUT', label: "გასული კორესპონდენცია" },
    LABOR_CONTRACT: { code: 'LC', label: "შრომითი ხელშეკრულება" },
    SERVICE_CONTRACT: { code: 'SC', label: "მომსახურების ხელშეკრულება" },
    INSPECTION_REP: { code: 'BX-INS', label: "ინსპექტირების ანგარიში" },
    INTERNAL_MEMO: { code: 'IM', label: "შიდა სამსახურებრივი ბარათი" }
};

// ეს ფუნქცია აგენერირებს უნიკალურ ნომერს
// მაგალითი: 02-HR-2026-005
export const generateDocNumber = (categoryKey, sequenceNumber) => {
    const category = DOC_CATEGORIES[categoryKey];
    if (!category) return 'N/A';

    const year = new Date().getFullYear();
    // 001, 002, 003 ფორმატისთვის:
    const paddedSeq = sequenceNumber.toString().padStart(3, '0'); 

    return `${category.code}-${year}-${paddedSeq}`;
};