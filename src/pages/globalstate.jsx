import { createGlobalState } from 'react-hooks-global-state';

const {setGlobalState, useGlobalState} = createGlobalState({
    island_name: 'Pacific'
});
export {useGlobalState, setGlobalState};