import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'


test.describe('Practice Day 9', () => {
  test('[P0] Practice route should render or redirect cleanly', async ({ page }) => {
    await page.goto('/practice')
    await expect(page.locator('body')).toBeVisible()
  })

  test('[P1] repo should ignore .env files (prevent secret commits)', async () => {
    const gitignorePath = fileURLToPath(new URL('../../../.gitignore', import.meta.url))
    const content = readFileSync(gitignorePath, 'utf-8')

    expect(content).toMatch(/^\.env\s*$/m)
    expect(content).toMatch(/^\.env\.\*\.local\s*$/m)
  })

  test('[P1] Day 9 MCQ option should match Udemy formatting (two-line answer, no semicolon)', async () => {
    const day9Path = fileURLToPath(new URL('../../../scripts/data/questions/day-9.json', import.meta.url))
    const raw = readFileSync(day9Path, 'utf-8')
    const questions = JSON.parse(raw)

    const q0 = questions[0]
    const opt = q0.options[4]

    expect(typeof opt).toBe('string')
    expect(opt).toContain('\n')
    expect(opt).not.toContain(';')
  })

  test('[P1] Practice page source should include day metadata mapping', async () => {
    const practicePath = fileURLToPath(new URL('../../src/pages/Practice.jsx', import.meta.url))
    const content = readFileSync(practicePath, 'utf-8')

    expect(content).toContain('DAY_META')
  })

  test('[P0] usePythonRunner should not contain hardcoded agent ingest telemetry endpoint', async () => {
    const filePath = fileURLToPath(new URL('../../src/hooks/usePythonRunner.js', import.meta.url))
    const content = readFileSync(filePath, 'utf-8')

    expect(content).not.toContain('127.0.0.1:7242/ingest')
  })
})
