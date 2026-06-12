<template>
  <div class="page about-page">
    <!-- Hero -->
    <div class="page-hero">
      <div class="hero-orb orb-l"></div>
      <div class="hero-orb orb-r"></div>
      <div class="container page-hero-content reveal">
        <span class="section-label">About Us</span>
        <h1 class="page-title">
          Storytellers by <span class="gradient-text">Passion</span>, <br />
          Professionals by <span class="gradient-text">Craft</span>
        </h1>
        <p class="page-subtitle">
          Since 2016, 4K Production has been redefining multimedia excellence in East Africa — one frame at a time.
        </p>
      </div>
    </div>

    <!-- Story Section -->
    <section class="section story-section">
      <div class="container">
        <div class="story-grid">
          <div class="story-visual reveal reveal-left">
            <div class="story-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=700"
                alt="4K Production Team at work"
              />
              <div class="story-badge floating-badge">
                <span class="badge-num gradient-text">8+</span>
                <span class="badge-label">Years of Excellence</span>
              </div>
            </div>
          </div>

          <div class="story-content reveal reveal-right">
            <span class="section-label" style="text-align:left;">Our Story</span>
            <h2 class="story-title">
              Born from a <span class="gradient-text">Love of Visual Storytelling</span>
            </h2>
            <p class="story-text">
              4K Production was founded in 2016 by a team of cinematographers and creative directors who shared a single belief: that every organization, brand, and individual has a story worth telling — and that story deserves to be told beautifully.
            </p>
            <p class="story-text">
              What started as a two-person video crew has grown into a full-service multimedia production house with 20+ professionals, a state-of-the-art studio facility, and a portfolio spanning commercial advertising, documentary films, live events, and corporate media.
            </p>
            <p class="story-text">
              Today, 4K Production is trusted by some of East Africa's most respected brands, NGOs, and government organizations to create media that informs, inspires, and drives impact.
            </p>

            <div class="story-stats">
              <div class="story-stat" v-for="s in storyStats" :key="s.label">
                <span class="stat-val gradient-text">{{ s.val }}</span>
                <span class="stat-lbl">{{ s.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="section mv-section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Our Purpose</span>
          <h2 class="section-title">Mission & <span class="gradient-text">Vision</span></h2>
        </div>

        <div class="mv-grid">
          <div class="mv-card glass-panel reveal reveal-left">
            <div class="mv-icon mission-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <h3 class="mv-title">Our Mission</h3>
            <p class="mv-text">
              To empower organizations and individuals to communicate their stories with maximum visual impact through world-class multimedia production services — making high-quality content accessible, purposeful, and results-driven.
            </p>
            <ul class="mv-list">
              <li v-for="item in missionPoints" :key="item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ item }}
              </li>
            </ul>
          </div>

          <div class="mv-card glass-panel reveal reveal-right">
            <div class="mv-icon vision-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <h3 class="mv-title">Our Vision</h3>
            <p class="mv-text">
              To be the most trusted and creatively celebrated multimedia production company in Africa — a place where local stories reach global audiences, and where every production raises the bar for quality and cultural authenticity.
            </p>
            <ul class="mv-list">
              <li v-for="item in visionPoints" :key="item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="section values-section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">What Drives Us</span>
          <h2 class="section-title">Our Core <span class="gradient-text">Values</span></h2>
        </div>

        <div class="values-grid">
          <div
            v-for="(val, i) in values"
            :key="val.title"
            class="value-card glass-card reveal"
            :class="`reveal-delay-${(i % 4) + 1}`"
          >
            <div class="value-num gradient-text">0{{ i + 1 }}</div>
            <h4 class="value-title">{{ val.title }}</h4>
            <p class="value-desc">{{ val.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="section team-section">
      <div class="container">
        <div class="section-header">
          <span class="section-label">The Crew</span>
          <h2 class="section-title">Meet the <span class="gradient-text">Team</span></h2>
          <p class="section-subtitle">Creative minds dedicated to turning your vision into reality.</p>
        </div>

        <div class="team-grid">
          <div
            v-for="(member, i) in team"
            :key="member.name"
            class="team-card glass-card reveal"
            :class="`reveal-delay-${(i % 4) + 1}`"
          >
            <div class="member-avatar" :style="{ background: member.avatarGrad }">
              {{ member.initials }}
            </div>
            <h3 class="member-name">{{ member.name }}</h3>
            <span class="member-role glass-tag glass-tag-purple">{{ member.role }}</span>
            <p class="member-bio">{{ member.bio }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section">
      <div class="container text-center">
        <h2 class="section-title reveal">Work With Our Team</h2>
        <p class="section-subtitle reveal reveal-delay-1" style="margin-bottom:36px;">
          Let's collaborate on something extraordinary.
        </p>
        <div class="flex justify-center gap-16 flex-wrap reveal reveal-delay-2">
          <router-link to="/request" class="btn btn-primary btn-animated">Start a Project</router-link>
          <router-link to="/contact"  class="btn btn-outline">Contact Us</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'

const { initReveal } = useScrollReveal()
onMounted(() => initReveal())

const storyStats = [
  { val: '500+', label: 'Projects' },
  { val: '200+', label: 'Clients'  },
  { val: '20+',  label: 'Team Members' },
  { val: '15+',  label: 'Awards Won' }
]

const missionPoints = [
  'Deliver cinema-quality multimedia productions',
  'Serve clients with transparency and professionalism',
  'Invest in local creative talent',
  'Ensure every story resonates with its audience'
]

const visionPoints = [
  'Become Africa\'s #1 multimedia production company',
  'Champion authentic African storytelling',
  'Lead innovation in 4K and immersive media',
  'Build a globally recognized creative brand'
]

const values = [
  { title: 'Creative Excellence', desc: 'We push the boundaries of what\'s possible in every project, refusing to settle for anything less than exceptional.' },
  { title: 'Authentic Storytelling', desc: 'We believe powerful media starts with a true story. We dig deep to find the authentic narrative that resonates.' },
  { title: 'Client Partnership', desc: 'We treat every client as a long-term partner, investing deeply in understanding their goals and exceeding expectations.' },
  { title: 'Technical Mastery', desc: 'We stay ahead of the curve, continuously upgrading our equipment and skills to deliver cutting-edge productions.' }
]

const team = [
  { name: 'Jean-Claude Nkurunziza', initials: 'JN', role: 'Founder & Executive Producer', bio: 'With 15 years of experience in film and advertising, Jean-Claude leads the creative direction and business strategy of 4K Production.', avatarGrad: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' },
  { name: 'Amina Hassan',            initials: 'AH', role: 'Head Cinematographer',        bio: 'Award-winning cinematographer specializing in documentary and commercial productions. RED camera certified with a passion for natural light.', avatarGrad: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' },
  { name: 'Patrick Uwimana',         initials: 'PU', role: 'Lead Video Editor',           bio: 'Master of post-production, color grading, and visual effects. Patrick ensures every frame of our productions meets the highest standard.', avatarGrad: 'linear-gradient(135deg, #7c3aed, #0891b2)' },
  { name: 'Grace Mukamana',          initials: 'GM', role: 'Motion Graphics Director',    bio: 'Creative animator and motion designer with expertise in 2D/3D animation, broadcast packages, and brand identity videos.', avatarGrad: 'linear-gradient(135deg, #0891b2, #7c3aed)' },
  { name: 'David Kagabo',            initials: 'DK', role: 'Commercial Director',         bio: 'Strategic creative director specializing in high-impact commercial ads. David brings brand stories to life with compelling narratives.', avatarGrad: 'linear-gradient(135deg, #a78bfa, #22d3ee)' },
  { name: 'Cynthia Ingabire',        initials: 'CI', role: 'Photography Director',        bio: 'Commercial and editorial photographer with an eye for detail and a talent for capturing authentic, striking images that tell stories.', avatarGrad: 'linear-gradient(135deg, #22d3ee, #a78bfa)' }
]
</script>

<style scoped>
/* Page hero */
.page-hero {
  position:    relative;
  min-height:  420px;
  display:     flex;
  align-items: flex-end;
  padding-bottom: clamp(48px, 7vw, 80px);
  padding-top:    calc(var(--header-height) + 16px);
  overflow:    hidden;
  text-align:  center;
}

.hero-orb {
  position:      absolute;
  border-radius: 50%;
  filter:        blur(100px);
  opacity:       0.12;
}

.orb-l { width:500px;height:500px;background:var(--clr-purple);top:-200px;left:-150px; }
.orb-r { width:450px;height:450px;background:var(--clr-aqua);bottom:-150px;right:-100px; }

.page-hero-content { position:relative;z-index:1; }

.page-title {
  font-size:     clamp(2rem, 5vw, 3.5rem);
  font-weight:   800;
  margin:        12px 0 20px;
  line-height:   1.15;
}

.page-subtitle {
  font-size:   clamp(1rem, 2vw, 1.15rem);
  color:       var(--text-secondary);
  max-width:   560px;
  margin:      0 auto;
  line-height: 1.7;
}

/* Story */
.story-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 6vw, 72px);
  align-items: center;
}

.story-visual { position: relative; }

.story-img-wrap {
  border-radius: var(--radius-xl);
  overflow: hidden;
  position: relative;
}

.story-img-wrap img {
  width:      100%;
  aspect-ratio: 4/3;
  object-fit: cover;
}

.story-badge {
  position:    absolute;
  bottom:      24px;
  left:        24px;
  background:  rgba(8,11,20,0.85);
  border:      var(--glass-border);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-lg);
  padding:     16px 20px;
  text-align:  center;
}

.badge-num {
  display:     block;
  font-family: var(--font-display);
  font-size:   2rem;
  font-weight: 800;
  line-height: 1;
}

.badge-label {
  font-size:  0.8rem;
  color:      var(--text-secondary);
  margin-top: 4px;
  display:    block;
}

.story-title {
  font-size:     clamp(1.6rem, 3vw, 2.2rem);
  font-weight:   800;
  margin:        12px 0 20px;
  line-height:   1.25;
}

.story-text {
  font-size:     0.95rem;
  color:         var(--text-secondary);
  line-height:   1.8;
  margin-bottom: 16px;
}

.story-stats {
  display:  flex;
  gap:      32px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.story-stat { display:flex;flex-direction:column;gap:4px; }

.stat-val {
  font-family: var(--font-display);
  font-size:   2rem;
  font-weight: 800;
  line-height: 1;
}

.stat-lbl {
  font-size: 0.8rem;
  color:     var(--text-muted);
}

/* Mission/Vision */
.mv-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(20px, 4vw, 40px);
}

.mv-card {
  padding: clamp(28px, 4vw, 40px);
}

.mv-icon {
  width:           52px;
  height:          52px;
  border-radius:   var(--radius-md);
  display:         flex;
  align-items:     center;
  justify-content: center;
  margin-bottom:   20px;
  color:           #fff;
}

.mission-icon { background: var(--grad-primary); }
.vision-icon  { background: var(--grad-primary-rev); }

.mv-title {
  font-size:     1.4rem;
  font-weight:   800;
  margin-bottom: 16px;
}

.mv-text {
  font-size:     0.95rem;
  color:         var(--text-secondary);
  line-height:   1.8;
  margin-bottom: 24px;
}

.mv-list {
  list-style: none;
  display:    flex;
  flex-direction: column;
  gap: 10px;
}

.mv-list li {
  display:     flex;
  align-items: center;
  gap:         8px;
  font-size:   0.9rem;
  color:       var(--text-secondary);
}

.mv-list li svg { flex-shrink:0;color:var(--clr-aqua-light); }

/* Values */
.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(16px, 2.5vw, 24px);
}

.value-card {
  padding:   28px 24px;
}

.value-num {
  font-family:   var(--font-display);
  font-size:     2rem;
  font-weight:   800;
  line-height:   1;
  margin-bottom: 12px;
  opacity:       0.7;
}

.value-title {
  font-size:     1rem;
  font-weight:   700;
  margin-bottom: 10px;
}

.value-desc {
  font-size:   0.875rem;
  color:       var(--text-secondary);
  line-height: 1.65;
}

/* Team */
.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(16px, 2.5vw, 28px);
}

.team-card {
  padding:    28px 24px;
  text-align: center;
  display:    flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.member-avatar {
  width:           72px;
  height:          72px;
  border-radius:   50%;
  display:         flex;
  align-items:     center;
  justify-content: center;
  font-family:     var(--font-display);
  font-size:       1.4rem;
  font-weight:     800;
  color:           #fff;
  box-shadow:      0 4px 20px rgba(139,92,246,0.4);
  flex-shrink:     0;
}

.member-name {
  font-size:   1rem;
  font-weight: 700;
}

.member-bio {
  font-size:   0.85rem;
  color:       var(--text-secondary);
  line-height: 1.65;
}

/* Responsive */
@media (max-width: 1024px) {
  .values-grid { grid-template-columns: repeat(2, 1fr); }
  .team-grid   { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .story-grid { grid-template-columns: 1fr; }
  .mv-grid    { grid-template-columns: 1fr; }
  .values-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 600px) {
  .values-grid { grid-template-columns: 1fr; }
  .team-grid   { grid-template-columns: 1fr; }
}
</style>
