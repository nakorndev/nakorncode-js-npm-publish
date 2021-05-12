const fs = require('fs')
const https = require('https')

const main = (url, downloadPath, options = {}) => {
  return new Promise((resolve, reject) => {
    const req = https.request(url, (res) => {
      if (!res.headers['content-type'].startsWith('application/')) {
        return reject(new Error('url is not application/*'))
      }

      const writeFile = fs.createWriteStream(downloadPath)
      const fileSize = res.headers['content-length']
      if (!options.quite) {
        console.log(`- download... (total file size: ${(fileSize / 1024 / 1024).toFixed(2)}MB)`)
      }

      let progress = 0

      res.on('data', (chunk) => {
        progress += chunk.length / fileSize
        if (!options.quite) {
          console.log(`- download (${(progress * 100).toFixed(2)}%)`)
        }
      })

      res.on('end', () => {
        return resolve()
      })

      res.on('error', (err) => {
        return reject(err)
      })

      res.pipe(writeFile)
    })

    req.end()
  })
}

module.exports = main
