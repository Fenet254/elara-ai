import json

def build_polish_prompt(data, role_focus, company_name):
    focus_note = f"for a {role_focus.replace('_', ' ')} role" if role_focus not in ("general", "fullstack") else "for a general audience"
    company_note = f" at {company_name}" if company_name else ""
    payload = json.dumps({
        "summary": data["summary"],
        "experience": data["experience"],
        "projects": data["projects"],
    })
    return f"""You are rewriting resume content for Fenet Gizaw, tailored {focus_note}{company_note}.

Rules:
- Never change a fact: every date, organization name, technology name, and number must stay exactly as given.
- Rewrite the wording of the summary and every bullet so it reads freshly written, not copy-pasted.
- Emphasize the angle most relevant to {role_focus.replace('_', ' ')} without inventing anything new.
- Keep each bullet to one concise line.
- Return ONLY valid JSON, no markdown fences, matching this exact shape and the same number of entries in the same order as the source data:

{{"summary": "string", "experience": [{{"bullets": ["string"]}}], "projects": [{{"bullets": ["string"]}}]}}

SOURCE DATA:
{payload}"""

def polish_cv_content(data, role_focus, company_name, model):
    prompt = build_polish_prompt(data, role_focus, company_name)
    try:
        response = model.generate_content(prompt, request_options={"timeout": 60})
        raw = response.text.strip().replace("```json", "").replace("```", "").strip()
        polished = json.loads(raw)
    except Exception:
        return data

    merged = dict(data)
    merged["summary"] = polished.get("summary") or data["summary"]

    merged_experience = []
    polished_exp = polished.get("experience", [])
    for i, exp in enumerate(data["experience"]):
        new_exp = dict(exp)
        if i < len(polished_exp) and polished_exp[i].get("bullets"):
            new_exp["bullets"] = polished_exp[i]["bullets"]
        merged_experience.append(new_exp)
    merged["experience"] = merged_experience

    merged_projects = []
    polished_proj = polished.get("projects", [])
    for i, proj in enumerate(data["projects"]):
        new_proj = dict(proj)
        if i < len(polished_proj) and polished_proj[i].get("bullets"):
            new_proj["bullets"] = polished_proj[i]["bullets"]
        merged_projects.append(new_proj)
    merged["projects"] = merged_projects

    return merged
