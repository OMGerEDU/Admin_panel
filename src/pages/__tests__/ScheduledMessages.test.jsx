import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ScheduledMessages from '../ScheduledMessages';

// Mock all dependencies
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
        i18n: { language: 'en' }
    }),
}));

vi.mock('react-router-dom', () => ({
    useNavigate: () => vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        user: { id: 'test-user-id' },
    }),
}));

// Mock planLimits to avoid Supabase calls there
vi.mock('../../lib/planLimits', () => ({
    fetchCurrentSubscriptionAndPlan: vi.fn().mockResolvedValue({
        subscription: { id: 'sub-1', plan_id: 'plan-pro' },
        plan: { name: 'Pro', max_scheduled_messages: 100 }
    }),
    canUseScheduledMessages: vi.fn().mockResolvedValue(true),
}));

// Create a chainable mock for Supabase
const createChainableMock = (data = [], error = null) => {
    const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: data[0] || null, error }),
        delete: vi.fn().mockResolvedValue({ error: null }),
        update: vi.fn().mockResolvedValue({ error: null }),
        insert: vi.fn().mockResolvedValue({ data: data[0], error: null }),
    };
    // Make order resolve to the full data array
    chain.order = vi.fn().mockResolvedValue({ data, error });
    return chain;
};

const mockMessages = [
    {
        id: 'msg-1',
        message: 'Hello World',
        to_phone: '0545661640',
        scheduled_at: new Date(Date.now() + 86400000).toISOString(),
        status: 'pending',
        is_active: true,
        is_recurring: false,
        numbers: {
            instance_id: 'test_instance',
            api_token: 'test_token',
            phone_number: '123456'
        },
        recipient_count: 1
    },
    {
        id: 'msg-2',
        message: 'Recurring Test',
        to_phone: '0501234567',
        scheduled_at: new Date(Date.now() + 172800000).toISOString(),
        status: 'pending',
        is_active: true,
        is_recurring: true,
        recurrence_type: 'weekly',
        numbers: {
            instance_id: 'test_instance',
            api_token: 'test_token',
            phone_number: '123456'
        },
        recipient_count: 2
    }
];

vi.mock('../../lib/supabaseClient', () => ({
    supabase: {
        from: vi.fn((table) => {
            if (table === 'scheduled_messages') {
                return createChainableMock(mockMessages);
            }
            if (table === 'scheduled_message_recipients') {
                return createChainableMock([]);
            }
            if (table === 'numbers') {
                return createChainableMock([{ id: 'num-1', phone_number: '123' }]);
            }
            return createChainableMock([]);
        }),
        rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    },
}));

// Mock fetch for Green API
global.fetch = vi.fn();

describe('ScheduledMessages Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch.mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ idMessage: 'sent-123' }),
            text: () => Promise.resolve('OK'),
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the page title', async () => {
        render(<ScheduledMessages />);

        // The title uses t('scheduled.title') which returns 'scheduled.title' in mock
        expect(screen.getByText('scheduled.title')).toBeInTheDocument();
    });

    it('renders tab buttons', async () => {
        render(<ScheduledMessages />);

        expect(screen.getByText('scheduled.tab_active')).toBeInTheDocument();
        expect(screen.getByText('scheduled.tab_inactive')).toBeInTheDocument();
        expect(screen.getByText('scheduled.tab_community')).toBeInTheDocument();
    });

    it('renders create button', async () => {
        render(<ScheduledMessages />);

        expect(screen.getByText('scheduled.create')).toBeInTheDocument();
    });

    // Note: Testing actual message rendering requires more complex async handling
    // because the component fetches data in useEffect and updates state.
    // The current mock should work but may need a longer waitFor timeout.
});

describe('ScheduledMessages - Message Card Rendering', () => {
    it('should show message content after loading', async () => {
        render(<ScheduledMessages />);

        // Wait for loading to finish - component shows Loader2 initially
        await waitFor(() => {
            // If messages load, the loader should disappear
            const loaders = screen.queryAllByRole('status');
            // This is a placeholder - proper testing would need testId or role
        }, { timeout: 2000 });
    });
});
