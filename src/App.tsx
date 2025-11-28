import { useEffect, useState } from 'react';
import './styles.css';
import BackgroundAnimation from './BackgroundAnimation';
import BrandCard from './BrandCard';
import { supabase } from './lib/supabaseClient';
import PublicBrandLogoGallery from './BrandsSection';
import AdminDashboard from './AdminDashboard';
import WhyJoin from './WhyJoin';
import AdminLogin from './AdminLogin';
import { Session } from '@supabase/supabase-js';
//import Contact from './Contact';
import Faq from './Faq';
import LoginSignupModal from './LoginSignupModal';
import NewsImage from './NewsImage';
import HomeHero from "./HomeHero";
import BackToTopLogo from "./BackToTopLogo";
import ContactQuickModal from "./ContactQuickModal";
//import { useUiSections } from './hooks/useUiSections';
import ContactEmailModal from "./ContactEmailModal";
import CommissionRateMobile from './CommissionRateMobile';
import Testimonials from './Testimonials';
// NEW: modal for full instance signup form
import RealmSignupModal from './RealmSignupModal';
import ThroneSignupModal from './ThroneSignupModal';
import VidavegasBrSignupModal from './VidavegasBrSignupModal';
import BluffbetSignupModal from './BluffbetSignupModal';
import VidavegasLatamSignupModal from './VidavegasLatamSignupModal';
import JackburstSignupModal from './JackburstSignupModal';



export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactInstance] = useState<string | null>(null);
  //const { map: ui } = useUiSections(); 
  const [isContactEmailOpen, setIsContactEmailOpen] = useState(false);
  const [openInstance1Form, setOpenInstance1Form] = useState(false);
  const [openThroneForm, setOpenThroneForm] = useState(false);
  // Number of extra brands currently visible per group
  const [visibleExtra, setVisibleExtra] = useState<Record<string, number>>({});
  const [openVidavegasBrForm, setOpenVidavegasBrForm] = useState(false);
  const [openBluffbetSignup, setOpenBluffbetSignup] = useState(false);
  const [openVidavegasLatam, setOpenVidavegasLatam] = useState(false);
  const [openJackburstSignup, setOpenJackburstSignup] = useState(false);
  




  


  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };
  const [signupByInstance, setSignupByInstance] = useState<Record<string, string>>({});

  // 🟢 Fetch signup links by instance (auth table)
  const fetchSignupLinks = async () => {
    const { data, error } = await supabase
      .from('auth_links')
      .select('instance, signup');

    if (error) {
      console.error('Error fetching signup links:', error.message);
      return;
    }

    if (data) {
      const map: Record<string, string> = {};
      data.forEach((row) => {
        if (row.instance && row.signup) map[row.instance] = row.signup;
      });
      setSignupByInstance(map);
    }
  };


  const getSignupForBrand = (brand: any) => {
  const byBrand = (brand.signup_url || '').trim();
  if (byBrand) return byBrand;

  const key = (brand.group || '').trim();
  return signupByInstance[key] || undefined;
};

  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*, signup_url')
        .eq('is_visible', true)
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching brands:', error.message);
      } else {
        setBrands(data || []);
      }
    };



    // Ejecutar junto con los demás fetch
    fetchBrands();
    fetchSignupLinks();

    // 🟣 Admin Authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const isAdmin = window.location.search.includes('admin=true');

  if (isAdmin) {
    return session ? <AdminDashboard /> : <AdminLogin />;
  }

  const groupOrder = ['Realm', 'Throne', 'Neatplay'];

  const groupedBrands = groupOrder.map((groupName) => {
  if (groupName === 'Neatplay') {
    return {
      groupName,
      brands: brands.filter((b) =>
        ['Vidavegas - Latam', 'Vidavegas - BR', 'Bluffbet', 'Jackburst']
          .includes(b.group)
      ),
    };
  }

  return {
    groupName,
    brands: brands.filter((b) => b.group === groupName),
  };
});

const showMore = (groupName: string, maxExtra: number) => {
  setVisibleExtra(prev => {
    const current = prev[groupName] || 0;
    const next = current + 3;

    if (next >= maxExtra) {
      return { ...prev, [groupName]: maxExtra }; // reached the end
    }
    return { ...prev, [groupName]: next };
  });
};

const showLess = (groupName: string) => {
  // collapse extra cards
  setVisibleExtra(prev => ({ ...prev, [groupName]: 0 }));

  // smooth scroll to CommissionRate header after collapse
  setTimeout(() => {
    const section = document.getElementById("CommissionRate");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 300); // waits 300ms so collapse looks natural
};




  // return


  return (
    
    <div className="font-sans min-h-screen bg-gray-50">
      {/* Navbar */}

<nav className="fixed top-0 left-0 w-full bg-white shadow z-20 p-4 flex justify-between items-center">

  {/* Logo - Takes to TOP */}
  <div 
    onClick={() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMenuOpen(false);
    }}
    className="flex items-center gap-2"
  >
    <img src="/logo.png" alt="Logo" className="h-10 w-25 cursor-pointer" />
  </div>

    {/* Hamburguer Menu */}
      <div className="md:hidden flex items-center gap-2 px-3">
      {/* 🟢 Login Button (Mobile Only) */}
      <button
          onClick={() => setModalType('login')}
          className="rounded-xl bg-green-600 px-5 py-2 text-white font-bold hover:bg-green-800 transition"
      >
          Login
      </button>

      {/* 🟢 Hamburguer Menu (Increased Size) */}
      <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-purple-700 text-2xl" 
      >
          {menuOpen ? '✕' : '☰'}
      </button>
  </div>

{/* Desktop nav */}
<div className="font-bold hidden md:flex flex-wrap gap-1 justify-end w-full max-w-full">

  {[
    'WhyJoin',
    'News',
    'CommissionRate',
    'OurBrands',
    'Contact',
    'FAQ',
  ].map((id) => (
  <button
    key={id}
    onClick={() => {
      if (id === 'Contact') {
        setIsContactEmailOpen(true); // open popup instead of scrolling
      } else {
        scrollToSection(id);
      }
    }}
    className="text-gray-700 text-base px-3 py-2 rounded hover:bg-gray-100 transition"
    >
    {id.replace(/([A-Z])/g, ' $1').trim()}
  </button>
))}

  <button
    onClick={() => setModalType('signup')}
    className="bg-green-600 text-white px-3 py-0 rounded hover:bg-green-800"
  >
    Register
  </button>

  <button
    onClick={() => setModalType('login')}
    className="bg-purple-600 text-white px-3 py-0 rounded hover:bg-purple-800"
  >
    Login
  </button>

</div>

</nav>


      {/* Mobile Menu Dropdown */}
{menuOpen && (
  <div className="font-bold md:hidden fixed top-16 left-0 w-full bg-white shadow-lg z-50 px-4 py-4">
    {[
      { id: 'WhyJoin', label: 'Why Join' },
      { id: 'News', label: 'News' },
      { id: 'CommissionRate', label: 'Commission Rate' },
      { id: 'OurBrands', label: 'Our Brands' },
      //{ id: 'Contact', label: 'Contact' },
      { id: 'FAQ', label: 'FAQ' },
    ].map(({ id, label }) => (
      <button
        key={id}
        onClick={() => scrollToSection(id)}
        className="block w-full text-left text-gray-700 py-2 px-2 rounded hover:bg-gray-100"
      >
        {label}
      </button>
    ))}

    {/* Login/Signup en mobile */}
    <button
      onClick={() => { setModalType('signup'); setMenuOpen(false); }}
      className="block w-full text-left text-green-700 py-2 px-2 font-medium hover:bg-green-100"
    >
      Signup
    </button>
  </div>
)}

      {/* Main content */}
      <div><BackgroundAnimation /></div>
      <div>
        <HomeHero
          onLogin={() => setModalType('login')}
          onSignup={() => setModalType('signup')}
          onScrollNext={() => {
            const faqSection = document.getElementById('WhyJoin');
            faqSection?.scrollIntoView({ behavior: 'smooth' });
          }}
          />
      </div>

      <main className="pt-24 max-w-5xl mx-auto px-4">

        

        {
          <WhyJoin />
        }

        {
          <NewsImage />
        }

{/* ✅ Commission Rate with dynamic cards */}
        <section id="CommissionRate" style={{ paddingTop: '4rem', paddingBottom: '4rem', borderWidth: '2px', borderRadius: '1rem', backgroundColor: 'white'}}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem', color: '#1f2937' }}>
              Commission Rate
            </h2>
            <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem', fontSize: '1rem' }}>
              Earn more as you grow. Our laddered commission system rewards your success.
            </p>
            <div className="space-y-10 mt-6">
               {groupedBrands.map(({ groupName, brands }) => (
                 brands.length > 0 && (
                   <section
                     key={groupName}
                     className="p-6 bg-white rounded-lg border shadow-sm"
                   >

                      <div className="md:hidden mx-[-76px] px-4">
                        <CommissionRateMobile 
                        brands={brands.map(brand => ({
                          ...brand,
                          signup_url: getSignupForBrand(brand),
                        })) }
                        />
                        </div>

            
             {/* Desktop cards */}
            <div className="hidden md:flex flex-col items-center bg-white rounded-2xl border">

              {/* Always show the first 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center w-full p-6">
                {brands.slice(0, 3).map((brand) => (
                  <BrandCard
                    key={brand.id}
                    id={brand.id}
                    logoUrl={brand.logo_url}
                    name={brand.name}
                    commissionTiers={brand.commission_tiers || []}
                    commissionType={brand.commission_type}
                    isVisible={brand.is_visible}
                    commission_tiers_label={brand.commission_tiers_label}
                    onSave={() => {}}
                    isPublicView={true}
                    signupUrl={getSignupForBrand(brand)}
                  />
                ))}
              </div>
              
              {/* PROGRESSIVE LOAD OF EXTRA BRANDS */}
              {brands.length > 3 && (
                <div className="w-full px-6 mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">

                    {/* compute how many extra brands are allowed */}
                    {brands.slice(3, 3 + (visibleExtra[groupName] || 0)).map((brand) => (
                      <BrandCard
                        key={brand.id}
                        id={brand.id}
                        logoUrl={brand.logo_url}
                        name={brand.name}
                        commissionTiers={brand.commission_tiers || []}
                        commissionType={brand.commission_type}
                        isVisible={brand.is_visible}
                        commission_tiers_label={brand.commission_tiers_label}
                        onSave={() => {}}
                        isPublicView={true}
                        signupUrl={getSignupForBrand(brand)}
                      />
                    ))}

                  </div>

                  {/* BUTTONS */}
                  <div className="flex justify-center gap-4 mt-4 my-3">

                    {/* SHOW MORE — only if there are more to reveal */}
                    {(visibleExtra[groupName] || 0) < brands.length - 3 && (
                      <button
                        onClick={() => showMore(groupName, brands.length - 3)}
                        className="px-6 py-2 rounded-full bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
                      >
                        Show More
                      </button>
                    )}

                    {/* SHOW LESS — only visible if something is expanded */}
                    {(visibleExtra[groupName] || 0) > 0 && (
                      <button
                        onClick={() => showLess(groupName)}
                        className="px-6 py-2 rounded-full bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
                      >
                        Show Less
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>


        </section>
                 )
              ))}
            </div>
          </div>  
        </section>

        <div id="OurBrands" className="py-16">
        {/* 🎯 Pass the onSignup function */}
        <PublicBrandLogoGallery 
          onSignup={() => setModalType('signup')} 
        />
        </div>

        {/* Contact Section
        {ui.contact_section !== false && (
          <>
            <Contact />
            <br />
          </>
        )}
          */}
        
        <div id="Testimonials" className="my-16">
        <Testimonials />
        </div>

        {/* 🎯 PASS THE onSignup PROP TO FAQ */}
        <Faq onSignup={() => setModalType('signup')} />

      {/* Login and Signup Section */}
      <div className="text-center my-10">

          <h2 className="text-3xl font-bold mb-6">Join Neat Affiliates Today!</h2>
          <h3 className="text-lg text-gray-600 mb-6">
            Sign up now to start earning commissions with ease.
          </h3>
          
          <button
            onClick={() => setModalType('signup')}
            className="text-base sm:text-lg lg:text-xl font-bold bg-green-600 text-white px-5 py-2 rounded mx-2 hover:bg-green-800"
          >
            Get Started
          </button>

          {modalType && (
            <LoginSignupModal
              isOpen={true}
              type={modalType}
              onClose={() => setModalType(null)}
              onInstance1Signup={() => setOpenInstance1Form(true)}  // 🔥 NEW
              onInstance2Signup={() => setOpenThroneForm(true)}
              onInstanceVidavegasBrSignup={() => setOpenVidavegasBrForm(true)}
              onBluffbetSignup={() => setOpenBluffbetSignup(true)}
              onVidavegasLatamSignup={() => setOpenVidavegasLatam(true)}
              onJackburstSignup={() => setOpenJackburstSignup(true)}

            />
          )}
      </div>


    {/* Footer logo + mobile FAB */}
    <BackToTopLogo homeAnchorId="HomeHero" />
    <ContactQuickModal
      isOpen={contactOpen}
      instance={contactInstance}
      onClose={() => setContactOpen(false)}
    />
    {/* Desktop-only floating Contact button (bottom-left) */}
{!isContactEmailOpen && (
  <button
    type="button"
    onClick={() => setIsContactEmailOpen(true)}
    className="
      hidden 
      lg:flex
      fixed left-4 
      bottom-4 
      z-[10000]
      px-3 py-2
      bg-purple-700 
      text-white 
      rounded-full 
      shadow-md 
      text-sm
      font-semibold
      hover:bg-purple-800 
      active:scale-95
      transition-all
      duration-200
    "
  >
    Telegram 💬
  </button>
)}


    {/* Mobile-only floating Contact button (bottom-left) */}
{!isContactEmailOpen && (
  <button
    type="button"
    onClick={() => setIsContactEmailOpen(true)}
    className="
      fixed left-4 
      bottom-6
      bottom-[calc(1rem+env(safe-area-inset-bottom))] 
      z-[10000] 
      md:hidden 
      h-12 w-12 
      rounded-full 
      bg-green-600 
      shadow-lg 
      flex items-center justify-center
      text-2xl 
      hover:bg-green-800 
      active:scale-[0.98] 
      transition
    "
    aria-label="Open Contact form"
    title="Contact"
  >
    <span className="leading-none">💬</span>
  </button>
)}

{/* Global Contact modal (opens from navbar or FAB) */}
<ContactEmailModal
  isOpen={isContactEmailOpen}
  onClose={() => setIsContactEmailOpen(false)}
/>

<RealmSignupModal
  isOpen={openInstance1Form}
  onClose={() => setOpenInstance1Form(false)}
/>

<ThroneSignupModal
  isOpen={openThroneForm}
  onClose={() => setOpenThroneForm(false)}
/>

<VidavegasBrSignupModal
  isOpen={openVidavegasBrForm}
  onClose={() => setOpenVidavegasBrForm(false)}
/>

<BluffbetSignupModal
  isOpen={openBluffbetSignup}
  onClose={() => setOpenBluffbetSignup(false)}
/>

<VidavegasLatamSignupModal
  isOpen={openVidavegasLatam}
  onClose={() => setOpenVidavegasLatam(false)}
/>

<JackburstSignupModal
  isOpen={openJackburstSignup}
  onClose={() => setOpenJackburstSignup(false)}
/>




    </main>
    </div>

    
  );
}
