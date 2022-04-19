export type PackageData = {
  requiredBy: string[]
  installedManually: boolean
}

export class PackageAlreadyInstalledError extends Error {
  constructor(name: string) {
    super(`${name} is already installed.`)
  }
}

export class PackageIsNotInstalledError extends Error {
  constructor(name: string) {
    super(`${name} is not installed.`)
  }
}

export class PackageHasInstalledDependencies extends Error {
  constructor(name: string) {
    super(`${name} is still needed.`)
  }
}

export class Repository {
  readonly packages: Map<string, PackageData>
  readonly dependencies: Map<string, string[]>

  constructor() {
    this.packages = new Map<string, PackageData>()
    this.dependencies = new Map<string, string[]>()
  }

  setDependency(packageName: string, dependencies: string[]) {
    const dependency = this.dependencies.get(packageName)
    if (!dependency) {
      this.dependencies.set(packageName, dependencies)
    } else {
      this.dependencies.set(packageName, [...dependencies, ...dependency])
    }
  }

  installPackage(packageName: string, dependencyOf?: string) {
    if (this.packages.get(packageName) && !dependencyOf) {
      throw new PackageAlreadyInstalledError(packageName)
    }

    // do we have any dependencies? If yes, install them first
    const dependencies = this.dependencies.get(packageName)
    if (dependencies) {
      dependencies.forEach(dependency => {
        this.installPackage(dependency, packageName)
      })
    }

    if (this.packages.get(packageName) && dependencyOf) { // package is already installed, so just update the dependency list
      const pkg = this.packages.get(packageName)
      if (pkg) {
        const requiredBy = [...pkg.requiredBy, dependencyOf]
        this.packages.set(packageName, {
          requiredBy,
          installedManually: pkg.installedManually
        })

      }
    } else {
      console.log(`\tInstalling ${packageName}`)
      const requiredBy = dependencyOf ? [dependencyOf] : []
      this.packages.set(packageName, { requiredBy, installedManually: true })
    }
  }

  removePackage(packageName: string) {
    const pkg = this.packages.get(packageName)
    if (!pkg) {
      throw new PackageIsNotInstalledError(packageName)
    }

    if (pkg.requiredBy.length > 0) {
      throw new PackageHasInstalledDependencies(packageName)
    }

    console.log(`\tRemoving ${packageName}`)
    this.packages.delete(packageName)

    // clean up dependencies
    const dependencies = this.dependencies.get(packageName)
    if (dependencies) {
      dependencies.forEach(dependency => {
        const pkg = this.packages.get(dependency)
        if (pkg) {
          const requiredBy = pkg.requiredBy.filter(requiredBy => requiredBy !== packageName)
          this.packages.set(dependency, {
            requiredBy,
            installedManually: pkg.installedManually
          })

          if (requiredBy.length === 0 && !pkg.installedManually) {
            this.removePackage(dependency)
          }
        }
      })
    }
  }

}
