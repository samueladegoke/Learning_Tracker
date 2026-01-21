import { test as base } from '@playwright/test';
import { authFixture, AuthFixture } from './auth.fixture';

export type Fixtures = AuthFixture;

export const test = base.extend<AuthFixture>(authFixture);
export { expect } from '@playwright/test';
