/* eslint-env jest */

import 'flat-map-polyfill'
import { remove } from 'fs-extra'
import { nextBuild } from 'next-test-utils'
import { join } from 'path'

const fixturesDir = join(__dirname, '../..', 'scss-fixtures')

describe('Invalid CSS in _document', () => {
  const appDir = join(fixturesDir, 'invalid-module-document')

  beforeAll(async () => {
    await remove(join(appDir, '.next'))
  })

  it('should fail to build', async () => {
    const { code, stderr } = await nextBuild(appDir, [], {
      stderr: true,
    })
    expect(code).not.toBe(0)
    expect(stderr).toContain('Failed to compile')
    expect(stderr).toContain('styles.module.scss')
    expect(stderr).toMatch(
      /CSS.*cannot.*be imported within.*pages[\\/]_document\.js/
    )
    expect(stderr).toMatch(/Location:.*pages[\\/]_document\.js/)
  })
})

describe('Invalid Global CSS', () => {
  const appDir = join(fixturesDir, 'invalid-global')

  beforeAll(async () => {
    await remove(join(appDir, '.next'))
  })

  it('should fail to build', async () => {
    const { code, stderr } = await nextBuild(appDir, [], {
      stderr: true,
    })
    expect(code).not.toBe(0)
    expect(stderr).toContain('Failed to compile')
    expect(stderr).toContain('styles/global.scss')
    expect(stderr).toMatch(
      /Please move all first-party global CSS imports.*?pages(\/|\\)_app/
    )
    expect(stderr).toMatch(/Location:.*pages[\\/]index\.js/)
  })
})

describe('Invalid Global CSS with Custom App', () => {
  const appDir = join(fixturesDir, 'invalid-global-with-app')

  beforeAll(async () => {
    await remove(join(appDir, '.next'))
  })

  it('should fail to build', async () => {
    const { code, stderr } = await nextBuild(appDir, [], {
      stderr: true,
    })
    expect(code).not.toBe(0)
    expect(stderr).toContain('Failed to compile')
    expect(stderr).toContain('styles/global.scss')
    expect(stderr).toMatch(
      /Please move all first-party global CSS imports.*?pages(\/|\\)_app/
    )
    expect(stderr).toMatch(/Location:.*pages[\\/]index\.js/)
  })
})

describe('Valid and Invalid Global CSS with Custom App', () => {
  const appDir = join(fixturesDir, 'valid-and-invalid-global')

  beforeAll(async () => {
    await remove(join(appDir, '.next'))
  })

  it('should fail to build', async () => {
    const { code, stderr } = await nextBuild(appDir, [], {
      stderr: true,
    })
    expect(code).not.toBe(0)
    expect(stderr).toContain('Failed to compile')
    expect(stderr).toContain('styles/global.scss')
    expect(stderr).toContain('Please move all first-party global CSS imports')
    expect(stderr).toMatch(/Location:.*pages[\\/]index\.js/)
  })
})
