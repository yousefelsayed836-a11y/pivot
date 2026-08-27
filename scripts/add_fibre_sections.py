import json
import re
import urllib.request
from pathlib import Path

import pypdfium2 as pdfium

ROOT = Path(r"D:\pivot-website")
PUBLIC = ROOT / "public"
UPLOADS = PUBLIC / "img" / "uploads"
DATA = ROOT / "data.json"

UPLOADS.mkdir(parents=True, exist_ok=True)


def download(url, out):
    if out.exists() and out.stat().st_size > 1000:
        return
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=45) as res:
        out.write_bytes(res.read())


def pdf_first_page(pdf_path, out_path):
    if out_path.exists() and out_path.stat().st_size > 1000:
        return
    pdf = pdfium.PdfDocument(str(pdf_path))
    page = pdf[0]
    bitmap = page.render(scale=1.9)
    image = bitmap.to_pil()
    image.save(out_path, "JPEG", quality=88)
    page.close()
    pdf.close()


cabinet_sources = [
    (
        "FTTH/ONU Cabinet",
        "OP_FTTH_ONU_Cabinet_Rev.1.0.1.pdf",
        "https://optronicsplus.net/downloads/datasheets/cabinets/OP_FTTH_ONU_Cabinet_Rev.1.0.1.pdf",
    ),
    (
        "Free Standing Cabinet",
        "OP_Free_Standing_Cabinet_Rev.1.0.1.pdf",
        "https://optronicsplus.net/downloads/datasheets/cabinets/OP_Free_Standing_Cabinet_Rev.1.0.1.pdf",
    ),
    (
        "Wall Mount Cabinet",
        "OP_Wall_Mount_Cabinet_Rev.1.0.1.pdf",
        "https://optronicsplus.net/downloads/datasheets/cabinets/OP_Wall_Mount_Cabinet_Rev.1.0.1.pdf",
    ),
]

for _, pdf_name, url in cabinet_sources:
    pdf_path = UPLOADS / pdf_name
    img_path = UPLOADS / pdf_name.replace(".pdf", ".jpg")
    download(url, pdf_path)
    pdf_first_page(pdf_path, img_path)

flex_img = UPLOADS / "High-Density-Fibre-Optic-Circuit-Flexplane.jpg"
download(
    "https://optronicsplus.net/wp-content/uploads/2022/09/High-Density-Fibre-Optic-Circuit-Flexplane.jpg",
    flex_img,
)

db = json.loads(DATA.read_text(encoding="utf-8"))
products = db.get("products", [])
existing_names = {p.get("name", "").strip().lower() for p in products}
next_id = max([p.get("id", 0) for p in products] or [0]) + 1


def add_product(product):
    global next_id
    if product["name"].lower() in existing_names:
        return
    product["id"] = next_id
    next_id += 1
    products.append(product)
    existing_names.add(product["name"].lower())


add_product({
    "name": "FTTH/ONU Cabinet",
    "category": "fibre",
    "subcategory": "CABINETS",
    "price": 0,
    "description": "Optronics Plus FTTH/ONU cabinet designed for telecom operator and building owner requirements, with 19-inch mounting compatibility, cable entry facilities and secure lockable access.",
    "descHtml": "<h3>FTTH/ONU Cabinet</h3><p>Designed for FTTH and ONU deployments where compact, secure and serviceable fibre infrastructure is required.</p><ul><li>Compatible with standard 19-inch mounting</li><li>Top and bottom cable entry with knockouts</li><li>Lockable front glass door with ventilated metal frame</li><li>Powder-coated cold rolled carbon steel construction</li><li>IP20 protection rating</li></ul>",
    "image": "/img/uploads/OP_FTTH_ONU_Cabinet_Rev.1.0.1.jpg",
    "slug": "ftth-onu-cabinet",
    "units": "",
    "specs": [
        {"title": "FEATURES", "data": {
            "Mounting": "Standard 19-inch compatible",
            "Cable Entry": "Top and bottom cable entry with knockouts",
            "Door": "Lockable front glass door with ventilated metal frame",
            "Material": "Cold rolled carbon steel sheet",
            "Finish": "Textured powder coat",
            "Protection Rating": "IP20",
            "Available Colours": "RAL 7035, 9010, 9002, 9005"
        }},
        {"title": "ORDERING EXAMPLE", "data": {
            "Example Code": "OPSR-12 60 15-FONU",
            "Example Description": "Optronics 12U 600x150 flush mount ONU cabinet"
        }}
    ],
})

add_product({
    "name": "Free Standing Cabinet",
    "category": "fibre",
    "subcategory": "CABINETS",
    "price": 0,
    "description": "Optronics Plus free standing rack cabinet for LAN/WAN, networking, telecommunication, computer systems and data room applications.",
    "descHtml": "<h3>Free Standing Cabinet</h3><p>Heavy-duty free standing cabinet designed for structured cabling, networking, telecom and data room installations.</p><ul><li>Industrial grade heavy-duty steel construction</li><li>Standard 19-inch compatibility</li><li>Lockable glass or perforated front door options</li><li>Roof fan support and airflow openings</li><li>Top and bottom cable entry with removable side panels</li></ul>",
    "image": "/img/uploads/OP_Free_Standing_Cabinet_Rev.1.0.1.jpg",
    "slug": "free-standing-cabinet",
    "units": "",
    "specs": [
        {"title": "FEATURES", "data": {
            "Construction": "Industrial grade heavy duty steel",
            "Mounting": "Standard 19-inch compatible",
            "Doors": "Glass door or perforated metal door options",
            "Access": "Removable side panels",
            "Cable Entry": "Top and bottom cable entry",
            "Ventilation": "Roof mount fan support and airflow openings",
            "Supply": "Fully assembled or flat pack"
        }},
        {"title": "AVAILABLE CAPACITY", "data": {
            "Heights": "15U, 18U, 22U, 27U, 32U, 37U, 42U, 47U",
            "Widths": "600mm / 800mm",
            "Depths": "600mm / 800mm / 1000mm"
        }}
    ],
})

add_product({
    "name": "Wall Mount Cabinet",
    "category": "fibre",
    "subcategory": "CABINETS",
    "price": 0,
    "description": "Optronics Plus wall mount cabinet for smaller networks and structured cabling components, built to manage and secure network wiring in minimal space.",
    "descHtml": "<h3>Wall Mount Cabinet</h3><p>Compact wall mount enclosure for branch networks, telecom rooms and structured cabling equipment.</p><ul><li>Single section or double section configuration</li><li>Standard 19-inch mounting compatibility</li><li>Top and bottom cable entry</li><li>Lockable front glass door with ventilated frame</li><li>Removable side panel and ventilation support</li></ul>",
    "image": "/img/uploads/OP_Wall_Mount_Cabinet_Rev.1.0.1.jpg",
    "slug": "wall-mount-cabinet",
    "units": "",
    "specs": [
        {"title": "FEATURES", "data": {
            "Configuration": "Single section or double section",
            "Mounting": "Standard 19-inch compatible",
            "Cable Entry": "Top and bottom",
            "Door": "Lockable front glass door with ventilated metal frame",
            "Panels": "Removable side panels",
            "Finish": "Durable textured powder coat"
        }},
        {"title": "AVAILABLE CAPACITY", "data": {
            "Heights": "4U, 6U, 9U, 12U, 15U, 18U, 22U",
            "Widths": "600mm",
            "Depths": "450mm / 600mm"
        }}
    ],
})

add_product({
    "name": "High Density Fibre Optic Circuit Flexplane",
    "category": "fibre",
    "subcategory": "HIGH DENSITY FIBRE OPTIC CIRCUIT FLEXPLANE",
    "price": 0,
    "description": "Optronics Plus high-density fibre optic circuit flexplane solution for compact, scalable fibre routing in demanding data centre environments.",
    "descHtml": "<h3>High Density Fibre Optic Circuit Flexplane</h3><p>A high-density fibre routing platform designed to support compact, scalable and carefully managed fibre connectivity for modern data centre infrastructure.</p><ul><li>High-density fibre circuit management</li><li>Designed for space-constrained installations</li><li>Supports scalable fibre infrastructure design</li><li>Suitable for high-performance datacentre environments</li></ul>",
    "image": "/img/uploads/High-Density-Fibre-Optic-Circuit-Flexplane.jpg",
    "slug": "high-density-fibre-optic-circuit-flexplane",
    "units": "",
    "specs": [
        {"title": "APPLICATION", "data": {
            "Product Type": "High-density fibre optic circuit flexplane",
            "Use Case": "Datacentre fibre circuit routing and management",
            "Environment": "High-density fibre infrastructure"
        }},
        {"title": "SOURCE", "data": {
            "Manufacturer": "Optronics Plus",
            "Product Range": "Fibre Optic Solutions"
        }}
    ],
})

DATA.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")

html_files = list(PUBLIC.glob("*.html"))
nav_items = [
    '<li><a href="/products-fibre?filter=CABINETS">Cabinets</a></li>',
    '<li><a href="/products-fibre?filter=HIGH%20DENSITY%20FIBRE%20OPTIC%20CIRCUIT%20FLEXPLANE">High Density Fibre Optic Circuit Flexplane</a></li>',
]
for path in html_files:
    text = path.read_text(encoding="utf-8", errors="replace")
    if "High Density Fibre Optic Circuit Flexplane" not in text and "Active Components</a></li>" in text:
        text = text.replace(
            '<li><a href="/products-fibre">Active Components</a></li>',
            '<li><a href="/products-fibre">Active Components</a></li>\n                ' + "\n                ".join(nav_items),
        )
    path.write_text(text, encoding="utf-8")

pf = PUBLIC / "products-fibre.html"
text = pf.read_text(encoding="utf-8")
if 'data-filter="CABINETS"' not in text:
    text = text.replace(
        '<button class="cat-tab" data-filter="ACTIVE EQUIPMENT">Active Equipment</button>',
        '<button class="cat-tab" data-filter="ACTIVE EQUIPMENT">Active Equipment</button>\n      <button class="cat-tab" data-filter="CABINETS">Cabinets</button>\n      <button class="cat-tab" data-filter="HIGH DENSITY FIBRE OPTIC CIRCUIT FLEXPLANE">Flexplane</button>',
    )
pf.write_text(text, encoding="utf-8")

main_js = PUBLIC / "js" / "main.js"
text = main_js.read_text(encoding="utf-8", errors="replace")
if "URLSearchParams(window.location.search)" not in text:
    text = text.replace(
        "      const filter = tab.dataset.filter;\n      document.querySelectorAll('.product-card').forEach(card => {",
        "      const filter = tab.dataset.filter;\n      const url = new URL(window.location.href);\n      if (filter && filter !== 'all') url.searchParams.set('filter', filter); else url.searchParams.delete('filter');\n      history.replaceState(null, '', url);\n      document.querySelectorAll('.product-card').forEach(card => {",
    )
    text = text.replace(
        "    initProductTabs();\n  } catch (err) {",
        "    initProductTabs();\n    const requestedFilter = new URLSearchParams(window.location.search).get('filter');\n    if (requestedFilter) {\n      const tab = Array.from(document.querySelectorAll('.cat-tab')).find(t => t.dataset.filter === requestedFilter);\n      if (tab) tab.click();\n    }\n  } catch (err) {",
    )
main_js.write_text(text, encoding="utf-8")

print(f"Added products where missing. Product count: {len(products)}. New max id: {max(p['id'] for p in products)}")
