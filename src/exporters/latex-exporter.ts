import { ResumeData } from '../templates';

export interface LaTeXExporterOptions {
  fontSize?: '10pt' | '11pt' | '12pt';
  fontFamily?: 'helvet' | 'lmodern' | 'times';
  margins?: string;
}

export class LaTeXExporter {
  public static exportToLaTeX(data: ResumeData, options: LaTeXExporterOptions = {}): string {
    const fontSize = options.fontSize || '10pt';
    const margins = options.margins || '0.5in';

    const escapeLaTeX = (str: string = ''): string => {
      return str
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/%/g, '\\%')
        .replace(/\$/g, '\\$')
        .replace(/&/g, '\\&')
        .replace(/#/g, '\\#')
        .replace(/_/g, '\\_')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}');
    };

    const header = `\\documentclass[${fontSize},letterpaper]{article}
\\usepackage[margin=${margins}]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{xcolor}

\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    filecolor=magenta,      
    urlcolor=blue,
}

\\pagestyle{empty}
\\setlist[itemize]{noitemsep, topsep=0pt, leftmargin=1.2em}
\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing*{\\section}{0pt}{10pt}{5pt}

\\begin{document}

% --- HEADER ---
\\begin{center}
    {\\LARGE \\bfseries ${escapeLaTeX(data.personalDetails.name)}}\\\\ \\vspace{4pt}
    ${escapeLaTeX(data.personalDetails.email)} $|$ ${escapeLaTeX(data.personalDetails.phone)} $|$ ${escapeLaTeX(data.personalDetails.location || '')} ${
      data.personalDetails.linkedIn ? `$|$ \\href{${escapeLaTeX(data.personalDetails.linkedIn)}}{LinkedIn}` : ''
    } ${data.personalDetails.gitHub ? `$|$ \\href{${escapeLaTeX(data.personalDetails.gitHub)}}{GitHub}` : ''}
\\end{center}

`;

    let summarySection = '';
    if (data.summary) {
      summarySection = `% --- SUMMARY ---
\\section{Professional Summary}
${escapeLaTeX(data.summary)}

`;
    }

    let experienceSection = '';
    if (data.workExperience && data.workExperience.length > 0) {
      experienceSection = `% --- EXPERIENCE ---
\\section{Work Experience}
`;
      for (const exp of data.workExperience) {
        experienceSection += `\\noindent
\\textbf{${escapeLaTeX(exp.role)}} \\hfill \\textbf{${escapeLaTeX(exp.startDate)} -- ${escapeLaTeX(exp.endDate)}}\\\\
\\textit{${escapeLaTeX(exp.company)}${exp.location ? `, ${escapeLaTeX(exp.location)}` : ''}}
\\begin{itemize}
${(exp.highlights || []).map(h => `    \\item ${escapeLaTeX(h)}`).join('\n')}
\\end{itemize}
\\vspace{6pt}
`;
      }
    }

    let educationSection = '';
    if (data.education && data.education.length > 0) {
      educationSection = `% --- EDUCATION ---
\\section{Education}
`;
      for (const edu of data.education) {
        educationSection += `\\noindent
\\textbf{${escapeLaTeX(edu.degree)}${edu.fieldOfStudy ? ` in ${escapeLaTeX(edu.fieldOfStudy)}` : ''}} \\hfill \\textbf{${escapeLaTeX(edu.graduationYear)}}\\\\
\\textit{${escapeLaTeX(edu.institution)}}
\\vspace{4pt}
`;
      }
    }

    let skillsSection = '';
    if (data.skills && data.skills.length > 0) {
      skillsSection = `% --- SKILLS ---
\\section{Technical Skills}
\\noindent
${data.skills.map(s => escapeLaTeX(s)).join(', ')}

`;
    }

    const footer = `\\end{document}`;

    return header + summarySection + experienceSection + educationSection + skillsSection + footer;
  }
}
