from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    FrameBreak,
    KeepInFrame,
    KeepTogether,
    NextPageTemplate,
    PageTemplate,
    Paragraph,
    Spacer,
)

from generation.cv_data import CV_DATA

ACCENT = colors.HexColor("#1c3d5a")
ACCENT_LIGHT = colors.HexColor("#eef3f8")
TEXT_DARK = colors.HexColor("#1a1a1a")
TEXT_GRAY = colors.HexColor("#5a5a5a")

PAGE_WIDTH, PAGE_HEIGHT = letter
SIDEBAR_WIDTH = 2.1 * inch
MAIN_WIDTH = PAGE_WIDTH - SIDEBAR_WIDTH
HEADER_HEIGHT = 1.7 * inch
BOTTOM = 0.3 * inch
BODY_HEIGHT = PAGE_HEIGHT - HEADER_HEIGHT - BOTTOM

FOCUS_NAMES = {"frontend": "Frontend", "backend": "Backend", "fullstack": "Full-Stack", "ai_ml": "AI/ML"}
AREA_TAGS = {
    "frontend": {"frontend"},
    "backend": {"backend"},
    "ai_ml": {"ai_ml"},
    "fullstack": {"frontend", "backend"},
}


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="NameHeader", fontName="Helvetica-Bold", fontSize=24, leading=28, textColor=colors.white))
    styles.add(ParagraphStyle(name="TitleLine", fontName="Helvetica", fontSize=12, leading=16, textColor=colors.HexColor("#cfe0ee"), spaceBefore=2))
    styles.add(ParagraphStyle(name="ContactLine", fontName="Helvetica", fontSize=9, leading=12, textColor=colors.HexColor("#dbe8f4"), spaceBefore=4))
    styles.add(ParagraphStyle(name="FocusLine", fontName="Helvetica-Oblique", fontSize=9.5, leading=13, textColor=colors.HexColor("#ffd479"), spaceBefore=4))
    styles.add(ParagraphStyle(name="SidebarHeader", fontName="Helvetica-Bold", fontSize=10.5, leading=14, textColor=ACCENT, spaceBefore=10, spaceAfter=4))
    styles.add(ParagraphStyle(name="SidebarBody", fontName="Helvetica", fontSize=9, leading=13, textColor=TEXT_DARK))
    styles.add(ParagraphStyle(name="MainHeader", fontName="Helvetica-Bold", fontSize=13, leading=16, textColor=ACCENT, spaceBefore=8, spaceAfter=6))
    styles.add(ParagraphStyle(name="EntryTitle", fontName="Helvetica-Bold", fontSize=10.5, leading=14, textColor=TEXT_DARK))
    styles.add(ParagraphStyle(name="EntryMeta", fontName="Helvetica-Oblique", fontSize=9, leading=12, textColor=TEXT_GRAY, spaceAfter=2))
    styles.add(ParagraphStyle(name="CVBullet", fontName="Helvetica", fontSize=9.5, leading=13.5, leftIndent=10, textColor=TEXT_DARK, spaceAfter=2))
    return styles


def matches(item, focus):
    return bool(AREA_TAGS[focus] & set(item.get("tags", [])))


def select(data, focus):
    if focus not in AREA_TAGS:
        return {
            "title": data["titles"]["general"],
            "summary": data["summaries"]["general"],
            "experience": data["experience"],
            "projects": data["projects"],
            "skills": data["skills"]["general"],
            "certifications": data["certifications"],
            "activities": data["activities"],
        }
    return {
        "title": data["titles"][focus],
        "summary": data["summaries"][focus],
        "experience": sorted(data["experience"], key=lambda job: not matches(job, focus)),
        "projects": [item for item in data["projects"] if matches(item, focus)],
        "skills": data["skills"][focus],
        "certifications": [item for item in data["certifications"] if matches(item, focus)],
        "activities": [item for item in data["activities"] if matches(item, focus)],
    }


def header_flow(data, content, focus, company, styles):
    contact = "  |  ".join(filter(None, [data.get("location"), data.get("email"), data.get("github")]))
    flow = [
        Paragraph(escape(data["name"]), styles["NameHeader"]),
        Paragraph(escape(content["title"]), styles["TitleLine"]),
        Paragraph(escape(contact), styles["ContactLine"]),
    ]
    if focus in FOCUS_NAMES:
        label = f"{FOCUS_NAMES[focus]} Focus"
        if company:
            label = f"{company} - {label}"
        flow.append(Paragraph(escape(label), styles["FocusLine"]))
    elif company:
        flow.append(Paragraph(escape(f"Prepared for {company}"), styles["FocusLine"]))
    return flow


def sidebar_flow(data, content, styles):
    flow = [Paragraph("Education", styles["SidebarHeader"])]
    for edu in data["education"]:
        flow.append(Paragraph(f"<b>{escape(edu['degree'])}</b>", styles["SidebarBody"]))
        flow.append(Paragraph(escape(edu["institution"]), styles["SidebarBody"]))
        flow.append(Paragraph(escape(edu["period"]), styles["SidebarBody"]))
        flow.append(Spacer(1, 6))

    flow.append(Paragraph("Skills", styles["SidebarHeader"]))
    for category, items in content["skills"]:
        flow.append(Paragraph(f"<b>{escape(category)}</b>", styles["SidebarBody"]))
        flow.append(Paragraph(escape(", ".join(items)), styles["SidebarBody"]))
        flow.append(Spacer(1, 5))

    if content["certifications"]:
        flow.append(Paragraph("Certifications", styles["SidebarHeader"]))
        for cert in content["certifications"]:
            flow.append(Paragraph(f"<b>{escape(cert['name'])}</b>", styles["SidebarBody"]))
            flow.append(Paragraph(escape(cert["issuer"]), styles["SidebarBody"]))
            flow.append(Spacer(1, 5))
    return flow


def main_flow(content, styles):
    flow = [
        Paragraph("Summary", styles["MainHeader"]),
        Paragraph(escape(content["summary"]), styles["CVBullet"]),
        Paragraph("Experience", styles["MainHeader"]),
    ]
    for job in content["experience"]:
        block = [
            Paragraph(escape(job["role"]), styles["EntryTitle"]),
            Paragraph(escape(f"{job['org']} - {job['period']}"), styles["EntryMeta"]),
        ]
        block += [Paragraph(f"- {escape(text)}", styles["CVBullet"]) for text in job["bullets"]]
        block.append(Spacer(1, 8))
        flow.append(KeepTogether(block))

    flow.append(Paragraph("Projects", styles["MainHeader"]))
    for project in content["projects"]:
        block = [Paragraph(escape(project["name"]), styles["EntryTitle"])]
        block += [Paragraph(f"- {escape(text)}", styles["CVBullet"]) for text in project["bullets"]]
        block.append(Spacer(1, 8))
        flow.append(KeepTogether(block))

    if content["activities"]:
        flow.append(Paragraph("Hackathons and Activities", styles["MainHeader"]))
        for item in content["activities"]:
            flow.append(
                KeepTogether([
                    Paragraph(escape(item["title"]), styles["EntryTitle"]),
                    Paragraph(f"- {escape(item['detail'])}", styles["CVBullet"]),
                    Spacer(1, 8),
                ])
            )
    return flow


def paint_first(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(ACCENT)
    canvas.rect(0, PAGE_HEIGHT - HEADER_HEIGHT, PAGE_WIDTH, HEADER_HEIGHT, stroke=0, fill=1)
    canvas.setFillColor(ACCENT_LIGHT)
    canvas.rect(0, 0, SIDEBAR_WIDTH, PAGE_HEIGHT - HEADER_HEIGHT, stroke=0, fill=1)
    canvas.restoreState()


def paint_rest(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(ACCENT_LIGHT)
    canvas.rect(0, 0, SIDEBAR_WIDTH, PAGE_HEIGHT, stroke=0, fill=1)
    canvas.restoreState()


def generate_cv(output_path, role_focus="general", company_name=None, data=None):
    base = data or CV_DATA
    focus = role_focus if role_focus in AREA_TAGS else "general"
    content = select(base, focus)
    styles = build_styles()

    doc = BaseDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=0,
        rightMargin=0,
        topMargin=0,
        bottomMargin=0,
        title=f"{base['name']} - CV",
        author=base["name"],
    )
    header_frame = Frame(0, PAGE_HEIGHT - HEADER_HEIGHT, PAGE_WIDTH, HEADER_HEIGHT, leftPadding=28, rightPadding=28, topPadding=20, bottomPadding=10, id="header")
    side_frame = Frame(0, BOTTOM, SIDEBAR_WIDTH, BODY_HEIGHT, leftPadding=16, rightPadding=12, topPadding=12, bottomPadding=8, id="side")
    main_frame = Frame(SIDEBAR_WIDTH, BOTTOM, MAIN_WIDTH, BODY_HEIGHT, leftPadding=20, rightPadding=24, topPadding=12, bottomPadding=8, id="main")
    later_frame = Frame(SIDEBAR_WIDTH, BOTTOM, MAIN_WIDTH, PAGE_HEIGHT - BOTTOM - 0.4 * inch, leftPadding=20, rightPadding=24, topPadding=12, bottomPadding=8, id="later")
    doc.addPageTemplates([
        PageTemplate(id="first", frames=[header_frame, side_frame, main_frame], onPage=paint_first),
        PageTemplate(id="rest", frames=[later_frame], onPage=paint_rest),
    ])

    story = [
        *header_flow(base, content, focus, company_name, styles),
        FrameBreak(),
        KeepInFrame(SIDEBAR_WIDTH - 28, BODY_HEIGHT - 20, sidebar_flow(base, content, styles), mode="shrink"),
        FrameBreak(),
        NextPageTemplate("rest"),
        *main_flow(content, styles),
    ]
    doc.build(story)
    return output_path
