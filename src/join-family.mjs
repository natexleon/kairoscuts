import { img } from './layout.mjs';

const field = (label, input, wide = false) => `<label class="apply-field${wide ? ' apply-wide' : ''}"><span>${label}</span>${input}</label>`;
const options = (items) => '<option value="">Select an option</option>' + items.map((s) => `<option>${s}</option>`).join('');
const checks = (name, items) => `<div class="apply-choices">${items.map((s) => `<label><input type="checkbox" name="${name}" value="${s}" /><span>${s}</span></label>`).join('')}</div>`;

export const joinFamily = `
  <section class="family-section" id="join-family" data-section="join-family">
    <div class="wrap">
      <div class="family-card">
        <div class="family-copy">
          <p class="label">A place to belong</p>
          <h2>Good people.<br />Great craft.<br /><span>Your next chapter.</span></h2>
          <p>A shared love of the craft. A team that has your back. At Kairos, the people behind the chairs make the shop.</p>
          <p>Whether you’re an experienced barber or building your skills, we’d love to get to know you.</p>
          <button type="button" class="btn family-button" id="openApplication" aria-haspopup="dialog" aria-controls="barberApplication">Join the Kairos family</button>
          <span class="family-footnote">Tell us your story. Let’s see where it goes.</span>
          <noscript><p>Email <a href="mailto:ddrneptune@gmail.com">ddrneptune@gmail.com</a> to introduce yourself and share your experience, portfolio and availability.</p></noscript>
        </div>
        <div class="family-photo">${img('kairos-cuts-team-stoney-creek-barbershop', { alt: 'The Kairos Cuts family together inside the shop', sizes: '(min-width: 801px) 45vw, 100vw' })}<span>One shop. A shared standard.</span></div>
      </div>
      <div id="applicationReceived" class="application-received" role="status" hidden><h3>Thanks for introducing yourself.</h3><p>Your application has been submitted. The Kairos team will review it and get in touch if there’s a fit.</p></div>
    </div>
  </section>

  <dialog class="apply-dialog" id="barberApplication" aria-labelledby="applicationTitle" aria-describedby="applicationIntro">
    <div class="apply-header"><div><p class="apply-eyebrow">Join the Kairos family</p><h2 id="applicationTitle">Let’s get to know you.</h2></div><button type="button" class="apply-close" aria-label="Close application">×</button></div>
    <p id="applicationIntro" class="apply-intro">A little about you, your craft, and what comes next. About 4 minutes.</p>
    <ol class="apply-progress" aria-label="Application progress"><li aria-current="step"><span>1</span>About you</li><li><span>2</span>Your craft</li><li><span>3</span>Your fit</li><li><span>4</span>Review</li></ol>
    <p class="apply-step-status" id="applicationStepStatus" aria-live="polite">Step 1 of 4 · About you</p>
    <form id="candidateForm" action="https://formsubmit.co/ddrneptune@gmail.com" method="POST">
      <input type="hidden" name="_subject" value="Kairos family — barber application" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_next" value="https://kairoscuts.com/?application=received#join-family" />
      <div class="apply-honey" aria-hidden="true"><label>Leave this field empty<input type="text" name="_honey" tabindex="-1" autocomplete="off" /></label></div>
      <fieldset class="apply-step"><legend>First, the introduction.</legend><p class="apply-help">How can we reach you? Fields marked * are required.</p><div class="apply-grid">
        ${field('Full name *', '<input name="Full name" autocomplete="name" required maxlength="120" />')}
        ${field('Email address *', '<input type="email" name="email" autocomplete="email" required maxlength="254" />')}
        ${field('Phone number *', '<input type="tel" name="Phone" autocomplete="tel" required minlength="7" maxlength="40" />')}
        ${field('City / area *', '<input name="City" autocomplete="address-level2" required maxlength="120" placeholder="e.g. Stoney Creek" />')}
        ${field('What are you looking for? *', '<select name="Interested role" required>' + options(['Barber','Senior barber','Apprentice barber','Hairstylist / braid specialist','Open to a conversation']) + '</select>', true)}
      </div></fieldset>
      <fieldset class="apply-step" hidden><legend>Tell us about your craft.</legend><p class="apply-help">Every journey looks different. We’re interested in yours.</p><div class="apply-grid">
        ${field('Time behind the chair *', '<select name="Experience" required>' + options(['Just getting started','Less than 1 year','1–2 years','3–5 years','6–10 years','10+ years']) + '</select>')}
        ${field('Training / certification status *', '<select name="Training status" required>' + options(['Licensed / certified hairstylist','Registered apprentice','Currently in barber / hairstyling school','Completed barber training','Self-taught / informal training','Other — details below']) + '</select>')}
        ${field('Your background *', '<textarea name="Training and work background" required maxlength="3000" rows="3" placeholder="Training, schools, shops you’ve worked at, mentors — tell us how you got here."></textarea>', true)}
        <div class="apply-field apply-wide"><span id="servicesLabel">Services you’re comfortable with</span><div role="group" aria-labelledby="servicesLabel">${checks('Services', ['Fades / tapers','Classic cuts','Scissor work','Beard work','Kids’ cuts','Braids / styling'])}</div></div>
        <div class="apply-field apply-wide"><span id="texturesLabel">Hair types you work with</span><div role="group" aria-labelledby="texturesLabel">${checks('Hair types', ['Straight','Wavy','Curly','Coily / textured'])}</div></div>
        ${field('Portfolio / work link', '<input type="url" name="Portfolio" maxlength="500" placeholder="https://…" />')}
        ${field('Instagram handle', '<input name="Instagram" maxlength="100" placeholder="@yourhandle" autocapitalize="none" />')}
      </div></fieldset>
      <fieldset class="apply-step" hidden><legend>Make room for what’s next.</legend><p class="apply-help">Let’s see how your next chapter could fit into ours.</p><div class="apply-grid">
        ${field('Preferred schedule *', '<select name="Preferred schedule" required>' + options(['Full-time','Part-time','Apprenticeship','Flexible / let’s discuss']) + '</select>')}
        ${field('When could you start? *', '<select name="Start availability" required>' + options(['As soon as possible','Within 2 weeks','Within a month','1–3 months','Just exploring for now']) + '</select>')}
        <div class="apply-field apply-wide"><span id="daysLabel">Days you’re available *</span><div role="group" aria-labelledby="daysLabel">${checks('Available days', ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'])}</div><span class="apply-help">Choose at least one. The shop is closed Sundays.</span></div>
        ${field('Any scheduling details?', '<textarea name="Schedule details" maxlength="1000" rows="2" placeholder="Evenings, preferred hours, notice period, or anything else we should know."></textarea>', true)}
        ${field('Why Kairos — and what would you bring to the family? *', '<textarea name="Introduction" required maxlength="3000" rows="4" placeholder="Your approach, what you love about barbering, and what you’d like to grow into."></textarea>', true)}
        ${field('References', '<select name="References">' + options(['Available on request','Not yet — happy to discuss']) + '</select>')}
        ${field('How did you hear about us?', '<input name="Referral source" maxlength="200" placeholder="A friend, Instagram, a visit to the shop…" />')}
      </div></fieldset>
      <fieldset class="apply-step" hidden><legend>Looks like you?</legend><p class="apply-help">Give your details a final look. You can go back and change anything.</p><div id="applicationReview" class="apply-review"></div><label class="apply-consent"><input type="checkbox" name="Contact consent" value="Agreed" required /><span>I agree to share these details with Kairos Cuts through FormSubmit and be contacted about opportunities. *</span></label><p class="apply-help">Only share professional information. Please don’t include identity documents or private client details. Your application goes to the shop’s team, not a public listing.</p></fieldset>
      <p id="applicationError" class="apply-error" role="alert" hidden></p>
      <div class="apply-actions"><button type="button" class="btn ghost" id="applicationBack" hidden>Back</button><button type="submit" class="btn" id="applicationNext">Continue</button></div>
      <p class="apply-delivery">On submission, you’ll complete a quick spam check with FormSubmit. Your application is emailed to the Kairos team.</p>
    </form>
  </dialog>`;
