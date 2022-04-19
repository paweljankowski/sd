import { Repository } from './repository'
import { SetDependencyCommand } from './commands/SetDependency.command'
import { InstallPackageCommand } from './commands/InstallPackage.command'
import { ListPackagesQuery } from './queries/ListPackages.query'
import { RemovePackageCommand } from './commands/RemovePackage.command'
import { createInterface } from 'readline'
import { createReadStream } from 'fs'

const repository = new Repository()

if (process.argv.length < 3) {
  console.log('Usage: npm start <commandFile>')
  process.exit(1)
}

const lineReader = createInterface({
  input: createReadStream(process.argv[2]),
})

lineReader.on('line', (line) => {
  const [command, ...args] = line.split(/\s+/)
  console.log(line)

  // this should be refactored into a command factory
  if (command === 'DEPEND') {
    new SetDependencyCommand(args[0], args.slice(1)).execute(repository)
  } else if (command === 'INSTALL') {
    new InstallPackageCommand(args[0]).execute(repository)
  } else if (command === 'LIST') {
    new ListPackagesQuery().execute(repository)
  } else if (command === 'REMOVE') {
    new RemovePackageCommand(args[0]).execute(repository)
  }
})
