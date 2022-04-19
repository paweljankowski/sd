import { Repository } from '../repository'

export interface Query {

  execute(repository: Repository): void
}
