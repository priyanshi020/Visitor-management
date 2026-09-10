import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import visitorsReducer from '../features/visitors/visitorsSlice';
import LoginPage from './LoginPage';

function renderLoginPage() {
  const store = configureStore({ reducer: { auth: authReducer, visitors: visitorsReducer } });
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>
  );
}

describe('LoginPage', () => {
  it('shows validation errors when submitting an empty form', async () => {
    renderLoginPage();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  it('shows an error for an invalid email', async () => {
    renderLoginPage();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument();
  });
});
