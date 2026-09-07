import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skillCategories = [
  {
    title: 'SIEM Monitoring',
    desc: 'Monitoring and analyzing security alerts, logs, and events across SIEM platforms to identify suspicious activity and potential security incidents.',
    tag: 'SECURITY MONITORING',
    skills: ['Splunk', 'LogRhythm', 'Microsoft Sentinel', 'Event Analysis'],
  },
  {
    title: 'EDR & Threat Detection',
    desc: 'Investigating endpoint alerts, analyzing process activity, identifying indicators of compromise, and supporting threat detection and response.',
    tag: 'ENDPOINT SECURITY',
    skills: ['CrowdStrike Falcon', 'Microsoft Defender', 'SentinelOne', 'IOC Analysis'],
  },
  {
    title: 'Incident Investigation',
    desc: 'Performing alert triage, event correlation, root-cause analysis, containment support, escalation, and remediation tracking.',
    tag: 'INCIDENT RESPONSE',
    skills: ['Alert Triage', 'Threat Hunting', 'Event Correlation', 'Root Cause Analysis'],
  },
  {
    title: 'AWS Cloud Security',
    desc: 'Developing and applying cloud security knowledge across AWS services, identity management, network controls, and security monitoring.',
    tag: 'CLOUD SECURITY',
    skills: ['IAM', 'EC2', 'VPC', 'Security Groups', 'CloudTrail'],
  },
  {
    title: 'Security Assessment',
    desc: 'Building hands-on knowledge in vulnerability assessment and ethical hacking through security testing, reconnaissance, and vulnerability analysis.',
    tag: 'SECURITY TESTING',
    skills: ['Nessus', 'Nmap', 'Burp Suite', 'Nikto', 'Gobuster'],
  },
  {
    title: 'Security Frameworks',
    desc: 'Using industry frameworks and security concepts to improve investigation, detection, reporting, and security control coverage.',
    tag: 'SECURITY KNOWLEDGE',
    skills: ['MITRE ATT&CK', 'NIST', 'OWASP Top 10', 'YARA', 'Threat Intelligence'],
  },
];

const Skills = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const bgRefs = useRef([]);
  const textRefs = useRef([]);

  const handleScroll = (e) => {
    if (window.innerWidth >= 769) return;

    const container = e.target;
    const center = container.scrollLeft + container.offsetWidth / 2;

    let activeIdx = 0;
    let minDiff = Infinity;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const diff = Math.abs(cardCenter - center);

      if (diff < minDiff) {
        minDiff = diff;
        activeIdx = i;
      }
    });

    cardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.to(card, {
          scale: i === activeIdx ? 1 : 0.9,
          duration: 0.4,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    });

    bgRefs.current.forEach((bg, i) => {
      if (bg) {
        gsap.to(bg, {
          opacity: i === activeIdx ? 1 : 0,
          duration: 0.4,
          overwrite: 'auto',
        });
      }
    });

    textRefs.current.forEach((txt, i) => {
      if (txt) {
        gsap.to(txt, {
          opacity: i === activeIdx ? 1 : 0,
          duration: 0.4,
          overwrite: 'auto',
        });
      }
    });
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 769px)', () => {
        const updateCards = (progress) => {
          cardsRef.current.forEach((card, i) => {
            if (!card) return;

            const offset = i - progress;

            const radius = 1800;
            const angleSpread = 18;

            const angle = offset * angleSpread;
            const rad = (angle * Math.PI) / 180;

            const x = Math.sin(rad) * radius;
            const y = radius - Math.cos(rad) * radius;
            const z = -Math.abs(offset) * 50;

            const scale = Math.max(0.4, 1 - Math.abs(offset) * 0.15);
            const opacity = Math.max(0.1, 1 - Math.abs(offset) * 0.3);
            const zIndex = Math.round(100 - Math.abs(offset) * 10);

            gsap.set(card, {
              x,
              y,
              z,
              scale,
              rotationZ: angle,
              rotationY: 0,
              opacity,
              zIndex,
            });
          });

          bgRefs.current.forEach((bg, i) => {
            if (!bg) return;

            const itemOpacity = Math.max(0, 1 - Math.abs(i - progress));
            gsap.set(bg, { opacity: itemOpacity });

            if (textRefs.current[i]) {
              gsap.set(textRefs.current[i], {
                opacity: itemOpacity,
              });
            }
          });
        };

        updateCards(0);

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=500%',
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress * (skillCategories.length - 1);
            updateCards(progress);
          },
        });
      });

      mm.add('(max-width: 768px)', () => {
        cardsRef.current.forEach((card, i) => {
          if (card) {
            gsap.set(card, {
              clearProps: 'x,y,z,rotation,scale,opacity,position',
            });

            gsap.set(card, {
              scale: i === 0 ? 1 : 0.9,
            });
          }
        });

        bgRefs.current.forEach((bg, i) => {
          if (bg) {
            gsap.set(bg, {
              clearProps: 'all',
              opacity: i === 0 ? 1 : 0,
            });
          }
        });

        textRefs.current.forEach((txt, i) => {
          if (txt) {
            gsap.set(txt, {
              clearProps: 'all',
              opacity: i === 0 ? 1 : 0,
            });
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full h-screen bg-[#0b0b0b] text-white overflow-hidden flex items-center justify-center md:[perspective:1000px] select-none"
    >
      {/* Dynamic Background */}
      {skillCategories.map((_, i) => (
        <div
          key={i}
          ref={(el) => (bgRefs.current[i] = el)}
          className="absolute inset-0 z-0 pointer-events-none opacity-0 bg-gradient-to-tr from-black via-[#140203] to-black"
        />
      ))}

      {/* Background Typography */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        {skillCategories.map((_, i) => (
          <h1
            key={`text-${i}`}
            ref={(el) => (textRefs.current[i] = el)}
            className="absolute text-[22vw] md:text-[18vw] font-black uppercase text-transparent leading-none tracking-tighter mix-blend-overlay"
            style={{
              WebkitTextStroke: `2px ${
                i % 2 === 0
                  ? 'rgba(229,9,20,0.3)'
                  : 'rgba(255,255,255,0.15)'
              }`,
              opacity: 0,
            }}
          >
            SKILLS
          </h1>
        ))}
      </div>

      {/* Carousel Container */}
      <div
        className="relative w-full h-full flex md:items-center md:justify-center z-10 md:[transform-style:preserve-3d] overflow-x-auto overflow-y-hidden md:overflow-visible snap-x snap-mandatory scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] items-center px-[10vw] md:px-0 gap-4 md:gap-0 touch-pan-x"
        onScroll={handleScroll}
      >
        {skillCategories.map((category, i) => (
          <div
            key={i}
            ref={(el) => (cardsRef.current[i] = el)}
            className="md:absolute relative shrink-0 snap-center w-[82vw] sm:w-[360px] md:w-[440px] h-[460px] md:h-[540px] rounded-[32px] p-8 md:p-10 bg-[#141414]/95 backdrop-blur-2xl border border-white/15 flex flex-col justify-between overflow-hidden group shadow-[0_30px_60px_rgba(0,0,0,0.9)] hover:border-red-600/80 transition-colors duration-500"
          >
            {/* Inner Red Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

            {/* Card Metadata */}
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-red-500 bg-red-600/10 px-3 py-1 rounded border border-red-600/20">
                {category.tag}
              </span>

              <span className="text-xs font-mono text-white/40">
                [ 0{i + 1} / 06 ]
              </span>
            </div>

            {/* Title and Description */}
            <div className="space-y-4 relative z-10 my-auto">
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight group-hover:text-red-500 transition-colors duration-300">
                {category.title}
              </h3>

              <p className="text-sm md:text-base text-white/70 font-light leading-relaxed">
                {category.desc}
              </p>
            </div>

            {/* Skill Badges */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10 relative z-10">
              {category.skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="text-xs font-mono text-white/80 bg-white/5 border border-white/10 px-3 py-1 rounded group-hover:border-red-600/30 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-red-600 group-hover:shadow-[0_0_15px_#E50914] transition-all" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
