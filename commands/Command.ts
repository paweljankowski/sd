import { Repository } from '../repository'

export interface Command {

  execute(repository: Repository): void
}
