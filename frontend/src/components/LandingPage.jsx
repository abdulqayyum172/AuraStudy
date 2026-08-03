import React from 'react';
import { DashboardIcon, CardsIcon, TimerIcon, NotesIcon, AIIcon, LearnIcon, CurriculumIcon, QuizIcon } from '../data/icons.jsx';
import logoImage from '../assets/image(1).png';

const LandingPage = ({ landingScrolled, setAuthMode, setShowAuth }) => {
  return (
    <div className="landing-page">
      <nav className={`landing-nav${landingScrolled ? ' landing-nav-scrolled' : ''}`}>
        <button className="landing-brand" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="landing-brand-mark">
            <img src={logoImage} alt="" aria-hidden="true" />
          </span>
          <span>AuraStudy</span>
        </button>
        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#curriculum">Curriculum</a>
          <a href="#workflow">How It Works</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className="landing-nav-actions">
          <button className="landing-nav-cta-ghost" type="button" onClick={() => { setAuthMode('login'); setShowAuth(true); }}>
            Sign in
          </button>
          <button className="landing-nav-cta" type="button" onClick={() => { setAuthMode('signup'); setShowAuth(true); }}>
            Get Started Free
          </button>
        </div>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-bg-glow"></div>
          <div className="landing-hero-content">
            <span className="landing-badge" data-reveal>
              <span className="landing-badge-dot"></span>
              Now covering WAEC &amp; Nigerian curriculum
            </span>
            <h1 className="landing-hero-title" data-reveal>
              Study Smarter.<br />
              <span className="landing-hero-accent">Level Up Your Learning.</span>
            </h1>
            <p className="landing-hero-copy" data-reveal>
              From Basic 1 to University, and for developers learning to code &mdash; AuraStudy is your AI-powered study companion that adapts to your exact level. Ask questions, generate flashcards, take quizzes, and retain more with spaced repetition.
            </p>
            <div className="landing-hero-actions" data-reveal>
              <button className="landing-primary-btn" type="button" onClick={() => { setAuthMode('signup'); setShowAuth(true); }}>
                Start Learning Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
              <button className="landing-secondary-btn" type="button" onClick={() => { setAuthMode('login'); setShowAuth(true); }}>
                Sign in to Account
              </button>
            </div>
            <div className="landing-hero-proof" data-reveal>
              <span className="landing-hero-proof-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Free forever
              </span>
              <span className="landing-hero-proof-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                No credit card
              </span>
              <span className="landing-hero-proof-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                All school levels
              </span>
            </div>
          </div>
          <div className="landing-hero-visual" data-reveal>
            <div className="landing-hero-card-stack">
              <div className="landing-float-card landing-float-card-1">
                <span className="landing-float-icon">
                  <AIIcon />
                </span>
                <div>
                  <strong>Ask Aura anything</strong>
                  <p>"Explain Newton's laws with examples"</p>
                </div>
              </div>
              <div className="landing-float-card landing-float-card-2">
                <span className="landing-float-icon">
                  <CardsIcon />
                </span>
                <div>
                  <strong>Auto-generate flashcards</strong>
                  <p>SM-2 spaced repetition built in</p>
                </div>
              </div>
              <div className="landing-float-card landing-float-card-3">
                <span className="landing-float-icon">
                  <QuizIcon />
                </span>
                <div>
                  <strong>Test your knowledge</strong>
                  <p>AI quizzes matched to your level</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section landing-proof" id="results">
          <div className="landing-proof-grid">
            <div data-reveal style={{ transitionDelay: '0ms' }}>
              <span className="landing-metric-num">6+</span>
              <span className="landing-metric-label">School Levels Covered</span>
              <p>Basic, JSS, SSS, University &amp; Developer</p>
            </div>
            <div data-reveal style={{ transitionDelay: '80ms' }}>
              <span className="landing-metric-num">50+</span>
              <span className="landing-metric-label">Subjects &amp; Topics</span>
              <p>WAEC curriculum, university courses, coding</p>
            </div>
            <div data-reveal style={{ transitionDelay: '160ms' }}>
              <span className="landing-metric-num">24/7</span>
              <span className="landing-metric-label">AI Tutor Access</span>
              <p>Your personal tutor, available anytime</p>
            </div>
            <div data-reveal style={{ transitionDelay: '240ms' }}>
              <span className="landing-metric-num">SM-2</span>
              <span className="landing-metric-label">Spaced Repetition</span>
              <p>Science-backed memory retention system</p>
            </div>
          </div>
        </section>

        <section className="landing-section" id="features">
          <div className="landing-section-heading" data-reveal>
            <span className="landing-eyebrow">Features</span>
            <h2>Everything you need to ace your studies</h2>
            <p className="landing-section-sub">One platform to learn, practice, and remember &mdash; tailored to your exact academic level.</p>
          </div>
          <div className="landing-feature-grid">
            <article className="landing-feature-card" data-reveal style={{ transitionDelay: '0ms' }}>
              <div className="landing-feature-icon-wrap">
                <AIIcon />
              </div>
              <h3>AI Study Assistant</h3>
              <p>Ask any question and get clear, level-adapted explanations with examples and practice problems.</p>
            </article>
            <article className="landing-feature-card" data-reveal style={{ transitionDelay: '80ms' }}>
              <div className="landing-feature-icon-wrap">
                <CardsIcon />
              </div>
              <h3>Smart Flashcards</h3>
              <p>Auto-generate flashcards from notes or topics. Review with SM-2 spaced repetition to never forget.</p>
            </article>
            <article className="landing-feature-card" data-reveal style={{ transitionDelay: '160ms' }}>
              <div className="landing-feature-icon-wrap">
                <NotesIcon />
              </div>
              <h3>Study Notes &amp; Summaries</h3>
              <p>Write, organize, and let AI turn dense material into concise summaries and key takeaways.</p>
            </article>
            <article className="landing-feature-card" data-reveal style={{ transitionDelay: '240ms' }}>
              <div className="landing-feature-icon-wrap">
                <QuizIcon />
              </div>
              <h3>AI Quizzes</h3>
              <p>Test yourself on any topic with AI-generated questions and track your mastery over time.</p>
            </article>
            <article className="landing-feature-card" data-reveal style={{ transitionDelay: '320ms' }}>
              <div className="landing-feature-icon-wrap">
                <TimerIcon />
              </div>
              <h3>Pomodoro Timer</h3>
              <p>Stay focused with timed study sessions and track your productive hours across subjects.</p>
            </article>
            <article className="landing-feature-card" data-reveal style={{ transitionDelay: '400ms' }}>
              <div className="landing-feature-icon-wrap">
                <CurriculumIcon />
              </div>
              <h3>Full Curriculum Browser</h3>
              <p>Browse the complete Nigerian curriculum by level, stream, and subject &mdash; every topic at your fingertips.</p>
            </article>
          </div>
        </section>

        <section className="landing-section landing-curriculum-preview" id="curriculum" data-reveal>
          <div className="landing-section-heading">
            <span className="landing-eyebrow">Curriculum</span>
            <h2>Built for the Nigerian education system</h2>
            <p className="landing-section-sub">From primary school to university &mdash; fully aligned with WAEC, NECO, and JAMB standards.</p>
          </div>
          <div className="landing-curriculum-levels">
            <div className="landing-curriculum-level-card" style={{ '--lc': '#22c55e' }} data-reveal>
              <div className="landing-clc-header">
                <span className="landing-clc-icon">📚</span>
                <h3>Basic (Primary)</h3>
              </div>
              <p>Basic 1 through Basic 6</p>
              <ul>
                <li>Mathematics</li>
                <li>English Language</li>
                <li>Science &amp; Technology</li>
                <li>Social Studies</li>
              </ul>
            </div>
            <div className="landing-curriculum-level-card" style={{ '--lc': '#3b82f6' }} data-reveal>
              <div className="landing-clc-header">
                <span className="landing-clc-icon">🏫</span>
                <h3>JSS (Junior Secondary)</h3>
              </div>
              <p>JSS 1 through JSS 3</p>
              <ul>
                <li>Mathematics</li>
                <li>English Language</li>
                <li>Basic Science &amp; Tech</li>
                <li>Civic Education</li>
              </ul>
            </div>
            <div className="landing-curriculum-level-card" style={{ '--lc': '#f59e0b' }} data-reveal>
              <div className="landing-clc-header">
                <span className="landing-clc-icon">🎓</span>
                <h3>SSS (Senior Secondary)</h3>
              </div>
              <p>Science, Art &amp; Commercial streams</p>
              <ul>
                <li>Physics, Chemistry, Biology</li>
                <li>Literature, Government</li>
                <li>Accounting, Commerce</li>
                <li>WAEC &amp; JAMB prep</li>
              </ul>
            </div>
            <div className="landing-curriculum-level-card" style={{ '--lc': '#a855f7' }} data-reveal>
              <div className="landing-clc-header">
                <span className="landing-clc-icon">🏛️</span>
                <h3>University</h3>
              </div>
              <p>20+ departments &amp; courses</p>
              <ul>
                <li>Computer Science</li>
                <li>Medicine &amp; Surgery</li>
                <li>Law, Engineering</li>
                <li>Business &amp; Management</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="landing-section landing-workflow" id="workflow">
          <div className="landing-section-heading" data-reveal>
            <span className="landing-eyebrow">How it works</span>
            <h2>Start studying in three simple steps</h2>
          </div>
          <div className="landing-steps">
            <div className="landing-step" data-reveal style={{ transitionDelay: '0ms' }}>
              <div className="landing-step-num">01</div>
              <h3>Pick your level &amp; topic</h3>
              <p>Select your class level, stream, and any subject or topic you want to study.</p>
            </div>
            <div className="landing-step-connector" data-reveal></div>
            <div className="landing-step" data-reveal style={{ transitionDelay: '110ms' }}>
              <div className="landing-step-num">02</div>
              <h3>Learn with AI</h3>
              <p>Get clear explanations, examples, and walkthroughs from your personal AI tutor.</p>
            </div>
            <div className="landing-step-connector" data-reveal></div>
            <div className="landing-step" data-reveal style={{ transitionDelay: '220ms' }}>
              <div className="landing-step-num">03</div>
              <h3>Practice &amp; retain</h3>
              <p>Generate flashcards and quizzes, then review with spaced repetition to lock it in.</p>
            </div>
          </div>
        </section>

        <section className="landing-section landing-testimonials" id="testimonials">
          <div className="landing-section-heading" data-reveal>
            <span className="landing-eyebrow">Testimonials</span>
            <h2>Students love AuraStudy</h2>
            <p className="landing-section-sub">Join students across Nigeria who are studying smarter, not harder.</p>
          </div>
          <div className="landing-testimonial-grid">
            <div className="landing-testimonial-card" data-reveal style={{ transitionDelay: '0ms' }}>
              <div className="landing-testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p>"AuraStudy helped me understand organic chemistry better than my textbook. The AI explains things exactly at my SSS 3 level."</p>
              <div className="landing-testimonial-author">
                <div className="landing-testimonial-avatar">A</div>
                <div>
                  <strong>Adaeze N.</strong>
                  <span>SSS 3 &bull; Science</span>
                </div>
              </div>
            </div>
            <div className="landing-testimonial-card" data-reveal style={{ transitionDelay: '100ms' }}>
              <div className="landing-testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p>"The flashcards are a game-changer. I use them during breaks and my scores in Mathematics have improved a lot."</p>
              <div className="landing-testimonial-author">
                <div className="landing-testimonial-avatar">O</div>
                <div>
                  <strong>Oluwaseun A.</strong>
                  <span>JSS 2 &bull; Junior Secondary</span>
                </div>
              </div>
            </div>
            <div className="landing-testimonial-card" data-reveal style={{ transitionDelay: '200ms' }}>
              <div className="landing-testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p>"As a final year CS student, I use it to review data structures and algorithms. The AI-generated quizzes really test your understanding."</p>
              <div className="landing-testimonial-author">
                <div className="landing-testimonial-avatar">I</div>
                <div>
                  <strong>Ibrahim K.</strong>
                  <span>University &bull; Computer Science</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section landing-faq" id="faq">
          <div className="landing-section-heading" data-reveal>
            <span className="landing-eyebrow">FAQ</span>
            <h2>Frequently asked questions</h2>
          </div>
          <div className="landing-faq-list">
            {[
              { q: 'Is AuraStudy really free?', a: 'Yes! AuraStudy is completely free to use. No hidden fees, no premium tier, no credit card required.' },
              { q: 'What school levels does it support?', a: 'We cover Basic 1-6 (Primary), JSS 1-3 (Junior Secondary), SSS 1-3 (Senior Secondary with Science/Art/Commercial streams), and University level across 20+ departments and courses.' },
              { q: 'How does the AI tutor work?', a: 'Our AI tutor adapts to your class level, stream, and subjects. When you ask a question, it provides explanations, examples, and step-by-step solutions tailored to your exact academic level.' },
              { q: 'Is it aligned with the Nigerian curriculum?', a: 'Absolutely. Our curriculum data is aligned with the WAEC, NECO, and JAMB standards. We cover all core subjects and elective courses across every level.' },
              { q: 'Can I use it on my phone?', a: 'Yes! AuraStudy works on any device with a web browser — phones, tablets, and desktops. It is fully responsive and optimized for mobile use.' },
            ].map((item, i) => (
              <details key={i} className="landing-faq-item" data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="landing-final-cta" data-reveal>
          <div className="landing-final-cta-content">
            <h2>Ready to study smarter?</h2>
            <p>Join thousands of students across Nigeria using AI to learn faster and remember more.</p>
          </div>
          <button className="landing-primary-btn landing-primary-btn-lg" type="button" onClick={() => { setAuthMode('signup'); setShowAuth(true); }}>
            Get Started &mdash; It's Free
          </button>
        </section>

        <footer className="landing-footer">
          <div className="landing-footer-inner">
            <div className="landing-footer-brand">
              <span className="landing-brand-mark">
                <img src={logoImage} alt="" aria-hidden="true" />
              </span>
              <span>AuraStudy</span>
            </div>
            <p className="landing-footer-copy">&copy; {new Date().getFullYear()} AuraStudy. AI-Powered Learning for Every Student.</p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
