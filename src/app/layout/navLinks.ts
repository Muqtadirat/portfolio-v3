interface NavLinksProps {
  title: string;
  href: string;
}

const navLinks: NavLinksProps[] = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Work', href: '/work' },
  { title: 'Contact me', href: '/#contact' },
];

export const isNavActive = (href: string, pathname: string, hash: string) => {
  if (href === '/#contact') return hash === '#contact';
  if (href === '/') return pathname === '/' && hash !== '#contact';
  return pathname === href;
};

export default navLinks;
