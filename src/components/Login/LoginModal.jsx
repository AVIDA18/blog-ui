import { Modal, TextInput, PasswordInput, Button, Stack } from '@mantine/core';
import { useState } from 'react';

export default function LoginModal({ opened, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log({ email, password });
    onClose(); // optionally close modal after login
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Log in" centered>
      <Stack>
        <TextInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
        <Button onClick={handleLogin}>Log in</Button>
      </Stack>
    </Modal>
  );
}
