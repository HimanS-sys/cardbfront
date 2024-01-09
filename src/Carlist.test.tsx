import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, test } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import Carlist from './components/Carlist';
import userEvent from "@testing-library/user-event";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
});

const wrapper = ( {children} : {children: React.ReactNode}) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

describe("Carlist tests", () => {
  test("component renders", () => {
    render(<Carlist />, {wrapper});
    expect(screen.getByText(/Loading/i)).toBeInTheDocument(); 
  });
  test("cars are fetched", async () => {
    render(<Carlist/>, {wrapper});
    await waitFor(() => screen.getByText(/New Car/i));
    expect(screen.getByText(/Ford/i)).toBeInTheDocument();
  });
  test("open new car modal", async () => {
    render(<Carlist />, {wrapper});
    await userEvent.click(screen.getByText(/New Car/i));
    expect(screen.getByText(/Save/i)).toBeInTheDocument();
  })
});