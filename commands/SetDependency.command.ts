import { Command } from './Command'
import { Repository } from '../repository'

export class SetDependencyCommand implements Command {
  constructor(readonly packageName: string, readonly dependencies: string[]) {}

  execute(repository: Repository) {
    if (!this.packageName) {
      throw new Error()
    }

    if (!this.dependencies || this.dependencies.length === 0) {
      throw new Error(`No dependencies specified for package ${this.packageName}`)
    }

    repository.setDependency(this.packageName, this.dependencies)
  }
}
