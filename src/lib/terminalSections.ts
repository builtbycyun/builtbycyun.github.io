import { personalInfo, techStack, projects, experience, contactInfo } from './data';
import { createAsciiArt } from './utils';

export interface TerminalSection {
  command: string;
  content: () => string;
}

export const terminalSections: TerminalSection[] = [
  {
    command: 'whoami',
    content: () => `<span class="highlight">${personalInfo.name}</span>
<span class="job-title">${personalInfo.title}</span>
Location: <span class="highlight">${personalInfo.location}</span>
Experience: <span class="years-experience">${personalInfo.yearsOfExperience}+ years</span>
Education: <span class="highlight">B.S. Computer Science, University of Maryland</span>
Status: <span class="status-available">Available for opportunities</span>
Resume: <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" class="contact-info">View Resume (PDF)</a>`
  },
  {
    command: 'cat about_me.txt',
    content: () => `<span class="section-header">${createAsciiArt('ABOUT')}</span>

${personalInfo.bio}

<span class="section-header">Specialties:</span>
${personalInfo.specialties.map(s => `• <span class="tech-name">${s}</span>`).join('\n')}`
  },
  {
    command: 'ls skills/backend',
    content: () => {
      const backend = techStack.find(cat => cat.category === 'backend');
      if (!backend) return 'Directory not found';
      
      const technologies = backend.technologies;
      const itemsPerRow = 4;
      const maxLength = Math.max(...technologies.map(tech => tech.length));
      const columnWidth = maxLength + 2;
      
      let output = '<span class="skills-category">Backend Skills:</span>\n';
      for (let i = 0; i < technologies.length; i += itemsPerRow) {
        const row = technologies.slice(i, i + itemsPerRow);
        output += row.map(tech => `<span class="tech-name">${tech.padEnd(columnWidth)}</span>`).join('') + '\n';
      }
      return output.trim();
    }
  },
  {
    command: 'ls skills/frontend',
    content: () => {
      const frontend = techStack.find(cat => cat.category === 'frontend');
      if (!frontend) return 'Directory not found';
      
      const technologies = frontend.technologies;
      const itemsPerRow = 4;
      const maxLength = Math.max(...technologies.map(tech => tech.length));
      const columnWidth = maxLength + 2;
      
      let output = '<span class="skills-category">Frontend Skills:</span>\n';
      for (let i = 0; i < technologies.length; i += itemsPerRow) {
        const row = technologies.slice(i, i + itemsPerRow);
        output += row.map(tech => `<span class="tech-name">${tech.padEnd(columnWidth)}</span>`).join('') + '\n';
      }
      return output.trim();
    }
  },
  {
    command: 'ls skills/services',
    content: () => {
      const services = techStack.find(cat => cat.category === 'services');
      if (!services) return 'Directory not found';
      
      const technologies = services.technologies;
      const itemsPerRow = 4;
      const maxLength = Math.max(...technologies.map(tech => tech.length));
      const columnWidth = maxLength + 2;
      
      let output = '<span class="skills-category">Cloud & Services:</span>\n';
      for (let i = 0; i < technologies.length; i += itemsPerRow) {
        const row = technologies.slice(i, i + itemsPerRow);
        output += row.map(tech => `<span class="tech-name">${tech.padEnd(columnWidth)}</span>`).join('') + '\n';
      }
      return output.trim();
    }
  },
  {
    command: 'ls skills/languages',
    content: () => {
      const languages = techStack.find(cat => cat.category === 'languages');
      if (!languages) return 'Directory not found';
      
      const technologies = languages.technologies;
      const itemsPerRow = 4;
      const maxLength = Math.max(...technologies.map(tech => tech.length));
      const columnWidth = maxLength + 2;
      
      let output = '<span class="skills-category">Programming Languages:</span>\n';
      for (let i = 0; i < technologies.length; i += itemsPerRow) {
        const row = technologies.slice(i, i + itemsPerRow);
        output += row.map(tech => `<span class="tech-name">${tech.padEnd(columnWidth)}</span>`).join('') + '\n';
      }
      return output.trim();
    }
  },
  {
    command: 'find ./projects -name "*.md" -exec head -20 {} \\;',
    content: () => {
      let output = `<span class="section-header">${createAsciiArt('PROJECTS')}</span>\n\n`;
      projects.forEach(project => {
        output += `==> ./projects/${project.name.toLowerCase().replace(/\s+/g, '-')}.md <==\n`;
        output += `# <span class="project-name">${project.name}</span>\n\n`;
        output += `${project.description}\n\n`;
        output += `## <span class="section-header">Tech Stack</span>\n<span class="tech-name">${project.technologies.join('</span>, <span class="tech-name">')}</span>\n\n`;
        output += `## <span class="section-header">Features</span>\n${project.features.map(f => `• <span class="achievement">${f}</span>`).join('\n')}\n\n`;
        if (project.githubUrl) output += `<span class="contact-info">GitHub: ${project.githubUrl}</span>\n`;
        if (project.liveUrl) output += `<span class="contact-info">Live: ${project.liveUrl}</span>\n`;
        output += '\n' + '─'.repeat(60) + '\n\n';
      });
      return output;
    }
  },
  {
    command: 'tail -f /var/log/career.log',
    content: () => {
      let output = '==> Following career.log <==\n\n';
      experience.forEach(job => {
        output += `[${new Date().toISOString()}] INFO: Career Event\n`;
        output += `Position: <span class="job-title">${job.position}</span>\n`;
        output += `Company: <span class="company-name">${job.company}</span>\n`;
        output += `Duration: <span class="duration">${job.duration}</span>\n`;
        output += `Description: ${job.description}\n\n`;
        output += `<span class="section-header">Achievements:</span>\n${job.achievements.map(a => `+ <span class="achievement">${a}</span>`).join('\n')}\n\n`;
        output += `<span class="section-header">Technologies:</span> <span class="tech-name">${job.technologies.join('</span>, <span class="tech-name">')}</span>\n\n`;
        output += '─'.repeat(60) + '\n\n';
      });
      return output;
    }
  },
  {
    command: 'curl -X GET https://api.portfolio.dev/contact',
    content: () => {
      const response = {
        status: 200,
        message: "OK",
        data: contactInfo,
        timestamp: new Date().toISOString()
      };
      return `<span class="section-header">${createAsciiArt('CONTACT')}</span>

HTTP/1.1 200 OK
Content-Type: application/json
Date: ${new Date().toUTCString()}

{
  &quot;status&quot;: <span class="highlight">200</span>,
  &quot;message&quot;: <span class="highlight">&quot;OK&quot;</span>,
  &quot;data&quot;: {
    &quot;email&quot;: <span class="contact-info">&quot;${contactInfo.email}&quot;</span>,
    &quot;github&quot;: <span class="contact-info">&quot;${contactInfo.github}&quot;</span>,
    &quot;linkedin&quot;: <span class="contact-info">&quot;${contactInfo.linkedin}&quot;</span>,
    &quot;website&quot;: <span class="contact-info">&quot;${contactInfo.website || 'N/A'}&quot;</span>,
    &quot;location&quot;: <span class="highlight">&quot;${contactInfo.location}&quot;</span>
  },
  &quot;timestamp&quot;: &quot;${response.timestamp}&quot;
}

<span class="status-available">Ready to connect! 🚀</span>`;
    }
  }
];