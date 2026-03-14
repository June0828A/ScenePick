import re

with open('/Users/admin/ScenePick/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Fix the main feed cards structure.
# Currently:
# <div class="content-thumb card__thumbnail" data-type="on-list" data-gradient="true" style="background-image: url('posters/parasite.png');">
#   <div class="card__info-wrap" style="color: white; padding: 20px; justify-content: flex-end; height: 100%;">
#     <div class="card__title-row">
#       <h2 class="card__title" style="color: white;">TITLE</h2>
#       <div class="badge">...</div>
#     </div>
#     <div class="card__meta" style="color: rgba(255,255,255,0.8);">영화 ∙ YEAR</div>
#   </div>
# </div>

def replace_card(m):
    url = m.group(1)
    title = m.group(2)
    badge = m.group(3)
    meta = m.group(4)
    # The badge icon needs its white filter removed if it's on white bg? No, badge has pink bg, so icon stays white.
    return f'''<div class="card__picture" style="background-image: {url};"></div>
          <div class="card__body">
            <div class="card__title-row">
              <h2 class="card__title">{title}</h2>
              <div class="badge">{badge}</div>
            </div>
            <div class="card__meta">{meta}</div>
          </div>'''

pattern = r'''<div class="content-thumb card__thumbnail" data-type="on-list" data-gradient="true" style="background-image: (url\([^)]+\));">\s*<div class="card__info-wrap" [^>]+>\s*<div class="card__title-row">\s*<h2 class="card__title"[^>]*>([^<]+)</h2>\s*<div class="badge">(.*?)</div>\s*</div>\s*<div class="card__meta"[^>]*>([^<]+)</div>\s*</div>\s*</div>'''

html = re.sub(pattern, replace_card, html, flags=re.DOTALL)

# Fix Detail View Hero structure.
# Currently:
# <div class="content-thumb detail-view__hero" data-type="on-page" style="background-color: var(--gray-100);"></div>
# <div class="detail-view__info">
#   <div class="card__info-wrap" style="color: black !important;">
#     <div class="card__title-row">
#...

detail_hero_pattern = r'''<div class="content-thumb detail-view__hero" data-type="on-page" style="background-color: var\(--gray-100\);"></div>\s*<div class="detail-view__info">\s*<div class="card__info-wrap" style="color: black !important;">\s*<div class="card__title-row">\s*<h1 class="card__title js-detail-title">([^<]+)</h1>\s*<div class="badge">(.*?)</div>\s*</div>\s*<div class="card__meta js-detail-meta">([^<]+)</div>\s*</div>'''

def replace_detail(m):
    return f'''<div class="content-thumb detail-view__hero" data-type="on-page" data-gradient="true" style="background-color: var(--gray-100);">
          <div class="card__info-wrap" style="padding: 24px; justify-content: flex-end; height: 100%;">
            <div class="card__title-row">
              <h1 class="card__title js-detail-title" style="color: var(--white); font-size: 40px;">{m.group(1)}</h1>
              <div class="badge">{m.group(2)}</div>
            </div>
            <div class="card__meta js-detail-meta" style="color: rgba(255, 255, 255, 0.8);">{m.group(3)}</div>
          </div>
        </div>
        <div class="detail-view__info">'''

html = re.sub(detail_hero_pattern, replace_detail, html, flags=re.DOTALL)

with open('/Users/admin/ScenePick/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
