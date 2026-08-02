import { ResumeData } from '../templates';

export interface TypstExporterOptions {
  font?: string;
  paper?: string;
}

export class TypstExporter {
  public static exportToTypst(data: ResumeData, options: TypstExporterOptions = {}): string {
    const font = options.font || 'Liberation Sans';
    const paper = options.paper || 'us-letter';

    const escapeTypst = (str: string = ''): string => {
      return str
        .replace(/\\/g, '\\\\')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\*/g, '\\*')
        .replace(/\_/g, '\\_')
        .replace(/\`/g, '\\`')
        .replace(/\$/g, '\\$');
    };

    let doc = `#set page(
  paper: "${paper}",
  margin: (x: 1.5cm, y: 1.5cm)
)
#set text(
  font: "${font}",
  size: 10pt,
  lang: "en"
)

#align(center)[
  #text(size: 18pt, weight: "bold")[${escapeTypst(data.personalDetails.name)}] \
  #v(2pt)
  #text(size: 9pt, fill: rgb("#444444"))[
    ${escapeTypst(data.personalDetails.email)} | ${escapeTypst(data.personalDetails.phone)} ${
      data.personalDetails.location ? `| ${escapeTypst(data.personalDetails.location)}` : ''
    }
  ]
]

#v(8pt)
`;

    if (data.summary) {
      doc += `== Professional Summary
#line(length: 100%, stroke: 0.5pt + rgb("#cccccc"))
${escapeTypst(data.summary)}

#v(8pt)
`;
    }

    if (data.workExperience && data.workExperience.length > 0) {
      doc += `== Work Experience
#line(length: 100%, stroke: 0.5pt + rgb("#cccccc"))

`;
      for (const exp of data.workExperience) {
        doc += `*${escapeTypst(exp.role)}* - _${escapeTypst(exp.company)}_ #h(1fr) *${escapeTypst(exp.startDate)} - ${escapeTypst(exp.endDate)}* \
${(exp.highlights || []).map(h => `- ${escapeTypst(h)}`).join('\n')}

#v(6pt)
`;
      }
    }

    if (data.education && data.education.length > 0) {
      doc += `== Education
#line(length: 100%, stroke: 0.5pt + rgb("#cccccc"))

`;
      for (const edu of data.education) {
        doc += `*${escapeTypst(edu.degree)}${edu.fieldOfStudy ? ` in ${escapeTypst(edu.fieldOfStudy)}` : ''}* - _${escapeTypst(edu.institution)}_ #h(1fr) *${escapeTypst(edu.graduationYear)}* \

`;
      }
    }

    if (data.skills && data.skills.length > 0) {
      doc += `== Technical Skills
#line(length: 100%, stroke: 0.5pt + rgb("#cccccc"))
${data.skills.map(s => escapeTypst(s)).join(' • ')}
`;
    }

    return doc;
  }
}
