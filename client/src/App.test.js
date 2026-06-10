import { render, screen } from '@testing-library/react';
import App from './App';

// Smoke test: when no auth token is present, the app must render the
// Login screen (BUILDEX PORTAL entry point). Replaces the old CRA
// "learn react" template test (ARC-003).
test('renders login screen when unauthenticated', () => {
  localStorage.clear();
  render(<App />);
  // Login form exposes a labelled username field and a submit button.
  expect(screen.getByLabelText(/მომხმარებლის სახელი/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /შესვლა/i })).toBeInTheDocument();
});
