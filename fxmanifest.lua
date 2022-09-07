fx_version "cerulean"

description "Financing resource. Accounts, Cash, Invoices, Transactions."
author "Project Error"
version '1.0.0'
repository 'https://github.com/project-error/fivem-react-boilerplate-lua'

lua54 'yes'

games {
  "gta5",
  "rdr3"
}

ui_page 'web/dist/index.html'

client_script {
 "src/dist/client.js",
 "src/client/lua/interaction.lua"
} 
server_script "src/dist/server.js"

files {
  'web/dist/index.html',
  'web/dist/**/*',
  'config.json'
}
