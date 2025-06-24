'use client';

import TerminalSection from '../Terminal/TerminalSection';
import { techStack } from '@/lib/data';

export default function TechStackSection() {
  return (
    <section id="tech-stack" className="min-h-screen flex items-center py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <TerminalSection 
          command="ls -la skills/"
          delay={300}
        >
          <div className="space-y-6">
            <div className="text-terminal-white">
              <div className="mb-4">
                <span className="text-terminal-secondary">total</span> {techStack.reduce((acc, category) => acc + category.technologies.length, 0)}
              </div>
              
              {techStack.map((category, categoryIndex) => (
                <div key={category.category} className="mb-6">
                  <div className="flex items-center mb-3">
                    <span className="text-terminal-primary">drwxr-xr-x</span>
                    <span className="ml-4 text-terminal-secondary">{category.technologies.length} items</span>
                    <span className="ml-4 text-terminal-white">{new Date().toLocaleDateString()}</span>
                    <span className="ml-4 text-terminal-secondary font-semibold">{category.category}/</span>
                  </div>
                  
                  <div className="ml-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {category.technologies.map((tech, techIndex) => (
                      <div key={tech} className="flex items-center">
                        <span className="text-terminal-primary">-rwxr-xr-x</span>
                        <span className="ml-2 text-terminal-white hover:text-terminal-secondary transition-colors cursor-pointer">
                          {tech}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-terminal-dim pt-4">
              <div className="flex items-center text-sm text-terminal-gray">
                <span className="text-terminal-secondary">Legend:</span>
                <span className="ml-2">d = directory,</span>
                <span className="ml-1">- = file,</span>
                <span className="ml-1">rwx = read/write/execute permissions</span>
              </div>
            </div>
          </div>
        </TerminalSection>
      </div>
    </section>
  );
}