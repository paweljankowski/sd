import { Repository } from '../repository'
import { Query } from './Query'

export class ListPackagesQuery implements Query {

  execute(repository: Repository) {
    for (let packageName of repository.packages.keys()) {
      console.log(`\t${packageName}`)
    }
  }
}
