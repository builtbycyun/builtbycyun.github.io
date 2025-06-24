'use client';

import TerminalSection from '../Terminal/TerminalSection';
import { experience } from '@/lib/data';
import { getCurrentTimestamp } from '@/lib/utils';

export default function ExperienceSection() {
  return (
    <section id="experience" className="min-h-screen flex items-center py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <TerminalSection 
          command="tail -f /var/log/career.log"
          delay={600}
        >
          <div className="space-y-6">
            <div className="text-terminal-gray text-sm mb-6">
              <div>Monitoring career progression log file...</div>
              <div>Press Ctrl+C to stop following log</div>
              <div className="border-b border-terminal-dim my-2"></div>
            </div>
            
            {experience.map((job, index) => (
              <div key={job.id} className="bg-black/20 border-l-4 border-terminal-primary pl-6 py-4">
                <div className="mb-3">
                  <div className="flex items-center gap-2 text-sm text-terminal-gray mb-1">
                    <span>[{getCurrentTimestamp()}]</span>
                    <span className="text-terminal-secondary">INFO</span>
                    <span>Career Event</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="text-terminal-primary text-lg font-semibold">
                      {job.position}
                    </h3>
                    <span className="text-terminal-secondary">
                      {job.duration}
                    </span>
                  </div>
                  
                  <div className="text-terminal-white font-medium mb-3">
                    @ {job.company}
                  </div>
                </div>

                <div className="text-terminal-white mb-4">
                  <p>{job.description}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-terminal-secondary font-medium mb-2">Key Achievements:</h4>
                  <ul className="space-y-1">
                    {job.achievements.map((achievement, achievementIndex) => (
                      <li key={achievementIndex} className="flex items-start text-terminal-white">
                        <span className="text-terminal-primary mr-2 mt-1">+</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="text-terminal-secondary font-medium mb-2">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-2 py-1 bg-terminal-secondary/10 border border-terminal-secondary/30 text-terminal-secondary text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {index < experience.length - 1 && (
                  <div className="border-b border-terminal-dim mt-6"></div>
                )}
              </div>
            ))}
            
            <div className="text-terminal-gray text-sm mt-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-terminal-primary animate-pulse rounded-full"></div>
              <span>Real-time career monitoring active</span>
              <span>•</span>
              <span>Last updated: {getCurrentTimestamp()}</span>
            </div>
          </div>
        </TerminalSection>
      </div>
    </section>
  );
}