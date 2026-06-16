export default defineEventHandler(() => {
  return {
    status: 'ok',
    name: '拔草君',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  }
})
