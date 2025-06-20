const socialLinks = [
  {
    href: 'https://x.com/k1npira_vrc',
    class: 'twitter',
    icon: 'fab fa-twitter',
    label: 'Twitter'
  },
  {
    href: 'https://github.com/',
    class: 'github',
    icon: 'fab fa-github',
    label: 'GitHub'
  },
  {
    href: 'https://note.com/k1npira',
    class: 'note',
    icon: 'fas fa-edit',
    label: 'note'
  },
  {
    href: 'https://vrchat.com/home',
    class: 'vrchat',
    icon: 'fas fa-vr-cardboard',
    label: 'VRChat'
  }
];

window.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.social-links');
  container.innerHTML = '';
  socialLinks.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.className = `social-link ${link.class}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = `<i class="${link.icon}"></i> ${link.label}`;
    container.appendChild(a);
  });
});