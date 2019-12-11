let GetBlobFromStream

try {
  GetBlobFromStream = require('./getBlobFromStream.worker.js.js')
} catch (e) {
  console.warn(`getBlobFromStream webWorker couldn't run`)
}

export {GetBlobFromStream}
