import { testApiHandler } from 'next-test-api-route-handler';
import reversationsHandler from '@/pages/api/reservations/[reservationId]';
import userReservationHandler from '@/pages/api/users/[userId]/reservations';

jest.mock('@/lib/auth/utils');

describe("test reservations", () => {
    it('POST /api/reservations/[reservationId] create a new reservation', async () => {
        await testApiHandler({
            handler: reversationsHandler,
            paramsPatcher: (params) => {
                params.reservationId = 12354;
            },
            test: async ({ fetch }) => {
                const res = await fetch({ 
                    method: 'POST',
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: 1,
                        showId: 0,
                        seatCount: 5
                    }),
                });

                expect(res.status).toBe(201);
            }
        });

        await testApiHandler({
            handler: userReservationHandler,
            paramsPatcher: (params) => {
                params.userId = 1;
            },
            test: async ({ fetch }) => {
                const res = await fetch({ 
                    method: 'GET',
                });
                expect(res.status).toBe(200);

                const json = await res.json();
                expect(json.userReservations).toHaveLength(3);
            }
        });
    });
});
