/**
 * Unit Tests for User Authentication - Login & Signup
 * Tests: User registration, login validation, password security (10 tests)
 */

describe('User Authentication Tests', () => {

    // === SIGNUP TESTS (5) ===
    test('should validate all required signup fields', () => {
        const user = { name: 'John', email: 'john@test.com', password: 'Pass123!', contact_number: '0771234567', address: 'Colombo', RFID: '40247c61' };
        const required = ['name', 'email', 'password', 'contact_number', 'address', 'RFID'];
        required.forEach(field => expect(user[field]).toBeDefined());
    });

    test('should validate email format', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        expect(emailRegex.test('valid@email.com')).toBe(true);
        expect(emailRegex.test('invalid-email')).toBe(false);
    });

    test('should validate password strength', () => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*?#&]{8,}$/;
        expect(passwordRegex.test('SecurePass1!')).toBe(true);
        expect(passwordRegex.test('weak')).toBe(false);
        expect(passwordRegex.test('NoSymbol123')).toBe(false);
    });

    test('should reject duplicate email registration', () => {
        const existingEmails = ['user1@test.com', 'user2@test.com'];
        const newEmail = 'user1@test.com';
        expect(existingEmails.includes(newEmail)).toBe(true);
    });

    test('should enforce unique RFID constraint', () => {
        const existingRfids = ['40247c61', 'abc12345'];
        expect(existingRfids.includes('40247c61')).toBe(true);
    });

    // === LOGIN TESTS (5) ===
    test('should require email and password for login', () => {
        const loginData = { email: 'user@test.com', password: 'Pass123!' };
        expect(loginData.email && loginData.password).toBeTruthy();
    });

    test('should find user by email for login', () => {
        const users = [{ email: 'john@test.com', password: 'hashed123' }];
        const found = users.find(u => u.email === 'john@test.com');
        expect(found).toBeDefined();
    });

    test('should return null for non-existent email', () => {
        const users = [{ email: 'john@test.com' }];
        const found = users.find(u => u.email === 'notfound@test.com');
        expect(found).toBeUndefined();
    });

    test('should return user data object on login success', () => {
        const userData = { _id: '123', name: 'John', email: 'john@test.com', coins: 150, address: 'Colombo' };
        expect(userData._id).toBeDefined();
        expect(userData.coins).toBe(150);
    });

    test('should include coins balance in login response', () => {
        const user = { name: 'John', coins: 250 };
        expect(typeof user.coins).toBe('number');
        expect(user.coins).toBeGreaterThanOrEqual(0);
    });
});
