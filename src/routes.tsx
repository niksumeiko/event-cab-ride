import { FocusPageLayout, HeroTitle } from '@design-system';
import { LandingPage } from './landing/useCases/LandingPage';

export const routes = [
    {
        index: true,
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '*',
        element: (
            <FocusPageLayout>
                <HeroTitle title="Page not found" disabled />
            </FocusPageLayout>
        ),
    },
];
