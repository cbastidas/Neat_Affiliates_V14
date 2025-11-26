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
import InstanceSignupModal from "./InstanceSignupModal";







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
      .from('auth_links') // 👉 cambia a 'auth_links' si esa es tu tabla real
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
        .order('created_at', { ascending: true });

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

  const groupOrder = ['Realm', 'Throne', 'Neatplay', 'Neatplay-Latam'];

  const groupedBrands = groupOrder.map((groupName) => ({
    groupName,
    brands: brands.filter((b) => b.group === groupName),
  }));

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
    <img src="/logo.png" alt="Logo" className="h-9 w-21 cursor-pointer" />
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
            const faqSection = document.getElementById('FAQ');
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

            
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center bg-white rounded-2xl border">
              {brands.map((brand) => (
                <BrandCard
                  key={brand.id}
                  id={brand.id}
                  logoUrl={brand.logo_url}
                  name={brand.name}
                  commissionTiers={brand.commission_tiers || []}
                  commissionType={brand.commission_type}
                  //about={brand.about}
                  isVisible={brand.is_visible}
                  commission_tiers_label={brand.commission_tiers_label}
                  onSave={() => {}}
                  isPublicView={true} // 👈 IMPORTANT: Public Mode
                  signupUrl={getSignupForBrand(brand)}
                  //onLogoClick={() => openContactFor(brand.group)}
                />
              ))}
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
    Contact 💬
  </button>
)}


    {/* Mobile-only floating Contact button (bottom-left) */}
{!isContactEmailOpen && (
  <button
    type="button"
    onClick={() => setIsContactEmailOpen(true)}
    className="
      fixed left-4 
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

<InstanceSignupModal
  isOpen={openInstance1Form}
  onClose={() => setOpenInstance1Form(false)}
/>

    </main>
    </div>

    
  );
}
