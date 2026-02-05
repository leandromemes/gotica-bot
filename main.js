import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function start() {
  console.log('🦇 Iniciando Gótica Bot...')
  
  let args = [path.join(__dirname, 'index.js'), ...process.argv.slice(2)]
  
  let p = spawn(process.argv[0], args, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
  })

  p.on('message', data => {
    if (data === 'reset') {
      console.log('🔄 Reiniciando Gótica Bot...')
      p.kill()
      start()
    }
  })

  p.on('exit', code => {
    console.error(`⚠️ O processo do Bot saiu com o código: ${code}. Reiniciando em 5 segundos...`)
    setTimeout(() => start(), 5000)
  })
}

start()