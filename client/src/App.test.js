import { render, screen } from '@testing-library/react';
import Login from './components/Login';

// Smoke test (ARC-003): render the Login component directly — avoids the full
// App import chain (react-router-dom v7 / lazy routes) that react-scripts 5's
// jest resolver can't handle. Verifies the entry-point form renders with an
// associated label (UX-002 controlId) and a submit button.
test('Login renders a labelled username field and submit button', () => {
  render(<Login onLogin={() => {}} />);
  expect(screen.getByLabelText(/მომხმარებლის სახელი/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /შესვლა/i })).toBeInTheDocument();
});
