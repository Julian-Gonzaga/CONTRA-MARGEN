import * as migration_20261029_042636_inicial from './20261029_042636_inicial';
import * as migration_20261029_131615_blob_objectkey from './20261029_131615_blob_objectkey';

export const migrations = [
  {
    up: migration_20261029_042636_inicial.up,
    down: migration_20261029_042636_inicial.down,
    name: '20261029_042636_inicial',
  },
  {
    up: migration_20261029_131615_blob_objectkey.up,
    down: migration_20261029_131615_blob_objectkey.down,
    name: '20261029_131615_blob_objectkey'
  },
];
