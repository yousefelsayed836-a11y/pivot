// ============================================================
//  Pivot Communication — Main JS
// ============================================================

// ── PAGE LOADER ──────────────────────────────────────────────
(function initLoader() {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hide');
      setTimeout(() => loader.remove(), 250);
    }, 120);
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initContactForm();
  initProductTabs();
  loadProducts();
  updateLogoSrc();
  injectLangBtn();
  applyLang(localStorage.getItem('pivotLang') || 'en');
  initLanguageObserver();
});

// ── LOGO ─────────────────────────────────────────────────────
function updateLogoSrc() {
  // Header logo uses transparent PNG
  document.querySelectorAll('.logo-img:not(.logo-footer)').forEach(img => {
    if (!img.src.includes('transparent')) img.src = '/img/pivot-logo-transparent.png';
  });
}

// ── STICKY HEADER ─────────────────────────────────────────────
function initHeader() {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ── MOBILE MENU ──────────────────────────────────────────────
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.classList.toggle('open');
  });
  document.querySelectorAll('nav > ul > li > a').forEach(link => {
    const parent = link.parentElement;
    if (parent.querySelector('.dropdown')) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          parent.classList.toggle('open');
        }
      });
    }
  });
}

// ── CONTACT FORM ──────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const msg = form.querySelector('.form-msg');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json();
      if (res.ok) {
        msg.className = 'form-msg success';
        msg.textContent = json.message;
        msg.style.display = 'block';
        form.reset();
      } else throw new Error(json.error);
    } catch (err) {
      msg.className = 'form-msg error';
      msg.textContent = err.message || 'Something went wrong. Please try again.';
      msg.style.display = 'block';
    } finally {
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }
  });
}

// ── CATEGORY TABS ─────────────────────────────────────────────
function initProductTabs() {
  const tabs = document.querySelectorAll('.cat-tab');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      const url = new URL(window.location.href);
      if (filter && filter !== 'all') url.searchParams.set('filter', filter); else url.searchParams.delete('filter');
      history.replaceState(null, '', url);
      document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.sub === filter) ? '' : 'none';
      });
    });
  });
}

// ── LOAD PRODUCTS ─────────────────────────────────────────────
async function loadProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const category = grid.dataset.category || '';
  const url = category ? `/api/products?category=${category}` : '/api/products';
  try {
    const res = await fetch(url);
    const products = await res.json();
    if (!products.length) {
      grid.innerHTML = '<p style="color:var(--text-light)">No products found.</p>';
      return;
    }
    grid.innerHTML = products.map(p => `
      <div class="product-card" data-sub="${p.subcategory}" data-id="${p.id}" style="cursor:pointer" onclick="location.href='/product/${p.id}'">
        <div class="product-card-img">
          <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/400x240/1e3a99/white?text=Product'">
        </div>
        <div class="product-card-body">
          <div class="cat">Optronics Plus</div>
          <h3>${p.name}</h3>
          <p>${p.description}</p>
          ${p.price > 0 ? `<div class="product-price">EGP ${p.price.toLocaleString()}</div>` : ''}
          <div class="product-card-actions">
            <a href="/product/${p.id}" class="btn-card-primary" data-i18n="viewDetails">View Details</a>
            <button class="btn-card-secondary" onclick="event.stopPropagation();openInquiry(${p.id},'${p.name.replace(/'/g,"\\'")}')">Contact Us</button>
          </div>
        </div>
      </div>
    `).join('');
    initProductTabs();
    const requestedFilter = new URLSearchParams(window.location.search).get('filter');
    if (requestedFilter) {
      const tab = Array.from(document.querySelectorAll('.cat-tab')).find(t => t.dataset.filter === requestedFilter);
      if (tab) tab.click();
    }
  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

// ── INQUIRY — direct mailto ────────────────────────────────────
function openInquiry(id, name) {
  const isAr = document.documentElement.lang === 'ar';
  const subject = encodeURIComponent((isAr ? 'استفسار عن منتج: ' : 'Product Inquiry: ') + name);
  const body = encodeURIComponent(isAr
    ? 'مرحباً،\n\nأود الاستفسار عن المنتج التالي:\n\n' + name + '\n\nيرجى التواصل معي في أقرب وقت.\n\nشكراً.'
    : 'Hello,\n\nI would like to request information / pricing for the following product:\n\n' + name + '\n\nPlease get back to me at your earliest convenience.\n\nThank you.');
  window.location.href = 'mailto:Admin@pivotcommunication.net?subject=' + subject + '&body=' + body;
}

// ── LANGUAGE TOGGLE ───────────────────────────────────────────
// Phrases sorted longest-first so longer matches win over sub-phrases
const AR = [
  // Nav & dropdowns
  ['Hyperscale UHDCi®','UHDCi® فائق الكثافة'],
  ['Datacentre Solutions','حلول مراكز البيانات'],
  ['Telecom Solutions','حلول الاتصالات'],
  ['HDCi® Solutions','حلول HDCi®'],
  ['Copper Solutions','حلول الكابلات النحاسية'],
  ['Fibre Optic Solutions','حلول الألياف الضوئية'],
  ['Internal & External Management','الإدارة الداخلية والخارجية'],
  ['Multi-Fibre Assemblies','تجميعات متعددة الألياف'],
  ['Fibre Optic Cable','كابل الألياف الضوئية'],
  ['Fibre Optic Components','مكونات الألياف الضوئية'],
  ['Active Equipment','المعدات النشطة'],
  ['Active Optical Cables (AOC)','كابلات الألياف النشطة (AOC)'],
  ['Active Components','المكونات النشطة'],
  ['MTP®/MPO Solutions','حلول MTP®/MPO'],
  ['About Us','من نحن'],
  ['Contact Us','تواصل معنا'],
  ['Solutions','الحلول'],
  ['Products','المنتجات'],
  ['Home','الرئيسية'],
  ['Telecom','الاتصالات'],
  // Hero
  ['Enterprise Infrastructure & Connectivity','بنية تحتية للمؤسسات واتصالات متكاملة'],
  ['Building the Infrastructure\nBehind What\'s Next.','بناء البنية التحتية\nلمستقبل الغد.'],
  ['Building the InfrastructureBehind What\'s Next.','بناء البنية التحتية لمستقبل الغد.'],
  ['Advanced infrastructure, data centre, telecom, and connectivity solutions engineered for performance, reliability, and scale.','حلول متقدمة للبنية التحتية ومراكز البيانات والاتصالات مصممة للأداء والموثوقية والتوسع.'],
  ['Get In Touch →','تواصل معنا ←'],
  ['Get In Touch','تواصل معنا'],
  ['Explore Solutions','استعرض الحلول'],
  // Product banners
  ['Products for All Your Connectivity Needs','منتجات لجميع احتياجات الاتصال لديك'],
  ['View all products →','عرض جميع المنتجات ←'],
  ['View all products','عرض جميع المنتجات'],
  ['Cat 5e to Cat 8 cables, patch panels & assemblies.','كابلات Cat 5e إلى Cat 8، لوحات توصيل وتجميعات.'],
  ['MPO/MTP®, multi-fibre cables, AOC & active equipment.','MPO/MTP®، كابلات متعددة الألياف، AOC ومعدات نشطة.'],
  // Solutions section
  ['Infrastructure Built for Demanding Environments','بنية تحتية مصممة للبيئات الصعبة'],
  ['Proven solutions across HDCI, datacentre, and telecom — designed for reliability, scale, and long-term performance.','حلول مثبتة عبر HDCI ومراكز البيانات والاتصالات — مصممة للموثوقية والتوسع والأداء طويل المدى.'],
  ['Our Solutions','حلولنا'],
  ['High Density Converged Infrastructure.','بنية تحتية متقاربة عالية الكثافة.'],
  ['Secure. Robust. Reliable.','آمن. متين. موثوق.'],
  ['Optimize. Expand. Grow.','حسّن. وسّع. انمو.'],
  ['Learn More →','اعرف أكثر ←'],
  ['Learn More','اعرف أكثر'],
  // Why Pivot
  ['Who we are','من نحن'],
  ['We stock what others source.\nWe know what others Google.','نحن نخزن ما يبحث عنه الآخرون.\nونعرف ما يغوغله المنافسون.'],
  ['We stock what others source.We know what others Google.','نحن نخزن ما يبحث عنه الآخرون. ونعرف ما يغوغله المنافسون.'],
  ['We stock what others source.','نوفر ما يضطر الآخرون للبحث عنه.'],
  ['We know what others Google.','ونفهم احتياجات السوق عن خبرة.'],
  ['Same-day quotation','عروض أسعار في نفس اليوم'],
  ['Send us a BOM or spec sheet — we turn quotes around fast, without back-and-forth.','أرسل لنا قائمة المواد أو المواصفات — نُعيد الأسعار بسرعة دون تأخير.'],
  ['Pre-terminated & tested','مُجهَّز ومُختبر مسبقاً'],
  ['Factory-terminated assemblies arrive ready to deploy — no on-site splicing, no rework.','التجميعات المُنهاة بالمصنع تصل جاهزة للتركيب — بدون لحام ميداني أو إعادة عمل.'],
  ['Reseller & integrator pricing','أسعار الموزعين والمتكاملين'],
  ['Structured pricing tiers for volume buyers — consistent margins, no surprises per order.','هياكل أسعار منتظمة للمشترين بالجملة — هوامش ثابتة بلا مفاجآت.'],
  ['Spec support on request','دعم المواصفات عند الطلب'],
  ['Not sure which product fits? Our technical team reviews your requirements and recommends the right solution.','لست متأكداً من المنتج المناسب؟ يراجع فريقنا الفني متطلباتك ويوصي بالحل الأمثل.'],
  // About strip
  ['About Pivot','عن بيفوت كوميونيكيشن'],
  ['Egypt\'s Leading IT Infrastructure Partner.','الشريك الرائد للبنية التحتية لتكنولوجيا المعلومات في مصر.'],
  ['Pivot Communication is a leading IT supplier to system integrators and resellers across Egypt, established to provide professional IT solutions and telecommunications for industrial, commercial and residential needs.','بيفوت كوميونيكيشن هي مورد رائد لتكنولوجيا المعلومات لمتكاملي الأنظمة والموزعين في مصر.'],
  ['We source, supply and support a range of fibre optic and connectivity products that cover the needs of any high-demand network infrastructure — from structured cabling to fibre optics, copper to telecom.','نوفّر وندعم مجموعة متكاملة من منتجات الألياف الضوئية والاتصالات لتلبية احتياجات البنية التحتية للشبكات عالية المتطلبات.'],
  ['Learn More About Us →','اعرف المزيد عنا ←'],
  // CTA
  ['Ready to Start Your Next Project?','هل أنت مستعد لبدء مشروعك القادم؟'],
  ['Talk to our infrastructure experts and discover the right solution for your business.','تحدث مع خبراء البنية التحتية لدينا واكتشف الحل الأمثل لأعمالك.'],
  // Official agent badge
  ['Official Agent of','الوكيل الرسمي لـ'],
  ['in Egypt','في مصر'],
  // Footer
  ['Egypt\'s leading IT supplier providing professional IT solutions and telecommunications for industrial, commercial and residential needs.','المورد الرائد لتكنولوجيا المعلومات في مصر لتوفير حلول احترافية للاتصالات.'],
  ['Our Office','مكتبنا'],
  ['Email','البريد الإلكتروني'],
  ['Website','الموقع الإلكتروني'],
  ['All Products','جميع المنتجات'],
  ['Privacy Policy','سياسة الخصوصية'],
  ['Terms & Conditions','الشروط والأحكام'],
  ['Contact','تواصل'],
  ['All Rights Reserved.','جميع الحقوق محفوظة.'],
  // Solutions page
  ['Our Solutions','حلولنا'],
  ['What We Do','ما نقدمه'],
  ['Built for the Infrastructure That Matters','مبنية للبنية التحتية التي تهم'],
  ['Pivot Communication delivers enterprise-grade infrastructure solutions across HDCI, datacentre, and telecom. We work closely with system integrators, resellers, and enterprise teams to source, supply, and support the right solution for every environment.','تقدم بيفوت كوميونيكيشن حلول بنية تحتية على مستوى المؤسسات عبر HDCI ومراكز البيانات والاتصالات.'],
  ['High Density Converged Infrastructure — factory pre-terminated, modular, built to accelerate deployment.','بنية تحتية متقاربة عالية الكثافة — مُنهاة بالمصنع، معيارية، مبنية لتسريع النشر.'],
  ['Reliable, scalable, and efficient — from single comms rooms to hyperscale environments.','موثوقة وقابلة للتوسع وفعّالة — من غرف الاتصالات الفردية إلى البيئات فائقة الحجم.'],
  ['FTTA, FTTx, splitter panels and distribution frames — keeping businesses connected.','FTTA وFTTx ولوحات الموزعات وإطارات التوزيع — للحفاظ على اتصال الأعمال.'],
  ['Ready to Start Your Next Project?','هل أنت مستعد لبدء مشروعك القادم؟'],
  ['Our team of experts is here to help you design the right solution.','فريقنا من الخبراء هنا لمساعدتك في تصميم الحل المناسب.'],
  // Products page
  ['Product Range','نطاق المنتجات'],
  ['Products for All Your Connectivity Needs','منتجات لجميع احتياجات الاتصال'],
  ['From structured copper cabling to high-density fibre optic systems, telecom infrastructure to HDCI solutions — we carry the products that keep networks running at peak performance.','من الكابلات النحاسية إلى أنظمة الألياف الضوئية عالية الكثافة — نوفر المنتجات التي تُبقي الشبكات تعمل بأعلى أداء.'],
  ['View Products →','عرض المنتجات ←'],
  ['View Products','عرض المنتجات'],
  ['Cat 5e to Cat 8 cables, patch panels, jacks & structured cabling.','كابلات Cat 5e إلى Cat 8، لوحات توصيل وكابلات هيكلية.'],
  ['MPO/MTP® assemblies, multi-fibre cable assemblies, fibre optic components, active equipment, active optical cables (AOC), and internal & external fibre management systems.','تجميعات MPO/MTP®، مكونات الألياف الضوئية، معدات نشطة وكابلات AOC.'],
  ['Patch panels, MTP®/MPO cassettes & pre-terminated solutions.','لوحات توصيل، كاسيتات MTP®/MPO وحلول مُنهاة مسبقاً.'],
  ['Ultra-high-density LX4 panels & MLX4 cassettes for hyperscale environments.','لوحات LX4 وكاسيتات MLX4 فائقة الكثافة لبيئات hyperscale.'],
  ['High Density Converged Infrastructure — factory pre-terminated patch panels, MTP®/MPO cassette modules, and modular fibre systems engineered for high-density datacentre environments.','بنية تحتية متقاربة عالية الكثافة — لوحات توصيل مُنهاة بالمصنع، وحدات كاسيت MTP®/MPO، وأنظمة ألياف معيارية مصممة لبيئات مراكز البيانات عالية الكثافة.'],
  ['Ultra-high-density LX4 panels and MLX4 cassette modules engineered for hyperscale datacentre environments where rack space is critical and port density demands are extreme.','لوحات LX4 ووحدات كاسيت MLX4 فائقة الكثافة مصممة لبيئات مراكز البيانات الضخمة حيث تكون مساحة الرف حرجة ومتطلبات كثافة المنافذ قصوى.'],
  ['View Products →','عرض المنتجات ←'],
  ['FTTA & FTTx infrastructure, splitter panels & distribution frames.','بنية تحتية FTTA وFTTx، لوحات موزعات وإطارات توزيع.'],
  ['Can\'t find what you\'re looking for?','لم تجد ما تبحث عنه؟'],
  ['Our team is ready to help you find the right product for your project.','فريقنا مستعد لمساعدتك في إيجاد المنتج المناسب لمشروعك.'],
  // About page
  ['Who We Are','من نحن'],
  ['We Provide Products That Keep People and Businesses Connected','نوفر منتجات تربط الناس والأعمال'],
  ['Message From The Owner','رسالة من المالك'],
  ['Our Commitment to Egypt\'s Digital Future','التزامنا بالمستقبل الرقمي لمصر'],
  ['Our Mission','مهمتنا'],
  ['Our Vision','رؤيتنا'],
  ['Why Choose Us','لماذا تختارنا'],
  ['What Sets Us Apart','ما يميزنا'],
  ['Trusted Partner','شريك موثوق'],
  ['Fast & Efficient Service','خدمة سريعة وفعّالة'],
  ['Quality & Reliability','الجودة والموثوقية'],
  ['Ready to Work With Us?','هل أنت مستعد للعمل معنا؟'],
  ['Our team of experts is ready to help you find the right solution for your business.','فريقنا من الخبراء مستعد لمساعدتك في إيجاد الحل المناسب.'],
  ['Contact Us Today →','تواصل معنا اليوم ←'],
  ['Established','تأسست'],
  ["Copper Cable","كابلات نحاسية"],
  ["Assemblies","التجميعات"],
  ["Management","إدارة الكابلات"],
  ["Connectivity","التوصيلات"],
  ["Datacentre","مراكز البيانات"],
  ["Cabinets","الخزائن"],
  ["High Density Fibre Optic Circuit Flexplane","لوحة دوائر ألياف ضوئية مرنة عالية الكثافة"],
  ["Category","الفئة"],
  ["Product Category","فئة المنتجات"],
  ["Browse products in this category.","تصفّح المنتجات المتاحة ضمن هذه الفئة."],
  ["Loading products...","جارٍ تحميل المنتجات..."],
  ["Loading product...","جارٍ تحميل المنتج..."],
  ["No products found.","لم يتم العثور على منتجات."],
  ["Egypt's leading IT supplier — keeping people and businesses connected.","المورّد الرائد لحلول تكنولوجيا المعلومات في مصر، لنحافظ على اتصال الأفراد والأعمال."],
  ["We provide innovative optical and copper communications solutions that offer enhanced performance, security and reliability. Our products are trusted by clients across Egypt and beyond.","نقدّم حلولًا مبتكرة للاتصالات عبر الألياف الضوئية والكابلات النحاسية، تجمع بين الأداء المتقدم والأمان والموثوقية. وتحظى منتجاتنا بثقة العملاء داخل مصر وخارجها."],
  ["Structured cabling products & fibre optic cables","منتجات الكابلات الهيكلية وكابلات الألياف الضوئية"],
  ["Network switches, routers & access points","محولات الشبكات وأجهزة التوجيه ونقاط الوصول"],
  ["Servers, UPS, media converters, cabinets & racks","الخوادم ووحدات الطاقة غير المنقطعة ومحولات الوسائط والخزائن والرفوف"],
  ["PABX systems, KVM switches & transceivers","أنظمة السنترال ومحولات KVM ووحدات الإرسال والاستقبال"],
  ["Power distribution units & testing equipment","وحدات توزيع الطاقة ومعدات الاختبار"],
  ["To provide the best possible reliable IT solutions and telecommunications to empower our clients, improve efficiency and drive innovation to the best of their needs.","تقديم حلول موثوقة ومتكاملة لتكنولوجيا المعلومات والاتصالات تمكّن عملاءنا، وترفع الكفاءة، وتدعم الابتكار بما يلائم احتياجاتهم."],
  ["To lead the supply of IT solutions, growth and innovation amongst Egypt and Africa to achieve the economic and business goals of each organisation.","أن نكون في طليعة مورّدي حلول تكنولوجيا المعلومات في مصر وأفريقيا، وأن ندعم النمو والابتكار لتحقيق أهداف المؤسسات الاقتصادية والتجارية."],
  ["Delivering reliable IT and telecommunications solutions across Egypt with long-term partnerships built on trust and consistent quality.","نقدّم حلولًا موثوقة لتكنولوجيا المعلومات والاتصالات في أنحاء مصر، ونبني شراكات طويلة الأمد أساسها الثقة والجودة المستمرة."],
  ["Ensuring timely delivery, responsive support, and seamless project execution from planning through to completion.","نضمن التسليم في الموعد، والدعم سريع الاستجابة، والتنفيذ السلس للمشروعات من التخطيط حتى الإنجاز."],
  ["Committed to high-quality products that meet international standards, rigorously screened for performance and durability.","نلتزم بمنتجات عالية الجودة مطابقة للمعايير الدولية، تُختبر بعناية لضمان الأداء والمتانة."],
  ["Egypt's leading IT supplier providing professional IT solutions and telecommunications.","المورّد الرائد في مصر لحلول تكنولوجيا المعلومات والاتصالات الاحترافية."],
  ["Agora Mall – Building A, Floor 2, Office 7, Egypt","أجورا مول – المبنى A، الطابق الثاني، مكتب 7، مصر"],
  ["Agora Mall – Building A, Floor 2","أجورا مول – المبنى A، الطابق الثاني"],
  ["Office 7, Egypt","مكتب 7، مصر"],
  ["Planning your next big project? Our team of experts can help you get started.","هل تخطط لمشروعك الكبير القادم؟ فريق خبرائنا جاهز لمساعدتك على البدء."],
  ["We'd Love to Hear From You","يسعدنا التواصل معك"],
  ["Whether you have a question about our products, need technical support, or want to discuss a project — our team is here to help.","سواء كان لديك سؤال عن منتجاتنا، أو تحتاج إلى دعم فني، أو ترغب في مناقشة مشروع، ففريقنا جاهز لمساعدتك."],
  ["Phone","الهاتف"],
  ["Business Hours","ساعات العمل"],
  ["Sunday – Thursday: 9:00 AM – 5:00 PM","الأحد – الخميس: 9:00 صباحًا – 5:00 مساءً"],
  ["Friday – Saturday: Closed","الجمعة – السبت: مغلق"],
  ["Send Us a Message","أرسل لنا رسالة"],
  ["Full Name *","الاسم الكامل *"],
  ["Phone Number","رقم الهاتف"],
  ["Secure. Robust. Trusted.","آمنة. متينة. موثوقة."],
  ["Data Centres are the epicentre of corporate and modern business and range in size; from single comms rooms to Hyperscale Centres supporting international organisations. Whatever their size, they all have to deliver undisrupted instant access to current and precise data the moment it is needed.","تمثّل مراكز البيانات قلب الأعمال الحديثة، وتتدرج من غرف اتصالات صغيرة إلى مراكز فائقة السعة تخدم مؤسسات دولية. وبغض النظر عن حجمها، يجب أن تتيح وصولًا فوريًا ومستمرًا إلى بيانات دقيقة وحديثة عند الحاجة."],
  ["Our industry expertise has given us insights to better grasp the issues you face daily and thus help you maximise the efficiency of your enterprise while reducing operational expenses by implementing the right fusion of technologies.","تمنحنا خبرتنا المتخصصة فهمًا عميقًا للتحديات اليومية التي تواجهها، بما يساعدك على رفع كفاءة مؤسستك وخفض تكاليف التشغيل عبر توظيف المزيج التقني المناسب."],
  ["Robust, flexible and modular internal management solutions","حلول داخلية متينة ومرنة ومعيارية لإدارة الكابلات"],
  ["High-density MTP® assemblies and LGX modules","تجميعات MTP® عالية الكثافة ووحدات LGX"],
  ["100G QSFP28, 25G SFP28 and 400G QSFP-DD optical transceivers","وحدات إرسال واستقبال ضوئية 100G QSFP28 و25G SFP28 و400G QSFP-DD"],
  ["Full range DAC and AOC solutions","مجموعة متكاملة من حلول DAC وAOC"],
  ["Servers, UPS, cabinets, racks & power distribution units","خوادم ووحدات UPS وخزائن ورفوف ووحدات توزيع طاقة"],
  ["Discuss Your Requirements →","ناقش متطلباتك معنا ←"],
  ["Hyper Density Converged Infrastructure","بنية تحتية متقاربة فائقة الكثافة"],
  ["As the demand for higher bandwidth increases, our wide range of MTP® assemblies, internal management LGX modules, active optical cables and active equipment can be the ideal solution for a reliable, top-of-the-line network performance.","مع تزايد الطلب على النطاق الترددي، توفر تشكيلتنا من تجميعات MTP® ووحدات LGX وكابلات الألياف الضوئية النشطة والمعدات النشطة حلًا مثاليًا لأداء شبكي موثوق وعالي المستوى."],
  ["Media converters and active networking equipment","محولات الوسائط ومعدات الشبكات النشطة"],
  ["Low power, high compatibility for DCN, Switch, Router connections","استهلاك منخفض للطاقة وتوافق عالٍ مع اتصالات DCN والمحولات وأجهزة التوجيه"],
  ["High-density internal management, MTP®/MPO assemblies, active equipment and pre-terminated solutions.","حلول إدارة داخلية عالية الكثافة، وتجميعات MTP®/MPO، ومعدات نشطة، وحلول مُنهية مسبقًا."],
  ["All","الكل"],
  ["Planning Your Data Centre?","هل تخطط لمركز بياناتك؟"],
  ["Our team of experts can help you design and implement the right solution.","يستطيع فريق خبرائنا مساعدتك في تصميم الحل المناسب وتنفيذه."],
  ["Speed & Performance.","السرعة والأداء."],
  ["We are here to help you keep your datacentre up and running using our innovative solutions and products. We collaborate with you, serving to provide answers to make your systems operate faster, economically and with less down-time.","نساعدك على إبقاء مركز بياناتك يعمل بكفاءة من خلال حلولنا ومنتجاتنا المبتكرة. ونتعاون معك لتسريع أنظمتك، وخفض تكلفتها، وتقليل فترات التوقف."],
  ["Up-time & Dependability","استمرارية التشغيل والاعتمادية"],
  ["Clients expect datacentres to provide constantly, reliably, all the time, without disruption 24/7, 365 day per year because down-time can be disastrous. Just a few minutes of down-time can cost millions in trade. In an ever data hungry world, your datacentre is often the first point-of-sale with customers.","يتوقع العملاء من مراكز البيانات تشغيلًا موثوقًا بلا انقطاع على مدار الساعة طوال العام، لأن دقائق قليلة من التوقف قد تسبب خسائر كبيرة. وفي عالم يعتمد بصورة متزايدة على البيانات، يصبح مركز البيانات نقطة أساسية في تجربة العميل والأعمال."],
  ["Your ability to respond almost instantly lies at the heart of today's business models. You expect your IT investments to accelerate your speed of response, provide agility to meet new demands, and constantly reduce your cost of operation. High Density Converged Infrastructure (HDCi) is essential for your business to ensure that your datacentre infrastructures can meet future challenges. The economic, logical basis for deploying Hyper Density Converged Infrastructure goes way beyond traditional IT SAN's.","تقع سرعة الاستجابة في صميم نماذج الأعمال الحديثة. وينبغي لاستثماراتك التقنية أن تسرّع الاستجابة، وتوفر المرونة لمواكبة المتطلبات الجديدة، وتخفض تكاليف التشغيل باستمرار. وتساعد بنية HDCi عالية الكثافة مركز بياناتك على مواجهة تحديات المستقبل بكفاءة تتجاوز حلول SAN التقليدية."],
  ["Efficiency & Sustainability","الكفاءة والاستدامة"],
  ["Generally, only about 50% of energy used by datacentres essentially powers the servers and SAN. So how can you reduce the waste and increase efficiency? Our HDCi product range can assist your company in reducing its carbon footprint and take a positive step towards fighting climate change.","يُستخدم نحو نصف طاقة مراكز البيانات فقط لتشغيل الخوادم وأنظمة SAN. وتساعد منتجات HDCi على تقليل الهدر، ورفع الكفاءة، وخفض البصمة الكربونية للمؤسسة."],
  ["We achieve these results as our High Density Converged Infrastructure solutions have been designed to offer optimisations both in performance and efficiency.","نحقق هذه النتائج لأن حلول البنية التحتية المتقاربة عالية الكثافة صُممت لتحسين الأداء والكفاءة معًا."],
  ["Internal Management","الإدارة الداخلية"],
  ["High-density patch panels, MTP®/MPO assemblies and pre-terminated solutions for your data centre.","لوحات توصيل عالية الكثافة، وتجميعات MTP®/MPO، وحلول مُنهية مسبقًا لمركز بياناتك."],
  ["Ready to Accelerate Your Data Centre?","هل أنت مستعد لتسريع مركز بياناتك؟"],
  ["Our team can help you design the right HDCi® infrastructure for your specific requirements.","يساعدك فريقنا في تصميم بنية HDCi® المناسبة لمتطلباتك الخاصة."],
  ["General Information","معلومات عامة"],
  ["Building the Infrastructure","نبني البنية التحتية"],
  ["Behind What's Next.","التي تقود المستقبل."],
  ["Our team has handled deployments from single comms rooms to multi-site enterprise rollouts. When a spec looks unusual or a lead time is tight, that experience is what you're buying.","نفّذ فريقنا مشروعات تبدأ من غرف اتصالات منفردة وتصل إلى بيئات مؤسسية متعددة المواقع. وعندما تكون المواصفات غير معتادة أو وقت التسليم ضيقًا، تكون خبرتنا هي الفارق."],
  ["Official Distributor","الموزّع الرسمي"],
  ["Etisalat Approval of Copper Connectivity","اعتماد اتصالات لحلول التوصيلات النحاسية"],
  ["Etisalat Approval of Fibre Optic Connectivity","اعتماد اتصالات لحلول الألياف الضوئية"],
  ["Etisalat Approval - Optronics Fibre Optic PLC Splitters","اعتماد اتصالات لمقسمات Optronics PLC للألياف الضوئية"],
  ["Floor 2, Office 7, Egypt","الطابق الثاني، مكتب 7، مصر"],
  ["Need Help Choosing?","هل تحتاج إلى مساعدة في الاختيار؟"],
  ["Our team can help you select the right product for your project requirements.","يساعدك فريقنا في اختيار المنتج الأنسب لمتطلبات مشروعك."],
  ["Select a category from our copper product range to view related datasheets available to view and/or download.","اختر فئة من منتجات الكابلات النحاسية لعرض أوراق البيانات المتاحة أو تنزيلها."],
  ["Select a category from our fibre optic product range to view related datasheets available to view and/or download.","اختر فئة من منتجات الألياف الضوئية لعرض أوراق البيانات المتاحة أو تنزيلها."],
  ["Need a Datasheet or More Information?","هل تحتاج إلى ورقة بيانات أو مزيد من المعلومات؟"],
  ["If you cannot find the datasheet you require, please contact us directly.","إذا لم تجد ورقة البيانات المطلوبة، يُرجى التواصل معنا مباشرة."],
  ["Internal Mgmt","إدارة داخلية"],
  ["External Mgmt","إدارة خارجية"],
  ["Multi-Fibre","متعدد الألياف"],
  ["Cable","الكابلات"],
  ["Components","المكونات"],
  ["Flexplane","اللوحات المرنة"],
  ["A comprehensive range of connectivity and infrastructure products — sourced, supplied and supported for demanding environments.","مجموعة متكاملة من منتجات الاتصال والبنية التحتية، نوفرها وندعمها للبيئات ذات المتطلبات العالية."],
  ["Infrastructure and connectivity solutions engineered for performance, reliability, and scale — built for demanding enterprise environments.","حلول للبنية التحتية والاتصال مصممة للأداء والموثوقية وقابلية التوسع، ومهيأة لبيئات المؤسسات ذات المتطلبات العالية."],
  ["High Density Converged Infrastructure — factory pre-terminated patch panels, MTP®/MPO cassettes, and modular fibre management systems built to accelerate datacentre deployment and reduce installation time.","بنية تحتية متقاربة عالية الكثافة تشمل لوحات توصيل مُنهية في المصنع، وكاسيتات MTP®/MPO، وأنظمة معيارية لإدارة الألياف، بما يسرّع تجهيز مراكز البيانات ويقلل وقت التركيب."],
  ["Reliable, scalable, and efficient data centre solutions designed for high availability and long-term performance. Supporting everything from single comms rooms to hyperscale environments with structured cabling and fibre systems.","حلول موثوقة وقابلة للتوسع وفعّالة لمراكز البيانات، مصممة للتوافر العالي والأداء طويل الأمد، من غرف الاتصالات المنفردة إلى البيئات فائقة السعة."],
  ["Advanced telecom infrastructure including FTTA, FTTx, fibre splitter panels, and distribution frames. Designed to keep businesses connected, improve network reach, and support modern carrier-grade deployments.","بنية اتصالات متقدمة تشمل FTTA وFTTx ولوحات مقسمات الألياف وإطارات التوزيع، للحفاظ على اتصال الأعمال وتوسيع تغطية الشبكات ودعم تجهيزات المشغلين الحديثة."],
  ["Optimise. Expand. Grow.","حسّن. وسّع. انمُ."],
  ["The place where billions of high-frequency signals turn into digital, cable-bound data streams is the antenna mast. Right here, between base station and antenna, the quality of the transmission between network and end-user is defined.","عند برج الهوائي تتحول مليارات الإشارات عالية التردد إلى تدفقات بيانات رقمية عبر الكابلات. وهنا، بين المحطة الأساسية والهوائي، تتحدد جودة الاتصال بين الشبكة والمستخدم النهائي."],
  ["The Fibre to the Antenna (FTTA) & FTTx solutions that we offer ensures that not only current but also standards to be expected in the future will be met without compromise.","تضمن حلول FTTA وFTTx التي نقدمها تلبية المعايير الحالية والمستقبلية دون تنازل عن الجودة."],
  ["We Can Help Your Business Grow","نساعد أعمالك على النمو"],
  ["With industry-leading fibre-optic technology that deploys fast and supports even the most demanding FTTA and FTTC applications.","بتقنيات رائدة للألياف الضوئية سريعة التجهيز وتدعم أكثر تطبيقات FTTA وFTTC تطلبًا."],
  ["Splitters, FTTA/PTTA solutions, enclosures and outdoor termination boxes.","مقسمات وحلول FTTA/PTTA وحاويات وصناديق إنهاء خارجية."],
  ["Splitters","المقسمات"],
  ["External Management","الإدارة الخارجية"],
  ["Scalability and Density","قابلية التوسع والكثافة"],
  ["Maximum Density","أقصى كثافة"],
  ["High-density patch panels maximise the amount of adaptor panels per rack unit — ideal where space is at a premium in hyperscale environments.","تزيد لوحات التوصيل عالية الكثافة عدد لوحات المحولات في كل وحدة رف، ما يجعلها مثالية للبيئات فائقة السعة ذات المساحة المحدودة."],
  ["Split-Top Design","تصميم بغطاء منقسم"],
  ["The split top design allows for easier cable management and improved strain relief for the cable ingress — protecting your critical fibre connections.","يسهّل تصميم الغطاء المنقسم إدارة الكابلات ويحسن تخفيف الشد عند نقاط الدخول، بما يحمي توصيلات الألياف الحساسة."],
  ["Sliding Tray Locking","تثبيت الدرج المنزلق"],
  ["The sliding tray has locking positions to prevent over-extending fibres — ensuring reliable connections during maintenance activities.","يتضمن الدرج المنزلق مواضع تثبيت تمنع شد الألياف أكثر من اللازم، لضمان موثوقية التوصيلات أثناء الصيانة."],
  ["Universal Cassette Mount","حامل كاسيت عام"],
  ["LX4 panels have universal mounting hardware to hold fully-terminated cassette modules — maximising networking space while saving installation time.","تستخدم لوحات LX4 حوامل عامة لوحدات الكاسيت المُنهية بالكامل، لزيادة مساحة الشبكة وتوفير وقت التركيب."],
  ["Patch Cords","كوابل التوصيل"],
  ["Build Your Hyperscale Infrastructure","ابنِ بنيتك التحتية فائقة السعة"],
  ["Our specialists can help you plan and deploy a Hyperscale UHDCi® cabling system tailored to your data centre's needs.","يساعدك متخصصونا في تخطيط وتنفيذ نظام كابلات UHDCi® فائق السعة والمصمم وفق احتياجات مركز بياناتك."],
  // Contact page
  ['Get In Touch','تواصل معنا'],
  ['Send Message','إرسال الرسالة'],
  ['Your Name','اسمك'],
  ['Email Address','البريد الإلكتروني'],
  ['Company','الشركة'],
  ['Message','الرسالة'],
  // Certifications section
  ['Certifications','الشهادات'],
  ['Certified to Global Standards','معتمد وفق أعلى المعايير الدولية'],
  ['Optronics Plus products meet the world\'s most stringent quality and compliance standards — from ISO to UL, Etisalat to GHMT.','منتجات Optronics Plus معتمدة وفق أكثر معايير الجودة والامتثال صرامةً في العالم — من ISO إلى UL ومن اتصالات إلى GHMT.'],
  ['ISO Certificates','شهادات ISO'],
  ['UL Certificates','شهادات UL'],
  ['Etisalat Certificates','شهادات اتصالات'],
  ['GHMT Certificates','شهادات GHMT'],
  // General
  ['View Details','عرض التفاصيل'],
  ['Back to Products','العودة للمنتجات'],
  ['Technical Specifications','المواصفات التقنية'],
  ['Related Products','منتجات ذات صلة'],
  ['Learn More About Us →','اعرف المزيد عنا ←'],
  ['Sending...','جارٍ الإرسال...'],
];

function injectLangBtn() {
  const header = document.querySelector('.header-inner');
  if (!header || document.getElementById('langBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'langBtn';
  btn.className = 'lang-btn';
  btn.onclick = () => {
    const next = document.documentElement.lang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('pivotLang', next);
    if (next === 'en') { location.reload(); return; }
    applyLang(next);
  };
  header.appendChild(btn);
}

function translateString(text) {
  let translated = text;
  const sortedAR = [...AR].sort((a, b) => b[0].length - a[0].length);
  sortedAR.forEach(([en, ar]) => {
    if (translated.includes(en)) translated = translated.split(en).join(ar);
  });
  return translated;
}

function translateSubtree(root) {
  const translateTextNode = node => {
    if (!node.textContent.trim()) return;
    const translated = translateString(node.textContent);
    if (translated !== node.textContent) node.textContent = translated;
  };

  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root);
    return;
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: node => {
      const tag = node.parentElement && node.parentElement.tagName;
      return (tag === 'SCRIPT' || tag === 'STYLE') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(translateTextNode);

  const elements = root.querySelectorAll ? [root, ...root.querySelectorAll('[placeholder], [title], [aria-label]')] : [];
  elements.forEach(el => {
    ['placeholder', 'title', 'aria-label'].forEach(attr => {
      if (el.hasAttribute && el.hasAttribute(attr)) {
        el.setAttribute(attr, translateString(el.getAttribute(attr)));
      }
    });
  });
}

function initLanguageObserver() {
  const observer = new MutationObserver(mutations => {
    if (document.documentElement.lang !== 'ar') return;
    mutations.forEach(mutation => mutation.addedNodes.forEach(translateSubtree));
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function applyLang(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = lang === 'ar' ? 'EN' : 'AR';
  if (lang !== 'ar') return;

  document.title = translateString(document.title);
  translateSubtree(document.body);
}
