import { useEffect, useState } from 'react';
import {
    CabListItem,
    FocusPageLayout,
    FormField,
    HeroTitle,
    PageContents,
    Select,
    TextInput,
} from '@design-system';

type Cab = {
    id: string;
    model: string;
    segment: string;
    trunk: string;
    capacity: number;
    rating?: number;
    ratings: number;
    minutesAway: number;
    status: 'ARRIVING_SOON' | 'ARRIVED';
    isInTrafficJam: boolean;
};

export const CabServicePage = () => {
    const [destination, setDestination] = useState('');
    const [socket] = useState<WebSocket>(new WebSocket('ws://localhost:8080'));
    const [cabs, setCabs] = useState<Cab[]>([]);

    useEffect(() => {
        const callback = (event: any) => {
            const data = JSON.parse(event.data);

            if (data.destination === destination) {
                setCabs(
                    data.cabs.sort((a: Cab, b: Cab) => {
                        if (a.minutesAway !== b.minutesAway) {
                            return a.minutesAway - b.minutesAway;
                        }

                        if (a.isInTrafficJam !== b.isInTrafficJam) {
                            return a.isInTrafficJam ? 1 : -1;
                        }

                        const aRating = a.rating ?? 0;
                        const bRating = b.rating ?? 0;

                        if (aRating !== bRating) {
                            return bRating - aRating;
                        }

                        const aSegment = a.segment;
                        const bSegment = b.segment;
                        const segmentOrder: { [key: string]: number } = {
                            Economy: 0,
                            Compact: 1,
                            Premium: 2,
                            Luxury: 3,
                            Supercar: 4,
                        };

                        return segmentOrder[bSegment] - segmentOrder[aSegment];
                    }),
                );
            }
        };

        socket.addEventListener('message', callback);

        return () => {
            socket.removeEventListener('message', callback);
        };
    }, [destination, socket]);

    return (
        <FocusPageLayout>
            <HeroTitle title="/ Cabe Service" />
            <PageContents>
                <FormField label="Departure">
                    <TextInput disabled value="Event hotel" />
                </FormField>
                <FormField label="Destination">
                    <Select
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        items={[
                            { label: 'Main Venue', value: 'main-venue' },
                            { label: 'Players Entrance', value: 'players-entrance' },
                            { label: 'Backstage', value: 'backstage' },
                            { label: 'Cargo Entry', value: 'cargo-entry' },
                        ]}
                    />
                </FormField>
                {cabs.map((cab) => (
                    <CabListItem
                        key={cab.id}
                        model={cab.model}
                        eta={cab.minutesAway}
                        segment={cab.segment}
                        capacity={cab.capacity}
                        rating={cab.rating}
                        impediment={cab.isInTrafficJam ? 'Traffic jam' : undefined}
                    />
                ))}
            </PageContents>
        </FocusPageLayout>
    );
};
