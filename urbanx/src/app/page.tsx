import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CollectionsSection from '@/components/CollectionsSection';
import FeaturesBanner from '@/components/FeaturesBanner';
import AboutSection from '@/components/AboutSection';
import Testimonials from '@/components/Testimonials';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CollectionsSection />
        <FeaturesBanner />
        <AboutSection />
        <Testimonials />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
