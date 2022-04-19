import { Command } from './Command'
import { Repository } from '../repository'

export class InstallPackageCommand implements Command {
  constructor(private readonly packageName: string) {}

  execute(repository: Repository) {
    if (!this.packageName) {
      throw new Error('Package name is required')
    }

    try {
      repository.installPackage(this.packageName)
    } catch (err) {
      console.log(`\t${(err as Error).message}`)
    }
  }
}
