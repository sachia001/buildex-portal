// wordDocGenerator.js
// Generates proper .docx files that mirror PDF structure exactly.
// Uses the `docx` npm package (v9.x) — browser-compatible via webpack.

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, VerticalAlign,
  Footer, PageNumber, ImageRun,
} from 'docx';

// ── Constants ─────────────────────────────────────────────────
const C_BLUE      = '003366';   // company dark blue
const C_BG        = 'E8F0F7';   // section header light blue (matches PDF secH)
const C_WHITE     = 'FFFFFF';
const C_GREY      = '888888';
const C_TEXT      = '000000';
const FULL_W      = 9360;       // content width in DXA (A4, 2cm margins each side)
const LABEL_W     = 3060;       // ~33% label column
const VALUE_W     = FULL_W - LABEL_W;
const CELL_BORDER = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const NO_BORDER   = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const BOTTOM_LINE = { style: BorderStyle.SINGLE, size: 6, color: '000000' };

const allBorders = (b) => ({ top: b, bottom: b, left: b, right: b });
const noBorders  = allBorders(NO_BORDER);

const run = (text, opts = {}) => new TextRun({
  text, font: 'Arial', size: 18, color: C_TEXT, ...opts,
});

const emptyPara = (space = 40) =>
  new Paragraph({ spacing: { before: space, after: space }, children: [run('')] });

// ── Fetch logo from server ────────────────────────────────────
async function fetchLogo() {
  try {
    const resp = await fetch('/logo.png');
    if (!resp.ok) return null;
    return await resp.arrayBuffer();
  } catch { return null; }
}

// ── Header block (company + metadata bar) ────────────────────
function buildDocHeader(logoData, code, isoRef, title) {
  const children = [];

  // Logo
  if (logoData) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new ImageRun({
        data: logoData,
        transformation: { width: 110, height: 42 },
      })],
    }));
  }

  // Company name
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 20 },
    children: [run('შპს „ბილდექს ექსპერტიზა"', { bold: true, size: 24, color: C_BLUE })],
  }));

  // Company info
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
    children: [run('ს/კ 431188010  |  ქ. თელავი, ლიონიძის ქ. 22  |  info@buildexpertise.com', {
      size: 14, color: C_GREY,
    })],
  }));

  // Blue metadata bar (table)
  children.push(new Table({
    width: { size: FULL_W, type: WidthType.DXA },
    columnWidths: [FULL_W / 2, FULL_W / 2],
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: FULL_W / 2, type: WidthType.DXA },
        shading: { fill: C_BLUE, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 120, right: 80 },
        borders: noBorders,
        children: [new Paragraph({
          children: [run(`${code}  |  ვ. 2.0  |  28.04.2026  |  მოქმედი`, { color: C_WHITE, size: 15 })],
        })],
      }),
      new TableCell({
        width: { size: FULL_W / 2, type: WidthType.DXA },
        shading: { fill: C_BLUE, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 80, right: 120 },
        borders: noBorders,
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [run(`${isoRef}  |  A-ტ.  |  GAC`, { color: C_WHITE, size: 15 })],
        })],
      }),
    ]})],
  }));

  // Form title
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 40 },
    children: [run(title, { bold: true, size: 24, color: C_BLUE })],
  }));

  // Subtitle / code line
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [run(code, { size: 15, color: C_GREY })],
  }));

  return children;
}

// ── Section heading row ───────────────────────────────────────
function sectionHeading(label) {
  return new Table({
    width: { size: FULL_W, type: WidthType.DXA },
    columnWidths: [FULL_W],
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: FULL_W, type: WidthType.DXA },
        shading: { fill: C_BG, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        borders: noBorders,
        children: [new Paragraph({
          children: [run(label, { bold: true, size: 18, color: C_BLUE })],
        })],
      }),
    ]})],
  });
}

// ── Standard field row (label | underline) ───────────────────
function fieldRow(label) {
  return new Table({
    width: { size: FULL_W, type: WidthType.DXA },
    columnWidths: [LABEL_W, VALUE_W],
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: LABEL_W, type: WidthType.DXA },
        margins: { top: 40, bottom: 40, left: 60, right: 60 },
        borders: { ...noBorders },
        children: [new Paragraph({
          children: [run(label, { bold: true, size: 17 })],
        })],
      }),
      new TableCell({
        width: { size: VALUE_W, type: WidthType.DXA },
        margins: { top: 40, bottom: 40, left: 60, right: 60 },
        borders: { ...noBorders, bottom: BOTTOM_LINE },
        children: [new Paragraph({ children: [run(' ')] })],
      }),
    ]})],
  });
}

// ── Yes / No row ─────────────────────────────────────────────
function yesNoRow(label) {
  return new Table({
    width: { size: FULL_W, type: WidthType.DXA },
    columnWidths: [FULL_W - 1800, 900, 900],
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: FULL_W - 1800, type: WidthType.DXA },
        margins: { top: 40, bottom: 40, left: 60, right: 60 },
        borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'EEEEEE' } },
        children: [new Paragraph({ children: [run(label, { size: 17 })] })],
      }),
      new TableCell({
        width: { size: 900, type: WidthType.DXA },
        margins: { top: 40, bottom: 40, left: 60, right: 60 },
        borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'EEEEEE' } },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [run('☐  კი', { size: 17 })],
        })],
      }),
      new TableCell({
        width: { size: 900, type: WidthType.DXA },
        margins: { top: 40, bottom: 40, left: 60, right: 60 },
        borders: { ...noBorders, bottom: { style: BorderStyle.SINGLE, size: 1, color: 'EEEEEE' } },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [run('☐  არა', { size: 17 })],
        })],
      }),
    ]})],
  });
}

// ── Textarea row (bordered box) ───────────────────────────────
function textareaRow(label) {
  const border = { style: BorderStyle.SINGLE, size: 4, color: 'AAAAAA' };
  return [
    new Paragraph({
      spacing: { before: 60, after: 40 },
      children: [run(label, { bold: true, size: 17 })],
    }),
    new Table({
      width: { size: FULL_W, type: WidthType.DXA },
      columnWidths: [FULL_W],
      rows: [new TableRow({ children: [
        new TableCell({
          width: { size: FULL_W, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          borders: allBorders(border),
          children: [
            new Paragraph({ children: [run(' ')] }),
            new Paragraph({ children: [run(' ')] }),
          ],
        }),
      ]})],
    }),
  ];
}

// ── Multicheck row ────────────────────────────────────────────
function multicheckRow(label, options = []) {
  return [
    new Paragraph({
      spacing: { before: 60, after: 40 },
      children: [run(label, { bold: true, size: 17 })],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: options.flatMap((opt, i) => [
        run('  ☐  ', { size: 17 }),
        run(opt, { size: 17 }),
        i < options.length - 1 ? run('     ', { size: 17 }) : null,
      ]).filter(Boolean),
    }),
  ];
}

// ── Two side-by-side field rows on one line ───────────────────
function field2Row(label1, label2) {
  const halfLabel = Math.floor(LABEL_W / 2);
  const halfValue = Math.floor((FULL_W - LABEL_W) / 2);
  return new Table({
    width: { size: FULL_W, type: WidthType.DXA },
    columnWidths: [halfLabel, halfValue, halfLabel, halfValue],
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: halfLabel, type: WidthType.DXA },
        margins: { top: 40, bottom: 40, left: 60, right: 40 },
        borders: noBorders,
        children: [new Paragraph({ children: [run(label1, { bold: true, size: 17 })] })],
      }),
      new TableCell({
        width: { size: halfValue, type: WidthType.DXA },
        margins: { top: 40, bottom: 40, left: 40, right: 60 },
        borders: { ...noBorders, bottom: BOTTOM_LINE },
        children: [new Paragraph({ children: [run(' ')] })],
      }),
      new TableCell({
        width: { size: halfLabel, type: WidthType.DXA },
        margins: { top: 40, bottom: 40, left: 60, right: 40 },
        borders: noBorders,
        children: [new Paragraph({ children: [run(label2, { bold: true, size: 17 })] })],
      }),
      new TableCell({
        width: { size: halfValue, type: WidthType.DXA },
        margins: { top: 40, bottom: 40, left: 40, right: 60 },
        borders: { ...noBorders, bottom: BOTTOM_LINE },
        children: [new Paragraph({ children: [run(' ')] })],
      }),
    ]})],
  });
}

// ── Prebuilt table (dark blue header + pre-defined rows) ──────
function prebuiltTable(columns = [], widths = [], rows = []) {
  const totalW = widths.reduce((a, b) => a + b, 0) || FULL_W;
  const scale = FULL_W / totalW;
  const scaledWidths = widths.map(w => Math.round(w * scale));
  const colW = (i) => scaledWidths[i] || Math.floor(FULL_W / columns.length);

  const headerRow = new TableRow({
    children: columns.map((col, i) =>
      new TableCell({
        width: { size: colW(i), type: WidthType.DXA },
        shading: { fill: C_BLUE, type: ShadingType.CLEAR },
        margins: { top: 40, bottom: 40, left: 60, right: 60 },
        borders: allBorders(CELL_BORDER),
        children: [new Paragraph({
          children: [run(col, { bold: true, size: 16, color: C_WHITE })],
        })],
      })
    ),
  });

  const dataRows = rows.map((row, rowIdx) => {
    const fill = rowIdx % 2 === 1 ? 'F2F6FA' : C_WHITE;
    return new TableRow({
      children: columns.map((_, colIdx) => {
        const cellText = (row[colIdx] !== undefined && row[colIdx] !== null) ? String(row[colIdx]) : '';
        return new TableCell({
          width: { size: colW(colIdx), type: WidthType.DXA },
          shading: { fill, type: ShadingType.CLEAR },
          margins: { top: 30, bottom: 30, left: 60, right: 60 },
          borders: allBorders(CELL_BORDER),
          children: [new Paragraph({
            children: [run(cellText, { size: 16 })],
          })],
        });
      }),
    });
  });

  return new Table({
    width: { size: FULL_W, type: WidthType.DXA },
    columnWidths: scaledWidths,
    rows: [headerRow, ...dataRows],
  });
}

// ── Rating/score table (checkbox columns) ─────────────────────
function ratingTable(columns = [], widths = [], rows = []) {
  const totalW = widths.reduce((a, b) => a + b, 0) || FULL_W;
  const scale = FULL_W / totalW;
  const scaledWidths = widths.map(w => Math.round(w * scale));
  const colW = (i) => scaledWidths[i] || Math.floor(FULL_W / columns.length);

  const headerRow = new TableRow({
    children: columns.map((col, i) =>
      new TableCell({
        width: { size: colW(i), type: WidthType.DXA },
        shading: { fill: C_BLUE, type: ShadingType.CLEAR },
        margins: { top: 40, bottom: 40, left: 60, right: 60 },
        borders: allBorders(CELL_BORDER),
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          alignment: i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER,
          children: [run(col, { bold: true, size: 16, color: C_WHITE })],
        })],
      })
    ),
  });

  const dataRows = rows.map((row, rowIdx) => {
    const fill = rowIdx % 2 === 1 ? 'F2F6FA' : C_WHITE;
    return new TableRow({
      children: columns.map((_, colIdx) => {
        // Column 0 = row label text; rest = rating checkbox cells
        const isLabel = colIdx === 0;
        const cellText = isLabel
          ? (row[colIdx] !== undefined ? String(row[colIdx]) : '')
          : '☐';
        return new TableCell({
          width: { size: colW(colIdx), type: WidthType.DXA },
          shading: { fill, type: ShadingType.CLEAR },
          margins: { top: 30, bottom: 30, left: 60, right: 60 },
          borders: allBorders(CELL_BORDER),
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({
            alignment: isLabel ? AlignmentType.LEFT : AlignmentType.CENTER,
            children: [run(cellText, { size: 16 })],
          })],
        });
      }),
    });
  });

  return new Table({
    width: { size: FULL_W, type: WidthType.DXA },
    columnWidths: scaledWidths,
    rows: [headerRow, ...dataRows],
  });
}

// ── Select row (treat like text field) ───────────────────────
const selectRow = (label, options = []) => {
  const all = options.join(' / ');
  return new Table({
    width: { size: FULL_W, type: WidthType.DXA },
    columnWidths: [LABEL_W, VALUE_W],
    rows: [new TableRow({ children: [
      new TableCell({
        width: { size: LABEL_W, type: WidthType.DXA },
        margins: { top: 40, bottom: 40, left: 60, right: 60 },
        borders: noBorders,
        children: [new Paragraph({ children: [run(label, { bold: true, size: 17 })] })],
      }),
      new TableCell({
        width: { size: VALUE_W, type: WidthType.DXA },
        margins: { top: 40, bottom: 40, left: 60, right: 60 },
        borders: { ...noBorders, bottom: BOTTOM_LINE },
        children: [new Paragraph({
          children: [run(all, { size: 15, color: C_GREY })],
        })],
      }),
    ]})],
  });
};

// ── Signature block (3 columns) ───────────────────────────────
function signatureBlock(signers = ['შემავსებელი', 'შემოწმებული', 'დამტკიცებული']) {
  const colW = Math.floor(FULL_W / signers.length);
  const cols = signers.map((s) =>
    new TableCell({
      width: { size: colW, type: WidthType.DXA },
      borders: { ...noBorders, top: { style: BorderStyle.SINGLE, size: 8, color: C_TEXT } },
      margins: { top: 80, bottom: 40, left: 80, right: 80 },
      children: [
        new Paragraph({ spacing: { after: 600 }, children: [run(s + ':', { bold: true, size: 17 })] }),
        new Paragraph({ spacing: { after: 80 }, children: [run('ხელმოწერა: ______________', { size: 15 })] }),
        new Paragraph({ children: [run('თარიღი: ______________', { size: 15 })] }),
      ],
    })
  );

  return [
    emptyPara(120),
    new Table({
      width: { size: FULL_W, type: WidthType.DXA },
      columnWidths: signers.map(() => colW),
      rows: [new TableRow({ children: cols })],
    }),
  ];
}

// ── Footer ────────────────────────────────────────────────────
function buildFooter(code) {
  return new Footer({
    children: [
      new Table({
        width: { size: FULL_W, type: WidthType.DXA },
        columnWidths: [3120, 3120, 3120],
        rows: [new TableRow({ children: [
          new TableCell({
            width: { size: 3120, type: WidthType.DXA },
            borders: { ...noBorders, top: CELL_BORDER },
            margins: { top: 40, left: 0 },
            children: [new Paragraph({ children: [run('კონფ. — შიდა გამოყ.', { size: 13, color: C_GREY })] })],
          }),
          new TableCell({
            width: { size: 3120, type: WidthType.DXA },
            borders: { ...noBorders, top: CELL_BORDER },
            margins: { top: 40 },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [run(code, { size: 13, color: C_GREY })],
            })],
          }),
          new TableCell({
            width: { size: 3120, type: WidthType.DXA },
            borders: { ...noBorders, top: CELL_BORDER },
            margins: { top: 40, right: 0 },
            children: [new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                run('გვ. ', { size: 13, color: C_GREY }),
                new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 13, color: C_GREY }),
                run('/', { size: 13, color: C_GREY }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: 'Arial', size: 13, color: C_GREY }),
              ],
            })],
          }),
        ]})],
      }),
    ],
  });
}

// ── Render a single field ─────────────────────────────────────
function renderField(field) {
  switch (field.type) {
    case 'textarea':
      return textareaRow(field.label);
    case 'yesno':
      return [yesNoRow(field.label)];
    case 'multicheck':
      return multicheckRow(field.label, field.options || []);
    case 'select':
      return [selectRow(field.label, field.options || [])];
    case 'field2':
      return [field2Row(field.label1 || '', field.label2 || '')];
    case 'table':
      return [prebuiltTable(field.columns || [], field.widths || [], field.rows || [])];
    case 'ratingTable':
      return [ratingTable(field.columns || [], field.widths || [], field.rows || [])];
    default:
      return [fieldRow(field.label)];
  }
}

// ── Render a section ──────────────────────────────────────────
function renderSection(section) {
  const items = [];
  const heading = section.label || section.title || '';
  if (heading) items.push(sectionHeading(heading));
  (section.fields || []).forEach(f => {
    items.push(...renderField(f));
  });
  return items;
}

// ── MAIN: generate and download Word doc ──────────────────────
export async function downloadWordDoc({ title, code, fileName, sections = [], signers, isoRef = 'სსტ ISO/IEC 17020' }) {
  const logoData = await fetchLogo();

  const bodyChildren = [
    ...buildDocHeader(logoData, code, isoRef, title),
  ];

  sections.forEach(sec => {
    bodyChildren.push(...renderSection(sec));
    bodyChildren.push(emptyPara(40));
  });

  const sigLabels = signers || ['შემავსებელი', 'შემოწმებული', 'დამტკიცებული'];
  bodyChildren.push(...signatureBlock(sigLabels));

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 720, bottom: 720, left: 1080, right: 1080 },
        },
      },
      footers: { default: buildFooter(code) },
      children: bodyChildren,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = `${fileName}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
