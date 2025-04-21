import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MyRoomsState } from './my-rooms.state';

/**
 * NgRx Selector Memoization Explained:
 * 
 * Selectors always re-compute when their input state references change.
 * However, observables created with store.select() only emit when the
 * REFERENCE of the returned value changes, not just its content.
 * 
 * This two-step process is what makes NgRx efficient:
 * 1. Computation happens on state changes
 * 2. UI updates only happen when necessary
 */

/**
 * Feature selector that extracts the 'my-rooms' slice from the global store.
 * This will return a new reference whenever ANY property in this slice changes.
 */
export const selectMyRoomsState = createFeatureSelector<MyRoomsState>('my-rooms');

/**
 * Basic property selectors
 * 
 * These selectors execute whenever the state reference changes (after any reducer runs),
 * but their corresponding observables only emit when the specific array/property 
 * they return gets a new reference.
 * 
 * For example:
 * - If only state.saved changes, selectJoinedRooms will execute but won't cause emissions
 * - If state.joined changes, selectJoinedRooms will execute AND cause observable emissions
 * 
 * This is why immutable state updates are crucial:
 * - We create new references for properties we change (e.g., [...state.joined, newRoom])
 * - We preserve references for properties we don't change (spread operator keeps them)
 * - This reference tracking is how NgRx knows when to trigger UI updates
 */
export const selectJoinedRooms = createSelector(
    selectMyRoomsState,
  (state) => state.joined // Returns reference to joined array
);  

export const selectSavedRooms = createSelector(
    selectMyRoomsState,
  (state) => state.saved // Returns reference to saved array
); 

export const selectCompletedRooms = createSelector(
    selectMyRoomsState,
  (state) => state.completed // Returns reference to completed array
);

export const selectActiveFilter = createSelector(
    selectMyRoomsState,
    (state) => state.activeFilter // Returns primitive value, emissions based on equality
);

export const myRoomsloadingState = createSelector(
    selectMyRoomsState,
    (state) => state.isLoading // Returns primitive boolean, emissions based on equality
)

/**
 * Advanced selector with dynamic reference selection
 * 
 * This selector demonstrates NgRx's memoization power:
 * 
 * 1. It re-executes on every state change in the 'my-rooms' slice
 * 2. It returns one of three different array references based on activeFilter
 * 3. Observables will only emit when:
 *    - activeFilter changes (pointing to a different array)
 *    - The specific array being pointed to gets a new reference
 * 
 * Performance benefit: When on the 'joined' tab, changes to 'saved' or 'completed'
 * arrays won't trigger component re-renders, even though the selector executes.
 * 
 * Example:
 * - If activeFilter='joined' and only state.saved changes, this selector
 *   still returns the same state.joined reference → no observable emission
 * - If activeFilter='joined' and state.joined changes, this returns a new
 *   reference → observable emits → component updates
 */
export const selectFilteredRooms = createSelector(
    selectMyRoomsState,
    (state) => {
      switch(state.activeFilter) {
        case 'joined': return state.joined;
        case 'saved': return state.saved;
        case 'completed': return state.completed;
        default: return state.joined;
      }
    }
  );