import * as migration_20261029_042636_inicial from './20261029_042636_inicial';

export const migrations = [
  {
    up: migration_20261029_042636_inicial.up,
    down: migration_20261029_042636_inicial.down,
    name: '20261029_042636_inicial'
  },
];
