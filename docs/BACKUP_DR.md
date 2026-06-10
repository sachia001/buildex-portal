# Backup & Disaster Recovery Runbook

**პროექტი:** ბილდექს ექსპერტიზა — პორტალი
**ეხება:** C5 / OPS-002 / DAT-009 / ISO §8.4 / BE-PR-05 / BE-POL-04 §3
**სტატუსი:** საწყისი ვერსია — საჭიროებს operational dry-run-ს

---

## 1. რას ვიცავთ (Assets)

| Asset | სად | მგრძნობელობა | RPO* | RTO** |
|---|---|---|---|---|
| MongoDB (ყველა ჩანაწერი) | MongoDB Atlas / Railway-Mongo | მაღალი (PII, ინსპექციები) | ≤ 24სთ | ≤ 4სთ |
| ატვირთული ფაილები | Cloudinary (`buildex-procedures` და სხვ.) | მაღალი (კონფიდ. დოკ.) | ≤ 24სთ | ≤ 4სთ |
| `uploads/*` ლოკალური | container ephemeral | **არასაიმედო** — restart-ზე იკარგება | — | — |
| კოდი/კონფიგი | GitHub `sachia001/buildex-portal` | — | git | წუთები |

\* RPO — მაქს. დასაშვები მონაცემთა დანაკარგი. \*\* RTO — აღდგენის მაქს. დრო.

> ⚠️ **ლოკალური `uploads/*` ephemeral-ია** (PERF-017). ყველა მუდმივი ფაილი Cloudinary-ზე უნდა ინახებოდეს. `CLOUDINARY_*` env სავალდებულოა production-ში (server.js fail-fast).

---

## 2. MongoDB backup

### ავტომატური (რეკომენდებული)
- **MongoDB Atlas:** ჩართე Continuous/Cloud Backup; retention ≥ 35 დღე; PITR (point-in-time).
- **Railway Mongo plugin:** დაგეგმე ყოველდღიური `mongodump` cron-ით (იხ. ქვემოთ).

### ხელით / cron `mongodump`
```bash
# ყოველდღე 02:00 (UTC) — retention 30 დღე
STAMP=$(date +%F)
mongodump --uri="$MONGODB_URI" --gzip --archive="backup-$STAMP.gz"
# ატვირთე off-site (S3/GCS/Cloudinary raw); წაშალე 30 დღეზე ძველი
```

### აღდგენა (restore)
```bash
mongorestore --uri="$MONGODB_URI" --gzip --archive="backup-YYYY-MM-DD.gz" --drop
```
> `--drop` ჩაანაცვლებს არსებულ კოლექციებს — გამოიყენე მხოლოდ სუფთა აღდგენისას.

---

## 3. Cloudinary ფაილების backup
- Cloudinary ინახავს raw assets-ს თავად; მაგრამ ანგარიშის დაკარგვის რისკისთვის:
  - ჩართე Cloudinary **Backup** (Settings → Backup) ან
  - პერიოდულად ჩამოტვირთე `cloudinary.api.resources({resource_type:'raw'})` სიით და დააარქივე off-site.

---

## 4. Retention policy (BE-PR-05 / ISO §8.4)
- ინსპექციის ჩანაწერები და ანგარიშები: **მინ. 5 წელი** (აკრედიტაციის მოთხოვნა).
- AuditLog: მინ. 3 წელი.
- backup არქივები: 30 დღე (ყოველდღიური) + 12 თვე (ყოველთვიური snapshot).
- წაშლა მხოლოდ retention-ვადის გასვლის შემდეგ, დოკუმენტირებულად.

> **TODO (კოდი):** retention/არქივის ტექნიკური ენფორსმენტი ჯერ არ არის (DAT-007/ISO-006). საჭიროა scheduled job, რომელიც ვადაგასულ ჩანაწერებს არქივში გადაიტანს (არა hard-delete).

---

## 5. DR სცენარები

| სცენარი | ქმედება |
|---|---|
| Railway სერვისი ჩავარდა | `railway up` / redeploy `main`; healthcheck `/health` (ახლა DB-საც ამოწმებს). |
| DB კორუფცია/წაშლა | `mongorestore` ბოლო ჯანსაღი არქივიდან; შეამოწმე `/health`. |
| Cloudinary მიუწვდომელი | ფაილ-ჩამოტვირთვა დროებით შეფერხდება; მონაცემები არ იკარგება (URL DB-ში). |
| Secret გაჟონვა | როტაცია: `JWT_SECRET`, `CLOUDINARY_*`, `ANTHROPIC_API_KEY`; `npm run seed-admin` ახალი პაროლით. |

---

## 6. ტესტირება
- **კვარტალში ერთხელ** ჩაატარე restore dry-run სატესტო DB-ზე და დააფიქსირე შედეგი (BE-POL-04 §3).
- დაადასტურე RPO/RTO რეალურ დროსთან.
