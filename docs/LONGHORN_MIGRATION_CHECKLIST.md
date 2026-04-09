# LONGHORN_MIGRATION_CHECKLIST.md

## Goal
Implement Longhorn Construction website on old template with minimal structural changes.

## Rules
- Keep layout and component structure unless a change is necessary
- Work one file group at a time
- Keep all copy in i18n files where possible
- No hardcoded strings unless technically required
- Check both locales after each meaningful change
- Do not move to the next sprint until current sprint is verified

---

## Project Status
- [x] Repo cloned / duplicated
- [x] New local project name created
- [x] New remote connected
- [x] New branch created for rebrand foundation
- [ ] Migration inventory completed
- [ ] Foundation rebrand completed
- [ ] Copy rewrite completed
- [ ] Media replacement completed
- [ ] QA completed
- [ ] Deployment completed

---

## Rebrand Scope
### Keeping
- [ ] Layout
- [ ] Section order
- [ ] Component structure
- [ ] Motion approach
- [ ] Bilingual setup
- [ ] Existing architecture

### Changing
- [ ] Brand name
- [ ] Logo
- [ ] Theme colors
- [ ] Copy
- [ ] Contact information
- [ ] Company details
- [ ] SEO metadata
- [ ] Social links
- [ ] Media/assets
- [ ] Project data
- [ ] Testimonials
- [ ] Legal/company references
- [ ] Domain references

---

## Inventory by Category

### 1) Branding references
Search for:
- CEU
- Céu
- ceu
- ptconstructionwebsite
- Think beyond the sky / Pense além do céu
- ceuconstruction

Files found:
- [ ]
- [ ]
- [ ]

Notes:
- 

---

### 2) Contact information
Search for:
- info@ceuconstruction.com / adriana@ceuconstruction.com
- phone number
- Brranco da Vaca, Aljezur
- whatsapp
- mail@ceuconstruction.com
- ceu.construction

Files found:
- [ ]
- [ ]
- [ ]

Notes:
- 

---

### 3) SEO / metadata
Check:
- page titles
- descriptions
- Open Graph
- Twitter metadata
- canonical URLs
- sitemap
- robots
- structured data
- favicon
- OG image

Files found:
- [ ]
- [ ]
- [ ]

Notes:
- 

---

### 4) i18n content
Check:
- i18n/en.json
- i18n/pt.json
- any namespace files
- hardcoded content outside i18n

Files found:
- [ ]
- [ ]
- [ ]

Notes:
- 

---

### 5) Header / navigation / footer
Check:
- logo
- nav labels
- CTA labels
- footer text
- footer contact info
- footer legal links

Files found:
- [ ]
- [ ]
- [ ]

Notes:
- 

---

### 6) Homepage sections
Check:
- hero
- stats
- methods / process
- services
- featured projects
- testimonials
- CTA
- trust signals

Files found:
- [ ]
- [ ]
- [ ]

Notes:
- 

---

### 7) Shared data sources
Check:
- services data
- projects data
- testimonials data
- company info config
- navigation config

Files found:
- [ ]
- [ ]
- [ ]

Notes:
- 

---

### 8) Assets / media
Check:
- logos
- hero images
- project images
- service images
- favicon
- OG image
- any PDFs / downloadable files

Files found:
- [ ]
- [ ]
- [ ]

Notes:
- 

---

### 9) Forms / integrations
Check:
- contact form submit target
- email endpoint
- analytics
- CAPTCHA / spam protection
- external integrations
- map embeds
- tracking IDs

Files found:
- [ ]
- [ ]
- [ ]

Notes:
- 

---

### 10) Legal / business details
Check:
- company legal name
- registration details
- address
- privacy policy
- terms
- cookie policy

Files found:
- [ ]
- [ ]
- [ ]

Notes:
- 

---

## Hardcoded Strings Audit
List any visible user-facing text found outside i18n.

Files found:
- [ ]
- [ ]
- [ ]

Action needed:
- [ ] move to i18n
- [ ] leave as technical constant
- [ ] discuss before changing

Notes:
- 

---

## CEU Leftovers Audit
List every old-brand leftover still present after each sprint.

Found:
- [ ]
- [ ]
- [ ]

Resolved:
- [ ]
- [ ]
- [ ]

---

## Risks
- [ ] Wrong contact email or phone still present
- [ ] Old domain still in metadata
- [ ] Old brand visible in alt text or hidden SEO fields
- [ ] Hardcoded strings missed
- [ ] Broken asset paths after media swap
- [ ] EN and PT content out of sync
- [ ] Old legal/company info left behind

Notes:
- 

---

## Ready for Sprint 1?
- [ ] Inventory complete
- [ ] Key files identified
- [ ] No blockers
- [ ] Ready to start foundation rebrand