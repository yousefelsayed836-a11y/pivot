const fs = require('fs');
const path = require('path');
const DB_FILE = path.join(__dirname, 'data.json');

const BASE = 'https://optronicsplus.net/content/img/copper/';
const OP = 'https://optronicsplus.net/wp-content/uploads/';

// Reusable spec section builders
function copperCableSpecs(cat, cls, construction, shieldDesc, jacket, od, freq, extra) {
  const isOutdoor = jacket === 'PE';
  const temp = isOutdoor ? '-40°C to +70°C' : '-20°C to +60°C';
  return [
    { title: 'CONSTRUCTION', data: Object.assign({
      'Conductor': '23 AWG Solid Bare Copper (0.570 ±0.01 mm)',
      'Insulation': 'FOPE / HDPE',
      'Insulation OD': '1.36 ±0.10 mm',
      'Screen': shieldDesc,
      'Drain Wire': 'Tinned solid copper (1/0.404 ±0.008 mm)',
      'Jacket': jacket + (jacket==='LSZH' ? ' (Low Smoke Zero Halogen)' : jacket==='PE' ? ' (UV Resistant Polyethylene)' : ' (Polyvinyl Chloride)'),
      'Jacket Thickness': '0.55 ±0.10 mm',
      'Overall Diameter': od,
      'Colour': 'Optional'
    }, extra || {}) },
    { title: 'PHYSICAL CHARACTERISTICS', data: {
      'Temperature Rating': temp,
      'Min Bend Radius (fixed)': '4 × OD',
      'Min Bend Radius (flex)': '8 × OD',
      'Sheath Tensile Strength': '≥10 MPa',
      'Sheath Elongation': '≥125%',
      'Insulation Tensile Strength': '≥10 MPa',
      'Insulation Elongation': '≥200%',
      'Cold Bend': '8 × OD, no cracks @ -20°C'
    } },
    { title: 'ELECTRICAL CHARACTERISTICS', data: {
      'Characteristic Impedance': '100 ±15 Ω',
      'Max DC Resistance (20°C)': '9.5 Ω/100m Max',
      'DC Resistance Unbalance': 'Internal pair: 2%, Between pairs: 4%',
      'Propagation Delay': '≤45 ns/100m',
      'Delay Skew': '≤25 ns/100m',
      'Insulation Resistance': '≥5000 MΩ·km',
      'Capacitance Unbalance': '≤160 pF/100m',
      'Max Operating Frequency': freq
    } },
    { title: 'STANDARDS COMPLIANCE', data: {
      'Category / Class': cat + ' / ' + cls,
      'ISO/IEC': 'ISO/IEC 11801 2nd Edition',
      'ANSI/TIA': 'ANSI/TIA/EIA-568-C.2',
      'EN': 'EN 50173-1, IEC 61156-5',
      'Fire Rating': jacket === 'LSZH' ? 'IEC 60332-1-2, IEC 60754-2' : jacket === 'PE' ? 'N/A (outdoor)' : 'IEC 60332-1-2',
      'Environmental': 'RoHS, REACH'
    } }
  ];
}

function dacSpecs(form, rate, length) {
  return [
    { title: 'SPECIFICATIONS', data: {
      'Type': 'Passive Direct Attach Copper (DAC)',
      'Form Factor': form,
      'Data Rate': rate,
      'Cable': 'Twinax coaxial copper',
      'Available Lengths': length,
      'Power Consumption': '< 0.5W',
      'Operating Temp': '0°C to +70°C',
      'BER': '< 1×10⁻¹²'
    } },
    { title: 'COMPATIBILITY', data: {
      'Protocol': 'IEEE 802.3',
      'MSA': 'SFF-8431 / SFF-8436 / SFF-8665 compliant',
      'Compatible With': 'Cisco, Arista, HPE, Juniper, Dell, Mellanox'
    } },
    { title: 'STANDARDS', data: {
      'Standard': 'MSA compliant, IEEE 802.3',
      'Approvals': 'CE, FCC, RoHS'
    } }
  ];
}

const defaultData = {
  products: [
    // ── CATEGORY 7 CABLES ─────────────────────────────────────
    {
      id: 1, name: 'Cat 7 SFTP LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 7 S/FTP Shielded Foiled LSZH cable with individual pair foil + overall Cu braid. Ideal for high-speed enterprise networks — Class F performance up to 600 MHz.',
      image: BASE+'OP_Cat_7_SFTP_Shielded_Foiled_LSZH_cable_Rev.1.0.1.jpg', slug: 'cat7-sftp-lszh',
      specs: copperCableSpecs('Cat 7', 'Class F', 'Individual pair Al foil + overall tinned Cu braid (≥85%)', 'LSZH', '8.40 ±0.40 mm', '600 MHz')
    },
    {
      id: 2, name: 'Cat 7 SFTP PVC Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 7 S/FTP Shielded Foiled PVC cable — Class F performance with braid + foil shielding for robust indoor structured cabling.',
      image: BASE+'OP_Cat_7_SFTP_Shielded_Foiled_PVC_Cable_Rev.1.0.1.jpg', slug: 'cat7-sftp-pvc',
      specs: copperCableSpecs('Cat 7', 'Class F', 'Individual pair Al foil + overall tinned Cu braid (≥85%)', 'PVC', '8.40 ±0.40 mm', '600 MHz')
    },
    {
      id: 3, name: 'Cat 7 SFTP PE Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 7 S/FTP Shielded Foiled PE cable — UV-resistant outdoor jacket for external runs and direct-burial, Class F performance.',
      image: BASE+'OP_Cat_7_SFTP_Shielded_Foiled_PE_Cable_Rev.1.0.1.jpg', slug: 'cat7-sftp-pe',
      specs: copperCableSpecs('Cat 7', 'Class F', 'Individual pair Al foil + overall tinned Cu braid (≥85%)', 'PE', '8.80 ±0.40 mm', '600 MHz')
    },

    // ── CATEGORY 6A S/FTP ─────────────────────────────────────
    {
      id: 4, name: 'Cat 6a SFTP LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a S/FTP Shielded Foiled LSZH cable — 10G Ethernet at 100m, pair foil + braid shield for maximum EMI immunity. CPR Eca rated.',
      image: BASE+'OP_Cat_6a_SFTP_Shielded_Foiled_LSZH_Cable_Rev.1.0.1.jpg', slug: 'cat6a-sftp-lszh',
      specs: copperCableSpecs('Cat 6A', 'Class EA', 'Individual pair Al foil + overall tinned Cu braid (≥65%)', 'LSZH', '8.50 ±0.40 mm', '500 MHz')
    },
    {
      id: 5, name: 'Cat 6a SFTP PVC Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a S/FTP Shielded Foiled PVC cable for indoor structured cabling with full braid + foil shielding.',
      image: BASE+'OP_Cat_6a_SFTP_Shielded_Foiled_PVC_Cable_Rev.1.0.1.jpg', slug: 'cat6a-sftp-pvc',
      specs: copperCableSpecs('Cat 6A', 'Class EA', 'Individual pair Al foil + overall tinned Cu braid (≥65%)', 'PVC', '8.50 ±0.40 mm', '500 MHz')
    },
    {
      id: 6, name: 'Cat 6a SFTP PE Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a S/FTP Shielded Foiled PE cable for outdoor structured cabling — UV and moisture resistant.',
      image: BASE+'OP_Cat_6a_SFTP_Shielded_Foiled_PE_Cable_Rev.1.0.1.jpg', slug: 'cat6a-sftp-pe',
      specs: copperCableSpecs('Cat 6A', 'Class EA', 'Individual pair Al foil + overall tinned Cu braid (≥65%)', 'PE', '9.00 ±0.40 mm', '500 MHz')
    },

    // ── CATEGORY 6A U/FTP ─────────────────────────────────────
    {
      id: 7, name: 'Cat 6a UFTP LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a U/FTP Unshielded Foiled LSZH cable — lightweight with individual pair foil for flexible high-density 10G installations.',
      image: BASE+'OP_Cat_6a_UFTP_Unshielded_Foiled_LSZH_Cable_Rev.1.0.1.jpg', slug: 'cat6a-uftp-lszh',
      specs: copperCableSpecs('Cat 6A', 'Class EA', 'Individual pair Al foil (Mylar tape)', 'LSZH', '7.80 ±0.40 mm', '500 MHz')
    },
    {
      id: 8, name: 'Cat 6a UFTP PVC Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a U/FTP Unshielded Foiled PVC cable — cost-effective 10G solution for indoor cabling with individual pair foil.',
      image: BASE+'OP_Cat_6a_UFTP_Unshielded_Foiled_PVC_Cable_Rev.1.0.1.jpg', slug: 'cat6a-uftp-pvc',
      specs: copperCableSpecs('Cat 6A', 'Class EA', 'Individual pair Al foil (Mylar tape)', 'PVC', '7.80 ±0.40 mm', '500 MHz')
    },
    {
      id: 9, name: 'Cat 6a UFTP PE Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a U/FTP Unshielded Foiled PE cable for outdoor 10G runs with UV-resistant jacket.',
      image: BASE+'OP_Cat_6a_UFTP_Unshielded_Foiled_PE_Cable_Rev.1.0.1.jpg', slug: 'cat6a-uftp-pe',
      specs: copperCableSpecs('Cat 6A', 'Class EA', 'Individual pair Al foil (Mylar tape)', 'PE', '8.20 ±0.40 mm', '500 MHz')
    },
    {
      id: 41, name: 'Cat 6a UFTP Dca LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a U/FTP LSZH cable with CPR Dca fire classification — individual pair foil, slim design for high-density 10G installations.',
      image: BASE+'OP_Cat_6a_UFTP_Unshielded_Foiled_LSZH_Cable_Rev.1.0.1.jpg', slug: 'cat6a-uftp-dca-lszh',
      specs: copperCableSpecs('Cat 6A', 'Class EA', 'Individual pair Al foil (Mylar tape)', 'LSZH', '7.80 ±0.40 mm', '500 MHz', {'CPR Fire Rating': 'Dca-s2,d1,a1'})
    },

    // ── CATEGORY 6A F/UTP ─────────────────────────────────────
    {
      id: 10, name: 'Cat 6a FUTP LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a F/UTP LSZH cable — overall Al foil shield with drain wire, low-smoke zero-halogen jacket for fire-safe 10G environments.',
      image: BASE+'CAT6A-FUTP-LSZH.jpg', slug: 'cat6a-futp-lszh',
      specs: [
        { title: 'CONSTRUCTION', data: {
          'Conductor': '23 AWG Solid Bare Copper (0.570 ±0.01 mm)',
          'Insulation Material': 'FOPE',
          'Insulation OD': '1.36 ±0.10 mm (Min thickness: 0.39 mm)',
          'Outside-Tape Wrap': 'AL-MYLAR',
          'Screen': 'Overall Al foil + drain wire',
          'Drain Wire': 'Tinned solid copper (1/0.404 ±0.008 mm)',
          'Jacket': 'LSZH (Low Smoke Zero Halogen)',
          'Jacket Thickness': '0.55 ±0.10 mm',
          'Overall Diameter': '7.40 ±0.40 mm',
          'Colour': 'Optional'
        } },
        { title: 'PHYSICAL CHARACTERISTICS', data: {
          'Temperature Rating': '-20°C to +75°C',
          'Cold Bend': '8 × OD, no cracks @ -20 ±2°C × 4',
          'Sheath Tensile Strength': '≥10 MPa',
          'Sheath Elongation': '≥125%',
          'Insulation Tensile Strength': '≥10 MPa',
          'Insulation Elongation': '≥200%',
          'Aging Condition': '100°C ±2°C, 24h, 7d'
        } },
        { title: 'ELECTRICAL CHARACTERISTICS', data: {
          'Characteristic Impedance': '100 ±15 Ω',
          'Propagation Delay': '≤45 Ns/100m',
          'DC Resistance (20°C)': '9.5 Ω/100m Max',
          'DC Resistance Unbalance': 'Internal pair: 2%, Between pairs: 4%',
          'Insulation Resistance': '≥5000 MΩ·km',
          'Capacitance Unbalance': '≤160 pF/100m',
          'Max Frequency': '500 MHz'
        } },
        { title: 'STANDARDS COMPLIANCE', data: {
          'Category / Class': 'Cat 6A / Class EA',
          'ISO/IEC': 'ISO/IEC 11801 2nd Edition',
          'ANSI/TIA': 'ANSI/TIA/EIA-568-C.2',
          'EN': 'EN 50173-1, EN 50288-3-1',
          'Fire': 'IEC 60332-1-2, IEC 60754-2, IEC 61034',
          'CPR Rating': 'Eca',
          'Environmental': 'RoHS, REACH'
        } }
      ]
    },
    {
      id: 11, name: 'Cat 6a FUTP PVC Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a F/UTP PVC cable — overall Al foil with drain wire for general-purpose 10G structured cabling.',
      image: BASE+'CAT6A-FUTP-PVC.jpg', slug: 'cat6a-futp-pvc',
      specs: copperCableSpecs('Cat 6A', 'Class EA', 'Overall Al foil + drain wire', 'PVC', '7.40 ±0.40 mm', '500 MHz')
    },
    {
      id: 12, name: 'Cat 6a FUTP PE Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a F/UTP PE cable for external and direct-burial 10G installations — UV and moisture resistant.',
      image: BASE+'CAT6A-FUTP-PE.jpg', slug: 'cat6a-futp-pe',
      specs: copperCableSpecs('Cat 6A', 'Class EA', 'Overall Al foil + drain wire', 'PE', '7.80 ±0.40 mm', '500 MHz')
    },

    // ── CATEGORY 6A U/UTP ─────────────────────────────────────
    {
      id: 13, name: 'Cat 6a UUTP LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a U/UTP Unshielded LSZH cable — slim profile (≤7.5mm OD) for high-density 10G installations. CPR Eca rated.',
      image: BASE+'OP_Cat_6a_UUTP_Unshielded_LSZH_Cable_Rev.1.0.1.jpg', slug: 'cat6a-uutp-lszh',
      specs: copperCableSpecs('Cat 6A', 'Class EA', 'None (Unshielded)', 'LSZH', '≤7.5 mm', '500 MHz', {'Max Speed': '10 Gbps @ 55m (U/UTP)'})
    },
    {
      id: 14, name: 'Cat 6a UUTP PVC Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a U/UTP Unshielded PVC cable for standard commercial 10G deployments — slim and flexible.',
      image: BASE+'OP_Cat_6a_UUTP_Unshielded_PVC_Cable_Rev.1.0.1.jpg', slug: 'cat6a-uutp-pvc',
      specs: copperCableSpecs('Cat 6A', 'Class EA', 'None (Unshielded)', 'PVC', '≤7.5 mm', '500 MHz', {'Max Speed': '10 Gbps @ 55m (U/UTP)'})
    },
    {
      id: 15, name: 'Cat 6a UUTP PE Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a U/UTP PE cable for outdoor 10G runs — UV-resistant, slim unshielded design.',
      image: BASE+'OP_Cat_6a_UUTP_Unshielded_PE_Cable_Rev.1.0.1.jpg', slug: 'cat6a-uutp-pe',
      specs: copperCableSpecs('Cat 6A', 'Class EA', 'None (Unshielded)', 'PE', '≤7.8 mm', '500 MHz', {'Max Speed': '10 Gbps @ 55m (U/UTP)'})
    },
    {
      id: 42, name: 'Cat 6a UUTP Eca LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a U/UTP LSZH cable with CPR Eca fire classification — unshielded slim design for 10G, European fire standard compliant.',
      image: BASE+'OP_Cat_6a_UUTP_Unshielded_LSZH_Cable_Rev.1.0.1.jpg', slug: 'cat6a-uutp-eca-lszh',
      specs: copperCableSpecs('Cat 6A', 'Class EA', 'None (Unshielded)', 'LSZH', '≤7.5 mm', '500 MHz', {'CPR Fire Rating': 'Eca'})
    },
    {
      id: 43, name: 'Cat 6a UUTP B2ca LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a U/UTP LSZH cable with CPR B2ca fire classification — highest fire resistance for critical environments.',
      image: BASE+'OP_Cat_6a_UUTP_Unshielded_LSZH_Cable_Rev.1.0.1.jpg', slug: 'cat6a-uutp-b2ca-lszh',
      specs: copperCableSpecs('Cat 6A', 'Class EA', 'None (Unshielded)', 'LSZH', '≤7.5 mm', '500 MHz', {'CPR Fire Rating': 'B2ca-s1,d1,a1'})
    },

    // ── CATEGORY 6A F/FTP ─────────────────────────────────────
    {
      id: 16, name: 'Cat 6a FFTP LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6a F/FTP LSZH cable — individual pair foil + overall foil screen for maximum EMI immunity in 10G industrial environments.',
      image: BASE+'CAT6A-FFTP-LSZH.jpg', slug: 'cat6a-fftp-lszh',
      specs: copperCableSpecs('Cat 6A', 'Class EA', 'Individual pair Al foil + overall Al foil screen', 'LSZH', '8.00 ±0.40 mm', '500 MHz')
    },

    // ── CATEGORY 6 S/FTP ──────────────────────────────────────
    {
      id: 17, name: 'Cat 6 FUTP LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6 F/UTP LSZH cable — reliable Gigabit Ethernet with overall foil shield in a low-smoke zero-halogen jacket.',
      image: BASE+'CAT6-FUTP-LSZH.jpg', slug: 'cat6-futp-lszh',
      specs: copperCableSpecs('Cat 6', 'Class E', 'Overall Al foil + drain wire', 'LSZH', '6.90 ±0.30 mm', '250 MHz')
    },
    {
      id: 18, name: 'Cat 6 SFTP LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6 S/FTP LSZH cable — braid + foil shielding for Gigabit performance in EMI-heavy industrial environments.',
      image: BASE+'CAT6-SFTP-LSZH.jpg', slug: 'cat6-sftp-lszh',
      specs: copperCableSpecs('Cat 6', 'Class E', 'Individual pair Al foil + overall tinned Cu braid (≥65%)', 'LSZH', '7.60 ±0.40 mm', '250 MHz')
    },
    {
      id: 44, name: 'Cat 6 SFTP PVC Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6 S/FTP PVC cable — braid + foil shielded Gigabit cable for indoor installations in high-interference areas.',
      image: BASE+'CAT6-SFTP-PVC.jpg', slug: 'cat6-sftp-pvc',
      specs: copperCableSpecs('Cat 6', 'Class E', 'Individual pair Al foil + overall tinned Cu braid (≥65%)', 'PVC', '7.60 ±0.40 mm', '250 MHz')
    },
    {
      id: 45, name: 'Cat 6 SFTP PE Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6 S/FTP PE cable — braid + foil shielded Gigabit cable rated for outdoor and direct-burial installations.',
      image: BASE+'CAT6-SFTP-PE.jpg', slug: 'cat6-sftp-pe',
      specs: copperCableSpecs('Cat 6', 'Class E', 'Individual pair Al foil + overall tinned Cu braid (≥65%)', 'PE', '8.00 ±0.40 mm', '250 MHz')
    },

    // ── CATEGORY 6 U/FTP ──────────────────────────────────────
    {
      id: 46, name: 'Cat 6 UFTP LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6 U/FTP Unshielded Foiled LSZH cable — individual pair foil for Gigabit EMI protection in a low-smoke jacket.',
      image: BASE+'CAT6-UFTP-LSZH.jpg', slug: 'cat6-uftp-lszh',
      specs: copperCableSpecs('Cat 6', 'Class E', 'Individual pair Al foil (Mylar tape)', 'LSZH', '7.00 ±0.30 mm', '250 MHz')
    },
    {
      id: 47, name: 'Cat 6 UFTP PVC Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6 U/FTP Unshielded Foiled PVC cable — individual pair foil, Gigabit performance for indoor PVC installations.',
      image: BASE+'CAT6-UFTP-PVC.jpg', slug: 'cat6-uftp-pvc',
      specs: copperCableSpecs('Cat 6', 'Class E', 'Individual pair Al foil (Mylar tape)', 'PVC', '7.00 ±0.30 mm', '250 MHz')
    },
    {
      id: 48, name: 'Cat 6 UFTP PE Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6 U/FTP Unshielded Foiled PE cable for outdoor Gigabit runs with individual pair foil and UV-resistant jacket.',
      image: BASE+'CAT6-UFTP-PE.jpg', slug: 'cat6-uftp-pe',
      specs: copperCableSpecs('Cat 6', 'Class E', 'Individual pair Al foil (Mylar tape)', 'PE', '7.40 ±0.30 mm', '250 MHz')
    },

    // ── CATEGORY 6 F/UTP ──────────────────────────────────────
    {
      id: 49, name: 'Cat 6 FUTP PVC Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6 F/UTP PVC cable — overall foil shield for Gigabit networks in standard commercial indoor environments.',
      image: BASE+'CAT6-FUTP-PVC.jpg', slug: 'cat6-futp-pvc',
      specs: copperCableSpecs('Cat 6', 'Class E', 'Overall Al foil + drain wire', 'PVC', '6.90 ±0.30 mm', '250 MHz')
    },
    {
      id: 50, name: 'Cat 6 FUTP PE Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6 F/UTP PE cable for outdoor Gigabit runs — overall foil shield with UV-resistant polyethylene jacket.',
      image: BASE+'CAT6-FUTP-PE.jpg', slug: 'cat6-futp-pe',
      specs: copperCableSpecs('Cat 6', 'Class E', 'Overall Al foil + drain wire', 'PE', '7.20 ±0.30 mm', '250 MHz')
    },

    // ── CATEGORY 6 U/UTP ──────────────────────────────────────
    {
      id: 51, name: 'Cat 6 UUTP LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6 U/UTP Unshielded LSZH cable — slim unshielded Gigabit cable with low-smoke zero-halogen jacket. CPR Eca rated.',
      image: BASE+'OP_Cat_6a_UUTP_Unshielded_LSZH_Cable_Rev.1.0.1.jpg', slug: 'cat6-uutp-lszh',
      specs: copperCableSpecs('Cat 6', 'Class E', 'None (Unshielded)', 'LSZH', '6.20 ±0.30 mm', '250 MHz')
    },
    {
      id: 52, name: 'Cat 6 UUTP PVC Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6 U/UTP Unshielded PVC cable — standard Gigabit cabling for commercial offices and buildings.',
      image: BASE+'OP_Cat_6a_UUTP_Unshielded_PVC_Cable_Rev.1.0.1.jpg', slug: 'cat6-uutp-pvc',
      specs: copperCableSpecs('Cat 6', 'Class E', 'None (Unshielded)', 'PVC', '6.20 ±0.30 mm', '250 MHz')
    },
    {
      id: 53, name: 'Cat 6 UUTP PE Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6 U/UTP PE cable for outdoor Gigabit runs — UV-resistant unshielded design for external installations.',
      image: BASE+'OP_Cat_6a_UUTP_Unshielded_PE_Cable_Rev.1.0.1.jpg', slug: 'cat6-uutp-pe',
      specs: copperCableSpecs('Cat 6', 'Class E', 'None (Unshielded)', 'PE', '6.50 ±0.30 mm', '250 MHz')
    },
    {
      id: 54, name: 'Cat 6 UUTP Eca LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6 U/UTP LSZH cable CPR Eca — European fire classification Eca for compliant Gigabit installations.',
      image: BASE+'OP_Cat_6a_UUTP_Unshielded_LSZH_Cable_Rev.1.0.1.jpg', slug: 'cat6-uutp-eca-lszh',
      specs: copperCableSpecs('Cat 6', 'Class E', 'None (Unshielded)', 'LSZH', '6.20 ±0.30 mm', '250 MHz', {'CPR Fire Rating': 'Eca'})
    },
    {
      id: 55, name: 'Cat 6 UUTP Dca LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6 U/UTP LSZH cable CPR Dca — standard European fire classification for general Gigabit cabling.',
      image: BASE+'OP_Cat_6a_UUTP_Unshielded_LSZH_Cable_Rev.1.0.1.jpg', slug: 'cat6-uutp-dca-lszh',
      specs: copperCableSpecs('Cat 6', 'Class E', 'None (Unshielded)', 'LSZH', '6.20 ±0.30 mm', '250 MHz', {'CPR Fire Rating': 'Dca-s2,d1,a1'})
    },
    {
      id: 56, name: 'Cat 6 UUTP B2ca LSZH Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'Cat 6 U/UTP LSZH cable CPR B2ca — highest fire resistance rating for critical safety installations.',
      image: BASE+'OP_Cat_6a_UUTP_Unshielded_LSZH_Cable_Rev.1.0.1.jpg', slug: 'cat6-uutp-b2ca-lszh',
      specs: copperCableSpecs('Cat 6', 'Class E', 'None (Unshielded)', 'LSZH', '6.20 ±0.30 mm', '250 MHz', {'CPR Fire Rating': 'B2ca-s1,d1,a1'})
    },
    {
      id: 57, name: 'OptronicsLITE Cat 6 UUTP PVC Cable', category: 'copper', subcategory: 'COPPER CABLE', price: 0,
      description: 'OptronicsLITE Cat 6 U/UTP PVC — budget-friendly Gigabit cable for cost-sensitive commercial installations without compromising on performance.',
      image: BASE+'OP_Cat_6a_UUTP_Unshielded_PVC_Cable_Rev.1.0.1.jpg', slug: 'cat6-lite-uutp-pvc',
      specs: copperCableSpecs('Cat 6', 'Class E', 'None (Unshielded)', 'PVC', '6.20 ±0.30 mm', '250 MHz', {'Product Line': 'OptronicsLITE — Value Series'})
    },

    // ── ASSEMBLIES ────────────────────────────────────────────
    {
      id: 19, name: 'Copper Patch Cord Cat 6', category: 'copper', subcategory: 'ASSEMBLIES', price: 0,
      description: 'Pre-terminated Cat 6 patch cords — Gigabit Ethernet, available in multiple lengths and colours with gold-plated RJ45 connectors.',
      image: OP+'2017/03/dt-copper.jpg', slug: 'patch-cord-cat6',
      specs: [
        { title: 'SPECIFICATIONS', data: { 'Category': 'Cat 6 / Class E', 'Construction': 'U/UTP', 'Conductor': '26 AWG Stranded Bare Copper', 'Jacket': 'LSZH or PVC', 'Connector': 'RJ45 8P8C', 'Contact Plating': 'Gold 50μ', 'Max Frequency': '250 MHz', 'Data Rate': '1 Gbps @ 100m' } },
        { title: 'AVAILABILITY', data: { 'Lengths': '0.5m, 1m, 1.5m, 2m, 3m, 5m, 7m, 10m', 'Colours': 'Blue, Red, Green, Yellow, Grey, Black, White', 'Boot': 'Snagless moulded boot' } },
        { title: 'STANDARDS', data: { 'Standard': 'IEC 61076-3-104, TIA-568-C.2', 'Approvals': 'CE, RoHS' } }
      ]
    },
    {
      id: 20, name: 'Copper Patch Cord Cat 6a', category: 'copper', subcategory: 'ASSEMBLIES', price: 0,
      description: 'Pre-terminated Cat 6a patch cords for 10G data centre and enterprise connections — shielded and unshielded options.',
      image: OP+'2017/03/dt-copper.jpg', slug: 'patch-cord-cat6a',
      specs: [
        { title: 'SPECIFICATIONS', data: { 'Category': 'Cat 6A / Class EA', 'Construction': 'S/FTP or U/UTP', 'Conductor': '26 AWG Stranded Bare Copper', 'Jacket': 'LSZH or PVC', 'Connector': 'RJ45 8P8C', 'Contact Plating': 'Gold 50μ', 'Max Frequency': '500 MHz', 'Data Rate': '10 Gbps @ 100m' } },
        { title: 'AVAILABILITY', data: { 'Lengths': '0.5m, 1m, 2m, 3m, 5m, 7m, 10m', 'Colours': 'Blue, Red, Green, Yellow, Grey, Black, White', 'Boot': 'Snagless moulded boot' } },
        { title: 'STANDARDS', data: { 'Standard': 'IEC 61076-3-104, TIA-568-C.2', 'Approvals': 'CE, RoHS' } }
      ]
    },
    {
      id: 21, name: 'Copper Patch Cord Cat 7', category: 'copper', subcategory: 'ASSEMBLIES', price: 0,
      description: 'Pre-terminated Cat 7 patch cords with GG45 or RJ45 connectors for Class F / 10G-25G networks.',
      image: OP+'2017/03/dt-copper.jpg', slug: 'patch-cord-cat7',
      specs: [
        { title: 'SPECIFICATIONS', data: { 'Category': 'Cat 7 / Class F', 'Construction': 'S/FTP', 'Conductor': '26 AWG Stranded Bare Copper', 'Jacket': 'LSZH', 'Connector': 'GG45 or RJ45 8P8C', 'Contact Plating': 'Gold 50μ', 'Max Frequency': '600 MHz', 'Data Rate': '10 Gbps @ 100m' } },
        { title: 'AVAILABILITY', data: { 'Lengths': '0.5m, 1m, 2m, 3m, 5m, 10m', 'Boot': 'Snagless moulded boot' } },
        { title: 'STANDARDS', data: { 'Standard': 'IEC 61076-3-104, ISO/IEC 11801', 'Approvals': 'CE, RoHS' } }
      ]
    },

    // ── MANAGEMENT ───────────────────────────────────────────
    {
      id: 22, name: 'Cable Management Tray', category: 'copper', subcategory: 'MANAGEMENT', price: 0,
      description: 'Horizontal cable management trays for organised cabling runs — 1U and 2U rack-mount with finger guides.',
      image: OP+'2017/03/dt-copper.jpg', slug: 'cable-tray',
      specs: [
        { title: 'SPECIFICATIONS', data: { 'Form Factor': '1U / 2U Rack Mount (19")', 'Capacity': 'Up to 48 cables', 'Material': 'Cold-rolled steel', 'Finish': 'Black powder coat', 'Opening': 'Top-entry with brush strip', 'EIA Standard': 'IEC 60297' } }
      ]
    },
    {
      id: 23, name: 'Copper Patch Panel 24-Port Cat 6', category: 'copper', subcategory: 'CONNECTIVITY', price: 0,
      description: '24-port Cat 6 patch panel for 1U rack mounting — 110 IDC punch-down termination, T568A/B dual-labelled.',
      image: OP+'2017/05/3-Optronics-Patch-Panels.jpg', slug: 'patch-panel-24-cat6',
      specs: [
        { title: 'SPECIFICATIONS', data: { 'Category': 'Cat 6 / Class E', 'Ports': '24 × RJ45', 'Form Factor': '1U 19" Rack', 'Termination': '110 IDC / T568A & T568B', 'Contact Plating': 'Gold 50μ', 'Max Frequency': '250 MHz' } },
        { title: 'STANDARDS', data: { 'Standard': 'ISO/IEC 11801, TIA-568-C.2', 'Approvals': 'CE, RoHS' } }
      ]
    },
    {
      id: 24, name: 'Copper Patch Panel 48-Port Cat 6a', category: 'copper', subcategory: 'CONNECTIVITY', price: 0,
      description: '48-port Cat 6a patch panel — high-density 2U shielded solution for 10G structured cabling.',
      image: OP+'2017/05/3-Optronics-Patch-Panels.jpg', slug: 'patch-panel-48-cat6a',
      specs: [
        { title: 'SPECIFICATIONS', data: { 'Category': 'Cat 6A / Class EA', 'Ports': '48 × RJ45', 'Form Factor': '2U 19" Rack', 'Termination': '110 IDC / T568A & T568B', 'Contact Plating': 'Gold 50μ', 'Max Frequency': '500 MHz', 'Shielding': 'Full STP' } },
        { title: 'STANDARDS', data: { 'Standard': 'ISO/IEC 11801, TIA-568-C.2', 'Approvals': 'CE, RoHS' } }
      ]
    },

    // ── CONNECTIVITY ─────────────────────────────────────────
    {
      id: 25, name: 'Keystone Jack Cat 6 UTP', category: 'copper', subcategory: 'CONNECTIVITY', price: 0,
      description: 'Tool-less Cat 6 UTP keystone jack for faceplates and patch panels — quick field termination with dual T568A/B label.',
      image: OP+'2017/05/4-Optronics-Keystone-Jacks.jpg', slug: 'keystone-cat6-utp',
      specs: [
        { title: 'SPECIFICATIONS', data: { 'Category': 'Cat 6 / Class E', 'Type': 'UTP Unshielded', 'Termination': 'T568A/B — Tool-less IDC', 'Contact': 'Gold 50μ', 'Housing': 'Flame-retardant PC', 'Max Frequency': '250 MHz' } },
        { title: 'STANDARDS', data: { 'Standard': 'ISO/IEC 11801, TIA-568-C.2', 'Approvals': 'CE, RoHS' } }
      ]
    },
    {
      id: 26, name: 'Keystone Jack Cat 6a STP', category: 'copper', subcategory: 'CONNECTIVITY', price: 0,
      description: 'Shielded Cat 6a STP keystone jack — 360° shield continuity for 10G installations with tool-less termination.',
      image: OP+'2017/05/4-Optronics-Keystone-Jacks.jpg', slug: 'keystone-cat6a-stp',
      specs: [
        { title: 'SPECIFICATIONS', data: { 'Category': 'Cat 6A / Class EA', 'Type': 'STP Shielded', 'Termination': 'T568A/B — Tool-less IDC', 'Contact': 'Gold 50μ', 'Shield': '360° full metal shield', 'Max Frequency': '500 MHz' } },
        { title: 'STANDARDS', data: { 'Standard': 'ISO/IEC 11801, TIA-568-C.2', 'Approvals': 'CE, RoHS' } }
      ]
    },
    {
      id: 27, name: 'RJ45 Modular Plug Cat 6', category: 'copper', subcategory: 'CONNECTIVITY', price: 0,
      description: 'RJ45 Cat 6 modular plugs with load bar — gold-plated contacts for reliable field-terminated patch cords.',
      image: OP+'2017/05/4-Optronics-Keystone-Jacks.jpg', slug: 'rj45-plug-cat6',
      specs: [
        { title: 'SPECIFICATIONS', data: { 'Category': 'Cat 6 / Class E', 'Type': 'RJ45 8P8C', 'Contact': 'Gold 50μ', 'Housing': 'Clear PC', 'Wire Range': '22–24 AWG (0.5–0.6 mm)', 'Max Frequency': '250 MHz' } },
        { title: 'AVAILABILITY', data: { 'Pack Sizes': '50 pcs, 100 pcs, 500 pcs' } },
        { title: 'STANDARDS', data: { 'Standard': 'IEC 61076-3-104', 'Approvals': 'CE, RoHS' } }
      ]
    },
    {
      id: 28, name: 'Surface Mount Box', category: 'copper', subcategory: 'CONNECTIVITY', price: 0,
      description: 'Single and double surface mount boxes for keystone jacks — ideal for desk and wall outlets.',
      image: OP+'2017/05/4-Optronics-Keystone-Jacks.jpg', slug: 'surface-mount-box',
      specs: [
        { title: 'SPECIFICATIONS', data: { 'Type': '1-port or 2-port', 'Compatible': 'Standard keystone jacks', 'Material': 'ABS Plastic (flame-retardant)', 'Colour': 'White / Ivory', 'Dimensions (1-port)': '70 × 45 × 25 mm', 'Mounting': 'Wall screw mount' } },
        { title: 'STANDARDS', data: { 'Approvals': 'CE, RoHS' } }
      ]
    },

    // ── DATACENTRE ───────────────────────────────────────────
    {
      id: 29, name: 'DAC Cable SFP+ 10G', category: 'copper', subcategory: 'DATACENTRE', price: 0,
      description: 'Direct Attach Copper SFP+ 10G cable — ultra-low latency, low power for top-of-rack switch to server links.',
      image: OP+'2017/03/dt-copper.jpg', slug: 'dac-sfp-10g',
      specs: dacSpecs('SFP+ to SFP+', '10 Gbps', '1m, 2m, 3m, 5m, 7m')
    },
    {
      id: 30, name: 'DAC Cable QSFP+ 40G', category: 'copper', subcategory: 'DATACENTRE', price: 0,
      description: 'Direct Attach Copper QSFP+ 40G cable for high-density top-of-rack switch connections.',
      image: OP+'2017/03/dt-copper.jpg', slug: 'dac-qsfp-40g',
      specs: dacSpecs('QSFP+ to QSFP+', '40 Gbps (4×10G)', '1m, 2m, 3m, 5m')
    },
    {
      id: 31, name: 'DAC Cable QSFP28 100G', category: 'copper', subcategory: 'DATACENTRE', price: 0,
      description: 'Direct Attach Copper QSFP28 100G cable for high-speed data centre spine-leaf switching.',
      image: OP+'2017/03/dt-copper.jpg', slug: 'dac-qsfp28-100g',
      specs: dacSpecs('QSFP28 to QSFP28', '100 Gbps (4×25G)', '1m, 2m, 3m')
    },

    // ── ADDITIONAL ASSEMBLIES ─────────────────────────────────
    { id:58, name:'Cat 6A S/FTP LSZH Patch Cords',    category:'copper', subcategory:'ASSEMBLIES', price:0, slug:'cat6a-sftp-lszh-patch', image:OP+'2017/03/dt-copper.jpg', description:'Pre-terminated Cat 6A S/FTP LSZH patch cords — shielded, low-smoke, available in multiple lengths and colours.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6A / Class EA','Construction':'S/FTP','Conductor':'26 AWG Stranded Copper','Jacket':'LSZH','Connector':'RJ45 8P8C Gold 50μ','Max Frequency':'500 MHz','Data Rate':'10 Gbps @ 100m'}},{title:'AVAILABILITY',data:{'Lengths':'0.5m, 1m, 2m, 3m, 5m, 7m, 10m','Colours':'Blue, Red, Green, Yellow, Grey, Black, White'}},{title:'STANDARDS',data:{'Standard':'IEC 61076-3-104, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:59, name:'Cat 6A S/FTP PVC Patch Cords',    category:'copper', subcategory:'ASSEMBLIES', price:0, slug:'cat6a-sftp-pvc-patch', image:OP+'2017/03/dt-copper.jpg', description:'Pre-terminated Cat 6A S/FTP PVC patch cords — shielded 10G patch cords for data centre and enterprise connections.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6A / Class EA','Construction':'S/FTP','Conductor':'26 AWG Stranded Copper','Jacket':'PVC','Connector':'RJ45 8P8C Gold 50μ','Max Frequency':'500 MHz','Data Rate':'10 Gbps @ 100m'}},{title:'AVAILABILITY',data:{'Lengths':'0.5m, 1m, 2m, 3m, 5m, 7m, 10m','Colours':'Blue, Red, Green, Yellow, Grey, Black, White'}},{title:'STANDARDS',data:{'Standard':'IEC 61076-3-104, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:60, name:'Cat 6 U/UTP LSZH Patch Cords',    category:'copper', subcategory:'ASSEMBLIES', price:0, slug:'cat6-uutp-lszh-patch', image:OP+'2017/03/dt-copper.jpg', description:'Pre-terminated Cat 6 U/UTP LSZH patch cords — Gigabit Ethernet with low-smoke halogen-free jacket.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Construction':'U/UTP','Conductor':'26 AWG Stranded Copper','Jacket':'LSZH','Connector':'RJ45 8P8C Gold 50μ','Max Frequency':'250 MHz','Data Rate':'1 Gbps @ 100m'}},{title:'AVAILABILITY',data:{'Lengths':'0.5m, 1m, 1.5m, 2m, 3m, 5m, 7m, 10m','Colours':'Blue, Red, Green, Yellow, Grey, Black, White'}},{title:'STANDARDS',data:{'Standard':'IEC 61076-3-104, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:61, name:'Cat 6 U/UTP PVC Patch Cords',     category:'copper', subcategory:'ASSEMBLIES', price:0, slug:'cat6-uutp-pvc-patch',  image:OP+'2017/03/dt-copper.jpg', description:'Pre-terminated Cat 6 U/UTP PVC patch cords — standard Gigabit cabling for offices and commercial environments.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Construction':'U/UTP','Conductor':'26 AWG Stranded Copper','Jacket':'PVC','Connector':'RJ45 8P8C Gold 50μ','Max Frequency':'250 MHz','Data Rate':'1 Gbps @ 100m'}},{title:'AVAILABILITY',data:{'Lengths':'0.5m, 1m, 1.5m, 2m, 3m, 5m, 7m, 10m','Colours':'Blue, Red, Green, Yellow, Grey, Black, White'}},{title:'STANDARDS',data:{'Standard':'IEC 61076-3-104, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:62, name:'Cat 6 F/UTP LSZH Patch Cords',    category:'copper', subcategory:'ASSEMBLIES', price:0, slug:'cat6-futp-lszh-patch', image:OP+'2017/03/dt-copper.jpg', description:'Pre-terminated Cat 6 F/UTP LSZH patch cords — foil-shielded Gigabit cords for EMI-sensitive LSZH environments.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Construction':'F/UTP','Conductor':'26 AWG Stranded Copper','Jacket':'LSZH','Connector':'RJ45 8P8C Gold 50μ','Max Frequency':'250 MHz','Data Rate':'1 Gbps @ 100m'}},{title:'AVAILABILITY',data:{'Lengths':'0.5m, 1m, 2m, 3m, 5m, 7m, 10m','Colours':'Blue, Red, Green, Yellow, Grey, Black, White'}},{title:'STANDARDS',data:{'Standard':'IEC 61076-3-104, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:63, name:'Cat 6 F/UTP PVC Patch Cords',     category:'copper', subcategory:'ASSEMBLIES', price:0, slug:'cat6-futp-pvc-patch',  image:OP+'2017/03/dt-copper.jpg', description:'Pre-terminated Cat 6 F/UTP PVC patch cords — foil-shielded Gigabit patch cords for indoor structured cabling.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Construction':'F/UTP','Conductor':'26 AWG Stranded Copper','Jacket':'PVC','Connector':'RJ45 8P8C Gold 50μ','Max Frequency':'250 MHz','Data Rate':'1 Gbps @ 100m'}},{title:'AVAILABILITY',data:{'Lengths':'0.5m, 1m, 2m, 3m, 5m, 7m, 10m','Colours':'Blue, Red, Green, Yellow, Grey, Black, White'}},{title:'STANDARDS',data:{'Standard':'IEC 61076-3-104, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:64, name:'Cat 6A U/UTP LSZH Patch Cords',   category:'copper', subcategory:'ASSEMBLIES', price:0, slug:'cat6a-uutp-lszh-patch',image:OP+'2017/03/dt-copper.jpg', description:'Pre-terminated Cat 6A U/UTP LSZH patch cords — slim unshielded 10G cords with low-smoke jacket.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6A / Class EA','Construction':'U/UTP','Conductor':'26 AWG Stranded Copper','Jacket':'LSZH','Connector':'RJ45 8P8C Gold 50μ','Max Frequency':'500 MHz','Data Rate':'10 Gbps @ 55m (U/UTP)'}},{title:'AVAILABILITY',data:{'Lengths':'0.5m, 1m, 2m, 3m, 5m, 7m, 10m','Colours':'Blue, Red, Green, Yellow, Grey, Black, White'}},{title:'STANDARDS',data:{'Standard':'IEC 61076-3-104, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:65, name:'Cat 6A U/UTP PVC Patch Cords',    category:'copper', subcategory:'ASSEMBLIES', price:0, slug:'cat6a-uutp-pvc-patch', image:OP+'2017/03/dt-copper.jpg', description:'Pre-terminated Cat 6A U/UTP PVC patch cords — slim unshielded 10G patch cords for data centre high-density use.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6A / Class EA','Construction':'U/UTP','Conductor':'26 AWG Stranded Copper','Jacket':'PVC','Connector':'RJ45 8P8C Gold 50μ','Max Frequency':'500 MHz','Data Rate':'10 Gbps @ 55m (U/UTP)'}},{title:'AVAILABILITY',data:{'Lengths':'0.5m, 1m, 2m, 3m, 5m, 7m, 10m','Colours':'Blue, Red, Green, Yellow, Grey, Black, White'}},{title:'STANDARDS',data:{'Standard':'IEC 61076-3-104, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:66, name:'Copper Pre-Terminated Trunk Assemblies', category:'copper', subcategory:'ASSEMBLIES', price:0, slug:'copper-trunk-assemblies', image:OP+'2017/03/dt-copper.jpg', description:'Pre-terminated copper trunk assemblies — multi-pair factory-terminated cables for data centre backbone cabling, reducing installation time.', specs:[{title:'SPECIFICATIONS',data:{'Types':'24-pair, 48-pair trunk assemblies','Connector':'RJ45 or Cat 6A screened','Jacket':'LSZH or PVC','Fire Rating':'LSZH or PVC options','Application':'Data centre backbone, patch bay connections'}},{title:'AVAILABILITY',data:{'Lengths':'Custom — 1m to 30m','Pair Counts':'24-pair, 48-pair'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801, TIA-568-C.2','Approvals':'CE, RoHS'}}] },

    // ── ADDITIONAL MANAGEMENT ─────────────────────────────────
    { id:67, name:'Cat 6A Screened RJ-45 Patch Panel',  category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'patch-panel-cat6a-screened', image:OP+'2017/05/3-Optronics-Patch-Panels.jpg', description:'Cat 6A screened 24-port RJ-45 patch panel — shielded 1U rack panel for 10G Class EA structured cabling.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6A / Class EA','Ports':'24 × RJ45 Screened','Form Factor':'1U 19" Rack','Termination':'110 IDC T568A/B','Contact':'Gold 50μ','Max Frequency':'500 MHz','Shielding':'Full STP'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:68, name:'Cat 6A UTP RJ-45 Patch Panel',       category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'patch-panel-cat6a-utp',     image:OP+'2017/05/3-Optronics-Patch-Panels.jpg', description:'Cat 6A UTP 24-port RJ-45 patch panel — unshielded 1U rack-mount for 10G installations.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6A / Class EA','Ports':'24 × RJ45 UTP','Form Factor':'1U 19" Rack','Termination':'110 IDC T568A/B','Contact':'Gold 50μ','Max Frequency':'500 MHz'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:69, name:'Cat 6 Screened RJ-45 Patch Panel',   category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'patch-panel-cat6-screened',  image:OP+'2017/05/3-Optronics-Patch-Panels.jpg', description:'Cat 6 screened 24-port RJ-45 patch panel — shielded 1U rack panel for Gigabit Class E installations.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Ports':'24 × RJ45 Screened','Form Factor':'1U 19" Rack','Termination':'110 IDC T568A/B','Contact':'Gold 50μ','Max Frequency':'250 MHz','Shielding':'STP'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:70, name:'Cat 6 UTP Tool Free Panel',           category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'patch-panel-cat6-toolsfree',  image:OP+'2017/05/3-Optronics-Patch-Panels.jpg', description:'Cat 6 UTP 24-port tool-free patch panel — quick termination without punch-down tools for Gigabit cabling.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Ports':'24 × RJ45 UTP','Form Factor':'1U 19" Rack','Termination':'Tool-free IDC T568A/B','Contact':'Gold 50μ','Max Frequency':'250 MHz'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:71, name:'Cat 6 24 Port Right Angle Panel',     category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'patch-panel-cat6-right-angle', image:OP+'2017/05/3-Optronics-Patch-Panels.jpg', description:'Cat 6 24-port right-angle patch panel — angled RJ45 ports for improved cable management and airflow.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Ports':'24 × RJ45 (angled)','Form Factor':'1U 19" Rack','Port Angle':'90° right angle','Termination':'110 IDC T568A/B','Max Frequency':'250 MHz'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801','Approvals':'CE, RoHS'}}] },
    { id:72, name:'Cat 6 UTP Patch Panel PCB Type',      category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'patch-panel-cat6-pcb',         image:OP+'2017/05/3-Optronics-Patch-Panels.jpg', description:'Cat 6 UTP PCB-type patch panel — printed circuit board construction for reliable Gigabit terminations.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Ports':'24 × RJ45 UTP','Form Factor':'1U 19" Rack','Construction':'PCB integrated','Termination':'110 IDC T568A/B','Max Frequency':'250 MHz'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801','Approvals':'CE, RoHS'}}] },
    { id:73, name:'Cat 6 UTP Keystone Jack Patch Panel', category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'patch-panel-cat6-keystone',   image:OP+'2017/05/3-Optronics-Patch-Panels.jpg', description:'Cat 6 UTP keystone-loaded 24-port patch panel — accepts standard keystone jacks for flexible port configurations.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Ports':'24 × keystone slots','Form Factor':'1U 19" Rack','Compatible':'Standard keystone jacks','Max Frequency':'250 MHz'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801','Approvals':'CE, RoHS'}}] },
    { id:74, name:'Keystone Patch Panel',                category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'patch-panel-keystone',          image:OP+'2017/05/3-Optronics-Patch-Panels.jpg', description:'Universal keystone patch panel — 24-port 1U rack panel accepting any standard keystone jack for mixed media installations.', specs:[{title:'SPECIFICATIONS',data:{'Ports':'24 × keystone slots','Form Factor':'1U 19" Rack','Compatible':'Universal keystone jacks (Cat 5e/6/6A, fibre)','Material':'Steel, black powder coat'}},{title:'STANDARDS',data:{'Standard':'IEC 60297','Approvals':'CE, RoHS'}}] },
    { id:75, name:'1U Cable Bar With 74mm Hoops',        category:'copper', subcategory:'MANAGEMENT', price:0, slug:'cable-bar-74mm-hoops',          image:OP+'2017/03/dt-copper.jpg', description:'1U horizontal cable management bar with 74mm plastic hoops — keeps patch cords organised and separated.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U 19" Rack','Hoop Size':'74mm','Hoop Material':'ABS Plastic','Material':'Cold-rolled steel, black powder coat','Compatible':'All 19" EIA-310 racks'}},{title:'STANDARDS',data:{'Standard':'IEC 60297','Approvals':'CE, RoHS'}}] },
    { id:76, name:'1U Cable Bar Brush Strip 74mm Hoops', category:'copper', subcategory:'MANAGEMENT', price:0, slug:'cable-bar-brush-strip',          image:OP+'2017/03/dt-copper.jpg', description:'1U cable management bar with brush strip and 74mm hoops — ideal for cable ingress/egress management with dust protection.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U 19" Rack','Hoop Size':'74mm','Feature':'Brush strip for cable entry','Material':'Cold-rolled steel + nylon brush','Compatible':'All 19" EIA-310 racks'}},{title:'STANDARDS',data:{'Standard':'IEC 60297','Approvals':'CE, RoHS'}}] },
    { id:77, name:'1U Keystone 24 Port Angled Panel',    category:'copper', subcategory:'MANAGEMENT', price:0, slug:'keystone-24port-angled',         image:OP+'2017/03/dt-copper.jpg', description:'1U angled 24-port keystone patch panel — angled ports improve cable management and reduce bend radius on patch cords.', specs:[{title:'SPECIFICATIONS',data:{'Ports':'24 × keystone slots (angled)','Form Factor':'1U 19" Rack','Port Angle':'45° angled','Compatible':'Universal keystone jacks','Material':'Steel, black powder coat'}},{title:'STANDARDS',data:{'Standard':'IEC 60297','Approvals':'CE, RoHS'}}] },
    { id:78, name:'1U Cable Bar 12 Slots',               category:'copper', subcategory:'MANAGEMENT', price:0, slug:'cable-bar-12-slots',             image:OP+'2017/03/dt-copper.jpg', description:'1U cable management bar with 12 open slots — lightweight D-ring style for tidy horizontal cable routing.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U 19" Rack','Slots':'12 open D-ring slots','Material':'ABS Plastic + steel mounting ears','Compatible':'All 19" EIA-310 racks'}},{title:'STANDARDS',data:{'Standard':'IEC 60297','Approvals':'CE, RoHS'}}] },

    // ── ADDITIONAL CONNECTIVITY ───────────────────────────────
    { id:79, name:'Cat 6 UTP Euro Module',               category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'cat6-utp-euro-module',     image:OP+'2017/05/4-Optronics-Keystone-Jacks.jpg', description:'Cat 6 UTP Euro module — RJ45 outlet for European-style faceplates with T568A/B termination.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Type':'Euro module (45×45mm)','Termination':'T568A/B IDC','Contact':'Gold 50μ','Max Frequency':'250 MHz','Housing':'Flame-retardant PC'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801','Approvals':'CE, RoHS'}}] },
    { id:80, name:'Flat Type Faceplate',                 category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'faceplate-flat',            image:OP+'2017/05/4-Optronics-Keystone-Jacks.jpg', description:'Flat keystone faceplate — 1, 2, 4 or 6-port wall plate for standard keystone jacks in office and commercial installations.', specs:[{title:'SPECIFICATIONS',data:{'Type':'Flat faceplate','Ports':'1, 2, 4 or 6-port options','Compatible':'Standard keystone jacks','Material':'ABS Plastic','Colour':'White / Ivory','Mounting':'Single-gang back box'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:81, name:'Flat Unloaded Faceplate',             category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'faceplate-flat-unloaded',   image:OP+'2017/05/4-Optronics-Keystone-Jacks.jpg', description:'Flat unloaded faceplate — blank wall plate for custom keystone configurations, ideal for mixed media outlets.', specs:[{title:'SPECIFICATIONS',data:{'Type':'Flat unloaded faceplate','Keystone Slots':'1, 2, 4 or 6','Compatible':'Universal keystone jacks','Material':'ABS Plastic','Colour':'White / Ivory','Mounting':'Single-gang back box'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:82, name:'European Module Type Faceplate',      category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'faceplate-euro-module',     image:OP+'2017/05/4-Optronics-Keystone-Jacks.jpg', description:'European module type faceplate — accommodates 45×45mm Euro modules for wall outlet installations.', specs:[{title:'SPECIFICATIONS',data:{'Type':'Euro module faceplate','Module Size':'45×45mm','Slots':'1 or 2 module','Material':'ABS Plastic','Colour':'White / Ivory','Mounting':'Single-gang back box'}},{title:'STANDARDS',data:{'Standard':'IEC 60603-7','Approvals':'CE, RoHS'}}] },
    { id:83, name:'Cat 6 Loaded European Outlets',       category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'cat6-loaded-euro-outlet',   image:OP+'2017/05/4-Optronics-Keystone-Jacks.jpg', description:'Cat 6 pre-loaded European outlets — faceplate with Cat 6 UTP Euro module pre-installed for rapid deployment.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Type':'Loaded Euro faceplate','Module':'Cat 6 UTP Euro module (included)','Termination':'T568A/B IDC','Contact':'Gold 50μ','Colour':'White / Ivory'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801','Approvals':'CE, RoHS'}}] },
    { id:84, name:'Cat 6A Tool Free UTP Keystone Jack',  category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'cat6a-toolsfree-utp-keystone',image:OP+'2017/05/4-Optronics-Keystone-Jacks.jpg',description:'Cat 6A UTP tool-free keystone jack — snap-down termination without punch-down tool for fast 10G field installation.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6A / Class EA','Type':'UTP Unshielded','Termination':'T568A/B — Tool-free snap-down','Contact':'Gold 50μ','Housing':'Flame-retardant PC','Max Frequency':'500 MHz'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:85, name:'Cat 6A UTP Keystone Jack',            category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'cat6a-utp-keystone',         image:OP+'2017/05/4-Optronics-Keystone-Jacks.jpg', description:'Cat 6A UTP keystone jack — 110 IDC termination for 10G Class EA structured cabling.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6A / Class EA','Type':'UTP Unshielded','Termination':'T568A/B — 110 IDC','Contact':'Gold 50μ','Housing':'Flame-retardant PC','Max Frequency':'500 MHz'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:86, name:'Cat 6A Tool Free Screened Keystone',  category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'cat6a-toolsfree-screened-keystone',image:OP+'2017/05/4-Optronics-Keystone-Jacks.jpg',description:'Cat 6A tool-free screened RJ-45 keystone jack — 360° shielding with snap-down termination for 10G STP installations.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6A / Class EA','Type':'STP Shielded','Termination':'T568A/B — Tool-free','Contact':'Gold 50μ','Shield':'360° metal housing','Max Frequency':'500 MHz'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:87, name:'Cat 6 Tool Free Screened Keystone',   category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'cat6-toolsfree-screened-keystone',image:OP+'2017/05/4-Optronics-Keystone-Jacks.jpg',description:'Cat 6 tool-free screened keystone jack — shielded with snap-down IDC termination for Gigabit STP installations.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Type':'STP Shielded','Termination':'T568A/B — Tool-free','Contact':'Gold 50μ','Shield':'360° metal housing','Max Frequency':'250 MHz'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801','Approvals':'CE, RoHS'}}] },
    { id:88, name:'Cat 6 UTP Keystone Tool Free Jack',   category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'cat6-utp-toolsfree-keystone', image:OP+'2017/05/4-Optronics-Keystone-Jacks.jpg', description:'Cat 6 UTP tool-free keystone jack — IDC snap-down termination for fast Gigabit field installations.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Type':'UTP Unshielded','Termination':'T568A/B — Tool-free IDC','Contact':'Gold 50μ','Housing':'Flame-retardant PC','Max Frequency':'250 MHz'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:89, name:'Angled Unloaded Faceplates',          category:'copper', subcategory:'CONNECTIVITY', price:0, slug:'faceplate-angled-unloaded',  image:OP+'2017/05/4-Optronics-Keystone-Jacks.jpg', description:'Angled unloaded faceplates — tilted angle design for ergonomic keystone outlet positioning on desks and walls.', specs:[{title:'SPECIFICATIONS',data:{'Type':'Angled faceplate','Keystone Slots':'1 or 2','Angle':'30° or 45°','Material':'ABS Plastic','Colour':'White / Ivory','Mounting':'Single-gang back box'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },

    // ── ADDITIONAL DATACENTRE ─────────────────────────────────
    { id:90, name:'Cat 6 U/UTP PVC Micro Patch Cords',  category:'copper', subcategory:'DATACENTRE', price:0, slug:'cat6-micro-pvc',   image:OP+'2017/03/dt-copper.jpg', description:'Cat 6 U/UTP PVC micro patch cords — ultra-short 0.5U high-density patch cords for data centre top-of-rack switching.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Construction':'U/UTP','Conductor':'28 AWG Stranded Copper','Jacket':'PVC (slim OD)','Connector':'RJ45 8P8C Gold 50μ','Available Lengths':'0.15m, 0.2m, 0.3m, 0.5m, 1m','Max Frequency':'250 MHz'}},{title:'STANDARDS',data:{'Standard':'TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:91, name:'Cat 6 U/UTP LSZH Micro Patch Cords', category:'copper', subcategory:'DATACENTRE', price:0, slug:'cat6-micro-lszh',  image:OP+'2017/03/dt-copper.jpg', description:'Cat 6 U/UTP LSZH micro patch cords — slim low-smoke ultra-short cords for fire-compliant high-density data centres.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Construction':'U/UTP','Conductor':'28 AWG Stranded Copper','Jacket':'LSZH (slim OD)','Connector':'RJ45 8P8C Gold 50μ','Available Lengths':'0.15m, 0.2m, 0.3m, 0.5m, 1m','Max Frequency':'250 MHz'}},{title:'STANDARDS',data:{'Standard':'TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:92, name:'Cat 6A U/UTP PVC Micro Patch Cords', category:'copper', subcategory:'DATACENTRE', price:0, slug:'cat6a-micro-pvc',  image:OP+'2017/03/dt-copper.jpg', description:'Cat 6A U/UTP PVC micro patch cords — ultra-short slim 10G cords optimised for high-density data centre environments.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6A / Class EA','Construction':'U/UTP','Conductor':'28 AWG Stranded Copper','Jacket':'PVC (slim OD)','Connector':'RJ45 8P8C Gold 50μ','Available Lengths':'0.15m, 0.2m, 0.3m, 0.5m, 1m','Max Frequency':'500 MHz'}},{title:'STANDARDS',data:{'Standard':'TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:93, name:'Cat 6A U/UTP LSZH Micro Patch Cords',category:'copper', subcategory:'DATACENTRE', price:0, slug:'cat6a-micro-lszh', image:OP+'2017/03/dt-copper.jpg', description:'Cat 6A U/UTP LSZH micro patch cords — slim low-smoke 10G ultra-short cords for fire-safe high-density cabling.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6A / Class EA','Construction':'U/UTP','Conductor':'28 AWG Stranded Copper','Jacket':'LSZH (slim OD)','Connector':'RJ45 8P8C Gold 50μ','Available Lengths':'0.15m, 0.2m, 0.3m, 0.5m, 1m','Max Frequency':'500 MHz'}},{title:'STANDARDS',data:{'Standard':'TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:94, name:'CAT6A 0.5U 180° UTP Slim Panel 24P', category:'copper', subcategory:'DATACENTRE', price:0, slug:'cat6a-slim-panel-24p-180',image:OP+'2017/05/3-Optronics-Patch-Panels.jpg', description:'CAT6A 0.5U 24-port slim patch panel 180° UTP — half-unit height for ultra-high-density data centre patching.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6A / Class EA','Ports':'24 × RJ45 UTP','Form Factor':'0.5U 19" Rack','Port Angle':'180° straight','Max Frequency':'500 MHz','Height':'22mm'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:95, name:'CAT6A 1U 180° UTP Slim Panel 48P',   category:'copper', subcategory:'DATACENTRE', price:0, slug:'cat6a-slim-panel-48p-180',image:OP+'2017/05/3-Optronics-Patch-Panels.jpg', description:'CAT6A 1U 48-port slim patch panel 180° UTP — high-density 10G panel for data centre structured cabling.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6A / Class EA','Ports':'48 × RJ45 UTP','Form Factor':'1U 19" Rack','Port Angle':'180° straight','Max Frequency':'500 MHz'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:96, name:'CAT6 0.5U 90° FTP Slim Panel 24P',   category:'copper', subcategory:'DATACENTRE', price:0, slug:'cat6-slim-panel-24p-90',  image:OP+'2017/05/3-Optronics-Patch-Panels.jpg', description:'CAT6 0.5U 24-port angled slim patch panel 90° FTP — half-unit shielded panel for Gigabit data centre backbone.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6 / Class E','Ports':'24 × RJ45 FTP Screened','Form Factor':'0.5U 19" Rack','Port Angle':'90° angled','Max Frequency':'250 MHz','Shielding':'STP'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801, TIA-568-C.2','Approvals':'CE, RoHS'}}] },
    { id:97, name:'CAT6A 0.5U 90° FTP Slim Panel 24P',  category:'copper', subcategory:'DATACENTRE', price:0, slug:'cat6a-slim-panel-24p-90', image:OP+'2017/05/3-Optronics-Patch-Panels.jpg', description:'CAT6A 0.5U 24-port angled slim patch panel 90° FTP — half-unit 10G shielded panel for high-density data centre installations.', specs:[{title:'SPECIFICATIONS',data:{'Category':'Cat 6A / Class EA','Ports':'24 × RJ45 FTP Screened','Form Factor':'0.5U 19" Rack','Port Angle':'90° angled','Max Frequency':'500 MHz','Shielding':'Full STP'}},{title:'STANDARDS',data:{'Standard':'ISO/IEC 11801, TIA-568-C.2','Approvals':'CE, RoHS'}}] },

    // ── FIBRE OPTIC ───────────────────────────────────────────
    {
      id: 32, name: 'Internal & External Management', category: 'fibre', subcategory: 'INTERNAL MANAGEMENT', price: 0,
      description: 'LGX frames, 1U/2U/4U rack patch panels and ODF enclosures for high-density fibre management — up to 144 fibres in 1U.',
      image: OP+'2017/03/dt-internal-management-2.jpg', slug: 'fibre-management',
      specs: [
        { title: 'SPECIFICATIONS', data: { 'Types': 'LGX frames, rack ODF panels, wall enclosures', 'Capacity': 'Up to 144 fibres / 1U', 'Adapter Types': 'LC, SC, ST, FC, MTP/MPO', 'Polish': 'UPC, APC', 'Form Factors': '19" 1U/2U/4U Rack or wall-mount', 'Fibre Types': 'OS2, OM3, OM4, OM5' } },
        { title: 'STANDARDS', data: { 'Standard': 'IEC 61754, TIA-568', 'Approvals': 'CE, RoHS' } }
      ]
    },
    {
      id: 33, name: 'MPO/MTP Solutions', category: 'fibre', subcategory: 'MPO/MTP® SOLUTIONS', price: 0,
      description: 'High-density MPO/MTP connectivity — cassettes, trunk cables, and fanout assemblies for modern data centres.',
      image: OP+'2017/03/dt-mtp.jpg', slug: 'mpo-mtp',
      specs: [
        { title: 'SPECIFICATIONS', data: { 'Connector': 'MPO/MTP 12F or 24F', 'Polish': 'PC or APC', 'Fibre Types': 'OM3, OM4, OM5, OS2', 'Insertion Loss': '≤0.5 dB (PC) / ≤0.25 dB (APC)', 'Return Loss': '≥20 dB (PC) / ≥60 dB (APC)', 'Cassette Ports': '12× LC Duplex (24F cassette)' } },
        { title: 'STANDARDS', data: { 'Standard': 'IEC 61754-7, TIA-604-18', 'Approvals': 'CE, RoHS' } }
      ]
    },
    {
      id: 34, name: 'Multi-Fibre Assemblies', category: 'fibre', subcategory: 'MULTI-FIBRE ASSEMBLIES', price: 0,
      description: 'Pre-terminated multi-fibre trunk cables and breakout assemblies — 12F to 144F for fast data centre deployment.',
      image: OP+'2017/03/dt-multifibre.jpg', slug: 'multi-fibre-assemblies',
      specs: [
        { title: 'SPECIFICATIONS', data: { 'Fibre Count': '12F, 24F, 48F, 96F, 144F', 'Connector Types': 'MPO, MTP, LC, SC', 'Fibre Types': 'OM3, OM4, OM5, OS2', 'Jacket': 'LSZH or PVC', 'Available Lengths': '3m – 100m (custom)' } },
        { title: 'PERFORMANCE', data: { 'Attenuation (MM@850nm)': '≤0.35 dB', 'Attenuation (SM@1310nm)': '≤0.4 dB' } },
        { title: 'STANDARDS', data: { 'Standard': 'IEC 60794, TIA-568', 'Approvals': 'CE, RoHS' } }
      ]
    },
    {
      id: 35, name: 'Fibre Optic Cable', category: 'fibre', subcategory: 'FIBRE OPTIC CABLE', price: 0,
      description: 'Single-mode (OS2) and multimode (OM3/OM4/OM5) fibre optic cables — indoor, outdoor, and armoured variants.',
      image: OP+'2017/03/op-fibre-optic-cable.jpg', slug: 'fibre-optic-cable',
      specs: [
        { title: 'FIBRE TYPES', data: { 'OS2 Single-mode': 'G.652D, G.657A1, G.657A2 — 9/125μm', 'OM3 Multimode': '50/125μm — 10G @ 300m', 'OM4 Multimode': '50/125μm — 10G @ 400m', 'OM5 Multimode': '50/125μm — wideband SWDM' } },
        { title: 'CABLE SPECIFICATIONS', data: { 'Fibre Count': '2F – 288F', 'Jacket Options': 'LSZH, PVC, PE, Armoured', 'Attenuation (SM)': '≤0.35 dB/km @ 1310nm', 'Attenuation (MM)': '≤3.5 dB/km @ 850nm', 'Min Bend Radius': '10× OD (installation)', 'Operating Temp': '-40°C to +70°C' } },
        { title: 'STANDARDS', data: { 'Standard': 'IEC 60794-3, ITU-T G.652', 'Approvals': 'CPR Dca/Eca, RoHS' } }
      ]
    },
    {
      id: 36, name: 'Fibre Optic Components', category: 'fibre', subcategory: 'FIBRE OPTIC COMPONENTS', price: 0,
      description: 'LC, SC, ST, FC, E2000 and MTP connectors, adapters, attenuators and splitters for complete fibre network termination.',
      image: OP+'2017/03/op-fibre-optic-components.jpg', slug: 'fibre-components',
      specs: [
        { title: 'CONNECTORS', data: { 'Types': 'LC, SC, ST, FC, E2000, MTP', 'Polish': 'UPC, APC, PC', 'Ferrule': 'Zirconia ceramic', 'Insertion Loss': '≤0.2 dB (UPC) / ≤0.1 dB (APC)', 'Return Loss': '≥50 dB (UPC) / ≥65 dB (APC)' } },
        { title: 'ADAPTERS & ACCESSORIES', data: { 'Adapter Types': 'LC, SC, ST, FC — simplex & duplex', 'Attenuators': 'Fixed (1–20 dB), variable', 'Splitters': 'PLC 1×2 to 1×64' } },
        { title: 'STANDARDS', data: { 'Standard': 'IEC 61754, TIA-604', 'Approvals': 'CE, RoHS' } }
      ]
    },
    {
      id: 37, name: 'Telecom Solutions', category: 'fibre', subcategory: 'TELECOM SOLUTIONS', price: 0,
      description: 'FTTA and FTTx outside plant fibre solutions — ADSS, Figure-8, duct cables, splice closures and distribution boxes.',
      image: OP+'2017/04/op-telecom.jpg', slug: 'telecom-fibre',
      specs: [
        { title: 'APPLICATIONS', data: { 'Use Cases': 'FTTA, FTTx, FTTH, FTTB, FTTC', 'Cable Types': 'ADSS, Figure-8, Duct, Micro-duct', 'Installation': 'Aerial, duct, direct-burial' } },
        { title: 'CABLE SPECIFICATIONS', data: { 'Fibre Types': 'OS2 G.652D, G.657A1, G.657A2', 'Fibre Count': '2F – 288F', 'Closure Types': 'Dome and in-line splice closures', 'NAP': 'Distribution and NAP closures' } },
        { title: 'STANDARDS', data: { 'Standard': 'ITU-T G.652, IEC 60794-1', 'Approvals': 'RoHS' } }
      ]
    },
    {
      id: 38, name: 'Active Components', category: 'fibre', subcategory: 'ACTIVE COMPONENTS', price: 0,
      description: 'Optical transceivers: 400G QSFP-DD, 100G QSFP28, 25G SFP28, 10G SFP+ — multi-vendor compatible.',
      image: OP+'2020/08/active-components.jpg', slug: 'active-components',
      specs: [
        { title: 'FORM FACTORS & RATES', data: { 'SFP (1G)': '1000BASE-SX/LX/ZX — up to 80km', 'SFP+ (10G)': '10GBASE-SR/LR/ER/ZR — up to 80km', 'SFP28 (25G)': '25G SR/LR/ER', 'QSFP+ (40G)': '40G SR4/LR4', 'QSFP28 (100G)': '100G SR4/LR4/CWDM4/PSM4', 'QSFP-DD (400G)': '400G SR8/LR8/FR4' } },
        { title: 'SPECIFICATIONS', data: { 'Wavelengths': '850nm, 1310nm, 1550nm, CWDM, DWDM', 'Fibre': 'OM3/OM4 MM or OS2 SM', 'Connector': 'LC Duplex or MPO', 'Power': '<1W – 3.5W', 'Compatibility': 'Cisco, HPE, Arista, Juniper, Dell' } },
        { title: 'STANDARDS', data: { 'Standard': 'IEEE 802.3, MSA compliant', 'Approvals': 'CE, FCC, RoHS' } }
      ]
    },
    {
      id: 39, name: 'Active Equipment', category: 'fibre', subcategory: 'ACTIVE EQUIPMENT', price: 0,
      description: 'L2/L3 managed switches, media converters and KVM systems for data centres and enterprise networks.',
      image: OP+'2020/08/active-equipment.jpg', slug: 'active-equipment',
      specs: [
        { title: 'SPECIFICATIONS', data: { 'Types': 'L2/L3 Managed Switches, Media Converters, KVM', 'Port Speeds': '1G, 10G, 25G, 40G, 100G', 'PoE': 'PoE, PoE+, PoE++ options', 'Management': 'Web GUI, CLI, SNMP, REST API', 'Redundancy': 'Dual PSU, stacking support', 'Capacity': 'Up to 3.2 Tbps switching' } },
        { title: 'STANDARDS', data: { 'Warranty': '1–3 years', 'Approvals': 'CE, FCC, RoHS' } }
      ]
    },
    {
      id: 40, name: 'Active Optical Cables (AOC)', category: 'fibre', subcategory: 'ACTIVE OPTICAL CABLES', price: 0,
      description: 'High-speed AOC cables for short-range data centre interconnects — lighter and lower power than copper DAC.',
      image: OP+'2020/08/aoc.jpg', slug: 'aoc',
      specs: [
        { title: 'SPECIFICATIONS', data: { 'Form Factors': 'SFP+ AOC, QSFP+ AOC, QSFP28 AOC', 'Data Rates': '10G, 40G, 100G', 'Fibre Inside': 'OM3 Multimode 50/125μm', 'Connector': 'SFP+ / QSFP+ / QSFP28', 'Power': '<1W per side', 'BER': '<1×10⁻¹²' } },
        { title: 'AVAILABILITY', data: { 'Lengths': '1m, 2m, 3m, 5m, 7m, 10m, 15m, 20m, 30m', 'Reach': 'Up to 100m (OM3/OM4)', 'Compatibility': 'Multi-vendor MSA compliant' } },
        { title: 'STANDARDS', data: { 'Standard': 'MSA compliant, IEEE 802.3', 'Approvals': 'CE, FCC, RoHS' } }
      ]
    },
    // ── HDCi® ──────────────────────────────────────────────────
    { id:98,  name:'HDCi® LX3 High Density 1U Patch Panel', category:'hdci', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'hdci-lx3-1u', image:OP+'2022/09/HDCI-LX3-High-Density-Patch-Panels.jpg', description:'HDCi® LX3 1U high-density patch panel — up to 72 LC duplex fibres per RU for data centre HDCi installations.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U 19" Rack','Panel':'LX3 HDCi®','Max Capacity':'72 Fibres LC Duplex','Tray':'Sliding, locking positions','Top Design':'Split-top, improved strain relief'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:99,  name:'HDCi® LX3 High Density 2U Patch Panel', category:'hdci', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'hdci-lx3-2u', image:OP+'2022/09/HDCI-LX3-High-Density-Patch-Panels.jpg', description:'HDCi® LX3 2U high-density patch panel — up to 144 LC duplex fibres in two rack units.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'2U 19" Rack','Panel':'LX3 HDCi®','Max Capacity':'144 Fibres LC Duplex','Tray':'Sliding, locking positions'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:100, name:'HDCi® LX3 High Density 3U Patch Panel', category:'hdci', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'hdci-lx3-3u', image:OP+'2022/09/HDCI-LX3-High-Density-Patch-Panels.jpg', description:'HDCi® LX3 3U high-density patch panel — up to 216 LC duplex fibres for high-density backbone connectivity.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'3U 19" Rack','Panel':'LX3 HDCi®','Max Capacity':'216 Fibres LC Duplex','Tray':'Sliding, locking positions'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:101, name:'HDCi® LX3 High Density 4U Patch Panel', category:'hdci', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'hdci-lx3-4u', image:OP+'2022/09/HDCI-LX3-High-Density-Patch-Panels.jpg', description:'HDCi® LX3 4U high-density patch panel — up to 288 LC duplex fibres for maximum-density data centre installations.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'4U 19" Rack','Panel':'LX3 HDCi®','Max Capacity':'288 Fibres LC Duplex','Tray':'Sliding, locking positions'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:102, name:'HDCi® LX5 High Density 1U Patch Panel', category:'hdci', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'hdci-lx5-1u', image:OP+'2018/02/1U-hdci-panel.jpg', description:'HDCi® LX5 1U high-density patch panel — 12-adaptor panel supporting SC/LC/E2000 in a compact 1U form factor.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U 19" Rack','Panel':'LX5 HDCi®','Adaptors':'12 Duplex LC/SC/E2000','Tray':'Sliding, locking positions'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:103, name:'HDCi® LX5 High Density 2U Patch Panel', category:'hdci', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'hdci-lx5-2u', image:OP+'2018/02/2U-hdci-panel.jpg', description:'HDCi® LX5 2U high-density patch panel — 24 adaptors (LC/SC/E2000) for structured fibre management.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'2U 19" Rack','Panel':'LX5 HDCi®','Adaptors':'24 Duplex LC/SC/E2000','Tray':'Sliding, locking positions'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:104, name:'HDCi® LX5 High Density 4U Patch Panel', category:'hdci', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'hdci-lx5-4u', image:OP+'2018/02/4U-hdci-panel.jpg', description:'HDCi® LX5 4U high-density patch panel — 48 adaptors for maximum-density structured fibre cabling.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'4U 19" Rack','Panel':'LX5 HDCi®','Adaptors':'48 Duplex LC/SC/E2000','Tray':'Sliding, locking positions'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:105, name:'MTP® 24 Fibres Ferrule Cable Assembly',  category:'hdci', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'mtp-24f-ferrule', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'MTP® 24-fibre ferrule cable assembly — high-density MPO/MTP pre-terminated trunk for HDCi data centre backbone cabling.', specs:[{title:'SPECIFICATIONS',data:{'Connector':'MTP® (24-fibre ferrule)','Fibres':'24','Fibre Type':'OM3/OM4 Multimode or OS2 Singlemode','Jacket':'LSZH or PVC','Application':'HDCi high-density backbone'}},{title:'STANDARDS',data:{'Standard':'IEC 61754-7','Approvals':'CE, RoHS'}}] },
    { id:106, name:'MTP® MicroCable Patch Assemblies',       category:'hdci', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'mtp-microcable-patch', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'MTP® MicroCable patch assemblies — ultra-slim MPO/MTP pre-terminated patch cords for high-density HDCi connectivity.', specs:[{title:'SPECIFICATIONS',data:{'Connector':'MTP® Male/Female','Construction':'MicroCable (slim OD)','Fibres':'12 or 24','Fibre Type':'OM3/OM4 or OS2','Application':'High-density patching'}},{title:'STANDARDS',data:{'Standard':'IEC 61754-7','Approvals':'CE, RoHS'}}] },
    { id:107, name:'MTP® Ruggedised Pigtails',               category:'hdci', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'mtp-ruggedised-pigtails', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'MTP® ruggedised pigtails — reinforced MTP/MPO pigtails for harsh environments and high-use HDCi data centre applications.', specs:[{title:'SPECIFICATIONS',data:{'Connector':'MTP® (one end), loose fibres (other)','Construction':'Ruggedised with aramid yarn','Fibres':'12','Fibre Type':'OM3/OM4 or OS2','Jacket':'LSZH'}},{title:'STANDARDS',data:{'Standard':'IEC 61754-7','Approvals':'CE, RoHS'}}] },
    { id:108, name:'MTP® MicroCable Trunk Assemblies',       category:'hdci', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'mtp-microcable-trunk', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'MTP® MicroCable trunk assemblies — ultra-slim factory-terminated trunk cables for space-efficient HDCi backbone installations.', specs:[{title:'SPECIFICATIONS',data:{'Connectors':'MTP® Male/Female both ends','Construction':'MicroCable single jacket','Fibres':'12 or 24','Lengths':'5m to 100m custom','Application':'Data centre backbone'}},{title:'STANDARDS',data:{'Standard':'IEC 61754-7','Approvals':'CE, RoHS'}}] },
    { id:109, name:'MTP® Nano Ruggedised Trunk Assemblies',  category:'hdci', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'mtp-nano-ruggedised-trunk', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'MTP® Nano ruggedised trunk cable assemblies — ultra-compact reinforced trunk for extreme density HDCi installations.', specs:[{title:'SPECIFICATIONS',data:{'Connectors':'MTP® Male/Female both ends','Construction':'Nano cable, ruggedised','Fibres':'12','Jacket':'LSZH','Application':'Ultra high-density data centre'}},{title:'STANDARDS',data:{'Standard':'IEC 61754-7','Approvals':'CE, RoHS'}}] },

    // ── UHDCi® ─────────────────────────────────────────────────
    { id:110, name:'UHDCi® LX4 High Density 1U Patch Panel', category:'uhdci', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'uhdci-lx4-1u', image:OP+'2022/09/High-Density-Fibre-Optic-Circuit-Flexplane.jpg', description:'UHDCi® LX4 1U ultra-high-density patch panel — maximises adaptor density per RU, engineered for Hyperscale data centres.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U 19" Rack','Panel':'UHDCi® LX4','Tray':'Sliding, locking positions','Top Design':'Split-top, improved cable management','Mounting':'Universal hardware for cassette modules'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:111, name:'UHDCi® LX4 High Density 2U Patch Panel', category:'uhdci', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'uhdci-lx4-2u', image:OP+'2022/09/High-Density-Fibre-Optic-Circuit-Flexplane.jpg', description:'UHDCi® LX4 2U ultra-high-density patch panel — double-density Hyperscale data centre fibre management.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'2U 19" Rack','Panel':'UHDCi® LX4','Tray':'Sliding, locking positions','Mounting':'Universal hardware for cassette modules'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:112, name:'UHDCi® LX4 High Density 3U Patch Panel', category:'uhdci', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'uhdci-lx4-3u', image:OP+'2022/09/High-Density-Fibre-Optic-Circuit-Flexplane.jpg', description:'UHDCi® LX4 3U ultra-high-density patch panel — triple-density Hyperscale configuration for maximum fibre concentration.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'3U 19" Rack','Panel':'UHDCi® LX4','Tray':'Sliding, locking positions','Mounting':'Universal hardware for cassette modules'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:113, name:'UHDCi® LX4 High Density 4U Patch Panel', category:'uhdci', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'uhdci-lx4-4u', image:OP+'2022/09/High-Density-Fibre-Optic-Circuit-Flexplane.jpg', description:'UHDCi® LX4 4U ultra-high-density patch panel — maximum-density Hyperscale configuration with splice tray support.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'4U 19" Rack','Panel':'UHDCi® LX4','Tray':'Sliding, locking positions','Feature':'Splice tray storage support'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:114, name:'Ultra HDCi® MLX4 MPO/MTP® Cassette Module', category:'uhdci', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'uhdci-mlx4-cassette', image:OP+'2022/11/Data-Centre-SN%C2%AE-Ultra-HDCi%C2%AE-LX4-High-Density-Patch-Panel-Cassette.jpg', description:'Ultra HDCi® MLX4 MPO/MTP® cassette module — plug-in module for LX4 panels converting MTP trunk to LC duplex adaptors.', specs:[{title:'SPECIFICATIONS',data:{'Type':'Push-fit cassette module','Connectors':'MTP® (rear) × 12/24 LC duplex (front)','Fibres':'12 per cassette','Compatible Panels':'UHDCi® LX4','Fibre Type':'OM3/OM4 or OS2'}},{title:'STANDARDS',data:{'Standard':'IEC 61754-7','Approvals':'CE, RoHS'}}] },
    { id:115, name:'LC-SN® Uniboot Duplex Patch Cord',        category:'uhdci', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'lc-sn-uniboot-patch', image:OP+'2017/04/optical-fibre-assemblies.jpg', description:'LC-SN® Uniboot Duplex Patch Cord — slim push-pull single-boot patch cord for ultra-high-density UHDCi data centre switching.', specs:[{title:'SPECIFICATIONS',data:{'Connector A':'LC Uniboot','Connector B':'SN® Duplex','Construction':'Slim single-jacket duplex','Fibre Type':'OM4/OM5 or OS2','Feature':'Push-pull tab for easy removal'}},{title:'STANDARDS',data:{'Standard':'IEC 61754-20','Approvals':'CE, RoHS'}}] },

    // ── FIBRE — INTERNAL MANAGEMENT ────────────────────────────
    { id:116, name:'LX1 High Density LGX 1.5U Patch Panel', category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'lx1-lgx-1-5u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'LX1 High Density LGX 1.5U patch panel — compact fibre management panel with LGX-style tray for structured cabling rooms.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1.5U 19" Rack','Type':'LGX high-density','Tray':'Sliding LGX tray'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:117, name:'LX1 High Density LGX 2U Patch Panel',   category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'lx1-lgx-2u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'LX1 High Density LGX 2U patch panel — 2U LGX-tray fibre management for MDF and IDF applications.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'2U 19" Rack','Type':'LGX high-density','Tray':'Sliding LGX tray'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:118, name:'LX2 High Density LGX 4U Patch Panel',   category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'lx2-lgx-4u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'LX2 High Density LGX 4U patch panel — high-capacity 4U fibre management for large structured cabling installations.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'4U 19" Rack','Type':'LX2 LGX high-density','Tray':'Multiple sliding LGX trays'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:119, name:'HDCi® LX3 1U Patch Panel (Fibre)',      category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'f-hdci-lx3-1u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'HDCi® LX3 1U high-density patch panel — 72 LC duplex fibres per RU for data centre fibre backbone.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U 19" Rack','Panel':'LX3 HDCi®','Max Capacity':'72 Fibres LC Duplex'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:120, name:'HDCi® LX3 2U Patch Panel (Fibre)',      category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'f-hdci-lx3-2u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'HDCi® LX3 2U high-density patch panel — 144 LC duplex fibres for data centre fibre management.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'2U 19" Rack','Panel':'LX3 HDCi®','Max Capacity':'144 Fibres LC Duplex'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:121, name:'HDCi® LX3 3U Patch Panel (Fibre)',      category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'f-hdci-lx3-3u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'HDCi® LX3 3U high-density patch panel — 216 LC duplex fibres for large data centre installations.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'3U 19" Rack','Panel':'LX3 HDCi®','Max Capacity':'216 Fibres LC Duplex'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:122, name:'HDCi® LX3 4U Patch Panel (Fibre)',      category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'f-hdci-lx3-4u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'HDCi® LX3 4U high-density patch panel — 288 LC duplex fibres, maximum-density data centre backbone.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'4U 19" Rack','Panel':'LX3 HDCi®','Max Capacity':'288 Fibres LC Duplex'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:123, name:'UHDCi® LX4 1U Patch Panel (Fibre)',     category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'f-uhdci-lx4-1u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'UHDCi® LX4 1U ultra-high-density patch panel — maximises density for Hyperscale data centre patching.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U 19" Rack','Panel':'UHDCi® LX4','Mounting':'Universal cassette hardware'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:124, name:'UHDCi® LX4 2U Patch Panel (Fibre)',     category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'f-uhdci-lx4-2u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'UHDCi® LX4 2U ultra-high-density patch panel — Hyperscale fibre management with double-density capacity.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'2U 19" Rack','Panel':'UHDCi® LX4','Mounting':'Universal cassette hardware'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:125, name:'UHDCi® LX4 3U Patch Panel (Fibre)',     category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'f-uhdci-lx4-3u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'UHDCi® LX4 3U ultra-high-density patch panel — triple-density Hyperscale fibre backbone management.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'3U 19" Rack','Panel':'UHDCi® LX4','Mounting':'Universal cassette hardware'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:126, name:'UHDCi® LX4 4U Patch Panel (Fibre)',     category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'f-uhdci-lx4-4u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'UHDCi® LX4 4U ultra-high-density patch panel — maximum-density Hyperscale patching with splice tray support.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'4U 19" Rack','Panel':'UHDCi® LX4','Feature':'Splice tray storage'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:127, name:'LX5 High Density 1U Patch Panel',       category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'lx5-1u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'LX5 High Density 1U patch panel — 12 duplex LC/SC/E2000 adaptors in a 1U form factor for structured fibre cabling.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U 19" Rack','Panel':'LX5','Adaptors':'12 Duplex LC/SC/E2000'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:128, name:'LX5 High Density 2U Patch Panel',       category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'lx5-2u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'LX5 High Density 2U patch panel — 24 duplex adaptor slots in 2U for medium-density fibre installations.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'2U 19" Rack','Panel':'LX5','Adaptors':'24 Duplex LC/SC/E2000'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:129, name:'LX5 High Density 4U Patch Panel',       category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'lx5-4u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'LX5 High Density 4U patch panel — 48 duplex adaptor slots for high-capacity fibre distribution frames.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'4U 19" Rack','Panel':'LX5','Adaptors':'48 Duplex LC/SC/E2000'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:130, name:'SW1 Swivel 1U Patch Panel',             category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'sw1-swivel-1u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'SW1 Swivel 1U patch panel — 180° swivel design allowing front and rear access without disconnecting fibres.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U 19" Rack','Type':'Swivel SW1','Rotation':'180° swivel','Access':'Front and rear simultaneous'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:131, name:'SW1 Swivel 2U Patch Panel',             category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'sw1-swivel-2u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'SW1 Swivel 2U patch panel — 180° swivel tray for easy front and rear fibre access in 2U form factor.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'2U 19" Rack','Type':'Swivel SW1','Rotation':'180° swivel'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:132, name:'SW1 Swivel 3U Patch Panel',             category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'sw1-swivel-3u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'SW1 Swivel 3U patch panel — 180° swivel tray for high-capacity fibre management with easy access.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'3U 19" Rack','Type':'Swivel SW1','Rotation':'180° swivel'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:133, name:'SW1 Swivel 4U Patch Panel',             category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'sw1-swivel-4u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'SW1 Swivel 4U patch panel — maximum-capacity 180° swivel fibre panel for large installations.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'4U 19" Rack','Type':'Swivel SW1','Rotation':'180° swivel'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:134, name:'SW2 Swivel 1U Patch Panel',             category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'sw2-swivel-1u', image:OP+'2017/04/dt-internal-management-2.jpg', description:'SW2 Swivel 1U patch panel — enhanced swivel design with improved fibre routing for compact installations.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U 19" Rack','Type':'Swivel SW2','Rotation':'180° swivel','Feature':'Enhanced fibre routing'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:135, name:'PS1 1U Sliding Panel 24P SC/LC/E2000',  category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'ps1-sliding-1u-sc-lc', image:OP+'2017/04/dt-internal-management-2.jpg', description:'PS1 1U sliding patch panel — 24-position SC/LC/E2000 with smooth sliding tray for easy access.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U 19" Rack','Type':'PS1 Sliding','Positions':'24','Compatible':'SC, LC, E2000 adaptors'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:136, name:'PS2 1U Sliding Panel 24P ST/FC',        category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'ps2-sliding-1u-st-fc', image:OP+'2017/04/dt-internal-management-2.jpg', description:'PS2 1U sliding patch panel — 24-position ST/FC for legacy fibre installations requiring sliding tray access.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U 19" Rack','Type':'PS2 Sliding','Positions':'24','Compatible':'ST, FC adaptors'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:137, name:'PS3 1U Sliding Panel 24P SC Duplex/LC Quad', category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'ps3-sliding-1u-sc-lc-quad', image:OP+'2017/04/dt-internal-management-2.jpg', description:'PS3 1U sliding patch panel — 24-position SC Duplex/LC Quad high-density sliding panel for mixed connector types.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U 19" Rack','Type':'PS3 Sliding','Positions':'24','Compatible':'SC Duplex, LC Quad adaptors'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:138, name:'Fibre Optic Management Spool',          category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'fibre-management-spool', image:OP+'2017/04/dt-internal-management-2.jpg', description:'Fibre optic management spool — 1U rack-mount spool for storing and managing excess fibre lengths inside cabinets.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U 19" Rack','Type':'Cable storage spool','Material':'Powder-coated steel'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:139, name:'Fibre Optic Splice Cassette',           category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'splice-cassette', image:OP+'2017/04/dt-internal-management-2.jpg', description:'Fibre optic splice cassette — heat-shrink or mechanical splice storage cassette for LX-series patch panels.', specs:[{title:'SPECIFICATIONS',data:{'Capacity':'12 or 24 splices','Compatible':'LX1/LX2/LX3 series panels','Splice Type':'Heat-shrink or mechanical'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:140, name:'Fibre Optic Splice Cassette LX5',       category:'fibre', subcategory:'INTERNAL MANAGEMENT', price:0, slug:'splice-cassette-lx5', image:OP+'2017/04/dt-internal-management-2.jpg', description:'Fibre optic splice cassette for LX5 series — optimised splice storage module for LX5 high-density patch panels.', specs:[{title:'SPECIFICATIONS',data:{'Capacity':'12 splices','Compatible':'LX5 series panels','Splice Type':'Heat-shrink or mechanical'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },

    // ── FIBRE — EXTERNAL MANAGEMENT ────────────────────────────
    { id:141, name:'Din Rail Termination Box',              category:'fibre', subcategory:'EXTERNAL MANAGEMENT', price:0, slug:'din-rail-termination-box', image:OP+'2017/04/dt-internal-management-2.jpg', description:'Din Rail termination box — DIN rail-mounted fibre termination enclosure for industrial and outdoor distribution applications.', specs:[{title:'SPECIFICATIONS',data:{'Mounting':'DIN rail','Material':'ABS/Polycarbonate','IP Rating':'IP65','Fibres':'Up to 12'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:142, name:'TB4 24 Fibre Lockable Indoor FTTH Box', category:'fibre', subcategory:'EXTERNAL MANAGEMENT', price:0, slug:'tb4-24f-ftth-box', image:OP+'2017/04/dt-internal-management-2.jpg', description:'TB4 24-fibre lockable indoor FTTH termination box — wall-mount distribution box for fibre-to-the-home indoor termination.', specs:[{title:'SPECIFICATIONS',data:{'Capacity':'24 fibres','Mounting':'Wall-mount','Feature':'Lockable lid','Application':'Indoor FTTH termination','IP Rating':'IP20'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:143, name:'TB5 4 Fibre Indoor FTTH Termination Box', category:'fibre', subcategory:'EXTERNAL MANAGEMENT', price:0, slug:'tb5-4f-ftth-box', image:OP+'2017/04/dt-internal-management-2.jpg', description:'TB5 4-fibre indoor FTTH termination box — compact subscriber-side termination box for FTTH drop cable connections.', specs:[{title:'SPECIFICATIONS',data:{'Capacity':'4 fibres','Mounting':'Wall-mount','Application':'FTTH subscriber termination','IP Rating':'IP20'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:144, name:'TB6 8 Fibre Indoor FTTH Termination Box', category:'fibre', subcategory:'EXTERNAL MANAGEMENT', price:0, slug:'tb6-8f-ftth-box', image:OP+'2017/04/dt-internal-management-2.jpg', description:'TB6 8-fibre indoor FTTH termination box — mid-capacity subscriber distribution box for FTTH installations.', specs:[{title:'SPECIFICATIONS',data:{'Capacity':'8 fibres','Mounting':'Wall-mount','Application':'FTTH subscriber distribution','IP Rating':'IP20'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },

    // ── FIBRE — MPO/MTP® SOLUTIONS ────────────────────────────
    { id:145, name:'MTP®/MPO Single Jacket MicroCable Trunk', category:'fibre', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'mtp-single-jacket-trunk', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'MTP®/MPO single jacket MicroCable trunk assemblies — slim factory-terminated trunks for high-density data centre backbone.', specs:[{title:'SPECIFICATIONS',data:{'Connectors':'MTP®/MPO Male/Female','Construction':'Single jacket MicroCable','Fibres':'12 or 24','Fibre Type':'OM3/OM4 or OS2','Lengths':'Custom 3m–100m'}},{title:'STANDARDS',data:{'Standard':'IEC 61754-7','Approvals':'CE, RoHS'}}] },
    { id:146, name:'MTP®/MPO Ruggedised Pigtails',           category:'fibre', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'mtp-rug-pigtails', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'MTP®/MPO ruggedised pigtails — reinforced MTP/MPO pigtails for high-use and harsh-environment applications.', specs:[{title:'SPECIFICATIONS',data:{'Connector':'MTP®/MPO (one end)','Construction':'Ruggedised with aramid','Fibres':'12','Fibre Type':'OM3/OM4 or OS2','Jacket':'LSZH'}},{title:'STANDARDS',data:{'Standard':'IEC 61754-7','Approvals':'CE, RoHS'}}] },
    { id:147, name:'MTP®/MPO Nano Ruggedised Trunk Assemblies', category:'fibre', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'mtp-nano-rug-trunk', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'MTP®/MPO Nano ruggedised trunk assemblies — ultra-compact reinforced trunk cable for extreme-density installations.', specs:[{title:'SPECIFICATIONS',data:{'Connectors':'MTP®/MPO both ends','Construction':'Nano cable, ruggedised','Fibres':'12','Jacket':'LSZH'}},{title:'STANDARDS',data:{'Standard':'IEC 61754-7','Approvals':'CE, RoHS'}}] },
    { id:148, name:'HDCi® MLX3 MTP®/MPO Cassette Module',   category:'fibre', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'hdci-mlx3-cassette', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'HDCi® MLX3 MTP®/MPO cassette module — plug-in module converting MTP trunk to 12 LC duplex for LX3 panels.', specs:[{title:'SPECIFICATIONS',data:{'Type':'Push-fit cassette','Rear':'MTP® 12-fibre','Front':'12× LC Duplex','Compatible':'HDCi® LX3 panels','Fibre Type':'OM3/OM4 or OS2'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:149, name:'MTP® 40G to 4×LC (4×10G SFP+) Assembly', category:'fibre', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'mtp-40g-to-4lc', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'MTP® (40G QSFP+) to 4× duplex LC (4×10G SFP+) assemblies — fan-out assembly for 40G to 10G breakout connectivity.', specs:[{title:'SPECIFICATIONS',data:{'Connector A':'MTP® 12-fibre (40G QSFP+)','Connector B':'4× LC Duplex (4×10G SFP+)','Fibre Type':'OM3/OM4','Construction':'Fan-out breakout'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:150, name:'MTP®/MPO MicroCable Fan-Out Assembly',   category:'fibre', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'mtp-microcable-fanout', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'MTP®/MPO MicroCable fan-out assembly — slim fan-out cable splitting MTP/MPO trunk into individual LC/SC fibres.', specs:[{title:'SPECIFICATIONS',data:{'Connector A':'MTP®/MPO 12-fibre','Connector B':'12× LC or SC individual','Construction':'MicroCable fan-out','Fibre Type':'OM3/OM4 or OS2'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:151, name:'MTP®/MPO Loose Tube Trunk Assemblies',   category:'fibre', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'mtp-loose-tube-trunk', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'MTP®/MPO loose tube trunk assemblies — factory-terminated loose-tube trunks for long-distance data centre backbone runs.', specs:[{title:'SPECIFICATIONS',data:{'Connectors':'MTP®/MPO Male/Female','Construction':'Loose tube','Fibres':'12, 24 or 72','Lengths':'Custom 5m–500m'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:152, name:'40G QSFP+ to QSFP+ MTP®/MPO Assembly',  category:'fibre', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'mtp-40g-qsfp-to-qsfp', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'40G QSFP+ (MTP®/MPO) to QSFP+ assemblies — direct 40G to 40G MTP/MPO fibre connection for high-speed switching.', specs:[{title:'SPECIFICATIONS',data:{'Connectors':'MTP®/MPO QSFP+ both ends','Speed':'40G','Fibre Type':'OM3/OM4','Application':'40G switch-to-switch backbone'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:153, name:'MTP®/MPO Double Jacket MicroCable Trunk', category:'fibre', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'mtp-double-jacket-trunk', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'MTP®/MPO double jacket MicroCable trunk assemblies — armoured MicroCable trunks for enhanced protection in exposed runs.', specs:[{title:'SPECIFICATIONS',data:{'Connectors':'MTP®/MPO Male/Female','Construction':'Double jacket MicroCable','Fibres':'12 or 24','Feature':'Dual sheath protection'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:154, name:'MTP®/MPO Loopback',                      category:'fibre', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'mtp-loopback', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'MTP®/MPO loopback — test loopback adapter for verifying MTP/MPO ports and fibre link continuity.', specs:[{title:'SPECIFICATIONS',data:{'Connector':'MTP®/MPO','Fibres':'12','Type':'Loopback (TX to RX)','Application':'Port testing and verification'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },
    { id:155, name:'Ultra HDCi® MLX4 MTP®/MPO Cassette',    category:'fibre', subcategory:'MPO/MTP® SOLUTIONS', price:0, slug:'uhdci-mlx4-cassette-fibre', image:OP+'2017/04/optronics-mpo-mtp.jpg', description:'Ultra HDCi® MLX4 MTP®/MPO cassette module — high-density push-fit module for UHDCi® LX4 ultra-high-density panels.', specs:[{title:'SPECIFICATIONS',data:{'Type':'Push-fit cassette','Rear':'MTP®/MPO 12-fibre','Front':'12× LC Duplex','Compatible':'UHDCi® LX4 panels','Fibre Type':'OM4 or OS2'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },

    // ── FIBRE — MULTI-FIBRE ASSEMBLIES ─────────────────────────
    { id:156, name:'Armoured Patch Cords',                   category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'armoured-patch-cords', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Armoured fibre optic patch cords — stainless steel armoured jacket for heavy-duty and high-traffic applications.', specs:[{title:'SPECIFICATIONS',data:{'Connector':'LC/SC/FC/ST — various','Armour':'Stainless steel interlocked','Fibre':'OM1/OM2/OM3/OM4 or OS2','Lengths':'1m to 10m'}}] },
    { id:157, name:'Blister Packed Pigtails',                category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'blister-pigtails', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Blister packed pigtails — individually packaged fibre pigtails for field splicing, available in all connector types and fibre grades.', specs:[{title:'SPECIFICATIONS',data:{'Connector':'LC/SC/FC/ST — various','Fibre':'OM1–OM4 or OS2','Jacket':'900μm tight buffer','Lengths':'1m, 1.5m, 2m'}}] },
    { id:158, name:'Cabled Pigtails',                        category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'cabled-pigtails', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Cabled pigtails — multi-fibre pigtail assemblies for terminating multi-core cables in distribution frames.', specs:[{title:'SPECIFICATIONS',data:{'Connector':'LC/SC/FC/ST — various','Fibres':'2–24','Fibre':'OM1–OM4 or OS2','Jacket':'2mm or 3mm round cable'}}] },
    { id:159, name:'Data Centre Patch Cords',                category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'dc-patch-cords', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Data centre patch cords — low-loss LC duplex OM3/OM4 cords designed for high-density data centre switch interconnects.', specs:[{title:'SPECIFICATIONS',data:{'Connector':'LC Duplex (both ends)','Fibre':'OM3/OM4','Jacket':'LSZH 2mm duplex','Lengths':'0.5m to 15m','Loss':'≤ 0.2 dB'}}] },
    { id:160, name:'E2000 Patch Cords',                      category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'e2000-patch-cords', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'E2000 fibre optic patch cords — spring-loaded shutter connector cords for telco and sensitive network environments.', specs:[{title:'SPECIFICATIONS',data:{'Connector':'E2000 (spring-loaded shutter)','Fibre':'OS2 Singlemode or OM3/OM4','Jacket':'LSZH','Lengths':'1m to 10m'}}] },
    { id:161, name:'Fan Out Kits',                           category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'fan-out-kits', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Fan out kits — breakout kits converting multi-core cable fibres to individually jacketed patchable fibres.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'4, 6, 8, 12, 24','Output':'900μm or 2mm individually jacketed','Application':'Multi-core cable breakout for termination'}}] },
    { id:162, name:'LC Uniboot Patch Cords',                 category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'lc-uniboot-patch-cords', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'LC Uniboot patch cords — single-boot LC duplex cords with push-pull tab for easy dense installation and removal.', specs:[{title:'SPECIFICATIONS',data:{'Connector':'LC Uniboot (push-pull tab)','Fibre':'OM3/OM4 or OS2','Jacket':'Single round 2mm','Lengths':'0.5m to 15m'}}] },
    { id:163, name:'Mode Conditioning Patch Cords',          category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'mode-conditioning-patch-cords', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Mode conditioning patch cords — offset launch patch cords enabling 1000BASE-LX SFPs to work over OM1/OM2 multimode fibre.', specs:[{title:'SPECIFICATIONS',data:{'Connector A':'SC/LC Singlemode','Connector B':'SC/LC Multimode','Fibre':'OS2 to OM1/OM2','Application':'1000BASE-LX over multimode'}}] },
    { id:164, name:'mSFP Mini LC Patch Cords',               category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'msfp-mini-lc-patch-cords', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'mSFP Mini LC patch cords — miniature form-factor LC cords for mSFP modules used in compact switching equipment.', specs:[{title:'SPECIFICATIONS',data:{'Connector':'Mini LC Duplex','Fibre':'OM3/OM4 or OS2','Jacket':'Mini 1.6mm duplex','Lengths':'0.5m to 5m'}}] },
    { id:165, name:'Multi-Fibre Full Breakout Cable Assemblies', category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'multi-fibre-breakout-assemblies', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Multi-fibre full breakout cable assemblies — factory-terminated breakout cables with individual jacketed fibres at both ends.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'4–24','Jacket':'Individual 3mm per fibre','Connector':'LC/SC/FC — various','Lengths':'2m to 50m'}}] },
    { id:166, name:'Multifibre Tight Buffered Cable Assemblies', category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'multifibre-tight-buffer-assemblies', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Multifibre tight-buffered cable assemblies — indoor-rated multi-core assemblies with individual tight-buffered fibres.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'4–24 tight-buffered 900μm','Jacket':'LSZH or PVC round cable','Connector':'LC/SC — various','Lengths':'Custom'}}] },
    { id:167, name:'OM1 Multimode Pigtails',                 category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'om1-pigtails', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'OM1 multimode pigtails — 62.5/125μm pigtails for legacy multimode network terminations.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OM1 (62.5/125μm)','Connector':'LC/SC/FC/ST','Jacket':'900μm tight buffer','Bandwidth':'200 MHz·km @ 850nm'}}] },
    { id:168, name:'OM1 Multimode Patch Cords',              category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'om1-patch-cords', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'OM1 multimode patch cords — 62.5/125μm duplex cords for Fast Ethernet and legacy multimode connectivity.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OM1 (62.5/125μm)','Connector':'LC/SC/FC/ST','Jacket':'PVC or LSZH','Data Rate':'1G @ 300m'}}] },
    { id:169, name:'OM2 Multimode Pigtails',                 category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'om2-pigtails', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'OM2 multimode pigtails — 50/125μm pigtails for Gigabit network terminations and distribution frames.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OM2 (50/125μm)','Connector':'LC/SC/FC/ST','Jacket':'900μm tight buffer','Bandwidth':'500 MHz·km @ 850nm'}}] },
    { id:170, name:'OM2 Multimode Patch Cords',              category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'om2-patch-cords', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'OM2 multimode patch cords — 50/125μm duplex cords for Gigabit Ethernet connectivity up to 550m.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OM2 (50/125μm)','Connector':'LC/SC/FC/ST','Jacket':'PVC or LSZH','Data Rate':'1G @ 550m'}}] },
    { id:171, name:'OM3 Multimode Patch Cords',              category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'om3-patch-cords', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'OM3 multimode patch cords — laser-optimised 50/125μm duplex cords supporting 10G up to 300m.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OM3 (50/125μm Laser-Optimised)','Connector':'LC/SC','Jacket':'Aqua PVC or LSZH','Data Rate':'10G @ 300m'}}] },
    { id:172, name:'OM3 Multimode Pigtails',                 category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'om3-pigtails', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'OM3 multimode pigtails — laser-optimised 10G pigtails for splice terminations in distribution frames.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OM3 (50/125μm Laser-Optimised)','Connector':'LC/SC/FC/ST','Jacket':'Aqua 900μm tight buffer','Data Rate':'10G @ 300m'}}] },
    { id:173, name:'OM3 & OM4 RBS LC Short Boot Patch Cords', category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'om3-om4-rbs-lc-short-boot', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'OM3 & OM4 Reduced Bend Sensitivity LC Short Boot patch cords — G.657 equivalent bend tolerance with low-profile boot.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OM3/OM4 RBS','Connector':'LC Short Boot (low-profile)','Feature':'Reduced bend sensitivity','Min Bend Radius':'5mm dynamic / 7.5mm static'}}] },
    { id:174, name:'OM3 & OM4 RBS SC Short Boot Patch Cords', category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'om3-om4-rbs-sc-short-boot', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'OM3 & OM4 Reduced Bend Sensitivity SC Short Boot patch cords — flexible multimode cords tolerant to tight bends.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OM3/OM4 RBS','Connector':'SC Short Boot (low-profile)','Feature':'Reduced bend sensitivity','Min Bend Radius':'5mm dynamic / 7.5mm static'}}] },
    { id:175, name:'OM4 Multimode Patch Cords',              category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'om4-patch-cords', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'OM4 multimode patch cords — high-bandwidth 50/125μm laser-optimised cords supporting 10G @ 550m and 100G @ 100m.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OM4 (50/125μm Laser-Optimised)','Connector':'LC/SC','Jacket':'Aqua/Violet PVC or LSZH','Data Rate':'10G @ 550m, 100G @ 100m'}}] },
    { id:176, name:'OM4 Multimode Pigtails',                 category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'om4-pigtails', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'OM4 multimode pigtails — high-bandwidth 10G/100G pigtails for splice termination in high-density patch panels.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OM4 (50/125μm Laser-Optimised)','Connector':'LC/SC/FC/ST','Jacket':'Aqua/Violet 900μm','Data Rate':'10G @ 550m, 100G @ 100m'}}] },
    { id:177, name:'OS2 G657 Singlemode LC Short Boot Cords', category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'os2-g657-lc-short-boot', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'OS1/OS2 G.657 singlemode LC Short Boot patch cords — bend-tolerant singlemode cords with low-profile boot for tight spaces.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OS2 G.657.A1 Singlemode','Connector':'LC Short Boot','Feature':'G.657 bend-tolerant','Data Rate':'100G+ (limited by transceiver)'}}] },
    { id:178, name:'Singlemode Pigtails',                    category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'singlemode-pigtails', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Singlemode pigtails — OS2 9/125μm pigtails for low-loss singlemode splice terminations.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OS2 (9/125μm)','Connector':'LC/SC/FC/ST','Jacket':'Yellow 900μm tight buffer'}}] },
    { id:179, name:'OS2 G657 Singlemode SC Short Boot Cords', category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'os2-g657-sc-short-boot', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'OS1/OS2 G.657 singlemode SC Short Boot patch cords — bend-tolerant SC cords for high-density singlemode installations.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OS2 G.657.A1 Singlemode','Connector':'SC Short Boot','Feature':'G.657 bend-tolerant'}}] },
    { id:180, name:'Premium Patch Cords',                    category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'premium-patch-cords', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Premium fibre optic patch cords — individually tested low-loss cords for mission-critical and carrier-grade installations.', specs:[{title:'SPECIFICATIONS',data:{'Connector':'LC/SC/FC/ST — various','Fibre':'OM3/OM4 or OS2','Loss':'≤ 0.1 dB per connector (premium grade)','Testing':'100% insertion loss tested'}}] },
    { id:181, name:'Micro Cable Assemblies 2mm Tails',       category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'micro-cable-2mm-tails', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Micro cable assemblies with 2mm tails — ultra-slim factory-terminated assemblies with 2mm patchable tail fibres.', specs:[{title:'SPECIFICATIONS',data:{'Trunk':'MicroCable','Tails':'2mm fan-out','Fibres':'12 or 24','Connector':'LC/SC','Fibre Type':'OM3/OM4 or OS2'}}] },
    { id:182, name:'Micro Cable Assemblies 900um Tails',     category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'micro-cable-900um-tails', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Micro cable assemblies with 900μm tails — ultra-slim trunk with 900μm splice-ready tail fibres.', specs:[{title:'SPECIFICATIONS',data:{'Trunk':'MicroCable','Tails':'900μm loose','Fibres':'12 or 24','Connector':'MTP®/MPO (far end)','Fibre Type':'OM3/OM4 or OS2'}}] },
    { id:183, name:'Multifibre Loose Tube Cable Assemblies', category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'multifibre-loose-tube-assemblies', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Multifibre loose tube cable assemblies — factory-terminated outdoor-rated loose tube multi-core cable assemblies.', specs:[{title:'SPECIFICATIONS',data:{'Construction':'Loose tube','Fibres':'4–144','Jacket':'PE outdoor-rated','Connector':'LC/SC/FC — various','Application':'Outdoor distribution runs'}}] },
    { id:184, name:'Nano Cable Assemblies 2mm Tails',        category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'nano-cable-2mm-tails', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Nano cable assemblies with 2mm tails — Nano-diameter factory-terminated assemblies for extreme-density installations.', specs:[{title:'SPECIFICATIONS',data:{'Trunk':'Nano cable','Tails':'2mm fan-out','Fibres':'12','Fibre Type':'OM4 or OS2'}}] },
    { id:185, name:'Nano Cable Assemblies 900um Tails',      category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'nano-cable-900um-tails', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Nano cable assemblies with 900μm tails — ultra-compact Nano-cable with splice-ready 900μm tail fibres.', specs:[{title:'SPECIFICATIONS',data:{'Trunk':'Nano cable','Tails':'900μm','Fibres':'12','Fibre Type':'OM4 or OS2'}}] },
    { id:186, name:'Reduced Bend Sensitivity Patch Cords',   category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'rbs-patch-cords', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Reduced Bend Sensitivity patch cords — G.657 bend-tolerant multimode or singlemode cords for tight routing scenarios.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OM3/OM4 RBS or OS2 G.657','Connector':'LC/SC — various','Min Bend Radius':'5mm dynamic','Application':'Dense installations, under-floor routing'}}] },
    { id:187, name:'Semi-Tight Buffer Enhanced Pigtails',    category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'semi-tight-buffer-pigtails', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Semi-tight buffer enhanced pigtails — hybrid construction combining benefits of loose and tight buffer for improved performance.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OM3/OM4 or OS2','Construction':'Semi-tight buffer (between 250μm and 900μm)','Connector':'LC/SC/FC'}}] },
    { id:188, name:'Singlemode Patch Cords',                 category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'singlemode-patch-cords', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Singlemode patch cords — OS2 9/125μm duplex cords for long-distance and low-loss singlemode network interconnects.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OS2 (9/125μm)','Connector':'LC/SC/FC/ST','Jacket':'Yellow PVC or LSZH','Data Rate':'100G+ (limited by transceiver)'}}] },
    { id:189, name:'Premium Telecom Patch Cords',            category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'premium-telecom-patch-cords', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'Premium Telecom patch cords — carrier-grade singlemode OS2 cords with 100% optical performance testing for telco installations.', specs:[{title:'SPECIFICATIONS',data:{'Fibre':'OS2 Singlemode','Connector':'LC/SC/FC — various','Loss':'≤ 0.1 dB (carrier grade)','Testing':'100% insertion loss and return loss tested'}}] },
    { id:190, name:'LC-SN® Uniboot Duplex Patch Cord (Fibre)', category:'fibre', subcategory:'MULTI-FIBRE ASSEMBLIES', price:0, slug:'lc-sn-uniboot-fibre', image:OP+'2017/04/optronics-optical-fibre-assemblies.jpg', description:'LC-SN® Uniboot Duplex Patch Cord — slim push-pull single-boot patch cord for UHDCi ultra-high-density data centre switching.', specs:[{title:'SPECIFICATIONS',data:{'Connector A':'LC Uniboot (push-pull)','Connector B':'SN® Duplex','Fibre':'OM4/OM5 or OS2','Feature':'Push-pull removal tab'}}] },

    // ── FIBRE — FIBRE OPTIC CABLE ─────────────────────────────
    { id:191, name:'Secondary Coated 900μm Fibre',          category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'secondary-coated-900um', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Secondary coated 900μm tight-buffered fibre — for splice pigtails, distribution cables and fibre management applications.', specs:[{title:'SPECIFICATIONS',data:{'OD':'900μm','Coating':'Secondary UV-cured acrylate','Fibre Type':'OS2 / OM3 / OM4','Application':'Pigtails, distribution frames'}}] },
    { id:192, name:'Round Duplex Fibre Optic Patch Cable',  category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'round-duplex-patch-cable', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Round duplex fibre optic patch cable — circular cross-section duplex cable for patch cord manufacturing and short runs.', specs:[{title:'SPECIFICATIONS',data:{'Construction':'Round duplex 2.0mm×2','Fibre Type':'OM1/OM2/OM3/OM4 or OS2','Jacket':'PVC or LSZH'}}] },
    { id:193, name:'Simplex Fibre Optic Patch Cable',       category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'simplex-patch-cable', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Simplex fibre optic patch cable — single-fibre cable for simplex patch cord and pigtail manufacturing.', specs:[{title:'SPECIFICATIONS',data:{'Construction':'Simplex 2.0mm','Fibre Type':'OM1–OM4 or OS2','Jacket':'PVC or LSZH'}}] },
    { id:194, name:'Zip Duplex Fibre Optic Patch Cable',    category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'zip-duplex-patch-cable', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Zip duplex fibre optic patch cable — easily-separable flat-zip duplex cable for patch cord assembly.', specs:[{title:'SPECIFICATIONS',data:{'Construction':'Flat zip duplex 2×2.0mm','Fibre Type':'OM1–OM4 or OS2','Jacket':'PVC or LSZH'}}] },
    { id:195, name:'Flat Duplex Fibre Optic Patch Cable',   category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'flat-duplex-patch-cable', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Flat duplex fibre optic patch cable — flat-profile duplex cable ideal for under-carpet and concealed routing.', specs:[{title:'SPECIFICATIONS',data:{'Construction':'Flat duplex','Width':'Approx 4.8mm','Fibre Type':'OS2 or OM3/OM4','Jacket':'LSZH'}}] },
    { id:196, name:'Flat Ribbon Fibre Optic Patch Cable',   category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'flat-ribbon-patch-cable', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Flat ribbon fibre optic patch cable — multi-fibre ribbon cable for mass-fusion splicing in data centre backbone applications.', specs:[{title:'SPECIFICATIONS',data:{'Construction':'Flat ribbon 12-fibre','Fibre Type':'OM3/OM4 or OS2','Application':'Mass fusion splicing, data centre backbone'}}] },
    { id:197, name:'Single Loose Tube Cable (2–24 Fibres)', category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'single-loose-tube-2-24f', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Single loose tube fibre optic cable (2–24 fibres) — gel-filled outdoor cable for direct burial and duct installation.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'2–24','Construction':'Single loose tube, gel-filled','Jacket':'PE','Application':'Outdoor duct or direct burial'}}] },
    { id:198, name:'Multi Loose Tube Fibre Optic Cable',    category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'multi-loose-tube-cable', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Multi loose tube fibre optic cable — high-count outdoor cable with multiple gel-filled buffer tubes for campus and long-haul runs.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'Up to 288','Construction':'Multiple loose tubes, gel-filled','Jacket':'PE outdoor','Application':'Campus, inter-building, underground'}}] },
    { id:199, name:'Single Loose Tube Fire Resistant Cable', category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'single-loose-tube-fire-resistant', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Single loose tube fire-resistant cable — FR/LSZH jacketed outdoor cable for fire-rated indoor/outdoor applications.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'2–24','Construction':'Single loose tube','Jacket':'LSZH FR','Fire Rating':'IEC 60332-1'}}] },
    { id:200, name:'Double Jacket Multi Loose Tube FR Cable', category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'double-jacket-multi-lt-fr', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Double jacket multi loose tube fire-resistant cable — dual-sheath FR cable for demanding indoor/outdoor environments.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'Up to 144','Construction':'Multi loose tube, double jacket','Jacket':'LSZH FR inner + PE outer','Fire Rating':'IEC 60332-3'}}] },
    { id:201, name:'SLT Steel Tape Armoured Cable (E-glass)', category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'slt-armoured-e-glass', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Single loose tube steel tape armoured cable with E-glass — rodent-resistant armoured outdoor cable for direct burial.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'2–24','Armour':'Corrugated steel tape + E-glass','Jacket':'PE','Application':'Direct burial, rodent-prone areas'}}] },
    { id:202, name:'SLT Steel Tape Armoured Cable (Steel Wires)', category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'slt-armoured-steel-wires', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Single loose tube steel tape armoured cable with steel wires — double-armoured outdoor cable for demanding direct-burial.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'2–24','Armour':'Steel tape + steel strength wires','Jacket':'PE','Application':'Direct burial, high-tension spans'}}] },
    { id:203, name:'Multi Loose Tube CST Fibre Cable',       category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'multi-lt-cst-cable', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Multi loose tube CST (Corrugated Steel Tape) fibre cable — high-count armoured outdoor cable for long-haul underground installation.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'Up to 288','Armour':'Corrugated steel tape (CST)','Jacket':'PE','Application':'Underground duct, direct burial'}}] },
    { id:204, name:'Multi Loose Tube DJ Cable (24–144F)',    category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'multi-lt-dj-24-144f', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Multi loose tube double jacket cable (24–144 fibres) — robust dual-sheathed cable for outdoor campus distribution networks.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'24–144','Construction':'Multi loose tube, double jacket','Jacket':'PE outer','Application':'Outdoor campus or inter-building'}}] },
    { id:205, name:'Multi Loose Tube Double Jacket (PKP)',   category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'multi-lt-dj-pkp', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Multi loose tube double jacket cable (PKP) — gel-free waterblocking PKP tape construction for easy mid-span access.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'Up to 144','Construction':'Multi loose tube, PKP waterblocking tape','Jacket':'PE outer','Feature':'Gel-free, easy mid-span access'}}] },
    { id:206, name:'Dual Sheath SLT Armoured (PSP)',        category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'dual-sheath-slt-psp', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Dual sheath single loose steel tape armoured (PSP) cable — corrugated aluminium armoured cable for harsh outdoor environments.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'2–24','Armour':'Plastic-coated Steel Polyethylene (PSP)','Jacket':'PE','Application':'Harsh outdoor, underground'}}] },
    { id:207, name:'Dual Sheath MLT Armoured (PSP)',        category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'dual-sheath-mlt-psp', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Dual sheath multi loose steel tape armoured (PSP) cable — high-count armoured outdoor cable with PSP moisture barrier.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'Up to 288','Armour':'PSP double sheath','Jacket':'PE','Application':'Long-haul underground'}}] },
    { id:208, name:'Tight Buffered Distribution Cable',     category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'tight-buffer-distribution', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Tight buffered distribution cable — indoor/outdoor riser-rated multi-core cable for building backbone distribution runs.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'4–24 tight-buffered 900μm','Jacket':'LSZH or PVC','Rating':'Indoor/outdoor riser','Application':'Building backbone, MDF to IDF'}}] },
    { id:209, name:'Tight Buffered Distribution Cable (36–96F)', category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'tight-buffer-36-96f', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Tight buffered distribution cable multi-core (36–96 fibres) — high-count indoor backbone cable for large buildings.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'36–96 tight-buffered 900μm','Jacket':'LSZH FR','Application':'Large building backbone'}}] },
    { id:210, name:'Breakout Fibre Optic Cable (4–24F)',    category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'breakout-cable-4-24f', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Breakout fibre optic cable (4–24 fibres) — individual sub-units with own strength members for direct connector termination.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'4–24 breakout sub-units','Sub-unit OD':'3mm each','Jacket':'LSZH or PVC','Application':'Direct connector termination without fan-out kit'}}] },
    { id:211, name:'4–24F Steel Tape Armoured Distribution Cable', category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'armoured-distribution-4-24f', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'4 to 24 fibre steel tape armoured distribution cable — indoor armoured distribution cable for high-traffic areas.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'4–24','Armour':'Corrugated steel tape','Jacket':'LSZH','Application':'Indoor high-traffic areas, risers'}}] },
    { id:212, name:'Double Jacket Direct Burial Cable (12–144F)', category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'dj-direct-burial-12-144f', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Double jacket direct burial cable (12–144 fibres) — gel-filled double-jacketed cable rated for direct underground burial.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'12–144','Construction':'Gel-filled multi loose tube, double jacket','Jacket':'PE outer','Application':'Direct burial without conduit'}}] },
    { id:213, name:'FTTH Flat Drop Cable',                  category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'ftth-flat-drop', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'FTTH flat drop cable — G.657.A1/A2 flat drop cable with integrated strength members for last-mile FTTH subscriber connections.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'1 or 2','Construction':'Flat drop, steel/FRP strength members','Jacket':'PE or LSZH','Fibre':'G.657.A1 or A2 bend-tolerant'}}] },
    { id:214, name:'4F FTTH 250μm All-Dielectric Drop Cable', category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'ftth-4f-250um-adu', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'4-fibre all-dielectric 250μm FTTH loose tube drop cable — lightweight non-metallic FTTH cable for MDU and aerial use.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'4 × 250μm in loose tube','Strength':'FRP or Aramid (non-metallic)','Jacket':'PE','Application':'MDU FTTH, aerial deployment'}}] },
    { id:215, name:'Single Jacket Micro Cable (2–24F)',      category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'micro-cable-2-24f', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Single jacket micro cable (2–24 fibres) — ultra-slim diameter cable for microduct blowing in constrained pathway installations.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'2–24','OD':'≤ 5mm','Construction':'Micro-cable, dry-core or gel','Application':'Microduct blown cable'}}] },
    { id:216, name:'Dry Core Blowing Cable (12–144F)',       category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'dry-core-blowing-12-144f', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'Dry core blowing cable (12–144 fibres) — gel-free waterblocked cable engineered for air-blown microduct installations.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'12–144','Construction':'Dry-core waterblock tape, no gel','Application':'Air-blown microduct installation','Jacket':'PE'}}] },
    { id:217, name:'FTTH Self-Supporting Outdoor Drop Cable', category:'fibre', subcategory:'FIBRE OPTIC CABLE', price:0, slug:'ftth-self-supporting-drop', image:OP+'2017/04/optronics-optical-fibre-cable.jpg', description:'FTTH self-supporting outdoor drop cable — Figure-8 or flat-8 aerial cable with integrated messenger wire for pole-to-building spans.', specs:[{title:'SPECIFICATIONS',data:{'Fibres':'1 or 2 G.657','Messenger':'Steel wire (figure-8)','Jacket':'PE','Application':'Aerial pole-to-building FTTH'}}] },

    // ── FIBRE — FIBRE OPTIC COMPONENTS ───────────────────────
    { id:218, name:'E2000 Adaptors',                         category:'fibre', subcategory:'FIBRE OPTIC COMPONENTS', price:0, slug:'e2000-adaptors', image:OP+'2017/04/optronics-optical-fibre-components.jpg', description:'E2000 fibre optic adaptors — spring-loaded shutter simplex or duplex adaptors for telco-grade E2000 patch cord connections.', specs:[{title:'SPECIFICATIONS',data:{'Type':'E2000 adaptor','Mode':'Singlemode or Multimode','Housing':'Ceramic or metal','Feature':'Spring-loaded shutter protection'}}] },
    { id:219, name:'FC Adaptors',                            category:'fibre', subcategory:'FIBRE OPTIC COMPONENTS', price:0, slug:'fc-adaptors', image:OP+'2017/04/optronics-optical-fibre-components.jpg', description:'FC fibre optic adaptors — screw-type duplex adaptors for FC connector panel terminations in telco installations.', specs:[{title:'SPECIFICATIONS',data:{'Type':'FC adaptor (screw-on)','Mode':'Singlemode or Multimode','Sleeve':'Ceramic (UPC/APC)'}}] },
    { id:220, name:'FC Connectors',                          category:'fibre', subcategory:'FIBRE OPTIC COMPONENTS', price:0, slug:'fc-connectors', image:OP+'2017/04/optronics-optical-fibre-components.jpg', description:'FC fibre optic connectors — screw-type field-terminable connectors for singlemode and multimode installations.', specs:[{title:'SPECIFICATIONS',data:{'Type':'FC connector','Polish':'UPC or APC','Mode':'Singlemode or Multimode','Loss':'≤ 0.3 dB'}}] },
    { id:221, name:'Hybrid Adaptors',                        category:'fibre', subcategory:'FIBRE OPTIC COMPONENTS', price:0, slug:'hybrid-adaptors', image:OP+'2017/04/optronics-optical-fibre-components.jpg', description:'Hybrid fibre optic adaptors — mixed-connector adaptors (e.g. LC-SC, FC-SC) for connecting different connector types.', specs:[{title:'SPECIFICATIONS',data:{'Types':'LC-SC, FC-SC, LC-FC, SC-ST (various)','Mode':'Singlemode or Multimode','Application':'Connecting mixed connector environments'}}] },
    { id:222, name:'LC Adaptors',                            category:'fibre', subcategory:'FIBRE OPTIC COMPONENTS', price:0, slug:'lc-adaptors', image:OP+'2017/04/optronics-optical-fibre-components.jpg', description:'LC fibre optic adaptors — duplex simplex LC adaptors for patch panels, faceplates and equipment connections.', specs:[{title:'SPECIFICATIONS',data:{'Type':'LC adaptor','Duplex':'LC duplex or simplex','Sleeve':'Ceramic','Mode':'OS2 / OM3 / OM4','Loss':'≤ 0.1 dB'}}] },
    { id:223, name:'LC Connectors',                          category:'fibre', subcategory:'FIBRE OPTIC COMPONENTS', price:0, slug:'lc-connectors', image:OP+'2017/04/optronics-optical-fibre-components.jpg', description:'LC fibre optic connectors — small form-factor field-terminable or factory-polished LC connectors for all fibre types.', specs:[{title:'SPECIFICATIONS',data:{'Type':'LC connector','Polish':'UPC or APC','Mode':'OS2 / OM3 / OM4','Loss':'≤ 0.2 dB'}}] },
    { id:224, name:'MTRJ Adaptors',                          category:'fibre', subcategory:'FIBRE OPTIC COMPONENTS', price:0, slug:'mtrj-adaptors', image:OP+'2017/04/optronics-optical-fibre-components.jpg', description:'MTRJ fibre optic adaptors — small-form-factor duplex adaptors for MTRJ connections in legacy multimode equipment.', specs:[{title:'SPECIFICATIONS',data:{'Type':'MT-RJ adaptor','Mode':'Multimode (OM1/OM2)','Application':'Legacy multimode equipment'}}] },
    { id:225, name:'SC Adaptors',                            category:'fibre', subcategory:'FIBRE OPTIC COMPONENTS', price:0, slug:'sc-adaptors', image:OP+'2017/04/optronics-optical-fibre-components.jpg', description:'SC fibre optic adaptors — push-pull duplex or simplex SC adaptors for patch panels and equipment front-end connections.', specs:[{title:'SPECIFICATIONS',data:{'Type':'SC adaptor','Duplex':'SC duplex or simplex','Sleeve':'Ceramic','Mode':'OS2 / OM3 / OM4','Loss':'≤ 0.1 dB'}}] },
    { id:226, name:'SC Connectors',                          category:'fibre', subcategory:'FIBRE OPTIC COMPONENTS', price:0, slug:'sc-connectors', image:OP+'2017/04/optronics-optical-fibre-components.jpg', description:'SC fibre optic connectors — push-pull field-terminable or factory-polished SC connectors for structured cabling.', specs:[{title:'SPECIFICATIONS',data:{'Type':'SC connector','Polish':'UPC or APC','Mode':'OS2 / OM3 / OM4','Loss':'≤ 0.2 dB'}}] },
    { id:227, name:'SC Field Installable Connectors',        category:'fibre', subcategory:'FIBRE OPTIC COMPONENTS', price:0, slug:'sc-field-installable', image:OP+'2017/04/optronics-optical-fibre-components.jpg', description:'SC field installable connectors — no-epoxy, no-polish SC connectors for fast field termination without specialist tools.', specs:[{title:'SPECIFICATIONS',data:{'Type':'SC field-installable','Polish':'Pre-polished factory tip','Installation':'No epoxy, no polishing required','Mode':'OS2 or OM3/OM4'}}] },
    { id:228, name:'Singlemode Attenuators',                 category:'fibre', subcategory:'FIBRE OPTIC COMPONENTS', price:0, slug:'singlemode-attenuators', image:OP+'2017/04/optronics-optical-fibre-components.jpg', description:'Singlemode fibre optic attenuators — inline or plug-type fixed-value attenuators for reducing signal levels in optical links.', specs:[{title:'SPECIFICATIONS',data:{'Type':'Fixed attenuator','Values':'1, 2, 3, 5, 7, 10, 15, 20 dB','Connector':'LC, SC, FC — various','Mode':'OS2 Singlemode'}}] },
    { id:229, name:'ST Adaptors',                            category:'fibre', subcategory:'FIBRE OPTIC COMPONENTS', price:0, slug:'st-adaptors', image:OP+'2017/04/optronics-optical-fibre-components.jpg', description:'ST fibre optic adaptors — bayonet-style simplex adaptors for ST connector terminations in older multimode networks.', specs:[{title:'SPECIFICATIONS',data:{'Type':'ST adaptor (bayonet)','Mode':'OM1 / OM2 Multimode','Sleeve':'Ceramic'}}] },
    { id:230, name:'ST Connectors',                          category:'fibre', subcategory:'FIBRE OPTIC COMPONENTS', price:0, slug:'st-connectors', image:OP+'2017/04/optronics-optical-fibre-components.jpg', description:'ST fibre optic connectors — bayonet-mount field-terminable connectors for legacy OM1/OM2 multimode installations.', specs:[{title:'SPECIFICATIONS',data:{'Type':'ST connector (bayonet)','Mode':'OM1 / OM2 Multimode','Loss':'≤ 0.3 dB'}}] },
    { id:231, name:'ST Field Installable Connectors',        category:'fibre', subcategory:'FIBRE OPTIC COMPONENTS', price:0, slug:'st-field-installable', image:OP+'2017/04/optronics-optical-fibre-components.jpg', description:'ST field installable connectors — no-epoxy, no-polish ST connectors for fast on-site termination of legacy networks.', specs:[{title:'SPECIFICATIONS',data:{'Type':'ST field-installable','Polish':'Pre-polished factory tip','Installation':'No epoxy, no polishing','Mode':'OM1 / OM2'}}] },
    { id:232, name:'LC Duplex Fibre Optic Loopback Module',  category:'fibre', subcategory:'FIBRE OPTIC COMPONENTS', price:0, slug:'lc-duplex-loopback', image:OP+'2017/04/optronics-optical-fibre-components.jpg', description:'LC Duplex fibre optic loopback module — test loopback plug connecting TX to RX for equipment port verification.', specs:[{title:'SPECIFICATIONS',data:{'Connector':'LC Duplex','Type':'Loopback (TX → RX)','Mode':'Multimode or Singlemode','Application':'Port testing, BERT testing'}}] },

    // ── FIBRE — TELECOM SOLUTIONS ─────────────────────────────
    { id:233, name:'1xN 2xN PLC Splitter Modules',          category:'fibre', subcategory:'TELECOM SOLUTIONS', price:0, slug:'plc-splitter-modules', image:OP+'2017/04/op-telecom.jpg', description:'1×N / 2×N PLC splitter modules — fibre channel planar lightwave circuit splitter modules for PON/FTTH networks.', specs:[{title:'SPECIFICATIONS',data:{'Type':'PLC (Planar Lightwave Circuit)','Split Ratio':'1×2 to 1×64 or 2×N','Wavelength':'1260–1650nm','Connector':'LC/SC — various','Application':'PON, GPON, FTTH'}},{title:'STANDARDS',data:{'Standard':'IEC 61300-3-1','Approvals':'CE, RoHS'}}] },
    { id:234, name:'1xN 2xN PLC Splitters',                 category:'fibre', subcategory:'TELECOM SOLUTIONS', price:0, slug:'plc-splitters', image:OP+'2017/04/op-telecom.jpg', description:'1×N / 2×N bare PLC splitters — compact bare-chip PLC splitters for integration into distribution enclosures and ODF frames.', specs:[{title:'SPECIFICATIONS',data:{'Type':'PLC bare or box packaged','Split Ratio':'1×2 to 1×64','Wavelength':'1260–1650nm','Application':'FTTH, GPON distribution'}},{title:'STANDARDS',data:{'Standard':'IEC 61300-3-1','Approvals':'CE, RoHS'}}] },
    { id:235, name:'OptLink FTTA / PTTA Solution',           category:'fibre', subcategory:'TELECOM SOLUTIONS', price:0, slug:'optlink-ftta-ptta', image:OP+'2017/04/op-telecom.jpg', description:'OptLink FTTA/PTTA Solution — Fibre to the Antenna and Point-to-Telecom-Antenna cabling system for 4G/5G base station deployment.', specs:[{title:'SPECIFICATIONS',data:{'Type':'FTTA / PTTA cabling system','Application':'4G/5G base station, BBU to RRU','Components':'Weatherproof patch cords, distribution boxes, jumpers','IP Rating':'IP67 outdoor-rated'}},{title:'STANDARDS',data:{'Approvals':'CE, RoHS'}}] },

    // ── FIBRE — ACTIVE COMPONENTS ─────────────────────────────
    { id:236, name:'Ethernet Fibre Media Converter 10/100Mbps', category:'fibre', subcategory:'ACTIVE COMPONENTS', price:0, slug:'media-converter-100m', image:OP+'2020/08/active-components.jpg', description:'Ethernet fibre media converter 10/100Mbps — converts RJ45 copper to SFP/fibre for extending Fast Ethernet over fibre links.', specs:[{title:'SPECIFICATIONS',data:{'Speeds':'10/100 Mbps','Ports':'1× RJ45 + 1× SFP/SC fibre','Fibre Type':'Multimode or Singlemode','Max Distance':'2km (MM) / 20km (SM)','Standards':'IEEE 802.3'}}] },
    { id:237, name:'Gigabit Media Converter 10/100/1000Mbps', category:'fibre', subcategory:'ACTIVE COMPONENTS', price:0, slug:'media-converter-gbe', image:OP+'2020/08/active-components.jpg', description:'Gigabit media converter 10/100/1000Mbps — converts Gigabit copper to fibre SFP for extending enterprise networks over fibre.', specs:[{title:'SPECIFICATIONS',data:{'Speeds':'10/100/1000 Mbps','Ports':'1× RJ45 Gigabit + 1× SFP','Fibre Type':'Multimode or Singlemode','Max Distance':'550m (MM) / 10km (SM)','Standards':'IEEE 802.3z'}}] },
    { id:238, name:'Unmanaged Media Converter Chassis',      category:'fibre', subcategory:'ACTIVE COMPONENTS', price:0, slug:'media-converter-chassis', image:OP+'2020/08/active-components.jpg', description:'Unmanaged media converter chassis — 1U or 2U rack-mount chassis accepting up to 16 media converter cards for centralised fibre conversion.', specs:[{title:'SPECIFICATIONS',data:{'Form Factor':'1U or 2U 19" rack','Slots':'Up to 16 converter cards','Redundancy':'Dual PSU option','Management':'Unmanaged (plug-and-play)'}}] },

    // ── FIBRE — ACTIVE EQUIPMENT ──────────────────────────────
    { id:239, name:'SFP 1000BASE-T Copper STX Transceiver',  category:'fibre', subcategory:'ACTIVE EQUIPMENT', price:0, slug:'sfp-1000base-t', image:OP+'2020/08/active-equipment.jpg', description:'SFP 1000BASE-T copper STX transceiver — Gigabit SFP module using Cat 5e/6 copper for short-reach switch-to-switch connectivity.', specs:[{title:'SPECIFICATIONS',data:{'Type':'SFP 1000BASE-T','Media':'RJ45 Copper','Speed':'1 Gbps','Max Distance':'100m (Cat 5e/6)','Temperature':'0–70°C commercial'}},{title:'STANDARDS',data:{'Standard':'IEEE 802.3ab, SFP MSA','Approvals':'CE, RoHS'}}] },
    { id:240, name:'40Gb/s QSFP+ LR4 Transceiver',           category:'fibre', subcategory:'ACTIVE EQUIPMENT', price:0, slug:'qsfp-40g-lr4', image:OP+'2020/08/active-equipment.jpg', description:'40Gb/s QSFP+ LR4 transceiver — long-reach 40G optical module over single-mode fibre using 4× 10G WDM lanes.', specs:[{title:'SPECIFICATIONS',data:{'Type':'QSFP+ 40GBASE-LR4','Speed':'40 Gbps (4×10G WDM)','Fibre':'OS2 Singlemode LC duplex','Max Distance':'10km','Wavelengths':'1295/1300/1305/1310nm'}},{title:'STANDARDS',data:{'Standard':'IEEE 802.3ba','Approvals':'CE, RoHS'}}] },
    { id:241, name:'40Gb/s QSFP+ ER4 Transceiver',           category:'fibre', subcategory:'ACTIVE EQUIPMENT', price:0, slug:'qsfp-40g-er4', image:OP+'2020/08/active-equipment.jpg', description:'40Gb/s QSFP+ ER4 transceiver — extended-reach 40G module for long-haul singlemode fibre spans up to 40km.', specs:[{title:'SPECIFICATIONS',data:{'Type':'QSFP+ 40GBASE-ER4','Speed':'40 Gbps (4×10G WDM)','Fibre':'OS2 Singlemode LC duplex','Max Distance':'40km'}},{title:'STANDARDS',data:{'Standard':'IEEE 802.3ba','Approvals':'CE, RoHS'}}] },
    { id:242, name:'10.3Gb/s SFP+ Transceiver 2km',          category:'fibre', subcategory:'ACTIVE EQUIPMENT', price:0, slug:'sfp-10g-2km', image:OP+'2020/08/active-equipment.jpg', description:'10.3Gb/s SFP+ transceiver — 10G short-reach singlemode module supporting up to 2km over OS2 fibre.', specs:[{title:'SPECIFICATIONS',data:{'Type':'SFP+ 10GBASE-LRM','Speed':'10.3 Gbps','Fibre':'OS2 Singlemode LC duplex','Max Distance':'2km','Wavelength':'1310nm'}},{title:'STANDARDS',data:{'Standard':'IEEE 802.3ae','Approvals':'CE, RoHS'}}] },
    { id:243, name:'10G SFP+ Transceiver Singlemode 10km',   category:'fibre', subcategory:'ACTIVE EQUIPMENT', price:0, slug:'sfp-10g-sm-10km', image:OP+'2020/08/active-equipment.jpg', description:'10G SFP+ singlemode transceiver — 10G long-reach module supporting up to 10km over OS2 fibre for data centre interconnect.', specs:[{title:'SPECIFICATIONS',data:{'Type':'SFP+ 10GBASE-LR','Speed':'10 Gbps','Fibre':'OS2 Singlemode LC duplex','Max Distance':'10km','Wavelength':'1310nm'}},{title:'STANDARDS',data:{'Standard':'IEEE 802.3ae','Approvals':'CE, RoHS'}}] },
    { id:244, name:'10G SFP+ SR Transceiver Multimode',      category:'fibre', subcategory:'ACTIVE EQUIPMENT', price:0, slug:'sfp-10g-sr-mm', image:OP+'2020/08/active-equipment.jpg', description:'10G SFP+ SR multimode transceiver — short-reach 850nm module for 10G switching over OM3/OM4 multimode fibre.', specs:[{title:'SPECIFICATIONS',data:{'Type':'SFP+ 10GBASE-SR','Speed':'10 Gbps','Fibre':'OM3 (300m) / OM4 (400m) LC duplex','Wavelength':'850nm'}},{title:'STANDARDS',data:{'Standard':'IEEE 802.3ae','Approvals':'CE, RoHS'}}] },

    // ── FIBRE — ACTIVE OPTICAL CABLES ────────────────────────
    { id:245, name:'10G SFP+ Active Optical Cables',         category:'fibre', subcategory:'ACTIVE OPTICAL CABLES', price:0, slug:'aoc-10g-sfp', image:OP+'2022/09/Active-Optical-Cables.jpg', description:'10G SFP+ Active Optical Cables (AOC) — active copper-to-fibre integrated cables for 10G short-range data centre switching.', specs:[{title:'SPECIFICATIONS',data:{'Speed':'10 Gbps','Connector':'SFP+ both ends (integrated)','Lengths':'1m to 30m','Fibre':'OM3 internal','Application':'Top-of-rack 10G switching'}}] },
    { id:246, name:'25G SFP28 Active Optical Cables',        category:'fibre', subcategory:'ACTIVE OPTICAL CABLES', price:0, slug:'aoc-25g-sfp28', image:OP+'2022/09/Active-Optical-Cables.jpg', description:'25G SFP28 Active Optical Cables (AOC) — 25G integrated active optical cables for server-to-leaf switch connectivity.', specs:[{title:'SPECIFICATIONS',data:{'Speed':'25 Gbps','Connector':'SFP28 both ends','Lengths':'1m to 30m','Application':'25G server / leaf switch'}}] },
    { id:247, name:'40G QSFP+ Active Optical Cables',        category:'fibre', subcategory:'ACTIVE OPTICAL CABLES', price:0, slug:'aoc-40g-qsfp', image:OP+'2022/09/Active-Optical-Cables.jpg', description:'40G QSFP+ Active Optical Cables (AOC) — 40G integrated cables for spine-leaf data centre fabric connectivity.', specs:[{title:'SPECIFICATIONS',data:{'Speed':'40 Gbps','Connector':'QSFP+ both ends','Lengths':'1m to 30m','Application':'Data centre spine-leaf fabric'}}] },
    { id:248, name:'40G QSFP+ to 4×10G SFP+ AOC',           category:'fibre', subcategory:'ACTIVE OPTICAL CABLES', price:0, slug:'aoc-40g-to-4x10g', image:OP+'2022/09/Active-Optical-Cables.jpg', description:'40G QSFP+ to 4×10G SFP+ Active Optical Cables (AOC) — breakout AOC from 40G uplink to four 10G server connections.', specs:[{title:'SPECIFICATIONS',data:{'Speed':'40G → 4×10G breakout','Connector A':'QSFP+','Connector B':'4× SFP+','Lengths':'1m to 30m'}}] },
    { id:249, name:'100G QSFP28 Active Optical Cables',      category:'fibre', subcategory:'ACTIVE OPTICAL CABLES', price:0, slug:'aoc-100g-qsfp28', image:OP+'2022/09/Active-Optical-Cables.jpg', description:'100G QSFP28 Active Optical Cables (AOC) — 100G integrated active cables for hyperscale data centre 100G fabric.', specs:[{title:'SPECIFICATIONS',data:{'Speed':'100 Gbps (4×25G)','Connector':'QSFP28 both ends','Lengths':'1m to 30m','Application':'Hyperscale 100G fabric'}}] },
    { id:250, name:'100G QSFP28 to 4×25G SFP28 AOC',        category:'fibre', subcategory:'ACTIVE OPTICAL CABLES', price:0, slug:'aoc-100g-to-4x25g', image:OP+'2022/09/Active-Optical-Cables.jpg', description:'100G QSFP28 to 4×25G SFP28 Active Optical Cables (AOC) — breakout AOC from 100G uplink to four 25G server ports.', specs:[{title:'SPECIFICATIONS',data:{'Speed':'100G → 4×25G breakout','Connector A':'QSFP28','Connector B':'4× SFP28','Lengths':'1m to 30m'}}] },
    { id:251, name:'200G QSFP56 Active Optical Cables',      category:'fibre', subcategory:'ACTIVE OPTICAL CABLES', price:0, slug:'aoc-200g-qsfp56', image:OP+'2022/09/Active-Optical-Cables.jpg', description:'200G QSFP56 Active Optical Cables (AOC) — 200G integrated active cables for next-generation hyperscale data centre networks.', specs:[{title:'SPECIFICATIONS',data:{'Speed':'200 Gbps (8×25G)','Connector':'QSFP56 both ends','Lengths':'1m to 30m','Application':'Next-gen hyperscale 200G'}}] },
    { id:252, name:'400G QSFP56 Active Optical Cables',      category:'fibre', subcategory:'ACTIVE OPTICAL CABLES', price:0, slug:'aoc-400g-qsfp56', image:OP+'2022/09/Active-Optical-Cables.jpg', description:'400G QSFP56 Active Optical Cables (AOC) — 400G integrated active cables for future-ready AI/ML and hyperscale fabric.', specs:[{title:'SPECIFICATIONS',data:{'Speed':'400 Gbps (8×50G)','Connector':'QSFP56-DD or QSFP56 both ends','Lengths':'1m to 30m','Application':'AI/ML hyperscale 400G fabric'}}] },
  ],
  contacts: [],
  nextContactId: 1,
  adminPassword: 'pivot2026'
};

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };
