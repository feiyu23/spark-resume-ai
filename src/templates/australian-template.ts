/**
 * Australian Resume Template
 * Formats resume data into an ATS-friendly, AU-standard Markdown resume.
 */

export interface PersonalDetails {
  name: string;
  email: string;
  phone: string;
  location: string; // e.g. "Sydney, NSW"
  linkedIn?: string;
  gitHub?: string;
  portfolio?: string;
  workingRights?: string; // e.g. "Australian Citizen", "Permanent Resident" (Highly valued for candidate pre-screening in AU)
}

export interface WorkExperience {
  company: string;
  location?: string;
  role: string;
  startDate: string; // e.g. "Jan 2022"
  endDate: string; // e.g. "Present" or "Dec 2023"
  highlights: string[]; // Achievements and responsibilities as bullet points
}

export interface Education {
  institution: string;
  location?: string;
  degree: string;
  fieldOfStudy?: string;
  graduationYear: string;
}

export interface Certification {
  name: string;
  issuer: string;
  year?: string;
}

export interface ResumeData {
  personalDetails: PersonalDetails;
  summary: string;
  skills: string[];
  workExperience: WorkExperience[];
  education: Education[];
  certifications?: Certification[];
}

export class AustralianTemplate {
  /**
   * Format structured resume data into an AU-standard Markdown document
   */
  format(data: ResumeData): string {
    const lines: string[] = [];

    // Name Header
    lines.push(`# ${data.personalDetails.name.toUpperCase()}`);
    
    // Contact Info (no photo, birth date, or marital status to prevent bias, as per AU guidelines)
    const contactInfo = [
      data.personalDetails.email,
      data.personalDetails.phone,
      data.personalDetails.location
    ];
    
    if (data.personalDetails.workingRights) {
      contactInfo.push(`Work Status: ${data.personalDetails.workingRights}`);
    }
    
    lines.push(contactInfo.join('  |  '));
    
    // Links
    const links: string[] = [];
    if (data.personalDetails.linkedIn) {
      links.push(`LinkedIn: ${data.personalDetails.linkedIn}`);
    }
    if (data.personalDetails.gitHub) {
      links.push(`GitHub: ${data.personalDetails.gitHub}`);
    }
    if (data.personalDetails.portfolio) {
      links.push(`Portfolio: ${data.personalDetails.portfolio}`);
    }
    if (links.length > 0) {
      lines.push(links.join('  |  '));
    }
    
    lines.push('');
    lines.push('---');
    lines.push('');

    // Professional Summary
    lines.push('## PROFESSIONAL SUMMARY');
    lines.push(data.summary);
    lines.push('');

    // Key Skills
    lines.push('## KEY SKILLS');
    lines.push(data.skills.map(skill => `* ${skill}`).join('\n'));
    lines.push('');

    // Professional Experience
    lines.push('## PROFESSIONAL EXPERIENCE');
    data.workExperience.forEach(exp => {
      const expHeader = `### ${exp.role} | ${exp.company}`;
      const expDate = `${exp.startDate} – ${exp.endDate}`;
      const expLocation = exp.location ? ` | ${exp.location}` : '';
      
      lines.push(expHeader);
      lines.push(`*${expDate}${expLocation}*`);
      lines.push('');
      exp.highlights.forEach(highlight => {
        lines.push(`* ${highlight}`);
      });
      lines.push('');
    });

    // Education
    lines.push('## EDUCATION');
    data.education.forEach(edu => {
      const field = edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : '';
      const eduHeader = `### ${edu.degree}${field}`;
      const eduDetail = `${edu.institution} (${edu.graduationYear})`;
      const eduLocation = edu.location ? ` | ${edu.location}` : '';
      
      lines.push(eduHeader);
      lines.push(`*${eduDetail}${eduLocation}*`);
      lines.push('');
    });

    // Certifications (if relevant)
    if (data.certifications && data.certifications.length > 0) {
      lines.push('## CERTIFICATIONS');
      data.certifications.forEach(cert => {
        const certYear = cert.year ? ` (${cert.year})` : '';
        lines.push(`* **${cert.name}** – ${cert.issuer}${certYear}`);
      });
      lines.push('');
    }

    return lines.join('\n').trim() + '\n';
  }
}
