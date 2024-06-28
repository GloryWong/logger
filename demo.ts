import { createLogger } from './index'

// Namespace: foo
const logger = createLogger('foo')
logger.debug('Hello world: %s.', '백선생, 백종원 중국집 짜장면 만들기~!')
logger.info('Hello world: %d.', 1234)
logger.warn('Hello world: %o.', true)
logger.error('Hello world: %o.', { name: 'Jajangmyeon', native: '짜장면' })

// Title-scope: bar
const log = logger('bar')
log.debug('Hello world: %s.', 'A thick sauce made of chunjang, diced pork, and vegetables')
log.info('Hello world: %d.', 5678)
log.warn('Hello world: %o.', false)
log.error('Hello world: %o.', { name: 'Jajangmyeon', native: '짜장면' })
