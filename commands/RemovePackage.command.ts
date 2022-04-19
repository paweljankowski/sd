import { Command } from './Command'
import { Repository } from '../repository'

export class RemovePackageCommand implements Command {
  constructor(readonly packageName: string) { }

  execute(repository: Repository) {
    if (!this.packageName) {
      throw new Error('Package name is required')
    }

    try {
      repository.removePackage(this.packageName)
    } catch (err) {
      console.log(`\t${(err as Error).message}`)
    }
  }
}
