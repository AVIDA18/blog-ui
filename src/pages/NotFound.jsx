import { Button, Container, Group, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container style={{ textAlign: 'center', paddingTop: '100px' }}>
      <Title order={1} size="8rem" style={{ color: 'white', marginBottom: '20px' }}>
        404
      </Title>
      <Title order={2} style={{ color: 'white', marginBottom: '20px' }}>
        Page Not Found
      </Title>
      <Text size="lg" style={{ color: '#ccc', marginBottom: '40px' }}>
        The page you are looking for does not exist.
      </Text>
      <Group justify="center">
        <Button onClick={() => navigate('/')} size="lg">
          Go Home
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)} size="lg">
          Go Back
        </Button>
      </Group>
    </Container>
  );
}