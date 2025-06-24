'use client';

import TerminalSection from '../Terminal/TerminalSection';
import { contactInfo } from '@/lib/data';
import { createAsciiArt } from '@/lib/utils';

export default function ContactSection() {
  const curlResponse = {
    status: 200,
    message: "OK",
    data: contactInfo,
    timestamp: new Date().toISOString(),
    server: "portfolio-api/1.0.0"
  };

  return (
    <section id="contact" className="min-h-screen flex items-center py-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <TerminalSection 
          command="curl -X GET https://api.portfolio.dev/contact -H 'Accept: application/json'"
          delay={800}
        >
          <div className="space-y-6">
            <div className="ascii-art text-terminal-primary mb-6 text-xs">
              {createAsciiArt('CONTACT')}
            </div>
            
            <div className="bg-black/30 border border-terminal-dim p-6">
              <div className="mb-4">
                <div className="flex items-center gap-4 text-sm mb-2">
                  <span className="text-terminal-secondary">HTTP/1.1</span>
                  <span className="text-terminal-primary">{curlResponse.status}</span>
                  <span className="text-terminal-white">{curlResponse.message}</span>
                </div>
                <div className="text-terminal-gray text-sm mb-4">
                  <div>Content-Type: application/json</div>
                  <div>Server: {curlResponse.server}</div>
                  <div>Date: {curlResponse.timestamp}</div>
                </div>
              </div>

              <div className="font-mono text-sm">
                <div className="text-terminal-white mb-6">
                  <div className="mb-4">
                    <span className="text-terminal-secondary">&#123;</span>
                  </div>
                  
                  <div className="ml-4 space-y-2">
                    <div>
                      <span className="text-terminal-secondary">"status":</span> 
                      <span className="text-terminal-primary ml-2">{curlResponse.status}</span><span className="text-terminal-white">,</span>
                    </div>
                    
                    <div>
                      <span className="text-terminal-secondary">"message":</span> 
                      <span className="text-terminal-white ml-2">"{curlResponse.message}"</span><span className="text-terminal-white">,</span>
                    </div>
                    
                    <div>
                      <span className="text-terminal-secondary">"data":</span> 
                      <span className="text-terminal-secondary ml-2">&#123;</span>
                    </div>
                    
                    <div className="ml-4 space-y-2">
                      <div>
                        <span className="text-terminal-secondary">"email":</span> 
                        <span className="text-terminal-white ml-2">
                          "<a href={`mailto:${contactInfo.email}`} className="hover:text-terminal-primary transition-colors">
                            {contactInfo.email}
                          </a>"
                        </span><span className="text-terminal-white">,</span>
                      </div>
                      
                      <div>
                        <span className="text-terminal-secondary">"github":</span> 
                        <span className="text-terminal-white ml-2">
                          "<a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="hover:text-terminal-primary transition-colors">
                            {contactInfo.github}
                          </a>"
                        </span><span className="text-terminal-white">,</span>
                      </div>
                      
                      <div>
                        <span className="text-terminal-secondary">"linkedin":</span> 
                        <span className="text-terminal-white ml-2">
                          "<a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-terminal-primary transition-colors">
                            {contactInfo.linkedin}
                          </a>"
                        </span><span className="text-terminal-white">,</span>
                      </div>
                      
                      {contactInfo.website && (
                        <div>
                          <span className="text-terminal-secondary">"website":</span> 
                          <span className="text-terminal-white ml-2">
                            "<a href={contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-terminal-primary transition-colors">
                              {contactInfo.website}
                            </a>"
                          </span><span className="text-terminal-white">,</span>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-terminal-secondary">"location":</span> 
                        <span className="text-terminal-white ml-2">"{contactInfo.location}"</span>
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-terminal-secondary ml-4">&#125;</span><span className="text-terminal-white">,</span>
                    </div>
                    
                    <div>
                      <span className="text-terminal-secondary">"timestamp":</span> 
                      <span className="text-terminal-white ml-2">"{curlResponse.timestamp}"</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-terminal-secondary">&#125;</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/20 border border-terminal-dim/50 p-4">
              <h4 className="text-terminal-primary font-medium mb-3">Let's Connect!</h4>
              <p className="text-terminal-white mb-4">
                I'm always interested in discussing new opportunities, collaborating on projects, 
                or just having a chat about technology and development.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <span className="text-terminal-secondary mr-2">📧</span>
                  <span className="text-terminal-white">Email for inquiries</span>
                </div>
                <div className="flex items-center">
                  <span className="text-terminal-secondary mr-2">🔗</span>
                  <span className="text-terminal-white">LinkedIn for networking</span>
                </div>
                <div className="flex items-center">
                  <span className="text-terminal-secondary mr-2">⚡</span>
                  <span className="text-terminal-white">GitHub for code</span>
                </div>
                <div className="flex items-center">
                  <span className="text-terminal-secondary mr-2">🌐</span>
                  <span className="text-terminal-white">Portfolio for projects</span>
                </div>
              </div>
            </div>
            
            <div className="text-terminal-gray text-sm">
              <div className="flex items-center gap-2">
                <span className="text-terminal-primary">$</span>
                <span>Connection established successfully</span>
                <span>•</span>
                <span>Response time: &lt;100ms</span>
              </div>
            </div>
          </div>
        </TerminalSection>
      </div>
    </section>
  );
}