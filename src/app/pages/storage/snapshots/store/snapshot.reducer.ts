import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { ZfsSnapshot } from 'app/interfaces/zfs-snapshot.interface';
import { dismissAlertPressed } from 'app/modules/alerts/store/alert.actions';
import {
  loadSnapshots, snapshotAdded, snapshotChanged, snapshotRemoved, snapshotsLoaded, snapshotsNotLoaded,
} from 'app/pages/storage/snapshots/store/snapshot.actions';

export interface SnapshotsState extends EntityState<ZfsSnapshot> {
  isLoading: boolean;
  error: string;
}

export const adapter = createEntityAdapter<ZfsSnapshot>({
  selectId: (snapshot) => snapshot.name,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const snapshotsInitialState = adapter.getInitialState({
  isLoading: false,
  error: null,
});

export const snapshotReducer = createReducer(
  snapshotsInitialState,

  on(loadSnapshots, (state) => ({ ...state, isLoading: true, error: null })),
  on(snapshotsLoaded, (state, { snapshots }) => adapter.setAll(snapshots, { ...state, isLoading: false })),
  on(snapshotsNotLoaded, (state, { error }) => ({ ...state, error, isLoading: true })),

  on(snapshotAdded, (state, { snapshot }) => adapter.addOne(snapshot, state)),
  on(snapshotChanged, (state, { snapshot }) => adapter.updateOne({
    id: snapshot.name,
    changes: snapshot,
  }, state)),
  on(snapshotRemoved, (state, { id }) => adapter.removeOne(id, state)),

  on(dismissAlertPressed, (state, { id }) => adapter.updateOne({
    id,
    changes: {},
  }, state)),
);
