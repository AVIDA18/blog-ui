import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandYoutube,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Container,
  Group,
  Text,
  Image
} from '@mantine/core';
import classes from './Footer.module.css';
import logo from '../../assets/logo.png';

const data = [
  {
    title: 'CATEGORIES',
    links: [
      { label: 'Nature', link: '#' },
      { label: 'Mountains', link: '#' },
      { label: 'Forest', link: '#' },
      { label: 'Wildlife', link: '#' },
      { label: 'Adventure', link: '#' },
      { label: 'Travel', link: '#' },
      { label: 'Photography', link: '#' },
      { label: 'Hiking', link: '#' },
      { label: 'Camping', link: '#' },
      { label: 'Ocean', link: '#' },
      { label: 'Desert', link: '#' },
      { label: 'Rivers', link: '#' },
      { label: 'Lakes', link: '#' },
      { label: 'Valleys', link: '#' },
      { label: 'Caves', link: '#' },
      { label: 'Beaches', link: '#' },
      { label: 'Islands', link: '#' },
      { label: 'Waterfalls', link: '#' },
      { label: 'Glaciers', link: '#' },
      { label: 'Volcanoes', link: '#' },
      { label: 'Canyons', link: '#' },
      { label: 'Cliffs', link: '#' },
      { label: 'Meadows', link: '#' },
      { label: 'Jungles', link: '#' },
      { label: 'Tundra', link: '#' },
    ],
  },
];

export function FooterLinks() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text color='white' className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <a href="/">
            <Image src={logo} alt="Logo" width={120} style={{ cursor: 'pointer' }} />
          </a>
          <Text size="xs" c="dimmed" className={classes.description}>
            Build fully functional accessible web applications faster than ever
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © 2020 mantine.dev. All rights reserved.
        </Text>

        <Group gap={0} className={classes.social} justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandTwitter size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandYoutube size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle">
            <IconBrandInstagram size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  );
}
