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
  ['Copper Solutions','حلول الكوبر'],
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
  ['We stock what others source.','نحن نخزن ما يبحث عنه الآخرون.'],
  ['We know what others Google.','ونعرف ما يغوغله المنافسون.'],
  ['Same-day quotation','عروض أسعار في نفس اليوم'],
  ['Send us a BOM or spec sheet — we turn quotes around fast, without back-and-forth.','أرسل لنا قائمة المواد أو المواصفات — نُعيد الأسعار بسرعة دون تأخير.'],
  ['Pre-terminated & tested','مُجهَّز ومُختبر مسبقاً'],
  ['Factory-terminated assemblies arrive ready to deploy — no on-site splicing, no rework.','التجميعات المُنهاة بالمصنع تصل جاهزة للتركيب — بدون لحام ميداني أو إعادة عمل.'],
  ['Reseller & integrator pricing','أسعار الموزعين والمتكاملين'],
  ['Structured pricing tiers for volume buyers — consistent margins, no surprises per order.','هياكل أسعار منتظمة للمشترين بالجملة — هوامش ثابتة بلا مفاجآت.'],
  ['Spec support on request','دعم المواصفات عند الطلب'],
  ['Not sure which product fits? Our technical team reviews your requirements and recommends the right solution.','لست متأكداً من المنتج المناسب؟ يراجع فريقنا الفني متطلباتك ويوصي بالحل الأمثل.'],
  // About strip
  ['About Pivot','عن بيفوت'],
  ['Egypt\'s Leading IT Infrastructure Partner.','الشريك الرائد للبنية التحتية لتكنولوجيا المعلومات في مصر.'],
  ['Pivot Communication is a leading IT supplier to system integrators and resellers across Egypt, established to provide professional IT solutions and telecommunications for industrial, commercial and residential needs.','بيفوت كوميونيكيشن هي مورد رائد لتكنولوجيا المعلومات لمتكاملي الأنظمة والموزعين في مصر.'],
  ['We source, supply and support a range of fibre optic and connectivity products that cover the needs of any high-demand network infrastructure — from structured cabling to fibre optics, copper to telecom.','نوفر ندعم مجموعة من منتجات الألياف الضوئية والاتصالات التي تلبي احتياجات أي بنية تحتية للشبكات.'],
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

function applyLang(lang) {
  document.documentElement.lang = lang;
  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = lang === 'ar' ? 'EN' : 'AR';
  if (lang !== 'ar') return;

  // Walk every text node in the document
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: n => {
      const tag = n.parentElement && n.parentElement.tagName;
      return (tag === 'SCRIPT' || tag === 'STYLE') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  // Sort longest-first so "Products for All..." matches before bare "Products"
  const sortedAR = [...AR].sort((a, b) => b[0].length - a[0].length);
  nodes.forEach(node => {
    let text = node.textContent;
    if (!text.trim()) return;
    sortedAR.forEach(([en, ar]) => {
      if (text.includes(en)) text = text.split(en).join(ar);
    });
    node.textContent = text;
  });
}
