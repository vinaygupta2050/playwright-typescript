import { test, expect, buildBooking } from '../fixtures/api.fixtures';

test.describe('Delete Booking API', () => {

  test.describe('DELETE /booking/:id — happy path', () => {

    test('should return 201 when booking is deleted successfully', async ({ bookingClient, authToken }) => {
      // create a fresh booking specifically for this delete test
      const createResponse = await bookingClient.createBooking(buildBooking());
      const { bookingid }  = await createResponse.json();

      const deleteResponse = await bookingClient.deleteBooking(bookingid, authToken);
      expect(deleteResponse.status()).toBe(201);
    });

    test('should return 404 when fetching a deleted booking', async ({ bookingClient, authToken }) => {
      // create → delete → verify gone
      const createResponse = await bookingClient.createBooking(buildBooking());
      const { bookingid }  = await createResponse.json();

      await bookingClient.deleteBooking(bookingid, authToken);

      const fetchResponse = await bookingClient.getBookingById(bookingid);
      expect(fetchResponse.status()).toBe(404);
    });

    test('should not appear in booking list after deletion', async ({ bookingClient, authToken }) => {
      const createResponse = await bookingClient.createBooking(
        buildBooking({ firstname: 'DeleteMe', lastname: 'DeleteTest' })
      );
      const { bookingid } = await createResponse.json();

      await bookingClient.deleteBooking(bookingid, authToken);

      const listResponse = await bookingClient.getAllBookings({
        firstname: 'DeleteMe',
        lastname:  'DeleteTest',
      });
      const ids = (await listResponse.json()).map((b: { bookingid: number }) => b.bookingid);
      expect(ids).not.toContain(bookingid);
    });

  });

  test.describe('DELETE /booking/:id — auth failures', () => {

    test('should return 403 without auth token', async ({ bookingClient, createdBookingId }) => {
      const response = await bookingClient.deleteBooking(createdBookingId, 'invalidtoken');
      expect(response.status()).toBe(403);
    });

    test('should return 403 with empty token', async ({ bookingClient, createdBookingId }) => {
      const response = await bookingClient.deleteBooking(createdBookingId, '');
      expect(response.status()).toBe(403);
    });

  });

  test.describe('DELETE /booking/:id — edge cases', () => {

    test('should return 405 for non-existent booking ID', async ({ bookingClient, authToken }) => {
      const response = await bookingClient.deleteBooking(9999999, authToken);
      expect(response.status()).toBe(405);
    });

  });

});
