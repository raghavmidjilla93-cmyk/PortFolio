import VideoIntro        from '@/components/VideoIntro/VideoIntro';
import About             from '@/components/VideoIntro/About';
import CinematicDivider  from '@/components/VideoIntro/CinematicDivider';
import SkillsMap         from '@/components/VideoIntro/SkillsMap';
import Experience        from '@/components/VideoIntro/Experience';
import Certifications    from '@/components/VideoIntro/Certifications';

export default function HomePage() {
  return (
    <main>
      <VideoIntro />
      <About />
      <CinematicDivider />
      <SkillsMap />
      <Experience />
      <Certifications />
    </main>
  );
}