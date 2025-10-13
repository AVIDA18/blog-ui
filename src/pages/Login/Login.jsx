import {
    Anchor,
    Button,
    Checkbox,
    Group,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import styles from './Login.module.css';

export default function Login(props) {
    const [type, toggle] = useToggle(['login', 'register']);

    const form = useForm({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            terms: true,
        },

        validate: {
            username: (val) => {
                if (!val) return 'Username is required';
                if (/\s/.test(val)) return 'Username cannot contain spaces';
                return null;
            },
            email: (val) =>
                type === 'register' && !/^\S+@\S+$/.test(val)
                    ? 'Invalid email'
                    : null,
            password: (val) =>
                val.length < 3
                    ? 'Password should include at least 3 characters'
                    : null,
            confirmPassword: (val, values) =>
                type === 'register' && val !== values.password
                    ? 'Passwords do not match'
                    : null,
        },
    });

    const handleLogin = async () => {
        try {
            if (type === 'login') {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                    username: form.values.username,
                    password: form.values.password,
                });

                if (response.data.success) {
                    notifications.show({
                        title: 'Success',
                        message: 'You have successfully logged in!',
                        color: 'green',
                    });

                    // Optionally store token
                    // localStorage.setItem('token', response.data.token);
                } else {
                    notifications.show({
                        title: 'Login Failed',
                        message: response.data.message || 'Invalid credentials.',
                        color: 'red',
                    });
                }
            } else {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
                    username: form.values.username,
                    email: form.values.email,
                    password: form.values.password,
                });

                if (response.data.success) {
                    notifications.show({
                        title: 'Success',
                        message: 'Registration successful!',
                        color: 'green',
                    });

                    // Optionally redirect or switch to login form
                    toggle(); // switch to login form
                } else {
                    notifications.show({
                        title: 'Registration Failed',
                        message: response.data.message || 'Please try again.',
                        color: 'red',
                    });
                }
            }
        } catch (error) {
            notifications.show({
                title: 'Error',
                message:
                    error.response?.data?.message ||
                    'Something went wrong. Please try again later.',
                color: 'red',
            });
        }
    };

    return (
        <div className={styles.container}>
            <Paper
                radius="md"
                p="lg"
                withBorder
                className={styles.loginForm}
                {...props}
            >
                <Text size="lg" fw={500} className={styles.heading}>
                    {type === 'login' ? 'Sign In' : 'Register'}
                </Text>

                <form onSubmit={form.onSubmit(handleLogin)}>
                    <Stack>
                        <TextInput
                            required
                            label="User Name"
                            placeholder="Enter username"
                            value={form.values.username}
                            onChange={(event) =>
                                form.setFieldValue('username', event.currentTarget.value)
                            }
                            error={form.errors.username}
                            radius="md"
                            styles={{ label: { color: 'white' } }}
                        />

                        {type === 'register' && (
                            <TextInput
                                required
                                label="Email"
                                placeholder="hello@example.com"
                                value={form.values.email}
                                onChange={(event) =>
                                    form.setFieldValue('email', event.currentTarget.value)
                                }
                                error={form.errors.email}
                                radius="md"
                                styles={{ label: { color: 'white' } }}
                            />
                        )}

                        <PasswordInput
                            required
                            label={type === 'register' ? 'Set Password' : 'Password'}
                            placeholder="Your password"
                            value={form.values.password}
                            onChange={(event) =>
                                form.setFieldValue('password', event.currentTarget.value)
                            }
                            error={form.errors.password}
                            radius="md"
                            styles={{ label: { color: 'white' } }}
                        />

                        {type === 'register' && (
                            <PasswordInput
                                required
                                label="Confirm Password"
                                placeholder="Confirm your password"
                                value={form.values.confirmPassword}
                                onChange={(event) =>
                                    form.setFieldValue(
                                        'confirmPassword',
                                        event.currentTarget.value
                                    )
                                }
                                error={form.errors.confirmPassword}
                                radius="md"
                                styles={{ label: { color: 'white' } }}
                            />
                        )}

                        {type === 'register' && (
                            <Checkbox
                                label="I accept terms and conditions"
                                checked={form.values.terms}
                                onChange={(event) =>
                                    form.setFieldValue('terms', event.currentTarget.checked)
                                }
                                styles={{ label: { color: 'white' } }}
                            />
                        )}
                    </Stack>

                    <Group justify="space-between" mt="xl">
                        <Anchor
                            component="button"
                            type="button"
                            c="dimmed"
                            onClick={() => toggle()}
                            size="xs"
                        >
                            {type === 'register'
                                ? 'Already have an account? Sign In'
                                : "Don't have an account? Register"}
                        </Anchor>
                        <Button type="submit" radius="xl">
                            {upperFirst(type)}
                        </Button>
                    </Group>
                </form>
            </Paper>
        </div>
    );
}
