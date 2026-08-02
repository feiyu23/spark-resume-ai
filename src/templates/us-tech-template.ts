import { ResumeData } from './australian-template';

export class USTechTemplate {
  public static renderMarkdown(data: ResumeData): string {
    let md = `# ${data.personalDetails.name}\n`;
    md += `${data.personalDetails.location || 'San Francisco, CA'} | ${data.personalDetails.phone} | ${data.personalDetails.email}`;
    if (data.personalDetails.linkedIn) md += ` | [LinkedIn](${data.personalDetails.linkedIn})`;
    if (data.personalDetails.gitHub) md += ` | [GitHub](${data.personalDetails.gitHub})`;
    md += `\n\n---\n\n`;

    if (data.summary) {
      md += `## SUMMARY\n${data.summary}\n\n`;
    }

    if (data.skills && data.skills.length > 0) {
      md += `## TECHNICAL SKILLS\n`;
      md += `**Core Competencies:** ${data.skills.join(', ')}\n\n`;
    }

    if (data.workExperience && data.workExperience.length > 0) {
      md += `## PROFESSIONAL EXPERIENCE\n\n`;
      for (const exp of data.workExperience) {
        md += `### ${exp.role} | **${exp.company}** | ${exp.location || 'USA'}\n`;
        md += `*${exp.startDate} - ${exp.endDate}*\n\n`;
        for (const h of exp.highlights || []) {
          md += `- ${h}\n`;
        }
        md += `\n`;
      }
    }

    if (data.education && data.education.length > 0) {
      md += `## EDUCATION\n\n`;
      for (const edu of data.education) {
        md += `**${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}** - ${edu.institution} (${edu.graduationYear})\n`;
      }
    }

    return md;
  }
}
