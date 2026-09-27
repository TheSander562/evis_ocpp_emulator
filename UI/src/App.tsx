import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Group,
  Modal,
  NavLink,
  PasswordInput,
  Stack,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useQuery } from '@tanstack/react-query';
import {
  IconBolt,
  IconCar,
  IconHistory,
  IconLock,
  IconLogout,
} from '@tabler/icons-react';
import { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { getAuthStatus, register, token } from './lib/api';
import { CarsPage } from './pages/CarsPage';
import { ChargePointsPage } from './pages/ChargePointsPage';
import { SessionsPage } from './pages/SessionsPage';

const SITE_TITLE = 'EVIS OCPP Emulator';

const NAV = [
  { to: '/', label: 'Charge Points', icon: IconBolt },
  { to: '/cars', label: 'Cars', icon: IconCar },
  { to: '/sessions', label: 'Sessions', icon: IconHistory },
];

function LockControl() {
  const status = useQuery({ queryKey: ['auth-status'], queryFn: getAuthStatus });
  const [opened, handlers] = useDisclosure(false);
  const form = useForm({ initialValues: { email: '', password: '' } });

  if (status.data?.locked) {
    const logout = () => {
      token.clear();
      window.location.reload();
    };
    return (
      <>
        <Button
          visibleFrom="sm"
          variant="light"
          color="gray"
          leftSection={<IconLogout size={16} />}
          onClick={logout}
        >
          Logout
        </Button>
        <Tooltip label="Logout" hiddenFrom="sm">
          <ActionIcon
            hiddenFrom="sm"
            variant="light"
            color="gray"
            size="lg"
            onClick={logout}
          >
            <IconLogout size={18} />
          </ActionIcon>
        </Tooltip>
      </>
    );
  }

  const submit = form.onSubmit(async (values) => {
    try {
      const { accessToken } = await register(values.email, values.password);
      token.set(accessToken);
      notifications.show({ color: 'green', message: 'Instance locked' });
      window.location.reload();
    } catch {
      notifications.show({ color: 'red', message: 'Could not register' });
    }
  });

  return (
    <>
      <Button
        visibleFrom="sm"
        variant="light"
        leftSection={<IconLock size={16} />}
        onClick={handlers.open}
      >
        Lock instance
      </Button>
      <Tooltip label="Lock instance" hiddenFrom="sm">
        <ActionIcon
          hiddenFrom="sm"
          variant="light"
          size="lg"
          onClick={handlers.open}
        >
          <IconLock size={18} />
        </ActionIcon>
      </Tooltip>
      <Modal opened={opened} onClose={handlers.close} title="Lock this instance">
        <form onSubmit={submit}>
          <Stack>
            <TextInput label="Email" {...form.getInputProps('email')} />
            <PasswordInput
              label="Password"
              description="At least 8 characters"
              {...form.getInputProps('password')}
            />
            <Button type="submit">Create account &amp; lock</Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}

export default function App() {
  const location = useLocation();
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure(false);

  useEffect(() => {
    const current = NAV.find((item) => item.to === location.pathname);
    document.title = current ? `${current.label} | ${SITE_TITLE}` : SITE_TITLE;
  }, [location.pathname]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 240,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="xs">
            <Burger
              opened={mobileOpened}
              onClick={toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <IconBolt color="var(--mantine-color-yellow-6)" />
            <Title order={4}>EVIS OCPP Emulator</Title>
          </Group>
          <LockControl />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            component={Link}
            to={item.to}
            label={item.label}
            active={location.pathname === item.to}
            leftSection={<item.icon size={18} />}
            onClick={closeMobile}
          />
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Routes>
          <Route path="/" element={<ChargePointsPage />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/sessions" element={<SessionsPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}
