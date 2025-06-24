'use client';

import TerminalSection from '../Terminal/TerminalSection';
import { projects } from '@/lib/data';
import { createAsciiArt } from '@/lib/utils';

export default function ProjectsSection() {
  return (
    <section id="projects" className="min-h-screen flex items-center py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <TerminalSection 
          command="cd projects/ && find . -type f -name '*.md' | head -10"
          delay={400}
        >
          <div className="space-y-8">
            <div className="ascii-art text-terminal-primary mb-6 text-xs">
              {createAsciiArt('PROJECTS')}
            </div>
            
            {projects.map((project, index) => (
              <div key={project.id} className="border border-terminal-dim bg-black/30 p-6 rounded-none">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-terminal-primary text-lg font-semibold">
                      ./{project.name.toLowerCase().replace(/\s+/g, '-')}.md
                    </h3>
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-terminal-secondary hover:text-terminal-white transition-colors"
                        >
                          [GitHub]
                        </a>
                      )}
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-terminal-secondary hover:text-terminal-white transition-colors"
                        >
                          [Live Demo]
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-terminal-white mb-4">
                    <p className="mb-3">{project.description}</p>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-terminal-secondary font-medium mb-2">Tech Stack:</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-2 py-1 bg-terminal-primary/10 border border-terminal-primary/30 text-terminal-primary text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-terminal-secondary font-medium mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {project.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-terminal-white">
                          <span className="text-terminal-primary mr-2 mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-terminal-gray text-sm mt-6">
              <div className="flex items-center gap-4">
                <span>Found {projects.length} project files</span>
                <span>•</span>
                <span>Use 'cat filename.md' to view details</span>
                <span>•</span>
                <span>Use 'git clone [url]' to download</span>
              </div>
            </div>
          </div>
        </TerminalSection>
      </div>
    </section>
  );
}