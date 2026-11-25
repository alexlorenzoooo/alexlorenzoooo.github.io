{
  const EMAIL = 'deleon7517@gmail.com';

  // Email chooser: every "Email me" link opens the pop-up instead of jumping straight to a mail app
  const dlg = document.getElementById('email-chooser');
  const addr = document.getElementById('mail-addr');
  const copyBtn = document.getElementById('copy-mail');

  document.querySelectorAll('[data-email]').forEach(link => {
    link.addEventListener('click', e => {
      if (!dlg || typeof dlg.showModal !== 'function') return; // old browsers fall back to mailto
      e.preventDefault();
      copyBtn.textContent = 'Copy';
      dlg.showModal();
    });
  });

  document.getElementById('close-mail').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.querySelectorAll('[data-mail-opt]').forEach(a => a.addEventListener('click', () => dlg.close()));

  copyBtn.addEventListener('click', async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(EMAIL); ok = true; }
    catch (err) {
      addr.select();
      try { ok = document.execCommand('copy'); } catch (err2) { ok = false; }
    }
    copyBtn.textContent = ok ? 'Copied' : 'Press Ctrl+C';
    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2200);
  });

  // Headshot: show the initials until headshot.jpg is uploaded
  const photo = document.querySelector('.photo');
  const img = photo && photo.querySelector('img');
  const noPhoto = () => photo.classList.add('nopic');
  if (img) {
    if (img.complete && !img.naturalWidth) noPhoto();
    img.addEventListener('error', noPhoto);
  }

  // Highlight the nav link for the section on screen
  const links = [...document.querySelectorAll('.links a')];
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));
}
