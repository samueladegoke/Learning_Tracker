import { faker } from '@faker-js/faker';

export const createUser = (overrides = {}) => ({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    username: faker.internet.userName(),
    full_name: faker.person.fullName(),
    created_at: faker.date.recent().toISOString(),
    ...overrides,
});

export const createUsers = (count: number) => Array.from({ length: count }, () => createUser());
