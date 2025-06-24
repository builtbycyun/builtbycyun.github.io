'use client';

import TerminalSection from '../Terminal/TerminalSection';
import TypewriterText from '../Terminal/TypewriterText';
import { personalInfo } from '@/lib/data';
import { createAsciiArt } from '@/lib/utils';

export default function AboutSection() {
  const aboutContent = `
${createAsciiArt('ABOUT')}

Name: ${personalInfo.name}
Title: ${personalInfo.title}
Location: ${personalInfo.location}
Experience: ${personalInfo.yearsOfExperience}+ years

Bio:
${personalInfo.bio}

Specialties:
${personalInfo.specialties.map(specialty => `• ${specialty}`).join('\n')}

Status: Available for new opportunities
Last Updated: ${new Date().toLocaleDateString()}
`;

  return (
    <section id="about" className="min-h-screen flex items-center py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <TerminalSection 
          command="cat about_me.txt"
          delay={500}
        >
          <div className="space-y-4">
            <div className="ascii-art text-terminal-primary mb-6">
              {createAsciiArt('ABOUT')}
            </div>
            
            <div className="space-y-2 text-terminal-white">
              <div className="flex flex-wrap gap-8 mb-6">
                <div>
                  <span className="text-terminal-secondary">Name:</span> {personalInfo.name}
                </div>
                <div>
                  <span className="text-terminal-secondary">Title:</span> {personalInfo.title}
                </div>
                <div>
                  <span className="text-terminal-secondary">Location:</span> {personalInfo.location}
                </div>
                <div>
                  <span className="text-terminal-secondary">Experience:</span> {personalInfo.yearsOfExperience}+ years
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-terminal-primary font-semibold mb-2">Bio:</h3>
                <p className="leading-relaxed">{personalInfo.bio}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-terminal-primary font-semibold mb-2">Specialties:</h3>
                <ul className="space-y-1">
                  {personalInfo.specialties.map((specialty, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-terminal-primary mr-2">•</span>
                      {specialty}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-terminal-secondary">Status:</span>
                  <span className="text-terminal-primary ml-1">Available for new opportunities</span>
                </div>
                <div>
                  <span className="text-terminal-secondary">Last Updated:</span>
                  <span className="text-terminal-white ml-1">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </TerminalSection>
      </div>
    </section>
  );
}