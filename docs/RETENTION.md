# ჩანაწერების შენახვა და განადგურება (Retention & Disposal)

**რეფერენსი:** ISO/IEC 17020:2012 §8.4 (ჩანაწერების მართვა), BE-PR-05, BE-POL-04
**აუდიტის ნაპოვნები:** DAT-008, DAT-007, C5, ISO-006, DAT-016

## პრინციპი — Soft-delete

პორტალში **ფიზიკური წაშლა (hard-delete) გაუქმებულია** ბირთვ ჩანაწერებზე. „წაშლა"
ნიშნავს ჩანაწერის მონიშვნას (`isDeleted=true`, `deletedAt`, `deletedBy`), რის შემდეგაც
ის იფარება ჩვეულებრივი ხედებიდან, მაგრამ **ბაზაში რჩება retention-ვადის ამოწურვამდე**.
ეს უზრუნველყოფს ISO §8.4-ის მოთხოვნას — ჩანაწერების ხელშეუხებლობასა და ტრასირებადობას.

ტექნიკურად: გლობალური Mongoose plugin (`softDeletePlugin`, `server.js`) ამატებს ველებს
ყველა მოდელს და query-hook-ით ფარავს წაშლილ ჩანაწერებს. override — `setOptions({ withDeleted: true })`.

## Retention-ვადები (`RETENTION_YEARS`, server.js)

| Resource | წელი |
|---|---|
| inspection (ინსპექტირების ჩანაწერი) | 10 |
| procedure (მართვის სისტ. დოკუმენტი) | 10 |
| complaint, corrective_action, internal_audit, management_review | 6 |
| user, equipment, insurance, company_doc, checklist, price_adequacy | 6 |
| default | 6 |

ვადები კონფიგურირდება `RETENTION_YEARS`-ში. საჭიროებისას შეუსაბამეთ BE-PR-05-ის ზუსტ ვადებს.

## ადმინისტრირება (admin-only endpoint-ები)

- `GET  /api/admin/trash` — წაშლილი (retained) ჩანაწერების არქივი resource-ის მიხედვით.
- `POST /api/admin/restore/:resource/:id` — წაშლილი ჩანაწერის აღდგენა.
- `POST /api/admin/purge-expired` — **მხოლოდ** retention-ვადაგასული ჩანაწერების ფიზიკური
  წაშლა. ვადაში მყოფ ჩანაწერს არ ეხება. ყველა purge ფიქსირდება AuditLog-ში.

## ცვლილებების აღრიცხვა (DAT-016)

განახლების ოპერაციები (inspection, user, complaint, corrective_action, internal_audit)
ინახავს **before→after diff**-ს AuditLog-ის `changes` ველში — ვინ, რა, როდის შეცვალა.

## რეკომენდებული პროცესი

1. `purge-expired` გაეშვას პერიოდულად (კვარტალში ერთხელ) ან გახდეს scheduled job.
2. ფიზიკურ purge-მდე უნდა არსებობდეს ბაზის backup (იხ. `docs/BACKUP_DR.md`).
3. retention-ვადები გადაიხედოს აკრედიტაციის სქოუპის ცვლილებისას.
